// ========================================
// Program Fidelity Checklist Data
// Based on "Child First Program Fidelity Checklist - REVISED Oct 2019"
// ========================================

export type FidelityRating = 0 | 1 | 2 | 3 | null
// 0 = Not present
// 1 = Early development or a little progress
// 2 = In place or good progress
// 3 = Excellent progress or accomplished

export interface ProgramFidelityItem {
  id: string
  text: string
  isSubItem?: boolean
  parentId?: string
}

export interface ProgramFidelitySection {
  id: string
  number: number
  title: string
  items: ProgramFidelityItem[]
}

// ========================================
// Program Fidelity Sections Data
// ========================================

export const programFidelitySections: ProgramFidelitySection[] = [
  {
    id: 'targetPopulation',
    number: 1,
    title: 'Target Population',
    items: [
      {
        id: 'tp_age',
        text: 'Age: Target population at entry into Child First services is:',
      },
      {
        id: 'tp_age_pregnant',
        text: 'Pregnant women - optional, based on site',
        isSubItem: true,
        parentId: 'tp_age',
      },
      {
        id: 'tp_age_children',
        text: 'Children birth through 5 years (up to 6th birthday)',
        isSubItem: true,
        parentId: 'tp_age',
      },
      {
        id: 'tp_symptoms',
        text: 'Symptoms & concerns: Children and their families are eligible for Child First when there are:',
      },
      {
        id: 'tp_symptoms_child',
        text: "Concerns about the child's behavior, emotions, development, or learning and/or",
        isSubItem: true,
        parentId: 'tp_symptoms',
      },
      {
        id: 'tp_symptoms_family',
        text: "Family challenges or events that place the child's development at risk, especially trauma",
        isSubItem: true,
        parentId: 'tp_symptoms',
      },
      {
        id: 'tp_financial',
        text: 'Financial need and legal status: Families are enrolled without regard for ability to pay, Medicaid eligibility, commercial insurance, or legal status.',
      },
      {
        id: 'tp_voluntary',
        text: 'Voluntary service: All services need written consent from the legal guardian and are voluntary.',
      },
    ],
  },
  {
    id: 'contextOfIntervention',
    number: 2,
    title: 'Context of Intervention',
    items: [
      {
        id: 'coi_location',
        text: 'Location of visits: Each family is visited by the Child First Clinical Team, comprised of the Mental Health and Developmental Clinician and Care Coordinator (CC)/Family Resource Partner (FRP) together or individually, with approximately 90% of visits provided in the home. Families may be seen in another community site if there are safety or other pressing issues, with discussion with the Clinical Director/Supervisor. Unless there are extenuating circumstances, services are not provided in office-based settings.',
      },
      {
        id: 'coi_frequency',
        text: 'Visit frequency:',
      },
      {
        id: 'coi_frequency_assessment',
        text: 'Assessment phase (first month): Visits are scheduled twice per week, and both Clinicians and Care Coordinators/FRPs visit families together.',
        isSubItem: true,
        parentId: 'coi_frequency',
      },
      {
        id: 'coi_frequency_intervention',
        text: 'Intervention phase: Each family is visited on at least a weekly basis with a designated time for appointments. Visits may increase in frequency per week if there is high family need.',
        isSubItem: true,
        parentId: 'coi_frequency',
      },
      {
        id: 'coi_staff',
        text: 'Staff participation: The specific needs of the family dictate the pattern of Team visitation and/or independent work for or with the family by either Clinician or CC/FRP. The presence of a staff member at a visit is a clinical decision, which includes issues of safety.',
      },
      {
        id: 'coi_caseload',
        text: 'Caseload: Each Child First Team typically carries between 10 and 16 families, such that they are able to complete a minimum of 10-12 home visits per 40-hour work week, based on state-specific agreements. Caseload varies based on frequency/intensity of service, success of planned visits, and need for increased travel time for very rural areas.',
      },
      {
        id: 'coi_caseload_new',
        text: 'New staff build their caseload overtime, with a full case load within 4 months at the latest.',
        isSubItem: true,
        parentId: 'coi_caseload',
      },
      {
        id: 'coi_length',
        text: 'Length of visit: Visits last an average duration of 60-90 minutes, but may be longer.',
      },
      {
        id: 'coi_duration',
        text: 'Duration of service: Families are served for an average of 6 to 12 months (based on the state). Services may continue if there are significant challenges that cannot be met by another community agency, with approval of the program Clinical Director/Supervisor at the Child First affiliate site. Services must begin before the child is 6 years of age, but may be continued after the 6th birthday, based on the needs of the child and family.',
      },
    ],
  },
  {
    id: 'staffing',
    number: 3,
    title: 'Staffing',
    items: [
      {
        id: 'st_composition',
        text: 'Composition of Child First Team: The Child First Clinical Team includes a Mental Health/Developmental Clinician (referred to as a "Child Development Clinician or Specialist" when working with families) and a Family Resource Partner (FRP)/Care Coordinator (CC). Ratio of Clinician to FRP/CC must be 1:1 (unless an exception is made).',
      },
      {
        id: 'st_expertise',
        text: 'Expertise of staff: (See complete job descriptions.)',
      },
      {
        id: 'st_expertise_essential',
        text: 'Essential capacity of all staff is the ability to take a reflective stance with regard to self, child, and caregivers; flexibility; empathy; and humility.',
        isSubItem: true,
        parentId: 'st_expertise',
      },
      {
        id: 'st_expertise_senior',
        text: 'Senior Leader: Representative from Child First affiliate (Executive Director, Agency Clinical Director, Program Manager, etc.), responsible for overseeing model fidelity, hiring, and implementation of the Child First model. The Senior Leader is 10-15% FTE.',
        isSubItem: true,
        parentId: 'st_expertise',
      },
      {
        id: 'st_expertise_clinical',
        text: "Clinical Director/Supervisor: Master's level or Doctoral level, licensed mental health clinician, with extensive child development background, five years' therapeutic experience with children 0-5 years, knowledge of adult mental health disorders, and three years' experience providing reflective, clinical supervision. The Clinical Supervisor is 50-100% FTE.",
        isSubItem: true,
        parentId: 'st_expertise',
      },
      {
        id: 'st_expertise_clinician',
        text: "Mental Health/Developmental Clinician: Master's level or higher, licensed, with at least three years' experience in early childhood mental health and development. A license-eligible clinician with explicit permission of the Child First NPO.",
        isSubItem: true,
        parentId: 'st_expertise',
      },
      {
        id: 'st_expertise_cc',
        text: "Care Coordinator/Family Resource Partner: Bachelor's level or higher, who has at least three years' experience with young children and multi-challenged families and expertise in community-based services and supports.",
        isSubItem: true,
        parentId: 'st_expertise',
      },
      {
        id: 'st_expertise_hiring',
        text: 'Hiring of staff: If potential staff do not meet requirements, consultation with Child First NPO is required.',
        isSubItem: true,
        parentId: 'st_expertise',
      },
      {
        id: 'st_teams',
        text: 'Child First Clinical Teams:',
      },
      {
        id: 'st_teams_partners',
        text: 'All Clinicians and CCs/FRPs should have "regular partners" that consistently visit families with them. Clinicians and CC/FRPs should not have multiple partners, (unless there are extenuating circumstances).',
        isSubItem: true,
        parentId: 'st_teams',
      },
      {
        id: 'st_teams_minimum',
        text: 'Every Child First affiliate site must have a minimum of two Clinical Teams (four preferred).',
        isSubItem: true,
        parentId: 'st_teams',
      },
      {
        id: 'st_multilingual',
        text: 'Multilingual/multicultural staff: Each Child First affiliate site must have a minimum of one Team with linguistic competence appropriate for the non-English speaking community that is served. All staff must display cultural humility and be culturally competent.',
      },
    ],
  },
  {
    id: 'referralPrioritization',
    number: 4,
    title: 'Referral and Prioritization',
    items: [
      {
        id: 'rp_source',
        text: 'Source of referrals:',
      },
      {
        id: 'rp_source_broad',
        text: 'Referrals should come from a broad range of community providers. All referring community providers should fully explain Child First services to parents/caregivers.',
        isSubItem: true,
        parentId: 'rp_source',
      },
      {
        id: 'rp_source_outside',
        text: 'Referrals may be accepted from outside the designated geographic area when there is urgent need, with permission from the NPO.',
        isSubItem: true,
        parentId: 'rp_source',
      },
      {
        id: 'rp_source_consent',
        text: 'At least verbal consent (written preferred) from the legal guardian is required for a provider to make a referral to Child First. Child First staff will then call the family. No family is required to call or come to the provider agency as part of the referral process.',
        isSubItem: true,
        parentId: 'rp_source',
      },
      {
        id: 'rp_source_direct',
        text: 'Parents/legal guardians can contact a Child First provider directly if they have concerns about their child.',
        isSubItem: true,
        parentId: 'rp_source',
      },
      {
        id: 'rp_priority',
        text: 'Priority: The Child First Priority Checklist must be used. Children and families with urgent issues, e.g., change in primary caregiver (removal to foster placement or reunification), imminent school expulsion, eviction from housing receive priority.',
      },
      {
        id: 'rp_priority_states',
        text: 'States may have other specific priority criteria, with NPO approval.',
        isSubItem: true,
        parentId: 'rp_priority',
      },
      {
        id: 'rp_processing',
        text: 'Processing: A call and letter to the referring agency and family should be completed within 48 hours.',
      },
      {
        id: 'rp_emergencies',
        text: 'Emergencies: Child First is not an emergency service. Emergencies should be referred to local emergency services based on state protocols. Child First must collaborate with this provider to obtain services for the family.',
      },
      {
        id: 'rp_waitlist',
        text: 'Waitlist:',
      },
      {
        id: 'rp_waitlist_minimum',
        text: 'A waitlist should be kept with a minimum of 2 (4 preferred) families per Team, so that if an existing family closes, a new family can be rapidly engaged to fill the available time.',
        isSubItem: true,
        parentId: 'rp_waitlist',
      },
      {
        id: 'rp_waitlist_triage',
        text: 'If a child can be well served by another program, then he/she should be triaged to that service. Families may continue on the Child First waitlist if this is the optimal service for the child and family. Families should be periodically contacted to update their status.',
        isSubItem: true,
        parentId: 'rp_waitlist',
      },
    ],
  },
  {
    id: 'engagement',
    number: 5,
    title: 'Engagement',
    items: [
      {
        id: 'en_efforts',
        text: 'Efforts to engage families in home-based intervention:',
      },
      {
        id: 'en_efforts_4week',
        text: 'Efforts to engage hard-to-reach families should continue over a 4 week period.',
        isSubItem: true,
        parentId: 'en_efforts',
      },
      {
        id: 'en_efforts_strategies',
        text: 'Strategies include multiple phone calls, letters, contact with referrer, notes left at the door, meeting at a community site, e.g., early care and education, pediatric primary care, family center, park, restaurant, etc.',
        isSubItem: true,
        parentId: 'en_efforts',
      },
      {
        id: 'en_efforts_extended',
        text: 'If there has been parent contact and clear interest, the engagement period (prior to first visit) may be extended beyond 4 weeks.',
        isSubItem: true,
        parentId: 'en_efforts',
      },
      {
        id: 'en_cancelled',
        text: 'Cancelled appointments or "no shows:" During intervention, persistent efforts should be continued until there has been no parent contact for 4 weeks or parent verbally indicates that s/he does not want services from Child First. Then, the file may be closed.',
      },
    ],
  },
  {
    id: 'firstVisit',
    number: 6,
    title: 'First Visit',
    items: [
      {
        id: 'fv_consents',
        text: "Consents: Consent for Child First services must be signed by legal guardian/parent prior to beginning services. Consent must be maintained in the child's file.",
      },
      {
        id: 'fv_hipaa',
        text: "HIPAA and Releases of Information: Forms must be signed by legal guardian/parent and maintained in the child's file.",
      },
      {
        id: 'fv_insurance',
        text: 'Insurance: Permission to bill must be signed as per agency protocol.',
      },
    ],
  },
  {
    id: 'comprehensiveAssessment',
    number: 7,
    title: 'Comprehensive Assessment',
    items: [
      {
        id: 'ca_comprehensive',
        text: 'Comprehensive, child and family assessment:',
      },
      {
        id: 'ca_comprehensive_begins',
        text: 'Assessments begin on the first visit, as per Child First Assessment Protocol, unless there are extenuating circumstances.',
        isSubItem: true,
        parentId: 'ca_comprehensive',
      },
      {
        id: 'ca_comprehensive_domains',
        text: 'A comprehensive assessment includes the strengths, needs, priorities, and culture of the child and all members of the family. Domains include: Child: Development, education, social-emotional development and behavior, cognition, motor skills, important relationships, trauma, and health. Parents or caregivers: Early history, relationships, trauma, mental health, health, and concrete needs.',
        isSubItem: true,
        parentId: 'ca_comprehensive',
      },
      {
        id: 'ca_required',
        text: 'Required assessment measures:',
      },
      {
        id: 'ca_required_baseline',
        text: 'Baseline Assessments: Core baseline assessments should be completed by 30 days, and all other baseline assessments by 60 days, prior to completion of the formulation.',
        isSubItem: true,
        parentId: 'ca_required',
      },
      {
        id: 'ca_required_6month',
        text: '6 Month Assessments: These assessments serve as a guide to the progress of the work with the family and inform the goals of the treatment plan.',
        isSubItem: true,
        parentId: 'ca_required',
      },
      {
        id: 'ca_required_discharge',
        text: 'Discharge Assessments: These assessments should be conducted prior to and inform the discussion with the family about termination.',
        isSubItem: true,
        parentId: 'ca_required',
      },
      {
        id: 'ca_required_database',
        text: 'All assessment measures need to be entered into the Assessment Scoring Database or Child First Comprehensive Clinical Record (CFCR) within one week of completion of assessment.',
        isSubItem: true,
        parentId: 'ca_required',
      },
      {
        id: 'ca_essential',
        text: 'Essential assessment information: Additional assessment information needs to be collected from parent discussion, parent-child interaction and play observations, the health provider, early care and education report and observations, prior service providers, etc.',
      },
    ],
  },
  {
    id: 'planOfCare',
    number: 8,
    title: 'Child & Family Plan of Care (Treatment Plan)',
    items: [
      {
        id: 'poc_timeframe',
        text: 'Timeframe: The initial formulation, diagnosis, and treatment plan must be written per Medicaid requirements in each state. A Child First formulation and treatment plan must be completed by 60 days. (See individual state contractual agreements.)',
      },
      {
        id: 'poc_formulation',
        text: 'Formulation: A well-developed formulation, which reflects an understanding of the underlying contributions to and meaning of the child and family challenges, must be developed, shared with the family, and revised so that there is clear consensus with the family as to goals and priorities for intervention. This must be completed by 60 days. The formulation informs the content of the intervention and treatment plan.',
      },
      {
        id: 'poc_collaborative',
        text: 'Collaborative process: The Clinician and CC/FRC, in partnership with the family, develop a well-coordinated, comprehensive, family-driven plan of treatment goals, supports, and services.',
      },
      {
        id: 'poc_content',
        text: 'Content of Child and Family Plan of Care:',
      },
      {
        id: 'poc_content_reflects',
        text: 'Reflects the strengths, needs, priorities, and culture of the family.',
        isSubItem: true,
        parentId: 'poc_content',
      },
      {
        id: 'poc_content_includes',
        text: 'Includes all current treatment goals and activities for the child (and his/her family).',
        isSubItem: true,
        parentId: 'poc_content',
      },
      {
        id: 'poc_content_services',
        text: 'Includes services for all family members, as they relate to the treatment goals.',
        isSubItem: true,
        parentId: 'poc_content',
      },
      {
        id: 'poc_signatures',
        text: 'Signatures: The Child and Family Plan of Care must be signed by the parent/guardian, Clinician, CC/FRP, and Clinical Director/Supervisor.',
      },
      {
        id: 'poc_revision',
        text: "Ongoing revision and review: The Child First Clinical Team reviews and revises Plan of Care (treatment plan) regularly with parents/caregivers as goals are met and new priorities and needs are identified. All treatment plans should have evidence of review when clinically appropriate and/or when necessary per their agency's expectations.",
      },
      {
        id: 'poc_progress',
        text: 'Progress notes:',
      },
      {
        id: 'poc_progress_relate',
        text: 'All progress notes must relate directly to the goals of treatment.',
        isSubItem: true,
        parentId: 'poc_progress',
      },
      {
        id: 'poc_progress_signed',
        text: 'Notes must be dated and signed by a licensed practitioner, (if required by site).',
        isSubItem: true,
        parentId: 'poc_progress',
      },
    ],
  },
  {
    id: 'parentChildIntervention',
    number: 9,
    title: 'Parent-Child Intervention',
    items: [
      {
        id: 'pci_dyadic',
        text: 'Dyadic psychotherapy: The focus of the intervention is on the caregiver/parent - child relationship and caregiver/parent reflection and problem-solving as the basis for relationship change. This two-generational intervention fully integrates trauma-informed Child-Parent Psychotherapy, developed by Alicia Lieberman and Patricia Van Horn.',
      },
      {
        id: 'pci_dyadic_fidelity',
        text: 'All Clinical Teams must complete the Child First Fidelity Framework, maintain 2 Fidelity cases at all times, and review the Fidelity Framework in reflective, clinical supervision.',
        isSubItem: true,
        parentId: 'pci_dyadic',
      },
      {
        id: 'pci_dyadic_video',
        text: 'All Clinical Teams are required to use video as part of the intervention, unless parent/caregiver has not consented.',
        isSubItem: true,
        parentId: 'pci_dyadic',
      },
      {
        id: 'pci_guidance',
        text: "Parent guidance: Intervention includes attention to the child's developmental stage and individual differences through parent guidance.",
      },
      {
        id: 'pci_executive',
        text: 'Executive functioning: Enhancement of both parent and child executive functioning capacity is a critical component of the intervention.',
      },
    ],
  },
  {
    id: 'mentalHealthConsultation',
    number: 10,
    title: 'Mental Health Consultation with Early Care and Education (ECE)',
    items: [
      {
        id: 'mhc_assessment',
        text: 'Assessment: If a child is routinely cared for outside of the home, the CF Clinician must include ECE as part of the assessment and intervention process. It enables the Clinician to better understand how the child functions within different environments and with other adults and peers.',
      },
      {
        id: 'mhc_discussion',
        text: "Discussion with child's early care provider or teacher: This is to further understand the child's challenging behavior, to understand what strategies have been used in child care or classroom, and to help the teacher or child care provider understand the meaning of the child's behavior.",
      },
      {
        id: 'mhc_formulate',
        text: "Formulate strategies with child's early care provider or teacher: A plan is developed in collaboration with the teacher or child care provider to address the child's behavior and promote optimal development. The Clinician helps with implementation of the strategies.",
      },
      {
        id: 'mhc_collaboration',
        text: 'Collaboration among teachers and parents: The Clinician works to develop mutual understanding and support among teachers/child care providers and parents/caregivers.',
      },
    ],
  },
  {
    id: 'careCoordination',
    number: 11,
    title: 'Care Coordination',
    items: [
      {
        id: 'cc_comprehensive',
        text: 'Comprehensive family services: The Care Coordinator/Family Resource Partner connects the child and all family members with community-based services and supports.',
      },
      {
        id: 'cc_stabilization',
        text: 'Family stabilization: During the early weeks of intervention, care coordination efforts need to be most intense, in order to stabilize the family. When the family is stabilized, relationship-based issues are more successfully addressed.',
      },
      {
        id: 'cc_executive',
        text: 'Building adult executive functioning: All planning with the family is a collaborative process with the Care Coordinator/FRP in which the parent/caregiver develops goals for the family, prioritizes those goals, develops action steps or strategies to reach those goals, develops a process for self-monitoring whether the goals are accomplished, and revises the goals based on this review.',
      },
      {
        id: 'cc_relationship',
        text: 'Relationship building: Listening closely and following through on needed concrete supports and services builds trust and an alliance between the family and the Child First Clinical Team.',
      },
      {
        id: 'cc_reflective',
        text: 'Reflective care coordination: The meaning of the services to the family and the barriers to access must be understood without judgment. This informs the process of effectively connecting to community-based services and supports.',
      },
      {
        id: 'cc_sniff',
        text: 'Service Needs Inventory for Families (SNIFF): This provides an ongoing record of services that the family needs and wants, services that the Clinical Team feels might benefit the family, when the family was referred to services, and when the family obtained the services. This is an active document which must be kept up-to-date with completion at intake, quarterly, and at discharge.',
      },
    ],
  },
  {
    id: 'terminationDischarge',
    number: 12,
    title: 'Termination / Discharge',
    items: [
      {
        id: 'td_collaborative',
        text: 'Collaborative process: This is best as a collaborative decision based on significant progress or completion of the goals developed in the Child and Family Plan of Care.',
      },
      {
        id: 'td_disengagement',
        text: "Family disengagement: After one month of no-contact with family, in spite of both phone calls and letters (as per protocol), the family's file may be closed.",
      },
      {
        id: 'td_data',
        text: 'Discharge data: All families must have discharge assessment data.',
      },
      {
        id: 'td_summaries',
        text: 'Discharge summaries: All children and families should have discharge summaries, which document initial presentation, progress through intervention, and plans moving forward.',
      },
    ],
  },
  {
    id: 'clinicalSupervision',
    number: 13,
    title: 'Clinical and Reflective Supervision',
    items: [
      {
        id: 'cs_director',
        text: 'Clinical Director/Supervisor: The Clinical Director/Supervisor provides all clinical, reflective supervision to staff (unless numbers require an additional supervisor, also trained in the Child First model.) She/he must maintain an "open-door" policy in case of acute clinical needs.',
      },
      {
        id: 'cs_director_weekly',
        text: 'The Clinical Director/Supervisor must receive weekly individual, clinical supervision by a senior clinician in the agency implementing Child First (or outside consultation arrangements must be made).',
        isSubItem: true,
        parentId: 'cs_director',
      },
      {
        id: 'cs_director_biweekly',
        text: 'The Clinical Director/Supervisor must participate in biweekly, individual, clinical, reflective consultation with the Child First State/Regional Clinical Director or another Child First Senior Clinical Consultant.',
        isSubItem: true,
        parentId: 'cs_director',
      },
      {
        id: 'cs_individual',
        text: 'Individual, clinical, reflective supervision: 1 hour/week of individual clinical, reflective supervision is required for both Clinician and Care Coordinator/Family Resource Partner.',
      },
      {
        id: 'cs_team',
        text: 'Clinical Team clinical, reflective supervision: 1 hour/week of Clinical Team is required.',
      },
      {
        id: 'cs_group',
        text: 'Group reflective and clinical case supervision: 1 1/2 hours/week of group is required.',
      },
      {
        id: 'cs_admin',
        text: 'Administrative supervision: A minimum of 1 hour/month of programmatic or administrative supervision in a group setting is required.',
      },
    ],
  },
  {
    id: 'trainingConsultation',
    number: 14,
    title: 'Training and Reflective Consultation',
    items: [
      {
        id: 'tc_training',
        text: 'Training:',
      },
      {
        id: 'tc_training_lc',
        text: 'Learning Collaborative: Participation in four, in-person, multi-day Learning Sessions over approximately 6 months. Participation in 90% of sessions is required of all staff (unless there are extenuating circumstances with prior approval).',
        isSubItem: true,
        parentId: 'tc_training',
      },
      {
        id: 'tc_training_cpp',
        text: 'Child-Parent Psychotherapy (CPP): Participation of all Clinical Directors/Supervisors and Clinicians in three, in-person, multi-day trauma-informed CPP sessions. Participation in 18 months of biweekly supervision calls. All clinical staff must obtain CPP national rostering.',
        isSubItem: true,
        parentId: 'tc_training',
      },
      {
        id: 'tc_training_distance',
        text: 'Distance Learning Curriculum: On-line training modules, video-conferencing, reading, and observations between in-person Learning Sessions, as required.',
        isSubItem: true,
        parentId: 'tc_training',
      },
      {
        id: 'tc_training_new',
        text: 'New Staff training: Participation in a Learning Collaborative and/or Staff Accelerated Training (STAT), including all Distance Learning components and on-site instruction and monitoring by affiliate site Clinical Director/Supervisor.',
        isSubItem: true,
        parentId: 'tc_training',
      },
      {
        id: 'tc_training_conferences',
        text: 'Child First Conferences: Participation, as offered.',
        isSubItem: true,
        parentId: 'tc_training',
      },
      {
        id: 'tc_consultation',
        text: 'Clinical and reflective site consultation: Participation in clinical reflective consultation with State or Regional Clinical Director or a Child First Senior Clinical Consultant during the 12-month training period. On-site (preferred) or by video-conferencing.',
      },
      {
        id: 'tc_consultation_group',
        text: 'Affiliate site group for 1 1/2 hours, weekly for 6 months, then biweekly for six months.',
        isSubItem: true,
        parentId: 'tc_consultation',
      },
      {
        id: 'tc_consultation_director',
        text: 'Affiliate site Clinical Director/Supervisor for 1 hour, weekly for 6 months, then biweekly ongoing reflective clinical consultation.',
        isSubItem: true,
        parentId: 'tc_consultation',
      },
      {
        id: 'tc_network',
        text: "Clinical Directors' Network Meetings: Participation in 75% of monthly meetings, which include: Clinical reflective consultation, peer support, problem solving around management issues.",
      },
    ],
  },
  {
    id: 'dataManagement',
    number: 15,
    title: 'Data Entry and Management',
    items: [
      {
        id: 'dm_training',
        text: 'Data Training: Ensure staff complete all CFCR training prerequisites and participate in required CFCR trainings.',
      },
      {
        id: 'dm_entry',
        text: 'Data entry:',
      },
      {
        id: 'dm_entry_timely',
        text: 'All data must be entered into the Child First Comprehensive Clinical Record (CFCR) and Assessment Scoring Database (ASD) as per affiliate site standards or within 5 days, whichever is less.',
        isSubItem: true,
        parentId: 'dm_entry',
      },
      {
        id: 'dm_entry_measures',
        text: 'Assessment Measures are administered according to the timeframes in the Assessment Protocol found in the Toolkit.',
        isSubItem: true,
        parentId: 'dm_entry',
      },
      {
        id: 'dm_entry_ensures',
        text: 'Clinical Director/Supervisor ensures that affiliate site staff enter data timely, thoroughly, and accurately.',
        isSubItem: true,
        parentId: 'dm_entry',
      },
      {
        id: 'dm_accounts',
        text: 'User Accounts: Clinical Directors/Supervisors maintain up to date user accounts, including creating user accounts for all new staff in certification and production; keeping credentials up to date; end dating employment histories and timely revocation of staff access to CFCR upon separation of employment.',
      },
      {
        id: 'dm_responsive',
        text: 'Responsive to Communications: Clinical Directors/Supervisors distribute communications received from the Data and QE Department via CFCR User Groups, CFCR Support Hub, emails and webinars, etc., and implement new processes and procedures as needed.',
      },
      {
        id: 'dm_benchmarks',
        text: 'Benchmarks: All affiliate sites/programs must meet Child First Benchmarks for Child First model fidelity.',
      },
      {
        id: 'dm_outcomes',
        text: 'Outcome Analysis: (Note: The Child First NPO conducts analysis of the assessment measure data and provides outcome reports to each affiliate on a quarterly basis.)',
      },
      {
        id: 'dm_outcomes_review',
        text: 'Clinical Director/Supervisor reviews analysis of change from the baseline to discharge to determine whether expected improvement in child and family functioning is occurring.',
        isSubItem: true,
        parentId: 'dm_outcomes',
      },
      {
        id: 'dm_outcomes_teams',
        text: 'Clinical Director/Supervisor reviews data from specific Clinical Teams to determine areas in need of further growth.',
        isSubItem: true,
        parentId: 'dm_outcomes',
      },
      {
        id: 'dm_outcomes_consultation',
        text: 'Clinical Director/Supervisor identifies when there is a need for additional clinical consultation and training.',
        isSubItem: true,
        parentId: 'dm_outcomes',
      },
    ],
  },
  {
    id: 'qualityEnhancement',
    number: 16,
    title: 'Continuous Quality Enhancement and Action Plans',
    items: [
      {
        id: 'qe_continuous',
        text: 'Continuous Quality Improvement:',
      },
      {
        id: 'qe_continuous_leads',
        text: 'Clinical Director/Supervisor leads quality enhancement at the site. The Clinical Director/Supervisor uses data to understand their performance and the significance of their results; and create strategies to continuously improve Benchmarks and outcomes.',
        isSubItem: true,
        parentId: 'qe_continuous',
      },
      {
        id: 'qe_continuous_reviews',
        text: 'Each Child First affiliate program (Clinical Director/Supervisor and Teams) reviews monthly Benchmark Reports and collaboratively problem solves and develops quality improvement strategies in areas in need of improvement.',
        isSubItem: true,
        parentId: 'qe_continuous',
      },
      {
        id: 'qe_continuous_submit',
        text: 'Clinical Directors/Supervisors submit monthly Benchmark feedback reports to the NPO, outlining reflection on their performance; areas for focused improvement; and short-term quality enhancement plans to address the identified areas for improvement.',
        isSubItem: true,
        parentId: 'qe_continuous',
      },
      {
        id: 'qe_continuous_shared',
        text: "Strategies for improving implementation are shared at the Child First Clinical Directors'/Supervisors' Network meeting.",
        isSubItem: true,
        parentId: 'qe_continuous',
      },
      {
        id: 'qe_continuous_monthly',
        text: 'Clinical Director/Supervisor reviews benchmarks and other performance markers (e.g., Accreditation components) with Child First State/Regional Clinical Director on at least a monthly basis.',
        isSubItem: true,
        parentId: 'qe_continuous',
      },
      {
        id: 'qe_action',
        text: 'Action Plans:',
      },
      {
        id: 'qe_action_identify',
        text: 'The Action Plans that the site creates identify specific actions, goals and timelines.',
        isSubItem: true,
        parentId: 'qe_action',
      },
      {
        id: 'qe_action_monitor',
        text: 'The Clinical Director/Supervisor monitors and documents progress in meeting the goals of this plan on at least a biweekly basis.',
        isSubItem: true,
        parentId: 'qe_action',
      },
      {
        id: 'qe_fidelity',
        text: 'Model Fidelity and Accreditation:',
      },
      {
        id: 'qe_fidelity_participate',
        text: 'All sites must participate in the Accreditation review, which includes, but is not limited to: Benchmarks and Assessment outcomes, clinical chart review, video review, Clinical Fidelity Framework completion, training participation, Child First Community Advisory Board documentation, Self-Study and in-person interviews with Child First staff.',
        isSubItem: true,
        parentId: 'qe_fidelity',
      },
      {
        id: 'qe_fidelity_levels',
        text: 'The Accreditation process results in four levels of program fidelity: Accreditation with Excellence, Full Accreditation, Provisional Accreditation, and Probation.',
        isSubItem: true,
        parentId: 'qe_fidelity',
      },
      {
        id: 'qe_fidelity_qep',
        text: 'Affiliate sites receiving Full Accreditation, Provisional Accreditation or Probation must agree to participate in the development of a Quality Enhancement Plan and meet timelines in achieving service improvement in designated areas.',
        isSubItem: true,
        parentId: 'qe_fidelity',
      },
      {
        id: 'qe_fidelity_probation',
        text: 'Any affiliate site on Probation must have the site Senior Leader directly involved in the improvement strategies, with close monitoring of timelines and improvement in order to achieve agreed upon results.',
        isSubItem: true,
        parentId: 'qe_fidelity',
      },
    ],
  },
  {
    id: 'earlyChildhoodSystem',
    number: 17,
    title: 'Early Childhood System of Care',
    items: [
      {
        id: 'ecs_collaboration',
        text: 'Early childhood collaboration:',
      },
      {
        id: 'ecs_collaboration_participate',
        text: 'At each affiliate site, the Child First Clinical Director/Supervisor, Child First staff, and/or agency leadership must actively participate in all early childhood community collaboratives.',
        isSubItem: true,
        parentId: 'ecs_collaboration',
      },
      {
        id: 'ecs_collaboration_board',
        text: 'A Child First Community Advisory Board must be formed (or an existing collaborative may take on this role), with representatives of key community providers and parents, in order to promote collaboration, system development, cross-agency learning, early identification and referral, improved quality, and sustainability of the Child First intervention.',
        isSubItem: true,
        parentId: 'ecs_collaboration',
      },
      {
        id: 'ecs_required',
        text: 'Required collaborators:',
      },
      {
        id: 'ecs_required_parents',
        text: 'Parents',
        isSubItem: true,
        parentId: 'ecs_required',
      },
      {
        id: 'ecs_required_welfare',
        text: 'Child welfare',
        isSubItem: true,
        parentId: 'ecs_required',
      },
      {
        id: 'ecs_required_pediatrics',
        text: 'Pediatrics - e.g., private providers, clinics, and/or hospitals',
        isSubItem: true,
        parentId: 'ecs_required',
      },
      {
        id: 'ecs_required_ece',
        text: 'Early care and education - e.g., Head Start, School Readiness, child care, kith and kin',
        isSubItem: true,
        parentId: 'ecs_required',
      },
      {
        id: 'ecs_required_lea',
        text: 'Local education association and/or Board of Education',
        isSubItem: true,
        parentId: 'ecs_required',
      },
      {
        id: 'ecs_required_sped',
        text: 'Special education',
        isSubItem: true,
        parentId: 'ecs_required',
      },
      {
        id: 'ecs_required_childmh',
        text: 'Child mental health',
        isSubItem: true,
        parentId: 'ecs_required',
      },
      {
        id: 'ecs_required_adultmh',
        text: 'Adult mental health and substance abuse providers',
        isSubItem: true,
        parentId: 'ecs_required',
      },
      {
        id: 'ecs_required_ei',
        text: 'Early intervention (IDEA Part C)',
        isSubItem: true,
        parentId: 'ecs_required',
      },
      {
        id: 'ecs_required_hv',
        text: 'Other home visiting models',
        isSubItem: true,
        parentId: 'ecs_required',
      },
      {
        id: 'ecs_required_dv',
        text: 'Domestic violence agency/shelter',
        isSubItem: true,
        parentId: 'ecs_required',
      },
      {
        id: 'ecs_required_housing',
        text: 'Homeless shelters and housing',
        isSubItem: true,
        parentId: 'ecs_required',
      },
      {
        id: 'ecs_recommended',
        text: 'Recommended collaborators:',
      },
      {
        id: 'ecs_recommended_court',
        text: 'Court system',
        isSubItem: true,
        parentId: 'ecs_recommended',
      },
      {
        id: 'ecs_recommended_family',
        text: 'Family support and resource centers',
        isSubItem: true,
        parentId: 'ecs_recommended',
      },
      {
        id: 'ecs_recommended_health',
        text: 'Health Department: WIC, Healthy Start',
        isSubItem: true,
        parentId: 'ecs_recommended',
      },
      {
        id: 'ecs_recommended_ob',
        text: 'Obstetrics',
        isSubItem: true,
        parentId: 'ecs_recommended',
      },
      {
        id: 'ecs_recommended_faith',
        text: 'Faith-based organizations',
        isSubItem: true,
        parentId: 'ecs_recommended',
      },
      {
        id: 'ecs_recommended_state',
        text: 'State agencies: MIECHV, Medicaid, Education, Disabilities',
        isSubItem: true,
        parentId: 'ecs_recommended',
      },
      {
        id: 'ecs_recommended_other',
        text: 'Other - as per community need',
        isSubItem: true,
        parentId: 'ecs_recommended',
      },
    ],
  },
]

// ========================================
// Helper Functions
// ========================================

// Get all items that can be rated (not sub-items, only parent items that represent a fidelity area)
export function getRatableItems(): ProgramFidelityItem[] {
  const items: ProgramFidelityItem[] = []
  for (const section of programFidelitySections) {
    for (const item of section.items) {
      if (!item.isSubItem) {
        items.push(item)
      }
    }
  }
  return items
}

// Get total count of ratable items
export function getTotalRatableItemCount(): number {
  return getRatableItems().length
}

// Calculate progress for Program Fidelity section
export function calculateProgramFidelityProgress(
  ratings: Record<string, FidelityRating>
): number {
  const ratableItems = getRatableItems()
  if (ratableItems.length === 0) return 0

  let completed = 0
  for (const item of ratableItems) {
    if (ratings[item.id] !== null && ratings[item.id] !== undefined) {
      completed++
    }
  }

  return Math.round((completed / ratableItems.length) * 100)
}

// Get section progress
export function getSectionProgress(
  sectionId: string,
  ratings: Record<string, FidelityRating>
): { completed: number; total: number } {
  const section = programFidelitySections.find((s) => s.id === sectionId)
  if (!section) return { completed: 0, total: 0 }

  const ratableItems = section.items.filter((item) => !item.isSubItem)
  let completed = 0

  for (const item of ratableItems) {
    if (ratings[item.id] !== null && ratings[item.id] !== undefined) {
      completed++
    }
  }

  return { completed, total: ratableItems.length }
}
