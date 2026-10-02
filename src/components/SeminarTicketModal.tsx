import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  User,
  Share2,
  FileSpreadsheet,
  X,
  ExternalLink,
  Award,
} from 'lucide-react';
import { ApplicationSubmission } from '../types';

interface SeminarTicketModalProps {
  application: ApplicationSubmission | null;
  onClose: () => void;
}

export const SeminarTicketModal: React.FC<SeminarTicketModalProps> = ({ application, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!application) return null;

  const { aiAnalysis } = application;

  const handleCopy = () => {
    const text = `[스마트 독서 세미나 참가 확인증]
- 접수번호: ${application.id}
- 참가자: ${application.name} 님
- 신청 세션: ${application.selectedSessionTitle}
- AI 독서 페르소나: ${aiAnalysis?.personaSummary || '독서가'}
- 추천 도서: ${(aiAnalysis?.recommendedBooks || []).map((b) => b.title).join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden relative print:border-none print:shadow-none print:m-0">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition print:hidden"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              참가 신청 정상 완료
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">접수 고유 번호</span>
              <span className="text-sm sm:text-base font-mono font-bold tracking-wider text-amber-300">
                {application.id}
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
            스마트 독서 세미나 모바일 스마트 티켓
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            환영합니다, <strong className="text-white font-semibold">{application.name}</strong>님! 아래의 맞춤 독서 리포트와 세미나 일정을 확인해 주세요.
          </p>

          {/* Google Sheet Sync Pill */}
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${
                application.savedToGoogleSheet
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              {application.savedToGoogleSheet
                ? '구글 스프레드시트 실시간 동기화 완료'
                : '로컬 데이터베이스에 안전하게 보관됨'}
            </span>
            <span className="text-slate-400 text-[11px]">
              접수일시: {application.createdAt}
            </span>
          </div>
        </div>

        {/* Ticket Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Basic Seminar Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
            <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-3">
              세미나 참여 정보
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-slate-500 block text-xs">선택 세션</span>
                <strong className="text-slate-900 font-bold block mt-0.5">
                  {application.selectedSessionTitle}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">참가자 연락처 및 이메일</span>
                <span className="text-slate-800 block mt-0.5">
                  {application.email} • {application.phone}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">참가 방식 및 입장 안내</span>
                <span className="text-indigo-700 font-medium block mt-0.5">
                  온·오프라인 하이브리드 (행사 1일 전 문자 및 이메일로 줌 링크 발송)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">참가자 관심 분야</span>
                <span className="text-slate-800 block mt-0.5">{application.jobOrField}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Gemini AI Personalized Reading Report */}
          {aiAnalysis && (
            <div className="border border-indigo-200/80 bg-gradient-to-br from-indigo-50/60 via-white to-amber-50/40 rounded-2xl p-5 sm:p-6 shadow-sm">
              {/* Persona Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                      Gemini AI 맞춤 독서 진단
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      "{aiAnalysis.personaSummary}"
                    </h3>
                  </div>
                </div>

                {/* Insight Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {aiAnalysis.keyInsightKeywords?.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold bg-white border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full shadow-2xs"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Feedback Message */}
              <div className="bg-white/80 border border-indigo-100/80 rounded-xl p-4 mb-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>{aiAnalysis.feedbackMessage}</p>
              </div>

              {/* 3 Recommended Books */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>{application.name}님을 위한 세미나 전후 맞춤 추천 도서 3선</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {aiAnalysis.recommendedBooks?.map((book, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs"
                    >
                      <div>
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                          {book.tag}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">
                          {book.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 mb-2">저자: {book.author}</p>
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                          {book.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tailored Questions & Roadmap Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Tailored Questions */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    세미나 당일 추천 토론 질문
                  </h4>
                  <ul className="space-y-2 text-[11px] text-slate-600">
                    {aiAnalysis.tailoredQuestions?.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold shrink-0">Q{idx + 1}.</span>
                        <span className="leading-snug">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3-Step Growth Roadmap */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    독서 실행 3단계 로드맵
                  </h4>
                  <div className="space-y-2 text-[11px]">
                    {aiAnalysis.growthRoadmap?.map((rm, idx) => (
                      <div key={idx} className="border-l-2 border-emerald-400 pl-2">
                        <strong className="text-slate-800 block text-[11px]">{rm.step}</strong>
                        <p className="text-slate-600 text-[10px] leading-snug">{rm.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 print:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                티켓 인쇄 / PDF 저장
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '복사 완료' : '확인증 텍스트 복사'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
