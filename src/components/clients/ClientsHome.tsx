import { useMemo, useRef, useState } from 'react'
import {
  listClients,
  addClient,
  getRole,
  setRole,
  listVisits,
  getPlanMarks,
  type Client,
  type PractitionerRole,
} from '@/utils/clients'
import { computePlan, nextAction } from '@/utils/carePlan'
import { downloadBackup, restoreBackup } from '@/utils/backup'
import {
  Plus,
  ChevronRight,
  Library,
  Download,
  Upload,
  CircleAlert,
  UserRound,
} from 'lucide-react'
import { BrandMark } from '@/components/layout/BrandMark'

function ClientCard({ client, onOpen }: { client: Client; onOpen: () => void }) {
  const role = getRole()
  const plan = useMemo(
    () => computePlan(client, getPlanMarks(client.id), role),
    [client, role]
  )
  const visits = listVisits(client.id)
  const urgent = plan.some(i => i.status === 'overdue')
  const action = client.closed ? 'Case closed' : nextAction(plan, visits.length)
  const daysIn = Math.max(
    0,
    Math.round((Date.now() - new Date(client.admitDate + 'T12:00:00').getTime()) / 86400000)
  )

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`w-full text-left p-5 rounded-2xl border bg-white/80 backdrop-blur transition-all
        hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] ${
          client.closed
            ? 'border-gray-200 opacity-60'
            : urgent
              ? 'border-red-300'
              : 'border-white/70'
        }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold ${
            client.closed ? 'bg-gray-100 text-gray-500' : 'bg-indigo-100 text-indigo-700'
          }`}
        >
          {client.initials || <UserRound className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">{client.initials}</span>
            <span className="text-xs text-gray-500">
              admitted {client.admitDate} · day {daysIn}
            </span>
          </div>
          <div
            className={`text-sm mt-0.5 ${
              urgent ? 'text-red-700 font-medium' : 'text-gray-600'
            }`}
          >
            {urgent && <CircleAlert className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />}
            {action}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {visits.length} visit{visits.length === 1 ? '' : 's'} logged
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </button>
  )
}

export function ClientsHome({
  onOpenClient,
  onOpenFormsLibrary,
}: {
  onOpenClient: (clientId: string) => void
  onOpenFormsLibrary: () => void
}) {
  const [clients, setClients] = useState<Client[]>(() => listClients())
  const [adding, setAdding] = useState(false)
  const [initials, setInitials] = useState('')
  const [admitDate, setAdmitDate] = useState('')
  const [role, setRoleState] = useState<PractitionerRole>(() => getRole())
  const fileInput = useRef<HTMLInputElement>(null)
  const [importMessage, setImportMessage] = useState<string | null>(null)

  const openClients = clients.filter(c => !c.closed)

  const handleAdd = () => {
    if (!initials.trim() || !admitDate) return
    const client = addClient(initials, admitDate)
    setClients(listClients())
    setAdding(false)
    setInitials('')
    setAdmitDate('')
    onOpenClient(client.id)
  }

  const handleRole = (r: PractitionerRole) => {
    setRole(r)
    setRoleState(r)
  }

  return (
    <div className="min-h-screen animated-gradient-bg p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <BrandMark size={64} className="mb-4" />
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">Child First</span>
            <span className="text-gray-800"> Fidelity</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Pick a client to see exactly what to do and when. Log a visit after every session.
          </p>
          {/* Role toggle */}
          <div className="inline-flex items-center gap-1 mt-4 bg-white/60 backdrop-blur rounded-full p-1 border border-white/60">
            <span className="text-xs text-gray-500 pl-2">I am a:</span>
            {(
              [
                ['ccfrp', 'Care Coordinator / FRP'],
                ['clinician', 'Clinician'],
              ] as [PractitionerRole, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRole(value)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  role === value
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-white/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-case reminder */}
        {openClients.length > 0 && openClients.length < 2 && (
          <div className="mb-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
            You have {openClients.length} open fidelity case — Child First expects{' '}
            <strong>2 at all times</strong>. When you're ready, add your second client.
          </div>
        )}

        {/* Client list */}
        <div className="space-y-3 mb-4">
          {clients.length === 0 && (
            <div className="text-center bg-white/60 backdrop-blur rounded-2xl border border-white/60 p-8">
              <p className="text-gray-700 font-medium mb-1">No clients yet</p>
              <p className="text-sm text-gray-500">
                Add a client with their admit date, and the app will lay out every form and due
                date for you.
              </p>
            </div>
          )}
          {clients.map(client => (
            <ClientCard key={client.id} client={client} onOpen={() => onOpenClient(client.id)} />
          ))}
        </div>

        {/* Add client */}
        {adding ? (
          <div className="bg-white/80 backdrop-blur rounded-2xl border border-white/70 p-5 mb-4">
            <h2 className="font-semibold text-gray-800 mb-3">New client</h2>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Client initials
                </label>
                <input
                  autoFocus
                  type="text"
                  value={initials}
                  onChange={e => setInitials(e.target.value)}
                  maxLength={6}
                  placeholder="AB"
                  className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Admit date (first day of treatment)
                </label>
                <input
                  type="date"
                  value={admitDate}
                  onChange={e => setAdmitDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!initials.trim() || !admitDate}
                className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
              >
                Add client
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Initials only — never full names. Everything stays on this device.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-indigo-300 text-indigo-600 hover:bg-white/60 transition-all mb-4"
          >
            <Plus className="w-5 h-5" />
            Add client
          </button>
        )}

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            type="button"
            onClick={onOpenFormsLibrary}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full bg-white/60 backdrop-blur border border-white/60 text-gray-700 hover:bg-white/90"
          >
            <Library className="w-4 h-4" /> All forms
          </button>
          <button
            type="button"
            onClick={downloadBackup}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full bg-white/60 backdrop-blur border border-white/60 text-gray-700 hover:bg-white/90"
          >
            <Download className="w-4 h-4" /> Backup
          </button>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full bg-white/60 backdrop-blur border border-white/60 text-gray-700 hover:bg-white/90"
          >
            <Upload className="w-4 h-4" /> Restore
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async e => {
              const file = e.target.files?.[0]
              if (file) {
                const restored = restoreBackup(await file.text())
                setImportMessage(
                  restored < 0 ? 'Not a valid backup file.' : `Restored ${restored} data set(s).`
                )
                setClients(listClients())
              }
              e.target.value = ''
            }}
          />
        </div>
        {importMessage && (
          <p className="text-center text-xs text-gray-600 mt-2">{importMessage}</p>
        )}
        <p className="text-center text-xs text-gray-400 mt-4">
          These forms start reflective conversations in supervision — they're not a report card.
        </p>
      </div>
    </div>
  )
}
