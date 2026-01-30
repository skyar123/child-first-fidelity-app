import { FORM_TYPES, type FormType, type FormTypeInfo } from '@/types/app.types'
import { ChevronRight, Lock, Sparkles } from 'lucide-react'

interface FormTypeSelectorProps {
  onSelectFormType: (formType: FormType) => void
}

export function FormTypeSelector({ onSelectFormType }: FormTypeSelectorProps) {
  const getGradientClasses = (color: string, available: boolean) => {
    if (!available) {
      return 'from-gray-100 to-gray-50 border-gray-200/50'
    }

    switch (color) {
      case 'green':
        return 'from-emerald-100/80 via-teal-50/60 to-cyan-100/80 border-emerald-200/50 hover:shadow-emerald-500/20'
      case 'pink':
        return 'from-pink-100/80 via-rose-50/60 to-fuchsia-100/80 border-pink-200/50 hover:shadow-pink-500/20'
      case 'yellow':
        return 'from-amber-100/80 via-yellow-50/60 to-orange-100/80 border-amber-200/50 hover:shadow-amber-500/20'
      case 'cyan':
        return 'from-cyan-100/80 via-sky-50/60 to-blue-100/80 border-cyan-200/50 hover:shadow-cyan-500/20'
      case 'purple':
        return 'from-violet-100/80 via-purple-50/60 to-fuchsia-100/80 border-violet-200/50 hover:shadow-violet-500/20'
      default:
        return 'from-gray-100/80 to-white/60 border-gray-200/50'
    }
  }

  const getIconGradient = (color: string) => {
    switch (color) {
      case 'green':
        return 'from-emerald-400 to-teal-500'
      case 'pink':
        return 'from-pink-400 to-rose-500'
      case 'yellow':
        return 'from-amber-400 to-orange-500'
      case 'cyan':
        return 'from-cyan-400 to-blue-500'
      case 'purple':
        return 'from-violet-400 to-purple-500'
      default:
        return 'from-gray-400 to-gray-500'
    }
  }

  const handleClick = (formType: FormTypeInfo) => {
    if (formType.available) {
      onSelectFormType(formType.id)
    }
  }

  return (
    <div className="min-h-screen animated-gradient-bg flex items-center justify-center p-4 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-300/30 to-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-orange-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-violet-300/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-3xl mb-6 shadow-2xl shadow-blue-500/30 float-animation">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text">Child First</span>
            <span className="text-gray-800"> Fidelity</span>
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto text-lg">
            Select a fidelity form to begin. Your progress is automatically saved.
          </p>
        </div>

        {/* Form Type Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {FORM_TYPES.map((formType) => (
            <button
              key={formType.id}
              onClick={() => handleClick(formType)}
              disabled={!formType.available}
              className={`
                relative p-6 rounded-2xl text-left transition-all duration-300
                bg-gradient-to-br ${getGradientClasses(formType.color, formType.available)}
                backdrop-blur-xl border
                ${formType.available
                  ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]'
                  : 'cursor-not-allowed opacity-70'
                }
              `}
            >
              {/* Shine effect */}
              {formType.available && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%]" />
                </div>
              )}

              <div className="flex items-start gap-4 relative">
                <div className={`
                  w-14 h-14 rounded-2xl bg-gradient-to-br ${getIconGradient(formType.color)}
                  flex items-center justify-center text-3xl shadow-lg
                  ${formType.available ? `shadow-${formType.color}-500/30` : 'shadow-gray-500/20'}
                `}>
                  {formType.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-bold text-lg ${formType.available ? 'text-gray-800' : 'text-gray-400'}`}>
                      {formType.name}
                    </h3>
                    {!formType.available && (
                      <span className="inline-flex items-center gap-1 text-xs bg-white/50 backdrop-blur text-gray-500 px-2.5 py-1 rounded-full border border-gray-200/50">
                        <Lock className="w-3 h-3" />
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mt-1.5 ${formType.available ? 'text-gray-600' : 'text-gray-400'}`}>
                    {formType.description}
                  </p>
                </div>
                {formType.available && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/60 backdrop-blur flex items-center justify-center group-hover:bg-white/80 transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur border border-white/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Data stored securely on your device</span>
          </div>
        </div>
      </div>
    </div>
  )
}
