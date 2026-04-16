'use client'

import { useRef, useCallback } from 'react'

interface FieldDef {
  key: string
  label: string
  type?: 'text' | 'date' | 'textarea'
  placeholder?: string
  colSpan?: number
}

interface Props<T extends { id: string }> {
  items: T[]
  fields: FieldDef[]
  onChange: (items: T[]) => void
  createEmpty: () => T
  addLabel: string
}

// 들여쓰기 레벨 정의
// level 0: plain text (소제목)
// level 1: "- " (불릿)
// level 2: "  - " (하위 불릿)
// special: "→ " (성과)

function getLineInfo(line: string) {
  if (line.startsWith('  - ')) return { level: 2, prefix: '  - ', text: line.slice(4) }
  if (line.startsWith('  • ')) return { level: 2, prefix: '  • ', text: line.slice(4) }
  if (line.startsWith('- ')) return { level: 1, prefix: '- ', text: line.slice(2) }
  if (line.startsWith('• ')) return { level: 1, prefix: '• ', text: line.slice(2) }
  if (line.startsWith('→ ')) return { level: -1, prefix: '→ ', text: line.slice(2) }
  return { level: 0, prefix: '', text: line }
}

function prefixForLevel(level: number): string {
  if (level <= 0) return ''
  if (level === 1) return '- '
  return '  - '
}

// 현재 커서가 있는 줄의 시작/끝 인덱스
function getCurrentLine(value: string, cursorPos: number) {
  const lineStart = value.lastIndexOf('\n', cursorPos - 1) + 1
  let lineEnd = value.indexOf('\n', cursorPos)
  if (lineEnd === -1) lineEnd = value.length
  return { lineStart, lineEnd, lineText: value.substring(lineStart, lineEnd) }
}

function handleTextareaKeyDown(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  onUpdate: (value: string) => void
) {
  const ta = e.currentTarget
  const { selectionStart, selectionEnd, value } = ta

  // Tab: 들여쓰기 증가 (level up)
  // Shift+Tab: 들여쓰기 감소 (level down)
  if (e.key === 'Tab') {
    e.preventDefault()
    const lines = value.split('\n')
    const before = value.substring(0, selectionStart)
    const startLineIdx = before.split('\n').length - 1

    // 단일 줄 (선택 없이 커서만)
    if (selectionStart === selectionEnd) {
      const info = getLineInfo(lines[startLineIdx])

      let newLine: string
      if (e.shiftKey) {
        // Shift+Tab: 레벨 다운
        if (info.level === -1) {
          // → 는 Shift+Tab → 불릿으로
          newLine = '- ' + info.text
        } else if (info.level <= 0) {
          newLine = info.text // 이미 plain
        } else {
          newLine = prefixForLevel(info.level - 1) + info.text
        }
      } else {
        // Tab: 레벨 업
        if (info.level === -1) {
          newLine = lines[startLineIdx] // → 는 Tab 무시
        } else if (info.level >= 2) {
          newLine = lines[startLineIdx] // max level
        } else {
          newLine = prefixForLevel(info.level + 1) + info.text
        }
      }

      const oldLine = lines[startLineIdx]
      lines[startLineIdx] = newLine
      const newValue = lines.join('\n')
      onUpdate(newValue)

      const diff = newLine.length - oldLine.length
      const newCursor = selectionStart + diff
      requestAnimationFrame(() => {
        ta.focus()
        ta.setSelectionRange(newCursor, newCursor)
      })
    } else {
      // 여러 줄 선택 시: 선택된 모든 줄 레벨 변경
      const afterStart = value.substring(0, selectionEnd)
      const endLineIdx = afterStart.split('\n').length - 1

      for (let i = startLineIdx; i <= endLineIdx; i++) {
        const info = getLineInfo(lines[i])
        if (e.shiftKey) {
          if (info.level === -1) {
            lines[i] = '- ' + info.text
          } else if (info.level > 0) {
            lines[i] = prefixForLevel(info.level - 1) + info.text
          }
        } else {
          if (info.level >= 0 && info.level < 2) {
            lines[i] = prefixForLevel(info.level + 1) + info.text
          }
        }
      }

      const newValue = lines.join('\n')
      onUpdate(newValue)

      // 선택 범위 복원
      let newStart = 0
      for (let i = 0; i < startLineIdx; i++) newStart += lines[i].length + 1
      let newEnd = newStart
      for (let i = startLineIdx; i <= endLineIdx; i++) newEnd += lines[i].length + (i < endLineIdx ? 1 : 0)
      requestAnimationFrame(() => {
        ta.focus()
        ta.setSelectionRange(newStart, newEnd)
      })
    }
    return
  }

  // Enter: 이전 줄 서식 유지
  if (e.key === 'Enter') {
    const { lineText } = getCurrentLine(value, selectionStart)
    const info = getLineInfo(lineText)

    // 빈 불릿에서 Enter → 서식 해제하고 빈 줄
    if (info.level !== 0 && info.text.trim() === '') {
      e.preventDefault()
      const { lineStart, lineEnd } = getCurrentLine(value, selectionStart)
      const newValue = value.substring(0, lineStart) + value.substring(lineEnd)
      onUpdate(newValue)
      requestAnimationFrame(() => {
        ta.focus()
        ta.setSelectionRange(lineStart, lineStart)
      })
      return
    }

    // 서식 있는 줄에서 Enter → 같은 서식으로 새 줄
    if (info.level !== 0) {
      e.preventDefault()
      const prefix = info.level === -1 ? '→ ' : prefixForLevel(info.level)
      const insert = '\n' + prefix
      const newValue = value.substring(0, selectionStart) + insert + value.substring(selectionEnd)
      onUpdate(newValue)
      const newCursor = selectionStart + insert.length
      requestAnimationFrame(() => {
        ta.focus()
        ta.setSelectionRange(newCursor, newCursor)
      })
      return
    }
  }

}

// -> 입력 시 → 로 자동 변환
function handleTextareaInput(
  e: React.FormEvent<HTMLTextAreaElement>,
  onUpdate: (value: string) => void
) {
  const ta = e.currentTarget
  const { selectionStart, value } = ta

  // 커서 앞 2글자가 -> 인지 확인
  if (selectionStart >= 2 && value.substring(selectionStart - 2, selectionStart) === '->') {
    const newValue = value.substring(0, selectionStart - 2) + '→' + value.substring(selectionStart)
    onUpdate(newValue)
    // 커서 보정 (2글자 -> 가 1글자 → 로 바뀌므로 -1)
    const newCursor = selectionStart - 1
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(newCursor, newCursor)
    })
  }
}

export default function ListBlock<T extends { id: string }>({
  items,
  fields,
  onChange,
  createEmpty,
  addLabel,
}: Props<T>) {
  const addItem = () => {
    onChange([...items, createEmpty()])
  }

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: string, value: string) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <ListItem
          key={item.id}
          item={item}
          idx={idx}
          fields={fields}
          onRemove={removeItem}
          onUpdate={updateItem}
        />
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + {addLabel}
      </button>
    </div>
  )
}

// 개별 항목 컴포넌트
function ListItem<T extends { id: string }>({
  item,
  idx,
  fields,
  onRemove,
  onUpdate,
}: {
  item: T
  idx: number
  fields: FieldDef[]
  onRemove: (id: string) => void
  onUpdate: (id: string, field: string, value: string) => void
}) {
  const handleKeyDown = useCallback(
    (fieldKey: string) => (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      handleTextareaKeyDown(e, (value) => onUpdate(item.id, fieldKey, value))
    },
    [item.id, onUpdate]
  )

  const handleInput = useCallback(
    (fieldKey: string) => (e: React.FormEvent<HTMLTextAreaElement>) => {
      handleTextareaInput(e, (value) => onUpdate(item.id, fieldKey, value))
    },
    [item.id, onUpdate]
  )

  return (
    <div className="border border-gray-200 rounded-md p-3 bg-gray-50 relative">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500 font-medium">#{idx + 1}</span>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-400 hover:text-red-600 text-sm"
        >
          삭제
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {fields.map((f) => (
          <div key={f.key} className={f.colSpan === 2 ? 'col-span-2' : ''}>
            <label className="block text-xs text-gray-600 mb-1">
              {f.label}
            </label>
            {f.type === 'textarea' ? (
              <div>
                <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-t-md px-2 py-1 border-b-0">
                  <span className="text-[10px] text-gray-400">
                    Tab 들여쓰기 · Shift+Tab 내어쓰기 · -&gt; 자동 →
                  </span>
                </div>
                <textarea
                  value={(item as Record<string, string>)[f.key] || ''}
                  onChange={(e) => onUpdate(item.id, f.key, e.target.value)}
                  onKeyDown={handleKeyDown(f.key)}
                  onInput={handleInput(f.key)}
                  className="w-full bg-white border border-gray-200 rounded-t-none rounded-b-md px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[60px]"
                  placeholder={f.placeholder}
                  rows={3}
                />
              </div>
            ) : (
              <input
                type={f.type === 'date' ? 'month' : 'text'}
                value={(item as Record<string, string>)[f.key] || ''}
                onChange={(e) => onUpdate(item.id, f.key, e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={f.placeholder}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
