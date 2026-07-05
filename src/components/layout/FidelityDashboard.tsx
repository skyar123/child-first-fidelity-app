import { useMemo, useRef, useState } from 'react'
import { computeDashboard, REQUIRED_FIDELITY_CASES } from '@/utils/cadence'
import { downloadBackup, restoreBackup } from '@/utils/backup'
import { CalendarClock, Download, Upload, FolderHeart, CircleAlert, CircleCheck } from 'lucide-react'

export function FidelityDashboard() {
  const [refreshKey, setRefreshKey] = useState(0)
  const dashboard = useMemo(() => computeDashboard(), [refreshKey])
  const fileInput = useRef<HTMLInputElement>(null)
  const [importMessage, setImportMessage] = useState<string | null>(null)

  const handleImport = async (file: File) => {
    const text = await file.text()
    const restored = restoreBackup(text)
    if (restored < 0) {
      setImportMessage('That file is not a valid Child First Fidelity backup.')
    } else {
      setImportMessage(`Restored ${restored} data set(s) from backup.`)
      setRefreshKey(k => k + 1)
    }
  }

  if (dashboard.cases.length === 0) {
    return (
      <div className="mb-10 bg-white/60 backdrop-blur rounded-2xl border border-white/60 p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <FolderHeart className="w-6 h-6 text-indigo-500" />
            <div>
              <h2 className="font-bold text-gray-800">Fidelity Cases</h2>
              <p className="text-sm text-gray-600">
                Start a Foundational (Post-Rostering) form to open your first fidelity case. Each
                practitioner maintains {REQUIRED_FIDELITY_CASES} fidelity cases at all times.
              </p>
            </div>
          </div>
          <BackupButtons onExport={downloadBackup} onImportClick={() => fileInput.current?.click()} />
        </div>
        <ImportInput fileInput={fileInput} onImport={handleImport} message={importMessage} />
      </div>
    )
  }

  return (
    <div className="mb-10 bg-white/60 backdrop-blur rounded-2xl border border-white/60 p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-3">
          <FolderHeart className="w-6 h-6 text-indigo-500" />
          <div>
            <h2 className="font-bold text-gray-800">Fidelity Cases</h2>
            <p className="text-sm text-gray-600">
              {dashboard.openCases.length} open ·{' '}
              {dashboard.meetsTwoCaseRule ? (
                <span className="text-emerald-700">
                  meets the {REQUIRED_FIDELITY_CASES}-case rule
                </span>
              ) : (
                <span className="text-amber-700">
                  below the {REQUIRED_FIDELITY_CASES}-case rule — open a new fidelity case
                </span>
              )}
            </p>
          </div>
        </div>
        <BackupButtons onExport={downloadBackup} onImportClick={() => fileInput.current?.click()} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {dashboard.cases.map(c => (
          <div
            key={c.caseId}
            className={`rounded-xl border p-3 bg-white/80 ${
              c.hasTermination
                ? 'border-gray-200 opacity-70'
                : c.overdue
                  ? 'border-red-300'
                  : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">{c.clientInitials}</span>
              {c.hasTermination ? (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  Closed
                </span>
              ) : c.overdue ? (
                <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  <CircleAlert className="w-3 h-3" /> Overdue
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  <CircleCheck className="w-3 h-3" /> Open
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {c.records.length} form{c.records.length === 1 ? '' : 's'} on file
              {!c.hasFoundational && !c.hasTermination && ' · no A&E form yet'}
            </div>
            {!c.hasTermination && c.nextDueAt !== null && (
              <div
                className={`mt-2 inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg ${
                  c.overdue ? 'bg-red-50 text-red-700' : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                <CalendarClock className="w-3.5 h-3.5" />
                {c.overdue
                  ? `90-day forms were due ${new Date(c.nextDueAt).toLocaleDateString()}`
                  : `Next 90-day forms due ${new Date(c.nextDueAt).toLocaleDateString()} (${c.daysUntilDue}d)`}
              </div>
            )}
          </div>
        ))}
      </div>
      <ImportInput fileInput={fileInput} onImport={handleImport} message={importMessage} />
    </div>
  )
}

function BackupButtons({
  onExport,
  onImportClick,
}: {
  onExport: () => void
  onImportClick: () => void
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onExport}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/80 border border-gray-200 text-gray-700 hover:border-indigo-300"
      >
        <Download className="w-3.5 h-3.5" /> Backup
      </button>
      <button
        type="button"
        onClick={onImportClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/80 border border-gray-200 text-gray-700 hover:border-indigo-300"
      >
        <Upload className="w-3.5 h-3.5" /> Restore
      </button>
    </div>
  )
}

function ImportInput({
  fileInput,
  onImport,
  message,
}: {
  fileInput: React.RefObject<HTMLInputElement>
  onImport: (file: File) => void
  message: string | null
}) {
  return (
    <>
      <input
        ref={fileInput}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onImport(file)
          e.target.value = ''
        }}
      />
      {message && <p className="text-xs text-gray-600 mt-3">{message}</p>}
    </>
  )
}
