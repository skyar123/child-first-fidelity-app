import { useEffect, useRef, useCallback, useState } from 'react'
import { storage } from '@/utils/storage'
import type { FormData } from '@/types/form.types'

const DEBOUNCE_MS = 1000 // Save after 1 second of inactivity

interface UseFormPersistenceOptions {
  onSave?: () => void
  onError?: (error: Error) => void
}

interface UseFormPersistenceReturn {
  isSaving: boolean
  lastSaved: number | null
  forceSave: () => void
  hasUnsavedChanges: boolean
}

export function useFormPersistence(
  formValues: FormData | null,
  caseId: string | null,
  options: UseFormPersistenceOptions = {}
): UseFormPersistenceReturn {
  const { onSave, onError } = options
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previousValuesRef = useRef<string | null>(null)
  const isInitialLoadRef = useRef(true)

  // Debounced auto-save
  useEffect(() => {
    if (!caseId || !formValues) return

    // Skip the initial load
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false
      previousValuesRef.current = JSON.stringify(formValues)
      return
    }

    // Skip if values haven't actually changed
    const currentJSON = JSON.stringify(formValues)
    if (currentJSON === previousValuesRef.current) return

    setHasUnsavedChanges(true)

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      setIsSaving(true)
      try {
        storage.saveCase(caseId, formValues)
        previousValuesRef.current = currentJSON
        setLastSaved(Date.now())
        setHasUnsavedChanges(false)
        onSave?.()
      } catch (error) {
        onError?.(error as Error)
      } finally {
        setIsSaving(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [formValues, caseId, onSave, onError])

  // Reset initial load flag when case changes
  useEffect(() => {
    isInitialLoadRef.current = true
    previousValuesRef.current = null
    setHasUnsavedChanges(false)
  }, [caseId])

  // Force save (for explicit save button or before navigation)
  const forceSave = useCallback(() => {
    if (!caseId || !formValues) return

    // Clear any pending debounced save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setIsSaving(true)
    try {
      storage.saveCase(caseId, formValues)
      previousValuesRef.current = JSON.stringify(formValues)
      setLastSaved(Date.now())
      setHasUnsavedChanges(false)
      onSave?.()
    } catch (error) {
      onError?.(error as Error)
    } finally {
      setIsSaving(false)
    }
  }, [caseId, formValues, onSave, onError])

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasUnsavedChanges && caseId && formValues) {
        storage.saveCase(caseId, formValues)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges, caseId, formValues])

  return {
    isSaving,
    lastSaved,
    forceSave,
    hasUnsavedChanges,
  }
}
