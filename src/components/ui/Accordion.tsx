import { useState, createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

// ========================================
// Accordion Group Context
// ========================================

interface AccordionGroupContextValue {
  openItems: Set<string>
  toggleItem: (id: string) => void
  registerDefaultOpen: (id: string) => void
  allowMultiple: boolean
}

const AccordionGroupContext = createContext<AccordionGroupContextValue | null>(
  null
)

// ========================================
// Accordion Group
// ========================================

interface AccordionGroupProps {
  children: ReactNode
  allowMultiple?: boolean
  defaultOpen?: string[]
}

export function AccordionGroup({
  children,
  allowMultiple = true,
  defaultOpen = [],
}: AccordionGroupProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(defaultOpen)
  )

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) {
          next.clear()
        }
        next.add(id)
      }
      return next
    })
  }

  // Allow children to register themselves as default open
  const registerDefaultOpen = (id: string) => {
    setOpenItems((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  return (
    <AccordionGroupContext.Provider
      value={{ openItems, toggleItem, registerDefaultOpen, allowMultiple }}
    >
      <div className="space-y-3">{children}</div>
    </AccordionGroupContext.Provider>
  )
}

// ========================================
// Accordion Item
// ========================================

interface AccordionItemProps {
  title: string
  children: ReactNode
  badge?: ReactNode
  defaultOpen?: boolean
  id?: string
}

export function AccordionItem({
  title,
  children,
  badge,
  defaultOpen = false,
  id,
}: AccordionItemProps) {
  const groupContext = useContext(AccordionGroupContext)
  const itemId = id || title
  const hasRegistered = useRef(false)

  // Standalone mode (no group context)
  const [standaloneOpen, setStandaloneOpen] = useState(defaultOpen)

  // Register as default open with group context
  useEffect(() => {
    if (groupContext && defaultOpen && !hasRegistered.current) {
      hasRegistered.current = true
      groupContext.registerDefaultOpen(itemId)
    }
  }, [groupContext, defaultOpen, itemId])

  const isOpen = groupContext
    ? groupContext.openItems.has(itemId)
    : standaloneOpen

  const handleToggle = () => {
    if (groupContext) {
      groupContext.toggleItem(itemId)
    } else {
      setStandaloneOpen((prev) => !prev)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {badge}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200">{children}</div>
      )}
    </div>
  )
}
