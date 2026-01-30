import { useFormContext, Controller } from 'react-hook-form'

type ScaleType = 'challenge' | 'capacity' | 'clinical' | 'procedural'

interface ScaleConfig {
  points: number
  labels: string[]
  colors: string[]
  selectedColors: string[]
}

const SCALE_CONFIGS: Record<ScaleType, ScaleConfig> = {
  challenge: {
    points: 4,
    labels: ['None', 'Low', 'Moderate', 'Significant'],
    colors: ['bg-green-50', 'bg-yellow-50', 'bg-orange-50', 'bg-red-50'],
    selectedColors: [
      'bg-green-100 border-green-500 ring-green-200',
      'bg-yellow-100 border-yellow-500 ring-yellow-200',
      'bg-orange-100 border-orange-500 ring-orange-200',
      'bg-red-100 border-red-500 ring-red-200',
    ],
  },
  capacity: {
    points: 3,
    labels: ['Requires Development', 'Emerging', 'Acquired'],
    colors: ['bg-red-50', 'bg-yellow-50', 'bg-green-50'],
    selectedColors: [
      'bg-red-100 border-red-500 ring-red-200',
      'bg-yellow-100 border-yellow-500 ring-yellow-200',
      'bg-green-100 border-green-500 ring-green-200',
    ],
  },
  clinical: {
    points: 4,
    labels: ['0', '1', '2', '3'],
    colors: ['bg-gray-50', 'bg-blue-50', 'bg-blue-100', 'bg-blue-200'],
    selectedColors: [
      'bg-gray-100 border-gray-500 ring-gray-200',
      'bg-blue-100 border-blue-400 ring-blue-200',
      'bg-blue-200 border-blue-500 ring-blue-200',
      'bg-blue-300 border-blue-600 ring-blue-200',
    ],
  },
  procedural: {
    points: 3,
    labels: ['No', 'Yes (Not Regular)', 'Yes (Attended)'],
    colors: ['bg-red-50', 'bg-yellow-50', 'bg-green-50'],
    selectedColors: [
      'bg-red-100 border-red-500 ring-red-200',
      'bg-yellow-100 border-yellow-500 ring-yellow-200',
      'bg-green-100 border-green-500 ring-green-200',
    ],
  },
}

interface RatingScaleProps {
  name: string
  label: string
  description?: string
  scaleType?: ScaleType
  disabled?: boolean
  className?: string
  showLabels?: boolean
}

export function RatingScale({
  name,
  label,
  description,
  scaleType = 'challenge',
  disabled = false,
  className = '',
  showLabels = true,
}: RatingScaleProps) {
  const { control } = useFormContext()
  const config = SCALE_CONFIGS[scaleType]

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-900">{label}</p>
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
          </div>

          <div className="flex gap-2">
            {Array.from({ length: config.points }, (_, i) => {
              const isSelected = field.value === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => field.onChange(i)}
                  disabled={disabled}
                  className={`
                    flex-1 py-2 px-1 rounded-lg border-2 text-center text-sm font-medium
                    transition-all duration-150
                    ${disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:shadow-sm'
                    }
                    ${isSelected
                      ? `${config.selectedColors[i]} ring-2`
                      : `${config.colors[i]} border-transparent hover:border-gray-300`
                    }
                  `}
                  aria-pressed={isSelected}
                >
                  {showLabels ? (
                    <span className="block text-xs leading-tight">
                      {config.labels[i]}
                    </span>
                  ) : (
                    i
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    />
  )
}

// Simplified inline rating for tables
interface InlineRatingProps {
  name: string
  scaleType?: ScaleType
  disabled?: boolean
}

export function InlineRating({
  name,
  scaleType = 'challenge',
  disabled = false,
}: InlineRatingProps) {
  const { control } = useFormContext()
  const config = SCALE_CONFIGS[scaleType]

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex gap-1">
          {Array.from({ length: config.points }, (_, i) => {
            const isSelected = field.value === i
            return (
              <button
                key={i}
                type="button"
                onClick={() => field.onChange(i)}
                disabled={disabled}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  transition-all duration-150
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${isSelected
                    ? `${config.selectedColors[i]} ring-2`
                    : 'bg-gray-100 hover:bg-gray-200'
                  }
                `}
                aria-pressed={isSelected}
                title={config.labels[i]}
              >
                {i}
              </button>
            )
          })}
        </div>
      )}
    />
  )
}
