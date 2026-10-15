const BLADE_PATH =
  "M150,300 C122,235 108,165 120,95 C127,55 138,20 150,-10 C162,20 173,55 180,95 C192,165 178,235 150,300 Z";

export function PalmFrond({
  className,
  blades,
}: {
  className?: string;
  blades: { rotate: number; opacity?: number }[];
}) {
  return (
    <svg className={`brand-palm ${className ?? ""}`} viewBox="0 0 300 320" aria-hidden="true">
      <g>
        {blades.map((b, i) => (
          <path key={i} d={BLADE_PATH} transform={`rotate(${b.rotate} 150 300)`} opacity={b.opacity ?? 1} />
        ))}
      </g>
    </svg>
  );
}
