import { useFormContext } from 'react-hook-form'
import type { FormData } from '@/types/form.types'
import { homeVisitSections, getTotalHomeVisitItems } from '@/data/homeVisitItems'
import { Home, CheckCircle2 } from 'lucide-react'

export function HomeVisitSection() {
  const { register, watch } = useFormContext<FormData>()
  const homeVisit = watch('homeVisit')

  // Calculate completion for each section and total
  const getSectionCompletion = (sectionId: 'beforeVisit' | 'duringVisit' | 'afterVisit') => {
    const section = homeVisitSections.find(s => s.id === sectionId)
    if (!section) return { completed: 0, total: 0 }

    const sectionData = homeVisit?.[sectionId] || {}
    const completed = section.items.filter(item => sectionData[item.id]).length

    return { completed, total: section.items.length }
  }

  const totalItems = getTotalHomeVisitItems()
  const totalCompleted = homeVisitSections.reduce((sum, section) => {
    const sectionData = homeVisit?.[section.id] || {}
    return sum + section.items.filter(item => sectionData[item.id]).length
  }, 0)

  const percentComplete = Math.round((totalCompleted / totalItems) * 100)

  const getSectionIcon = (sectionId: string) => {
    switch (sectionId) {
      case 'beforeVisit':
        return '📋'
      case 'duringVisit':
        return '🏠'
      case 'afterVisit':
        return '📝'
      default:
        return '📌'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Home className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Home Visit Checklists</h2>
              <p className="text-sm text-gray-500">
                Track preparation, session activities, and follow-up
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-600">{percentComplete}%</div>
            <div className="text-xs text-gray-500">{totalCompleted}/{totalItems} items</div>
          </div>
        </div>

        {/* Section Progress Bars */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {homeVisitSections.map(section => {
            const { completed, total } = getSectionCompletion(section.id)
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0
            return (
              <div key={section.id} className="text-center">
                <div className="text-xs text-gray-500 mb-1">{section.title}</div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">{completed}/{total}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Checklist Sections */}
      {homeVisitSections.map(section => {
        const { completed, total } = getSectionCompletion(section.id)
        const isComplete = completed === total && total > 0

        return (
          <div
            key={section.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Section Header */}
            <div className={`p-4 border-b ${
              isComplete ? 'bg-cyan-50 border-cyan-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getSectionIcon(section.id)}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isComplete && (
                    <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    isComplete ? 'text-cyan-600' : 'text-gray-500'
                  }`}>
                    {completed}/{total}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="divide-y divide-gray-100">
              {section.items.map(item => {
                const isChecked = homeVisit?.[section.id]?.[item.id] || false

                return (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors
                              hover:bg-gray-50 ${isChecked ? 'bg-cyan-50/50' : ''}`}
                  >
                    <div className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        {...register(`homeVisit.${section.id}.${item.id}`)}
                        className="sr-only peer"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center
                                    transition-all ${
                        isChecked
                          ? 'bg-cyan-600 border-cyan-600'
                          : 'bg-white border-gray-300 peer-hover:border-cyan-400'
                      }`}>
                        {isChecked && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-sm ${
                      isChecked ? 'text-gray-600' : 'text-gray-700'
                    }`}>
                      {item.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Quick Actions */}
      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
        <h3 className="font-medium text-cyan-800 mb-2">Session Reminders</h3>
        <ul className="text-sm text-cyan-700 space-y-1">
          <li>• Bring necessary materials and assessment tools</li>
          <li>• Allow extra time for travel and transitions</li>
          <li>• Be mindful of the family's schedule and needs</li>
          <li>• Document session notes within 24 hours</li>
          <li>• Schedule next session before leaving</li>
        </ul>
      </div>
    </div>
  )
}
