"use client";

import { useState } from "react";

function UtensilsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2v20M6 2c-1.5 0-2.5 1-2.5 2.5S4.5 7 6 7s2.5-1 2.5-2.5S7.5 2 6 2z" />
      <path d="M18 2c-2 0-3 2-3 5s1 6 3 6 3-3 3-6-1-5-3-5zM18 13v9" />
    </svg>
  );
}

/**
 * Fills its parent (give the parent a fixed size + overflow-hidden).
 * Falls back to the utensils placeholder when there's no URL, or the
 * URL fails to load — menu photos are arbitrary external links (Imgur,
 * etc.), not something we control, so plain <img> is used deliberately
 * instead of next/image (which needs known-ahead-of-time remote hosts).
 */
export function MenuPhoto({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const [lastSrc, setLastSrc] = useState(src);

  if (src !== lastSrc) {
    setLastSrc(src);
    setFailed(false);
  }

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold-tint to-indigo-tint text-indigo/55">
        <UtensilsIcon />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URL, not a known/optimizable host
    <img src={src} alt={alt} className="h-full w-full object-cover" onError={() => setFailed(true)} />
  );
}
