"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { createOrderAction } from "@/lib/actions";
import { formatMoney, formatTimeInput } from "@/lib/format";
import { UNIT_LABEL } from "@/lib/types";

const GUEST_PRESETS = [10, 25, 40, 60];

export function OrderForm({
  threshold,
  businessPhone,
}: {
  threshold: number;
  businessPhone: string;
}) {
  const { lines, totalPrice, clear } = useCart();
  const router = useRouter();
  const [guestCount, setGuestCount] = useState(10);
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("delivery");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const underThreshold = guestCount < threshold;
  const phoneDigits = businessPhone.replace(/[^\d+]/g, "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") || ""),
      customerPhone: String(form.get("customerPhone") || ""),
      customerEmail: String(form.get("customerEmail") || ""),
      eventDate: String(form.get("eventDate") || ""),
      eventTime: formatTimeInput(String(form.get("eventTime") || "")),
      guestCount,
      fulfillment,
      deliveryAddress: fulfillment === "delivery" ? String(form.get("deliveryAddress") || "") : undefined,
      notes: String(form.get("notes") || ""),
      items: lines.map((l) => ({ menuItemId: l.menuItemId, name: l.name, unit: l.unit, price: l.price, qty: l.qty })),
    };

    startTransition(async () => {
      try {
        const result = await createOrderAction(payload);
        clear();
        router.push(`/order/${result.id}/confirmation`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    });
  }

  if (lines.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-ink-soft">Your cart is empty.</p>
        <Link href="/menu" className="mt-3 inline-block font-semibold text-indigo underline">
          Back to the menu
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-10 lg:px-8 lg:py-8">
      <div>
      <section className="px-4 pt-4 lg:px-0">
        <div className="mb-2.5 font-mono text-[11px] tracking-wide text-ink-faint uppercase">Event size</div>
        <div className="rounded-xl border border-line bg-surface p-4.5">
          <div className="flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong bg-surface-2 text-indigo"
              aria-label="Decrease guest count"
            >
              −
            </button>
            <div className="min-w-16 text-center font-display text-[34px] font-semibold">{guestCount}</div>
            <button
              type="button"
              onClick={() => setGuestCount((g) => g + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong bg-surface-2 text-indigo"
              aria-label="Increase guest count"
            >
              +
            </button>
          </div>
          <div className="mt-1 text-center text-xs text-ink-faint">guests</div>
          <div className="mt-3.5 flex justify-center gap-2">
            {GUEST_PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setGuestCount(n)}
                className="rounded-full border border-line bg-surface-2 px-3 py-1.5 font-mono text-[12.5px] text-ink-soft"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-4.5 lg:px-0">
        <div className="mb-2.5 font-mono text-[11px] tracking-wide text-ink-faint uppercase">Items</div>
        <div className="rounded-xl border border-line bg-surface p-4">
          {lines.map((line) => (
            <div key={line.menuItemId} className="flex justify-between border-b border-line py-2 text-[13.5px] last:border-b-0">
              <div>
                <div className="text-ink">{line.name}</div>
                <div className="text-xs text-ink-faint">
                  {line.qty} · {UNIT_LABEL[line.unit]}
                </div>
              </div>
              <div className="font-mono text-ink-soft">{formatMoney(line.qty * line.price)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-4.5 lg:px-0">
        <div className="mb-2.5 font-mono text-[11px] tracking-wide text-ink-faint uppercase">Fulfillment</div>
        <div className="flex gap-1 rounded-lg bg-surface-2 p-1">
          {(["pickup", "delivery"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFulfillment(f)}
              className={`flex-1 rounded-md py-2 text-[13.5px] font-medium capitalize ${
                fulfillment === f ? "bg-indigo text-white" : "text-ink-soft"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {fulfillment === "delivery" && (
          <div className="mt-3">
            <label className="mb-1 block text-xs text-ink-faint">Delivery address</label>
            <input
              name="deliveryAddress"
              type="text"
              required
              placeholder="Street address, city, state"
              className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-[13.5px]"
            />
          </div>
        )}
      </section>

      <section className="px-4 pt-4.5 lg:px-0">
        <div className="mb-2.5 font-mono text-[11px] tracking-wide text-ink-faint uppercase">Contact &amp; event details</div>
        <Field label="Full name" name="customerName" required />
        <div className="flex gap-2.5">
          <Field label="Phone" name="customerPhone" required className="flex-1" />
          <Field label="Email" name="customerEmail" type="email" required className="flex-1" />
        </div>
        <div className="flex gap-2.5">
          <Field label="Event date" name="eventDate" type="date" required className="flex-1" />
          <Field label="Time needed by" name="eventTime" type="time" required className="flex-1" />
        </div>
        <label className="mb-1 mt-3 block text-xs text-ink-faint">Notes</label>
        <textarea
          name="notes"
          placeholder="Allergies, spice level, serveware needed..."
          className="h-14 w-full resize-none rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-[13.5px]"
        />
      </section>
      </div>

      <section className="sticky top-24 px-4 pt-5 pb-9 lg:px-0 lg:pt-0">
        {underThreshold ? (
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[13px] text-ink-soft">Estimated total</span>
              <span className="font-display text-[22px] font-semibold">{formatMoney(totalPrice)}</span>
            </div>
            {error && <p className="mb-3 text-[13px] text-pepper">{error}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-indigo py-4 text-[14.5px] font-semibold text-white disabled:opacity-60"
            >
              {isPending ? "Submitting…" : "Submit Order Request"}
            </button>
            <p className="mt-2 text-center text-[11.5px] text-ink-faint">
              No payment now — we&apos;ll confirm and send a Venmo request
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#e3c3ba] bg-pepper-tint p-4.5 text-center">
            <h3 className="text-base font-semibold text-pepper">Let&apos;s plan this one together</h3>
            <p className="mx-auto mt-1.5 mb-4 max-w-[30ch] text-[13px] text-[#7a2a1c]">
              Events of {threshold}+ guests get a custom menu and pricing — checkout isn&apos;t available at this size.
            </p>
            <div className="flex gap-2.5">
              <a
                href={`tel:${phoneDigits}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-pepper py-3 text-[13.5px] font-semibold text-white"
              >
                Call
              </a>
              <a
                href={`sms:${phoneDigits}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-pepper py-3 text-[13.5px] font-semibold text-pepper"
              >
                Text
              </a>
            </div>
          </div>
        )}
      </section>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`mt-3 ${className}`}>
      <label className="mb-1 block text-xs text-ink-faint">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-[13.5px]"
      />
    </div>
  );
}
