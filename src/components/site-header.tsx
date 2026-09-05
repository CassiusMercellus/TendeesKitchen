"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function SiteHeader({ businessName }: { businessName: string }) {
  const { totalCount } = useCart();

  return (
    <header className="sticky top-0 z-20 bg-indigo-deep text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="block">
          <h1 className="text-xl font-semibold md:text-[22px]">{businessName}</h1>
          <p className="mt-0.5 font-mono text-[11px] tracking-wide text-indigo-tint/80">
            NIGERIAN &amp; WEST AFRICAN CATERING
          </p>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/#how-it-works" className="text-[14px] text-white/85 hover:text-white">
            How it works
          </Link>
          <Link href="/menu" className="text-[14px] text-white/85 hover:text-white">
            Menu
          </Link>
          <Link href="/#contact" className="text-[14px] text-white/85 hover:text-white">
            Contact
          </Link>
          <Link
            href="/menu"
            className="rounded-full bg-gold px-4 py-2 text-[13.5px] font-semibold text-[#1c1608]"
          >
            Order Online
          </Link>
        </nav>

        <Link
          href="/order"
          className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/10"
          aria-label="View your order"
        >
          <CartIcon />
          {totalCount > 0 && <CartBadge count={totalCount} />}
        </Link>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  );
}

function CartBadge({ count }: { count: number }) {
  return (
    <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 font-mono text-[11px] font-bold text-[#1c1608]">
      {count}
    </span>
  );
}
