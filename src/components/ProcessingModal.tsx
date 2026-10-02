import React, { useEffect, useState } from 'react';
import { Sparkles, FileSpreadsheet, CheckCircle2, Loader2, BookOpen } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
}

export const ProcessingModal: React.FC<ProcessingModalProps> = ({ isOpen }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      return;
    }

    const timer1 = setTimeout(() => setStep(2), 700);
    const timer2 = setTimeout(() => setStep(3), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white text-center relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Center Animated Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center mb-5">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <Sparkles className="w-4 h-4 text-amber-300 absolute top-2 right-2 animate-bounce" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          신청서를 처리하고 있습니다...
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Gemini AI가 작성하신 독서 고민을 분석하고 안전하게 접수를 진행 중입니다.
        </p>

        {/* Steps Progress Checklist */}
        <div className="space-y-3 text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          {/* Step 1 */}
          <div className="flex items-center gap-3 text-xs">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition ${
                step >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step > 1 ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : '1'}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${step >= 1 ? 'text-slate-200' : 'text-slate-500'}`}>
                참가자 인적사항 및 세미나 세션 배정
              </p>
              <p className="text-[10px] text-slate-400">잔여 좌석 확인 및 신청서 유효성 체크</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3 text-xs">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition ${
                step >= 2 ? (step > 2 ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-500 text-white animate-pulse') : 'bg-slate-800 text-slate-500'
              }`}
            >
              {step > 2 ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : '2'}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${step >= 2 ? 'text-indigo-300' : 'text-slate-500'}`}>
                Gemini AI 맞춤 독서 성향 및 추천 도서 분석
              </p>
              <p className="text-[10px] text-slate-400">개인화 독서 페르소나 및 세미나 토론 질문 작성</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3 text-xs">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition ${
                step >= 3 ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-800 text-slate-500'
              }`}
            >
              3
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${step >= 3 ? 'text-slate-200' : 'text-slate-500'}`}>
                구글 스프레드시트 기록 & 스마트 티켓 발급
              </p>
              <p className="text-[10px] text-slate-400">신청 내역 영구 보존 및 확인증 생성</p>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="mt-5 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400 h-full transition-all duration-700 ease-out"
            style={{ width: step === 1 ? '30%' : step === 2 ? '75%' : '95%' }}
          />
        </div>
      </div>
    </div>
  );
};
