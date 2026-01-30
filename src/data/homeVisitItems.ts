// Home Visit Checklist Items

export interface HomeVisitItem {
  id: string
  label: string
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
    title: 'Before the Visit',
    description: 'Preparation activities before conducting the home visit',
    items: [
      { id: 'reviewedCase', label: 'Reviewed case notes and previous session' },
      { id: 'preparedMaterials', label: 'Prepared session materials and activities' },
      { id: 'confirmedAppointment', label: 'Confirmed appointment with family' },
      { id: 'reviewedSafety', label: 'Reviewed safety considerations' },
      { id: 'consultedTeam', label: 'Consulted with clinical team if needed' },
      { id: 'identifiedGoals', label: 'Identified session goals' },
      { id: 'preparedTransitions', label: 'Prepared for transitions and endings' }
    ]
  },
  {
    id: 'duringVisit',
    title: 'During the Visit',
    description: 'Activities and interventions during the home visit',
    items: [
      { id: 'assessedSafety', label: 'Assessed safety of home environment' },
      { id: 'checkedIn', label: 'Checked in with caregiver and child' },
      { id: 'observedInteraction', label: 'Observed parent-child interaction' },
      { id: 'providedPsychoeducation', label: 'Provided psychoeducation as appropriate' },
      { id: 'facilitatedPlay', label: 'Facilitated developmental/therapeutic play' },
      { id: 'addressedTrauma', label: 'Addressed trauma-related content as indicated' },
      { id: 'supportedRegulation', label: 'Supported emotional regulation' },
      { id: 'modeledInterventions', label: 'Modeled interventions for caregiver' },
      { id: 'addressedConcerns', label: 'Addressed family concerns and questions' },
      { id: 'plannedNextSteps', label: 'Planned next steps with family' }
    ]
  },
  {
    id: 'afterVisit',
    title: 'After the Visit',
    description: 'Post-visit documentation and follow-up',
    items: [
      { id: 'documentedSession', label: 'Documented session notes' },
      { id: 'updatedAssessment', label: 'Updated assessment information' },
      { id: 'reviewedFidelity', label: 'Reviewed fidelity to treatment model' },
      { id: 'identifiedFollowUp', label: 'Identified follow-up items' },
      { id: 'consultedSupervisor', label: 'Consulted with supervisor as needed' },
      { id: 'coordinatedCare', label: 'Coordinated care with other providers' },
      { id: 'preparedNextSession', label: 'Prepared for next session' },
      { id: 'selfCare', label: 'Engaged in self-care/debriefing' }
    ]
  }
]

// Helper to get all items count
export function getTotalHomeVisitItems(): number {
  return homeVisitSections.reduce((sum, section) => sum + section.items.length, 0)
}
