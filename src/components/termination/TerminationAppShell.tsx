import { useState, useCallback, useEffect } from 'react'
import { ArrowLeft, Menu, Download, X, CheckCircle2, Clock, AlertTriangle, Users, Heart, FileText, Compass, PenLine } from 'lucide-react'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import type { TerminationFormData } from '@/data/terminationItems'
import { DEFAULT_TERMINATION_DATA, TERMINATION_SECTIONS } from '@/data/terminationItems'
import { ProgressBar } from '@/components/ui'
import { getRandomQuote } from '@/utils/wisdomQuotes'
import { GroundingExercise } from '@/components/ui/GroundingExercise'
import { FidelityCompass } from '@/components/ui/FidelityCompass'
import { ReflectiveJournal } from '@/components/ui/ReflectiveJournal'

type SectionId =
  | 'identification'
  | 'planned'
  | 'unplanned_reengagement'
  | 'unplanned_process'
  | 'reflection'
  | 'outcomes'
  | 'notes'

interface Section {
  id: SectionId
  label: string
  shortLabel: string
  icon: React.ComponentType<{ className?: string }>
  showWhen?: 'planned' | 'unplanned' | 'always'
}

const sections: Section[] = [
  { id: 'identification', label: 'Case Identification', shortLabel: 'ID', icon: FileText, showWhen: 'always' },
  { id: 'planned', label: 'Planned Termination', shortLabel: 'Planned', icon: CheckCircle2, showWhen: 'planned' },
  { id: 'unplanned_reengagement', label: 'Re-engagement Efforts', shortLabel: 'Re-engage', icon: Users, showWhen: 'unplanned' },
  { id: 'unplanned_process', label: 'Closure Process', shortLabel: 'Closure', icon: Clock, showWhen: 'unplanned' },
  { id: 'reflection', label: 'Team Reflection', shortLabel: 'Reflect', icon: Heart, showWhen: 'always' },
  { id: 'outcomes', label: 'Treatment Outcomes', shortLabel: 'Outcomes', icon: CheckCircle2, showWhen: 'always' },
  { id: 'notes', label: 'Notes & Comments', shortLabel: 'Notes', icon: FileText, showWhen: 'always' }
]

const STORAGE_KEY = 'cpp_termination_form'

interface TerminationAppShellProps {
  onBack: () => void
}

// Identification Section Component
function IdentificationSection() {
  const { register, watch } = useFormContext<TerminationFormData>()
  const terminationType = watch('identification.terminationType')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Case Identification</h2>
        <p className="text-gray-600">Basic information about the case being terminated</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Initials
            </label>
            <input
              {...register('identification.clientInitials')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="e.g., JD"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Case ID
            </label>
            <input
              {...register('identification.caseId')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="e.g., CF-2024-001"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Termination Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`
                flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${terminationType === 'planned'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                {...register('identification.terminationType')}
                value="planned"
                className="sr-only"
              />
              <CheckCircle2 className={`w-6 h-6 ${terminationType === 'planned' ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <span className="font-medium text-gray-900">Planned</span>
                <p className="text-xs text-gray-500">Treatment goals achieved</p>
              </div>
            </label>
            <label
              className={`
                flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${terminationType === 'unplanned'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                {...register('identification.terminationType')}
                value="unplanned"
                className="sr-only"
              />
              <AlertTriangle className={`w-6 h-6 ${terminationType === 'unplanned' ? 'text-amber-600' : 'text-gray-400'}`} />
              <div>
                <span className="font-medium text-gray-900">Unplanned</span>
                <p className="text-xs text-gray-500">Family disengaged</p>
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Termination Date
            </label>
            <input
              type="date"
              {...register('identification.terminationDate')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Session Date
            </label>
            <input
              type="date"
              {...register('identification.lastSessionDate')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Sessions Completed
            </label>
            <input
              type="number"
              {...register('identification.totalSessionsCompleted')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="e.g., 24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Members
            </label>
            <input
              {...register('identification.teamMembers')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="e.g., Jane Doe, John Smith"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Checklist Section Component
function ChecklistSection({ sectionId, title, description }: {
  sectionId: string
  title: string
  description: string
}) {
  const { register, watch } = useFormContext<TerminationFormData>()
  const section = TERMINATION_SECTIONS.find(s => s.id === sectionId)

  if (!section) return null

  const getFieldName = (itemId: string) => {
    if (sectionId.startsWith('planned')) return `plannedTermination.${itemId}` as const
    if (sectionId === 'unplanned_reengagement') return `unplannedReengagement.${itemId}` as const
    if (sectionId === 'unplanned_process') return `unplannedProcess.${itemId}` as const
    if (sectionId === 'team_reflection') return `teamReflection.${itemId}` as const
    return `teamReflection.${itemId}` as const
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="space-y-4">
          {section.items.map((item, index) => {
            const fieldName = getFieldName(item.id)
            const value = watch(fieldName)

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  value === 'yes'
                    ? 'border-green-200 bg-green-50'
                    : value === 'no'
                      ? 'border-red-200 bg-red-50'
                      : value === 'na'
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-gray-100 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 mb-3">{item.text}</p>
                    <div className="flex items-center gap-4">
                      {['yes', 'no', 'na'].map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            {...register(fieldName)}
                            value={option}
                            className="w-4 h-4 text-yellow-500 focus:ring-yellow-500"
                          />
                          <span className={`text-sm font-medium ${
                            option === 'yes' ? 'text-green-700' :
                            option === 'no' ? 'text-red-700' : 'text-gray-500'
                          }`}>
                            {option === 'yes' ? 'Yes' : option === 'no' ? 'No' : 'N/A'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Outcomes Section Component
function OutcomesSection() {
  const { register, watch } = useFormContext<TerminationFormData>()
  const goalsAchieved = watch('outcomes.treatmentGoalsAchieved')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Treatment Outcomes</h2>
        <p className="text-gray-600">Document the outcomes and achievements from treatment</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Treatment Goals Achievement
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'fully', label: 'Fully Achieved', color: 'green' },
              { value: 'partially', label: 'Partially Achieved', color: 'yellow' },
              { value: 'not', label: 'Not Achieved', color: 'red' }
            ].map((option) => (
              <label
                key={option.value}
                className={`
                  flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-center
                  ${goalsAchieved === option.value
                    ? option.color === 'green'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : option.color === 'yellow'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                `}
              >
                <input
                  type="radio"
                  {...register('outcomes.treatmentGoalsAchieved')}
                  value={option.value}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Strengths Observed During Treatment
          </label>
          <textarea
            {...register('outcomes.strengthsObserved')}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            placeholder="Document the family's strengths that emerged or were strengthened during treatment..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Areas for Continued Growth
          </label>
          <textarea
            {...register('outcomes.areasForContinuedGrowth')}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            placeholder="What areas might the family continue to work on..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Caregiver Feedback
          </label>
          <textarea
            {...register('outcomes.caregiverFeedback')}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            placeholder="What feedback did the caregiver share about their experience..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referrals Made
          </label>
          <textarea
            {...register('outcomes.referralsMade')}
            rows={2}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            placeholder="List any referrals made for ongoing services..."
          />
        </div>
      </div>
    </div>
  )
}

// Notes Section Component
function NotesSection() {
  const { register } = useFormContext<TerminationFormData>()
  const quote = getRandomQuote()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Notes & Comments</h2>
        <p className="text-gray-600">Additional documentation and supervisor notes</p>
      </div>

      {/* Wisdom quote */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <p className="text-amber-800 italic">"{quote.quote}"</p>
        <p className="text-sm text-amber-600 mt-1">— {quote.source}</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Clinical Supervisor Notes
          </label>
          <textarea
            {...register('notes.supervisorNotes')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            placeholder="Supervisor observations and recommendations..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Comments
          </label>
          <textarea
            {...register('notes.additionalComments')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            placeholder="Any additional information or context..."
          />
        </div>
      </div>
    </div>
  )
}

export function TerminationAppShell({ onBack }: TerminationAppShellProps) {
  const [currentSection, setCurrentSection] = useState<SectionId>('identification')
  const [navOpen, setNavOpen] = useState(false)
  const [showGrounding, setShowGrounding] = useState(false)
  const [showCompass, setShowCompass] = useState(false)
  const [showJournal, setShowJournal] = useState(false)

  const methods = useForm<TerminationFormData>({
    defaultValues: DEFAULT_TERMINATION_DATA,
    mode: 'onChange'
  })

  const { watch } = methods
  const formValues = watch()
  const terminationType = watch('identification.terminationType')

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        methods.reset(parsed)
      } catch {
        // Invalid JSON
      }
    }
  }, [methods])

  // Auto-save
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // Filter sections based on termination type
  const visibleSections = sections.filter(section => {
    if (section.showWhen === 'always') return true
    if (section.showWhen === 'planned' && terminationType === 'planned') return true
    if (section.showWhen === 'unplanned' && terminationType === 'unplanned') return true
    return false
  })

  // Calculate progress
  const calculateProgress = useCallback(() => {
    let completed = 0
    let total = 0

    // Identification
    total += 4
    if (formValues.identification.clientInitials) completed++
    if (formValues.identification.terminationType) completed++
    if (formValues.identification.terminationDate) completed++
    if (formValues.identification.teamMembers) completed++

    // Checklist items based on termination type
    if (terminationType === 'planned') {
      const plannedSections = TERMINATION_SECTIONS.filter(s =>
        s.id.startsWith('planned')
      )
      plannedSections.forEach(section => {
        total += section.items.length
        section.items.forEach(item => {
          if (formValues.plannedTermination[item.id]) completed++
        })
      })
    } else if (terminationType === 'unplanned') {
      const reengagementSection = TERMINATION_SECTIONS.find(s => s.id === 'unplanned_reengagement')
      const processSection = TERMINATION_SECTIONS.find(s => s.id === 'unplanned_process')

      if (reengagementSection) {
        total += reengagementSection.items.length
        reengagementSection.items.forEach(item => {
          if (formValues.unplannedReengagement[item.id]) completed++
        })
      }
      if (processSection) {
        total += processSection.items.length
        processSection.items.forEach(item => {
          if (formValues.unplannedProcess[item.id]) completed++
        })
      }
    }

    // Team reflection
    const reflectionSection = TERMINATION_SECTIONS.find(s => s.id === 'team_reflection')
    if (reflectionSection) {
      total += reflectionSection.items.length
      reflectionSection.items.forEach(item => {
        if (formValues.teamReflection[item.id]) completed++
      })
    }

    // Outcomes
    total += 3
    if (formValues.outcomes.treatmentGoalsAchieved) completed++
    if (formValues.outcomes.strengthsObserved) completed++
    if (formValues.outcomes.caregiverFeedback) completed++

    return total > 0 ? Math.round((completed / total) * 100) : 0
  }, [formValues, terminationType])

  const progress = calculateProgress()

  const handleExportPDF = useCallback(() => {
    // TODO: Implement PDF export
    alert('PDF export for Termination form coming soon!')
  }, [])

  const renderSection = () => {
    switch (currentSection) {
      case 'identification':
        return <IdentificationSection />
      case 'planned':
        return (
          <>
            <ChecklistSection
              sectionId="planned_preparation"
              title="Planned Termination: Preparation"
              description="Steps to prepare for planned termination with the family"
            />
            <div className="mt-8">
              <ChecklistSection
                sectionId="planned_process"
                title="Planned Termination: Goodbye Process"
                description="Steps for processing the goodbye and closure with the family"
              />
            </div>
          </>
        )
      case 'unplanned_reengagement':
        return (
          <ChecklistSection
            sectionId="unplanned_reengagement"
            title="Re-engagement Efforts"
            description="Steps taken to attempt re-engagement with families who disengaged"
          />
        )
      case 'unplanned_process':
        return (
          <ChecklistSection
            sectionId="unplanned_process"
            title="Closure Process"
            description="Steps for properly closing a case when re-engagement is unsuccessful"
          />
        )
      case 'reflection':
        return (
          <ChecklistSection
            sectionId="team_reflection"
            title="Team Reflection"
            description="Reflective practice around the termination process"
          />
        )
      case 'outcomes':
        return <OutcomesSection />
      case 'notes':
        return <NotesSection />
      default:
        return null
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        {/* Header */}
        <header className="sticky top-0 z-40 glass-header border-b border-white/20">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-lg hover:bg-white/50"
                aria-label="Back to form selection"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setNavOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/50"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">✅</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm font-semibold text-gray-900">
                    Termination Fidelity
                  </h1>
                  <p className="text-xs text-gray-500">
                    {formValues.identification.clientInitials || 'New Assessment'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Wellness Features */}
              <button
                onClick={() => setShowGrounding(true)}
                className="p-2 rounded-lg hover:bg-amber-50 text-amber-400 hover:text-amber-500 transition-all"
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
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm font-medium rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-colors shadow-lg"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2">
              <ProgressBar
                value={progress}
                size="sm"
                color={progress === 100 ? 'green' : 'yellow'}
              />
              <span className="text-xs text-gray-500 min-w-[3ch]">
                {progress}%
              </span>
            </div>
          </div>
        </header>

        <div className="lg:flex">
          {/* Mobile overlay */}
          {navOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setNavOpen(false)}
            />
          )}

          {/* Navigation sidebar */}
          <nav
            className={`
              fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-73px)] w-64 bg-white/80 backdrop-blur-sm border-r border-white/20
              transform transition-transform duration-200 ease-in-out z-50
              ${navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
              <span className="font-semibold text-gray-900">Sections</span>
              <button
                onClick={() => setNavOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Section list */}
            <div className="p-2 overflow-y-auto h-full">
              {visibleSections.map((section) => {
                const isActive = currentSection === section.id
                const Icon = section.icon

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setCurrentSection(section.id)
                      setNavOpen(false)
                    }}
                    className={`
                      w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg mb-1 transition-colors
                      ${isActive ? 'bg-yellow-100 text-yellow-800' : 'text-gray-700 hover:bg-white/80'}
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                )
              })}

              {/* Hint about termination type */}
              {!terminationType && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-700">
                    Select a termination type in the Identification section to see relevant checklists.
                  </p>
                </div>
              )}
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 min-h-[calc(100vh-73px)] p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              {renderSection()}
            </div>
          </main>
        </div>
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
