import { useState, useCallback, useMemo, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import type { TerminationFormData } from '@/types/termination.types'
import { createDefaultTerminationFormData } from '@/data/terminationSchema'
import { DoorOpen, CalendarCheck, CircleSlash, Layers, Target } from 'lucide-react'
import { FormShellHeader } from '@/components/layout/FormShellHeader'
import { SectionStepper, SectionStepFooter, type StepSection } from '@/components/layout/SectionStepper'
import { SectionProgressHeader, type ProgressTone } from '@/components/layout/SectionProgressHeader'
import { generateTerminationPDF } from '@/utils/pdfExportTermination'

// Create default values once outside component to ensure stability
// Use JSON parse/stringify to ensure a pure plain object with no prototype chain issues
const defaultFormData: TerminationFormData = JSON.parse(
  JSON.stringify(createDefaultTerminationFormData())
)

// Section components
import { ClosingFormSection } from './sections/ClosingFormSection'
import { PlannedTerminationSection } from './sections/PlannedTerminationSection'
import { UnplannedTerminationSection } from './sections/UnplannedTerminationSection'
import { CoreInterventionFidelitySection } from './sections/CoreInterventionFidelitySection'
import { CPPObjectivesSection } from './sections/CPPObjectivesSection'

type SectionId =
  | 'closing'
  | 'planned'
  | 'unplanned'
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
  { id: 'coreIntervention', label: 'CPP Core Intervention Fidelity', shortLabel: 'Intervention Fidelity' },
  { id: 'cppObjectives', label: 'CPP Case Conceptualization', shortLabel: 'CPP Objectives' },
]

const SECTION_META: Record<
  SectionId,
  { icon: typeof DoorOpen; tone: ProgressTone; subtitle: string }
> = {
  closing: { icon: DoorOpen, tone: 'amber', subtitle: 'How the case is closing' },
  planned: { icon: CalendarCheck, tone: 'emerald', subtitle: 'Steps for a planned goodbye' },
  unplanned: { icon: CircleSlash, tone: 'rose', subtitle: 'Steps when a family drops out' },
  coreIntervention: { icon: Layers, tone: 'violet', subtitle: 'Final intervention fidelity ratings' },
  cppObjectives: { icon: Target, tone: 'teal', subtitle: 'Objectives and clinical focus' },
}

interface TerminationAppShellProps {
  onBack: () => void
  clientInitials?: string
}

export function TerminationAppShell({ onBack, clientInitials }: TerminationAppShellProps) {
  const storageKey = `cf_form_termination_${(clientInitials || 'default').trim().toUpperCase()}`
  const [currentSection, setCurrentSection] = useState<SectionId>('closing')

  const methods = useForm<TerminationFormData>({
    defaultValues: (() => {
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) return { ...defaultFormData, ...JSON.parse(saved) }
      } catch (error) {
        console.error('Error loading saved termination form', error)
      }
      return defaultFormData
    })(),
    mode: 'onChange',
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
      closing: 0,
      planned: 0,
      unplanned: 0,
      coreIntervention: 0,
      cppObjectives: 0,
    }

    // Closing Form progress (identification + 7 questions)
    const closing = formValues.closingForm
    let closingCompleted = 0
    const closingTotal = 12 // 5 identification + 7 questions
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

  const handleExportPDF = useCallback(() => {
    generateTerminationPDF(methods.getValues())
  }, [methods])

  // Build focus mode sections


  const renderSection = () => {
    switch (currentSection) {
      case 'closing':
        return <ClosingFormSection />
      case 'planned':
        return <PlannedTerminationSection />
      case 'unplanned':
        return <UnplannedTerminationSection />
      case 'coreIntervention':
        return <CoreInterventionFidelitySection />
      case 'cppObjectives':
        return <CPPObjectivesSection />
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
          title={formValues.closingForm.clientInitials || 'Termination'}
          subtitle="Termination packet (yellow form)"
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
          <div className="max-w-4xl mx-auto px-4 py-6">
            <SectionProgressHeader
              icon={SECTION_META[currentSection].icon}
              title={sections.find(s => s.id === currentSection)?.label || ''}
              subtitle={SECTION_META[currentSection].subtitle}
              percent={sectionProgress[currentSection]}
              tone={SECTION_META[currentSection].tone}
            />
            {renderSection()}
          </div>
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
