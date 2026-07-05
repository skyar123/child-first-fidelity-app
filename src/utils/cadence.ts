// Fidelity form cadence, per the Child First Fidelity Forms Cheat Sheet
// (v. 11/7/25) and framework coversheet:
// - Assessment & Engagement: completed throughout the phase, finalized with
//   the formulation/treatment plan (within 60 days of treatment start)
// - Core Intervention: every 90 days after the A&E form, while the case is open
// - Care Coordination: with A&E, then every 90 days
// - Supervision: every 90 days per team member per fidelity case
// - Termination: when the case is discharged
// - Two fidelity cases are maintained at all times per practitioner

import type { TemplateRecord } from '@/templates/types'
import { listRecords } from './templateStorage'

export const DAY_MS = 24 * 60 * 60 * 1000
export const AE_WINDOW_DAYS = 60
export const CYCLE_DAYS = 90
export const REQUIRED_FIDELITY_CASES = 2

export interface CaseCadence {
  caseId: string
  clientInitials: string
  records: TemplateRecord[]
  hasFoundational: boolean
  hasTermination: boolean
  /** last time any cyclical form (core/supervision) was started */
  lastCycleAt: number | null
  /** when the next core-intervention/supervision cycle is due (null once terminated) */
  nextDueAt: number | null
  overdue: boolean
  daysUntilDue: number | null
}

function latest(records: TemplateRecord[], templateId: string): TemplateRecord | undefined {
  return records
    .filter(r => r.templateId === templateId)
    .sort((a, b) => b.createdAt - a.createdAt)[0]
}

export function computeCaseCadence(caseId: string, records: TemplateRecord[], now = Date.now()): CaseCadence {
  const foundational = latest(records, 'pr_foundational')
  const core = latest(records, 'pr_core_intervention')
  const careCoordination = latest(records, 'cc_interventions')
  const supervision = latest(records, 'pr_supervision')
  const termination = latest(records, 'pr_termination')

  const clientInitials = records[0]?.clientInitials || caseId

  const cycleDates = [core?.createdAt, careCoordination?.createdAt, supervision?.createdAt].filter(
    (d): d is number => typeof d === 'number'
  )
  const lastCycleAt = cycleDates.length > 0 ? Math.max(...cycleDates) : null

  let nextDueAt: number | null = null
  if (termination) {
    nextDueAt = null // case closed
  } else if (lastCycleAt !== null) {
    nextDueAt = lastCycleAt + CYCLE_DAYS * DAY_MS
  } else if (foundational) {
    // first core-intervention cycle is due 90 days after the A&E form
    nextDueAt = foundational.createdAt + CYCLE_DAYS * DAY_MS
  }

  const daysUntilDue = nextDueAt !== null ? Math.ceil((nextDueAt - now) / DAY_MS) : null

  return {
    caseId,
    clientInitials,
    records,
    hasFoundational: !!foundational,
    hasTermination: !!termination,
    lastCycleAt,
    nextDueAt,
    overdue: daysUntilDue !== null && daysUntilDue < 0,
    daysUntilDue,
  }
}

export interface DashboardData {
  cases: CaseCadence[]
  openCases: CaseCadence[]
  meetsTwoCaseRule: boolean
}

export function computeDashboard(now = Date.now()): DashboardData {
  const all = listRecords()
  const byCase = new Map<string, TemplateRecord[]>()
  for (const record of all) {
    const list = byCase.get(record.caseId) || []
    list.push(record)
    byCase.set(record.caseId, list)
  }

  const cases = [...byCase.entries()]
    .map(([caseId, records]) => computeCaseCadence(caseId, records, now))
    .sort((a, b) => {
      // open cases first, then by soonest due
      if (a.hasTermination !== b.hasTermination) return a.hasTermination ? 1 : -1
      return (a.nextDueAt ?? Infinity) - (b.nextDueAt ?? Infinity)
    })

  const openCases = cases.filter(c => !c.hasTermination)
  return {
    cases,
    openCases,
    meetsTwoCaseRule: openCases.length >= REQUIRED_FIDELITY_CASES,
  }
}
