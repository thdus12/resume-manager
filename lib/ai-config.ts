export type AIProvider = 'claude' | 'openai'

export interface AIConfig {
  provider: AIProvider
  apiKey: string
}

const STORAGE_KEY = 'resume-manager-ai-config'

export function getAIConfig(): AIConfig | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.provider && parsed.apiKey) return parsed as AIConfig
    return null
  } catch {
    return null
  }
}

export function saveAIConfig(config: AIConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function clearAIConfig(): void {
  localStorage.removeItem(STORAGE_KEY)
}
