import type { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

// Vercel Serverless Function: POST /api/analyze-reading
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, jobOrField, recentBook, readingGoal, selectedSession, customQuestion } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        success: true,
        data: getFallback(name, jobOrField, recentBook),
        isFallback: true,
        notice: 'Vercel 환경 변수에 GEMINI_API_KEY를 등록하시면 실시간 생성형 AI 분석이 활성화됩니다.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });

    const prompt = `
당신은 대한민국 최고 수준의 독서 멘토링 전문가이자 '스마트 독서 세미나'의 수석 디렉터입니다.
참가자가 작성한 신청서 내용을 정밀 분석하여, 참가자의 지적 호기심과 성장을 자극하는 초개인화된 맞춤 피드백과 가이드를 작성해주세요.

[참가자 신청 정보]
- 성명: ${name || '참가자'}
- 직업 또는 관심 분야: ${jobOrField || '자기계발 및 지식 탐구'}
- 최근 인상 깊게 읽은 책 또는 관심 도서: ${recentBook || '자기계발 명저'}
- 이번 세미나를 통해 얻고 싶은 점 / 고민: ${readingGoal || '효과적인 독서 습관과 인사이트 적용법'}
- 신청 세션: ${selectedSession || '스마트 독서 세미나'}
- 사전 질문: ${customQuestion || '없음'}

다음 JSON 스키마 규격에 맞춰 친절하고 통찰력 있는 한국어로 응답해주세요:
- personaSummary: 한 줄 독서 페르소나 요약
- feedbackMessage: 맞춤 격려 및 기대감 부여 피드백 메시지 (2~3문장)
- keyInsightKeywords: 핵심 키워드 4개 배열
- recommendedBooks: 맞춤 추천 도서 3권 배열 [{ title, author, reason, tag }]
- tailoredQuestions: 세미나 당일 맞춤 토론 질문 3개 배열
- growthRoadmap: 3단계 독서 실행 로드맵 배열 [{ step, description }]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personaSummary: { type: Type.STRING },
            feedbackMessage: { type: Type.STRING },
            keyInsightKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedBooks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  tag: { type: Type.STRING },
                },
                required: ['title', 'author', 'reason', 'tag'],
              },
            },
            tailoredQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            growthRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['step', 'description'],
              },
            },
          },
          required: [
            'personaSummary',
            'feedbackMessage',
            'keyInsightKeywords',
            'recommendedBooks',
            'tailoredQuestions',
            'growthRoadmap',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.status(200).json({ success: true, data: parsed, isFallback: false });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      data: getFallback(req.body?.name, req.body?.jobOrField, req.body?.recentBook),
      isFallback: true,
      error: err.message,
    });
  }
}

function getFallback(name = '독서가', field = '성장과 지식 탐구', book = '명저') {
  return {
    personaSummary: `${field}에 열정을 가진 능동적 인사이트 탐험가`,
    feedbackMessage: `${name}님, 최근 접하신 '${book}'을 바탕으로 스스로를 한 단계 더 성장시키고자 하는 열정이 매우 인상적입니다. 이번 세미나는 단순한 책 읽기를 넘어 일과 삶에 직접 적용할 수 있는 강력한 실행 도구를 갖추는 전환점이 될 것입니다.`,
    keyInsightKeywords: ['핵심 맥락 파악', '실행형 메모', '생각의 확장', '지식 네트워크'],
    recommendedBooks: [
      {
        title: '어떻게 읽을 것인가',
        author: '고영성',
        reason: '독서의 본질과 두뇌 활성화, 실제 독서 효율을 극대화하는 체계적 방법론을 제시합니다.',
        tag: '독서 방법론',
      },
      {
        title: '제2의 뇌 만들기 (Building a Second Brain)',
        author: '티아고 포르테',
        reason: '읽은 책의 지식을 디지털 도구에 체계적으로 기록하고 생산적인 결과물로 전환하는 기술을 배울 수 있습니다.',
        tag: '지식 관리',
      },
      {
        title: '원씽 (The ONE Thing)',
        author: '게리 켈러',
        reason: '방대한 정보 속에서 자신에게 가장 중요한 단 하나의 목표에 집중하는 힘을 기를 수 있습니다.',
        tag: '실행력 강화',
      },
    ],
    tailoredQuestions: [
      '책에서 얻은 아이디어를 3일 이내에 실제 업무나 생활 루틴에 안착시키는 가장 확실한 비결은 무엇인가요?',
      '읽고 나서 금방 잊히는 독서가 아닌, 1년 뒤에도 삶의 나침반이 되는 나만의 독서 노트 체계를 어떻게 구축할 수 있을까요?',
      '다양한 배경을 가진 동료 독서가들과 함께 지식을 나누고 토론할 때 가장 시너지를 낼 수 있는 관점은 무엇인가요?',
    ],
    growthRoadmap: [
      {
        step: '1단계: 핵심 질문 정의',
        description: '책을 펼치기 전 해결하고 싶은 핵심 질문 1가지를 명확히 수립합니다.',
      },
      {
        step: '2단계: 여백 메모와 발췌',
        description: '인상적인 문장과 내 삶에 주는 시사점을 한 문장으로 기록합니다.',
      },
      {
        step: '3단계: 72시간 내 원-액션(One-Action) 실행',
        description: '세미나에서 얻은 원칙 하나를 72시간 이내에 직접 시도해봅니다.',
      },
    ],
  };
}
