'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Resume } from '@/lib/types'
import { fetchResumes, createResume, deleteResumeApi, importResumeJson } from '@/lib/api-client'
import { TEMPLATES } from '@/lib/templates'
import ResumePreview from '@/components/ResumePreview'

export default function HomePage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const loadResumes = async () => {
    const data = await fetchResumes()
    setResumes(data)
    setLoading(false)
  }

  useEffect(() => {
    loadResumes()
  }, [])

  const handleCreateFromTemplate = async (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId)
    const resume = await createResume(
      template?.name ? `${template.name} 이력서` : '새 이력서',
      templateId
    )
    router.push(`/resume/${resume.id}`)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 이력서를 삭제하시겠습니까?`)) return
    await deleteResumeApi(id)
    loadResumes()
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const result = await importResumeJson(text)
    if (result) {
      router.push(`/resume/${result.id}`)
    } else {
      alert('올바르지 않은 JSON 파일입니다.')
    }
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-12 px-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-gray-900">&apos;준비중&apos; 청년 아카이브</h1>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              JSON 가져오기
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>

        {/* 템플릿 선택 섹션 */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">템플릿으로 시작하기</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleCreateFromTemplate(template.id)}
                className="group text-left bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
              >
                {/* 축소된 실제 미리보기 */}
                <div className="relative h-[280px] overflow-hidden bg-gray-50 border-b border-gray-100">
                  <div
                    style={{
                      transform: 'scale(0.38)',
                      transformOrigin: 'top left',
                      width: '210mm',
                      minHeight: '297mm',
                      pointerEvents: 'none',
                    }}
                  >
                    <ResumePreview
                      blocks={template.sampleBlocks}
                      style={template.style}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
                </div>
                {/* 설명 */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 내 이력서 목록 */}
        {loading ? (
          <div className="text-center py-8 text-gray-400">불러오는 중...</div>
        ) : resumes.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">내 이력서</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: resume.style?.primaryColor || '#1a1a1a',
                      }}
                    />
                    <h3 className="font-medium text-gray-900 truncate">
                      {resume.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">
                    블록 {resume.blocks.length}개 | {resume.templateId || 'classic'}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    {new Date(resume.updatedAt).toLocaleDateString('ko-KR')} 수정
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/resume/${resume.id}`)}
                      className="flex-1 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100 transition-colors"
                    >
                      편집
                    </button>
                    <button
                      onClick={() => handleDelete(resume.id, resume.title)}
                      className="py-1.5 px-3 bg-red-50 text-red-500 text-sm rounded-md hover:bg-red-100 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
