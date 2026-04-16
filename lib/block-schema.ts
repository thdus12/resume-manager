import {
  BlockType,
  BlockData,
  ProfileData,
  EducationData,
  ExperienceData,
  ProjectData,
  SkillData,
  CertificateData,
  IntroductionData,
  CustomData,
} from './types'

interface BlockMeta {
  type: BlockType
  label: string
  icon: string
  defaultTitle: string
  createDefault: () => BlockData
}

export const BLOCK_METAS: BlockMeta[] = [
  {
    type: 'profile',
    label: '기본 정보',
    icon: '👤',
    defaultTitle: '기본 정보',
    createDefault: (): ProfileData => ({
      name: '',
      email: '',
      phone: '',
      address: '',
      photo: '',
    }),
  },
  {
    type: 'education',
    label: '학력',
    icon: '🎓',
    defaultTitle: '학력',
    createDefault: (): EducationData => ({ items: [] }),
  },
  {
    type: 'experience',
    label: '경력',
    icon: '💼',
    defaultTitle: '경력',
    createDefault: (): ExperienceData => ({ items: [] }),
  },
  {
    type: 'project',
    label: '프로젝트',
    icon: '📁',
    defaultTitle: '프로젝트',
    createDefault: (): ProjectData => ({ items: [] }),
  },
  {
    type: 'skill',
    label: '기술 스택',
    icon: '⚙️',
    defaultTitle: '기술 스택',
    createDefault: (): SkillData => ({ items: [] }),
  },
  {
    type: 'certificate',
    label: '자격증/어학',
    icon: '📜',
    defaultTitle: '자격증/어학',
    createDefault: (): CertificateData => ({ items: [] }),
  },
  {
    type: 'introduction',
    label: '자기소개',
    icon: '✍️',
    defaultTitle: '자기소개',
    createDefault: (): IntroductionData => ({ content: '' }),
  },
  {
    type: 'custom',
    label: '사용자 정의',
    icon: '➕',
    defaultTitle: '기타',
    createDefault: (): CustomData => ({ label: '', content: '' }),
  },
]

export function getBlockMeta(type: BlockType): BlockMeta {
  return BLOCK_METAS.find((m) => m.type === type)!
}
