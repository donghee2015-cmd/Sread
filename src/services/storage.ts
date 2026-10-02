import { ApplicationSubmission } from '../types';

const STORAGE_KEY_APPLICATIONS = 'smart_reading_applications_v1';
const STORAGE_KEY_SHEET_URL = 'smart_reading_sheet_url_v1';

export function getStoredSheetUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_SHEET_URL) || '';
  } catch {
    return '';
  }
}

export function saveStoredSheetUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_SHEET_URL, url.trim());
  } catch (e) {
    console.error('Failed to save sheet url to localStorage', e);
  }
}

export function getStoredApplications(): ApplicationSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
    if (!raw) {
      // Seed with initial example applications so the applicant lookup and list have rich real demo data
      const initial = getSampleApplications();
      localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveApplication(app: ApplicationSubmission): void {
  try {
    const current = getStoredApplications();
    const updated = [app, ...current.filter((item) => item.id !== app.id)];
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save application', e);
  }
}

export function findApplicationByIdOrEmail(query: string): ApplicationSubmission | undefined {
  const list = getStoredApplications();
  const clean = query.trim().toLowerCase();
  return list.find(
    (item) =>
      item.id.toLowerCase() === clean ||
      item.email.toLowerCase() === clean ||
      item.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '')
  );
}

export function exportApplicationsToCSV(): void {
  const list = getStoredApplications();
  if (list.length === 0) return;

  const headers = [
    '접수번호',
    '접수일시',
    '이름',
    '이메일',
    '연락처',
    '직업/관심사',
    '선택세션',
    '최근읽은책',
    '세미나목표',
    'AI페르소나',
    '구글시트저장여부',
  ];

  const rows = list.map((item) => [
    `"${item.id}"`,
    `"${item.createdAt}"`,
    `"${item.name}"`,
    `"${item.email}"`,
    `"${item.phone}"`,
    `"${item.jobOrField.replace(/"/g, '""')}"`,
    `"${item.selectedSessionTitle.replace(/"/g, '""')}"`,
    `"${item.recentBook.replace(/"/g, '""')}"`,
    `"${item.readingGoal.replace(/"/g, '""')}"`,
    `"${item.aiAnalysis?.personaSummary || ''}"`,
    `"${item.savedToGoogleSheet ? '성공' : '로컬저장'}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `독서세미나_신청자명단_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getSampleApplications(): ApplicationSubmission[] {
  return [
    {
      id: 'RD-2026-1042',
      name: '이서연',
      email: 'seoyeon.lee@example.com',
      phone: '010-8291-3342',
      jobOrField: 'IT 스타트업 서비스 기획자',
      recentBook: '아토믹 해빗 (아주 작은 습관의 힘)',
      readingGoal: '책을 읽고 나면 금방 잊어버리는 습관을 고치고, 실무 프로젝트와 연결하는 실천 노하우를 배우고 싶습니다.',
      selectedSessionId: 'session-1',
      selectedSessionTitle: '세션 1: 비즈니스 인사이트 & 실행 독서법 (Actionable Reading)',
      customQuestion: '바쁜 직장인으로서 하루 20분 독서로 최대의 인사이트를 뽑아내는 메모 템플릿이 궁금합니다.',
      createdAt: '2026-10-01 14:30',
      status: 'confirmed',
      savedToGoogleSheet: true,
      aiAnalysis: {
        personaSummary: '습관 시스템을 통해 폭발적 실행을 이끄는 실천형 프로덕트 빌더',
        feedbackMessage:
          '이서연님, <아토믹 해빗>을 통해 정체성을 변화시키고자 하신 고민이 무척 돋보입니다. 이번 세션 1에서는 작은 독서 메모가 기획서와 서비스 개선으로 직결되는 구체적 프레임워크를 선물해 드립니다.',
        keyInsightKeywords: ['습관 루틴화', '기획서 연계', '원페이지 메모', '지식 축적'],
        recommendedBooks: [
          {
            title: '메모 습관의 힘',
            author: '신정철',
            reason: '책을 읽으며 밑줄 긋고 메모하여 나만의 생각 콘텐츠로 재탄생시키는 노하우를 제공합니다.',
            tag: '메모 독서',
          },
          {
            title: '인스파이어드 (Inspired)',
            author: '마티 케이건',
            reason: '프로덕트 매니저로서 고객과 제품에 깊이 몰입하는 사고방식을 기르는 필독서입니다.',
            tag: '기획 & PM',
          },
          {
            title: '생각의 쓰임',
            author: '사이토 다카시',
            reason: '지식을 인출하여 창의적인 아이디어로 전환하는 구체적 생각 훈련법을 익힐 수 있습니다.',
            tag: '사고력 확장',
          },
        ],
        tailoredQuestions: [
          '실무 스프린트 기간 중에도 독서 루틴이 끊기지 않게 유지하는 최소 실행 단위는 무엇인가요?',
          '책 속의 개념을 동료 팀원들에게 효과적으로 공유하고 팀 문화로 정착시키는 방법은 무엇일까요?',
          '기획자로서 책을 고를 때 트렌드 서적과 고전의 황금 비율은 어떻게 조율해야 할까요?',
        ],
        growthRoadmap: [
          {
            step: '1단계: 핵심 질문 1개 설정',
            description: '독서 전 기획 중인 기능에 관련된 질문을 상단 여백에 기입합니다.',
          },
          {
            step: '2단계: 행동 전환 메모',
            description: '"이 인사이트는 우리 서비스의 어떤 문제에 쓰일 수 있는가?"를 1줄 메모합니다.',
          },
          {
            step: '3단계: 주간 리뷰 회고',
            description: '매주 일요일 저녁 독서 노트 중 실무에 적용한 1가지를 회고합니다.',
          },
        ],
      },
    },
  ];
}
