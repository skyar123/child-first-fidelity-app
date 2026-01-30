// Formulation & Treatment Planning field definitions

export interface FormulationField {
  id: string
  label: string
  placeholder: string
  rows: number
}

export const formulationFields: FormulationField[] = [
  {
    id: 'presentingProblems',
    label: 'Presenting Problems',
    placeholder: "Describe the child's and family's presenting problems and concerns...",
    rows: 4
  },
  {
    id: 'traumaHistory',
    label: 'Trauma History',
    placeholder: "Document the child's trauma history, including type, timing, and context...",
    rows: 4
  },
  {
    id: 'developmentalHistory',
    label: 'Developmental History',
    placeholder: "Include prenatal, birth, and developmental milestones...",
    rows: 4
  },
  {
    id: 'familyContext',
    label: 'Family Context & Relationships',
    placeholder: 'Describe family structure, relationships, and dynamics...',
    rows: 4
  },
  {
    id: 'strengths',
    label: 'Strengths & Protective Factors',
    placeholder: 'Identify individual, family, and community strengths...',
    rows: 3
  },
  {
    id: 'treatmentGoals',
    label: 'Treatment Goals',
    placeholder: 'List the primary treatment goals for the child and family...',
    rows: 3
  },
  {
    id: 'interventionPlan',
    label: 'Intervention Plan',
    placeholder: 'Describe the planned interventions and therapeutic approach...',
    rows: 4
  }
]
