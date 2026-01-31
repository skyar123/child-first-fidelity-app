import { useState, useEffect, useCallback } from 'react'
import { Heart, Wind, Eye, Pause, Play, X, RefreshCw, Sparkles, Brain, Timer } from 'lucide-react'

type ExerciseType = 'breathing' | 'grounding' | 'quick-reset'

interface GroundingExerciseProps {
  onClose: () => void
  initialExercise?: ExerciseType
}

const WISDOM_QUOTES = [
  {
    quote: "When affect is strong, the first to regulate is your own.",
    source: "Child First Fidelity Principle"
  },
  {
    quote: "Engage your frontal lobes before intervening.",
    source: "Reflective Practice"
  },
  {
    quote: "It's difficult to think clearly when you are triggered.",
    source: "Child First Fidelity Principle"
  },
  {
    quote: "Try to understand the needs underlying dysregulated behavior.",
    source: "Trauma Framework"
  },
  {
    quote: "Do not target for change what you do not yet understand.",
    source: "Reflective Practice"
  },
  {
    quote: "You do not have to agree with a belief, value, or behavior to have an empathic understanding of its emotional meaning.",
    source: "Child First Fidelity Principle"
  },
  {
    quote: "Balance acceptance with change.",
    source: "Linehan, via Child First"
  },
  {
    quote: "Development occurs in the context of relationships.",
    source: "Dyadic Relational Fidelity"
  },
  {
    quote: "The best predictor of child functioning is caregiver functioning.",
    source: "Child First Principle"
  },
  {
    quote: "A primary objective of treatment is to restore the protective shield.",
    source: "Dyadic Relational Fidelity"
  },
  {
    quote: "Trauma involves an overwhelming and terrifying loss of control.",
    source: "Perry, via Child First"
  },
  {
    quote: "Neurobiological regulation is central to processing and making meaning.",
    source: "Emotional Process Fidelity"
  }
]

export function GroundingExercise({ onClose, initialExercise = 'breathing' }: GroundingExerciseProps) {
  const [exerciseType, setExerciseType] = useState<ExerciseType>(initialExercise)
  const [isActive, setIsActive] = useState(false)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale')
  const [breathCount, setBreathCount] = useState(0)
  const [, setTimer] = useState(0)
  const [groundingStep, setGroundingStep] = useState(0)
  const [currentQuote] = useState(() =>
    WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)]
  )
  const [showComplete, setShowComplete] = useState(false)

  // 4-7-8 breathing pattern
  const BREATH_PATTERN = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 1
  }

  // 5-4-3-2-1 grounding steps
  const GROUNDING_STEPS = [
    { count: 5, sense: 'SEE', prompt: 'Name 5 things you can see around you' },
    { count: 4, sense: 'TOUCH', prompt: 'Name 4 things you can physically feel' },
    { count: 3, sense: 'HEAR', prompt: 'Name 3 things you can hear right now' },
    { count: 2, sense: 'SMELL', prompt: 'Name 2 things you can smell' },
    { count: 1, sense: 'TASTE', prompt: 'Name 1 thing you can taste' },
  ]

  // Breathing exercise logic
  useEffect(() => {
    if (!isActive || exerciseType !== 'breathing') return

    const interval = setInterval(() => {
      setTimer(prev => {
        const newTimer = prev + 1
        const totalCycle = BREATH_PATTERN.inhale + BREATH_PATTERN.hold + BREATH_PATTERN.exhale + BREATH_PATTERN.rest
        const position = newTimer % totalCycle

        if (position < BREATH_PATTERN.inhale) {
          setBreathPhase('inhale')
        } else if (position < BREATH_PATTERN.inhale + BREATH_PATTERN.hold) {
          setBreathPhase('hold')
        } else if (position < BREATH_PATTERN.inhale + BREATH_PATTERN.hold + BREATH_PATTERN.exhale) {
          setBreathPhase('exhale')
        } else {
          setBreathPhase('rest')
        }

        // Count completed breaths
        if (position === 0 && newTimer > 0) {
          setBreathCount(c => c + 1)
        }

        // Complete after 3 full breath cycles
        if (breathCount >= 3) {
          setIsActive(false)
          setShowComplete(true)
        }

        return newTimer
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, exerciseType, breathCount])

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe in slowly...'
      case 'hold': return 'Hold gently...'
      case 'exhale': return 'Release slowly...'
      case 'rest': return 'Rest...'
    }
  }

  const getBreathScale = () => {
    switch (breathPhase) {
      case 'inhale': return 'scale-110'
      case 'hold': return 'scale-110'
      case 'exhale': return 'scale-90'
      case 'rest': return 'scale-100'
    }
  }

  const handleNextGroundingStep = useCallback(() => {
    if (groundingStep < GROUNDING_STEPS.length - 1) {
      setGroundingStep(prev => prev + 1)
    } else {
      setShowComplete(true)
    }
  }, [groundingStep])

  const handleReset = () => {
    setIsActive(false)
    setBreathPhase('inhale')
    setBreathCount(0)
    setTimer(0)
    setGroundingStep(0)
    setShowComplete(false)
  }

  const renderBreathingExercise = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-8">
      {/* Breathing circle */}
      <div className="relative">
        <div
          className={`
            w-48 h-48 rounded-full flex items-center justify-center
            bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500
            shadow-2xl shadow-blue-500/30
            transition-all duration-1000 ease-in-out
            ${getBreathScale()}
          `}
        >
          <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Wind className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Phase indicator ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse" />
      </div>

      {/* Instructions */}
      <div className="text-center space-y-2">
        <p className="text-2xl font-light text-gray-700">{getBreathInstruction()}</p>
        <p className="text-sm text-gray-500">4-7-8 breathing pattern</p>
      </div>

      {/* Breath counter */}
      <div className="flex items-center gap-4">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={`
              w-4 h-4 rounded-full transition-all duration-300
              ${breathCount >= i
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 scale-110'
                : 'bg-gray-200'
              }
            `}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
            ${isActive
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  const renderGroundingExercise = () => {
    const step = GROUNDING_STEPS[groundingStep]
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {GROUNDING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                ${i === groundingStep
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white scale-110 shadow-lg'
                  : i < groundingStep
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }
              `}
            >
              {GROUNDING_STEPS[i].count}
            </div>
          ))}
        </div>

        {/* Current step */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <Eye className="w-12 h-12 text-indigo-500" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold gradient-text">{step.sense}</p>
            <p className="text-lg text-gray-600">{step.prompt}</p>
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={handleNextGroundingStep}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500
                   text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all
                   hover:-translate-y-0.5"
        >
          {groundingStep < GROUNDING_STEPS.length - 1 ? 'Next' : 'Complete'}
        </button>
      </div>
    )
  }

  const renderQuickReset = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-8">
      {/* Quick reset steps */}
      <div className="w-full max-w-md space-y-4">
        <QuickResetStep
          number={1}
          title="Pause"
          description="Stop what you're doing. Notice you are feeling something."
          icon={<Pause className="w-6 h-6" />}
        />
        <QuickResetStep
          number={2}
          title="Breathe"
          description="Take 3 deep breaths. In through nose, out through mouth."
          icon={<Wind className="w-6 h-6" />}
        />
        <QuickResetStep
          number={3}
          title="Notice"
          description="What am I feeling? Where do I feel it in my body?"
          icon={<Heart className="w-6 h-6" />}
        />
        <QuickResetStep
          number={4}
          title="Engage"
          description="Now I can engage my frontal lobes and think clearly."
          icon={<Brain className="w-6 h-6" />}
        />
      </div>

      <button
        onClick={() => setShowComplete(true)}
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500
                 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all
                 hover:-translate-y-0.5"
      >
        <Sparkles className="w-5 h-5" />
        I'm Ready
      </button>
    </div>
  )

  const renderComplete = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500
                    flex items-center justify-center shadow-xl shadow-green-500/30">
        <Sparkles className="w-12 h-12 text-white" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-2xl font-bold text-gray-800">You're centered and ready</p>
        <p className="text-gray-600">Take this grounded presence into your session</p>
      </div>

      {/* Wisdom quote */}
      <div className="max-w-md p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
        <p className="text-lg text-amber-900 italic mb-2">"{currentQuote.quote}"</p>
        <p className="text-sm text-amber-700">— {currentQuote.source}</p>
      </div>

      <button
        onClick={onClose}
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500
                 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all
                 hover:-translate-y-0.5"
      >
        Continue to Form
      </button>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-auto">
      {/* Header */}
      <div className="glass-header border-b border-white/20 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/30">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Regulate First</h2>
              <p className="text-xs text-gray-500">Ground yourself before the session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/50 text-gray-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Exercise type tabs */}
      {!showComplete && (
        <div className="px-4 py-4 border-b border-white/20">
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <ExerciseTab
              active={exerciseType === 'breathing'}
              onClick={() => { setExerciseType('breathing'); handleReset(); }}
              icon={<Wind className="w-4 h-4" />}
              label="4-7-8 Breathing"
            />
            <ExerciseTab
              active={exerciseType === 'grounding'}
              onClick={() => { setExerciseType('grounding'); handleReset(); }}
              icon={<Eye className="w-4 h-4" />}
              label="5-4-3-2-1 Grounding"
            />
            <ExerciseTab
              active={exerciseType === 'quick-reset'}
              onClick={() => { setExerciseType('quick-reset'); handleReset(); }}
              icon={<Timer className="w-4 h-4" />}
              label="Quick Reset"
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4">
        {showComplete ? (
          renderComplete()
        ) : (
          <>
            {exerciseType === 'breathing' && renderBreathingExercise()}
            {exerciseType === 'grounding' && renderGroundingExercise()}
            {exerciseType === 'quick-reset' && renderQuickReset()}
          </>
        )}
      </div>
    </div>
  )
}

// Helper components
function ExerciseTab({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
        ${active
          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
          : 'bg-white/80 text-gray-600 hover:bg-white'
        }
      `}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function QuickResetStep({ number, title, description, icon }: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white/80 rounded-xl border border-gray-100">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100
                    flex items-center justify-center text-cyan-600 flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">
            Step {number}
          </span>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  )
}

// Hook for grounding exercise
export function useGroundingExercise() {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    GroundingModal: isOpen ? (
      <GroundingExercise onClose={() => setIsOpen(false)} />
    ) : null
  }
}
