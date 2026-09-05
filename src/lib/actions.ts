"use server";

import { revalidatePath } from "next/cache";
import * as store from "./store";
import type { FulfillmentType, OrderLineItem, Unit } from "./types";

export interface CreateOrderInput {
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
}

export async function createOrderAction(input: CreateOrderInput) {
  const settings = await store.getSettings();

  if (!input.customerName.trim() || !input.customerPhone.trim()) {
    throw new Error("Name and phone are required.");
  }
  if (!input.items.length) {
    throw new Error("Add at least one item before submitting an order.");
  }
  if (input.guestCount >= settings.guestThreshold) {
    throw new Error(
      `Events of ${settings.guestThreshold}+ guests need a custom menu — call or text instead of submitting online.`
    );
  }
  if (input.fulfillment === "delivery" && !input.deliveryAddress?.trim()) {
    throw new Error("A delivery address is required for delivery orders.");
  }

  const order = await store.createOrder(input);
  revalidatePath("/admin/orders");
  return { id: order.id };
}

export async function advanceOrderStatusAction(orderId: string) {
  await store.advanceOrderStatus(orderId);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function revertOrderStatusAction(orderId: string) {
  await store.revertOrderStatus(orderId);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function toggleMenuItemAvailabilityAction(itemId: string) {
  await store.toggleMenuItemAvailability(itemId);
  revalidatePath("/admin/menu");
  revalidatePath("/");
}

export async function addMenuItemAction(formData: FormData) {
  const categoryId = String(formData.get("categoryId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const unit = String(formData.get("unit") ?? "per_tray") as Unit;
  const photoUrl = String(formData.get("photoUrl") ?? "").trim() || undefined;

  if (!categoryId || !name || !Number.isFinite(price) || price <= 0) {
    throw new Error("Item name, category, and a valid price are required.");
  }

  await store.addMenuItem({ categoryId, name, description, price, unit, photoUrl });
  revalidatePath("/admin/menu");
  revalidatePath("/");
}

export async function updateSettingsAction(formData: FormData) {
  const businessName = String(formData.get("businessName") ?? "").trim();
  const businessPhone = String(formData.get("businessPhone") ?? "").trim();
  const notificationEmail = String(formData.get("notificationEmail") ?? "").trim();
  const venmoHandle = String(formData.get("venmoHandle") ?? "").trim();
  const guestThreshold = Number(formData.get("guestThreshold"));

  if (!businessName || !businessPhone) {
    throw new Error("Business name and phone are required.");
  }
  if (!Number.isFinite(guestThreshold) || guestThreshold < 1) {
    throw new Error("Guest threshold must be a positive number.");
  }

  await store.updateSettings({ businessName, businessPhone, notificationEmail, venmoHandle, guestThreshold });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/order");
}
