import { useMemo, useState } from 'react'
import {
  getClient,
  updateClient,
  removeClient,
  getRole,
  getPlanMarks,
  setPlanMark,
  listVisits,
  addVisit,
  removeVisit,
  nextSessionCounter,
  type VisitLogEntry,
} from '@/utils/clients'
import { computePlan, type PlanItem, type PlanItemStatus } from '@/utils/carePlan'
import {
  CONTACT_TYPE_OPTIONS,
  SESSION_STATUS_OPTIONS,
  REASON_NOT_ATTENDING_OPTIONS,
  SESSION_LOCATION_OPTIONS,
  WHO_ATTENDED_OPTIONS,
} from '@/data/formSchema'
import type { FormType } from '@/types/app.types'
import { exportVisitLogPdf } from '@/utils/pdfExportVisitLog'
import {
  ArrowLeft,
  NotebookPen,
  CircleCheck,
  CircleAlert,
  CalendarClock,
  Clock,
  ChevronRight,
  Trash2,
  Undo2,
  Archive,
  FileDown,
} from 'lucide-react'

// ------------------------------------------------------------
// Plan item card
// ------------------------------------------------------------

const STATUS_STYLE: Record<PlanItemStatus, { badge: string; label: string }> = {
  done: { badge: 'bg-emerald-100 text-emerald-700', label: 'Done' },
  due_now: { badge: 'bg-amber-100 text-amber-800', label: 'Due now' },
  overdue: { badge: 'bg-red-100 text-red-700', label: 'Overdue' },
  upcoming: { badge: 'bg-slate-100 text-slate-600', label: 'Upcoming' },
  when_closing: { badge: 'bg-slate-100 text-slate-500', label: 'When case closes' },
}

function PlanItemCard({
  item,
  onOpenForm,
  onMarkDone,
  onUndo,
}: {
  item: PlanItem
  onOpenForm: (formType: FormType) => void
  onMarkDone: () => void
  onUndo: () => void
}) {
  const style = STATUS_STYLE[item.status]
  return (
    <div
      className={`bg-white rounded-xl border p-4 ${
        item.status === 'overdue'
          ? 'border-red-300'
          : item.status === 'due_now'
            ? 'border-amber-300'
            : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            {item.yours && (
              <span className="text-[10px] font-semibold uppercase tracking-wide bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded">
                Your form
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${style.badge}`}>{style.label}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{item.what}</p>
          <p className="text-sm text-gray-800 mt-1.5 font-medium">{item.action}</p>
          {item.lastDone && item.repeats && (
            <p className="text-xs text-gray-400 mt-1">Last completed {item.lastDone}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          type="button"
          onClick={() => onOpenForm(item.formType)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Open form <ChevronRight className="w-4 h-4" />
        </button>
        {item.status !== 'done' && item.status !== 'when_closing' && (
          <button
            type="button"
            onClick={onMarkDone}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:border-emerald-400 hover:text-emerald-700"
          >
            <CircleCheck className="w-4 h-4" /> Mark completed today
          </button>
        )}
        {item.lastDone && (
          <button
            type="button"
            onClick={onUndo}
            title="Clear the completion mark"
            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs rounded-lg text-gray-400 hover:text-gray-600"
          >
            <Undo2 className="w-3.5 h-3.5" /> Undo
          </button>
        )}
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// Quick visit log
// ------------------------------------------------------------

function VisitQuickForm({
  clientId,
  onSaved,
  onCancel,
}: {
  clientId: string
  onSaved: () => void
  onCancel: () => void
}) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [contactType, setContactType] = useState('dyadic_treatment')
  const [minutes, setMinutes] = useState('')
  const [sessionStatus, setSessionStatus] = useState<'show' | 'cancel' | 'no_show'>('show')
  const [reason, setReason] = useState('')
  const [who, setWho] = useState<string[]>(['target_child', 'caregiver_1'])
  const [where, setWhere] = useState('home')
  const [notes, setNotes] = useState('')

  const isSession = ['assessment', 'care_coordination', 'feedback', 'dyadic_treatment', 'individual_caregiver', 'individual_child'].includes(contactType)

  const save = () => {
    addVisit({
      clientId,
      date,
      contactType,
      minutes: minutes ? Number(minutes) : null,
      sessionStatus: isSession ? sessionStatus : '',
      reasonNotAttending: sessionStatus === 'show' ? '' : reason,
      whoAttended: isSession && sessionStatus === 'show' ? who : [],
      whereHeld: isSession ? where : '',
      sessionCounter: isSession && sessionStatus === 'show' ? nextSessionCounter(clientId) : null,
      notes,
    })
    onSaved()
  }

  const toggleWho = (value: string) =>
    setWho(w => (w.includes(value) ? w.filter(x => x !== value) : [...w, value]))

  const selectClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500'

  return (
    <div className="bg-white rounded-xl border border-cyan-200 p-4 space-y-3">
      <h3 className="font-semibold text-gray-900">Log a visit</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={selectClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Contact type</label>
          <select value={contactType} onChange={e => setContactType(e.target.value)} className={selectClass}>
            {CONTACT_TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Minutes</label>
          <input
            type="number"
            inputMode="numeric"
            value={minutes}
            onChange={e => setMinutes(e.target.value)}
            placeholder="60"
            className={selectClass}
          />
        </div>
      </div>

      {isSession && (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Session status</label>
            <div className="flex gap-2">
              {SESSION_STATUS_OPTIONS.map(o => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setSessionStatus(o.value as typeof sessionStatus)}
                  className={`px-3 py-1.5 text-sm rounded-lg border ${
                    sessionStatus === o.value
                      ? 'bg-cyan-600 text-white border-cyan-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {sessionStatus !== 'show' && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Reason for not attending
              </label>
              <select value={reason} onChange={e => setReason(e.target.value)} className={selectClass}>
                <option value="">Select...</option>
                {REASON_NOT_ATTENDING_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {sessionStatus === 'show' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Who attended (tap all that apply)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {WHO_ATTENDED_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => toggleWho(o.value)}
                      className={`px-2.5 py-1 text-xs rounded-lg border ${
                        who.includes(o.value)
                          ? 'bg-cyan-600 text-white border-cyan-600'
                          : 'bg-white text-gray-600 border-gray-300'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Where held</label>
                <div className="flex gap-2">
                  {SESSION_LOCATION_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setWhere(o.value)}
                      className={`px-3 py-1.5 text-sm rounded-lg border ${
                        where === o.value
                          ? 'bg-cyan-600 text-white border-cyan-600'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Notes <span className="text-gray-400 font-normal">(optional — no names or details that identify the family)</span>
        </label>
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="e.g. collateral: daycare teacher"
          className={selectClass}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          className="px-4 py-2 rounded-lg text-sm bg-cyan-600 text-white hover:bg-cyan-700"
        >
          Save visit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function VisitRow({ visit, onDelete }: { visit: VisitLogEntry; onDelete: () => void }) {
  const typeLabel = CONTACT_TYPE_OPTIONS.find(o => o.value === visit.contactType)?.label || visit.contactType
  const statusLabel = SESSION_STATUS_OPTIONS.find(o => o.value === visit.sessionStatus)?.label
  return (
    <div className="flex items-center gap-3 py-2.5 px-3">
      <div className="flex-1 min-w-0 text-sm">
        <span className="font-medium text-gray-800">{visit.date}</span>
        <span className="text-gray-500"> · {typeLabel}</span>
        {statusLabel && (
          <span
            className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
              visit.sessionStatus === 'show'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {statusLabel}
          </span>
        )}
        {visit.sessionCounter !== null && (
          <span className="ml-2 text-xs text-gray-400">session #{visit.sessionCounter}</span>
        )}
        {visit.minutes !== null && <span className="ml-2 text-xs text-gray-400">{visit.minutes} min</span>}
        {visit.notes && <div className="text-xs text-gray-500 truncate">{visit.notes}</div>}
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 rounded text-gray-300 hover:text-red-500"
        aria-label="Delete visit"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

// ------------------------------------------------------------
// Client detail page
// ------------------------------------------------------------

export function ClientDetail({
  clientId,
  onBack,
  onOpenForm,
}: {
  clientId: string
  onBack: () => void
  onOpenForm: (formType: FormType, clientInitials: string) => void
}) {
  const [refresh, setRefresh] = useState(0)
  const client = useMemo(() => getClient(clientId), [clientId, refresh])
  const [logging, setLogging] = useState(false)

  const role = getRole()
  const plan = useMemo(
    () => (client ? computePlan(client, getPlanMarks(client.id), role) : []),
    [client, role, refresh]
  )
  const visits = useMemo(() => listVisits(clientId), [clientId, refresh])

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Client not found.
        <button type="button" onClick={onBack} className="ml-2 text-indigo-600 underline">
          Back
        </button>
      </div>
    )
  }

  const bump = () => setRefresh(r => r + 1)
  const daysIn = Math.max(
    0,
    Math.round((Date.now() - new Date(client.admitDate + 'T12:00:00').getTime()) / 86400000)
  )
  const overdueCount = plan.filter(i => i.status === 'overdue').length

  const toggleClosed = () => {
    updateClient({
      ...client,
      closed: !client.closed,
      closedDate: !client.closed ? new Date().toISOString().split('T')[0] : undefined,
    })
    bump()
  }

  const handleRemove = () => {
    if (
      window.confirm(
        `Remove ${client.initials} and their visit log? Form records are kept. This cannot be undone.`
      )
    ) {
      removeClient(client.id)
      onBack()
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Back to clients"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            {client.initials}
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">{client.initials}</h1>
            <p className="text-xs text-gray-500">
              Admitted {client.admitDate} · day {daysIn} of treatment
              {client.closed && ` · closed ${client.closedDate}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLogging(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-cyan-600 text-white hover:bg-cyan-700"
          >
            <NotebookPen className="w-4 h-4" /> Log a visit
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Status line */}
        <div
          className={`rounded-xl p-4 text-sm ${
            client.closed
              ? 'bg-gray-100 text-gray-600'
              : overdueCount > 0
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          {client.closed ? (
            <>
              <Archive className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              This case is closed. Make sure the Termination packet is completed.
            </>
          ) : overdueCount > 0 ? (
            <>
              <CircleAlert className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              {overdueCount} form{overdueCount > 1 ? 's are' : ' is'} past due — open the red items
              below.
            </>
          ) : (
            <>
              <CircleCheck className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              You're on track. Log a visit after each session; the cards below tell you what's
              next and when.
            </>
          )}
        </div>

        {/* Visit log */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-600" /> Visit log
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                This is the CPP Contact Log — one quick entry after every visit or contact. That's
                all the "visit notes" these forms need.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {visits.length > 0 && (
                <button
                  type="button"
                  onClick={() => exportVisitLogPdf(client, visits)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 text-gray-700 hover:border-cyan-400 hover:text-cyan-700"
                >
                  <FileDown className="w-3.5 h-3.5" /> PDF
                </button>
              )}
              <span className="text-sm font-semibold text-cyan-700">{visits.length}</span>
            </div>
          </div>
          {logging && (
            <div className="p-3">
              <VisitQuickForm
                clientId={client.id}
                onSaved={() => {
                  setLogging(false)
                  bump()
                }}
                onCancel={() => setLogging(false)}
              />
            </div>
          )}
          {visits.length === 0 && !logging ? (
            <div className="p-5 text-sm text-gray-400 text-center">
              No visits logged yet — tap "Log a visit" after your first session.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
              {visits.map(v => (
                <VisitRow
                  key={v.id}
                  visit={v}
                  onDelete={() => {
                    removeVisit(v.id)
                    bump()
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* The plan */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Your fidelity plan for {client.initials}</h2>
          </div>
          <div className="space-y-3">
            {plan.map(item => (
              <PlanItemCard
                key={item.id}
                item={item}
                onOpenForm={formType => onOpenForm(formType, client.initials)}
                onMarkDone={() => {
                  setPlanMark(client.id, item.id, new Date().toISOString().split('T')[0])
                  bump()
                }}
                onUndo={() => {
                  setPlanMark(client.id, item.id, null)
                  bump()
                }}
              />
            ))}
          </div>
        </div>

        {/* Case actions */}
        <div className="flex flex-wrap gap-2 justify-between items-center pt-2">
          <button
            type="button"
            onClick={toggleClosed}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-white"
          >
            <Archive className="w-4 h-4" />
            {client.closed ? 'Reopen case' : 'Close case (start termination)'}
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove client
          </button>
        </div>
      </div>
    </div>
  )
}
