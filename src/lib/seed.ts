import type { Db, MenuCategory, MenuItem } from "./types";

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

export function seedDb(): Db {
  return {
    settings: {
      businessName: "Tendee's Kitchen",
      venmoHandle: "@Tendees-Kitchen",
      businessPhone: "(301) 555-0100",
      notificationEmail: "",
      guestThreshold: 40,
    },
    categories,
    items,
  };
}
