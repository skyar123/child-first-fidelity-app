import { ArrowLeft, Menu, FileDown } from 'lucide-react'

interface FormShellHeaderProps {
  title: string
  subtitle?: string
  /** 0–100 overall progress */
  progress: number
  onBack: () => void
  /** optional overflow action (e.g. a form's cycle switcher); omit to hide */
  onMenu?: () => void
  /** accessible label for the menu button */
  menuLabel?: string
  /** PDF export; omit to hide the button */
  onExportPDF?: () => void
}

/**
 * The one header used by every fidelity form. Clean and identical across
 * instruments: back, optional section menu, title + subtitle, progress %,
 * optional PDF. No decorative or wellness icons.
 */
export function FormShellHeader({
  title,
  subtitle,
  progress,
  onBack,
  onMenu,
  menuLabel = 'Menu',
  onExportPDF,
}: FormShellHeaderProps) {
  return (
    <div className="safe-top sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-1 rounded-lg hover:bg-gray-100 text-gray-600"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {onMenu && (
          <button
            type="button"
            onClick={onMenu}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label={menuLabel}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-gray-900 truncate">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-indigo-600">{progress}%</div>
        </div>
        {onExportPDF && (
          <button
            type="button"
            onClick={onExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg
                     bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
        )}
      </div>
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-indigo-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
