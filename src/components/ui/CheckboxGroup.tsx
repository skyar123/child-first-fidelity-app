interface Option {
  value: string
  label: string
}

interface CheckboxGroupProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  options: Option[]
  required?: boolean
  disabled?: boolean
  error?: string
  helperText?: string
  columns?: 1 | 2 | 3
  className?: string
}

export function CheckboxGroup({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  helperText,
  columns = 1,
  className = '',
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter((v) => v !== optionValue))
    }
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  }

  return (
    <fieldset className={className}>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </legend>
      <div className={`grid ${gridCols[columns]} gap-2`}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
              hover:bg-gray-50
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </fieldset>
  )
}
