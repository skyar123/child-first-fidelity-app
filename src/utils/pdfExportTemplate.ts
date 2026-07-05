// Generic PDF export for template-driven forms.
// Lays the record out to mirror the official document: header block, then one
// table per section with the item wording and the recorded answers
// (Clinician ✓ column and CC/FRP ✗ column for dual-marked instruments).

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { FormTemplate, TemplateItem, TemplateRecord, ItemValue } from '@/templates/types'

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number }
  }
}

function optionLabel(item: TemplateItem, value: string | undefined): string {
  if (!value) return ''
  const opt = item.options?.find(o => o.value === value)
  return opt ? opt.label : value
}

function answerText(item: TemplateItem, v: ItemValue | undefined): string[] {
  if (!v) return ['']
  switch (item.type) {
    case 'checkbox': {
      const parts: string[] = []
      if (v.checked) parts.push('Done')
      if (v.na) parts.push('N/A')
      if (v.flag && item.flagLabel) parts.push(item.flagLabel)
      return [parts.join(' · ')]
    }
    case 'radio':
    case 'text':
    case 'date':
    case 'textarea':
      return [item.options ? optionLabel(item, v.value) : v.value || '']
    case 'role_select':
      return [
        v.clinician ? `✓ ${optionLabel(item, v.clinician)}` : '',
        v.ccFrp ? `✗ ${optionLabel(item, v.ccFrp)}` : '',
      ]
    case 'scored_comment':
      return [v.value ?? '', v.comment || '']
    default:
      return ['']
  }
}

export function exportTemplateRecordPdf(template: FormTemplate, record: TemplateRecord): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14
  let y = 16

  // Title block
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('CHILD FIRST FIDELITY', pageWidth / 2, y, { align: 'center' })
  y += 6
  doc.setFontSize(11)
  doc.text(template.instrument.toUpperCase(), pageWidth / 2, y, { align: 'center' })
  y += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`${template.version} — ${template.copyright}`, pageWidth / 2, y, { align: 'center' })
  y += 8

  // Header fields
  const headerRows = template.headerFields.map(f => [f.label, record.header[f.id] || ''])
  autoTable(doc, {
    startY: y,
    body: headerRows,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } },
    theme: 'grid',
  })
  y = doc.lastAutoTable.finalY + 6

  // Sections
  for (const section of template.sections) {
    const hasRole = section.items.some(i => i.type === 'role_select')
    const hasComment = section.items.some(i => i.type === 'scored_comment')

    const head = hasRole
      ? [['Item', 'Clinician (✓)', 'CC / FRP (✗)']]
      : hasComment
        ? [['Item', 'Score (0-3)', 'Comments']]
        : [['Item', 'Response']]

    const body: string[][] = []
    for (const item of section.items) {
      const label = `${item.number ? `${item.number}. ` : ''}${item.label}${
        item.bullets ? '\n• ' + item.bullets.join('\n• ') : ''
      }`
      if (item.type === 'note') {
        body.push(hasRole || hasComment ? [label, '', ''] : [label, ''])
        continue
      }
      const answers = answerText(item, record.values[item.id])
      if (hasRole) {
        body.push([label, answers[0] || '', answers[1] || ''])
      } else if (hasComment) {
        body.push([label, answers[0] || '', answers[1] || ''])
      } else {
        body.push([label, answers.filter(Boolean).join(' / ')])
      }
    }

    autoTable(doc, {
      startY: y,
      head: [[{ content: section.title, colSpan: head[0].length, styles: { halign: 'left' } }], head[0]],
      body,
      margin: { left: margin, right: margin },
      styles: { fontSize: 7.5, cellPadding: 1.5 },
      headStyles: { fillColor: [55, 65, 81] },
      columnStyles: hasRole || hasComment
        ? { 0: { cellWidth: 110 }, 1: { cellWidth: 35 }, 2: { cellWidth: 35 } }
        : { 0: { cellWidth: 140 }, 1: { cellWidth: 40 } },
    })
    y = doc.lastAutoTable.finalY + 5
  }

  // Review note
  if (record.reviewNote) {
    autoTable(doc, {
      startY: y,
      head: [['Reflective Supervision Review Note']],
      body: [[record.reviewNote]],
      margin: { left: margin, right: margin },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] },
    })
  }

  // Footer with status + timestamps on every page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(130)
    doc.text(
      `${template.title} · ${record.clientInitials} · status: ${record.status} · exported ${new Date().toLocaleDateString()} · page ${i}/${pageCount}`,
      margin,
      doc.internal.pageSize.getHeight() - 6
    )
    doc.setTextColor(0)
  }

  const date = new Date().toISOString().split('T')[0]
  doc.save(`${template.id}_${record.clientInitials || 'case'}_${date}.pdf`)
}
