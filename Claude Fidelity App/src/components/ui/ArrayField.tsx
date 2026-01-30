import { type ReactNode } from 'react'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface ArrayFieldProps {
  title: string
  onRemove: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  children: ReactNode
  className?: string
}

export function ArrayField({
  title,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  children,
  className = '',
}: ArrayFieldProps) {
  return (
    <div
      className={`
        bg-gray-50 rounded-lg border border-gray-200 overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move up"
            >
              <ChevronUp className="w-4 h-4 text-gray-500" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move down"
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded hover:bg-red-100 text-gray-500 hover:text-red-600"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">{children}</div>
    </div>
  )
}

interface AddButtonProps {
  onClick: () => void
  label?: string
  disabled?: boolean
  className?: string
}

export function AddButton({
  onClick,
  label = 'Add',
  disabled = false,
  className = '',
}: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 w-full py-3
        border-2 border-dashed border-gray-300 rounded-lg
        text-sm font-medium text-gray-600
        hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-600
        transition-colors
        ${className}
      `}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      {label}
    </button>
  )
}
