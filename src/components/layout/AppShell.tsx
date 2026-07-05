import { useState, useCallback } from 'react'
import { FormShellHeader } from './FormShellHeader'
import { Navigation, type SectionId } from './Navigation'
import { CaseSelector } from './CaseSelector'
import { CPPFormProvider, useFormState } from '@/context/FormContext'
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
  const [navOpen, setNavOpen] = useState(false)
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

  return (
    <div className="min-h-screen animated-gradient-bg">
      <FormShellHeader
        title={caseName}
        subtitle="Foundational packet (green form)"
        progress={progress.overall}
        onBack={onBack ?? (() => {})}
        onMenu={() => setNavOpen(true)}
        onExportPDF={handleExportPDF}
      />

      <div className="lg:flex">
        <Navigation
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          isOpen={navOpen}
          onClose={() => setNavOpen(false)}
        />

        <main className="flex-1 min-h-[calc(100vh-57px)]">
          <MainContent currentSection={currentSection} />
        </main>
      </div>

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
