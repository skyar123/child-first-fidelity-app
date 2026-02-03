import { useState, useCallback } from 'react'
import { ArrowLeft, Menu, Download, X, Users, ClipboardCheck, HeartHandshake, Brain, RefreshCw, Heart, Compass, PenLine, Sparkles } from 'lucide-react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { TextField } from '@/components/ui'
import { GroundingExercise } from '@/components/ui/GroundingExercise'
import { FidelityCompass } from '@/components/ui/FidelityCompass'
import { ReflectiveJournal } from '@/components/ui/ReflectiveJournal'
import { getProgressMessage } from '@/utils/celebrations'
import {
  careCoordinatorSections,
  type CareCoordinatorItem,
} from '@/data/careCoordinatorItems'
import { generateCareCoordinatorPDF } from '@/utils/pdfExportCareCoordinator'

// Form data types for standalone CC form
interface CCFormData {
  identification: {
    careCoordinatorName: string
    clinicalDirectorName: string
    clientInitials: string
    childFirstSite: string
    date: string
  }
  items: Record<string, {
    done?: boolean
    na?: boolean
    subItems?: Record<string, boolean>
    assessmentTracking?: Record<string, {
      inProcess?: boolean
      completed?: boolean
      entered?: boolean
    }>
  }>
}

type SectionId = 'identification' | 'assessment' | 'meetings' | 'coordination' | 'planofcare' | 'services' | 'executive' | 'ongoing'

interface Section {
  id: SectionId
  label: string
  icon: React.ReactNode
}

const sections: Section[] = [
  { id: 'identification', label: 'Identification', icon: <Users className="w-4 h-4" /> },
  { id: 'assessment', label: 'Collaborative Assessment', icon: <ClipboardCheck className="w-4 h-4" /> },
  { id: 'meetings', label: 'Family Meetings', icon: <Users className="w-4 h-4" /> },
  { id: 'coordination', label: 'Care Coordination', icon: <RefreshCw className="w-4 h-4" /> },
  { id: 'planofcare', label: 'Plan of Care', icon: <ClipboardCheck className="w-4 h-4" /> },
  { id: 'services', label: 'Services & Supports', icon: <HeartHandshake className="w-4 h-4" /> },
  { id: 'executive', label: 'Executive Functioning', icon: <Brain className="w-4 h-4" /> },
  { id: 'ongoing', label: 'Ongoing Intervention', icon: <RefreshCw className="w-4 h-4" /> },
]

const sectionToDataMap: Record<SectionId, string[]> = {
  identification: [],
  assessment: ['collaborativeFamilyAssessment'],
  meetings: ['childFamilyMeetings'],
  coordination: ['updateIntakePart2'],
  planofcare: ['developmentPlanOfCare'],
  services: ['servicesAndSupports'],
  executive: ['promotedCaregiverExecutiveFunctioning'],
  ongoing: ['ongoingIntervention'],
}

interface CareCoordinatorAppShellProps {
  onBack: () => void
}

function createDefaultFormData(): CCFormData {
  return {
    identification: {
      careCoordinatorName: '',
      clinicalDirectorName: '',
      clientInitials: '',
      childFirstSite: '',
      date: new Date().toISOString().split('T')[0],
    },
    items: {}
  }
}

export function CareCoordinatorAppShell({ onBack }: CareCoordinatorAppShellProps) {
  const [currentSection, setCurrentSection] = useState<SectionId>('identification')
  const [navOpen, setNavOpen] = useState(false)
  const [showGrounding, setShowGrounding] = useState(false)
  const [showCompass, setShowCompass] = useState(false)
  const [showJournal, setShowJournal] = useState(false)

  const methods = useForm<CCFormData>({
    defaultValues: createDefaultFormData(),
    mode: 'onChange'
  })

  const { watch, control } = methods
  const formValues = watch()

  // Calculate progress
  const calculateProgress = useCallback(() => {
    let completed = 0
    let total = 5 // identification fields

    // Count identification
    if (formValues.identification.careCoordinatorName) completed++
    if (formValues.identification.clinicalDirectorName) completed++
    if (formValues.identification.clientInitials) completed++
    if (formValues.identification.childFirstSite) completed++
    if (formValues.identification.date) completed++

    // Count items
    for (const section of careCoordinatorSections) {
      for (const item of section.items) {
        if (item.type === 'checkbox') {
          total++
          const itemData = formValues.items?.[item.id]
          if (itemData?.done || itemData?.na) completed++
        } else if (item.type === 'multi-checkbox' && item.subItems) {
          for (const subItem of item.subItems) {
            total++
            if (formValues.items?.[item.id]?.subItems?.[subItem.id]) completed++
          }
        } else if (item.type === 'assessment-tracking' && item.assessmentTrackingItems) {
          for (const trackingItem of item.assessmentTrackingItems) {
            total++
            const tracking = formValues.items?.[item.id]?.assessmentTracking?.[trackingItem.id]
            if (tracking?.completed || tracking?.entered) completed++
          }
        }
      }
    }

    return total > 0 ? Math.round((completed / total) * 100) : 0
  }, [formValues])

  const progress = calculateProgress()

  const handleExportPDF = useCallback(() => {
    generateCareCoordinatorPDF(methods.getValues())
  }, [methods])

  const renderContent = () => {
    if (currentSection === 'identification') {
      return (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Case Identification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="identification.careCoordinatorName"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Care Coordinator/FRP"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter name"
                  />
                )}
              />
              <Controller
                name="identification.clinicalDirectorName"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Clinical Director/Supervisor"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter name"
                  />
                )}
              />
              <Controller
                name="identification.clientInitials"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Client Initials"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter initials"
                  />
                )}
              />
              <Controller
                name="identification.childFirstSite"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Child First Site"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter site"
                  />
                )}
              />
              <Controller
                name="identification.date"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Date"
                    type="date"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="glass-card-gradient rounded-2xl p-4">
            <p className="text-sm text-cyan-800">
              <strong>Instructions:</strong> Completed by Care Coordinator or Family Resource Partner,
              then reviewed in supervision. To be completed after assessment and prior to formulation
              to assess family service needs, and every 3 months thereafter.
            </p>
          </div>
        </div>
      )
    }

    // Get relevant sections for this tab
    const relevantSectionIds = sectionToDataMap[currentSection]
    const relevantSections = careCoordinatorSections.filter(s => relevantSectionIds.includes(s.id))

    return (
      <div className="space-y-4">
        {relevantSections.map((section) => (
          <div key={section.id} className="glass-card rounded-2xl overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/20">
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
            </div>
            <div className="p-4 space-y-3">
              {section.items.map((item) => (
                <CCItemRow key={item.id} item={item} control={control} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const progressMessage = getProgressMessage(progress)

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen animated-gradient-bg">
        {/* Header */}
        <header className="sticky top-0 z-40 glass-header border-b border-white/20">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-xl hover:bg-white/50 transition-colors"
                aria-label="Back to form selection"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setNavOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/50 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 float-animation">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold gradient-text truncate max-w-[200px]">
                      {formValues.identification.clientInitials || 'Care Coordinator'}
                    </h1>
                    {progress === 100 && (
                      <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-medium">
                        Complete!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Care Coordinator Interventions
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Wellness Features */}
              <button
                onClick={() => setShowGrounding(true)}
                className="p-2 rounded-lg hover:bg-cyan-50 text-cyan-400 hover:text-cyan-500 transition-all"
                aria-label="Regulate First - Grounding Exercise"
                title="Regulate First"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowCompass(true)}
                className="p-2 rounded-lg hover:bg-green-50 text-green-400 hover:text-green-500 transition-all"
                aria-label="Fidelity Compass"
                title="Fidelity Compass"
              >
                <Compass className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowJournal(true)}
                className="p-2 rounded-lg hover:bg-purple-50 text-purple-400 hover:text-purple-500 transition-all"
                aria-label="Reflective Practice Journal"
                title="Reflective Journal"
              >
                <PenLine className="w-5 h-5" />
              </button>
              <span className="w-px h-6 bg-gray-200 mx-1" />
              <button
                onClick={handleExportPDF}
                className="hidden sm:flex items-center gap-2 px-4 py-2 ml-2
                         bg-gradient-to-r from-cyan-500 to-blue-500
                         text-white text-sm font-semibold rounded-xl
                         hover:from-cyan-600 hover:to-blue-600
                         transition-all shadow-lg shadow-cyan-500/30
                         hover:shadow-cyan-500/50 hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    progress === 100
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 progress-complete'
                      : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{progressMessage.emoji}</span>
                <span className="text-sm font-semibold text-gray-700 min-w-[3ch]">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="lg:flex">
          {/* Mobile overlay */}
          {navOpen && (
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setNavOpen(false)}
            />
          )}

          {/* Navigation sidebar */}
          <nav
            className={`
              fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-73px)] w-72 glass-sidebar
              transform transition-transform duration-300 ease-out z-50
              ${navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 lg:hidden">
              <span className="font-semibold text-gray-900">Sections</span>
              <button
                onClick={() => setNavOpen(false)}
                className="p-2 rounded-xl hover:bg-white/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Section list */}
            <div className="p-3 overflow-y-auto h-full">
              {sections.map((section) => {
                const isActive = currentSection === section.id

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setCurrentSection(section.id)
                      setNavOpen(false)
                    }}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl mb-2 transition-all flex items-center gap-3
                      ${isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-700 shadow-lg shadow-cyan-500/10'
                        : 'text-gray-600 hover:bg-white/50'
                      }
                    `}
                  >
                    <span className={isActive ? 'text-cyan-600' : 'text-gray-400'}>{section.icon}</span>
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 min-h-[calc(100vh-73px)] p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>

        {/* Wellness Modals */}
        {showGrounding && (
          <GroundingExercise onClose={() => setShowGrounding(false)} />
        )}
        {showCompass && (
          <FidelityCompass onClose={() => setShowCompass(false)} />
        )}
        {showJournal && (
          <ReflectiveJournal onClose={() => setShowJournal(false)} />
        )}
      </div>

      {/* Wellness Modals */}
      {showGrounding && (
        <GroundingExercise onClose={() => setShowGrounding(false)} />
      )}
      {showCompass && (
        <FidelityCompass onClose={() => setShowCompass(false)} />
      )}
      {showJournal && (
        <ReflectiveJournal onClose={() => setShowJournal(false)} />
      )}
    </FormProvider>
  )
}

// Item Row Component
function CCItemRow({
  item,
  control,
}: {
  item: CareCoordinatorItem
  control: ReturnType<typeof useForm<CCFormData>>['control']
}) {
  const basePath = `items.${item.id}`

  if (item.type === 'checkbox') {
    return (
      <div className="glass-item rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Controller
            name={`${basePath}.done` as never}
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                checked={Boolean(field.value) || false}
                onChange={(e) => field.onChange(e.target.checked)}
                className="mt-1 w-5 h-5 text-cyan-500 border-gray-300 rounded-lg focus:ring-cyan-500 cursor-pointer"
              />
            )}
          />
          <div className="flex-1">
            <span className="text-sm text-gray-800">{item.text}</span>
          </div>
          <Controller
            name={`${basePath}.na` as never}
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer whitespace-nowrap px-2 py-1 rounded-lg hover:bg-white/50 transition-colors">
                <input
                  type="checkbox"
                  checked={Boolean(field.value) || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-4 h-4 text-gray-400 border-gray-300 rounded focus:ring-gray-400"
                />
                N/A
              </label>
            )}
          />
        </div>
      </div>
    )
  }

  if (item.type === 'multi-checkbox' && item.subItems) {
    return (
      <div className="glass-item rounded-xl p-4">
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-900">{item.text}</span>
        </div>
        <div className="ml-4 space-y-2">
          {item.subItems.map((subItem) => (
            <div key={subItem.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/30 transition-colors">
              <Controller
                name={`${basePath}.subItems.${subItem.id}` as never}
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={Boolean(field.value) || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500 cursor-pointer"
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
      <div className="glass-item rounded-xl p-4">
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-900">{item.text}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 pb-2 pr-4"></th>
                <th className="text-center text-xs font-medium text-amber-600 pb-2 px-2">In Process</th>
                <th className="text-center text-xs font-medium text-blue-600 pb-2 px-2">Completed</th>
                <th className="text-center text-xs font-medium text-green-600 pb-2 px-2">Entered</th>
              </tr>
            </thead>
            <tbody>
              {item.assessmentTrackingItems.map((trackingItem) => (
                <tr key={trackingItem.id} className="hover:bg-white/30 transition-colors">
                  <td className="text-sm text-gray-700 py-2 pr-4 font-medium">{trackingItem.label}</td>
                  <td className="text-center py-2 px-2">
                    <Controller
                      name={`${basePath}.assessmentTracking.${trackingItem.id}.inProcess` as never}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={Boolean(field.value) || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-5 h-5 text-amber-500 border-gray-300 rounded-lg focus:ring-amber-400 cursor-pointer"
                        />
                      )}
                    />
                  </td>
                  <td className="text-center py-2 px-2">
                    <Controller
                      name={`${basePath}.assessmentTracking.${trackingItem.id}.completed` as never}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={Boolean(field.value) || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-5 h-5 text-blue-500 border-gray-300 rounded-lg focus:ring-blue-400 cursor-pointer"
                        />
                      )}
                    />
                  </td>
                  <td className="text-center py-2 px-2">
                    <Controller
                      name={`${basePath}.assessmentTracking.${trackingItem.id}.entered` as never}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={Boolean(field.value) || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-5 h-5 text-green-500 border-gray-300 rounded-lg focus:ring-green-400 cursor-pointer"
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
