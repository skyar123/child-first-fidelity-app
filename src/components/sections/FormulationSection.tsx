import { useFormContext } from 'react-hook-form'
import type { FormData } from '@/types/form.types'
import { formulationChecklistSections, getTotalFormulationItems } from '@/data/formulationItems'
import { FileText } from 'lucide-react'

export function FormulationSection() {
  const { register, watch } = useFormContext<FormData>()
  const formulation = watch('formulation')

  const totalItems = getTotalFormulationItems()
  const completedItems = formulationChecklistSections.reduce(
    (sum, section) => sum + section.items.filter(item => formulation?.items?.[item.id]).length,
    0
  )
  const percentComplete = Math.round((completedItems / totalItems) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Formulation &amp; Treatment Planning
              </h2>
              <p className="text-sm text-gray-500">
                Procedural fidelity: treatment planning session and Child and Family Plan of Care
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{percentComplete}%</div>
            <div className="text-xs text-gray-500">
              {completedItems}/{totalItems} items
            </div>
          </div>
        </div>
      </div>

      {/* Checklist sections */}
      {formulationChecklistSections.map(section => (
        <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">{section.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{section.description}</p>
          </div>
          <div className="divide-y divide-gray-100">
            {section.items.map(item => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  {...register(`formulation.items.${item.id}`)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                        item.childFirstOnly
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.number}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </div>
                  {item.detail && <p className="text-sm text-gray-500 mt-1">{item.detail}</p>}
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Formulation notes (app extension) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <label htmlFor="formulation-notes" className="block text-sm font-medium text-gray-700 mb-2">
          Formulation notes{' '}
          <span className="text-xs font-normal text-gray-400">
            (app extension — not on the official form)
          </span>
        </label>
        <textarea
          id="formulation-notes"
          {...register('formulation.notes')}
          placeholder="Working formulation, hypotheses, themes for supervision..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                   placeholder:text-gray-400 text-sm resize-none"
        />
      </div>
    </div>
  )
}
