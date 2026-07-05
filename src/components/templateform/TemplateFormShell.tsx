import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormTemplate, TemplateItem, TemplateRecord, ItemValue, RecordStatus } from '@/templates'
import { getTemplate } from '@/templates'
import {
  listRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  setRecordStatus,
} from '@/utils/templateStorage'
import { exportTemplateRecordPdf } from '@/utils/pdfExportTemplate'
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileDown,
  Check,
  X,
  ClipboardCheck,
  CircleAlert,
} from 'lucide-react'

// ============================================================
// Item renderers
// ============================================================

interface ItemProps {
  item: TemplateItem
  value: ItemValue
  onChange: (next: ItemValue) => void
  dualMarking: boolean
}

const ACCENT_CLASSES = {
  indigo: {
    selected: 'bg-indigo-600 text-white border-indigo-600',
    idle: 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400',
  },
  rose: {
    selected: 'bg-rose-600 text-white border-rose-600',
    idle: 'bg-white text-gray-700 border-gray-300 hover:border-rose-400',
  },
} as const

function OptionButtons({
  options,
  selected,
  onSelect,
  accent = 'indigo',
}: {
  options: { value: string; label: string }[]
  selected: string | undefined
  onSelect: (value: string | undefined) => void
  accent?: keyof typeof ACCENT_CLASSES
}) {
  const classes = ACCENT_CLASSES[accent]
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(selected === option.value ? undefined : option.value)}
          className={`px-2.5 py-1 text-xs rounded-lg border transition-all text-left ${
            selected === option.value ? classes.selected : classes.idle
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function ItemShell({ item, children }: { item: TemplateItem; children?: React.ReactNode }) {
  return (
    <div className={`p-4 ${item.isSubItem ? 'pl-10 bg-gray-50/50' : ''}`}>
      <div className="flex items-start gap-2">
        {item.number && (
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded mt-0.5 ${
              item.childFirstOnly ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {item.number}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900">{item.label}</div>
          {item.detail && <p className="text-xs text-gray-500 mt-1">{item.detail}</p>}
          {item.bullets && (
            <ul className="list-disc pl-5 mt-1 space-y-0.5 text-xs text-gray-500">
              {item.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>
      </div>
    </div>
  )
}

function TemplateItemView({ item, value, onChange, dualMarking }: ItemProps) {
  switch (item.type) {
    case 'note':
      return (
        <div className="px-4 py-2 bg-slate-50 text-sm font-medium text-slate-600">{item.label}</div>
      )

    case 'text':
    case 'date':
      return (
        <ItemShell item={item}>
          <input
            type={item.type === 'date' ? 'date' : 'text'}
            value={value.value || ''}
            onChange={e => onChange({ ...value, value: e.target.value })}
            className="w-full max-w-xs px-3 py-1.5 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </ItemShell>
      )

    case 'textarea':
      return (
        <ItemShell item={item}>
          <textarea
            value={value.value || ''}
            onChange={e => onChange({ ...value, value: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
            placeholder="Enter text..."
          />
        </ItemShell>
      )

    case 'checkbox':
      return (
        <ItemShell item={item}>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.checked || false}
                onChange={e => onChange({ ...value, checked: e.target.checked, na: false })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Done</span>
            </label>
            {item.naOption && (
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.na || false}
                  onChange={e => onChange({ ...value, na: e.target.checked, checked: false })}
                  className="h-4 w-4 rounded border-gray-300 text-gray-500 focus:ring-gray-400"
                />
                <span className="text-sm text-gray-500">{item.naLabel || 'N/A'}</span>
              </label>
            )}
            {item.flagLabel && (
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.flag || false}
                  onChange={e => onChange({ ...value, flag: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm text-amber-700">{item.flagLabel}</span>
              </label>
            )}
          </div>
        </ItemShell>
      )

    case 'radio':
      return (
        <ItemShell item={item}>
          {item.role && (
            <div className="text-xs text-gray-400 mb-1">
              {item.role === 'clinician' ? 'Clinician only' : 'CC/FRP only'}
            </div>
          )}
          <OptionButtons
            options={item.options || []}
            selected={value.value}
            onSelect={v => onChange({ ...value, value: v })}
          />
        </ItemShell>
      )

    case 'role_select':
      return (
        <ItemShell item={item}>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 w-24 flex-shrink-0 mt-1">
                <Check className="w-3.5 h-3.5" /> Clinician
              </span>
              <OptionButtons
                options={item.options || []}
                selected={value.clinician}
                onSelect={v => onChange({ ...value, clinician: v })}
                accent="indigo"
              />
            </div>
            {dualMarking && (
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 w-24 flex-shrink-0 mt-1">
                  <X className="w-3.5 h-3.5" /> CC / FRP
                </span>
                <OptionButtons
                  options={item.options || []}
                  selected={value.ccFrp}
                  onSelect={v => onChange({ ...value, ccFrp: v })}
                  accent="rose"
                />
              </div>
            )}
          </div>
        </ItemShell>
      )

    case 'scored_comment':
      return (
        <ItemShell item={item}>
          <div className="space-y-2">
            <OptionButtons
              options={[
                { value: '0', label: '0 — Not present' },
                { value: '1', label: '1 — Early development' },
                { value: '2', label: '2 — In place / good progress' },
                { value: '3', label: '3 — Excellent / accomplished' },
              ]}
              selected={value.value}
              onSelect={v => onChange({ ...value, value: v })}
            />
            <input
              type="text"
              value={value.comment || ''}
              onChange={e => onChange({ ...value, comment: e.target.value })}
              placeholder="Comments (write NA if not applicable to your site)"
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400"
            />
          </div>
        </ItemShell>
      )
  }
}

// ============================================================
// Record editor
// ============================================================

function isAnswered(v: ItemValue | undefined): boolean {
  if (!v) return false
  return Boolean(
    v.checked ||
      v.na ||
      (v.value !== undefined && v.value !== '') ||
      v.clinician !== undefined ||
      v.ccFrp !== undefined
  )
}

function sectionCount(
  section: { items: TemplateItem[] },
  record: TemplateRecord
): { done: number; total: number } {
  let done = 0
  let total = 0
  for (const item of section.items) {
    if (item.type === 'note') continue
    total++
    if (isAnswered(record.values[item.id])) done++
  }
  return { done, total }
}

function answeredCount(template: FormTemplate, record: TemplateRecord): { done: number; total: number } {
  let done = 0
  let total = 0
  for (const section of template.sections) {
    const c = sectionCount(section, record)
    done += c.done
    total += c.total
  }
  return { done, total }
}

/** "Form at a glance": every section with its progress; tap to jump. */
function FormSnapshot({ template, record }: { template: FormTemplate; record: TemplateRecord }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="font-semibold text-gray-900 mb-1">The whole form at a glance</h2>
      <p className="text-xs text-gray-500 mb-3">
        Every part of this form, and how much of each is filled in. Tap a row to jump there.
      </p>
      <div className="grid sm:grid-cols-2 gap-2">
        {template.sections.map(section => {
          const { done, total } = sectionCount(section, record)
          const pct = total > 0 ? Math.round((done / total) * 100) : 0
          const complete = total > 0 && done === total
          return (
            <button
              key={section.id}
              type="button"
              onClick={() =>
                document
                  .getElementById(`section-${section.id}`)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              className="flex items-center gap-2 text-left p-2 rounded-lg hover:bg-gray-50 border border-gray-100"
            >
              <span
                className={`text-xs font-semibold w-10 text-right flex-shrink-0 ${
                  complete ? 'text-emerald-600' : pct > 0 ? 'text-indigo-600' : 'text-gray-300'
                }`}
              >
                {done}/{total}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-700 truncate">{section.title}</div>
                <div className="h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full ${complete ? 'bg-emerald-500' : 'bg-indigo-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RecordEditor({
  template,
  record,
  onBack,
}: {
  template: FormTemplate
  record: TemplateRecord
  onBack: () => void
}) {
  const [current, setCurrent] = useState<TemplateRecord>(record)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced autosave
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      updateRecord(current)
    }, 400)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [current])

  const { done, total } = useMemo(() => answeredCount(template, current), [template, current])
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const setHeader = (id: string, v: string) => {
    setCurrent(c => ({
      ...c,
      header: { ...c.header, [id]: v },
      clientInitials: id === 'clientInitials' ? v.trim().toUpperCase() : c.clientInitials,
      caseId: id === 'clientInitials' && v.trim() ? v.trim().toUpperCase() : c.caseId,
    }))
  }

  const setItemValue = (itemId: string, v: ItemValue) => {
    setCurrent(c => ({ ...c, values: { ...c.values, [itemId]: v } }))
  }

  const setStatus = (status: RecordStatus) => {
    setCurrent(c => ({ ...c, status }))
    setRecordStatus(current.id, status)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Back to records"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-gray-900 truncate">{template.title}</h1>
            <p className="text-xs text-gray-500 truncate">
              {template.instrument} · {template.version} · {current.clientInitials || 'no initials'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-indigo-600">{pct}%</div>
            <div className="text-[10px] text-gray-400">
              {done}/{total}
            </div>
          </div>
          <button
            type="button"
            onClick={() => exportTemplateRecordPdf(template, current)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg
                     bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* When completed */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <div className="font-medium mb-1">When completed ({template.copyright})</div>
          {template.whenCompleted}
        </div>

        {/* Form at a glance */}
        <FormSnapshot template={template} record={current} />

        {/* Header fields */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Form Information</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {template.headerFields.map(field => (
              <div key={field.id}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={current.header[field.id] || ''}
                  onChange={e => setHeader(field.id, e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
          {template.dualMarking && (
            <p className="text-xs text-gray-500 mt-3">
              On the paper form the Clinician marks answers with a <Check className="w-3 h-3 inline text-indigo-600" /> (1st
              column) and the CC/FRP with an <X className="w-3 h-3 inline text-rose-600" /> (2nd column). Both rows are
              available below for team completion.
            </p>
          )}
        </div>

        {/* Sections */}
        {template.sections.map(section => (
          <div
            key={section.id}
            id={`section-${section.id}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-20"
          >
            <div className="p-4 bg-slate-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">{section.title}</h2>
              {section.description && (
                <p className="text-xs text-gray-500 mt-1">{section.description}</p>
              )}
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map(item => (
                <TemplateItemView
                  key={item.id}
                  item={item}
                  value={current.values[item.id] || {}}
                  onChange={v => setItemValue(item.id, v)}
                  dualMarking={template.dualMarking}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Review workflow */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-600" />
            Reflective Supervision Review
          </h2>
          <p className="text-xs text-gray-500">
            Fidelity forms are reviewed with the Clinical Director/Supervisor during reflective
            supervision — they are meant to start a reflective conversation, not to serve as a
            compliance checklist.
          </p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['in_progress', 'In progress'],
                ['ready_for_review', 'Ready for supervision'],
                ['reviewed', 'Reviewed in supervision'],
              ] as [RecordStatus, string][]
            ).map(([status, label]) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatus(status)}
                className={`px-3 py-1.5 text-sm rounded-lg border ${
                  current.status === status
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            value={current.reviewNote || ''}
            onChange={e => setCurrent(c => ({ ...c, reviewNote: e.target.value }))}
            rows={3}
            placeholder="Themes discussed in supervision, divergences between Clinician and CC/FRP ratings, follow-ups..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Record list + shell
// ============================================================

const STATUS_BADGES: Record<RecordStatus, { label: string; className: string }> = {
  in_progress: { label: 'In progress', className: 'bg-amber-100 text-amber-700' },
  ready_for_review: { label: 'Ready for supervision', className: 'bg-blue-100 text-blue-700' },
  reviewed: { label: 'Reviewed', className: 'bg-emerald-100 text-emerald-700' },
}

export function TemplateFormShell({
  templateId,
  onBack,
  defaultInitials,
}: {
  templateId: string
  onBack: () => void
  defaultInitials?: string
}) {
  const template = getTemplate(templateId)
  const [records, setRecords] = useState<TemplateRecord[]>(() => listRecords(templateId))
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null)
  const [newInitials, setNewInitials] = useState(defaultInitials || '')

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <CircleAlert className="w-5 h-5 mr-2" /> Unknown form template: {templateId}
      </div>
    )
  }

  const refresh = () => setRecords(listRecords(templateId))

  const activeRecord = activeRecordId ? records.find(r => r.id === activeRecordId) : null
  if (activeRecord) {
    return (
      <RecordEditor
        template={template}
        record={activeRecord}
        onBack={() => {
          setActiveRecordId(null)
          refresh()
        }}
      />
    )
  }

  const handleCreate = () => {
    const record = createRecord(template.id, template.version, newInitials)
    setNewInitials('')
    refresh()
    setActiveRecordId(record.id)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this form record? This cannot be undone.')) {
      deleteRecord(id)
      refresh()
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Back to form selection"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">{template.title}</h1>
            <p className="text-xs text-gray-500">
              {template.instrument} · {template.version} · {template.copyright}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* New record */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-2">Start a new form</h2>
          <p className="text-xs text-gray-500 mb-3">{template.whenCompleted}</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newInitials}
              onChange={e => setNewInitials(e.target.value)}
              placeholder="Client initials (e.g. AB)"
              maxLength={6}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-48
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg
                       bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              New form
            </button>
          </div>
        </div>

        {/* Existing records */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Saved forms ({records.length})</h2>
            <p className="text-xs text-gray-500">
              One record per completion cycle — start a new form each time the instrument is due
              rather than overwriting an old one.
            </p>
          </div>
          {records.length === 0 ? (
            <div className="p-6 text-sm text-gray-400 text-center">No forms yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {records.map(record => {
                const badge = STATUS_BADGES[record.status]
                return (
                  <div key={record.id} className="flex items-center gap-3 p-4 hover:bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setActiveRecordId(record.id)}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {record.clientInitials || 'No initials'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Started {new Date(record.createdAt).toLocaleDateString()} · Updated{' '}
                        {new Date(record.updatedAt).toLocaleDateString()} · {record.templateVersion}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(record.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                      aria-label="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
