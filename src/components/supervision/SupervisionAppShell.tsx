import { useState, useCallback, useMemo } from 'react'
import { ArrowLeft, Menu, Download, X, Sparkles, Heart, Compass, PenLine, Focus } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import type { SupervisionFormData } from '@/types/supervision.types'
import { createDefaultSupervisionFormData } from '@/data/supervisionSchema'
import { GroundingExercise } from '@/components/ui/GroundingExercise'
import { FidelityCompass } from '@/components/ui/FidelityCompass'
import { ReflectiveJournal } from '@/components/ui/ReflectiveJournal'
import { GlobalFocusMode, type FocusModeSection } from '@/components/ui'
import { getProgressMessage } from '@/utils/celebrations'
import { generateSupervisionPDF } from '@/utils/pdfExportSupervision'
import { proceduralFidelityItems, supervisorCapacityGeneralItems } from '@/data/supervisionItems'

// Section components
import { SupervisionIdentificationSection } from './sections/SupervisionIdentificationSection'
import { ProceduralFidelitySection } from './sections/ProceduralFidelitySection'
import { SupervisorCapacitySection } from './sections/SupervisorCapacitySection'
import { KnowledgeAreasSection } from './sections/KnowledgeAreasSection'
import { SkillsCompetenciesSection } from './sections/SkillsCompetenciesSection'
import { GlobalRatingsSection } from './sections/GlobalRatingsSection'
import { SupervisionLogSection } from './sections/SupervisionLogSection'

type SectionId =
  | 'identification'
  | 'procedural'
  | 'capacity'
  | 'knowledge'
  | 'skills'
  | 'global'
  | 'log'

interface Section {
  id: SectionId
  label: string
  shortLabel: string
}

const sections: Section[] = [
  { id: 'identification', label: 'Identification', shortLabel: 'Identification' },
  { id: 'procedural', label: 'Procedural Fidelity', shortLabel: 'Procedural Fidelity' },
  { id: 'capacity', label: 'Supervisor Capacity', shortLabel: 'Supervisor Capacity' },
  { id: 'knowledge', label: 'Knowledge Areas', shortLabel: 'Knowledge Areas' },
  { id: 'skills', label: 'Skills & Competencies', shortLabel: 'Skills & Competencies' },
  { id: 'global', label: 'Global Ratings', shortLabel: 'Global Ratings' },
  { id: 'log', label: 'Supervision Log', shortLabel: 'Supervision Log' }
]

interface SupervisionAppShellProps {
  onBack: () => void
}

export function SupervisionAppShell({ onBack }: SupervisionAppShellProps) {
  const [currentSection, setCurrentSection] = useState<SectionId>('identification')
  const [navOpen, setNavOpen] = useState(false)
  const [showGrounding, setShowGrounding] = useState(false)
  const [showCompass, setShowCompass] = useState(false)
  const [showJournal, setShowJournal] = useState(false)
  const [showFocusMode, setShowFocusMode] = useState(false)

  const methods = useForm<SupervisionFormData>({
    defaultValues: createDefaultSupervisionFormData(),
    mode: 'onChange'
  })

  const { watch } = methods
  const formValues = watch()

  // Calculate per-section progress
  const sectionProgress = useMemo(() => {
    const progress: Record<SectionId, number> = {
      identification: 0,
      procedural: 0,
      capacity: 0,
      knowledge: 0,
      skills: 0,
      global: 0,
      log: 0
    }

    // Identification (3 fields)
    let idCompleted = 0
    if (formValues.identification.clinicalTeamNames) idCompleted++
    if (formValues.identification.childFirstSite) idCompleted++
    if (formValues.identification.monthYear) idCompleted++
    progress.identification = Math.round((idCompleted / 3) * 100)

    // Procedural items
    const proceduralCompleted = Object.values(formValues.proceduralFidelity.items).filter(v => v !== null).length
    progress.procedural = Math.round((proceduralCompleted / 7) * 100)

    // Capacity items
    const capacityCompleted =
      Object.values(formValues.supervisorCapacity.generalItems).filter(v => v !== null).length +
      Object.values(formValues.supervisorCapacity.clinicianOnlyItems).filter(v => v !== null).length +
      Object.values(formValues.supervisorCapacity.careCoordinatorOnlyItems).filter(v => v !== null).length
    progress.capacity = Math.round((capacityCompleted / 18) * 100)

    // Knowledge items
    const knowledgeCompleted =
      Object.values(formValues.knowledgeAreas.generalItems).filter(v => v !== null).length +
      Object.values(formValues.knowledgeAreas.careCoordinatorOnlyItems).filter(v => v !== null).length
    progress.knowledge = Math.round((knowledgeCompleted / 9) * 100)

    // Skills items
    const skillsCompleted =
      Object.values(formValues.skillsCompetencies.generalItems).filter(v => v !== null).length +
      Object.values(formValues.skillsCompetencies.clinicianOnlyItems).filter(v => v !== null).length +
      Object.values(formValues.skillsCompetencies.careCoordinatorOnlyItems).filter(v => v !== null).length
    progress.skills = Math.round((skillsCompleted / 15) * 100)

    // Global ratings
    const globalCompleted = Object.values(formValues.globalRatings.items).filter(v => v !== null).length
    progress.global = Math.round((globalCompleted / 3) * 100)

    // Log - check if there are any entries
    progress.log = formValues.supervisionLog?.length > 0 ? 100 : 0

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
    const data = methods.getValues()
    generateSupervisionPDF(data)
  }, [methods])

  // Build focus mode sections
  const focusModeSections = useMemo((): FocusModeSection[] => {
    return [
      {
        id: 'procedural',
        name: 'Procedural Fidelity',
        items: proceduralFidelityItems.map((item) => ({
          id: item.id,
          label: item.text.substring(0, 50) + '...',
          sectionName: 'Procedural Fidelity',
          isComplete: formValues.proceduralFidelity.items[item.id] !== null,
          content: (
            <div className="p-4 bg-pink-50 rounded-xl border border-pink-200">
              <h4 className="font-medium text-pink-800 mb-2">Procedural Fidelity Item</h4>
              <p className="text-gray-700">{item.text}</p>
              <p className="text-xs text-gray-500 mt-2">Rate Yes or No for this item</p>
            </div>
          ),
        })),
      },
      {
        id: 'capacity',
        name: 'Supervisor Capacity',
        items: supervisorCapacityGeneralItems.map((item) => ({
          id: item.id,
          label: item.text.substring(0, 50) + '...',
          sectionName: 'Supervisor Capacity',
          isComplete: formValues.supervisorCapacity.generalItems[item.id] !== null,
          content: (
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
              <h4 className="font-medium text-rose-800 mb-2">Supervisor Capacity Item</h4>
              <p className="text-gray-700">{item.text}</p>
              <p className="text-xs text-gray-500 mt-2">Rate the capacity level for this item</p>
            </div>
          ),
        })),
      },
    ]
  }, [formValues])

  const handleFocusModeSection = useCallback((sectionId: string) => {
    setCurrentSection(sectionId as SectionId)
  }, [])

  const renderSection = () => {
    switch (currentSection) {
      case 'identification':
        return <SupervisionIdentificationSection />
      case 'procedural':
        return <ProceduralFidelitySection />
      case 'capacity':
        return <SupervisorCapacitySection />
      case 'knowledge':
        return <KnowledgeAreasSection />
      case 'skills':
        return <SkillsCompetenciesSection />
      case 'global':
        return <GlobalRatingsSection />
      case 'log':
        return <SupervisionLogSection />
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
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 via-rose-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30 float-animation">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold gradient-text truncate max-w-[200px]">
                      {formValues.identification.clinicalTeamNames || 'Supervision Fidelity'}
                    </h1>
                    {progress === 100 && (
                      <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-medium">
                        Complete!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Supervision Fidelity Assessment
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
                         bg-gradient-to-r from-pink-500 to-rose-500
                         text-white text-sm font-semibold rounded-xl
                         hover:from-pink-600 hover:to-rose-600
                         transition-all shadow-lg shadow-pink-500/30
                         hover:shadow-pink-500/50 hover:-translate-y-0.5"
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
                      : 'bg-gradient-to-r from-pink-400 via-rose-500 to-fuchsia-500'
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
                Supervision Fidelity
              </h2>
              <p className="text-sm text-gray-500 mt-1">Assessment Checklist</p>
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
                            ? 'bg-pink-50 border-r-2 border-pink-600'
                            : 'hover:bg-gray-50'
                          }
                        `}
                      >
                        {/* Section number */}
                        <span
                          className={`
                            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                            ${isActive
                              ? 'bg-pink-600 text-white'
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
                              ${isActive ? 'text-pink-700' : 'text-gray-700'}
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
          title="Supervision Fidelity Focus Mode"
          onSectionChange={handleFocusModeSection}
        />
      </div>
    </FormProvider>
  )
}
