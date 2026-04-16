import { NextResponse } from 'next/server'
import { getResumes, saveResume } from '@/lib/storage'
import { Resume } from '@/lib/types'
import { getTemplate, TEMPLATES } from '@/lib/templates'

// GET /api/resumes — 이력서 목록
export async function GET() {
  const resumes = getResumes()
  return NextResponse.json(resumes)
}

// POST /api/resumes — 이력서 생성 (템플릿 기반, 가라데이터로 시작)
export async function POST(request: Request) {
  const body = await request.json()
  const templateId = body.templateId || 'classic'
  const template = getTemplate(templateId) || TEMPLATES[0]

  // sampleBlocks(가라데이터)로 시작하여 사용자가 편집할 수 있도록 함
  // 각 블록에 새 ID 부여 (sampleBlocks의 ID가 고정이므로)
  const initialBlocks = (body.blocks || template.sampleBlocks).map((b: import('@/lib/types').Block) => ({
    ...b,
    id: crypto.randomUUID(),
  }))

  const resume: Resume = {
    id: crypto.randomUUID(),
    title: body.title || '새 이력서',
    templateId,
    style: body.style || template.style,
    blocks: initialBlocks,
    createdAt: '',
    updatedAt: '',
  }
  const saved = saveResume(resume)
  return NextResponse.json(saved, { status: 201 })
}
