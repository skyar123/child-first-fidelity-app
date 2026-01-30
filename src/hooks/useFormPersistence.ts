import { useEffect, useRef, useState, useCallback } from 'react'
import { storage } from '@/utils/storage'
import { useDebounce } from './useDebounce'
import type { FormData } from '@/types/form.types'

const DEBOUNCE_MS = 1000

export interface UseFormPersistenceReturn {
  isSaving: boolean
  lastSaved: number | null
  hasUnsavedChanges: boolean
  forceSave: () => void
}

export function useFormPersistence(
  formData: FormData | null,
  caseId: string | null
): UseFormPersistenceReturn {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const lastSavedDataRef = useRef<string | null>(null)
  const debouncedData = useDebounce(formData, DEBOUNCE_MS)

  // Save function
  const saveData = useCallback(
    (data: FormData) => {
      if (!caseId) return

      const dataString = JSON.stringify(data)

      // Skip if data hasn't changed
      if (dataString === lastSavedDataRef.current) {
        setHasUnsavedChanges(false)
        return
      }

      setIsSaving(true)

      const success = storage.saveCase(caseId, data)

      if (success) {
        lastSavedDataRef.current = dataString
        setLastSaved(Date.now())
        setHasUnsavedChanges(false)
      }

      setIsSaving(false)
    },
    [caseId]
  )

  // Force save (for manual save button or beforeunload)
  const forceSave = useCallback(() => {
    if (formData && caseId) {
      saveData(formData)
    }
  }, [formData, caseId, saveData])

  // Auto-save when debounced data changes
  useEffect(() => {
    if (debouncedData && caseId) {
      saveData(debouncedData)
    }
  }, [debouncedData, caseId, saveData])

  // Track unsaved changes
  useEffect(() => {
    if (!formData || !caseId) return

    const currentString = JSON.stringify(formData)
    if (currentString !== lastSavedDataRef.current) {
      setHasUnsavedChanges(true)
    }
  }, [formData, caseId])

  // Save on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasUnsavedChanges && formData && caseId) {
        storage.saveCase(caseId, formData)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, formData, caseId])

  // Initialize lastSavedDataRef when loading existing case
  useEffect(() => {
    if (formData && caseId && lastSavedDataRef.current === null) {
      lastSavedDataRef.current = JSON.stringify(formData)
    }
  }, [formData, caseId])

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    forceSave,
  }
}
