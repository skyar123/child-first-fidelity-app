// PDF export for the Core Intervention packet (II — purple form).
// Summarises everything entered: identification, contact log, "introducing the
// child" checklist, the strand challenge/capacity ratings (Clinician + CC/FRP),
// CPP objectives, and notes.

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { CoreInterventionFormData } from '@/data/coreInterventionItems'
import {
  REFLECTIVE_PRACTICE_CHALLENGES,
  REFLECTIVE_CAPACITY_ITEMS,
  EMOTIONAL_PROCESS_CHALLENGES,
  DYADIC_CHALLENGES,
  TRAUMA_CHALLENGES,
  PROCEDURAL_CHALLENGES,
  PROCEDURAL_CAPACITY_ITEMS_NEW,
  INTRODUCING_CHILD_ITEMS,
  CPP_OBJECTIVES,
} from '@/data/coreInterventionItems'

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number }
  }
}

const PURPLE: [number, number, number] = [124, 58, 237] // violet-600

const VALUE_LABELS: Record<string, string> = {
  no: 'No',
  low: 'Low',
  moderate: 'Moderate',
  significant: 'Significant',
  requires_development: 'Requires development',
  emerging: 'Emerging',
  acquired: 'Acquired',
  yes_irregular: 'Yes — irregular',
  yes_attended: 'Yes — attended',
  not_needed: 'Not needed',
}

// Build an id → readable label map from the item constants so flattened rows
// show the real item wording rather than a raw key.
const LABEL_MAP: Record<string, string> = {}
for (const list of [
  REFLECTIVE_PRACTICE_CHALLENGES,
  REFLECTIVE_CAPACITY_ITEMS,
  EMOTIONAL_PROCESS_CHALLENGES,
  DYADIC_CHALLENGES,
  TRAUMA_CHALLENGES,
  PROCEDURAL_CHALLENGES,
  PROCEDURAL_CAPACITY_ITEMS_NEW,
] as { id: string; text?: string }[][]) {
  for (const item of list) if (item.id && item.text) LABEL_MAP[item.id] = item.text
}
for (const item of INTRODUCING_CHILD_ITEMS) LABEL_MAP[item.id] = item.title
for (const obj of CPP_OBJECTIVES as { id: string; text?: string; title?: string }[]) {
  LABEL_MAP[obj.id] = obj.text || obj.title || obj.id
}

const humanize = (key: string): string =>
  LABEL_MAP[key] ||
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, c => c.toUpperCase())

const val = (v: unknown): string => {
  if (v === null || v === undefined || v === '') return '—'
  const s = String(v)
  return VALUE_LABELS[s] || s
}

// Flatten a strand's sparse rating maps. Role-based leaves have clinician/ccFrp.
function flattenRatings(obj: unknown, path: string[], rows: string[][]): void {
  if (!obj || typeof obj !== 'object') return
  const record = obj as Record<string, unknown>
  const keys = Object.keys(record)
  if (keys.includes('clinician') && keys.includes('ccFrp')) {
    if (record.clinician != null || record.ccFrp != null) {
      rows.push([path.map(humanize).join(' › '), val(record.clinician), val(record.ccFrp)])
    }
    return
  }
  const allScalar = keys.every(k => typeof record[k] !== 'object' || record[k] === null)
  if (allScalar) {
    const filled = keys.filter(k => record[k] !== null && record[k] !== '' && record[k] !== undefined)
    if (filled.length > 0) {
      rows.push([
        path.map(humanize).join(' › '),
        filled.map(k => `${humanize(k)}: ${val(record[k])}`).join('; '),
        '',
      ])
    }
    return
  }
  for (const k of keys) flattenRatings(record[k], [...path, k], rows)
}

export function generateCorePDF(data: CoreInterventionFormData): void {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  let y = 20

  const sectionHeader = (title: string) => {
    if (y > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage()
      y = 20
    }
    doc.setFillColor(...PURPLE)
    doc.rect(margin, y, pageWidth - margin * 2, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin + 3, y + 5.5)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    y += 12
  }

  const table = (head: string[], body: string[][]) => {
    autoTable(doc, {
      startY: y,
      head: [head],
      body: body.length > 0 ? body : [['—', 'Nothing recorded', ''].slice(0, head.length)],
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 1.5 },
      headStyles: { fillColor: PURPLE },
      columnStyles: { 0: { cellWidth: head.length >= 3 ? 90 : 120 } },
    })
    y = doc.lastAutoTable.finalY + 8
  }

  const id = data.identification

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Core Intervention Phase Fidelity', pageWidth / 2, y, { align: 'center' })
  y += 7
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('II — Core Intervention (purple form)', pageWidth / 2, y, { align: 'center' })
  y += 10

  sectionHeader('IDENTIFICATION')
  table(
    ['Field', 'Value'],
    [
      ['Clinical Team Names', val(id.clinicalTeamNames)],
      ['Client Initials', val(id.clientInitials)],
      ['Child First Site', val(id.childFirstSite)],
      ['Month/Year', val(id.monthYear)],
      ['CareLogic ID', val(id.careLogicId)],
      ['Date Core Phase Began', val(id.dateCorePhaseBegan)],
    ]
  )

  // Contact log
  const logRows = (data.contactLog || [])
    .filter(e => e.date || e.contactType)
    .map(e => [val(e.date), val(e.contactType), val(e.minutes), val(e.sessionStatus), val(e.location)])
  sectionHeader('CONTACT LOG')
  table(['Date', 'Type', 'Min', 'Status', 'Where'], logRows)

  // Introducing the child
  const introRows = Object.entries(data.introducingChild?.items || {}).map(([k, v]) => [
    humanize(k),
    val(v),
  ])
  sectionHeader('INTRODUCING THE CHILD TO CPP')
  if (data.introducingChild?.notDone) {
    doc.setFontSize(9)
    doc.text('Marked: not done this cycle.', margin, y)
    y += 6
  }
  table(['Item', 'Response'], introRows)

  // Strands
  const strands: [string, unknown][] = [
    ['REFLECTIVE PRACTICE', data.reflectivePractice],
    ['EMOTIONAL PROCESS', data.emotionalProcess],
    ['DYADIC-RELATIONAL', data.dyadicRelational],
    ['TRAUMA FRAMEWORK', data.traumaFramework],
    ['PROCEDURAL FIDELITY', data.proceduralFidelity],
  ]
  for (const [title, strand] of strands) {
    const rows: string[][] = []
    const s = strand as { notes?: string } | undefined
    flattenRatings({ ...(s as object), notes: undefined }, [], rows)
    sectionHeader(title)
    table(['Item', 'Clinician', 'CC / FRP'], rows)
    if (s?.notes && s.notes.trim()) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      const lines = doc.splitTextToSize(`Notes: ${s.notes}`, pageWidth - margin * 2)
      if (y + lines.length * 4 > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage()
        y = 20
      }
      doc.text(lines, margin, y)
      doc.setFont('helvetica', 'normal')
      y += lines.length * 4 + 6
    }
  }

  // CPP objectives
  const objRows: string[][] = []
  flattenRatings(data.cppObjectives, [], objRows)
  sectionHeader('CPP OBJECTIVES — CLINICAL FOCUS')
  table(['Objective', 'Clinician', 'CC / FRP'], objRows)

  // General notes
  if (data.notes && data.notes.trim()) {
    sectionHeader('ADDITIONAL NOTES')
    doc.setFontSize(9)
    const lines = doc.splitTextToSize(data.notes, pageWidth - margin * 2)
    doc.text(lines, margin, y)
    y += lines.length * 4
  }

  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(130)
    doc.text(
      `Core Intervention · ${id.clientInitials || 'case'} · exported ${new Date().toLocaleDateString()} · page ${i}/${pageCount}`,
      margin,
      doc.internal.pageSize.getHeight() - 6
    )
    doc.setTextColor(0)
  }

  const date = new Date().toISOString().split('T')[0]
  const name = (id.clientInitials || 'case').replace(/[^a-zA-Z0-9._-]/g, '_')
  doc.save(`Core_Intervention_${name}_${date}.pdf`)
}
