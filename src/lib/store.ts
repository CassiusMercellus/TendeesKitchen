import "server-only";
import { adminDb } from "./firebase-admin";
import { STAGES } from "./types";
import type {
  MenuCategory,
  MenuItem,
  Order,
  OrderLineItem,
  OrderStatus,
  FulfillmentType,
  Settings,
} from "./types";

const SETTINGS_DOC_ID = "global";

// ---- settings ----

export async function getSettings(): Promise<Settings> {
  const snap = await adminDb.collection("settings").doc(SETTINGS_DOC_ID).get();
  if (!snap.exists) {
    throw new Error("Settings document is missing — run the Firestore seed script.");
  }
  return snap.data() as Settings;
}

// ---- menu ----

export async function getCategories(): Promise<MenuCategory[]> {
  const snap = await adminDb.collection("menuCategories").orderBy("sortOrder").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MenuCategory);
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const snap = await adminDb.collection("menuItems").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MenuItem);
}

export async function getAvailableMenuItems(): Promise<MenuItem[]> {
  const snap = await adminDb.collection("menuItems").where("available", "==", true).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MenuItem);
}

export async function toggleMenuItemAvailability(itemId: string) {
  const ref = adminDb.collection("menuItems").doc(itemId);
  const snap = await ref.get();
  if (!snap.exists) return;
  const current = snap.data() as MenuItem;
  await ref.update({ available: !current.available });
}

export async function addMenuItem(input: {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  unit: MenuItem["unit"];
  photoUrl?: string;
}): Promise<MenuItem> {
  const ref = adminDb.collection("menuItems").doc();
  const data = {
    categoryId: input.categoryId,
    name: input.name,
    description: input.description,
    price: input.price,
    unit: input.unit,
    photoUrl: input.photoUrl,
    available: true,
  };
  await ref.set(data);
  return { id: ref.id, ...data };
}

// ---- orders ----

export async function getOrders(): Promise<Order[]> {
  const snap = await adminDb.collection("orders").get();
  const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
  const active = orders
    .filter((o) => o.status !== "completed")
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  const completed = orders
    .filter((o) => o.status === "completed")
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  return [...active, ...completed];
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const snap = await adminDb.collection("orders").doc(id).get();
  if (!snap.exists) return undefined;
  return { id: snap.id, ...snap.data() } as Order;
}

export async function createOrder(input: {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  fulfillment: FulfillmentType;
  deliveryAddress?: string;
  notes?: string;
  items: OrderLineItem[];
}): Promise<Order> {
  const ref = adminDb.collection("orders").doc();
  const now = new Date().toISOString();
  const data = {
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    eventDate: input.eventDate,
    eventTime: input.eventTime,
    guestCount: input.guestCount,
    fulfillment: input.fulfillment,
    deliveryAddress: input.deliveryAddress,
    items: input.items,
    notes: input.notes,
    status: "requested" as const,
    paymentStatus: "arranged_via_venmo" as const,
    createdAt: now,
    statusHistory: [{ status: "requested" as const, changedAt: now }],
  };
  await ref.set(data);
  return { id: ref.id, ...data };
}

export async function advanceOrderStatus(id: string): Promise<Order | undefined> {
  const ref = adminDb.collection("orders").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return undefined;
  const order = { id: snap.id, ...snap.data() } as Order;

  const currentIndex = STAGES.findIndex((s) => s.key === order.status);
  if (currentIndex === -1 || currentIndex >= STAGES.length - 1) return order;

  const nextStatus: OrderStatus = STAGES[currentIndex + 1].key;
  const changedAt = new Date().toISOString();
  const statusHistory = [...order.statusHistory, { status: nextStatus, changedAt }];

  await ref.update({ status: nextStatus, statusHistory });
  return { ...order, status: nextStatus, statusHistory };
}
