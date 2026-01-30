// ========================================
// Case Identification Types
// ========================================

export interface CaseIdentification {
  clinicalTeamNames: string
  clientInitials: string
  childFirstSite: string
  date: string
  careLogicId: string
  cppTreatmentStartDate: string
  languageTreatmentConducted: string[]
  translatorUsed: 'no' | 'sometimes' | 'yes' | ''
}

// ========================================
// Target Child Types
// ========================================

export interface TargetChild {
  ageInMonths: number | ''
  gender: 'male' | 'female' | 'other' | ''
  genderSpecify: string
  ethnicity: string[]
  ethnicitySpecify: string
  languages: string[]
  languageSpecify: string
}

// ========================================
// Sibling Types
// ========================================

export interface Sibling {
  id: string
  ageInYears: number | ''
  gender: 'M' | 'F' | 'O' | ''
  relationToChild: string
  whereResides: string
  inTreatmentWithChild: 'no' | 'sometimes' | 'yes' | ''
}

// ========================================
// Caregiver Types
// ========================================

export interface Caregiver {
  id: string
  caregiverNumber: 1 | 2 | 3
  ageInYears: number | ''
  yearsOfEducation: number | ''
  ethnicity: string[]
  ethnicitySpecify: string
  languages: string[]
  languageSpecify: string
  involvedInTreatment: 'yes' | 'partially' | 'no' | 'unk' | ''
  relationshipToChild: string
}

// ========================================
// Fidelity Strands Types
// ========================================

export type ChallengeRating = 0 | 1 | 2 | 3 | null // None/Low/Moderate/Significant
export type CapacityRating = 0 | 1 | 2 | null // Requires Development/Emerging/Acquired
export type ProceduralCapacityRating = 'no' | 'yes_not_regular' | 'yes_attended' | 'not_needed' | ''

export interface FidelityStrand {
  challengeItems: Record<string, ChallengeRating>
  capacityItems: Record<string, CapacityRating | ProceduralCapacityRating>
}

export interface FidelityStrands {
  strand1: FidelityStrand // Reflective Practice
  strand2: FidelityStrand // Emotional Process
  strand3: FidelityStrand // Dyadic-Relational
  strand4: FidelityStrand // Trauma Framework
  strand5: FidelityStrand // Procedural
}

// ========================================
// Contact Log Types
// ========================================

export type ContactType =
  | 'Assessment'
  | 'Care Coordination'
  | 'Feedback'
  | 'Dyadic Treatment'
  | 'Individual caregiver'
  | 'Individual child'
  | 'Caregiver phone – conversation'
  | 'Caregiver phone – message'
  | 'Collateral – meeting'
  | 'Collateral – phone'
  | 'Collateral – other'
  | 'Team meeting'
  | 'Other'

export type SessionStatus = 'Show' | 'Cancel' | 'No Show' | ''

export type ReasonNotAttending =
  | 'Childcare problem'
  | 'Conflicting appointment'
  | 'Forgot'
  | 'Illness'
  | 'Team member cancelled'
  | 'Transportation'
  | 'Weather'
  | 'Other'
  | ''

export type SessionLocation = 'Home' | 'Clinic' | 'Community' | 'Other' | ''

export interface ContactLogEntry {
  id: string
  date: string
  contactType: ContactType | ''
  minutes: number | ''
  sessionStatus: SessionStatus
  reasonNotAttending: ReasonNotAttending
  whoAttended: string[]
  collateralSpecify: string
  whereHeld: SessionLocation
  sessionCounter: number
}

// ========================================
// Assessment Checklist Types
// ========================================

export type TraumaHistoryOption =
  | 'a' // No known history of trauma
  | 'b' // Clinician met alone with caregiver and screened using TESI
  | 'c' // Caregiver not aware, clinician used TESI with other sources
  | 'd' // Caregiver refused TESI but provided details
  | 'e' // Caregiver refused TESI and refused to talk
  | ''

export interface AssessmentChecklistItem {
  done: boolean
  na: boolean
  response?: string | string[] | boolean
  subItems?: Record<string, boolean | string>
}

export interface AssessmentChecklist {
  childTraumaHistory: TraumaHistoryOption
  items: Record<string, AssessmentChecklistItem>
}

// ========================================
// Trauma Feedback Session Types
// ========================================

export type FeedbackQualityRating = 0 | 1 | 2 | null // Not Done/Partial/Full

export interface TraumaFeedbackSession {
  sessionDate: string
  notes: string
  items: Record<string, FeedbackQualityRating>
}

// ========================================
// Formulation and Treatment Planning Types
// ========================================

export interface FormulationPlanning {
  items: Record<string, AssessmentChecklistItem>
}

// ========================================
// Home Visit Checklists Types
// ========================================

export interface HomeVisitChecklists {
  before: Record<string, boolean | null>
  during: Record<string, boolean | null>
  after: Record<string, boolean | null>
}

// ========================================
// CPP Objectives Types
// ========================================

export type ClinicalFocusRating = 0 | 1 | 2 | 3 | null
export type AppropriatenessRating = 'under' | 'appropriate' | 'over' | ''
export type ProgressRating = 0 | 1 | 2 | 3 | null

export interface CPPObjective {
  clinicalFocus: ClinicalFocusRating
  appropriateness: AppropriatenessRating
  progressAtReferral: ProgressRating
  progressCurrent: ProgressRating
  interventions: string[]
}

export interface CPPObjectives {
  [objectiveId: string]: CPPObjective
}

// ========================================
// Care Coordinator Interventions Types
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

export interface CareCoordinator {
  careCoordinatorName: string
  clinicalDirectorName: string
  clientInitials: string
  childFirstSite: string
  date: string
  items: Record<string, CareCoordinatorItemValue>
}

// ========================================
// Complete Form Data Type
// ========================================

export interface FormData {
  // Meta
  caseId: string
  lastModified: number
  version: string

  // Demographics
  caseIdentification: CaseIdentification
  targetChild: TargetChild
  siblings: Sibling[]
  caregivers: Caregiver[]

  // Fidelity
  fidelityStrands: FidelityStrands

  // Contact Log
  contactLog: ContactLogEntry[]

  // Assessment & Engagement
  assessmentChecklist: AssessmentChecklist

  // Trauma Feedback
  traumaFeedback: TraumaFeedbackSession

  // Treatment Planning
  formulationPlanning: FormulationPlanning
  childFamilyPlanOfCare: Record<string, AssessmentChecklistItem>

  // Home Visit
  homeVisitChecklists: HomeVisitChecklists

  // CPP Objectives
  cppObjectives: CPPObjectives

  // Care Coordinator Interventions
  careCoordinator: CareCoordinator
}

// ========================================
// Case Management Types
// ========================================

export interface CaseMeta {
  id: string
  name: string
  clientInitials: string
  created: number
  lastModified: number
}

export interface CasesIndex {
  cases: CaseMeta[]
}

// ========================================
// Progress Types
// ========================================

export interface SectionProgress {
  caseIdentification: number
  fidelityStrands: number
  contactLog: number
  assessmentChecklist: number
  traumaFeedback: number
  formulationPlanning: number
  homeVisitChecklists: number
  cppObjectives: number
  careCoordinator: number
}

export interface Progress {
  sections: SectionProgress
  overall: number
}
