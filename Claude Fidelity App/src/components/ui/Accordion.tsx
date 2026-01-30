import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionItemProps {
  title: string
  subtitle?: string
  badge?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function AccordionItem({
  title,
  subtitle,
  badge,
  children,
  defaultOpen = false,
  className = '',
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-4 py-3 text-left
          bg-white hover:bg-gray-50 transition-colors
          ${isOpen ? 'border-b border-gray-200' : ''}
        `}
        aria-expanded={isOpen}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{title}</span>
            {badge}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <ChevronDown
          className={`
            w-5 h-5 text-gray-400 flex-shrink-0 ml-2
            transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>
      <div
        className={`
          overflow-hidden transition-all duration-200 ease-in-out
          ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="p-4 bg-white">{children}</div>
      </div>
    </div>
  )
}

interface AccordionGroupProps {
  children: ReactNode
  className?: string
}

export function AccordionGroup({ children, className = '' }: AccordionGroupProps) {
  return <div className={`space-y-3 ${className}`}>{children}</div>
}
