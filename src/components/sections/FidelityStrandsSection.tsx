import { useFormContext, Controller } from 'react-hook-form'
import { AccordionItem, AccordionGroup } from '@/components/ui'
import {
  fidelityStrands,
  CHALLENGE_RATING_LABELS,
  CAPACITY_RATING_LABELS,
  type FidelityItem,
  type FidelityStrandConfig,
} from '@/data/fidelityItems'
import type { FormData, ChallengeRating, CapacityRating, FidelityStrand } from '@/types/form.types'

export function FidelityStrandsSection() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Intro */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Fidelity Strands</h2>
        </div>
        <div className="p-4 space-y-2 text-sm text-gray-600">
          <p>
            Each strand has two parts: <strong>Potential Sources of Challenge</strong> (rated on a 4-point scale)
            and <strong>Clinician/Care Coordinator Capacity</strong> (rated on a 3-point scale).
          </p>
          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">Challenge Scale:</span>
              {CHALLENGE_RATING_LABELS.map((label, i) => (
                <span key={label} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                  {i} = {label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Capacity Scale:</span>
              {CAPACITY_RATING_LABELS.map((label, i) => (
                <span key={label} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                  {i} = {label}
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
          className={`text-xs px-2 py-0.5 rounded-full ${
            progress === 100
              ? 'bg-green-100 text-green-700'
              : progress > 0
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
          }`}
        >
          {progress}%
        </span>
      }
      defaultOpen={index === 0}
    >
      <div className="space-y-6">
        {/* Challenge Items */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
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
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Clinician/Care Coordinator Capacity
          </h4>

          {/* Grouped capacity items */}
          {strand.capacityGroups?.map((group) => (
            <div key={group.title} className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2 pl-2 border-l-2 border-blue-200">
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
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start gap-2 mb-2">
            {item.childFirstOnly && (
              <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
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
        <div className={`bg-gray-50 rounded-lg ${compact ? 'p-2' : 'p-3'}`}>
          <div className={`flex items-start gap-2 ${compact ? 'mb-1' : 'mb-2'}`}>
            {item.childFirstOnly && (
              <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
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
