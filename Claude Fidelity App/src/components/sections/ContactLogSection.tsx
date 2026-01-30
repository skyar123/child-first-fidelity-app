import { useFormContext, useFieldArray, Controller } from 'react-hook-form'
import {
  TextField,
  SelectField,
  CheckboxGroup,
  ArrayField,
  AddButton,
} from '@/components/ui'
import {
  CONTACT_TYPE_OPTIONS,
  SESSION_STATUS_OPTIONS,
  REASON_NOT_ATTENDING_OPTIONS,
  SESSION_LOCATION_OPTIONS,
  WHO_ATTENDED_OPTIONS,
  createContactLogEntry,
} from '@/data/formSchema'
import type { FormData } from '@/types/form.types'
import { Calendar } from 'lucide-react'

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
            <h2 className="text-lg font-semibold text-gray-900">Contact Log</h2>
            <p className="text-sm text-gray-500">
              {fields.length} contact{fields.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
          <button
            type="button"
            onClick={() => append(createContactLogEntry(nextSessionNumber))}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Calendar className="w-4 h-4" />
            Add Contact
          </button>
        </div>

        {fields.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">
              No contacts recorded yet. Add your first contact entry.
            </p>
            <AddButton
              onClick={() => append(createContactLogEntry(1))}
              label="Add First Contact"
              className="max-w-xs mx-auto"
            />
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {fields.map((entry, index) => (
              <ContactEntry
                key={entry.id}
                index={index}
                onRemove={() => remove(index)}
              />
            ))}
            <AddButton
              onClick={() => append(createContactLogEntry(nextSessionNumber))}
              label="Add Contact"
            />
          </div>
        )}
      </div>

      {/* Summary (shown when entries exist) */}
      {fields.length > 0 && <ContactSummary />}
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
  const { register, control, watch } = useFormContext<FormData>()

  const sessionStatus = watch(`contactLog.${index}.sessionStatus`)
  const whoAttended = watch(`contactLog.${index}.whoAttended`)
  const contactDate = watch(`contactLog.${index}.date`)

  const showReasonNotAttending = sessionStatus === 'Cancel' || sessionStatus === 'No Show'
  const showCollateralSpecify = whoAttended?.includes('collateral')

  const formatDateForTitle = (dateStr: string) => {
    if (!dateStr) return `Contact #${index + 1}`
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <ArrayField
      title={formatDateForTitle(contactDate)}
      onRemove={onRemove}
    >
      <div className="space-y-4">
        {/* Row 1: Date, Type, Minutes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextField
            label="Date"
            type="date"
            {...register(`contactLog.${index}.date`)}
          />
          <SelectField
            label="Contact Type"
            options={CONTACT_TYPE_OPTIONS}
            placeholder="Select type"
            {...register(`contactLog.${index}.contactType`)}
          />
          <TextField
            label="Minutes"
            type="number"
            min="0"
            max="480"
            {...register(`contactLog.${index}.minutes`, { valueAsNumber: true })}
          />
        </div>

        {/* Row 2: Status and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Session Status"
            options={SESSION_STATUS_OPTIONS}
            placeholder="Select status"
            {...register(`contactLog.${index}.sessionStatus`)}
          />
          {showReasonNotAttending && (
            <SelectField
              label="Reason Not Attending"
              options={REASON_NOT_ATTENDING_OPTIONS}
              placeholder="Select reason"
              {...register(`contactLog.${index}.reasonNotAttending`)}
            />
          )}
          <SelectField
            label="Where Held"
            options={SESSION_LOCATION_OPTIONS}
            placeholder="Select location"
            {...register(`contactLog.${index}.whereHeld`)}
          />
        </div>

        {/* Who Attended */}
        <Controller
          name={`contactLog.${index}.whoAttended`}
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              label="Who Attended"
              options={WHO_ATTENDED_OPTIONS}
              value={field.value || []}
              onChange={field.onChange}
              columns={3}
            />
          )}
        />

        {showCollateralSpecify && (
          <TextField
            label="Collateral (specify)"
            placeholder="Name and role of collateral"
            {...register(`contactLog.${index}.collateralSpecify`)}
          />
        )}
      </div>
    </ArrayField>
  )
}

function ContactSummary() {
  const { watch } = useFormContext<FormData>()
  const contacts = watch('contactLog')

  // Calculate summary stats
  const totalContacts = contacts.length
  const showedContacts = contacts.filter((c) => c.sessionStatus === 'Show').length
  const cancelledContacts = contacts.filter((c) => c.sessionStatus === 'Cancel').length
  const noShowContacts = contacts.filter((c) => c.sessionStatus === 'No Show').length
  const totalMinutes = contacts
    .filter((c) => c.sessionStatus === 'Show')
    .reduce((sum, c) => sum + (typeof c.minutes === 'number' ? c.minutes : 0), 0)

  // Count by type
  const byType = contacts.reduce(
    (acc, c) => {
      if (c.contactType && c.sessionStatus === 'Show') {
        acc[c.contactType] = (acc[c.contactType] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Summary</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalContacts}</div>
            <div className="text-xs text-blue-600">Total Contacts</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{showedContacts}</div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {cancelledContacts + noShowContacts}
            </div>
            <div className="text-xs text-yellow-600">Cancelled/No Show</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m
            </div>
            <div className="text-xs text-purple-600">Total Time</div>
          </div>
        </div>

        {/* Contact types breakdown */}
        {Object.keys(byType).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Completed by Type
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(byType).map(([type, count]) => (
                <span
                  key={type}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                >
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
