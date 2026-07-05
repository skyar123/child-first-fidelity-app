import { describe, it, expect, beforeEach } from 'vitest'
import { installLocalStorageStub } from './localStorageStub'

installLocalStorageStub()

import {
  createRecord,
  listRecords,
  getRecord,
  updateRecord,
  deleteRecord,
  setRecordStatus,
  exportRecords,
  importRecords,
} from '@/utils/templateStorage'
import { computeDashboard, computeCaseCadence, CYCLE_DAYS, DAY_MS } from '@/utils/cadence'
import { createBackup, restoreBackup } from '@/utils/backup'

beforeEach(() => {
  localStorage.clear()
})

describe('templateStorage', () => {
  it('creates, lists, updates, and deletes records', () => {
    const record = createRecord('pr_foundational', 'POST ROSTERING July 2018', 'ab')
    expect(record.clientInitials).toBe('AB')
    expect(record.caseId).toBe('AB')
    expect(record.status).toBe('in_progress')

    expect(listRecords('pr_foundational')).toHaveLength(1)
    expect(listRecords('pr_termination')).toHaveLength(0)

    record.values['rp_emotions'] = { clinician: 'in_session', ccFrp: 'in_supervision' }
    expect(updateRecord(record)).toBe(true)
    expect(getRecord(record.id)?.values['rp_emotions']?.ccFrp).toBe('in_supervision')

    expect(setRecordStatus(record.id, 'reviewed', 'discussed in supervision')).toBe(true)
    expect(getRecord(record.id)?.status).toBe('reviewed')
    expect(getRecord(record.id)?.reviewNote).toBe('discussed in supervision')

    expect(deleteRecord(record.id)).toBe(true)
    expect(listRecords()).toHaveLength(0)
  })

  it('merges imports by newest updatedAt', () => {
    const record = createRecord('pr_supervision', 'POST ROSTERING July 2018', 'CD')
    const exported = exportRecords()

    // simulate a newer copy of the same record from another device
    const newer = {
      ...exported,
      records: [
        { ...record, updatedAt: record.updatedAt + 1000, reviewNote: 'newer' },
      ],
    }
    expect(importRecords(newer)).toBe(true)
    expect(getRecord(record.id)?.reviewNote).toBe('newer')

    // an older copy must not clobber
    const older = {
      ...exported,
      records: [{ ...record, updatedAt: record.updatedAt - 1000, reviewNote: 'older' }],
    }
    expect(importRecords(older)).toBe(true)
    expect(getRecord(record.id)?.reviewNote).toBe('newer')
  })
})

describe('cadence', () => {
  it('flags the two-case rule', () => {
    expect(computeDashboard().meetsTwoCaseRule).toBe(false)
    createRecord('pr_foundational', 'v', 'AA')
    createRecord('pr_foundational', 'v', 'BB')
    const dashboard = computeDashboard()
    expect(dashboard.openCases).toHaveLength(2)
    expect(dashboard.meetsTwoCaseRule).toBe(true)
  })

  it('schedules the first 90-day cycle from the A&E form', () => {
    const record = createRecord('pr_foundational', 'v', 'AA')
    const cadence = computeCaseCadence('AA', [record], record.createdAt + DAY_MS)
    expect(cadence.nextDueAt).toBe(record.createdAt + CYCLE_DAYS * DAY_MS)
    expect(cadence.overdue).toBe(false)
  })

  it('counts care-coordination forms as 90-day cycle activity', () => {
    const ae = createRecord('pr_foundational', 'v', 'AA')
    const cc = createRecord('cc_interventions', 'v', 'AA')
    const cadence = computeCaseCadence('AA', [ae, cc], cc.createdAt + DAY_MS)
    expect(cadence.lastCycleAt).toBe(cc.createdAt)
    expect(cadence.nextDueAt).toBe(cc.createdAt + CYCLE_DAYS * DAY_MS)
  })

  it('marks overdue cycles and closes cases at termination', () => {
    const ae = createRecord('pr_foundational', 'v', 'AA')
    const past = ae.createdAt + (CYCLE_DAYS + 10) * DAY_MS
    expect(computeCaseCadence('AA', [ae], past).overdue).toBe(true)

    const term = createRecord('pr_termination', 'v', 'AA')
    const cadence = computeCaseCadence('AA', [ae, term], past)
    expect(cadence.hasTermination).toBe(true)
    expect(cadence.nextDueAt).toBeNull()
    expect(computeDashboard(past).openCases).toHaveLength(0)
  })
})

describe('backup', () => {
  it('round-trips app data and rejects foreign keys', () => {
    createRecord('pr_foundational', 'v', 'AA')
    localStorage.setItem('cpp_fidelity_cases_index', JSON.stringify({ cases: [] }))
    localStorage.setItem('unrelated_key', 'should not travel')

    const backup = createBackup()
    expect(Object.keys(backup.data)).toContain('cf_template_records')
    expect(Object.keys(backup.data)).toContain('cpp_fidelity_cases_index')
    expect(Object.keys(backup.data)).not.toContain('unrelated_key')

    localStorage.clear()
    const restored = restoreBackup(JSON.stringify(backup))
    expect(restored).toBe(2)
    expect(listRecords()).toHaveLength(1)

    expect(restoreBackup('not json')).toBe(-1)
    expect(restoreBackup('{"format":"other"}')).toBe(-1)
  })
})
