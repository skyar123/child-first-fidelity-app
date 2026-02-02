import { useFormContext, Controller } from 'react-hook-form'
import type { TerminationFormData } from '@/types/termination.types'
import { FileText, User, Building2, Calendar, Hash } from 'lucide-react'
import {
  terminationPhaseOptions,
  terminationInitiatorOptions,
  terminationTypeOptions,
  changeInFunctioningOptions,
  prognosisOptions,
  closingReasonsColumn1,
  closingReasonsColumn2,
  closingReasonsColumn3,
  closingReasonsColumn4,
} from '@/data/terminationItems'

export function ClosingFormSection() {
  const { register, control, watch } = useFormContext<TerminationFormData>()
  const closingReasons = watch('closingForm.closingReasons')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg shadow-sm p-4 border border-yellow-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FileText className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">CPP Closing Form</h2>
            <p className="text-sm text-gray-600">
              Case identification and termination details
            </p>
          </div>
        </div>
      </div>

      {/* Identification Fields */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <h3 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
          Case Identification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Team Names
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                {...register('closingForm.clinicalTeamNames')}
                placeholder="Enter clinical team names..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
                         placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Initials
            </label>
            <input
              type="text"
              {...register('closingForm.clientInitials')}
              placeholder="e.g., JD"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
                       placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Child First Site
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                {...register('closingForm.childFirstSite')}
                placeholder="Enter site name..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
                         placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month/Year
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="month"
                {...register('closingForm.monthYear')}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CareLogic ID
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                {...register('closingForm.careLogicId')}
                placeholder="Enter CareLogic ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
                         placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question 1: When termination occurred */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">
          1. Please code when termination occurred: <span className="text-gray-500 font-normal">(check one)</span>
        </h3>
        <Controller
          name="closingForm.terminationPhase"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {terminationPhaseOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${field.value === option.value
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    checked={field.value === option.value}
                    onChange={() => field.onChange(option.value)}
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        />
      </div>

      {/* Question 2: Who initiated termination */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">
          2. Who initiated termination: <span className="text-gray-500 font-normal">(check one)</span>
        </h3>
        <Controller
          name="closingForm.terminationInitiator"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-3">
              {terminationInitiatorOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center gap-3 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all
                    ${field.value === option.value
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    checked={field.value === option.value}
                    onChange={() => field.onChange(option.value)}
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        />
      </div>

      {/* Question 3: Type of termination */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">
          3. Please code type of termination: <span className="text-gray-500 font-normal">(check one)</span>
        </h3>
        <Controller
          name="closingForm.terminationType"
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              {terminationTypeOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${field.value === option.value
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    checked={field.value === option.value}
                    onChange={() => field.onChange(option.value)}
                    className="w-4 h-4 mt-0.5 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        />
      </div>

      {/* Question 4: Change in functioning */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">
          4. Change in functioning: <span className="text-gray-500 font-normal">(check one)</span>
        </h3>
        <Controller
          name="closingForm.changeInFunctioning"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {changeInFunctioningOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(field.value === option.value ? null : option.value)}
                  className={`
                    px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                    ${field.value === option.value
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      {/* Question 5: Prognosis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">
          5. Prognosis: <span className="text-gray-500 font-normal">(check one)</span>
        </h3>
        <Controller
          name="closingForm.prognosis"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {prognosisOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(field.value === option.value ? null : option.value)}
                  className={`
                    px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                    ${field.value === option.value
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      {/* Question 6: Reasons for closing */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">
          6. Code reasons for closing below: <span className="text-gray-500 font-normal">(check all that apply)</span>
        </h3>

        {/* Completed Treatment */}
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('closingForm.closingReasons.completedTreatment')}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <span className="font-medium text-green-800">Completed treatment</span>
            <span className="text-green-600 text-sm">OR select reasons below:</span>
          </label>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Column 1 */}
          <div className="space-y-2">
            {closingReasonsColumn1.map((reason) => (
              <label key={reason.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register(`closingForm.closingReasons.${reason.id}` as any)}
                  className="w-4 h-4 mt-0.5 text-yellow-600 rounded focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-700">{reason.label}</span>
              </label>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            {closingReasonsColumn2.map((reason) => (
              <label key={reason.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register(`closingForm.closingReasons.${reason.id}` as any)}
                  className="w-4 h-4 mt-0.5 text-yellow-600 rounded focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-700">{reason.label}</span>
              </label>
            ))}
          </div>

          {/* Column 3 */}
          <div className="space-y-2">
            {closingReasonsColumn3.map((reason) => (
              <label key={reason.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register(`closingForm.closingReasons.${reason.id}` as any)}
                  className="w-4 h-4 mt-0.5 text-yellow-600 rounded focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-700">{reason.label}</span>
              </label>
            ))}
          </div>

          {/* Column 4 */}
          <div className="space-y-2">
            {closingReasonsColumn4.map((reason) => (
              <label key={reason.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register(`closingForm.closingReasons.${reason.id}` as any)}
                  className="w-4 h-4 mt-0.5 text-yellow-600 rounded focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-700">{reason.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Other specify field */}
        {closingReasons?.other && (
          <div className="mt-4">
            <input
              type="text"
              {...register('closingForm.closingReasons.otherSpecify')}
              placeholder="Please specify other reason..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
                       placeholder:text-gray-400"
            />
          </div>
        )}
      </div>

      {/* Question 7: Transfer to another clinician */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">
          7. Is part of the plan to transfer family to another CPP Clinician?
        </h3>
        <Controller
          name="closingForm.transferToAnotherClinician"
          control={control}
          render={({ field }) => (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => field.onChange(field.value === false ? null : false)}
                className={`
                  px-6 py-2 rounded-lg border-2 text-sm font-medium transition-all
                  ${field.value === false
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => field.onChange(field.value === true ? null : true)}
                className={`
                  px-6 py-2 rounded-lg border-2 text-sm font-medium transition-all
                  ${field.value === true
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Yes
              </button>
            </div>
          )}
        />
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-2">When to Complete</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Completed by the Clinical Team and reviewed with Clinical Director/Supervisor during reflective supervision.</li>
          <li>• For all Child First sites, to ensure fidelity to trauma-informed CPP and Child First (2 Fidelity cases need to be maintained at all times).</li>
          <li>• Procedures can be tracked as they are completed. The Contact Log should be completed after each session.</li>
          <li>• The full packet should be completed at the end of the Termination Phase.</li>
        </ul>
      </div>
    </div>
  )
}
