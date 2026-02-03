import { useState, useCallback, useMemo } from 'react'
import { ArrowLeft, Menu, Download, X, Heart, Sparkles, Compass, PenLine, Focus } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import type { TerminationFormData } from '@/types/termination.types'
import { createDefaultTerminationFormData } from '@/data/terminationSchema'
import { GlobalFocusMode, type FocusModeSection } from '@/components/ui'

// Section components
import { ClosingFormSection } from './sections/ClosingFormSection'
import { PlannedTerminationSection } from './sections/PlannedTerminationSection'
import { UnplannedTerminationSection } from './sections/UnplannedTerminationSection'
import { TerminationContactLogSection } from './sections/TerminationContactLogSection'
import { CoreInterventionFidelitySection } from './sections/CoreInterventionFidelitySection'
import { CPPObjectivesSection } from './sections/CPPObjectivesSection'
import { GroundingExercise } from '@/components/ui/GroundingExercise'
import { FidelityCompass } from '@/components/ui/FidelityCompass'
import { ReflectiveJournal } from '@/components/ui/ReflectiveJournal'
import { getProgressMessage } from '@/utils/celebrations'

type SectionId =
  | 'closing'
  | 'planned'
  | 'unplanned'
  | 'contactLog'
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
  { id: 'contactLog', label: 'CPP Contact Log', shortLabel: 'Contact Log' },
  { id: 'coreIntervention', label: 'CPP Core Intervention Fidelity', shortLabel: 'Intervention Fidelity' },
  { id: 'cppObjectives', label: 'CPP Case Conceptualization', shortLabel: 'CPP Objectives' },
]

interface TerminationAppShellProps {
  onBack: () => void
}

export function TerminationAppShell({ onBack }: TerminationAppShellProps) {
  const [currentSection, setCurrentSection] = useState<SectionId>('closing')
  const [navOpen, setNavOpen] = useState(false)
  const [showGrounding, setShowGrounding] = useState(false)
  const [showCompass, setShowCompass] = useState(false)
  const [showJournal, setShowJournal] = useState(false)
  const [showFocusMode, setShowFocusMode] = useState(false)

  const methods = useForm<TerminationFormData>({
    defaultValues: createDefaultTerminationFormData(),
    mode: 'onChange',
  })

  const { watch } = methods
  const formValues = watch()

  // Calculate per-section progress
  const sectionProgress = useMemo(() => {
    const progress: Record<SectionId, number> = {
      closing: 0,
      planned: 0,
      unplanned: 0,
      contactLog: 0,
      coreIntervention: 0,
      cppObjectives: 0,
    }

    // Closing Form progress (identification + 7 questions)
    const closing = formValues.closingForm
    let closingCompleted = 0
    let closingTotal = 12 // 5 identification + 7 questions
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

    // Contact Log progress (at least one entry = 100%)
    progress.contactLog = formValues.contactLog.entries.length > 0 ? 100 : 0

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
  const focusModeSections = useMemo((): FocusModeSection[] => {
    return sections.map((section) => ({
      id: section.id,
      name: section.label,
      items: [{
        id: `${section.id}_overview`,
        label: section.shortLabel,
        sectionName: section.label,
        isComplete: sectionProgress[section.id] === 100,
        content: (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="font-medium text-amber-800 mb-2">{section.label}</h4>
            <p className="text-gray-700">Navigate to this section to complete the items.</p>
            <p className="text-xs text-gray-500 mt-2">Progress: {sectionProgress[section.id]}% complete</p>
          </div>
        ),
      }],
    }))
  }, [sectionProgress])

  const handleFocusModeSection = useCallback((sectionId: string) => {
    setCurrentSection(sectionId as SectionId)
  }, [])

  const renderSection = () => {
    switch (currentSection) {
      case 'closing':
        return <ClosingFormSection />
      case 'planned':
        return <PlannedTerminationSection />
      case 'unplanned':
        return <UnplannedTerminationSection />
      case 'contactLog':
        return <TerminationContactLogSection />
      case 'coreIntervention':
        return <CoreInterventionFidelitySection />
      case 'cppObjectives':
        return <CPPObjectivesSection />
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
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 float-animation">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold gradient-text truncate max-w-[200px]">
                      {formValues.closingForm.clientInitials || 'Termination'}
                    </h1>
                    {progress === 100 && (
                      <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-medium">
                        Complete!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Termination Fidelity
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
                         bg-gradient-to-r from-yellow-500 to-amber-500
                         text-white text-sm font-semibold rounded-xl
                         hover:from-yellow-600 hover:to-amber-600
                         transition-all shadow-lg shadow-amber-500/30
                         hover:shadow-amber-500/50 hover:-translate-y-0.5"
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
                      : 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500'
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
          title="Termination Fidelity Focus Mode"
          onSectionChange={handleFocusModeSection}
        />
      </div>
    </FormProvider>
  )
}
