export interface FidelityItem {
  id: string
  text: string
  description?: string
  childFirstOnly?: boolean
}

export interface FidelityStrandConfig {
  id: string
  title: string
  description?: string
  challengeItems: FidelityItem[]
  capacityItems: FidelityItem[]
  capacityGroups?: {
    title: string
    items: FidelityItem[]
  }[]
}

// ========================================
// Strand 1: Reflective Practice Fidelity
// ========================================

export const strand1: FidelityStrandConfig = {
  id: 'strand1',
  title: 'Reflective Practice Fidelity',
  challengeItems: [
    {
      id: 's1_ch1',
      text: 'Family is difficult to engage or work with',
    },
    {
      id: 's1_ch2',
      text: "Family trauma history is likely to provoke negative reactions in any Clinician/Care Coordinator",
    },
    {
      id: 's1_ch3',
      text: 'Systems are involved in complicated and/or conflictual ways with family/treatment',
    },
    {
      id: 's1_ch4',
      text: 'Clinician/Care Coordinator and caregiver have significantly different perspectives or cultural beliefs',
    },
    {
      id: 's1_ch5',
      text: 'Clinician/Care Coordinator knowledge and skill level (e.g. new Clinician/Care Coordinator, new to the model or trauma work)',
    },
    {
      id: 's1_ch6',
      text: 'Limited access to safe reflective supervision or reflective consultation',
    },
    {
      id: 's1_ch7',
      text: 'Clinician and Care Coordinator have significantly different perspectives or cultural beliefs',
      childFirstOnly: true,
    },
  ],
  capacityGroups: [
    {
      title: 'Awareness of own emotional reactions',
      items: [
        { id: 's1_cap1a', text: 'In the moment (in session)' },
        { id: 's1_cap1b', text: 'Upon self-reflection (outside session)' },
        { id: 's1_cap1c', text: 'In supervision/consultation' },
      ],
    },
    {
      title: 'Awareness of own personal and/or cultural biases',
      items: [
        { id: 's1_cap2a', text: 'In the moment (in session)' },
        { id: 's1_cap2b', text: 'Upon self-reflection (outside session)' },
        { id: 's1_cap2c', text: 'In supervision/consultation' },
      ],
    },
    {
      title: 'Ability to consider multiple perspectives (caregiver\'s, child\'s, own)',
      items: [
        { id: 's1_cap3a', text: 'In the moment (in session)' },
        { id: 's1_cap3b', text: 'Upon self-reflection (outside session)' },
        { id: 's1_cap3c', text: 'In supervision/consultation' },
      ],
    },
  ],
  capacityItems: [
    {
      id: 's1_cap4',
      text: 'Ability to recognize and regulate strong emotions prior to intervening (in the moment)',
    },
    {
      id: 's1_cap5',
      text: 'Use of self-care practices to enhance ability to regulate',
    },
    {
      id: 's1_cap6',
      text: 'USE OF EXTERNAL SUPPORTS - Appropriately uses supervision and/or consultation with colleagues to: Process emotional reactions',
    },
    {
      id: 's1_cap7',
      text: 'USE OF EXTERNAL SUPPORTS - Appropriately uses supervision and/or consultation with colleagues to: Consider alternative perspectives',
    },
    {
      id: 's1_cap8',
      text: 'USE OF EXTERNAL SUPPORTS - Appropriately uses supervision and/or consultation with colleagues to: Seek new knowledge & new skills',
    },
  ],
}

// ========================================
// Strand 2: Emotional Process Fidelity
// ========================================

export const strand2: FidelityStrandConfig = {
  id: 'strand2',
  title: 'Emotional Process Fidelity',
  challengeItems: [
    { id: 's2_ch1', text: 'Caregiver is dysregulated or triggered' },
    { id: 's2_ch2', text: 'Caregiver is avoidant or shut down' },
    { id: 's2_ch3', text: 'Child is dysregulated or triggered' },
    { id: 's2_ch4', text: 'Child is avoidant or shut down' },
  ],
  capacityItems: [
    { id: 's2_cap1', text: 'Identify when caregiver is not regulated' },
    { id: 's2_cap2', text: "Tolerate caregiver's strong emotional reactions" },
    { id: 's2_cap3', text: 'Intervene in ways to help caregiver become regulated' },
    { id: 's2_cap4', text: 'Identify when child is not regulated' },
    { id: 's2_cap5', text: "Tolerate child's strong emotional reactions" },
    { id: 's2_cap6', text: "Create a context where child's emotional response is understood" },
    { id: 's2_cap7', text: 'Create a context where child is helped to regulate' },
    {
      id: 's2_cap8',
      text: "Identify when Clinician/Care Coordinator's personal history, culture, or beliefs are impacting emotional process fidelity",
      childFirstOnly: true,
    },
  ],
}

// ========================================
// Strand 3: Dyadic-Relational Fidelity
// ========================================

export const strand3: FidelityStrandConfig = {
  id: 'strand3',
  title: 'Dyadic-Relational Fidelity',
  challengeItems: [
    { id: 's3_ch1', text: 'Caregiver and child have conflictual, competing agendas' },
    {
      id: 's3_ch2',
      text: "Caregiver has difficulty understanding or tolerating child's behavior or temperament",
    },
    { id: 's3_ch3', text: 'Caregiver and/or child serve as trauma reminders to the other' },
    { id: 's3_ch4', text: 'Caregiver has unrealistic expectations of the child' },
    { id: 's3_ch5', text: 'Child has sensorimotor or affect regulation challenges' },
  ],
  capacityItems: [
    { id: 's3_cap1', text: 'Balance attention between caregiver and child (tracking both)' },
    { id: 's3_cap2', text: 'Hold/support child and caregiver perspectives' },
    {
      id: 's3_cap3',
      text: 'Bridge/translate between caregiver & child (help them understand each other)',
    },
    { id: 's3_cap4', text: 'Intervene in ways that strengthen the caregiver-child relationship' },
    {
      id: 's3_cap5',
      text: "Think about and support child's relationship with other important caregivers (e.g. father)",
    },
  ],
}

// ========================================
// Strand 4: Trauma Framework Fidelity
// ========================================

export const strand4: FidelityStrandConfig = {
  id: 'strand4',
  title: 'Trauma Framework Fidelity',
  challengeItems: [
    { id: 's4_ch1', text: "Child's history being unknown" },
    { id: 's4_ch2', text: "Caregiver's history being unknown" },
    {
      id: 's4_ch3',
      text: "Caregiver not fully acknowledging child's history or not agreeing to talk about it",
    },
    {
      id: 's4_ch4',
      text: 'Caregiver not having a trauma framework (does not view child behavior in light of history)',
    },
    {
      id: 's4_ch5',
      text: "Caregiver being triggered and having difficulty thinking about child's past experience",
    },
  ],
  capacityItems: [
    { id: 's4_cap1', text: "Keep child's and caregiver's trauma history in mind" },
    {
      id: 's4_cap2',
      text: "Think about how the child's and caregiver's history may be affecting interactions with each other and with the Clinician/Care Coordinator",
    },
    {
      id: 's4_cap3',
      text: "Frame interventions (e.g. affect regulation, improving relationships) within the broader context of the family's traumatic experiences (in addition to other contributing factors)",
    },
    {
      id: 's4_cap4',
      text: "Directly talk about and bring up the family's trauma history when relevant",
    },
  ],
}

// ========================================
// Strand 5: Procedural Fidelity
// ========================================

export const strand5: FidelityStrandConfig = {
  id: 'strand5',
  title: 'Procedural Fidelity',
  challengeItems: [
    {
      id: 's5_ch1',
      text: 'Scheduling challenges due to family illness, work, competing needs, or irregular visitation schedule make it difficult for family to attend weekly sessions',
    },
    {
      id: 's5_ch2',
      text: 'Scheduling challenges due to Clinician/Care Coordinator illness, work schedule or competing needs make it difficult for Clinician/Care Coordinator to hold weekly sessions',
    },
    {
      id: 's5_ch3',
      text: 'Family structure (e.g. multiple children) makes it difficult for Clinician and caregiver to hold sessions focusing on the needs of individual children when clinically indicated',
    },
    { id: 's5_ch4', text: 'Home visiting environment often chaotic' },
  ],
  capacityItems: [
    {
      id: 's5_cap1',
      text: 'Schedule sessions on a regular basis (2x per week during Foundational Phase, 1x per week after Foundational Phase, or as needed by family)',
      description: 'No / Yes But Did Not Attend Regularly / Yes Attended',
    },
    { id: 's5_cap2', text: 'Give appropriate notice for vacation' },
    {
      id: 's5_cap3',
      text: 'Propose caregiver collateral sessions when needed',
      description: 'No / Yes But Did Not Attend Regularly / Yes Attended / Not needed',
    },
    {
      id: 's5_cap4',
      text: 'Identify when visits are made individually or as a Team, based on treatment goals being addressed',
      childFirstOnly: true,
    },
  ],
}

// ========================================
// All Strands
// ========================================

export const fidelityStrands: FidelityStrandConfig[] = [
  strand1,
  strand2,
  strand3,
  strand4,
  strand5,
]

// Rating scale labels
export const CHALLENGE_RATING_LABELS = ['None', 'Low', 'Moderate', 'Significant']
export const CAPACITY_RATING_LABELS = ['Requires Development', 'Emerging', 'Acquired']
export const PROCEDURAL_RATING_LABELS = ['No', 'Yes (Not Regular)', 'Yes (Attended)']
