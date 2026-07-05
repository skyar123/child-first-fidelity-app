// PDF export of a client's visit log — laid out like the official
// PROCEDURAL FIDELITY: CPP CONTACT LOG (see docs/sources/SOURCES.md).

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Client, VisitLogEntry } from './clients'
import {
  CONTACT_TYPE_OPTIONS,
  SESSION_STATUS_OPTIONS,
  REASON_NOT_ATTENDING_OPTIONS,
  SESSION_LOCATION_OPTIONS,
  WHO_ATTENDED_OPTIONS,
} from '@/data/formSchema'

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number }
  }
}

const label = (opts: { value: string; label: string }[], value: string) =>
  opts.find(o => o.value === value)?.label || value

export function exportVisitLogPdf(client: Client, visits: VisitLogEntry[]): void {
  const doc = new jsPDF({ orientation: 'landscape' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 12
  let y = 16

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('PROCEDURAL FIDELITY: CPP CONTACT LOG', pageWidth / 2, y, { align: 'center' })
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(
    `Client: ${client.initials}    Admitted: ${client.admitDate}${client.closed ? `    Closed: ${client.closedDate || ''}` : ''}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  )
  y += 8

  // Oldest → newest for a readable running log
  const rows = [...visits]
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt)
    .map(v => [
      v.date,
      label(CONTACT_TYPE_OPTIONS, v.contactType),
      v.minutes != null ? String(v.minutes) : '',
      v.sessionStatus ? label(SESSION_STATUS_OPTIONS, v.sessionStatus) : '',
      v.reasonNotAttending ? label(REASON_NOT_ATTENDING_OPTIONS, v.reasonNotAttending) : '',
      v.whoAttended.map(w => label(WHO_ATTENDED_OPTIONS, w)).join(', '),
      v.whereHeld ? label(SESSION_LOCATION_OPTIONS, v.whereHeld) : '',
      v.sessionCounter != null ? String(v.sessionCounter) : '',
      v.notes || '',
    ])

  autoTable(doc, {
    startY: y,
    head: [
      [
        'Date',
        'Contact Type',
        'Min',
        'Status',
        'Reason Not Attending',
        'Who Attended',
        'Where',
        'Session #',
        'Notes',
      ],
    ],
    body: rows.length > 0 ? rows : [['—', 'No visits logged', '', '', '', '', '', '', '']],
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 1.5 },
    headStyles: { fillColor: [55, 65, 81] },
    columnStyles: {
      2: { halign: 'center', cellWidth: 12 },
      7: { halign: 'center', cellWidth: 16 },
    },
  })

  const shown = visits.filter(v => v.sessionStatus === 'show').length
  const totalMin = visits.reduce((sum, v) => sum + (v.minutes || 0), 0)
  const y2 = doc.lastAutoTable.finalY + 6
  doc.setFontSize(9)
  doc.text(
    `Total contacts: ${visits.length}    Sessions attended: ${shown}    Total minutes: ${totalMin}`,
    margin,
    y2
  )

  const date = new Date().toISOString().split('T')[0]
  doc.save(`contact-log_${client.initials || 'client'}_${date}.pdf`)
}
