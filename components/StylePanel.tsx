'use client'

import { ResumeStyle } from '@/lib/types'

interface Props {
  style: ResumeStyle
  onChange: (style: ResumeStyle) => void
}

const COLOR_PRESETS = [
  '#1a1a1a', '#6b7280', '#1e40af', '#7c3aed',
  '#0ea5e9', '#059669', '#d97706', '#dc2626',
]

export default function StylePanel({ style, onChange }: Props) {
  const update = <K extends keyof ResumeStyle>(key: K, value: ResumeStyle[K]) => {
    onChange({ ...style, [key]: value })
  }

  return (
    <div className="p-3 space-y-4 text-sm">
      {/* 메인 색상 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">메인 색상</label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              onClick={() => update('primaryColor', color)}
              className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: color,
                borderColor: style.primaryColor === color ? '#fff' : 'transparent',
                boxShadow: style.primaryColor === color ? `0 0 0 2px ${color}` : 'none',
              }}
            />
          ))}
          <input
            type="color"
            value={style.primaryColor}
            onChange={(e) => update('primaryColor', e.target.value)}
            className="w-6 h-6 rounded cursor-pointer border-0 p-0"
          />
        </div>
      </div>

      {/* 폰트 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">폰트</label>
        <select
          value={style.fontFamily}
          onChange={(e) => update('fontFamily', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
        >
          <option value="Malgun Gothic">맑은 고딕</option>
          <option value="Pretendard">Pretendard</option>
          <option value="Noto Sans KR">Noto Sans KR</option>
          <option value="Arial">Arial</option>
        </select>
      </div>

      {/* 글자 크기 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">글자 크기</label>
        <div className="flex gap-1">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <button
              key={size}
              onClick={() => update('fontSize', size)}
              className={`flex-1 py-1 text-xs rounded-md border transition-colors ${
                style.fontSize === size
                  ? 'bg-blue-50 border-blue-400 text-blue-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {{ sm: '작게', md: '보통', lg: '크게' }[size]}
            </button>
          ))}
        </div>
      </div>

      {/* 레이아웃 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">레이아웃</label>
        <div className="flex gap-1">
          {(['single', 'two-column'] as const).map((layout) => (
            <button
              key={layout}
              onClick={() => update('layout', layout)}
              className={`flex-1 py-1 text-xs rounded-md border transition-colors ${
                style.layout === layout
                  ? 'bg-blue-50 border-blue-400 text-blue-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {layout === 'single' ? '1단' : '2단'}
            </button>
          ))}
        </div>
      </div>

      {/* 섹션 스타일 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">섹션 제목 스타일</label>
        <div className="flex gap-1">
          {(['underline', 'background', 'side-accent'] as const).map((s) => (
            <button
              key={s}
              onClick={() => update('sectionStyle', s)}
              className={`flex-1 py-1 text-xs rounded-md border transition-colors ${
                style.sectionStyle === s
                  ? 'bg-blue-50 border-blue-400 text-blue-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {{ underline: '밑줄', background: '배경', 'side-accent': '좌측선' }[s]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
