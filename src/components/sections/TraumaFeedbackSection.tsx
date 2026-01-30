import { useFormContext, Controller } from 'react-hook-form'
import { AccordionItem, AccordionGroup } from '@/components/ui'
import {
  traumaFeedbackSections,
  FEEDBACK_QUALITY_LABELS,
  type TraumaFeedbackItem,
  type TraumaFeedbackSection,
} from '@/data/traumaFeedbackItems'
import type { FormData } from '@/types/form.types'
import { AlertTriangle } from 'lucide-react'

export function TraumaFeedbackSection() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Trauma-Informed CPP Feedback Session
          </h2>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">
                Trauma Feedback Session
              </p>
              <p className="text-yellow-700 text-xs mt-0.5">
                This section documents the trauma-informed feedback session with the caregiver.
                Rate each item on how fully it was completed.
              </p>
            </div>
          </div>

          <p className="text-gray-600">
            Items marked with{' '}
            <span className="inline-flex items-center px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              CF
            </span>{' '}
            are Child First specific.
          </p>

          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">Rating Scale:</span>
              {FEEDBACK_QUALITY_LABELS.map((label, i) => (
                <span key={label} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                  {i} = {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Session Date */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <SessionDateField />
      </div>

      {/* Sections */}
      <AccordionGroup>
        {traumaFeedbackSections.map((section, index) => (
          <FeedbackSectionAccordion key={section.id} section={section} index={index} />
        ))}
      </AccordionGroup>

      {/* Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Session Notes</h3>
        </div>
        <div className="p-4">
          <SessionNotesField />
        </div>
      </div>
    </div>
  )
}

function SessionDateField() {
  const { control } = useFormContext<FormData>()

  return (
    <Controller
      name="traumaFeedback.sessionDate"
      control={control}
      render={({ field }) => (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Feedback Session Date
          </label>
          <input
            type="date"
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
    />
  )
}

function SessionNotesField() {
  const { control } = useFormContext<FormData>()

  return (
    <Controller
      name="traumaFeedback.notes"
      control={control}
      render={({ field }) => (
        <textarea
          value={field.value || ''}
          onChange={(e) => field.onChange(e.target.value)}
          placeholder="Add any additional notes about the feedback session..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      )}
    />
  )
}

function FeedbackSectionAccordion({
  section,
  index,
}: {
  section: TraumaFeedbackSection
  index: number
}) {
  const { watch } = useFormContext<FormData>()
  const feedbackItems = watch('traumaFeedback.items')

  // Count completed items
  const completedCount = section.items.filter((item) => {
    const rating = feedbackItems?.[item.id]
    return rating !== undefined && rating !== null && rating > 0
  }).length

  const progress =
    section.items.length > 0
      ? Math.round((completedCount / section.items.length) * 100)
      : 0

  return (
    <AccordionItem
      title={section.title}
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
          {completedCount}/{section.items.length}
        </span>
      }
      defaultOpen={index === 0}
    >
      <div className="space-y-3">
        {section.items.map((item) => (
          <FeedbackItemRow key={item.id} item={item} />
        ))}
      </div>
    </AccordionItem>
  )
}

function FeedbackItemRow({ item }: { item: TraumaFeedbackItem }) {
  const { control } = useFormContext<FormData>()

  return (
    <Controller
      name={`traumaFeedback.items.${item.id}` as never}
      control={control}
      render={({ field }) => (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start gap-2 mb-2">
            {item.number && (
              <span className="text-sm font-semibold text-gray-500">
                {item.number}.
              </span>
            )}
            {item.childFirstOnly && (
              <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                CF
              </span>
            )}
            <span className="text-sm text-gray-800">{item.text}</span>
          </div>
          <div className="flex gap-2">
            {FEEDBACK_QUALITY_LABELS.map((label, i) => {
              const isSelected = field.value === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => field.onChange(i)}
                  className={`
                    flex-1 py-2 px-1 rounded-lg border-2 text-center transition-all
                    ${isSelected
                      ? getQualityColor(i)
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

function getQualityColor(value: number): string {
  const colors = [
    'bg-red-50 border-red-500 text-red-700',
    'bg-yellow-50 border-yellow-500 text-yellow-700',
    'bg-green-50 border-green-500 text-green-700',
  ]
  return colors[value] || ''
}
