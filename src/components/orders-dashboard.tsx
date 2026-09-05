"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusPill } from "@/components/status-pill";
import { formatEventDate, isDueSoon } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { STAGES } from "@/lib/types";

const FILTERS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  ...STAGES.map((s) => ({ key: s.key, label: s.label })),
  { key: "cancelled", label: "Cancelled" },
];

export function OrdersDashboard({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const visible = orders.filter((o) => filter === "all" || o.status === filter);

  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto border-b border-line px-4 py-3.5 md:px-8">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-none rounded-full border px-3 py-1.5 text-[12.5px] font-medium whitespace-nowrap ${
              filter === f.key ? "border-indigo bg-indigo text-white" : "border-line bg-surface text-ink-soft"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2.5 p-4 pb-10 md:grid-cols-2 md:p-8 xl:grid-cols-3">
        {visible.length === 0 && <p className="py-8 text-center text-sm text-ink-faint md:col-span-full">No orders in this view.</p>}
        {visible.map((order) => {
          const urgent = order.status !== "completed" && order.status !== "cancelled" && isDueSoon(order.eventDate);
          return (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block rounded-lg border border-line bg-surface px-3.5 py-3.5 transition-colors hover:border-line-strong"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {order.status === "requested" && <span className="h-1.5 w-1.5 rounded-full bg-indigo" />}
                  <span className="text-[14.5px] font-semibold">{order.customerName}</span>
                </div>
                <StatusPill status={order.status} />
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="flex items-center gap-1.5 text-ink-soft">
                  {order.guestCount} guests · {order.fulfillment === "delivery" ? "Delivery" : "Pickup"}
                </span>
                <span className={`font-mono ${urgent ? "font-semibold text-pepper" : "text-ink-faint"}`}>
                  {formatEventDate(order.eventDate)} · {order.eventTime}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
