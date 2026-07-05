import { describe, it, expect } from 'vitest'
import { TEMPLATES, getTemplate } from '@/templates'

describe('template registry', () => {
  it('contains exactly the Care Coordination Interventions instrument', () => {
    expect(TEMPLATES.map(t => t.id)).toEqual(['cc_interventions'])
  })

  it('resolves templates by id', () => {
    expect(getTemplate('cc_interventions')?.instrument).toContain('Care Coordination')
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

  it('uses the official "N/A or UTD" response label', () => {
    const template = getTemplate('cc_interventions')!
    const withNa = template.sections
      .flatMap(s => s.items)
      .filter(i => i.type === 'checkbox' && i.naOption && i.naLabel === 'N/A or UTD')
    expect(withNa.length).toBeGreaterThan(5)
  })
})
