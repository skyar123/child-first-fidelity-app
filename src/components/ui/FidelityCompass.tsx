import { useState } from 'react'
import { X, Info } from 'lucide-react'

interface FidelityDimension {
  id: string
  name: string
  shortName: string
  color: string
  bgColor: string
  textColor: string
  questions: string[]
  score?: number // 0-100
}

const FIDELITY_DIMENSIONS: FidelityDimension[] = [
  {
    id: 'procedural',
    name: 'Procedural',
    shortName: 'PROC',
    color: '#64748b', // slate
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    questions: [
      'Did you follow the procedures for each phase?',
      'If not, what were the obstacles?',
      'How do procedural gaps affect your relationship with the family, case conceptualization and interventions?',
      'How might you address any procedural gaps?'
    ]
  },
  {
    id: 'reflective',
    name: 'Reflective Practice',
    shortName: 'REFL',
    color: '#15803d', // green-700
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    questions: [
      'How do you understand your emotional states and how they affect...',
      'How present you are?',
      'Your perceptions & perspective?',
      'Your interventions?',
      'Other aspects of fidelity?',
      'What do you need to feel integrated?'
    ]
  },
  {
    id: 'emotional',
    name: 'Emotional Process',
    shortName: 'EMOT',
    color: '#0d9488', // teal-600
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-700',
    questions: [
      'What are the emotional states of each family member?',
      'How are your interventions responsive to these emotional states?'
    ]
  },
  {
    id: 'dyadic',
    name: 'Dyadic Relational',
    shortName: 'DYAD',
    color: '#22c55e', // green-500
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    questions: [
      'Are you able to track both the caregiver\'s & child\'s emotional states & behaviors, or are you pulled towards one?',
      'Are you able to hold each family member\'s needs and history?',
      'Do your interventions build understanding and connection among family members?'
    ]
  },
  {
    id: 'trauma',
    name: 'Trauma Framework',
    shortName: 'TRAU',
    color: '#ea580c', // orange-600
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    questions: [
      'How do you integrate each family member\'s trauma history into your case conceptualization and interventions?',
      'How does their history affect...',
      'Their response to you and to treatment?',
      'Their relationship?',
      'Their emotions & behaviors (e.g., play)?'
    ]
  },
  {
    id: 'content',
    name: 'Content',
    shortName: 'CONT',
    color: '#ca8a04', // yellow-600
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    questions: [
      'Do you have a clear case formulation (triangles)?',
      'What are your primary treatment goals?',
      'How do these goals...',
      'Help you identify ports of entry?',
      'Shape your interventions?'
    ]
  }
]

interface FidelityCompassProps {
  onClose: () => void
  scores?: Record<string, number> // Optional scores for each dimension
}

export function FidelityCompass({ onClose, scores = {} }: FidelityCompassProps) {
  const [selectedDimension, setSelectedDimension] = useState<FidelityDimension | null>(null)
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null)

  const dimensions = FIDELITY_DIMENSIONS.map(d => ({
    ...d,
    score: scores[d.id] ?? 0
  }))

  // Calculate center point and radius
  const centerX = 150
  const centerY = 150
  const outerRadius = 120
  const innerRadius = 40

  // Generate pie slice paths
  const generateSlicePath = (index: number, total: number): string => {
    const startAngle = (index * 360 / total) - 90
    const endAngle = ((index + 1) * 360 / total) - 90
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = centerX + outerRadius * Math.cos(startRad)
    const y1 = centerY + outerRadius * Math.sin(startRad)
    const x2 = centerX + outerRadius * Math.cos(endRad)
    const y2 = centerY + outerRadius * Math.sin(endRad)
    const x3 = centerX + innerRadius * Math.cos(endRad)
    const y3 = centerY + innerRadius * Math.sin(endRad)
    const x4 = centerX + innerRadius * Math.cos(startRad)
    const y4 = centerY + innerRadius * Math.sin(startRad)

    const largeArc = 0

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`
  }

  // Calculate label position
  const getLabelPosition = (index: number, total: number) => {
    const angle = ((index + 0.5) * 360 / total) - 90
    const rad = (angle * Math.PI) / 180
    const labelRadius = (outerRadius + innerRadius) / 2 + 10
    return {
      x: centerX + labelRadius * Math.cos(rad),
      y: centerY + labelRadius * Math.sin(rad)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">CPP Fidelity Compass</h2>
            <p className="text-sm text-gray-500">Reflect on the 6 dimensions of fidelity</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Compass visualization */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <svg width="300" height="300" viewBox="0 0 300 300" className="drop-shadow-lg">
                {dimensions.map((dimension, index) => (
                  <g key={dimension.id}>
                    {/* Slice */}
                    <path
                      d={generateSlicePath(index, dimensions.length)}
                      fill={dimension.color}
                      stroke="white"
                      strokeWidth="2"
                      className={`cursor-pointer transition-all duration-200 ${
                        hoveredDimension === dimension.id ? 'opacity-80' : ''
                      } ${selectedDimension?.id === dimension.id ? 'opacity-100' : 'opacity-90'}`}
                      onMouseEnter={() => setHoveredDimension(dimension.id)}
                      onMouseLeave={() => setHoveredDimension(null)}
                      onClick={() => setSelectedDimension(dimension)}
                    />
                    {/* Label */}
                    <text
                      x={getLabelPosition(index, dimensions.length).x}
                      y={getLabelPosition(index, dimensions.length).y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {dimension.shortName}
                    </text>
                  </g>
                ))}
                {/* Center circle with heart */}
                <circle cx={centerX} cy={centerY} r={innerRadius - 5} fill="white" />
                <text
                  x={centerX}
                  y={centerY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="24"
                >
                  💚
                </text>
              </svg>

              <p className="text-sm text-gray-500 mt-4 text-center max-w-xs">
                Click on any dimension to see reflection questions
              </p>
            </div>

            {/* Dimension details */}
            <div className="flex-1 min-w-0">
              {selectedDimension ? (
                <div className={`rounded-xl p-6 ${selectedDimension.bgColor}`}>
                  <h3 className={`text-lg font-bold ${selectedDimension.textColor} mb-4`}>
                    {selectedDimension.name}
                  </h3>
                  <div className="space-y-3">
                    {selectedDimension.questions.map((question, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 ${
                          question.startsWith('•') || question.startsWith('How') && idx > 1
                            ? 'pl-4'
                            : ''
                        }`}
                      >
                        <span className={`${selectedDimension.textColor} mt-1`}>•</span>
                        <p className={`${selectedDimension.textColor} text-sm`}>{question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-6 bg-gray-50 text-center">
                  <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Select a dimension on the compass to see reflection questions
                  </p>
                </div>
              )}

              {/* Dimension buttons (alternative navigation) */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {dimensions.map(dimension => (
                  <button
                    key={dimension.id}
                    onClick={() => setSelectedDimension(dimension)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all text-left
                      ${selectedDimension?.id === dimension.id
                        ? `${dimension.bgColor} ${dimension.textColor} ring-2 ring-offset-1`
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }
                    `}
                    style={
                      selectedDimension?.id === dimension.id
                        ? { '--tw-ring-color': dimension.color } as React.CSSProperties
                        : undefined
                    }
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: dimension.color }}
                    />
                    {dimension.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Key principles reminder */}
          <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">Key Principle</h4>
            <p className="text-amber-700 italic">
              "All six dimensions are interconnected. Addressing trauma affects reflective practice,
              emotional process, and dyadic-relational fidelity. Use this compass to reflect on
              your practice as a whole."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for using the compass
export function useFidelityCompass() {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    CompassModal: isOpen ? <FidelityCompass onClose={() => setIsOpen(false)} /> : null
  }
}
