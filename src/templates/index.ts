import type { FormTemplate } from './types'
import { ccInterventions } from './careCoordinationInterventions'

export * from './types'

export const TEMPLATES: FormTemplate[] = [ccInterventions]

export function getTemplate(id: string): FormTemplate | undefined {
  return TEMPLATES.find(t => t.id === id)
}
