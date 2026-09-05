import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/store";
import { advanceOrderStatusAction, revertOrderStatusAction } from "@/lib/actions";
import { formatEventDate, formatMoney } from "@/lib/format";
import { STAGES, UNIT_LABEL } from "@/lib/types";

export default async function AdminOrderDetailPage(props: PageProps<"/admin/orders/[id]">) {
  const { id } = await props.params;
  const order = await getOrder(id);
  if (!order) notFound();

  const currentIndex = STAGES.findIndex((s) => s.key === order.status);
  const atStart = currentIndex <= 0;
  const atEnd = currentIndex >= STAGES.length - 1;
  const advanceThisOrder = advanceOrderStatusAction.bind(null, order.id);
  const revertThisOrder = revertOrderStatusAction.bind(null, order.id);
  const total = order.items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <div>
      <div className="flex items-center gap-3 px-5 pt-4 pb-1 md:px-8">
        <Link
          href="/admin/orders"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface"
          aria-label="Back to orders"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-lg font-semibold">{order.customerName}</h2>
          <p className="font-mono text-[11.5px] text-ink-faint">
            {order.guestCount} guests · {order.fulfillment === "delivery" ? "Delivery" : "Pickup"} · Due{" "}
            {formatEventDate(order.eventDate)}, {order.eventTime}
          </p>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:px-8">
      <div>
      <section className="px-5 pt-4 lg:px-0">
        <SectionLabel>Items</SectionLabel>
        <div className="rounded-xl border border-line bg-surface p-4">
          {order.items.map((line) => (
            <div key={line.menuItemId} className="flex justify-between border-b border-line py-1.5 text-[13.5px] last:border-b-0">
              <span className="text-ink-soft">{line.name}</span>
              <span className="font-medium">
                {line.qty} · {UNIT_LABEL[line.unit]}
              </span>
            </div>
          ))}
          <div className="mt-1 flex justify-between border-t border-line pt-2 text-[13.5px] font-semibold">
            <span>Estimated total</span>
            <span>{formatMoney(total)}</span>
          </div>
          {order.notes && (
            <p className="mt-2 border-t border-line pt-2 text-[12.5px] text-ink-soft">
              <span className="font-semibold text-ink">Notes: </span>
              {order.notes}
            </p>
          )}
        </div>
      </section>

      <section className="px-5 pt-4 lg:px-0">
        <SectionLabel>Contact{order.fulfillment === "delivery" ? " & delivery" : ""}</SectionLabel>
        <div className="rounded-xl border border-line bg-surface p-4">
          <ContactRow icon={<PhoneIcon />}>{order.customerPhone}</ContactRow>
          <ContactRow icon={<MailIcon />}>{order.customerEmail}</ContactRow>
          {order.fulfillment === "delivery" && order.deliveryAddress && (
            <ContactRow icon={<PinIcon />}>{order.deliveryAddress}</ContactRow>
          )}
        </div>
      </section>
      </div>

      <div>
      <section className="px-5 pt-4 lg:px-0">
        <SectionLabel>Kitchen status</SectionLabel>
        <div className="rounded-xl border border-line bg-surface p-4 pl-5">
          {STAGES.map((stage, i) => {
            const done = i < currentIndex;
            const current = i === currentIndex;
            return (
              <div key={stage.key} className="relative flex gap-3.5 pb-5 last:pb-0">
                {i < STAGES.length - 1 && (
                  <div className="absolute top-[22px] left-[10px] h-full w-0.5 bg-line-strong" />
                )}
                <div
                  className={`z-10 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border-2 ${
                    done
                      ? "border-good bg-good"
                      : current
                        ? "border-indigo bg-indigo"
                        : "border-line-strong bg-surface"
                  }`}
                >
                  {done && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className={`text-[14px] font-semibold ${i <= currentIndex ? "text-ink" : "text-ink-faint"}`}>
                    {stage.label}
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-faint">{stage.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-5 pt-5 pb-9 lg:px-0">
        <div className="flex gap-2.5">
          <form action={revertThisOrder} className="flex-none">
            <button
              type="submit"
              disabled={atStart}
              title={atStart ? undefined : `Back to ${STAGES[currentIndex - 1].label}`}
              className="flex h-[52px] items-center justify-center rounded-xl border border-line-strong bg-surface px-5 text-[14.5px] font-semibold text-ink-soft disabled:opacity-40"
            >
              Back
            </button>
          </form>
          <form action={advanceThisOrder} className="flex-1">
            <button
              type="submit"
              disabled={atEnd}
              className={`w-full rounded-xl py-4 text-[14.5px] font-semibold ${
                atEnd ? "bg-good-tint text-good" : "bg-indigo text-white"
              }`}
            >
              {atEnd ? "Order completed" : `Advance to ${STAGES[currentIndex + 1].label}`}
            </button>
          </form>
        </div>
        {!atStart && !atEnd && (
          <p className="mt-2 text-center text-[11px] text-ink-faint">
            Moved something by accident? Back returns it to {STAGES[currentIndex - 1].label}.
          </p>
        )}
      </section>
      </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-2.5 font-mono text-[11px] tracking-wide text-ink-faint uppercase">{children}</div>;
}

function ContactRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-line py-2.5 text-[13px] text-ink-soft last:border-b-0">
      <span className="flex-none text-indigo">{icon}</span>
      {children}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" opacity="0" />
      <path d="M22 6c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
