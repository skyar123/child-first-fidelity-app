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

// Checkbox control for assessment checklist items
interface FocusModeCheckboxControlProps {
  questionText: string
  questionNumber?: string
  questionType?: string
  isChecked: boolean
  onChange: (checked: boolean) => void
  isChildFirstOnly?: boolean
  subItems?: Array<{
    id: string
    text: string
    isChecked: boolean
    onChange: (checked: boolean) => void
  }>
  radioOptions?: Array<{
    value: string
    label: string
    isSelected: boolean
    onChange: () => void
  }>
}

export function FocusModeCheckboxControl({
  questionText,
  questionNumber,
  questionType = 'Checklist Item',
  isChecked,
  onChange,
  isChildFirstOnly,
  subItems,
  radioOptions,
}: FocusModeCheckboxControlProps) {
  return (
    <div className="space-y-4">
      {/* Question header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg">
            {questionType}
          </span>
          {isChildFirstOnly && (
            <span className="inline-block text-xs font-medium text-teal-600 bg-teal-100 px-2 py-1 rounded-lg">
              CF
            </span>
          )}
        </div>
        <p className="text-base sm:text-lg font-medium text-gray-900 leading-relaxed">
          {questionNumber && <span className="text-indigo-600">{questionNumber}. </span>}
          {questionText}
        </p>
      </div>

      {/* Main checkbox or sub-items */}
      {subItems && subItems.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Complete sub-items:</p>
          <div className="space-y-2">
            {subItems.map((subItem) => (
              <button
                key={subItem.id}
                type="button"
                onClick={() => subItem.onChange(!subItem.isChecked)}
                className={`
                  w-full px-4 py-3 rounded-xl border-2 text-sm font-medium
                  transition-all duration-200 text-left flex items-start gap-3
                  ${subItem.isChecked
                    ? 'bg-green-500 text-white border-green-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50'}
                `}
              >
                <span className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                  subItem.isChecked ? 'border-white bg-white/20' : 'border-gray-300'
                }`}>
                  {subItem.isChecked && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                <span>{subItem.text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : radioOptions && radioOptions.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Select one option:</p>
          <div className="space-y-2">
            {radioOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={option.onChange}
                className={`
                  w-full px-4 py-3 rounded-xl border-2 text-sm font-medium
                  transition-all duration-200 text-left flex items-start gap-3
                  ${option.isSelected
                    ? 'bg-indigo-500 text-white border-indigo-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'}
                `}
              >
                <span className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  option.isSelected ? 'border-white bg-white/20' : 'border-gray-300'
                }`}>
                  {option.isSelected && (
                    <span className="w-2 h-2 rounded-full bg-current" />
                  )}
                </span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mark as complete:</p>
          <button
            type="button"
            onClick={() => onChange(!isChecked)}
            className={`
              w-full px-4 py-4 rounded-xl border-2 text-base font-medium
              transition-all duration-200 flex items-center justify-center gap-3
              ${isChecked
                ? 'bg-green-500 text-white border-green-600 shadow-md scale-[1.02]'
                : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50'}
            `}
          >
            <span className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
              isChecked ? 'border-white bg-white/20' : 'border-gray-300'
            }`}>
              {isChecked && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            <span>{isChecked ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      )}
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
