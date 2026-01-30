import { useRef } from 'react'
import { X, Plus, Trash2, Copy, Download, Upload } from 'lucide-react'
import type { CaseMeta } from '@/types/form.types'

interface CaseSelectorProps {
  isOpen: boolean
  onClose: () => void
  cases: CaseMeta[]
  currentCaseId: string | null
  onSelectCase: (caseId: string) => void
  onNewCase: () => void
  onDeleteCase: (caseId: string) => void
  onDuplicateCase: (caseId: string) => void
  onExportCase: (caseId: string) => void
  onImportCase: (jsonString: string) => void
}

export function CaseSelector({
  isOpen,
  onClose,
  cases,
  currentCaseId,
  onSelectCase,
  onNewCase,
  onDeleteCase,
  onDuplicateCase,
  onExportCase,
  onImportCase,
}: CaseSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        onImportCase(content)
      }
      reader.readAsText(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeleteCase = (caseId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this case? This cannot be undone.')) {
      onDeleteCase(caseId)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Cases</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 border-b border-gray-200">
          <button
            onClick={onNewCase}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Case
          </button>
          <button
            onClick={handleImportClick}
            className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Case list */}
        <div className="flex-1 overflow-y-auto p-2">
          {cases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No cases yet. Create your first case!
            </div>
          ) : (
            <div className="space-y-1">
              {cases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  onClick={() => {
                    onSelectCase(caseItem.id)
                    onClose()
                  }}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-colors
                    ${currentCaseId === caseItem.id
                      ? 'bg-blue-50 ring-1 ring-blue-200'
                      : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {caseItem.clientInitials || 'Unnamed Case'}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Created {formatDate(caseItem.createdAt)}
                        {caseItem.updatedAt !== caseItem.createdAt && (
                          <> · Updated {formatDate(caseItem.updatedAt)}</>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDuplicateCase(caseItem.id)
                        }}
                        className="p-1.5 rounded hover:bg-gray-200"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onExportCase(caseItem.id)
                        }}
                        className="p-1.5 rounded hover:bg-gray-200"
                        title="Export"
                      >
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteCase(caseItem.id, e)}
                        className="p-1.5 rounded hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
