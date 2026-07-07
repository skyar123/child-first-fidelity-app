import { useEffect, useRef, useState } from 'react'
import {
  Sparkles,
  X,
  Send,
  Settings,
  Loader2,
  KeyRound,
  Trash2,
  ShieldCheck,
} from 'lucide-react'
import {
  getAiConfig,
  setAiConfig,
  clearAiConfig,
  sendChat,
  DEFAULT_MODELS,
  PROVIDER_LABELS,
  PROVIDER_KEY_HELP,
  type AiProvider,
  type ChatMessage,
} from '@/utils/aiAssistant'

const STARTERS = [
  'What is this form for, in plain language?',
  'Why is fidelity completed every 3 months?',
  'What do I fill out vs. the Clinician?',
]

export function AssistantChat() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'chat' | 'settings'>(getAiConfig() ? 'chat' : 'settings')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Settings form state
  const existing = getAiConfig()
  const [provider, setProvider] = useState<AiProvider>(existing?.provider || 'gemini')
  const [apiKey, setApiKey] = useState(existing?.apiKey || '')
  const [model, setModel] = useState(existing?.model || DEFAULT_MODELS[provider])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const saveSettings = () => {
    if (!apiKey.trim()) {
      setError('Enter an API key to save.')
      return
    }
    setAiConfig({ provider, apiKey: apiKey.trim(), model: model.trim() || DEFAULT_MODELS[provider] })
    setError(null)
    setView('chat')
  }

  const removeKey = () => {
    clearAiConfig()
    setApiKey('')
    setMessages([])
    setView('settings')
  }

  const ask = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    if (!getAiConfig()) {
      setView('settings')
      return
    }
    setError(null)
    const next: ChatMessage[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const reply = await sendChat(next)
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-50 bottom-24 right-4 inline-flex items-center gap-2 pl-3 pr-4 py-3 rounded-full
                   bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition"
          aria-label="Ask the Fidelity Guide"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">Ask</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="safe-bottom relative w-full sm:max-w-lg h-[85vh] sm:h-[80vh] bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 leading-tight">Fidelity Guide</h2>
                <p className="text-[11px] text-gray-500">Answers about the fidelity forms</p>
              </div>
              <button
                type="button"
                onClick={() => setView(view === 'settings' ? 'chat' : 'settings')}
                className="p-2 rounded-lg text-gray-500 hover:bg-white"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {view === 'settings' ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <p className="text-sm text-gray-600">
                  Bring your own AI key to turn on the guide. Your key is stored only on this device
                  and used to call the provider directly from your browser.
                </p>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Provider</label>
                  <select
                    value={provider}
                    onChange={e => {
                      const p = e.target.value as AiProvider
                      setProvider(p)
                      setModel(DEFAULT_MODELS[p])
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {(Object.keys(PROVIDER_LABELS) as AiProvider[]).map(p => (
                      <option key={p} value={p}>
                        {PROVIDER_LABELS[p]}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-400 mt-1">{PROVIDER_KEY_HELP[provider]}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">API key</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="Paste your API key"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={saveSettings}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                  >
                    Save &amp; start
                  </button>
                  {existing && (
                    <button
                      type="button"
                      onClick={removeKey}
                      className="px-3 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                      aria-label="Remove key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-2 text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    The guide only discusses the fidelity forms. Don't enter real client identifying
                    information in the chat.
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Hi! I can explain what any part of these fidelity forms means and why it's
                        asked. What would you like to understand?
                      </p>
                      <div className="space-y-2">
                        {STARTERS.map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => ask(s)}
                            className="block w-full text-left text-sm px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                          m.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="px-3 py-2 rounded-2xl bg-gray-100 text-gray-500 text-sm inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Thinking…
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      {error}
                    </div>
                  )}
                </div>

                <form
                  onSubmit={e => {
                    e.preventDefault()
                    ask(input)
                  }}
                  className="border-t border-gray-200 p-3 flex items-end gap-2"
                >
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        ask(input)
                      }
                    }}
                    rows={1}
                    placeholder="Ask about a form or an item…"
                    className="flex-1 resize-none px-3 py-2 border border-gray-300 rounded-xl text-sm max-h-28 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
