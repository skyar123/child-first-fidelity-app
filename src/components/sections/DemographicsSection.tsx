import { useFormContext, useFieldArray, Controller } from 'react-hook-form'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { TextField, SelectField, CheckboxGroup } from '@/components/ui'
import {
  GENDER_OPTIONS,
  ETHNICITY_OPTIONS,
  LANGUAGE_OPTIONS,
  INSURANCE_TYPE_OPTIONS,
  LIVING_SITUATION_OPTIONS,
  RELATIONSHIP_OPTIONS,
  SIBLING_RELATIONSHIP_OPTIONS,
  EDUCATION_OPTIONS,
  EMPLOYMENT_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
  createSibling,
  createCaregiver,
} from '@/data/formSchema'
import type { FormData } from '@/types/form.types'

export function DemographicsSection() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <CaseIdentificationCard />
      <TargetChildCard />
      <SiblingsCard />
      <CaregiversCard />
    </div>
  )
}

function CaseIdentificationCard() {
  const { control } = useFormContext<FormData>()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Client Registration</h2>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="caseIdentification.clinicalTeamNames"
            control={control}
            render={({ field }) => (
              <TextField
                label="Clinical Team Names"
                value={field.value}
                onChange={field.onChange}
                placeholder="Enter team member names"
              />
            )}
          />
          <Controller
            name="caseIdentification.clientInitials"
            control={control}
            render={({ field }) => (
              <TextField
                label="Client Initials"
                value={field.value}
                onChange={field.onChange}
                placeholder="e.g., JD"
              />
            )}
          />
          <Controller
            name="caseIdentification.date"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          />
          <Controller
            name="caseIdentification.referralSource"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Referral Source"
                value={field.value}
                onChange={field.onChange}
                options={REFERRAL_SOURCE_OPTIONS}
              />
            )}
          />
        </div>
        <Controller
          name="caseIdentification.referralReason"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Referral
              </label>
              <textarea
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Describe the reason for referral..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}

function TargetChildCard() {
  const { control } = useFormContext<FormData>()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Target Child Information</h2>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="targetChild.ageInMonths"
            control={control}
            render={({ field }) => (
              <TextField
                label="Age (in months)"
                value={field.value?.toString() || ''}
                onChange={(val) => field.onChange(val ? parseInt(val) : null)}
                type="number"
                placeholder="e.g., 36"
              />
            )}
          />
          <Controller
            name="targetChild.gender"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Gender"
                value={field.value}
                onChange={field.onChange}
                options={GENDER_OPTIONS}
              />
            )}
          />
          <Controller
            name="targetChild.primaryLanguage"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Primary Language"
                value={field.value}
                onChange={field.onChange}
                options={LANGUAGE_OPTIONS}
              />
            )}
          />
          <Controller
            name="targetChild.insuranceType"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Insurance Type"
                value={field.value}
                onChange={field.onChange}
                options={INSURANCE_TYPE_OPTIONS}
              />
            )}
          />
          <Controller
            name="targetChild.livingSituation"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Living Situation"
                value={field.value}
                onChange={field.onChange}
                options={LIVING_SITUATION_OPTIONS}
              />
            )}
          />
        </div>
        <Controller
          name="targetChild.ethnicity"
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              label="Ethnicity (check all that apply)"
              value={field.value}
              onChange={field.onChange}
              options={ETHNICITY_OPTIONS}
              columns={2}
            />
          )}
        />
      </div>
    </div>
  )
}

function SiblingsCard() {
  const { control } = useFormContext<FormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'siblings',
  })
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Siblings ({fields.length})
        </h2>
        {fields.length < 8 && (
          <button
            type="button"
            onClick={() => {
              append(createSibling())
              setExpandedIndex(fields.length)
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Sibling
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-200">
        {fields.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No siblings added yet. Click "Add Sibling" to add one.
          </div>
        ) : (
          fields.map((field, index) => (
            <SiblingEntry
              key={field.id}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
              onRemove={() => remove(index)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function SiblingEntry({
  index,
  isExpanded,
  onToggle,
  onRemove,
}: {
  index: number
  isExpanded: boolean
  onToggle: () => void
  onRemove: () => void
}) {
  const { control, watch } = useFormContext<FormData>()
  const initials = watch(`siblings.${index}.initials`)

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">
          Sibling {index + 1}{initials && `: ${initials}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="p-1 rounded hover:bg-red-100"
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
        <div className="px-4 pb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name={`siblings.${index}.initials`}
              control={control}
              render={({ field }) => (
                <TextField
                  label="Initials"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="e.g., AB"
                />
              )}
            />
            <Controller
              name={`siblings.${index}.ageInMonths`}
              control={control}
              render={({ field }) => (
                <TextField
                  label="Age (in months)"
                  value={field.value?.toString() || ''}
                  onChange={(val) => field.onChange(val ? parseInt(val) : null)}
                  type="number"
                />
              )}
            />
            <Controller
              name={`siblings.${index}.gender`}
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Gender"
                  value={field.value}
                  onChange={field.onChange}
                  options={GENDER_OPTIONS}
                />
              )}
            />
            <Controller
              name={`siblings.${index}.relationship`}
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Relationship to Child"
                  value={field.value}
                  onChange={field.onChange}
                  options={SIBLING_RELATIONSHIP_OPTIONS}
                />
              )}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <Controller
              name={`siblings.${index}.livesWithChild`}
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Lives with child</span>
                </label>
              )}
            />
            <Controller
              name={`siblings.${index}.includedInTreatment`}
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Included in treatment</span>
                </label>
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function CaregiversCard() {
  const { control } = useFormContext<FormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'caregivers',
  })
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Caregivers ({fields.length})
        </h2>
        {fields.length < 3 && (
          <button
            type="button"
            onClick={() => {
              append(createCaregiver())
              setExpandedIndex(fields.length)
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Caregiver
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-200">
        {fields.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No caregivers added yet. Click "Add Caregiver" to add one.
          </div>
        ) : (
          fields.map((field, index) => (
            <CaregiverEntry
              key={field.id}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
              onRemove={() => remove(index)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function CaregiverEntry({
  index,
  isExpanded,
  onToggle,
  onRemove,
}: {
  index: number
  isExpanded: boolean
  onToggle: () => void
  onRemove: () => void
}) {
  const { control, watch } = useFormContext<FormData>()
  const initials = watch(`caregivers.${index}.initials`)
  const relationship = watch(`caregivers.${index}.relationship`)
  const relationshipLabel = RELATIONSHIP_OPTIONS.find(o => o.value === relationship)?.label

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">
          Caregiver {index + 1}
          {(initials || relationshipLabel) && `: ${initials || ''} ${relationshipLabel ? `(${relationshipLabel})` : ''}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="p-1 rounded hover:bg-red-100"
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
        <div className="px-4 pb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name={`caregivers.${index}.initials`}
              control={control}
              render={({ field }) => (
                <TextField
                  label="Initials"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="e.g., AB"
                />
              )}
            />
            <Controller
              name={`caregivers.${index}.relationship`}
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Relationship to Child"
                  value={field.value}
                  onChange={field.onChange}
                  options={RELATIONSHIP_OPTIONS}
                />
              )}
            />
            <Controller
              name={`caregivers.${index}.age`}
              control={control}
              render={({ field }) => (
                <TextField
                  label="Age (in years)"
                  value={field.value?.toString() || ''}
                  onChange={(val) => field.onChange(val ? parseInt(val) : null)}
                  type="number"
                />
              )}
            />
            <Controller
              name={`caregivers.${index}.gender`}
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Gender"
                  value={field.value}
                  onChange={field.onChange}
                  options={GENDER_OPTIONS}
                />
              )}
            />
            <Controller
              name={`caregivers.${index}.primaryLanguage`}
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Primary Language"
                  value={field.value}
                  onChange={field.onChange}
                  options={LANGUAGE_OPTIONS}
                />
              )}
            />
            <Controller
              name={`caregivers.${index}.education`}
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Education"
                  value={field.value}
                  onChange={field.onChange}
                  options={EDUCATION_OPTIONS}
                />
              )}
            />
            <Controller
              name={`caregivers.${index}.employment`}
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Employment"
                  value={field.value}
                  onChange={field.onChange}
                  options={EMPLOYMENT_OPTIONS}
                />
              )}
            />
          </div>
          <Controller
            name={`caregivers.${index}.ethnicity`}
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                label="Ethnicity (check all that apply)"
                value={field.value}
                onChange={field.onChange}
                options={ETHNICITY_OPTIONS}
                columns={2}
              />
            )}
          />
          <div className="flex flex-wrap gap-4">
            <Controller
              name={`caregivers.${index}.isPrimaryCaregiver`}
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Primary caregiver</span>
                </label>
              )}
            />
            <Controller
              name={`caregivers.${index}.livesWithChild`}
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Lives with child</span>
                </label>
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}
