"use client";

import { useState } from "react";
import { addMenuItemAction } from "@/lib/actions";
import { MenuPhoto } from "@/components/menu-photo";
import { formatMoney } from "@/lib/format";
import { UNIT_LABEL } from "@/lib/types";
import type { MenuCategory, Unit } from "@/lib/types";

const UNIT_OPTIONS: Unit[] = ["per_tray", "per_dozen", "per_person", "per_bag", "per_gallon"];

export function AddItemForm({ categories }: { categories: MenuCategory[] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState<Unit>("per_tray");
  const [photoUrl, setPhotoUrl] = useState("");

  const priceNumber = Number(price);
  const priceLabel = price.trim() && Number.isFinite(priceNumber) ? formatMoney(priceNumber) : "$—";

  return (
    <div className="md:grid md:grid-cols-[1fr_260px] md:gap-6">
      <form action={addMenuItemAction} className="px-4 pb-4 md:px-0">
        <div className="mb-2.5">
          <label className="mb-1 block text-[11px] text-ink-faint">Item name</label>
          <input
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[13px]"
          />
        </div>
        <div className="mb-2.5 flex gap-2.5">
          <div className="flex-1">
            <label className="mb-1 block text-[11px] text-ink-faint">Category</label>
            <select name="categoryId" required className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[13px]">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[11px] text-ink-faint">Unit</label>
            <select
              name="unit"
              required
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[13px]"
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABEL[u]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-2.5">
          <label className="mb-1 block text-[11px] text-ink-faint">Price ($)</label>
          <input
            name="price"
            type="number"
            min="1"
            step="1"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[13px]"
          />
        </div>
        <div className="mb-2.5">
          <label className="mb-1 block text-[11px] text-ink-faint">Description</label>
          <input
            name="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[13px]"
          />
        </div>
        <div className="mb-3">
          <label className="mb-1 block text-[11px] text-ink-faint">Photo link</label>
          <input
            name="photoUrl"
            type="url"
            placeholder="Paste an image link (Imgur, etc.)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[13px] placeholder:text-ink-faint/70"
          />
        </div>
        <button type="submit" className="w-full rounded-lg bg-indigo py-2.5 text-[13.5px] font-semibold text-white">
          Save item
        </button>
      </form>

      <div className="px-4 pb-4 md:px-0">
        <div className="mb-2 font-mono text-[10.5px] tracking-wide text-ink-faint uppercase">How customers will see it</div>
        <div className="flex gap-3 rounded-xl border border-line bg-surface p-3">
          <div className="h-16 w-16 flex-none overflow-hidden rounded-lg">
            <MenuPhoto src={photoUrl.trim() || undefined} alt={name || "Menu item"} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold">{name || "Item name"}</h3>
            <p className="line-clamp-2 text-[12.5px] leading-snug text-ink-soft">{description || "Description goes here."}</p>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <div className="whitespace-nowrap">
                <div className="text-[13px] font-semibold">{priceLabel}</div>
                <div className="font-mono text-[11px] text-ink-faint">{UNIT_LABEL[unit]}</div>
              </div>
              <div className="flex flex-none items-center gap-2.5 opacity-50">
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line-strong text-indigo">−</span>
                <span className="w-3.5 text-center font-mono text-[13px]">0</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line-strong text-indigo">+</span>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11.5px] text-ink-faint">This is exactly how the card will look on the customer menu.</p>
      </div>
    </div>
  );
}
