# Tendee's Order Desk

The ordering site and kitchen admin panel for Tendee's Kitchen. See the design doc and mockups in the parent folder for the full spec.

## Running it

```bash
npm install
cp .env.local.example .env.local   # then fill in the Firebase values, see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the customer site, or [http://localhost:3000/admin/orders](http://localhost:3000/admin/orders) for the kitchen admin panel (redirects to a login).

### Firebase setup

This app runs on a real Firebase project (Firestore + Auth):

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com), enable **Firestore Database** and **Authentication** (Email/Password provider), and add an admin user under Authentication → Users.
2. Project settings → **Service accounts** → Generate new private key. Save the downloaded file as `web/firebase-service-account.json` (gitignored, never commit it).
3. Project settings → **General** → Your apps → add a web app, and copy its config values.
4. Fill in `.env.local` (copied from `.env.local.example`): the three `FIREBASE_*` vars come from the service account JSON, the `NEXT_PUBLIC_FIREBASE_*` vars from the web app config.
5. Populate the database with the sample menu/orders: `npm run seed`.

Firebase Storage is intentionally **not** used (new Storage buckets now require the paid Blaze plan) — see "What's real vs. placeholder" below for the photo-upload workaround.

## What's real vs. placeholder right now

This is a fully working app on a real backend — Firestore for data, Firebase Auth gating `/admin` — but a couple of things are still placeholder:

- **Menu photos**: the "Add item" form takes a photo *URL* rather than a real upload (avoids requiring Firebase Storage's Blaze/billing plan). The owner hosts a photo elsewhere (Imgur, etc.) and pastes the direct link in.
- **Notifications**: no email or SMS actually sends yet — a new order only shows up in the admin dashboard.
- **Payment**: intentionally placeholder-free — v1 always says "we'll send a Venmo request," matching how the business runs today.

If you ever want to reset back to the sample data, re-run `npm run seed` — it overwrites the seeded documents (real orders placed since then aren't touched unless they share a seed doc ID).

## Where things live

- `src/lib/types.ts` — the data shapes (menu items, orders, statuses), mirroring the Firestore schema in the design doc.
- `src/lib/store.ts` — all Firestore reads/writes.
- `src/lib/firebase-admin.ts` / `src/lib/firebase-client.ts` — server-side (Admin SDK) and browser-side (Auth sign-in) Firebase init.
- `src/lib/actions.ts` — Server Actions (create order, advance status, toggle availability, add menu item).
- `src/app/` — customer pages at the root, admin pages under `/admin` (gated by `src/app/admin/(protected)/layout.tsx`; the login page lives outside that group at `/admin/login`).
- `scripts/seed-firestore.ts` — writes the sample menu/orders/settings into Firestore (`npm run seed`).
