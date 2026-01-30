import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { FormData } from '@/types/form.types'
import { fidelityStrands, CHALLENGE_RATING_LABELS, CAPACITY_RATING_LABELS } from '@/data/fidelityItems'
import { assessmentSections } from '@/data/assessmentItems'
import { cppObjectives, CLINICAL_FOCUS_LABELS, PROGRESS_LABELS } from '@/data/cppObjectives'
import { homeVisitSections } from '@/data/homeVisitItems'

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number }
  }
}

export function generatePDF(formData: FormData): void {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  let yPos = 20

  // Helper function to add a new page if needed
  const checkPageBreak = (neededHeight: number) => {
    if (yPos + neededHeight > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage()
      yPos = 20
    }
  }

  // Helper for section headers
  const addSectionHeader = (title: string) => {
    checkPageBreak(15)
    doc.setFillColor(59, 130, 246) // blue-500
    doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin + 3, yPos + 5.5)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    yPos += 12
  }

  // Helper for subsection headers
  const addSubsectionHeader = (title: string) => {
    checkPageBreak(10)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin, yPos)
    doc.setFont('helvetica', 'normal')
    yPos += 6
  }

  // Helper for label-value pairs
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

  // =========================================
  // Title Page
  // =========================================
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Child First CPP Fidelity Assessment', pageWidth / 2, 40, { align: 'center' })

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Foundational Phase Fidelity Document', pageWidth / 2, 50, { align: 'center' })

  doc.setFontSize(11)
  yPos = 70
  addField('Clinical Team', formData.caseIdentification.clinicalTeamNames)
  addField('Client Initials', formData.caseIdentification.clientInitials)
  addField('Date', formData.caseIdentification.date)
  addField('Referral Source', formData.caseIdentification.referralSource)

  doc.setFontSize(9)
  doc.setTextColor(128, 128, 128)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 280, { align: 'center' })
  doc.setTextColor(0, 0, 0)

  // =========================================
  // Demographics Section
  // =========================================
  doc.addPage()
  yPos = 20

  addSectionHeader('DEMOGRAPHICS & CASE IDENTIFICATION')

  // Target Child
  addSubsectionHeader('Target Child')
  addField('Age (months)', formData.targetChild.ageInMonths)
  addField('Gender', formData.targetChild.gender)
  addField('Ethnicity', formData.targetChild.ethnicity.join(', '))
  addField('Primary Language', formData.targetChild.primaryLanguage)
  addField('Insurance Type', formData.targetChild.insuranceType)
  addField('Living Situation', formData.targetChild.livingSituation)
  yPos += 5

  // Siblings
  if (formData.siblings.length > 0) {
    addSubsectionHeader('Siblings')
    const siblingData = formData.siblings.map((s, i) => [
      i + 1,
      s.initials || 'N/A',
      s.ageInMonths ? `${s.ageInMonths} mo` : 'N/A',
      s.gender || 'N/A',
      s.relationship || 'N/A',
      s.livesWithChild ? 'Yes' : 'No',
      s.includedInTreatment ? 'Yes' : 'No'
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Initials', 'Age', 'Gender', 'Relationship', 'Lives With', 'In Treatment']],
      body: siblingData,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 116, 139] },
    })

    yPos = doc.lastAutoTable.finalY + 8
  }

  // Caregivers
  if (formData.caregivers.length > 0) {
    addSubsectionHeader('Caregivers')
    const caregiverData = formData.caregivers.map((c, i) => [
      i + 1,
      c.initials || 'N/A',
      c.relationship || 'N/A',
      c.age ? String(c.age) : 'N/A',
      c.gender || 'N/A',
      c.primaryLanguage || 'N/A',
      c.isPrimaryCaregiver ? 'Yes' : 'No'
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Initials', 'Relationship', 'Age', 'Gender', 'Language', 'Primary']],
      body: caregiverData,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 116, 139] },
    })

    yPos = doc.lastAutoTable.finalY + 8
  }

  // =========================================
  // Contact Log Section
  // =========================================
  doc.addPage()
  yPos = 20

  addSectionHeader('CONTACT LOG')

  if (formData.contactLog.length > 0) {
    const contactData = formData.contactLog.map((c, i) => [
      c.sessionNumber || i + 1,
      c.date || 'N/A',
      c.contactType || 'N/A',
      c.sessionStatus || 'N/A',
      c.sessionLocation || 'N/A',
      c.sessionDuration ? `${c.sessionDuration} min` : 'N/A'
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['Session', 'Date', 'Type', 'Status', 'Location', 'Duration']],
      body: contactData,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 116, 139] },
    })

    yPos = doc.lastAutoTable.finalY + 8

    // Summary stats
    const totalSessions = formData.contactLog.length
    const completedSessions = formData.contactLog.filter(c => c.sessionStatus === 'completed').length
    const totalTime = formData.contactLog.reduce((sum, c) => sum + (c.sessionDuration || 0), 0)

    addSubsectionHeader('Summary')
    addField('Total Sessions', totalSessions)
    addField('Completed Sessions', completedSessions)
    addField('Total Time', `${totalTime} minutes`)
  } else {
    doc.setFontSize(9)
    doc.text('No contact log entries recorded.', margin, yPos)
    yPos += 10
  }

  // =========================================
  // Fidelity Strands Section
  // =========================================
  doc.addPage()
  yPos = 20

  addSectionHeader('FIDELITY STRANDS')

  for (let i = 0; i < fidelityStrands.length; i++) {
    const strand = fidelityStrands[i]
    checkPageBreak(30)
    addSubsectionHeader(`Strand ${i + 1}: ${strand.title}`)

    const strandData = formData.fidelityStrands[strand.id as keyof typeof formData.fidelityStrands]

    // Challenge items
    const challengeRows = strand.challengeItems.map(item => {
      const rating = strandData?.challengeItems?.[item.id]
      return [item.text, rating !== null && rating !== undefined ? CHALLENGE_RATING_LABELS[rating] : 'Not rated']
    })

    if (challengeRows.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Challenge Item', 'Rating']],
        body: challengeRows,
        margin: { left: margin, right: margin },
        styles: { fontSize: 8 },
        headStyles: { fillColor: [220, 38, 38] }, // red
        columnStyles: { 0: { cellWidth: 120 } }
      })
      yPos = doc.lastAutoTable.finalY + 5
    }

    // Capacity items
    const allCapacityItems = [
      ...strand.capacityItems,
      ...(strand.capacityGroups?.flatMap(g => g.items) || [])
    ]

    const capacityRows = allCapacityItems.map(item => {
      const rating = strandData?.capacityItems?.[item.id]
      return [item.text, rating !== null && rating !== undefined ? CAPACITY_RATING_LABELS[rating] : 'Not rated']
    })

    if (capacityRows.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Capacity Item', 'Rating']],
        body: capacityRows,
        margin: { left: margin, right: margin },
        styles: { fontSize: 8 },
        headStyles: { fillColor: [34, 197, 94] }, // green
        columnStyles: { 0: { cellWidth: 120 } }
      })
      yPos = doc.lastAutoTable.finalY + 10
    }
  }

  // =========================================
  // Assessment Checklist Section
  // =========================================
  doc.addPage()
  yPos = 20

  addSectionHeader('ASSESSMENT CHECKLIST')

  addField('Child Trauma History', formData.assessmentChecklist.childTraumaHistory || 'Not specified')
  yPos += 5

  for (const section of assessmentSections) {
    checkPageBreak(20)
    addSubsectionHeader(section.title)

    const rows = section.items.map(item => {
      const itemData = formData.assessmentChecklist.items[item.id]
      return [
        item.text,
        itemData?.done ? 'Done' : 'Not Done',
        itemData?.na ? 'N/A' : ''
      ]
    })

    autoTable(doc, {
      startY: yPos,
      head: [['Item', 'Status', 'N/A']],
      body: rows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 116, 139] },
      columnStyles: { 0: { cellWidth: 120 } }
    })

    yPos = doc.lastAutoTable.finalY + 8
  }

  // =========================================
  // Formulation Section
  // =========================================
  doc.addPage()
  yPos = 20

  addSectionHeader('FORMULATION & TREATMENT PLANNING')

  const formulationFields = [
    { label: 'Presenting Problems', value: formData.formulation.presentingProblems },
    { label: 'Trauma History', value: formData.formulation.traumaHistory },
    { label: 'Developmental History', value: formData.formulation.developmentalHistory },
    { label: 'Family Context', value: formData.formulation.familyContext },
    { label: 'Strengths', value: formData.formulation.strengths },
    { label: 'Treatment Goals', value: formData.formulation.treatmentGoals },
    { label: 'Intervention Plan', value: formData.formulation.interventionPlan },
  ]

  for (const field of formulationFields) {
    checkPageBreak(25)
    addSubsectionHeader(field.label)
    doc.setFontSize(9)
    const text = field.value || 'Not documented'
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2)
    doc.text(lines, margin, yPos)
    yPos += lines.length * 4 + 8
  }

  // =========================================
  // Plan of Care Section
  // =========================================
  doc.addPage()
  yPos = 20

  addSectionHeader('PLAN OF CARE')

  // Goals
  if (formData.planOfCare.goals.length > 0) {
    addSubsectionHeader('Treatment Goals')

    for (let i = 0; i < formData.planOfCare.goals.length; i++) {
      const goal = formData.planOfCare.goals[i]
      checkPageBreak(20)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(`Goal ${i + 1}:`, margin, yPos)
      doc.setFont('helvetica', 'normal')

      const goalText = goal.goal || 'Not specified'
      const lines = doc.splitTextToSize(goalText, pageWidth - margin * 2 - 20)
      doc.text(lines, margin + 20, yPos)
      yPos += lines.length * 4 + 3

      if (goal.targetDate) {
        addField('Target Date', goal.targetDate)
      }
      if (goal.progress) {
        addField('Progress', goal.progress)
      }
      yPos += 5
    }
  }

  // Safety Plan
  checkPageBreak(30)
  addSubsectionHeader('Safety Plan')
  doc.setFontSize(9)
  const safetyText = formData.planOfCare.safetyPlan || 'Not documented'
  const safetyLines = doc.splitTextToSize(safetyText, pageWidth - margin * 2)
  doc.text(safetyLines, margin, yPos)
  yPos += safetyLines.length * 4 + 8

  // Crisis Contacts
  addSubsectionHeader('Crisis Contacts')
  const crisisText = formData.planOfCare.crisisContacts || 'Not documented'
  const crisisLines = doc.splitTextToSize(crisisText, pageWidth - margin * 2)
  doc.text(crisisLines, margin, yPos)
  yPos += crisisLines.length * 4 + 8

  // =========================================
  // Home Visit Checklists
  // =========================================
  doc.addPage()
  yPos = 20

  addSectionHeader('HOME VISIT CHECKLISTS')

  for (const section of homeVisitSections) {
    checkPageBreak(30)
    addSubsectionHeader(section.title)

    const rows = section.items.map(item => {
      const checked = formData.homeVisit[section.id]?.[item.id]
      return [item.label, checked ? '✓' : '']
    })

    autoTable(doc, {
      startY: yPos,
      head: [['Item', 'Done']],
      body: rows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [6, 182, 212] }, // cyan
      columnStyles: { 0: { cellWidth: 140 }, 1: { cellWidth: 20, halign: 'center' } }
    })

    yPos = doc.lastAutoTable.finalY + 8
  }

  // =========================================
  // CPP Objectives Section
  // =========================================
  doc.addPage()
  yPos = 20

  addSectionHeader('CPP TREATMENT OBJECTIVES')

  const objectiveRows = cppObjectives.map(obj => {
    const data = formData.cppObjectives.objectives[obj.id]
    return [
      `${obj.number}. ${obj.title}`,
      data?.clinicalFocus !== null && data?.clinicalFocus !== undefined
        ? CLINICAL_FOCUS_LABELS[data.clinicalFocus]
        : 'Not rated',
      data?.progress !== null && data?.progress !== undefined && data?.progress !== 'na'
        ? PROGRESS_LABELS[data.progress]
        : 'N/A'
    ]
  })

  autoTable(doc, {
    startY: yPos,
    head: [['Objective', 'Clinical Focus', 'Progress']],
    body: objectiveRows,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8 },
    headStyles: { fillColor: [99, 102, 241] }, // indigo
    columnStyles: { 0: { cellWidth: 100 } }
  })

  // Save the PDF
  const clientInitials = formData.caseIdentification.clientInitials || 'case'
  const date = new Date().toISOString().split('T')[0]
  doc.save(`CPP_Fidelity_${clientInitials}_${date}.pdf`)
}
