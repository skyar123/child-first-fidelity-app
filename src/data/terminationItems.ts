// Item definitions for Termination Fidelity Form
// Based on "Child First Fidelity - Recapitulation and Termination Phase" document

// ============================================
// PROCEDURAL FIDELITY: PLANNED TERMINATION ITEMS
// ============================================

export interface PlannedTerminationItemDef {
  id: string
  itemNumber: string // CF1, 1, 2, etc.
  title: string
  description: string
  hasLessThanOption?: boolean
  lessThanLabel?: string
}

export const plannedTerminationItems: PlannedTerminationItemDef[] = [
  {
    id: 'cf1_reflectedOnTiming',
    itemNumber: 'CF1',
    title: 'Clinical Team reflected on timing of termination',
    description: 'Clinical Team reflected on appropriateness of termination based on achievement of treatment goals; discussed differences in perception',
  },
  {
    id: 'item1_reflectedOnTermination',
    itemNumber: '1',
    title: 'Reflected on termination',
    description: 'Before you began termination, remembered that goodbyes evoke profound feelings of rejection and loss no matter how well you prepare for and conduct them. Reviewed the caregiver and child\'s history of separation and loss to help you hypothesize about possible reactions they may have related to saying goodbye.',
  },
  {
    id: 'cf2_discussedWithSupervisor',
    itemNumber: 'CF2',
    title: 'Discussed termination with Clinical Director/Supervisor',
    description: '',
  },
  {
    id: 'cf3_extensionApproved',
    itemNumber: 'CF3',
    title: 'Extension beyond 12-month treatment period',
    description: 'Extension beyond 12-month treatment period was discussed with and approved by Clinical Director, if applicable',
  },
  {
    id: 'item2_plannedWithCaregiver',
    itemNumber: '2',
    title: 'Planned termination with caregiver',
    description: 'Began termination phase by talking alone w/ caregiver about ending treatment approximately 2 months before end date. If the child is an infant, this may be done with the child present.\n\nRationale for 2 month period: Termination is integral to trauma treatment and a lot of "work" happens during this phase. In cases where a 2-month termination is not possible, try to incorporate the elements on the checklist and check the box for < 2 months.',
    hasLessThanOption: true,
    lessThanLabel: '<2 mo',
  },
  {
    id: 'item3_plannedTreatmentEvaluation',
    itemNumber: '3',
    title: 'Planned treatment evaluation (Outcome Assessments)',
    description: 'As part of termination planning, scheduled treatment-outcome evaluation with caregiver.',
  },
  {
    id: 'item4_completedTreatmentEvaluation',
    itemNumber: '4',
    title: 'Completed treatment evaluation (Outcome Assessments)',
    description: 'Completed treatment evaluation (Outcome Assessments), and completed Outcome Assessment Checklist (refer to Child First Toolkit)',
  },
  {
    id: 'item10_feedbackTreatmentEvaluation',
    itemNumber: '10',
    title: 'Feedback: treatment evaluation (Outcome Assessments)',
    description: 'Met alone with caregiver and provided feedback from evaluation.',
  },
  {
    id: 'item5_toldChildAboutTermination',
    itemNumber: '5',
    title: 'Told child about termination',
    description: 'Let the child know treatment is ending at least one month before the end date. If child is an infant, had a session with the child present where you and the caregiver acknowledged that treatment will be ending.',
    hasLessThanOption: true,
    lessThanLabel: '<1 mo',
  },
  {
    id: 'item6_jointlyPlannedTermination',
    itemNumber: '6',
    title: 'Jointly planned termination',
    description: 'Planned with caregiver and child (or caregiver alone if child is an infant) how treatment will end, how you will say goodbye.',
  },
  {
    id: 'item7_processedGoodbye',
    itemNumber: '7',
    title: 'Processed the goodbye',
    description: '• Talked about how goodbyes can be hard and make you sad and angry\n• If appropriate, differentiated this goodbye from other goodbyes or separations\n• Allowed caregiver and child to be a part of the process and experience a range of feelings\n• Helped caregiver and child realize that they can feel connected to people even after they have said goodbye',
  },
  {
    id: 'item8_countedDownSessions',
    itemNumber: '8',
    title: 'Counted down the sessions with caregiver and child',
    description: 'Every week reviewed how many more sessions until the end (e.g., with a calendar)',
  },
  {
    id: 'item9_reviewedFamilyStory',
    itemNumber: '9',
    title: 'Reviewed the family\'s story',
    description: 'Discussed the course of treatment and the family\'s treatment narrative\n• Where they were when they came here, whether things were hard, where things are now\n• The themes that emerged in treatment/play\n• If things are still not safe, how this affects them and how they can continue to talk about this and support each other',
  },
  {
    id: 'cf4_reviewedSuccesses',
    itemNumber: 'CF4',
    title: 'Reviewed successes, and goals not yet met',
    description: 'Discussed child and family\'s successes, as well as goals that have not yet been met',
  },
  {
    id: 'cf5_madeFinalReferrals',
    itemNumber: 'CF5',
    title: 'Made final referrals for services',
    description: 'Made final referrals for services and ensured that services were accessed',
  },
  {
    id: 'item11_plannedForFuture',
    itemNumber: '11',
    title: 'Planned for the future and discussed trauma reminders with caregivers',
    description: '• Talked with caregivers about how symptoms may return with trauma reminders or when child is under stress (metaphor: posttraumatic stress reactions are like asthma, flare up from time to time when the person is under stress)\n• Helped caregivers reflect on how they have skills to help the child when this happens\n• Helped caregivers to recognize if child\'s symptoms are significant enough to perhaps warrant a return to treatment',
  },
  {
    id: 'item12_heldLastSession',
    itemNumber: '12',
    title: 'Held last session',
    description: '',
  },
]

// ============================================
// PROCEDURAL FIDELITY: UNPLANNED TERMINATION ITEMS
// ============================================

export interface UnplannedTerminationItemDef {
  id: string
  itemNumber: string
  title: string
  description: string
}

export const unplannedTerminationItems: UnplannedTerminationItemDef[] = [
  {
    id: 'cf6_attemptedToReengage',
    itemNumber: 'CF6',
    title: 'Clinical Team attempted to re-engage through calls and letters',
    description: 'If case is at risk of closing, Clinical Team made required efforts to re-engage family through 4 weeks of phone calls and letters',
  },
  {
    id: 'cf7_contactedReferralSource',
    itemNumber: 'CF7',
    title: 'Clinical Team contacted referral source',
    description: 'If a Release of Information was obtained and is still valid, Clinical Team contacted referral source, other family supports or service providers',
  },
  {
    id: 'cf8_barriersDiscussed',
    itemNumber: 'CF8',
    title: 'Barrier to treatment and re-engagements were discussed with Clinical Director',
    description: '',
  },
  {
    id: 'cf9_closeFileLetter',
    itemNumber: 'CF9',
    title: '"Close File" letter sent',
    description: 'Clinical Team sent "Close File" letter to family, indicating that family is free to return at a future date',
  },
  {
    id: 'cf10_agencyClosingProcedures',
    itemNumber: 'CF10',
    title: 'Agency-specific case closing procedures',
    description: 'Clinical Team followed policies and procedures of their site to close case',
  },
]

// ============================================
// CONTACT TYPE OPTIONS
// ============================================

export const contactTypeOptions = [
  { value: 'assessment', label: 'Assessment' },
  { value: 'case_management', label: 'Case management' },
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

export const sessionStatusOptions = [
  { value: 'show', label: 'Show' },
  { value: 'cancel', label: 'Cancel' },
  { value: 'no_show', label: 'No Show' },
]

export const reasonNotAttendingOptions = [
  { value: 'childcare_problem', label: 'Childcare problem' },
  { value: 'conflicting_appointment', label: 'Conflicting appointment' },
  { value: 'forgot', label: 'Forgot' },
  { value: 'illness', label: 'Illness' },
  { value: 'team_member_cancelled', label: 'Team member cancelled' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'weather', label: 'Weather' },
  { value: 'other', label: 'Other' },
]

export const sessionLocationOptions = [
  { value: 'home', label: 'Home' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'community', label: 'Community' },
  { value: 'other', label: 'Other' },
]

// ============================================
// CPP OBJECTIVES DEFINITIONS
// ============================================

export interface CPPObjectiveCategory {
  id: string
  title: string
  bulletPoints: string[]
  isSubsection?: boolean
  parentId?: string
}

export const cppObjectivesCategories: CPPObjectiveCategory[] = [
  {
    id: 'conveyHope',
    title: 'CONVEY HOPE',
    bulletPoints: [
      'Highlighted that change and growth are possible given positive steps the family has made',
      'Provided realistic examples of potential pathways for healing, noting ways that caregiver efforts and treatment may lead to improved caregiver and child functioning',
      'Helped caregiver identify "angels in the nursery" and reflect on times when he/she felt safe and loved',
      'Helped the family connect to spiritual resources consistent with family traditions',
    ],
  },
  {
    id: 'developEmpathicRelationship',
    title: 'DEVELOP EMPATHIC RELATIONSHIP WITH FAMILY MEMBERS',
    bulletPoints: [
      'Empathically listened to concerns: ☐ caregiver ☐ child\'s',
      'Understood difficult behavior given past history & current context: ☐caregiver ☐child',
      'Made warm supportive comments or recognized accomplishments: ☐ caregiver ☐child',
      'Understood caregivers\' mistrust of providers and reluctance to engage in treatment in light of their past history and current experiences with potentially punitive systems',
    ],
  },
  {
    id: 'enhanceSafety_physicalSafety',
    title: 'ENHANCE SAFETY - Physical Safety',
    bulletPoints: [
      'Helped caregiver reflect on his/her history of physical endangerment and how it shapes current expectations regarding danger and safety',
      'In a supportive, non-confrontational manner, directly addressed safety issues with caregiver with the goal of increasing caregiver awareness and mobilizing protective action',
      'Balanced respect for the caregiver\'s psychological vulnerabilities with the need to address lapses in safety and destructive or self-destructive behavior',
      'Encouraged the caregiver to develop an attitude that prioritizes safety as a core value for the caregiver, child, and family',
      'Supported caregiver in engaging other family members in addressing risks to safety (including partners who may have been violent)',
      'Focused on and addressed serious risks to physical safety, including risks within family relationships and permanency of placement',
      'Engaged in safety planning',
      'Assessed for and filed appropriate DCF reports for suspected abuse',
    ],
  },
  {
    id: 'enhanceSafety_environmentalContext',
    title: 'ENHANCE SAFETY - Environmental Context',
    isSubsection: true,
    parentId: 'enhanceSafety',
    bulletPoints: [
      'Discussed ways that contextual risks (e.g., poverty, community violence, immigration related-risks, inadequate or unsafe housing, and inadequate access to services) affect child and family functioning',
      'Considered the impact of racism and historical trauma on child and family functioning',
    ],
  },
  {
    id: 'enhanceSafety_stabilization',
    title: 'Safety – Stabilization',
    isSubsection: true,
    parentId: 'enhanceSafety',
    bulletPoints: [
      'Discussed provision/maintenance of basic needs',
      'Provided care coordination to help family obtain basic needs',
      'Helped caregiver develop the capacities to obtain services and needs independently (to overcome barriers, communicate about needs, and collaborate with service providers)',
      'Helped caregiver identify and address root causes of recurrent crisis and ongoing instability',
    ],
  },
  {
    id: 'enhanceSafety_consistencyInTherapy',
    title: 'Safety & Consistency in Therapy',
    isSubsection: true,
    parentId: 'enhanceSafety',
    bulletPoints: [
      'Acknowledged safety risks to participating in therapy: mandated reporting, etc.',
      'Encouraged consistent, on-time participation in therapy',
      'Created a consistent environment for treatment',
    ],
  },
  {
    id: 'enhanceSafety_perceivedSafety',
    title: 'Perceived Safety',
    isSubsection: true,
    parentId: 'enhanceSafety',
    bulletPoints: [
      'Identify misperceptions of danger or safety: ☐caregiver ☐child',
      'Foster accurate perceptions of danger and safety',
    ],
  },
  {
    id: 'enhanceSafety_withinCaregiverChildRelationships',
    title: 'Safety within Caregiver-Child Relationships',
    isSubsection: true,
    parentId: 'enhanceSafety',
    bulletPoints: [
      'Acknowledged past history of risks to safety: ☐ caregiver ☐ child',
      'Highlighted the need for safe behavior while legitimizing feelings (e.g., child cannot hit others even though child is angry)',
      'Fostered caregiver\'s ability to socialize child in ways that are consistent both with the caregiver\'s cultural values and beliefs and the family\'s context',
      'Identified factors that may interfere with caregivers capacity to socialize child, including environmental circumstances, strong emotions (e.g., guilt, fear, feelings of worthlessness), and prior history',
      'Support caregiver\'s development of routines to enhance safety',
      'Helped establish caregiver as a protective, benevolent, legitimate authority figure',
    ],
  },
  {
    id: 'strengthenFamilyRelationships',
    title: 'STRENGTHEN FAMILY RELATIONSHIPS: PROMOTE EMOTIONAL RECIPROCITY',
    bulletPoints: [
      'Helped caregiver reflect on how current expectations about relationships (child\'s or caregiver\'s) are shaped by past experience',
      'Helped caregiver identify and explore origins of negative views/representations of the child',
      'Helped caregiver think about how perceptions may affect behavior or interactions with child',
      'Helped caregiver and child notice and respond supportively to each other\'s relational bids',
      'Helped caregiver reflect and respond benevolently to the child\'s challenging behavior',
      'Helped identify negative perceptions child may have about caregiver',
      'Helped child understand and appreciate caregiver\'s efforts on the child and family\'s behalf',
      'Helped caregiver and child learn ways to repair and connect after conflict',
      'Helped caregiver and child consciously explore new ways of relating that promote trust, continuity, reciprocity, and pleasure',
    ],
  },
  {
    id: 'additionalChildFirstTreatmentObjectives',
    title: 'Additional Child First Treatment Objectives',
    bulletPoints: [
      'Helped caregiver follow child\'s lead; noticed and supported caregiver in accomplishment',
      'Fostered caregiver\'s understanding of the importance of engagement and mutual enjoyment in caregiver-child relationship and consequent reduction of behavioral problems',
      'Helped caregiver reflect on spontaneous moments of engagement and enjoyment in session',
      'Facilitated dyadic play, reciprocal interactions and normative developmental activities that are mutually enjoyable. Reflected with caregiver on how these may be used in session and as daily activities',
    ],
  },
  {
    id: 'coordinateCare',
    title: 'COORDINATE CARE/ADDRESS FAMILY SERVICE NEEDS',
    bulletPoints: [
      'Engaged in systematic efforts to obtain all relevant information about child history (e.g., CPS reports related to placement history, child health history)',
      'Helped family members obtain needed referrals to other services',
      'Communicated and coordinated care as needed with other service providers',
      'Reflected on the needs of the entire family and prioritized services according to immediacy of needs',
      'Took steps to ensure that risks to the child\'s safety were known and addressed effectively by the team of service providers involved with the family',
      'Fostered a climate of transparency in communicating to caregiver the way that service providers are working together to ensure child safety',
    ],
  },
  {
    id: 'coordinateCareAdditional',
    title: 'COORDINATE CARE/ADDRESS FAMILY SERVICE NEEDS (continued) - Additional Child First Treatment Objectives',
    bulletPoints: [
      'Responded promptly and thoughtfully to concrete family needs in order to improve quality of life, enhance growth, and reduce stress',
      'Helped caregiver develop effective and realistic problem-solving strategies that would meet the needs of the family',
      'Provided hands-on assistance to connect children and caregivers with needed services and supports, both formal and informal',
      'Supported self-reflection in the caregiver to avoid repetition of interpersonal problems, which have impacted her capacity to advocate effectively for herself and family',
      'Supported caregiver in identifying potential obstacles when communicating with agencies and service providers. Helped caregiver reflect on how to overcome potential barriers in accessing community services',
      'Reflected on possible psychological barriers which interfered with the caregiver\'s success in accessing services',
    ],
  },
  {
    id: 'strengthenDyadicAffectRegulation',
    title: 'STRENGTHEN DYADIC AFFECT REGULATION CAPACITIES',
    bulletPoints: [
      'Fostered caregiver\'s ability to respond in soothing ways when child is upset',
      'Fostered child\'s ability to use caregiver as a secure base',
      'Provided developmental guidance around typical early childhood fears/anxieties',
      'Acknowledged and helped find words for emotional experiences: ☐caregiver ☐child',
      'Provided developmental guidance around emotional reactions: ☐caregiver ☐child',
      'Taught, developed, or fostered strategies for regulating affect: ☐caregiver ☐child',
      'Explored with caregiver links between emotional responses to past experiences and current emotional responses to child\'s behavior',
    ],
  },
  {
    id: 'strengthenDyadicBodyBasedRegulation',
    title: 'STRENGTHEN DYADIC BODY-BASED REGULATION',
    bulletPoints: [
      'Fostered body-based awareness, including awareness of physiological responses, particularly as they relate to stress ☐caregiver ☐child',
      'Fostered understanding and identification of body-based trauma reminders',
      'Helped caregiver learn/engage in body-based regulation techniques to regulate affect',
      'Helped caregiver & child learn or use body-based regulation techniques to soothe child',
      'Helped caregiver and child exchange physical expressions of care',
      'Enhanced understanding of safe body-based boundaries',
    ],
  },
  {
    id: 'supportChildRelationshipWithOtherCaregivers',
    title: 'SUPPORT CHILD\'S RELATIONSHIP WITH OTHER IMPORTANT CAREGIVERS',
    bulletPoints: [
      'Helped caregivers understand the child\'s perspective and need for positive representations of alternative caregivers (e.g., father, step-parent, foster parents)',
      'Helped caregiver support the child in integrating the positive and negative aspects of other caregivers',
      'Shared the concept of angel moments and the importance of helping the child hold on to positive memories involving alternative caregivers, even when relationships between caregivers are strained',
      'Supported child in developing an age-appropriate understanding of the family history',
      'Supported the child in understanding that different family members have different points of view and different ways of relating to each other and to the child',
    ],
  },
  {
    id: 'enhanceUnderstandingOfBehavior',
    title: 'ENHANCE UNDERSTANDING OF THE MEANING OF BEHAVIOR',
    bulletPoints: [
      'Helped caregiver notice behavior (child\'s, caregiver\'s, or another caregiver\'s)',
      'Provided developmental guidance regarding age appropriate behavior and developmental meaning of behavior',
      'Provided developmental guidance around how children learn and develop',
      'Helped caregiver consider (reflect on) the meaning of child and/or caregiver behavior (thinking about developmental stage, past experiences, cultural beliefs)',
      'Helped enhance reflective functioning in caregivers and child',
    ],
  },
  {
    id: 'enhanceUnderstandingAdditional',
    title: 'Additional Child First Treatment Objectives (Understanding Behavior)',
    bulletPoints: [
      'Helped caregiver notice antecedents to child\'s behavior, responses of others to those behaviors, and contributing factors leading to escalation',
      'Provided information to help caregiver understand their importance in the growth of their child\'s healthy development',
      'Provided information about unique sensori-motor or other neurologically-based processing needs and limitations, as needed',
      'Introduced frequently used language and concepts to build a common vocabulary (e.g., emotional muscle, Circle of Security concepts and language, trauma reminders, etc.)',
    ],
  },
  {
    id: 'attachmentExplorationBalance',
    title: 'ATTACHMENT-EXPLORATION BALANCE AND HEALING RELATIONSHIP DISRUPTIONS',
    bulletPoints: [
      'Noted and reflected on caregiver\'s prompt, appropriate response to child\'s attachment cues',
      'Provided guidance regarding need of child for proximity to caregiver and for independent exploration. Referred to Circle of Security diagram',
      'Provided guidance regarding the importance of being "bigger, stronger, wiser, and kind" in response to dangerous or inappropriate child behavior',
      'Provided guidance regarding need for caregiving during disruptions and major separations',
      'Reflected with caregiver on past caregiver-child experiences that may have led to "miscuing"',
      'Reflected with caregiver on her emotional responses to child\'s attachment/exploration cues and serving as a secure base',
    ],
  },
  {
    id: 'supportChildDevelopmentalTrajectory',
    title: 'SUPPORT CHILD IN RETURNING TO A NORMAL DEVELOPMENTAL TRAJECTORY',
    bulletPoints: [
      'Supported adaptive behavior and normative developmental activities',
      'Supported healthy non-trauma play',
      'Supported positive identity development',
      'Fostered caregiver\'s efforts to engage in age appropriate activities',
      'Provided care coordination to help engage child in age appropriate activities (e.g., pre-school)',
    ],
  },
  {
    id: 'normalizeTraumaticResponse',
    title: 'NORMALIZE THE TRAUMATIC RESPONSE',
    bulletPoints: [
      'Acknowledged effects of child\'s and caregivers\' experience of trauma and historical trauma',
      'Provided psychoeducation: Impact of trauma, including common symptoms & PTSD, trauma reminders and how they affect child and caregiver',
      'Helped caregiver anticipate developmental changes in child\'s processing of the trauma',
    ],
  },
  {
    id: 'supportDyadAcknowledgingTrauma',
    title: 'SUPPORT DYAD IN ACKNOWLEDGING THE IMPACT OF TRAUMA',
    bulletPoints: [
      'Promoted a deep emotional acknowledgement of the impact of trauma while attending and responding to dysregulated (over or under) affective states',
      'Helped caregiver acknowledge what child has witnessed & remembers',
      'Helped caregiver and child understand each other\'s reality (with regards to the trauma)',
      'Helped caregiver & child identify and cope with trauma reminders',
      'Helped caregiver think about his/her own trauma history (ghosts in the nursery) and ways this history may affect her/him and the way s/he parents',
    ],
  },
  {
    id: 'helpDyadDifferentiateThenAndNow',
    title: 'HELP DYAD DIFFERENTIATE BETWEEN THEN AND NOW',
    bulletPoints: [
      'Highlighted difference between past and present circumstances',
      'Helped dyad understand that they can make new choices',
      'Helped child and caregiver become aware of the difference between reliving and remembering by helping them identify traumatic triggers and pointing out the different circumstances in the past and the present',
    ],
  },
  {
    id: 'helpDyadPutTraumaInPerspective',
    title: 'HELP DYAD PUT THE TRAUMATIC EXPERIENCE IN PERSPECTIVE',
    bulletPoints: [
      'Supported caregiver and child in making meaning (e.g., creating a story, using ritual, connecting with spiritual beliefs)',
      'Integrate historical trauma as part of the family and personal narrative',
      'Worked with beliefs (existential challenges) around why the traumatic events happened (e.g., that they are bad, being punished)',
      'Helped caregiver and child see trauma as something that happened to them but that does not define them',
      'Supported family\'s advocacy work or work to help others',
      'Fostered acceptance around how these experiences have shaped the caregiver and child\'s sense of self',
      'Helped the family find pathways to post trauma growth and joy',
      'Encouraged appreciation of goodness, beauty, and hope',
    ],
  },
]

// ============================================
// CHALLENGE LEVEL OPTIONS
// ============================================

export const challengeLevelOptions = [
  { value: 'no', label: 'No' },
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'significant', label: 'Significant' },
]

export const capacityLevelOptions = [
  { value: 'requires_development', label: 'Requires Development' },
  { value: 'emerging', label: 'Emerging' },
  { value: 'acquired', label: 'Acquired' },
]

export const attendanceResponseOptions = [
  { value: 'no', label: 'No' },
  { value: 'yes_not_regular', label: 'Yes, But They Did Not Attend Regularly' },
  { value: 'yes_attended', label: 'Yes, Attended' },
]

// ============================================
// CPP CLOSING FORM OPTIONS
// ============================================

export const terminationPhaseOptions = [
  { value: 'foundational', label: 'Foundational Phase' },
  { value: 'core_intervention', label: 'Core Intervention Phase' },
  { value: 'termination', label: 'Termination Phase' },
  { value: 'completed_termination', label: 'Completed Termination Phase' },
]

export const terminationInitiatorOptions = [
  { value: 'family', label: 'Family' },
  { value: 'clinical_team', label: 'Clinical Team' },
  { value: 'mutually_agreed', label: 'Mutually agreed upon' },
]

export const terminationTypeOptions = [
  { value: 'dropped', label: 'Dropped (no termination process possible)' },
  { value: 'abrupt', label: 'Abrupt termination (informed of termination but full planned termination not possible)' },
  { value: 'planned', label: 'Planned termination' },
]

export const changeInFunctioningOptions = [
  { value: 'much_worse', label: 'Much worse' },
  { value: 'slightly_worse', label: 'Slightly worse' },
  { value: 'no_change', label: 'No change' },
  { value: 'slightly_improved', label: 'Slightly improved' },
  { value: 'much_improved', label: 'Much improved' },
]

export const prognosisOptions = [
  { value: 'poor', label: 'Poor' },
  { value: 'fair', label: 'Fair' },
  { value: 'good', label: 'Good' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'unable_to_rate', label: 'Unable to rate' },
]

// Closing reasons grouped by column
export const closingReasonsColumn1 = [
  { id: 'reasonUnknown', label: 'Reason unknown' },
  { id: 'moved', label: 'Moved' },
  { id: 'tooBusy', label: 'Too busy' },
  { id: 'transportationProblems', label: 'Transportation problems' },
  { id: 'schedulingProblems', label: 'Scheduling problems' },
  { id: 'unexpectedEmergency', label: 'Unexpected emergency' },
]

export const closingReasonsColumn2 = [
  { id: 'caregiverChallenges', label: 'Caregiver challenges' },
  { id: 'mentalIllness', label: 'Mental illness' },
  { id: 'physicalIllness', label: 'Physical illness' },
  { id: 'inDrugTreatmentResidential', label: 'In drug treatment/residential' },
  { id: 'inJail', label: 'In jail' },
  { id: 'lostCustodyOrVisits', label: 'Lost custody of or visits w/ child' },
]

export const closingReasonsColumn3 = [
  { id: 'familyDidNotWantMore', label: 'Family did not want more treatment' },
  { id: 'feltNotUseful', label: 'Felt not useful' },
  { id: 'feltNoMoreProblems', label: 'Felt no more problems' },
  { id: 'otherResponsibilities', label: 'Other responsibilities' },
  { id: 'pressureFromPartnerOrFamily', label: 'Pressure from partner or other family' },
  { id: 'unhappyWithClinicalTeam', label: 'Unhappy with Clinical Team' },
]

export const closingReasonsColumn4 = [
  { id: 'clinicianCareCoordinatorLeft', label: 'Clinician/Care Coordinator left clinic or on leave' },
  { id: 'thoughtFamilyBetterServed', label: 'Thought family better served by another treatment or agency' },
  { id: 'other', label: 'Other, specify' },
]
