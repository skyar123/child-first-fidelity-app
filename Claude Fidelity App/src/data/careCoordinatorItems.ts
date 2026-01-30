// ========================================
// Care Coordinator Interventions Data
// Based on "III Care Coordinator Interventions July 2018"
// ========================================

export type CareCoordinatorItemType =
  | 'checkbox'
  | 'multi-checkbox'
  | 'assessment-tracking' // Special type for baseline/6months/termination tracking

export interface CareCoordinatorSubItem {
  id: string
  text: string
}

export interface AssessmentTrackingItem {
  id: string
  label: string
  inProcess: boolean
  completed: boolean
  entered: boolean
}

export interface CareCoordinatorItem {
  id: string
  text: string
  type: CareCoordinatorItemType
  subItems?: CareCoordinatorSubItem[]
  assessmentTrackingItems?: AssessmentTrackingItem[]
  description?: string
}

export interface CareCoordinatorSection {
  id: string
  title: string
  items: CareCoordinatorItem[]
}

// ========================================
// Care Coordinator Sections Data
// ========================================

export const careCoordinatorSections: CareCoordinatorSection[] = [
  {
    id: 'collaborativeFamilyAssessment',
    title: 'Collaborative Family Assessment',
    items: [
      {
        id: 'cfa1',
        text: 'Administered Intake Part 2: Service Needs Inventory for Families (SNIFF) and discussed results with the caregivers',
        type: 'checkbox',
      },
      {
        id: 'cfa2',
        text: 'Discussed with the caregivers about past and current service history and introduced components of Abecedarian',
        type: 'checkbox',
      },
      {
        id: 'cfa3',
        text: 'Tracked all Assessment Measures',
        type: 'assessment-tracking',
        assessmentTrackingItems: [
          { id: 'baseline', label: 'Baseline', inProcess: false, completed: false, entered: false },
          { id: '6months', label: '6 Months', inProcess: false, completed: false, entered: false },
          { id: 'termination', label: 'Termination', inProcess: false, completed: false, entered: false },
        ],
      },
    ],
  },
  {
    id: 'childFamilyMeetings',
    title: 'Child and Family-Specific Meetings',
    items: [
      {
        id: 'cfm1',
        text: 'Scheduled and planned meetings with child and family supports, if necessary, including: other important family members, school, and community providers',
        type: 'checkbox',
      },
    ],
  },
  {
    id: 'updateIntakePart2',
    title: 'Update Intake Part 2: Care Coordination',
    items: [
      {
        id: 'uip1',
        text: 'Tracked involvement with current and potential future services',
        type: 'checkbox',
      },
      {
        id: 'uip2',
        text: 'Integrated and updated service utilization into SNIFF on a quarterly basis (at a minimum) or more frequently when necessary. These additions have been updated in the record.',
        type: 'checkbox',
      },
    ],
  },
  {
    id: 'developmentPlanOfCare',
    title: 'Development of the Child and Family Plan of Care',
    items: [
      {
        id: 'dpoc1',
        text: 'Actively collaborated with the Clinician in the development of the formulation',
        type: 'checkbox',
      },
      {
        id: 'dpoc2',
        text: 'Actively collaborated with the Clinician and family in the development of the comprehensive Child and Family Plan of Care and subsequent reviews, as needed. (This may include consultation of Learning Games and Treatment Themes document).',
        type: 'checkbox',
      },
    ],
  },
  {
    id: 'servicesAndSupports',
    title: 'Services and Supports',
    items: [
      {
        id: 'sas1',
        text: 'Assessed steps needed for family stabilization',
        type: 'checkbox',
      },
      {
        id: 'sas2',
        text: "Used a reflective stance to assess family's satisfaction, success, and challenges experienced with prior services, in order to gauge future barriers",
        type: 'checkbox',
      },
      {
        id: 'sas3',
        text: 'Identified urgent needs (e.g. food/housing/heat/clothing, risk of eviction) and problem-solving collaboratively',
        type: 'checkbox',
      },
      {
        id: 'sas4',
        text: 'Provided Resources that:',
        type: 'multi-checkbox',
        subItems: [
          {
            id: 'sas4a',
            text: 'Improved quality of home environment for child and family, and reduced stress (e.g. furniture, heat, food, etc.)',
          },
          {
            id: 'sas4b',
            text: 'Promoted quality of dyadic relationship, including playfulness and moments of shared enjoyment (e.g. toys, books, potential transitional objects, Language Priority, Conversational Reading, Learning Games, Enhanced Caregiving, etc.)',
          },
          {
            id: 'sas4c',
            text: 'Met unmet needs (e.g. health provider, domestic violence services, IDEA Part C early intervention, adult mental health, or substance abuse services)',
          },
          {
            id: 'sas4d',
            text: 'Enhanced child and caregiver development and growth (e.g. early care and education, adult literacy, job training, Family Resource Center, Language Priority, Conversational Reading, Learning Games, Enhanced Caregiving, etc.)',
          },
        ],
      },
    ],
  },
  {
    id: 'promotedCaregiverExecutiveFunctioning',
    title: 'Promoted Caregiver Executive Functioning',
    items: [
      {
        id: 'pcef1',
        text: 'Maintained a reflective and collaborative stance when working with caregiver; supported, encouraged and coached; did not direct',
        type: 'checkbox',
      },
      {
        id: 'pcef2',
        text: 'Integrated Abecedarian techniques into treatment whenever possible, and worked to complement clinical work',
        type: 'checkbox',
      },
      {
        id: 'pcef3',
        text: 'Promoted Executive Functioning skills:',
        type: 'multi-checkbox',
        subItems: [
          {
            id: 'pcef3a',
            text: 'Helped caregiver shift perspectives and adapt to new demands',
          },
          {
            id: 'pcef3b',
            text: 'Helped caregiver prioritize goals, break down task into components, and sequence steps to reach desired outcome',
          },
          {
            id: 'pcef3c',
            text: 'Helped caregiver reflect on possible outcomes (what if…), what could go right or wrong? How would s/he evaluate? What could s/he do?',
          },
          {
            id: 'pcef3d',
            text: 'Helped caregiver reflect on progress, monitor whether goal was accomplished, and develop new strategies if needed',
          },
          {
            id: 'pcef3e',
            text: 'Empowered caregiver to take initiative',
          },
          {
            id: 'pcef3f',
            text: 'Reassured caregiver and praised the steps that s/he took',
          },
          {
            id: 'pcef3g',
            text: 'Helped caregiver develop concrete memory strategies',
          },
          {
            id: 'pcef3h',
            text: 'Helped caregiver become calm and relaxed with body-based and/or Abecedarian play-based strategies so that s/he could focus and think',
          },
        ],
      },
      {
        id: 'pcef4',
        text: 'Focused on specific areas:',
        type: 'multi-checkbox',
        subItems: [
          {
            id: 'pcef4a',
            text: 'Enhanced time management skills',
          },
          {
            id: 'pcef4b',
            text: 'Encouraged caregiver to establish family routines and rules (e.g. Learning Games may be used here)',
          },
          {
            id: 'pcef4c',
            text: 'Enhanced household organization',
          },
          {
            id: 'pcef4d',
            text: 'Facilitated scheduling and attendance at appointments',
          },
          {
            id: 'pcef4e',
            text: 'Enhanced budgeting skills',
          },
          {
            id: 'pcef4f',
            text: 'Enhanced transportation skills',
          },
          {
            id: 'pcef4g',
            text: 'Enhanced caregiving through predictable structure and routines infused with language (e.g. Enriched caregiving)',
          },
          {
            id: 'pcef4h',
            text: 'Enhanced communication through reading and other language-rich activities (e.g. Conversational Reading)',
          },
          {
            id: 'pcef4i',
            text: 'Enhanced caregiving through play (e.g. Learning Games)',
          },
        ],
      },
    ],
  },
  {
    id: 'ongoingIntervention',
    title: 'Ongoing Intervention',
    items: [
      {
        id: 'oi1',
        text: 'Followed up to ensure that family has access services. Continually assessed progress, caregiver satisfaction, and sustainability of services obtained',
        type: 'checkbox',
      },
      {
        id: 'oi2',
        text: 'Continued to be an advocate for the child and family with current service providers',
        type: 'checkbox',
      },
      {
        id: 'oi3',
        text: 'Supported Clinician in provision of developmental guidance',
        type: 'checkbox',
      },
      {
        id: 'oi4',
        text: 'Modeled strong interpersonal relationships through excellent communication and problem-solving with Clinician teammate',
        type: 'checkbox',
      },
      {
        id: 'oi5',
        text: 'Worked collaboratively with Clinician to support other children in the home',
        type: 'checkbox',
      },
    ],
  },
]

// ========================================
// Helper Functions
// ========================================

// Get total item count across all sections
export function getTotalItemCount(): number {
  let count = 0
  for (const section of careCoordinatorSections) {
    for (const item of section.items) {
      if (item.type === 'checkbox') {
        count++
      } else if (item.type === 'multi-checkbox' && item.subItems) {
        count += item.subItems.length
      } else if (item.type === 'assessment-tracking' && item.assessmentTrackingItems) {
        // Each tracking item has 3 checkboxes, but we count the whole group as complete if all are done
        count += item.assessmentTrackingItems.length
      }
    }
  }
  return count
}

// Calculate progress for the Care Coordinator section
export function calculateCareCoordinatorProgress(
  items: Record<string, CareCoordinatorItemValue>
): number {
  let completed = 0
  let total = 0

  for (const section of careCoordinatorSections) {
    for (const item of section.items) {
      if (item.type === 'checkbox') {
        total++
        if (items[item.id]?.done || items[item.id]?.na) {
          completed++
        }
      } else if (item.type === 'multi-checkbox' && item.subItems) {
        for (const subItem of item.subItems) {
          total++
          if (items[item.id]?.subItems?.[subItem.id]) {
            completed++
          }
        }
      } else if (item.type === 'assessment-tracking' && item.assessmentTrackingItems) {
        for (const trackingItem of item.assessmentTrackingItems) {
          total++
          const tracking = items[item.id]?.assessmentTracking?.[trackingItem.id]
          // Consider complete if either completed or entered is checked
          if (tracking?.completed || tracking?.entered) {
            completed++
          }
        }
      }
    }
  }

  return total > 0 ? Math.round((completed / total) * 100) : 0
}

// ========================================
// Types for Form Data
// ========================================

export interface AssessmentTrackingValue {
  inProcess: boolean
  completed: boolean
  entered: boolean
}

export interface CareCoordinatorItemValue {
  done?: boolean
  na?: boolean
  subItems?: Record<string, boolean>
  assessmentTracking?: Record<string, AssessmentTrackingValue>
}

export interface CareCoordinatorData {
  careCoordinatorName: string
  clinicalDirectorName: string
  clientInitials: string
  childFirstSite: string
  date: string
  items: Record<string, CareCoordinatorItemValue>
}
