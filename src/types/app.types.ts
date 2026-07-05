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

export type FormGroup = 'post_rostering' | 'cpp_2015'

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
  post_rostering: {
    title: 'Current Instruments (Post-Rostering)',
    description:
      'The instrument set in current use per the Fidelity Forms Cheat Sheet (v. 11/7/25). Roles: Clinician and Care Coordinator/Family Resource Partner (CC/FRP).',
  },
  cpp_2015: {
    title: '2015 CPP-Integrated Instruments',
    description:
      'The fully CPP-integrated fillable forms (pre-rostering). These can be used to fulfill trauma-informed CPP training requirements.',
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
    group: 'post_rostering',
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
    group: 'post_rostering',
    templateId: 'pr_core_intervention',
  },
  {
    id: 'cc_interventions',
    name: 'Care Coordination Interventions (July 2018)',
    shortName: 'Care Coord',
    description:
      'III — Completed individually by the CC/FRP after assessment and prior to formulation, then every 90 days. SNIFF, services & supports, executive functioning.',
    color: 'cyan',
    icon: '🤝',
    available: true,
    group: 'post_rostering',
    templateId: 'cc_interventions',
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
    group: 'post_rostering',
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
    group: 'post_rostering',
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
    group: 'post_rostering',
    templateId: 'program_fidelity_2025',
  },
  // ---- 2015 CPP-integrated (legacy) ----
  {
    id: 'foundational',
    name: 'Foundational Phase Fidelity (2015)',
    shortName: 'Foundational',
    description: 'I — Green fillable, CPP integrated. Full assessment & engagement packet with strands, contact log, objectives.',
    color: 'green',
    icon: '📗',
    available: true,
    group: 'cpp_2015',
  },
  {
    id: 'core_intervention',
    name: 'Core Intervention Phase (2015)',
    shortName: 'Core',
    description: 'II — Purple fillable. Registration, Introducing the Child to CPP, strands, and the full CPP objectives grid.',
    color: 'teal',
    icon: '📘',
    available: true,
    group: 'cpp_2015',
  },
  {
    id: 'care_coordinator',
    name: 'Care Coordinator Interventions (July 2018)',
    shortName: 'Care Coord',
    description: 'III — Completed by the CC/FRP with the Assessment & Engagement form, then every 90 days with SNIFF updates.',
    color: 'cyan',
    icon: '🤝',
    available: true,
    group: 'cpp_2015',
  },
  {
    id: 'termination',
    name: 'Termination / CPP Closing (2015)',
    shortName: 'Termination',
    description: 'IV — Yellow fillable. Recapitulation and Termination Phase: closing form, planned/unplanned termination, contact log.',
    color: 'yellow',
    icon: '📒',
    available: true,
    group: 'cpp_2015',
  },
  {
    id: 'supervision',
    name: 'Supervision Fidelity (2015)',
    shortName: 'Supervision',
    description: 'V — Pink fillable. Clinical Director/Supervisor evaluation with global ratings.',
    color: 'pink',
    icon: '📕',
    available: true,
    group: 'cpp_2015',
  },
  {
    id: 'program_fidelity',
    name: 'Program Fidelity Checklist (Oct 2019)',
    shortName: 'Program',
    description: 'Child First Program Fidelity assessment, REVISED Oct 2019 edition.',
    color: 'purple',
    icon: '📓',
    available: true,
    group: 'cpp_2015',
  },
]

export function getFormTypeInfo(formType: FormType): FormTypeInfo | undefined {
  return FORM_TYPES.find(ft => ft.id === formType)
}

export function getAvailableFormTypes(): FormTypeInfo[] {
  return FORM_TYPES.filter(ft => ft.available)
}
