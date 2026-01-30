import { useFormContext, useFieldArray, Controller } from 'react-hook-form'
import {
  TextField,
  SelectField,
  CheckboxGroup,
  RadioGroup,
  ArrayField,
  AddButton,
} from '@/components/ui'
import {
  ETHNICITY_OPTIONS,
  LANGUAGE_OPTIONS,
  GENDER_OPTIONS,
  TRANSLATOR_OPTIONS,
  INVOLVEMENT_OPTIONS,
  CAREGIVER_RELATIONSHIP_OPTIONS,
  createSibling,
  createCaregiver,
} from '@/data/formSchema'
import type { FormData } from '@/types/form.types'

const MAX_SIBLINGS = 8
const MAX_CAREGIVERS = 3

export function DemographicsSection() {
  const { register, control, watch } = useFormContext<FormData>()

  // Siblings array
  const {
    fields: siblings,
    append: appendSibling,
    remove: removeSibling,
  } = useFieldArray({
    control,
    name: 'siblings',
  })

  // Caregivers array
  const {
    fields: caregivers,
    append: appendCaregiver,
    remove: removeCaregiver,
  } = useFieldArray({
    control,
    name: 'caregivers',
  })

  // Watch for "Other" selections
  const targetGender = watch('targetChild.gender')
  const targetEthnicity = watch('targetChild.ethnicity')
  const targetLanguages = watch('targetChild.languages')

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
      {/* Case Identification */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Case Identification
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Clinical Team Names"
              {...register('caseIdentification.clinicalTeamNames')}
            />
            <TextField
              label="Client Initials"
              {...register('caseIdentification.clientInitials')}
            />
            <TextField
              label="Child First Site"
              {...register('caseIdentification.childFirstSite')}
            />
            <TextField
              label="Date"
              type="date"
              {...register('caseIdentification.date')}
            />
            <TextField
              label="CareLogic ID"
              {...register('caseIdentification.careLogicId')}
            />
            <TextField
              label="CPP Treatment Start Date"
              type="date"
              {...register('caseIdentification.cppTreatmentStartDate')}
            />
          </div>

          <Controller
            name="caseIdentification.languageTreatmentConducted"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                label="Language(s) Treatment Conducted In"
                options={LANGUAGE_OPTIONS}
                value={field.value || []}
                onChange={field.onChange}
                columns={3}
              />
            )}
          />

          <Controller
            name="caseIdentification.translatorUsed"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Translator Used"
                name="translatorUsed"
                options={TRANSLATOR_OPTIONS}
                value={field.value || ''}
                onChange={field.onChange}
                layout="horizontal"
              />
            )}
          />
        </div>
      </section>

      {/* Target Child */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Target Child</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Age (in months)"
              type="number"
              min="0"
              max="72"
              {...register('targetChild.ageInMonths', { valueAsNumber: true })}
            />
            <SelectField
              label="Gender"
              options={GENDER_OPTIONS}
              placeholder="Select gender"
              {...register('targetChild.gender')}
            />
            {targetGender === 'other' && (
              <TextField
                label="Gender (specify)"
                {...register('targetChild.genderSpecify')}
                className="md:col-span-2"
              />
            )}
          </div>

          <Controller
            name="targetChild.ethnicity"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                label="Ethnicity"
                options={ETHNICITY_OPTIONS}
                value={field.value || []}
                onChange={field.onChange}
                columns={3}
              />
            )}
          />
          {targetEthnicity?.includes('other') && (
            <TextField
              label="Ethnicity (specify)"
              {...register('targetChild.ethnicitySpecify')}
            />
          )}

          <Controller
            name="targetChild.languages"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                label="Language(s)"
                options={LANGUAGE_OPTIONS}
                value={field.value || []}
                onChange={field.onChange}
                columns={3}
              />
            )}
          />
          {targetLanguages?.includes('other') && (
            <TextField
              label="Language (specify)"
              {...register('targetChild.languageSpecify')}
            />
          )}
        </div>
      </section>

      {/* Siblings */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Siblings</h2>
            <p className="text-sm text-gray-500">
              {siblings.length} of {MAX_SIBLINGS} maximum
            </p>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {siblings.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No siblings added. Click below to add a sibling.
            </p>
          ) : (
            siblings.map((sibling, index) => (
              <SiblingField
                key={sibling.id}
                index={index}
                onRemove={() => removeSibling(index)}
              />
            ))
          )}
          <AddButton
            onClick={() => appendSibling(createSibling())}
            label="Add Sibling"
            disabled={siblings.length >= MAX_SIBLINGS}
          />
        </div>
      </section>

      {/* Caregivers */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Caregivers</h2>
            <p className="text-sm text-gray-500">
              {caregivers.length} of {MAX_CAREGIVERS} maximum
            </p>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {caregivers.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No caregivers added. Click below to add a caregiver.
            </p>
          ) : (
            caregivers.map((caregiver, index) => (
              <CaregiverField
                key={caregiver.id}
                index={index}
                onRemove={() => removeCaregiver(index)}
              />
            ))
          )}
          <AddButton
            onClick={() =>
              appendCaregiver(createCaregiver((caregivers.length + 1) as 1 | 2 | 3))
            }
            label="Add Caregiver"
            disabled={caregivers.length >= MAX_CAREGIVERS}
          />
        </div>
      </section>
    </div>
  )
}

// Sibling sub-component
function SiblingField({
  index,
  onRemove,
}: {
  index: number
  onRemove: () => void
}) {
  const { register, control } = useFormContext<FormData>()

  const inTreatmentOptions = [
    { value: 'no', label: 'No' },
    { value: 'sometimes', label: 'Sometimes' },
    { value: 'yes', label: 'Yes' },
  ]

  return (
    <ArrayField title={`Sibling ${index + 1}`} onRemove={onRemove}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <TextField
          label="Age (in years)"
          type="number"
          min="0"
          max="30"
          {...register(`siblings.${index}.ageInYears`, { valueAsNumber: true })}
        />
        <SelectField
          label="Gender"
          options={[
            { value: 'M', label: 'Male' },
            { value: 'F', label: 'Female' },
            { value: 'O', label: 'Other' },
          ]}
          placeholder="Select"
          {...register(`siblings.${index}.gender`)}
        />
        <TextField
          label="Relation to Child"
          {...register(`siblings.${index}.relationToChild`)}
        />
        <TextField
          label="Where Resides"
          {...register(`siblings.${index}.whereResides`)}
        />
        <Controller
          name={`siblings.${index}.inTreatmentWithChild`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="In Treatment with Child"
              options={inTreatmentOptions}
              placeholder="Select"
              value={field.value || ''}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </ArrayField>
  )
}

// Caregiver sub-component
function CaregiverField({
  index,
  onRemove,
}: {
  index: number
  onRemove: () => void
}) {
  const { register, control, watch } = useFormContext<FormData>()

  const ethnicity = watch(`caregivers.${index}.ethnicity`)
  const languages = watch(`caregivers.${index}.languages`)

  return (
    <ArrayField
      title={`Caregiver ${index + 1}`}
      onRemove={onRemove}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <TextField
            label="Age (in years)"
            type="number"
            min="0"
            max="100"
            {...register(`caregivers.${index}.ageInYears`, { valueAsNumber: true })}
          />
          <TextField
            label="Years of Education"
            type="number"
            min="0"
            max="30"
            {...register(`caregivers.${index}.yearsOfEducation`, {
              valueAsNumber: true,
            })}
          />
          <SelectField
            label="Relationship to Child"
            options={CAREGIVER_RELATIONSHIP_OPTIONS}
            placeholder="Select relationship"
            {...register(`caregivers.${index}.relationshipToChild`)}
          />
        </div>

        <Controller
          name={`caregivers.${index}.ethnicity`}
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              label="Ethnicity"
              options={ETHNICITY_OPTIONS}
              value={field.value || []}
              onChange={field.onChange}
              columns={3}
            />
          )}
        />
        {ethnicity?.includes('other') && (
          <TextField
            label="Ethnicity (specify)"
            {...register(`caregivers.${index}.ethnicitySpecify`)}
          />
        )}

        <Controller
          name={`caregivers.${index}.languages`}
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              label="Language(s)"
              options={LANGUAGE_OPTIONS}
              value={field.value || []}
              onChange={field.onChange}
              columns={3}
            />
          )}
        />
        {languages?.includes('other') && (
          <TextField
            label="Language (specify)"
            {...register(`caregivers.${index}.languageSpecify`)}
          />
        )}

        <Controller
          name={`caregivers.${index}.involvedInTreatment`}
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Involved in Treatment"
              name={`caregiver-${index}-involvement`}
              options={INVOLVEMENT_OPTIONS}
              value={field.value || ''}
              onChange={field.onChange}
              layout="horizontal"
            />
          )}
        />
      </div>
    </ArrayField>
  )
}
