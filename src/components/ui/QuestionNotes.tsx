import { useState } from 'react'
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'

interface QuestionNotesProps {
  questionId: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function QuestionNotes({ questionId: _questionId, value, onChange, placeholder = 'Add notes for supervision...' }: QuestionNotesProps) {
  const [isExpanded, setIsExpanded] = useState(!!value)

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-1 text-xs transition-colors ${
          value ? 'text-amber-600 hover:text-amber-700' : 'text-gray-400 hover:text-gray-500'
        }`}
      >
        <MessageSquare className="w-3 h-3" />
        <span>{value ? 'Has notes' : 'Add note'}</span>
        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {isExpanded && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="mt-2 w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none bg-amber-50/50"
        />
      )}
    </div>
  )
}

// Component to display all notes in a summary view
interface NoteSummary {
  sectionId: string
  sectionName: string
  questionId: string
  questionText: string
  note: string
}

interface AllNotesSectionProps {
  notes: NoteSummary[]
  onNavigateToQuestion?: (sectionId: string, questionId: string) => void
}

export function AllNotesSection({ notes, onNavigateToQuestion }: AllNotesSectionProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 mb-2">No supervision notes yet</p>
        <p className="text-sm text-gray-400">
          Add notes to any question by clicking the "Add note" button
        </p>
      </div>
    )
  }

  // Group notes by section
  const notesBySection = notes.reduce((acc, note) => {
    if (!acc[note.sectionId]) {
      acc[note.sectionId] = {
        sectionName: note.sectionName,
        items: []
      }
    }
    acc[note.sectionId].items.push(note)
    return acc
  }, {} as Record<string, { sectionName: string; items: NoteSummary[] }>)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-amber-600 mb-4">
        <MessageSquare className="w-5 h-5" />
        <span className="font-medium">{notes.length} note{notes.length !== 1 ? 's' : ''} for supervision</span>
      </div>

      {Object.entries(notesBySection).map(([sectionId, { sectionName, items }]) => (
        <div key={sectionId} className="glass-card rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
            {sectionName}
          </h4>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div
                key={`${item.questionId}-${idx}`}
                className="p-3 bg-amber-50 rounded-lg border border-amber-100"
              >
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.questionText}</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{item.note}</p>
                {onNavigateToQuestion && (
                  <button
                    type="button"
                    onClick={() => onNavigateToQuestion(sectionId, item.questionId)}
                    className="mt-2 text-xs text-amber-600 hover:text-amber-700 underline"
                  >
                    Go to question
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
