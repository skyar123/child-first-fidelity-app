import { useState, useEffect } from 'react'
import { X, PenLine, Save, Trash2, Heart, Brain, Users, AlertTriangle, Clock, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { getRandomQuote, type WisdomQuote } from '@/utils/wisdomQuotes'

interface JournalEntry {
  id: string
  date: string
  type: 'reflection' | 'supervision' | 'emotional' | 'insight'
  title: string
  content: string
  prompts?: string[]
  flagForSupervision?: boolean
}

interface ReflectiveJournalProps {
  onClose: () => void
  caseId?: string
}

const JOURNAL_STORAGE_KEY = 'cpp_reflective_journal'

const REFLECTION_PROMPTS = {
  reflection: [
    "What emotional reactions did I notice in myself today?",
    "How did my own history or biases affect my perception?",
    "What multiple perspectives am I holding (caregiver's, child's, my own)?",
    "What do I need to feel integrated and present?",
  ],
  supervision: [
    "What did I discuss with my supervisor?",
    "What new perspective or insight emerged?",
    "What will I do differently based on this feedback?",
    "What do I still need support with?",
  ],
  emotional: [
    "What strong emotions came up for me?",
    "Where do I feel this in my body?",
    "What triggered this response?",
    "How did I regulate myself?",
    "What self-care do I need right now?",
  ],
  insight: [
    "What did I learn about this family today?",
    "How does their trauma history inform their behavior?",
    "What strengths did I observe?",
    "What intervention worked well, and why?",
  ],
}

const ENTRY_TYPES = [
  { id: 'reflection', label: 'Daily Reflection', icon: Brain, color: 'purple' },
  { id: 'supervision', label: 'Supervision Notes', icon: Users, color: 'blue' },
  { id: 'emotional', label: 'Emotional Processing', icon: Heart, color: 'pink' },
  { id: 'insight', label: 'Clinical Insight', icon: AlertTriangle, color: 'amber' },
] as const

export function ReflectiveJournal({ onClose }: ReflectiveJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newEntryType, setNewEntryType] = useState<JournalEntry['type']>('reflection')
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [flagForSupervision, setFlagForSupervision] = useState(false)
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  const [wisdomQuote] = useState<WisdomQuote>(() => getRandomQuote())

  // Load entries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(JOURNAL_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setEntries(parsed)
      } catch {
        // Invalid JSON, start fresh
      }
    }
  }, [])

  // Save entries to localStorage
  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries)
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(newEntries))
  }

  const handleCreateEntry = () => {
    if (!newContent.trim()) return

    const newEntry: JournalEntry = {
      id: `entry_${Date.now()}`,
      date: new Date().toISOString(),
      type: newEntryType,
      title: newTitle || `${ENTRY_TYPES.find(t => t.id === newEntryType)?.label} - ${new Date().toLocaleDateString()}`,
      content: newContent,
      prompts: REFLECTION_PROMPTS[newEntryType],
      flagForSupervision,
    }

    saveEntries([newEntry, ...entries])
    setIsCreating(false)
    setNewTitle('')
    setNewContent('')
    setFlagForSupervision(false)
  }

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      saveEntries(entries.filter(e => e.id !== id))
    }
  }

  const getTypeConfig = (type: JournalEntry['type']) => {
    return ENTRY_TYPES.find(t => t.id === type) || ENTRY_TYPES[0]
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; light: string }> = {
      purple: { bg: 'bg-purple-500', text: 'text-purple-700', border: 'border-purple-200', light: 'bg-purple-50' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-200', light: 'bg-blue-50' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-700', border: 'border-pink-200', light: 'bg-pink-50' },
      amber: { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-200', light: 'bg-amber-50' },
    }
    return colors[color] || colors.purple
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const flaggedCount = entries.filter(e => e.flagForSupervision).length

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <PenLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Reflective Practice Journal</h2>
              <p className="text-sm text-white/80">Process, reflect, and grow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wisdom quote banner */}
        <div className="px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
          <p className="text-sm text-amber-800 italic">"{wisdomQuote.quote}"</p>
          <p className="text-xs text-amber-600 mt-1">— {wisdomQuote.source}</p>
        </div>

        {/* Stats bar */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              <strong>{entries.length}</strong> entries
            </span>
            {flaggedCount > 0 && (
              <span className="text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                <strong>{flaggedCount}</strong> flagged for supervision
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500
                     text-white text-sm font-medium rounded-xl hover:from-purple-600 hover:to-indigo-600
                     transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isCreating ? (
            <div className="space-y-4">
              {/* Entry type selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Entry Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ENTRY_TYPES.map(type => {
                    const Icon = type.icon
                    const colors = getColorClasses(type.color)
                    const isSelected = newEntryType === type.id
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNewEntryType(type.id)}
                        className={`
                          flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                          ${isSelected
                            ? `${colors.light} ${colors.border} ${colors.text}`
                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Prompts */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-2">Reflection Prompts:</p>
                <ul className="space-y-1">
                  {REFLECTION_PROMPTS[newEntryType].map((prompt, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      {prompt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Give this entry a name..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reflection
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write your thoughts here..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Flag for supervision */}
              <label className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors">
                <input
                  type="checkbox"
                  checked={flagForSupervision}
                  onChange={(e) => setFlagForSupervision(e.target.checked)}
                  className="w-5 h-5 rounded border-amber-300 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <span className="text-sm font-medium text-amber-800">Flag for Supervision</span>
                  <p className="text-xs text-amber-600">Mark this entry to discuss with your supervisor</p>
                </div>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEntry}
                  disabled={!newContent.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500
                           text-white font-medium rounded-xl hover:from-purple-600 hover:to-indigo-600
                           transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Save Entry
                </button>
              </div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <PenLine className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No journal entries yet</h3>
              <p className="text-gray-500 mb-4">
                Start documenting your reflections to support your practice
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500
                         text-white font-medium rounded-xl hover:from-purple-600 hover:to-indigo-600
                         transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Your First Entry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map(entry => {
                const typeConfig = getTypeConfig(entry.type)
                const colors = getColorClasses(typeConfig.color)
                const Icon = typeConfig.icon
                const isExpanded = expandedEntry === entry.id

                return (
                  <div
                    key={entry.id}
                    className={`border rounded-xl overflow-hidden transition-all ${colors.border}`}
                  >
                    {/* Entry header */}
                    <button
                      onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                      className={`w-full px-4 py-3 flex items-center justify-between ${colors.light} hover:opacity-90 transition-all`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${colors.bg} rounded-lg`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{entry.title}</span>
                            {entry.flagForSupervision && (
                              <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs rounded-full font-medium">
                                Supervision
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatDate(entry.date)}
                          </div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {/* Entry content */}
                    {isExpanded && (
                      <div className="px-4 py-4 bg-white border-t border-gray-100">
                        <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="flex items-center gap-2 px-3 py-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook for using the journal
export function useReflectiveJournal() {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    JournalModal: isOpen ? <ReflectiveJournal onClose={() => setIsOpen(false)} /> : null
  }
}
