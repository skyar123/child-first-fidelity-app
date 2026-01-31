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
      presentingProblems: '',
      traumaHistory: '',
      developmentalHistory: '',
      familyContext: '',
      strengths: '',
      treatmentGoals: '',
      interventionPlan: '',
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
    careCoordinator: {
      careCoordinatorName: '',
      clinicalDirectorName: '',
      clientInitials: '',
      childFirstSite: '',
      date: '',
      items: {},
    },
    programFidelity: {
      affiliateSiteName: '',
      dateCompleted: '',
      ratings: {},
      comments: {},
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
    progress: null,
    interventions: [],
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

export const CONTACT_TYPE_OPTIONS = [
  { value: 'home_visit', label: 'Home Visit' },
  { value: 'office_visit', label: 'Office Visit' },
  { value: 'telehealth', label: 'Telehealth' },
  { value: 'phone_call', label: 'Phone Call' },
  { value: 'school_visit', label: 'School Visit' },
  { value: 'community_visit', label: 'Community Visit' },
  { value: 'collateral_contact', label: 'Collateral Contact' },
  { value: 'other', label: 'Other' },
]

export const SESSION_STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled_client', label: 'Cancelled by Client' },
  { value: 'cancelled_provider', label: 'Cancelled by Provider' },
  { value: 'no_show', label: 'No Show' },
  { value: 'rescheduled', label: 'Rescheduled' },
]

export const REASON_NOT_ATTENDING_OPTIONS = [
  { value: 'illness', label: 'Illness' },
  { value: 'transportation', label: 'Transportation Issues' },
  { value: 'work', label: 'Work Conflict' },
  { value: 'forgot', label: 'Forgot' },
  { value: 'childcare', label: 'Childcare Issues' },
  { value: 'weather', label: 'Weather' },
  { value: 'emergency', label: 'Family Emergency' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'other', label: 'Other' },
  { value: 'na', label: 'N/A - Session Completed' },
]

export const SESSION_LOCATION_OPTIONS = [
  { value: 'client_home', label: "Client's Home" },
  { value: 'office', label: 'Office' },
  { value: 'school', label: 'School' },
  { value: 'community', label: 'Community Setting' },
  { value: 'virtual', label: 'Virtual/Telehealth' },
  { value: 'other', label: 'Other' },
]

export const WHO_ATTENDED_OPTIONS = [
  { value: 'target_child', label: 'Target Child' },
  { value: 'primary_caregiver', label: 'Primary Caregiver' },
  { value: 'secondary_caregiver', label: 'Secondary Caregiver' },
  { value: 'sibling', label: 'Sibling(s)' },
  { value: 'other_family', label: 'Other Family Member' },
  { value: 'care_coordinator', label: 'Care Coordinator' },
  { value: 'other_provider', label: 'Other Provider' },
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
