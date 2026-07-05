// Full-app JSON backup and restore.
// Everything lives in localStorage, so a lost/cleared browser means lost
// clinical documentation. Export regularly; the file can be re-imported on
// any device. The backup contains client initials and free-text notes —
// treat the file with the same care as the paper forms (locked storage).

const LEGACY_PREFIXES = ['cpp_fidelity_']
const TEMPLATE_KEY = 'cf_template_records'
export const BACKUP_FORMAT_VERSION = 1

export interface BackupFile {
  format: 'child-first-fidelity-backup'
  formatVersion: number
  exportedAt: string
  data: Record<string, unknown>
}

export function createBackup(): BackupFile {
  const data: Record<string, unknown> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue
    const isOurs = key === TEMPLATE_KEY || LEGACY_PREFIXES.some(p => key.startsWith(p))
    if (!isOurs) continue
    try {
      const raw = localStorage.getItem(key)
      data[key] = raw ? JSON.parse(raw) : null
    } catch {
      data[key] = localStorage.getItem(key)
    }
  }
  return {
    format: 'child-first-fidelity-backup',
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  }
}

export function downloadBackup(): void {
  const backup = createBackup()
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `child-first-fidelity-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function validateBackup(parsed: unknown): parsed is BackupFile {
  if (typeof parsed !== 'object' || parsed === null) return false
  const candidate = parsed as Partial<BackupFile>
  return (
    candidate.format === 'child-first-fidelity-backup' &&
    typeof candidate.formatVersion === 'number' &&
    typeof candidate.data === 'object' &&
    candidate.data !== null
  )
}

/** Restores a backup. Returns the number of keys restored, or -1 on invalid file. */
export function restoreBackup(fileContents: string): number {
  let parsed: unknown
  try {
    parsed = JSON.parse(fileContents)
  } catch {
    return -1
  }
  if (!validateBackup(parsed)) return -1

  let restored = 0
  for (const [key, value] of Object.entries(parsed.data)) {
    const isOurs = key === TEMPLATE_KEY || LEGACY_PREFIXES.some(p => key.startsWith(p))
    if (!isOurs) continue // never restore foreign keys
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    restored++
  }
  return restored
}
