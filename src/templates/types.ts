// ========================================
// Versioned form-template engine
// ----------------------------------------
// Every POST ROSTERING instrument (and the July 2025 Program Checklist) is
// defined as data against this model and rendered by TemplateFormShell.
// Saved records carry templateId + templateVersion so data is always
// attributable to the exact instrument edition it was completed against.
// ========================================

export interface TemplateOption {
  value: string
  label: string
}

export type TemplateItemType =
  | 'note' // read-only guidance text
  | 'text' // single-line input
  | 'textarea' // multi-line input
  | 'date'
  | 'checkbox' // done / yes checkbox
  | 'radio' // single select, rendered as buttons
  | 'role_select' // Clinician (✓) and CC/FRP (✗) each pick one option
  | 'scored_comment' // 0-3 scale plus a comment field (program checklist)

export interface TemplateItem {
  id: string
  type: TemplateItemType
  number?: string
  label: string
  detail?: string
  bullets?: string[] // static example/instruction bullets from the form
  options?: TemplateOption[]
  naOption?: boolean // checkbox: adds an N/A toggle
  naLabel?: string // custom N/A label (e.g. "N/A or UTD")
  flagLabel?: string // checkbox: extra flag such as "< 2 months"
  role?: 'clinician' | 'ccFrp' // radio answered by one role only
  childFirstOnly?: boolean
  isSubItem?: boolean // indent under the preceding item
}

export interface TemplateSection {
  id: string
  title: string
  description?: string
  items: TemplateItem[]
}

export interface HeaderField {
  id: string
  label: string
  type: 'text' | 'date'
}

export interface FormTemplate {
  id: string
  /** Instrument edition, e.g. "POST ROSTERING July 2018" */
  version: string
  /** Framework position, e.g. "II — Core Intervention Fidelity" */
  instrument: string
  title: string
  shortName: string
  copyright: string
  whenCompleted: string
  /** true when the paper form is completed jointly (Clinician ✓ / CC-FRP ✗) */
  dualMarking: boolean
  /** color key used by the selector/shell */
  color: string
  icon: string
  headerFields: HeaderField[]
  sections: TemplateSection[]
}

// ----------------------------------------
// Stored record for a completed/in-progress template form
// ----------------------------------------

export interface ItemValue {
  value?: string // radio / text / textarea / date / scored value
  checked?: boolean
  na?: boolean
  flag?: boolean
  clinician?: string // role_select answers
  ccFrp?: string
  comment?: string // scored_comment
}

export type RecordStatus = 'in_progress' | 'ready_for_review' | 'reviewed'

export interface TemplateRecord {
  id: string
  caseId: string
  clientInitials: string
  templateId: string
  templateVersion: string
  createdAt: number
  updatedAt: number
  header: Record<string, string>
  values: Record<string, ItemValue>
  status: RecordStatus
  /** Supervisor/reviewer note captured during reflective supervision */
  reviewNote?: string
}

// ----------------------------------------
// Shared option sets (verbatim scales from the forms)
// ----------------------------------------

export const RDEA_OPTIONS: TemplateOption[] = [
  { value: 'requires_development', label: 'Requires Development' },
  { value: 'emerging', label: 'Emerging' },
  { value: 'acquired', label: 'Acquired' },
]

export const CHALLENGE_OPTIONS: TemplateOption[] = [
  { value: 'no', label: 'No' },
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'significant', label: 'Significant' },
]

// POST ROSTERING Foundational/Termination reflective-capacity columns
export const CONTEXT_OPTIONS: TemplateOption[] = [
  { value: 'in_session', label: 'In Session' },
  { value: 'outside_session', label: 'Outside Session' },
  { value: 'in_supervision', label: 'In Supervision' },
]

export const YES_NO_OPTIONS: TemplateOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

export const YES_NO_80_OPTIONS: TemplateOption[] = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes (usually, >80% of time)' },
]

export const SUPERVISOR_FOCUS_OPTIONS: TemplateOption[] = [
  { value: 'could_do_less', label: 'Could Do Less' },
  { value: 'could_do_more', label: 'Could Do More' },
  { value: 'appropriate', label: 'Appropriate' },
  { value: 'strength', label: 'Strength' },
]

export const THEME_OPTIONS: TemplateOption[] = [
  { value: 'current_focus', label: 'Currently Identified Focus of Treatment' },
  { value: 'potential_focus', label: 'Potential Focus, Not Addressed at This Time' },
  { value: 'not_focus', label: 'Not a Focus' },
]

export const NO_IN_PART_YES_OPTIONS: TemplateOption[] = [
  { value: 'no', label: 'No' },
  { value: 'in_part', label: 'In Part' },
  { value: 'yes', label: 'Yes' },
]

// Standard header fields shared by the POST ROSTERING clinical forms
export const PR_HEADER_FIELDS: HeaderField[] = [
  { id: 'clinicalTeamNames', label: 'Clinical Team Names', type: 'text' },
  { id: 'clientInitials', label: 'Client Initials', type: 'text' },
  { id: 'childFirstSite', label: 'Child First Site', type: 'text' },
  { id: 'date', label: 'Date', type: 'date' },
  { id: 'cfcrId', label: 'CFCR ID', type: 'text' },
]
