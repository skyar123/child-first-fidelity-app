// Assessment & Engagement Checklist Items
// Based on the Word document structure

export interface AssessmentSubItem {
  id: string
  text: string
}

export interface AssessmentOption {
  value: string
  label: string
}

export interface AssessmentItem {
  id: string
  number?: string
  text: string
  type: 'checkbox' | 'multi-checkbox' | 'radio'
  childFirstOnly?: boolean
  subItems?: AssessmentSubItem[]
  options?: AssessmentOption[]
  conditionalOn?: {
    field: string
    notValue: string
  }
}

export interface AssessmentSection {
  id: string
  title: string
  items: AssessmentItem[]
}

// The key field that triggers conditional visibility
export const TRAUMA_TRIGGER_FIELD = 'assessmentChecklist.childTraumaHistory'
export const NO_TRAUMA_VALUE = 'a' // "Child has no known history of trauma"

// Child trauma history options
export const CHILD_TRAUMA_OPTIONS: AssessmentOption[] = [
  { value: 'a', label: 'Child has no known history of trauma (e.g. newborn baby)' },
  { value: 'b', label: 'Clinician met alone with caregiver and screened for child\'s trauma history using the TESI to discuss what the caregiver knows and what is known from other sources' },
  { value: 'c', label: 'Caregiver is not aware of child\'s trauma history. Clinician met alone with caregiver and used the TESI to talk to caregiver about child\'s history gathered from other sources' },
  { value: 'd', label: 'Caregiver refused to complete the TESI, but did provide details regarding child\'s trauma history' },
  { value: 'e', label: 'Caregiver refused to complete the TESI, and refused to talk about child\'s trauma history' },
]

export const assessmentSections: AssessmentSection[] = [
  {
    id: 'engagement',
    title: 'Engagement Process',
    items: [
      {
        id: 'cf1',
        number: 'CF1',
        text: 'Initiated engagement process (Point of Entry Process)',
        type: 'multi-checkbox',
        childFirstOnly: true,
        subItems: [
          { id: 'cf1a', text: 'Contacted family within 48 hours of case assignment' },
          { id: 'cf1b', text: 'First visit was held within 2 weeks of assignment, if possible' },
          { id: 'cf1c', text: 'If initial contact was unsuccessful, Team made multiple phone calls, sent letters, contacted referrer, and showed ingenuity in attempting initial contact' },
        ],
      },
      {
        id: 'cf2',
        number: 'CF2',
        text: 'Completed first visit procedures',
        type: 'multi-checkbox',
        childFirstOnly: true,
        subItems: [
          { id: 'cf2a', text: 'Explained Child First model (frequency of visits, Team structure, independence from referral source, collaboration with agencies, and provision of services and support for all family members)' },
          { id: 'cf2b', text: 'Answered caregiver questions and concerns' },
          { id: 'cf2c', text: 'Provided rationale for dyadic treatment' },
          { id: 'cf2d', text: 'Provided rationale for inclusion of other important caregivers in child\'s life' },
          { id: 'cf2e', text: 'Provided rationale for play and caregiver-child interaction as an intrinsic component of intervention' },
          { id: 'cf2f', text: 'Provided rationale for completing baseline, 6 month and termination assessments' },
          { id: 'cf2g', text: 'Reviewed need for consistency in treatment and notification of cancellations' },
          { id: 'cf2h', text: 'Reviewed limits to confidentiality and reporting requirements – e.g., mandated reporter' },
          { id: 'cf2i', text: 'Reviewed and requested signature for consent forms' },
        ],
      },
    ],
  },
  {
    id: 'assessment',
    title: 'Assessment & History',
    items: [
      {
        id: 'item1',
        number: '1',
        text: 'Elicited caregiver perception of need for treatment - Discussed with caregiver the reason for referral, referral source, and how caregiver feels about treatment',
        type: 'checkbox',
      },
      {
        id: 'item2',
        number: '2',
        text: 'Elicited caregiver description of family circumstances, challenges, and strengths - Discussed caregiver\'s concerns about child, self, and other family members',
        type: 'checkbox',
      },
      {
        id: 'cf3',
        number: 'CF3',
        text: 'Used Intake Part 1: Guide to Child and Family Clinical History to ensure comprehensive assessment',
        type: 'checkbox',
        childFirstOnly: true,
      },
      {
        id: 'cf4',
        number: 'CF4',
        text: 'Used Intake Part 2: Service Needs Inventory for Families to determine services and supports needed',
        type: 'checkbox',
        childFirstOnly: true,
      },
      {
        id: 'cf5',
        number: 'CF5',
        text: 'Provided instrumental support promptly to assist with family stabilization',
        type: 'multi-checkbox',
        childFirstOnly: true,
        subItems: [
          { id: 'cf5a', text: 'Assessed for any urgent needs and discussed possible steps with caregiver' },
          { id: 'cf5b', text: 'Developed preliminary plan for family stabilization, if necessary' },
        ],
      },
      {
        id: 'item3',
        number: '3',
        text: 'Provided a sense of positive expectations about improvement - Noticed protective actions, conveyed realistic hope, provided emotional support, and acknowledged that coming to treatment is an important first step',
        type: 'checkbox',
      },
      {
        id: 'cf6',
        number: 'CF6',
        text: 'Was mindful of not being a "better parent" than the caregiver',
        type: 'checkbox',
        childFirstOnly: true,
      },
      {
        id: 'item4',
        number: '4',
        text: 'Shared with caregiver rationale for screening for child trauma (for this specific child or in general)',
        type: 'checkbox',
      },
    ],
  },
  {
    id: 'traumaScreening',
    title: 'Child Trauma Screening',
    items: [
      {
        id: 'item5',
        number: '5',
        text: 'Asked caregiver to jointly complete a child trauma screening instrument',
        type: 'checkbox',
      },
      {
        id: 'item5a',
        number: '5a',
        text: 'Is caregiver aware of child\'s history?',
        type: 'radio',
        options: [
          { value: 'no', label: 'No' },
          { value: 'inPart', label: 'In part' },
          { value: 'yes', label: 'Yes' },
        ],
      },
      {
        id: 'item5b',
        number: '5b',
        text: 'Select one to describe how you and caregiver discussed child\'s experience of trauma',
        type: 'radio',
        options: CHILD_TRAUMA_OPTIONS,
      },
    ],
  },
  {
    id: 'traumaResponse',
    title: 'Caregiver Response to Child\'s Trauma',
    items: [
      {
        id: 'item6',
        number: '6',
        text: 'Considered caregiver\'s response to child\'s trauma history - Considered the quality of the way the caregiver thinks about the child\'s traumatic experiences',
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notValue: NO_TRAUMA_VALUE },
      },
      {
        id: 'item6a',
        number: '6a',
        text: 'Factual response: Select one to describe caregiver\'s factual response to child\'s trauma history',
        type: 'radio',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notValue: NO_TRAUMA_VALUE },
        options: [
          { value: 'na', label: 'N/A - Child has no known history of trauma' },
          { value: 'acknowledged', label: 'Acknowledged traumatic event(s) and impact on child' },
          { value: 'unsure', label: 'Acknowledged traumatic event(s) but may be unsure of impact on child' },
          { value: 'deniedImpact', label: 'Acknowledged event but denied impact' },
          { value: 'denied', label: 'Denied child\'s experience of documented traumatic events' },
        ],
      },
      {
        id: 'item6b',
        number: '6b',
        text: 'Emotional response: Select one to describe caregiver\'s emotional response to child\'s trauma history',
        type: 'radio',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notValue: NO_TRAUMA_VALUE },
        options: [
          { value: 'na', label: 'N/A - Child has no known history of trauma' },
          { value: 'integrated', label: 'Integrated: Emotionally integrated, able to talk about experience without being overwhelmed' },
          { value: 'triggered', label: 'Triggered: Overwhelmed or flooded by thinking about child\'s experience' },
          { value: 'avoidant', label: 'Avoidant: Avoids thinking about child\'s experience, blocks or pushes away experience' },
          { value: 'mixed', label: 'Mixed Avoidant & Triggered: Overwhelmed by child\'s experience and actively avoids thinking about it' },
        ],
      },
    ],
  },
  {
    id: 'childSymptoms',
    title: 'Child Symptoms & Development',
    items: [
      {
        id: 'item7',
        number: '7',
        text: 'Assessed child symptoms - Met with caregiver and obtained caregiver report of child\'s symptoms and areas of concern',
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notValue: NO_TRAUMA_VALUE },
      },
      {
        id: 'item8',
        number: '8',
        text: 'Assessed child trauma symptoms - Clinician met alone with caregiver and obtained caregiver report of child\'s trauma symptoms using a standardized instrument or clinical interview',
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notValue: NO_TRAUMA_VALUE },
      },
      {
        id: 'item9',
        number: '9',
        text: 'Assessed child developmental functioning - Assessed child\'s developmental functioning (regulatory capacity, achievement of age appropriate skills)',
        type: 'checkbox',
      },
      {
        id: 'item10',
        number: '10',
        text: 'Discussed connection between child\'s symptoms and child\'s trauma history - Talked to caregiver about how child\'s symptoms or functioning may be related to the child\'s trauma history',
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notValue: NO_TRAUMA_VALUE },
      },
      {
        id: 'item11',
        number: '11',
        text: 'Discussed trauma reminders - Helped the caregiver understand the concept of a trauma reminder and begin to identify possible trauma reminders for the child and caregiver',
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notValue: NO_TRAUMA_VALUE },
      },
      {
        id: 'item12',
        number: '12',
        text: 'Assessed for child safety risks to engaging in trauma-informed treatment',
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notValue: NO_TRAUMA_VALUE },
      },
    ],
  },
  {
    id: 'observation',
    title: 'Observation & Interaction',
    items: [
      {
        id: 'item13',
        number: '13',
        text: 'Observed child and caregiver interaction - Observed child and caregiver together to obtain information regarding quality of their relationship, the way child and caregiver typically play and interact',
        type: 'checkbox',
      },
      {
        id: 'cf7',
        number: 'CF7',
        text: 'Conducted play assessment - Conducted play assessment with child to explore relatedness, developmental level, and presence of symbolic play',
        type: 'checkbox',
        childFirstOnly: true,
      },
      {
        id: 'item14',
        number: '14',
        text: 'Discussed impact of child trauma treatment on caregivers - Met alone with caregiver and discussed how talking about/processing a child\'s traumatic experiences can affect caregivers, highlighting both risks and benefits',
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notValue: NO_TRAUMA_VALUE },
      },
    ],
  },
  {
    id: 'caregiverTrauma',
    title: 'Caregiver Trauma History',
    items: [
      {
        id: 'item15',
        number: '15',
        text: 'Shared rationale for asking about caregiver trauma history',
        type: 'checkbox',
      },
      {
        id: 'item16',
        number: '16',
        text: 'Asked caregiver to jointly complete a caregiver trauma screening instrument - Clinician met alone with caregiver and discussed using a trauma screening instrument to think about caregiver history',
        type: 'checkbox',
      },
      {
        id: 'item17',
        number: '17',
        text: 'Shared rationale for asking about caregiver symptoms',
        type: 'checkbox',
      },
      {
        id: 'item18',
        number: '18',
        text: 'Introduced caregiver symptom measures - Discussed using questionnaires or interviews to better understand the caregiver\'s symptoms',
        type: 'checkbox',
      },
    ],
  },
  {
    id: 'childFirstSpecific',
    title: 'Child First Specific Items',
    items: [
      {
        id: 'cf8',
        number: 'CF8',
        text: 'Collected other required assessments in Child First Assessment Protocol (PQ, SNIFF, CCIS, HOPE)',
        type: 'checkbox',
        childFirstOnly: true,
      },
      {
        id: 'cf9',
        number: 'CF9',
        text: 'Obtained collateral information',
        type: 'multi-checkbox',
        childFirstOnly: true,
        subItems: [
          { id: 'cf9a', text: 'Sent signed Release of Information to other providers' },
          { id: 'cf9b', text: 'Obtained information from health provider' },
          { id: 'cf9c', text: 'Obtained information for early care and education setting, as needed' },
          { id: 'cf9d', text: 'Obtained collateral information from other service providers and child stakeholders' },
        ],
      },
      {
        id: 'cf10',
        number: 'CF10',
        text: 'Observed child in early care and education/child care setting or classroom',
        type: 'checkbox',
        childFirstOnly: true,
      },
      {
        id: 'cf11',
        number: 'CF11',
        text: 'Identified child and caregiver strengths and vulnerabilities',
        type: 'checkbox',
        childFirstOnly: true,
      },
      {
        id: 'cf12',
        number: 'CF12',
        text: 'Noted areas of contradiction or in need of further clarification',
        type: 'checkbox',
        childFirstOnly: true,
      },
      {
        id: 'cf13',
        number: 'CF13',
        text: 'Completed the Child First Baseline Assessment Checklist',
        type: 'checkbox',
        childFirstOnly: true,
      },
    ],
  },
  {
    id: 'supervision',
    title: 'Supervision & Case Formulation',
    items: [
      {
        id: 'item19',
        number: '19',
        text: 'Processed information gathered during assessment/engagement with supervisor/colleague',
        type: 'checkbox',
      },
      {
        id: 'cf14',
        number: 'CF14',
        text: 'Clinical Team developed case formulation - Clinical Team developed/updated case formulation taking into account child social-emotional development and behavior, child developmental capacities, trauma history, important relationships, caregiver challenges, culture, and other',
        type: 'checkbox',
        childFirstOnly: true,
      },
    ],
  },
]

// Helper function to check if an item should be visible
export function isItemVisible(
  item: AssessmentItem,
  formValues: Record<string, unknown>
): boolean {
  if (!item.conditionalOn) return true

  const { field, notValue } = item.conditionalOn
  const fieldParts = field.split('.')
  let value: unknown = formValues

  for (const part of fieldParts) {
    if (value && typeof value === 'object' && part in value) {
      value = (value as Record<string, unknown>)[part]
    } else {
      return true // If we can't find the field, show the item
    }
  }

  // Item is visible if the field value is NOT equal to notValue
  // (i.e., visible when child HAS trauma history)
  return value !== notValue && value !== '' && value !== null
}
