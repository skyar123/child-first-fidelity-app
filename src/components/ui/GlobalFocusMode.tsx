import { useState, useCallback, useEffect, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Focus, X, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'

export interface FocusModeItem {
  id: string
  content: ReactNode
  isComplete?: boolean
  label?: string
  sectionName?: string
}

export interface FocusModeSection {
  id: string
  name: string
  items: FocusModeItem[]
}

interface GlobalFocusModeProps {
  isOpen: boolean
  onClose: () => void
  sections: FocusModeSection[]
  currentSectionId?: string
  title?: string
  onSectionChange?: (sectionId: string) => void
}

export function GlobalFocusMode({
  isOpen,
  onClose,
  sections,
  currentSectionId,
  title = 'Focus Mode',
  onSectionChange
}: GlobalFocusModeProps) {
  const [activeSectionId, setActiveSectionId] = useState(currentSectionId || sections[0]?.id || '')
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [showSectionPicker, setShowSectionPicker] = useState(false)

  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0]
  const items = activeSection?.items || []
  const currentItem = items[currentItemIndex]
  const progress = items.length > 0 ? Math.round(((currentItemIndex + 1) / items.length) * 100) : 0
  const completedCount = items.filter(item => item.isComplete).length

  // Sync with external section changes
  useEffect(() => {
    if (currentSectionId && currentSectionId !== activeSectionId) {
      setActiveSectionId(currentSectionId)
      setCurrentItemIndex(0)
    }
  }, [currentSectionId])

  const goToNext = useCallback(() => {
    if (currentItemIndex < items.length - 1) {
      setDirection('right')
      setCurrentItemIndex(prev => prev + 1)
    } else {
      // Move to next section
      const currentSectionIndex = sections.findIndex(s => s.id === activeSectionId)
      if (currentSectionIndex < sections.length - 1) {
        const nextSection = sections[currentSectionIndex + 1]
        setActiveSectionId(nextSection.id)
        setCurrentItemIndex(0)
        onSectionChange?.(nextSection.id)
      }
    }
  }, [currentItemIndex, items.length, sections, activeSectionId, onSectionChange])

  const goToPrev = useCallback(() => {
    if (currentItemIndex > 0) {
      setDirection('left')
      setCurrentItemIndex(prev => prev - 1)
    } else {
      // Move to previous section
      const currentSectionIndex = sections.findIndex(s => s.id === activeSectionId)
      if (currentSectionIndex > 0) {
        const prevSection = sections[currentSectionIndex - 1]
        setActiveSectionId(prevSection.id)
        setCurrentItemIndex(prevSection.items.length - 1)
        onSectionChange?.(prevSection.id)
      }
    }
  }, [currentItemIndex, sections, activeSectionId, onSectionChange])

  const goToIndex = useCallback((index: number) => {
    setDirection(index > currentItemIndex ? 'right' : 'left')
    setCurrentItemIndex(index)
  }, [currentItemIndex])

  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId)
    setCurrentItemIndex(0)
    setShowSectionPicker(false)
    onSectionChange?.(sectionId)
  }, [onSectionChange])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goToPrev()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, goToNext, goToPrev, onClose])

  // Auto-advance on completion
  useEffect(() => {
    if (currentItem?.isComplete && isOpen) {
      const timer = setTimeout(() => {
        if (currentItemIndex < items.length - 1) {
          goToNext()
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentItem?.isComplete, isOpen])

  if (!isOpen) return null

  // Calculate overall progress across all sections
  const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0)
  const totalCompleted = sections.reduce((acc, s) => acc + s.items.filter(i => i.isComplete).length, 0)
  const overallProgress = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Header */}
      <div className="glass-header border-b border-white/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/30">
              <Focus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{title}</h2>
              <p className="text-xs text-gray-500">
                {completedCount} of {items.length} complete in this section
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                     bg-white/80 text-gray-700 rounded-xl hover:bg-white
                     transition-all border border-gray-200"
          >
            <X className="w-4 h-4" />
            Exit Focus
          </button>
        </div>
      </div>

      {/* Section Picker */}
      <div className="px-4 py-2 glass-header border-b border-white/20">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowSectionPicker(!showSectionPicker)}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl border border-gray-200 hover:bg-white transition-all w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Section: {activeSection?.name || 'Select section'}
              </span>
              <span className="text-xs text-gray-500">
                ({currentItemIndex + 1}/{items.length})
              </span>
            </div>
            {showSectionPicker ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {showSectionPicker && (
            <div className="mt-2 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              {sections.map((section) => {
                const sectionCompleted = section.items.filter(i => i.isComplete).length
                const isActive = section.id === activeSectionId
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{section.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      sectionCompleted === section.items.length && section.items.length > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {sectionCompleted}/{section.items.length}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 glass-header border-b border-white/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">{progress}%</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">Section progress</span>
            <span className="text-xs text-gray-500">Overall: {overallProgress}%</span>
          </div>
        </div>
      </div>

      {/* Item dots navigation */}
      {items.length <= 20 && (
        <div className="px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-1.5 flex-wrap">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => goToIndex(index)}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all
                  ${index === currentItemIndex
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg scale-110'
                    : item.isComplete
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-white/80 text-gray-400 hover:bg-white hover:text-gray-600'
                  }
                `}
                title={item.label || `Item ${index + 1}`}
              >
                {item.isComplete ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 overflow-auto px-4 py-6" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        <div className="max-w-4xl mx-auto">
          {items.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-gray-500">No items in this section</p>
              <p className="text-sm text-gray-400 mt-2">Select another section or add items to continue</p>
            </div>
          ) : (
            <div
              className={`
                glass-card rounded-2xl p-6 transition-all duration-300
                ${direction === 'right' ? 'animate-slide-in-right' : ''}
                ${direction === 'left' ? 'animate-slide-in-left' : ''}
              `}
              onAnimationEnd={() => setDirection(null)}
            >
              {/* Item label */}
              {currentItem?.label && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg">
                    {currentItem.label}
                  </span>
                  {currentItem.sectionName && (
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      {currentItem.sectionName}
                    </span>
                  )}
                  {currentItem.isComplete && (
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Complete
                    </span>
                  )}
                </div>
              )}

              {/* Item content */}
              {currentItem?.content}
            </div>
          )}
        </div>
      </div>

      {/* Navigation footer */}
      <div className="glass-header border-t border-white/20 px-4 py-4 absolute bottom-0 left-0 right-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={goToPrev}
            disabled={currentItemIndex === 0 && sections.findIndex(s => s.id === activeSectionId) === 0}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all
              ${currentItemIndex === 0 && sections.findIndex(s => s.id === activeSectionId) === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:-translate-x-1'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Use <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Arrow keys</kbd> to navigate
            </p>
          </div>

          <button
            onClick={goToNext}
            disabled={currentItemIndex === items.length - 1 && sections.findIndex(s => s.id === activeSectionId) === sections.length - 1}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all
              ${currentItemIndex === items.length - 1 && sections.findIndex(s => s.id === activeSectionId) === sections.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:translate-x-1'
              }
            `}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
