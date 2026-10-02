import React, { useState } from 'react';
import { FileSpreadsheet, Copy, Check, ExternalLink, X, CheckCircle2, AlertCircle, Send, Play } from 'lucide-react';
import { submitToGoogleSheet } from '../services/api';

interface GoogleSheetsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSheetUrl: string;
  onSaveSheetUrl: (url: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

const APPS_SCRIPT_CODE = `// ==========================================
// [스마트 독서 세미나] 구글 스프레드시트 자동 연동 스크립트
// Google 스프레드시트 > 확장 프로그램 > Apps Script에 복사하세요!
// ==========================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // 첫 행에 제목(Header)이 없으면 자동으로 컬럼명을 생성합니다
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "접수일시", 
        "접수번호", 
        "이름", 
        "이메일", 
        "연락처", 
        "직업/관심분야", 
        "선택세션", 
        "최근읽은책", 
        "세미나목표", 
        "AI페르소나", 
        "AI추천도서", 
        "맞춤토론질문"
      ]);
      // 헤더 서식 지정 (남색 배경 + 흰색 볼드 글씨)
      var headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setBackground("#1e1b4b");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
    }
    
    // 신청자 데이터를 구글 시트 새 행에 추가합니다
    sheet.appendRow([
      new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
      data.id || ("RD-" + Math.floor(Math.random() * 900000 + 100000)),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.jobOrField || "",
      data.selectedSessionTitle || data.selectedSession?.title || "",
      data.recentBook || "",
      data.readingGoal || "",
      (data.aiAnalysis && data.aiAnalysis.personaSummary) || "",
      (data.aiAnalysis && data.aiAnalysis.recommendedBooks ? data.aiAnalysis.recommendedBooks.map(function(b){ return b.title; }).join(", ") : ""),
      (data.aiAnalysis && data.aiAnalysis.tailoredQuestions ? data.aiAnalysis.tailoredQuestions.join(" | ") : "")
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "저장 완료" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

export const GoogleSheetsGuideModal: React.FC<GoogleSheetsGuideModalProps> = ({
  isOpen,
  onClose,
  currentSheetUrl,
  onSaveSheetUrl,
  onShowToast,
}) => {
  const [sheetUrl, setSheetUrl] = useState(currentSheetUrl);
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('success', '코드 복사 완료', 'Apps Script 코드가 클립보드에 복사되었습니다.');
  };

  const handleSave = () => {
    onSaveSheetUrl(sheetUrl);
    onShowToast('success', '저장 완료', '구글 스프레드시트 웹 앱 URL이 설정되었습니다.');
  };

  const handleTestConnection = async () => {
    if (!sheetUrl.trim()) {
      onShowToast('error', 'URL 입력 필요', '먼저 배포하신 웹 앱 URL을 입력해 주세요.');
      return;
    }

    setIsTesting(true);
    try {
      const testPayload = {
        id: `TEST-${Math.floor(Math.random() * 9000 + 1000)}`,
        name: '구글시트 테스트 참가자',
        email: 'test@example.com',
        phone: '010-0000-0000',
        jobOrField: '연동 테스트',
        selectedSessionTitle: '구글 시트 연결 검증 테스트',
        recentBook: '스마트 독서 가이드',
        readingGoal: '구글 스프레드시트와 정상 연동되었는지 확인하는 테스트 행입니다.',
        aiAnalysis: {
          personaSummary: '정상 연결된 스마트 테스터',
          recommendedBooks: [{ title: '연동 성공 도서' }],
          tailoredQuestions: ['구글 시트 연동이 완벽하게 완료되었습니다!'],
        },
      };

      const res = await submitToGoogleSheet(sheetUrl.trim(), testPayload);
      if (res.success) {
        onSaveSheetUrl(sheetUrl.trim());
        onShowToast(
          'success',
          '구글 시트 연동 성공!',
          '구글 스프레드시트에 테스트 행이 성공적으로 추가되었습니다. 시트 문서를 확인해보세요!'
        );
      } else {
        onShowToast('error', '연동 실패', res.message);
      }
    } catch (e: any) {
      onShowToast('error', '연동 테스트 오류', e.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>100% 무료 무제한 데이터 저장소</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            구글 스프레드시트(Google Sheets) 연동 가이드
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            복잡한 유료 데이터베이스 대신, 구글 시트의 무료 Apps Script를 통해 신청자 명단을 엑셀처럼 실시간 관리하세요.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* URL Input Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 sm:p-5">
            <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center justify-between">
              <span>내 구글 Apps Script 웹 앱(Web App) URL</span>
              {currentSheetUrl ? (
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  현재 연동 활성화 상태
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">아직 미등록 (로컬 저장 모드)</span>
              )}
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                저장하기
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Play className="w-3 h-3 text-emerald-400" />
                {isTesting ? '테스트 전송 중...' : '테스트 데이터 전송'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              * URL을 등록해두면 신청자가 접수할 때마다 구글 스프레드시트에 자동으로 새 행이 생겨납니다.
            </p>
          </div>

          {/* 3 Step Beginner Guide */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span>초보자를 위한 3분 완성 3단계 가이드</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center mb-2">
                  1
                </span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">구글 시트 문서 생성</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-semibold underline inline-flex items-center gap-0.5"
                  >
                    sheets.new <ExternalLink className="w-3 h-3" />
                  </a>
                  에 접속하여 빈 스프레드시트 하나를 만듭니다. (시트 제목: '독서세미나 신청자')
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center mb-2">
                  2
                </span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Apps Script 열기 & 코드 붙여넣기</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  구글 시트 상단 메뉴에서 <strong>확장 프로그램 &gt; Apps Script</strong>를 누르고, 기존 내용을 모두 지운 뒤 아래의 코드를 붙여넣습니다.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center mb-2">
                  3
                </span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">웹 앱으로 배포하기</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  우측 상단 <strong>배포 &gt; 새 배포</strong> 클릭 후 유형을 <strong>웹 앱</strong>으로 선택, <u>'액세스 권한: 모든 사용자(Anyone)'</u>로 설정 후 배포된 웹 앱 URL을 복사하여 위에 붙여넣으면 끝!
                </p>
              </div>
            </div>
          </div>

          {/* Code Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                복사할 Google Apps Script 코드 (원클릭 복사)
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '복사되었습니다!' : '전체 코드 복사'}
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-300 font-mono text-[11px] p-4 max-h-56 overflow-y-auto leading-relaxed">
              <pre>{APPS_SCRIPT_CODE}</pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
