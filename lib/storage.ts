import fs from 'fs'
import path from 'path'
import { Resume } from './types'

const DATA_DIR = path.join(process.cwd(), 'data', 'resumes')
const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads')

// 디렉토리 초기화
function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export function getResumes(): Resume[] {
  ensureDirs()
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'))
  const resumes: Resume[] = []
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8')
      resumes.push(JSON.parse(raw))
    } catch {
      // 손상된 파일은 무시
    }
  }
  return resumes.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function getResume(id: string): Resume | null {
  ensureDirs()
  const filePath = path.join(DATA_DIR, `${id}.json`)
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return null
  }
}

export function saveResume(resume: Resume): Resume {
  ensureDirs()
  const now = new Date().toISOString()
  const filePath = path.join(DATA_DIR, `${resume.id}.json`)
  const isNew = !fs.existsSync(filePath)

  const saved: Resume = {
    ...resume,
    createdAt: isNew ? now : resume.createdAt,
    updatedAt: now,
  }
  fs.writeFileSync(filePath, JSON.stringify(saved, null, 2), 'utf-8')
  return saved
}

export function deleteResume(id: string): boolean {
  ensureDirs()
  const filePath = path.join(DATA_DIR, `${id}.json`)
  if (!fs.existsSync(filePath)) return false
  fs.unlinkSync(filePath)
  return true
}

export function getUploadDir(): string {
  ensureDirs()
  return UPLOAD_DIR
}
