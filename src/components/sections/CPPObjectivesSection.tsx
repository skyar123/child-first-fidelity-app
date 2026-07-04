import { useFormContext } from 'react-hook-form'
import type { FormData, CPPObjective, ClinicalFocusRating, AppropriatenessRating, ProgressRating } from '@/types/form.types'
import {
  cppObjectives,
  CLINICAL_FOCUS_LABELS,
  APPROPRIATENESS_LABELS,
  PROGRESS_SCALE_LABELS,
  PROGRESS_SHORT_LABELS,
} from '@/data/cppObjectives'
import type { CPPObjectiveContent } from '@/data/cppObjectives'
import { Target, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface ObjectiveCardProps {
  objective: CPPObjectiveContent
  value: CPPObjective | undefined
  onChange: (field: keyof CPPObjective, value: unknown) => void
}

function RatingRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function ObjectiveCard({ objective, value, onChange }: ObjectiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const clinicalFocus = value?.clinicalFocus ?? null
  const appropriateness = value?.appropriateness ?? null
  const progressReferral = value?.progressReferral ?? null
  const progressCurrent = value?.progressCurrent ?? null
  const notes = value?.notes ?? ''

  const hasData =
    clinicalFocus !== null ||
    appropriateness !== null ||
    progressReferral !== null ||
    progressCurrent !== null ||
    notes.trim().length > 0

  return (
    <div
      className={`bg-white rounded-lg border transition-all ${
        hasData ? 'border-indigo-200 shadow-sm' : 'border-gray-200'
      }`}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span
          className={`flex-shrink-0 inline-flex items-center justify-center w-7 h-7
                       text-sm font-semibold rounded-full ${
                         hasData ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                       }`}
        >
          <Target className="w-4 h-4" />
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900">{objective.title}</h4>
          {!isExpanded && hasData && (
            <div className="flex flex-wrap gap-2 mt-2">
              {clinicalFocus !== null && (
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                  Focus: {clinicalFocus} — {CLINICAL_FOCUS_LABELS[clinicalFocus]}
                </span>
              )}
              {progressCurrent !== null && (
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  Current: {PROGRESS_SHORT_LABELS[progressCurrent]}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 text-gray-400">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* Official intervention examples for this objective */}
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            {objective.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <RatingRow label="Clinical Focus (0–3)">
            {([0, 1, 2, 3] as const).map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() =>
                  onChange('clinicalFocus', clinicalFocus === rating ? null : (rating as ClinicalFocusRating))
                }
                className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                  clinicalFocus === rating
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                }`}
              >
                {rating}: {CLINICAL_FOCUS_LABELS[rating]}
              </button>
            ))}
          </RatingRow>

          <RatingRow label="Appropriateness">
            {(['under', 'appropriate', 'over'] as const).map(rating => (
              <button
                key={rating}
                type="button"
                title={APPROPRIATENESS_LABELS[rating]}
                onClick={() =>
                  onChange('appropriateness', appropriateness === rating ? null : (rating as AppropriatenessRating))
                }
                className={`px-3 py-1.5 text-sm rounded-lg border transition-all capitalize ${
                  appropriateness === rating
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                }`}
              >
                {rating}
              </button>
            ))}
          </RatingRow>

          <RatingRow label="Progress at Referral (0–3)">
            {([0, 1, 2, 3] as const).map(rating => (
              <button
                key={rating}
                type="button"
                title={PROGRESS_SCALE_LABELS[rating]}
                onClick={() =>
                  onChange('progressReferral', progressReferral === rating ? null : (rating as ProgressRating))
                }
                className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                  progressReferral === rating
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                }`}
              >
                {rating}: {PROGRESS_SHORT_LABELS[rating]}
              </button>
            ))}
          </RatingRow>

          <RatingRow label="Progress Current — end of Foundational Phase (0–3)">
            {([0, 1, 2, 3] as const).map(rating => (
              <button
                key={rating}
                type="button"
                title={PROGRESS_SCALE_LABELS[rating]}
                onClick={() =>
                  onChange('progressCurrent', progressCurrent === rating ? null : (rating as ProgressRating))
                }
                className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                  progressCurrent === rating
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                }`}
              >
                {rating}: {PROGRESS_SHORT_LABELS[rating]}
              </button>
            ))}
          </RatingRow>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => onChange('notes', e.target.value)}
              placeholder="Observations for supervision discussion..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:border-indigo-500 placeholder:text-gray-400 text-sm resize-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function CPPObjectivesSection() {
  const { watch, setValue } = useFormContext<FormData>()
  const cppData = watch('cppObjectives')

  const completedObjectives = cppObjectives.filter(obj => {
    const data = cppData?.objectives?.[obj.id]
    return data?.clinicalFocus !== null && data?.clinicalFocus !== undefined
  }).length

  const percentComplete = Math.round((completedObjectives / cppObjectives.length) * 100)

  const handleObjectiveChange = (objectiveId: string, field: keyof CPPObjective, value: unknown) => {
    const currentData = cppData?.objectives?.[objectiveId] || {
      clinicalFocus: null,
      appropriateness: null,
      progressReferral: null,
      progressCurrent: null,
      notes: '',
    }

    setValue(
      `cppObjectives.objectives.${objectiveId}`,
      {
        ...currentData,
        [field]: value,
      },
      { shouldDirty: true }
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                CPP Case Conceptualization and Content Fidelity
              </h2>
              <p className="text-sm text-gray-500">
                Rate Clinical Focus, Appropriateness, and Progress (Referral → Current) for each CPP
                objective
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">{percentComplete}%</div>
            <div className="text-xs text-gray-500">
              {completedObjectives}/{cppObjectives.length} rated
            </div>
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div className="space-y-2">
        {cppObjectives.map(objective => (
          <ObjectiveCard
            key={objective.id}
            objective={objective}
            value={cppData?.objectives?.[objective.id]}
            onChange={(field, value) => handleObjectiveChange(objective.id, field, value)}
          />
        ))}
      </div>

      {/* Rating Legend */}
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <h3 className="font-medium text-indigo-800 mb-3">Rating Guide (from the official form)</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-indigo-700 mb-1">Clinical Focus</h4>
            <ul className="text-indigo-600 space-y-0.5">
              {([0, 1, 2, 3] as const).map(r => (
                <li key={r}>
                  {r} = {CLINICAL_FOCUS_LABELS[r]}
                </li>
              ))}
            </ul>
            <h4 className="font-medium text-indigo-700 mb-1 mt-3">Appropriateness</h4>
            <ul className="text-indigo-600 space-y-0.5">
              {(['under', 'appropriate', 'over'] as const).map(r => (
                <li key={r}>{APPROPRIATENESS_LABELS[r]}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-indigo-700 mb-1">
              Progress Towards Objective (Referral = upon referral; Current = end of phase)
            </h4>
            <ul className="text-indigo-600 space-y-0.5">
              {([3, 2, 1, 0] as const).map(r => (
                <li key={r}>
                  {r} = {PROGRESS_SCALE_LABELS[r]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
