import type {
  FormData,
  Sibling,
  Caregiver,
  ContactLogEntry,
  FidelityStrand,
  CPPObjective,
  PlanOfCareGoal,
} from '@/types/form.types'

// ========================================
// Factory Functions
// ========================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createDefaultFormData(_caseId?: string): FormData {
  return {
    caseIdentification: {
      clinicalTeamNames: '',
      clientInitials: '',
      date: new Date().toISOString().split('T')[0],
      referralSource: '',
      referralReason: '',
    },
    targetChild: {
      ageInMonths: null,
      gender: '',
      ethnicity: [],
      primaryLanguage: '',
      otherLanguages: [],
      insuranceType: '',
      livingSituation: '',
      currentPlacement: '',
    },
    siblings: [],
    caregivers: [],
    fidelityStrands: {
      strand1: createDefaultFidelityStrand(),
      strand2: createDefaultFidelityStrand(),
      strand3: createDefaultFidelityStrand(),
      strand4: createDefaultFidelityStrand(),
      strand5: createDefaultFidelityStrand(),
    },
    contactLog: [],
    assessmentChecklist: {
      childTraumaHistory: '',
      items: {},
    },
    traumaFeedback: {
      sessionDate: '',
      items: {},
      notes: '',
    },
    formulation: {
      items: {},
      notes: '',
    },
    planOfCare: {
      goals: [],
      safetyPlan: '',
      crisisContacts: '',
    },
    homeVisit: {
      beforeVisit: {},
      duringVisit: {},
      afterVisit: {},
    },
    cppObjectives: {
      objectives: {},
    },
  }
}

export function createDefaultFidelityStrand(): FidelityStrand {
  return {
    challengeItems: {},
    capacityItems: {},
  }
}

export function createSibling(): Sibling {
  return {
    id: crypto.randomUUID(),
    initials: '',
    ageInMonths: null,
    gender: '',
    relationship: '',
    livesWithChild: false,
    includedInTreatment: false,
  }
}

export function createCaregiver(): Caregiver {
  return {
    id: crypto.randomUUID(),
    initials: '',
    relationship: '',
    age: null,
    gender: '',
    ethnicity: [],
    primaryLanguage: '',
    education: '',
    employment: '',
    isPrimaryCaregiver: false,
    livesWithChild: true,
  }
}

export function createContactLogEntry(sessionNumber: number): ContactLogEntry {
  return {
    id: crypto.randomUUID(),
    sessionNumber,
    date: new Date().toISOString().split('T')[0],
    contactType: '',
    sessionStatus: '',
    reasonNotAttending: '',
    sessionLocation: '',
    whoAttended: [],
    sessionDuration: null,
    travelTime: null,
    notes: '',
  }
}

export function createPlanOfCareGoal(): PlanOfCareGoal {
  return {
    id: crypto.randomUUID(),
    goal: '',
    objectives: [],
    interventions: '',
    targetDate: '',
    progress: '',
  }
}

export function createCPPObjective(): CPPObjective {
  return {
    clinicalFocus: null,
    appropriateness: null,
    progressReferral: null,
    progressCurrent: null,
    notes: '',
  }
}

// ========================================
// Option Arrays
// ========================================

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_say', label: 'Prefer not to say' },
]

export const ETHNICITY_OPTIONS = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black or African American' },
  { value: 'hispanic', label: 'Hispanic or Latino' },
  { value: 'asian', label: 'Asian' },
  { value: 'native_american', label: 'American Indian or Alaska Native' },
  { value: 'pacific_islander', label: 'Native Hawaiian or Pacific Islander' },
  { value: 'two_or_more', label: 'Two or More Races' },
  { value: 'other', label: 'Other' },
  { value: 'unknown', label: 'Unknown' },
]

export const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'french', label: 'French' },
  { value: 'haitian_creole', label: 'Haitian Creole' },
  { value: 'other', label: 'Other' },
]

export const INSURANCE_TYPE_OPTIONS = [
  { value: 'medicaid', label: 'Medicaid' },
  { value: 'private', label: 'Private Insurance' },
  { value: 'medicare', label: 'Medicare' },
  { value: 'uninsured', label: 'Uninsured' },
  { value: 'other', label: 'Other' },
]

export const LIVING_SITUATION_OPTIONS = [
  { value: 'biological_parents', label: 'With biological parent(s)' },
  { value: 'foster_care', label: 'Foster care' },
  { value: 'kinship_care', label: 'Kinship care' },
  { value: 'adoptive_parents', label: 'With adoptive parent(s)' },
  { value: 'residential', label: 'Residential facility' },
  { value: 'homeless', label: 'Homeless/shelter' },
  { value: 'other', label: 'Other' },
]

export const RELATIONSHIP_OPTIONS = [
  { value: 'biological_mother', label: 'Biological Mother' },
  { value: 'biological_father', label: 'Biological Father' },
  { value: 'stepmother', label: 'Stepmother' },
  { value: 'stepfather', label: 'Stepfather' },
  { value: 'grandmother', label: 'Grandmother' },
  { value: 'grandfather', label: 'Grandfather' },
  { value: 'aunt', label: 'Aunt' },
  { value: 'uncle', label: 'Uncle' },
  { value: 'foster_parent', label: 'Foster Parent' },
  { value: 'adoptive_parent', label: 'Adoptive Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'other_relative', label: 'Other Relative' },
  { value: 'other', label: 'Other' },
]

export const SIBLING_RELATIONSHIP_OPTIONS = [
  { value: 'full_sibling', label: 'Full Sibling' },
  { value: 'half_sibling', label: 'Half Sibling' },
  { value: 'step_sibling', label: 'Step Sibling' },
  { value: 'foster_sibling', label: 'Foster Sibling' },
  { value: 'adoptive_sibling', label: 'Adoptive Sibling' },
]

export const EDUCATION_OPTIONS = [
  { value: 'less_than_hs', label: 'Less than High School' },
  { value: 'high_school', label: 'High School Diploma/GED' },
  { value: 'some_college', label: 'Some College' },
  { value: 'associates', label: "Associate's Degree" },
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'doctorate', label: 'Doctorate' },
  { value: 'unknown', label: 'Unknown' },
]

export const EMPLOYMENT_OPTIONS = [
  { value: 'employed_full', label: 'Employed Full-time' },
  { value: 'employed_part', label: 'Employed Part-time' },
  { value: 'unemployed_seeking', label: 'Unemployed - Seeking Work' },
  { value: 'unemployed_not_seeking', label: 'Unemployed - Not Seeking' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'retired', label: 'Retired' },
  { value: 'student', label: 'Student' },
  { value: 'homemaker', label: 'Homemaker' },
  { value: 'unknown', label: 'Unknown' },
]

// Official option lists from "PROCEDURAL FIDELITY: CPP CONTACT LOG"
// (see docs/sources/SOURCES.md)

export const CONTACT_TYPE_OPTIONS = [
  { value: 'assessment', label: 'Assessment' },
  { value: 'care_coordination', label: 'Care Coordination' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'dyadic_treatment', label: 'Dyadic Treatment*' },
  { value: 'individual_caregiver', label: 'Individual caregiver*' },
  { value: 'individual_child', label: 'Individual child*' },
  { value: 'caregiver_phone_conversation', label: 'Caregiver phone – conversation' },
  { value: 'caregiver_phone_message', label: 'Caregiver phone – message' },
  { value: 'collateral_meeting', label: 'Collateral – meeting' },
  { value: 'collateral_phone', label: 'Collateral – phone' },
  { value: 'collateral_other', label: 'Collateral – other' },
  { value: 'team_meeting', label: 'Team meeting' },
  { value: 'other', label: 'Other' },
]

export const SESSION_STATUS_OPTIONS = [
  { value: 'show', label: 'Show' },
  { value: 'cancel', label: 'Cancel' },
  { value: 'no_show', label: 'No Show' },
]

export const REASON_NOT_ATTENDING_OPTIONS = [
  { value: 'childcare_problem', label: 'Childcare problem' },
  { value: 'conflicting_appointment', label: 'Conflicting appointment' },
  { value: 'forgot', label: 'Forgot' },
  { value: 'illness', label: 'Illness' },
  { value: 'team_member_cancelled', label: 'Team member cancelled' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'weather', label: 'Weather' },
  { value: 'other', label: 'Other' },
]

export const SESSION_LOCATION_OPTIONS = [
  { value: 'home', label: 'Home' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'community', label: 'Community' },
  { value: 'other', label: 'Other' },
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
  { value: 'collateral', label: 'Collateral (specify in notes)' },
]

export const REFERRAL_SOURCE_OPTIONS = [
  { value: 'dcf', label: 'DCF/Child Welfare' },
  { value: 'pediatrician', label: 'Pediatrician' },
  { value: 'school', label: 'School' },
  { value: 'mental_health', label: 'Mental Health Provider' },
  { value: 'court', label: 'Court/Legal System' },
  { value: 'self', label: 'Self-Referral' },
  { value: 'family', label: 'Family/Friend' },
  { value: 'early_intervention', label: 'Early Intervention' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'other', label: 'Other' },
]
