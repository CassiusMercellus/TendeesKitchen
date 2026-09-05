import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

// Lazy on purpose: Next.js evaluates route/layout modules during its build-time
// "collect page data" step, before any real request and before env vars are
// necessarily available. Credentials should only be required when something
// actually touches Firestore/Auth at request time, not at module load.

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length) return existing[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

let firestoreInstance: Firestore | undefined;
let authInstance: Auth | undefined;

function getAdminDb(): Firestore {
  if (!firestoreInstance) firestoreInstance = getFirestore(getAdminApp());
  return firestoreInstance;
}

function getAdminAuth(): Auth {
  if (!authInstance) authInstance = getAuth(getAdminApp());
  return authInstance;
}

/** Forwards every property access to the real instance, created on first use. */
function lazyProxy<T extends object>(resolve: () => T): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      const instance = resolve();
      const value = Reflect.get(instance as object, prop, instance);
      return typeof value === "function" ? value.bind(instance) : value;
    },
  });
}

export const adminDb = lazyProxy(getAdminDb);
export const adminAuth = lazyProxy(getAdminAuth);
