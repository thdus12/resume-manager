'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Resume, ResumeStyle } from '@/lib/types'
import { fetchResume, updateResume, exportResumeJson, parseResumeFile } from '@/lib/api-client'
import { generateWord } from '@/lib/word-generator'
import { generatePdf } from '@/lib/pdf-generator'
import { getTemplate } from '@/lib/templates'
import ResumeEditor from '@/components/ResumeEditor'
import ResumePreview from '@/components/ResumePreview'
import StylePanel from '@/components/StylePanel'

export default function ResumeEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingTitle, setEditingTitle] = useState(false)
  const [parsing, setParsing] = useState(false)
  const aiInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchResume(id).then((data) => {
      if (!data) {
        router.push('/')
        return
      }
      setResume(data)
      setLoading(false)
    })
  }, [id, router])

  const handleUpdate = useCallback((updated: Resume) => {
    setResume(updated)
  }, [])

  const handleTitleSave = async () => {
    if (!resume) return
    await updateResume(resume)
    setEditingTitle(false)
  }

  const handleStyleChange = async (style: ResumeStyle) => {
    if (!resume) return
    const updated = { ...resume, style }
    setResume(updated)
    await updateResume(updated)
  }

  const handleAiClick = () => {
    aiInputRef.current?.click()
  }

  const handleAiParse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !resume) return
    e.target.value = ''

    setParsing(true)
    try {
      const blocks = await parseResumeFile(file)
      const updated = await updateResume({ ...resume, blocks })
      setResume(updated)
    } catch (err) {
      alert(err instanceof Error ? err.message : '파싱에 실패했습니다')
    } finally {
      setParsing(false)
    }
  }

  const handleReset = async () => {
    if (!resume) return
    if (!confirm('모든 내용을 초기화하시겠습니까? 블록 구성은 유지되고 데이터만 비워집니다.')) return
    const template = getTemplate(resume.templateId)
    if (!template) return
    const emptyBlocks = template.defaultBlocks.map((b) => ({
      ...b,
      id: crypto.randomUUID(),
      collapsed: false,
    }))
    const updated = await updateResume({ ...resume, blocks: emptyBlocks })
    setResume(updated)
  }

  const handleExportJson = async () => {
    if (!resume) return
    const json = await exportResumeJson(resume.id)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resume.title}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportWord = async () => {
    if (!resume) return
    await generateWord(resume.blocks, resume.title)
  }

  const handleExportPdf = () => {
    generatePdf()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        불러오는 중...
      </div>
    )
  }

  if (!resume) return null

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            &larr; 목록
          </button>
          {editingTitle ? (
            <input
              type="text"
              value={resume.title}
              onChange={(e) => setResume({ ...resume, title: e.target.value })}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              className="text-lg font-bold border-b-2 border-blue-500 outline-none px-1"
              autoFocus
            />
          ) : (
            <h1
              className="text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => setEditingTitle(true)}
              title="클릭하여 제목 수정"
            >
              {resume.title}
            </h1>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAiClick}
            disabled={parsing}
            className="px-3 py-1.5 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {parsing ? 'AI 분석 중...' : 'AI 이력서 가져오기'}
          </button>
          <input
            ref={aiInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleAiParse}
            className="hidden"
          />
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs border border-orange-300 text-orange-600 rounded-md hover:bg-orange-50 transition-colors"
          >
            초기화
          </button>
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
          >
            JSON
          </button>
          <button
            onClick={handleExportWord}
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Word
          </button>
          <button
            onClick={handleExportPdf}
            className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            PDF
          </button>
        </div>
      </header>

      {/* AI 파싱 중 오버레이 */}
      {parsing && (
        <div className="bg-purple-50 border-b border-purple-200 px-4 py-3 text-center print:hidden">
          <div className="animate-pulse text-purple-600 text-sm font-medium">
            AI가 이력서를 분석하고 있습니다...
          </div>
        </div>
      )}

      {/* 에디터 + 스타일패널 + 미리보기 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측: 편집 영역 */}
        <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto print:hidden flex flex-col">
          {/* 스타일 패널 (항상 표시) */}
          <div className="border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <StylePanel style={resume.style} onChange={handleStyleChange} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ResumeEditor resume={resume} onUpdate={handleUpdate} />
          </div>
        </div>

        {/* 우측: 미리보기 */}
        <div className="w-1/2 overflow-y-auto bg-gray-100 p-4">
          <ResumePreview blocks={resume.blocks} style={resume.style} />
        </div>
      </div>
    </div>
  )
}
