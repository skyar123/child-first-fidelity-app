import { useState, useCallback, useMemo, useEffect } from 'react'
import { X } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import type { SupervisionFormData } from '@/types/supervision.types'
import { createDefaultSupervisionFormData } from '@/data/supervisionSchema'
import { FormShellHeader } from '@/components/layout/FormShellHeader'
import { generateSupervisionPDF } from '@/utils/pdfExportSupervision'

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
  clientInitials?: string
}

export function SupervisionAppShell({ onBack, clientInitials }: SupervisionAppShellProps) {
  const storageKey = `cf_form_supervision_${(clientInitials || 'default').trim().toUpperCase()}`
  const [currentSection, setCurrentSection] = useState<SectionId>('identification')
  const [navOpen, setNavOpen] = useState(false)

  const methods = useForm<SupervisionFormData>({
    defaultValues: (() => {
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) return { ...createDefaultSupervisionFormData(), ...JSON.parse(saved) }
      } catch (error) {
        console.error('Error loading saved supervision form', error)
      }
      return createDefaultSupervisionFormData()
    })(),
    mode: 'onChange'
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

  // Build focus mode sections with INTERACTIVE controls


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
      <div className="min-h-screen animated-gradient-bg">
        <FormShellHeader
          title={formValues.identification.clinicalTeamNames || 'Supervision Fidelity'}
          subtitle="Supervision Fidelity Assessment (pink form)"
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

      </div>
    </FormProvider>
  )
}
