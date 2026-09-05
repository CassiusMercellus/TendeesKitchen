import "server-only";
import fs from "node:fs";
import path from "node:path";
import { seedDb } from "./seed";
import { STAGES } from "./types";
import type {
  Db,
  MenuCategory,
  MenuItem,
  Order,
  OrderLineItem,
  OrderStatus,
  FulfillmentType,
  Settings,
} from "./types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function readDb(): Db {
  if (!fs.existsSync(DB_PATH)) {
    const fresh = seedDb();
    writeDb(fresh);
    return fresh;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as Db;
}

function writeDb(db: Db) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// ---- settings ----

export function getSettings(): Settings {
  return readDb().settings;
}

// ---- menu ----

export function getCategories(): MenuCategory[] {
  return [...readDb().categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getMenuItems(): MenuItem[] {
  return readDb().items;
}

export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return readDb().items.filter((i) => i.categoryId === categoryId);
}

export function getAvailableMenuItems(): MenuItem[] {
  return readDb().items.filter((i) => i.available);
}

export function toggleMenuItemAvailability(itemId: string) {
  const db = readDb();
  const item = db.items.find((i) => i.id === itemId);
  if (!item) return;
  item.available = !item.available;
  writeDb(db);
}

export function addMenuItem(input: {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  unit: MenuItem["unit"];
  photoUrl?: string;
}) {
  const db = readDb();
  const item: MenuItem = {
    id: nextId("item"),
    categoryId: input.categoryId,
    name: input.name,
    description: input.description,
    price: input.price,
    unit: input.unit,
    photoUrl: input.photoUrl,
    available: true,
  };
  db.items.push(item);
  writeDb(db);
  return item;
}

// ---- orders ----

export function getOrders(): Order[] {
  const orders = readDb().orders;
  const active = orders
    .filter((o) => o.status !== "completed")
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  const completed = orders
    .filter((o) => o.status === "completed")
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  return [...active, ...completed];
}

export function getOrder(id: string): Order | undefined {
  return readDb().orders.find((o) => o.id === id);
}

export function createOrder(input: {
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
}): Order {
  const db = readDb();
  const now = new Date().toISOString();
  const order: Order = {
    id: nextId("order"),
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
    status: "requested",
    paymentStatus: "arranged_via_venmo",
    createdAt: now,
    statusHistory: [{ status: "requested", changedAt: now }],
  };
  db.orders.push(order);
  writeDb(db);
  return order;
}

export function advanceOrderStatus(id: string): Order | undefined {
  const db = readDb();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return undefined;
  const currentIndex = STAGES.findIndex((s) => s.key === order.status);
  if (currentIndex === -1 || currentIndex >= STAGES.length - 1) return order;
  const nextStatus: OrderStatus = STAGES[currentIndex + 1].key;
  order.status = nextStatus;
  order.statusHistory.push({ status: nextStatus, changedAt: new Date().toISOString() });
  writeDb(db);
  return order;
}
