export type ItemType =
  | 'checkbox'
  | 'radio'
  | 'multi-checkbox'
  | 'text'
  | 'select'

export interface SubItem {
  id: string
  text: string
  type?: ItemType
}

export interface SelectOption {
  value: string
  label: string
}

export interface AssessmentItem {
  id: string
  number?: string
  text: string
  type: ItemType
  childFirstOnly?: boolean
  required?: boolean
  options?: SelectOption[]
  subItems?: SubItem[]
  conditionalOn?: {
    field: string
    notEquals?: string
    equals?: string
  }
  triggersConditional?: boolean
  description?: string
}

export interface AssessmentSection {
  id: string
  title: string
  items: AssessmentItem[]
}

// Key fields that trigger conditional logic
export const TRAUMA_TRIGGER_FIELD = 'assessmentChecklist.childTraumaHistory'
export const NO_TRAUMA_VALUE = 'a' // "Child has no known history of trauma"

export const assessmentSections: AssessmentSection[] = [
  {
    id: 'engagement',
    title: 'Engagement Process',
    items: [
      {
        id: 'cf1',
        number: 'CF1',
        text: 'Initiated engagement process',
        type: 'multi-checkbox',
        childFirstOnly: true,
        subItems: [
          { id: 'cf1a', text: 'Contacted family within 48 hours of case assignment' },
          { id: 'cf1b', text: 'First visit was held within 2 weeks of assignment, if possible' },
          {
            id: 'cf1c',
            text: 'If initial contact was unsuccessful, Team made multiple phone calls, sent letters, contacted referrer if Release of Information was provided at time of referral, and showed ingenuity in attempting initial contact',
          },
        ],
      },
      {
        id: 'cf2',
        number: 'CF2',
        text: 'Completed first visit procedures',
        type: 'multi-checkbox',
        childFirstOnly: true,
        subItems: [
          { id: 'cf2a', text: 'Explained Child First model' },
          { id: 'cf2b', text: 'Answered caregiver questions and concerns' },
          { id: 'cf2c', text: 'Provided rationale for dyadic treatment' },
          { id: 'cf2d', text: 'Provided rationale for inclusion of other important caregivers' },
          { id: 'cf2e', text: 'Provided rationale for play and caregiver-child interaction' },
          {
            id: 'cf2f',
            text: 'Provided rationale for completing baseline, 6 month and termination assessments',
          },
          {
            id: 'cf2g',
            text: 'Reviewed need for consistency in treatment and notification of cancellations',
          },
          { id: 'cf2h', text: 'Reviewed limits to confidentiality and reporting requirements' },
          { id: 'cf2i', text: 'Reviewed and requested signature for forms' },
        ],
      },
      {
        id: 'item1',
        number: '1',
        text: 'Elicited caregiver perception of need for treatment',
        type: 'checkbox',
      },
      {
        id: 'item2',
        number: '2',
        text: 'Elicited caregiver description of family circumstances, challenges, and strengths',
        type: 'checkbox',
      },
      {
        id: 'cf3',
        number: 'CF3',
        text: 'Used Intake Part 1: Guide to Child and Family Clinical History',
        type: 'checkbox',
        childFirstOnly: true,
      },
      {
        id: 'cf4',
        number: 'CF4',
        text: 'Used Intake Part 2: Service Needs Inventory for Families',
        type: 'checkbox',
        childFirstOnly: true,
      },
      {
        id: 'cf5',
        number: 'CF5',
        text: 'Provided instrumental support promptly',
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
        text: 'Provided a sense of positive expectations about improvement',
        type: 'checkbox',
      },
      {
        id: 'cf6',
        number: 'CF6',
        text: 'Was mindful of not being a "better parent" than the caregiver',
        type: 'checkbox',
        childFirstOnly: true,
      },
    ],
  },
  {
    id: 'childTraumaScreening',
    title: 'Child Trauma Screening',
    items: [
      {
        id: 'item4',
        number: '4',
        text: 'Shared with caregiver rationale for screening for child trauma',
        type: 'checkbox',
      },
      {
        id: 'item5',
        number: '5',
        text: 'Asked caregiver to jointly complete a child trauma screening instrument',
        type: 'checkbox',
      },
      {
        id: 'item5a',
        number: '5a',
        text: "Is caregiver aware of child's history?",
        type: 'radio',
        options: [
          { value: 'no', label: 'No' },
          { value: 'in_part', label: 'In part' },
          { value: 'yes', label: 'Yes' },
        ],
      },
      {
        id: 'item5b',
        number: '5b',
        text: "Select one to describe how you and caregiver discussed child's experience of trauma",
        type: 'radio',
        triggersConditional: true,
        options: [
          { value: 'a', label: 'Child has no known history of trauma (e.g. newborn baby)' },
          {
            value: 'b',
            label: "Clinician met alone with caregiver and screened for child's trauma history using the TESI",
          },
          {
            value: 'c',
            label: "Caregiver is not aware of child's trauma history. Clinician met alone with caregiver and used the TESI to talk to caregiver about child's history from other sources",
          },
          {
            value: 'd',
            label: "Caregiver refused to complete the TESI, but did provide details regarding child's trauma history",
          },
          {
            value: 'e',
            label: "Caregiver refused to complete the TESI, and refused to talk about child's trauma history",
          },
        ],
      },
      {
        id: 'item5c',
        number: '5c',
        text: 'Indicate method used to screen for child trauma history',
        type: 'radio',
        options: [
          { value: 'tesi', label: 'TESI-PRR' },
          { value: 'other', label: 'Other (specify)' },
        ],
      },
    ],
  },
  {
    id: 'caregiverTraumaResponse',
    title: "Caregiver Response to Child's Trauma",
    items: [
      {
        id: 'item6',
        number: '6',
        text: "Considered caregiver's response to child's trauma history",
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notEquals: NO_TRAUMA_VALUE },
      },
      {
        id: 'item6a',
        number: '6a',
        text: 'Factual response',
        type: 'radio',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notEquals: NO_TRAUMA_VALUE },
        options: [
          { value: 'na', label: 'N/A - Child has no known history of trauma' },
          { value: 'acknowledged', label: 'Acknowledged traumatic event(s) and impact on child' },
          {
            value: 'acknowledged_unsure',
            label: 'Acknowledged traumatic event(s) but may be unsure of impact on child',
          },
          { value: 'denied_impact', label: 'Acknowledged event but denied impact' },
          { value: 'denied', label: "Denied child's experience of documented traumatic events" },
        ],
      },
      {
        id: 'item6b',
        number: '6b',
        text: 'Emotional response',
        type: 'radio',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notEquals: NO_TRAUMA_VALUE },
        options: [
          { value: 'na', label: 'N/A - Child has no known history of trauma' },
          {
            value: 'integrated',
            label: 'Integrated: Emotionally integrated, able to talk about experience without being overwhelmed',
          },
          {
            value: 'triggered',
            label: "Triggered: Overwhelmed or flooded by thinking about child's experience",
          },
          {
            value: 'avoidant',
            label: "Avoidant: Avoids thinking about child's experience, blocks or pushes away experience",
          },
          {
            value: 'mixed',
            label: "Mixed Avoidant & Triggered: Overwhelmed by child's experience and actively avoids thinking about it",
          },
        ],
      },
    ],
  },
  {
    id: 'childAssessment',
    title: 'Child Symptom Assessment',
    items: [
      {
        id: 'item7',
        number: '7',
        text: 'Assessed child symptoms',
        type: 'checkbox',
      },
      {
        id: 'item7a',
        number: '7a',
        text: "Method for assessing child's symptoms",
        type: 'multi-checkbox',
        subItems: [
          { id: 'item7a_interview', text: 'Clinical interview' },
          { id: 'item7a_questionnaire', text: 'Standardized questionnaire' },
        ],
      },
      {
        id: 'item7a_instruments',
        text: 'Standardized instruments used (if questionnaire selected)',
        type: 'multi-checkbox',
        subItems: [
          { id: 'cbcl', text: 'CBCL' },
          { id: 'asqse', text: 'ASQ:SE' },
          { id: 'bitsea', text: 'BITSEA' },
          { id: 'itsea', text: 'ITSEA' },
          { id: 'pkbs2', text: 'PKBS-2' },
          { id: 'sdq', text: 'SDQ' },
          { id: 'item7a_other', text: 'Other' },
        ],
      },
      {
        id: 'item8',
        number: '8',
        text: 'Assessed child trauma symptoms',
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notEquals: NO_TRAUMA_VALUE },
      },
      {
        id: 'item8a',
        number: '8a',
        text: "Method for assessing child's trauma symptoms",
        type: 'multi-checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notEquals: NO_TRAUMA_VALUE },
        subItems: [
          { id: 'tscyc', text: 'TSCYC' },
          { id: 'dipa', text: 'DIPA' },
          { id: 'papa', text: 'PAPA' },
          { id: 'pie', text: 'P.I.E.' },
          { id: 'item8a_interview', text: 'Interview' },
          { id: 'item8a_none', text: 'None' },
          { id: 'item8a_other', text: 'Other' },
        ],
      },
      {
        id: 'item9',
        number: '9',
        text: 'Assessed child developmental functioning',
        type: 'checkbox',
      },
      {
        id: 'item9a',
        number: '9a',
        text: "Method for assessing child's developmental functioning",
        type: 'multi-checkbox',
        subItems: [
          { id: 'asq_dev', text: 'ASQ - Developmental' },
          { id: 'clinical_obs', text: 'Clinical observation' },
          { id: 'clinical_interview', text: 'Clinical Interview' },
          { id: 'mchat', text: 'M-CHAT-R/F' },
          { id: 'sensory', text: 'Sensory screen' },
          { id: 'item9a_other', text: 'Other' },
        ],
      },
    ],
  },
  {
    id: 'traumaDiscussion',
    title: 'Trauma Discussion',
    items: [
      {
        id: 'item10',
        number: '10',
        text: "Discussed connection between child's symptoms and child's trauma history",
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notEquals: NO_TRAUMA_VALUE },
      },
      {
        id: 'item11',
        number: '11',
        text: 'Discussed trauma reminders',
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notEquals: NO_TRAUMA_VALUE },
      },
      {
        id: 'item12',
        number: '12',
        text: 'Assessed for child safety risks to engaging in trauma-informed treatment',
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notEquals: NO_TRAUMA_VALUE },
      },
      {
        id: 'item12a',
        number: '12a',
        text: 'Code any safety risks',
        type: 'radio',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notEquals: NO_TRAUMA_VALUE },
        options: [
          { value: 'no_risks', label: "No risks, it seems safe to talk about the child's experience of trauma with the child" },
          { value: 'yes_risks', label: 'Yes, there are potential safety risks' },
        ],
      },
    ],
  },
  {
    id: 'observations',
    title: 'Observations & Play Assessment',
    items: [
      {
        id: 'item13',
        number: '13',
        text: 'Observed child and caregiver interaction',
        type: 'checkbox',
      },
      {
        id: 'cf7',
        number: 'CF7',
        text: 'Conducted play assessment',
        type: 'checkbox',
        childFirstOnly: true,
      },
      {
        id: 'item14',
        number: '14',
        text: 'Discussed impact of child trauma treatment on caregivers',
        type: 'checkbox',
        conditionalOn: { field: TRAUMA_TRIGGER_FIELD, notEquals: NO_TRAUMA_VALUE },
      },
    ],
  },
  {
    id: 'caregiverTrauma',
    title: 'Caregiver Trauma Screening',
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
        text: 'Asked caregiver to jointly complete a caregiver trauma screening instrument',
        type: 'checkbox',
      },
      {
        id: 'item16a',
        number: '16a',
        text: 'Caregiver response',
        type: 'radio',
        options: [
          { value: 'no_trauma', label: 'Reports s/he has not experienced any traumatic events' },
          { value: 'agreed', label: 'Agreed to complete screening instrument' },
          { value: 'described', label: 'Did not agree to screening instrument but did describe his/her history' },
          { value: 'later', label: 'Did not want to talk about own trauma history now but is open to talking about it later' },
          { value: 'refused', label: 'Did not want to talk about own trauma history' },
        ],
      },
      {
        id: 'item16b',
        number: '16b',
        text: 'Indicate instrument used to screen for caregiver trauma history',
        type: 'radio',
        options: [
          { value: 'lscr', label: 'LSC-R' },
          { value: 'other', label: 'Other (specify)' },
        ],
      },
    ],
  },
  {
    id: 'caregiverSymptoms',
    title: 'Caregiver Symptom Assessment',
    items: [
      {
        id: 'item17',
        number: '17',
        text: 'Shared rationale for asking about caregiver symptoms',
        type: 'checkbox',
      },
      {
        id: 'item18',
        number: '18',
        text: 'Introduced caregiver symptom measures',
        type: 'checkbox',
      },
      {
        id: 'item18a',
        number: '18a',
        text: 'Caregiver response',
        type: 'radio',
        options: [
          { value: 'agreed', label: 'Agreed to complete questionnaires regarding his/her symptoms' },
          { value: 'described', label: 'Did not agree to questionnaire but did describe symptoms' },
          { value: 'later', label: 'Did not want to talk about own symptoms now but is open to maybe talking about it later' },
          { value: 'refused', label: 'Did not want to talk about own symptoms' },
        ],
      },
      {
        id: 'item18b',
        number: '18b',
        text: 'Indicate method used to assess caregiver PTSD',
        type: 'multi-checkbox',
        subItems: [
          { id: 'na_trauma', text: 'NA No Trauma Hx' },
          { id: 'ptsd_none', text: 'None' },
          { id: 'pclc', text: 'PCL-C/PCL-5' },
          { id: 'pssi', text: 'PSSI' },
          { id: 'ptsd_interview', text: 'Clinical Interview' },
          { id: 'ptsd_other', text: 'Other' },
        ],
      },
      {
        id: 'item18c',
        number: '18c',
        text: 'Indicate method used to assess caregiver depression',
        type: 'multi-checkbox',
        subItems: [
          { id: 'dep_none', text: 'None' },
          { id: 'cesd', text: 'CES-D' },
          { id: 'dep_interview', text: 'Clinical Interview' },
          { id: 'dep_other', text: 'Other' },
        ],
      },
      {
        id: 'item18d',
        number: '18d',
        text: 'Indicate other instruments used to assess caregiver mood or functioning',
        type: 'multi-checkbox',
        subItems: [
          { id: 'mood_none', text: 'None' },
          { id: 'psi4sf', text: 'PSI-4-SF' },
          { id: 'mood_other', text: 'Other' },
        ],
      },
    ],
  },
  {
    id: 'collateralInfo',
    title: 'Collateral Information & Formulation',
    items: [
      {
        id: 'cf8',
        number: 'CF8',
        text: 'Collected other required assessments in Child First Assessment Protocol',
        type: 'multi-checkbox',
        childFirstOnly: true,
        subItems: [
          { id: 'pq', text: 'PQ' },
          { id: 'sniff', text: 'SNIFF' },
          { id: 'ccis', text: 'CCIS' },
          { id: 'hope', text: 'HOPE' },
        ],
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
      {
        id: 'item19',
        number: '19',
        text: 'Processed information gathered during assessment/engagement with supervisor/colleague',
        type: 'checkbox',
      },
      {
        id: 'cf14',
        number: 'CF14',
        text: 'Clinical Team developed case formulation',
        type: 'checkbox',
        childFirstOnly: true,
      },
    ],
  },
]

// Helper to check if an item should be visible based on conditional logic
export function isItemVisible(
  item: AssessmentItem,
  formValues: Record<string, unknown>
): boolean {
  if (!item.conditionalOn) return true

  const { field, notEquals, equals } = item.conditionalOn
  const fieldValue = getNestedValue(formValues, field)

  if (notEquals !== undefined) {
    return fieldValue !== notEquals && fieldValue !== ''
  }
  if (equals !== undefined) {
    return fieldValue === equals
  }

  return true
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}
