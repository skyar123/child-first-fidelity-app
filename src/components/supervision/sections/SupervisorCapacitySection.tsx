import { useFormContext, Controller } from 'react-hook-form'
import type { SupervisionFormData, CapacityFocusRating } from '@/types/supervision.types'
import {
  supervisorCapacityGeneralItems,
  supervisorCapacityClinicianItems,
  supervisorCapacityCareCoordItems,
} from '@/data/supervisionItems'
import { UserCog } from 'lucide-react'

const ratingOptions: { value: CapacityFocusRating; label: string; color: string }[] = [
  { value: 'could_do_less', label: 'Could Do Less', color: 'blue' },
  { value: 'could_do_more', label: 'Could Do More', color: 'yellow' },
  { value: 'appropriate', label: 'Appropriate', color: 'green' },
  { value: 'strength', label: 'Strength', color: 'purple' }
]

function RatingButton({
  value,
  currentValue,
  onChange,
  label,
  compact = false
}: {
  value: CapacityFocusRating
  currentValue: CapacityFocusRating
  onChange: (v: CapacityFocusRating) => void
  label: string
  compact?: boolean
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
        flex-1 py-1.5 rounded-lg border-2 text-center transition-all
        ${getColorClasses()}
        ${compact ? 'text-[10px]' : 'text-xs'} font-medium
      `}
    >
      {label}
    </button>
  )
}

function CapacityItem({
  item,
  fieldPath,
  compact = false
}: {
  item: { id: string; text: string; childFirstOnly?: boolean; clinicianOnly?: boolean; careCoordinatorOnly?: boolean }
  fieldPath: string
  compact?: boolean
}) {
  const { control } = useFormContext<SupervisionFormData>()

  return (
    <Controller
      name={fieldPath as never}
      control={control}
      render={({ field }) => (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start gap-2 mb-2">
            {item.childFirstOnly && (
              <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                CF
              </span>
            )}
            {item.clinicianOnly && (
              <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                Clin
              </span>
            )}
            {item.careCoordinatorOnly && (
              <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded">
                CC
              </span>
            )}
            <span className={`${compact ? 'text-xs' : 'text-sm'} text-gray-800`}>{item.text}</span>
          </div>
          <div className="flex gap-1">
            {ratingOptions.map((option) => (
              <RatingButton
                key={option.value}
                value={option.value}
                currentValue={field.value as CapacityFocusRating}
                onChange={(v) => field.onChange(v)}
                label={option.label}
                compact={compact}
              />
            ))}
          </div>
        </div>
      )}
    />
  )
}

export function SupervisorCapacitySection() {
  const { watch } = useFormContext<SupervisionFormData>()
  const capacity = watch('supervisorCapacity')

  // Calculate completion
  const generalCompleted = Object.values(capacity?.generalItems || {}).filter(v => v !== null).length
  const clinicianCompleted = Object.values(capacity?.clinicianOnlyItems || {}).filter(v => v !== null).length
  const ccCompleted = Object.values(capacity?.careCoordinatorOnlyItems || {}).filter(v => v !== null).length

  const totalItems = supervisorCapacityGeneralItems.length +
    supervisorCapacityClinicianItems.length +
    supervisorCapacityCareCoordItems.length
  const completedItems = generalCompleted + clinicianCompleted + ccCompleted
  const percentComplete = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <UserCog className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Clinical Director/Supervisor Capacity
              </h2>
              <p className="text-sm text-gray-500">
                Rate the supervisor's capacity in each area
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-pink-600">{percentComplete}%</div>
            <div className="text-xs text-gray-500">{completedItems}/{totalItems} items</div>
          </div>
        </div>
      </div>

      {/* General Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">General Capacity Items</h3>
          <p className="text-sm text-gray-500">For all supervisees</p>
        </div>
        <div className="p-4 space-y-3">
          {supervisorCapacityGeneralItems.map((item) => (
            <CapacityItem
              key={item.id}
              item={item}
              fieldPath={`supervisorCapacity.generalItems.${item.id}`}
            />
          ))}
        </div>
      </div>

      {/* Clinician Only Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <h3 className="font-medium text-blue-900">For Clinicians Only</h3>
          <p className="text-sm text-blue-700">Complete if you are a Clinician</p>
        </div>
        <div className="p-4 space-y-3">
          {supervisorCapacityClinicianItems.map((item) => (
            <CapacityItem
              key={item.id}
              item={item}
              fieldPath={`supervisorCapacity.clinicianOnlyItems.${item.id}`}
            />
          ))}
        </div>
      </div>

      {/* Care Coordinator Only Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 bg-teal-50 border-b border-teal-200">
          <h3 className="font-medium text-teal-900">For Care Coordinators Only</h3>
          <p className="text-sm text-teal-700">Complete if you are a Care Coordinator</p>
        </div>
        <div className="p-4 space-y-3">
          {supervisorCapacityCareCoordItems.map((item) => (
            <CapacityItem
              key={item.id}
              item={item}
              fieldPath={`supervisorCapacity.careCoordinatorOnlyItems.${item.id}`}
              compact
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
        <h3 className="font-medium text-pink-800 mb-2">Rating Scale</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-pink-700">
          <div><strong>Could Do Less:</strong> Over-emphasis in this area</div>
          <div><strong>Could Do More:</strong> Under-emphasis in this area</div>
          <div><strong>Appropriate:</strong> Good balance given needs</div>
          <div><strong>Strength:</strong> Exceptional capability</div>
        </div>
      </div>
    </div>
  )
}
