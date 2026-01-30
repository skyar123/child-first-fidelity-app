import { useFormContext, Controller } from 'react-hook-form'
import { AccordionItem, AccordionGroup, TextField } from '@/components/ui'
import {
  careCoordinatorSections,
  type CareCoordinatorItem,
  type CareCoordinatorSection as CareCoordinatorSectionType,
} from '@/data/careCoordinatorItems'
import type { FormData, CareCoordinatorItemValue } from '@/types/form.types'
import { Users } from 'lucide-react'

export function CareCoordinatorSection() {
  const { control, watch } = useFormContext<FormData>()
  const careCoordinatorItems = watch('careCoordinator.items')

  // Calculate section progress
  const getSectionProgress = (section: CareCoordinatorSectionType) => {
    let completed = 0
    let total = 0

    for (const item of section.items) {
      if (item.type === 'checkbox') {
        total++
        const itemData = careCoordinatorItems?.[item.id] as CareCoordinatorItemValue | undefined
        if (itemData?.done || itemData?.na) {
          completed++
        }
      } else if (item.type === 'multi-checkbox' && item.subItems) {
        for (const subItem of item.subItems) {
          total++
          const itemData = careCoordinatorItems?.[item.id] as CareCoordinatorItemValue | undefined
          if (itemData?.subItems?.[subItem.id]) {
            completed++
          }
        }
      } else if (item.type === 'assessment-tracking' && item.assessmentTrackingItems) {
        for (const trackingItem of item.assessmentTrackingItems) {
          total++
          const itemData = careCoordinatorItems?.[item.id] as CareCoordinatorItemValue | undefined
          const tracking = itemData?.assessmentTracking?.[trackingItem.id]
          if (tracking?.completed || tracking?.entered) {
            completed++
          }
        }
      }
    }

    return { completed, total }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                III. Care Coordination Interventions
              </h2>
              <p className="text-sm text-gray-600">
                Child First Fidelity Framework
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Completed by Care Coordinator or Family Resource Partner, 
              then reviewed in supervision. To be completed after assessment and prior to formulation 
              to assess family service needs, and every 3 months thereafter.
            </p>
          </div>

          {/* Header Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="careCoordinator.careCoordinatorName"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Care Coordinator/FRP"
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Enter name"
                />
              )}
            />
            <Controller
              name="careCoordinator.clinicalDirectorName"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Clinical Director/Supervisor"
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Enter name"
                />
              )}
            />
            <Controller
              name="careCoordinator.clientInitials"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Client Initials"
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Enter initials"
                />
              )}
            />
            <Controller
              name="careCoordinator.childFirstSite"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Child First Site"
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Enter site"
                />
              )}
            />
            <Controller
              name="careCoordinator.date"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Date"
                  type="date"
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center gap-2 px-1">
        <h3 className="text-base font-semibold text-gray-900">Care Coordination Fidelity</h3>
      </div>

      {/* Checklist Sections */}
      <AccordionGroup>
        {careCoordinatorSections.map((section, index) => {
          const { completed, total } = getSectionProgress(section)
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0

          return (
            <AccordionItem
              key={section.id}
              title={section.title}
              badge={
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    progress === 100
                      ? 'bg-green-100 text-green-700'
                      : progress > 0
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {completed}/{total}
                </span>
              }
              defaultOpen={index === 0}
            >
              <div className="space-y-4">
                {section.items.map((item) => (
                  <CareCoordinatorItemRow key={item.id} item={item} />
                ))}
              </div>
            </AccordionItem>
          )
        })}
      </AccordionGroup>
    </div>
  )
}

function CareCoordinatorItemRow({ item }: { item: CareCoordinatorItem }) {
  const { control } = useFormContext<FormData>()
  const basePath = `careCoordinator.items.${item.id}`

  if (item.type === 'checkbox') {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Controller
            name={`${basePath}.done` as never}
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                checked={(field.value as boolean) || false}
                onChange={(e) => field.onChange(e.target.checked)}
                className="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
            )}
          />
          <div className="flex-1">
            <span className="text-sm text-gray-900">{item.text}</span>
          </div>
          <Controller
            name={`${basePath}.na` as never}
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={(field.value as boolean) || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-4 h-4 text-gray-500 border-gray-300 rounded focus:ring-gray-400"
                />
                N/A or UTD
              </label>
            )}
          />
        </div>
      </div>
    )
  }

  if (item.type === 'multi-checkbox' && item.subItems) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-900">{item.text}</span>
        </div>
        <div className="ml-4 space-y-2">
          {item.subItems.map((subItem) => (
            <div key={subItem.id} className="flex items-start gap-3">
              <Controller
                name={`${basePath}.subItems.${subItem.id}` as never}
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={(field.value as boolean) || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                )}
              />
              <span className="text-sm text-gray-700">{subItem.text}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (item.type === 'assessment-tracking' && item.assessmentTrackingItems) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-900">{item.text}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 pb-2 pr-4"></th>
                <th className="text-center text-xs font-medium text-gray-500 pb-2 px-2">In Process</th>
                <th className="text-center text-xs font-medium text-gray-500 pb-2 px-2">Completed</th>
                <th className="text-center text-xs font-medium text-gray-500 pb-2 px-2">Entered</th>
              </tr>
            </thead>
            <tbody>
              {item.assessmentTrackingItems.map((trackingItem) => (
                <tr key={trackingItem.id}>
                  <td className="text-sm text-gray-700 py-1 pr-4">{trackingItem.label}</td>
                  <td className="text-center py-1 px-2">
                    <Controller
                      name={`${basePath}.assessmentTracking.${trackingItem.id}.inProcess` as never}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={(field.value as boolean) || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
                        />
                      )}
                    />
                  </td>
                  <td className="text-center py-1 px-2">
                    <Controller
                      name={`${basePath}.assessmentTracking.${trackingItem.id}.completed` as never}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={(field.value as boolean) || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                        />
                      )}
                    />
                  </td>
                  <td className="text-center py-1 px-2">
                    <Controller
                      name={`${basePath}.assessmentTracking.${trackingItem.id}.entered` as never}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={(field.value as boolean) || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-400"
                        />
                      )}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return null
}
