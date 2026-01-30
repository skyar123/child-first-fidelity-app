import type {
  SupervisionFormData,
  SupervisionLogEntry
} from '@/types/supervision.types'

// ========================================
// Factory Functions
// ========================================

export function createDefaultSupervisionFormData(): SupervisionFormData {
  return {
    identification: {
      clinicalTeamNames: '',
      childFirstSite: '',
      monthYear: ''
    },
    proceduralFidelity: {
      items: {}
    },
    supervisorCapacity: {
      generalItems: {},
      clinicianOnlyItems: {},
      careCoordinatorOnlyItems: {}
    },
    knowledgeAreas: {
      generalItems: {},
      careCoordinatorOnlyItems: {}
    },
    skillsCompetencies: {
      generalItems: {},
      clinicianOnlyItems: {},
      careCoordinatorOnlyItems: {}
    },
    globalRatings: {
      items: {},
      strengthsAndSuggestions: ''
    },
    supervisionLog: []
  }
}

export function createSupervisionLogEntry(): SupervisionLogEntry {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    numSupervisees: null,
    minutes: null,
    percentClinical: '',
    counter: '',
    notes: ''
  }
}
