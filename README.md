# Tendee's Order Desk

The ordering site and kitchen admin panel for Tendee's Kitchen. See the design doc and mockups in the parent folder for the full spec.

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the customer site, or [http://localhost:3000/admin/orders](http://localhost:3000/admin/orders) for the kitchen admin panel.

## What's real vs. placeholder right now

This is a fully working app — the guest-count threshold, the kitchen status pipeline, menu editing, and order submission all actually work — but it's running on placeholder infrastructure until real accounts are wired up:

- **Data storage**: a local JSON file at `data/db.json` (auto-created from `src/lib/seed.ts` on first run, gitignored) stands in for Firestore. Everything reads and writes through `src/lib/store.ts`, so swapping in real Firestore later means rewriting that one file — no page changes needed.
- **Menu photos**: the "Add item" form takes a photo *URL* rather than a real upload, until Firebase Storage is wired up.
- **Notifications**: no email or SMS actually sends yet — a new order only shows up in the admin dashboard.
- **Admin login**: `/admin` isn't gated behind a password yet — anyone with the link can reach it. Firebase Auth needs to go in before this goes live.
- **Payment**: intentionally placeholder-free — v1 always says "we'll send a Venmo request," matching how the business runs today.

If you ever want to start over with fresh sample data, delete `data/db.json` — it regenerates from the seed on the next request.

## Where things live

- `src/lib/types.ts` — the data shapes (menu items, orders, statuses), mirroring the Firestore schema in the design doc.
- `src/lib/store.ts` — all reads/writes. This is the file to replace when Firestore is ready.
- `src/lib/actions.ts` — Server Actions (create order, advance status, toggle availability, add menu item).
- `src/app/` — customer pages at the root, admin pages under `/admin`.
