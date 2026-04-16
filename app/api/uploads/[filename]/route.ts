import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { getUploadDir } from '@/lib/storage'

interface Params {
  params: Promise<{ filename: string }>
}

// GET /api/uploads/[filename] — 업로드된 파일 서빙
export async function GET(_request: Request, { params }: Params) {
  const { filename } = await params
  const filePath = path.join(getUploadDir(), filename)

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const buffer = await readFile(filePath)
  const ext = path.extname(filename).toLowerCase()

  const mimeMap: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  }

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': mimeMap[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
