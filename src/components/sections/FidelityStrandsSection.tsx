import { useState, useMemo } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { AccordionItem, AccordionGroup } from '@/components/ui'
import { Focus, Grid3X3, ChevronLeft, ChevronRight, CheckCircle2, Target } from 'lucide-react'
import {
  fidelityStrands,
  CHALLENGE_RATING_LABELS,
  CAPACITY_RATING_LABELS,
  type FidelityItem,
  type FidelityStrandConfig,
} from '@/data/fidelityItems'
import type { FormData, ChallengeRating, CapacityRating, FidelityStrand } from '@/types/form.types'

export function FidelityStrandsSection() {
  const [focusMode, setFocusMode] = useState(false)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const { watch } = useFormContext<FormData>()
  const fidelityData = watch('fidelityStrands')

  // Build flat list of all items for focus mode
  const allItems = useMemo(() => {
    const items: { strand: FidelityStrandConfig; item: FidelityItem; type: 'challenge' | 'capacity'; group?: string }[] = []
    fidelityStrands.forEach((strand) => {
      strand.challengeItems.forEach((item) => {
        items.push({ strand, item, type: 'challenge' })
      })
      strand.capacityGroups?.forEach((group) => {
        group.items.forEach((item) => {
          items.push({ strand, item, type: 'capacity', group: group.title })
        })
      })
      strand.capacityItems.forEach((item) => {
        items.push({ strand, item, type: 'capacity' })
      })
    })
    return items
  }, [])

  const totalItems = allItems.length
  const currentFocusItem = allItems[currentItemIndex]

  // Calculate completed items
  const completedItems = useMemo(() => {
    let count = 0
    allItems.forEach(({ strand, item, type }) => {
      const strandData = fidelityData?.[strand.id as keyof typeof fidelityData] as FidelityStrand | undefined
      if (type === 'challenge') {
        const v = strandData?.challengeItems?.[item.id]
        if (typeof v === 'number' && v >= 0 && v <= 3) count++
      } else {
        const v = strandData?.capacityItems?.[item.id]
        if (typeof v === 'number' && v >= 0 && v <= 2) count++
      }
    })
    return count
  }, [allItems, fidelityData])

  const progress = Math.round((completedItems / totalItems) * 100)

  const goToNext = () => {
    if (currentItemIndex < totalItems - 1) {
      setCurrentItemIndex(prev => prev + 1)
    }
  }

  const goToPrev = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1)
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      goToNext()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      goToPrev()
    } else if (e.key === 'Escape') {
      setFocusMode(false)
    }
  }

  if (focusMode) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 overflow-hidden flex flex-col"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Header */}
        <div className="glass-header border-b border-white/20 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/30">
                <Focus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Focus Mode</h2>
                <p className="text-xs text-gray-500">
                  Item {currentItemIndex + 1} of {totalItems}
                </p>
              </div>
            </div>
            <button
              onClick={() => setFocusMode(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                       bg-white/80 text-gray-700 rounded-xl hover:bg-white
                       transition-all border border-gray-200"
            >
              <Grid3X3 className="w-4 h-4" />
              Exit Focus
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 py-3 glass-header border-b border-white/20">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${((currentItemIndex + 1) / totalItems) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold gradient-text">{completedItems}/{totalItems}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Strand indicator */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-cyan-600 bg-cyan-100 px-3 py-1.5 rounded-full">
                {currentFocusItem.strand.title}
              </span>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                currentFocusItem.type === 'challenge' 
                  ? 'bg-orange-100 text-orange-600' 
                  : 'bg-green-100 text-green-600'
              }`}>
                {currentFocusItem.type === 'challenge' ? 'Challenge' : 'Capacity'}
              </span>
              {currentFocusItem.group && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                  {currentFocusItem.group}
                </span>
              )}
            </div>

            {/* Focus Card */}
            <div className="glass-card rounded-3xl p-8 shadow-2xl">
              {currentFocusItem.type === 'challenge' ? (
                <FocusModeChallengeItem
                  item={currentFocusItem.item}
                  strandId={currentFocusItem.strand.id}
                  onComplete={goToNext}
                />
              ) : (
                <FocusModeCapacityItem
                  item={currentFocusItem.item}
                  strandId={currentFocusItem.strand.id}
                  onComplete={goToNext}
                />
              )}
            </div>

            {/* Quick tips */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>💡 Click a rating to select it and auto-advance to the next item</p>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="glass-header border-t border-white/20 px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button
              onClick={goToPrev}
              disabled={currentItemIndex === 0}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                ${currentItemIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:-translate-x-1'
                }
              `}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">←</kbd>
              <span className="text-sm text-gray-400">or</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">→</kbd>
            </div>

            <button
              onClick={goToNext}
              disabled={currentItemIndex === totalItems - 1}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                ${currentItemIndex === totalItems - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 hover:translate-x-1'
                }
              `}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Intro with Focus Mode button */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-4 py-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/30">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold gradient-text">Fidelity Strands</h2>
                <p className="text-xs text-gray-500">{completedItems} of {totalItems} items rated</p>
              </div>
            </div>
            <button
              onClick={() => setFocusMode(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold
                       bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                       rounded-xl hover:from-indigo-600 hover:to-purple-600
                       transition-all shadow-lg shadow-indigo-500/30
                       hover:shadow-indigo-500/50 hover:-translate-y-0.5
                       w-full sm:w-auto"
            >
              <Focus className="w-4 h-4" />
              Focus Mode
            </button>
          </div>
        </div>
        <div className="p-4 space-y-3 text-sm text-gray-600">
          <p>
            Each strand has two parts: <strong>Potential Sources of Challenge</strong> (rated on a 4-point scale)
            and <strong>Clinician/Care Coordinator Capacity</strong> (rated on a 3-point scale).
          </p>
          
          {/* Progress bar */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  progress === 100 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                    : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-700">{progress}%</span>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Challenge:</span>
              {CHALLENGE_RATING_LABELS.map((label, i) => (
                <span key={label} className={`text-xs px-2 py-1 rounded-lg font-medium ${getChallengeColor(i, true)}`}>
                  {i}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Capacity:</span>
              {CAPACITY_RATING_LABELS.map((label, i) => (
                <span key={label} className={`text-xs px-2 py-1 rounded-lg font-medium ${getCapacityColor(i, true)}`}>
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strands */}
      <AccordionGroup>
        {fidelityStrands.map((strand, index) => (
          <StrandAccordion key={strand.id} strand={strand} index={index} />
        ))}
      </AccordionGroup>
    </div>
  )
}

// Focus Mode specific rating components
function FocusModeChallengeItem({
  item,
  strandId,
  onComplete,
}: {
  item: FidelityItem
  strandId: string
  onComplete: () => void
}) {
  const { control, watch } = useFormContext<FormData>()
  const fieldName = `fidelityStrands.${strandId}.challengeItems.${item.id}` as const
  const currentValue = watch(fieldName as never)

  return (
    <Controller
      name={fieldName as never}
      control={control}
      render={({ field }) => (
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            {item.childFirstOnly && (
              <span className="flex-shrink-0 text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-lg font-medium">
                CF Only
              </span>
            )}
            <p className="text-lg text-gray-800 leading-relaxed">{item.text}</p>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {CHALLENGE_RATING_LABELS.map((label, i) => {
              const isSelected = field.value === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    field.onChange(i as ChallengeRating)
                    setTimeout(onComplete, 300)
                  }}
                  className={`
                    py-4 px-3 rounded-2xl border-3 text-center transition-all duration-200
                    ${isSelected
                      ? `${getChallengeColor(i, true)} scale-105 shadow-lg`
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:scale-102'
                    }
                  `}
                >
                  <span className="block text-2xl font-bold mb-1">{i}</span>
                  <span className="block text-xs font-medium">{label}</span>
                </button>
              )
            })}
          </div>

          {currentValue !== undefined && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Rating saved!</span>
            </div>
          )}
        </div>
      )}
    />
  )
}

function FocusModeCapacityItem({
  item,
  strandId,
  onComplete,
}: {
  item: FidelityItem
  strandId: string
  onComplete: () => void
}) {
  const { control, watch } = useFormContext<FormData>()
  const fieldName = `fidelityStrands.${strandId}.capacityItems.${item.id}` as const
  const currentValue = watch(fieldName as never)

  return (
    <Controller
      name={fieldName as never}
      control={control}
      render={({ field }) => (
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            {item.childFirstOnly && (
              <span className="flex-shrink-0 text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-lg font-medium">
                CF Only
              </span>
            )}
            <p className="text-lg text-gray-800 leading-relaxed">{item.text}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {CAPACITY_RATING_LABELS.map((label, i) => {
              const isSelected = field.value === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    field.onChange(i as CapacityRating)
                    setTimeout(onComplete, 300)
                  }}
                  className={`
                    py-5 px-4 rounded-2xl border-3 text-center transition-all duration-200
                    ${isSelected
                      ? `${getCapacityColor(i, true)} scale-105 shadow-lg`
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:scale-102'
                    }
                  `}
                >
                  <span className="block text-2xl font-bold mb-1">{i}</span>
                  <span className="block text-xs font-medium">{label}</span>
                </button>
              )
            })}
          </div>

          {currentValue !== undefined && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Rating saved!</span>
            </div>
          )}
        </div>
      )}
    />
  )
}

function StrandAccordion({
  strand,
  index,
}: {
  strand: FidelityStrandConfig
  index: number
}) {
  const { watch } = useFormContext<FormData>()
  const fidelityData = watch('fidelityStrands')
  const strandData = fidelityData?.[strand.id as keyof typeof fidelityData] as FidelityStrand | undefined

  // Calculate progress for this strand (only count valid numeric ratings)
  const totalItems = strand.challengeItems.length + strand.capacityItems.length +
    (strand.capacityGroups?.reduce((sum, g) => sum + g.items.length, 0) || 0)
  let completedItems = 0
  for (const item of strand.challengeItems) {
    const v = strandData?.challengeItems?.[item.id]
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 3) completedItems++
  }
  for (const item of strand.capacityItems) {
    const v = strandData?.capacityItems?.[item.id]
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 2) completedItems++
  }
  strand.capacityGroups?.forEach((group) => {
    for (const item of group.items) {
      const v = strandData?.capacityItems?.[item.id]
      if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 2) completedItems++
    }
  })
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <AccordionItem
      title={`Strand ${index + 1}: ${strand.title}`}
      badge={
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            progress === 100
              ? 'bg-green-100 text-green-700'
              : progress > 0
                ? 'bg-cyan-100 text-cyan-700'
                : 'bg-gray-100 text-gray-600'
          }`}
        >
          {completedItems}/{totalItems}
        </span>
      }
      defaultOpen={index === 0}
    >
      <div className="space-y-6">
        {/* Challenge Items */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-red-400" />
            Potential Sources of Challenge
          </h4>
          <div className="space-y-3">
            {strand.challengeItems.map((item) => (
              <ChallengeRatingItem
                key={item.id}
                item={item}
                strandId={strand.id}
              />
            ))}
          </div>
        </div>

        {/* Capacity Items */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
            Clinician/Care Coordinator Capacity
          </h4>

          {/* Grouped capacity items */}
          {strand.capacityGroups?.map((group) => (
            <div key={group.title} className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2 pl-3 border-l-2 border-blue-300">
                {group.title}
              </h5>
              <div className="space-y-2 ml-2">
                {group.items.map((item) => (
                  <CapacityRatingItem
                    key={item.id}
                    item={item}
                    strandId={strand.id}
                    compact
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Ungrouped capacity items */}
          <div className="space-y-3">
            {strand.capacityItems.map((item) => (
              <CapacityRatingItem
                key={item.id}
                item={item}
                strandId={strand.id}
              />
            ))}
          </div>
        </div>
      </div>
    </AccordionItem>
  )
}

function ChallengeRatingItem({
  item,
  strandId,
}: {
  item: FidelityItem
  strandId: string
}) {
  const { control } = useFormContext<FormData>()
  const fieldName = `fidelityStrands.${strandId}.challengeItems.${item.id}` as const

  return (
    <Controller
      name={fieldName as never}
      control={control}
      render={({ field }) => (
        <div className="glass-item rounded-xl p-3">
          <div className="flex items-start gap-2 mb-2">
            {item.childFirstOnly && (
              <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">
                CF
              </span>
            )}
            <span className="text-sm text-gray-800">{item.text}</span>
          </div>
          <div className="flex gap-2">
            {CHALLENGE_RATING_LABELS.map((label, i) => {
              const isSelected = field.value === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => field.onChange(i as ChallengeRating)}
                  className={`
                    flex-1 py-2 px-1 rounded-lg border-2 text-center transition-all
                    ${isSelected
                      ? getChallengeColor(i, true)
                      : 'bg-white border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="block text-xs font-medium">{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    />
  )
}

function CapacityRatingItem({
  item,
  strandId,
  compact = false,
}: {
  item: FidelityItem
  strandId: string
  compact?: boolean
}) {
  const { control } = useFormContext<FormData>()
  const fieldName = `fidelityStrands.${strandId}.capacityItems.${item.id}` as const

  return (
    <Controller
      name={fieldName as never}
      control={control}
      render={({ field }) => (
        <div className={`glass-item rounded-xl ${compact ? 'p-2' : 'p-3'}`}>
          <div className={`flex items-start gap-2 ${compact ? 'mb-1' : 'mb-2'}`}>
            {item.childFirstOnly && (
              <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">
                CF
              </span>
            )}
            <span className={`${compact ? 'text-xs' : 'text-sm'} text-gray-800`}>
              {item.text}
            </span>
          </div>
          <div className="flex gap-2">
            {CAPACITY_RATING_LABELS.map((label, i) => {
              const isSelected = field.value === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => field.onChange(i as CapacityRating)}
                  className={`
                    flex-1 py-1.5 px-1 rounded-lg border-2 text-center transition-all
                    ${isSelected
                      ? getCapacityColor(i, true)
                      : 'bg-white border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <span className={`block ${compact ? 'text-[10px]' : 'text-xs'} font-medium`}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    />
  )
}

function getChallengeColor(value: number, selected: boolean): string {
  if (!selected) return ''
  const colors = [
    'bg-green-50 border-green-500 text-green-700',
    'bg-yellow-50 border-yellow-500 text-yellow-700',
    'bg-orange-50 border-orange-500 text-orange-700',
    'bg-red-50 border-red-500 text-red-700',
  ]
  return colors[value] || ''
}

function getCapacityColor(value: number, selected: boolean): string {
  if (!selected) return ''
  const colors = [
    'bg-red-50 border-red-500 text-red-700',
    'bg-yellow-50 border-yellow-500 text-yellow-700',
    'bg-green-50 border-green-500 text-green-700',
  ]
  return colors[value] || ''
}
