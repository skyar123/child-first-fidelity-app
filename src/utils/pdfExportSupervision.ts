import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { SupervisionFormData } from '@/types/supervision.types'
import {
  proceduralFidelityItems,
  supervisorCapacityGeneralItems,
  supervisorCapacityClinicianItems,
  supervisorCapacityCareCoordItems,
  knowledgeAreasGeneralItems,
  knowledgeAreasCareCoordItems,
  skillsCompetenciesGeneralItems,
  skillsCompetenciesClinicianItems,
  skillsCompetenciesCareCoordItems,
  globalRatingItems,
  YES_NO_LABELS,
  CAPACITY_FOCUS_LABELS,
  GLOBAL_RATING_LABELS,
} from '@/data/supervisionItems'

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number }
  }
}

export function generateSupervisionPDF(formData: SupervisionFormData): void {
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
    doc.setFillColor(219, 39, 119) // pink-600
    doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin + 3, yPos + 5.5)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    yPos += 12
  }

  const addSubsectionHeader = (title: string) => {
    checkPageBreak(10)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin, yPos)
    doc.setFont('helvetica', 'normal')
    yPos += 6
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
  doc.text('Supervision Fidelity Assessment', pageWidth / 2, 40, { align: 'center' })
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('V SUPERVISION FIDELITY 2015', pageWidth / 2, 50, { align: 'center' })

  yPos = 65
  addSectionHeader('IDENTIFICATION')
  addField('Clinical Team Names', formData.identification.clinicalTeamNames)
  addField('Child First Site', formData.identification.childFirstSite)
  addField('Month/Year', formData.identification.monthYear)
  yPos += 5

  // Procedural Fidelity
  doc.addPage()
  yPos = 20
  addSectionHeader('PROCEDURAL FIDELITY')
  const pfRows = proceduralFidelityItems.map((item) => {
    const val = formData.proceduralFidelity.items[item.id]
    return [item.text, val ? YES_NO_LABELS[val] || val : 'Not answered']
  })
  if (pfRows.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Item', 'Response']],
      body: pfRows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 116, 139] },
      columnStyles: { 0: { cellWidth: 120 } },
    })
    yPos = doc.lastAutoTable.finalY + 10
  }

  // Supervisor Capacity
  doc.addPage()
  yPos = 20
  addSectionHeader('SUPERVISOR CAPACITY')
  const capacityItems = [
    ...supervisorCapacityGeneralItems.map((i) => ({ ...i, group: 'General' })),
    ...supervisorCapacityClinicianItems.map((i) => ({ ...i, group: 'Clinician Only' })),
    ...supervisorCapacityCareCoordItems.map((i) => ({ ...i, group: 'Care Coordinator Only' })),
  ]
  const capacityRows = capacityItems.map((item) => {
    const items =
      item.group === 'General'
        ? formData.supervisorCapacity.generalItems
        : item.group === 'Clinician Only'
          ? formData.supervisorCapacity.clinicianOnlyItems
          : formData.supervisorCapacity.careCoordinatorOnlyItems
    const val = items[item.id]
    return [item.text, val ? CAPACITY_FOCUS_LABELS[val] || val : 'Not rated']
  })
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Rating']],
    body: capacityRows,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8 },
    headStyles: { fillColor: [100, 116, 139] },
    columnStyles: { 0: { cellWidth: 120 } },
  })
  yPos = doc.lastAutoTable.finalY + 10

  // Knowledge Areas
  doc.addPage()
  yPos = 20
  addSectionHeader('KNOWLEDGE AREAS')
  const kaItems = [...knowledgeAreasGeneralItems, ...knowledgeAreasCareCoordItems]
  const kaRows = kaItems.map((item) => {
    const items = item.careCoordinatorOnly
      ? formData.knowledgeAreas.careCoordinatorOnlyItems
      : formData.knowledgeAreas.generalItems
    const val = items[item.id]
    return [item.text, val ? CAPACITY_FOCUS_LABELS[val] || val : 'Not rated']
  })
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Rating']],
    body: kaRows,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8 },
    headStyles: { fillColor: [100, 116, 139] },
    columnStyles: { 0: { cellWidth: 120 } },
  })
  yPos = doc.lastAutoTable.finalY + 10

  // Skills & Competencies
  doc.addPage()
  yPos = 20
  addSectionHeader('SKILLS & COMPETENCIES')
  const skItems = [
    ...skillsCompetenciesGeneralItems,
    ...skillsCompetenciesClinicianItems,
    ...skillsCompetenciesCareCoordItems,
  ]
  const skRows = skItems.map((item) => {
    let items = formData.skillsCompetencies.generalItems
    if (item.clinicianOnly) items = formData.skillsCompetencies.clinicianOnlyItems
    else if (item.careCoordinatorOnly) items = formData.skillsCompetencies.careCoordinatorOnlyItems
    const val = items[item.id]
    return [item.text, val ? CAPACITY_FOCUS_LABELS[val] || val : 'Not rated']
  })
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Rating']],
    body: skRows,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8 },
    headStyles: { fillColor: [100, 116, 139] },
    columnStyles: { 0: { cellWidth: 120 } },
  })
  yPos = doc.lastAutoTable.finalY + 10

  // Global Ratings
  doc.addPage()
  yPos = 20
  addSectionHeader('GLOBAL RATINGS')
  const grRows = globalRatingItems.map((item) => {
    const val = formData.globalRatings.items[item.id]
    return [item.text, val ? GLOBAL_RATING_LABELS[val] || val : 'Not rated']
  })
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Rating']],
    body: grRows,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8 },
    headStyles: { fillColor: [100, 116, 139] },
    columnStyles: { 0: { cellWidth: 120 } },
  })
  yPos = doc.lastAutoTable.finalY + 8
  addSubsectionHeader('Strengths and Suggestions')
  doc.setFontSize(9)
  const strengthsText = formData.globalRatings.strengthsAndSuggestions || 'Not documented'
  const lines = doc.splitTextToSize(strengthsText, pageWidth - margin * 2)
  doc.text(lines, margin, yPos)
  yPos += lines.length * 4 + 10

  // Supervision Log
  if (formData.supervisionLog.length > 0) {
    checkPageBreak(30)
    addSectionHeader('SUPERVISION LOG')
    const logRows = formData.supervisionLog.map((entry) => [
      entry.date || 'N/A',
      entry.numSupervisees ?? 'N/A',
      entry.minutes ?? 'N/A',
      entry.percentClinical || 'N/A',
      entry.counter || 'N/A',
      (entry.notes || '').slice(0, 40),
    ])
    autoTable(doc, {
      startY: yPos,
      head: [['Date', 'Supervisees', 'Minutes', '% Clinical', 'Counter', 'Notes']],
      body: logRows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 7 },
      headStyles: { fillColor: [100, 116, 139] },
    })
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

  const filename = `Supervision_Fidelity_${formData.identification.clinicalTeamNames || 'Assessment'}_${formData.identification.monthYear || 'unknown'}.pdf`.replace(
    /[^a-zA-Z0-9._-]/g,
    '_'
  )
  doc.save(filename)
}
