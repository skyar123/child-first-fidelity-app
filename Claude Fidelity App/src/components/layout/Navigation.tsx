import { X } from 'lucide-react'
import { useFormState } from '@/context/FormContext'

export type SectionId =
  | 'demographics'
  | 'fidelity'
  | 'contactLog'
  | 'assessment'
  | 'feedback'
  | 'formulation'
  | 'planOfCare'
  | 'homeVisit'
  | 'cppObjectives'
  | 'careCoordinator'

interface Section {
  id: SectionId
  label: string
  shortLabel: string
  progressKey: keyof typeof progressKeyMap
  conditionallyHidden?: boolean
}

const progressKeyMap = {
  demographics: 'caseIdentification',
  fidelity: 'fidelityStrands',
  contactLog: 'contactLog',
  assessment: 'assessmentChecklist',
  feedback: 'traumaFeedback',
  formulation: 'formulationPlanning',
  planOfCare: 'formulationPlanning',
  homeVisit: 'homeVisitChecklists',
  cppObjectives: 'cppObjectives',
  careCoordinator: 'careCoordinator',
} as const

const sections: Section[] = [
  {
    id: 'demographics',
    label: 'Case Identification & Demographics',
    shortLabel: 'Demographics',
    progressKey: 'demographics',
  },
  {
    id: 'fidelity',
    label: 'Fidelity Strands',
    shortLabel: 'Fidelity',
    progressKey: 'fidelity',
  },
  {
    id: 'contactLog',
    label: 'Contact Log',
    shortLabel: 'Contacts',
    progressKey: 'contactLog',
  },
  {
    id: 'assessment',
    label: 'Assessment & Engagement Checklist',
    shortLabel: 'Assessment',
    progressKey: 'assessment',
  },
  {
    id: 'careCoordinator',
    label: 'III. Care Coordinator Interventions',
    shortLabel: 'Care Coord.',
    progressKey: 'careCoordinator',
  },
  {
    id: 'feedback',
    label: 'Trauma-Informed CPP Feedback',
    shortLabel: 'Feedback',
    progressKey: 'feedback',
    conditionallyHidden: true, // Hidden if no trauma history
  },
  {
    id: 'formulation',
    label: 'Formulation & Treatment Planning',
    shortLabel: 'Planning',
    progressKey: 'formulation',
  },
  {
    id: 'planOfCare',
    label: 'Child & Family Plan of Care',
    shortLabel: 'Plan of Care',
    progressKey: 'planOfCare',
  },
  {
    id: 'homeVisit',
    label: 'Home Visit Checklists',
    shortLabel: 'Home Visit',
    progressKey: 'homeVisit',
  },
  {
    id: 'cppObjectives',
    label: 'CPP Case Conceptualization',
    shortLabel: 'CPP Objectives',
    progressKey: 'cppObjectives',
  },
]

interface NavigationProps {
  currentSection: SectionId
  onSectionChange: (section: SectionId) => void
  isOpen: boolean
  onClose: () => void
  showTraumaFeedback?: boolean
}

export function Navigation({
  currentSection,
  onSectionChange,
  isOpen,
  onClose,
  showTraumaFeedback = true,
}: NavigationProps) {
  const { progress } = useFormState()

  const getProgressForSection = (section: Section): number => {
    const key = progressKeyMap[section.progressKey]
    return progress.sections[key] ?? 0
  }

  const getProgressColor = (value: number): string => {
    if (value === 0) return 'bg-gray-200'
    if (value < 50) return 'bg-yellow-400'
    if (value < 100) return 'bg-blue-400'
    return 'bg-green-500'
  }

  const visibleSections = sections.filter((section) => {
    if (section.conditionallyHidden && !showTraumaFeedback) return false
    return true
  })

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="font-semibold text-gray-900">Sections</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:block p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            CPP Fidelity Assessment
          </h2>
          <p className="text-sm text-gray-500 mt-1">Foundational Phase</p>
        </div>

        {/* Section list */}
        <div className="overflow-y-auto h-[calc(100vh-65px)] lg:h-[calc(100vh-80px)]">
          <ul className="py-2">
            {visibleSections.map((section, index) => {
              const progressValue = getProgressForSection(section)
              const isActive = currentSection === section.id

              return (
                <li key={section.id}>
                  <button
                    onClick={() => {
                      onSectionChange(section.id)
                      onClose()
                    }}
                    className={`
                      w-full text-left px-4 py-3 flex items-center gap-3
                      transition-colors duration-150
                      ${isActive
                        ? 'bg-blue-50 border-r-2 border-blue-600'
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    {/* Section number */}
                    <span
                      className={`
                        flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                        ${isActive
                          ? 'bg-blue-600 text-white'
                          : progressValue === 100
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }
                      `}
                    >
                      {index + 1}
                    </span>

                    {/* Section info */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={`
                          block text-sm font-medium truncate
                          ${isActive ? 'text-blue-700' : 'text-gray-700'}
                        `}
                      >
                        {section.shortLabel}
                      </span>

                      {/* Progress bar */}
                      <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getProgressColor(progressValue)}`}
                          style={{ width: `${progressValue}%` }}
                        />
                      </div>
                    </div>

                    {/* Progress percentage */}
                    <span className="flex-shrink-0 text-xs text-gray-500">
                      {progressValue}%
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}
