// ========================================
// App-Level Types
// ========================================

export type FormType =
  // POST ROSTERING instruments (current, © Child First 2018/2025) — template-driven
  | 'pr_foundational'
  | 'pr_core_intervention'
  | 'cc_interventions'
  | 'pr_termination'
  | 'pr_supervision'
  | 'program_fidelity_2025'
  // 2015 "CPP integrated" instruments (legacy / CPP training credit)
  | 'foundational'
  | 'supervision'
  | 'termination'
  | 'care_coordinator'
  | 'program_fidelity'
  | 'core_intervention'

export type FormGroup = 'site' | 'other'

export interface FormTypeInfo {
  id: FormType
  name: string
  shortName: string
  description: string
  color: string
  icon: string
  available: boolean
  group: FormGroup
  /** set for template-driven forms rendered by TemplateFormShell */
  templateId?: string
}

export const FORM_GROUP_LABELS: Record<FormGroup, { title: string; description: string }> = {
  site: {
    title: 'Your five fidelity forms',
    description:
      'The forms used at your site, verified against your own copies: Foundational (green) → Core Intervention (purple) + Care Coordination + Supervision (pink) every 3 months → Termination (yellow) at closing.',
  },
  other: {
    title: 'Other versions',
    description:
      'Post-Rostering (2018) editions and the site-level Program Fidelity Checklists. Only needed if your supervisor asks for these versions.',
  },
}

export const FORM_TYPES: FormTypeInfo[] = [
  // ---- POST ROSTERING (current) ----
  {
    id: 'pr_foundational',
    name: 'Foundational Phase (Post-Rostering)',
    shortName: 'Foundational PR',
    description:
      'I — Assessment & Engagement, completed throughout the first 60 days. Includes strands, procedures 1-23, feedback sessions, and Treatment Themes.',
    color: 'green',
    icon: '📋',
    available: true,
    group: 'other',
    templateId: 'pr_foundational',
  },
  {
    id: 'pr_core_intervention',
    name: 'Core Intervention (Post-Rostering)',
    shortName: 'Core PR',
    description:
      'II — Completed every 90 days after the Foundational form. Introducing the Child to CPP, strand capacities, home-visit procedures, Treatment Themes.',
    color: 'teal',
    icon: '🎯',
    available: true,
    group: 'other',
    templateId: 'pr_core_intervention',
  },
  {
    id: 'pr_termination',
    name: 'Termination (Post-Rostering)',
    shortName: 'Termination PR',
    description:
      'IV — Completed when a fidelity case is discharged. Planned/unplanned termination procedures and three strand capacities.',
    color: 'yellow',
    icon: '✅',
    available: true,
    group: 'other',
    templateId: 'pr_termination',
  },
  {
    id: 'pr_supervision',
    name: 'Supervision Fidelity (Post-Rostering)',
    shortName: 'Supervision PR',
    description:
      'V — Completed individually every 90 days per fidelity case. Procedural fidelity, supervisor capacity, knowledge, and skills (incl. Abecedarian items for CC/FRP).',
    color: 'pink',
    icon: '👥',
    available: true,
    group: 'other',
    templateId: 'pr_supervision',
  },
  {
    id: 'program_fidelity_2025',
    name: 'Program Fidelity Checklist (July 2025)',
    shortName: 'Program 2025',
    description:
      'Site self-assessment completed by the Clinical Supervisor with Clinical Teams; reviewed by the Senior Leader. 17 sections, 0-3 scale.',
    color: 'purple',
    icon: '📊',
    available: true,
    group: 'other',
    templateId: 'program_fidelity_2025',
  },
  // ---- 2015 CPP-integrated (legacy) ----
  {
    id: 'foundational',
    name: 'Foundational packet (green form)',
    shortName: 'Foundational',
    description: 'I — The first-60-days packet: engagement steps, trauma screening, strands, formulation, and contact log. Fill it in as you go.',
    color: 'green',
    icon: '📗',
    available: true,
    group: 'site',
  },
  {
    id: 'core_intervention',
    name: 'Core Intervention form (purple form)',
    shortName: 'Core',
    description: 'II — Every 3 months once the Foundational packet is done: introducing the child to CPP, your strand capacities, and treatment objectives.',
    color: 'teal',
    icon: '📘',
    available: true,
    group: 'site',
  },
  {
    id: 'cc_interventions',
    name: 'Care Coordination form',
    shortName: 'Care Coord',
    description:
      'III — The CC/FRP\'s own checklist: SNIFF, services and supports, executive functioning. First one before the formulation, then every 3 months.',
    color: 'cyan',
    icon: '🤝',
    available: true,
    group: 'site',
    templateId: 'cc_interventions',
  },
  {
    id: 'care_coordinator',
    name: 'Care Coordinator Interventions (July 2018)',
    shortName: 'Care Coord',
    description: 'III — Completed by the CC/FRP with the Assessment & Engagement form, then every 90 days with SNIFF updates.',
    color: 'cyan',
    icon: '🤝',
    available: true,
    group: 'other',
  },
  {
    id: 'termination',
    name: 'Termination packet (yellow form)',
    shortName: 'Termination',
    description: 'IV — When the case closes: how it ended, the planned (or unplanned) termination steps, and final ratings.',
    color: 'yellow',
    icon: '📒',
    available: true,
    group: 'site',
  },
  {
    id: 'supervision',
    name: 'Supervision form (pink form)',
    shortName: 'Supervision',
    description: 'V — Every 3 months, filled out on your own: rate the supervision you receive, plus your supervision log.',
    color: 'pink',
    icon: '📕',
    available: true,
    group: 'site',
  },
  {
    id: 'program_fidelity',
    name: 'Program Fidelity Checklist (Oct 2019)',
    shortName: 'Program',
    description: 'Child First Program Fidelity assessment, REVISED Oct 2019 edition.',
    color: 'purple',
    icon: '📓',
    available: true,
    group: 'other',
  },
]

export function getFormTypeInfo(formType: FormType): FormTypeInfo | undefined {
  return FORM_TYPES.find(ft => ft.id === formType)
}

export function getAvailableFormTypes(): FormTypeInfo[] {
  return FORM_TYPES.filter(ft => ft.available)
}
