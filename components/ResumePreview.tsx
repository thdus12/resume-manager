'use client'

import { CSSProperties } from 'react'
import {
  Block,
  ResumeStyle,
  ProfileData,
  EducationData,
  ExperienceData,
  ProjectData,
  SkillData,
  CertificateData,
  IntroductionData,
  CustomData,
} from '@/lib/types'

interface Props {
  blocks: Block[]
  style: ResumeStyle
}

const FONT_SIZE_MAP = { sm: '13px', md: '14px', lg: '15px' }

// ── 공통 컴포넌트 ──

function InlineCode({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        backgroundColor: color || 'rgba(247,246,243)',
        color: '#555',
        padding: '0.15em 0.4em',
        borderRadius: '3px',
        fontSize: '0.85em',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </span>
  )
}

function SkillTags({ skills, bgColor }: { skills: string; bgColor?: string }) {
  const items = skills.split(',').map((s) => s.trim()).filter(Boolean)
  return (
    <span style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap' }}>
      {items.map((skill, i) => (
        <InlineCode key={i} color={bgColor}>{skill}</InlineCode>
      ))}
    </span>
  )
}

function Divider({ color }: { color?: string }) {
  return (
    <hr style={{
      border: 'none',
      borderTop: `1px solid ${color || 'rgba(55, 53, 47, 0.15)'}`,
      margin: '1em 0',
    }} />
  )
}

function lightBg(hex: string, opacity = 0.1): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// ── 섹션 타이틀 (스타일별) ──

function SectionTitle({ title, style }: { title: string; style: ResumeStyle }) {
  // side-accent: bae-log 스타일 (큰 보라색 타이틀 + 아래 구분선)
  if (style.sectionStyle === 'side-accent') {
    return (
      <div style={{ marginTop: '2em', marginBottom: '1em' }}>
        <h3 style={{
          fontSize: '1.57em',
          fontWeight: 700,
          color: style.primaryColor,
          marginBottom: '0.5em',
        }}>
          {title}
        </h3>
        <hr style={{
          border: 'none',
          borderTop: '1px solid rgba(55, 53, 47, 0.15)',
          margin: 0,
        }} />
      </div>
    )
  }

  const base: CSSProperties = {
    fontSize: '1.14em',
    fontWeight: 700,
    marginTop: '1.7em',
    marginBottom: '0.85em',
  }

  if (style.sectionStyle === 'underline') {
    return (
      <h3 style={{
        ...base,
        color: style.primaryColor,
        borderBottom: `2px solid ${style.primaryColor}`,
        paddingBottom: '4px',
      }}>
        {title}
      </h3>
    )
  }

  if (style.sectionStyle === 'background') {
    return (
      <h3 style={{
        ...base,
        backgroundColor: style.primaryColor,
        color: '#fff',
        padding: '0.4em 1em',
        borderRadius: '4px',
      }}>
        {title}
      </h3>
    )
  }

  return (
    <h3 style={{
      ...base,
      color: style.primaryColor,
      borderLeft: `4px solid ${style.primaryColor}`,
      paddingLeft: '12px',
    }}>
      {title}
    </h3>
  )
}

// ── 불릿 포인트 렌더링 (중첩 지원) ──

function BulletContent({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div style={{ fontSize: '0.93em', color: '#444', lineHeight: 1.75 }}>
      {lines.map((line, i) => {
        const trimmed = line.trimStart()
        if (!trimmed) return <div key={i} style={{ height: '4px' }} />

        // → 결과/성과 라인
        if (trimmed.startsWith('→')) {
          return (
            <div key={i} style={{ paddingLeft: '1.7em', color: '#666', fontSize: '0.95em' }}>
              {trimmed}
            </div>
          )
        }

        // 들여쓰기 레벨 감지
        const indent = line.length - trimmed.length
        const isSubItem = indent >= 2

        // 이미 불릿이 있는 라인
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const content = trimmed.startsWith('-') ? `• ${trimmed.slice(1).trim()}` : trimmed
          return (
            <div key={i} style={{ paddingLeft: isSubItem ? '1.7em' : '0.3em', marginBottom: '1px' }}>
              {content}
            </div>
          )
        }

        // 불릿 없는 텍스트 → 볼드 소제목
        return (
          <div key={i} style={{
            fontWeight: 600,
            color: '#333',
            marginTop: i > 0 ? '0.6em' : '0',
            marginBottom: '2px',
          }}>
            • {trimmed}
          </div>
        )
      })}
    </div>
  )
}

// ── 프로필 ──

function ProfilePreview({ data, style }: { data: ProfileData; style: ResumeStyle }) {
  const isBaeLog = style.sectionStyle === 'side-accent'

  if (isBaeLog) {
    return (
      <div style={{ marginBottom: '0.5em' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.7em' }}>
          {data.photo && (
            <img
              src={data.photo}
              alt="프로필"
              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '50%' }}
            />
          )}
          <h2 style={{ fontSize: '1.85em', fontWeight: 800, color: '#111', margin: 0 }}>
            {data.name || '이름'}
            {data.name && (
              <span style={{ fontSize: '0.6em', fontWeight: 400, color: '#666', marginLeft: '8px' }}>
                , Backend Developer
              </span>
            )}
          </h2>
        </div>

        {/* Contact. */}
        <div style={{ marginBottom: '1em' }}>
          <h4 style={{ fontSize: '1em', fontWeight: 700, color: style.primaryColor, marginBottom: '0.5em' }}>
            Contact.
          </h4>
          <div style={{ fontSize: '0.93em', color: '#444', lineHeight: 2 }}>
            {data.email && <div><strong>Email</strong>. {data.email}</div>}
            {data.phone && <div><strong>Phone</strong>. {data.phone}</div>}
          </div>
        </div>

        {/* Channel. */}
        {data.address && (
          <div>
            <h4 style={{ fontSize: '1em', fontWeight: 700, color: style.primaryColor, marginBottom: '0.5em' }}>
              Channel.
            </h4>
            <div style={{ fontSize: '0.93em', color: '#444', lineHeight: 2 }}>
              <div>{data.address}</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // 기본 프로필 (Classic / Minimal)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '0.5em' }}>
      {data.photo && (
        <img
          src={data.photo}
          alt="증명사진"
          style={{ width: '96px', height: '128px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
        />
      )}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '2em', fontWeight: 800, color: '#111', margin: '0 0 0.3em 0' }}>
          {data.name || '이름'}
        </h2>
        <div style={{ fontSize: '0.93em', color: '#666', lineHeight: 1.8 }}>
          {data.email && <span>{data.email}</span>}
          {data.email && data.phone && <span style={{ margin: '0 8px', color: '#ddd' }}>|</span>}
          {data.phone && <span>{data.phone}</span>}
          {(data.email || data.phone) && data.address && <span style={{ margin: '0 8px', color: '#ddd' }}>|</span>}
          {data.address && <span>{data.address}</span>}
        </div>
      </div>
    </div>
  )
}

// ── 학력 ──

function EducationPreview({ data, title, style }: { data: EducationData; title: string; style: ResumeStyle }) {
  if (data.items.length === 0) return null
  const isBaeLog = style.sectionStyle === 'side-accent'

  return (
    <div>
      <SectionTitle title={title} style={style} />
      {data.items.map((item) => (
        <div key={item.id} style={{ marginBottom: '0.7em', lineHeight: 1.75 }}>
          {isBaeLog ? (
            <>
              <div style={{ fontWeight: 600, fontSize: '1em' }}>
                🎓 {item.major} {item.degree && <InlineCode>{item.degree}</InlineCode>}
              </div>
              <div style={{ fontSize: '0.93em', color: '#666' }}>
                {item.school} | {item.startDate}~{item.endDate}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 600, fontSize: '1em' }}>{item.school}</span>
                <span style={{ fontSize: '0.86em', color: '#999' }}>{item.startDate} ~ {item.endDate}</span>
              </div>
              <div style={{ fontSize: '0.93em', color: '#666' }}>
                {item.major} {item.degree && <InlineCode>{item.degree}</InlineCode>}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

// ── 경력 ──

function ExperiencePreview({ data, title, style }: { data: ExperienceData; title: string; style: ResumeStyle }) {
  if (data.items.length === 0) return null
  const isBaeLog = style.sectionStyle === 'side-accent'

  if (isBaeLog) {
    return (
      <div>
        <SectionTitle title={title} style={style} />
        {data.items.map((item, idx) => (
          <div key={item.id}>
            {idx > 0 && <Divider />}
            <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '0 24px', marginBottom: '1em' }}>
              {/* 왼쪽: 회사 정보 */}
              <div style={{ paddingTop: '2px' }}>
                <div style={{ fontWeight: 700, fontSize: '1.07em', color: '#111', marginBottom: '4px' }}>
                  🏢 {item.company}
                </div>
                <div style={{ fontSize: '0.86em', color: '#888', marginBottom: '2px' }}>
                  {item.position}
                </div>
                <div style={{ fontSize: '0.86em', color: '#999' }}>
                  {item.startDate} - {item.endDate}
                </div>
              </div>

              {/* 오른쪽: 상세 */}
              <div>
                {item.description && (
                  <>
                    <h4 style={{ fontSize: '0.93em', fontWeight: 700, color: '#333', margin: '0 0 0.4em 0' }}>
                      What did I do
                    </h4>
                    <BulletContent text={item.description} />
                  </>
                )}

                {item.techStack && (
                  <div style={{ marginTop: '0.85em' }}>
                    <h4 style={{ fontSize: '0.93em', fontWeight: 700, color: '#333', marginBottom: '0.4em' }}>
                      Tech Stack
                    </h4>
                    <SkillTags skills={item.techStack} bgColor="rgba(247,246,243)" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 기본 경력 레이아웃 (Classic / Minimal)
  return (
    <div>
      <SectionTitle title={title} style={style} />
      {data.items.map((item, idx) => (
        <div key={item.id}>
          {idx > 0 && <Divider />}
          <div style={{ marginBottom: '0.4em' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.07em', color: style.primaryColor }}>{item.company}</span>
              <span style={{ fontSize: '0.86em', color: '#999' }}>{item.startDate} ~ {item.endDate}</span>
            </div>
            <div style={{ fontSize: '0.93em', color: '#666', marginBottom: '0.4em' }}>{item.position}</div>
            {item.description && <BulletContent text={item.description} />}
            {item.techStack && (
              <div style={{ marginTop: '0.6em' }}>
                <SkillTags skills={item.techStack} bgColor={lightBg(style.primaryColor, 0.12)} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 프로젝트 ──

function ProjectPreview({ data, title, style }: { data: ProjectData; title: string; style: ResumeStyle }) {
  if (data.items.length === 0) return null
  const isBaeLog = style.sectionStyle === 'side-accent'

  return (
    <div>
      <SectionTitle title={title} style={style} />
      {data.items.map((item, idx) => (
        <div key={item.id}>
          {idx > 0 && <Divider />}
          <div style={{ marginBottom: '0.4em' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.07em', color: isBaeLog ? '#111' : style.primaryColor }}>
                {item.name}
              </span>
              <span style={{ fontSize: '0.86em', color: '#999' }}>{item.startDate} ~ {item.endDate}</span>
            </div>
            <div style={{ fontSize: '0.93em', color: '#666', marginBottom: '0.4em' }}>{item.role}</div>
            {item.description && <BulletContent text={item.description} />}
            {item.techStack && (
              <div style={{ marginTop: '0.6em' }}>
                <SkillTags skills={item.techStack} bgColor={isBaeLog ? 'rgba(247,246,243)' : lightBg(style.primaryColor, 0.12)} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 기술 스택 ──

function SkillPreview({ data, title, style }: { data: SkillData; title: string; style: ResumeStyle }) {
  if (data.items.length === 0) return null
  const isBaeLog = style.sectionStyle === 'side-accent'
  const tagBg = isBaeLog ? 'rgba(247,246,243)' : lightBg(style.primaryColor, 0.12)

  return (
    <div>
      <SectionTitle title={title} style={style} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.7em 1.7em',
      }}>
        {data.items.map((item) => (
          <div key={item.id} style={{ lineHeight: 1.75 }}>
            <div style={{
              fontWeight: 600,
              color: isBaeLog ? '#111' : style.primaryColor,
              fontSize: '0.93em',
              marginBottom: '4px',
            }}>
              {item.category}
            </div>
            <SkillTags skills={item.skills} bgColor={tagBg} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 자격증 ──

function CertificatePreview({ data, title, style }: { data: CertificateData; title: string; style: ResumeStyle }) {
  if (data.items.length === 0) return null
  return (
    <div>
      <SectionTitle title={title} style={style} />
      {data.items.map((item) => (
        <div key={item.id} style={{ fontSize: '0.93em', marginBottom: '0.4em', lineHeight: 1.75 }}>
          <strong>{item.name}</strong>
          <span style={{ color: '#888', marginLeft: '8px', fontSize: '0.9em' }}>({item.date})</span>
        </div>
      ))}
    </div>
  )
}

// ── 자기소개 ──

function IntroductionPreview({ data, title, style }: { data: IntroductionData; title: string; style: ResumeStyle }) {
  if (!data.content) return null
  return (
    <div>
      <SectionTitle title={title} style={style} />
      <p style={{ fontSize: '0.93em', color: '#444', whiteSpace: 'pre-line', lineHeight: 1.75, margin: 0 }}>
        {data.content}
      </p>
    </div>
  )
}

// ── 사용자 정의 (Headline 등) ──

function CustomPreview({ data, title, style }: { data: CustomData; title: string; style: ResumeStyle }) {
  if (!data.content) return null
  const displayTitle = data.label || title

  // 불릿 리스트가 포함된 경우
  if (data.content.includes('•')) {
    return (
      <div>
        <SectionTitle title={displayTitle} style={style} />
        <div style={{ fontSize: '0.93em', color: '#444', lineHeight: 1.9, paddingLeft: '0.3em' }}>
          {data.content.split('\n').filter(Boolean).map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <SectionTitle title={displayTitle} style={style} />
      <p style={{ fontSize: '0.93em', color: '#444', whiteSpace: 'pre-line', lineHeight: 1.75, margin: 0 }}>
        {data.content}
      </p>
    </div>
  )
}

// ── 블록 렌더 디스패처 ──

function renderBlock(block: Block, style: ResumeStyle) {
  switch (block.type) {
    case 'profile':
      return <ProfilePreview key={block.id} data={block.data as ProfileData} style={style} />
    case 'education':
      return <EducationPreview key={block.id} data={block.data as EducationData} title={block.title} style={style} />
    case 'experience':
      return <ExperiencePreview key={block.id} data={block.data as ExperienceData} title={block.title} style={style} />
    case 'project':
      return <ProjectPreview key={block.id} data={block.data as ProjectData} title={block.title} style={style} />
    case 'skill':
      return <SkillPreview key={block.id} data={block.data as SkillData} title={block.title} style={style} />
    case 'certificate':
      return <CertificatePreview key={block.id} data={block.data as CertificateData} title={block.title} style={style} />
    case 'introduction':
      return <IntroductionPreview key={block.id} data={block.data as IntroductionData} title={block.title} style={style} />
    case 'custom':
      return <CustomPreview key={block.id} data={block.data as CustomData} title={block.title} style={style} />
    default:
      return null
  }
}

// ── 메인 프리뷰 ──

export default function ResumePreview({ blocks, style }: Props) {
  if (blocks.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        항목을 추가하면 미리보기가 표시됩니다
      </div>
    )
  }

  const containerStyle: CSSProperties = {
    fontFamily: style.fontFamily,
    fontSize: FONT_SIZE_MAP[style.fontSize],
    lineHeight: 1.75,
    color: '#333',
  }

  // 2단 레이아웃
  if (style.layout === 'two-column') {
    const profileBlock = blocks.find((b) => b.type === 'profile')
    const restBlocks = blocks.filter((b) => b.type !== 'profile')
    const mid = Math.ceil(restBlocks.length / 2)
    const leftBlocks = restBlocks.slice(0, mid)
    const rightBlocks = restBlocks.slice(mid)

    return (
      <div
        id="resume-preview"
        className="bg-white p-8 max-w-[210mm] mx-auto shadow-sm min-h-[297mm]"
        style={containerStyle}
      >
        {profileBlock && renderBlock(profileBlock, style)}
        <Divider color={lightBg(style.primaryColor, 0.3)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
          <div>{leftBlocks.map((b) => renderBlock(b, style))}</div>
          <div>{rightBlocks.map((b) => renderBlock(b, style))}</div>
        </div>
      </div>
    )
  }

  // 1단 레이아웃
  return (
    <div
      id="resume-preview"
      className="bg-white p-8 max-w-[210mm] mx-auto shadow-sm min-h-[297mm]"
      style={containerStyle}
    >
      {blocks.map((block) => renderBlock(block, style))}
    </div>
  )
}
