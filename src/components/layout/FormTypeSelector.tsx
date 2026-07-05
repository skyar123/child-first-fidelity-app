import { FORM_TYPES, type FormType, type FormTypeInfo } from '@/types/app.types'
import { ChevronRight, Sparkles, ArrowLeft } from 'lucide-react'

interface FormTypeSelectorProps {
  onSelectFormType: (formType: FormType) => void
  onBack?: () => void
}

const CARD_GRADIENTS: Record<string, string> = {
  green: 'from-emerald-100/80 via-teal-50/60 to-cyan-100/80 border-emerald-200/50',
  teal: 'from-teal-100/80 via-cyan-50/60 to-sky-100/80 border-teal-200/50',
  cyan: 'from-cyan-100/80 via-sky-50/60 to-blue-100/80 border-cyan-200/50',
  yellow: 'from-amber-100/80 via-yellow-50/60 to-orange-100/80 border-amber-200/50',
  pink: 'from-pink-100/80 via-rose-50/60 to-fuchsia-100/80 border-pink-200/50',
}

const ICON_GRADIENTS: Record<string, string> = {
  green: 'from-emerald-400 to-teal-500',
  teal: 'from-teal-400 to-cyan-500',
  cyan: 'from-cyan-400 to-blue-500',
  yellow: 'from-amber-400 to-orange-500',
  pink: 'from-pink-400 to-rose-500',
}

export function FormTypeSelector({ onSelectFormType, onBack }: FormTypeSelectorProps) {
  return (
    <div className="min-h-screen animated-gradient-bg p-4">
      <div className="max-w-3xl mx-auto py-8 relative z-10">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 mb-4 px-3 py-2 text-sm rounded-full bg-white/60 backdrop-blur border border-white/60 text-gray-700 hover:bg-white/90"
          >
            <ArrowLeft className="w-4 h-4" /> Back to clients
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-3xl mb-4 shadow-xl shadow-blue-500/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">The five</span>
            <span className="text-gray-800"> fidelity forms</span>
          </h1>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            One form per instrument, verified against your site's own documents. Opening a form
            from a client's page links it to that client automatically.
          </p>
        </div>

        {/* The five forms, in workflow order */}
        <div className="space-y-3">
          {FORM_TYPES.map((formType: FormTypeInfo) => (
            <button
              key={formType.id}
              onClick={() => onSelectFormType(formType.id)}
              className={`w-full relative p-5 rounded-2xl text-left transition-all duration-300
                bg-gradient-to-br ${CARD_GRADIENTS[formType.color] || CARD_GRADIENTS.green}
                backdrop-blur-xl border cursor-pointer hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                    ICON_GRADIENTS[formType.color] || ICON_GRADIENTS.green
                  } flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}
                >
                  {formType.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800">{formType.name}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{formType.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur border border-white/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Data stored securely on your device</span>
          </div>
        </div>
      </div>
    </div>
  )
}
