// Core Intervention Phase Fidelity Form Items
// Adapted from Child-Parent Psychotherapy

// ========================================
// Types
// ========================================

export type ChallengeLevel = 'no' | 'low' | 'moderate' | 'significant'
export type CapacityLevel = 'requires_development' | 'emerging' | 'acquired'
export type AttendanceStatus = 'no' | 'yes_irregular' | 'yes_attended' | 'not_needed'
export type ClinicalFocus = 0 | 1 | 2 | 3
export type Appropriateness = 'under' | 'appropriate' | 'over'

// Role-based assessment types
export interface RoleBasedChallenge {
  clinician: ChallengeLevel
  ccFrp: ChallengeLevel
}

export interface RoleBasedCapacity {
  clinician: CapacityLevel
  ccFrp: CapacityLevel
}

// ========================================
// Challenge Items
// ========================================

export interface ChallengeItem {
  id: string
  text: string
}

// ========================================
// Reflective Practice Fidelity
// ========================================

export const REFLECTIVE_PRACTICE_CHALLENGES: ChallengeItem[] = [
  { id: 'rp_difficult_engage', text: 'Family is difficult to engage or work with' },
  { id: 'rp_trauma_history', text: 'Family trauma history is likely to provoke negative reactions in any clinician' },
  { id: 'rp_systems_involved', text: 'Systems are involved in complicated and/or conflictual ways with family/treatment' },
  { id: 'rp_different_perspectives', text: 'Clinician/Care Coordinator and caregiver have significantly different perspectives or cultural beliefs' },
  { id: 'rp_skill_level', text: 'Clinician/Care Coordinator knowledge and skill level (e.g., new Clinician/Care Coordinator, new to the model or trauma work)' },
  { id: 'rp_limited_supervision', text: 'Limited access to safe reflective supervision or reflective consultation' },
  { id: 'rp_team_different', text: '*Clinician and Care Coordinator have significantly different perspectives or cultural beliefs (Child First item)' }
]

export interface CapacityContext {
  id: string
  context: string
}

export const CAPACITY_CONTEXTS: CapacityContext[] = [
  { id: 'in_session', context: 'In the moment (in session)' },
  { id: 'self_reflection', context: 'Upon self-reflection (outside session)' },
  { id: 'supervision', context: 'In supervision/consultation' }
]

export interface ReflectiveCapacityItem {
  id: string
  text: string
  hasContexts: boolean
}

export const REFLECTIVE_CAPACITY_ITEMS: ReflectiveCapacityItem[] = [
  { id: 'awareness_emotions', text: 'Awareness of own emotional reactions', hasContexts: true },
  { id: 'awareness_biases', text: 'Awareness of own personal and/or cultural biases', hasContexts: true },
  { id: 'multiple_perspectives', text: 'Ability to consider multiple perspectives (caregiver\'s, child\'s, own)', hasContexts: true },
  { id: 'regulate_emotions', text: 'Ability to recognize and regulate strong emotions prior to intervening (in the moment)', hasContexts: false },
  { id: 'self_care', text: 'Use of self-care practices to enhance ability to regulate', hasContexts: false }
]

export const EXTERNAL_SUPPORT_ITEMS: string[] = [
  'Process emotional reactions',
  'Consider alternative perspectives',
  'Seek new knowledge & new skills'
]

// ========================================
// Emotional Process Fidelity
// ========================================

export const EMOTIONAL_PROCESS_CHALLENGES: ChallengeItem[] = [
  { id: 'ep_caregiver_dysreg', text: 'Caregiver is dysregulated or triggered' },
  { id: 'ep_caregiver_avoidant', text: 'Caregiver is avoidant or shut down' },
  { id: 'ep_child_dysreg', text: 'Child is dysregulated or triggered' },
  { id: 'ep_child_avoidant', text: 'Child is avoidant or shut down' }
]

export const EMOTIONAL_CAPACITY_ITEMS: string[] = [
  'Identify when caregiver is not regulated',
  'Tolerate caregiver\'s strong emotional reactions',
  'Intervene in ways to help caregiver become regulated',
  'Identify when child is not regulated',
  'Tolerate child\'s strong emotional reactions',
  'Create a context where child\'s emotional response is understood',
  'Create a context where child is helped to regulate',
  '*Identify when Clinician/Care Coordinator\'s personal history, culture, or beliefs are impacting emotional process fidelity (Child First item)'
]

// ========================================
// Dyadic-Relational Fidelity
// ========================================

export const DYADIC_CHALLENGES: ChallengeItem[] = [
  { id: 'dr_conflictual', text: 'Caregiver and child have conflictual, competing agendas' },
  { id: 'dr_difficulty_understanding', text: 'Caregiver has difficulty understanding or tolerating child\'s behavior or temperament' },
  { id: 'dr_trauma_reminders', text: 'Caregiver and/or child serve as trauma reminders to the other' },
  { id: 'dr_unrealistic', text: 'Caregiver has unrealistic expectations of the child' },
  { id: 'dr_sensorimotor', text: 'Child has sensorimotor or affect regulation challenges' }
]

export const DYADIC_CAPACITY_ITEMS: string[] = [
  'Balance attention between caregiver and child (tracking both)',
  'Hold/support child and caregiver perspectives',
  'Bridge/translate between caregiver & child (help them understand each other)',
  'Intervene in ways that strengthen the caregiver-child relationship',
  'Think about and support child\'s relationship with other important caregivers (e.g., father)'
]

// ========================================
// Trauma Framework Fidelity
// ========================================

export const TRAUMA_CHALLENGES: ChallengeItem[] = [
  { id: 'tf_child_unknown', text: 'Child\'s history being unknown' },
  { id: 'tf_caregiver_unknown', text: 'Caregiver\'s history being unknown' },
  { id: 'tf_not_acknowledging', text: 'Caregiver not fully acknowledging child\'s history or not agreeing to talk about it' },
  { id: 'tf_no_framework', text: 'Caregiver not having a trauma framework (does not view child behavior in light of history)' },
  { id: 'tf_triggered', text: 'Caregiver being triggered and having difficulty thinking about child\'s past experience' }
]

export const TRAUMA_CAPACITY_ITEMS: string[] = [
  'Keep child\'s and caregiver\'s trauma history in mind',
  'Think about how the child\'s and caregiver\'s history may be affecting interactions with each other and with the Clinician/Care Coordinator',
  'Frame interventions (e.g., affect regulation, improving relationships) within the broader context of the family\'s traumatic experiences (in addition to other contributing factors)',
  '**Clinicians only:** Directly talk about and bring up the family\'s trauma history when relevant'
]

// ========================================
// Procedural Fidelity
// ========================================

export const PROCEDURAL_CHALLENGES: ChallengeItem[] = [
  { id: 'pf_family_scheduling', text: 'Scheduling challenges due to family illness, work, competing needs, or irregular visitation schedule make it difficult for family to attend weekly sessions' },
  { id: 'pf_team_scheduling', text: 'Scheduling challenges due to Clinician/Care Coordinator illness, work schedule or competing needs make it difficult for Clinician/Care Coordinator to hold weekly sessions' },
  { id: 'pf_family_structure', text: 'Family structure (e.g., multiple children) makes it difficult for Clinician/Care Coordinator and caregiver to hold sessions focusing on the needs of individual children when clinically indicated' },
  { id: 'pf_chaotic', text: 'Home visiting environment often chaotic' }
]

export const PROCEDURAL_CAPACITY_ITEMS: string[] = [
  'Schedule sessions on a regular basis (generally 1x per week)',
  'Give appropriate notice for vacation',
  '*Propose caregiver collateral sessions (Care Coordinator with caregiver - Child First item)'
]

// ========================================
// Contact Log Types
// ========================================

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

export type NotAttendingReason =
  | 'childcare_problem'
  | 'conflicting_appointment'
  | 'forgot'
  | 'illness'
  | 'team_cancelled'
  | 'transportation'
  | 'weather'
  | 'other'

export type Attendee =
  | 'target_child'
  | 'caregiver_1'
  | 'caregiver_2'
  | 'caregiver_3'
  | 'caregiver_4'
  | 'sibling_1'
  | 'sibling_2'
  | 'sibling_3'
  | 'sibling_4'
  | 'collateral'

export type SessionLocation = 'home' | 'clinic' | 'community' | 'other'

export interface ContactLogEntry {
  id: string
  date: string
  contactType: ContactType | ''
  minutes: string
  sessionStatus: SessionStatus | ''
  notAttendingReason: NotAttendingReason | ''
  attendees: Attendee[]
  collateralSpecify: string
  location: SessionLocation | ''
  sessionCounter: string
}

export const CONTACT_TYPES: { value: ContactType; label: string }[] = [
  { value: 'assessment', label: 'Assessment' },
  { value: 'case_management', label: 'Case management' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'dyadic_treatment', label: 'Dyadic Treatment*' },
  { value: 'individual_caregiver', label: 'Individual caregiver*' },
  { value: 'individual_child', label: 'Individual child*' },
  { value: 'caregiver_phone_conversation', label: 'Caregiver phone - conversation' },
  { value: 'caregiver_phone_message', label: 'Caregiver phone - message' },
  { value: 'collateral_meeting', label: 'Collateral - meeting' },
  { value: 'collateral_phone', label: 'Collateral - phone' },
  { value: 'collateral_other', label: 'Collateral - other' },
  { value: 'team_meeting', label: 'Team meeting' },
  { value: 'other', label: 'Other' }
]

export const SESSION_STATUS_OPTIONS: { value: SessionStatus; label: string }[] = [
  { value: 'show', label: 'Show' },
  { value: 'cancel', label: 'Cancel' },
  { value: 'no_show', label: 'No Show' }
]

export const NOT_ATTENDING_REASONS: { value: NotAttendingReason; label: string }[] = [
  { value: 'childcare_problem', label: 'Childcare problem' },
  { value: 'conflicting_appointment', label: 'Conflicting appointment' },
  { value: 'forgot', label: 'Forgot' },
  { value: 'illness', label: 'Illness' },
  { value: 'team_cancelled', label: 'Team member cancelled' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'weather', label: 'Weather' },
  { value: 'other', label: 'Other' }
]

export const ATTENDEE_OPTIONS: { value: Attendee; label: string }[] = [
  { value: 'target_child', label: 'Target child' },
  { value: 'caregiver_1', label: 'Caregiver 1' },
  { value: 'caregiver_2', label: 'Caregiver 2' },
  { value: 'caregiver_3', label: 'Caregiver 3' },
  { value: 'caregiver_4', label: 'Caregiver 4' },
  { value: 'sibling_1', label: 'Sibling 1' },
  { value: 'sibling_2', label: 'Sibling 2' },
  { value: 'sibling_3', label: 'Sibling 3' },
  { value: 'sibling_4', label: 'Sibling 4' },
  { value: 'collateral', label: 'Collateral: specify' }
]

export const LOCATION_OPTIONS: { value: SessionLocation; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'community', label: 'Community' },
  { value: 'other', label: 'Other' }
]

// ========================================
// CPP Objectives
// ========================================

export interface CPPObjective {
  id: string
  title: string
  description: string
  items: string[]
}

export const CPP_OBJECTIVES: CPPObjective[] = [
  {
    id: 'convey_hope',
    title: 'Convey Hope',
    description: 'Conveying hope for healing and growth',
    items: [
      'Highlighted that change and growth are possible given positive steps the family has made',
      'Provided realistic examples of potential pathways for healing, noting ways that caregiver efforts and treatment may lead to improved caregiver and child functioning',
      'Helped caregiver identify "angels in the nursery" and reflect on times when he/she felt safe and loved',
      'Helped the family connect to spiritual resources consistent with family traditions'
    ]
  },
  {
    id: 'empathic_relationship',
    title: 'Develop Empathic Relationship with Family Members',
    description: 'Building empathic therapeutic relationships',
    items: [
      'Empathically listened to concerns: caregiver / child\'s',
      'Understood difficult behavior given past history & current context: caregiver / child',
      'Made warm supportive comments or recognized accomplishments: caregiver / child',
      'Understood caregivers\' mistrust of providers and reluctance to engage in treatment in light of their past history and current experiences with potentially punitive systems'
    ]
  },
  {
    id: 'enhance_safety_physical',
    title: 'Enhance Safety - Physical Safety',
    description: 'Addressing physical safety concerns',
    items: [
      'Helped caregiver reflect on his/her history of physical endangerment and how it shapes current expectations regarding danger and safety',
      'In a supportive, non-confrontational manner, directly addressed safety issues with caregiver with the goal of increasing caregiver awareness and mobilizing protective action',
      'Balanced respect for the caregiver\'s psychological vulnerabilities with the need to address lapses in safety and destructive or self-destructive behavior',
      'Encouraged the caregiver to develop an attitude that prioritizes safety as a core value for the caregiver, child, and family',
      'Supported caregiver in engaging other family members in addressing risks to safety (including partners who may have been violent)',
      'Focused on and addressed serious risks to physical safety, including risks within family relationships and permanency of placement',
      'Engaged in safety planning',
      'Assessed for and filed appropriate DCF reports for suspected abuse'
    ]
  },
  {
    id: 'enhance_safety_environmental',
    title: 'Safety - Environmental Context',
    description: 'Addressing environmental safety factors',
    items: [
      'Discussed ways that contextual risks (e.g., poverty, community violence, immigration related-risks, inadequate or unsafe housing, and inadequate access to services) affect child and family functioning',
      'Considered the impact of racism and historical trauma on child and family functioning'
    ]
  },
  {
    id: 'enhance_safety_stabilization',
    title: 'Safety - Stabilization',
    description: 'Stabilization of basic needs',
    items: [
      'Discussed provision/maintenance of basic needs',
      'Provided care coordination to help family obtain basic needs',
      'Helped caregiver develop the capacities to obtain services and needs independently (to overcome barriers, communicate about needs, and collaborate with service providers)',
      'Helped caregiver identify and address root causes of recurrent crisis and ongoing instability'
    ]
  },
  {
    id: 'safety_therapy',
    title: 'Safety & Consistency in Therapy',
    description: 'Creating safety within the therapeutic context',
    items: [
      'Acknowledged safety risks to participating in therapy: mandated reporting, etc.',
      'Encouraged consistent, on-time participation in therapy',
      'Created a consistent environment for treatment'
    ]
  },
  {
    id: 'perceived_safety',
    title: 'Perceived Safety',
    description: 'Addressing perceptions of danger and safety',
    items: [
      'Identify misperceptions of danger or safety: caregiver / child',
      'Foster accurate perceptions of danger and safety'
    ]
  },
  {
    id: 'safety_relationships',
    title: 'Safety within Caregiver-Child Relationships',
    description: 'Promoting safety in the parent-child relationship',
    items: [
      'Acknowledged past history of risks to safety: caregiver / child',
      'Highlighted the need for safe behavior while legitimizing feelings (e.g., child cannot hit others even though child is angry)',
      'Fostered caregiver\'s ability to socialize child in ways that are consistent both with the caregiver\'s cultural values and beliefs and the family\'s context',
      'Identified factors that may interfere with caregivers capacity to socialize child, including environmental circumstances, strong emotions (e.g., guilt, fear, feelings of worthlessness), and prior history',
      'Support caregiver\'s development of routines to enhance safety',
      'Helped establish caregiver as a protective, benevolent, legitimate authority figure'
    ]
  },
  {
    id: 'emotional_reciprocity',
    title: 'Strengthen Family Relationships: Promote Emotional Reciprocity',
    description: 'Building emotional connection and reciprocity',
    items: [
      'Helped caregiver reflect on how current expectations about relationships (child\'s or caregiver\'s) are shaped by past experience',
      'Helped caregiver identify and explore origins of negative views/representations of the child',
      'Helped caregiver think about how perceptions may affect behavior or interactions with child',
      'Helped caregiver and child notice and respond supportively to each other\'s relational bids',
      'Helped caregiver reflect and respond benevolently to the child\'s challenging behavior',
      'Helped identify negative perceptions child may have about caregiver',
      'Helped child understand and appreciate caregiver\'s efforts on the child and family\'s behalf',
      'Helped caregiver and child learn ways to repair and connect after conflict',
      'Helped caregiver and child consciously explore new ways of relating that promote trust, continuity, reciprocity, and pleasure'
    ]
  },
  {
    id: 'emotional_reciprocity_cf',
    title: 'Additional Child First Treatment Objectives (Emotional Reciprocity)',
    description: 'Child First specific emotional reciprocity objectives',
    items: [
      'Helped caregiver follow child\'s lead; noticed and supported caregiver in accomplishment',
      'Fostered caregiver\'s understanding of the importance of engagement and mutual enjoyment in caregiver-child relationship and consequent reduction of behavioral problems',
      'Helped caregiver reflect on spontaneous moments of engagement and enjoyment in session',
      'Facilitated dyadic play, reciprocal interactions and normative developmental activities that are mutually enjoyable. Reflected with caregiver on how these may be used in session and as daily activities'
    ]
  },
  {
    id: 'coordinate_care',
    title: 'Coordinate Care/Address Family Service Needs',
    description: 'Care coordination activities',
    items: [
      'Engaged in systematic efforts to obtain all relevant information about child history (e.g., CPS reports related to placement history, child health history)',
      'Helped family members obtain needed referrals to other services',
      'Communicated and coordinated care as needed with other service providers',
      'Reflected on the needs of the entire family and prioritized services according to immediacy of needs',
      'Took steps to ensure that risks to the child\'s safety were known and addressed effectively by the team of service providers involved with the family',
      'Fostered a climate of transparency in communicating to caregiver the way that service providers are working together to ensure child safety'
    ]
  },
  {
    id: 'coordinate_care_cf',
    title: 'Additional Child First Treatment Objectives (Care Coordination)',
    description: 'Child First specific care coordination objectives',
    items: [
      'Responded promptly and thoughtfully to concrete family needs in order to improve quality of life, enhance growth, and reduce stress',
      'Helped caregiver develop effective and realistic problem-solving strategies that would meet the needs of the family',
      'Provided hands-on assistance to connect children and caregivers with needed services and supports, both formal and informal',
      'Supported self-reflection in the caregiver to avoid repetition of interpersonal problems, which have impacted her capacity to advocate effectively for herself and family',
      'Supported caregiver in identifying potential obstacles when communicating with agencies and service providers. Helped caregiver reflect on how to overcome potential barriers in accessing community services',
      'Reflected on possible psychological barriers which interfered with the caregiver\'s success in accessing services'
    ]
  },
  {
    id: 'affect_regulation',
    title: 'Strengthen Dyadic Affect Regulation Capacities',
    description: 'Building affect regulation skills',
    items: [
      'Fostered caregiver\'s ability to respond in soothing ways when child is upset',
      'Fostered child\'s ability to use caregiver as a secure base',
      'Provided developmental guidance around typical early childhood fears/anxieties',
      'Acknowledged and helped find words for emotional experiences: caregiver / child',
      'Provided developmental guidance around emotional reactions: caregiver / child',
      'Taught, developed, or fostered strategies for regulating affect: caregiver / child',
      'Explored with caregiver links between emotional responses to past experiences and current emotional responses to child\'s behavior'
    ]
  },
  {
    id: 'body_regulation',
    title: 'Strengthen Dyadic Body-Based Regulation',
    description: 'Building body-based regulation skills',
    items: [
      'Fostered body-based awareness, including awareness of physiological responses, particularly as they relate to stress: caregiver / child',
      'Fostered understanding and identification of body-based trauma reminders',
      'Helped caregiver learn/engage in body-based regulation techniques to regulate affect',
      'Helped caregiver & child learn or use body-based regulation techniques to soothe child',
      'Helped caregiver and child exchange physical expressions of care',
      'Enhanced understanding of safe body-based boundaries'
    ]
  },
  {
    id: 'other_caregivers',
    title: 'Support Child\'s Relationship with Other Important Caregivers',
    description: 'Supporting relationships with other caregivers',
    items: [
      'Helped caregivers understand the child\'s perspective and need for positive representations of alternative caregivers (e.g., father, step-parent, foster parents)',
      'Helped caregiver support the child in integrating the positive and negative aspects of other caregivers',
      'Shared the concept of angel moments and the importance of helping the child hold on to positive memories involving alternative caregivers, even when relationships between caregivers are strained',
      'Supported child in developing an age-appropriate understanding of the family history',
      'Supported the child in understanding that different family members have different points of view and different ways of relating to each other and to the child'
    ]
  },
  {
    id: 'meaning_behavior',
    title: 'Enhance Understanding of the Meaning of Behavior',
    description: 'Building understanding of behavior',
    items: [
      'Helped caregiver notice behavior (child\'s, caregiver\'s, or another caregiver\'s)',
      'Provided developmental guidance regarding age appropriate behavior and developmental meaning of behavior',
      'Provided developmental guidance around how children learn and develop',
      'Helped caregiver consider (reflect on) the meaning of child and/or caregiver behavior (thinking about developmental stage, past experiences, cultural beliefs)',
      'Helped enhance reflective functioning in caregivers and child'
    ]
  },
  {
    id: 'meaning_behavior_cf',
    title: 'Additional Child First Treatment Objectives (Meaning of Behavior)',
    description: 'Child First specific meaning of behavior objectives',
    items: [
      'Helped caregiver notice antecedents to child\'s behavior, responses of others to those behaviors, and contributing factors leading to escalation',
      'Provided information to help caregiver understand their importance in the growth of their child\'s healthy development',
      'Provided information about unique sensori-motor or other neurologically-based processing needs and limitations, as needed',
      'Introduced frequently used language and concepts to build a common vocabulary (e.g., emotional muscle, Circle of Security concepts and language, trauma reminders, etc.)'
    ]
  },
  {
    id: 'attachment_exploration',
    title: 'Attachment-Exploration Balance and Healing Relationship Disruptions',
    description: 'Supporting attachment and exploration balance',
    items: [
      'Noted and reflected on caregiver\'s prompt, appropriate response to child\'s attachment cues',
      'Provided guidance regarding need of child for proximity to caregiver and for independent exploration. Referred to Circle of Security diagram',
      'Provided guidance regarding the importance of being "bigger, stronger, wiser, and kind" in response to dangerous or inappropriate child behavior',
      'Provided guidance regarding need for caregiving during disruptions and major separations',
      'Reflected with caregiver on past caregiver-child experiences that may have led to "miscuing"',
      'Reflected with caregiver on her emotional responses to child\'s attachment/exploration cues and serving as a secure base'
    ]
  },
  {
    id: 'developmental_trajectory',
    title: 'Support Child in Returning to a Normal Developmental Trajectory',
    description: 'Supporting healthy development',
    items: [
      'Supported adaptive behavior and normative developmental activities',
      'Supported healthy non-trauma play',
      'Supported positive identity development',
      'Fostered caregiver\'s efforts to engage in age appropriate activities',
      'Provided care coordination to help engage child in age appropriate activities (e.g., pre-school)'
    ]
  },
  {
    id: 'normalize_trauma',
    title: 'Normalize the Traumatic Response',
    description: 'Normalizing trauma responses',
    items: [
      'Acknowledged effects of child\'s and caregivers\' experience of trauma and historical trauma',
      'Provided psychoeducation: Impact of trauma, including common symptoms & PTSD, trauma reminders and how they affect child and caregiver',
      'Linked child and caregiver behavior to trauma and historical trauma',
      'Provided psychoeducation: Protective role of symptoms',
      'Identified trauma reminders and related behaviors as they appeared in therapy'
    ]
  },
  {
    id: 'coconstruct_narrative',
    title: 'Co-Construct Trauma Narrative',
    description: 'Building shared understanding of trauma history',
    items: [
      'Reviewed child and caregiver history and co-constructed trauma narrative with caregiver',
      'Co-constructed developmentally appropriate trauma narrative with child (verbal and/or play)',
      'Created context for child to share traumatic experiences that encourages their full expression and allows caregiver and child to share emotions, questions, and reassurances',
      'Linked caregiver\'s history and beliefs to parenting'
    ]
  },
  {
    id: 'address_trauma',
    title: 'Address Traumatic Play/Behavior/Reenactment',
    description: 'Working with trauma-related behaviors',
    items: [
      'Helped caregiver recognize the child\'s trauma play, trauma-related behaviors, and/or trauma reenactment',
      'Helped caregiver (and child when appropriate) understand traumatic play/behavior/reenactment in terms of past experiences',
      'Helped caregiver (and child when appropriate) understand traumatic play/behavior/reenactment as a sign of the child processing traumatic experiences',
      'Helped caregiver understand their role in helping child resolve traumatic play',
      'Intervened when traumatic play did not resolve spontaneously',
      'Intervened when trauma reenactment was destructive or dangerous'
    ]
  },
  {
    id: 'maladaptive_coping',
    title: 'Address Maladaptive Coping',
    description: 'Working with maladaptive coping strategies',
    items: [
      'Explored ways in which coping strategies were adaptive given caregiver/child history and current circumstances',
      'Helped child and/or caregiver consider alternate coping strategies',
      'Supported and fostered use of more adaptive coping strategies'
    ]
  }
]

// ========================================
// Form Data Type
// ========================================

export interface CoreInterventionFormData {
  identification: {
    clinicalTeamNames: string
    clientInitials: string
    childFirstSite: string
    monthYear: string
    careLogicId: string
  }
  contactLog: ContactLogEntry[]
  reflectivePractice: {
    challenges: Record<string, RoleBasedChallenge>
    capacity: Record<string, Record<string, RoleBasedCapacity>>
    capacitySimple: Record<string, RoleBasedCapacity>
    externalSupports: Record<string, RoleBasedCapacity>
    notes: string
  }
  emotionalProcess: {
    challenges: Record<string, RoleBasedChallenge>
    capacity: Record<string, RoleBasedCapacity>
    notes: string
  }
  dyadicRelational: {
    challenges: Record<string, RoleBasedChallenge>
    capacity: Record<string, RoleBasedCapacity>
    notes: string
  }
  traumaFramework: {
    challenges: Record<string, RoleBasedChallenge>
    capacity: Record<string, RoleBasedCapacity>
    notes: string
  }
  proceduralFidelity: {
    challenges: Record<string, RoleBasedChallenge>
    capacity: Record<string, RoleBasedCapacity>
    notes: string
  }
  cppObjectives: Record<string, Record<string, ClinicalFocus>>
  objectiveAppropriateness: Record<string, Appropriateness>
  notes: string
}

// ========================================
// Default Form Data
// ========================================

function createEmptyContactLogEntry(): ContactLogEntry {
  return {
    id: crypto.randomUUID(),
    date: '',
    contactType: '',
    minutes: '',
    sessionStatus: '',
    notAttendingReason: '',
    attendees: [],
    collateralSpecify: '',
    location: '',
    sessionCounter: ''
  }
}

export const DEFAULT_CORE_INTERVENTION_DATA: CoreInterventionFormData = {
  identification: {
    clinicalTeamNames: '',
    clientInitials: '',
    childFirstSite: '',
    monthYear: '',
    careLogicId: ''
  },
  contactLog: [createEmptyContactLogEntry()],
  reflectivePractice: {
    challenges: {},
    capacity: {},
    capacitySimple: {},
    externalSupports: {},
    notes: ''
  },
  emotionalProcess: {
    challenges: {},
    capacity: {},
    notes: ''
  },
  dyadicRelational: {
    challenges: {},
    capacity: {},
    notes: ''
  },
  traumaFramework: {
    challenges: {},
    capacity: {},
    notes: ''
  },
  proceduralFidelity: {
    challenges: {},
    capacity: {},
    notes: ''
  },
  cppObjectives: {},
  objectiveAppropriateness: {},
  notes: ''
}
