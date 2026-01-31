import { X } from 'lucide-react'
import { useFormState } from '@/context/FormContext'

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
}

const sections: Section[] = [
  { id: 'demographics', label: 'Client Registration', shortLabel: 'Registration' },
  { id: 'fidelity', label: 'Fidelity Strands', shortLabel: 'Fidelity' },
  { id: 'contactLog', label: 'Contact Log', shortLabel: 'Contacts' },
  { id: 'assessment', label: 'Assessment & Engagement', shortLabel: 'Assessment' },
  { id: 'careCoordinator', label: 'III. Care Coordinator', shortLabel: 'Care Coord.' },
  { id: 'feedback', label: 'Trauma Feedback Session', shortLabel: 'Feedback' },
  { id: 'formulation', label: 'Formulation & Planning', shortLabel: 'Formulation' },
  { id: 'planOfCare', label: 'Plan of Care', shortLabel: 'Plan' },
  { id: 'homeVisit', label: 'Home Visit Checklists', shortLabel: 'Home Visit' },
  { id: 'cppObjectives', label: 'CPP Case Conceptualization', shortLabel: 'CPP' },
  { id: 'programFidelity', label: 'Program Fidelity Checklist', shortLabel: 'Program Fidelity' },
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
        return 0 // Plan of Care progress not tracked in SectionProgress
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

  const handleSectionClick = (sectionId: SectionId) => {
    onSectionChange(sectionId)
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Navigation sidebar */}
      <nav
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-57px)] w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="font-semibold text-gray-900">Sections</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Section list */}
        <div className="p-2 overflow-y-auto h-full">
          {sections.map((section) => {
            const isActive = currentSection === section.id
            const sectionProgress = getSectionProgress(section.id)

            return (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`
                  w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-colors
                  ${isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">
                    {section.label}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      sectionProgress === 100
                        ? 'bg-green-100 text-green-700'
                        : sectionProgress > 0
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                    }`}
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
