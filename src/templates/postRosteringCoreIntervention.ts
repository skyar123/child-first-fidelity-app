// II — Core Intervention Fidelity — POST ROSTERING (© Child First 2018)
// Transcribed from "II Core Intervention Fidelity POST ROSTERING July 2018.docx"
// (see docs/sources/SOURCES.md)

import type { FormTemplate } from './types'
import {
  PR_HEADER_FIELDS,
  RDEA_OPTIONS,
  CHALLENGE_OPTIONS,
  YES_NO_OPTIONS,
} from './types'
import { TREATMENT_THEME_ITEMS } from './treatmentThemes'

export const prCoreIntervention: FormTemplate = {
  id: 'pr_core_intervention',
  version: 'POST ROSTERING July 2018',
  instrument: 'II — Core Intervention Fidelity',
  title: 'Core Intervention Phase (Post-Rostering)',
  shortName: 'Core (PR)',
  copyright: '© Child First 2018',
  whenCompleted:
    'For all Child First sites, to ensure fidelity to Child First (2 Fidelity cases need to be maintained at all times): "Procedural Fidelity: Introducing the Child to CPP" is completed immediately following the session where the child is introduced to CPP, by the Clinician, and reviewed with the Clinical Director/Supervisor during reflective supervision. The Intervention Fidelity Form is completed every 3 months by the Clinical Team and reviewed during reflective supervision. Clinician marks answers with a check (1st column); CC or FRP marks answers with an X (2nd column).',
  dualMarking: true,
  color: 'teal',
  icon: '🎯',
  headerFields: [
    ...PR_HEADER_FIELDS,
    { id: 'coreInterventionBegan', label: 'Date Core Intervention Phase Began', type: 'date' },
  ],
  sections: [
    {
      id: 'introducing_child',
      title: 'Procedural Fidelity: Introducing the Child to CPP',
      items: [
        {
          id: 'intro_date',
          type: 'date',
          label: 'Date child introduced to CPP',
        },
        {
          id: 'intro_description',
          type: 'textarea',
          label: 'Description of Introduction to CPP',
          detail:
            'Include experience, feelings/behavior, how the treatment will help, protective and growth promoting factors',
        },
        {
          id: 'intro_child_reaction',
          type: 'textarea',
          label: "Describe child's reaction to Introduction to CPP",
        },
        {
          id: 'intro_caregiver_reaction',
          type: 'textarea',
          label: "Describe caregiver's reaction to Introduction to CPP",
        },
        {
          id: 'intro_benevolent',
          type: 'textarea',
          label: "Did Therapist offer benevolent explanations for child's behavior? Describe here",
        },
      ],
    },
    {
      id: 'reflective_practice',
      title: 'Reflective Practice Capacity',
      description: 'Clinician/CC or FRP Capacity (select one)',
      items: [
        { id: 'rp_emotions', type: 'role_select', label: 'Awareness of own emotional reactions', options: RDEA_OPTIONS },
        { id: 'rp_biases', type: 'role_select', label: 'Awareness of own personal and/or cultural biases', options: RDEA_OPTIONS },
        { id: 'rp_perspectives', type: 'role_select', label: "Ability to consider multiple perspectives (caregiver's, child's, own)", options: RDEA_OPTIONS },
        { id: 'rp_regulate', type: 'role_select', label: 'Ability to recognize and regulate strong emotions prior to intervening (in the moment)', options: RDEA_OPTIONS },
        { id: 'rp_self_care', type: 'role_select', label: 'Use of self-care practices to enhance ability to regulate', options: RDEA_OPTIONS },
      ],
    },
    {
      id: 'external_supports',
      title: 'Use of External Supports',
      description: 'Appropriately uses supervision and/or consultation with colleagues to:',
      items: [
        { id: 'es_process', type: 'role_select', label: 'Process emotional reactions', options: RDEA_OPTIONS },
        { id: 'es_perspectives', type: 'role_select', label: 'Consider alternative perspectives', options: RDEA_OPTIONS },
        { id: 'es_knowledge', type: 'role_select', label: 'Seek new knowledge & new skills', options: RDEA_OPTIONS },
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
        { id: 'ep_own_history', type: 'role_select', label: "Identify when Clinician/CC or FRP's personal history, culture, or beliefs are impacting emotional process fidelity", options: RDEA_OPTIONS },
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
    {
      id: 'trauma_framework',
      title: 'Trauma Framework Fidelity',
      description: 'Capacity to intervene within a trauma framework — Clinician/CC or FRP is able to…',
      items: [
        { id: 'tf_keep_in_mind', type: 'role_select', label: "Keep child's and caregiver's trauma history in mind", options: RDEA_OPTIONS },
        { id: 'tf_interactions', type: 'role_select', label: "Think about how the child's and caregiver's history may be affecting interactions with each other and with the Clinician/CC or FRP", options: RDEA_OPTIONS },
        { id: 'tf_frame', type: 'role_select', label: "Frame interventions (e.g. affect regulation, improving relationships) within the broader context of the family's traumatic experiences (in addition to other contributing factors)", options: RDEA_OPTIONS },
        { id: 'tf_directly_talk', type: 'role_select', label: "Directly talk about and bring up the family's trauma history when relevant", options: RDEA_OPTIONS },
      ],
    },
    {
      id: 'procedural_challenges',
      title: 'Procedural Fidelity — Potential Sources of Challenge',
      description: 'Level (select one)',
      items: [
        { id: 'pc_family_scheduling', type: 'role_select', label: 'Scheduling challenges due to family illness, work, competing needs, or irregular visitation schedule make it difficult for family to attend weekly sessions', options: CHALLENGE_OPTIONS },
        { id: 'pc_team_scheduling', type: 'role_select', label: 'Scheduling challenges due to Clinician/CC or FRP illness, work schedule or competing needs make it difficult for Clinician/CC or FRP to hold weekly sessions', options: CHALLENGE_OPTIONS },
        { id: 'pc_family_structure', type: 'role_select', label: 'Family structure (e.g. living situation, multiple children) makes it difficult for Clinician/CC or FRP and caregiver to hold sessions focusing on the needs of individual children when clinically indicated', options: CHALLENGE_OPTIONS },
        { id: 'pc_chaotic', type: 'role_select', label: 'Home visiting environment often chaotic', options: CHALLENGE_OPTIONS },
      ],
    },
    {
      id: 'procedural_capacity',
      title: 'Procedural Fidelity — Capacity to Carry Out Procedures',
      description: 'Clinician/CC or FRP is able to… (select one)',
      items: [
        { id: 'pcap_schedule', type: 'role_select', label: 'Schedule sessions on a regular basis (generally 1x per week)', options: RDEA_OPTIONS },
        { id: 'pcap_vacation', type: 'role_select', label: 'Give appropriate notice for vacation', options: RDEA_OPTIONS },
        {
          id: 'pcap_collateral',
          type: 'role_select',
          label: 'Team proposed collateral sessions when…',
          bullets: [
            "Caregiver is triggered by child or child's play or in need of psychoeducation",
            "Caregiver does not understand trauma as a potential cause of child's behaviors",
            'Caregiver needs to share information with Clinician/CC or FRP (e.g. new traumatic events, new service needs)',
          ],
          options: RDEA_OPTIONS,
        },
        { id: 'pcap_visit_type', type: 'role_select', label: '*Identify when visits are made individually or as a Team, based on treatment goals being addressed (Child First item)', options: RDEA_OPTIONS, childFirstOnly: true },
      ],
    },
    {
      id: 'before_home_visit',
      title: 'Before Each Home Visit',
      items: [
        { id: 'bhv_reviewed', type: 'role_select', label: 'Clinical Team reviewed earlier sessions and planned for intervention, including whether visit will be held alone or as a Team', options: YES_NO_OPTIONS },
        { id: 'bhv_toys', type: 'role_select', label: 'Prepared for session by selecting toys/props for treatment, after discussion with Clinical Director/Supervisor if necessary', options: YES_NO_OPTIONS },
        { id: 'bhv_practiced', type: 'role_select', label: 'Clinical Team discussed and practiced any potentially challenging situations', options: YES_NO_OPTIONS },
      ],
    },
    {
      id: 'during_home_visits',
      title: 'During All Home Visits',
      items: [
        { id: 'dhv_better_parent', type: 'role_select', label: 'Clinical Team did not attempt to be a "better parent" by taking over for caregiver during sessions', options: YES_NO_OPTIONS },
        { id: 'dhv_positive', type: 'role_select', label: "Clinical Team made positive comments about child's need for and attachment to caregiver", options: YES_NO_OPTIONS },
        { id: 'dhv_culture', type: 'role_select', label: "Clinical Team selected interventions that honored family's culture and considered how they are perceived by family", options: YES_NO_OPTIONS },
        { id: 'dhv_reflected', type: 'role_select', label: 'Clinical Team reflected with caregiver on impact of cultural/family role/norms on dyadic relationships and expectations', options: YES_NO_OPTIONS },
        { id: 'dhv_perceived', type: 'role_select', label: 'Considered how Clinical Team is perceived by family and its impact on treatment', options: YES_NO_OPTIONS },
      ],
    },
    {
      id: 'after_home_visit',
      title: 'After Each Home Visit',
      items: [
        { id: 'ahv_debriefed', type: 'role_select', label: 'Clinician and CC or FRP debriefed together. Discussed what each understood about the session, including their individual observations. If Clinician and CC or FRP met with family separately, CC and Clinician debriefed and planned together for next session.', options: YES_NO_OPTIONS },
        { id: 'ahv_reassessed', type: 'role_select', label: 'Clinical Team reassessed their understanding and formulation of the case, discussed differences in perceptions or understanding of session events', options: YES_NO_OPTIONS },
        { id: 'ahv_planned', type: 'role_select', label: 'Clinical Team planned next intervention session', options: YES_NO_OPTIONS },
      ],
    },
    {
      id: 'treatment_themes',
      title: 'Treatment Themes Fidelity and Objectives',
      description:
        'Please indicate the extent to which a goal was identified as a focus during this phase.',
      items: TREATMENT_THEME_ITEMS,
    },
  ],
}
