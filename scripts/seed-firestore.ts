/**
 * One-time / re-runnable script that writes the sample menu, orders, and
 * settings into the real Firestore project. Run with:
 *   node --env-file=.env.local -r tsx/cjs scripts/seed-firestore.ts
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { seedDb } from "../src/lib/seed";

// Duplicated from src/lib/firebase-admin.ts (not reused) because that module
// imports "server-only", which errors outside Next.js's server bundler.
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  }),
});
const adminDb = getFirestore(app);

async function main() {
  const { settings, categories, items, orders } = seedDb();

  await adminDb.collection("settings").doc("global").set(settings);
  console.log("wrote settings");

  for (const category of categories) {
    const { id, ...data } = category;
    await adminDb.collection("menuCategories").doc(id).set(data);
  }
  console.log(`wrote ${categories.length} menu categories`);

  for (const item of items) {
    const { id, ...data } = item;
    await adminDb.collection("menuItems").doc(id).set(data);
  }
  console.log(`wrote ${items.length} menu items`);

  for (const order of orders) {
    const { id, ...data } = order;
    await adminDb.collection("orders").doc(id).set(data);
  }
  console.log(`wrote ${orders.length} sample orders`);

  console.log("done");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
