import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { careCoordinatorSections } from '@/data/careCoordinatorItems'

// Matches CCFormData from CareCoordinatorAppShell
interface CCFormData {
  identification: {
    careCoordinatorName: string
    clinicalDirectorName: string
    clientInitials: string
    childFirstSite: string
    date: string
  }
  items: Record<string, {
    done?: boolean
    na?: boolean
    subItems?: Record<string, boolean>
    assessmentTracking?: Record<string, {
      inProcess?: boolean
      completed?: boolean
      entered?: boolean
    }>
  }>
}

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number }
  }
}

export function generateCareCoordinatorPDF(formData: CCFormData): void {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  let yPos = 20

  const checkPageBreak = (neededHeight: number) => {
    if (yPos + neededHeight > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage()
      yPos = 20
    }
  }

  const addSectionHeader = (title: string) => {
    checkPageBreak(15)
    doc.setFillColor(20, 184, 166) // teal-500
    doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin + 3, yPos + 5.5)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    yPos += 12
  }

  const addField = (label: string, value: string | number | null | undefined) => {
    checkPageBreak(8)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, margin, yPos)
    doc.setFont('helvetica', 'normal')
    const valueStr = value !== null && value !== undefined && value !== '' ? String(value) : 'N/A'
    doc.text(valueStr, margin + 45, yPos)
    yPos += 5
  }

  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('III. Care Coordination Interventions', pageWidth / 2, 40, { align: 'center' })
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Child First Fidelity Framework', pageWidth / 2, 50, { align: 'center' })

  yPos = 65
  addSectionHeader('IDENTIFICATION')
  addField('Care Coordinator/FRP', formData.identification.careCoordinatorName)
  addField('Clinical Director/Supervisor', formData.identification.clinicalDirectorName)
  addField('Client Initials', formData.identification.clientInitials)
  addField('Child First Site', formData.identification.childFirstSite)
  addField('Date', formData.identification.date)
  yPos += 5

  // Checklist sections
  for (const section of careCoordinatorSections) {
    doc.addPage()
    yPos = 20
    addSectionHeader(section.title.toUpperCase())

    const rows: string[][] = []
    for (const item of section.items) {
      const itemData = formData.items?.[item.id]
      if (item.type === 'checkbox') {
        const status = itemData?.na ? 'N/A' : itemData?.done ? 'Done' : ''
        rows.push([item.text.slice(0, 120), status])
      } else if (item.type === 'multi-checkbox' && item.subItems) {
        rows.push([item.text.slice(0, 80), ''])
        for (const subItem of item.subItems) {
          const checked = itemData?.subItems?.[subItem.id] ? '✓' : ''
          rows.push([`  • ${subItem.text.slice(0, 100)}`, checked])
        }
      } else if (item.type === 'assessment-tracking' && item.assessmentTrackingItems) {
        rows.push([item.text.slice(0, 80), ''])
        for (const trackingItem of item.assessmentTrackingItems) {
          const t = itemData?.assessmentTracking?.[trackingItem.id]
          const status = [t?.inProcess && 'In Process', t?.completed && 'Completed', t?.entered && 'Entered']
            .filter(Boolean)
            .join(', ') || ''
          rows.push([`  ${trackingItem.label}`, status])
        }
      }
    }

    if (rows.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Item', 'Status']],
        body: rows,
        margin: { left: margin, right: margin },
        styles: { fontSize: 8 },
        headStyles: { fillColor: [100, 116, 139] },
        columnStyles: { 0: { cellWidth: 140 }, 1: { cellWidth: 30 } },
      })
      yPos = doc.lastAutoTable.finalY + 10
    }
  }

  doc.setFontSize(9)
  doc.setTextColor(128, 128, 128)
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  )
  doc.setTextColor(0, 0, 0)

  const filename = `Care_Coordinator_${formData.identification.clientInitials || 'Assessment'}_${formData.identification.date || 'unknown'}.pdf`.replace(
    /[^a-zA-Z0-9._-]/g,
    '_'
  )
  doc.save(filename)
}
