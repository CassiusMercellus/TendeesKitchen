"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Unit } from "@/lib/types";

export interface CartLine {
  menuItemId: string;
  name: string;
  unit: Unit;
  price: number;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  qtyFor: (menuItemId: string) => number;
  setQty: (item: { menuItemId: string; name: string; unit: Unit; price: number }, qty: number) => void;
  totalCount: number;
  totalPrice: number;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "tendees-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage after mount, not a render-loop sync
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage unavailable — cart just won't survive a reload
    }
  }, [lines, hydrated]);

  const setQty = useCallback(
    (item: { menuItemId: string; name: string; unit: Unit; price: number }, qty: number) => {
      setLines((prev) => {
        const clamped = Math.max(0, qty);
        const existing = prev.find((l) => l.menuItemId === item.menuItemId);
        if (clamped === 0) {
          return prev.filter((l) => l.menuItemId !== item.menuItemId);
        }
        if (existing) {
          return prev.map((l) => (l.menuItemId === item.menuItemId ? { ...l, qty: clamped } : l));
        }
        return [...prev, { ...item, qty: clamped }];
      });
    },
    []
  );

  const qtyFor = useCallback((menuItemId: string) => lines.find((l) => l.menuItemId === menuItemId)?.qty ?? 0, [lines]);

  const clear = useCallback(() => setLines([]), []);

  const totalCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const totalPrice = lines.reduce((sum, l) => sum + l.qty * l.price, 0);

  return (
    <CartContext.Provider value={{ lines, qtyFor, setQty, totalCount, totalPrice, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
