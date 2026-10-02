import React from 'react';
import { Calendar, Users, Sparkles, FileSpreadsheet, ShieldCheck, ArrowRight, Laptop, Award } from 'lucide-react';

interface HeroSectionProps {
  onApplyClick: () => void;
  onExploreInfo: () => void;
  totalEnrolled: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onApplyClick,
  onExploreInfo,
  totalEnrolled,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {/* Top Badges */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1 px-3 rounded-full bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm text-xs mb-6">
          <span className="flex items-center gap-1 text-amber-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            2026 스마트 리딩 포럼
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            10월 24일 ~ 31일 하이브리드 개최
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            사전 신청자 전원 무료 참여
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
          책을 읽는 것에서 그치지 않고, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
            내 삶과 비즈니스의 실행력
          </span>
          으로 바꾸는 3시간
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          신청서를 작성하면 <strong className="text-amber-300 font-semibold">Gemini AI</strong>가 최근 읽으신 책과 목표를 분석하여{' '}
          <span className="text-white underline decoration-indigo-400 underline-offset-4 font-medium">맞춤 추천 도서 3권</span>과{' '}
          <span className="text-white underline decoration-amber-400 underline-offset-4 font-medium">세미나 질문 로드맵</span>을 즉시 생성해 드립니다.
          접수된 내역은 <span className="text-emerald-300 font-medium">구글 스프레드시트</span>에 실시간으로 안전하게 자동 기록됩니다.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onApplyClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
          >
            <span>지금 무료 참가 신청하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onExploreInfo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:text-white transition flex items-center justify-center gap-2"
          >
            <span>세션 커리큘럼 & 연사 둘러보기</span>
          </button>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
              <Users className="w-4 h-4" />
              실시간 접수 현황
            </div>
            <p className="text-xl font-bold text-white">
              {totalEnrolled} <span className="text-xs text-slate-400 font-normal">명 참가 중</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">선착순 마감 세션 주의</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
              <Sparkles className="w-4 h-4" />
              Gemini AI 맞춤 진단
            </div>
            <p className="text-xl font-bold text-white">초개인화</p>
            <p className="text-[11px] text-slate-400 mt-0.5">독서 페르소나 & 로드맵</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
              <FileSpreadsheet className="w-4 h-4" />
              구글 시트 연동
            </div>
            <p className="text-xl font-bold text-white">100% 자동</p>
            <p className="text-[11px] text-slate-400 mt-0.5">실시간 데이터 시트 기록</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs mb-1">
              <Laptop className="w-4 h-4" />
              참여 방식
            </div>
            <p className="text-xl font-bold text-white">하이브리드</p>
            <p className="text-[11px] text-slate-400 mt-0.5">강남 오프라인 & Zoom</p>
          </div>
        </div>
      </div>
    </div>
  );
};
