// I — Foundational Phase: Assessment and Engagement — POST ROSTERING
// (© Child First 2018)
// Transcribed from "I Foundational Phase Fidelity POST ROSTERING July 2018.docx"
// (see docs/sources/SOURCES.md)

import type { FormTemplate, TemplateItem } from './types'
import {
  PR_HEADER_FIELDS,
  RDEA_OPTIONS,
  CONTEXT_OPTIONS,
  YES_NO_OPTIONS,
  NO_IN_PART_YES_OPTIONS,
} from './types'
import { TREATMENT_THEME_ITEMS } from './treatmentThemes'

const check = (
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

export const prFoundational: FormTemplate = {
  id: 'pr_foundational',
  version: 'POST ROSTERING July 2018',
  instrument: 'I — Foundational Phase: Assessment and Engagement',
  title: 'Foundational Phase (Post-Rostering)',
  shortName: 'Foundational (PR)',
  copyright: '© Child First 2018',
  whenCompleted:
    'Completed by the Clinical Team and reviewed with Clinical Director/Supervisor during reflective supervision. For all Child First sites, to ensure fidelity to Child First (2 Fidelity cases need to be maintained at all times): procedures can be tracked as they are completed. For the fidelity strands, Clinician marks answers with a check (1st column) and Care Coordinator/FRP with an X (2nd column).',
  dualMarking: true,
  color: 'green',
  icon: '📋',
  headerFields: [
    ...PR_HEADER_FIELDS,
    { id: 'treatmentStarted', label: 'Date Treatment Started', type: 'date' },
    { id: 'childAgeMonths', label: 'Target Child Age (in months)', type: 'text' },
    { id: 'childGender', label: 'Target Child Gender', type: 'text' },
    { id: 'childEthnicity', label: 'Target Child Ethnicity', type: 'text' },
    { id: 'childLanguages', label: 'Language(s) Spoken', type: 'text' },
  ],
  sections: [
    {
      id: 'reflective_practice',
      title: 'Reflective Practice Fidelity — Clinician/CC or FRP Reflective Practice Capacity',
      description:
        'Clinician/CC or FRP Capacity (select one): In Session / Outside Session / In Supervision',
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
        { id: 'ep_own_history', type: 'role_select', label: "Identify when Clinician/Care Coordinator's personal history, culture, or beliefs are impacting emotional process", options: RDEA_OPTIONS },
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
        { id: 'dr_other_caregivers', type: 'role_select', label: "Think about and support child's relationship with other important caregivers (e.g. father, grandparent etc.)", options: RDEA_OPTIONS },
      ],
    },
    {
      id: 'trauma_framework',
      title: 'Trauma Framework Fidelity',
      description: 'Capacity to intervene within a trauma framework — Clinician/CC or FRP is able to…',
      items: [
        { id: 'tf_keep_in_mind', type: 'role_select', label: "Keep child's and caregiver's trauma history in mind", options: RDEA_OPTIONS },
        { id: 'tf_interactions', type: 'role_select', label: "Think about how the child's and caregiver's history may be affecting interactions with each other and with the Clinician/Care Coordinator", options: RDEA_OPTIONS },
        { id: 'tf_frame', type: 'role_select', label: "Frame interventions (e.g. affect regulation, improving relationships) within the broader context of the family's traumatic experiences (in addition to other contributing factors)", options: RDEA_OPTIONS },
        { id: 'tf_directly_talk', type: 'role_select', label: "Directly talk about and bring up the family's trauma history when relevant", options: RDEA_OPTIONS },
      ],
    },
    {
      id: 'procedural_capacity',
      title: 'Procedural Fidelity — Capacity to Carry Out Procedures',
      description: 'Clinician/CC or FRP is able to… (select one)',
      items: [
        { id: 'pcap_schedule', type: 'role_select', label: 'Schedule sessions on a regular basis (2x per week during Foundational Phase, 1x per week after Foundational Phase, or as needed by family)', options: RDEA_OPTIONS },
        { id: 'pcap_vacation', type: 'role_select', label: 'Give appropriate notice for vacation', options: RDEA_OPTIONS },
        {
          id: 'pcap_collateral',
          type: 'role_select',
          label: 'Team proposed collateral sessions when…',
          bullets: [
            "Caregiver is triggered by child or child's play or in need of psychoeducation",
            "Caregiver does not understand trauma as a potential cause of child's behaviors",
            'Caregiver needs to share information with Clinician/Care Coordinator (e.g. new traumatic events, new service needs)',
          ],
          options: RDEA_OPTIONS,
        },
        { id: 'pcap_visit_type', type: 'role_select', label: 'Identify when visits are made individually or as a Team, based on treatment goals being addressed', options: RDEA_OPTIONS },
      ],
    },
    {
      id: 'assessment_engagement',
      title: 'Procedural Fidelity: Assessment and Engagement',
      description:
        'This is a suggested order. This checklist should be completed for each caregiver involved in treatment, with attempts made to engage all primary caregivers. Trauma and symptom screening should occur without the child present (i.e. only clinician and one caregiver) unless the child is a young infant (e.g. < 6 months) and the caregiver has no source of childcare.',
      items: [
        check('ae1_engagement', '1', 'Initiated engagement process (Point of Entry Process in CFCR)', undefined, {
          bullets: [
            'Contacted family within 48 hours of case assignment and made effort to hold first visit within 2-week timeframe',
            'If initial contact was unsuccessful, Team made multiple phone calls, sent letters, contacted referrer if Release of Information was provided at time of referral, and showed ingenuity in attempting initial contact',
          ],
        }),
        check('ae2_first_visit', '2', 'Completed first visit'),
        check('ae2a_explained_model', '2a', 'Explained Child First model (frequency of visits, Team structure, independence from referral source, collaboration with agencies involved with family, and provision of services and support for all family members) and answered caregiver questions and concerns', undefined, { isSubItem: true }),
        check('ae2b_dyadic_rationale', '2b', 'Provided rationale for dyadic treatment and rationale for play as it relates to caregiver/child interaction and CF model', undefined, { isSubItem: true }),
        check('ae2c_other_caregivers', '2c', "Provided rationale for inclusion of other important caregivers in child's life", undefined, { isSubItem: true }),
        check('ae2d_assessments_rationale', '2d', 'Provided rationale for completing baseline, 6 month and termination assessments', undefined, { isSubItem: true }),
        check('ae2e_consistency', '2e', 'Reviewed need for consistency in treatment and notification of cancellations', undefined, { isSubItem: true }),
        check('ae2f_confidentiality', '2f', 'Reviewed limits to confidentiality and reporting requirements — e.g. mandated reporter', undefined, { isSubItem: true }),
        check('ae2g_consents', '2g', 'Reviewed and requested signature for the following forms: Consent for Child First Services and Authorization to Use and Disclose Health Information, Privacy Policies, Release of Information, Consent to Use Photograph and Video and any other agency-specific forms', undefined, { isSubItem: true }),
        check('ae3_perception', '3', 'Elicited caregiver perception of need for treatment', 'Discussed with caregiver the reason for referral, referral source, and how caregiver feels about treatment'),
        check('ae4_circumstances', '4', 'Elicited caregiver description of family circumstances, challenges, and strengths', "Discussed caregiver's concerns about child, self, and other family members"),
        check('ae5_intake1', '5', 'Used Intake Part 1: Guide to Child and Family Clinical History to ensure comprehensive assessment'),
        check('ae6_intake2', '6', 'Used Intake Part 2: Service Needs Inventory for Families to determine services and supports needed. Provided immediate help to family if stabilization is needed.'),
        check('ae7_hope', '7', 'Provided a sense of positive expectations about improvement', 'Noticed protective actions, conveyed realistic hope, provided emotional support, and acknowledged that coming to treatment is an important first step'),
        check('ae8_screening_rationale', '8', 'Shared with caregiver rationale for screening for child trauma (for this specific child or in general)'),
        check('ae9_trauma_screening', '9', 'Asked caregiver to jointly complete a child trauma screening instrument'),
        { id: 'ae9a_aware', type: 'radio', number: '9a', label: "Is caregiver aware of the child's history?", options: NO_IN_PART_YES_OPTIONS, isSubItem: true },
        {
          id: 'ae9b_discussed',
          type: 'radio',
          number: '9b',
          label: "Select one to describe how you and caregiver discussed child's experience of trauma",
          isSubItem: true,
          options: [
            { value: 'no_history', label: 'Child has no known history of trauma (e.g. newborn baby)' },
            { value: 'screened_tesi', label: "Clinician met alone with caregiver and screened for child's trauma history using the TESI to discuss what the caregiver knows and what is known from other sources (e.g. court reports, past therapists)" },
            { value: 'caregiver_unaware', label: "Caregiver is not aware of the child's trauma history. Clinician met alone with caregiver and used the TESI to talk to caregiver about child's history (facts and hypotheses) gathered from other sources. Note: Get appropriate releases prior to sharing information." },
            { value: 'refused_but_shared', label: "Caregiver refused to complete the TESI, but did provide details regarding child's trauma history" },
            { value: 'refused_all', label: "Caregiver refused to complete the TESI, and refused to talk about child's trauma history" },
          ],
        },
        check('ae10_response', '10', "Consider caregiver's response to child's trauma history", "Considered the quality of the way the caregiver thinks about the child's traumatic experiences (NA = child has no trauma history)", { naOption: true }),
        {
          id: 'ae10a_factual',
          type: 'radio',
          number: '10a',
          label: "Factual response: Select one to describe caregiver's factual response to child's trauma history",
          isSubItem: true,
          options: [
            { value: 'na', label: 'N/A — Child has no known history of trauma' },
            { value: 'acknowledged', label: 'Acknowledged traumatic event(s) and impact on child' },
            { value: 'unsure', label: 'Acknowledged traumatic event(s) but may be unsure of impact on child' },
            { value: 'denied_impact', label: 'Acknowledged event but denied impact' },
            { value: 'denied', label: "Denied child's experience of documented traumatic events" },
          ],
        },
        {
          id: 'ae10b_emotional',
          type: 'radio',
          number: '10b',
          label: "Emotional response: Select one to describe caregiver's emotional response to child's trauma history",
          isSubItem: true,
          detail:
            "Note: Caregivers can refuse to answer any questions that make them feel uncomfortable. However, if a caregiver completely refuses to talk about a child's potential history of trauma, or denies the child's experience of trauma, a fundamental goal of the Foundational Phase is to determine if the caregiver can talk about and acknowledge the child's history once s/he forms a relationship with you and feels safer. If not, CPP with a focus on enhancing the parent-child relationship may begin, with the goal of creating enough safety that trauma may be addressed later in treatment.",
          options: [
            { value: 'na', label: 'N/A — Child has no known history of trauma' },
            { value: 'integrated', label: 'Integrated: Emotionally integrated, able to talk about experience without being overwhelmed' },
            { value: 'triggered', label: "Triggered: Overwhelmed or flooded by thinking about child's experience" },
            { value: 'avoidant', label: "Avoidant: Avoids thinking about child's experience, blocks or pushes away experience" },
            { value: 'mixed', label: "Mixed Avoidant & Triggered: Overwhelmed by child's experience and actively avoids thinking about it" },
          ],
        },
        check('ae11_symptoms_connection', '11', "Discussed connection between child's symptoms and child's trauma history", "Talked to caregiver about how the child's symptoms or functioning may be related to the child's trauma history (including any history of separations). This may be repeated at different times in treatment, but needs to happen in the beginning as part of setting the trauma frame.", { naOption: true }),
        check('ae12_reminders', '12', 'Discussed trauma reminders', 'Helped the caregiver understand the concept of a trauma reminder and begin to identify possible trauma reminders for the child and caregiver', { naOption: true }),
        check('ae13_safety_risks', '13', 'Assessed for child safety risks to engaging in trauma-informed treatment', undefined, { naOption: true }),
        {
          id: 'ae13a_risk_code',
          type: 'radio',
          number: '13a',
          label: 'Code any safety risks (check one)',
          isSubItem: true,
          detail:
            'Note: If there are safety risks that cannot be resolved, conducting trauma-informed CPP with the child may be contraindicated. You can help the caregiver think about how to support the child and ensure safety, and/or engage in CPP to strengthen the parent-child relationship, but it would not be safe to involve the child in trauma treatment at this time.',
          options: [
            { value: 'no_risks', label: "No Risks — it seems safe to talk about the child's experience of trauma with the child" },
            { value: 'risk_unaware_caregiver', label: 'Potential risk: Child has contact with violent caregiver who is unaware that child is participating in trauma treatment' },
            { value: 'risk_denying_caregiver', label: "Potential risk: Child has contact with violent caregiver who denies the child's experience of trauma" },
            { value: 'risk_other', label: 'Other safety risk (describe in notes)' },
          ],
        },
        check('ae14_observed', '14', 'Observed child and caregiver interaction', 'Observed child and caregiver together to obtain information regarding quality of their relationship, the way child and caregiver typically play and interact'),
        check('ae15_play', '15', 'Conducted play assessment', 'Conducted play assessment with child to explore relatedness, developmental level, and presence of symbolic play'),
        check('ae16_impact', '16', 'Discussed impact of child trauma treatment on caregivers', "Clinician and caregiver met alone and discussed how talking about/processing a child's traumatic experiences can affect caregivers, highlighting both risks and benefits", { naOption: true }),
        check('ae17_caregiver_rationale', '17', 'Shared rationale for asking about caregiver trauma history', "Examples: It may be helpful to know caregiver's trauma history, so you can support him/her with any reactions that may arise as you both talk about and process child's trauma history with child. When caregivers have experienced trauma, especially as children, this can affect the way they raise their children in positive and negative ways."),
        check('ae18_caregiver_screening', '18', 'Asked caregiver to jointly complete a caregiver trauma screening instrument', 'Clinician met alone with caregiver and discussed using a trauma screening instrument to think about caregiver history'),
        check('ae19_symptoms_rationale', '19', 'Shared rationale for asking about caregiver symptoms', "Examples: Caregivers are often strongly affected when their children experience trauma, especially if they experienced the same event. Caregiver's mood and functioning can affect the child. In Child First, the Clinician supports the caregiver and family in addition to the child."),
        check('ae20_ece', '20', 'Observed child in early care and education/child care setting or classroom'),
        check('ae21_protocol', '21', 'Completed the Child First Assessment Protocol and inputted in appropriate database'),
        check('ae22_supervision', '22', 'Processed information gathered during assessment/engagement with supervisor'),
        check('ae23_formulation', '23', 'Clinical Team developed case formulation', 'Within 60 days, Clinical Team developed/updated case formulation, taking into account child social-emotional development and behavior, child developmental capacities, trauma history, important relationships, caregiver challenges, culture, and other important factors.'),
      ],
    },
    {
      id: 'feedback_sessions',
      title: 'Procedural Fidelity: Feedback Sessions',
      description:
        'After completing the assessment (but within 60 days of treatment start date), and if one or more traumatic events have been endorsed on the TESI or LSC-R, Clinician and caregiver meet alone (without children and without care coordinator) to discuss what they have learned, plan treatment, and talk about how to introduce the child to treatment, including how to bring up the child\'s trauma history. Other caregivers may be present, but the child should not be present unless the child is an infant. If no traumatic events endorsed, go directly to the second feedback session procedures.',
      items: [
        check('fs1_dyadic_rationale', '1', 'Reviewed rationale for dyadic treatment again', undefined, {
          bullets: [
            "We work with caregivers to think about how trauma may affect the child's development and relationships, and how caregivers can help them heal from this experience",
            'For older toddlers and preschoolers: We help very young children talk/play about and process experiences with their caregivers',
            "If a caregiver's trauma history is affecting perceptions of or interactions with the child, treatment can help the caregiver consciously think about how his or her history affects parenting and develop ways to change intergenerational patterns",
          ],
        }),
        check('fs2_cultural', '2', 'Processed cultural beliefs about talking about trauma', "Discussed with caregiver how CPP's view of talking and processing trauma may be different from the way they were raised, or from typical cultural beliefs. Elicited caregiver's view on this.", { naOption: true }),
        check('fs3_play', '3', 'Discussed play again, specifically its role within CPP', "Spoke with caregiver about how we use play in CPP (e.g. to process experience and build relationships) and how this may differ from how people typically interact with young children in the caregiver's family/culture or in the broader culture"),
        check('fs4_toys', '4', 'Requested permission to introduce trauma-related toys (for children old enough to use play to process experience)', 'Discussed with caregiver the toys you might bring to help the child process his/her experience. Obtained permission to introduce trauma-related toys (e.g. dolls especially for boys, police cars, knives). Highlighted that young children often benefit from having "props" to tell their "story."', { naOption: true }),
        check('fs5_regulation', '5', "Discussed child's need for emotion regulation while processing trauma (for children old enough to process experience)", 'Helped caregiver understand that child may need "emotion regulation breaks" when processing traumatic experiences. Helped caregiver think about the way this child may do this, and how the caregiver will support the child in doing this.', { naOption: true }),
        check('fs6_weekly', '6', 'Reviewed with caregiver the need for regular weekly sessions again'),
        check('fs7_perspective', '7', "Asked about caregiver's perspective of trauma-informed CPP"),
        { id: 'fs7a_agreement', type: 'radio', number: '7a', label: "Is caregiver in agreement about the need to address child's trauma history (either directly or at least if the child brings it up)?", detail: 'Code "In Part" if there are aspects of the child\'s trauma history the caregiver is willing to bring up and there are aspects that the caregiver prefers not to be discussed. Note: If the caregiver does not agree with the treatment model or has serious concerns, it will be important to explore this further. Trauma-informed CPP may be contraindicated at this time, but family can continue receiving relationship-based CPP through Child First.', options: NO_IN_PART_YES_OPTIONS, isSubItem: true },
        { id: 'fs7b_understands', type: 'radio', number: '7b', label: 'Does caregiver understand why CPP is conducted jointly with child and caregiver?', options: NO_IN_PART_YES_OPTIONS, isSubItem: true },
        check('fs8_appropriateness', '8', 'Thought about the appropriateness of beginning trauma-informed CPP with child', "Considered items assessing: Caregiver's Response to Child's Trauma History, Safety Risks to Engaging in Trauma-Informed Treatment, and Caregiver's Perspective of CPP, and decided whether to include child in CPP."),
        {
          id: 'fs8a_assessment',
          type: 'radio',
          number: '8a',
          label: 'Clinician assessment of appropriateness of CPP (select one)',
          isSubItem: true,
          options: [
            { value: 'safe', label: "It seems safe/appropriate to include child in CPP even if treatment includes a focus on child's trauma history" },
            { value: 'not_safe', label: 'It is not safe and/or appropriate to begin trauma-informed CPP with the child at this time' },
          ],
        },
        {
          id: 'fs8b_plan_focus',
          type: 'radio',
          number: '8b',
          label: 'Given concerns, the treatment plan will focus on the following',
          isSubItem: true,
          options: [
            { value: 'collateral_safety', label: 'Work with caregiver alone during collateral sessions to enhance safety and provide care coordination' },
            { value: 'collateral_acknowledge', label: "Work with caregiver alone during collateral sessions to help caregiver begin to acknowledge child's history" },
            { value: 'collateral_regulation', label: "Work with caregiver alone during collateral sessions to help enhance caregiver's emotional regulation" },
            { value: 'cpp_no_trauma', label: 'Conduct CPP with caregiver and child to strengthen the relationship and enhance caregiver/child emotional regulation, but not address the trauma' },
            { value: 'alternate', label: 'Develop alternate CPP plan (describe in notes)' },
          ],
        },
        check('fs9_triangle', '9', 'Clinician developed CPP Triangle of Explanations with caregiver'),
        { id: 'fs9_experience', type: 'textarea', label: 'Triangle — Experience', isSubItem: true },
        { id: 'fs9_feeling', type: 'textarea', label: 'Triangle — Feeling/Behavior', isSubItem: true },
        { id: 'fs9_help', type: 'textarea', label: 'Triangle — How Treatment will Help', isSubItem: true },
        { id: 'fs9_protective', type: 'textarea', label: 'Triangle — Protective and Growth Promoting Factors', isSubItem: true },
        { id: 'fs9_modality', type: 'textarea', label: 'Triangle — Modality: Way this will be shared with the child (e.g. discussion, using toys, etc.)', isSubItem: true },
        check('fs10_second_feedback', '10', "Clinician and Care Coordinator had a second feedback session and reported team's observations/assessment with caregiver which includes preliminary Plan of Care", 'Team explained how they will each support the caregiver in different ways (e.g. clinician CPP and therapeutic support of relationship, care coordinator connections to services, Abecedarian, and Executive Functioning). Elicited feedback from caregiver.'),
      ],
    },
    {
      id: 'formulation_planning',
      title: 'Procedural Fidelity: Formulation and Treatment Planning Session',
      description:
        'After completing the CPP Feedback Session, Clinical Team meets alone with the caregiver to discuss treatment planning goals. Other caregivers may be present, but the child should not be present unless the child is an infant.',
      items: [
        { id: 'ftp1_perception', type: 'radio', number: '1', label: 'Clinical Team elicited caregiver perception about assessment process and Foundational Phase', detail: 'Engaged caregiver in a conversation about what s/he learned, positive experiences, concerns, ideas for future steps', options: YES_NO_OPTIONS },
        { id: 'ftp2_formulation', type: 'radio', number: '2', label: "Described Clinical Team's current formulation to caregiver", options: YES_NO_OPTIONS },
        { id: 'ftp3_referrals', type: 'radio', number: '3', label: 'Care Coordinator provided other referrals as needed for child, caregiver, or other family members', options: YES_NO_OPTIONS },
        { id: 'ftp4_abecedarian', type: 'radio', number: '4', label: 'Clinical Team/Care Coordinator provided rationale for Abecedarian activities', options: YES_NO_OPTIONS },
      ],
    },
    {
      id: 'plan_of_care',
      title: 'Procedural Fidelity: Child and Family Plan of Care',
      items: [
        { id: 'poc1_provided', type: 'radio', number: '1', label: "Revised Child and Family Plan of Care was provided to caregiver and obtained caregiver's signature", options: YES_NO_OPTIONS },
        { id: 'poc2_completed', type: 'radio', number: '2', label: 'Child and Family Plan of Care was completed within 60 days of initial visit (sooner if state requires initial treatment plan), signatures of team members and Clinical Director were obtained', options: YES_NO_OPTIONS },
      ],
    },
    {
      id: 'before_home_visit',
      title: 'Procedural Fidelity: Before Each Home Visit',
      items: [
        { id: 'bhv1_reviewed', type: 'radio', number: '1', label: 'Clinical Team reviewed all assessments and planned for session', detail: 'Child First Team reviewed case and planned for session by discussing any potentially challenging areas', options: YES_NO_OPTIONS },
      ],
    },
    {
      id: 'during_home_visits',
      title: 'Procedural Fidelity: During All Home Visits',
      items: [
        { id: 'dhv1_better_parent', type: 'radio', number: '1', label: 'Clinical Team did not attempt to be the "better parent" by taking over for caregiver during sessions', detail: 'Clinical Team did not try to teach the caregiver by "modeling" the correct way', options: YES_NO_OPTIONS },
        { id: 'dhv2_positive', type: 'radio', number: '2', label: "Clinical Team made positive comments about child's need for and attachment to caregiver to strengthen the relationship", detail: "Clinical Team watched for positive approaches made by child to caregiver, and highlighted the child's need for positive feelings for and connection to the caregiver. Clinical Team watched for any positive approaches made by caregiver toward child, and made positive, supportive comments, especially highlighting any positive response by the child.", options: YES_NO_OPTIONS },
        { id: 'dhv3_culture', type: 'radio', number: '3', label: "Clinical Team selected interventions that honored family's culture and considered how team is perceived by family", options: YES_NO_OPTIONS },
        { id: 'dhv4_reflected', type: 'radio', number: '4', label: 'Clinical Team reflected with caregiver on impact of cultural/family roles/norms on dyadic relationships and expectations', options: YES_NO_OPTIONS },
      ],
    },
    {
      id: 'after_home_visit',
      title: 'Procedural Fidelity: After Each Home Visit',
      items: [
        { id: 'ahv1_debriefed', type: 'radio', number: '1', label: 'Clinical Team debriefed together', detail: "Child First Team debriefed on session, understanding each person's perception of what transpired", options: YES_NO_OPTIONS },
        { id: 'ahv2_adjusted', type: 'radio', number: '2', label: 'Adjusted formulation if needed and planned for next intervention session', options: YES_NO_OPTIONS },
      ],
    },
    {
      id: 'treatment_themes',
      title: 'Treatment Themes Fidelity and Objectives',
      description:
        'Please indicate the extent to which a goal was identified as a focus during the assessment and engagement phase.',
      items: TREATMENT_THEME_ITEMS,
    },
  ],
}
