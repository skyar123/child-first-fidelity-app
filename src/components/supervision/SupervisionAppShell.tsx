import { useState, useCallback, useMemo, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import type { SupervisionFormData } from '@/types/supervision.types'
import { createDefaultSupervisionFormData } from '@/data/supervisionSchema'
import { FormShellHeader } from '@/components/layout/FormShellHeader'
import { SectionStepper, SectionStepFooter, type StepSection } from '@/components/layout/SectionStepper'
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
    const proceduralCompleted = Object.values(formValues.proceduralFidelity.items).filter(v => v != null).length
    progress.procedural = Math.round((proceduralCompleted / 7) * 100)

    // Capacity items
    const capacityCompleted =
      Object.values(formValues.supervisorCapacity.generalItems).filter(v => v != null).length +
      Object.values(formValues.supervisorCapacity.clinicianOnlyItems).filter(v => v != null).length +
      Object.values(formValues.supervisorCapacity.careCoordinatorOnlyItems).filter(v => v != null).length
    progress.capacity = Math.round((capacityCompleted / 18) * 100)

    // Knowledge items
    const knowledgeCompleted =
      Object.values(formValues.knowledgeAreas.generalItems).filter(v => v != null).length +
      Object.values(formValues.knowledgeAreas.careCoordinatorOnlyItems).filter(v => v != null).length
    progress.knowledge = Math.round((knowledgeCompleted / 9) * 100)

    // Skills items
    const skillsCompleted =
      Object.values(formValues.skillsCompetencies.generalItems).filter(v => v != null).length +
      Object.values(formValues.skillsCompetencies.clinicianOnlyItems).filter(v => v != null).length +
      Object.values(formValues.skillsCompetencies.careCoordinatorOnlyItems).filter(v => v != null).length
    progress.skills = Math.round((skillsCompleted / 15) * 100)

    // Global ratings
    const globalCompleted = Object.values(formValues.globalRatings.items).filter(v => v != null).length
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


  const stepSections: StepSection[] = sections.map(sec => ({
    id: sec.id,
    label: sec.shortLabel,
    complete: sectionProgress[sec.id] === 100,
  }))

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <FormShellHeader
          title={formValues.identification.clinicalTeamNames || 'Supervision Fidelity'}
          subtitle="Supervision Fidelity Assessment (pink form)"
          progress={progress}
          onBack={onBack}
          onExportPDF={handleExportPDF}
        />

        <SectionStepper
          sections={stepSections}
          currentId={currentSection}
          onSelect={id => setCurrentSection(id as SectionId)}
        />

        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-6">{renderSection()}</div>
        </main>

        <SectionStepFooter
          sections={stepSections}
          currentId={currentSection}
          onSelect={id => setCurrentSection(id as SectionId)}
        />

      </div>
    </FormProvider>
  )
}
