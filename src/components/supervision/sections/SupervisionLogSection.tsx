import { useFormContext, useFieldArray } from 'react-hook-form'
import type { SupervisionFormData } from '@/types/supervision.types'
import { ClipboardList, Plus, Trash2, Calendar } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

export function SupervisionLogSection() {
  const { register, control, watch } = useFormContext<SupervisionFormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'supervisionLog'
  })

  const supervisionLog = watch('supervisionLog')

  // Calculate totals
  const totalMinutes = supervisionLog?.reduce((sum, entry) => sum + (entry.minutes || 0), 0) || 0
  const totalEntries = supervisionLog?.length || 0

  const addEntry = () => {
    append({
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      numSupervisees: null,
      minutes: null,
      percentClinical: '',
      counter: '',
      notes: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <ClipboardList className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Supervision Log</h2>
              <p className="text-sm text-gray-500">
                Track supervision hours for reporting
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-600">{fields.length}</div>
            <div className="text-xs text-gray-500">entries</div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-100 rounded-lg p-3 border border-slate-300">
          <div className="text-xs text-slate-600 font-medium">Total Entries</div>
          <div className="text-xl font-bold text-slate-800">{totalEntries}</div>
          <div className="text-xs text-slate-500">sessions logged</div>
        </div>
        <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
          <div className="text-xs text-pink-600 font-medium">Total Time</div>
          <div className="text-xl font-bold text-pink-700">{totalMinutes}</div>
          <div className="text-xs text-pink-500">minutes ({(totalMinutes / 60).toFixed(1)} hrs)</div>
        </div>
      </div>

      {/* Add Entry Button */}
      <button
        type="button"
        onClick={addEntry}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
      >
        <Plus className="w-5 h-5" />
        Add Supervision Entry
      </button>

      {/* Log Entries */}
      {fields.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No supervision entries yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Click the button above to add your first entry
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Entry Header */}
              <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">Entry #{index + 1}</span>
                  <input
                    type="date"
                    {...register(`supervisionLog.${index}.date`)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  aria-label="Remove entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Entry Content */}
              <div className="p-4">
                {/* Main Fields Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      # Supervisees
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register(`supervisionLog.${index}.numSupervisees`, { valueAsNumber: true })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Minutes
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      {...register(`supervisionLog.${index}.minutes`, { valueAsNumber: true })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      % Clinical
                    </label>
                    <input
                      type="text"
                      {...register(`supervisionLog.${index}.percentClinical`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="80%"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Counter
                    </label>
                    <input
                      type="text"
                      {...register(`supervisionLog.${index}.counter`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    {...register(`supervisionLog.${index}.notes`)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                    placeholder="Topics covered, cases discussed, etc."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <h3 className="font-medium text-slate-800 mb-2">About the Supervision Log</h3>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• <strong># Supervisees:</strong> Number of supervisees in the session</li>
          <li>• <strong>Minutes:</strong> Total duration of supervision session</li>
          <li>• <strong>% Clinical:</strong> Percentage of time spent on clinical discussion</li>
          <li>• <strong>Counter:</strong> Optional tracking identifier</li>
        </ul>
      </div>
    </div>
  )
}
