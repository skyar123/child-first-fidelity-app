import { useFormContext, useFieldArray } from 'react-hook-form'
import type { FormData } from '@/types/form.types'
import { ClipboardList, Plus, Trash2, Target, AlertTriangle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

export function PlanOfCareSection() {
  const { register, control, watch } = useFormContext<FormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'planOfCare.goals'
  })

  const planOfCare = watch('planOfCare')

  const addGoal = () => {
    append({
      id: uuidv4(),
      goal: '',
      objectives: [''],
      interventions: '',
      targetDate: '',
      progress: ''
    })
  }

  // Calculate completion
  const goalsWithContent = fields.filter((_, index) => {
    const goal = planOfCare?.goals?.[index]
    return goal?.goal?.trim()
  }).length

  const hasSafetyPlan = planOfCare?.safetyPlan?.trim()?.length > 0
  const hasCrisisContacts = planOfCare?.crisisContacts?.trim()?.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Plan of Care</h2>
              <p className="text-sm text-gray-500">
                Treatment goals, safety planning, and crisis contacts
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-emerald-600">
              {goalsWithContent} goal{goalsWithContent !== 1 ? 's' : ''} defined
            </div>
            <div className="flex gap-2 mt-1">
              {hasSafetyPlan && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Safety Plan
                </span>
              )}
              {hasCrisisContacts && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Crisis Contacts
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Goals */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h3 className="font-medium text-gray-900">Treatment Goals</h3>
            </div>
            <button
              type="button"
              onClick={addGoal}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium
                       text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100
                       transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {fields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No treatment goals added yet.</p>
              <button
                type="button"
                onClick={addGoal}
                className="mt-2 text-sm text-emerald-600 hover:text-emerald-700"
              >
                Click to add the first goal
              </button>
            </div>
          ) : (
            fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-7 h-7
                                 text-sm font-semibold text-emerald-700 bg-emerald-100
                                 rounded-full">
                    {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1.5 text-gray-400 hover:text-red-500
                             hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Goal Statement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Goal Statement
                    </label>
                    <textarea
                      {...register(`planOfCare.goals.${index}.goal`)}
                      placeholder="Describe the treatment goal..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                               focus:outline-none focus:ring-2 focus:ring-emerald-500
                               focus:border-emerald-500 placeholder:text-gray-400 text-sm resize-none"
                    />
                  </div>

                  {/* Objectives */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objectives
                    </label>
                    <textarea
                      {...register(`planOfCare.goals.${index}.interventions`)}
                      placeholder="List specific, measurable objectives for this goal..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                               focus:outline-none focus:ring-2 focus:ring-emerald-500
                               focus:border-emerald-500 placeholder:text-gray-400 text-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Target Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Date
                      </label>
                      <input
                        type="date"
                        {...register(`planOfCare.goals.${index}.targetDate`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                                 focus:outline-none focus:ring-2 focus:ring-emerald-500
                                 focus:border-emerald-500 text-sm"
                      />
                    </div>

                    {/* Progress */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Progress
                      </label>
                      <select
                        {...register(`planOfCare.goals.${index}.progress`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                                 focus:outline-none focus:ring-2 focus:ring-emerald-500
                                 focus:border-emerald-500 text-sm"
                      >
                        <option value="">Select progress...</option>
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="partially_met">Partially Met</option>
                        <option value="met">Met</option>
                        <option value="ongoing">Ongoing</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Safety Planning */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-medium text-gray-900">Safety Planning</h3>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Safety Plan
            </label>
            <textarea
              {...register('planOfCare.safetyPlan')}
              placeholder="Document the family's safety plan, including warning signs, coping strategies, and safe people to contact..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-amber-500
                       focus:border-amber-500 placeholder:text-gray-400 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crisis Contacts
            </label>
            <textarea
              {...register('planOfCare.crisisContacts')}
              placeholder="List emergency contacts, crisis hotlines, and local resources (e.g., 988 Suicide & Crisis Lifeline, local crisis team phone number)..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-amber-500
                       focus:border-amber-500 placeholder:text-gray-400 text-sm resize-none"
            />
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <h3 className="font-medium text-amber-800 mb-2">Safety Planning Guidelines</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Review and update safety plan regularly with the family</li>
          <li>• Include developmentally appropriate language for children</li>
          <li>• Identify specific warning signs and triggers</li>
          <li>• List multiple safe people and places</li>
          <li>• Include both professional and informal supports</li>
        </ul>
      </div>
    </div>
  )
}
