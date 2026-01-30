// Supervision Fidelity Form Data Configuration
// Based on V SUPERVISION FIDELITY 2015-Pink fillable document

// ========================================
// Rating Labels
// ========================================

export const YES_NO_LABELS: Record<string, string> = {
  yes: 'Yes (usually, ≥80% of time)',
  no: 'No'
}

export const CAPACITY_FOCUS_LABELS: Record<string, string> = {
  could_do_less: 'Could Do Less',
  could_do_more: 'Could Do More',
  appropriate: 'Appropriate',
  strength: 'Strength'
}

export const GLOBAL_RATING_LABELS: Record<string, string> = {
  not_at_all: 'Not at all',
  a_little: 'A little',
  somewhat: 'Somewhat',
  very: 'Very',
  extremely: 'Extremely'
}

// ========================================
// Item Types
// ========================================

export interface SupervisionItem {
  id: string
  text: string
  childFirstOnly?: boolean
  clinicianOnly?: boolean
  careCoordinatorOnly?: boolean
}

export interface SupervisionSection {
  id: string
  title: string
  description?: string
  items: SupervisionItem[]
}

// ========================================
// Procedural Fidelity Items
// ========================================

export const proceduralFidelityItems: SupervisionItem[] = [
  {
    id: 'pf1',
    text: 'Clinical Director/Supervisor as a rule provides weekly supervision or coverage for absences'
  },
  {
    id: 'pf2',
    text: 'Clinical Director/Supervisor advises supervisee of vacations and other absences'
  },
  {
    id: 'pf3',
    text: 'Supervisee as a rule attends weekly individual supervision'
  },
  {
    id: 'pf4',
    text: 'Supervisee as a rule attends weekly Team supervision',
    childFirstOnly: true
  },
  {
    id: 'pf5',
    text: 'Supervisee as a rule attends weekly group supervision/consultation',
    childFirstOnly: true
  },
  {
    id: 'pf6',
    text: 'Supervisee advises Clinical Director/Supervisor of vacations and other absences'
  },
  {
    id: 'pf7',
    text: 'Supervisee comes prepared to supervision with case notes or other case material'
  }
]

// ========================================
// Supervisor Capacity Items
// ========================================

export const supervisorCapacityGeneralItems: SupervisionItem[] = [
  { id: 'sc1', text: 'Create a safe space' },
  { id: 'sc2', text: 'Offer supportive feedback' },
  { id: 'sc3', text: "Remember the cases and supervisee's needs" },
  { id: 'sc4', text: 'Create an atmosphere that promotes reflection' },
  { id: 'sc5', text: 'Help the therapist consider his/her emotional reactions related to the case' },
  { id: 'sc6', text: 'Help the therapist process his/her own emotional reactions' },
  { id: 'sc7', text: "Help the therapist consider different perspectives (e.g. Clinician's, Care Coordinator's, caregiver's, child's, system's)" },
  { id: 'sc8', text: 'Consider possible cultural and contextual influences' },
  { id: 'sc9', text: "Consider family member's (e.g. child, caregiver's) emotional reactions" },
  { id: 'sc10', text: "Develop interventions to address family members' dysregulated emotions" },
  { id: 'sc11', text: 'Consider the degree to which interventions held the perspective of different family members' },
  { id: 'sc12', text: 'Develop relationship enhancing interventions' },
  { id: 'sc13', text: "Understand the connection between child and/or caregiver's trauma history and their behavior in session" }
]

export const supervisorCapacityClinicianItems: SupervisionItem[] = [
  { id: 'scc1', text: 'Consider ways to address the trauma', clinicianOnly: true },
  { id: 'scc2', text: 'Recognize CPP goals addressed during the session (e.g. safety, affect regulation, put trauma in perspective)', clinicianOnly: true },
  { id: 'scc3', text: 'Consider ways to address additional CPP goals', clinicianOnly: true }
]

export const supervisorCapacityCareCoordItems: SupervisionItem[] = [
  {
    id: 'sccc1',
    text: "Develop care coordination interventions that enhance growth, reduce stress and enhance the family members' relationships",
    careCoordinatorOnly: true
  },
  {
    id: 'sccc2',
    text: "Develop intervention to enhance caregiver's executive functioning capacity (e.g., development of family routines, family rules, household organization, scheduling and going to appointments, budgeting, planning transportation, planning for the future, monitoring and reflecting on success)",
    careCoordinatorOnly: true
  }
]

// ========================================
// Knowledge Areas Items
// ========================================

export const knowledgeAreasGeneralItems: SupervisionItem[] = [
  { id: 'ka1', text: 'Early childhood development (social, emotional, and cognitive)' },
  { id: 'ka2', text: 'Understanding the impact of trauma for caregivers and children' },
  { id: 'ka3', text: "The potential meaning of children's play and/or behavior" },
  { id: 'ka4', text: 'Sociological and cultural influences on development' },
  { id: 'ka5', text: 'Understanding and working with caregivers, understanding adult development' },
  { id: 'ka6', text: 'Understanding parenthood as a developmental phase' },
  { id: 'ka7', text: 'Understanding contextual influences on parenting' }
]

export const knowledgeAreasCareCoordItems: SupervisionItem[] = [
  { id: 'kacc1', text: 'Collaboration with systems of care', careCoordinatorOnly: true },
  { id: 'kacc2', text: 'Executive Functioning', careCoordinatorOnly: true }
]

// ========================================
// Skills & Competencies Items
// ========================================

export const skillsCompetenciesGeneralItems: SupervisionItem[] = [
  { id: 'skc1', text: "Eliciting the family's cultural values and perspectives" },
  { id: 'skc2', text: 'Developing self-reflection around personal cultural values and beliefs' },
  { id: 'skc3', text: "Understanding the impact of the supervisee's personal history and its impact on intervention with the caregiver" },
  { id: 'skc4', text: 'Collaborating with other service systems and/or engaging in case management' },
  { id: 'skc5', text: 'Working with ports of entry' }
]

export const skillsCompetenciesClinicianItems: SupervisionItem[] = [
  { id: 'skcc1', text: 'CPP case conceptualization', clinicianOnly: true },
  { id: 'skcc2', text: 'Observing and understanding child and caregiver behavior', clinicianOnly: true },
  { id: 'skcc3', text: 'Translation, serving as a conduit between caregiver and child', clinicianOnly: true },
  { id: 'skcc4', text: 'Fostering dyadic affect regulation', clinicianOnly: true },
  { id: 'skcc5', text: 'Fostering the development of a trauma narrative', clinicianOnly: true },
  { id: 'skcc6', text: 'Learning specific CPP intervention techniques', clinicianOnly: true }
]

export const skillsCompetenciesCareCoordItems: SupervisionItem[] = [
  { id: 'skccc1', text: 'Reflecting on the meaning behind parental lack of follow-through in accessing requested services', careCoordinatorOnly: true },
  { id: 'skccc2', text: 'Partnering with (not directing) family in accessing services and supports', careCoordinatorOnly: true },
  { id: 'skccc3', text: 'Playing interactively with child and siblings', careCoordinatorOnly: true },
  { id: 'skccc4', text: 'Working to improve executive functioning skills to enhance caregiver functioning', careCoordinatorOnly: true }
]

// ========================================
// Global Ratings Items
// ========================================

export const globalRatingItems: SupervisionItem[] = [
  { id: 'gr1', text: 'How knowledgeable is your Clinical Director/Supervisor in CPP?' },
  { id: 'gr2', text: 'How skilled is your Clinical Director/Supervisor in implementing CPP interventions?' },
  { id: 'gr3', text: 'How skilled is your Clinical Director/Supervisor in teaching CPP?' }
]

// ========================================
// Helper Functions
// ========================================

export function getTotalProceduralItems(): number {
  return proceduralFidelityItems.length
}

export function getTotalCapacityItems(): number {
  return (
    supervisorCapacityGeneralItems.length +
    supervisorCapacityClinicianItems.length +
    supervisorCapacityCareCoordItems.length
  )
}

export function getTotalKnowledgeItems(): number {
  return knowledgeAreasGeneralItems.length + knowledgeAreasCareCoordItems.length
}

export function getTotalSkillsItems(): number {
  return (
    skillsCompetenciesGeneralItems.length +
    skillsCompetenciesClinicianItems.length +
    skillsCompetenciesCareCoordItems.length
  )
}
