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
import { getRole, type PractitionerRole } from '@/utils/clients'
import { SectionStepper, SectionStepFooter, type StepSection } from '@/components/layout/SectionStepper'
import { FormShellHeader } from '@/components/layout/FormShellHeader'
import {
  Plus,
  Trash2,
  Check,
  X,
  ClipboardCheck,
  CircleAlert,
  ClipboardList,
  Users,
  Home,
  HeartHandshake,
  Target,
  FileText,
  ListChecks,
  Brain,
  type LucideIcon,
} from 'lucide-react'

// Rotating accent + icon per section so template forms read with the same
// colour and structure as the bespoke forms rather than a wall of black text.
const SECTION_ACCENTS: { badge: string; tint: string; ring: string; icon: LucideIcon }[] = [
  { badge: 'bg-emerald-500', tint: 'from-emerald-50', ring: 'ring-emerald-100', icon: ClipboardList },
  { badge: 'bg-cyan-500', tint: 'from-cyan-50', ring: 'ring-cyan-100', icon: Users },
  { badge: 'bg-violet-500', tint: 'from-violet-50', ring: 'ring-violet-100', icon: Brain },
  { badge: 'bg-pink-500', tint: 'from-pink-50', ring: 'ring-pink-100', icon: HeartHandshake },
  { badge: 'bg-amber-500', tint: 'from-amber-50', ring: 'ring-amber-100', icon: Home },
  { badge: 'bg-blue-500', tint: 'from-blue-50', ring: 'ring-blue-100', icon: Target },
  { badge: 'bg-teal-500', tint: 'from-teal-50', ring: 'ring-teal-100', icon: ListChecks },
  { badge: 'bg-fuchsia-500', tint: 'from-fuchsia-50', ring: 'ring-fuchsia-100', icon: FileText },
]

// ============================================================
// Item renderers
// ============================================================

interface ItemProps {
  item: TemplateItem
  value: ItemValue
  onChange: (next: ItemValue) => void
  dualMarking: boolean
  userRole: PractitionerRole
}

const ROLE_LABEL: Record<PractitionerRole, string> = {
  clinician: 'Clinician',
  ccfrp: 'Care Coordinator / FRP',
}

// Template items use 'ccFrp'; the stored role uses 'ccfrp'.
const roleMatches = (itemRole: 'clinician' | 'ccFrp', userRole: PractitionerRole) =>
  (itemRole === 'clinician' && userRole === 'clinician') ||
  (itemRole === 'ccFrp' && userRole === 'ccfrp')

// Small badge marking whether a role-specific item is the current user's to fill.
function RoleTag({ itemRole, userRole }: { itemRole: 'clinician' | 'ccFrp'; userRole: PractitionerRole }) {
  const mine = roleMatches(itemRole, userRole)
  const who = itemRole === 'clinician' ? 'Clinician' : 'Care Coordinator / FRP'
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
        mine ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {mine ? 'Your item' : `${who} only`}
    </span>
  )
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

function TemplateItemView({ item, value, onChange, dualMarking, userRole }: ItemProps) {
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
            <div className="mb-1.5">
              <RoleTag itemRole={item.role} userRole={userRole} />
            </div>
          )}
          <OptionButtons
            options={item.options || []}
            selected={value.value}
            onSelect={v => onChange({ ...value, value: v })}
          />
        </ItemShell>
      )

    case 'role_select': {
      const clinicianIsYou = userRole === 'clinician'
      const ccFrpIsYou = userRole === 'ccfrp'
      return (
        <ItemShell item={item}>
          <div className="space-y-2">
            <div className={`flex items-start gap-2 rounded-lg p-1.5 -m-1.5 ${clinicianIsYou ? 'bg-indigo-50/70' : ''}`}>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 w-24 flex-shrink-0 mt-1">
                <Check className="w-3.5 h-3.5" /> Clinician{clinicianIsYou && <span className="text-[9px] uppercase tracking-wide">· You</span>}
              </span>
              <OptionButtons
                options={item.options || []}
                selected={value.clinician}
                onSelect={v => onChange({ ...value, clinician: v })}
                accent="indigo"
              />
            </div>
            {dualMarking && (
              <div className={`flex items-start gap-2 rounded-lg p-1.5 -m-1.5 ${ccFrpIsYou ? 'bg-rose-50/70' : ''}`}>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 w-24 flex-shrink-0 mt-1">
                  <X className="w-3.5 h-3.5" /> CC / FRP{ccFrpIsYou && <span className="text-[9px] uppercase tracking-wide">· You</span>}
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
    }

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

function RecordEditor({
  template,
  record,
  onBack,
  onOpenCycles,
}: {
  template: FormTemplate
  record: TemplateRecord
  onBack: () => void
  onOpenCycles: () => void
}) {
  const [current, setCurrent] = useState<TemplateRecord>(record)
  const userRole = getRole()
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

  // Linear steps: Form info → each section → Review
  const steps: StepSection[] = useMemo(() => {
    const headerComplete = template.headerFields.every(f => (current.header[f.id] || '').trim())
    return [
      { id: '__info', label: 'Form info', complete: headerComplete },
      ...template.sections.map(section => {
        const c = sectionCount(section, current)
        return { id: section.id, label: section.title, complete: c.total > 0 && c.done === c.total }
      }),
      { id: '__review', label: 'Review', complete: current.status === 'reviewed' },
    ]
  }, [template, current])

  const [step, setStep] = useState<string>('__info')
  const activeSection = template.sections.find(s => s.id === step)

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
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <FormShellHeader
        title={template.title}
        subtitle={`${template.instrument} · ${current.clientInitials || 'no initials'}`}
        progress={pct}
        onBack={onBack}
        onMenu={onOpenCycles}
        menuLabel="Cycles and saved forms"
        onExportPDF={() => exportTemplateRecordPdf(template, current)}
      />

      <SectionStepper sections={steps} currentId={step} onSelect={setStep} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Step: Form info */}
        {step === '__info' && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex-shrink-0">
                <Users className="w-5 h-5" />
              </span>
              <div className="text-sm text-gray-700">
                You're completing this as <span className="font-semibold">{ROLE_LABEL[userRole]}</span>.
                {template.dualMarking ? (
                  <>
                    {' '}
                    Items tagged <span className="font-medium text-indigo-700">Your item</span> are yours;
                    dual-marked questions show a highlighted <span className="font-medium">· You</span> row.
                    You can change your role on the home screen.
                  </>
                ) : (
                  <> You can change your role on the home screen.</>
                )}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <div className="font-medium mb-1">When completed ({template.copyright})</div>
              {template.whenCompleted}
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Form Information</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {template.headerFields.map(field => (
                  <div key={field.id}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {field.label}
                    </label>
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
                  On the paper form the Clinician marks answers with a{' '}
                  <Check className="w-3 h-3 inline text-indigo-600" /> and the CC/FRP with an{' '}
                  <X className="w-3 h-3 inline text-rose-600" />. Both rows are available on each
                  question for team completion.
                </p>
              )}
            </div>
          </>
        )}

        {/* Step: one section */}
        {activeSection &&
          (() => {
            const idx = template.sections.findIndex(s => s.id === activeSection.id)
            const accent = SECTION_ACCENTS[idx % SECTION_ACCENTS.length]
            const AccentIcon = accent.icon
            const answered = sectionCount(activeSection, current)
            return (
              <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ring-1 ${accent.ring}`}>
                <div className={`p-4 bg-gradient-to-r ${accent.tint} to-white border-b border-gray-100`}>
                  <div className="flex items-start gap-3">
                    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-white flex-shrink-0 ${accent.badge}`}>
                      <AccentIcon className="w-5 h-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <h2 className="font-semibold text-gray-900 flex-1">{activeSection.title}</h2>
                        {answered.total > 0 && (
                          <span className="text-[11px] font-medium text-gray-400 flex-shrink-0 mt-1">
                            {answered.done}/{answered.total}
                          </span>
                        )}
                      </div>
                      {activeSection.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{activeSection.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {activeSection.items.map(item => (
                    <TemplateItemView
                      key={item.id}
                      item={item}
                      value={current.values[item.id] || {}}
                      onChange={v => setItemValue(item.id, v)}
                      dualMarking={template.dualMarking}
                      userRole={userRole}
                    />
                  ))}
                </div>
              </div>
            )
          })()}

        {/* Step: Review */}
        {step === '__review' && (
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
        )}
      </main>

      <SectionStepFooter sections={steps} currentId={step} onSelect={setStep} />
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

// A form can be completed repeatedly (e.g. every 3 months). Rather than a
// separate landing page, cycles live in this on-demand panel so the form opens
// straight into the editor like every other instrument.
function CyclesPanel({
  records,
  activeRecordId,
  onSelect,
  onCreate,
  onDelete,
  onClose,
}: {
  records: TemplateRecord[]
  activeRecordId: string | null
  onSelect: (id: string) => void
  onCreate: () => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="safe-bottom relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-gray-900">Saved forms &amp; cycles</h2>
            <p className="text-xs text-gray-500">
              One record per completion cycle — start a new form each time it&apos;s due.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto divide-y divide-gray-100">
          {records.map(record => {
            const badge = STATUS_BADGES[record.status]
            const isActive = record.id === activeRecordId
            return (
              <div
                key={record.id}
                className={`flex items-center gap-3 p-4 ${isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
              >
                <button type="button" onClick={() => onSelect(record.id)} className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {record.clientInitials || 'No initials'}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                        Open
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Started {new Date(record.createdAt).toLocaleDateString()} · Updated{' '}
                    {new Date(record.updatedAt).toLocaleDateString()}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(record.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                  aria-label="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCreate}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm
                     font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Start a new form
          </button>
        </div>
      </div>
    </div>
  )
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
  const caseId = defaultInitials?.trim().toUpperCase() || undefined
  const [records, setRecords] = useState<TemplateRecord[]>(() => listRecords(templateId, caseId))
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null)
  const [cyclesOpen, setCyclesOpen] = useState(false)

  const refresh = () => setRecords(listRecords(templateId, caseId))

  // Open straight into the most recent record, creating one if there are none,
  // so this form behaves exactly like the other four instruments.
  useEffect(() => {
    if (!template || activeRecordId) return
    const existing = listRecords(templateId, caseId)
    if (existing.length > 0) {
      setRecords(existing)
      setActiveRecordId(existing[0].id)
    } else {
      const record = createRecord(templateId, template.version, defaultInitials || '', caseId)
      setRecords(listRecords(templateId, caseId))
      setActiveRecordId(record.id)
    }
  }, [template, templateId, caseId, defaultInitials, activeRecordId])

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <CircleAlert className="w-5 h-5 mr-2" /> Unknown form template: {templateId}
      </div>
    )
  }

  const activeRecord = activeRecordId ? records.find(r => r.id === activeRecordId) : null

  const handleCreate = () => {
    const record = createRecord(templateId, template.version, defaultInitials || '', caseId)
    setRecords(listRecords(templateId, caseId))
    setActiveRecordId(record.id)
    setCyclesOpen(false)
  }

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this form record? This cannot be undone.')) return
    deleteRecord(id)
    const remaining = listRecords(templateId, caseId)
    setRecords(remaining)
    if (id === activeRecordId) {
      if (remaining.length > 0) {
        setActiveRecordId(remaining[0].id)
      } else {
        const record = createRecord(templateId, template.version, defaultInitials || '', caseId)
        setRecords(listRecords(templateId, caseId))
        setActiveRecordId(record.id)
      }
    }
  }

  if (!activeRecord) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Opening form…
      </div>
    )
  }

  return (
    <>
      <RecordEditor
        key={activeRecord.id}
        template={template}
        record={activeRecord}
        onBack={onBack}
        onOpenCycles={() => {
          refresh()
          setCyclesOpen(true)
        }}
      />
      {cyclesOpen && (
        <CyclesPanel
          records={records}
          activeRecordId={activeRecordId}
          onSelect={id => {
            setActiveRecordId(id)
            setCyclesOpen(false)
          }}
          onCreate={handleCreate}
          onDelete={handleDelete}
          onClose={() => setCyclesOpen(false)}
        />
      )}
    </>
  )
}
