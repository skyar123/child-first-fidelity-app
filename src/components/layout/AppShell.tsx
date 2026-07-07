import { useState, useCallback } from 'react'
import { UserRound, Layers, ClipboardCheck, Heart, Brain, Home, Target } from 'lucide-react'
import { FormShellHeader } from './FormShellHeader'
import { SectionStepper, SectionStepFooter, type StepSection } from './SectionStepper'
import { SectionProgressHeader, type ProgressTone } from './SectionProgressHeader'
import type { SectionId } from './Navigation'
import { CaseSelector } from './CaseSelector'
import { CPPFormProvider, useFormState } from '@/context/FormContext'
import type { Progress } from '@/types/form.types'
import { useCaseManager, useSectionNavigation } from '@/hooks'
import { useFormContext } from 'react-hook-form'
import type { FormData } from '@/types/form.types'
import { generatePDF } from '@/utils/pdfExport'

// Section IDs in order for navigation
const SECTION_ORDER: SectionId[] = [
  'demographics',
  'fidelity',
  'assessment',
  'feedback',
  'formulation',
  'planOfCare',
  'homeVisit',
  'cppObjectives',
]

const SECTION_LABELS: Record<SectionId, string> = {
  demographics: 'Client Registration',
  fidelity: 'Fidelity Strands',
  contactLog: 'Contact Log',
  assessment: 'Assessment & Engagement',
  feedback: 'Trauma Feedback Session',
  formulation: 'Formulation & Planning',
  planOfCare: 'Plan of Care',
  homeVisit: 'Home Visit Checklists',
  cppObjectives: 'CPP Case Conceptualization',
}

// Each step's progress key, icon, tone, and subtitle for the section header.
const SECTION_META: Partial<
  Record<
    SectionId,
    {
      key: keyof Progress['sections']
      icon: typeof UserRound
      tone: ProgressTone
      subtitle: string
    }
  >
> = {
  demographics: { key: 'caseIdentification', icon: UserRound, tone: 'cyan', subtitle: 'Basic case information' },
  fidelity: { key: 'fidelityStrands', icon: Layers, tone: 'emerald', subtitle: 'The fidelity strands' },
  assessment: { key: 'assessmentChecklist', icon: ClipboardCheck, tone: 'blue', subtitle: 'Assessment & engagement steps' },
  feedback: { key: 'traumaFeedback', icon: Heart, tone: 'pink', subtitle: 'The trauma feedback session' },
  formulation: { key: 'formulationPlanning', icon: Brain, tone: 'violet', subtitle: 'Formulation & planning' },
  homeVisit: { key: 'homeVisitChecklists', icon: Home, tone: 'amber', subtitle: 'Home-visit checklists' },
  cppObjectives: { key: 'cppObjectives', icon: Target, tone: 'teal', subtitle: 'CPP case conceptualization' },
}

// Marks a step complete at 100%
function sectionComplete(id: SectionId, progress: Progress): boolean {
  const meta = SECTION_META[id]
  return meta ? progress.sections[meta.key] === 100 : false
}

interface AppShellProps {
  onBack?: () => void
}

// Section components
import {
  DemographicsSection,
  FidelityStrandsSection,
  AssessmentChecklistSection,
  TraumaFeedbackSection,
  FormulationSection,
  PlanOfCareSection,
  HomeVisitSection,
  CPPObjectivesSection,
} from '@/components/sections'

function MainContent({
  currentSection,
}: {
  currentSection: SectionId
}) {
  switch (currentSection) {
    case 'demographics':
      return <DemographicsSection />
    case 'fidelity':
      return <FidelityStrandsSection />
    case 'assessment':
      return <AssessmentChecklistSection />
    case 'feedback':
      return <TraumaFeedbackSection />
    case 'formulation':
      return <FormulationSection />
    case 'planOfCare':
      return <PlanOfCareSection />
    case 'homeVisit':
      return <HomeVisitSection />
    case 'cppObjectives':
      return <CPPObjectivesSection />
    default:
      return null
  }
}

function AppShellContent({ onBack }: { onBack?: () => void }) {
  const [currentSection, setCurrentSection] = useState<SectionId>('demographics')
  const [caseSelectorOpen, setCaseSelectorOpen] = useState(false)

  const {
    cases,
    currentCaseId,
    createCase,
    selectCase,
    deleteCase,
    duplicateCase,
    exportCase,
    importCase,
  } = useCaseManager()

  const { watch } = useFormContext<FormData>()
  const { progress } = useFormState()
  const clientInitials = watch('caseIdentification.clientInitials')

  // Keyboard navigation for sections
  const currentSectionIndex = SECTION_ORDER.indexOf(currentSection)
  useSectionNavigation(
    SECTION_ORDER,
    currentSectionIndex,
    (index) => setCurrentSection(SECTION_ORDER[index])
  )

  const handleNewCase = useCallback(() => {
    createCase()
    setCurrentSection('demographics')
    setCaseSelectorOpen(false)
  }, [createCase])

  const { getValues } = useFormContext<FormData>()

  const handleExportPDF = useCallback(() => {
    const formData = getValues()
    generatePDF(formData)
  }, [getValues])

  const handleExportCase = useCallback((caseId: string) => {
    const json = exportCase(caseId)
    if (json) {
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `case_${caseId.slice(0, 8)}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [exportCase])

  const handleImportCase = useCallback((jsonString: string) => {
    const newCaseId = importCase(jsonString)
    if (newCaseId) {
      setCurrentSection('demographics')
      setCaseSelectorOpen(false)
    }
  }, [importCase])


  const caseName = clientInitials || 'New Case'

  const stepSections: StepSection[] = SECTION_ORDER.map(id => ({
    id,
    label: SECTION_LABELS[id],
    complete: sectionComplete(id, progress),
  }))

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <FormShellHeader
        title={caseName}
        subtitle="Foundational packet (green form)"
        progress={progress.overall}
        onBack={onBack ?? (() => {})}
        onExportPDF={handleExportPDF}
      />

      <SectionStepper
        sections={stepSections}
        currentId={currentSection}
        onSelect={id => setCurrentSection(id as SectionId)}
      />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {(() => {
            const meta = SECTION_META[currentSection]
            if (!meta) return null
            return (
              <SectionProgressHeader
                icon={meta.icon}
                title={SECTION_LABELS[currentSection]}
                subtitle={meta.subtitle}
                percent={progress.sections[meta.key]}
                tone={meta.tone}
              />
            )
          })()}
          <MainContent currentSection={currentSection} />
        </div>
      </main>

      <SectionStepFooter
        sections={stepSections}
        currentId={currentSection}
        onSelect={id => setCurrentSection(id as SectionId)}
      />

      <CaseSelector
        isOpen={caseSelectorOpen}
        onClose={() => setCaseSelectorOpen(false)}
        cases={cases}
        currentCaseId={currentCaseId}
        onSelectCase={selectCase}
        onNewCase={handleNewCase}
        onDeleteCase={deleteCase}
        onDuplicateCase={duplicateCase}
        onExportCase={handleExportCase}
        onImportCase={handleImportCase}
      />

    </div>
  )
}

export function AppShell({ onBack }: AppShellProps = {}) {
  const { currentCaseId, isLoading, createCase } = useCaseManager()

  // Create initial case if none exists
  if (!isLoading && !currentCaseId) {
    createCase()
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-gray-500">Creating new case...</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <CPPFormProvider caseId={currentCaseId}>
      <AppShellContent onBack={onBack} />
    </CPPFormProvider>
  )
}
