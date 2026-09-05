import { notFound } from "next/navigation";
import { getOrder, getSettings } from "@/lib/store";
import { formatMoney, formatEventDate } from "@/lib/format";

export default async function OrderConfirmationPage(props: PageProps<"/order/[id]/confirmation">) {
  const { id } = await props.params;
  const order = await getOrder(id);
  const settings = await getSettings();

  if (!order) notFound();

  const total = order.items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const firstName = order.customerName.split(" ")[0] || order.customerName;

  return (
    <div className="mx-auto max-w-md py-8 md:max-w-xl">
      <div className="px-7 pt-6 pb-7 text-center">
        <div className="mx-auto mb-4.5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-tint">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b9791a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold">Order received</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
          Thanks, {firstName} — your request is in. You&apos;ll hear back to confirm the date and details.
        </p>
      </div>

      <div className="mx-5 mb-4 rounded-xl border border-line bg-surface p-4.5">
        <div className="mb-2.5 font-mono text-[10.5px] tracking-wide text-ink-faint uppercase">Order summary</div>
        <Row k="Event date" v={formatEventDate(order.eventDate)} />
        <Row k="Guests" v={String(order.guestCount)} />
        <Row k="Fulfillment" v={order.fulfillment === "delivery" ? "Delivery" : "Pickup"} />
        <Row k="Estimated total" v={formatMoney(total)} />
      </div>

      <div className="mx-5 mb-4 rounded-xl bg-indigo-tint p-4.5">
        <h3 className="mb-1.5 text-sm font-semibold text-indigo">Payment</h3>
        <p className="text-[12.5px] leading-relaxed text-ink-soft">
          No payment needed yet. Once your order is confirmed, we&apos;ll send a Venmo request to{" "}
          <span className="font-mono font-semibold text-indigo">{settings.venmoHandle}</span>.
        </p>
      </div>

      <div className="mx-5 mb-8">
        <div className="mb-1 pl-0.5 font-mono text-[10.5px] tracking-wide text-ink-faint uppercase">What happens next</div>
        <Step n={1} text="The owner reviews your order and confirms availability for the date." />
        <Step n={2} text="You'll get a text confirming the date, price, and Venmo request." />
        <Step n={3} text="You'll get a text again once your order is out for delivery." />
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-line py-1.5 text-[13.5px] last:border-b-0">
      <span className="text-ink-soft">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex gap-3 py-2.5">
      <div className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border border-line-strong bg-surface-2 font-mono text-[11px] text-ink-soft">
        {n}
      </div>
      <p className="pt-0.5 text-[13px] text-ink-soft">{text}</p>
    </div>
  );
}
