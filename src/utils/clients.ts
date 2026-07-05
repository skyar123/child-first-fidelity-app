// Client registry + per-visit CPP Contact Log.
// The client (initials + admit date) is the anchor of the whole app: the
// care plan, visit log, and fidelity form records all hang off it.

export type PractitionerRole = 'clinician' | 'ccfrp'

export interface Client {
  id: string
  initials: string
  admitDate: string // ISO date — treatment start
  closed: boolean
  closedDate?: string
  createdAt: number
}

// One row of the official CPP Contact Log (see docs/sources/SOURCES.md)
export interface VisitLogEntry {
  id: string
  clientId: string
  date: string
  contactType: string
  minutes: number | null
  sessionStatus: '' | 'show' | 'cancel' | 'no_show'
  reasonNotAttending: string
  whoAttended: string[]
  whereHeld: string
  sessionCounter: number | null
  notes: string
  createdAt: number
}

const CLIENTS_KEY = 'cf_clients'
const VISITS_KEY = 'cf_visit_log'
const PLAN_KEY = 'cf_client_plan'
const ROLE_KEY = 'cf_role'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing ${key}`, error)
  }
}

// ----------------------------------------
// Role
// ----------------------------------------

export function getRole(): PractitionerRole {
  const value = localStorage.getItem(ROLE_KEY)
  return value === 'clinician' ? 'clinician' : 'ccfrp'
}

export function setRole(role: PractitionerRole): void {
  localStorage.setItem(ROLE_KEY, role)
}

// ----------------------------------------
// Clients
// ----------------------------------------

export function listClients(): Client[] {
  return read<Client[]>(CLIENTS_KEY, []).sort((a, b) => {
    if (a.closed !== b.closed) return a.closed ? 1 : -1
    return a.admitDate.localeCompare(b.admitDate)
  })
}

export function getClient(id: string): Client | undefined {
  return read<Client[]>(CLIENTS_KEY, []).find(c => c.id === id)
}

export function addClient(initials: string, admitDate: string): Client {
  const client: Client = {
    id: crypto.randomUUID(),
    initials: initials.trim().toUpperCase(),
    admitDate,
    closed: false,
    createdAt: Date.now(),
  }
  const clients = read<Client[]>(CLIENTS_KEY, [])
  clients.push(client)
  write(CLIENTS_KEY, clients)
  return client
}

export function updateClient(client: Client): void {
  const clients = read<Client[]>(CLIENTS_KEY, [])
  const index = clients.findIndex(c => c.id === client.id)
  if (index >= 0) {
    clients[index] = client
    write(CLIENTS_KEY, clients)
  }
}

export function removeClient(id: string): void {
  write(
    CLIENTS_KEY,
    read<Client[]>(CLIENTS_KEY, []).filter(c => c.id !== id)
  )
  write(
    VISITS_KEY,
    read<VisitLogEntry[]>(VISITS_KEY, []).filter(v => v.clientId !== id)
  )
  const plans = read<Record<string, unknown>>(PLAN_KEY, {})
  delete plans[id]
  write(PLAN_KEY, plans)
}

// ----------------------------------------
// Visit log (CPP Contact Log)
// ----------------------------------------

export function listVisits(clientId: string): VisitLogEntry[] {
  return read<VisitLogEntry[]>(VISITS_KEY, [])
    .filter(v => v.clientId === clientId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
}

export function nextSessionCounter(clientId: string): number {
  const sessions = listVisits(clientId).filter(v => v.sessionCounter !== null)
  return sessions.length === 0
    ? 1
    : Math.max(...sessions.map(v => v.sessionCounter || 0)) + 1
}

export function addVisit(entry: Omit<VisitLogEntry, 'id' | 'createdAt'>): VisitLogEntry {
  const visit: VisitLogEntry = { ...entry, id: crypto.randomUUID(), createdAt: Date.now() }
  const visits = read<VisitLogEntry[]>(VISITS_KEY, [])
  visits.push(visit)
  write(VISITS_KEY, visits)
  return visit
}

export function removeVisit(id: string): void {
  write(
    VISITS_KEY,
    read<VisitLogEntry[]>(VISITS_KEY, []).filter(v => v.id !== id)
  )
}

// ----------------------------------------
// Plan progress (manual completion marks per plan item)
// ----------------------------------------

export interface PlanMark {
  /** ISO date the step was last completed */
  lastDone: string
}

export type ClientPlanMarks = Record<string, PlanMark>

export function getPlanMarks(clientId: string): ClientPlanMarks {
  return read<Record<string, ClientPlanMarks>>(PLAN_KEY, {})[clientId] || {}
}

export function setPlanMark(clientId: string, itemId: string, lastDone: string | null): void {
  const plans = read<Record<string, ClientPlanMarks>>(PLAN_KEY, {})
  const marks = plans[clientId] || {}
  if (lastDone === null) {
    delete marks[itemId]
  } else {
    marks[itemId] = { lastDone }
  }
  plans[clientId] = marks
  write(PLAN_KEY, plans)
}
