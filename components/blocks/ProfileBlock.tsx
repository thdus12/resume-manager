'use client'

import { useRef } from 'react'
import { ProfileData } from '@/lib/types'
import { uploadPhoto } from '@/lib/api-client'

interface Props {
  data: ProfileData
  onChange: (data: ProfileData) => void
}

export default function ProfileBlock({ data, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = (field: keyof ProfileData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadPhoto(file)
    update('photo', url)
  }

  return (
    <div className="flex gap-4">
      {/* 사진 영역 */}
      <div className="flex-shrink-0">
        <div
          className="w-28 h-36 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
        >
          {data.photo ? (
            <img
              src={data.photo}
              alt="증명사진"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-gray-400 text-xs">
              <div className="text-2xl mb-1">+</div>
              증명사진
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        {data.photo && (
          <button
            onClick={() => update('photo', '')}
            className="text-xs text-red-400 hover:text-red-600 mt-1 w-full text-center"
          >
            사진 삭제
          </button>
        )}
      </div>

      {/* 정보 입력 영역 */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="홍길동"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => update('email', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="hong@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="010-1234-5678"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => update('address', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="서울시 강남구"
          />
        </div>
      </div>
    </div>
  )
}
