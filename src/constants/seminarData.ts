import { SeminarSession } from '../types';

export const SEMINAR_SESSIONS: SeminarSession[] = [
  {
    id: 'session-1',
    title: '세션 1: 비즈니스 인사이트 & 실행 독서법 (Actionable Reading)',
    date: '2026년 10월 24일 (토)',
    time: '14:00 ~ 17:00 (3시간)',
    location: '강남 드리움 컨퍼런스홀 3층 & 온라인 Zoom 실시간 동시 진행',
    capacity: 50,
    currentEnrolled: 38,
    instructor: '정지훈 디렉터',
    instructorRole: '비즈니스 전략가 & <읽고 행동하라> 저자',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: '책 속의 아이디어를 72시간 내 실무 프로젝트 및 개인 성과로 연결하는 실천형 독서 프레임워크를 전수합니다.',
    targetAudience: '기획자, 마케터, 스타트업 리더, 실무에 독서를 적용하고 싶은 직장인',
    badge: '마감임박',
  },
  {
    id: 'session-2',
    title: '세션 2: 제2의 뇌 구축 & 지식 메모 시스템 (PKM & AI)',
    date: '2026년 10월 25일 (일)',
    time: '14:00 ~ 17:00 (3시간)',
    location: '온라인 Zoom 라이브 워크숍 (실시간 인터랙티브)',
    capacity: 80,
    currentEnrolled: 54,
    instructor: '한예린 연구원',
    instructorRole: '테크놀로지 라이터 & 생산성 시스템 아키텍트',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    description: '노션, 옵시디언, Gemini AI를 결합하여 읽은 책의 인사이트가 영구히 자산화되는 나만의 지식 정원을 완성합니다.',
    targetAudience: '지식 크리에이터, 학생, 연구자, 읽고 나면 금방 까먹는 분',
    badge: '인기세션',
  },
  {
    id: 'session-3',
    title: '세션 3: 생각의 깊이를 더하는 인문·철학 살롱 (Slow Deep Reading)',
    date: '2026년 10월 31일 (토)',
    time: '15:00 ~ 18:00 (3시간)',
    location: '성수 헤이그라운드 브릭라운지 (오프라인 소수 정예)',
    capacity: 30,
    currentEnrolled: 21,
    instructor: '이동현 교수',
    instructorRole: '문화인류학 교수 & 독서 살롱 모더레이터',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: '단순 요약 독서에서 벗어나 고전과 철학 텍스트를 통해 현대 사회와 나의 삶을 깊이 있게 성찰하는 사유의 장.',
    targetAudience: '자기성찰과 사고의 깊이를 넓히고 싶은 모든 독서 애호가',
    badge: '소수정예',
  },
];

export const SEMINAR_FEATURES = [
  {
    title: 'Gemini AI 맞춤 독서 진단',
    desc: '신청 즉시 AI가 지원자의 관심사와 독서 이력을 분석하여 개인화된 맞춤 추천 도서와 질문지를 제공합니다.',
  },
  {
    title: '구글 스프레드시트 자동 동기화',
    desc: '100% 무료 구글 시트 웹훅 연동으로 신청자 명단이 구글 시트에 실시간 기록되고 안전하게 보관됩니다.',
  },
  {
    title: '온·오프라인 하이브리드',
    desc: '현장 참여와 고화질 Zoom 라이브 중 자유롭게 선택 가능하며, 모든 참가자에게 녹화본과 워크시트가 제공됩니다.',
  },
  {
    title: '모바일 스마트 티켓 즉시 발급',
    desc: '신청 완료 즉시 고유 접수번호가 부여된 모바일 확인증과 PDF 보관 기능이 제공됩니다.',
  },
];

export const FREQUENT_QUESTIONS = [
  {
    q: '세미나 참가비가 있나요?',
    a: '이번 세미나는 독서 문화 활성화를 위한 오픈 스터디 프로그램으로 100% 무료로 진행됩니다. 다만 정원 제한이 있어 사전 신청이 필수입니다.',
  },
  {
    q: '온라인 참여 링크는 언제 발송되나요?',
    a: '신청 완료 즉시 발급되는 스마트 티켓에 기본 안내가 포함되며, 세미나 시작 1일 전 및 1시간 전에 이메일과 알림톡으로 Zoom 링크와 교재를 재안내드립니다.',
  },
  {
    q: '최근에 책을 많이 못 읽었는데 참여해도 괜찮을까요?',
    a: '물론입니다! 신청서에 적어주신 최근 관심 도서나 고민을 토대로 Gemini AI가 초심자 맞춤 추천 도서와 질문을 작성해드리므로 부담 없이 참여하실 수 있습니다.',
  },
  {
    q: '작성한 신청 내역은 어떻게 다시 확인하나요?',
    a: '상단 메뉴의 [신청 내역 조회] 탭에서 신청 시 입력하셨던 이메일이나 접수번호(예: RD-2026-XXXX)를 입력하시면 언제든 티켓과 AI 분석 리포트를 다시 열람하실 수 있습니다.',
  },
  {
    q: '운영자 입장에서 신청자 데이터를 구글 시트로 어떻게 받나요?',
    a: '상단 [구글 시트 연동 가이드] 버튼을 누르면 구글 스프레드시트의 무료 Apps Script 코드가 안내되어 있습니다. 복사하여 붙여넣고 배포 URL만 등록하면 신청자가 접수할 때마다 실시간으로 구글 시트 행에 차곡차곡 쌓입니다.',
  },
];
