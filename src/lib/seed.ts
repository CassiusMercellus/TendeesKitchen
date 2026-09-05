import type { Db, MenuCategory } from "./types";

const categories: MenuCategory[] = [
  { id: "rice", name: "Rice & Swallow", sortOrder: 1 },
  { id: "soups", name: "Soups", sortOrder: 2 },
  { id: "proteins", name: "Proteins", sortOrder: 3 },
  { id: "small-chops", name: "Small Chops", sortOrder: 4 },
  { id: "sides", name: "Sides & Drinks", sortOrder: 5 },
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
  };
}
