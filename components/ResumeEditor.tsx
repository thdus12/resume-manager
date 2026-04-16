'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Block, BlockData, BlockType, Resume } from '@/lib/types'
import { BLOCK_METAS, getBlockMeta } from '@/lib/block-schema'
import { updateResume } from '@/lib/api-client'
import BlockWrapper from './blocks/BlockWrapper'

interface Props {
  resume: Resume
  onUpdate: (resume: Resume) => void
}

export default function ResumeEditor({ resume, onUpdate }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(resume.blocks)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // 디바운스 자동 저장
  const autoSave = useCallback(
    (updatedBlocks: Block[]) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(async () => {
        const updated = { ...resume, blocks: updatedBlocks }
        const saved = await updateResume(updated)
        onUpdate(saved)
      }, 800)
    },
    [resume, onUpdate]
  )

  const updateBlocks = useCallback(
    (newBlocks: Block[]) => {
      setBlocks(newBlocks)
      autoSave(newBlocks)
    },
    [autoSave]
  )

  // resume이 외부에서 변경되면 동기화
  useEffect(() => {
    setBlocks(resume.blocks)
  }, [resume.blocks])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    const reordered = arrayMove(blocks, oldIndex, newIndex)
    updateBlocks(reordered)
  }

  const addBlock = (type: BlockType) => {
    const meta = getBlockMeta(type)
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type,
      title: meta.defaultTitle,
      data: meta.createDefault(),
      collapsed: false,
    }
    updateBlocks([...blocks, newBlock])
    setShowAddMenu(false)
  }

  const handleDataChange = (blockId: string, data: BlockData) => {
    const updated = blocks.map((b) =>
      b.id === blockId ? { ...b, data } : b
    )
    updateBlocks(updated)
  }

  const handleToggleCollapse = (blockId: string) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, collapsed: !b.collapsed } : b
      )
    )
  }

  const handleDelete = (blockId: string) => {
    updateBlocks(blocks.filter((b) => b.id !== blockId))
  }

  const handleTitleChange = (blockId: string, title: string) => {
    const updated = blocks.map((b) =>
      b.id === blockId ? { ...b, title } : b
    )
    updateBlocks(updated)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {blocks.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <p className="text-lg mb-2">아직 항목이 없습니다</p>
            <p className="text-sm">아래 버튼으로 원하는 항목을 추가하세요</p>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {blocks.map((block) => (
              <BlockWrapper
                key={block.id}
                block={block}
                onDataChange={handleDataChange}
                onToggleCollapse={handleToggleCollapse}
                onDelete={handleDelete}
                onTitleChange={handleTitleChange}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* 항목 추가 버튼 */}
      <div className="border-t border-gray-200 p-3 bg-white relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium"
        >
          + 항목 추가
        </button>

        {showAddMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-2 gap-1">
            {BLOCK_METAS.map((meta) => (
              <button
                key={meta.type}
                onClick={() => addBlock(meta.type)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors text-left"
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
