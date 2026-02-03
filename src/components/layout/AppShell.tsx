import { useState, useCallback, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Header } from './Header'
import { Navigation, type SectionId } from './Navigation'
import { CaseSelector } from './CaseSelector'
import { CPPFormProvider } from '@/context/FormContext'
import { useCaseManager, useSectionNavigation } from '@/hooks'
import { useFormContext } from 'react-hook-form'
import type { FormData } from '@/types/form.types'
import { generatePDF } from '@/utils/pdfExport'
import {
  GlobalFocusMode,
  type FocusModeSection,
  FocusModeRatingControl,
  FocusModeCheckboxControl,
  CHALLENGE_OPTIONS,
  CAPACITY_OPTIONS
} from '@/components/ui'
import { fidelityStrands } from '@/data/fidelityItems'
import { assessmentSections, isItemVisible } from '@/data/assessmentItems'

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
  const [showFocusMode, setShowFocusMode] = useState(false)

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

  const { watch, setValue } = useFormContext<FormData>()
  const clientInitials = watch('caseIdentification.clientInitials')
  const formValues = watch()

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

  // Build focus mode sections for fidelity strands
  const fidelityFocusSections = useMemo((): FocusModeSection[] => {
    const sections: FocusModeSection[] = []
    const fidelityData = formValues?.fidelityStrands as unknown as Record<string, { challengeItems?: Record<string, number | null>; capacityItems?: Record<string, number | null> }> | undefined

    // Add Fidelity Strands section
    fidelityStrands.forEach((strand) => {
      const strandData = fidelityData?.[strand.id]
      const strandItems = [
        // Challenge items with interactive controls
        ...strand.challengeItems.map((item) => {
          const fieldPath = `fidelityStrands.${strand.id}.challengeItems.${item.id}` as const
          const currentValue = strandData?.challengeItems?.[item.id] ?? null
          return {
            id: `challenge_${item.id}`,
            label: item.text.substring(0, 40) + '...',
            sectionName: strand.title,
            isComplete: currentValue !== null && currentValue !== undefined,
            content: (
              <FocusModeRatingControl
                questionText={item.text}
                questionType="Challenge Assessment"
                options={CHALLENGE_OPTIONS}
                value={currentValue}
                onChange={(value) => setValue(fieldPath as never, value as never)}
                helperText="How challenging is this area for the family?"
              />
            ),
          }
        }),
        // Capacity items with interactive controls
        ...strand.capacityItems.map((item) => {
          const fieldPath = `fidelityStrands.${strand.id}.capacityItems.${item.id}` as const
          const currentValue = strandData?.capacityItems?.[item.id] ?? null
          return {
            id: `capacity_${item.id}`,
            label: item.text.substring(0, 40) + '...',
            sectionName: strand.title,
            isComplete: currentValue !== null && currentValue !== undefined,
            content: (
              <FocusModeRatingControl
                questionText={item.text}
                questionType="Capacity Assessment"
                options={CAPACITY_OPTIONS}
                value={currentValue}
                onChange={(value) => setValue(fieldPath as never, value as never)}
                helperText="What is the current capacity level?"
              />
            ),
          }
        }),
      ]

      if (strandItems.length > 0) {
        sections.push({
          id: strand.id,
          name: strand.title,
          items: strandItems,
        })
      }
    })

    return sections
  }, [formValues, setValue])

  // Build focus mode sections for assessment checklist
  const assessmentFocusSections = useMemo((): FocusModeSection[] => {
    const sections: FocusModeSection[] = []
    const assessmentData = formValues?.assessmentChecklist as unknown as Record<string, unknown> | undefined

    assessmentSections.forEach((section) => {
      const sectionItems = section.items
        .filter((item) => isItemVisible(item, (formValues || {}) as unknown as Record<string, unknown>))
        .map((item) => {
          const fieldPath = `assessmentChecklist.${item.id}`

          // Handle different item types
          if (item.type === 'checkbox') {
            const isChecked = !!assessmentData?.[item.id]
            return {
              id: item.id,
              label: item.text.substring(0, 40) + '...',
              sectionName: section.title,
              isComplete: isChecked,
              content: (
                <FocusModeCheckboxControl
                  questionText={item.text}
                  questionNumber={item.number}
                  questionType={section.title}
                  isChecked={isChecked}
                  onChange={(checked) => setValue(fieldPath as never, checked as never)}
                  isChildFirstOnly={item.childFirstOnly}
                />
              ),
            }
          } else if (item.type === 'multi-checkbox' && item.subItems) {
            const itemData = assessmentData?.[item.id] as Record<string, boolean> | undefined
            const completedCount = item.subItems.filter(sub => itemData?.[sub.id]).length
            const isComplete = completedCount === item.subItems.length

            return {
              id: item.id,
              label: item.text.substring(0, 40) + '...',
              sectionName: section.title,
              isComplete,
              content: (
                <FocusModeCheckboxControl
                  questionText={item.text}
                  questionNumber={item.number}
                  questionType={section.title}
                  isChecked={isComplete}
                  onChange={() => {}}
                  isChildFirstOnly={item.childFirstOnly}
                  subItems={item.subItems.map((sub) => ({
                    id: sub.id,
                    text: sub.text,
                    isChecked: !!itemData?.[sub.id],
                    onChange: (checked: boolean) => setValue(`${fieldPath}.${sub.id}` as never, checked as never),
                  }))}
                />
              ),
            }
          } else if (item.type === 'radio' && item.options) {
            const selectedValue = assessmentData?.[item.id] as string | undefined
            return {
              id: item.id,
              label: item.text.substring(0, 40) + '...',
              sectionName: section.title,
              isComplete: !!selectedValue,
              content: (
                <FocusModeCheckboxControl
                  questionText={item.text}
                  questionNumber={item.number}
                  questionType={section.title}
                  isChecked={!!selectedValue}
                  onChange={() => {}}
                  isChildFirstOnly={item.childFirstOnly}
                  radioOptions={item.options.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                    isSelected: selectedValue === opt.value,
                    onChange: () => setValue(fieldPath as never, opt.value as never),
                  }))}
                />
              ),
            }
          }

          return null
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)

      if (sectionItems.length > 0) {
        sections.push({
          id: `assessment_${section.id}`,
          name: section.title,
          items: sectionItems,
        })
      }
    })

    return sections
  }, [formValues, setValue])

  // Get the appropriate focus mode sections based on current section
  const focusModeSections = useMemo((): FocusModeSection[] => {
    if (currentSection === 'assessment') {
      return assessmentFocusSections
    }
    // Default to fidelity sections for fidelity section (or if no specific section match)
    return fidelityFocusSections
  }, [currentSection, fidelityFocusSections, assessmentFocusSections])

  // Get the focus mode title based on current section
  const focusModeTitle = useMemo((): string => {
    if (currentSection === 'assessment') {
      return 'Assessment Focus Mode'
    }
    return 'Foundational Phase Focus Mode'
  }, [currentSection])

  const handleFocusModeSection = useCallback((sectionId: string) => {
    // Map focus mode section IDs to navigation section IDs
    if (sectionId.startsWith('assessment_')) {
      setCurrentSection('assessment')
    } else if (sectionId.startsWith('strand')) {
      setCurrentSection('fidelity')
    }
  }, [])

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
        onFocusMode={() => setShowFocusMode(true)}
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

      {/* Focus Mode */}
      <GlobalFocusMode
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
        sections={focusModeSections}
        currentSectionId={focusModeSections[0]?.id}
        title={focusModeTitle}
        onSectionChange={handleFocusModeSection}
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
