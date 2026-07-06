import { useEffect, useRef } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'

export interface StepSection {
  id: string
  label: string
  /** true when the section is fully answered */
  complete?: boolean
}

// ------------------------------------------------------------
// Top stepper: "Section X of Y" + a horizontal jump strip
// ------------------------------------------------------------

export function SectionStepper({
  sections,
  currentId,
  onSelect,
}: {
  sections: StepSection[]
  currentId: string
  onSelect: (id: string) => void
}) {
  const index = Math.max(0, sections.findIndex(s => s.id === currentId))
  const current = sections[index]
  const stripRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  // Keep the active pill in view as you step through
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [currentId])

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 pt-2 pb-2">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-medium text-gray-500">
            Section {index + 1} of {sections.length}
          </p>
        </div>
        <h2 className="text-sm font-semibold text-gray-900 truncate">{current?.label}</h2>
        <div
          ref={stripRef}
          className="mt-2 flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin"
        >
          {sections.map((section, i) => {
            const isActive = section.id === currentId
            return (
              <button
                key={section.id}
                ref={isActive ? activeRef : undefined}
                type="button"
                onClick={() => onSelect(section.id)}
                title={section.label}
                aria-current={isActive ? 'step' : undefined}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : section.complete
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-semibold ${
                    isActive
                      ? 'bg-white/25'
                      : section.complete
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {section.complete && !isActive ? <Check className="w-2.5 h-2.5" /> : i + 1}
                </span>
                <span className="max-w-[7.5rem] truncate">{section.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// Bottom footer: Prev / Next
// ------------------------------------------------------------

export function SectionStepFooter({
  sections,
  currentId,
  onSelect,
}: {
  sections: StepSection[]
  currentId: string
  onSelect: (id: string) => void
}) {
  const index = Math.max(0, sections.findIndex(s => s.id === currentId))
  const atStart = index === 0
  const atEnd = index === sections.length - 1

  const go = (delta: number) => {
    const next = sections[index + delta]
    if (next) {
      onSelect(next.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={atStart}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <span className="text-xs text-gray-400">
          {index + 1} / {sections.length}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={atEnd}
          className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
