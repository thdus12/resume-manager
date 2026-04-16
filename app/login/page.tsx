'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8005'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleOAuth = (provider: string) => {
    window.location.href = `${API_BASE}/oauth2/authorization/${provider}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-xl font-bold text-gray-900 text-center mb-2">
          &apos;준비중&apos; 청년 아카이브
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          소셜 계정으로 간편하게 시작하세요
        </p>

        {error && (
          <p className="text-sm text-red-500 text-center mb-4">
            로그인에 실패했습니다. 다시 시도해주세요.
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleOAuth('google')}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 계속하기
          </button>

          <button
            onClick={() => handleOAuth('kakao')}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg text-sm font-medium text-gray-900 transition-colors"
            style={{ backgroundColor: '#FEE500' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#000000" d="M12 3C6.48 3 2 6.36 2 10.44c0 2.61 1.74 4.91 4.36 6.22l-1.1 4.07c-.1.35.31.63.6.42l4.84-3.2c.43.04.86.06 1.3.06 5.52 0 10-3.36 10-7.57C22 6.36 17.52 3 12 3z"/>
            </svg>
            카카오로 계속하기
          </button>

          <button
            onClick={() => handleOAuth('naver')}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#03C75A' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#FFFFFF" d="M16.27 3H7.73L3 12l4.73 9h8.54L21 12l-4.73-9zM13.5 15.5h-3v-3h3v3z"/>
            </svg>
            네이버로 계속하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
