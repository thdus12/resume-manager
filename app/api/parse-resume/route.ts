import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import path from 'path'

const SYSTEM_PROMPT = `당신은 이력서 파싱 전문가입니다. 주어진 텍스트에서 정보를 추출하여 아래 JSON 구조로 변환하세요.

반드시 아래 형식의 JSON만 반환하세요. 다른 텍스트는 포함하지 마세요.

{
  "blocks": [
    {
      "type": "profile",
      "title": "기본 정보",
      "data": { "name": "", "email": "", "phone": "", "address": "", "photo": "" }
    },
    {
      "type": "education",
      "title": "학력",
      "data": {
        "items": [
          { "id": "uuid", "school": "", "major": "", "degree": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM" }
        ]
      }
    },
    {
      "type": "experience",
      "title": "경력",
      "data": {
        "items": [
          { "id": "uuid", "company": "", "position": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "techStack": "", "description": "" }
        ]
      }
    },
    {
      "type": "project",
      "title": "프로젝트",
      "data": {
        "items": [
          { "id": "uuid", "name": "", "role": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "techStack": "", "description": "" }
        ]
      }
    },
    {
      "type": "skill",
      "title": "기술 스택",
      "data": {
        "items": [
          { "id": "uuid", "category": "", "skills": "" }
        ]
      }
    },
    {
      "type": "certificate",
      "title": "자격증/어학",
      "data": {
        "items": [
          { "id": "uuid", "name": "", "issuer": "", "date": "YYYY-MM" }
        ]
      }
    },
    {
      "type": "introduction",
      "title": "자기소개",
      "data": { "content": "" }
    }
  ]
}

규칙:
- 이력서에 해당 정보가 없으면 해당 블록은 포함하지 마세요.
- 날짜는 YYYY-MM 형식으로 변환하세요.
- 각 item의 id는 고유한 임의 문자열로 생성하세요.
- JSON만 반환하세요.`

async function extractText(buffer: Buffer, ext: string): Promise<string> {
  if (ext === '.pdf') {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    await parser.destroy()
    return result.text
  }

  if (ext === '.docx' || ext === '.doc') {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }

  return buffer.toString('utf-8')
}

function extractJson(text: string): string {
  const jsonMatch = text.match(/```json?\s*([\s\S]*?)```/)
  return jsonMatch ? jsonMatch[1] : text
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY가 설정되지 않았습니다.' }, { status: 500 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 })
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = path.extname(file.name).toLowerCase()
    const text = await extractText(buffer, ext)

    if (!text.trim()) {
      return NextResponse.json({ error: '파일에서 텍스트를 추출할 수 없습니다' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: `다음 이력서 텍스트를 분석하여 JSON 블록 구조로 변환해주세요:\n\n${text}` },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(extractJson(responseText).trim())
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Resume parse error:', error)
    const message = error instanceof Error ? error.message : '이력서 파싱 중 오류가 발생했습니다'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
