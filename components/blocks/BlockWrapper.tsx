'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Block, BlockData } from '@/lib/types'
import { getBlockMeta } from '@/lib/block-schema'
import BlockRenderer from './BlockRenderer'

interface Props {
  block: Block
  onDataChange: (blockId: string, data: BlockData) => void
  onToggleCollapse: (blockId: string) => void
  onDelete: (blockId: string) => void
  onTitleChange: (blockId: string, title: string) => void
}

export default function BlockWrapper({
  block,
  onDataChange,
  onToggleCollapse,
  onDelete,
  onTitleChange,
}: Props) {
  const meta = getBlockMeta(block.type)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg shadow-sm mb-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
          title="드래그하여 순서 변경"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="3" r="1.5" />
            <circle cx="11" cy="3" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="13" r="1.5" />
            <circle cx="11" cy="13" r="1.5" />
          </svg>
        </button>

        <span className="text-sm">{meta.icon}</span>

        <input
          type="text"
          value={block.title}
          onChange={(e) => onTitleChange(block.id, e.target.value)}
          className="flex-1 text-sm font-medium bg-transparent border-none outline-none focus:ring-0 p-0"
        />

        <button
          onClick={() => onToggleCollapse(block.id)}
          className="text-gray-400 hover:text-gray-600 text-sm px-1"
        >
          {block.collapsed ? '펼치기' : '접기'}
        </button>

        <button
          onClick={() => onDelete(block.id)}
          className="text-gray-400 hover:text-red-500 text-sm px-1"
        >
          삭제
        </button>
      </div>

      {/* Body */}
      {!block.collapsed && (
        <div className="p-3">
          <BlockRenderer
            block={block}
            onChange={(data) => onDataChange(block.id, data)}
          />
        </div>
      )}
    </div>
  )
}
