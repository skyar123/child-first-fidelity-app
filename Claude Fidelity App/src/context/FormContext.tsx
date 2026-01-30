import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useForm, FormProvider, type UseFormReturn } from 'react-hook-form'
import { storage } from '@/utils/storage'
import { createDefaultFormData } from '@/data/formSchema'
import { useFormPersistence } from '@/hooks/useFormPersistence'
import type { FormData, Progress, SectionProgress } from '@/types/form.types'
import {
  careCoordinatorSections,
  type CareCoordinatorItemValue,
} from '@/data/careCoordinatorItems'
import { fidelityStrands } from '@/data/fidelityItems'
import { assessmentSections, isItemVisible, NO_TRAUMA_VALUE } from '@/data/assessmentItems'
import { traumaFeedbackSections } from '@/data/traumaFeedbackItems'

// ========================================
// Context Types
// ========================================

interface FormStateContextValue {
  caseId: string | null
  progress: Progress
  isSaving: boolean
  lastSaved: number | null
  hasUnsavedChanges: boolean
  forceSave: () => void
}

interface FormProviderWrapperProps {
  children: ReactNode
  caseId: string | null
  onCaseChange?: (caseId: string | null) => void
}

// ========================================
// Context
// ========================================

const FormStateContext = createContext<FormStateContextValue | null>(null)

// ========================================
// Progress Calculation (simplified - will be enhanced in Phase 7)
// ========================================

function calculateProgress(formValues: FormData): Progress {
  const sections: SectionProgress = {
    caseIdentification: calculateCaseIdProgress(formValues),
    fidelityStrands: 0,
    contactLog: formValues.contactLog.length > 0 ? 100 : 0,
    assessmentChecklist: 0,
    traumaFeedback: 0,
    formulationPlanning: 0,
    homeVisitChecklists: 0,
    cppObjectives: 0,
    careCoordinator: calculateCareCoordinatorProgress(formValues),
  }

  // Calculate overall (weighted average - simplified for now)
  const values = Object.values(sections)
  const overall = Math.round(values.reduce((a, b) => a + b, 0) / values.length)

  return { sections, overall }
}

function calculateCareCoordinatorProgress(formValues: FormData): number {
  const items = formValues.careCoordinator?.items || {}
  const totalItems = Object.keys(items).length
  
  if (totalItems === 0) return 0
  
  let completed = 0
  for (const item of Object.values(items)) {
    if (item.done || item.na) {
      completed++
    } else if (item.subItems) {
      const subItemValues = Object.values(item.subItems)
      if (subItemValues.length > 0 && subItemValues.some(v => v)) {
        completed++
      }
    } else if (item.assessmentTracking) {
      const trackingValues = Object.values(item.assessmentTracking)
      if (trackingValues.length > 0 && trackingValues.some(v => v.completed || v.entered)) {
        completed++
      }
    }
  }
  
  return Math.round((completed / totalItems) * 100)
}

function calculateCaseIdProgress(formValues: FormData): number {
  const fields = [
    formValues.caseIdentification.clinicalTeamNames,
    formValues.caseIdentification.clientInitials,
    formValues.caseIdentification.date,
    formValues.targetChild.ageInMonths,
    formValues.targetChild.gender,
  ]

  const filled = fields.filter((f) => f !== '' && f !== null && f !== undefined)
  return Math.round((filled.length / fields.length) * 100)
}

// ========================================
// Provider Component
// ========================================

export function CPPFormProvider({
  children,
  caseId,
}: FormProviderWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Load initial data from storage or create defaults
  const getInitialData = useCallback((): FormData => {
    if (caseId) {
      const savedData = storage.getCase(caseId)
      if (savedData) {
        return savedData
      }
    }
    return createDefaultFormData(caseId || undefined)
  }, [caseId])

  // Initialize form with react-hook-form
  const methods: UseFormReturn<FormData> = useForm<FormData>({
    defaultValues: getInitialData(),
    mode: 'onChange',
  })

  const { watch, reset, getValues } = methods
  const formValues = watch()

  // Reset form when case changes
  useEffect(() => {
    setIsLoaded(false)
    const data = getInitialData()
    reset(data)
    setIsLoaded(true)
  }, [caseId, getInitialData, reset])

  // Auto-save with persistence hook
  const { isSaving, lastSaved, forceSave, hasUnsavedChanges } =
    useFormPersistence(isLoaded ? formValues : null, caseId)

  // Calculate progress
  const [progress, setProgress] = useState<Progress>({
    sections: {
      caseIdentification: 0,
      fidelityStrands: 0,
      contactLog: 0,
      assessmentChecklist: 0,
      traumaFeedback: 0,
      formulationPlanning: 0,
      homeVisitChecklists: 0,
      cppObjectives: 0,
      careCoordinator: 0,
    },
    overall: 0,
  })

  // Update progress when form values change (debounced internally)
  useEffect(() => {
    if (isLoaded) {
      const newProgress = calculateProgress(getValues())
      setProgress(newProgress)
    }
  }, [formValues, isLoaded, getValues])

  const contextValue: FormStateContextValue = {
    caseId,
    progress,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    forceSave,
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <FormStateContext.Provider value={contextValue}>
      <FormProvider {...methods}>{children}</FormProvider>
    </FormStateContext.Provider>
  )
}

// ========================================
// Hook
// ========================================

export function useFormState(): FormStateContextValue {
  const context = useContext(FormStateContext)
  if (!context) {
    throw new Error('useFormState must be used within a CPPFormProvider')
  }
  return context
}
