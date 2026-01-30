import { useFormContext } from 'react-hook-form'
import type { SupervisionFormData } from '@/types/supervision.types'
import { User, Building2, Calendar } from 'lucide-react'

export function SupervisionIdentificationSection() {
  const { register } = useFormContext<SupervisionFormData>()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 rounded-lg">
            <User className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Identification</h2>
            <p className="text-sm text-gray-500">
              Basic information about the supervision assessment
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Clinical Team Names */}
        <div>
          <label
            htmlFor="clinicalTeamNames"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Clinical Team Names
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="clinicalTeamNames"
              type="text"
              {...register('identification.clinicalTeamNames')}
              placeholder="Enter clinical team names..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
                       placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Child First Site */}
        <div>
          <label
            htmlFor="childFirstSite"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Child First Site
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="childFirstSite"
              type="text"
              {...register('identification.childFirstSite')}
              placeholder="Enter site name..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
                       placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Month/Year */}
        <div>
          <label
            htmlFor="monthYear"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Month/Year
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="monthYear"
              type="month"
              {...register('identification.monthYear')}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
        <h3 className="font-medium text-pink-800 mb-2">When to Complete</h3>
        <p className="text-sm text-pink-700">
          For all Child First sites, to ensure fidelity to trauma-informed CPP and Child First
          (2 Fidelity cases need to be maintained at all times). Completed by Clinician/Care
          Coordinator every 3 months.
        </p>
      </div>
    </div>
  )
}
