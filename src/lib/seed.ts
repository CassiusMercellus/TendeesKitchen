import type { Db, MenuCategory, MenuItem, Order } from "./types";

const categories: MenuCategory[] = [
  { id: "rice", name: "Rice & Swallow", sortOrder: 1 },
  { id: "soups", name: "Soups", sortOrder: 2 },
  { id: "proteins", name: "Proteins", sortOrder: 3 },
  { id: "small-chops", name: "Small Chops", sortOrder: 4 },
  { id: "sides", name: "Sides & Drinks", sortOrder: 5 },
];

const items: MenuItem[] = [
  { id: "jollof", categoryId: "rice", name: "Jollof Rice", description: "Smoky party-style jollof, slow-cooked in pepper sauce.", price: 65, unit: "per_tray", available: true },
  { id: "fried-rice", categoryId: "rice", name: "Fried Rice", description: "Rice with mixed vegetables, liver, and shrimp.", price: 65, unit: "per_tray", available: true },
  { id: "pounded-yam", categoryId: "rice", name: "Pounded Yam & Egusi", description: "Fresh pounded yam served with egusi soup.", price: 70, unit: "per_tray", available: true },
  { id: "egusi", categoryId: "soups", name: "Egusi Soup", description: "Ground melon seed soup with spinach and assorted meat.", price: 85, unit: "per_tray", available: true },
  { id: "ogbono", categoryId: "soups", name: "Ogbono Soup", description: "Draw soup with stockfish and goat meat.", price: 80, unit: "per_tray", available: true },
  { id: "suya", categoryId: "proteins", name: "Suya Skewers", description: "Spiced grilled beef skewers with yaji.", price: 48, unit: "per_dozen", available: true },
  { id: "peppered-chicken", categoryId: "proteins", name: "Peppered Chicken", description: "Fried chicken tossed in pepper sauce and onions.", price: 75, unit: "per_tray", available: true },
  { id: "grilled-goat", categoryId: "proteins", name: "Grilled Goat", description: "Slow-grilled goat meat, pepper-rubbed.", price: 95, unit: "per_tray", available: true },
  { id: "puff-puff", categoryId: "small-chops", name: "Puff Puff", description: "Classic fried dough bites, lightly sweetened.", price: 18, unit: "per_dozen", available: true },
  { id: "chin-chin", categoryId: "small-chops", name: "Chin Chin", description: "Crunchy fried pastry snack.", price: 15, unit: "per_bag", available: true },
  { id: "spring-rolls", categoryId: "small-chops", name: "Spring Rolls", description: "Vegetable-filled crisp rolls.", price: 22, unit: "per_dozen", available: true },
  { id: "moi-moi", categoryId: "sides", name: "Moi Moi", description: "Steamed bean pudding with egg and fish.", price: 6, unit: "per_person", available: true },
  { id: "dodo", categoryId: "sides", name: "Fried Plantain (Dodo)", description: "Sweet ripe plantain, pan-fried.", price: 5, unit: "per_person", available: true },
  { id: "zobo", categoryId: "sides", name: "Zobo Drink", description: "Hibiscus drink with ginger and pineapple.", price: 20, unit: "per_gallon", available: true },
];

const now = new Date();
function daysFromNow(days: number, hour: number, minute = 0) {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const orders: Order[] = [
  {
    id: "order-funmi",
    customerName: "Funmi Bello",
    customerPhone: "(301) 555-0132",
    customerEmail: "funmi.bello@email.com",
    eventDate: daysFromNow(2, 12),
    eventTime: "12:00 PM",
    guestCount: 22,
    fulfillment: "delivery",
    deliveryAddress: "214 Cedar Ridge Rd, Silver Spring, MD",
    items: [
      { menuItemId: "jollof", name: "Jollof Rice", unit: "per_tray", price: 65, qty: 2 },
      { menuItemId: "peppered-chicken", name: "Peppered Chicken", unit: "per_tray", price: 75, qty: 1 },
      { menuItemId: "moi-moi", name: "Moi Moi", unit: "per_person", price: 6, qty: 22 },
    ],
    notes: "Please deliver to the side entrance.",
    status: "out",
    paymentStatus: "arranged_via_venmo",
    createdAt: daysFromNow(-4, 9),
    statusHistory: [
      { status: "requested", changedAt: daysFromNow(-4, 9) },
      { status: "shopping", changedAt: daysFromNow(-2, 8) },
      { status: "prepping", changedAt: daysFromNow(-1, 10) },
      { status: "ready", changedAt: daysFromNow(0, 10, 30) },
      { status: "out", changedAt: daysFromNow(0, 11) },
    ],
  },
  {
    id: "order-emeka",
    customerName: "Emeka Obi",
    customerPhone: "(240) 555-0110",
    customerEmail: "emeka.obi@email.com",
    eventDate: daysFromNow(3, 15),
    eventTime: "3:00 PM",
    guestCount: 30,
    fulfillment: "pickup",
    items: [
      { menuItemId: "fried-rice", name: "Fried Rice", unit: "per_tray", price: 65, qty: 3 },
      { menuItemId: "suya", name: "Suya Skewers", unit: "per_dozen", price: 48, qty: 3 },
      { menuItemId: "dodo", name: "Fried Plantain (Dodo)", unit: "per_person", price: 5, qty: 30 },
    ],
    status: "ready",
    paymentStatus: "arranged_via_venmo",
    createdAt: daysFromNow(-3, 14),
    statusHistory: [
      { status: "requested", changedAt: daysFromNow(-3, 14) },
      { status: "shopping", changedAt: daysFromNow(-1, 9) },
      { status: "prepping", changedAt: daysFromNow(0, 8) },
      { status: "ready", changedAt: daysFromNow(0, 13) },
    ],
  },
  {
    id: "order-grace",
    customerName: "Grace Adebayo",
    customerPhone: "(301) 555-0199",
    customerEmail: "grace.adebayo@email.com",
    eventDate: daysFromNow(3, 18),
    eventTime: "6:00 PM",
    guestCount: 10,
    fulfillment: "delivery",
    deliveryAddress: "88 Birchwood Ln, Silver Spring, MD",
    items: [
      { menuItemId: "egusi", name: "Egusi Soup", unit: "per_tray", price: 85, qty: 1 },
      { menuItemId: "pounded-yam", name: "Pounded Yam & Egusi", unit: "per_tray", price: 70, qty: 1 },
      { menuItemId: "moi-moi", name: "Moi Moi", unit: "per_person", price: 6, qty: 10 },
    ],
    status: "prepping",
    paymentStatus: "arranged_via_venmo",
    createdAt: daysFromNow(-2, 11),
    statusHistory: [
      { status: "requested", changedAt: daysFromNow(-2, 11) },
      { status: "shopping", changedAt: daysFromNow(-1, 9) },
      { status: "prepping", changedAt: daysFromNow(0, 9) },
    ],
  },
  {
    id: "order-chidi",
    customerName: "Chidi Nwosu",
    customerPhone: "(301) 555-0177",
    customerEmail: "chidi.nwosu@email.com",
    eventDate: daysFromNow(6, 11),
    eventTime: "11:00 AM",
    guestCount: 55,
    fulfillment: "pickup",
    items: [
      { menuItemId: "jollof", name: "Jollof Rice", unit: "per_tray", price: 65, qty: 5 },
      { menuItemId: "grilled-goat", name: "Grilled Goat", unit: "per_tray", price: 95, qty: 3 },
      { menuItemId: "puff-puff", name: "Puff Puff", unit: "per_dozen", price: 18, qty: 6 },
    ],
    notes: "Custom menu agreed by phone on Sept 30 — large event.",
    status: "shopping",
    paymentStatus: "arranged_via_venmo",
    createdAt: daysFromNow(-1, 16),
    statusHistory: [
      { status: "requested", changedAt: daysFromNow(-1, 16) },
      { status: "shopping", changedAt: daysFromNow(0, 9) },
    ],
  },
  {
    id: "order-ada",
    customerName: "Ada Okonkwo",
    customerPhone: "(301) 555-0148",
    customerEmail: "ada.o@email.com",
    eventDate: daysFromNow(12, 13),
    eventTime: "1:00 PM",
    guestCount: 18,
    fulfillment: "delivery",
    deliveryAddress: "412 Maple Grove Ct, Silver Spring, MD",
    items: [
      { menuItemId: "jollof", name: "Jollof Rice", unit: "per_tray", price: 65, qty: 2 },
      { menuItemId: "egusi", name: "Egusi Soup", unit: "per_tray", price: 85, qty: 1 },
      { menuItemId: "suya", name: "Suya Skewers", unit: "per_dozen", price: 48, qty: 2 },
      { menuItemId: "moi-moi", name: "Moi Moi", unit: "per_person", price: 6, qty: 18 },
      { menuItemId: "puff-puff", name: "Puff Puff", unit: "per_dozen", price: 18, qty: 3 },
    ],
    notes: "Please make the jollof extra spicy. No pork.",
    status: "requested",
    paymentStatus: "arranged_via_venmo",
    createdAt: daysFromNow(0, 7, 45),
    statusHistory: [{ status: "requested", changedAt: daysFromNow(0, 7, 45) }],
  },
  {
    id: "order-tunde",
    customerName: "Tunde Balogun",
    customerPhone: "(301) 555-0121",
    customerEmail: "tunde.b@email.com",
    eventDate: daysFromNow(-5, 14),
    eventTime: "2:00 PM",
    guestCount: 15,
    fulfillment: "pickup",
    items: [
      { menuItemId: "fried-rice", name: "Fried Rice", unit: "per_tray", price: 65, qty: 2 },
      { menuItemId: "chin-chin", name: "Chin Chin", unit: "per_bag", price: 15, qty: 4 },
    ],
    status: "completed",
    paymentStatus: "arranged_via_venmo",
    createdAt: daysFromNow(-9, 10),
    statusHistory: [
      { status: "requested", changedAt: daysFromNow(-9, 10) },
      { status: "shopping", changedAt: daysFromNow(-7, 9) },
      { status: "prepping", changedAt: daysFromNow(-5, 9) },
      { status: "ready", changedAt: daysFromNow(-5, 12) },
      { status: "out", changedAt: daysFromNow(-5, 13) },
      { status: "completed", changedAt: daysFromNow(-5, 14, 15) },
    ],
  },
];

export function seedDb(): Db {
  return {
    settings: {
      businessName: "Tendee's Kitchen",
      venmoHandle: "@Tendees-Kitchen",
      businessPhone: "(301) 555-0100",
      guestThreshold: 40,
    },
    categories,
    items,
    orders,
  };
}
