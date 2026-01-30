// ========================================
// Care Coordinator Interventions Form Types
// ========================================

export interface CareCoordinatorFormData {
  identification: CCIdentification
  collaborativeAssessment: CollaborativeAssessmentSection
  assessmentMeasures: AssessmentMeasuresSection
  familyMeetings: FamilyMeetingsSection
  careCoordination: CareCoordinationSection
  planOfCare: CCPlanOfCareSection
  servicesSupports: ServicesSupportsSection
  executiveFunctioning: ExecutiveFunctioningSection
  ongoingIntervention: OngoingInterventionSection
}

// ========================================
// Identification
// ========================================

export interface CCIdentification {
  careCoordinatorName: string
  clinicalDirector: string
  clientInitials: string
  childFirstSite: string
  date: string
}

// ========================================
// Done/NA Response Type
// ========================================

export type DoneNAResponse = 'done' | 'na' | 'utd' | null

// ========================================
// Assessment Measures Tracking
// ========================================

export type MeasureStatus = 'in_process' | 'completed' | 'entered' | null

export interface MeasureTracking {
  inProcess: boolean
  completed: boolean
  entered: boolean
}

export interface AssessmentMeasuresSection {
  baseline: MeasureTracking
  sixMonths: MeasureTracking
  termination: MeasureTracking
}

// ========================================
// Sections
// ========================================

export interface CollaborativeAssessmentSection {
  items: Record<string, DoneNAResponse>
}

export interface FamilyMeetingsSection {
  items: Record<string, DoneNAResponse>
}

export interface CareCoordinationSection {
  items: Record<string, DoneNAResponse>
}

export interface CCPlanOfCareSection {
  items: Record<string, DoneNAResponse>
}

export interface ServicesSupportsSection {
  assessmentItems: Record<string, DoneNAResponse>
  resourceItems: Record<string, DoneNAResponse>
}

export interface ExecutiveFunctioningSection {
  generalItems: Record<string, DoneNAResponse>
  efSkillsItems: Record<string, DoneNAResponse>
  focusAreaItems: Record<string, DoneNAResponse>
}

export interface OngoingInterventionSection {
  items: Record<string, DoneNAResponse>
}

// ========================================
// Case Management
// ========================================

export interface CCCaseMeta {
  id: string
  clientInitials: string
  careCoordinatorName: string
  date: string
  createdAt: number
  updatedAt: number
}

export interface CCCasesIndex {
  cases: CCCaseMeta[]
}

// ========================================
// Progress
// ========================================

export interface CCProgress {
  sections: {
    identification: number
    collaborativeAssessment: number
    assessmentMeasures: number
    familyMeetings: number
    careCoordination: number
    planOfCare: number
    servicesSupports: number
    executiveFunctioning: number
    ongoingIntervention: number
  }
  overall: number
}
