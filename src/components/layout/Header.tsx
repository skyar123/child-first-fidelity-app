import { useEffect, useState } from 'react'
import { Menu, Plus, Download, FolderOpen, Save, Wifi, WifiOff, Trash2 } from 'lucide-react'
import { useFormState } from '@/context/FormContext'
import { ProgressBar } from '@/components/ui'

interface HeaderProps {
  caseName: string
  onMenuClick: () => void
  onNewCase: () => void
  onExportPDF: () => void
  onOpenCases: () => void
  onClearData?: () => void
}

export function Header({
  caseName,
  onMenuClick,
  onNewCase,
  onExportPDF,
  onOpenCases,
  onClearData,
}: HeaderProps) {
  const { progress, isSaving, lastSaved, hasUnsavedChanges, forceSave } = useFormState()
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const formatLastSaved = (timestamp: number | null) => {
    if (!timestamp) return 'Not saved'
    const now = Date.now()
    const diff = now - timestamp
    if (diff < 60000) return 'Saved just now'
    if (diff < 3600000) return `Saved ${Math.floor(diff / 60000)}m ago`
    return `Saved ${Math.floor(diff / 3600000)}h ago`
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                {caseName}
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {isSaving ? (
                  <span className="flex items-center gap-1">
                    <Save className="w-3 h-3 animate-pulse" />
                    Saving...
                  </span>
                ) : hasUnsavedChanges ? (
                  <button
                    onClick={forceSave}
                    className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700"
                  >
                    <Save className="w-3 h-3" />
                    Unsaved changes
                  </button>
                ) : (
                  <span>{formatLastSaved(lastSaved)}</span>
                )}
                {isOnline ? (
                  <Wifi className="w-3 h-3 text-green-500" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {onClearData && (
            <button
              onClick={onClearData}
              className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
              aria-label="Clear all data"
              title="Clear all data"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onOpenCases}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Open cases"
          >
            <FolderOpen className="w-5 h-5" />
          </button>
          <button
            onClick={onNewCase}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="New case"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={onExportPDF}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2">
          <ProgressBar
            value={progress.overall}
            size="sm"
            color={progress.overall === 100 ? 'green' : 'blue'}
          />
          <span className="text-xs text-gray-500 min-w-[3ch]">
            {progress.overall}%
          </span>
        </div>
      </div>
    </header>
  )
}
