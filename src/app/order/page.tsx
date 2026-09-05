import Link from "next/link";
import { OrderForm } from "@/components/order-form";
import { getSettings } from "@/lib/store";

export default async function OrderPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-line bg-bg px-4 py-5 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center gap-3.5">
          <Link
            href="/menu"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-line bg-surface"
            aria-label="Back to menu"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">Your Order</h1>
        </div>
      </div>
      <OrderForm threshold={settings.guestThreshold} businessPhone={settings.businessPhone} />
    </div>
  );
}
