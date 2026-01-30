// ========================================
// Supervision Fidelity Form Types
// ========================================

export interface SupervisionFormData {
  identification: SupervisionIdentification
  proceduralFidelity: ProceduralFidelitySection
  supervisorCapacity: SupervisorCapacitySection
  knowledgeAreas: KnowledgeAreasSection
  skillsCompetencies: SkillsCompetenciesSection
  globalRatings: GlobalRatingsSection
  supervisionLog: SupervisionLogEntry[]
}

// ========================================
// Identification
// ========================================

export interface SupervisionIdentification {
  clinicalTeamNames: string
  childFirstSite: string
  monthYear: string
}

// ========================================
// Procedural Fidelity
// ========================================

export type YesNoResponse = 'yes' | 'no' | null

export interface ProceduralFidelitySection {
  items: Record<string, YesNoResponse>
}

// ========================================
// Capacity/Focus Rating
// ========================================

export type CapacityFocusRating = 'could_do_less' | 'could_do_more' | 'appropriate' | 'strength' | null

export interface SupervisorCapacitySection {
  generalItems: Record<string, CapacityFocusRating>
  clinicianOnlyItems: Record<string, CapacityFocusRating>
  careCoordinatorOnlyItems: Record<string, CapacityFocusRating>
}

// ========================================
// Knowledge Areas
// ========================================

export interface KnowledgeAreasSection {
  generalItems: Record<string, CapacityFocusRating>
  careCoordinatorOnlyItems: Record<string, CapacityFocusRating>
}

// ========================================
// Skills & Competencies
// ========================================

export interface SkillsCompetenciesSection {
  generalItems: Record<string, CapacityFocusRating>
  clinicianOnlyItems: Record<string, CapacityFocusRating>
  careCoordinatorOnlyItems: Record<string, CapacityFocusRating>
}

// ========================================
// Global Ratings
// ========================================

export type GlobalRating = 'not_at_all' | 'a_little' | 'somewhat' | 'very' | 'extremely' | null

export interface GlobalRatingsSection {
  items: Record<string, GlobalRating>
  strengthsAndSuggestions: string
}

// ========================================
// Supervision Log
// ========================================

export interface SupervisionLogEntry {
  id: string
  date: string
  numSupervisees: number | null
  minutes: number | null
  percentClinical: string
  counter: string
  notes: string
}

// ========================================
// Case Management
// ========================================

export interface SupervisionCaseMeta {
  id: string
  clinicalTeamNames: string
  monthYear: string
  createdAt: number
  updatedAt: number
}

export interface SupervisionCasesIndex {
  cases: SupervisionCaseMeta[]
}

// ========================================
// Progress
// ========================================

export interface SupervisionProgress {
  sections: {
    identification: number
    proceduralFidelity: number
    supervisorCapacity: number
    knowledgeAreas: number
    skillsCompetencies: number
    globalRatings: number
    supervisionLog: number
  }
  overall: number
}
