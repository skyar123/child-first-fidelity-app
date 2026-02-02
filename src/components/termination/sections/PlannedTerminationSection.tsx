import { useFormContext, Controller } from 'react-hook-form'
import type { TerminationFormData } from '@/types/termination.types'
import { ClipboardCheck, Check } from 'lucide-react'
import { plannedTerminationItems } from '@/data/terminationItems'

export function PlannedTerminationSection() {
  const { control, watch } = useFormContext<TerminationFormData>()
  const plannedData = watch('plannedTermination')

  // Calculate completion
  const items = plannedTerminationItems
  const completedCount = items.filter(item => {
    const value = plannedData.items[item.id as keyof typeof plannedData.items]
    return value !== null && value !== undefined && typeof value === 'boolean'
  }).length
  const totalCount = items.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg shadow-sm p-4 border border-yellow-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClipboardCheck className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Procedural Fidelity: Planned Termination
              </h2>
              <p className="text-sm text-gray-600">
                Guidelines for termination planning when families are able to collaborate
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-600">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500">{completedCount}/{totalCount} items</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>Instructions:</strong> Families often have great difficulty saying goodbye and may drop-out at any time during termination.
          This checklist is a guideline for termination planning when families are able to collaborate in the process.
          If treatment was abrupt, indicate which elements you were able to do.
        </p>
      </div>

      {/* Not Done Option */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <Controller
          name="plannedTermination.notDone"
          control={control}
          render={({ field }) => (
            <label className={`
              flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
              ${field.value
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}>
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <div>
                <span className="font-medium text-gray-900">Not done</span>
                <p className="text-sm text-gray-500">
                  Family dropped from treatment. Complete Procedural Fidelity: Unplanned Termination instead.
                </p>
              </div>
            </label>
          )}
        />
      </div>

      {/* Checklist Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-[1fr_80px] gap-4 text-sm font-medium text-gray-700">
            <div>Item</div>
            <div className="text-center">Done</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {plannedTerminationItems.map((item) => (
            <Controller
              key={item.id}
              name={`plannedTermination.items.${item.id}` as any}
              control={control}
              render={({ field }) => (
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-[1fr_80px] gap-4 items-start">
                    <div>
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">
                          {item.itemNumber}
                        </span>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{item.title}</span>
                          {item.description && (
                            <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Less than option */}
                      {item.hasLessThanOption && (
                        <Controller
                          name={`plannedTermination.items.${item.id.replace('_', '_lessThan').replace('planned', 'lessThan2Months').replace('told', 'lessThan1Month')}` as any}
                          control={control}
                          render={({ field: ltField }) => (
                            <label className="flex items-center gap-2 mt-2 ml-8 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={ltField.value as boolean}
                                onChange={(e) => ltField.onChange(e.target.checked)}
                                className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                              />
                              <span className="text-sm text-gray-600">{item.lessThanLabel}</span>
                            </label>
                          )}
                        />
                      )}
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => field.onChange(field.value === true ? null : true)}
                        className={`
                          w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all
                          ${field.value === true
                            ? 'bg-green-50 border-green-500 text-green-600'
                            : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                          }
                        `}
                      >
                        <Check className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
