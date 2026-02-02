import { useFormContext, useFieldArray, Controller } from 'react-hook-form'
import { Plus, Trash2, ChevronDown, User, Users, Baby, Lightbulb } from 'lucide-react'
import { useState } from 'react'
import { TextField, SelectField, CheckboxGroup, HelpTooltip } from '@/components/ui'
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
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto stagger-children">
      {/* Welcome tip */}
      <div className="glass-card-gradient rounded-2xl p-4 flex items-start gap-3 slide-up-fade">
        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/30">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Getting Started</h3>
          <p className="text-sm text-gray-600">
            Start by filling out the client registration information. Your progress is automatically saved as you type!
          </p>
        </div>
      </div>

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
    <div className="glass-card rounded-2xl overflow-hidden card-hover">
      <div className="px-4 py-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/30">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold gradient-text">Client Registration</h2>
            <p className="text-xs text-gray-500">Basic case information</p>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="caseIdentification.clinicalTeamNames"
            control={control}
            render={({ field }) => (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">Clinical Team Names</label>
                  <HelpTooltip content="Enter the names of all team members working on this case" />
                </div>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Enter team member names"
                  className="w-full px-4 py-2.5 glass-input rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            )}
          />
          <Controller
            name="caseIdentification.clientInitials"
            control={control}
            render={({ field }) => (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">Client Initials</label>
                  <HelpTooltip content="Use initials for privacy (e.g., JD for John Doe)" />
                </div>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="e.g., JD"
                  className="w-full px-4 py-2.5 glass-input rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            )}
          />
          <Controller
            name="caseIdentification.date"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full px-4 py-2.5 glass-input rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 glass-input rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all"
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
    <div className="glass-card rounded-2xl overflow-hidden card-hover">
      <div className="px-4 py-4 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl shadow-lg shadow-pink-500/30">
            <Baby className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
              Target Child Information
            </h2>
            <p className="text-xs text-gray-500">Child demographics and details</p>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="targetChild.ageInMonths"
            control={control}
            render={({ field }) => (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">Age (in months)</label>
                  <HelpTooltip content="Enter age in months for children under 6 (e.g., 36 for 3 years)" />
                </div>
                <input
                  type="number"
                  value={field.value?.toString() || ''}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="e.g., 36"
                  className="w-full px-4 py-2.5 glass-input rounded-xl text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
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
    <div className="glass-card rounded-2xl overflow-hidden card-hover">
      <div className="px-4 py-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-b border-white/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl shadow-lg shadow-violet-500/30">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              Siblings
            </h2>
            <p className="text-xs text-gray-500">{fields.length} sibling{fields.length !== 1 ? 's' : ''} added</p>
          </div>
        </div>
        {fields.length < 8 && (
          <button
            type="button"
            onClick={() => {
              append(createSibling())
              setExpandedIndex(fields.length)
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
                     bg-gradient-to-r from-violet-500 to-purple-500 text-white 
                     rounded-xl hover:from-violet-600 hover:to-purple-600 
                     transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50
                     hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Add Sibling
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-100">
        {fields.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center empty-state-icon">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-1">No siblings added yet</p>
            <p className="text-sm text-gray-400">Click "Add Sibling" to add one</p>
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
    <div className={`transition-all ${isExpanded ? 'bg-violet-50/50' : 'hover:bg-gray-50/50'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
            isExpanded 
              ? 'bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-lg shadow-violet-500/30' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {index + 1}
          </div>
          <span className="font-medium text-gray-900">
            Sibling {index + 1}{initials && `: ${initials}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="p-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 slide-up-fade">
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
          <div className="flex flex-wrap gap-4 p-3 bg-white/50 rounded-xl">
            <Controller
              name={`siblings.${index}.livesWithChild`}
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-5 h-5 text-violet-500 border-gray-300 rounded-lg focus:ring-violet-500 checkbox-animate"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Lives with child</span>
                </label>
              )}
            />
            <Controller
              name={`siblings.${index}.includedInTreatment`}
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-5 h-5 text-violet-500 border-gray-300 rounded-lg focus:ring-violet-500 checkbox-animate"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Included in treatment</span>
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
    <div className="glass-card rounded-2xl overflow-hidden card-hover">
      <div className="px-4 py-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-white/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/30">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Caregivers
            </h2>
            <p className="text-xs text-gray-500">{fields.length} caregiver{fields.length !== 1 ? 's' : ''} added</p>
          </div>
        </div>
        {fields.length < 3 && (
          <button
            type="button"
            onClick={() => {
              append(createCaregiver())
              setExpandedIndex(fields.length)
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
                     bg-gradient-to-r from-emerald-500 to-teal-500 text-white 
                     rounded-xl hover:from-emerald-600 hover:to-teal-600 
                     transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50
                     hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Add Caregiver
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-100">
        {fields.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center empty-state-icon">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-1">No caregivers added yet</p>
            <p className="text-sm text-gray-400">Click "Add Caregiver" to add one</p>
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
    <div className={`transition-all ${isExpanded ? 'bg-emerald-50/50' : 'hover:bg-gray-50/50'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
            isExpanded 
              ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {index + 1}
          </div>
          <span className="font-medium text-gray-900">
            Caregiver {index + 1}
            {(initials || relationshipLabel) && `: ${initials || ''} ${relationshipLabel ? `(${relationshipLabel})` : ''}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="p-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 slide-up-fade">
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
          <div className="flex flex-wrap gap-4 p-3 bg-white/50 rounded-xl">
            <Controller
              name={`caregivers.${index}.isPrimaryCaregiver`}
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-5 h-5 text-emerald-500 border-gray-300 rounded-lg focus:ring-emerald-500 checkbox-animate"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Primary caregiver</span>
                </label>
              )}
            />
            <Controller
              name={`caregivers.${index}.livesWithChild`}
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-5 h-5 text-emerald-500 border-gray-300 rounded-lg focus:ring-emerald-500 checkbox-animate"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Lives with child</span>
                </label>
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}
