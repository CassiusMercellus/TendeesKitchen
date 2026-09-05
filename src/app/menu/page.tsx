import { SiteHeader } from "@/components/site-header";
import { MenuBrowser } from "@/components/menu-browser";
import { getCategories, getAvailableMenuItems, getSettings } from "@/lib/store";

export default function MenuPage() {
  const settings = getSettings();
  const categories = getCategories();
  const items = getAvailableMenuItems();

  return (
    <div>
      <SiteHeader businessName={settings.businessName} />
      <MenuBrowser categories={categories} items={items} />
    </div>
  );
}
