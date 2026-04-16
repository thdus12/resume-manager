import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ImageRun,
} from 'docx'
import { saveAs } from 'file-saver'
import {
  Block,
  ProfileData,
  EducationData,
  ExperienceData,
  ProjectData,
  SkillData,
  CertificateData,
  IntroductionData,
  CustomData,
} from './types'

function sectionTitle(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: title, bold: true, size: 24, font: 'Malgun Gothic' }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 100 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 2, color: '333333' },
    },
  })
}

function textRun(text: string, options?: { bold?: boolean; size?: number; color?: string }): TextRun {
  return new TextRun({
    text,
    font: 'Malgun Gothic',
    size: options?.size ?? 20,
    bold: options?.bold ?? false,
    color: options?.color ?? '333333',
  })
}

function emptyLine(): Paragraph {
  return new Paragraph({ children: [], spacing: { after: 100 } })
}

async function fetchImageAsBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const arrayBuffer = await res.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch {
    return null
  }
}

async function buildProfileSection(data: ProfileData): Promise<Paragraph[]> {
  const paragraphs: Paragraph[] = []

  // 이름
  paragraphs.push(
    new Paragraph({
      children: [textRun(data.name || '이름', { bold: true, size: 36 })],
      alignment: AlignmentType.LEFT,
      spacing: { after: 100 },
    })
  )

  // 연락처 정보
  const contactParts = [data.email, data.phone, data.address].filter(Boolean)
  if (contactParts.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [textRun(contactParts.join('  |  '), { size: 18, color: '666666' })],
        spacing: { after: 200 },
      })
    )
  }

  return paragraphs
}

function buildEducationSection(data: EducationData, title: string): Paragraph[] {
  if (data.items.length === 0) return []
  const paragraphs: Paragraph[] = [sectionTitle(title)]

  for (const item of data.items) {
    paragraphs.push(
      new Paragraph({
        children: [
          textRun(item.school, { bold: true }),
          textRun(`    ${item.startDate} ~ ${item.endDate}`, { size: 18, color: '888888' }),
        ],
      })
    )
    paragraphs.push(
      new Paragraph({
        children: [
          textRun(`${item.major} ${item.degree ? `(${item.degree})` : ''}`, {
            size: 18,
            color: '666666',
          }),
        ],
        spacing: { after: 100 },
      })
    )
  }
  return paragraphs
}

function buildExperienceSection(data: ExperienceData, title: string): Paragraph[] {
  if (data.items.length === 0) return []
  const paragraphs: Paragraph[] = [sectionTitle(title)]

  for (const item of data.items) {
    paragraphs.push(
      new Paragraph({
        children: [
          textRun(item.company, { bold: true }),
          textRun(`    ${item.startDate} ~ ${item.endDate}`, { size: 18, color: '888888' }),
        ],
      })
    )
    paragraphs.push(
      new Paragraph({
        children: [textRun(item.position, { size: 18, color: '666666' })],
        spacing: { after: 50 },
      })
    )
    if (item.description) {
      for (const line of item.description.split('\n')) {
        paragraphs.push(
          new Paragraph({
            children: [textRun(line, { size: 18 })],
          })
        )
      }
    }
    if (item.techStack) {
      paragraphs.push(
        new Paragraph({
          children: [textRun(`Tech Stack: ${item.techStack}`, { size: 18, color: '666666' })],
          spacing: { before: 50 },
        })
      )
    }
    paragraphs.push(emptyLine())
  }
  return paragraphs
}

function buildProjectSection(data: ProjectData, title: string): Paragraph[] {
  if (data.items.length === 0) return []
  const paragraphs: Paragraph[] = [sectionTitle(title)]

  for (const item of data.items) {
    paragraphs.push(
      new Paragraph({
        children: [
          textRun(item.name, { bold: true }),
          textRun(`    ${item.startDate} ~ ${item.endDate}`, { size: 18, color: '888888' }),
        ],
      })
    )
    const meta = [item.role, item.techStack].filter(Boolean).join(' | ')
    if (meta) {
      paragraphs.push(
        new Paragraph({
          children: [textRun(meta, { size: 18, color: '666666' })],
          spacing: { after: 50 },
        })
      )
    }
    if (item.description) {
      for (const line of item.description.split('\n')) {
        paragraphs.push(
          new Paragraph({
            children: [textRun(line, { size: 18 })],
          })
        )
      }
    }
    paragraphs.push(emptyLine())
  }
  return paragraphs
}

function buildSkillSection(data: SkillData, title: string): (Paragraph | Table)[] {
  if (data.items.length === 0) return []
  const elements: (Paragraph | Table)[] = [sectionTitle(title)]

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: data.items.map(
      (item) =>
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [textRun(item.category, { bold: true, size: 18 })],
                }),
              ],
              width: { size: 25, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [textRun(item.skills, { size: 18 })],
                }),
              ],
            }),
          ],
        })
    ),
  })
  elements.push(table)
  return elements
}

function buildCertificateSection(data: CertificateData, title: string): Paragraph[] {
  if (data.items.length === 0) return []
  const paragraphs: Paragraph[] = [sectionTitle(title)]

  for (const item of data.items) {
    paragraphs.push(
      new Paragraph({
        children: [
          textRun(item.name, { bold: true }),
          textRun(
            `    ${item.issuer}${item.date ? ` (${item.date})` : ''}`,
            { size: 18, color: '666666' }
          ),
        ],
        spacing: { after: 50 },
      })
    )
  }
  return paragraphs
}

function buildTextSection(content: string, title: string): Paragraph[] {
  if (!content) return []
  const paragraphs: Paragraph[] = [sectionTitle(title)]

  for (const line of content.split('\n')) {
    paragraphs.push(
      new Paragraph({
        children: [textRun(line, { size: 18 })],
        spacing: { after: 50 },
      })
    )
  }
  return paragraphs
}

export async function generateWord(blocks: Block[], filename: string) {
  const children: (Paragraph | Table)[] = []

  for (const block of blocks) {
    switch (block.type) {
      case 'profile':
        children.push(...(await buildProfileSection(block.data as ProfileData)))
        break
      case 'education':
        children.push(...buildEducationSection(block.data as EducationData, block.title))
        break
      case 'experience':
        children.push(...buildExperienceSection(block.data as ExperienceData, block.title))
        break
      case 'project':
        children.push(...buildProjectSection(block.data as ProjectData, block.title))
        break
      case 'skill':
        children.push(...buildSkillSection(block.data as SkillData, block.title))
        break
      case 'certificate':
        children.push(...buildCertificateSection(block.data as CertificateData, block.title))
        break
      case 'introduction':
        children.push(
          ...buildTextSection((block.data as IntroductionData).content, block.title)
        )
        break
      case 'custom': {
        const customData = block.data as CustomData
        children.push(
          ...buildTextSection(customData.content, customData.label || block.title)
        )
        break
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children,
      },
    ],
  })

  const { Packer } = await import('docx')
  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${filename}.docx`)
}
