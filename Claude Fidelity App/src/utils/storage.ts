import type { FormData, CaseMeta, CasesIndex } from '@/types/form.types'

const STORAGE_KEY_PREFIX = 'cpp_fidelity_'
const CASES_INDEX_KEY = 'cpp_fidelity_cases_index'
const CURRENT_CASE_KEY = 'cpp_fidelity_current_case'

/**
 * Storage schema:
 *
 * cpp_fidelity_cases_index: { cases: [...metadata] }
 * cpp_fidelity_case_{uuid}: { ...formData }
 * cpp_fidelity_current_case: 'uuid'
 */

export const storage = {
  // ========================================
  // Case Index Management
  // ========================================

  getCasesIndex(): CasesIndex {
    try {
      const data = localStorage.getItem(CASES_INDEX_KEY)
      return data ? JSON.parse(data) : { cases: [] }
    } catch {
      console.error('Failed to parse cases index')
      return { cases: [] }
    }
  },

  saveCasesIndex(index: CasesIndex): void {
    try {
      localStorage.setItem(CASES_INDEX_KEY, JSON.stringify(index))
    } catch (error) {
      console.error('Failed to save cases index:', error)
      throw new Error('Storage quota exceeded')
    }
  },

  // ========================================
  // Individual Case Data
  // ========================================

  getCase(caseId: string): FormData | null {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}case_${caseId}`)
      return data ? JSON.parse(data) : null
    } catch {
      console.error(`Failed to parse case ${caseId}`)
      return null
    }
  },

  saveCase(caseId: string, data: FormData): FormData {
    const caseData: FormData = {
      ...data,
      lastModified: Date.now(),
    }

    try {
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}case_${caseId}`,
        JSON.stringify(caseData)
      )
    } catch (error) {
      console.error('Failed to save case:', error)
      throw new Error('Storage quota exceeded')
    }

    // Update index
    const index = this.getCasesIndex()
    const caseIndex = index.cases.findIndex((c) => c.id === caseId)
    if (caseIndex >= 0) {
      index.cases[caseIndex].lastModified = Date.now()
      index.cases[caseIndex].name =
        data.caseIdentification?.clientInitials || `Case ${caseId.slice(0, 8)}`
      index.cases[caseIndex].clientInitials =
        data.caseIdentification?.clientInitials || ''
    }
    this.saveCasesIndex(index)

    return caseData
  },

  createCase(initialData?: Partial<FormData>): string {
    const caseId = crypto.randomUUID()
    const index = this.getCasesIndex()

    const meta: CaseMeta = {
      id: caseId,
      name: 'New Case',
      clientInitials: '',
      created: Date.now(),
      lastModified: Date.now(),
    }

    index.cases.unshift(meta)
    this.saveCasesIndex(index)

    // Save initial data if provided
    if (initialData) {
      this.saveCase(caseId, initialData as FormData)
    }

    return caseId
  },

  deleteCase(caseId: string): void {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}case_${caseId}`)
    const index = this.getCasesIndex()
    index.cases = index.cases.filter((c) => c.id !== caseId)
    this.saveCasesIndex(index)
  },

  duplicateCase(sourceCaseId: string): string | null {
    const sourceData = this.getCase(sourceCaseId)
    if (!sourceData) return null

    const newCaseId = crypto.randomUUID()
    const index = this.getCasesIndex()

    const meta: CaseMeta = {
      id: newCaseId,
      name: `${sourceData.caseIdentification?.clientInitials || 'Case'} (Copy)`,
      clientInitials: sourceData.caseIdentification?.clientInitials || '',
      created: Date.now(),
      lastModified: Date.now(),
    }

    index.cases.unshift(meta)
    this.saveCasesIndex(index)

    this.saveCase(newCaseId, {
      ...sourceData,
      caseId: newCaseId,
      caseIdentification: {
        ...sourceData.caseIdentification,
        clientInitials: `${sourceData.caseIdentification?.clientInitials || ''} (Copy)`,
      },
    })

    return newCaseId
  },

  // ========================================
  // Current Case Tracking
  // ========================================

  getCurrentCaseId(): string | null {
    return localStorage.getItem(CURRENT_CASE_KEY)
  },

  setCurrentCaseId(caseId: string | null): void {
    if (caseId) {
      localStorage.setItem(CURRENT_CASE_KEY, caseId)
    } else {
      localStorage.removeItem(CURRENT_CASE_KEY)
    }
  },

  // ========================================
  // Storage Utilities
  // ========================================

  getStorageUsage(): { used: number; usedMB: string; percentUsed: number } {
    let total = 0
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        if (key.startsWith(STORAGE_KEY_PREFIX) || key === CASES_INDEX_KEY) {
          const item = localStorage.getItem(key)
          if (item) {
            total += item.length * 2 // UTF-16 = 2 bytes per char
          }
        }
      }
    }

    const maxStorage = 5 * 1024 * 1024 // Assume 5MB limit
    return {
      used: total,
      usedMB: (total / (1024 * 1024)).toFixed(2),
      percentUsed: Math.round((total / maxStorage) * 100),
    }
  },

  clearAllData(): void {
    const keysToRemove: string[] = []
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        if (
          key.startsWith(STORAGE_KEY_PREFIX) ||
          key === CASES_INDEX_KEY ||
          key === CURRENT_CASE_KEY
        ) {
          keysToRemove.push(key)
        }
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  },

  exportCase(caseId: string): string | null {
    const data = this.getCase(caseId)
    if (!data) return null
    return JSON.stringify(data, null, 2)
  },

  importCase(jsonString: string): string | null {
    try {
      const data = JSON.parse(jsonString) as FormData
      const newCaseId = crypto.randomUUID()

      const meta: CaseMeta = {
        id: newCaseId,
        name: data.caseIdentification?.clientInitials || 'Imported Case',
        clientInitials: data.caseIdentification?.clientInitials || '',
        created: Date.now(),
        lastModified: Date.now(),
      }

      const index = this.getCasesIndex()
      index.cases.unshift(meta)
      this.saveCasesIndex(index)

      this.saveCase(newCaseId, { ...data, caseId: newCaseId })
      return newCaseId
    } catch {
      console.error('Failed to import case')
      return null
    }
  },
}
