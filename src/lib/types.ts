export type Unit = "per_person" | "per_tray" | "per_dozen" | "per_bag" | "per_gallon";

export const UNIT_LABEL: Record<Unit, string> = {
  per_person: "per person",
  per_tray: "per tray · serves 10",
  per_dozen: "per dozen",
  per_bag: "per bag",
  per_gallon: "per gallon",
};

export type FulfillmentType = "pickup" | "delivery";

export type OrderStatus =
  | "requested"
  | "shopping"
  | "prepping"
  | "ready"
  | "out"
  | "completed"
  | "cancelled";

/** The linear kitchen pipeline. "cancelled" is a side-branch, not a stage in this sequence — it's reached by cancelling from any stage, not by advancing. */
export const STAGES: { key: OrderStatus; label: string; description: string }[] = [
  { key: "requested", label: "Requested", description: "New order in, awaiting review" },
  { key: "shopping", label: "Shopping", description: "Ingredients being gathered" },
  { key: "prepping", label: "Prepping", description: "In the kitchen, being cooked" },
  { key: "ready", label: "Ready", description: "Cooked, packed, waiting" },
  { key: "out", label: "Out / Pickup", description: "En route, or ready for the customer" },
  { key: "completed", label: "Completed", description: "Delivered or collected" },
];

export interface MenuCategory {
  id: string;
  name: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  unit: Unit;
  photoUrl?: string;
  available: boolean;
}

export interface OrderLineItem {
  menuItemId: string;
  name: string;
  unit: Unit;
  price: number;
  qty: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  changedAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  fulfillment: FulfillmentType;
  deliveryAddress?: string;
  items: OrderLineItem[];
  notes?: string;
  status: OrderStatus;
  /** The stage this order was at right before being cancelled — lets "reinstate" put it back where it left off. */
  previousStatus?: OrderStatus;
  /** Reserved for the online-payment phase; v1 is always Venmo, arranged after confirmation. */
  paymentStatus: "arranged_via_venmo";
  createdAt: string;
  statusHistory: StatusHistoryEntry[];
}

export interface Settings {
  businessName: string;
  venmoHandle: string;
  businessPhone: string;
  notificationEmail: string;
  guestThreshold: number;
}

export interface Db {
  settings: Settings;
  categories: MenuCategory[];
}
