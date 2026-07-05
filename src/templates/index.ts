import type { FormTemplate } from './types'
import { prFoundational } from './postRosteringFoundational'
import { prCoreIntervention } from './postRosteringCoreIntervention'
import { prTermination } from './postRosteringTermination'
import { prSupervision } from './postRosteringSupervision'
import { ccInterventions } from './careCoordinationInterventions'
import { programFidelity2025 } from './programFidelity2025'

export * from './types'

export const TEMPLATES: FormTemplate[] = [
  prFoundational,
  prCoreIntervention,
  ccInterventions,
  prTermination,
  prSupervision,
  programFidelity2025,
]

export function getTemplate(id: string): FormTemplate | undefined {
  return TEMPLATES.find(t => t.id === id)
}
