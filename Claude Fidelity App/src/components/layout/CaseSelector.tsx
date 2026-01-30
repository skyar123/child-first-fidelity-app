import { useState, useRef } from 'react'
import {
  X,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  Search,
  FileText,
  AlertCircle,
} from 'lucide-react'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const filteredCases = cases.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.clientInitials.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        onImportCase(content)
      }
      reader.readAsText(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = (caseId: string) => {
    if (deleteConfirm === caseId) {
      onDeleteCase(caseId)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(caseId)
      // Auto-clear confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-xl shadow-xl z-50 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Cases</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search and actions */}
        <div className="px-4 py-3 border-b border-gray-200 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={onNewCase}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              New Case
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>

        {/* Cases list */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredCases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mb-3 text-gray-300" />
              {cases.length === 0 ? (
                <>
                  <p className="font-medium">No cases yet</p>
                  <p className="text-sm mt-1">Create a new case to get started</p>
                </>
              ) : (
                <>
                  <p className="font-medium">No matching cases</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </>
              )}
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredCases.map((caseItem) => (
                <li key={caseItem.id}>
                  <div
                    className={`
                      group flex items-center gap-3 p-3 rounded-lg cursor-pointer
                      ${currentCaseId === caseItem.id
                        ? 'bg-blue-50 ring-1 ring-blue-200'
                        : 'hover:bg-gray-50'
                      }
                    `}
                    onClick={() => {
                      onSelectCase(caseItem.id)
                      onClose()
                    }}
                  >
                    {/* Icon */}
                    <div
                      className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${currentCaseId === caseItem.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-500'
                        }
                      `}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {caseItem.name || caseItem.clientInitials || 'Untitled Case'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Modified {formatDate(caseItem.lastModified)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(caseItem.id)
                        }}
                        className={`
                          p-1.5 rounded
                          ${deleteConfirm === caseItem.id
                            ? 'bg-red-100 text-red-600'
                            : 'hover:bg-gray-200 text-gray-500'
                          }
                        `}
                        title={deleteConfirm === caseItem.id ? 'Click again to confirm' : 'Delete'}
                      >
                        {deleteConfirm === caseItem.id ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-500 text-center">
          {cases.length} case{cases.length !== 1 ? 's' : ''} saved locally
        </div>
      </div>
    </>
  )
}
