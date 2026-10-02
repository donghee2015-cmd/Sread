import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Laptop, ChevronDown, ChevronUp, User, Award, CheckCircle, HelpCircle } from 'lucide-react';
import { SEMINAR_SESSIONS, SEMINAR_FEATURES, FREQUENT_QUESTIONS } from '../constants/seminarData';

interface SeminarInfoProps {
  onApplyClick: () => void;
}

export const SeminarInfo: React.FC<SeminarInfoProps> = ({ onApplyClick }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* 1. 세션 커리큘럼 소개 */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full">
            CURRICULUM & SESSIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            실전과 성장을 위한 세미나 세션 소개
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            관심 있는 세션을 선택하여 신청하실 수 있습니다. 모든 세션은 질의응답 및 조별 네트워킹을 포함합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEMINAR_SESSIONS.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {session.badge}
                  </span>
                  <span className="text-xs text-slate-500">
                    정원 {session.capacity}명 (잔여 {session.capacity - session.currentEnrolled}석)
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-3">
                  {session.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {session.description}
                </p>

                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{session.location}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">추천 대상</span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg leading-snug">
                    {session.targetAudience}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={session.instructorAvatar}
                    alt={session.instructor}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{session.instructor}</h5>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{session.instructorRole}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 핵심 혜택 및 특징 */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
            WHY JOIN US
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            스마트 독서 세미나만의 4가지 특별함
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SEMINAR_FEATURES.map((feat, idx) => (
            <div key={idx} className="bg-slate-800/60 border border-slate-700/80 p-5 rounded-2xl">
              <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {feat.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            신청 즉시 AI 맞춤 리포트와 모바일 티켓이 생성됩니다.
          </p>
          <button
            onClick={onApplyClick}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            지금 무료 신청하기
          </button>
        </div>
      </section>

      {/* 3. 자주 묻는 질문 (FAQ) */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full">
            FAQ
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            자주 묻는 질문
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FREQUENT_QUESTIONS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
