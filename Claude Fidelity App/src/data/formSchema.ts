import type {
  FormData,
  CaseIdentification,
  TargetChild,
  Sibling,
  Caregiver,
  FidelityStrands,
  ContactLogEntry,
  AssessmentChecklist,
  TraumaFeedbackSession,
  FormulationPlanning,
  HomeVisitChecklists,
  CPPObjectives,
  CPPObjective,
  CareCoordinator,
} from '@/types/form.types'

// ========================================
// Default Values
// ========================================

export const defaultCaseIdentification: CaseIdentification = {
  clinicalTeamNames: '',
  clientInitials: '',
  childFirstSite: '',
  date: '',
  careLogicId: '',
  cppTreatmentStartDate: '',
  languageTreatmentConducted: [],
  translatorUsed: '',
}

export const defaultTargetChild: TargetChild = {
  ageInMonths: '',
  gender: '',
  genderSpecify: '',
  ethnicity: [],
  ethnicitySpecify: '',
  languages: [],
  languageSpecify: '',
}

export const createSibling = (): Sibling => ({
  id: crypto.randomUUID(),
  ageInYears: '',
  gender: '',
  relationToChild: '',
  whereResides: '',
  inTreatmentWithChild: '',
})

export const createCaregiver = (num: 1 | 2 | 3): Caregiver => ({
  id: crypto.randomUUID(),
  caregiverNumber: num,
  ageInYears: '',
  yearsOfEducation: '',
  ethnicity: [],
  ethnicitySpecify: '',
  languages: [],
  languageSpecify: '',
  involvedInTreatment: '',
  relationshipToChild: '',
})

export const defaultFidelityStrands: FidelityStrands = {
  strand1: { challengeItems: {}, capacityItems: {} },
  strand2: { challengeItems: {}, capacityItems: {} },
  strand3: { challengeItems: {}, capacityItems: {} },
  strand4: { challengeItems: {}, capacityItems: {} },
  strand5: { challengeItems: {}, capacityItems: {} },
}

export const createContactLogEntry = (sessionCounter: number): ContactLogEntry => ({
  id: crypto.randomUUID(),
  date: '',
  contactType: '',
  minutes: '',
  sessionStatus: '',
  reasonNotAttending: '',
  whoAttended: [],
  collateralSpecify: '',
  whereHeld: '',
  sessionCounter,
})

export const defaultAssessmentChecklist: AssessmentChecklist = {
  childTraumaHistory: '',
  items: {},
}

export const defaultTraumaFeedback: TraumaFeedbackSession = {
  sessionDate: '',
  notes: '',
  items: {},
}

export const defaultFormulationPlanning: FormulationPlanning = {
  items: {},
}

export const defaultHomeVisitChecklists: HomeVisitChecklists = {
  before: {},
  during: {},
  after: {},
}

export const createDefaultCPPObjective = (): CPPObjective => ({
  clinicalFocus: null,
  appropriateness: '',
  progressAtReferral: null,
  progressCurrent: null,
  interventions: [],
})

export const defaultCPPObjectives: CPPObjectives = {}

export const defaultCareCoordinator: CareCoordinator = {
  careCoordinatorName: '',
  clinicalDirectorName: '',
  clientInitials: '',
  childFirstSite: '',
  date: '',
  items: {},
}

// ========================================
// Complete Default Form State
// ========================================

export const createDefaultFormData = (caseId?: string): FormData => ({
  caseId: caseId || crypto.randomUUID(),
  lastModified: Date.now(),
  version: '1.0',

  caseIdentification: { ...defaultCaseIdentification },
  targetChild: { ...defaultTargetChild },
  siblings: [],
  caregivers: [],

  fidelityStrands: JSON.parse(JSON.stringify(defaultFidelityStrands)),

  contactLog: [],

  assessmentChecklist: { ...defaultAssessmentChecklist, items: {} },

  traumaFeedback: { ...defaultTraumaFeedback },

  formulationPlanning: { ...defaultFormulationPlanning, items: {} },
  childFamilyPlanOfCare: {},

  homeVisitChecklists: JSON.parse(JSON.stringify(defaultHomeVisitChecklists)),

  cppObjectives: {},

  careCoordinator: { ...defaultCareCoordinator, items: {} },
})

// ========================================
// Options / Enums
// ========================================

export const ETHNICITY_OPTIONS = [
  { value: 'african_american', label: 'African American' },
  { value: 'asian', label: 'Asian' },
  { value: 'caucasian', label: 'Caucasian' },
  { value: 'latino', label: 'Latino/a' },
  { value: 'native_american', label: 'Native American' },
  { value: 'other', label: 'Other' },
]

export const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'other', label: 'Other' },
]

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export const TRANSLATOR_OPTIONS = [
  { value: 'no', label: 'No' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'yes', label: 'Yes' },
]

export const INVOLVEMENT_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'partially', label: 'Partially' },
  { value: 'no', label: 'No' },
  { value: 'unk', label: 'Unknown' },
]

export const CAREGIVER_RELATIONSHIP_OPTIONS = [
  { value: 'biological_mother', label: 'Biological Mother' },
  { value: 'biological_father', label: 'Biological Father' },
  { value: 'adoptive_mother', label: 'Adoptive Mother' },
  { value: 'adoptive_father', label: 'Adoptive Father' },
  { value: 'foster_mother', label: 'Foster Mother' },
  { value: 'foster_father', label: 'Foster Father' },
  { value: 'stepmother', label: 'Stepmother' },
  { value: 'stepfather', label: 'Stepfather' },
  { value: 'grandmother', label: 'Grandmother' },
  { value: 'grandfather', label: 'Grandfather' },
  { value: 'aunt', label: 'Aunt' },
  { value: 'uncle', label: 'Uncle' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'other_relative', label: 'Other Relative' },
  { value: 'non_relative', label: 'Non-Relative' },
  { value: 'other', label: 'Other' },
]

export const CONTACT_TYPE_OPTIONS = [
  { value: 'Assessment', label: 'Assessment' },
  { value: 'Care Coordination', label: 'Care Coordination' },
  { value: 'Feedback', label: 'Feedback' },
  { value: 'Dyadic Treatment', label: 'Dyadic Treatment' },
  { value: 'Individual caregiver', label: 'Individual caregiver' },
  { value: 'Individual child', label: 'Individual child' },
  { value: 'Caregiver phone – conversation', label: 'Caregiver phone – conversation' },
  { value: 'Caregiver phone – message', label: 'Caregiver phone – message' },
  { value: 'Collateral – meeting', label: 'Collateral – meeting' },
  { value: 'Collateral – phone', label: 'Collateral – phone' },
  { value: 'Collateral – other', label: 'Collateral – other' },
  { value: 'Team meeting', label: 'Team meeting' },
  { value: 'Other', label: 'Other' },
]

export const SESSION_STATUS_OPTIONS = [
  { value: 'Show', label: 'Show' },
  { value: 'Cancel', label: 'Cancel' },
  { value: 'No Show', label: 'No Show' },
]

export const REASON_NOT_ATTENDING_OPTIONS = [
  { value: 'Childcare problem', label: 'Childcare problem' },
  { value: 'Conflicting appointment', label: 'Conflicting appointment' },
  { value: 'Forgot', label: 'Forgot' },
  { value: 'Illness', label: 'Illness' },
  { value: 'Team member cancelled', label: 'Team member cancelled' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Weather', label: 'Weather' },
  { value: 'Other', label: 'Other' },
]

export const SESSION_LOCATION_OPTIONS = [
  { value: 'Home', label: 'Home' },
  { value: 'Clinic', label: 'Clinic' },
  { value: 'Community', label: 'Community' },
  { value: 'Other', label: 'Other' },
]

export const WHO_ATTENDED_OPTIONS = [
  { value: 'target_child', label: 'Target child' },
  { value: 'caregiver_1', label: 'Caregiver 1' },
  { value: 'caregiver_2', label: 'Caregiver 2' },
  { value: 'caregiver_3', label: 'Caregiver 3' },
  { value: 'caregiver_4', label: 'Caregiver 4' },
  { value: 'sibling_1', label: 'Sibling 1' },
  { value: 'sibling_2', label: 'Sibling 2' },
  { value: 'sibling_3', label: 'Sibling 3' },
  { value: 'sibling_4', label: 'Sibling 4' },
  { value: 'collateral', label: 'Collateral' },
]
