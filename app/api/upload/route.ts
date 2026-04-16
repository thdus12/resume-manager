import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { getUploadDir } from '@/lib/storage'

// POST /api/upload — 사진 업로드
export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // 파일 확장자 추출
  const ext = path.extname(file.name) || '.jpg'
  const filename = `${crypto.randomUUID()}${ext}`
  const uploadDir = getUploadDir()
  const filePath = path.join(uploadDir, filename)

  // 파일 저장
  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))

  return NextResponse.json({
    url: `/api/uploads/${filename}`,
    filename,
  })
}
