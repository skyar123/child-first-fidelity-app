import { useState, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Header } from './Header'
import { Navigation, type SectionId } from './Navigation'
import { CaseSelector } from './CaseSelector'
import { CPPFormProvider } from '@/context/FormContext'
import { useCaseManager, useSectionNavigation } from '@/hooks'
import { useFormContext } from 'react-hook-form'
import type { FormData } from '@/types/form.types'
import { generatePDF } from '@/utils/pdfExport'

// Section IDs in order for navigation
const SECTION_ORDER: SectionId[] = [
  'demographics',
  'fidelity',
  'contactLog',
  'assessment',
  'careCoordinator',
  'feedback',
  'formulation',
  'planOfCare',
  'homeVisit',
  'cppObjectives',
  'programFidelity',
]

interface AppShellProps {
  onBack?: () => void
}

// Section components
import {
  DemographicsSection,
  ContactLogSection,
  FidelityStrandsSection,
  AssessmentChecklistSection,
  CareCoordinatorSection,
  TraumaFeedbackSection,
  FormulationSection,
  PlanOfCareSection,
  HomeVisitSection,
  CPPObjectivesSection,
  ProgramFidelitySection,
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
    case 'contactLog':
      return <ContactLogSection />
    case 'assessment':
      return <AssessmentChecklistSection />
    case 'careCoordinator':
      return <CareCoordinatorSection />
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
    case 'programFidelity':
      return <ProgramFidelitySection />
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

  const handleClearData = useCallback(() => {
    if (window.confirm('Are you sure you want to clear ALL data? This will delete all cases and cannot be undone.')) {
      // Clear all localStorage keys related to our app
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('cpp_') || key === 'cpp_cases_index')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
      // Reload the page to start fresh
      window.location.reload()
    }
  }, [])

  const caseName = clientInitials || 'New Case'

  return (
    <div className="min-h-screen animated-gradient-bg">
      {/* Back button row */}
      {onBack && (
        <div className="glass-header border-b border-white/20 px-4 py-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm 
                     hover:bg-white/50 px-3 py-1.5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Form Selection
          </button>
        </div>
      )}
      <Header
        caseName={caseName}
        onMenuClick={() => setNavOpen(true)}
        onNewCase={handleNewCase}
        onExportPDF={handleExportPDF}
        onOpenCases={() => setCaseSelectorOpen(true)}
        onClearData={handleClearData}
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
