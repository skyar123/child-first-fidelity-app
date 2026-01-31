import { useState, useCallback, useEffect, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Focus, Grid3X3, CheckCircle2 } from 'lucide-react'

interface FocusModeItem {
  id: string
  content: ReactNode
  isComplete?: boolean
  label?: string
}

interface FocusModeProps {
  items: FocusModeItem[]
  title?: string
  onItemChange?: (index: number) => void
  initialIndex?: number
}

export function FocusMode({ 
  items, 
  title = 'Focus Mode',
  onItemChange,
  initialIndex = 0 
}: FocusModeProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const currentItem = items[currentIndex]
  const progress = Math.round(((currentIndex + 1) / items.length) * 100)
  const completedCount = items.filter(item => item.isComplete).length

  const goToNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setDirection('right')
      setCurrentIndex(prev => prev + 1)
      onItemChange?.(currentIndex + 1)
    }
  }, [currentIndex, items.length, onItemChange])

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection('left')
      setCurrentIndex(prev => prev - 1)
      onItemChange?.(currentIndex - 1)
    }
  }, [currentIndex, onItemChange])

  const goToIndex = useCallback((index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left')
    setCurrentIndex(index)
    onItemChange?.(index)
  }, [currentIndex, onItemChange])

  // Keyboard navigation
  useEffect(() => {
    if (!isFocusMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goToPrev()
      } else if (e.key === 'Escape') {
        setIsFocusMode(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocusMode, goToNext, goToPrev])

  // Check for completion celebration
  useEffect(() => {
    if (currentItem?.isComplete && isFocusMode) {
      // Small delay before auto-advancing
      const timer = setTimeout(() => {
        if (currentIndex < items.length - 1) {
          goToNext()
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentItem?.isComplete])

  if (!isFocusMode) {
    return (
      <div className="space-y-4">
        {/* Focus Mode Toggle Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{completedCount} of {items.length} complete</span>
          </div>
          <button
            onClick={() => setIsFocusMode(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                     bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                     rounded-xl hover:from-indigo-600 hover:to-purple-600
                     transition-all shadow-lg shadow-indigo-500/30
                     hover:shadow-indigo-500/50 hover:-translate-y-0.5"
          >
            <Focus className="w-4 h-4" />
            Focus Mode
          </button>
        </div>

        {/* Regular grid view */}
        <div className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.id}
              className={`transition-all ${item.isComplete ? 'opacity-60' : ''}`}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Header */}
      <div className="glass-header border-b border-white/20 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/30">
              <Focus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{title}</h2>
              <p className="text-xs text-gray-500">
                Item {currentIndex + 1} of {items.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFocusMode(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                     bg-white/80 text-gray-700 rounded-xl hover:bg-white
                     transition-all border border-gray-200"
          >
            <Grid3X3 className="w-4 h-4" />
            Exit Focus
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 glass-header border-b border-white/20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Item dots navigation */}
      <div className="px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-1.5 flex-wrap">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToIndex(index)}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all
                ${index === currentIndex 
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

      {/* Main content area */}
      <div className="flex-1 overflow-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
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
        </div>
      </div>

      {/* Navigation footer */}
      <div className="glass-header border-t border-white/20 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all
              ${currentIndex === 0
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
              Use <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">←</kbd> <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">→</kbd> to navigate
            </p>
          </div>

          <button
            onClick={goToNext}
            disabled={currentIndex === items.length - 1}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all
              ${currentIndex === items.length - 1
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

// Simpler Focus Mode wrapper for any section
interface FocusModeToggleProps {
  children: ReactNode
  enabled: boolean
  onToggle: () => void
}

export function FocusModeToggle({ children, enabled, onToggle }: FocusModeToggleProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`
          mb-4 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all
          ${enabled
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
            : 'bg-white/80 text-gray-600 hover:bg-white border border-gray-200'
          }
        `}
      >
        <Focus className="w-4 h-4" />
        {enabled ? 'Exit Focus Mode' : 'Focus Mode'}
      </button>
      {children}
    </div>
  )
}
