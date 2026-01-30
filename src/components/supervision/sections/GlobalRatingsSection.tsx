import { useFormContext, Controller } from 'react-hook-form'
import type { SupervisionFormData, GlobalRating } from '@/types/supervision.types'
import { globalRatingItems } from '@/data/supervisionItems'
import { Star } from 'lucide-react'

const ratingOptions: { value: GlobalRating; label: string }[] = [
  { value: 'not_at_all', label: 'Not at all' },
  { value: 'a_little', label: 'A little' },
  { value: 'somewhat', label: 'Somewhat' },
  { value: 'very', label: 'Very' },
  { value: 'extremely', label: 'Extremely' }
]

function RatingButton({
  value,
  currentValue,
  onChange,
  label,
  index
}: {
  value: GlobalRating
  currentValue: GlobalRating
  onChange: (v: GlobalRating) => void
  label: string
  index: number
}) {
  const isSelected = currentValue === value

  const getColorClasses = () => {
    if (!isSelected) return 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'

    // Gradient from red to green based on rating level
    switch (index) {
      case 0: // Not at all
        return 'bg-red-50 border-red-500 text-red-700'
      case 1: // A little
        return 'bg-orange-50 border-orange-500 text-orange-700'
      case 2: // Somewhat
        return 'bg-yellow-50 border-yellow-500 text-yellow-700'
      case 3: // Very
        return 'bg-lime-50 border-lime-500 text-lime-700'
      case 4: // Extremely
        return 'bg-green-50 border-green-500 text-green-700'
      default:
        return 'bg-gray-50 border-gray-500 text-gray-700'
    }
  }

  return (
    <button
      type="button"
      onClick={() => onChange(currentValue === value ? null : value)}
      className={`
        flex-1 py-2 rounded-lg border-2 text-center transition-all text-xs font-medium
        ${getColorClasses()}
      `}
    >
      {label}
    </button>
  )
}

function GlobalRatingItem({
  item,
  index
}: {
  item: { id: string; text: string }
  index: number
}) {
  const { control } = useFormContext<SupervisionFormData>()

  return (
    <Controller
      name={`globalRatings.items.${item.id}` as never}
      control={control}
      render={({ field }) => (
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-700 font-bold text-sm">{index + 1}</span>
            </div>
            <p className="text-gray-800 font-medium">{item.text}</p>
          </div>
          <div className="flex gap-2">
            {ratingOptions.map((option, optIndex) => (
              <RatingButton
                key={option.value}
                value={option.value}
                currentValue={field.value as GlobalRating}
                onChange={(v) => field.onChange(v)}
                label={option.label}
                index={optIndex}
              />
            ))}
          </div>
        </div>
      )}
    />
  )
}

export function GlobalRatingsSection() {
  const { watch, register } = useFormContext<SupervisionFormData>()
  const ratings = watch('globalRatings')

  // Calculate completion
  const completedItems = globalRatingItems.filter(item => ratings?.items?.[item.id] !== null && ratings?.items?.[item.id] !== undefined).length
  const totalItems = globalRatingItems.length
  const percentComplete = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Global Ratings</h2>
              <p className="text-sm text-gray-500">
                Overall assessment of supervisor's CPP knowledge and skills
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-600">{percentComplete}%</div>
            <div className="text-xs text-gray-500">{completedItems}/{totalItems} items</div>
          </div>
        </div>
      </div>

      {/* Rating Scale Legend */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Rating Scale</h3>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-sm text-red-700">Not at all (1)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-sm text-orange-700">A little (2)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-sm text-yellow-700">Somewhat (3)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-lime-50 border border-lime-200 rounded-lg">
            <span className="w-2 h-2 bg-lime-500 rounded-full" />
            <span className="text-sm text-lime-700">Very (4)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-green-700">Extremely (5)</span>
          </div>
        </div>
      </div>

      {/* Global Rating Items */}
      <div className="space-y-4">
        {globalRatingItems.map((item, index) => (
          <GlobalRatingItem
            key={item.id}
            item={item}
            index={index}
          />
        ))}
      </div>

      {/* Strengths & Suggestions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <label className="block font-medium text-gray-900 mb-2">
          What specific strengths and/or suggestions for growth do you have for your Clinical Director/Supervisor?
        </label>
        <textarea
          {...register('globalRatings.strengthsAndSuggestions')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          placeholder="Share your thoughts on strengths and areas for growth..."
        />
      </div>

      {/* Help Text */}
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <h3 className="font-medium text-amber-800 mb-2">About These Ratings</h3>
        <p className="text-sm text-amber-700">
          These global ratings provide an overall assessment of your Clinical Director/Supervisor's
          expertise in Child-Parent Psychotherapy. Your honest feedback helps improve supervision
          quality and training programs.
        </p>
      </div>
    </div>
  )
}
