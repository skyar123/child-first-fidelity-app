import { useFormContext, Controller } from 'react-hook-form'
import type { SupervisionFormData, CapacityFocusRating } from '@/types/supervision.types'
import {
  knowledgeAreasGeneralItems,
  knowledgeAreasCareCoordItems
} from '@/data/supervisionItems'
import { BookOpen } from 'lucide-react'

const ratingOptions: { value: CapacityFocusRating; label: string }[] = [
  { value: 'could_do_less', label: 'Could Do Less' },
  { value: 'could_do_more', label: 'Could Do More' },
  { value: 'appropriate', label: 'Appropriate' },
  { value: 'strength', label: 'Strength' }
]

function RatingButton({
  value,
  currentValue,
  onChange,
  label
}: {
  value: CapacityFocusRating
  currentValue: CapacityFocusRating
  onChange: (v: CapacityFocusRating) => void
  label: string
}) {
  const isSelected = currentValue === value

  const getColorClasses = () => {
    if (!isSelected) return 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'

    switch (value) {
      case 'could_do_less':
        return 'bg-blue-50 border-blue-500 text-blue-700'
      case 'could_do_more':
        return 'bg-yellow-50 border-yellow-500 text-yellow-700'
      case 'appropriate':
        return 'bg-green-50 border-green-500 text-green-700'
      case 'strength':
        return 'bg-purple-50 border-purple-500 text-purple-700'
      default:
        return 'bg-gray-50 border-gray-500 text-gray-700'
    }
  }

  return (
    <button
      type="button"
      onClick={() => onChange(currentValue === value ? null : value)}
      className={`
        flex-1 py-1.5 rounded-lg border-2 text-center transition-all text-xs font-medium
        ${getColorClasses()}
      `}
    >
      {label}
    </button>
  )
}

function KnowledgeItem({
  item,
  fieldPath
}: {
  item: { id: string; text: string; careCoordinatorOnly?: boolean }
  fieldPath: string
}) {
  const { control } = useFormContext<SupervisionFormData>()

  return (
    <Controller
      name={fieldPath as never}
      control={control}
      render={({ field }) => (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start gap-2 mb-2">
            {item.careCoordinatorOnly && (
              <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded">
                CC
              </span>
            )}
            <span className="text-sm text-gray-800">{item.text}</span>
          </div>
          <div className="flex gap-1">
            {ratingOptions.map((option) => (
              <RatingButton
                key={option.value}
                value={option.value}
                currentValue={field.value as CapacityFocusRating}
                onChange={(v) => field.onChange(v)}
                label={option.label}
              />
            ))}
          </div>
        </div>
      )}
    />
  )
}

export function KnowledgeAreasSection() {
  const { watch } = useFormContext<SupervisionFormData>()
  const knowledge = watch('knowledgeAreas')

  // Calculate completion
  const generalCompleted = Object.values(knowledge?.generalItems || {}).filter(v => v !== null).length
  const ccCompleted = Object.values(knowledge?.careCoordinatorOnlyItems || {}).filter(v => v !== null).length

  const totalItems = knowledgeAreasGeneralItems.length + knowledgeAreasCareCoordItems.length
  const completedItems = generalCompleted + ccCompleted
  const percentComplete = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Knowledge Areas</h2>
              <p className="text-sm text-gray-500">
                Areas where the supervisor helped gain knowledge
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-pink-600">{percentComplete}%</div>
            <div className="text-xs text-gray-500">{completedItems}/{totalItems} items</div>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">
            The Clinical Director/Supervisor helped the supervisee gain knowledge in the areas of...
          </h3>
        </div>

        {/* General Items */}
        <div className="p-4 space-y-3">
          {knowledgeAreasGeneralItems.map((item) => (
            <KnowledgeItem
              key={item.id}
              item={item}
              fieldPath={`knowledgeAreas.generalItems.${item.id}`}
            />
          ))}
        </div>
      </div>

      {/* Care Coordinator Only Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 bg-teal-50 border-b border-teal-200">
          <h3 className="font-medium text-teal-900">For Care Coordinators Only</h3>
          <p className="text-sm text-teal-700">Additional knowledge areas for Care Coordinators</p>
        </div>
        <div className="p-4 space-y-3">
          {knowledgeAreasCareCoordItems.map((item) => (
            <KnowledgeItem
              key={item.id}
              item={item}
              fieldPath={`knowledgeAreas.careCoordinatorOnlyItems.${item.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
