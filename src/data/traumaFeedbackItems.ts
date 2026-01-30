// Trauma-Informed CPP Feedback Session items
// This section is only visible when child has known trauma history

export interface TraumaFeedbackItem {
  id: string
  text: string
  number?: string
  childFirstOnly?: boolean
}

export interface TraumaFeedbackSection {
  id: string
  title: string
  description?: string
  items: TraumaFeedbackItem[]
}

export const traumaFeedbackSections: TraumaFeedbackSection[] = [
  {
    id: 'reviewRationale',
    title: 'Review Treatment Rationale',
    items: [
      {
        id: 'tf4',
        number: '4',
        text: 'Reviewed rationale for dyadic treatment again (e.g., We work with caregivers to think about how trauma may affect the child\'s development and relationships)',
      },
      {
        id: 'tf5',
        number: '5',
        text: 'Processed cultural beliefs about talking about trauma - Discussed with caregiver how CPP\'s view of talking about and processing trauma may be different from the way they were raised or from typical cultural beliefs',
      },
      {
        id: 'tf6',
        number: '6',
        text: 'Discussed play again, specifically its role within CPP - Spoke with caregiver about how we use play in CPP (e.g. to process experience and build relationships)',
      },
    ],
  },
  {
    id: 'traumaTreatmentPrep',
    title: 'Trauma Treatment Preparation',
    items: [
      {
        id: 'tf7',
        number: '7',
        text: 'Requested permission to introduce trauma-related toys - Discussed with caregiver the toys you might bring to help the child process his/her experience',
      },
      {
        id: 'tf8',
        number: '8',
        text: 'Discussed child\'s need for emotion regulation while processing trauma - Helped caregiver understand that child may need "emotion regulation breaks"',
      },
      {
        id: 'tf9',
        number: '9',
        text: 'Reviewed with caregiver the need for regular weekly sessions again',
      },
    ],
  },
  {
    id: 'caregiverPerspective',
    title: 'Caregiver Perspective',
    items: [
      {
        id: 'tf10',
        number: '10',
        text: 'Asked about caregiver\'s perspective of trauma-informed CPP',
      },
      {
        id: 'tf10a',
        number: '10a',
        text: 'Is caregiver in agreement with addressing the child\'s trauma history?',
      },
      {
        id: 'tf10b',
        number: '10b',
        text: 'Does caregiver understand why CPP is conducted jointly with child and caregiver?',
      },
    ],
  },
  {
    id: 'appropriateness',
    title: 'Treatment Appropriateness',
    items: [
      {
        id: 'tf11',
        number: '11',
        text: 'Thought about the appropriateness of beginning trauma-informed CPP with child - Considered items assessing: Caregiver\'s Response to Child\'s Trauma History, Safety Risks, and Caregiver\'s Perspective',
      },
      {
        id: 'tf12',
        number: '12',
        text: 'Clinician developed CPP Triangle of Explanations with caregiver',
      },
      {
        id: 'cf15',
        number: 'CF15',
        text: 'Scheduled treatment planning session',
        childFirstOnly: true,
      },
    ],
  },
]

// Rating scale for feedback session quality
export const FEEDBACK_QUALITY_LABELS = ['Not Done', 'Partially', 'Fully']
