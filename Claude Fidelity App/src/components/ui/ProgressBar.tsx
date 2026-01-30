interface ProgressBarProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function ProgressBar({
  value,
  size = 'md',
  showLabel = true,
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  const getColor = (val: number): string => {
    if (val === 0) return 'bg-gray-300'
    if (val < 50) return 'bg-yellow-400'
    if (val < 100) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${getColor(clampedValue)} ${heights[size]} rounded-full transition-all duration-300`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-500 min-w-[2.5rem] text-right">
          {clampedValue}%
        </span>
      )}
    </div>
  )
}

// Circular progress variant
interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  className?: string
}

export function CircularProgress({
  value,
  size = 48,
  strokeWidth = 4,
  showLabel = true,
  className = '',
}: CircularProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (clampedValue / 100) * circumference

  const getColor = (val: number): string => {
    if (val === 0) return 'stroke-gray-300'
    if (val < 50) return 'stroke-yellow-400'
    if (val < 100) return 'stroke-blue-500'
    return 'stroke-green-500'
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${getColor(clampedValue)} transition-all duration-300`}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-xs font-medium text-gray-700">
          {clampedValue}%
        </span>
      )}
    </div>
  )
}
