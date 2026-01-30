import { useFormContext, Controller } from 'react-hook-form'
import { AccordionItem, AccordionGroup } from '@/components/ui'
import {
  assessmentSections,
  isItemVisible,
  NO_TRAUMA_VALUE,
  type AssessmentItem,
  type AssessmentSection,
} from '@/data/assessmentItems'
import type { FormData } from '@/types/form.types'
import { AlertTriangle, Info } from 'lucide-react'

export function AssessmentChecklistSection() {
  const { watch } = useFormContext<FormData>()
  const childTraumaHistory = watch('assessmentChecklist.childTraumaHistory')
  const hasTraumaHistory = childTraumaHistory !== '' && childTraumaHistory !== NO_TRAUMA_VALUE

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Assessment & Engagement Checklist
          </h2>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <p className="text-gray-600">
            Complete each item as you progress through the assessment phase. Items marked with{' '}
            <span className="inline-flex items-center px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              CF
            </span>{' '}
            are Child First specific.
          </p>

          {/* Trauma history indicator */}
          {childTraumaHistory && (
            <div
              className={`flex items-start gap-2 p-3 rounded-lg ${
                hasTraumaHistory
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-green-50 border border-green-200'
              }`}
            >
              {hasTraumaHistory ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Child has known trauma history
                    </p>
                    <p className="text-yellow-700 text-xs mt-0.5">
                      All trauma-related items are shown and should be completed.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">
                      No known trauma history
                    </p>
                    <p className="text-green-700 text-xs mt-0.5">
                      Some trauma-specific items are hidden as they don't apply.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      <AccordionGroup>
        {assessmentSections.map((section, index) => (
          <SectionAccordion key={section.id} section={section} index={index} />
        ))}
      </AccordionGroup>
    </div>
  )
}

function SectionAccordion({
  section,
  index,
}: {
  section: AssessmentSection
  index: number
}) {
  const { watch, getValues } = useFormContext<FormData>()
  const formValues = getValues()

  // Count visible items and completed items
  const visibleItems = section.items.filter((item) =>
    isItemVisible(item, formValues as unknown as Record<string, unknown>)
  )
  const checklistItems = watch('assessmentChecklist.items')
  const completedCount = visibleItems.filter((item) => {
    const itemData = checklistItems?.[item.id]
    return itemData?.done === true
  }).length

  const progress =
    visibleItems.length > 0
      ? Math.round((completedCount / visibleItems.length) * 100)
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
          {completedCount}/{visibleItems.length}
        </span>
      }
      defaultOpen={index === 0}
    >
      <div className="space-y-4">
        {section.items.map((item) => (
          <AssessmentItemRow key={item.id} item={item} />
        ))}
      </div>
    </AccordionItem>
  )
}

function AssessmentItemRow({ item }: { item: AssessmentItem }) {
  const { control, getValues } = useFormContext<FormData>()
  const formValues = getValues()

  // Check visibility
  if (!isItemVisible(item, formValues as unknown as Record<string, unknown>)) {
    return null
  }

  const basePath = `assessmentChecklist.items.${item.id}`

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {/* Item header with done checkbox */}
      <div className="flex items-start gap-3 mb-2">
        <Controller
          name={`${basePath}.done` as never}
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={field.value || false}
              onChange={(e) => field.onChange(e.target.checked)}
              className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          )}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {item.number && (
              <span className="text-sm font-semibold text-gray-500">
                {item.number}.
              </span>
            )}
            {item.childFirstOnly && (
              <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">
                CF
              </span>
            )}
            <span className="text-sm text-gray-900">{item.text}</span>
          </div>
        </div>
      </div>

      {/* Sub-items or options */}
      {item.type === 'multi-checkbox' && item.subItems && (
        <div className="ml-8 mt-3 space-y-2">
          {item.subItems.map((subItem) => (
            <Controller
              key={subItem.id}
              name={`${basePath}.subItems.${subItem.id}` as never}
              control={control}
              render={({ field }) => (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{subItem.text}</span>
                </label>
              )}
            />
          ))}
        </div>
      )}

      {item.type === 'radio' && item.options && (
        <div className="ml-8 mt-3">
          <Controller
            name={`${basePath}.response` as never}
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                {item.options?.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-2 p-2 rounded cursor-pointer ${
                      field.value === option.value
                        ? 'bg-blue-50 ring-1 ring-blue-200'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${basePath}.response`}
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={() => field.onChange(option.value)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>
      )}

      {/* N/A indicator for conditional items */}
      {item.conditionalOn && (
        <div className="ml-8 mt-2">
          <Controller
            name={`${basePath}.na` as never}
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-4 h-4 text-gray-500 border-gray-300 rounded focus:ring-gray-400"
                />
                Mark as N/A
              </label>
            )}
          />
        </div>
      )}
    </div>
  )
}
