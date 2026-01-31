import { useMemo, useEffect, useRef } from 'react'
import { X, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { useFormState } from '@/context/FormContext'
import { getProgressMessage, celebrateCompletion } from '@/utils/celebrations'

export type SectionId =
  | 'demographics'
  | 'fidelity'
  | 'contactLog'
  | 'assessment'
  | 'careCoordinator'
  | 'feedback'
  | 'formulation'
  | 'planOfCare'
  | 'homeVisit'
  | 'cppObjectives'
  | 'programFidelity'

interface Section {
  id: SectionId
  label: string
  shortLabel: string
  icon: string
}

const sections: Section[] = [
  { id: 'demographics', label: 'Client Registration', shortLabel: 'Registration', icon: '📋' },
  { id: 'fidelity', label: 'Fidelity Strands', shortLabel: 'Fidelity', icon: '🎯' },
  { id: 'contactLog', label: 'Contact Log', shortLabel: 'Contacts', icon: '📞' },
  { id: 'assessment', label: 'Assessment & Engagement', shortLabel: 'Assessment', icon: '🔍' },
  { id: 'careCoordinator', label: 'III. Care Coordinator', shortLabel: 'Care Coord.', icon: '🤝' },
  { id: 'feedback', label: 'Trauma Feedback Session', shortLabel: 'Feedback', icon: '💬' },
  { id: 'formulation', label: 'Formulation & Planning', shortLabel: 'Formulation', icon: '📝' },
  { id: 'planOfCare', label: 'Plan of Care', shortLabel: 'Plan', icon: '🗺️' },
  { id: 'homeVisit', label: 'Home Visit Checklists', shortLabel: 'Home Visit', icon: '🏠' },
  { id: 'cppObjectives', label: 'CPP Case Conceptualization', shortLabel: 'CPP', icon: '🎓' },
  { id: 'programFidelity', label: 'Program Fidelity Checklist', shortLabel: 'Program Fidelity', icon: '📊' },
]

interface NavigationProps {
  currentSection: SectionId
  onSectionChange: (section: SectionId) => void
  isOpen: boolean
  onClose: () => void
}

export function Navigation({
  currentSection,
  onSectionChange,
  isOpen,
  onClose,
}: NavigationProps) {
  const { progress } = useFormState()
  const prevProgressRef = useRef<Record<string, number>>({})

  const getSectionProgress = (sectionId: SectionId): number => {
    switch (sectionId) {
      case 'demographics':
        return progress.sections.caseIdentification
      case 'fidelity':
        return progress.sections.fidelityStrands
      case 'contactLog':
        return progress.sections.contactLog
      case 'assessment':
        return progress.sections.assessmentChecklist
      case 'careCoordinator':
        return progress.sections.careCoordinator
      case 'feedback':
        return progress.sections.traumaFeedback
      case 'formulation':
        return progress.sections.formulationPlanning
      case 'planOfCare':
        return 0
      case 'homeVisit':
        return progress.sections.homeVisitChecklists
      case 'cppObjectives':
        return progress.sections.cppObjectives
      case 'programFidelity':
        return progress.sections.programFidelity
      default:
        return 0
    }
  }

  // Find next incomplete section
  const nextIncompleteSection = useMemo(() => {
    for (const section of sections) {
      const sectionProgress = getSectionProgress(section.id)
      if (sectionProgress < 100) {
        return section
      }
    }
    return null
  }, [progress])

  // Check for section completion and celebrate
  useEffect(() => {
    sections.forEach((section) => {
      const currentProgress = getSectionProgress(section.id)
      const prevProgress = prevProgressRef.current[section.id] || 0
      
      if (currentProgress === 100 && prevProgress < 100 && prevProgress > 0) {
        celebrateCompletion()
      }
      
      prevProgressRef.current[section.id] = currentProgress
    })
  }, [progress])

  const handleSectionClick = (sectionId: SectionId) => {
    onSectionChange(sectionId)
    onClose()
  }

  const handleNextIncomplete = () => {
    if (nextIncompleteSection) {
      onSectionChange(nextIncompleteSection.id)
      onClose()
    }
  }

  const progressMessage = getProgressMessage(progress.overall)
  const completedSections = sections.filter(s => getSectionProgress(s.id) === 100).length

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Navigation sidebar */}
      <nav
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-57px)] w-72 
          glass-sidebar
          transform transition-transform duration-300 ease-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 lg:hidden">
          <span className="font-semibold text-gray-900">Sections</span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/50 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Progress Header */}
        <div className="p-4 border-b border-white/20">
          {/* Overall Progress Ring */}
          <div className="flex items-center gap-4 mb-3">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progress.overall * 1.76} 176`}
                  className="transition-all duration-500 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold gradient-text">{progress.overall}%</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{progressMessage.emoji}</span>
                <span className="font-semibold text-gray-900">{progressMessage.message}</span>
              </div>
              <p className="text-xs text-gray-500">
                {completedSections} of {sections.length} sections complete
              </p>
            </div>
          </div>

          {/* Next Incomplete Button */}
          {nextIncompleteSection && nextIncompleteSection.id !== currentSection && (
            <button
              onClick={handleNextIncomplete}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 
                       rounded-xl border border-cyan-200/50 hover:from-cyan-500/20 hover:to-purple-500/20 
                       transition-all group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span className="text-sm font-medium text-gray-700">Continue: {nextIncompleteSection.shortLabel}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* All Complete Message */}
          {!nextIncompleteSection && (
            <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 
                          rounded-xl border border-green-200/50">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">All sections complete! 🎉</span>
            </div>
          )}
        </div>

        {/* Section list */}
        <div className="p-2 overflow-y-auto h-[calc(100%-200px)] lg:h-[calc(100%-180px)]">
          {sections.map((section, index) => {
            const isActive = currentSection === section.id
            const sectionProgress = getSectionProgress(section.id)
            const isComplete = sectionProgress === 100

            return (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`
                  w-full text-left px-3 py-3 rounded-xl mb-1.5 transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 shadow-lg shadow-cyan-500/10'
                    : 'hover:bg-white/60'
                  }
                  ${isComplete && !isActive ? 'bg-green-50/50' : ''}
                  group
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  {/* Icon/Status */}
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm
                    transition-all duration-300
                    ${isComplete 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30' 
                      : isActive
                        ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }
                  `}>
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span>{section.icon}</span>
                    )}
                  </div>

                  {/* Label & Progress */}
                  <div className="flex-1 min-w-0">
                    <span className={`
                      text-sm font-medium truncate block
                      ${isActive ? 'text-cyan-700' : isComplete ? 'text-green-700' : 'text-gray-700'}
                    `}>
                      {section.shortLabel}
                    </span>
                    
                    {/* Mini progress bar */}
                    <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ease-out rounded-full ${
                          isComplete 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                            : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                        }`}
                        style={{ width: `${sectionProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Progress Badge */}
                  <span
                    className={`
                      text-xs px-2 py-1 rounded-lg font-medium transition-all
                      ${isComplete
                        ? 'bg-green-100 text-green-700'
                        : sectionProgress > 0
                          ? 'bg-cyan-100 text-cyan-700'
                          : 'bg-gray-100 text-gray-500'
                      }
                    `}
                  >
                    {sectionProgress}%
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
