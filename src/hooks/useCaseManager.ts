import { useState, useCallback, useEffect } from 'react'
import { storage } from '@/utils/storage'
import type { CaseMeta } from '@/types/form.types'

export interface UseCaseManagerReturn {
  cases: CaseMeta[]
  currentCaseId: string | null
  isLoading: boolean
  createCase: () => string
  selectCase: (caseId: string) => void
  deleteCase: (caseId: string) => void
  duplicateCase: (caseId: string) => string | null
  refreshCases: () => void
  exportCase: (caseId: string) => string | null
  importCase: (jsonString: string) => string | null
}

export function useCaseManager(): UseCaseManagerReturn {
  const [cases, setCases] = useState<CaseMeta[]>([])
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load cases on mount
  useEffect(() => {
    const index = storage.getCasesIndex()
    setCases(index.cases)

    const lastCaseId = storage.getCurrentCaseId()
    if (lastCaseId && index.cases.some((c) => c.id === lastCaseId)) {
      setCurrentCaseId(lastCaseId)
    } else if (index.cases.length > 0) {
      // Select the most recent case
      setCurrentCaseId(index.cases[0].id)
      storage.setCurrentCaseId(index.cases[0].id)
    }

    setIsLoading(false)
  }, [])

  const refreshCases = useCallback(() => {
    const index = storage.getCasesIndex()
    setCases(index.cases)
  }, [])

  const createCase = useCallback(() => {
    const newCaseId = storage.createCase()
    const index = storage.getCasesIndex()
    setCases(index.cases)
    setCurrentCaseId(newCaseId)
    storage.setCurrentCaseId(newCaseId)
    return newCaseId
  }, [])

  const selectCase = useCallback((caseId: string) => {
    setCurrentCaseId(caseId)
    storage.setCurrentCaseId(caseId)
  }, [])

  const deleteCase = useCallback(
    (caseId: string) => {
      storage.deleteCase(caseId)
      const index = storage.getCasesIndex()
      setCases(index.cases)

      if (currentCaseId === caseId) {
        const nextCase = index.cases[0]
        if (nextCase) {
          setCurrentCaseId(nextCase.id)
          storage.setCurrentCaseId(nextCase.id)
        } else {
          setCurrentCaseId(null)
          storage.setCurrentCaseId(null)
        }
      }
    },
    [currentCaseId]
  )

  const duplicateCase = useCallback((sourceCaseId: string) => {
    const newCaseId = storage.duplicateCase(sourceCaseId)
    if (newCaseId) {
      const index = storage.getCasesIndex()
      setCases(index.cases)
      setCurrentCaseId(newCaseId)
      storage.setCurrentCaseId(newCaseId)
    }
    return newCaseId
  }, [])

  const exportCase = useCallback((caseId: string) => {
    return storage.exportCase(caseId)
  }, [])

  const importCase = useCallback((jsonString: string) => {
    const newCaseId = storage.importCase(jsonString)
    if (newCaseId) {
      const index = storage.getCasesIndex()
      setCases(index.cases)
      setCurrentCaseId(newCaseId)
      storage.setCurrentCaseId(newCaseId)
    }
    return newCaseId
  }, [])

  return {
    cases,
    currentCaseId,
    isLoading,
    createCase,
    selectCase,
    deleteCase,
    duplicateCase,
    refreshCases,
    exportCase,
    importCase,
  }
}
