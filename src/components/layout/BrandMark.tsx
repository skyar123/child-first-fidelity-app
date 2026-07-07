// The app's brand mark: five fine arcs in the five instrument colours
// (Foundational green, Care Coordination cyan, Core purple, Supervision pink,
// Termination amber) — an understated "rainbow of the five forms" that reads as
// elegant and professional rather than a saturated emoji tile.

interface BrandMarkProps {
  /** pixel size of the square tile */
  size?: number
  className?: string
}

const ARCS = [
  { r: 20, color: '#059669' }, // emerald — Foundational
  { r: 16.5, color: '#0891b2' }, // cyan — Care Coordination
  { r: 13, color: '#7c3aed' }, // violet — Core
  { r: 9.5, color: '#db2777' }, // pink — Supervision
  { r: 6, color: '#d97706' }, // amber — Termination
]

export function BrandMark({ size = 64, className = '' }: BrandMarkProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-sm ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.66}
        height={size * 0.66}
        viewBox="0 0 48 40"
        fill="none"
        role="img"
      >
        {ARCS.map(({ r, color }) => (
          <path
            key={r}
            d={`M ${24 - r} 30 A ${r} ${r} 0 0 1 ${24 + r} 30`}
            stroke={color}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        ))}
        <circle cx="24" cy="30" r="1.8" fill="#334155" />
      </svg>
    </span>
  )
}
