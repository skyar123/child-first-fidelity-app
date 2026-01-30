// Fidelity Strands Configuration
// Based on the Word document structure

export interface FidelityItem {
  id: string
  text: string
  childFirstOnly?: boolean
}

export interface CapacityGroup {
  title: string
  items: FidelityItem[]
}

export interface FidelityStrandConfig {
  id: string
  title: string
  challengeItems: FidelityItem[]
  capacityItems: FidelityItem[]
  capacityGroups?: CapacityGroup[]
}

export const CHALLENGE_RATING_LABELS = ['No', 'Low', 'Moderate', 'Significant']
export const CAPACITY_RATING_LABELS = ['Requires Development', 'Emerging', 'Acquired']

export const fidelityStrands: FidelityStrandConfig[] = [
  {
    id: 'strand1',
    title: 'Reflective Practice Fidelity',
    challengeItems: [
      { id: 'rp1', text: 'Family is difficult to engage or work with' },
      { id: 'rp2', text: 'Family trauma history is likely to provoke negative reactions in any Clinician/Care Coordinator' },
      { id: 'rp3', text: 'Systems are involved in complicated and/or conflictual ways with family/treatment' },
      { id: 'rp4', text: 'Clinician/Care Coordinator and caregiver have significantly different perspectives or cultural beliefs' },
      { id: 'rp5', text: 'Clinician/Care Coordinator knowledge and skill level (e.g. new Clinician/Care Coordinator, new to the model or trauma work)' },
      { id: 'rp6', text: 'Limited access to safe reflective supervision or reflective consultation' },
      { id: 'rp7', text: 'Clinician and Care Coordinator have significantly different perspectives or cultural beliefs', childFirstOnly: true },
    ],
    capacityItems: [
      { id: 'rpc1', text: 'Use of self-care practices to enhance ability to regulate' },
    ],
    capacityGroups: [
      {
        title: 'Awareness of own emotional reactions',
        items: [
          { id: 'rpc2', text: 'In the moment (in session)' },
          { id: 'rpc3', text: 'Upon self-reflection (outside session)' },
          { id: 'rpc4', text: 'In supervision/consultation' },
        ],
      },
      {
        title: 'Awareness of own personal and/or cultural biases',
        items: [
          { id: 'rpc5', text: 'In the moment (in session)' },
          { id: 'rpc6', text: 'Upon self-reflection (outside session)' },
          { id: 'rpc7', text: 'In supervision/consultation' },
        ],
      },
      {
        title: 'Ability to consider multiple perspectives (caregiver\'s, child\'s, own)',
        items: [
          { id: 'rpc8', text: 'In the moment (in session)' },
          { id: 'rpc9', text: 'Upon self-reflection (outside session)' },
          { id: 'rpc10', text: 'In supervision/consultation' },
        ],
      },
      {
        title: 'Use of External Supports - Appropriately uses supervision and/or consultation with colleagues to:',
        items: [
          { id: 'rpc11', text: 'Process emotional reactions' },
          { id: 'rpc12', text: 'Consider alternative perspectives' },
          { id: 'rpc13', text: 'Seek new knowledge & new skills' },
        ],
      },
    ],
  },
  {
    id: 'strand2',
    title: 'Emotional Process Fidelity',
    challengeItems: [
      { id: 'ep1', text: 'Caregiver is dysregulated or triggered' },
      { id: 'ep2', text: 'Caregiver is avoidant or shut down' },
      { id: 'ep3', text: 'Child is dysregulated or triggered' },
      { id: 'ep4', text: 'Child is avoidant or shut down' },
    ],
    capacityItems: [
      { id: 'epc1', text: 'Identify when caregiver is not regulated' },
      { id: 'epc2', text: 'Tolerate caregiver\'s strong emotional reactions' },
      { id: 'epc3', text: 'Intervene in ways to help caregiver become regulated' },
      { id: 'epc4', text: 'Identify when child is not regulated' },
      { id: 'epc5', text: 'Tolerate child\'s strong emotional reactions' },
      { id: 'epc6', text: 'Create a context where child\'s emotional response is understood' },
      { id: 'epc7', text: 'Create a context where child is helped to regulate' },
      { id: 'epc8', text: 'Identify when Clinician/Care Coordinator\'s personal history, culture, or beliefs are impacting emotional process fidelity', childFirstOnly: true },
    ],
  },
  {
    id: 'strand3',
    title: 'Dyadic-Relational Fidelity',
    challengeItems: [
      { id: 'dr1', text: 'Caregiver and child have conflictual, competing agendas' },
      { id: 'dr2', text: 'Caregiver has difficulty understanding or tolerating child\'s behavior or temperament' },
      { id: 'dr3', text: 'Caregiver and/or child serve as trauma reminders to the other' },
      { id: 'dr4', text: 'Caregiver has unrealistic expectations of the child' },
      { id: 'dr5', text: 'Child has sensorimotor or affect regulation challenges' },
    ],
    capacityItems: [
      { id: 'drc1', text: 'Balance attention between caregiver and child (tracking both)' },
      { id: 'drc2', text: 'Hold/support child and caregiver perspectives' },
      { id: 'drc3', text: 'Bridge/translate between caregiver & child (help them understand each other)' },
      { id: 'drc4', text: 'Intervene in ways that strengthen the caregiver-child relationship' },
      { id: 'drc5', text: 'Think about and support child\'s relationship with other important caregivers (e.g. father)' },
    ],
  },
  {
    id: 'strand4',
    title: 'Trauma Framework Fidelity',
    challengeItems: [
      { id: 'tf1', text: 'Child\'s history being unknown' },
      { id: 'tf2', text: 'Caregiver\'s history being unknown' },
      { id: 'tf3', text: 'Caregiver not fully acknowledging child\'s history or not agreeing to talk about it' },
      { id: 'tf4', text: 'Caregiver not having a trauma framework (does not view child behavior in light of history)' },
      { id: 'tf5', text: 'Caregiver being triggered and having difficulty thinking about child\'s past experience' },
    ],
    capacityItems: [
      { id: 'tfc1', text: 'Keep child\'s and caregiver\'s trauma history in mind' },
      { id: 'tfc2', text: 'Think about how the child\'s and caregiver\'s history may be affecting interactions with each other and with the Clinician/Care Coordinator' },
      { id: 'tfc3', text: 'Frame interventions (e.g. affect regulation, improving relationships) within the broader context of the family\'s traumatic experiences (in addition to other contributing factors)' },
      { id: 'tfc4', text: 'Directly talk about and bring up the family\'s trauma history when relevant' },
    ],
  },
  {
    id: 'strand5',
    title: 'Procedural Fidelity',
    challengeItems: [
      { id: 'pf1', text: 'Scheduling challenges due to family illness, work, competing needs, or irregular visitation schedule make it difficult for family to attend weekly sessions' },
      { id: 'pf2', text: 'Scheduling challenges due to Clinician/Care Coordinator illness, work schedule or competing needs make it difficult for Clinician/Care Coordinator to hold weekly sessions' },
      { id: 'pf3', text: 'Family structure (e.g. multiple children) makes it difficult for Clinician and caregiver to hold sessions focusing on the needs of individual children when clinically indicated' },
      { id: 'pf4', text: 'Home visiting environment often chaotic' },
    ],
    capacityItems: [
      { id: 'pfc1', text: 'Schedule sessions on a regular basis (2x per week during Foundational Phase, 1x per week after Foundational Phase, or as needed by family)' },
      { id: 'pfc2', text: 'Give appropriate notice for vacation' },
      { id: 'pfc3', text: 'Propose caregiver collateral sessions when caregiver is triggered by child or child\'s play or in need of psychoeducation' },
      { id: 'pfc4', text: 'Propose caregiver collateral sessions when caregiver does not understand trauma as a potential cause of child\'s behaviors' },
      { id: 'pfc5', text: 'Propose caregiver collateral sessions when caregiver needs to share information with Clinician/Care Coordinator (e.g. new traumatic events, new service needs)' },
      { id: 'pfc6', text: 'Identify when visits are made individually or as a Team, based on treatment goals being addressed', childFirstOnly: true },
    ],
  },
]
