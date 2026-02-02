// Default data schema for Termination Fidelity Form
import type {
  TerminationFormData,
  CPPClosingFormData,
  PlannedTerminationData,
  UnplannedTerminationData,
  ContactLogData,
  CPPObjectiveRating,
} from '../types/termination.types'

// Helper to create dual response defaults
function createDualResponse(defaultValue: string = ''): { clinician: string; careCoordinator: string } {
  return {
    clinician: defaultValue,
    careCoordinator: defaultValue,
  }
}

// Helper to create CPP objective rating defaults
function createObjectiveRating(): CPPObjectiveRating {
  return {
    clinicalFocus: null,
    appropriateness: null,
    progressCurrent: null,
  }
}

export function createDefaultClosingFormData(): CPPClosingFormData {
  return {
    clinicalTeamNames: '',
    clientInitials: '',
    childFirstSite: '',
    monthYear: '',
    careLogicId: '',
    terminationPhase: null,
    terminationInitiator: null,
    terminationType: null,
    changeInFunctioning: null,
    prognosis: null,
    closingReasons: {
      completedTreatment: false,
      reasonUnknown: false,
      moved: false,
      tooBusy: false,
      transportationProblems: false,
      schedulingProblems: false,
      unexpectedEmergency: false,
      caregiverChallenges: false,
      mentalIllness: false,
      physicalIllness: false,
      inDrugTreatmentResidential: false,
      inJail: false,
      lostCustodyOrVisits: false,
      familyDidNotWantMore: false,
      feltNotUseful: false,
      feltNoMoreProblems: false,
      otherResponsibilities: false,
      pressureFromPartnerOrFamily: false,
      unhappyWithClinicalTeam: false,
      clinicianCareCoordinatorLeft: false,
      thoughtFamilyBetterServed: false,
      other: false,
      otherSpecify: '',
    },
    transferToAnotherClinician: null,
  }
}

export function createDefaultPlannedTerminationData(): PlannedTerminationData {
  return {
    notDone: false,
    items: {
      cf1_reflectedOnTiming: null,
      item1_reflectedOnTermination: null,
      cf2_discussedWithSupervisor: null,
      cf3_extensionApproved: null,
      item2_plannedWithCaregiver: null,
      item2_lessThan2Months: false,
      item3_plannedTreatmentEvaluation: null,
      item4_completedTreatmentEvaluation: null,
      item10_feedbackTreatmentEvaluation: null,
      item5_toldChildAboutTermination: null,
      item5_lessThan1Month: false,
      item6_jointlyPlannedTermination: null,
      item7_processedGoodbye: null,
      item8_countedDownSessions: null,
      item9_reviewedFamilyStory: null,
      cf4_reviewedSuccesses: null,
      cf5_madeFinalReferrals: null,
      item11_plannedForFuture: null,
      item12_heldLastSession: null,
    },
  }
}

export function createDefaultUnplannedTerminationData(): UnplannedTerminationData {
  return {
    items: {
      cf6_attemptedToReengage: null,
      cf7_contactedReferralSource: null,
      cf8_barriersDiscussed: null,
      cf9_closeFileLetter: null,
      cf10_agencyClosingProcedures: null,
    },
  }
}

export function createDefaultContactLogData(): ContactLogData {
  return {
    entries: [],
  }
}

// Core Intervention Fidelity with flat structure for form field paths
export function createDefaultCoreInterventionFidelityData() {
  return {
    // REFLECTIVE PRACTICE FIDELITY
    reflectivePractice: {
      challenges: {
        familyDifficultToEngage: createDualResponse(),
        familyTraumaHistory: createDualResponse(),
        systemsInvolved: createDualResponse(),
        differentPerspectives: createDualResponse(),
        knowledgeSkillLevel: createDualResponse(),
        limitedSupervision: createDualResponse(),
        teamDifferentPerspectives: createDualResponse(),
      },
      capacity: {
        awarenessEmotional: {
          inMoment: createDualResponse(),
          selfReflection: createDualResponse(),
          inSupervision: createDualResponse(),
        },
        awarenessBiases: {
          inMoment: createDualResponse(),
          selfReflection: createDualResponse(),
          inSupervision: createDualResponse(),
        },
        multiplePerspectives: {
          inMoment: createDualResponse(),
          selfReflection: createDualResponse(),
          inSupervision: createDualResponse(),
        },
        regulateEmotions: createDualResponse(),
        selfCarePractices: createDualResponse(),
      },
      externalSupports: {
        processEmotions: createDualResponse(),
        alternativePerspectives: createDualResponse(),
        seekKnowledge: createDualResponse(),
      },
    },

    // EMOTIONAL PROCESS FIDELITY
    emotionalProcess: {
      challenges: {
        caregiverDysregulated: createDualResponse(),
        caregiverAvoidant: createDualResponse(),
        childDysregulated: createDualResponse(),
        childAvoidant: createDualResponse(),
      },
      capacity: {
        identifyCaregiverNotRegulated: createDualResponse(),
        tolerateCaregiverEmotions: createDualResponse(),
        helpCaregiverRegulate: createDualResponse(),
        identifyChildNotRegulated: createDualResponse(),
        tolerateChildEmotions: createDualResponse(),
        createContextUnderstood: createDualResponse(),
        createContextRegulate: createDualResponse(),
        identifyPersonalImpact: createDualResponse(),
      },
    },

    // DYADIC-RELATIONAL FIDELITY
    dyadicRelational: {
      challenges: {
        conflictualAgendas: createDualResponse(),
        difficultyUnderstanding: createDualResponse(),
        traumaReminders: createDualResponse(),
        unrealisticExpectations: createDualResponse(),
        sensorimotorChallenges: createDualResponse(),
      },
      capacity: {
        balanceAttention: createDualResponse(),
        holdPerspectives: createDualResponse(),
        bridgeTranslate: createDualResponse(),
        strengthenRelationship: createDualResponse(),
        supportOtherCaregivers: createDualResponse(),
      },
    },

    // TRAUMA FRAMEWORK FIDELITY
    traumaFramework: {
      challenges: {
        childHistoryUnknown: createDualResponse(),
        caregiverHistoryUnknown: createDualResponse(),
        caregiverNotAcknowledging: createDualResponse(),
        noTraumaFramework: createDualResponse(),
        caregiverTriggered: createDualResponse(),
      },
      capacity: {
        keepHistoryInMind: createDualResponse(),
        thinkAboutHistoryImpact: createDualResponse(),
        frameInterventions: createDualResponse(),
        directlyTalkTrauma: createDualResponse(),
      },
    },

    // PROCEDURAL FIDELITY
    proceduralFidelity: {
      challenges: {
        familyScheduling: createDualResponse(),
        clinicianScheduling: createDualResponse(),
        familyStructure: createDualResponse(),
        chaoticEnvironment: createDualResponse(),
      },
      capacity: {
        scheduleRegularly: createDualResponse(),
        vacationNotice: createDualResponse(),
        collateralSessions: createDualResponse(),
      },
    },
  }
}

// CPP Objectives with flat structure matching component field paths
export function createDefaultCPPObjectivesData() {
  return {
    conveyHope: createObjectiveRating(),
    developEmpathicRelationship: createObjectiveRating(),
    enhanceSafetyPhysical: createObjectiveRating(),
    enhanceSafetyEnvironmental: createObjectiveRating(),
    enhanceSafetyStabilization: createObjectiveRating(),
    safetyConsistencyTherapy: createObjectiveRating(),
    perceivedSafety: createObjectiveRating(),
    safetyWithinRelationships: createObjectiveRating(),
    strengthenFamilyRelationships: createObjectiveRating(),
    additionalChildFirstRelationships: createObjectiveRating(),
    coordinateCare: createObjectiveRating(),
    additionalChildFirstCareCoordination: createObjectiveRating(),
    strengthenAffectRegulation: createObjectiveRating(),
    strengthenBodyBasedRegulation: createObjectiveRating(),
    supportChildRelationshipOthers: createObjectiveRating(),
    enhanceUnderstandingBehavior: createObjectiveRating(),
    additionalChildFirstBehavior: createObjectiveRating(),
    attachmentExplorationBalance: createObjectiveRating(),
    supportNormalDevelopment: createObjectiveRating(),
    normalizeTraumaticResponse: createObjectiveRating(),
    supportAcknowledgingTrauma: createObjectiveRating(),
    differentiateThenNow: createObjectiveRating(),
    traumaInPerspective: createObjectiveRating(),
  }
}

export function createDefaultTerminationFormData(): TerminationFormData {
  return {
    closingForm: createDefaultClosingFormData(),
    plannedTermination: createDefaultPlannedTerminationData(),
    unplannedTermination: createDefaultUnplannedTerminationData(),
    contactLog: createDefaultContactLogData(),
    coreInterventionFidelity: createDefaultCoreInterventionFidelityData() as any,
    cppObjectives: createDefaultCPPObjectivesData() as any,
  }
}

// Contact log entry factory
export function createContactLogEntry(): ContactLogData['entries'][0] {
  return {
    id: crypto.randomUUID(),
    date: '',
    contactType: null,
    minutes: null,
    sessionStatus: null,
    reasonNotAttending: null,
    whoAttended: {
      targetChild: false,
      caregiver1: false,
      caregiver2: false,
      caregiver3: false,
      caregiver4: false,
      sibling1: false,
      sibling2: false,
      sibling3: false,
      sibling4: false,
      collateral: false,
      collateralSpecify: '',
    },
    whereHeld: null,
    sessionCounter: null,
  }
}
