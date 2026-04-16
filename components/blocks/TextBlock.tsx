'use client'

interface Props {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function TextBlock({ content, onChange, placeholder }: Props) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[120px]"
      placeholder={placeholder || '내용을 입력하세요...'}
      rows={5}
    />
  )
}
