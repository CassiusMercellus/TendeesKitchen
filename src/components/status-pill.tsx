import type { OrderStatus } from "@/lib/types";

const STYLE: Record<OrderStatus, { label: string; fg: string; bg: string; strike?: boolean }> = {
  requested: { label: "Requested", fg: "#2a3572", bg: "#e7e9f5" },
  shopping: { label: "Shopping", fg: "#b9791a", bg: "#f6e8cf" },
  prepping: { label: "Prepping", fg: "#a3321f", bg: "#f4e0da" },
  ready: { label: "Ready", fg: "#3f7d4f", bg: "#e3efe1" },
  out: { label: "Out / Pickup", fg: "#2c6e7a", bg: "#dcedf0" },
  completed: { label: "Completed", fg: "#8b8f9e", bg: "#ebede4" },
  cancelled: { label: "Cancelled", fg: "#565b6b", bg: "#dcddd2", strike: true },
};

export function StatusPill({ status }: { status: OrderStatus }) {
  const s = STYLE[status];
  return (
    <span
      className="rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold"
      style={{ color: s.fg, background: s.bg, textDecoration: s.strike ? "line-through" : undefined }}
    >
      {s.label}
    </span>
  );
}

export { STYLE as STATUS_STYLE };
