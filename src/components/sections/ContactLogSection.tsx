import { useFormContext, useFieldArray, Controller } from 'react-hook-form'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { TextField, SelectField, CheckboxGroup } from '@/components/ui'
import {
  CONTACT_TYPE_OPTIONS,
  SESSION_STATUS_OPTIONS,
  REASON_NOT_ATTENDING_OPTIONS,
  SESSION_LOCATION_OPTIONS,
  WHO_ATTENDED_OPTIONS,
  createContactLogEntry,
} from '@/data/formSchema'
import type { FormData } from '@/types/form.types'

export function ContactLogSection() {
  const { control } = useFormContext<FormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactLog',
  })

  const nextSessionNumber = fields.length + 1

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">CPP Contact Log</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {fields.length} {fields.length === 1 ? 'contact' : 'contacts'} recorded
            </p>
          </div>
          <button
            type="button"
            onClick={() => append(createContactLogEntry(nextSessionNumber))}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>

        {/* Summary stats */}
        <ContactSummary />
      </div>

      {/* Contact entries */}
      <div className="space-y-3">
        {fields.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">No contacts recorded yet.</p>
            <button
              type="button"
              onClick={() => append(createContactLogEntry(1))}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add First Contact
            </button>
          </div>
        ) : (
          fields.map((field, index) => (
            <ContactEntry
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function ContactSummary() {
  const { watch } = useFormContext<FormData>()
  const contacts = watch('contactLog')

  const completedSessions = contacts.filter(c => c.sessionStatus === 'completed').length
  const cancelledSessions = contacts.filter(c =>
    c.sessionStatus === 'cancelled_client' ||
    c.sessionStatus === 'cancelled_provider'
  ).length
  const noShows = contacts.filter(c => c.sessionStatus === 'no_show').length
  const totalMinutes = contacts.reduce((sum, c) => sum + (c.sessionDuration || 0), 0)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{completedSessions}</div>
        <div className="text-xs text-gray-500">Completed</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-600">{cancelledSessions}</div>
        <div className="text-xs text-gray-500">Cancelled</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-red-600">{noShows}</div>
        <div className="text-xs text-gray-500">No Shows</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{totalMinutes}</div>
        <div className="text-xs text-gray-500">Total Minutes</div>
      </div>
    </div>
  )
}

function ContactEntry({
  index,
  onRemove,
}: {
  index: number
  onRemove: () => void
}) {
  const { control, watch } = useFormContext<FormData>()
  const [isExpanded, setIsExpanded] = useState(index === 0)

  const date = watch(`contactLog.${index}.date`)
  const contactType = watch(`contactLog.${index}.contactType`)
  const sessionStatus = watch(`contactLog.${index}.sessionStatus`)

  const contactTypeLabel = CONTACT_TYPE_OPTIONS.find(o => o.value === contactType)?.label || 'Unknown'
  const statusLabel = SESSION_STATUS_OPTIONS.find(o => o.value === sessionStatus)?.label

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'cancelled_client':
      case 'cancelled_provider':
        return 'bg-yellow-100 text-yellow-700'
      case 'no_show':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
            {index + 1}
          </span>
          <div className="text-left">
            <div className="font-medium text-gray-900">
              {date ? new Date(date).toLocaleDateString() : 'No date'} - {contactTypeLabel}
            </div>
            {sessionStatus && (
              <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(sessionStatus)}`}>
                {statusLabel}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (confirm('Are you sure you want to delete this contact?')) {
                onRemove()
              }
            }}
            className="p-1.5 rounded hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Controller
              name={`contactLog.${index}.date`}
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            />
            <Controller
              name={`contactLog.${index}.contactType`}
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Contact Type"
                  value={field.value}
                  onChange={field.onChange}
                  options={CONTACT_TYPE_OPTIONS}
                />
              )}
            />
            <Controller
              name={`contactLog.${index}.sessionStatus`}
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Session Status"
                  value={field.value}
                  onChange={field.onChange}
                  options={SESSION_STATUS_OPTIONS}
                />
              )}
            />
            <Controller
              name={`contactLog.${index}.reasonNotAttending`}
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Reason Not Attending"
                  value={field.value}
                  onChange={field.onChange}
                  options={REASON_NOT_ATTENDING_OPTIONS}
                />
              )}
            />
            <Controller
              name={`contactLog.${index}.sessionLocation`}
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Session Location"
                  value={field.value}
                  onChange={field.onChange}
                  options={SESSION_LOCATION_OPTIONS}
                />
              )}
            />
            <Controller
              name={`contactLog.${index}.sessionDuration`}
              control={control}
              render={({ field }) => (
                <TextField
                  label="Duration (minutes)"
                  value={field.value?.toString() || ''}
                  onChange={(val) => field.onChange(val ? parseInt(val) : null)}
                  type="number"
                  placeholder="e.g., 60"
                />
              )}
            />
            <Controller
              name={`contactLog.${index}.travelTime`}
              control={control}
              render={({ field }) => (
                <TextField
                  label="Travel Time (minutes)"
                  value={field.value?.toString() || ''}
                  onChange={(val) => field.onChange(val ? parseInt(val) : null)}
                  type="number"
                  placeholder="e.g., 30"
                />
              )}
            />
          </div>

          <Controller
            name={`contactLog.${index}.whoAttended`}
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                label="Who Attended (check all that apply)"
                value={field.value}
                onChange={field.onChange}
                options={WHO_ATTENDED_OPTIONS}
                columns={2}
              />
            )}
          />

          <Controller
            name={`contactLog.${index}.notes`}
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Session notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            )}
          />
        </div>
      )}
    </div>
  )
}
