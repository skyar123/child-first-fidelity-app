// Rating option palettes used by the fidelity form controls.
// (Extracted from the removed FocusModeControls.)

export interface RatingOption {
  value: string | number | null
  label: string
  color: string
  activeColor: string
}

export const CHALLENGE_OPTIONS: RatingOption[] = [
  { value: null, label: 'Not Rated', color: 'bg-gray-100 text-gray-500 border-gray-200', activeColor: 'bg-gray-200 text-gray-700 border-gray-400' },
  { value: 0, label: '0 - No Challenge', color: 'bg-green-50 text-green-600 border-green-200', activeColor: 'bg-green-500 text-white border-green-600' },
  { value: 1, label: '1 - Low Challenge', color: 'bg-yellow-50 text-yellow-600 border-yellow-200', activeColor: 'bg-yellow-500 text-white border-yellow-600' },
  { value: 2, label: '2 - Moderate Challenge', color: 'bg-orange-50 text-orange-600 border-orange-200', activeColor: 'bg-orange-500 text-white border-orange-600' },
  { value: 3, label: '3 - Significant Challenge', color: 'bg-red-50 text-red-600 border-red-200', activeColor: 'bg-red-500 text-white border-red-600' },
]
export const CAPACITY_OPTIONS: RatingOption[] = [
  { value: null, label: 'Not Rated', color: 'bg-gray-100 text-gray-500 border-gray-200', activeColor: 'bg-gray-200 text-gray-700 border-gray-400' },
  { value: 0, label: '0 - Requires Development', color: 'bg-red-50 text-red-600 border-red-200', activeColor: 'bg-red-500 text-white border-red-600' },
  { value: 1, label: '1 - Emerging', color: 'bg-yellow-50 text-yellow-600 border-yellow-200', activeColor: 'bg-yellow-500 text-white border-yellow-600' },
  { value: 2, label: '2 - Acquired', color: 'bg-green-50 text-green-600 border-green-200', activeColor: 'bg-green-500 text-white border-green-600' },
]
export const YES_NO_OPTIONS: RatingOption[] = [
  { value: null, label: 'Not Rated', color: 'bg-gray-100 text-gray-500 border-gray-200', activeColor: 'bg-gray-200 text-gray-700 border-gray-400' },
  { value: 'yes', label: 'Yes', color: 'bg-green-50 text-green-600 border-green-200', activeColor: 'bg-green-500 text-white border-green-600' },
  { value: 'no', label: 'No', color: 'bg-red-50 text-red-600 border-red-200', activeColor: 'bg-red-500 text-white border-red-600' },
]
export const NUMERIC_RATING_OPTIONS: RatingOption[] = [
  { value: 0, label: '0 - Not present', color: 'bg-red-50 text-red-600 border-red-200', activeColor: 'bg-red-500 text-white border-red-600' },
  { value: 1, label: '1 - Early development', color: 'bg-yellow-50 text-yellow-600 border-yellow-200', activeColor: 'bg-yellow-500 text-white border-yellow-600' },
  { value: 2, label: '2 - In place', color: 'bg-blue-50 text-blue-600 border-blue-200', activeColor: 'bg-blue-500 text-white border-blue-600' },
  { value: 3, label: '3 - Excellent', color: 'bg-green-50 text-green-600 border-green-200', activeColor: 'bg-green-500 text-white border-green-600' },
]
export const CAPACITY_FOCUS_OPTIONS: RatingOption[] = [
  { value: null, label: 'Not Rated', color: 'bg-gray-100 text-gray-500 border-gray-200', activeColor: 'bg-gray-200 text-gray-700 border-gray-400' },
  { value: 'could_do_less', label: 'Could Do Less', color: 'bg-orange-50 text-orange-600 border-orange-200', activeColor: 'bg-orange-500 text-white border-orange-600' },
  { value: 'could_do_more', label: 'Could Do More', color: 'bg-blue-50 text-blue-600 border-blue-200', activeColor: 'bg-blue-500 text-white border-blue-600' },
  { value: 'appropriate', label: 'Appropriate', color: 'bg-green-50 text-green-600 border-green-200', activeColor: 'bg-green-500 text-white border-green-600' },
  { value: 'strength', label: 'Strength', color: 'bg-purple-50 text-purple-600 border-purple-200', activeColor: 'bg-purple-500 text-white border-purple-600' },
]
