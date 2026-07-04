// Procedural Fidelity: Before / During / After Home Visits
// Transcribed from "cz_I Foundational Phase Fidelity 2015 CF integrated -
// Green fillable 5.2.18" (docs/sources/), items CF24-CF33.
// On the paper form each item is answered Yes/No; in the app a checked box
// records "Yes" (see docs/sources/VERIFICATION.md).

export interface HomeVisitItem {
  id: string
  number: string
  label: string
  detail?: string
}

export interface HomeVisitSection {
  id: 'beforeVisit' | 'duringVisit' | 'afterVisit'
  title: string
  description: string
  items: HomeVisitItem[]
}

export const homeVisitSections: HomeVisitSection[] = [
  {
    id: 'beforeVisit',
    title: 'Before Each Home Visit',
    description: 'Procedural fidelity: before each home visit (Child First items)',
    items: [
      {
        id: 'cf24_reviewedAssessments',
        number: 'CF24',
        label: 'Clinical Team reviewed all assessments and planned for session',
        detail:
          'Clinical Team reviewed all assessments that were conducted to date, reviewed current hypotheses, and planned for the session',
      },
      {
        id: 'cf25_practicedApproaches',
        number: 'CF25',
        label: 'Clinical Team discussed and practiced any potentially challenging approaches',
      },
    ],
  },
  {
    id: 'duringVisit',
    title: 'During All Home Visits',
    description: 'Procedural fidelity: during all home visits (Child First items)',
    items: [
      {
        id: 'cf26_notBetterParent',
        number: 'CF26',
        label:
          'Clinical Team did not attempt to be the "better parent" by taking over for caregiver during sessions',
        detail: 'Clinical Team did NOT try to teach the caregiver by "modeling" the correct way',
      },
      {
        id: 'cf27_positiveComments',
        number: 'CF27',
        label:
          "Clinical Team made positive comments about child's need for and attachment to caregiver to strengthen the relationship",
        detail:
          "Clinical Team watched for positive approaches made by child to caregiver, and highlighted the child's need for, positive feelings for, and connection to the caregiver. Clinical Team watched for any positive approaches made by caregiver toward child, and made positive, supportive comments, especially highlighting any positive response by the child",
      },
      {
        id: 'cf28_honoredCulture',
        number: 'CF28',
        label: "Clinical Team selected interventions that honored family's culture and norms",
      },
      {
        id: 'cf29_reflectedCulture',
        number: 'CF29',
        label:
          'Clinical Team reflected with caregiver on impact of cultural/family roles/norms on dyadic relationships and expectations',
      },
      {
        id: 'cf30_teamPerception',
        number: 'CF30',
        label: 'Considered how Clinical Team is perceived by family and its impact on treatment',
      },
    ],
  },
  {
    id: 'afterVisit',
    title: 'After Each Home Visit',
    description: 'Procedural fidelity: after each home visit (Child First items)',
    items: [
      {
        id: 'cf31_debriefed',
        number: 'CF31',
        label: 'Clinical Team debriefed together',
        detail:
          'Clinical Team debriefed together and discussed what each observed and understood about the session, including their individual perceptions of the child, caregivers, and any others present',
      },
      {
        id: 'cf32_reassessedFormulation',
        number: 'CF32',
        label: 'Reassessment of the formulation',
        detail:
          'Clinical Team reassessed their understanding and formulation of the case; discussed differences in perceptions or understanding of session events',
      },
      {
        id: 'cf33_plannedNext',
        number: 'CF33',
        label: 'Clinical Team planned for next intervention session',
      },
    ],
  },
]

// Helper to get all items count
export function getTotalHomeVisitItems(): number {
  return homeVisitSections.reduce((sum, section) => sum + section.items.length, 0)
}
