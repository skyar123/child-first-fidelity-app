import type { ComponentType } from 'react'

type IconType = ComponentType<{ className?: string }>

// The per-section progress card used at the top of every form section:
// a coloured icon tile, the section title/subtitle, a big live percent, an
// item count, and a thin progress bar. Modelled on the Supervision form.

export type ProgressTone =
  | 'emerald'
  | 'cyan'
  | 'violet'
  | 'pink'
  | 'amber'
  | 'blue'
  | 'teal'
  | 'indigo'
  | 'rose'
  | 'fuchsia'

const TONES: Record<ProgressTone, { tile: string; icon: string; text: string; bar: string }> = {
  emerald: { tile: 'bg-emerald-100', icon: 'text-emerald-600', text: 'text-emerald-600', bar: 'bg-emerald-500' },
  cyan: { tile: 'bg-cyan-100', icon: 'text-cyan-600', text: 'text-cyan-600', bar: 'bg-cyan-500' },
  violet: { tile: 'bg-violet-100', icon: 'text-violet-600', text: 'text-violet-600', bar: 'bg-violet-500' },
  pink: { tile: 'bg-pink-100', icon: 'text-pink-600', text: 'text-pink-600', bar: 'bg-pink-500' },
  amber: { tile: 'bg-amber-100', icon: 'text-amber-600', text: 'text-amber-600', bar: 'bg-amber-500' },
  blue: { tile: 'bg-blue-100', icon: 'text-blue-600', text: 'text-blue-600', bar: 'bg-blue-500' },
  teal: { tile: 'bg-teal-100', icon: 'text-teal-600', text: 'text-teal-600', bar: 'bg-teal-500' },
  indigo: { tile: 'bg-indigo-100', icon: 'text-indigo-600', text: 'text-indigo-600', bar: 'bg-indigo-500' },
  rose: { tile: 'bg-rose-100', icon: 'text-rose-600', text: 'text-rose-600', bar: 'bg-rose-500' },
  fuchsia: { tile: 'bg-fuchsia-100', icon: 'text-fuchsia-600', text: 'text-fuchsia-600', bar: 'bg-fuchsia-500' },
}

interface SectionProgressHeaderProps {
  icon: IconType
  title: string
  subtitle?: string
  /** answered items (optional; shown as "done/total items" when total is given) */
  done?: number
  total?: number
  /** explicit percent when done/total aren't available */
  percent?: number
  tone?: ProgressTone
}

export function SectionProgressHeader({
  icon: Icon,
  title,
  subtitle,
  done,
  total,
  percent,
  tone = 'indigo',
}: SectionProgressHeaderProps) {
  const t = TONES[tone]
  const pct =
    percent != null
      ? Math.round(percent)
      : total && total > 0
        ? Math.round((Math.min(done ?? 0, total) / total) * 100)
        : 0

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2 rounded-lg flex-shrink-0 ${t.tile}`}>
            <Icon className={`w-5 h-5 ${t.icon}`} />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-2xl font-bold ${t.text}`}>{pct}%</div>
          {total ? (
            <div className="text-xs text-gray-500">
              {Math.min(done ?? 0, total)}/{total} items
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${t.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
