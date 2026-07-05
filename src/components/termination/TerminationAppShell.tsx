import { useState, useCallback, useMemo, useEffect } from 'react'
import { X } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import type { TerminationFormData } from '@/types/termination.types'
import { createDefaultTerminationFormData } from '@/data/terminationSchema'
import { FormShellHeader } from '@/components/layout/FormShellHeader'

// Create default values once outside component to ensure stability
// Use JSON parse/stringify to ensure a pure plain object with no prototype chain issues
const defaultFormData: TerminationFormData = JSON.parse(
  JSON.stringify(createDefaultTerminationFormData())
)

// Section components
import { ClosingFormSection } from './sections/ClosingFormSection'
import { PlannedTerminationSection } from './sections/PlannedTerminationSection'
import { UnplannedTerminationSection } from './sections/UnplannedTerminationSection'
import { CoreInterventionFidelitySection } from './sections/CoreInterventionFidelitySection'
import { CPPObjectivesSection } from './sections/CPPObjectivesSection'

type SectionId =
  | 'closing'
  | 'planned'
  | 'unplanned'
  | 'coreIntervention'
  | 'cppObjectives'

interface Section {
  id: SectionId
  label: string
  shortLabel: string
}

const sections: Section[] = [
  { id: 'closing', label: 'CPP Closing Form', shortLabel: 'Closing Form' },
  { id: 'planned', label: 'Procedural Fidelity: Planned Termination', shortLabel: 'Planned Termination' },
  { id: 'unplanned', label: 'Procedural Fidelity: Unplanned Termination', shortLabel: 'Unplanned Termination' },
  { id: 'coreIntervention', label: 'CPP Core Intervention Fidelity', shortLabel: 'Intervention Fidelity' },
  { id: 'cppObjectives', label: 'CPP Case Conceptualization', shortLabel: 'CPP Objectives' },
]

interface TerminationAppShellProps {
  onBack: () => void
  clientInitials?: string
}

export function TerminationAppShell({ onBack, clientInitials }: TerminationAppShellProps) {
  const storageKey = `cf_form_termination_${(clientInitials || 'default').trim().toUpperCase()}`
  const [currentSection, setCurrentSection] = useState<SectionId>('closing')
  const [navOpen, setNavOpen] = useState(false)

  const methods = useForm<TerminationFormData>({
    defaultValues: (() => {
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) return { ...defaultFormData, ...JSON.parse(saved) }
      } catch (error) {
        console.error('Error loading saved termination form', error)
      }
      return defaultFormData
    })(),
    mode: 'onChange',
  })

  // Auto-save per client
  useEffect(() => {
    const subscription = methods.watch(data => {
      localStorage.setItem(storageKey, JSON.stringify(data))
    })
    return () => subscription.unsubscribe()
  }, [methods, storageKey])

  const { watch } = methods
  const formValues = watch()

  // Calculate per-section progress
  const sectionProgress = useMemo(() => {
    const progress: Record<SectionId, number> = {
      closing: 0,
      planned: 0,
      unplanned: 0,
      coreIntervention: 0,
      cppObjectives: 0,
    }

    // Closing Form progress (identification + 7 questions)
    const closing = formValues.closingForm
    let closingCompleted = 0
    const closingTotal = 12 // 5 identification + 7 questions
    if (closing.clinicalTeamNames) closingCompleted++
    if (closing.clientInitials) closingCompleted++
    if (closing.childFirstSite) closingCompleted++
    if (closing.monthYear) closingCompleted++
    if (closing.careLogicId) closingCompleted++
    if (closing.terminationPhase) closingCompleted++
    if (closing.terminationInitiator) closingCompleted++
    if (closing.terminationType) closingCompleted++
    if (closing.changeInFunctioning) closingCompleted++
    if (closing.prognosis) closingCompleted++
    // Closing reasons count as 1 if any selected
    const anyReasonSelected = Object.values(closing.closingReasons).some(v => v === true || (typeof v === 'string' && v.length > 0))
    if (anyReasonSelected) closingCompleted++
    if (closing.transferToAnotherClinician !== null) closingCompleted++
    progress.closing = Math.round((closingCompleted / closingTotal) * 100)

    // Planned Termination progress
    const planned = formValues.plannedTermination
    const plannedItems = Object.entries(planned.items).filter(([key]) => !key.includes('lessThan'))
    const plannedCompleted = plannedItems.filter(([, v]) => v !== null).length
    progress.planned = Math.round((plannedCompleted / plannedItems.length) * 100)

    // Unplanned Termination progress
    const unplanned = formValues.unplannedTermination
    const unplannedCompleted = Object.values(unplanned.items).filter(v => v !== null).length
    progress.unplanned = Math.round((unplannedCompleted / 5) * 100)

    // Core Intervention Fidelity - simplified calculation
    // Count non-null responses in the nested structure
    let coreTotal = 0
    let coreCompleted = 0
    const countDualResponses = (obj: unknown): void => {
      if (obj && typeof obj === 'object') {
        if ('clinician' in obj && 'careCoordinator' in obj) {
          coreTotal += 2
          if ((obj as { clinician: unknown }).clinician !== null) coreCompleted++
          if ((obj as { careCoordinator: unknown }).careCoordinator !== null) coreCompleted++
        } else {
          Object.values(obj).forEach(countDualResponses)
        }
      }
    }
    countDualResponses(formValues.coreInterventionFidelity)
    progress.coreIntervention = coreTotal > 0 ? Math.round((coreCompleted / coreTotal) * 100) : 0

    // CPP Objectives progress
    let objTotal = 0
    let objCompleted = 0
    const countObjectiveRatings = (obj: unknown): void => {
      if (obj && typeof obj === 'object') {
        if ('clinicalFocus' in obj && 'appropriateness' in obj && 'progressCurrent' in obj) {
          objTotal += 3
          if ((obj as { clinicalFocus: unknown }).clinicalFocus !== null) objCompleted++
          if ((obj as { appropriateness: unknown }).appropriateness !== null) objCompleted++
          if ((obj as { progressCurrent: unknown }).progressCurrent !== null) objCompleted++
        } else {
          Object.values(obj).forEach(countObjectiveRatings)
        }
      }
    }
    countObjectiveRatings(formValues.cppObjectives)
    progress.cppObjectives = objTotal > 0 ? Math.round((objCompleted / objTotal) * 100) : 0

    return progress
  }, [formValues])

  // Calculate overall progress
  const progress = useMemo(() => {
    const values = Object.values(sectionProgress)
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  }, [sectionProgress])

  // Get progress bar color
  const getProgressColor = (value: number): string => {
    if (value === 0) return 'bg-gray-200'
    if (value < 50) return 'bg-yellow-400'
    if (value < 100) return 'bg-blue-400'
    return 'bg-green-500'
  }

  const handleExportPDF = useCallback(() => {
    // TODO: Implement PDF export for termination form
    console.log('Export Termination PDF', methods.getValues())
  }, [methods])

  // Build focus mode sections


  const renderSection = () => {
    switch (currentSection) {
      case 'closing':
        return <ClosingFormSection />
      case 'planned':
        return <PlannedTerminationSection />
      case 'unplanned':
        return <UnplannedTerminationSection />
      case 'coreIntervention':
        return <CoreInterventionFidelitySection />
      case 'cppObjectives':
        return <CPPObjectivesSection />
      default:
        return null
    }
  }


  return (
    <FormProvider {...methods}>
      <div className="min-h-screen animated-gradient-bg">
        <FormShellHeader
          title={formValues.closingForm.clientInitials || 'Termination'}
          subtitle="Termination packet (yellow form)"
          progress={progress}
          onBack={onBack}
          onMenu={() => setNavOpen(true)}
          onExportPDF={handleExportPDF}
        />

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
              fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50
              transform transition-transform duration-300 ease-in-out
              lg:translate-x-0 lg:static lg:z-0
              ${navOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
              <h2 className="font-semibold text-gray-900">Sections</h2>
              <button
                onClick={() => setNavOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Termination Fidelity
              </h2>
              <p className="text-sm text-gray-500 mt-1">Recapitulation & Termination Phase</p>
            </div>

            {/* Section list */}
            <div className="overflow-y-auto h-[calc(100vh-65px)] lg:h-[calc(100vh-80px)]">
              <ul className="py-2">
                {sections.map((section, index) => {
                  const progressValue = sectionProgress[section.id]
                  const isActive = currentSection === section.id

                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => {
                          setCurrentSection(section.id)
                          setNavOpen(false)
                        }}
                        className={`
                          w-full text-left px-4 py-3 flex items-center gap-3
                          transition-colors duration-150
                          ${isActive
                            ? 'bg-yellow-50 border-r-2 border-yellow-500'
                            : 'hover:bg-gray-50'
                          }
                        `}
                      >
                        {/* Section number */}
                        <span
                          className={`
                            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                            ${isActive
                              ? 'bg-yellow-500 text-white'
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
                              ${isActive ? 'text-yellow-700' : 'text-gray-700'}
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

          {/* Main content */}
          <main className="flex-1 min-h-[calc(100vh-73px)] p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              {renderSection()}
            </div>
          </main>
        </div>

        {/* Wellness Modals */}
      </div>
    </FormProvider>
  )
}
