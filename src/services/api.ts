import { AIAnalysisResult } from '../types';

export interface AnalyzeRequestPayload {
  name: string;
  email: string;
  phone: string;
  jobOrField: string;
  recentBook: string;
  readingGoal: string;
  selectedSession: string;
  customQuestion?: string;
}

export async function requestAIReadingAnalysis(
  payload: AnalyzeRequestPayload
): Promise<{ data: AIAnalysisResult; isFallback: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s timeout

    const res = await fetch('/api/analyze-reading', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const result = await res.json();
    if (result && result.data) {
      return {
        data: result.data,
        isFallback: Boolean(result.isFallback),
      };
    }
    throw new Error('Invalid response structure');
  } catch (err: any) {
    console.warn('API error, using local fallback analyzer:', err);
    return {
      data: getLocalFallbackAnalysis(payload),
      isFallback: true,
    };
  }
}

export async function submitToGoogleSheet(
  webhookUrl: string,
  submission: any
): Promise<{ success: boolean; message: string }> {
  // 1순위: 서버 프록시를 통해 전송 (서버에 저장된 URL 또는 환경변수 자동 적용)
  try {
    const proxyRes = await fetch('/api/submit-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webhookUrl: webhookUrl ? webhookUrl.trim() : undefined,
        payload: submission,
      }),
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (data.success) {
        return { success: true, message: '구글 스프레드시트에 성공적으로 기록되었습니다!' };
      }
      if (data.localOnly && !webhookUrl) {
        return {
          success: false,
          message: '구글 스프레드시트 웹 앱 URL이 설정되지 않았습니다.',
        };
      }
    }
  } catch (err) {
    console.warn('Server proxy error, attempting direct fetch...', err);
  }

  // 2순위: 클라이언트에 입력된 webhookUrl이 있으면 브라우저 직접 fetch (no-cors fallback)
  if (webhookUrl && webhookUrl.trim()) {
    try {
      await fetch(webhookUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(submission),
      });
      return {
        success: true,
        message: '구글 시트로 신청 정보가 발송되었습니다.',
      };
    } catch (error: any) {
      return {
        success: false,
        message: `구글 시트 연동 전송 실패: ${error.message || '네트워크 오류'}`,
      };
    }
  }

  return {
    success: false,
    message: '등록된 구글 시트 웹 앱 URL이 없습니다.',
  };
}

function getLocalFallbackAnalysis(payload: AnalyzeRequestPayload): AIAnalysisResult {
  const safeName = payload.name || '참가자';
  const safeField = payload.jobOrField || '자기계발과 지식 탐구';
  const safeBook = payload.recentBook || '관심 도서';

  return {
    personaSummary: `${safeField}에 진심인 지혜로운 탐구형 독서가`,
    feedbackMessage: `${safeName}님, 최근 인상 깊게 읽으신 '${safeBook}'과 더불어 세미나를 통해 도약하고자 하는 의지가 돋보입니다. 이번 세미나에서 함께할 대화와 학습이 실제 일상과 커리어의 든든한 디딤돌이 될 것입니다.`,
    keyInsightKeywords: ['지식 체계화', '실행력 강화', '심층 사유', '지속가능한 루틴'],
    recommendedBooks: [
      {
        title: '어떻게 읽을 것인가',
        author: '고영성',
        reason: '뇌과학과 심리학을 기반으로 독서의 효율성과 기억 정착률을 극대화하는 독서법의 정석입니다.',
        tag: '독서방법론',
      },
      {
        title: '제2의 뇌 만들기 (Building a Second Brain)',
        author: '티아고 포르테',
        reason: '흘러가는 지식을 영구한 나의 무기로 축적하는 현대인을 위한 개인 지식 관리 시스템.',
        tag: '생산성 & 메모',
      },
      {
        title: '원씽 (The ONE Thing)',
        author: '게리 켈러',
        reason: '산만한 일상 속에서 가장 본질적인 핵심 목표 하나를 발굴하고 몰입하는 지혜를 제공합니다.',
        tag: '집중 & 실행',
      },
    ],
    tailoredQuestions: [
      '읽은 책에서 얻은 지식을 3일 이내에 실제 행동으로 옮기기 위한 나만의 장치는 무엇인가요?',
      '단순히 많이 읽는 다독보다, 깊이 소화하는 지독(遲讀)을 실천하기 위한 기준은 무엇일까요?',
      '세미나에서 다양한 분야의 동료 독서가들과 만났을 때 나누고 싶은 나만의 핵심 화두는 무엇인가요?',
    ],
    growthRoadmap: [
      {
        step: '1단계: 사전 질문과 목표 정립',
        description: '세미나 참가 전 내가 해결하고 싶은 고민 1가지를 명확히 문장으로 정리합니다.',
      },
      {
        step: '2단계: 현장 및 온라인 참여와 실시간 발췌',
        description: '강연 중 머리를 스치는 아이디어를 그 자리에서 즉시 키워드로 메모합니다.',
      },
      {
        step: '3단계: 72시간 내 원-포인트 실천',
        description: '세미나 종료 후 추천 도서 중 1권을 선정하거나 배운 실천법 하나를 즉각 적용합니다.',
      },
    ],
  };
}
