'use client'

import { Block, BlockData, ProfileData, EducationData, ExperienceData, ProjectData, SkillData, CertificateData, IntroductionData, CustomData } from '@/lib/types'
import ProfileBlock from './ProfileBlock'
import ListBlock from './ListBlock'
import TextBlock from './TextBlock'

interface Props {
  block: Block
  onChange: (data: BlockData) => void
}

export default function BlockRenderer({ block, onChange }: Props) {
  switch (block.type) {
    case 'profile':
      return (
        <ProfileBlock
          data={block.data as ProfileData}
          onChange={onChange}
        />
      )

    case 'education':
      return (
        <ListBlock
          items={(block.data as EducationData).items}
          onChange={(items) => onChange({ items })}
          createEmpty={() => ({
            id: crypto.randomUUID(),
            school: '',
            major: '',
            degree: '',
            startDate: '',
            endDate: '',
          })}
          addLabel="학력 추가"
          fields={[
            { key: 'school', label: '학교명', placeholder: '○○대학교' },
            { key: 'major', label: '전공', placeholder: '컴퓨터공학' },
            { key: 'degree', label: '학위', placeholder: '학사' },
            { key: 'startDate', label: '입학', type: 'date' },
            { key: 'endDate', label: '졸업', type: 'date' },
          ]}
        />
      )

    case 'experience':
      return (
        <ListBlock
          items={(block.data as ExperienceData).items}
          onChange={(items) => onChange({ items })}
          createEmpty={() => ({
            id: crypto.randomUUID(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: '',
            techStack: '',
          })}
          addLabel="경력 추가"
          fields={[
            { key: 'company', label: '회사명', placeholder: '○○회사' },
            { key: 'position', label: '직책/직급', placeholder: 'Backend Developer 대리' },
            { key: 'startDate', label: '입사', type: 'date' },
            { key: 'endDate', label: '퇴사', type: 'date' },
            { key: 'description', label: '업무 내용', type: 'textarea', colSpan: 2, placeholder: '주요 업무 및 성과를 입력하세요\n- 항목1\n  - 세부 내용\n  → 성과/결과' },
            { key: 'techStack', label: 'Tech Stack', colSpan: 2, placeholder: 'Java 17, Spring Boot 3.3, JPA, QueryDSL, PostgreSQL' },
          ]}
        />
      )

    case 'project':
      return (
        <ListBlock
          items={(block.data as ProjectData).items}
          onChange={(items) => onChange({ items })}
          createEmpty={() => ({
            id: crypto.randomUUID(),
            name: '',
            role: '',
            startDate: '',
            endDate: '',
            techStack: '',
            description: '',
          })}
          addLabel="프로젝트 추가"
          fields={[
            { key: 'name', label: '프로젝트명', placeholder: '프로젝트 이름' },
            { key: 'role', label: '역할', placeholder: '백엔드 개발' },
            { key: 'startDate', label: '시작', type: 'date' },
            { key: 'endDate', label: '종료', type: 'date' },
            { key: 'techStack', label: '기술 스택', colSpan: 2, placeholder: 'Java, Spring Boot, MySQL' },
            { key: 'description', label: '설명', type: 'textarea', colSpan: 2, placeholder: '프로젝트 상세 설명' },
          ]}
        />
      )

    case 'skill':
      return (
        <ListBlock
          items={(block.data as SkillData).items}
          onChange={(items) => onChange({ items })}
          createEmpty={() => ({
            id: crypto.randomUUID(),
            category: '',
            skills: '',
          })}
          addLabel="카테고리 추가"
          fields={[
            { key: 'category', label: '분류', placeholder: 'Backend' },
            { key: 'skills', label: '기술', placeholder: 'Java, Spring, MySQL' },
          ]}
        />
      )

    case 'certificate':
      return (
        <ListBlock
          items={(block.data as CertificateData).items}
          onChange={(items) => onChange({ items })}
          createEmpty={() => ({
            id: crypto.randomUUID(),
            name: '',
            issuer: '',
            date: '',
          })}
          addLabel="자격증 추가"
          fields={[
            { key: 'name', label: '자격증명', placeholder: '정보처리기사' },
            { key: 'issuer', label: '발급기관', placeholder: '한국산업인력공단' },
            { key: 'date', label: '취득일', type: 'date' },
          ]}
        />
      )

    case 'introduction':
      return (
        <TextBlock
          content={(block.data as IntroductionData).content}
          onChange={(content) => onChange({ content })}
          placeholder="자기소개를 입력하세요..."
        />
      )

    case 'custom': {
      const customData = block.data as CustomData
      return (
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">항목 이름</label>
            <input
              type="text"
              value={customData.label}
              onChange={(e) => onChange({ ...customData, label: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="항목 이름"
            />
          </div>
          <TextBlock
            content={customData.content}
            onChange={(content) => onChange({ ...customData, content })}
          />
        </div>
      )
    }

    default:
      return null
  }
}
