import { useFormContext, useFieldArray } from 'react-hook-form'
import type { TerminationFormData } from '@/types/termination.types'
import { ClipboardList, Plus, Trash2 } from 'lucide-react'
import { createContactLogEntry } from '@/data/terminationSchema'
import {
  contactTypeOptions,
  sessionStatusOptions,
  reasonNotAttendingOptions,
  sessionLocationOptions,
} from '@/data/terminationItems'

export function TerminationContactLogSection() {
  const { control, register, watch } = useFormContext<TerminationFormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactLog.entries',
  })

  const entries = watch('contactLog.entries')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg shadow-sm p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                CPP Contact Log
              </h2>
              <p className="text-sm text-gray-600">
                Track treatment participation during the termination phase
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {fields.length}
            </div>
            <div className="text-xs text-gray-500">entries</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Instructions:</strong> Use to track treatment participation during the termination phase.
          Complete for any contact, and add additional details for scheduled sessions (not phone contacts).
        </p>
      </div>

      {/* Add Entry Button */}
      <button
        type="button"
        onClick={() => append(createContactLogEntry())}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Contact Entry</span>
      </button>

      {/* Contact Entries */}
      {fields.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No contact entries yet. Click above to add one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Contact Entry #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Row 1: Date, Contact Type, Minutes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      {...register(`contactLog.entries.${index}.date`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Type</label>
                    <select
                      {...register(`contactLog.entries.${index}.contactType`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select...</option>
                      {contactTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
                    <input
                      type="number"
                      {...register(`contactLog.entries.${index}.minutes`, { valueAsNumber: true })}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Row 2: Session Status, Reason, Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Status</label>
                    <select
                      {...register(`contactLog.entries.${index}.sessionStatus`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select...</option>
                      {sessionStatusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Not Attending</label>
                    <select
                      {...register(`contactLog.entries.${index}.reasonNotAttending`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={entries[index]?.sessionStatus !== 'no_show' && entries[index]?.sessionStatus !== 'cancel'}
                    >
                      <option value="">Select...</option>
                      {reasonNotAttendingOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Where Held</label>
                    <select
                      {...register(`contactLog.entries.${index}.whereHeld`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select...</option>
                      {sessionLocationOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: Who Attended */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Who Attended</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        {...register(`contactLog.entries.${index}.whoAttended.targetChild`)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      Target child
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        {...register(`contactLog.entries.${index}.whoAttended.caregiver1`)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      Caregiver 1
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        {...register(`contactLog.entries.${index}.whoAttended.caregiver2`)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      Caregiver 2
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        {...register(`contactLog.entries.${index}.whoAttended.sibling1`)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      Sibling 1
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        {...register(`contactLog.entries.${index}.whoAttended.sibling2`)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      Sibling 2
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        {...register(`contactLog.entries.${index}.whoAttended.collateral`)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      Collateral
                    </label>
                  </div>
                  {entries[index]?.whoAttended?.collateral && (
                    <input
                      type="text"
                      {...register(`contactLog.entries.${index}.whoAttended.collateralSpecify`)}
                      placeholder="Specify collateral..."
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>

                {/* Session Counter */}
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session #</label>
                  <input
                    type="number"
                    {...register(`contactLog.entries.${index}.sessionCounter`, { valueAsNumber: true })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
