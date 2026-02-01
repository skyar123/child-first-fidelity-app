import { useState, useCallback } from 'react'
import { ArrowLeft, Menu, Download, X, Building2, Sparkles, Heart, Compass, PenLine } from 'lucide-react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { TextField } from '@/components/ui'
import { GroundingExercise } from '@/components/ui/GroundingExercise'
import { FidelityCompass } from '@/components/ui/FidelityCompass'
import { ReflectiveJournal } from '@/components/ui/ReflectiveJournal'
import { getProgressMessage } from '@/utils/celebrations'
import {
  programFidelitySections,
  getSectionProgress,
  calculateProgramFidelityProgress,
  type ProgramFidelityItem,
  type FidelityRating,
} from '@/data/programFidelityItems'
import { generateProgramFidelityPDF } from '@/utils/pdfExportProgramFidelity'

// Form data types for standalone Program Fidelity form
interface PFFormData {
  identification: {
    affiliateSiteName: string
    dateCompleted: string
  }
  ratings: Record<string, FidelityRating>
  comments: Record<string, string>
}

type SectionId = 'identification' | string

interface Section {
  id: SectionId
  label: string
  number?: number
}

// Build sections from data
const navSections: Section[] = [
  { id: 'identification', label: 'Site Information' },
  ...programFidelitySections.map(s => ({
    id: s.id,
    label: s.title,
    number: s.number
  }))
]

const RATING_OPTIONS: { value: FidelityRating; label: string; color: string }[] = [
  { value: 0, label: '0', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 1, label: '1', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { value: 2, label: '2', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 3, label: '3', color: 'bg-green-100 text-green-700 border-green-300' },
]

const RATING_LABELS: Record<number, string> = {
  0: 'Not present',
  1: 'Early development or a little progress',
  2: 'In place or good progress',
  3: 'Excellent progress or accomplished',
}

interface ProgramFidelityAppShellProps {
  onBack: () => void
}

function createDefaultFormData(): PFFormData {
  return {
    identification: {
      affiliateSiteName: '',
      dateCompleted: new Date().toISOString().split('T')[0],
    },
    ratings: {},
    comments: {}
  }
}

export function ProgramFidelityAppShell({ onBack }: ProgramFidelityAppShellProps) {
  const [currentSection, setCurrentSection] = useState<SectionId>('identification')
  const [navOpen, setNavOpen] = useState(false)
  const [showGrounding, setShowGrounding] = useState(false)
  const [showCompass, setShowCompass] = useState(false)
  const [showJournal, setShowJournal] = useState(false)

  const methods = useForm<PFFormData>({
    defaultValues: createDefaultFormData(),
    mode: 'onChange'
  })

  const { watch, control } = methods
  const formValues = watch()

  // Calculate progress
  const progress = calculateProgramFidelityProgress(formValues.ratings || {})

  const handleExportPDF = useCallback(() => {
    const data = methods.getValues()
    generateProgramFidelityPDF(data)
  }, [methods])

  const renderContent = () => {
    if (currentSection === 'identification') {
      return (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl shadow-lg shadow-violet-500/25">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Child First Program Fidelity Checklist
                </h2>
                <p className="text-sm text-gray-500">Revised October 2019</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="identification.affiliateSiteName"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Name of Affiliate Site"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter affiliate site name"
                  />
                )}
              />
              <Controller
                name="identification.dateCompleted"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Date Completed"
                    type="date"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="glass-card-gradient rounded-2xl p-4">
            <p className="text-sm text-violet-800">
              <strong>Instructions:</strong> This self-assessment should be completed by the Clinical
              Director/Supervisor in collaboration with Clinical Teams. Complete at 3 months post
              implementation, at 6 months, and every 6 months thereafter.
            </p>
          </div>

          {/* Rating Scale Legend */}
          <div className="glass-card rounded-2xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Rating Scale:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {RATING_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center gap-2 p-2 rounded-lg bg-white/50">
                  <span className={`px-2.5 py-1 rounded-lg text-sm font-bold ${option.color}`}>
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-600">
                    {RATING_LABELS[option.value!]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    // Find the section data
    const sectionData = programFidelitySections.find(s => s.id === currentSection)
    if (!sectionData) return null

    const { completed, total } = getSectionProgress(currentSection, formValues.ratings || {})

    return (
      <div className="space-y-4">
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-b border-white/20 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {sectionData.number}. {sectionData.title}
            </h3>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              completed === total && total > 0
                ? 'bg-green-100 text-green-700'
                : completed > 0
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-gray-100 text-gray-600'
            }`}>
              {completed}/{total} rated
            </span>
          </div>
          <div className="p-4 space-y-3">
            {sectionData.items.map((item) => (
              <PFItemRow key={item.id} item={item} control={control} formValues={formValues} />
            ))}
          </div>
        </div>
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
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 float-animation">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold gradient-text truncate max-w-[200px]">
                      {formValues.identification.affiliateSiteName || 'Program Fidelity'}
                    </h1>
                    {progress === 100 && (
                      <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-medium">
                        Complete!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Program Fidelity Checklist
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Wellness Tools */}
              <button
                onClick={() => setShowGrounding(true)}
                className="p-2.5 rounded-xl hover:bg-cyan-50 text-cyan-500 hover:text-cyan-600 transition-all"
                aria-label="Regulate First - Grounding Exercise"
                title="Regulate First"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowCompass(true)}
                className="p-2.5 rounded-xl hover:bg-green-50 text-green-500 hover:text-green-600 transition-all"
                aria-label="Fidelity Compass"
                title="Fidelity Compass"
              >
                <Compass className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowJournal(true)}
                className="p-2.5 rounded-xl hover:bg-purple-50 text-purple-500 hover:text-purple-600 transition-all"
                aria-label="Reflective Practice Journal"
                title="Reflective Journal"
              >
                <PenLine className="w-5 h-5" />
              </button>
              <span className="w-px h-6 bg-gray-200 mx-1" />
              <button
                onClick={handleExportPDF}
                className="hidden sm:flex items-center gap-2 px-4 py-2 ml-2
                         bg-gradient-to-r from-violet-500 to-purple-500
                         text-white text-sm font-semibold rounded-xl
                         hover:from-violet-600 hover:to-purple-600
                         transition-all shadow-lg shadow-purple-500/30
                         hover:shadow-purple-500/50 hover:-translate-y-0.5"
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
                      : 'bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-500'
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
              {navSections.map((section) => {
                const isActive = currentSection === section.id
                const sectionProgress = section.id !== 'identification'
                  ? getSectionProgress(section.id, formValues.ratings || {})
                  : null

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setCurrentSection(section.id)
                      setNavOpen(false)
                    }}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl mb-2 transition-all
                      ${isActive
                        ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-700 shadow-lg shadow-violet-500/10'
                        : 'text-gray-600 hover:bg-white/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {section.number ? `${section.number}. ` : ''}{section.label}
                      </span>
                      {sectionProgress && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          sectionProgress.completed === sectionProgress.total && sectionProgress.total > 0
                            ? 'bg-green-100 text-green-700'
                            : sectionProgress.completed > 0
                              ? 'bg-violet-100 text-violet-700'
                              : 'bg-gray-100 text-gray-500'
                        }`}>
                          {sectionProgress.completed}/{sectionProgress.total}
                        </span>
                      )}
                    </div>
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
    </FormProvider>
  )
}

// Item Row Component
function PFItemRow({
  item,
  control,
  formValues,
}: {
  item: ProgramFidelityItem
  control: ReturnType<typeof useForm<PFFormData>>['control']
  formValues: PFFormData
}) {
  // Sub-items are displayed as bullet points without ratings
  if (item.isSubItem) {
    return (
      <div className="ml-6 flex items-start gap-2 py-1">
        <span className="text-violet-400 mt-0.5">○</span>
        <span className="text-sm text-gray-700">{item.text}</span>
      </div>
    )
  }

  const currentRating = formValues.ratings?.[item.id]

  return (
    <div className="glass-item rounded-xl p-4 space-y-3">
      {/* Item Text */}
      <div className="text-sm text-gray-900">{item.text}</div>

      {/* Rating Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 mr-2">Rating:</span>
        <Controller
          name={`ratings.${item.id}` as `ratings.${string}`}
          control={control}
          render={({ field }) => (
            <div className="flex gap-1">
              {RATING_OPTIONS.map((option) => {
                const isSelected = field.value === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(isSelected ? null : option.value)}
                    className={`
                      w-9 h-9 rounded-xl border-2 text-sm font-bold transition-all
                      ${isSelected
                        ? option.color + ' border-current shadow-md'
                        : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                      }
                    `}
                    title={RATING_LABELS[option.value!]}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          )}
        />
        {currentRating !== null && currentRating !== undefined && (
          <span className="text-xs text-gray-500 ml-2">
            ({RATING_LABELS[currentRating]})
          </span>
        )}
      </div>

      {/* Comment Field */}
      <Controller
        name={`comments.${item.id}` as `comments.${string}`}
        control={control}
        render={({ field }) => (
          <textarea
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder="Add comments (optional)..."
            rows={2}
            className="w-full px-3 py-2 text-sm bg-white/60 border border-white/50 rounded-xl
                     focus:ring-2 focus:ring-violet-500 focus:border-violet-500
                     placeholder:text-gray-400 resize-none backdrop-blur"
          />
        )}
      />
    </div>
  )
}
