// Termination Fidelity Form Types
// Based on "Child First Fidelity - Recapitulation and Termination Phase" document

// ============================================
// CPP CLOSING FORM (Page 1)
// ============================================

export type TerminationPhase =
  | 'foundational'
  | 'core_intervention'
  | 'termination'
  | 'completed_termination'

export type TerminationInitiator =
  | 'family'
  | 'clinical_team'
  | 'mutually_agreed'

export type TerminationType =
  | 'dropped'
  | 'abrupt'
  | 'planned'

export type ChangeInFunctioning =
  | 'much_worse'
  | 'slightly_worse'
  | 'no_change'
  | 'slightly_improved'
  | 'much_improved'

export type Prognosis =
  | 'poor'
  | 'fair'
  | 'good'
  | 'excellent'
  | 'unable_to_rate'

export interface ClosingReasons {
  completedTreatment: boolean
  // Column 1
  reasonUnknown: boolean
  moved: boolean
  tooBusy: boolean
  transportationProblems: boolean
  schedulingProblems: boolean
  unexpectedEmergency: boolean
  // Column 2
  caregiverChallenges: boolean
  mentalIllness: boolean
  physicalIllness: boolean
  inDrugTreatmentResidential: boolean
  inJail: boolean
  lostCustodyOrVisits: boolean
  // Column 3
  familyDidNotWantMore: boolean
  feltNotUseful: boolean
  feltNoMoreProblems: boolean
  otherResponsibilities: boolean
  pressureFromPartnerOrFamily: boolean
  unhappyWithClinicalTeam: boolean
  // Column 4
  clinicianCareCoordinatorLeft: boolean
  thoughtFamilyBetterServed: boolean
  other: boolean
  otherSpecify: string
}

export interface CPPClosingFormData {
  // Identification fields
  clinicalTeamNames: string
  clientInitials: string
  childFirstSite: string
  monthYear: string
  careLogicId: string

  // Questions 1-7
  terminationPhase: TerminationPhase | null
  terminationInitiator: TerminationInitiator | null
  terminationType: TerminationType | null
  changeInFunctioning: ChangeInFunctioning | null
  prognosis: Prognosis | null
  closingReasons: ClosingReasons
  transferToAnotherClinician: boolean | null
}

// ============================================
// PROCEDURAL FIDELITY: PLANNED TERMINATION (Pages 2-3)
// ============================================

export interface PlannedTerminationItem {
  id: string
  label: string
  text: string
  hasLessThanOption?: boolean // For items with "<2 mo" or "<1 mo" alternatives
}

export interface PlannedTerminationData {
  notDone: boolean // Family dropped from treatment
  items: {
    cf1_reflectedOnTiming: boolean | null
    item1_reflectedOnTermination: boolean | null
    cf2_discussedWithSupervisor: boolean | null
    cf3_extensionApproved: boolean | null
    item2_plannedWithCaregiver: boolean | null
    item2_lessThan2Months: boolean
    item3_plannedTreatmentEvaluation: boolean | null
    item4_completedTreatmentEvaluation: boolean | null
    item10_feedbackTreatmentEvaluation: boolean | null
    item5_toldChildAboutTermination: boolean | null
    item5_lessThan1Month: boolean
    item6_jointlyPlannedTermination: boolean | null
    item7_processedGoodbye: boolean | null
    item8_countedDownSessions: boolean | null
    item9_reviewedFamilyStory: boolean | null
    cf4_reviewedSuccesses: boolean | null
    cf5_madeFinalReferrals: boolean | null
    item11_plannedForFuture: boolean | null
    item12_heldLastSession: boolean | null
  }
}

// ============================================
// PROCEDURAL FIDELITY: UNPLANNED TERMINATION (Page 3)
// ============================================

export interface UnplannedTerminationData {
  items: {
    cf6_attemptedToReengage: boolean | null
    cf7_contactedReferralSource: boolean | null
    cf8_barriersDiscussed: boolean | null
    cf9_closeFileLetter: boolean | null
    cf10_agencyClosingProcedures: boolean | null
  }
}

// ============================================
// CPP CONTACT LOG (Page 5)
// ============================================

export type ContactType =
  | 'assessment'
  | 'case_management'
  | 'feedback'
  | 'dyadic_treatment'
  | 'individual_caregiver'
  | 'individual_child'
  | 'caregiver_phone_conversation'
  | 'caregiver_phone_message'
  | 'collateral_meeting'
  | 'collateral_phone'
  | 'collateral_other'
  | 'team_meeting'
  | 'other'

export type SessionStatus = 'show' | 'cancel' | 'no_show'

export type ReasonNotAttending =
  | 'childcare_problem'
  | 'conflicting_appointment'
  | 'forgot'
  | 'illness'
  | 'team_member_cancelled'
  | 'transportation'
  | 'weather'
  | 'other'

export type SessionLocation = 'home' | 'clinic' | 'community' | 'other'

export interface ContactLogEntry {
  id: string
  date: string
  contactType: ContactType | null
  minutes: number | null
  sessionStatus: SessionStatus | null
  reasonNotAttending: ReasonNotAttending | null
  whoAttended: {
    targetChild: boolean
    caregiver1: boolean
    caregiver2: boolean
    caregiver3: boolean
    caregiver4: boolean
    sibling1: boolean
    sibling2: boolean
    sibling3: boolean
    sibling4: boolean
    collateral: boolean
    collateralSpecify: string
  }
  whereHeld: SessionLocation | null
  sessionCounter: number | null
}

export interface ContactLogData {
  entries: ContactLogEntry[]
}

// ============================================
// CPP CORE INTERVENTION FIDELITY (Pages 6-8)
// ============================================

export type ChallengeLevel = 'no' | 'low' | 'moderate' | 'significant'
export type CapacityLevel = 'requires_development' | 'emerging' | 'acquired'
export type AttendanceResponse = 'no' | 'yes_not_regular' | 'yes_attended'

// Dual-column responses (Clinician and Care Coordinator)
export interface DualResponse<T> {
  clinician: T | null
  careCoordinator: T | null
}

// REFLECTIVE PRACTICE FIDELITY
export interface ReflectivePracticeFidelity {
  // Potential Sources of Challenge
  challenges: {
    familyDifficultToEngage: DualResponse<ChallengeLevel>
    familyTraumaHistory: DualResponse<ChallengeLevel>
    systemsInvolved: DualResponse<ChallengeLevel>
    differentPerspectives: DualResponse<ChallengeLevel>
    knowledgeAndSkillLevel: DualResponse<ChallengeLevel>
    limitedAccessToSupervision: DualResponse<ChallengeLevel>
    clinicianCareCoordinatorDifferentPerspectives: DualResponse<ChallengeLevel>
  }
  // Clinician/Care Coordinator Reflective Practice Capacity
  capacity: {
    awarenessEmotionalReactions: {
      inMoment: DualResponse<CapacityLevel>
      uponSelfReflection: DualResponse<CapacityLevel>
      inSupervision: DualResponse<CapacityLevel>
    }
    awarenessPersonalBiases: {
      inMoment: DualResponse<CapacityLevel>
      uponSelfReflection: DualResponse<CapacityLevel>
      inSupervision: DualResponse<CapacityLevel>
    }
    abilityToConsiderMultiplePerspectives: {
      inMoment: DualResponse<CapacityLevel>
      uponSelfReflection: DualResponse<CapacityLevel>
      inSupervision: DualResponse<CapacityLevel>
    }
    abilityToRecognizeAndRegulate: DualResponse<CapacityLevel>
    useOfSelfCarePractices: DualResponse<CapacityLevel>
  }
  // Use of External Supports
  externalSupports: {
    processEmotionalReactions: DualResponse<CapacityLevel>
    considerAlternativePerspectives: DualResponse<CapacityLevel>
    seekNewKnowledge: DualResponse<CapacityLevel>
  }
}

// EMOTIONAL PROCESS FIDELITY
export interface EmotionalProcessFidelity {
  challenges: {
    caregiverDysregulated: DualResponse<ChallengeLevel>
    caregiverAvoidant: DualResponse<ChallengeLevel>
    childDysregulated: DualResponse<ChallengeLevel>
    childAvoidant: DualResponse<ChallengeLevel>
  }
  capacity: {
    identifyWhenCaregiverNotRegulated: DualResponse<CapacityLevel>
    tolerateCaregiverEmotions: DualResponse<CapacityLevel>
    interveneToHelpCaregiverRegulate: DualResponse<CapacityLevel>
    identifyWhenChildNotRegulated: DualResponse<CapacityLevel>
    tolerateChildEmotions: DualResponse<CapacityLevel>
    createContextChildEmotionUnderstood: DualResponse<CapacityLevel>
    createContextChildHelpedRegulate: DualResponse<CapacityLevel>
    identifyWhenPersonalHistoryImpacting: DualResponse<CapacityLevel>
  }
}

// DYADIC-RELATIONAL FIDELITY
export interface DyadicRelationalFidelity {
  challenges: {
    conflictingAgendas: DualResponse<ChallengeLevel>
    difficultyUnderstandingChild: DualResponse<ChallengeLevel>
    traumaReminders: DualResponse<ChallengeLevel>
    unrealisticExpectations: DualResponse<ChallengeLevel>
    sensoriMotorChallenges: DualResponse<ChallengeLevel>
  }
  capacity: {
    balanceAttention: DualResponse<CapacityLevel>
    holdSupportPerspectives: DualResponse<CapacityLevel>
    bridgeTranslate: DualResponse<CapacityLevel>
    interveneToStrengthen: DualResponse<CapacityLevel>
    supportOtherCaregivers: DualResponse<CapacityLevel>
  }
}

// TRAUMA FRAMEWORK FIDELITY
export interface TraumaFrameworkFidelity {
  challenges: {
    childHistoryUnknown: DualResponse<ChallengeLevel>
    caregiverHistoryUnknown: DualResponse<ChallengeLevel>
    caregiverNotAcknowledging: DualResponse<ChallengeLevel>
    caregiverNoTraumaFramework: DualResponse<ChallengeLevel>
    caregiverTriggered: DualResponse<ChallengeLevel>
  }
  capacity: {
    keepHistoryInMind: DualResponse<CapacityLevel>
    thinkAboutHistoryAffecting: DualResponse<CapacityLevel>
    frameInterventions: DualResponse<CapacityLevel>
    directlyTalkAboutTrauma: DualResponse<CapacityLevel> // Clinicians only
  }
}

// PROCEDURAL FIDELITY (within intervention fidelity)
export interface InterventionProceduralFidelity {
  challenges: {
    familySchedulingChallenges: DualResponse<ChallengeLevel>
    clinicianSchedulingChallenges: DualResponse<ChallengeLevel>
    familyStructureChallenges: DualResponse<ChallengeLevel>
    homeEnvironmentChaotic: DualResponse<ChallengeLevel>
  }
  capacity: {
    scheduleRegularly: DualResponse<AttendanceResponse>
    giveNoticeForVacation: DualResponse<AttendanceResponse>
    proposeCollateralSessions: DualResponse<AttendanceResponse>
    proposeCollateralNotNeeded: DualResponse<boolean>
  }
}

export interface CoreInterventionFidelityData {
  reflectivePractice: ReflectivePracticeFidelity
  emotionalProcess: EmotionalProcessFidelity
  dyadicRelational: DyadicRelationalFidelity
  traumaFramework: TraumaFrameworkFidelity
  procedural: InterventionProceduralFidelity
}

// ============================================
// CPP CASE CONCEPTUALIZATION AND CONTENT FIDELITY (Pages 9-16)
// ============================================

export type ClinicalFocus = 0 | 1 | 2 | 3 // 0=not at all, 1=minor, 2=moderate, 3=significant
export type Appropriateness = 'under' | 'appropriate' | 'over'
export type ProgressLevel = 0 | 1 | 2 | 3
// 0=Primary Target/Urgent Concern, 1=Emerging, 2=Present but Unstable, 3=Established

export interface CPPObjectiveRating {
  clinicalFocus: ClinicalFocus | null
  appropriateness: Appropriateness | null
  progressCurrent: ProgressLevel | null
}

export interface CPPObjectivesData {
  conveyHope: CPPObjectiveRating
  developEmpathicRelationship: CPPObjectiveRating
  enhanceSafety: {
    physicalSafety: CPPObjectiveRating
    environmentalContext: CPPObjectiveRating
    stabilization: CPPObjectiveRating
    consistencyInTherapy: CPPObjectiveRating
    perceivedSafety: CPPObjectiveRating
    withinCaregiverChildRelationships: CPPObjectiveRating
  }
  strengthenFamilyRelationships: CPPObjectiveRating
  additionalChildFirstTreatmentObjectives: CPPObjectiveRating
  coordinateCare: CPPObjectiveRating
  coordinateCareAdditional: CPPObjectiveRating
  strengthenDyadicAffectRegulation: CPPObjectiveRating
  strengthenDyadicBodyBasedRegulation: CPPObjectiveRating
  supportChildRelationshipWithOtherCaregivers: CPPObjectiveRating
  enhanceUnderstandingOfBehavior: CPPObjectiveRating
  enhanceUnderstandingAdditional: CPPObjectiveRating
  attachmentExplorationBalance: CPPObjectiveRating
  supportChildDevelopmentalTrajectory: CPPObjectiveRating
  normalizeTraumaticResponse: CPPObjectiveRating
  supportDyadAcknowledgingTrauma: CPPObjectiveRating
  helpDyadDifferentiateThenAndNow: CPPObjectiveRating
  helpDyadPutTraumaInPerspective: CPPObjectiveRating
}

// ============================================
// COMPLETE TERMINATION FORM DATA
// ============================================

export interface TerminationFormData {
  // Page 1: CPP Closing Form
  closingForm: CPPClosingFormData

  // Pages 2-3: Procedural Fidelity - Planned Termination
  plannedTermination: PlannedTerminationData

  // Page 3: Procedural Fidelity - Unplanned Termination
  unplannedTermination: UnplannedTerminationData

  // Page 5: Contact Log
  contactLog: ContactLogData

  // Pages 6-8: Core Intervention Fidelity
  coreInterventionFidelity: CoreInterventionFidelityData

  // Pages 9-16: CPP Case Conceptualization
  cppObjectives: CPPObjectivesData
}
