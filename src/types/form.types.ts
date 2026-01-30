// ========================================
// Core Form Data Types
// ========================================

export interface FormData {
  caseIdentification: CaseIdentification
  targetChild: TargetChild
  siblings: Sibling[]
  caregivers: Caregiver[]
  fidelityStrands: FidelityStrands
  contactLog: ContactLogEntry[]
  assessmentChecklist: AssessmentChecklist
  traumaFeedback: TraumaFeedback
  formulation: FormulationPlanning
  planOfCare: PlanOfCare
  homeVisit: HomeVisitChecklists
  cppObjectives: CPPObjectives
  careCoordinator: CareCoordinator
}

// ========================================
// Case Identification
// ========================================

export interface CaseIdentification {
  clinicalTeamNames: string
  clientInitials: string
  date: string
  referralSource: string
  referralReason: string
}

// ========================================
// Target Child
// ========================================

export interface TargetChild {
  ageInMonths: number | null
  gender: string
  ethnicity: string[]
  primaryLanguage: string
  otherLanguages: string[]
  insuranceType: string
  livingSituation: string
  currentPlacement: string
}

// ========================================
// Siblings
// ========================================

export interface Sibling {
  id: string
  initials: string
  ageInMonths: number | null
  gender: string
  relationship: string
  livesWithChild: boolean
  includedInTreatment: boolean
}

// ========================================
// Caregivers
// ========================================

export interface Caregiver {
  id: string
  initials: string
  relationship: string
  age: number | null
  gender: string
  ethnicity: string[]
  primaryLanguage: string
  education: string
  employment: string
  isPrimaryCaregiver: boolean
  livesWithChild: boolean
}

// ========================================
// Fidelity Strands
// ========================================

export type ChallengeRating = 0 | 1 | 2 | 3 | null
export type CapacityRating = 0 | 1 | 2 | null

export interface FidelityStrand {
  challengeItems: Record<string, ChallengeRating>
  capacityItems: Record<string, CapacityRating>
}

export interface FidelityStrands {
  strand1: FidelityStrand
  strand2: FidelityStrand
  strand3: FidelityStrand
  strand4: FidelityStrand
  strand5: FidelityStrand
}

// ========================================
// Contact Log
// ========================================

export interface ContactLogEntry {
  id: string
  sessionNumber: number
  date: string
  contactType: string
  sessionStatus: string
  reasonNotAttending: string
  sessionLocation: string
  whoAttended: string[]
  sessionDuration: number | null
  travelTime: number | null
  notes: string
}

// ========================================
// Assessment Checklist
// ========================================

export interface AssessmentChecklistItem {
  done: boolean
  response?: string
  subItems?: Record<string, boolean>
  na?: boolean
}

export interface AssessmentChecklist {
  childTraumaHistory: string
  items: Record<string, AssessmentChecklistItem>
}

// ========================================
// Trauma Feedback
// ========================================

export interface TraumaFeedback {
  sessionDate: string
  items: Record<string, number | null>
  notes: string
}

// ========================================
// Formulation & Planning
// ========================================

export interface FormulationPlanning {
  presentingProblems: string
  traumaHistory: string
  developmentalHistory: string
  familyContext: string
  strengths: string
  treatmentGoals: string
  interventionPlan: string
}

// ========================================
// Plan of Care
// ========================================

export interface PlanOfCareGoal {
  id: string
  goal: string
  objectives: string[]
  interventions: string
  targetDate: string
  progress: string
}

export interface PlanOfCare {
  goals: PlanOfCareGoal[]
  safetyPlan: string
  crisisContacts: string
}

// ========================================
// Home Visit Checklists
// ========================================

export interface HomeVisitChecklists {
  beforeVisit: Record<string, boolean>
  duringVisit: Record<string, boolean>
  afterVisit: Record<string, boolean>
}

// ========================================
// CPP Objectives
// ========================================

export type ClinicalFocusRating = 0 | 1 | 2 | 3 | null
export type AppropriatenessRating = 'appropriate' | 'not_appropriate' | 'na' | null
export type ProgressRating = 'significant' | 'moderate' | 'minimal' | 'none' | 'na' | null

export interface CPPObjective {
  clinicalFocus: ClinicalFocusRating
  appropriateness: AppropriatenessRating
  progress: ProgressRating
  interventions: string[]
  notes: string
}

export interface CPPObjectives {
  objectives: Record<string, CPPObjective>
}

// ========================================
// Care Coordinator Interventions
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
// Case Management Types
// ========================================

export interface CaseMeta {
  id: string
  clientInitials: string
  createdAt: number
  updatedAt: number
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
