import { Block, ResumeStyle } from './types'
import { getBlockMeta } from './block-schema'

export interface Template {
  id: string
  name: string
  description: string
  style: ResumeStyle
  defaultBlocks: Block[]
  sampleBlocks: Block[] // 미리보기용 가라 데이터
}

function createBlock(type: string, title?: string): Block {
  const meta = getBlockMeta(type as Block['type'])
  return {
    id: crypto.randomUUID(),
    type: type as Block['type'],
    title: title || meta.defaultTitle,
    data: meta.createDefault(),
    collapsed: false,
  }
}

// 미리보기용 샘플 데이터 블록
function sampleBlocks(): Record<string, Block> {
  return {
    profile: {
      id: 's-profile',
      type: 'profile',
      title: '기본 정보',
      collapsed: false,
      data: {
        name: '김개발',
        email: 'dev.kim@email.com',
        phone: '010-1234-5678',
        address: '서울시 강남구',
        photo: '',
      },
    },
    education: {
      id: 's-edu',
      type: 'education',
      title: 'Education.',
      collapsed: false,
      data: {
        items: [
          { id: 'e1', school: '한국대학교', major: '컴퓨터공학과', degree: '학사', startDate: '2016-03', endDate: '2020-02' },
        ],
      },
    },
    experience: {
      id: 's-exp',
      type: 'experience',
      title: 'Work Experience.',
      collapsed: false,
      data: {
        items: [
          {
            id: 'x1',
            company: '테크스타트업',
            position: 'Backend Developer',
            startDate: '2020-03',
            endDate: '2023-06',
            techStack: 'Java 17, Spring Boot 3.3, JPA, QueryDSL, PostgreSQL, Redis',
            description: 'Spring Boot 기반 API 서버 개발\n- RESTful API 설계 및 구현\n- QueryDSL 기반 동적 쿼리 최적화\nMSA 전환 프로젝트 리드\n- 모놀리식 → 마이크로서비스 전환\n- Kafka 기반 이벤트 드리븐 아키텍처 설계\n→ 서비스 간 의존성 제거 및 배포 독립성 확보',
          },
          {
            id: 'x2',
            company: '빅컴퍼니',
            position: 'Senior Developer 대리',
            startDate: '2023-07',
            endDate: '현재',
            techStack: 'Java 17, Spring Boot 3.3, JPA, PostgreSQL, TeamCity, Redis, JWT',
            description: '결제 시스템 설계 및 개발\n- 일 100만 트랜잭션 처리 아키텍처 구축\n- PostgreSQL Advisory Lock 기반 동시성 제어\n→ 결제 정확도 99.99% 달성\n서버 환경 구축\n- Dev/Stage/Production 설정 및 운영\n- TeamCity CI/CD 파이프라인 구축',
          },
        ],
      },
    },
    project: {
      id: 's-proj',
      type: 'project',
      title: 'Portfolio.',
      collapsed: false,
      data: {
        items: [
          { id: 'p1', name: '이커머스 플랫폼', role: 'Backend Lead', startDate: '2023-01', endDate: '2023-12', techStack: 'Java, Spring, Kafka, Redis', description: '주문/결제 마이크로서비스 설계\n실시간 재고 관리 시스템 구현' },
        ],
      },
    },
    skill: {
      id: 's-skill',
      type: 'skill',
      title: 'Skill.',
      collapsed: false,
      data: {
        items: [
          { id: 'sk1', category: 'Backend', skills: 'Java, Spring Boot, JPA, QueryDSL, JWT, RestAPI' },
          { id: 'sk2', category: 'DB', skills: 'MySQL, PostgreSQL, Oracle, Redis' },
          { id: 'sk3', category: 'DevOps', skills: 'AWS EC2/S3, TeamCity, GitLab, GitHub, NginX' },
          { id: 'sk4', category: 'Tools', skills: 'Swagger, IntelliJ, Notion, Slack, Figma' },
        ],
      },
    },
    certificate: {
      id: 's-cert',
      type: 'certificate',
      title: 'Certifications.',
      collapsed: false,
      data: {
        items: [
          { id: 'c1', name: '정보처리기사', issuer: '한국산업인력공단', date: '2024-09' },
          { id: 'c2', name: 'AWS SAA', issuer: 'Amazon', date: '2022-05' },
        ],
      },
    },
    introduction: {
      id: 's-intro',
      type: 'introduction',
      title: 'Introduce.',
      collapsed: false,
      data: {
        content: '4년차 백엔드 개발자로, Java와 Spring Boot 기반의 서버 애플리케이션 개발과 레거시 시스템 리팩토링에 강점이 있습니다.\n\n백엔드 개발에 머무르지 않고, TeamCity/GitLab 기반 CI/CD 파이프라인 구축과 배포 스크립트 작성, Dev/Stage/Production 서버 환경 구성 등 DevOps 영역까지 역량을 확장하며 개발 생산성을 높여왔습니다.',
      },
    },
    headline: {
      id: 's-headline',
      type: 'custom',
      title: 'Headline',
      collapsed: false,
      data: {
        label: 'Headline',
        content: '• Java / Spring Boot 기반 서버 개발 경력 3년\n• RESTful API 설계, 동시성 제어, 대용량 데이터 배치 처리 경험\n• 레거시 시스템 리팩토링 및 코드 품질 개선 주도\n• JWT 기반 인증/인가 시스템 설계 및 서비스 운영 환경 구축\n• TeamCity/GitLab CI/CD 파이프라인 구축 및 배포 자동화',
      },
    },
  }
}

function getSample(...types: string[]): Block[] {
  const all = sampleBlocks()
  return types.map((t) => all[t]).filter(Boolean)
}

// Classic/Minimal용 샘플 (한국어 제목, 풍부한 데이터)
function classicSampleBlocks(): Record<string, Block> {
  return {
    profile: {
      id: 'c-profile',
      type: 'profile',
      title: '기본 정보',
      collapsed: false,
      data: {
        name: '김개발',
        email: 'dev.kim@email.com',
        phone: '010-1234-5678',
        address: '서울시 강남구',
        photo: '',
      },
    },
    education: {
      id: 'c-edu',
      type: 'education',
      title: '학력',
      collapsed: false,
      data: {
        items: [
          { id: 'e1', school: '한국대학교', major: '컴퓨터소프트웨어학과', degree: '학사', startDate: '2016-03', endDate: '2020-02' },
          { id: 'e2', school: '한국대학교', major: '컴퓨터소프트웨어과', degree: '전문학사', startDate: '2013-03', endDate: '2016-02' },
        ],
      },
    },
    experience: {
      id: 'c-exp',
      type: 'experience',
      title: '경력사항',
      collapsed: false,
      data: {
        items: [
          {
            id: 'x1',
            company: '테크스타트업',
            position: 'Backend Developer',
            startDate: '2022-05',
            endDate: '현재',
            techStack: 'Java 17, Spring Boot 3.3, JPA, QueryDSL, PostgreSQL, Redis',
            description: '백오피스 공통 구조 전면 리팩토링\n- 커스텀 응답/페이징 클래스 제거 및 Spring Data Pageable 표준 적용\n- Controller 비즈니스 로직을 Service 레이어로 분리\n→ 신규 API 개발 시 공통 구조 재사용으로 개발 생산성 향상\n대용량 배치 시스템 개발\n- Spring Batch chunk 기반 400만 건 데이터 2분 내 적재\n- 반기별 수동 작업을 파라미터 기반 배치로 자동화',
          },
          {
            id: 'x2',
            company: '빅컴퍼니',
            position: 'Backend Developer 선임',
            startDate: '2020-03',
            endDate: '2022-04',
            techStack: 'Java 17, Spring Boot 3.0, JPA, QueryDSL, PostgreSQL, JWT, TeamCity',
            description: 'JWT 커스텀 모듈 및 인증/인가 시스템 구축\n- Interface 기반 설계와 Redis 기반 토큰 관리\nCI/CD 파이프라인 구축\n- TeamCity와 GitLab 활용 배포 자동화\n- Dev/Stage/Production 서버 환경 구성',
          },
        ],
      },
    },
    project: {
      id: 'c-proj',
      type: 'project',
      title: '프로젝트',
      collapsed: false,
      data: {
        items: [
          {
            id: 'p1',
            name: '이커머스 플랫폼',
            role: 'Backend Lead',
            startDate: '2023-01',
            endDate: '2023-12',
            techStack: 'Java 17, Spring Boot, Kafka, Redis, PostgreSQL',
            description: '주문/결제 마이크로서비스 설계\n실시간 재고 관리 시스템 구현\nPostgreSQL Advisory Lock 기반 동시성 제어',
          },
          {
            id: 'p2',
            name: '반려동물 예약 서비스',
            role: 'Backend Support',
            startDate: '2024-01',
            endDate: '2024-05',
            techStack: 'Java 17, Spring Boot, JPA, QueryDSL, MySQL',
            description: 'Front-Office, Back-Office API 개발\nSpring Security 기반 인증/인가 시스템 구축\nAOP 활용 파일 저장 로직 구현',
          },
        ],
      },
    },
    certificate: {
      id: 'c-cert',
      type: 'certificate',
      title: '자격증/어학',
      collapsed: false,
      data: {
        items: [
          { id: 'c1', name: '정보처리기사', issuer: '한국산업인력공단', date: '2024-09' },
          { id: 'c2', name: 'AWS SAA', issuer: 'Amazon', date: '2022-05' },
        ],
      },
    },
    skill: {
      id: 'c-skill',
      type: 'skill',
      title: '보유 기술',
      collapsed: false,
      data: {
        items: [
          { id: 'sk1', category: 'Backend', skills: 'Java, Spring Boot, JPA, QueryDSL, JWT' },
          { id: 'sk2', category: 'DB', skills: 'MySQL, PostgreSQL, Oracle, Redis' },
          { id: 'sk3', category: 'DevOps', skills: 'AWS EC2/S3, TeamCity, GitLab, NginX' },
          { id: 'sk4', category: 'Tools', skills: 'Swagger, IntelliJ, Notion, Slack' },
        ],
      },
    },
    introduction: {
      id: 'c-intro',
      type: 'introduction',
      title: '자기소개',
      collapsed: false,
      data: {
        content: '4년차 백엔드 개발자로, Java와 Spring Boot 기반의 서버 애플리케이션 개발과 레거시 시스템 리팩토링에 강점이 있습니다.\n\n커스텀 응답/페이징 구조를 Spring 표준으로 전환하고, Controller에 집중된 조회 로직을 Service 레이어로 분리하는 등 전체 도메인에 걸친 구조 개선을 수행했습니다.\n\n문제의 근본 원인을 추적하고, 반복되는 작업은 자동화하는 것을 개발 원칙으로 삼고 있습니다.',
      },
    },
  }
}

function getClassicSample(...types: string[]): Block[] {
  const all = classicSampleBlocks()
  return types.map((t) => all[t]).filter(Boolean)
}

export const TEMPLATES: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: '전통적인 이력서 양식. 흑백 기반으로 깔끔하고 격식있는 스타일.',
    style: {
      primaryColor: '#1a1a1a',
      fontFamily: 'Malgun Gothic',
      fontSize: 'md',
      layout: 'single',
      sectionStyle: 'underline',
    },
    defaultBlocks: [
      createBlock('profile'),
      createBlock('education', '학력'),
      createBlock('experience', '경력사항'),
      createBlock('certificate', '자격증/어학'),
      createBlock('skill', '보유 기술'),
      createBlock('introduction', '자기소개'),
    ],
    sampleBlocks: getClassicSample('profile', 'education', 'experience', 'certificate', 'skill', 'introduction'),
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'bae-log 스타일. 컬러 강조와 Notion 느낌의 개발자 이력서.',
    style: {
      primaryColor: '#7c3aed',
      fontFamily: 'Pretendard',
      fontSize: 'md',
      layout: 'single',
      sectionStyle: 'side-accent',
    },
    defaultBlocks: [
      createBlock('profile'),
      createBlock('custom', 'Headline'),
      createBlock('introduction', 'Introduce.'),
      createBlock('skill', 'Skill.'),
      createBlock('experience', 'Work Experience.'),
      createBlock('education', 'Education.'),
      createBlock('certificate', 'Certifications.'),
    ],
    sampleBlocks: getSample('profile', 'headline', 'introduction', 'skill', 'experience', 'education', 'certificate'),
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: '여백과 타이포그래피 중심. 심플하고 세련된 스타일.',
    style: {
      primaryColor: '#0ea5e9',
      fontFamily: 'Malgun Gothic',
      fontSize: 'lg',
      layout: 'single',
      sectionStyle: 'background',
    },
    defaultBlocks: [
      createBlock('profile'),
      createBlock('experience', '경력'),
      createBlock('project', '프로젝트'),
      createBlock('skill', '스킬'),
    ],
    sampleBlocks: getClassicSample('profile', 'experience', 'project', 'skill'),
  },
]

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id)
}
