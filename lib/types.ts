export type BlockType =
  | 'profile'
  | 'education'
  | 'experience'
  | 'project'
  | 'skill'
  | 'certificate'
  | 'introduction'
  | 'custom'

// 블록 데이터 타입별 정의
export interface ProfileData {
  name: string
  email: string
  phone: string
  address: string
  photo: string // 사진 파일 경로 (/api/uploads/xxx.jpg)
}

export interface EducationItem {
  id: string
  school: string
  major: string
  degree: string
  startDate: string
  endDate: string
}

export interface EducationData {
  items: EducationItem[]
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  techStack: string  // 쉼표 구분: "Java, Spring Boot, MySQL"
}

export interface ExperienceData {
  items: ExperienceItem[]
}

export interface ProjectItem {
  id: string
  name: string
  role: string
  startDate: string
  endDate: string
  techStack: string
  description: string
}

export interface ProjectData {
  items: ProjectItem[]
}

export interface SkillItem {
  id: string
  category: string
  skills: string
}

export interface SkillData {
  items: SkillItem[]
}

export interface CertificateItem {
  id: string
  name: string
  issuer: string
  date: string
}

export interface CertificateData {
  items: CertificateItem[]
}

export interface IntroductionData {
  content: string
}

export interface CustomData {
  label: string
  content: string
}

export type BlockData =
  | ProfileData
  | EducationData
  | ExperienceData
  | ProjectData
  | SkillData
  | CertificateData
  | IntroductionData
  | CustomData

export interface Block {
  id: string
  type: BlockType
  title: string
  data: BlockData
  collapsed: boolean
}

export interface ResumeStyle {
  primaryColor: string      // 메인 강조색
  fontFamily: string        // 폰트
  fontSize: 'sm' | 'md' | 'lg'
  layout: 'single' | 'two-column' // 1단/2단
  sectionStyle: 'underline' | 'background' | 'side-accent' // 섹션 타이틀 스타일
}

export interface Resume {
  id: string
  title: string
  templateId: string
  style: ResumeStyle
  blocks: Block[]
  createdAt: string
  updatedAt: string
}
