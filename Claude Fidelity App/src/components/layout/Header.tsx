import { useState, useEffect } from 'react'
import {
  Menu,
  Save,
  Download,
  FolderOpen,
  Plus,
  Wifi,
  WifiOff,
  Check,
  Loader2,
} from 'lucide-react'
import { useFormState } from '@/context/FormContext'

interface HeaderProps {
  caseName: string
  onMenuClick: () => void
  onNewCase: () => void
  onExportPDF: () => void
  onOpenCases: () => void
}

export function Header({
  caseName,
  onMenuClick,
  onNewCase,
  onExportPDF,
  onOpenCases,
}: HeaderProps) {
  const { progress, isSaving, lastSaved, hasUnsavedChanges, forceSave } =
    useFormState()
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Listen for online/offline events
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
    if (!timestamp) return ''
    const now = Date.now()
    const diff = now - timestamp
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-none">
              {caseName || 'New Case'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{progress.overall}% complete</span>
              {lastSaved && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Saving...
                      </>
                    ) : hasUnsavedChanges ? (
                      <>
                        <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                        Unsaved
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        {formatLastSaved(lastSaved)}
                      </>
                    )}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1">
          {/* Online status indicator */}
          <div
            className={`p-2 rounded-lg ${isOnline ? 'text-green-600' : 'text-red-500'}`}
            title={isOnline ? 'Online' : 'Offline'}
          >
            {isOnline ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
          </div>

          {/* Save button */}
          <button
            onClick={forceSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Save now"
          >
            <Save className="w-4 h-4 text-gray-600" />
          </button>

          {/* Export PDF button */}
          <button
            onClick={onExportPDF}
            className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100"
            title="Export PDF"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>

          {/* Open cases button */}
          <button
            onClick={onOpenCases}
            className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100"
            title="Open cases"
          >
            <FolderOpen className="w-4 h-4 text-gray-600" />
          </button>

          {/* New case button */}
          <button
            onClick={onNewCase}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
          style={{ width: `${progress.overall}%` }}
        />
      </div>
    </header>
  )
}
