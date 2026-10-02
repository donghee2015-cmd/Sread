import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Gemini AI Initialization
  const geminiApiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (geminiApiKey) {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // API 1: Gemini AI 맞춤 독서 성향 및 세미나 가이드 분석 엔드포인트
  app.post('/api/analyze-reading', async (req: Request, res: Response) => {
    try {
      const { name, jobOrField, recentBook, readingGoal, selectedSession, customQuestion } = req.body;

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not configured yet
        return res.json({
          success: true,
          data: generateFallbackAnalysis(name, jobOrField, recentBook, readingGoal, selectedSession),
          isFallback: true,
          notice: 'GEMINI_API_KEY가 설정되지 않아 사전 구성된 스마트 분석 템플릿으로 생성되었습니다.',
        });
      }

      const prompt = `
당신은 대한민국 최고 수준의 독서 멘토링 전문가이자 '스마트 독서 세미나'의 수석 디렉터입니다.
참가자가 작성한 신청서 내용을 정밀 분석하여, 참가자의 지적 호기심과 성장을 자극하는 초개인화된 맞춤 피드백과 가이드를 작성해주세요.

[참가자 신청 정보]
- 성명: ${name || '참가자'}
- 직업 또는 관심 분야: ${jobOrField || '자기계발 및 커리어 탐색'}
- 최근 인상 깊게 읽은 책 또는 관심 도서: ${recentBook || '자기계발 및 인사이트 도서'}
- 이번 세미나를 통해 얻고 싶은 점 / 고민: ${readingGoal || '효과적인 독서 습관과 인사이트 적용법'}
- 신청 세션: ${selectedSession || '독서 인사이트 세미나'}
- 사전 질문: ${customQuestion || '없음'}

다음 JSON 스키마 규격에 맞춰 친절하고 통찰력 있는 한국어로 응답해주세요:
- personaSummary: 참가자의 독서 성향을 한 줄로 정의하는 매력적인 칭호 (예: "실천과 성장을 융합하는 스마트 실행형 독서가")
- feedbackMessage: 참가자의 고민과 관심사를 칭찬하고 격려하며, 이번 세미나가 어떤 실질적인 전환점이 될지 설명하는 2~3문장의 따뜻한 메시지
- keyInsightKeywords: 참가자의 목표와 어울리는 핵심 키워드 4개 배열 (예: ["실행력 강화", "메모 독서법", "인사이트 축적", "습관 시스템"])
- recommendedBooks: 참가자의 독서 수준과 관심사를 고려한 맞춤 추천 도서 3권 배열. 각 항목은 { title, author, reason, tag } 포함.
- tailoredQuestions: 세미나 당일 연사에게 질문하거나 조별 토론에서 동료들과 나눌 수 있는 깊이 있는 맞춤 질문 3개 배열
- growthRoadmap: 3단계 독서 성장 로드맵 배열 [{ step: "1단계: 지식 흡수", description: "..." }, { step: "2단계: 인사이트 연결", description: "..." }, { step: "3단계: 일상 및 실행 적용", description: "..." }]
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
              keyInsightKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
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
              tailoredQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
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

      const responseText = response.text?.trim() || '{}';
      const parsedData = JSON.parse(responseText);

      return res.json({
        success: true,
        data: parsedData,
        isFallback: false,
      });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      // Fallback on error to ensure flawless UX
      const { name, jobOrField, recentBook, readingGoal, selectedSession } = req.body;
      return res.json({
        success: true,
        data: generateFallbackAnalysis(name, jobOrField, recentBook, readingGoal, selectedSession),
        isFallback: true,
        error: error?.message || 'Gemini 분석 중 일시적 오류가 발생하여 기본 분석 결과가 제공됩니다.',
      });
    }
  });

  // Google Sheet Webhook URL 지속 보관 (서버 메모리 및 파일)
  let persistedSheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || '';
  const SHEET_CONFIG_FILE = path.join(__dirname, '.sheet-config.json');
  if (fs.existsSync(SHEET_CONFIG_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(SHEET_CONFIG_FILE, 'utf-8'));
      if (data.sheetUrl) {
        persistedSheetUrl = data.sheetUrl;
      }
    } catch (e) {
      console.warn('Failed to read .sheet-config.json:', e);
    }
  }

  // Google Sheet URL 조회 API
  app.get('/api/config/sheet-url', (req: Request, res: Response) => {
    res.json({ sheetUrl: persistedSheetUrl });
  });

  // Google Sheet URL 저장 API (개발자/관리자 전용)
  app.post('/api/config/sheet-url', (req: Request, res: Response) => {
    const { sheetUrl } = req.body || {};
    persistedSheetUrl = (sheetUrl || '').trim();
    try {
      fs.writeFileSync(SHEET_CONFIG_FILE, JSON.stringify({ sheetUrl: persistedSheetUrl }), 'utf-8');
    } catch (e) {
      console.warn('Failed to write .sheet-config.json:', e);
    }
    res.json({ success: true, sheetUrl: persistedSheetUrl });
  });

  // API 2: 구글 스프레드시트 Webhook 프록시 (CORS 문제 방지용)
  app.post('/api/submit-sheet', async (req: Request, res: Response) => {
    try {
      const { webhookUrl, payload } = req.body || {};
      const targetUrl = webhookUrl || persistedSheetUrl || process.env.GOOGLE_SHEET_WEBHOOK_URL;

      if (!targetUrl) {
        return res.json({
          success: false,
          message: '구글 스프레드시트 웹 앱 URL이 설정되지 않았습니다.',
          localOnly: true,
        });
      }

      // Google Apps Script 웹 앱으로 POST 요청 전달
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });

      const resultText = await response.text();
      let resultData;
      try {
        resultData = JSON.parse(resultText);
      } catch {
        resultData = { raw: resultText };
      }

      return res.json({
        success: true,
        message: '구글 스프레드시트에 성공적으로 저장되었습니다.',
        sheetResult: resultData,
      });
    } catch (error: any) {
      console.error('Sheet Proxy Error:', error);
      return res.status(500).json({
        success: false,
        message: '구글 시트 전송 중 오류가 발생했습니다: ' + error.message,
      });
    }
  });

  // 환경 정보 상태 확인 API
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      hasSheetUrl: Boolean(process.env.GOOGLE_SHEET_WEBHOOK_URL),
    });
  });

  // 전체 프로젝트 ZIP 다운로드 API (초보자 원클릭 파일 일괄 다운로드용)
  app.get('/api/download-project-zip', async (req: Request, res: Response) => {
    try {
      const zip = new JSZip();

      const addFilesRecursively = (dir: string, zipFolder: JSZip) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (
            entry.name === 'node_modules' ||
            entry.name === '.git' ||
            entry.name === 'dist' ||
            entry.name === '.env' ||
            entry.name === '.vite'
          ) {
            continue;
          }
          if (entry.isDirectory()) {
            const nextFolder = zipFolder.folder(entry.name);
            if (nextFolder) {
              addFilesRecursively(fullPath, nextFolder);
            }
          } else {
            const content = fs.readFileSync(fullPath);
            zipFolder.file(entry.name, content);
          }
        }
      };

      addFilesRecursively(__dirname, zip);

      const buffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6,
        },
      });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="smart-reading-seminar.zip"');
      res.setHeader('Content-Length', buffer.length.toString());
      res.send(buffer);
    } catch (err: any) {
      console.error('ZIP generation error:', err);
      res.status(500).send('ZIP 생성 실패: ' + err.message);
    }
  });

  // 프로젝트 전체 소스코드 목록 및 내용 반환 API (웹 브라우저 파일 뷰어 & 1클릭 복사용)
  app.get('/api/project-files', (req: Request, res: Response) => {
    try {
      const fileList: { path: string; name: string; content: string; size: number }[] = [];

      const readFilesRecursively = (dir: string, relPath: string = '') => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (
            entry.name === 'node_modules' ||
            entry.name === '.git' ||
            entry.name === 'dist' ||
            entry.name === '.env' ||
            entry.name === '.vite' ||
            entry.name.endsWith('.lock')
          ) {
            continue;
          }
          const fullPath = path.join(dir, entry.name);
          const relative = relPath ? `${relPath}/${entry.name}` : entry.name;
          if (entry.isDirectory()) {
            readFilesRecursively(fullPath, relative);
          } else {
            const content = fs.readFileSync(fullPath, 'utf-8');
            fileList.push({
              path: relative,
              name: entry.name,
              content,
              size: Buffer.byteLength(content, 'utf-8'),
            });
          }
        }
      };

      readFilesRecursively(__dirname);
      res.json({ files: fileList });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 개발 모드: Vite Middleware 연동
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // 프로덕션 모드: 빌드된 정적 파일 제공
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[독서 세미나 포털] 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  });
}

// 템플릿 기반 Fallback 분석기 (API Key 부재 시에도 완벽 작동)
function generateFallbackAnalysis(
  name: string,
  jobOrField: string,
  recentBook: string,
  readingGoal: string,
  selectedSession: string
) {
  const safeName = name || '독서가';
  const safeField = jobOrField || '성장과 지식 탐구';
  const safeBook = recentBook || '지혜와 통찰을 담은 명저';

  return {
    personaSummary: `${safeField}에 열정을 가진 능동적 인사이트 탐험가`,
    feedbackMessage: `${safeName}님, 최근 접하신 '${safeBook}'을 바탕으로 스스로를 한 단계 더 성장시키고자 하는 열정이 매우 인상적입니다. 이번 세미나는 단순한 책 읽기를 넘어 일과 삶에 직접 적용할 수 있는 강력한 실행 도구를 갖추는 전환점이 될 것입니다.`,
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
      `책에서 얻은 아이디어를 3일 이내에 실제 업무나 생활 루틴에 안착시키는 가장 확실한 비결은 무엇인가요?`,
      `읽고 나서 금방 잊히는 독서가 아닌, 1년 뒤에도 삶의 나침반이 되는 나만의 '독서 노트 체계'를 어떻게 구축할 수 있을까요?`,
      `다양한 배경을 가진 동료 독서가들과 함께 지식을 나누고 토론할 때 가장 시너지를 낼 수 있는 관점은 무엇인가요?`,
    ],
    growthRoadmap: [
      {
        step: '1단계: 핵심 질문 정의',
        description: '책을 펼치기 전 "이 책에서 반드시 해결하고 싶은 질문 1가지"를 명확히 기록하고 독서를 시작합니다.',
      },
      {
        step: '2단계: 여백 메모와 발췌',
        description: '감명 깊은 문장에 밑줄을 긋고, 그 문장이 내 삶에 주는 시사점을 한 문장으로 즉시 메모합니다.',
      },
      {
        step: '3단계: 72시간 내 원-액션(One-Action) 실행',
        description: '세미나 종료 후 책에서 발견한 가장 마음에 드는 원칙 하나를 72시간 이내에 직접 시도해봅니다.',
      },
    ],
  };
}

startServer();
