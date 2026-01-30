import type { FormData, CasesIndex, CaseMeta } from '@/types/form.types'
import { createDefaultFormData } from '@/data/formSchema'

// ========================================
// Storage Keys
// ========================================

const STORAGE_KEYS = {
  CASES_INDEX: 'cpp_fidelity_cases_index',
  CASE_PREFIX: 'cpp_fidelity_case_',
  CURRENT_CASE: 'cpp_fidelity_current_case',
} as const

// ========================================
// Storage Utilities
// ========================================

function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error)
    return null
  }
}

function setItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error)
    return false
  }
}

function removeItem(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error)
    return false
  }
}

// ========================================
// Cases Index Management
// ========================================

function getCasesIndex(): CasesIndex {
  const index = getItem<CasesIndex>(STORAGE_KEYS.CASES_INDEX)
  return index || { cases: [] }
}

function saveCasesIndex(index: CasesIndex): boolean {
  return setItem(STORAGE_KEYS.CASES_INDEX, index)
}

function updateCaseMeta(caseId: string, updates: Partial<CaseMeta>): void {
  const index = getCasesIndex()
  const caseIndex = index.cases.findIndex((c) => c.id === caseId)
  if (caseIndex !== -1) {
    index.cases[caseIndex] = { ...index.cases[caseIndex], ...updates }
    saveCasesIndex(index)
  }
}

// ========================================
// Case CRUD Operations
// ========================================

function createCase(): string {
  const caseId = crypto.randomUUID()
  const now = Date.now()

  // Create new case data
  const caseData = createDefaultFormData(caseId)
  setItem(`${STORAGE_KEYS.CASE_PREFIX}${caseId}`, caseData)

  // Add to index
  const index = getCasesIndex()
  const newCase: CaseMeta = {
    id: caseId,
    clientInitials: '',
    createdAt: now,
    updatedAt: now,
  }
  index.cases.unshift(newCase) // Add to beginning
  saveCasesIndex(index)

  return caseId
}

function getCase(caseId: string): FormData | null {
  return getItem<FormData>(`${STORAGE_KEYS.CASE_PREFIX}${caseId}`)
}

function saveCase(caseId: string, data: FormData): boolean {
  const success = setItem(`${STORAGE_KEYS.CASE_PREFIX}${caseId}`, data)
  if (success) {
    updateCaseMeta(caseId, {
      clientInitials: data.caseIdentification.clientInitials || '',
      updatedAt: Date.now(),
    })
  }
  return success
}

function deleteCase(caseId: string): boolean {
  // Remove case data
  removeItem(`${STORAGE_KEYS.CASE_PREFIX}${caseId}`)

  // Remove from index
  const index = getCasesIndex()
  index.cases = index.cases.filter((c) => c.id !== caseId)
  return saveCasesIndex(index)
}

function duplicateCase(sourceCaseId: string): string | null {
  const sourceData = getCase(sourceCaseId)
  if (!sourceData) return null

  const newCaseId = crypto.randomUUID()
  const now = Date.now()

  // Clone the data with new ID
  const newData: FormData = JSON.parse(JSON.stringify(sourceData))

  // Save the new case
  setItem(`${STORAGE_KEYS.CASE_PREFIX}${newCaseId}`, newData)

  // Add to index
  const index = getCasesIndex()
  const sourceMeta = index.cases.find((c) => c.id === sourceCaseId)
  const newCase: CaseMeta = {
    id: newCaseId,
    clientInitials: sourceMeta?.clientInitials
      ? `${sourceMeta.clientInitials} (Copy)`
      : 'Copy',
    createdAt: now,
    updatedAt: now,
  }
  index.cases.unshift(newCase)
  saveCasesIndex(index)

  return newCaseId
}

// ========================================
// Current Case Management
// ========================================

function getCurrentCaseId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_CASE)
  } catch {
    return null
  }
}

function setCurrentCaseId(caseId: string | null): void {
  try {
    if (caseId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CASE, caseId)
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CASE)
    }
  } catch (error) {
    console.error('Error setting current case ID', error)
  }
}

// ========================================
// Import/Export
// ========================================

function exportCase(caseId: string): string | null {
  const data = getCase(caseId)
  if (!data) return null

  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    caseId,
    data,
  }

  return JSON.stringify(exportData, null, 2)
}

function importCase(jsonString: string): string | null {
  try {
    const importData = JSON.parse(jsonString)

    if (!importData.data || typeof importData.data !== 'object') {
      throw new Error('Invalid import format')
    }

    const newCaseId = crypto.randomUUID()
    const now = Date.now()

    // Save the imported data with new ID
    setItem(`${STORAGE_KEYS.CASE_PREFIX}${newCaseId}`, importData.data)

    // Add to index
    const index = getCasesIndex()
    const newCase: CaseMeta = {
      id: newCaseId,
      clientInitials:
        importData.data.caseIdentification?.clientInitials || 'Imported',
      createdAt: now,
      updatedAt: now,
    }
    index.cases.unshift(newCase)
    saveCasesIndex(index)

    return newCaseId
  } catch (error) {
    console.error('Error importing case', error)
    return null
  }
}

// ========================================
// Export Storage API
// ========================================

export const storage = {
  getCasesIndex,
  createCase,
  getCase,
  saveCase,
  deleteCase,
  duplicateCase,
  getCurrentCaseId,
  setCurrentCaseId,
  exportCase,
  importCase,
}
