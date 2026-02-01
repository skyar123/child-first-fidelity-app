import { useState, useCallback } from 'react'
import { ArrowLeft, Menu, Download, X, Heart, Compass, PenLine } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import type { SupervisionFormData } from '@/types/supervision.types'
import { createDefaultSupervisionFormData } from '@/data/supervisionSchema'
import { ProgressBar } from '@/components/ui'
import { generateSupervisionPDF } from '@/utils/pdfExportSupervision'
import { GroundingExercise } from '@/components/ui/GroundingExercise'
import { FidelityCompass } from '@/components/ui/FidelityCompass'
import { ReflectiveJournal } from '@/components/ui/ReflectiveJournal'

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
  { id: 'identification', label: 'Identification', shortLabel: 'ID' },
  { id: 'procedural', label: 'Procedural Fidelity', shortLabel: 'Procedural' },
  { id: 'capacity', label: 'Supervisor Capacity', shortLabel: 'Capacity' },
  { id: 'knowledge', label: 'Knowledge Areas', shortLabel: 'Knowledge' },
  { id: 'skills', label: 'Skills & Competencies', shortLabel: 'Skills' },
  { id: 'global', label: 'Global Ratings', shortLabel: 'Global' },
  { id: 'log', label: 'Supervision Log', shortLabel: 'Log' }
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

  const methods = useForm<SupervisionFormData>({
    defaultValues: createDefaultSupervisionFormData(),
    mode: 'onChange'
  })

  const { watch } = methods
  const formValues = watch()

  // Calculate progress
  const calculateProgress = useCallback(() => {
    // Simple progress calculation for now
    let completed = 0
    let total = 0

    // Identification (3 fields)
    total += 3
    if (formValues.identification.clinicalTeamNames) completed++
    if (formValues.identification.childFirstSite) completed++
    if (formValues.identification.monthYear) completed++

    // Procedural items
    total += 7
    completed += Object.values(formValues.proceduralFidelity.items).filter(v => v !== null).length

    // Capacity items (rough count)
    total += 18
    completed += Object.values(formValues.supervisorCapacity.generalItems).filter(v => v !== null).length
    completed += Object.values(formValues.supervisorCapacity.clinicianOnlyItems).filter(v => v !== null).length
    completed += Object.values(formValues.supervisorCapacity.careCoordinatorOnlyItems).filter(v => v !== null).length

    // Knowledge items
    total += 9
    completed += Object.values(formValues.knowledgeAreas.generalItems).filter(v => v !== null).length
    completed += Object.values(formValues.knowledgeAreas.careCoordinatorOnlyItems).filter(v => v !== null).length

    // Skills items
    total += 15
    completed += Object.values(formValues.skillsCompetencies.generalItems).filter(v => v !== null).length
    completed += Object.values(formValues.skillsCompetencies.clinicianOnlyItems).filter(v => v !== null).length
    completed += Object.values(formValues.skillsCompetencies.careCoordinatorOnlyItems).filter(v => v !== null).length

    // Global ratings
    total += 3
    completed += Object.values(formValues.globalRatings.items).filter(v => v !== null).length

    return total > 0 ? Math.round((completed / total) * 100) : 0
  }, [formValues])

  const progress = calculateProgress()

  const handleExportPDF = useCallback(() => {
    const data = methods.getValues()
    generateSupervisionPDF(data)
  }, [methods])

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

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-100">
        {/* Header */}
        <header className="glass-header sticky top-0 z-40 border-b border-white/20">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
                aria-label="Back to form selection"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setNavOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SF</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm font-semibold text-gray-900">
                    Supervision Fidelity
                  </h1>
                  <p className="text-xs text-gray-500">
                    {formValues.identification.clinicalTeamNames || 'New Assessment'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Wellness Features */}
              <button
                onClick={() => setShowGrounding(true)}
                className="p-2 rounded-lg hover:bg-pink-50 text-pink-400 hover:text-pink-500 transition-all"
                aria-label="Regulate First - Grounding Exercise"
                title="Regulate First"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowCompass(true)}
                className="p-2 rounded-lg hover:bg-green-50 text-green-400 hover:text-green-500 transition-all"
                aria-label="Fidelity Compass"
                title="Fidelity Compass"
              >
                <Compass className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowJournal(true)}
                className="p-2 rounded-lg hover:bg-purple-50 text-purple-400 hover:text-purple-500 transition-all"
                aria-label="Reflective Practice Journal"
                title="Reflective Journal"
              >
                <PenLine className="w-5 h-5" />
              </button>
              <span className="w-px h-6 bg-gray-200 mx-1" />
              <button
                onClick={handleExportPDF}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2">
              <ProgressBar
                value={progress}
                size="sm"
                color={progress === 100 ? 'green' : 'pink'}
              />
              <span className="text-xs text-gray-500 min-w-[3ch]">
                {progress}%
              </span>
            </div>
          </div>
        </header>

        <div className="lg:flex">
          {/* Mobile overlay */}
          {navOpen && (
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setNavOpen(false)}
            />
          )}

          {/* Navigation sidebar */}
          <nav
            className={`
              fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-73px)] w-64
              bg-white/80 backdrop-blur-md border-r border-white/20
              transform transition-transform duration-200 ease-in-out z-50
              ${navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 lg:hidden">
              <span className="font-semibold text-gray-900">Sections</span>
              <button
                onClick={() => setNavOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Section list */}
            <div className="p-2 overflow-y-auto h-full">
              {sections.map((section) => {
                const isActive = currentSection === section.id

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setCurrentSection(section.id)
                      setNavOpen(false)
                    }}
                    className={`
                      w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-colors
                      ${isActive ? 'bg-pink-50 text-pink-700' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 min-h-[calc(100vh-73px)] p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              {renderSection()}
            </div>
          </main>
        </div>
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
    </FormProvider>
  )
}
