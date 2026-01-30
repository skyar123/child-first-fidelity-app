
interface Option {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  label: string
  name: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  error?: string
  helperText?: string
  className?: string
  layout?: 'vertical' | 'horizontal'
}

export function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
  helperText,
  className = '',
  layout = 'vertical',
}: RadioGroupProps) {
  const groupId = `group-${name}`

  return (
    <fieldset className={className} aria-describedby={error ? `${groupId}-error` : undefined}>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </legend>
      <div
        className={`
          ${layout === 'horizontal'
            ? 'flex flex-wrap gap-4'
            : 'space-y-2'
          }
        `}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-start gap-2 p-2 rounded-lg cursor-pointer
              ${value === option.value
                ? 'bg-blue-50 ring-1 ring-blue-200'
                : 'hover:bg-gray-50'
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm text-gray-700">{option.label}</span>
              {option.description && (
                <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
              )}
            </div>
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
