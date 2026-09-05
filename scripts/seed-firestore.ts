/**
 * One-time / re-runnable script that writes default settings and the menu
 * categories into the real Firestore project. Does not write menu items or
 * orders — both are real content now, entered through the app itself, and
 * re-seeding must never silently reintroduce placeholder ones. Run with:
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
  const { settings, categories } = seedDb();

  await adminDb.collection("settings").doc("global").set(settings);
  console.log("wrote settings");

  for (const category of categories) {
    const { id, ...data } = category;
    await adminDb.collection("menuCategories").doc(id).set(data);
  }
  console.log(`wrote ${categories.length} menu categories`);

  console.log("done");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
