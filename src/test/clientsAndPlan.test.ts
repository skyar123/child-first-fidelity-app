import { describe, it, expect, beforeEach } from 'vitest'
import { installLocalStorageStub } from './localStorageStub'

installLocalStorageStub()

import {
  addClient,
  listClients,
  updateClient,
  removeClient,
  addVisit,
  listVisits,
  nextSessionCounter,
  setPlanMark,
  getPlanMarks,
  getRole,
  setRole,
} from '@/utils/clients'
import { computePlan, nextAction } from '@/utils/carePlan'
import { createRecord } from '@/utils/templateStorage'

beforeEach(() => {
  localStorage.clear()
})

const visitBase = {
  contactType: 'dyadic_treatment',
  minutes: 60,
  sessionStatus: 'show' as const,
  reasonNotAttending: '',
  whoAttended: ['target_child', 'caregiver_1'],
  whereHeld: 'home',
  notes: '',
}

describe('clients', () => {
  it('adds, lists, closes, and removes clients', () => {
    const client = addClient('ab', '2026-07-01')
    expect(client.initials).toBe('AB')
    expect(listClients()).toHaveLength(1)

    updateClient({ ...client, closed: true, closedDate: '2026-08-01' })
    expect(listClients()[0].closed).toBe(true)

    removeClient(client.id)
    expect(listClients()).toHaveLength(0)
  })

  it('logs visits with an auto-incrementing session counter', () => {
    const client = addClient('AB', '2026-07-01')
    expect(nextSessionCounter(client.id)).toBe(1)
    addVisit({ ...visitBase, clientId: client.id, date: '2026-07-02', sessionCounter: 1 })
    addVisit({ ...visitBase, clientId: client.id, date: '2026-07-05', sessionCounter: 2 })
    expect(nextSessionCounter(client.id)).toBe(3)
    expect(listVisits(client.id)).toHaveLength(2)
    // removing the client removes their visit log
    removeClient(client.id)
    expect(listVisits(client.id)).toHaveLength(0)
  })

  it('stores the practitioner role', () => {
    expect(getRole()).toBe('ccfrp') // default
    setRole('clinician')
    expect(getRole()).toBe('clinician')
  })
})

describe('care plan', () => {
  it('lays out the five forms with due dates from the admit date', () => {
    const client = addClient('AB', '2026-01-01')
    const plan = computePlan(client, {}, 'ccfrp', '2026-01-10')
    const byId = Object.fromEntries(plan.map(i => [i.id, i]))

    expect(plan.map(i => i.id)).toEqual(['foundational', 'cc', 'core', 'supervision', 'termination'])
    expect(byId.foundational.dueDate).toBe('2026-03-02') // day 60
    expect(byId.cc.dueDate).toBe('2026-03-02') // before formulation
    expect(byId.cc.yours).toBe(true) // FRP's own form
    expect(byId.core.dueDate).toBe('2026-05-31') // day 150
    expect(byId.supervision.dueDate).toBe('2026-04-01') // day 90
    expect(byId.termination.status).toBe('when_closing')
  })

  it('marks items overdue and advances repeating cycles from completion', () => {
    const client = addClient('AB', '2026-01-01')
    let plan = computePlan(client, getPlanMarks(client.id), 'ccfrp', '2026-03-20')
    expect(plan.find(i => i.id === 'foundational')?.status).toBe('overdue')

    setPlanMark(client.id, 'foundational', '2026-03-01')
    setPlanMark(client.id, 'cc', '2026-03-01')
    plan = computePlan(client, getPlanMarks(client.id), 'ccfrp', '2026-03-20')
    expect(plan.find(i => i.id === 'foundational')?.status).toBe('done')
    expect(plan.find(i => i.id === 'cc')?.dueDate).toBe('2026-05-30') // +90 days
    expect(plan.find(i => i.id === 'core')?.dueDate).toBe('2026-05-30') // 90 after foundational
  })

  it('auto-detects CC completion from template records', () => {
    const client = addClient('AB', '2026-01-01')
    createRecord('cc_interventions', 'July 2018', 'AB')
    const plan = computePlan(client, {}, 'ccfrp')
    const cc = plan.find(i => i.id === 'cc')!
    expect(cc.lastDone).not.toBeNull()
  })

  it('activates the termination packet when the case closes', () => {
    const client = addClient('AB', '2026-01-01')
    updateClient({ ...client, closed: true, closedDate: '2026-06-01' })
    const closed = { ...client, closed: true, closedDate: '2026-06-01' }
    const plan = computePlan(closed, {}, 'ccfrp', '2026-06-02')
    expect(plan.find(i => i.id === 'termination')?.status).toBe('due_now')
  })

  it('summarizes the next action for the client card', () => {
    const client = addClient('AB', '2026-01-01')
    const overduePlan = computePlan(client, {}, 'ccfrp', '2026-03-20')
    expect(nextAction(overduePlan, 3)).toContain('Overdue')

    const freshPlan = computePlan(client, {}, 'ccfrp', '2026-01-02')
    expect(nextAction(freshPlan, 0)).toBe('Log your first visit')
  })
})
