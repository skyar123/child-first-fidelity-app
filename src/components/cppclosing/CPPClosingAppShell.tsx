import { useState, useCallback, useEffect } from 'react'
import { ArrowLeft, Menu, Download, X, FileText, ClipboardList, Calendar, Users, Brain, Heart, Link2, Shield, CheckSquare, Target, Plus, Trash2, Compass, PenLine } from 'lucide-react'
import { useForm, FormProvider, useFormContext, useFieldArray } from 'react-hook-form'
import { AllNotesSection } from '@/components/ui'
import { GroundingExercise } from '@/components/ui/GroundingExercise'
import { FidelityCompass } from '@/components/ui/FidelityCompass'
import { ReflectiveJournal } from '@/components/ui/ReflectiveJournal'
import { getRandomQuote } from '@/utils/wisdomQuotes'
import { GroundingExercise } from '@/components/ui/GroundingExercise'
import { FidelityCompass } from '@/components/ui/FidelityCompass'
import { ReflectiveJournal } from '@/components/ui/ReflectiveJournal'
import {
  type CPPClosingFormData,
  type ChallengeLevel,
  type CapacityLevel,
  type AttendanceStatus,
  type ContactLogEntry,
  type Attendee,
  DEFAULT_CPP_CLOSING_DATA,
  CLOSING_REASONS,
  PLANNED_TERMINATION_ITEMS,
  UNPLANNED_TERMINATION_ITEMS,
  CONTACT_TYPES,
  SESSION_STATUS_OPTIONS,
  NOT_ATTENDING_REASONS,
  LOCATION_OPTIONS,
  ATTENDEE_OPTIONS,
  REFLECTIVE_PRACTICE_CHALLENGES,
  CAPACITY_CONTEXTS,
  EXTERNAL_SUPPORT_ITEMS,
  EMOTIONAL_PROCESS_CHALLENGES,
  EMOTIONAL_CAPACITY_ITEMS,
  DYADIC_CHALLENGES,
  DYADIC_CAPACITY_ITEMS,
  TRAUMA_CHALLENGES,
  TRAUMA_CAPACITY_ITEMS,
  PROCEDURAL_CHALLENGES,
  PROCEDURAL_CAPACITY_ITEMS,
  CPP_OBJECTIVES
} from '@/data/cppClosingItems'

type SectionId =
  | 'identification'
  | 'termination_info'
  | 'planned_termination'
  | 'unplanned_termination'
  | 'contact_log'
  | 'reflective_practice'
  | 'emotional_process'
  | 'dyadic_relational'
  | 'trauma_framework'
  | 'procedural_fidelity'
  | 'cpp_objectives'
  | 'all_notes'
  | 'notes'

interface Section {
  id: SectionId
  label: string
  shortLabel: string
  icon: React.ComponentType<{ className?: string }>
}

const sections: Section[] = [
  { id: 'identification', label: 'Case Identification', shortLabel: 'ID', icon: FileText },
  { id: 'termination_info', label: 'Termination Details', shortLabel: 'Details', icon: ClipboardList },
  { id: 'planned_termination', label: 'Planned Termination', shortLabel: 'Planned', icon: CheckSquare },
  { id: 'unplanned_termination', label: 'Unplanned Termination', shortLabel: 'Unplanned', icon: X },
  { id: 'contact_log', label: 'Contact Log', shortLabel: 'Contacts', icon: Calendar },
  { id: 'reflective_practice', label: 'Reflective Practice', shortLabel: 'Reflective', icon: Brain },
  { id: 'emotional_process', label: 'Emotional Process', shortLabel: 'Emotional', icon: Heart },
  { id: 'dyadic_relational', label: 'Dyadic-Relational', shortLabel: 'Dyadic', icon: Users },
  { id: 'trauma_framework', label: 'Trauma Framework', shortLabel: 'Trauma', icon: Shield },
  { id: 'procedural_fidelity', label: 'Procedural Fidelity', shortLabel: 'Procedural', icon: Link2 },
  { id: 'cpp_objectives', label: 'CPP Objectives', shortLabel: 'Objectives', icon: Target },
  { id: 'all_notes', label: 'Supervision Notes', shortLabel: 'S-Notes', icon: MessageSquare },
  { id: 'notes', label: 'Notes', shortLabel: 'Notes', icon: FileText }
]

const STORAGE_KEY = 'cpp_closing_form'

interface CPPClosingAppShellProps {
  onBack: () => void
}

// ========================================
// Identification Section
// ========================================
function IdentificationSection() {
  const { register } = useFormContext<CPPClosingFormData>()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">CPP Closing Form</h2>
        <p className="text-gray-600">Recapitulation and Termination Phase - Adapted from Child-Parent Psychotherapy</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinical Team Names
            </label>
            <input
              {...register('identification.clinicalTeamNames')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter clinical team member names"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Initials
            </label>
            <input
              {...register('identification.clientInitials')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., JD"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Child First Site
            </label>
            <input
              {...register('identification.childFirstSite')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter site name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month/Year
            </label>
            <input
              type="month"
              {...register('identification.monthYear')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CareLogic ID
            </label>
            <input
              {...register('identification.careLogicId')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter CareLogic ID"
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
          <p className="text-sm text-orange-800">
            <strong>Instructions:</strong> Completed by the Clinical Team and reviewed with Clinical Director/Supervisor during reflective supervision.
            For all Child First sites, to ensure fidelity to trauma-informed CPP and Child First (2 Fidelity cases need to be maintained at all times).
          </p>
        </div>
      </div>
    </div>
  )
}

// ========================================
// Termination Info Section
// ========================================
function TerminationInfoSection() {
  const { register, watch, setValue } = useFormContext<CPPClosingFormData>()
  const terminationPhase = watch('terminationInfo.terminationPhase')
  const initiatedBy = watch('terminationInfo.initiatedBy')
  const terminationType = watch('terminationInfo.terminationType')
  const functioningChange = watch('terminationInfo.functioningChange')
  const prognosis = watch('terminationInfo.prognosis')
  const completedTreatment = watch('terminationInfo.completedTreatment')
  const closingReasons = watch('terminationInfo.closingReasons') || {}
  const transferPlan = watch('terminationInfo.transferToClinicianPlan')

  const handleCompletedTreatmentChange = (checked: boolean) => {
    setValue('terminationInfo.completedTreatment', checked)
    if (checked) {
      // Clear other reasons when completed treatment is selected
      setValue('terminationInfo.closingReasons', {})
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Termination Details</h2>
        <p className="text-gray-600">Document when and how termination occurred</p>
      </div>

      {/* Question 1: When termination occurred */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">1. When did termination occur?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'foundational', label: 'Foundational Phase' },
            { value: 'core_intervention', label: 'Core Intervention Phase' },
            { value: 'termination', label: 'Termination Phase' },
            { value: 'completed_termination', label: 'Completed Termination Phase' }
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                terminationPhase === option.value
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <input
                type="radio"
                {...register('terminationInfo.terminationPhase')}
                value={option.value}
                className="sr-only"
              />
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Question 2: Who initiated */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">2. Who initiated termination?</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'family', label: 'Family' },
            { value: 'clinical_team', label: 'Clinical Team' },
            { value: 'mutual', label: 'Mutually agreed upon' }
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                initiatedBy === option.value
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <input
                type="radio"
                {...register('terminationInfo.initiatedBy')}
                value={option.value}
                className="sr-only"
              />
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Question 3: Type of termination */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">3. Type of termination</h3>
        <div className="space-y-3">
          {[
            { value: 'dropped', label: 'Dropped', desc: 'No termination process possible' },
            { value: 'abrupt', label: 'Abrupt termination', desc: 'Informed of termination but full planned termination not possible' },
            { value: 'planned', label: 'Planned termination', desc: '' }
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                terminationType === option.value
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                {...register('terminationInfo.terminationType')}
                value={option.value}
                className="sr-only"
              />
              <div>
                <span className={`font-medium ${terminationType === option.value ? 'text-orange-700' : 'text-gray-700'}`}>
                  {option.label}
                </span>
                {option.desc && (
                  <p className="text-sm text-gray-500 mt-1">{option.desc}</p>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Question 4: Change in functioning */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">4. Change in functioning</h3>
        <div className="grid grid-cols-5 gap-2">
          {[
            { value: 'much_worse', label: 'Much worse' },
            { value: 'slightly_worse', label: 'Slightly worse' },
            { value: 'no_change', label: 'No change' },
            { value: 'slightly_improved', label: 'Slightly improved' },
            { value: 'much_improved', label: 'Much improved' }
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                functioningChange === option.value
                  ? option.value.includes('worse')
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : option.value === 'no_change'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <input
                type="radio"
                {...register('terminationInfo.functioningChange')}
                value={option.value}
                className="sr-only"
              />
              <span className="text-xs font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Question 5: Prognosis */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">5. Prognosis</h3>
        <div className="grid grid-cols-5 gap-2">
          {[
            { value: 'poor', label: 'Poor' },
            { value: 'fair', label: 'Fair' },
            { value: 'good', label: 'Good' },
            { value: 'excellent', label: 'Excellent' },
            { value: 'unable_to_rate', label: 'Unable to rate' }
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                prognosis === option.value
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <input
                type="radio"
                {...register('terminationInfo.prognosis')}
                value={option.value}
                className="sr-only"
              />
              <span className="text-xs font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Question 6: Reasons for closing */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">6. Reasons for closing (check all that apply)</h3>

        {/* Completed treatment option */}
        <label className={`flex items-center gap-3 p-4 rounded-xl border-2 mb-4 cursor-pointer transition-all ${
          completedTreatment ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
        }`}>
          <input
            type="checkbox"
            checked={completedTreatment}
            onChange={(e) => handleCompletedTreatmentChange(e.target.checked)}
            className="w-5 h-5 rounded text-green-500 focus:ring-green-500"
          />
          <span className={`font-medium ${completedTreatment ? 'text-green-700' : 'text-gray-700'}`}>
            Completed treatment
          </span>
        </label>

        {!completedTreatment && (
          <>
            <p className="text-sm text-gray-600 mb-3">OR select other reasons:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {CLOSING_REASONS.map((reason) => (
                <label
                  key={reason.id}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                    closingReasons[reason.id] ? 'bg-orange-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    {...register(`terminationInfo.closingReasons.${reason.id}`)}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{reason.text}</span>
                </label>
              ))}
            </div>
            {closingReasons['other'] && (
              <div className="mt-3">
                <input
                  {...register('terminationInfo.closingReasonOther')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Specify other reason..."
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Question 7: Transfer plan */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">7. Is part of the plan to transfer family to another CPP Clinician?</h3>
        <div className="grid grid-cols-2 gap-3 max-w-xs">
          {[
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' }
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                transferPlan === option.value
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <input
                type="radio"
                {...register('terminationInfo.transferToClinicianPlan')}
                value={option.value}
                className="sr-only"
              />
              <span className="font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

// ========================================
// Planned Termination Section
// ========================================
function PlannedTerminationSection() {
  const { register, watch, setValue } = useFormContext<CPPClosingFormData>()
  const notDone = watch('plannedTermination.notDone')
  const items = watch('plannedTermination.items') || {}
  const alternates = watch('plannedTermination.alternates') || {}

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Procedural Fidelity: Planned Termination</h2>
        <p className="text-gray-600">
          Families often have great difficulty saying goodbye and may drop-out at any time during termination.
          This checklist is a guideline for termination planning when families are able to collaborate in the process.
        </p>
      </div>

      {/* Not done option */}
      <div className="glass-card rounded-xl p-4">
        <label className={`flex items-center gap-3 cursor-pointer ${notDone ? 'text-amber-700' : 'text-gray-700'}`}>
          <input
            type="checkbox"
            {...register('plannedTermination.notDone')}
            className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500"
          />
          <span className="font-medium">
            Not done (family dropped from treatment.) Complete Procedural Fidelity: Unplanned Termination instead.
          </span>
        </label>
      </div>

      {!notDone && (
        <div className="glass-card rounded-xl p-6">
          <div className="space-y-4">
            {PLANNED_TERMINATION_ITEMS.map((item) => {
              const itemValue = items[item.id]
              const isAlternate = alternates[item.id]

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    itemValue === 'done'
                      ? 'border-green-200 bg-green-50'
                      : itemValue === 'not_done'
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="w-10 h-6 rounded bg-orange-100 text-orange-700 text-xs font-medium flex items-center justify-center flex-shrink-0">
                      {item.itemNumber}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.text}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            {...register(`plannedTermination.items.${item.id}`)}
                            value="done"
                            className="w-4 h-4 text-green-500 focus:ring-green-500"
                          />
                          <span className="text-sm font-medium text-green-700">Done</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            {...register(`plannedTermination.items.${item.id}`)}
                            value="not_done"
                            className="w-4 h-4 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm font-medium text-red-700">Not Done</span>
                        </label>
                        {item.hasAlternate && (
                          <label className="flex items-center gap-2 cursor-pointer ml-4">
                            <input
                              type="checkbox"
                              checked={isAlternate || false}
                              onChange={(e) => setValue(`plannedTermination.alternates.${item.id}`, e.target.checked)}
                              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                            />
                            <span className="text-sm font-medium text-amber-700">{item.alternateText}</span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ========================================
// Unplanned Termination Section
// ========================================
function UnplannedTerminationSection() {
  const { register, watch } = useFormContext<CPPClosingFormData>()
  const items = watch('unplannedTermination') || {}

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Procedural Fidelity: Unplanned Termination</h2>
        <p className="text-gray-600">
          Complete this section when families disengage from treatment unexpectedly.
        </p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="space-y-4">
          {UNPLANNED_TERMINATION_ITEMS.map((item) => {
            const itemValue = items[item.id]

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  itemValue === 'done'
                    ? 'border-green-200 bg-green-50'
                    : itemValue === 'not_done'
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-100 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="w-10 h-6 rounded bg-orange-100 text-orange-700 text-xs font-medium flex items-center justify-center flex-shrink-0">
                    {item.itemNumber}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.text}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          {...register(`unplannedTermination.${item.id}`)}
                          value="done"
                          className="w-4 h-4 text-green-500 focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-green-700">Done</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          {...register(`unplannedTermination.${item.id}`)}
                          value="not_done"
                          className="w-4 h-4 text-red-500 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-red-700">Not Done</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ========================================
// Contact Log Section
// ========================================
function ContactLogSection() {
  const { control, register, watch, setValue } = useFormContext<CPPClosingFormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactLog'
  })

  const contactLog = watch('contactLog')

  const addEntry = () => {
    append({
      id: crypto.randomUUID(),
      date: '',
      contactType: '',
      minutes: '',
      sessionStatus: '',
      notAttendingReason: '',
      attendees: [],
      collateralSpecify: '',
      location: '',
      sessionCounter: ''
    } as ContactLogEntry)
  }

  const toggleAttendee = (index: number, attendee: Attendee) => {
    const currentAttendees = contactLog[index]?.attendees || []
    const newAttendees = currentAttendees.includes(attendee)
      ? currentAttendees.filter((a: Attendee) => a !== attendee)
      : [...currentAttendees, attendee]
    setValue(`contactLog.${index}.attendees`, newAttendees)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">CPP Contact Log</h2>
        <p className="text-gray-600">Track treatment participation during the termination phase</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        {fields.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No contact entries yet</p>
            <button
              type="button"
              onClick={addEntry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Entry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-xl bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-gray-700">Entry #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      {...register(`contactLog.${index}.date`)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Contact Type</label>
                    <select
                      {...register(`contactLog.${index}.contactType`)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select...</option>
                      {CONTACT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Minutes</label>
                    <input
                      type="number"
                      {...register(`contactLog.${index}.minutes`)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Session Status</label>
                    <select
                      {...register(`contactLog.${index}.sessionStatus`)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select...</option>
                      {SESSION_STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Reason Not Attending</label>
                    <select
                      {...register(`contactLog.${index}.notAttendingReason`)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">N/A</option>
                      {NOT_ATTENDING_REASONS.map((reason) => (
                        <option key={reason.value} value={reason.value}>{reason.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                    <select
                      {...register(`contactLog.${index}.location`)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select...</option>
                      {LOCATION_OPTIONS.map((loc) => (
                        <option key={loc.value} value={loc.value}>{loc.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Session #</label>
                    <input
                      {...register(`contactLog.${index}.sessionCounter`)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 24"
                    />
                  </div>
                </div>

                {/* Who Attended Multi-Select */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Who Attended (check all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {ATTENDEE_OPTIONS.map((attendee) => {
                      const isSelected = contactLog[index]?.attendees?.includes(attendee.value) || false
                      return (
                        <button
                          key={attendee.value}
                          type="button"
                          onClick={() => toggleAttendee(index, attendee.value)}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                            isSelected
                              ? 'bg-orange-100 border-orange-400 text-orange-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {attendee.label}
                        </button>
                      )
                    })}
                  </div>
                  {/* Collateral Specify Field */}
                  {contactLog[index]?.attendees?.includes('collateral') && (
                    <div className="mt-2">
                      <input
                        {...register(`contactLog.${index}.collateralSpecify`)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Specify collateral..."
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addEntry}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Entry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ========================================
// Challenge Level Selector Component
// ========================================
function ChallengeLevelSelector({
  value,
  onChange,
  role
}: {
  value: ChallengeLevel
  onChange: (value: ChallengeLevel) => void
  role: 'clinician' | 'ccFrp'
}) {
  const levels: { value: ChallengeLevel; label: string }[] = [
    { value: 'no', label: 'No' },
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Mod' },
    { value: 'significant', label: 'Sig' }
  ]

  return (
    <div className="flex gap-1">
      {levels.map((level) => (
        <button
          key={level.value}
          type="button"
          onClick={() => onChange(level.value)}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            value === level.value
              ? role === 'clinician'
                ? 'bg-blue-500 text-white'
                : 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}

// ========================================
// Capacity Level Selector Component
// ========================================
function CapacityLevelSelector({
  value,
  onChange,
  role
}: {
  value: CapacityLevel
  onChange: (value: CapacityLevel) => void
  role: 'clinician' | 'ccFrp'
}) {
  const levels: { value: CapacityLevel; label: string }[] = [
    { value: 'requires_development', label: 'ReqDev' },
    { value: 'emerging', label: 'Emerging' },
    { value: 'acquired', label: 'Acquired' }
  ]

  return (
    <div className="flex gap-1">
      {levels.map((level) => (
        <button
          key={level.value}
          type="button"
          onClick={() => onChange(level.value)}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            value === level.value
              ? role === 'clinician'
                ? 'bg-blue-500 text-white'
                : 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}

// ========================================
// Reflective Practice Section
// ========================================
function ReflectivePracticeSection() {
  const { watch, setValue } = useFormContext<CPPClosingFormData>()
  const reflectivePractice = watch('reflectivePractice')

  const updateChallenge = (id: string, role: 'clinician' | 'ccFrp', value: ChallengeLevel) => {
    const current = reflectivePractice.challenges[id] || { clinician: 'no', ccFrp: 'no' }
    setValue(`reflectivePractice.challenges.${id}`, { ...current, [role]: value })
  }

  const updateCapacity = (section: keyof typeof reflectivePractice, id: string, role: 'clinician' | 'ccFrp', value: CapacityLevel) => {
    const sectionData = reflectivePractice[section]
    const current = (sectionData && typeof sectionData === 'object' && id in sectionData)
      ? (sectionData as Record<string, { clinician: CapacityLevel; ccFrp: CapacityLevel }>)[id]
      : { clinician: 'requires_development' as CapacityLevel, ccFrp: 'requires_development' as CapacityLevel }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(`reflectivePractice.${section}.${id}` as any, { ...current, [role]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Reflective Practice Fidelity</h2>
        <p className="text-gray-600">
          Clinician should mark with a check, Care Coordinator/FRP should mark with an X.
          Complete at the end of treatment to reflect on intervention fidelity during the termination phase.
        </p>
      </div>

      {/* Legend */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium text-gray-700">Roles:</span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-500"></span>
            <span>Clinician</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-purple-500"></span>
            <span>CC/FRP</span>
          </span>
        </div>
      </div>

      {/* Potential Sources of Challenge */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Potential Sources of Challenge</h3>
        <p className="text-sm text-gray-600 mb-4">Level: No | Low | Moderate | Significant</p>
        <div className="space-y-3">
          {REFLECTIVE_PRACTICE_CHALLENGES.map((challenge) => {
            const current = reflectivePractice.challenges[challenge.id] || { clinician: 'no' as ChallengeLevel, ccFrp: 'no' as ChallengeLevel }
            return (
              <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{challenge.text}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <ChallengeLevelSelector
                      value={current.clinician}
                      onChange={(v) => updateChallenge(challenge.id, 'clinician', v)}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <ChallengeLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => updateChallenge(challenge.id, 'ccFrp', v)}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reflective Practice Capacity */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Reflective Practice Capacity</h3>
        <p className="text-sm text-gray-600 mb-4">Capacity Level: Requires Development | Emerging | Acquired</p>

        {/* Awareness of own emotional reactions - with contexts */}
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="font-medium text-gray-800 mb-3">Awareness of own emotional reactions</p>
            <div className="space-y-2 pl-4">
              {CAPACITY_CONTEXTS.map((context) => {
                const current = reflectivePractice.awarenessEmotions?.[context.id] || { clinician: 'requires_development' as CapacityLevel, ccFrp: 'requires_development' as CapacityLevel }
                return (
                  <div key={context.id} className="flex flex-wrap items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600 min-w-[200px]">{context.context}</span>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                        <CapacityLevelSelector
                          value={current.clinician}
                          onChange={(v) => updateCapacity('awarenessEmotions', context.id, 'clinician', v)}
                          role="clinician"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                        <CapacityLevelSelector
                          value={current.ccFrp}
                          onChange={(v) => updateCapacity('awarenessEmotions', context.id, 'ccFrp', v)}
                          role="ccFrp"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Awareness of biases - with contexts */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="font-medium text-gray-800 mb-3">Awareness of own personal and/or cultural biases</p>
            <div className="space-y-2 pl-4">
              {CAPACITY_CONTEXTS.map((context) => {
                const current = reflectivePractice.awarenessBiases?.[context.id] || { clinician: 'requires_development' as CapacityLevel, ccFrp: 'requires_development' as CapacityLevel }
                return (
                  <div key={context.id} className="flex flex-wrap items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600 min-w-[200px]">{context.context}</span>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                        <CapacityLevelSelector
                          value={current.clinician}
                          onChange={(v) => updateCapacity('awarenessBiases', context.id, 'clinician', v)}
                          role="clinician"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                        <CapacityLevelSelector
                          value={current.ccFrp}
                          onChange={(v) => updateCapacity('awarenessBiases', context.id, 'ccFrp', v)}
                          role="ccFrp"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Multiple perspectives - with contexts */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="font-medium text-gray-800 mb-3">Ability to consider multiple perspectives (caregiver's, child's, own)</p>
            <div className="space-y-2 pl-4">
              {CAPACITY_CONTEXTS.map((context) => {
                const current = reflectivePractice.multiplePerspectives?.[context.id] || { clinician: 'requires_development' as CapacityLevel, ccFrp: 'requires_development' as CapacityLevel }
                return (
                  <div key={context.id} className="flex flex-wrap items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600 min-w-[200px]">{context.context}</span>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                        <CapacityLevelSelector
                          value={current.clinician}
                          onChange={(v) => updateCapacity('multiplePerspectives', context.id, 'clinician', v)}
                          role="clinician"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                        <CapacityLevelSelector
                          value={current.ccFrp}
                          onChange={(v) => updateCapacity('multiplePerspectives', context.id, 'ccFrp', v)}
                          role="ccFrp"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Single items without contexts */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-gray-700 min-w-[300px]">Ability to recognize and regulate strong emotions prior to intervening (in the moment)</span>
              <div className="flex gap-4">
                <div>
                  <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                  <CapacityLevelSelector
                    value={reflectivePractice.regulateEmotions?.clinician || 'requires_development'}
                    onChange={(v) => setValue('reflectivePractice.regulateEmotions', { ...reflectivePractice.regulateEmotions, clinician: v })}
                    role="clinician"
                  />
                </div>
                <div>
                  <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                  <CapacityLevelSelector
                    value={reflectivePractice.regulateEmotions?.ccFrp || 'requires_development'}
                    onChange={(v) => setValue('reflectivePractice.regulateEmotions', { ...reflectivePractice.regulateEmotions, ccFrp: v })}
                    role="ccFrp"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-gray-700 min-w-[300px]">Use of self-care practices to enhance ability to regulate</span>
              <div className="flex gap-4">
                <div>
                  <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                  <CapacityLevelSelector
                    value={reflectivePractice.selfCare?.clinician || 'requires_development'}
                    onChange={(v) => setValue('reflectivePractice.selfCare', { ...reflectivePractice.selfCare, clinician: v })}
                    role="clinician"
                  />
                </div>
                <div>
                  <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                  <CapacityLevelSelector
                    value={reflectivePractice.selfCare?.ccFrp || 'requires_development'}
                    onChange={(v) => setValue('reflectivePractice.selfCare', { ...reflectivePractice.selfCare, ccFrp: v })}
                    role="ccFrp"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* External Supports */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Use of External Supports</h3>
        <p className="text-sm text-gray-600 mb-4">Appropriately uses supervision and/or consultation with colleagues to:</p>
        <div className="space-y-3">
          {EXTERNAL_SUPPORT_ITEMS.map((item, index) => {
            const id = `external_${index}`
            const current = reflectivePractice.externalSupports?.[id] || { clinician: 'requires_development' as CapacityLevel, ccFrp: 'requires_development' as CapacityLevel }
            return (
              <div key={id} className="p-3 bg-gray-50 rounded-lg flex flex-wrap items-center gap-4">
                <span className="text-sm text-gray-700 min-w-[250px]">{item}</span>
                <div className="flex gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <CapacityLevelSelector
                      value={current.clinician}
                      onChange={(v) => {
                        const updated = { ...reflectivePractice.externalSupports, [id]: { ...current, clinician: v } }
                        setValue('reflectivePractice.externalSupports', updated)
                      }}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <CapacityLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => {
                        const updated = { ...reflectivePractice.externalSupports, [id]: { ...current, ccFrp: v } }
                        setValue('reflectivePractice.externalSupports', updated)
                      }}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ========================================
// Emotional Process Section
// ========================================
function EmotionalProcessSection() {
  const { watch, setValue } = useFormContext<CPPClosingFormData>()
  const emotionalProcess = watch('emotionalProcess')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Emotional Process Fidelity</h2>
        <p className="text-gray-600">Degree to which challenges are present in sessions and capacity to handle them.</p>
      </div>

      {/* Challenges */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Potential Sources of Challenge</h3>
        <p className="text-sm text-gray-600 mb-4">Degree to which in sessions...</p>
        <div className="space-y-3">
          {EMOTIONAL_PROCESS_CHALLENGES.map((challenge) => {
            const current = emotionalProcess.challenges?.[challenge.id] || { clinician: 'no' as ChallengeLevel, ccFrp: 'no' as ChallengeLevel }
            return (
              <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{challenge.text}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <ChallengeLevelSelector
                      value={current.clinician}
                      onChange={(v) => {
                        const updated = { ...emotionalProcess.challenges, [challenge.id]: { ...current, clinician: v } }
                        setValue('emotionalProcess.challenges', updated)
                      }}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <ChallengeLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => {
                        const updated = { ...emotionalProcess.challenges, [challenge.id]: { ...current, ccFrp: v } }
                        setValue('emotionalProcess.challenges', updated)
                      }}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Capacities */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Capacity to Handle Emotional Challenges</h3>
        <p className="text-sm text-gray-600 mb-4">Clinician/Care Coordinator is able to...</p>
        <div className="space-y-3">
          {EMOTIONAL_CAPACITY_ITEMS.map((item, index) => {
            const id = `emotional_cap_${index}`
            const current = emotionalProcess.capacities?.[id] || { clinician: 'requires_development' as CapacityLevel, ccFrp: 'requires_development' as CapacityLevel }
            return (
              <div key={id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{item}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <CapacityLevelSelector
                      value={current.clinician}
                      onChange={(v) => {
                        const updated = { ...emotionalProcess.capacities, [id]: { ...current, clinician: v } }
                        setValue('emotionalProcess.capacities', updated)
                      }}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <CapacityLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => {
                        const updated = { ...emotionalProcess.capacities, [id]: { ...current, ccFrp: v } }
                        setValue('emotionalProcess.capacities', updated)
                      }}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ========================================
// Dyadic-Relational Section
// ========================================
function DyadicRelationalSection() {
  const { watch, setValue } = useFormContext<CPPClosingFormData>()
  const dyadicRelational = watch('dyadicRelational')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Dyadic-Relational Fidelity</h2>
        <p className="text-gray-600">Assessment of caregiver-child relational dynamics and intervention capacity.</p>
      </div>

      {/* Challenges */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Potential Sources of Challenge</h3>
        <p className="text-sm text-gray-600 mb-4">Degree to which in the sessions...</p>
        <div className="space-y-3">
          {DYADIC_CHALLENGES.map((challenge) => {
            const current = dyadicRelational.challenges?.[challenge.id] || { clinician: 'no' as ChallengeLevel, ccFrp: 'no' as ChallengeLevel }
            return (
              <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{challenge.text}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <ChallengeLevelSelector
                      value={current.clinician}
                      onChange={(v) => {
                        const updated = { ...dyadicRelational.challenges, [challenge.id]: { ...current, clinician: v } }
                        setValue('dyadicRelational.challenges', updated)
                      }}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <ChallengeLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => {
                        const updated = { ...dyadicRelational.challenges, [challenge.id]: { ...current, ccFrp: v } }
                        setValue('dyadicRelational.challenges', updated)
                      }}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Capacities */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Capacity to Address the Needs of Caregiver and Child</h3>
        <p className="text-sm text-gray-600 mb-4">Clinician/Care Coordinator is able to...</p>
        <div className="space-y-3">
          {DYADIC_CAPACITY_ITEMS.map((item, index) => {
            const id = `dyadic_cap_${index}`
            const current = dyadicRelational.capacities?.[id] || { clinician: 'requires_development' as CapacityLevel, ccFrp: 'requires_development' as CapacityLevel }
            return (
              <div key={id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{item}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <CapacityLevelSelector
                      value={current.clinician}
                      onChange={(v) => {
                        const updated = { ...dyadicRelational.capacities, [id]: { ...current, clinician: v } }
                        setValue('dyadicRelational.capacities', updated)
                      }}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <CapacityLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => {
                        const updated = { ...dyadicRelational.capacities, [id]: { ...current, ccFrp: v } }
                        setValue('dyadicRelational.capacities', updated)
                      }}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ========================================
// Trauma Framework Section
// ========================================
function TraumaFrameworkSection() {
  const { watch, setValue } = useFormContext<CPPClosingFormData>()
  const traumaFramework = watch('traumaFramework')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Trauma Framework Fidelity</h2>
        <p className="text-gray-600">Assessment of trauma-informed practice and intervention capacity.</p>
      </div>

      {/* Challenges */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Potential Sources of Challenge</h3>
        <p className="text-sm text-gray-600 mb-4">Challenges related to...</p>
        <div className="space-y-3">
          {TRAUMA_CHALLENGES.map((challenge) => {
            const current = traumaFramework.challenges?.[challenge.id] || { clinician: 'no' as ChallengeLevel, ccFrp: 'no' as ChallengeLevel }
            return (
              <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{challenge.text}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <ChallengeLevelSelector
                      value={current.clinician}
                      onChange={(v) => {
                        const updated = { ...traumaFramework.challenges, [challenge.id]: { ...current, clinician: v } }
                        setValue('traumaFramework.challenges', updated)
                      }}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <ChallengeLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => {
                        const updated = { ...traumaFramework.challenges, [challenge.id]: { ...current, ccFrp: v } }
                        setValue('traumaFramework.challenges', updated)
                      }}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Capacities */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Capacity to Intervene Within a Trauma Framework</h3>
        <p className="text-sm text-gray-600 mb-4">Clinician/Care Coordinator is able to...</p>
        <div className="space-y-3">
          {TRAUMA_CAPACITY_ITEMS.map((item, index) => {
            const id = `trauma_cap_${index}`
            const current = traumaFramework.capacities?.[id] || { clinician: 'requires_development' as CapacityLevel, ccFrp: 'requires_development' as CapacityLevel }
            return (
              <div key={id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{item}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <CapacityLevelSelector
                      value={current.clinician}
                      onChange={(v) => {
                        const updated = { ...traumaFramework.capacities, [id]: { ...current, clinician: v } }
                        setValue('traumaFramework.capacities', updated)
                      }}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <CapacityLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => {
                        const updated = { ...traumaFramework.capacities, [id]: { ...current, ccFrp: v } }
                        setValue('traumaFramework.capacities', updated)
                      }}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ========================================
// Procedural Fidelity Section (Core Intervention)
// ========================================
function ProceduralFidelitySection() {
  const { watch, setValue } = useFormContext<CPPClosingFormData>()
  const proceduralFidelity = watch('proceduralFidelity')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Procedural Fidelity</h2>
        <p className="text-gray-600">Assessment of procedural challenges and capacity to carry out procedures.</p>
      </div>

      {/* Challenges */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Potential Sources of Challenge</h3>
        <div className="space-y-3">
          {PROCEDURAL_CHALLENGES.map((challenge) => {
            const current = proceduralFidelity.challenges?.[challenge.id] || { clinician: 'no' as ChallengeLevel, ccFrp: 'no' as ChallengeLevel }
            return (
              <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{challenge.text}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <ChallengeLevelSelector
                      value={current.clinician}
                      onChange={(v) => {
                        const updated = { ...proceduralFidelity.challenges, [challenge.id]: { ...current, clinician: v } }
                        setValue('proceduralFidelity.challenges', updated)
                      }}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <ChallengeLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => {
                        const updated = { ...proceduralFidelity.challenges, [challenge.id]: { ...current, ccFrp: v } }
                        setValue('proceduralFidelity.challenges', updated)
                      }}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Capacities */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Capacity to Carry Out Procedures</h3>
        <p className="text-sm text-gray-600 mb-4">Response Options: No | Yes, But They Did Not Attend Regularly | Yes, Attended</p>
        <div className="space-y-3">
          {PROCEDURAL_CAPACITY_ITEMS.map((item, index) => {
            const id = `proc_cap_${index}`
            const current = proceduralFidelity.capacities?.[id] || { clinician: 'no' as AttendanceStatus, ccFrp: 'no' as AttendanceStatus }
            return (
              <div key={id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{item}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <div className="flex gap-1 mt-1">
                      {[
                        { value: 'no', label: 'No' },
                        { value: 'yes_irregular', label: 'Yes/Irreg' },
                        { value: 'yes_attended', label: 'Yes' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            const updated = { ...proceduralFidelity.capacities, [id]: { ...current, clinician: opt.value as AttendanceStatus } }
                            setValue('proceduralFidelity.capacities', updated)
                          }}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            current.clinician === opt.value
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <div className="flex gap-1 mt-1">
                      {[
                        { value: 'no', label: 'No' },
                        { value: 'yes_irregular', label: 'Yes/Irreg' },
                        { value: 'yes_attended', label: 'Yes' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            const updated = { ...proceduralFidelity.capacities, [id]: { ...current, ccFrp: opt.value as AttendanceStatus } }
                            setValue('proceduralFidelity.capacities', updated)
                          }}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            current.ccFrp === opt.value
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Propose Caregiver Collateral Sessions */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Propose Caregiver Collateral Sessions</h3>
        <p className="text-sm text-gray-600 mb-4">
          Propose caregiver collateral sessions when:
        </p>
        <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1">
          <li>Caregiver is triggered by child or child's play or in need of psychoeducation</li>
          <li>Caregiver does not understand trauma as a potential cause of child's behaviors</li>
          <li>Caregiver needs to share information with Clinician/Care Coordinator (e.g., new traumatic events, new service needs)</li>
        </ul>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 mb-2 font-medium">Propose caregiver collateral sessions</p>
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-xs text-blue-600 font-medium">Clinician:</span>
              <div className="flex gap-1 mt-1">
                {[
                  { value: 'not_needed', label: 'Not needed' },
                  { value: 'no', label: 'No' },
                  { value: 'yes_irregular', label: 'Yes/Irreg' },
                  { value: 'yes_attended', label: 'Yes' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setValue('proceduralFidelity.collateralSessions', {
                        ...proceduralFidelity.collateralSessions,
                        clinician: opt.value as AttendanceStatus
                      })
                    }}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      proceduralFidelity.collateralSessions?.clinician === opt.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
              <div className="flex gap-1 mt-1">
                {[
                  { value: 'not_needed', label: 'Not needed' },
                  { value: 'no', label: 'No' },
                  { value: 'yes_irregular', label: 'Yes/Irreg' },
                  { value: 'yes_attended', label: 'Yes' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setValue('proceduralFidelity.collateralSessions', {
                        ...proceduralFidelity.collateralSessions,
                        ccFrp: opt.value as AttendanceStatus
                      })
                    }}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      proceduralFidelity.collateralSessions?.ccFrp === opt.value
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========================================
// CPP Objectives Section
// ========================================
function CPPObjectivesSection() {
  const { watch, setValue } = useFormContext<CPPClosingFormData>()
  const cppObjectives = watch('cppObjectives')

  type ClinicalFocusValue = 0 | 1 | 2 | 3 | ''
  type AppropriatenessValue = 'under' | 'appropriate' | 'over' | ''
  type ProgressValue = 0 | 1 | 2 | 3 | ''

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">CPP Case Conceptualization and Content Fidelity</h2>
        <p className="text-gray-600">
          Assess clinical focus, appropriateness, and progress for each CPP objective.
        </p>
      </div>

      {/* Rating Scales Legend */}
      <div className="glass-card rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-1">Clinical Focus (0-3):</p>
            <ul className="text-gray-600 text-xs space-y-0.5">
              <li>0 = not at all a focus</li>
              <li>1 = minor</li>
              <li>2 = moderate</li>
              <li>3 = significant</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Appropriateness:</p>
            <ul className="text-gray-600 text-xs space-y-0.5">
              <li>Under = should have focused more</li>
              <li>Appropriate = focus seems right</li>
              <li>Over = may have overly focused</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Progress (0-3):</p>
            <ul className="text-gray-600 text-xs space-y-0.5">
              <li>0 = Primary Target/Urgent Concern</li>
              <li>1 = Emerging</li>
              <li>2 = Present but Unstable</li>
              <li>3 = Established</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div className="space-y-4">
        {CPP_OBJECTIVES.map((objective) => {
          const current = cppObjectives[objective.id] || { clinicalFocus: '' as ClinicalFocusValue, appropriateness: '' as AppropriatenessValue, progress: '' as ProgressValue }

          return (
            <div key={objective.id} className="glass-card rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{objective.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{objective.description}</p>

              {/* Items list */}
              <div className="mb-4 pl-4 border-l-2 border-orange-200">
                <ul className="text-sm text-gray-600 space-y-1">
                  {objective.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {/* Clinical Focus */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Clinical Focus (0-3)</label>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setValue(`cppObjectives.${objective.id}`, { ...current, clinicalFocus: val as ClinicalFocusValue })
                        }}
                        className={`w-10 h-8 text-sm rounded transition-colors ${
                          current.clinicalFocus === val
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Appropriateness */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Appropriateness</label>
                  <div className="flex gap-1">
                    {[
                      { value: 'under', label: 'Under' },
                      { value: 'appropriate', label: 'Approp' },
                      { value: 'over', label: 'Over' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setValue(`cppObjectives.${objective.id}`, { ...current, appropriateness: opt.value as AppropriatenessValue })
                        }}
                        className={`px-3 h-8 text-xs rounded transition-colors ${
                          current.appropriateness === opt.value
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Progress (0-3)</label>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setValue(`cppObjectives.${objective.id}`, { ...current, progress: val as ProgressValue })
                        }}
                        className={`w-10 h-8 text-sm rounded transition-colors ${
                          current.progress === val
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Copyright notice */}
      <div className="text-center text-xs text-gray-500 mt-8 p-4 bg-gray-50 rounded-xl">
        <p>Ghosh Ippen, Van Horn & Lieberman, 2012 all rights reserved, adapted for Child First</p>
        <p className="font-medium mt-1">DO NOT ALTER WITHOUT PERMISSION</p>
      </div>
    </div>
  )
}

// ========================================
// Notes Section
// ========================================
function NotesSection() {
  const { register } = useFormContext<CPPClosingFormData>()
  const quote = getRandomQuote()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Notes & Comments</h2>
        <p className="text-gray-600">Additional documentation and observations</p>
      </div>

      {/* Wisdom quote */}
      <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
        <p className="text-orange-800 italic">"{quote.quote}"</p>
        <p className="text-sm text-orange-600 mt-1">- {quote.source}</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Comments
          </label>
          <textarea
            {...register('notes.additionalComments')}
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            placeholder="Any additional notes, observations, or comments about this case closing..."
          />
        </div>
      </div>
    </div>
  )
}

// ========================================
// Main AppShell Component
// ========================================
export function CPPClosingAppShell({ onBack }: CPPClosingAppShellProps) {
  const [currentSection, setCurrentSection] = useState<SectionId>('identification')
  const [navOpen, setNavOpen] = useState(false)
  const [showGrounding, setShowGrounding] = useState(false)
  const [showCompass, setShowCompass] = useState(false)
  const [showJournal, setShowJournal] = useState(false)

  const methods = useForm<CPPClosingFormData>({
    defaultValues: DEFAULT_CPP_CLOSING_DATA,
    mode: 'onChange'
  })

  const { watch } = methods
  const formValues = watch()

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        methods.reset(parsed)
      } catch {
        // Invalid JSON
      }
    }
  }, [methods])

  // Auto-save
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // Calculate progress
  const calculateProgress = useCallback(() => {
    let completed = 0
    let total = 0

    // Identification
    total += 5
    if (formValues.identification.clinicalTeamNames) completed++
    if (formValues.identification.clientInitials) completed++
    if (formValues.identification.childFirstSite) completed++
    if (formValues.identification.monthYear) completed++
    if (formValues.identification.careLogicId) completed++

    // Termination Info
    total += 7
    if (formValues.terminationInfo.terminationPhase) completed++
    if (formValues.terminationInfo.initiatedBy) completed++
    if (formValues.terminationInfo.terminationType) completed++
    if (formValues.terminationInfo.functioningChange) completed++
    if (formValues.terminationInfo.prognosis) completed++
    if (formValues.terminationInfo.completedTreatment || Object.values(formValues.terminationInfo.closingReasons || {}).some(v => v)) completed++
    if (formValues.terminationInfo.transferToClinicianPlan) completed++

    // Planned Termination
    if (!formValues.plannedTermination.notDone) {
      total += PLANNED_TERMINATION_ITEMS.length
      PLANNED_TERMINATION_ITEMS.forEach(item => {
        if (formValues.plannedTermination.items?.[item.id]) completed++
      })
    }

    // Unplanned Termination
    total += UNPLANNED_TERMINATION_ITEMS.length
    UNPLANNED_TERMINATION_ITEMS.forEach(item => {
      if (formValues.unplannedTermination?.[item.id]) completed++
    })

    // CPP Objectives
    total += CPP_OBJECTIVES.length * 3
    CPP_OBJECTIVES.forEach(obj => {
      const current = formValues.cppObjectives?.[obj.id]
      if (current?.clinicalFocus !== '' && current?.clinicalFocus !== undefined) completed++
      if (current?.appropriateness) completed++
      if (current?.progress !== '' && current?.progress !== undefined) completed++
    })

    return total > 0 ? Math.round((completed / total) * 100) : 0
  }, [formValues])

  const progress = calculateProgress()

  const handleExportPDF = useCallback(() => {
    alert('PDF export for CPP Closing form coming soon!')
  }, [])

  const renderSection = () => {
    switch (currentSection) {
      case 'identification':
        return <IdentificationSection />
      case 'termination_info':
        return <TerminationInfoSection />
      case 'planned_termination':
        return <PlannedTerminationSection />
      case 'unplanned_termination':
        return <UnplannedTerminationSection />
      case 'contact_log':
        return <ContactLogSection />
      case 'reflective_practice':
        return <ReflectivePracticeSection />
      case 'emotional_process':
        return <EmotionalProcessSection />
      case 'dyadic_relational':
        return <DyadicRelationalSection />
      case 'trauma_framework':
        return <TraumaFrameworkSection />
      case 'procedural_fidelity':
        return <ProceduralFidelitySection />
      case 'cpp_objectives':
        return <CPPObjectivesSection />
      case 'all_notes':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Supervision Notes</h2>
              <p className="text-gray-600">All notes added to questions for supervision review</p>
            </div>
            <AllNotesSection
              notes={[]}
              onNavigateToQuestion={(sectionId, _questionId) => {
                setCurrentSection(sectionId as SectionId)
              }}
            />
          </div>
        )
      case 'notes':
        return <NotesSection />
      default:
        return null
    }
  }

  const progressMessage = getProgressMessage(progress)

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen animated-gradient-bg">
        {/* Header */}
        <header className="sticky top-0 z-40 glass-header border-b border-white/20">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-xl hover:bg-white/50 transition-colors"
                aria-label="Back to form selection"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setNavOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/50 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 float-animation">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold gradient-text truncate max-w-[200px]">
                      {formValues.identification.clientInitials || 'CPP Closing'}
                    </h1>
                    {progress === 100 && (
                      <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-medium">
                        Complete!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Recapitulation & Termination Phase
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Wellness Features */}
              <button
                onClick={() => setShowGrounding(true)}
                className="p-2 rounded-lg hover:bg-orange-50 text-orange-400 hover:text-orange-500 transition-all"
              {/* Wellness Tools */}
              <button
                onClick={() => setShowGrounding(true)}
                className="p-2.5 rounded-xl hover:bg-cyan-50 text-cyan-500 hover:text-cyan-600 transition-all"
                aria-label="Regulate First - Grounding Exercise"
                title="Regulate First"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowCompass(true)}
                className="p-2 rounded-lg hover:bg-green-50 text-green-400 hover:text-green-500 transition-all"
                className="p-2.5 rounded-xl hover:bg-green-50 text-green-500 hover:text-green-600 transition-all"
                aria-label="Fidelity Compass"
                title="Fidelity Compass"
              >
                <Compass className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowJournal(true)}
                className="p-2 rounded-lg hover:bg-purple-50 text-purple-400 hover:text-purple-500 transition-all"
                className="p-2.5 rounded-xl hover:bg-purple-50 text-purple-500 hover:text-purple-600 transition-all"
                aria-label="Reflective Practice Journal"
                title="Reflective Journal"
              >
                <PenLine className="w-5 h-5" />
              </button>
              <span className="w-px h-6 bg-gray-200 mx-1" />
              <button
                onClick={handleExportPDF}
                className="hidden sm:flex items-center gap-2 px-4 py-2 ml-2
                         bg-gradient-to-r from-orange-500 to-amber-500
                         text-white text-sm font-semibold rounded-xl
                         hover:from-orange-600 hover:to-amber-600
                         transition-all shadow-lg shadow-orange-500/30
                         hover:shadow-orange-500/50 hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    progress === 100
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 progress-complete'
                      : 'bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{progressMessage.emoji}</span>
                <span className="text-sm font-semibold text-gray-700 min-w-[3ch]">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="lg:flex">
          {/* Mobile overlay */}
          {navOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setNavOpen(false)}
            />
          )}

          {/* Navigation sidebar */}
          <nav
            className={`
              fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-73px)] w-64 bg-white/80 backdrop-blur-sm border-r border-white/20
              transform transition-transform duration-200 ease-in-out z-50 overflow-y-auto
              ${navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
              <span className="font-semibold text-gray-900">Sections</span>
              <button
                onClick={() => setNavOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Section list */}
            <div className="p-2">
              {sections.map((section) => {
                const isActive = currentSection === section.id
                const Icon = section.icon

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setCurrentSection(section.id)
                      setNavOpen(false)
                    }}
                    className={`
                      w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg mb-1 transition-colors
                      ${isActive ? 'bg-orange-100 text-orange-800' : 'text-gray-700 hover:bg-white/80'}
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 min-h-[calc(100vh-73px)] p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              {renderSection()}
            </div>
          </main>
        </div>

        {/* Wellness Modals */}
        {showGrounding && (
          <GroundingExercise onClose={() => setShowGrounding(false)} />
        )}
        {showCompass && (
          <FidelityCompass onClose={() => setShowCompass(false)} />
        )}
        {showJournal && (
          <ReflectiveJournal onClose={() => setShowJournal(false)} />
        )}
      </div>

      {/* Wellness Modals */}
      {showGrounding && (
        <GroundingExercise onClose={() => setShowGrounding(false)} />
      )}
      {showCompass && (
        <FidelityCompass onClose={() => setShowCompass(false)} />
      )}
      {showJournal && (
        <ReflectiveJournal onClose={() => setShowJournal(false)} />
      )}
    </FormProvider>
  )
}
