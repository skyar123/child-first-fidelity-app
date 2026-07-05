// Storage for versioned template-form records.
// Unlike the legacy per-case FormData blob, template records are stored as a
// flat list: one record per (case, template, cycle instance). This is what
// lets the app keep repeated 90-day submissions instead of overwriting.

import type { TemplateRecord, RecordStatus } from '@/templates/types'

const RECORDS_KEY = 'cf_template_records'
export const TEMPLATE_STORE_VERSION = 1

interface RecordsFile {
  storeVersion: number
  records: TemplateRecord[]
}

function load(): RecordsFile {
  try {
    const raw = localStorage.getItem(RECORDS_KEY)
    if (!raw) return { storeVersion: TEMPLATE_STORE_VERSION, records: [] }
    const parsed = JSON.parse(raw) as RecordsFile
    if (!Array.isArray(parsed.records)) {
      return { storeVersion: TEMPLATE_STORE_VERSION, records: [] }
    }
    return parsed
  } catch (error) {
    console.error('Error reading template records', error)
    return { storeVersion: TEMPLATE_STORE_VERSION, records: [] }
  }
}

function save(file: RecordsFile): boolean {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(file))
    return true
  } catch (error) {
    console.error('Error saving template records', error)
    return false
  }
}

export function listRecords(templateId?: string, caseId?: string): TemplateRecord[] {
  const { records } = load()
  return records
    .filter(r => (templateId ? r.templateId === templateId : true))
    .filter(r => (caseId ? r.caseId === caseId : true))
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getRecord(id: string): TemplateRecord | undefined {
  return load().records.find(r => r.id === id)
}

export function createRecord(
  templateId: string,
  templateVersion: string,
  clientInitials: string,
  caseId?: string
): TemplateRecord {
  const record: TemplateRecord = {
    id: crypto.randomUUID(),
    caseId: caseId || clientInitials.trim().toUpperCase() || 'UNASSIGNED',
    clientInitials: clientInitials.trim().toUpperCase(),
    templateId,
    templateVersion,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    header: {},
    values: {},
    status: 'in_progress',
  }
  const file = load()
  file.records.push(record)
  save(file)
  return record
}

export function updateRecord(record: TemplateRecord): boolean {
  const file = load()
  const index = file.records.findIndex(r => r.id === record.id)
  if (index === -1) return false
  file.records[index] = { ...record, updatedAt: Date.now() }
  return save(file)
}

export function setRecordStatus(id: string, status: RecordStatus, reviewNote?: string): boolean {
  const file = load()
  const record = file.records.find(r => r.id === id)
  if (!record) return false
  record.status = status
  if (reviewNote !== undefined) record.reviewNote = reviewNote
  record.updatedAt = Date.now()
  return save(file)
}

export function deleteRecord(id: string): boolean {
  const file = load()
  file.records = file.records.filter(r => r.id !== id)
  return save(file)
}

// ----------------------------------------
// Backup / restore (covers template records; legacy case data is exported
// alongside by backup.ts)
// ----------------------------------------

export function exportRecords(): RecordsFile {
  return load()
}

export function importRecords(file: RecordsFile, merge = true): boolean {
  if (!merge) return save(file)
  const current = load()
  const byId = new Map(current.records.map(r => [r.id, r]))
  for (const record of file.records) {
    const existing = byId.get(record.id)
    if (!existing || record.updatedAt > existing.updatedAt) {
      byId.set(record.id, record)
    }
  }
  return save({ storeVersion: TEMPLATE_STORE_VERSION, records: [...byId.values()] })
}
