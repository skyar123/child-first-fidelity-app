import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useForm, FormProvider, type UseFormReturn } from 'react-hook-form'
import { storage } from '@/utils/storage'
import { createDefaultFormData } from '@/data/formSchema'
import { useFormPersistence } from '@/hooks/useFormPersistence'
import { fidelityStrands } from '@/data/fidelityItems'
import { assessmentSections, isItemVisible } from '@/data/assessmentItems'
import { traumaFeedbackSections } from '@/data/traumaFeedbackItems'
import { homeVisitSections } from '@/data/homeVisitItems'
import { cppObjectives } from '@/data/cppObjectives'
import { careCoordinatorSections } from '@/data/careCoordinatorItems'
import type { FormData, Progress, SectionProgress, CareCoordinatorItemValue } from '@/types/form.types'

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
}

// ========================================
// Context
// ========================================

const FormStateContext = createContext<FormStateContextValue | null>(null)

// ========================================
// Progress Calculation
// ========================================

function calculateProgress(formValues: FormData): Progress {
  const sections: SectionProgress = {
    caseIdentification: calculateCaseIdProgress(formValues),
    fidelityStrands: calculateFidelityProgress(formValues),
    contactLog: formValues.contactLog.length > 0 ? 100 : 0,
    assessmentChecklist: calculateAssessmentProgress(formValues),
    traumaFeedback: calculateTraumaFeedbackProgress(formValues),
    formulationPlanning: calculateFormulationProgress(formValues),
    homeVisitChecklists: calculateHomeVisitProgress(formValues),
    cppObjectives: calculateCppObjectivesProgress(formValues),
    careCoordinator: calculateCareCoordinatorProgress(formValues),
  }

  // Calculate overall (weighted average)
  const weights = {
    caseIdentification: 10,
    fidelityStrands: 20,
    contactLog: 5,
    assessmentChecklist: 20,
    traumaFeedback: 10,
    formulationPlanning: 10,
    homeVisitChecklists: 10,
    cppObjectives: 15,
    careCoordinator: 15,
  }

  let totalWeight = 0
  let weightedSum = 0
  for (const [key, weight] of Object.entries(weights)) {
    totalWeight += weight
    weightedSum += sections[key as keyof SectionProgress] * weight
  }

  const overall = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0

  // Clamp all section values and overall to 0–100 (guard against NaN/overflow)
  const clamp = (n: number) => Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0))
  return {
    sections: {
      caseIdentification: clamp(sections.caseIdentification),
      fidelityStrands: clamp(sections.fidelityStrands),
      contactLog: clamp(sections.contactLog),
      assessmentChecklist: clamp(sections.assessmentChecklist),
      traumaFeedback: clamp(sections.traumaFeedback),
      formulationPlanning: clamp(sections.formulationPlanning),
      homeVisitChecklists: clamp(sections.homeVisitChecklists),
      cppObjectives: clamp(sections.cppObjectives),
      careCoordinator: clamp(sections.careCoordinator),
    },
    overall: clamp(overall),
  }
}

function calculateCaseIdProgress(formValues: FormData): number {
  const fields = [
    formValues.caseIdentification.clinicalTeamNames,
    formValues.caseIdentification.clientInitials,
    formValues.caseIdentification.date,
    formValues.caseIdentification.referralSource,
    formValues.targetChild.ageInMonths,
    formValues.targetChild.gender,
    formValues.targetChild.primaryLanguage,
  ]

  const filled = fields.filter((f) => f !== '' && f !== null && f !== undefined)
  return Math.round((filled.length / fields.length) * 100)
}

// Only count as "completed" when value is a valid rating (not empty string or undefined)
const isValidChallengeRating = (v: unknown): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 3
const isValidCapacityRating = (v: unknown): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 2

function calculateFidelityProgress(formValues: FormData): number {
  let totalItems = 0
  let completedItems = 0

  const fidelityData = formValues.fidelityStrands
  if (!fidelityData || typeof fidelityData !== 'object') {
    return 0
  }

  // Use the actual data configuration to count total items (single source of truth)
  for (const strandConfig of fidelityStrands) {
    const strandData = fidelityData[strandConfig.id as keyof typeof fidelityData]

    // Challenge items: only count when value is 0, 1, 2, or 3
    totalItems += strandConfig.challengeItems.length
    for (const item of strandConfig.challengeItems) {
      const value = strandData?.challengeItems?.[item.id]
      if (isValidChallengeRating(value)) {
        completedItems++
      }
    }

    // Ungrouped capacity items: only count when value is 0, 1, or 2
    totalItems += strandConfig.capacityItems.length
    for (const item of strandConfig.capacityItems) {
      const value = strandData?.capacityItems?.[item.id]
      if (isValidCapacityRating(value)) {
        completedItems++
      }
    }

    // Grouped capacity items
    if (strandConfig.capacityGroups) {
      for (const group of strandConfig.capacityGroups) {
        totalItems += group.items.length
        for (const item of group.items) {
          const value = strandData?.capacityItems?.[item.id]
          if (isValidCapacityRating(value)) {
            completedItems++
          }
        }
      }
    }
  }

  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
}

function calculateAssessmentProgress(formValues: FormData): number {
  let totalItems = 0
  let completedItems = 0

  const checklist = formValues.assessmentChecklist
  const checklistItems = checklist?.items
  if (!checklistItems || typeof checklistItems !== 'object') return 0

  // Use the actual assessment sections config
  for (const section of assessmentSections) {
    for (const item of section.items) {
      // Check if item is visible based on conditional logic
      if (isItemVisible(item, formValues as unknown as Record<string, unknown>)) {
        totalItems++
        const itemData = checklistItems[item.id]
        // Only count when explicitly done (strict boolean check)
        if (itemData && typeof itemData.done === 'boolean' && itemData.done === true) {
          completedItems++
        }
      }
    }
  }

  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
}

function calculateTraumaFeedbackProgress(formValues: FormData): number {
  let totalItems = 0
  let completedItems = 0

  const items = formValues.traumaFeedback?.items
  if (!items || typeof items !== 'object') return 0

  for (const section of traumaFeedbackSections) {
    totalItems += section.items.length
    for (const item of section.items) {
      const rating = items[item.id]
      // Count when user has selected a rating (number, typically 0–5 scale)
      if (typeof rating === 'number' && Number.isInteger(rating)) {
        completedItems++
      }
    }
  }

  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
}

function calculateFormulationProgress(formValues: FormData): number {
  const fields = [
    formValues.formulation.presentingProblems,
    formValues.formulation.traumaHistory,
    formValues.formulation.developmentalHistory,
    formValues.formulation.familyContext,
    formValues.formulation.strengths,
    formValues.formulation.treatmentGoals,
    formValues.formulation.interventionPlan,
  ]

  const filled = fields.filter((f) => f !== '' && f !== null && f !== undefined)
  return Math.round((filled.length / fields.length) * 100)
}

function calculateHomeVisitProgress(formValues: FormData): number {
  let totalItems = 0
  let completedItems = 0

  for (const section of homeVisitSections) {
    totalItems += section.items.length
    for (const item of section.items) {
      const checked = formValues.homeVisit[section.id]?.[item.id]
      if (checked === true) {
        completedItems++
      }
    }
  }

  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
}

function calculateCppObjectivesProgress(formValues: FormData): number {
  const objectivesData = formValues.cppObjectives.objectives
  const totalObjectives = cppObjectives.length
  if (totalObjectives === 0) return 0
  let completedObjectives = 0

  for (const objective of cppObjectives) {
    const objData = objectivesData[objective.id]
    // Only count when clinicalFocus is a valid rating (0, 1, 2, or 3)
    const v = objData?.clinicalFocus
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 3) {
      completedObjectives++
    }
  }

  return Math.round((completedObjectives / totalObjectives) * 100)
}

function calculateCareCoordinatorProgress(formValues: FormData): number {
  const items = formValues.careCoordinator?.items || {}
  
  // Count total items from the actual data configuration, not from stored data
  let totalItems = 0
  let completedItems = 0
  
  for (const section of careCoordinatorSections) {
    for (const item of section.items) {
      if (item.type === 'checkbox') {
        totalItems++
        const itemData = items[item.id] as CareCoordinatorItemValue | undefined
        if (itemData?.done || itemData?.na) {
          completedItems++
        }
      } else if (item.type === 'multi-checkbox' && item.subItems) {
        for (const subItem of item.subItems) {
          totalItems++
          const itemData = items[item.id] as CareCoordinatorItemValue | undefined
          if (itemData?.subItems?.[subItem.id]) {
            completedItems++
          }
        }
      } else if (item.type === 'assessment-tracking' && item.assessmentTrackingItems) {
        for (const trackingItem of item.assessmentTrackingItems) {
          totalItems++
          const itemData = items[item.id] as CareCoordinatorItemValue | undefined
          const tracking = itemData?.assessmentTracking?.[trackingItem.id]
          if (tracking?.completed || tracking?.entered) {
            completedItems++
          }
        }
      }
    }
  }
  
  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
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

  const { watch, reset } = methods
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

  // Calculate progress synchronously from current form values (no effect = no stale state)
  const progress = useMemo((): Progress => {
    if (!isLoaded) {
      return {
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
      }
    }
    return calculateProgress(formValues)
  }, [isLoaded, formValues])

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
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 h-14 flex items-center px-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="lg:flex">
          <div className="hidden lg:block w-64 bg-white border-r border-gray-200 p-2 space-y-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2.5">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-10 bg-gray-200 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
          <div className="flex-1 p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="animate-pulse space-y-4">
                    <div className="h-5 w-48 bg-gray-200 rounded" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-200 rounded" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
