// CPP (Child-Parent Psychotherapy) Objectives
// Based on the Child First Foundational Phase Fidelity document

export interface CPPObjectiveDefinition {
  id: string
  number: number
  title: string
  description: string
  category: string
}

export const CPP_CATEGORIES = [
  'Safety & Stability',
  'Affect Regulation',
  'Parent-Child Relationship',
  'Trauma Processing',
  'Developmental Progress',
  'Family Functioning'
] as const

export type CPPCategory = typeof CPP_CATEGORIES[number]

export const cppObjectives: CPPObjectiveDefinition[] = [
  // Safety & Stability (1-4)
  {
    id: 'obj1',
    number: 1,
    title: 'Physical Safety',
    description: 'Child and family are physically safe and basic needs are met',
    category: 'Safety & Stability'
  },
  {
    id: 'obj2',
    number: 2,
    title: 'Environmental Stability',
    description: 'Family has stable housing, food security, and access to resources',
    category: 'Safety & Stability'
  },
  {
    id: 'obj3',
    number: 3,
    title: 'Protective Factors',
    description: 'Protective factors in the family and environment are identified and strengthened',
    category: 'Safety & Stability'
  },
  {
    id: 'obj4',
    number: 4,
    title: 'Risk Reduction',
    description: 'Risk factors are identified and addressed to prevent future harm',
    category: 'Safety & Stability'
  },

  // Affect Regulation (5-8)
  {
    id: 'obj5',
    number: 5,
    title: 'Child Affect Regulation',
    description: "Child's capacity for affect regulation is improved",
    category: 'Affect Regulation'
  },
  {
    id: 'obj6',
    number: 6,
    title: 'Caregiver Affect Regulation',
    description: "Caregiver's capacity for affect regulation is improved",
    category: 'Affect Regulation'
  },
  {
    id: 'obj7',
    number: 7,
    title: 'Co-Regulation',
    description: 'Caregiver is able to co-regulate with child during distress',
    category: 'Affect Regulation'
  },
  {
    id: 'obj8',
    number: 8,
    title: 'Stress Response',
    description: "Child's stress response system is normalized",
    category: 'Affect Regulation'
  },

  // Parent-Child Relationship (9-13)
  {
    id: 'obj9',
    number: 9,
    title: 'Attachment Security',
    description: 'Attachment security between child and caregiver is enhanced',
    category: 'Parent-Child Relationship'
  },
  {
    id: 'obj10',
    number: 10,
    title: 'Reflective Functioning',
    description: "Caregiver's reflective functioning and mentalization are improved",
    category: 'Parent-Child Relationship'
  },
  {
    id: 'obj11',
    number: 11,
    title: 'Positive Interactions',
    description: 'Positive parent-child interactions are increased',
    category: 'Parent-Child Relationship'
  },
  {
    id: 'obj12',
    number: 12,
    title: 'Attunement',
    description: 'Caregiver attunement and responsiveness to child needs is improved',
    category: 'Parent-Child Relationship'
  },
  {
    id: 'obj13',
    number: 13,
    title: 'Parenting Practices',
    description: 'Developmentally appropriate parenting practices are supported',
    category: 'Parent-Child Relationship'
  },

  // Trauma Processing (14-18)
  {
    id: 'obj14',
    number: 14,
    title: 'Trauma Narrative',
    description: 'Child and caregiver develop a coherent trauma narrative',
    category: 'Trauma Processing'
  },
  {
    id: 'obj15',
    number: 15,
    title: 'Trauma Triggers',
    description: 'Trauma triggers are identified and managed',
    category: 'Trauma Processing'
  },
  {
    id: 'obj16',
    number: 16,
    title: 'Symptom Reduction',
    description: 'Trauma symptoms are reduced',
    category: 'Trauma Processing'
  },
  {
    id: 'obj17',
    number: 17,
    title: 'Meaning Making',
    description: 'Child and family make meaning of traumatic experiences',
    category: 'Trauma Processing'
  },
  {
    id: 'obj18',
    number: 18,
    title: 'Ghosts in Nursery',
    description: "Caregiver's own trauma history (ghosts in the nursery) is addressed",
    category: 'Trauma Processing'
  },

  // Developmental Progress (19-21)
  {
    id: 'obj19',
    number: 19,
    title: 'Developmental Milestones',
    description: 'Child achieves age-appropriate developmental milestones',
    category: 'Developmental Progress'
  },
  {
    id: 'obj20',
    number: 20,
    title: 'Social-Emotional Development',
    description: "Child's social-emotional development is supported",
    category: 'Developmental Progress'
  },
  {
    id: 'obj21',
    number: 21,
    title: 'Cognitive Development',
    description: "Child's cognitive and language development is promoted",
    category: 'Developmental Progress'
  },

  // Family Functioning (22-23)
  {
    id: 'obj22',
    number: 22,
    title: 'Family Relationships',
    description: 'Positive family relationships and functioning are enhanced',
    category: 'Family Functioning'
  },
  {
    id: 'obj23',
    number: 23,
    title: 'Community Connection',
    description: 'Family is connected to community supports and resources',
    category: 'Family Functioning'
  }
]

// Rating labels
export const CLINICAL_FOCUS_LABELS: Record<number, string> = {
  0: 'Not a focus',
  1: 'Minor focus',
  2: 'Moderate focus',
  3: 'Major focus'
}

export const APPROPRIATENESS_LABELS: Record<string, string> = {
  appropriate: 'Appropriate',
  not_appropriate: 'Not Appropriate',
  na: 'N/A'
}

export const PROGRESS_LABELS: Record<string, string> = {
  significant: 'Significant',
  moderate: 'Moderate',
  minimal: 'Minimal',
  none: 'None',
  na: 'N/A'
}

// Common interventions for reference
export const COMMON_INTERVENTIONS = [
  'Psychoeducation',
  'Reflective developmental guidance',
  'Modeling',
  'Emotional support',
  'Crisis intervention',
  'Trauma narrative work',
  'Play therapy techniques',
  'Parent-child interaction guidance',
  'Safety planning',
  'Resource coordination',
  'Advocacy',
  'Concrete assistance'
]

// Helper functions
export function getObjectivesByCategory(category: CPPCategory): CPPObjectiveDefinition[] {
  return cppObjectives.filter(obj => obj.category === category)
}

export function getCategoryObjectiveCount(category: CPPCategory): number {
  return getObjectivesByCategory(category).length
}
