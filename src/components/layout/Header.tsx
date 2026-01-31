import { useEffect, useState } from 'react'
import { Menu, Plus, Download, FolderOpen, Save, Wifi, WifiOff, Trash2, Sparkles } from 'lucide-react'
import { useFormState } from '@/context/FormContext'
import { getProgressMessage } from '@/utils/celebrations'

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
  const progressMessage = getProgressMessage(progress.overall)

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
    <header className="sticky top-0 z-40 glass-header border-b border-white/20">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-white/50 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 float-animation">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold gradient-text truncate max-w-[200px]">
                  {caseName}
                </h1>
                {progress.overall === 100 && (
                  <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-medium">
                    Complete!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {isSaving ? (
                  <span className="flex items-center gap-1 text-cyan-600">
                    <Save className="w-3 h-3 animate-pulse" />
                    Saving...
                  </span>
                ) : hasUnsavedChanges ? (
                  <button
                    onClick={forceSave}
                    className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    <Save className="w-3 h-3" />
                    Unsaved changes
                  </button>
                ) : (
                  <span className="text-gray-400">{formatLastSaved(lastSaved)}</span>
                )}
                <span className="w-px h-3 bg-gray-200" />
                {isOnline ? (
                  <span className="flex items-center gap-1 text-green-500">
                    <Wifi className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-500">
                    <WifiOff className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {onClearData && (
            <button
              onClick={onClearData}
              className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
              aria-label="Clear all data"
              title="Clear all data"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onOpenCases}
            className="p-2.5 rounded-xl hover:bg-white/50 text-gray-500 hover:text-gray-700 transition-all"
            aria-label="Open cases"
          >
            <FolderOpen className="w-5 h-5" />
          </button>
          <button
            onClick={onNewCase}
            className="p-2.5 rounded-xl hover:bg-white/50 text-gray-500 hover:text-gray-700 transition-all"
            aria-label="New case"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={onExportPDF}
            className="hidden sm:flex items-center gap-2 px-4 py-2 ml-2
                     bg-gradient-to-r from-cyan-500 to-blue-500 
                     text-white text-sm font-semibold rounded-xl 
                     hover:from-cyan-600 hover:to-blue-600 
                     transition-all shadow-lg shadow-cyan-500/30
                     hover:shadow-cyan-500/50 hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                progress.overall === 100 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 progress-complete' 
                  : 'progress-gradient'
              }`}
              style={{ width: `${progress.overall}%` }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{progressMessage.emoji}</span>
            <span className="text-sm font-semibold text-gray-700 min-w-[3ch]">
              {progress.overall}%
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
