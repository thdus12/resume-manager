'use client'

import { useState } from 'react'
import { AIProvider, AIConfig, getAIConfig, saveAIConfig, clearAIConfig } from '@/lib/ai-config'

interface Props {
  onConfirm: (config: AIConfig) => void
  onClose: () => void
}

export default function AIKeyModal({ onConfirm, onClose }: Props) {
  const existing = getAIConfig()
  const [provider, setProvider] = useState<AIProvider>(existing?.provider || 'claude')
  const [apiKey, setApiKey] = useState(existing?.apiKey || '')
  const [showKey, setShowKey] = useState(false)

  const handleSubmit = () => {
    if (!apiKey.trim()) return
    const config: AIConfig = { provider, apiKey: apiKey.trim() }
    saveAIConfig(config)
    onConfirm(config)
  }

  const handleClear = () => {
    clearAIConfig()
    setApiKey('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-[440px] p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">AI 설정</h2>
        <p className="text-xs text-gray-500 mb-5">
          이력서를 AI로 분석하려면 API Key가 필요합니다. 키는 브라우저에만 저장됩니다.
        </p>

        {/* Provider 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">AI 제공자</label>
          <div className="flex gap-2">
            {([
              { value: 'claude' as const, label: 'Claude (Anthropic)', desc: 'claude-sonnet-4.6' },
              { value: 'openai' as const, label: 'GPT (OpenAI)', desc: 'gpt-5.4' },
            ]).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setProvider(opt.value)}
                className={`flex-1 p-3 rounded-lg border-2 text-left transition-colors ${
                  provider === opt.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* API Key 입력 */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">API Key</label>
            <a
              href={provider === 'claude'
                ? 'https://console.anthropic.com/settings/keys'
                : 'https://platform.openai.com/api-keys'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-500 hover:text-blue-700 hover:underline"
            >
              {provider === 'claude' ? 'Anthropic Console' : 'OpenAI Platform'}에서 발급 &rarr;
            </a>
          </div>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === 'claude' ? 'sk-ant-api03-...' : 'sk-proj-...'}
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-16 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 px-1"
            >
              {showKey ? '숨기기' : '보기'}
            </button>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-400 hover:text-red-600"
          >
            키 초기화
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!apiKey.trim()}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              저장 후 파일 선택
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
