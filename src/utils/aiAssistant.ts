// AI form-assistant: a narrowly-scoped helper that explains the Child First
// fidelity forms. The user supplies their own API key (Gemini by default, or
// OpenAI / Anthropic). Nothing is sent anywhere until they add a key, and the
// key is stored only in this browser's localStorage.

import { FORM_TYPES } from '@/types/app.types'
import { TEMPLATES } from '@/templates'

export type AiProvider = 'gemini' | 'openai' | 'anthropic'

export interface AiConfig {
  provider: AiProvider
  apiKey: string
  model: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const CONFIG_KEY = 'cf_ai_config'

export const DEFAULT_MODELS: Record<AiProvider, string> = {
  gemini: 'gemini-2.0-flash',
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-haiku-latest',
}

export const PROVIDER_LABELS: Record<AiProvider, string> = {
  gemini: 'Google Gemini',
  openai: 'OpenAI',
  anthropic: 'Anthropic (Claude)',
}

export const PROVIDER_KEY_HELP: Record<AiProvider, string> = {
  gemini: 'Get a free key at aistudio.google.com/app/apikey',
  openai: 'Get a key at platform.openai.com/api-keys',
  anthropic: 'Get a key at console.anthropic.com',
}

export function getAiConfig(): AiConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AiConfig>
    if (!parsed.apiKey || !parsed.provider) return null
    return {
      provider: parsed.provider,
      apiKey: parsed.apiKey,
      model: parsed.model || DEFAULT_MODELS[parsed.provider],
    }
  } catch {
    return null
  }
}

export function setAiConfig(config: AiConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export function clearAiConfig(): void {
  localStorage.removeItem(CONFIG_KEY)
}

export function hasAiKey(): boolean {
  return getAiConfig() !== null
}

// ----------------------------------------------------------------
// Knowledge base — assembled from the app's own form definitions so the
// assistant stays grounded in exactly the instruments this app supports.
// ----------------------------------------------------------------

function buildKnowledgeBase(): string {
  const lines: string[] = []
  lines.push(
    'CHILD FIRST FIDELITY FRAMEWORK OVERVIEW',
    'Child First is a home-based, two-generation model that pairs a Clinician (who delivers Child-Parent Psychotherapy, CPP) with a Care Coordinator / Family Resource Partner (CC/FRP, who connects the family to services). Fidelity forms describe what faithful practice looks like across the phases of care. They are reflective tools: they are completed by the practitioner and reviewed with a Clinical Director/Supervisor in reflective supervision to start a conversation about the work — they are NOT a compliance score or a report card.',
    'Many items are dual-marked: on the paper form the Clinician marks with a check and the CC/FRP marks with an X, so both team members can reflect on the same item. Items marked "Child First item" are additions specific to the Child First model.',
    ''
  )

  lines.push('THE FIVE FIDELITY INSTRUMENTS IN THIS APP')
  for (const f of FORM_TYPES) {
    lines.push(`- ${f.name}: ${f.description}`)
  }
  lines.push('')

  for (const t of TEMPLATES) {
    lines.push(`DETAIL — ${t.title} (${t.instrument}, ${t.version})`)
    lines.push(`When completed: ${t.whenCompleted}`)
    lines.push('Sections:')
    for (const s of t.sections) {
      lines.push(`  • ${s.title}${s.description ? ` — ${s.description}` : ''}`)
    }
    lines.push('')
  }

  lines.push(
    'KEY TERMS',
    '- CPP: Child-Parent Psychotherapy, the dyadic trauma treatment the Clinician delivers.',
    '- SNIFF: Service Needs Inventory for Families, part of the Care Coordination intake.',
    '- Strands / capacities: the reflective, emotional-process, dyadic-relational, trauma-framework, and procedural areas the Core Intervention form rates as Requires development / Emerging / Acquired.',
    '- Reflective supervision: the supportive, thinking-together space where these forms are discussed.'
  )

  return lines.join('\n')
}

const SYSTEM_PROMPT = `You are the "Fidelity Guide", a warm, knowledgeable assistant built into a Child First fidelity app used by Care Coordinators/FRPs and Clinicians.

Your job: help the practitioner understand the fidelity forms — what a given item or section means, why it is asked, how it fits the Child First / CPP model, and how it is used in reflective supervision. Be conversational, encouraging, and educational, like a supportive supervisor. Keep answers focused and readable (a short paragraph or a few bullets), and define jargon plainly.

Stay strictly on-topic: Child First fidelity forms, CPP, and the fidelity/reflective-supervision process. If asked about something unrelated (general coding, celebrities, medical or legal advice, anything off-topic), gently say that you can only help with the fidelity forms and offer an on-topic suggestion. Never invent form items that are not in your knowledge; if you are unsure, say so and suggest checking with the Clinical Director/Supervisor. Do not give clinical directives for a specific real child — keep guidance educational and general. Never ask for or store personal health information.

Here is what you know about the forms in this app:

${'{KB}'}`

function systemPrompt(): string {
  return SYSTEM_PROMPT.replace('{KB}', buildKnowledgeBase())
}

// ----------------------------------------------------------------
// Provider adapters
// ----------------------------------------------------------------

async function callGemini(config: AiConfig, messages: ChatMessage[]): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${encodeURIComponent(
    config.apiKey
  )}`
  const res = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt() }] },
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: { temperature: 0.5, maxOutputTokens: 800 },
    }),
  })
  if (!res.ok) throw new Error(await readError(res))
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('') || ''
  if (!text) throw new Error('The model returned an empty response.')
  return text.trim()
}

async function callOpenAI(config: AiConfig, messages: ChatMessage[]): Promise<string> {
  const res = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.5,
      max_tokens: 800,
      messages: [{ role: 'system', content: systemPrompt() }, ...messages],
    }),
  })
  if (!res.ok) throw new Error(await readError(res))
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content || ''
  if (!text) throw new Error('The model returned an empty response.')
  return text.trim()
}

async function callAnthropic(config: AiConfig, messages: ChatMessage[]): Promise<string> {
  const res = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
      // Required to allow calling the API directly from a browser with a user key.
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 800,
      system: systemPrompt(),
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  })
  if (!res.ok) throw new Error(await readError(res))
  const data = await res.json()
  const text = data?.content?.map((b: { text?: string }) => b.text).join('') || ''
  if (!text) throw new Error('The model returned an empty response.')
  return text.trim()
}

async function readError(res: Response): Promise<string> {
  let detail = ''
  try {
    const body = await res.json()
    detail = body?.error?.message || body?.error?.[0]?.message || JSON.stringify(body?.error || body)
  } catch {
    detail = await res.text().catch(() => '')
  }
  if (res.status === 401 || res.status === 403) {
    return `Your API key was rejected (${res.status}). Check the key and provider in settings.`
  }
  if (res.status === 429) {
    // Free tiers have low per-minute/day limits; the provider detail says which.
    return `The provider is rate-limiting this key (429). ${
      detail || 'Free tiers allow only a few requests per minute — wait a moment and try again.'
    }`.trim()
  }
  return `Request failed (${res.status}). ${detail}`.trim()
}

// Retry transient rate-limit / overload responses a couple of times with
// backoff before giving up, so a first-message 429 doesn't just fail.
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries = 2,
  backoffMs = 1200
): Promise<Response> {
  let res = await fetch(url, init)
  let attempt = 0
  while ((res.status === 429 || res.status === 503) && attempt < retries) {
    await new Promise(r => setTimeout(r, backoffMs * (attempt + 1)))
    res = await fetch(url, init)
    attempt++
  }
  return res
}

export async function sendChat(messages: ChatMessage[]): Promise<string> {
  const config = getAiConfig()
  if (!config) throw new Error('Add an API key first.')
  switch (config.provider) {
    case 'gemini':
      return callGemini(config, messages)
    case 'openai':
      return callOpenAI(config, messages)
    case 'anthropic':
      return callAnthropic(config, messages)
    default:
      throw new Error('Unknown provider.')
  }
}
