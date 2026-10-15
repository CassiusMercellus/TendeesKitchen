/**
 * Placeholder for the client-supplied Africa + Nigeria flag emblem.
 * Swap this out once that asset is ready — see mockups/Home-Rebrand-Desktop-V2.dc.html.
 */
export function BrandLogoSlot({ size }: { size: number }) {
  return (
    <span
      className="brand-logo-slot"
      style={{ width: size, height: size }}
      title="Reserved for the Africa + Nigeria flag emblem"
    >
      <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2v20" />
        <path d="M12 2c-5 3-5 8 0 10 5-2 5-7 0-10zM12 12c5 3 5 8 0 10-5-2-5-7 0-10z" />
      </svg>
    </span>
  );
}
