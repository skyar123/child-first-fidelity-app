import { useFormContext } from 'react-hook-form'
import type { FormData, CPPObjective, ClinicalFocusRating, AppropriatenessRating, ProgressRating } from '@/types/form.types'
import {
  cppObjectives,
  CPP_CATEGORIES,
  CLINICAL_FOCUS_LABELS,
  APPROPRIATENESS_LABELS,
  PROGRESS_LABELS,
  getObjectivesByCategory
} from '@/data/cppObjectives'
import { Target, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface ObjectiveCardProps {
  objective: typeof cppObjectives[0]
  value: CPPObjective | undefined
  onChange: (field: keyof CPPObjective, value: unknown) => void
}

function ObjectiveCard({ objective, value, onChange }: ObjectiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const clinicalFocus = value?.clinicalFocus ?? null
  const appropriateness = value?.appropriateness ?? null
  const progress = value?.progress ?? null
  const notes = value?.notes ?? ''

  const hasData = clinicalFocus !== null || appropriateness !== null || progress !== null || notes.trim().length > 0

  return (
    <div className={`bg-white rounded-lg border transition-all ${
      hasData ? 'border-indigo-200 shadow-sm' : 'border-gray-200'
    }`}>
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className={`flex-shrink-0 inline-flex items-center justify-center w-7 h-7
                       text-sm font-semibold rounded-full ${
          hasData ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {objective.number}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900">{objective.title}</h4>
          <p className="text-sm text-gray-500 mt-0.5">{objective.description}</p>

          {/* Quick status indicators when collapsed */}
          {!isExpanded && hasData && (
            <div className="flex flex-wrap gap-2 mt-2">
              {clinicalFocus !== null && (
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                  Focus: {CLINICAL_FOCUS_LABELS[clinicalFocus]}
                </span>
              )}
              {progress !== null && progress !== 'na' && (
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  Progress: {PROGRESS_LABELS[progress]}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 text-gray-400">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* Clinical Focus Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Focus
            </label>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onChange('clinicalFocus', clinicalFocus === rating ? null : rating as ClinicalFocusRating)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                    clinicalFocus === rating
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  {rating}: {CLINICAL_FOCUS_LABELS[rating]}
                </button>
              ))}
            </div>
          </div>

          {/* Appropriateness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appropriateness for This Case
            </label>
            <div className="flex flex-wrap gap-2">
              {(['appropriate', 'not_appropriate', 'na'] as AppropriatenessRating[]).map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onChange('appropriateness', appropriateness === rating ? null : rating)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                    appropriateness === rating
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  {APPROPRIATENESS_LABELS[rating!]}
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress
            </label>
            <div className="flex flex-wrap gap-2">
              {(['significant', 'moderate', 'minimal', 'none', 'na'] as ProgressRating[]).map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onChange('progress', progress === rating ? null : rating)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                    progress === rating
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                  }`}
                >
                  {PROGRESS_LABELS[rating!]}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes & Interventions
            </label>
            <textarea
              value={notes}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder="Document specific interventions used and observations..."
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

  // Calculate completion stats
  const completedObjectives = cppObjectives.filter(obj => {
    const data = cppData?.objectives?.[obj.id]
    return data?.clinicalFocus !== null && data?.clinicalFocus !== undefined
  }).length

  const percentComplete = Math.round((completedObjectives / cppObjectives.length) * 100)

  // Category stats
  const getCategoryStats = (category: string) => {
    const objectives = getObjectivesByCategory(category as typeof CPP_CATEGORIES[number])
    const completed = objectives.filter(obj => {
      const data = cppData?.objectives?.[obj.id]
      return data?.clinicalFocus !== null && data?.clinicalFocus !== undefined
    }).length
    return { completed, total: objectives.length }
  }

  const handleObjectiveChange = (objectiveId: string, field: keyof CPPObjective, value: unknown) => {
    const currentData = cppData?.objectives?.[objectiveId] || {
      clinicalFocus: null,
      appropriateness: null,
      progress: null,
      interventions: [],
      notes: ''
    }

    setValue(`cppObjectives.objectives.${objectiveId}`, {
      ...currentData,
      [field]: value
    }, { shouldDirty: true })
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
                CPP Treatment Objectives
              </h2>
              <p className="text-sm text-gray-500">
                Track clinical focus, appropriateness, and progress for 23 CPP objectives
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

      {/* Category Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CPP_CATEGORIES.map(category => {
          const stats = getCategoryStats(category)
          const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

          return (
            <div
              key={category}
              className="bg-white rounded-lg p-3 border border-gray-200"
            >
              <div className="text-xs text-gray-500 font-medium mb-1">{category}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  {stats.completed}/{stats.total}
                </span>
                <span className="text-xs text-indigo-600">{pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Objectives by Category */}
      {CPP_CATEGORIES.map(category => {
        const categoryObjectives = getObjectivesByCategory(category)

        return (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide px-1">
              {category}
            </h3>
            <div className="space-y-2">
              {categoryObjectives.map(objective => (
                <ObjectiveCard
                  key={objective.id}
                  objective={objective}
                  value={cppData?.objectives?.[objective.id]}
                  onChange={(field, value) => handleObjectiveChange(objective.id, field, value)}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* Rating Legend */}
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <h3 className="font-medium text-indigo-800 mb-3">Rating Guide</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-indigo-700 mb-1">Clinical Focus</h4>
            <ul className="text-indigo-600 space-y-0.5">
              <li>0 = Not a focus of treatment</li>
              <li>1 = Minor focus</li>
              <li>2 = Moderate focus</li>
              <li>3 = Major focus</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-indigo-700 mb-1">Progress</h4>
            <ul className="text-indigo-600 space-y-0.5">
              <li>Significant = Clear, substantial improvement</li>
              <li>Moderate = Notable positive change</li>
              <li>Minimal = Small improvement</li>
              <li>None = No observable change</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
