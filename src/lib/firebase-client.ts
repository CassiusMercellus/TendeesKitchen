"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy on purpose: Next.js still renders "use client" pages once during
// build-time static generation, and initializeApp()/getAuth() throw
// immediately if the NEXT_PUBLIC_* vars are missing or malformed at that
// point. Deferring until a component actually calls this keeps a Firebase
// config problem from failing the entire production build.

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export function getClientAuth(): Auth {
  if (!auth) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
  return auth;
}
