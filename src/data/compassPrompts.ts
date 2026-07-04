// CPP Fidelity Compass — reflective prompts per fidelity strand.
// From "CPP FIDELITY COMPASS: OVERVIEW" (childparentpsychotherapy.com);
// see docs/sources/SOURCES.md. These are conversation starters for
// reflective supervision, not scored items.

export interface CompassStrand {
  id: string
  title: string
  prompts: string[]
}

export const COMPASS_STRANDS: CompassStrand[] = [
  {
    id: 'reflective_practice',
    title: 'Reflective Practice',
    prompts: [
      'How do you understand your emotional states and how they affect how present you are?',
      'How do your emotional states affect your perceptions & perspective?',
      'How do they affect your interventions, and other aspects of fidelity?',
      'What do you need to feel integrated?',
    ],
  },
  {
    id: 'emotional_process',
    title: 'Emotional Process',
    prompts: [
      'What are the emotional states of each family member?',
      'How are your interventions responsive to these emotional states?',
      'Do they help you identify ports of entry and shape your interventions?',
    ],
  },
  {
    id: 'dyadic_relational',
    title: 'Dyadic Relational',
    prompts: [
      "Are you able to track both the caregiver's & child's emotional states & behaviors, or are you pulled towards one?",
      "Are you able to hold each family member's needs and history?",
      'Do your interventions build understanding and connection among family members?',
    ],
  },
  {
    id: 'trauma_framework',
    title: 'Trauma Framework',
    prompts: [
      "How do you integrate each family member's trauma history into your case conceptualization and interventions?",
      'How does their history affect their response to you and to treatment?',
      'How does it affect their relationship, and their emotions & behaviors (e.g. play)?',
    ],
  },
  {
    id: 'procedural',
    title: 'Procedural',
    prompts: [
      'Did you follow the procedures for each phase? If not, what were the obstacles?',
      'How do procedural gaps affect your relationship with the family, case conceptualization and interventions?',
      'How might you address any procedural gaps?',
    ],
  },
  {
    id: 'content',
    title: 'Content',
    prompts: [
      'Do you have a clear case formulation (triangles)?',
      'What are your primary treatment goals?',
      'How do these goals shape your interventions?',
    ],
  },
]

// Maps template section ids to Compass strands
const SECTION_TO_STRAND: Record<string, string> = {
  reflective_practice: 'reflective_practice',
  external_supports: 'reflective_practice',
  emotional_process: 'emotional_process',
  dyadic_relational: 'dyadic_relational',
  trauma_framework: 'trauma_framework',
  procedural_challenges: 'procedural',
  procedural_capacity: 'procedural',
  assessment_engagement: 'procedural',
  feedback_sessions: 'procedural',
  planned_termination: 'procedural',
  unplanned_termination: 'procedural',
  treatment_themes: 'content',
}

export function getCompassStrandForSection(sectionId: string): CompassStrand | undefined {
  const strandId = SECTION_TO_STRAND[sectionId]
  return strandId ? COMPASS_STRANDS.find(s => s.id === strandId) : undefined
}
