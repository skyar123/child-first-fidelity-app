import { useFormContext } from 'react-hook-form'
import type { FormData, FormulationPlanning } from '@/types/form.types'
import { formulationFields } from '@/data/formulationItems'
import { FileText } from 'lucide-react'

export function FormulationSection() {
  const { register, watch } = useFormContext<FormData>()
  const formulation = watch('formulation')

  // Calculate completion
  const completedFields = formulationFields.filter(field => {
    const value = formulation?.[field.id as keyof FormulationPlanning]
    return value && value.trim().length > 0
  }).length

  const totalFields = formulationFields.length
  const percentComplete = Math.round((completedFields / totalFields) * 100)

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
                Formulation & Treatment Planning
              </h2>
              <p className="text-sm text-gray-500">
                Document clinical formulation and treatment approach
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{percentComplete}%</div>
            <div className="text-xs text-gray-500">{completedFields}/{totalFields} fields</div>
          </div>
        </div>
      </div>

      {/* Formulation Fields */}
      <div className="space-y-4">
        {formulationFields.map(field => (
          <div key={field.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {field.label}
              </label>
              <textarea
                id={field.id}
                {...register(`formulation.${field.id as keyof FormulationPlanning}`)}
                placeholder={field.placeholder}
                rows={field.rows}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                         placeholder:text-gray-400 text-sm resize-none"
              />
              <div className="mt-1 text-xs text-gray-400 text-right">
                {formulation?.[field.id as keyof FormulationPlanning]?.length || 0} characters
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-medium text-purple-800 mb-2">Documentation Tips</h3>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Use specific, observable descriptions when possible</li>
          <li>• Include both caregiver and child perspectives</li>
          <li>• Note cultural and contextual factors</li>
          <li>• Link presenting problems to trauma history when applicable</li>
          <li>• Identify family strengths to build upon in treatment</li>
        </ul>
      </div>
    </div>
  )
}
