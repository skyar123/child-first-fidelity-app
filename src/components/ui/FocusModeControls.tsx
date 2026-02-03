import { type ReactNode } from 'react'

// Generic rating button options
export interface RatingOption {
  value: string | number | null
  label: string
  color: string
  activeColor: string
}

// Challenge level options (for Foundational form) - 0-3 scale
export const CHALLENGE_OPTIONS: RatingOption[] = [
  { value: null, label: 'Not Rated', color: 'bg-gray-100 text-gray-500 border-gray-200', activeColor: 'bg-gray-200 text-gray-700 border-gray-400' },
  { value: 0, label: '0 - No Challenge', color: 'bg-green-50 text-green-600 border-green-200', activeColor: 'bg-green-500 text-white border-green-600' },
  { value: 1, label: '1 - Low Challenge', color: 'bg-yellow-50 text-yellow-600 border-yellow-200', activeColor: 'bg-yellow-500 text-white border-yellow-600' },
  { value: 2, label: '2 - Moderate Challenge', color: 'bg-orange-50 text-orange-600 border-orange-200', activeColor: 'bg-orange-500 text-white border-orange-600' },
  { value: 3, label: '3 - Significant Challenge', color: 'bg-red-50 text-red-600 border-red-200', activeColor: 'bg-red-500 text-white border-red-600' },
]

// Capacity level options (for Foundational form) - 0-2 scale
export const CAPACITY_OPTIONS: RatingOption[] = [
  { value: null, label: 'Not Rated', color: 'bg-gray-100 text-gray-500 border-gray-200', activeColor: 'bg-gray-200 text-gray-700 border-gray-400' },
  { value: 0, label: '0 - Requires Development', color: 'bg-red-50 text-red-600 border-red-200', activeColor: 'bg-red-500 text-white border-red-600' },
  { value: 1, label: '1 - Emerging', color: 'bg-yellow-50 text-yellow-600 border-yellow-200', activeColor: 'bg-yellow-500 text-white border-yellow-600' },
  { value: 2, label: '2 - Acquired', color: 'bg-green-50 text-green-600 border-green-200', activeColor: 'bg-green-500 text-white border-green-600' },
]

// Yes/No options (for Supervision form)
export const YES_NO_OPTIONS: RatingOption[] = [
  { value: null, label: 'Not Rated', color: 'bg-gray-100 text-gray-500 border-gray-200', activeColor: 'bg-gray-200 text-gray-700 border-gray-400' },
  { value: 'yes', label: 'Yes', color: 'bg-green-50 text-green-600 border-green-200', activeColor: 'bg-green-500 text-white border-green-600' },
  { value: 'no', label: 'No', color: 'bg-red-50 text-red-600 border-red-200', activeColor: 'bg-red-500 text-white border-red-600' },
]

// 0-3 rating options (for Program Fidelity form)
export const NUMERIC_RATING_OPTIONS: RatingOption[] = [
  { value: 0, label: '0 - Not present', color: 'bg-red-50 text-red-600 border-red-200', activeColor: 'bg-red-500 text-white border-red-600' },
  { value: 1, label: '1 - Early development', color: 'bg-yellow-50 text-yellow-600 border-yellow-200', activeColor: 'bg-yellow-500 text-white border-yellow-600' },
  { value: 2, label: '2 - In place', color: 'bg-blue-50 text-blue-600 border-blue-200', activeColor: 'bg-blue-500 text-white border-blue-600' },
  { value: 3, label: '3 - Excellent', color: 'bg-green-50 text-green-600 border-green-200', activeColor: 'bg-green-500 text-white border-green-600' },
]

// Capacity Focus options (for Supervision form)
export const CAPACITY_FOCUS_OPTIONS: RatingOption[] = [
  { value: null, label: 'Not Rated', color: 'bg-gray-100 text-gray-500 border-gray-200', activeColor: 'bg-gray-200 text-gray-700 border-gray-400' },
  { value: 'could_do_less', label: 'Could Do Less', color: 'bg-orange-50 text-orange-600 border-orange-200', activeColor: 'bg-orange-500 text-white border-orange-600' },
  { value: 'could_do_more', label: 'Could Do More', color: 'bg-blue-50 text-blue-600 border-blue-200', activeColor: 'bg-blue-500 text-white border-blue-600' },
  { value: 'appropriate', label: 'Appropriate', color: 'bg-green-50 text-green-600 border-green-200', activeColor: 'bg-green-500 text-white border-green-600' },
  { value: 'strength', label: 'Strength', color: 'bg-purple-50 text-purple-600 border-purple-200', activeColor: 'bg-purple-500 text-white border-purple-600' },
]

interface FocusModeRatingControlProps {
  questionText: string
  questionType?: string
  options: RatingOption[]
  value: string | number | null | undefined
  onChange: (value: string | number | null) => void
  helperText?: string
  children?: ReactNode
}

export function FocusModeRatingControl({
  questionText,
  questionType = 'Rating',
  options,
  value,
  onChange,
  helperText,
  children,
}: FocusModeRatingControlProps) {
  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="space-y-2">
        <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg">
          {questionType}
        </span>
        <p className="text-base sm:text-lg font-medium text-gray-900 leading-relaxed">
          {questionText}
        </p>
        {helperText && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>

      {/* Rating buttons - mobile optimized */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Select your rating:</p>
        <div className="grid grid-cols-1 gap-2">
          {options.filter(opt => opt.value !== null).map((option) => {
            const isSelected = value === option.value
            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => onChange(isSelected ? null : option.value)}
                className={`
                  w-full px-4 py-3 rounded-xl border-2 text-sm font-medium
                  transition-all duration-200 text-left
                  ${isSelected ? option.activeColor + ' shadow-md scale-[1.02]' : option.color + ' hover:scale-[1.01]'}
                `}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Clear button */}
      {value !== null && value !== undefined && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
        >
          Clear selection
        </button>
      )}

      {/* Additional content like notes */}
      {children}
    </div>
  )
}

// Simple wrapper for text items that don't have ratings
interface FocusModeInfoCardProps {
  title: string
  description: string
  color?: 'amber' | 'green' | 'blue' | 'purple' | 'pink' | 'teal' | 'cyan'
  children?: ReactNode
}

export function FocusModeInfoCard({
  title,
  description,
  color = 'blue',
  children,
}: FocusModeInfoCardProps) {
  const colorClasses = {
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    pink: 'bg-pink-50 border-pink-200 text-pink-800',
    teal: 'bg-teal-50 border-teal-200 text-teal-800',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-800',
  }

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-gray-700">{description}</p>
      {children}
    </div>
  )
}
