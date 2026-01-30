import { useState, useCallback } from 'react'
import { Header } from './Header'
import { Navigation, type SectionId } from './Navigation'
import { CaseSelector } from './CaseSelector'
import { CPPFormProvider } from '@/context/FormContext'
import { useCaseManager } from '@/hooks/useCaseManager'
import { useFormContext } from 'react-hook-form'
import type { FormData } from '@/types/form.types'

// Section components
import {
  DemographicsSection,
  ContactLogSection,
  FidelityStrandsSection,
  AssessmentChecklistSection,
  TraumaFeedbackSection,
  CareCoordinatorSection,
  ProgramFidelitySection,
} from '@/components/sections'

function SectionPlaceholder({ name }: { name: string }) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{name}</h2>
        <p className="text-gray-500">This section is coming soon.</p>
      </div>
    </div>
  )
}

function MainContent({
  currentSection,
  showTraumaFeedback,
}: {
  currentSection: SectionId
  showTraumaFeedback: boolean
}) {
  switch (currentSection) {
    case 'demographics':
      return <DemographicsSection />
    case 'fidelity':
      return <FidelityStrandsSection />
    case 'contactLog':
      return <ContactLogSection />
    case 'assessment':
      return <AssessmentChecklistSection />
    case 'careCoordinator':
      return <CareCoordinatorSection />
    case 'feedback':
      if (!showTraumaFeedback) {
        return (
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-800">
                This section is only visible when the child has a known trauma history.
              </p>
            </div>
          </div>
        )
      }
      return <TraumaFeedbackSection />
    case 'formulation':
      return <SectionPlaceholder name="Formulation & Treatment Planning" />
    case 'planOfCare':
      return <SectionPlaceholder name="Child & Family Plan of Care" />
    case 'homeVisit':
      return <SectionPlaceholder name="Home Visit Checklists" />
    case 'cppObjectives':
      return <SectionPlaceholder name="CPP Case Conceptualization" />
    case 'programFidelity':
      return <ProgramFidelitySection />
    default:
      return null
  }
}

function AppShellContent() {
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
  const clientInitials = watch('caseIdentification.clientInitials')
  const childTraumaHistory = watch('assessmentChecklist.childTraumaHistory')

  // Determine if trauma feedback section should be shown
  const showTraumaFeedback = childTraumaHistory !== '' && childTraumaHistory !== 'a'

  const handleNewCase = useCallback(() => {
    createCase()
    setCurrentSection('demographics')
    setCaseSelectorOpen(false)
  }, [createCase])

  const handleExportPDF = useCallback(() => {
    // TODO: Implement PDF export
    console.log('Export PDF')
  }, [])

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
    <div className="min-h-screen bg-gray-50">
      <Header
        caseName={caseName}
        onMenuClick={() => setNavOpen(true)}
        onNewCase={handleNewCase}
        onExportPDF={handleExportPDF}
        onOpenCases={() => setCaseSelectorOpen(true)}
      />

      <div className="lg:flex">
        <Navigation
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          isOpen={navOpen}
          onClose={() => setNavOpen(false)}
          showTraumaFeedback={showTraumaFeedback}
        />

        <main className="flex-1 min-h-[calc(100vh-57px)]">
          <MainContent
            currentSection={currentSection}
            showTraumaFeedback={showTraumaFeedback}
          />
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

export function AppShell() {
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
      <AppShellContent />
    </CPPFormProvider>
  )
}
