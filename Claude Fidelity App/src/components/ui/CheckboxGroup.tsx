import { forwardRef, type InputHTMLAttributes } from 'react'

interface Option {
  value: string
  label: string
}

interface CheckboxGroupProps {
  label: string
  options: Option[]
  value: string[]
  onChange: (values: string[]) => void
  error?: string
  helperText?: string
  className?: string
  columns?: 1 | 2 | 3
}

export function CheckboxGroup({
  label,
  options,
  value = [],
  onChange,
  error,
  helperText,
  className = '',
  columns = 1,
}: CheckboxGroupProps) {
  const groupId = `group-${label.toLowerCase().replace(/\s+/g, '-')}`

  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter((v) => v !== optionValue))
    }
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  }

  return (
    <fieldset className={className} aria-describedby={error ? `${groupId}-error` : undefined}>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </legend>
      <div className={`grid ${gridCols[columns]} gap-2`}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${groupId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </fieldset>
  )
}

// Single checkbox component
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`

    return (
      <label
        htmlFor={checkboxId}
        className={`flex items-center gap-2 cursor-pointer ${className}`}
      >
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          {...props}
        />
        <span className="text-sm text-gray-700">{label}</span>
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
