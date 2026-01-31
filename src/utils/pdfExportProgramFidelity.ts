import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  programFidelitySections,
  type FidelityRating,
} from '@/data/programFidelityItems'

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number }
  }
}

interface PFFormData {
  identification: {
    affiliateSiteName: string
    dateCompleted: string
  }
  ratings: Record<string, FidelityRating>
  comments: Record<string, string>
}

const RATING_LABELS: Record<number, string> = {
  0: 'Not present',
  1: 'Early development',
  2: 'In place',
  3: 'Excellent',
}

export function generateProgramFidelityPDF(formData: PFFormData): void {
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

  const addSectionHeader = (title: string, number?: number) => {
    checkPageBreak(15)
    doc.setFillColor(139, 92, 246) // violet-500
    doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    const headerText = number ? `${number}. ${title}` : title
    doc.text(headerText, margin + 3, yPos + 5.5)
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
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(139, 92, 246) // violet-500
  doc.text('Child First Program Fidelity Checklist', pageWidth / 2, 25, { align: 'center' })
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Revised October 2019', pageWidth / 2, 32, { align: 'center' })

  // Subtitle/Instructions
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  const instructions = 'This self-assessment should be completed by the Clinical Director/Supervisor in collaboration with Clinical Teams.'
  doc.text(instructions, pageWidth / 2, 40, { align: 'center' })
  doc.setTextColor(0, 0, 0)

  yPos = 50
  addSectionHeader('SITE INFORMATION')
  addField('Affiliate Site Name', formData.identification.affiliateSiteName)
  addField('Date Completed', formData.identification.dateCompleted)
  yPos += 5

  // Rating Scale Legend
  checkPageBreak(20)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Rating Scale:', margin, yPos)
  doc.setFont('helvetica', 'normal')
  yPos += 5
  doc.setFontSize(8)
  doc.text('0 = Not present  |  1 = Early development or a little progress  |  2 = In place or good progress  |  3 = Excellent progress or accomplished', margin, yPos)
  yPos += 10

  // Calculate overall statistics
  let totalItems = 0
  let ratedItems = 0
  let totalScore = 0

  programFidelitySections.forEach(section => {
    section.items.forEach(item => {
      if (!item.isSubItem) {
        totalItems++
        const rating = formData.ratings[item.id]
        if (rating !== null && rating !== undefined) {
          ratedItems++
          totalScore += rating
        }
      }
    })
  })

  const averageScore = ratedItems > 0 ? (totalScore / ratedItems).toFixed(2) : 'N/A'
  const completionRate = totalItems > 0 ? Math.round((ratedItems / totalItems) * 100) : 0

  // Summary Stats
  checkPageBreak(20)
  doc.setFillColor(245, 243, 255) // violet-50
  doc.rect(margin, yPos, pageWidth - margin * 2, 15, 'F')
  doc.setFontSize(9)
  doc.text(`Total Items: ${totalItems}`, margin + 5, yPos + 5)
  doc.text(`Items Rated: ${ratedItems} (${completionRate}%)`, margin + 50, yPos + 5)
  doc.text(`Average Score: ${averageScore}`, margin + 110, yPos + 5)
  yPos += 20

  // Each section
  programFidelitySections.forEach((section) => {
    doc.addPage()
    yPos = 20

    addSectionHeader(section.title, section.number)

    // Collect items for this section (excluding sub-items for the table)
    const sectionItems = section.items.filter(item => !item.isSubItem)

    const rows = sectionItems.map((item) => {
      const rating = formData.ratings[item.id]
      const comment = formData.comments[item.id] || ''

      // Truncate text if too long
      const truncatedText = item.text.length > 80 ? item.text.substring(0, 77) + '...' : item.text

      return [
        truncatedText,
        rating !== null && rating !== undefined ? String(rating) : '-',
        rating !== null && rating !== undefined ? RATING_LABELS[rating] : 'Not rated',
        comment.length > 30 ? comment.substring(0, 27) + '...' : comment
      ]
    })

    if (rows.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Item', 'Score', 'Rating', 'Comments']],
        body: rows,
        margin: { left: margin, right: margin },
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [139, 92, 246] }, // violet-500
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 12, halign: 'center' },
          2: { cellWidth: 35 },
          3: { cellWidth: 40 }
        },
        didDrawCell: (data: { column: { index: number }; cell: { raw: unknown; text: string[] } }) => {
          // Color code the score cell
          if (data.column.index === 1 && data.cell.raw !== '-') {
            const score = parseInt(data.cell.text[0])
            if (!isNaN(score)) {
              // Already handled by autoTable styling
            }
          }
        }
      })
      yPos = doc.lastAutoTable.finalY + 5

      // Section summary
      const sectionRated = sectionItems.filter(item => formData.ratings[item.id] !== null && formData.ratings[item.id] !== undefined).length
      const sectionTotal = sectionItems.length
      const sectionScore = sectionItems.reduce((sum, item) => {
        const r = formData.ratings[item.id]
        return r !== null && r !== undefined ? sum + r : sum
      }, 0)
      const sectionAvg = sectionRated > 0 ? (sectionScore / sectionRated).toFixed(2) : 'N/A'

      checkPageBreak(10)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'italic')
      doc.text(`Section ${section.number}: ${sectionRated}/${sectionTotal} items rated, Average: ${sectionAvg}`, margin, yPos)
      doc.setFont('helvetica', 'normal')
      yPos += 10
    }

    // Add sub-items as notes if any
    const subItems = section.items.filter(item => item.isSubItem)
    if (subItems.length > 0) {
      checkPageBreak(15)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('Additional considerations:', margin, yPos)
      doc.setFont('helvetica', 'normal')
      yPos += 4
      subItems.forEach(subItem => {
        checkPageBreak(5)
        const lines = doc.splitTextToSize(`• ${subItem.text}`, pageWidth - margin * 2 - 5)
        doc.text(lines, margin + 3, yPos)
        yPos += lines.length * 3.5
      })
      yPos += 5
    }
  })

  // Footer on last page
  doc.setFontSize(9)
  doc.setTextColor(128, 128, 128)
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  )
  doc.setTextColor(0, 0, 0)

  // Generate filename
  const siteName = formData.identification.affiliateSiteName || 'Assessment'
  const date = formData.identification.dateCompleted || new Date().toISOString().split('T')[0]
  const filename = `Program_Fidelity_${siteName}_${date}.pdf`.replace(/[^a-zA-Z0-9._-]/g, '_')

  doc.save(filename)
}
