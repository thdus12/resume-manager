import { Block, Resume } from './types'
import { getAccessToken, getRefreshToken, saveAuth, clearAuth } from './auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8005'

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  // 401이면 토큰 갱신 시도
  if (res.status === 401) {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
      if (refreshRes.ok) {
        const data = await refreshRes.json()
        const user = JSON.parse(localStorage.getItem('resume-manager-user') || '{}')
        saveAuth(data.accessToken, data.refreshToken, user)
        headers['Authorization'] = `Bearer ${data.accessToken}`
        res = await fetch(`${API_BASE}${path}`, { ...options, headers })
      } else {
        clearAuth()
        window.location.href = '/login'
        throw new Error('세션이 만료되었습니다')
      }
    } else {
      clearAuth()
      window.location.href = '/login'
      throw new Error('로그인이 필요합니다')
    }
  }

  return res
}

// 백엔드 응답 → 프론트 Resume 형식 변환
function toResume(data: Record<string, unknown>): Resume {
  return {
    id: String(data.id),
    title: data.title as string,
    templateId: (data.templateId as string) || 'classic',
    style: data.style as Resume['style'],
    blocks: ((data.blocks as Block[]) || []).map(b => ({
      ...b,
      id: b.id || crypto.randomUUID(),
      collapsed: b.collapsed ?? false,
    })),
    createdAt: data.createdAt as string,
    updatedAt: data.updatedAt as string,
  }
}

export async function fetchResumes(): Promise<Resume[]> {
  const res = await apiFetch('/api/resumes')
  const data = await res.json()
  return data.map(toResume)
}

export async function fetchResume(id: string): Promise<Resume | null> {
  const res = await apiFetch(`/api/resumes/${id}`)
  if (!res.ok) return null
  return toResume(await res.json())
}

export async function createResume(
  title: string,
  templateId?: string,
  styleOverride?: Partial<import('./types').ResumeStyle>
): Promise<Resume> {
  const body: Record<string, unknown> = { title, templateId }
  if (styleOverride) body.style = styleOverride
  const res = await apiFetch('/api/resumes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return toResume(await res.json())
}

export async function updateResume(resume: Resume): Promise<Resume> {
  const res = await apiFetch(`/api/resumes/${resume.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: resume.title,
      templateId: resume.templateId,
      style: resume.style,
      blocks: resume.blocks,
    }),
  })
  return toResume(await res.json())
}

export async function deleteResumeApi(id: string): Promise<void> {
  await apiFetch(`/api/resumes/${id}`, { method: 'DELETE' })
}

export async function uploadPhoto(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiFetch('/api/upload', { method: 'POST', body: formData })
  const data = await res.json()
  return data.url
}

export async function exportResumeJson(id: string): Promise<string> {
  const resume = await fetchResume(id)
  return JSON.stringify(resume, null, 2)
}

export async function importResumeJson(json: string): Promise<Resume | null> {
  try {
    const data = JSON.parse(json)
    const resume = await createResume(data.title || '가져온 이력서')
    const updated = { ...resume, blocks: data.blocks || [] }
    return await updateResume(updated)
  } catch {
    return null
  }
}

export async function parseResumeFile(file: File): Promise<Block[]> {
  const formData = new FormData()
  formData.append('file', file)
  const token = getAccessToken()
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/api/resumes/parse`, {
    method: 'POST',
    headers,
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || '파싱 실패')
  }
  const data = await res.json()
  return (data.blocks || []).map((block: Block) => ({
    ...block,
    id: block.id || crypto.randomUUID(),
    collapsed: false,
  }))
}

