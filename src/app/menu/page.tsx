import { SiteHeader } from "@/components/site-header";
import { MenuBrowser } from "@/components/menu-browser";
import { getCategories, getAvailableMenuItems, getSettings } from "@/lib/store";

export default async function MenuPage() {
  const settings = await getSettings();
  const categories = await getCategories();
  const items = await getAvailableMenuItems();

  return (
    <div>
      <SiteHeader businessName={settings.businessName} />
      <MenuBrowser categories={categories} items={items} />
    </div>
  );
}
