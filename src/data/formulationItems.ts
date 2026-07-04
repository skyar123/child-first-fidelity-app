// Procedural Fidelity: Formulation and Treatment Planning Session +
// Child and Family Plan of Care
// Transcribed from "cz_I Foundational Phase Fidelity 2015 CF integrated -
// Green fillable 5.2.18" (docs/sources/).
// On the paper form each item is answered Yes/No; in the app a checked box
// records "Yes" (see docs/sources/VERIFICATION.md).

export interface FormulationItem {
  id: string
  number: string
  label: string
  detail?: string
  childFirstOnly?: boolean
}

export interface FormulationChecklistSection {
  id: 'treatmentPlanningSession' | 'planOfCare'
  title: string
  description: string
  items: FormulationItem[]
}

export const formulationChecklistSections: FormulationChecklistSection[] = [
  {
    id: 'treatmentPlanningSession',
    title: 'Formulation and Treatment Planning Session',
    description:
      'After completing the CPP Feedback Session, if needed Clinical Team meets alone with the caregiver to discuss treatment planning goals. Other caregivers may be present, but the child should not be present unless the child is an infant.',
    items: [
      {
        id: 'item1_elicitedPerception',
        number: '1',
        label:
          'Clinical Team elicited caregiver perception about assessment process and Foundational Phase',
        detail:
          'Engaged caregiver in a conversation about what s/he learned, positive experiences, concerns, ideas for future steps',
      },
      {
        id: 'item2_describedFormulation',
        number: '2',
        label: "Described Clinical Team's current formulation to caregiver",
      },
      {
        id: 'cf16_checkedUnderstanding',
        number: 'CF16',
        label:
          "Clinical Team checked with caregiver that formulation is consistent with caregiver's understanding",
        childFirstOnly: true,
      },
      {
        id: 'cf17_elicitedPriorities',
        number: 'CF17',
        label: "Clinical Team elicited caregiver's priorities in the work moving forward",
        childFirstOnly: true,
      },
      {
        id: 'cf18_sharedRecommendations',
        number: 'CF18',
        label:
          'Clinical Team shared recommendations, possible next steps, and solicits feedback from caregiver',
        childFirstOnly: true,
      },
      {
        id: 'cf19_presentedPlanOfCare',
        number: 'CF19',
        label: 'Preliminary Child and Family Plan of Care was presented',
        detail:
          "Preliminary Child and Family Plan of Care was presented and caregiver's goals for treatment and priorities were further discussed; planned with caregiver steps involved in meeting objective, measurable goals, including how to evaluate goal achievement. Treatment Plan is revised, if necessary, to incorporate caregiver perspective and any new treatment goals.",
        childFirstOnly: true,
      },
      {
        id: 'item3_providedReferrals',
        number: '3',
        label:
          'Care Coordinator provided other referrals as needed for child, caregiver, or other family members',
      },
    ],
  },
  {
    id: 'planOfCare',
    title: 'Child and Family Plan of Care',
    description: 'Procedural fidelity: Child and Family Plan of Care (Child First items)',
    items: [
      {
        id: 'cf20_planProvided',
        number: 'CF20',
        label: 'Revised Child and Family Plan of Care was provided to caregiver',
        childFirstOnly: true,
      },
      {
        id: 'cf21_planSigned',
        number: 'CF21',
        label:
          'Child and Family Plan of Care was signed by caregivers/guardians and clinical team members',
        childFirstOnly: true,
      },
      {
        id: 'cf22_planTimely',
        number: 'CF22',
        label:
          'Child and Family Plan of Care was completed within 30 days of initial visit (sooner if state requires initial treatment plan)',
        childFirstOnly: true,
      },
      {
        id: 'cf23_planSignedDirector',
        number: 'CF23',
        label: 'Child and Family Plan of Care was signed by Clinical Director/Supervisor',
        childFirstOnly: true,
      },
    ],
  },
]

export function getTotalFormulationItems(): number {
  return formulationChecklistSections.reduce((sum, s) => sum + s.items.length, 0)
}
