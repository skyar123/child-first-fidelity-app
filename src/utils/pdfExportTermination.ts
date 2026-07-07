// PDF export for the Termination packet (IV — yellow form).
// Produces a readable summary of everything entered: identification, the seven
// closing questions, closing reasons, the planned/unplanned procedural checklists,
// and the nested Core-Intervention-Fidelity and CPP-objective ratings.

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { TerminationFormData } from '@/types/termination.types'

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number }
  }
}

const YELLOW: [number, number, number] = [202, 138, 4] // amber-600

// Human-readable labels for the closing-form enums.
const LABELS: Record<string, Record<string, string>> = {
  terminationPhase: {
    foundational: 'Foundational',
    core_intervention: 'Core Intervention',
    termination: 'Termination',
    completed_termination: 'Completed Termination',
  },
  terminationInitiator: {
    family: 'Family',
    clinical_team: 'Clinical team',
    mutually_agreed: 'Mutually agreed',
  },
  terminationType: { dropped: 'Dropped', abrupt: 'Abrupt', planned: 'Planned' },
  changeInFunctioning: {
    much_worse: 'Much worse',
    slightly_worse: 'Slightly worse',
    no_change: 'No change',
    slightly_improved: 'Slightly improved',
    much_improved: 'Much improved',
  },
  prognosis: {
    poor: 'Poor',
    fair: 'Fair',
    good: 'Good',
    excellent: 'Excellent',
    unable_to_rate: 'Unable to rate',
  },
}

const VALUE_LABELS: Record<string, string> = {
  no: 'No',
  low: 'Low',
  moderate: 'Moderate',
  significant: 'Significant',
  requires_development: 'Requires development',
  emerging: 'Emerging',
  acquired: 'Acquired',
  yes_not_regular: 'Yes — not regular',
  yes_attended: 'Yes — attended',
  true: 'Yes',
  false: 'No',
}

const val = (v: unknown): string => {
  if (v === null || v === undefined || v === '') return '—'
  const s = String(v)
  return VALUE_LABELS[s] || s
}

// camelCase / snake_case key → "Title Case words"
const humanize = (key: string): string =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, c => c.toUpperCase())

// Flatten a nested rating tree into rows. A "leaf" is a DualResponse
// ({ clinician, careCoordinator }) or any object of scalar values.
function flattenRatings(obj: unknown, path: string[], rows: string[][]): void {
  if (!obj || typeof obj !== 'object') return
  const record = obj as Record<string, unknown>
  const keys = Object.keys(record)
  const isDual = keys.includes('clinician') && keys.includes('careCoordinator')
  if (isDual) {
    const c = record.clinician
    const cc = record.careCoordinator
    if (c != null || cc != null) {
      rows.push([path.map(humanize).join(' › '), val(c), val(cc)])
    }
    return
  }
  const allScalar = keys.every(k => typeof record[k] !== 'object' || record[k] === null)
  if (allScalar) {
    const filled = keys.filter(k => record[k] !== null && record[k] !== '' && record[k] !== undefined)
    if (filled.length > 0) {
      const summary = filled.map(k => `${humanize(k)}: ${val(record[k])}`).join('; ')
      rows.push([path.map(humanize).join(' › '), summary, ''])
    }
    return
  }
  for (const k of keys) flattenRatings(record[k], [...path, k], rows)
}

export function generateTerminationPDF(data: TerminationFormData): void {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  let y = 20

  const sectionHeader = (title: string) => {
    if (y > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage()
      y = 20
    }
    doc.setFillColor(...YELLOW)
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
      headStyles: { fillColor: YELLOW },
      columnStyles: { 0: { cellWidth: head.length >= 3 ? 90 : 120 } },
    })
    y = doc.lastAutoTable.finalY + 8
  }

  const closing = data.closingForm

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Recapitulation & Termination Fidelity', pageWidth / 2, y, { align: 'center' })
  y += 7
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('IV — Termination packet (yellow form)', pageWidth / 2, y, { align: 'center' })
  y += 10

  // Identification
  sectionHeader('IDENTIFICATION')
  table(
    ['Field', 'Value'],
    [
      ['Clinical Team Names', val(closing.clinicalTeamNames)],
      ['Client Initials', val(closing.clientInitials)],
      ['Child First Site', val(closing.childFirstSite)],
      ['Month/Year', val(closing.monthYear)],
      ['CareLogic ID', val(closing.careLogicId)],
    ]
  )

  // Closing questions
  sectionHeader('CPP CLOSING FORM')
  table(
    ['Question', 'Response'],
    [
      ['Termination phase', LABELS.terminationPhase[closing.terminationPhase || ''] || '—'],
      ['Who initiated termination', LABELS.terminationInitiator[closing.terminationInitiator || ''] || '—'],
      ['Type of termination', LABELS.terminationType[closing.terminationType || ''] || '—'],
      ['Change in functioning', LABELS.changeInFunctioning[closing.changeInFunctioning || ''] || '—'],
      ['Prognosis', LABELS.prognosis[closing.prognosis || ''] || '—'],
      ['Transfer to another clinician', val(closing.transferToAnotherClinician)],
    ]
  )

  // Closing reasons (list only the selected ones)
  const reasonRows = Object.entries(closing.closingReasons)
    .filter(([k, v]) => v === true || (typeof v === 'string' && v.trim() && k === 'otherSpecify'))
    .map(([k, v]) => [humanize(k), k === 'otherSpecify' ? String(v) : 'Selected'])
  sectionHeader('REASONS FOR CLOSING')
  table(['Reason', 'Value'], reasonRows)

  // Planned termination
  const plannedRows = Object.entries(data.plannedTermination.items)
    .filter(([k]) => !k.includes('lessThan'))
    .map(([k, v]) => [humanize(k), val(v)])
  sectionHeader('PROCEDURAL FIDELITY — PLANNED TERMINATION')
  if (data.plannedTermination.notDone) {
    doc.setFontSize(9)
    doc.text('Marked: family dropped from treatment (not applicable).', margin, y)
    y += 6
  }
  table(['Item', 'Response'], plannedRows)

  // Unplanned termination
  const unplannedRows = Object.entries(data.unplannedTermination.items).map(([k, v]) => [
    humanize(k),
    val(v),
  ])
  sectionHeader('PROCEDURAL FIDELITY — UNPLANNED TERMINATION')
  table(['Item', 'Response'], unplannedRows)

  // Core Intervention Fidelity ratings
  const cifRows: string[][] = []
  flattenRatings(data.coreInterventionFidelity, [], cifRows)
  sectionHeader('CPP CORE INTERVENTION FIDELITY')
  table(['Item', 'Clinician', 'CC / FRP'], cifRows)

  // CPP objectives
  const objRows: string[][] = []
  flattenRatings(data.cppObjectives, [], objRows)
  sectionHeader('CPP CASE CONCEPTUALIZATION — OBJECTIVES')
  table(['Objective', 'Ratings', ''], objRows)

  // Footer on every page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(130)
    doc.text(
      `Termination · ${closing.clientInitials || 'case'} · exported ${new Date().toLocaleDateString()} · page ${i}/${pageCount}`,
      margin,
      doc.internal.pageSize.getHeight() - 6
    )
    doc.setTextColor(0)
  }

  const date = new Date().toISOString().split('T')[0]
  const name = (closing.clientInitials || 'case').replace(/[^a-zA-Z0-9._-]/g, '_')
  doc.save(`Termination_${name}_${date}.pdf`)
}
