// Turns a client's admit date into a plain-language fidelity plan:
// which form, when it's due, and why — per the Child First Fidelity Forms
// Cheat Sheet (© 2016) and the form instructions themselves.
//
// Rules:
// - Visit log (CPP Contact Log): after every session, the whole time.
// - I  Foundational packet: fill as you go; finish by day 60 (with the
//      formulation/plan of care).
// - III Care Coordination (CC/FRP): first one after assessment and before
//      formulation (by day 60), then every 3 months.
// - II Core Intervention: every 3 months once the Foundational packet is done.
// - V  Supervision: every 3 months, completed individually.
// - IV Termination packet: when the case closes.

import type { FormType } from '@/types/app.types'
import type { Client, ClientPlanMarks, PractitionerRole } from './clients'
import { listRecords } from './templateStorage'

export const DAY_MS = 24 * 60 * 60 * 1000
const CYCLE_DAYS = 90
const FOUNDATIONAL_DAYS = 60

export type PlanItemStatus = 'done' | 'due_now' | 'overdue' | 'upcoming' | 'when_closing'

export interface PlanItem {
  id: string
  /** Which form to open */
  formType: FormType
  title: string
  /** One plain sentence: what this form is */
  what: string
  /** One plain sentence: what to do right now */
  action: string
  repeats: boolean
  /** For the CC/FRP, III is "your form" */
  yours: boolean
  dueDate: string | null // ISO; null = event-driven (termination)
  lastDone: string | null
  status: PlanItemStatus
  daysUntilDue: number | null
}

function iso(date: Date): string {
  return date.toISOString().split('T')[0]
}

function addDays(isoDate: string, days: number): string {
  return iso(new Date(new Date(isoDate + 'T12:00:00').getTime() + days * DAY_MS))
}

function daysBetween(fromIso: string, toIso: string): number {
  return Math.round(
    (new Date(toIso + 'T12:00:00').getTime() - new Date(fromIso + 'T12:00:00').getTime()) / DAY_MS
  )
}

/** newest template-record date (ISO) for this client + template, or null */
function newestRecordDate(clientInitials: string, templateId: string): string | null {
  const records = listRecords(templateId, clientInitials.trim().toUpperCase())
  if (records.length === 0) return null
  return iso(new Date(Math.max(...records.map(r => r.createdAt))))
}

function statusFor(
  dueDate: string | null,
  lastDone: string | null,
  today: string,
  repeats: boolean
): { status: PlanItemStatus; daysUntilDue: number | null } {
  if (dueDate === null) return { status: 'when_closing', daysUntilDue: null }
  if (!repeats && lastDone) return { status: 'done', daysUntilDue: null }
  const days = daysBetween(today, dueDate)
  if (days < 0) return { status: 'overdue', daysUntilDue: days }
  if (days <= 14) return { status: 'due_now', daysUntilDue: days }
  return { status: 'upcoming', daysUntilDue: days }
}

export function computePlan(
  client: Client,
  marks: ClientPlanMarks,
  role: PractitionerRole,
  todayIso: string = iso(new Date())
): PlanItem[] {
  const admit = client.admitDate
  const items: PlanItem[] = []

  const effectiveDone = (itemId: string, templateId?: string): string | null => {
    const manual = marks[itemId]?.lastDone || null
    const auto = templateId ? newestRecordDate(client.initials, templateId) : null
    if (manual && auto) return manual > auto ? manual : auto
    return manual || auto
  }

  // I — Foundational packet
  {
    const lastDone = effectiveDone('foundational')
    const dueDate = addDays(admit, FOUNDATIONAL_DAYS)
    items.push({
      id: 'foundational',
      formType: 'foundational',
      title: 'Foundational packet (green form)',
      what: 'The getting-to-know-the-family packet: engagement steps, trauma screening, strands, and the formulation.',
      action: `Fill it in as you go through the first visits. Finish the whole packet by ${dueDate} (day 60).`,
      repeats: false,
      yours: false,
      dueDate,
      lastDone,
      ...statusFor(dueDate, lastDone, todayIso, false),
    })
  }

  // III — Care Coordination (the CC/FRP's own form)
  {
    const lastDone = effectiveDone('cc', 'cc_interventions')
    const dueDate = lastDone ? addDays(lastDone, CYCLE_DAYS) : addDays(admit, FOUNDATIONAL_DAYS)
    items.push({
      id: 'cc',
      formType: 'cc_interventions',
      title: 'Care Coordination form',
      what: 'Your checklist of what you did for the family: SNIFF, services and supports, executive functioning.',
      action: lastDone
        ? `You last completed it ${lastDone}. The next one is due ${dueDate} (every 3 months).`
        : `Do the first one after the assessment, before the formulation — by ${dueDate}.`,
      repeats: true,
      yours: role === 'ccfrp',
      dueDate,
      lastDone,
      ...statusFor(dueDate, lastDone, todayIso, true),
    })
  }

  // II — Core Intervention (every 3 months after Foundational)
  {
    const foundationalDone = effectiveDone('foundational')
    const lastDone = effectiveDone('core')
    const base = lastDone || foundationalDone
    const dueDate = base ? addDays(base, CYCLE_DAYS) : addDays(admit, FOUNDATIONAL_DAYS + CYCLE_DAYS)
    items.push({
      id: 'core',
      formType: 'core_intervention',
      title: 'Core Intervention form (purple form)',
      what: 'How treatment is going: your capacities on the five strands and what the work is focusing on.',
      action: lastDone
        ? `Last completed ${lastDone}. Do it again by ${dueDate} (every 3 months).`
        : `Starts after the Foundational packet. First one due about ${dueDate}.`,
      repeats: true,
      yours: false,
      dueDate,
      lastDone,
      ...statusFor(dueDate, lastDone, todayIso, true),
    })
  }

  // V — Supervision (every 3 months, individually)
  {
    const lastDone = effectiveDone('supervision')
    const dueDate = lastDone ? addDays(lastDone, CYCLE_DAYS) : addDays(admit, CYCLE_DAYS)
    items.push({
      id: 'supervision',
      formType: 'supervision',
      title: 'Supervision form (pink form)',
      what: 'You rate the supervision you receive — just you, not the family. It also holds your supervision log.',
      action: lastDone
        ? `Last completed ${lastDone}. Next one due ${dueDate} (every 3 months).`
        : `First one due ${dueDate} (every 3 months). Fill it out on your own.`,
      repeats: true,
      yours: false,
      dueDate,
      lastDone,
      ...statusFor(dueDate, lastDone, todayIso, true),
    })
  }

  // IV — Termination (event-driven)
  {
    const lastDone = effectiveDone('termination')
    items.push({
      id: 'termination',
      formType: 'termination',
      title: 'Termination packet (yellow form)',
      what: 'The goodbye packet: how the case closed, the planned (or unplanned) termination steps, and final ratings.',
      action: client.closed
        ? 'The case is closed — complete this packet now if you have not.'
        : 'Only when the case is ending. Nothing to do until then.',
      repeats: false,
      yours: false,
      dueDate: client.closed ? client.closedDate || todayIso : null,
      lastDone,
      ...(lastDone
        ? { status: 'done' as PlanItemStatus, daysUntilDue: null }
        : client.closed
          ? { status: 'due_now' as PlanItemStatus, daysUntilDue: 0 }
          : { status: 'when_closing' as PlanItemStatus, daysUntilDue: null }),
    })
  }

  return items
}

/** The single most urgent thing to do for this client, for the client card. */
export function nextAction(items: PlanItem[], visitCount: number): string {
  const overdue = items.find(i => i.status === 'overdue')
  if (overdue) return `Overdue: ${overdue.title}`
  const dueNow = items.find(i => i.status === 'due_now')
  if (dueNow)
    return dueNow.daysUntilDue === 0 ? `Due today: ${dueNow.title}` : `Due soon: ${dueNow.title}`
  if (visitCount === 0) return 'Log your first visit'
  return 'On track — log visits as you go'
}
