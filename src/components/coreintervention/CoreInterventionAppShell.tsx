import { useState, useCallback, useEffect, useMemo } from 'react'
import { ArrowLeft, Menu, Download, X, FileText, Calendar, Brain, Heart, Users, Shield, Link2, Target, Compass, PenLine, Plus, Trash2, MessageSquare, Sparkles, Focus } from 'lucide-react'
import { useForm, FormProvider, useFormContext, useFieldArray } from 'react-hook-form'
import { AllNotesSection, GlobalFocusMode, type FocusModeSection } from '@/components/ui'
import { GroundingExercise } from '@/components/ui/GroundingExercise'
import { FidelityCompass } from '@/components/ui/FidelityCompass'
import { ReflectiveJournal } from '@/components/ui/ReflectiveJournal'
import { getProgressMessage } from '@/utils/celebrations'
import {
  type CoreInterventionFormData,
  type ChallengeLevel,
  type CapacityLevel,
  type RoleBasedChallenge,
  type RoleBasedCapacity,
  type Attendee,
  DEFAULT_CORE_INTERVENTION_DATA,
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
} from '@/data/coreInterventionItems'

type SectionId =
  | 'identification'
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

const STORAGE_KEY = 'core_intervention_form'

interface CoreInterventionAppShellProps {
  onBack: () => void
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
  const levels: { value: ChallengeLevel; label: string; color: string }[] = [
    { value: 'no', label: 'No', color: 'bg-gray-100 text-gray-600' },
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
    { value: 'moderate', label: 'Mod', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'significant', label: 'Sig', color: 'bg-red-100 text-red-700' }
  ]

  return (
    <div className="flex gap-1">
      {levels.map((level) => (
        <button
          key={level.value}
          type="button"
          onClick={() => onChange(level.value)}
          className={`px-2 py-1 text-xs rounded transition-all ${
            value === level.value
              ? level.color + ' ring-2 ring-offset-1 ' + (role === 'clinician' ? 'ring-blue-400' : 'ring-purple-400')
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
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
  const levels: { value: CapacityLevel; label: string; color: string }[] = [
    { value: 'requires_development', label: 'RD', color: 'bg-red-100 text-red-700' },
    { value: 'emerging', label: 'E', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'acquired', label: 'A', color: 'bg-green-100 text-green-700' }
  ]

  return (
    <div className="flex gap-1">
      {levels.map((level) => (
        <button
          key={level.value}
          type="button"
          onClick={() => onChange(level.value)}
          className={`px-2 py-1 text-xs rounded transition-all ${
            value === level.value
              ? level.color + ' ring-2 ring-offset-1 ' + (role === 'clinician' ? 'ring-blue-400' : 'ring-purple-400')
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}

// ========================================
// Clinical Focus Selector Component
// ========================================
function ClinicalFocusSelector({
  value,
  onChange
}: {
  value: 0 | 1 | 2 | 3
  onChange: (value: 0 | 1 | 2 | 3) => void
}) {
  const levels = [
    { value: 0 as const, label: '0', color: 'bg-gray-100 text-gray-600' },
    { value: 1 as const, label: '1', color: 'bg-blue-100 text-blue-700' },
    { value: 2 as const, label: '2', color: 'bg-teal-100 text-teal-700' },
    { value: 3 as const, label: '3', color: 'bg-green-100 text-green-700' }
  ]

  return (
    <div className="flex gap-1">
      {levels.map((level) => (
        <button
          key={level.value}
          type="button"
          onClick={() => onChange(level.value)}
          className={`w-7 h-7 text-xs rounded-full transition-all ${
            value === level.value
              ? level.color + ' ring-2 ring-offset-1 ring-teal-400'
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}

// ========================================
// Identification Section
// ========================================
function IdentificationSection() {
  const { register } = useFormContext<CoreInterventionFormData>()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Core Intervention Phase Fidelity</h2>
        <p className="text-gray-600">Adapted from Child-Parent Psychotherapy</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinical Team Names
            </label>
            <input
              {...register('identification.clinicalTeamNames')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter clinical team member names"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Initials
            </label>
            <input
              {...register('identification.clientInitials')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="e.g., JD"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Child First Site
            </label>
            <input
              {...register('identification.childFirstSite')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CareLogic ID
            </label>
            <input
              {...register('identification.careLogicId')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter CareLogic ID"
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-200">
          <p className="text-sm text-teal-800">
            <strong>Instructions:</strong> Completed by the Clinical Team and reviewed with Clinical Director/Supervisor during reflective supervision.
            For all Child First sites, to ensure fidelity to trauma-informed CPP and Child First (2 Fidelity cases need to be maintained at all times).
          </p>
        </div>
      </div>
    </div>
  )
}

// ========================================
// Contact Log Section
// ========================================
function ContactLogSection() {
  const { control, register, watch, setValue } = useFormContext<CoreInterventionFormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactLog'
  })

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
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Log</h2>
        <p className="text-gray-600">Track all contacts during Core Intervention Phase</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Contact Entries</h3>
          <button
            type="button"
            onClick={addEntry}
            className="flex items-center gap-2 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => {
            const entry = watch(`contactLog.${index}`)
            const showNotAttending = entry?.sessionStatus === 'cancel' || entry?.sessionStatus === 'no_show'
            const showCollateralSpecify = entry?.attendees?.includes('collateral')

            return (
              <div key={field.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-gray-600">Entry #{index + 1}</span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      {...register(`contactLog.${index}.date`)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Contact Type</label>
                    <select
                      {...register(`contactLog.${index}.contactType`)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select type</option>
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
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., 60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Session Status</label>
                    <select
                      {...register(`contactLog.${index}.sessionStatus`)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select status</option>
                      {SESSION_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  {showNotAttending && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Reason Not Attending</label>
                      <select
                        {...register(`contactLog.${index}.notAttendingReason`)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Select reason</option>
                        {NOT_ATTENDING_REASONS.map((reason) => (
                          <option key={reason.value} value={reason.value}>{reason.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                    <select
                      {...register(`contactLog.${index}.location`)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select location</option>
                      {LOCATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Session Counter</label>
                    <input
                      type="text"
                      {...register(`contactLog.${index}.sessionCounter`)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Who Attended</label>
                  <div className="flex flex-wrap gap-2">
                    {ATTENDEE_OPTIONS.map((attendee) => {
                      const isSelected = entry?.attendees?.includes(attendee.value)
                      return (
                        <button
                          key={attendee.value}
                          type="button"
                          onClick={() => {
                            const current = entry?.attendees || []
                            const updated = isSelected
                              ? current.filter((a: Attendee) => a !== attendee.value)
                              : [...current, attendee.value]
                            setValue(`contactLog.${index}.attendees`, updated)
                          }}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-teal-100 border-teal-300 text-teal-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {attendee.label}
                        </button>
                      )
                    })}
                  </div>
                  {showCollateralSpecify && (
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register(`contactLog.${index}.collateralSpecify`)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="Specify collateral..."
                      />
                    </div>
                  )}
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
// Reflective Practice Section
// ========================================
function ReflectivePracticeSection() {
  const { watch, setValue } = useFormContext<CoreInterventionFormData>()
  const reflectivePractice = watch('reflectivePractice') || {}

  const defaultChallenge: RoleBasedChallenge = { clinician: 'no', ccFrp: 'no' }
  const defaultCapacity: RoleBasedCapacity = { clinician: 'requires_development', ccFrp: 'requires_development' }

  const updateChallenge = (id: string, role: 'clinician' | 'ccFrp', value: ChallengeLevel) => {
    const current = reflectivePractice.challenges?.[id] || defaultChallenge
    setValue(`reflectivePractice.challenges.${id}`, { ...current, [role]: value })
  }

  const updateCapacity = (category: string, contextId: string, role: 'clinician' | 'ccFrp', value: CapacityLevel) => {
    const current = reflectivePractice.capacity?.[category]?.[contextId] || defaultCapacity
    setValue(`reflectivePractice.capacity.${category}.${contextId}`, { ...current, [role]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Reflective Practice Fidelity</h2>
        <p className="text-gray-600">Assess reflective practice challenges and capacity</p>
      </div>

      {/* Challenges */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Reflective Practice Challenges</h3>
        <p className="text-sm text-gray-600 mb-4">Challenge Level: No Challenge | Low | Moderate | Significant</p>
        <div className="space-y-3">
          {REFLECTIVE_PRACTICE_CHALLENGES.map((challenge) => {
            const current = reflectivePractice.challenges?.[challenge.id] || defaultChallenge
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

      {/* Capacity */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Reflective Practice Capacity</h3>
        <p className="text-sm text-gray-600 mb-4">Capacity Level: Requires Development (RD) | Emerging (E) | Acquired (A)</p>
        <div className="space-y-4">
          {/* Items with contexts */}
          {['Awareness of own emotional reactions', 'Awareness of own personal and/or cultural biases', "Ability to consider multiple perspectives (caregiver's, child's, own)"].map((item, itemIdx) => {
            const categoryId = ['awarenessEmotions', 'awarenessBiases', 'multiplePerspectives'][itemIdx]
            return (
              <div key={categoryId} className="p-4 border border-gray-200 rounded-lg">
                <p className="font-medium text-gray-800 mb-3">{item}</p>
                <div className="space-y-2 pl-4">
                  {CAPACITY_CONTEXTS.map((context) => {
                    const current = reflectivePractice.capacity?.[categoryId]?.[context.id] || defaultCapacity
                    return (
                      <div key={context.id} className="flex flex-wrap items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-600 min-w-[200px]">{context.context}</span>
                        <div className="flex gap-4">
                          <div>
                            <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                            <CapacityLevelSelector
                              value={current.clinician}
                              onChange={(v) => updateCapacity(categoryId, context.id, 'clinician', v)}
                              role="clinician"
                            />
                          </div>
                          <div>
                            <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                            <CapacityLevelSelector
                              value={current.ccFrp}
                              onChange={(v) => updateCapacity(categoryId, context.id, 'ccFrp', v)}
                              role="ccFrp"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Single items without contexts */}
          {['Ability to recognize and regulate strong emotions prior to intervening (in the moment)', 'Use of self-care practices to enhance ability to regulate'].map((item, idx) => {
            const simpleId = ['regulateEmotions', 'selfCare'][idx]
            const current = reflectivePractice.capacitySimple?.[simpleId] || defaultCapacity
            return (
              <div key={simpleId} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm text-gray-700 min-w-[300px]">{item}</span>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                      <CapacityLevelSelector
                        value={current.clinician}
                        onChange={(v) => setValue(`reflectivePractice.capacitySimple.${simpleId}`, { ...current, clinician: v })}
                        role="clinician"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                      <CapacityLevelSelector
                        value={current.ccFrp}
                        onChange={(v) => setValue(`reflectivePractice.capacitySimple.${simpleId}`, { ...current, ccFrp: v })}
                        role="ccFrp"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* External Supports */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Use of External Supports</h3>
        <p className="text-sm text-gray-600 mb-4">Appropriately uses supervision and/or consultation with colleagues to:</p>
        <div className="space-y-3">
          {EXTERNAL_SUPPORT_ITEMS.map((item, index) => {
            const id = `external_${index}`
            const current = reflectivePractice.externalSupports?.[id] || defaultCapacity
            return (
              <div key={id} className="p-3 bg-gray-50 rounded-lg flex flex-wrap items-center gap-4">
                <span className="text-sm text-gray-700 min-w-[250px]">{item}</span>
                <div className="flex gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <CapacityLevelSelector
                      value={current.clinician}
                      onChange={(v) => setValue(`reflectivePractice.externalSupports.${id}`, { ...current, clinician: v })}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <CapacityLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => setValue(`reflectivePractice.externalSupports.${id}`, { ...current, ccFrp: v })}
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
  const { watch, setValue } = useFormContext<CoreInterventionFormData>()
  const emotionalProcess = watch('emotionalProcess') || {}

  const defaultChallenge: RoleBasedChallenge = { clinician: 'no', ccFrp: 'no' }
  const defaultCapacity: RoleBasedCapacity = { clinician: 'requires_development', ccFrp: 'requires_development' }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Emotional Process Fidelity</h2>
        <p className="text-gray-600">Assess emotional process challenges and capacity</p>
      </div>

      {/* Challenges */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Emotional Process Challenges</h3>
        <div className="space-y-3">
          {EMOTIONAL_PROCESS_CHALLENGES.map((challenge) => {
            const current = emotionalProcess.challenges?.[challenge.id] || defaultChallenge
            return (
              <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{challenge.text}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <ChallengeLevelSelector
                      value={current.clinician}
                      onChange={(v) => setValue(`emotionalProcess.challenges.${challenge.id}`, { ...current, clinician: v })}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <ChallengeLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => setValue(`emotionalProcess.challenges.${challenge.id}`, { ...current, ccFrp: v })}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Capacity */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Emotional Process Capacity</h3>
        <div className="space-y-3">
          {EMOTIONAL_CAPACITY_ITEMS.map((item, index) => {
            const id = `ep_cap_${index}`
            const current = emotionalProcess.capacity?.[id] || defaultCapacity
            return (
              <div key={id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{item}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <CapacityLevelSelector
                      value={current.clinician}
                      onChange={(v) => setValue(`emotionalProcess.capacity.${id}`, { ...current, clinician: v })}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <CapacityLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => setValue(`emotionalProcess.capacity.${id}`, { ...current, ccFrp: v })}
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
  const { watch, setValue } = useFormContext<CoreInterventionFormData>()
  const dyadicRelational = watch('dyadicRelational') || {}

  const defaultChallenge: RoleBasedChallenge = { clinician: 'no', ccFrp: 'no' }
  const defaultCapacity: RoleBasedCapacity = { clinician: 'requires_development', ccFrp: 'requires_development' }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Dyadic-Relational Fidelity</h2>
        <p className="text-gray-600">Assess dyadic-relational challenges and capacity</p>
      </div>

      {/* Challenges */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Dyadic-Relational Challenges</h3>
        <div className="space-y-3">
          {DYADIC_CHALLENGES.map((challenge) => {
            const current = dyadicRelational.challenges?.[challenge.id] || defaultChallenge
            return (
              <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{challenge.text}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <ChallengeLevelSelector
                      value={current.clinician}
                      onChange={(v) => setValue(`dyadicRelational.challenges.${challenge.id}`, { ...current, clinician: v })}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <ChallengeLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => setValue(`dyadicRelational.challenges.${challenge.id}`, { ...current, ccFrp: v })}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Capacity */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Dyadic-Relational Capacity</h3>
        <div className="space-y-3">
          {DYADIC_CAPACITY_ITEMS.map((item, index) => {
            const id = `dr_cap_${index}`
            const current = dyadicRelational.capacity?.[id] || defaultCapacity
            return (
              <div key={id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{item}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <CapacityLevelSelector
                      value={current.clinician}
                      onChange={(v) => setValue(`dyadicRelational.capacity.${id}`, { ...current, clinician: v })}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <CapacityLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => setValue(`dyadicRelational.capacity.${id}`, { ...current, ccFrp: v })}
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
  const { watch, setValue } = useFormContext<CoreInterventionFormData>()
  const traumaFramework = watch('traumaFramework') || {}

  const defaultChallenge: RoleBasedChallenge = { clinician: 'no', ccFrp: 'no' }
  const defaultCapacity: RoleBasedCapacity = { clinician: 'requires_development', ccFrp: 'requires_development' }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Trauma Framework Fidelity</h2>
        <p className="text-gray-600">Assess trauma framework challenges and capacity</p>
      </div>

      {/* Challenges */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Trauma Framework Challenges</h3>
        <div className="space-y-3">
          {TRAUMA_CHALLENGES.map((challenge) => {
            const current = traumaFramework.challenges?.[challenge.id] || defaultChallenge
            return (
              <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{challenge.text}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <ChallengeLevelSelector
                      value={current.clinician}
                      onChange={(v) => setValue(`traumaFramework.challenges.${challenge.id}`, { ...current, clinician: v })}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <ChallengeLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => setValue(`traumaFramework.challenges.${challenge.id}`, { ...current, ccFrp: v })}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Capacity */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Trauma Framework Capacity</h3>
        <div className="space-y-3">
          {TRAUMA_CAPACITY_ITEMS.map((item, index) => {
            const id = `tf_cap_${index}`
            const current = traumaFramework.capacity?.[id] || defaultCapacity
            return (
              <div key={id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{item}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <CapacityLevelSelector
                      value={current.clinician}
                      onChange={(v) => setValue(`traumaFramework.capacity.${id}`, { ...current, clinician: v })}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <CapacityLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => setValue(`traumaFramework.capacity.${id}`, { ...current, ccFrp: v })}
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
// Procedural Fidelity Section
// ========================================
function ProceduralFidelitySection() {
  const { watch, setValue } = useFormContext<CoreInterventionFormData>()
  const proceduralFidelity = watch('proceduralFidelity') || {}

  const defaultChallenge: RoleBasedChallenge = { clinician: 'no', ccFrp: 'no' }
  const defaultCapacity: RoleBasedCapacity = { clinician: 'requires_development', ccFrp: 'requires_development' }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Procedural Fidelity</h2>
        <p className="text-gray-600">Assess procedural challenges and capacity</p>
      </div>

      {/* Challenges */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Procedural Challenges</h3>
        <div className="space-y-3">
          {PROCEDURAL_CHALLENGES.map((challenge) => {
            const current = proceduralFidelity.challenges?.[challenge.id] || defaultChallenge
            return (
              <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{challenge.text}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <ChallengeLevelSelector
                      value={current.clinician}
                      onChange={(v) => setValue(`proceduralFidelity.challenges.${challenge.id}`, { ...current, clinician: v })}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <ChallengeLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => setValue(`proceduralFidelity.challenges.${challenge.id}`, { ...current, ccFrp: v })}
                      role="ccFrp"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Capacity */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Procedural Capacity</h3>
        <div className="space-y-3">
          {PROCEDURAL_CAPACITY_ITEMS.map((item, index) => {
            const id = `pf_cap_${index}`
            const current = proceduralFidelity.capacity?.[id] || defaultCapacity
            return (
              <div key={id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{item}</p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Clinician:</span>
                    <CapacityLevelSelector
                      value={current.clinician}
                      onChange={(v) => setValue(`proceduralFidelity.capacity.${id}`, { ...current, clinician: v })}
                      role="clinician"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-purple-600 font-medium">CC/FRP:</span>
                    <CapacityLevelSelector
                      value={current.ccFrp}
                      onChange={(v) => setValue(`proceduralFidelity.capacity.${id}`, { ...current, ccFrp: v })}
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
// CPP Objectives Section
// ========================================
function CPPObjectivesSection() {
  const { watch, setValue } = useFormContext<CoreInterventionFormData>()
  const cppObjectives = watch('cppObjectives') || {}
  const appropriateness = watch('objectiveAppropriateness') || {}

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">CPP Objectives</h2>
        <p className="text-gray-600">Rate clinical focus on each objective (0 = Not addressed, 1-3 = Level of focus)</p>
      </div>

      {CPP_OBJECTIVES.map((objective) => (
        <div key={objective.id} className="glass-card rounded-xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">{objective.title}</h3>
              <p className="text-sm text-gray-600">{objective.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Appropriateness:</span>
              <div className="flex gap-1">
                {[
                  { value: 'under' as const, label: 'Under', color: 'bg-blue-100 text-blue-700' },
                  { value: 'appropriate' as const, label: 'OK', color: 'bg-green-100 text-green-700' },
                  { value: 'over' as const, label: 'Over', color: 'bg-red-100 text-red-700' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue(`objectiveAppropriateness.${objective.id}`, opt.value)}
                    className={`px-2 py-1 text-xs rounded transition-all ${
                      appropriateness[objective.id] === opt.value
                        ? opt.color + ' ring-2 ring-offset-1 ring-teal-400'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {objective.items.map((item, idx) => {
              const itemId = `${objective.id}_${idx}`
              const current = cppObjectives[objective.id]?.[itemId] || 0
              return (
                <div key={itemId} className="flex flex-wrap items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 flex-1">{item}</span>
                  <ClinicalFocusSelector
                    value={current as 0 | 1 | 2 | 3}
                    onChange={(v) => {
                      const updated = { ...cppObjectives[objective.id], [itemId]: v }
                      setValue(`cppObjectives.${objective.id}`, updated)
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ========================================
// Notes Section
// ========================================
function NotesSection() {
  const { register } = useFormContext<CoreInterventionFormData>()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Additional Notes</h2>
        <p className="text-gray-600">Add any additional observations or comments</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <textarea
          {...register('notes')}
          rows={10}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          placeholder="Enter any additional notes, observations, or comments about this Core Intervention Phase assessment..."
        />
      </div>
    </div>
  )
}

// ========================================
// Main Component
// ========================================
export function CoreInterventionAppShell({ onBack }: CoreInterventionAppShellProps) {
  const [currentSection, setCurrentSection] = useState<SectionId>('identification')
  const [navOpen, setNavOpen] = useState(false)
  const [showGrounding, setShowGrounding] = useState(false)
  const [showCompass, setShowCompass] = useState(false)
  const [showJournal, setShowJournal] = useState(false)
  const [showFocusMode, setShowFocusMode] = useState(false)

  // Initialize form with default data or load from localStorage
  const methods = useForm<CoreInterventionFormData>({
    defaultValues: () => {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return DEFAULT_CORE_INTERVENTION_DATA
        }
      }
      return DEFAULT_CORE_INTERVENTION_DATA
    }
  })

  const formValues = methods.watch()

  // Auto-save to localStorage
  useEffect(() => {
    const subscription = methods.watch((data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    })
    return () => subscription.unsubscribe()
  }, [methods])

  // Calculate progress
  const calculateProgress = useCallback(() => {
    let filled = 0
    let total = 0

    // Check identification fields
    const id = formValues.identification || {}
    total += 5
    if (id.clinicalTeamNames) filled++
    if (id.clientInitials) filled++
    if (id.childFirstSite) filled++
    if (id.monthYear) filled++
    if (id.careLogicId) filled++

    // Check contact log
    const contactLog = formValues.contactLog || []
    contactLog.forEach((entry) => {
      total += 4
      if (entry.date) filled++
      if (entry.contactType) filled++
      if (entry.sessionStatus) filled++
      if (entry.location) filled++
    })

    // Check CPP objectives (sample)
    Object.keys(formValues.cppObjectives || {}).forEach((key) => {
      const obj = formValues.cppObjectives[key]
      const itemCount = Object.keys(obj || {}).length
      total += itemCount
      filled += Object.values(obj || {}).filter((v) => v > 0).length
    })

    return total > 0 ? Math.round((filled / total) * 100) : 0
  }, [formValues])

  const progress = calculateProgress()

  const handleExportPDF = useCallback(() => {
    alert('PDF export for Core Intervention form coming soon!')
  }, [])

  // Build focus mode sections
  const focusModeSections = useMemo((): FocusModeSection[] => {
    return sections.map((section) => ({
      id: section.id,
      name: section.label,
      items: [{
        id: `${section.id}_overview`,
        label: section.label,
        sectionName: section.shortLabel,
        isComplete: false, // Simplified
        content: (
          <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
            <h4 className="font-medium text-teal-800 mb-2">{section.label}</h4>
            <p className="text-gray-700">Navigate to this section to complete the items.</p>
          </div>
        ),
      }],
    }))
  }, [])

  const handleFocusModeSection = useCallback((sectionId: string) => {
    setCurrentSection(sectionId as SectionId)
  }, [])

  const renderSection = () => {
    switch (currentSection) {
      case 'identification':
        return <IdentificationSection />
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
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 float-animation">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold gradient-text truncate max-w-[200px]">
                      {formValues.identification?.clientInitials || 'Core Intervention'}
                    </h1>
                    {progress === 100 && (
                      <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-medium">
                        Complete!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Core Intervention Phase
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Focus Mode Button */}
              <button
                onClick={() => setShowFocusMode(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md shadow-indigo-500/30 hover:shadow-indigo-500/50"
                aria-label="Enter Focus Mode"
                title="Focus Mode - Review items one at a time"
              >
                <Focus className="w-4 h-4" />
                <span className="hidden sm:inline">Focus</span>
              </button>
              <span className="w-px h-6 bg-gray-200 mx-1" />
              {/* Wellness Features */}
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
                className="p-2.5 rounded-xl hover:bg-green-50 text-green-500 hover:text-green-600 transition-all"
                aria-label="Fidelity Compass"
                title="Fidelity Compass"
              >
                <Compass className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowJournal(true)}
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
                         bg-gradient-to-r from-teal-500 to-cyan-500
                         text-white text-sm font-semibold rounded-xl
                         hover:from-teal-600 hover:to-cyan-600
                         transition-all shadow-lg shadow-cyan-500/30
                         hover:shadow-cyan-500/50 hover:-translate-y-0.5"
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
                      : 'bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500'
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
                      ${isActive ? 'bg-teal-100 text-teal-800' : 'text-gray-700 hover:bg-white/80'}
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-gray-400'}`} />
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

      {/* Focus Mode */}
      <GlobalFocusMode
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
        sections={focusModeSections}
        currentSectionId={currentSection}
        title="Core Intervention Focus Mode"
        onSectionChange={handleFocusModeSection}
      />
    </FormProvider>
  )
}
