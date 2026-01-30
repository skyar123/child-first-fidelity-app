import { useFormContext, Controller } from 'react-hook-form'
import type { SupervisionFormData, YesNoResponse } from '@/types/supervision.types'
import { proceduralFidelityItems } from '@/data/supervisionItems'
import { ClipboardCheck } from 'lucide-react'

export function ProceduralFidelitySection() {
  const { control, watch } = useFormContext<SupervisionFormData>()
  const items = watch('proceduralFidelity.items')

  // Calculate completion
  const completedCount = Object.values(items || {}).filter(v => v !== null).length
  const totalCount = proceduralFidelityItems.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <ClipboardCheck className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Procedural Fidelity</h2>
              <p className="text-sm text-gray-500">
                Supervision attendance and preparation practices
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-pink-600">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500">{completedCount}/{totalCount} items</div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 text-sm font-medium text-gray-700">
            <div>Item</div>
            <div className="text-center w-20">No</div>
            <div className="text-center w-32">Yes (≥80%)</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {proceduralFidelityItems.map((item) => (
            <Controller
              key={item.id}
              name={`proceduralFidelity.items.${item.id}`}
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 hover:bg-gray-50 transition-colors items-center">
                  <div className="flex items-start gap-2">
                    {item.childFirstOnly && (
                      <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded mt-0.5">
                        CF
                      </span>
                    )}
                    <span className="text-sm text-gray-800">{item.text}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => field.onChange(field.value === 'no' ? null : 'no' as YesNoResponse)}
                    className={`
                      w-20 py-2 rounded-lg border-2 text-sm font-medium transition-all
                      ${field.value === 'no'
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }
                    `}
                  >
                    No
                  </button>

                  <button
                    type="button"
                    onClick={() => field.onChange(field.value === 'yes' ? null : 'yes' as YesNoResponse)}
                    className={`
                      w-32 py-2 rounded-lg border-2 text-sm font-medium transition-all
                      ${field.value === 'yes'
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }
                    `}
                  >
                    Yes (≥80%)
                  </button>
                </div>
              )}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
        <h3 className="font-medium text-pink-800 mb-2">Response Options</h3>
        <ul className="text-sm text-pink-700 space-y-1">
          <li><strong>No:</strong> Practice does not occur regularly</li>
          <li><strong>Yes (≥80%):</strong> Practice occurs usually, at least 80% of the time</li>
        </ul>
      </div>
    </div>
  )
}
