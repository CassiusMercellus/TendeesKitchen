"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { MenuPhoto } from "@/components/menu-photo";
import { formatMoney } from "@/lib/format";
import { UNIT_LABEL } from "@/lib/types";
import type { MenuCategory, MenuItem } from "@/lib/types";

export function MenuBrowser({ categories, items }: { categories: MenuCategory[]; items: MenuItem[] }) {
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const { qtyFor, setQty, totalCount, totalPrice } = useCart();

  const visible = items.filter((i) => i.categoryId === active);

  function cartRef(item: MenuItem) {
    return { menuItemId: item.id, name: item.name, unit: item.unit, price: item.price };
  }

  return (
    <div className="mx-auto max-w-6xl md:grid md:grid-cols-[1fr_300px] md:items-start md:gap-10 md:px-8 md:py-8">
      <div>
        <div className="sticky top-[78px] z-10 flex gap-2 overflow-x-auto border-b border-line bg-bg px-4 py-3 md:static md:flex-wrap md:border-none md:px-0 md:pt-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`flex-none rounded-full border px-3.5 py-2 text-sm font-medium whitespace-nowrap ${
                active === cat.id
                  ? "border-indigo bg-indigo text-white"
                  : "border-line bg-surface text-ink-soft"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="px-4 py-16 text-center text-[13.5px] text-ink-faint md:px-0">
            Nothing in this category yet — check back soon.
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 p-4 pb-28 sm:grid-cols-2 md:p-0 md:pt-6 md:pb-4 lg:grid-cols-3">
          {visible.map((item) => {
            const qty = qtyFor(item.id);
            return (
              <div key={item.id} className="flex gap-3 rounded-xl border border-line bg-surface p-3">
                <div className="h-16 w-16 flex-none overflow-hidden rounded-lg">
                  <MenuPhoto src={item.photoUrl} alt={item.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-semibold">{item.name}</h3>
                  <p className="text-[12.5px] leading-snug text-ink-soft">{item.description}</p>
                  <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    <div className="whitespace-nowrap">
                      <div className="text-[13px] font-semibold">{formatMoney(item.price)}</div>
                      <div className="font-mono text-[11px] text-ink-faint">{UNIT_LABEL[item.unit]}</div>
                    </div>
                    <div className="flex flex-none items-center gap-2.5">
                      <button
                        onClick={() => setQty(cartRef(item), qty - 1)}
                        disabled={qty === 0}
                        className={`flex h-7 w-7 items-center justify-center rounded-md border ${
                          qty > 0 ? "border-indigo bg-indigo text-white" : "border-line-strong text-indigo"
                        } disabled:opacity-40`}
                        aria-label={`Remove one ${item.name}`}
                      >
                        −
                      </button>
                      <span className="w-3.5 text-center font-mono text-[13px]">{qty}</span>
                      <button
                        onClick={() => setQty(cartRef(item), qty + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-line-strong text-indigo"
                        aria-label={`Add one ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: sticky bottom dock */}
      {totalCount > 0 && (
        <div className="sticky bottom-0 bg-gradient-to-t from-bg from-60% to-transparent px-4 pt-4 pb-5 md:hidden">
          <Link
            href="/order"
            className="flex items-center justify-between rounded-xl bg-indigo px-4 py-3.5 text-[14.5px] font-semibold text-white"
          >
            <span>View order · {totalCount} items</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      )}

      {/* Desktop/tablet: sticky cart summary sidebar */}
      <div className="sticky top-[100px] hidden self-start rounded-xl border border-line bg-surface p-5 md:block">
        <div className="mb-1 font-mono text-[11px] tracking-wide text-ink-faint uppercase">Your order</div>
        {totalCount === 0 ? (
          <p className="text-[13.5px] text-ink-soft">Add a few dishes to get started.</p>
        ) : (
          <>
            <p className="text-[13.5px] text-ink-soft">
              {totalCount} item{totalCount === 1 ? "" : "s"} · {formatMoney(totalPrice)}
            </p>
            <Link
              href="/order"
              className="mt-4 flex items-center justify-center rounded-lg bg-indigo py-3 text-[13.5px] font-semibold text-white"
            >
              Review order
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
