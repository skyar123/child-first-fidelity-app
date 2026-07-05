// III — Care Coordination Interventions (July 2018)
// Transcribed from "III Care Coordinator Interventions July 2018.docx"
// (docs/sources/). Completed by the Care Coordinator or Family Resource
// Partner individually, then reviewed in supervision — after assessment and
// prior to formulation, and every 3 months thereafter.
// Response columns on the form: "Done" and "N/A or UTD".

import type { FormTemplate, TemplateItem } from './types'

const NA_UTD = 'N/A or UTD'

const done = (id: string, label: string, extra?: Partial<TemplateItem>): TemplateItem => ({
  id,
  type: 'checkbox',
  label,
  naOption: true,
  naLabel: NA_UTD,
  ...extra,
})

const tracking = (measure: string): TemplateItem[] =>
  ['In Process', 'Completed', 'Entered'].map(stage => ({
    id: `cfa3_${measure.toLowerCase().replace(/\s/g, '')}_${stage.toLowerCase().replace(/\s/g, '_')}`,
    type: 'checkbox' as const,
    label: `${measure} — ${stage}`,
    isSubItem: true,
  }))

export const ccInterventions: FormTemplate = {
  id: 'cc_interventions',
  version: 'July 2018',
  instrument: 'III — Care Coordination Interventions',
  title: 'Care Coordination Interventions',
  shortName: 'Care Coord',
  copyright: '© Child First 2018',
  whenCompleted:
    'Completed by Care Coordinator or Family Resource Partner, then reviewed in supervision. For all Child First sites (2 Fidelity cases need to be maintained at all times): to be completed after assessment and prior to formulation to assess family service needs, and every 3 months thereafter.',
  dualMarking: false,
  color: 'cyan',
  icon: '🤝',
  headerFields: [
    { id: 'careCoordinatorName', label: 'Care Coordinator/FRP', type: 'text' },
    { id: 'clinicalDirectorName', label: 'Clinical Director/Supervisor', type: 'text' },
    { id: 'clientInitials', label: 'Client Initials', type: 'text' },
    { id: 'childFirstSite', label: 'Child First Site', type: 'text' },
    { id: 'date', label: 'Date', type: 'date' },
  ],
  sections: [
    {
      id: 'collaborative_family_assessment',
      title: 'Collaborative Family Assessment',
      items: [
        done('cfa1_sniff', 'Administered Intake Part 2: Service Needs Inventory for Families (SNIFF) and discussed results with the caregivers'),
        done('cfa2_history', 'Discussed with the caregivers about past and current service history and introduced components of Abecedarian'),
        { id: 'cfa3_tracked', type: 'note', label: 'Tracked all Assessment Measures (In Process / Completed / Entered):' },
        ...tracking('Baseline'),
        ...tracking('6 Months'),
        ...tracking('Termination'),
      ],
    },
    {
      id: 'child_family_meetings',
      title: 'Child and Family-Specific Meetings',
      items: [
        done('cfm1_meetings', 'Scheduled and planned meetings with child and family supports, if necessary, including: other important family members, school, and community providers'),
      ],
    },
    {
      id: 'update_intake_part2',
      title: 'Update Intake Part 2: Care Coordination',
      items: [
        done('uip1_tracked', 'Tracked involvement with current and potential future services'),
        done('uip2_updated', 'Integrated and updated service utilization into SNIFF on a quarterly basis (at a minimum) or more frequently when necessary. These additions have been updated in the record.'),
      ],
    },
    {
      id: 'plan_of_care',
      title: 'Development of the Child and Family Plan of Care',
      items: [
        done('dpoc1_formulation', 'Actively collaborated with the Clinician in the development of the formulation'),
        done('dpoc2_plan', 'Actively collaborated with the Clinician and family in the development of the comprehensive Child and Family Plan of Care and subsequent reviews, as needed. (This may include consultation of Learning Games and Treatment Themes document.)'),
      ],
    },
    {
      id: 'services_supports',
      title: 'Services and Supports',
      items: [
        done('sas1_stabilization', 'Assessed steps needed for family stabilization'),
        done('sas2_reflective', "Used a reflective stance to assess family's satisfaction, success, and challenges experienced with prior services, in order to gauge future barriers"),
        done('sas3_urgent', 'Identified urgent needs (e.g. food/housing/heat/clothing, risk of eviction) and problem-solving collaboratively'),
        { id: 'sas4_resources', type: 'note', label: 'Provided Resources that:' },
        done('sas4a_home', 'Improved quality of home environment for child and family, and reduced stress (e.g. furniture, heat, food, etc.)', { isSubItem: true, naLabel: 'N/A' }),
        done('sas4b_dyadic', 'Promoted quality of dyadic relationship, including playfulness and moments of shared enjoyment (e.g. toys, books, potential transitional objects, Language Priority, Conversational Reading, Learning Games, Enhanced Caregiving, etc.)', { isSubItem: true, naLabel: 'N/A' }),
        done('sas4c_unmet', 'Met unmet needs (e.g. health provider, domestic violence services, IDEA Part C early intervention, adult mental health, or substance abuse services)', { isSubItem: true, naLabel: 'N/A' }),
        done('sas4d_growth', 'Enhanced child and caregiver development and growth (e.g. early care and education, adult literacy, job training, Family Resource Center, Language Priority, Conversational Reading, Learning Games, Enhanced Caregiving, etc.)', { isSubItem: true, naLabel: 'N/A' }),
      ],
    },
    {
      id: 'executive_functioning',
      title: 'Promoted Caregiver Executive Functioning',
      items: [
        done('pcef1_stance', 'Maintained a reflective and collaborative stance when working with caregiver; supported, encouraged and coached; did not direct'),
        done('pcef2_abecedarian', 'Integrated Abecedarian techniques into treatment whenever possible, and worked to complement clinical work'),
        { id: 'pcef3_skills', type: 'note', label: 'Promoted Executive Functioning skills:' },
        done('pcef3a_perspectives', 'Helped caregiver shift perspectives and adapt to new demands', { isSubItem: true }),
        done('pcef3b_prioritize', 'Helped caregiver prioritize goals, break down task into components, and sequence steps to reach desired outcome', { isSubItem: true }),
        done('pcef3c_outcomes', 'Helped caregiver reflect on possible outcomes (what if…), what could go right or wrong? How would s/he evaluate? What could s/he do?', { isSubItem: true }),
        done('pcef3d_progress', 'Helped caregiver reflect on progress, monitor whether goal was accomplished, and develop new strategies if needed', { isSubItem: true }),
        done('pcef3e_initiative', 'Empowered caregiver to take initiative', { isSubItem: true }),
        done('pcef3f_reassured', 'Reassured caregiver and praised the steps that s/he took', { isSubItem: true }),
        done('pcef3g_memory', 'Helped caregiver develop concrete memory strategies', { isSubItem: true }),
        done('pcef3h_calm', 'Helped caregiver become calm and relaxed with body-based and/or Abecedarian play-based strategies so that s/he could focus and think', { isSubItem: true }),
        { id: 'pcef4_areas', type: 'note', label: 'Focused on specific areas:' },
        done('pcef4a_time', 'Enhanced time management skills', { isSubItem: true }),
        done('pcef4b_routines', 'Encouraged caregiver to establish family routines and rules (e.g. Learning Games may be used here)', { isSubItem: true }),
        done('pcef4c_household', 'Enhanced household organization', { isSubItem: true }),
        done('pcef4d_appointments', 'Facilitated scheduling and attendance at appointments', { isSubItem: true }),
        done('pcef4e_budgeting', 'Enhanced budgeting skills', { isSubItem: true }),
        done('pcef4f_transportation', 'Enhanced transportation skills', { isSubItem: true }),
        done('pcef4g_caregiving', 'Enhanced caregiving through predictable structure and routines infused with language (e.g. Enriched caregiving)', { isSubItem: true }),
        done('pcef4h_reading', 'Enhanced communication through reading and other language-rich activities (e.g. Conversational Reading)', { isSubItem: true }),
        done('pcef4i_play', 'Enhanced caregiving through play (e.g. Learning Games)', { isSubItem: true }),
      ],
    },
    {
      id: 'ongoing_intervention',
      title: 'Ongoing Intervention',
      items: [
        done('oi1_followed_up', 'Followed up to ensure that family has access services. Continually assessed progress, caregiver satisfaction, and sustainability of services obtained'),
        done('oi2_advocate', 'Continued to be an advocate for the child and family with current service providers'),
        done('oi3_guidance', 'Supported Clinician in provision of developmental guidance'),
        done('oi4_modeled', 'Modeled strong interpersonal relationships through excellent communication and problem-solving with Clinician teammate'),
        done('oi5_other_children', 'Worked collaboratively with Clinician to support other children in the home'),
      ],
    },
  ],
}
