import { describe, it, expect } from 'vitest'
import { TEMPLATES, getTemplate } from '@/templates'

describe('template registry', () => {
  it('contains the POST ROSTERING set and the July 2025 program checklist', () => {
    const ids = TEMPLATES.map(t => t.id)
    expect(ids).toEqual([
      'pr_foundational',
      'pr_core_intervention',
      'pr_termination',
      'pr_supervision',
      'program_fidelity_2025',
    ])
  })

  it('resolves templates by id', () => {
    expect(getTemplate('pr_supervision')?.instrument).toContain('Supervision')
    expect(getTemplate('nope')).toBeUndefined()
  })

  for (const template of TEMPLATES) {
    describe(template.id, () => {
      it('has version metadata and at least one section', () => {
        expect(template.version.length).toBeGreaterThan(0)
        expect(template.copyright).toContain('Child First')
        expect(template.sections.length).toBeGreaterThan(0)
        expect(template.headerFields.length).toBeGreaterThan(0)
      })

      it('has globally unique item ids', () => {
        const ids = template.sections.flatMap(s => s.items.map(i => i.id))
        expect(new Set(ids).size).toBe(ids.length)
      })

      it('provides options for every option-driven item', () => {
        for (const section of template.sections) {
          for (const item of section.items) {
            if (item.type === 'radio' || item.type === 'role_select') {
              expect(item.options?.length, `${template.id}/${item.id}`).toBeGreaterThan(1)
            }
          }
        }
      })
    })
  }

  it('dual-marked instruments are exactly the four clinical PR forms', () => {
    const dual = TEMPLATES.filter(t => t.dualMarking).map(t => t.id)
    expect(dual).toEqual([
      'pr_foundational',
      'pr_core_intervention',
      'pr_termination',
      'pr_supervision',
    ])
  })

  it('the treatment themes table appears in Foundational and Core Intervention', () => {
    for (const id of ['pr_foundational', 'pr_core_intervention']) {
      const template = getTemplate(id)!
      const themes = template.sections.find(s => s.id === 'treatment_themes')
      expect(themes, id).toBeDefined()
      expect(themes!.items).toHaveLength(13)
    }
  })
})
