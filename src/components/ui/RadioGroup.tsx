interface Option {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  required?: boolean
  disabled?: boolean
  error?: string
  helperText?: string
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export function RadioGroup({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  helperText,
  direction = 'vertical',
  className = '',
}: RadioGroupProps) {
  return (
    <fieldset className={className}>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </legend>
      <div
        className={`
          ${direction === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'}
        `}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors
              hover:bg-gray-50
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${value === option.value ? 'bg-blue-50 ring-1 ring-blue-200' : ''}
            `}
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={disabled}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm text-gray-900">{option.label}</span>
              {option.description && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {option.description}
                </p>
              )}
            </div>
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
