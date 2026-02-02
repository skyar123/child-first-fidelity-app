// ========================================
// App-Level Types
// ========================================

export type FormType = 'foundational' | 'supervision' | 'termination' | 'care_coordinator' | 'program_fidelity'

export interface FormTypeInfo {
  id: FormType
  name: string
  shortName: string
  description: string
  color: string
  icon: string
  available: boolean
}

export const FORM_TYPES: FormTypeInfo[] = [
  {
    id: 'foundational',
    name: 'Foundational Phase Fidelity',
    shortName: 'Foundational',
    description: 'CPP Foundational Phase assessment for trauma-informed care',
    color: 'green',
    icon: '📋',
    available: true
  },
  {
    id: 'supervision',
    name: 'Supervision Fidelity',
    shortName: 'Supervision',
    description: 'Clinical Director/Supervisor evaluation and supervision tracking',
    color: 'pink',
    icon: '👥',
    available: true
  },
  {
    id: 'termination',
    name: 'Termination / CPP Closing',
    shortName: 'Termination',
    description: 'Recapitulation and Termination Phase — CPP closing form, planned/unplanned termination, contact log',
    color: 'yellow',
    icon: '✅',
    available: true
  },
  {
    id: 'care_coordinator',
    name: 'Care Coordinator Interventions',
    shortName: 'Care Coord',
    description: 'Care Coordinator specific interventions tracking',
    color: 'cyan',
    icon: '🤝',
    available: true
  },
  {
    id: 'program_fidelity',
    name: 'Program Fidelity Checklist',
    shortName: 'Program',
    description: 'Child First Program Fidelity assessment',
    color: 'purple',
    icon: '📊',
    available: true
  }
]

export function getFormTypeInfo(formType: FormType): FormTypeInfo | undefined {
  return FORM_TYPES.find(ft => ft.id === formType)
}

export function getAvailableFormTypes(): FormTypeInfo[] {
  return FORM_TYPES.filter(ft => ft.available)
}
