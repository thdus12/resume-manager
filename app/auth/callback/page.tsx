'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { saveAuth } from '@/lib/auth'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const userId = searchParams.get('userId')
    const name = searchParams.get('name')
    const email = searchParams.get('email')

    if (accessToken && refreshToken && userId) {
      saveAuth(accessToken, refreshToken, {
        id: userId,
        name: name || '',
        email: email || '',
      })
      router.replace('/')
    } else {
      router.replace('/login?error=oauth')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">로그인 처리 중...</div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
