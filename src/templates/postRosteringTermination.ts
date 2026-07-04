// IV — Termination Fidelity — POST ROSTERING (© Child First 2018)
// Transcribed from "IV Termination Fidelity POST ROSTERING July 2018.docx"
// (see docs/sources/SOURCES.md)

import type { FormTemplate, TemplateItem } from './types'
import { PR_HEADER_FIELDS, RDEA_OPTIONS, CONTEXT_OPTIONS } from './types'

const done = (
  id: string,
  number: string,
  label: string,
  detail?: string,
  extra?: Partial<TemplateItem>
): TemplateItem => ({
  id,
  type: 'checkbox',
  number,
  label,
  detail,
  ...extra,
})

export const prTermination: FormTemplate = {
  id: 'pr_termination',
  version: 'POST ROSTERING July 2018',
  instrument: 'IV — Termination Fidelity',
  title: 'Termination (Post-Rostering)',
  shortName: 'Termination (PR)',
  copyright: '© Child First 2018',
  whenCompleted:
    'Completed by the Clinical Team and reviewed with Clinical Director/Supervisor during reflective supervision. Clinician marks answers with a check (1st column), CC or FRP with an X (2nd column). For all Child First sites, to ensure fidelity to trauma-informed CPP and Child First (2 Fidelity cases need to be maintained at all times): completed at the time of terminating with a fidelity case.',
  dualMarking: true,
  color: 'yellow',
  icon: '✅',
  headerFields: PR_HEADER_FIELDS,
  sections: [
    {
      id: 'planned_termination',
      title: 'Procedural Fidelity: Planned Termination',
      description:
        'Families often have great difficulty saying goodbye and may drop out at any time during termination. This checklist is a guideline for termination planning when families are able to collaborate in the process. If termination was abrupt, indicate which elements you were able to do.',
      items: [
        {
          id: 'pt_not_done',
          type: 'checkbox',
          label: 'Not Done (family dropped from treatment) — complete Procedural Fidelity: Unplanned Termination below',
        },
        done('pt1_timing', '1', 'Clinical Team reflected on timing of termination', 'Clinical Team reflected on appropriateness of termination based on achievement of treatment goals; discussed differences in perception'),
        done('pt2_supervisor', '2', 'Discussed termination with Clinical Director/Supervisor'),
        done('pt3_extension', '3', 'Extension beyond 12-month treatment period was discussed with and approved by Clinical Director'),
        done('pt4_planned', '4', 'Planned termination with caregiver', 'Began termination phase by talking alone with caregiver about ending treatment approximately 2 months before end date. If the child is an infant, this may be done with the child present. Rationale for 2-month period: termination is integral to trauma treatment and a lot of "work" happens during this phase. In cases where a 2-month termination is not possible, try to incorporate the elements on the checklist and check the box for < 2 months.', { flagLabel: '< 2 months' }),
        done('pt5_reflected', '5', 'Reflected on termination', "Before you began termination, remembered that goodbyes evoke profound feelings of rejection and loss no matter how well you prepare for and conduct them. Reviewed the caregiver and child's history of separation and loss to help you hypothesize about possible reactions they may have related to saying goodbye."),
        done('pt6_planned_eval', '6', 'Planned treatment evaluation (Outcome Assessments)', 'As part of termination planning, scheduled treatment-outcome evaluation with caregiver'),
        done('pt7_completed_eval', '7', 'Completed treatment evaluation (Outcome Assessments), and completed Outcome Assessment Checklist (refer to Child First Toolkit)'),
        done('pt8_feedback', '8', 'Feedback: treatment evaluation (Outcome Assessments)', 'Team met with caregiver and provided feedback from evaluation. If appropriate, caregiver met with Clinician alone to review progress made during CPP trauma-specific work.'),
        done('pt9_told_child', '9', "Caregiver with the Team's support spoke with child about termination", 'Jointly let the child know treatment is ending at least one month before the end date. If child is an infant, had a session with the child present where you and the caregiver acknowledge that treatment will be ending.', { flagLabel: '< 1 month' }),
        done('pt10_jointly_planned', '10', 'Jointly planned termination', 'Planned with caregiver and child (or caregiver alone if child is an infant) how treatment will end, how you will say goodbye'),
        done('pt11_processed', '11', 'Processed the goodbye', undefined, {
          bullets: [
            'Talked about how goodbyes can be hard and make you sad and angry',
            'If appropriate, differentiated this goodbye from other goodbyes or separations',
            'Allowed caregiver and child to be a part of the process and experience a range of feelings',
            'Helped caregiver and child realize that they can feel connected to people even after they have said goodbye',
          ],
        }),
        done('pt12_countdown', '12', 'Counted down the sessions with caregiver and child', 'Every week reviewed how many more sessions until the end (e.g. with a calendar)'),
        done('pt13_story', '13', "Reviewed the family's story", "Discussed the course of treatment and the family's treatment narrative", {
          bullets: [
            'Where they were when they came here, whether things were hard, where things are now',
            'The themes that emerged in treatment/play',
            'If things are still not safe, how this affects them and how they can continue to talk about this and support each other',
          ],
        }),
        done('pt14_successes', '14', 'Reviewed successes, and goals not met', "Discussed child and family's successes, as well as goals that have not yet been met"),
        done('pt15_referrals', '15', 'Made final referrals for services and ensured services were accessed'),
        done('pt16_future', '16', 'Planned for the future and discussed trauma reminders with caregivers', undefined, {
          bullets: [
            'Talked with caregivers about how symptoms may return with trauma reminders or when child is under stress (metaphor: posttraumatic stress reactions are like asthma, flare up from time to time when the person is under stress)',
            'Helped caregivers reflect on how they have skills to help the child when this happens',
            "Helped caregivers to recognize if child's symptoms are significant enough to perhaps warrant a return to treatment",
          ],
        }),
        done('pt17_last_session', '17', 'Held last session'),
      ],
    },
    {
      id: 'unplanned_termination',
      title: 'Procedural Fidelity: Unplanned Termination',
      items: [
        done('ut1_reengage', '1', 'Clinical Team attempted to re-engage through calls and letters', 'If case is at risk of closing, Clinical Team made required efforts to re-engage family through 4 weeks of phone calls & letters'),
        done('ut2_referral_source', '2', 'Clinical Team contacted referral source', 'If a Release of Information was obtained and is still valid, Clinical Team contacted referral source, other family supports or service providers'),
        done('ut3_barriers', '3', 'Barrier to treatment and re-engagements were discussed with Clinical Director'),
        done('ut4_close_letter', '4', '"Close File" letter sent', 'Clinical Team sent "Close File" letter to family, indicating that family is free to return at a future date'),
      ],
    },
    {
      id: 'reflective_practice',
      title: 'Reflective Practice Fidelity — Clinician/CC or FRP Reflective Practice Capacity',
      description:
        'For the next three strands, Clinician marks answers with a check (1st column) and CC or FRP with an X (2nd column). Capacity (select one): In Session / Outside Session / In Supervision',
      items: [
        { id: 'rp_emotions', type: 'role_select', label: 'Awareness of own emotional reactions', options: CONTEXT_OPTIONS },
        { id: 'rp_biases', type: 'role_select', label: 'Awareness of own personal and/or cultural biases', options: CONTEXT_OPTIONS },
        { id: 'rp_perspectives', type: 'role_select', label: "Ability to consider multiple perspectives (caregiver's, child's, own)", options: CONTEXT_OPTIONS },
        { id: 'rp_regulate', type: 'role_select', label: 'Ability to recognize and regulate strong emotions prior to intervening (in the moment)', options: CONTEXT_OPTIONS },
        { id: 'rp_self_care', type: 'role_select', label: 'Use of self-care practices to enhance ability to regulate', options: CONTEXT_OPTIONS },
      ],
    },
    {
      id: 'external_supports',
      title: 'Use of External Supports',
      description: 'Appropriately uses supervision and/or consultation with colleagues to:',
      items: [
        { id: 'es_process', type: 'role_select', label: 'Process emotional reactions', options: CONTEXT_OPTIONS },
        { id: 'es_perspectives', type: 'role_select', label: 'Consider alternative perspectives', options: CONTEXT_OPTIONS },
        { id: 'es_knowledge', type: 'role_select', label: 'Seek new knowledge & new skills', options: CONTEXT_OPTIONS },
      ],
    },
    {
      id: 'emotional_process',
      title: 'Emotional Process Fidelity',
      description: 'Capacity to handle emotional challenges — Clinician/CC or FRP is able to…',
      items: [
        { id: 'ep_identify_caregiver', type: 'role_select', label: 'Identify when caregiver is not regulated', options: RDEA_OPTIONS },
        { id: 'ep_tolerate_caregiver', type: 'role_select', label: "Tolerate caregiver's strong emotional reactions", options: RDEA_OPTIONS },
        { id: 'ep_intervene', type: 'role_select', label: 'Intervene in ways to help caregiver become regulated', options: RDEA_OPTIONS },
        { id: 'ep_identify_child', type: 'role_select', label: 'Identify when child is not regulated', options: RDEA_OPTIONS },
        { id: 'ep_tolerate_child', type: 'role_select', label: "Tolerate child's strong emotional reactions", options: RDEA_OPTIONS },
        { id: 'ep_context_understood', type: 'role_select', label: "Create a context where child's emotional response is understood", options: RDEA_OPTIONS },
        { id: 'ep_context_regulate', type: 'role_select', label: 'Create a context where child is helped to regulate', options: RDEA_OPTIONS },
        { id: 'ep_own_history', type: 'role_select', label: "*Identify when Clinician/CC or FRP's personal history, culture, or beliefs are impacting emotional process fidelity (Child First item)", options: RDEA_OPTIONS, childFirstOnly: true },
      ],
    },
    {
      id: 'dyadic_relational',
      title: 'Dyadic-Relational Fidelity',
      description: 'Capacity to address the needs of caregiver and child — Clinician/CC or FRP is able to…',
      items: [
        { id: 'dr_balance', type: 'role_select', label: 'Balance attention between caregiver and child (tracking both)', options: RDEA_OPTIONS },
        { id: 'dr_hold', type: 'role_select', label: 'Hold/support child and caregiver perspectives', options: RDEA_OPTIONS },
        { id: 'dr_bridge', type: 'role_select', label: 'Bridge/translate between caregiver & child (help them understand each other)', options: RDEA_OPTIONS },
        { id: 'dr_strengthen', type: 'role_select', label: 'Intervene in ways that strengthen the caregiver-child relationship', options: RDEA_OPTIONS },
        { id: 'dr_other_caregivers', type: 'role_select', label: "Think about and support child's relationship with other important caregivers (e.g. father)", options: RDEA_OPTIONS },
      ],
    },
  ],
}
