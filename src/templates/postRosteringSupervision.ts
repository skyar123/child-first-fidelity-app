// V — Supervision Fidelity — POST ROSTERING (© Child First 2018)
// Transcribed from "V SUPERVISION FIDELITY POST ROSTERING July 2018.docx"
// (see docs/sources/SOURCES.md)

import type { FormTemplate, TemplateItem, TemplateOption } from './types'
import { PR_HEADER_FIELDS, YES_NO_80_OPTIONS, SUPERVISOR_FOCUS_OPTIONS } from './types'

const focus = (
  id: string,
  label: string,
  extra?: Partial<TemplateItem>
): TemplateItem => ({
  id,
  type: 'role_select',
  label,
  options: SUPERVISOR_FOCUS_OPTIONS,
  ...extra,
})

const roleOnly = (
  id: string,
  label: string,
  role: 'clinician' | 'ccFrp',
  options: TemplateOption[] = SUPERVISOR_FOCUS_OPTIONS
): TemplateItem => ({
  id,
  type: 'radio',
  label,
  role,
  options,
})

export const prSupervision: FormTemplate = {
  id: 'pr_supervision',
  version: 'POST ROSTERING July 2018',
  instrument: 'V — Supervision Fidelity',
  title: 'Supervision Fidelity (Post-Rostering)',
  shortName: 'Supervision (PR)',
  copyright: '© Child First 2018',
  whenCompleted:
    'For all Child First sites, to ensure fidelity to Child First (2 Fidelity cases need to be maintained at all times). Completed by Clinician or Care Coordinator/Family Resource Partner every 3 months. Clinician marks answers with a check (1st column), Care Coordinator/FRP with an X (2nd column).',
  dualMarking: true,
  color: 'pink',
  icon: '👥',
  headerFields: PR_HEADER_FIELDS,
  sections: [
    {
      id: 'procedural',
      title: 'Procedural Fidelity',
      description: 'Response (select one)',
      items: [
        { id: 'pf1_weekly', type: 'role_select', label: 'Clinical Director/Supervisor, as a rule, provides weekly supervision or coverage for absences', options: YES_NO_80_OPTIONS },
        { id: 'pf2_advises', type: 'role_select', label: 'Clinical Director/Supervisor advises supervisee of vacations and other absences', options: YES_NO_80_OPTIONS },
        { id: 'pf3_individual', type: 'role_select', label: 'Supervisee, as a rule, attends weekly individual supervision', options: YES_NO_80_OPTIONS },
        { id: 'pf4_team', type: 'role_select', label: 'Supervisee, as a rule, attends weekly Team supervision', options: YES_NO_80_OPTIONS },
        { id: 'pf5_group', type: 'role_select', label: 'Supervisee, as a rule, attends weekly group supervision/consultation', options: YES_NO_80_OPTIONS },
        { id: 'pf6_supervisee_advises', type: 'role_select', label: 'Supervisee advises Clinical Director/Supervisor of vacation and other absences', options: YES_NO_80_OPTIONS },
        { id: 'pf7_prepared', type: 'role_select', label: 'Supervisee comes prepared to supervision with case notes or other case material', options: YES_NO_80_OPTIONS },
      ],
    },
    {
      id: 'supervisor_capacity',
      title: 'Clinical Director/Supervisor Capacity',
      description:
        'Clinical Director/Supervisor Capacity/Focus Given Needs (select one): Could Do Less / Could Do More / Appropriate / Strength',
      items: [
        focus('sc1_safe_space', 'Create a safe space'),
        focus('sc2_feedback', 'Offer supportive feedback'),
        focus('sc3_remember', "Remember the cases and supervisee's needs"),
        focus('sc4_reflection', 'Create an atmosphere that promotes reflection'),
        focus('sc5_consider_emotions', 'Helps the therapist consider his/her emotional reactions related to the case'),
        focus('sc6_process_emotions', 'Helps the therapist process his/her own emotional reactions'),
        focus('sc7_perspectives', "Helps the therapist consider different perspectives (e.g. Clinician, CC/FRP's, caregiver's, child's, system's)"),
        focus('sc8_cultural', 'Consider possible cultural and contextual influences'),
        focus('sc9_family_emotions', "Consider family member's (e.g. child, caregiver's) emotional reactions"),
        focus('sc10_interventions', "Develop interventions to address family members' dysregulated emotions"),
        focus('sc11_held_perspectives', 'Consider the degree to which interventions held the perspective of different family members'),
        focus('sc12_relationship', 'Develop relationship enhancing interventions'),
        focus('sc13_trauma_connection', "Understand the connection between child and/or caregiver's trauma history and their behavior in session"),
      ],
    },
    {
      id: 'capacity_clinicians_only',
      title: 'Clinical Director/Supervisor Capacity — For Clinicians Only',
      items: [
        roleOnly('scc1_address_trauma', 'Consider ways to address the trauma', 'clinician'),
        roleOnly('scc2_cpp_goals', 'Recognize CPP goals addressed during the session (e.g. safety, affect regulation, put trauma in perspective)', 'clinician'),
        roleOnly('scc3_additional_goals', 'Consider ways to address additional CPP goals', 'clinician'),
      ],
    },
    {
      id: 'capacity_ccfrp_only',
      title: 'Clinical Director/Supervisor Capacity — For Care Coordinators/Family Resource Partners Only',
      items: [
        roleOnly('sccc1_interventions', "Develop care coordination interventions that enhance growth, reduce stress and enhance the family members' relationships", 'ccFrp'),
        roleOnly('sccc2_executive', "Develop intervention to enhance caregiver's executive functioning capacity (e.g. development of family routines, family rules, household organization, scheduling and going to appointments, budgeting, planning transportation, planning for the future, monitoring and reflecting on success)", 'ccFrp'),
        roleOnly('sccc3_abecedarian', 'Develop CC/FRPs use of Abecedarian techniques within home visits', 'ccFrp'),
      ],
    },
    {
      id: 'knowledge_areas',
      title: 'Knowledge Areas',
      description: 'The Clinical Director/Supervisor helped the supervisee gain knowledge in the areas of…',
      items: [
        focus('ka1_development', 'Early childhood development (social, emotional, cognitive)'),
        focus('ka2_trauma_impact', 'Understanding the impact of trauma for caregivers and children'),
        focus('ka3_play_meaning', "The potential meaning of children's play and/or behavior"),
        focus('ka4_sociocultural', 'Sociological and cultural influences on development'),
        focus('ka5_caregivers', 'Understanding and working with caregivers, understanding adult development'),
        focus('ka6_parenthood', 'Understanding parenthood as a developmental phase'),
        focus('ka7_contextual', 'Understanding contextual influences on parenting'),
      ],
    },
    {
      id: 'knowledge_ccfrp_only',
      title: 'Knowledge Areas — For Care Coordinators/Family Resource Partners Only',
      items: [
        roleOnly('kacc1_systems', 'Collaboration with systems of care', 'ccFrp'),
        roleOnly('kacc2_executive', 'Executive Functioning, Abecedarian theory, early childhood development', 'ccFrp'),
      ],
    },
    {
      id: 'skills_competencies',
      title: 'Skills & Competencies',
      description:
        'The Clinical Director/Supervisor helped the supervisee gain skills and competencies in the areas of…',
      items: [
        focus('skc1_cultural_values', "Eliciting the family's cultural values and perspectives"),
        focus('skc2_self_reflection', 'Developing self-reflection around personal cultural values and beliefs'),
        focus('skc3_personal_history', "Understanding the impact of the supervisee's personal history and its impact on intervention with the caregiver"),
        focus('skc4_collaboration', 'Collaborating with other service systems and/or engaging in case management'),
        focus('skc5_ports_of_entry', 'Working with ports of entry'),
      ],
    },
    {
      id: 'skills_clinicians_only',
      title: 'Skills & Competencies — For Clinicians Only',
      items: [
        roleOnly('skcc1_conceptualization', 'CPP case conceptualization', 'clinician'),
        roleOnly('skcc2_observing', 'Observing and understanding child and caregiver behavior', 'clinician'),
        roleOnly('skcc3_translation', 'Translation, serving as a conduit between caregiver and child', 'clinician'),
        roleOnly('skcc4_affect', 'Fostering dyadic affect regulation', 'clinician'),
        roleOnly('skcc5_narrative', 'Fostering the development of a trauma narrative', 'clinician'),
        roleOnly('skcc6_techniques', 'Learning specific CPP intervention techniques', 'clinician'),
      ],
    },
    {
      id: 'skills_ccfrp_only',
      title: 'Skills & Competencies — For Care Coordinators/Family Resource Partners Only',
      items: [
        roleOnly('skccc1_follow_through', 'Reflecting on the meaning behind parental lack of follow-through in accessing requested services', 'ccFrp'),
        roleOnly('skccc2_partnering', 'Partnering with (not directing) family in accessing services and supports', 'ccFrp'),
        roleOnly('skccc3_play', 'Playing interactively with child and siblings', 'ccFrp'),
        roleOnly('skccc4_abecedarian', 'Utilizing Abecedarian techniques to encourage play, language-rich activities, and enhanced caregiving routines', 'ccFrp'),
        roleOnly('skccc5_executive', 'Working to improve executive functioning skills to enhance caregiver functioning', 'ccFrp'),
      ],
    },
  ],
}
