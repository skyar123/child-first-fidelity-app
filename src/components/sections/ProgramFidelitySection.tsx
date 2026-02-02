import { useFormContext, Controller } from 'react-hook-form'
import { AccordionItem, AccordionGroup, TextField } from '@/components/ui'
import {
  programFidelitySections,
  getSectionProgress,
  type ProgramFidelityItem,
  type FidelityRating,
} from '@/data/programFidelityItems'
import type { FormData } from '@/types/form.types'
import { ClipboardList, Building2 } from 'lucide-react'

const RATING_OPTIONS: { value: FidelityRating; label: string; color: string }[] = [
  { value: 0, label: '0', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 1, label: '1', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { value: 2, label: '2', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 3, label: '3', color: 'bg-green-100 text-green-700 border-green-300' },
]

const RATING_LABELS = {
  0: 'Not present',
  1: 'Early development or a little progress',
  2: 'In place or good progress',
  3: 'Excellent progress or accomplished',
}

export function ProgramFidelitySection() {
  const { control, watch } = useFormContext<FormData>()
  const programFidelityRatings = watch('programFidelity.ratings') || {}

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Building2 className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Child First Program Fidelity Checklist
              </h2>
              <p className="text-sm text-gray-600">
                Revised October 2019
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> This self-assessment should be completed by the Clinical
              Director/Supervisor in collaboration with Clinical Teams. Complete at 3 months post
              implementation, at 6 months, and every 6 months thereafter.
            </p>
          </div>

          {/* Rating Scale Legend */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Rating Scale:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {RATING_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${option.color}`}>
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-600">
                    {RATING_LABELS[option.value!]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Header Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="programFidelity.affiliateSiteName"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Name of Affiliate Site"
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Enter affiliate site name"
                />
              )}
            />
            <Controller
              name="programFidelity.dateCompleted"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Date Completed"
                  type="date"
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center gap-2 px-1">
        <ClipboardList className="w-5 h-5 text-indigo-600" />
        <h3 className="text-base font-semibold text-gray-900">Fidelity Assessment Sections</h3>
      </div>

      {/* Checklist Sections */}
      <AccordionGroup>
        {programFidelitySections.map((section, index) => {
          const { completed, total } = getSectionProgress(section.id, programFidelityRatings)
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0

          return (
            <AccordionItem
              key={section.id}
              title={`${section.number}. ${section.title}`}
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
                  {completed}/{total}
                </span>
              }
              defaultOpen={index === 0}
            >
              <div className="space-y-4">
                {section.items.map((item) => (
                  <ProgramFidelityItemRow
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </AccordionItem>
          )
        })}
      </AccordionGroup>
    </div>
  )
}

function ProgramFidelityItemRow({
  item,
}: {
  item: ProgramFidelityItem
}) {
  const { control, watch } = useFormContext<FormData>()
  const currentRating = watch(`programFidelity.ratings.${item.id}`)

  // Sub-items are displayed as bullet points without ratings
  if (item.isSubItem) {
    return (
      <div className="ml-6 flex items-start gap-2 py-1">
        <span className="text-gray-400 mt-0.5">○</span>
        <span className="text-sm text-gray-700">{item.text}</span>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      {/* Item Text */}
      <div className="flex items-start gap-3">
        <span className="text-sm text-gray-900 flex-1">{item.text}</span>
      </div>

      {/* Rating Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 mr-2">Rating:</span>
        <Controller
          name={`programFidelity.ratings.${item.id}` as `programFidelity.ratings.${string}`}
          control={control}
          render={({ field }) => (
            <div className="flex gap-1">
              {RATING_OPTIONS.map((option) => {
                const isSelected = field.value === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(isSelected ? null : option.value)}
                    className={`
                      w-8 h-8 rounded-lg border-2 text-sm font-medium transition-all
                      ${isSelected
                        ? option.color + ' border-current shadow-sm'
                        : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                      }
                    `}
                    title={RATING_LABELS[option.value!]}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          )}
        />
        {currentRating !== null && currentRating !== undefined && (
          <span className="text-xs text-gray-500 ml-2">
            ({RATING_LABELS[currentRating as keyof typeof RATING_LABELS]})
          </span>
        )}
      </div>

      {/* Comment Field */}
      <Controller
        name={`programFidelity.comments.${item.id}` as `programFidelity.comments.${string}`}
        control={control}
        render={({ field }) => (
          <textarea
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder="Add comments (optional)..."
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     placeholder:text-gray-400 resize-none"
          />
        )}
      />
    </div>
  )
}
