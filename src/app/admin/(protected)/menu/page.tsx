import { getCategories, getMenuItems } from "@/lib/store";
import { toggleMenuItemAvailabilityAction } from "@/lib/actions";
import { AddItemForm } from "@/components/admin-add-item-form";
import { MenuPhoto } from "@/components/menu-photo";
import { formatMoney } from "@/lib/format";
import { UNIT_LABEL } from "@/lib/types";

export default async function AdminMenuPage() {
  const categories = await getCategories();
  const items = await getMenuItems();

  return (
    <div>
      <div className="flex items-center justify-between px-5 pt-4 pb-1 md:px-8">
        <h2 className="text-xl font-semibold">Menu</h2>
      </div>

      <div className="px-5 pt-3 md:px-8">
        <details className="group max-w-2xl rounded-xl bg-indigo-tint open:pb-1">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 px-4 py-3 text-[13px] font-semibold text-indigo">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="transition-transform group-open:rotate-45">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add item
          </summary>
          <AddItemForm categories={categories} />
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
                    <div className="h-13 w-13 flex-none overflow-hidden rounded-lg">
                      <MenuPhoto src={item.photoUrl} alt={item.name} />
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
