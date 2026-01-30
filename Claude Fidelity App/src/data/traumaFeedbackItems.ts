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
    id: 'sessionPreparation',
    title: 'Session Preparation',
    items: [
      {
        id: 'prep1',
        number: '1',
        text: 'Reviewed trauma history and potential triggers before session',
      },
      {
        id: 'prep2',
        number: '2',
        text: 'Prepared developmentally appropriate materials for feedback',
      },
      {
        id: 'prep3',
        number: '3',
        text: 'Coordinated with care coordinator on session goals',
        childFirstOnly: true,
      },
      {
        id: 'prep4',
        number: '4',
        text: 'Identified potential caregiver reactions and prepared responses',
      },
    ],
  },
  {
    id: 'sessionDelivery',
    title: 'Session Delivery',
    items: [
      {
        id: 'delivery1',
        number: '5',
        text: 'Provided psychoeducation about trauma impact on child development',
      },
      {
        id: 'delivery2',
        number: '6',
        text: 'Discussed child\'s specific trauma reactions and behaviors',
      },
      {
        id: 'delivery3',
        number: '7',
        text: 'Connected trauma history to current symptoms/behaviors',
      },
      {
        id: 'delivery4',
        number: '8',
        text: 'Validated caregiver\'s experiences and emotional responses',
      },
      {
        id: 'delivery5',
        number: '9',
        text: 'Provided hope and highlighted child\'s strengths and resilience',
      },
      {
        id: 'delivery6',
        number: '10',
        text: 'Discussed treatment recommendations and next steps',
      },
    ],
  },
  {
    id: 'caregiverEngagement',
    title: 'Caregiver Engagement',
    items: [
      {
        id: 'caregiver1',
        number: '11',
        text: 'Explored caregiver\'s own trauma history when relevant',
      },
      {
        id: 'caregiver2',
        number: '12',
        text: 'Discussed how caregiver\'s history may affect parenting',
      },
      {
        id: 'caregiver3',
        number: '13',
        text: 'Provided resources for caregiver self-care and support',
      },
      {
        id: 'caregiver4',
        number: '14',
        text: 'Addressed caregiver questions and concerns',
      },
    ],
  },
  {
    id: 'documentationFollowup',
    title: 'Documentation & Follow-up',
    items: [
      {
        id: 'doc1',
        number: '15',
        text: 'Documented session content and caregiver response',
      },
      {
        id: 'doc2',
        number: '16',
        text: 'Updated treatment plan based on feedback session',
      },
      {
        id: 'doc3',
        number: '17',
        text: 'Scheduled follow-up to address ongoing questions',
      },
      {
        id: 'doc4',
        number: '18',
        text: 'Communicated relevant information to care coordinator',
        childFirstOnly: true,
      },
    ],
  },
]

// Rating scale for feedback session quality
export const FEEDBACK_QUALITY_LABELS = ['Not Done', 'Partially', 'Fully']
