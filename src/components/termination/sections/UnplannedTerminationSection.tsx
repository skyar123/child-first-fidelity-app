import { useFormContext, Controller } from 'react-hook-form'
import type { TerminationFormData } from '@/types/termination.types'
import { AlertTriangle, Check } from 'lucide-react'
import { unplannedTerminationItems } from '@/data/terminationItems'

export function UnplannedTerminationSection() {
  const { control, watch } = useFormContext<TerminationFormData>()
  const unplannedData = watch('unplannedTermination')

  // Calculate completion
  const items = unplannedTerminationItems
  const completedCount = items.filter(item => {
    const value = unplannedData.items[item.id as keyof typeof unplannedData.items]
    return value !== null && value !== undefined
  }).length
  const totalCount = items.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg shadow-sm p-4 border border-orange-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Procedural Fidelity: Unplanned Termination
              </h2>
              <p className="text-sm text-gray-600">
                Steps to follow when family drops from treatment unexpectedly
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500">{completedCount}/{totalCount} items</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
        <p className="text-sm text-orange-800">
          <strong>Instructions:</strong> Complete this section when a family has dropped from treatment
          unexpectedly and a planned termination was not possible. These steps help ensure proper case closure
          and leave the door open for the family to return in the future.
        </p>
      </div>

      {/* Checklist Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-[auto_1fr_80px] gap-4 text-sm font-medium text-gray-700">
            <div>Item #</div>
            <div>Description</div>
            <div className="text-center">Done</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {unplannedTerminationItems.map((item) => (
            <Controller
              key={item.id}
              name={`unplannedTermination.items.${item.id}` as any}
              control={control}
              render={({ field }) => (
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-[auto_1fr_80px] gap-4 items-start">
                    <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded font-medium">
                      {item.itemNumber}
                    </span>
                    <div>
                      <span className="font-medium text-gray-900">{item.title}</span>
                      {item.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {item.description}
                        </p>
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

      {/* Tips */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-2">Important Reminders</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Make at least 4 weeks of phone calls and letters to attempt re-engagement</li>
          <li>• Contact referral source if a valid Release of Information exists</li>
          <li>• Discuss barriers with Clinical Director before closing</li>
          <li>• Send "Close File" letter indicating family can return in the future</li>
          <li>• Follow your agency's specific case closing procedures</li>
        </ul>
      </div>
    </div>
  )
}
