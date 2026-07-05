// ========================================
// App-Level Types
// ========================================
// One implementation per instrument — the five forms of the Child First
// Fidelity Framework, verified against the site's own documents.

export type FormType =
  | 'foundational' // I  — green packet (2015 CF integrated)
  | 'core_intervention' // II — purple form (2015)
  | 'cc_interventions' // III — Care Coordination (July 2018)
  | 'termination' // IV — yellow packet (2015)
  | 'supervision' // V  — pink form (2015)

export interface FormTypeInfo {
  id: FormType
  name: string
  shortName: string
  description: string
  color: string
  icon: string
  /** set for template-driven forms rendered by TemplateFormShell */
  templateId?: string
}

export const FORM_TYPES: FormTypeInfo[] = [
  {
    id: 'foundational',
    name: 'Foundational packet (green form)',
    shortName: 'Foundational',
    description:
      'I — The first-60-days packet: engagement steps, trauma screening, strands, formulation, and contact log. Fill it in as you go.',
    color: 'green',
    icon: '📗',
  },
  {
    id: 'core_intervention',
    name: 'Core Intervention form (purple form)',
    shortName: 'Core',
    description:
      'II — Every 3 months once the Foundational packet is done: introducing the child to CPP, your strand capacities, and treatment objectives.',
    color: 'teal',
    icon: '📘',
  },
  {
    id: 'cc_interventions',
    name: 'Care Coordination form',
    shortName: 'Care Coord',
    description:
      "III — The CC/FRP's own checklist: SNIFF, services and supports, executive functioning. First one before the formulation, then every 3 months.",
    color: 'cyan',
    icon: '🤝',
    templateId: 'cc_interventions',
  },
  {
    id: 'termination',
    name: 'Termination packet (yellow form)',
    shortName: 'Termination',
    description:
      'IV — When the case closes: how it ended, the planned (or unplanned) termination steps, and final ratings.',
    color: 'yellow',
    icon: '📒',
  },
  {
    id: 'supervision',
    name: 'Supervision form (pink form)',
    shortName: 'Supervision',
    description:
      'V — Every 3 months, filled out on your own: rate the supervision you receive, plus your supervision log.',
    color: 'pink',
    icon: '📕',
  },
]

export function getFormTypeInfo(formType: FormType): FormTypeInfo | undefined {
  return FORM_TYPES.find(ft => ft.id === formType)
}

export function getAvailableFormTypes(): FormTypeInfo[] {
  return FORM_TYPES
}
