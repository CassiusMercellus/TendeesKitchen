import { getCategories, getMenuItems } from "@/lib/store";
import { toggleMenuItemAvailabilityAction, addMenuItemAction } from "@/lib/actions";
import { formatMoney } from "@/lib/format";
import { UNIT_LABEL } from "@/lib/types";
import type { Unit } from "@/lib/types";

const UNIT_OPTIONS: Unit[] = ["per_tray", "per_dozen", "per_person", "per_bag", "per_gallon"];

function UtensilsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2v20M6 2c-1.5 0-2.5 1-2.5 2.5S4.5 7 6 7s2.5-1 2.5-2.5S7.5 2 6 2z" />
      <path d="M18 2c-2 0-3 2-3 5s1 6 3 6 3-3 3-6-1-5-3-5zM18 13v9" />
    </svg>
  );
}

export default function AdminMenuPage() {
  const categories = getCategories();
  const items = getMenuItems();

  return (
    <div>
      <div className="flex items-center justify-between px-5 pt-4 pb-1 md:px-8">
        <h2 className="text-xl font-semibold">Menu</h2>
      </div>

      <div className="px-5 pt-3 md:px-8">
        <details className="group max-w-md rounded-xl bg-indigo-tint open:pb-1">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 px-4 py-3 text-[13px] font-semibold text-indigo">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="transition-transform group-open:rotate-45">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add item
          </summary>
          <form action={addMenuItemAction} className="px-4 pb-4">
            <div className="mb-2.5">
              <label className="mb-1 block text-[11px] text-ink-faint">Item name</label>
              <input name="name" type="text" required className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[13px]" />
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
                <select name="unit" required className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[13px]">
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
              <input name="price" type="number" min="1" step="1" required className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[13px]" />
            </div>
            <div className="mb-2.5">
              <label className="mb-1 block text-[11px] text-ink-faint">Description</label>
              <input name="description" type="text" className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[13px]" />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-[11px] text-ink-faint">Photo URL (optional, for now)</label>
              <input name="photoUrl" type="url" placeholder="Real photo upload arrives with Firebase Storage" className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[13px] placeholder:text-ink-faint/70" />
            </div>
            <button type="submit" className="w-full rounded-lg bg-indigo py-2.5 text-[13.5px] font-semibold text-white">
              Save item
            </button>
          </form>
        </details>
      </div>

      {categories.map((cat) => {
        const catItems = items.filter((i) => i.categoryId === cat.id);
        if (catItems.length === 0) return null;
        return (
          <div key={cat.id}>
            <div className="px-5 pt-5 pb-2 font-mono text-[11px] tracking-wide text-ink-faint uppercase md:px-8">{cat.name}</div>
            <div className="grid grid-cols-1 gap-2.5 px-5 md:grid-cols-2 md:px-8 xl:grid-cols-3">
              {catItems.map((item) => {
                const toggleThisItem = toggleMenuItemAvailabilityAction.bind(null, item.id);
                return (
                  <div key={item.id} className={`flex items-center gap-3 rounded-lg border border-line bg-surface p-3 ${!item.available ? "opacity-50" : ""}`}>
                    <div className="flex h-13 w-13 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-gold-tint to-indigo-tint text-indigo/55">
                      <UtensilsIcon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-semibold">{item.name}</h3>
                      <div className="font-mono text-xs text-ink-faint">
                        {formatMoney(item.price)} · {UNIT_LABEL[item.unit]}
                      </div>
                      {!item.available && <div className="mt-0.5 text-[11px] font-semibold text-pepper">Sold out</div>}
                    </div>
                    <form action={toggleThisItem}>
                      <button
                        type="submit"
                        aria-label={item.available ? `Mark ${item.name} sold out` : `Mark ${item.name} available`}
                        className={`relative h-6 w-10 flex-none rounded-full ${item.available ? "bg-indigo" : "bg-line-strong"}`}
                      >
                        <span
                          className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all ${
                            item.available ? "left-[19px]" : "left-[3px]"
                          }`}
                        />
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="pb-10" />
    </div>
  );
}
