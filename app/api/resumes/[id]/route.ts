import { NextResponse } from 'next/server'
import { getResume, saveResume, deleteResume } from '@/lib/storage'

interface Params {
  params: Promise<{ id: string }>
}

// GET /api/resumes/[id] — 이력서 상세
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  const resume = getResume(id)
  if (!resume) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(resume)
}

// PUT /api/resumes/[id] — 이력서 수정
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params
  const existing = getResume(id)
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const body = await request.json()
  const updated = saveResume({ ...existing, ...body, id })
  return NextResponse.json(updated)
}

// DELETE /api/resumes/[id] — 이력서 삭제
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params
  const deleted = deleteResume(id)
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
