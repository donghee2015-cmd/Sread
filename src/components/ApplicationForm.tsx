import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, MapPin, User, Mail, Phone, Briefcase, BookOpen, Send, Check, AlertCircle } from 'lucide-react';
import { SEMINAR_SESSIONS } from '../constants/seminarData';
import { SeminarSession } from '../types';

interface ApplicationFormProps {
  onSubmit: (formData: {
    name: string;
    email: string;
    phone: string;
    jobOrField?: string;
    recentBook: string;
    readingGoal: string;
    selectedSession: SeminarSession;
    customQuestion?: string;
  }) => void;
  isSubmitting: boolean;
}

const BOOK_SUGGESTIONS = [
  '아토믹 해빗 (원자 습관)',
  '어떻게 읽을 것인가',
  '제2의 뇌 만들기',
  '원씽 (The ONE Thing)',
  '역행자',
  '생각에 관한 생각',
  '퓨처 셀프',
  '클린 코드 / 실용주의 프로그래머',
];

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit, isSubmitting }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [recentBook, setRecentBook] = useState('');
  const [readingGoal, setReadingGoal] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState(SEMINAR_SESSIONS[0].id);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedSession = SEMINAR_SESSIONS.find((s) => s.id === selectedSessionId) || SEMINAR_SESSIONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('참가자 성함을 입력해주세요.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('정확한 이메일 주소를 입력해주세요. (입장권 및 안내문 발송용)');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('연락처(휴대폰 번호)를 입력해주세요.');
      return;
    }
    if (!recentBook.trim()) {
      setErrorMsg('최근 읽으셨거나 관심 있는 도서명을 적어주세요. (AI 맞춤 분석에 필수입니다)');
      return;
    }
    if (!readingGoal.trim()) {
      setErrorMsg('이번 세미나에서 얻고 싶은 점이나 독서 고민을 간략히 적어주세요.');
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      jobOrField: '',
      recentBook: recentBook.trim(),
      readingGoal: readingGoal.trim(),
      selectedSession,
      customQuestion: '',
    });

    // 신청서 제출 후 모든 입력 항목 초기화
    setName('');
    setEmail('');
    setPhone('');
    setRecentBook('');
    setReadingGoal('');
    setSelectedSessionId(SEMINAR_SESSIONS[0].id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Form Header Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 sm:px-8 py-6 text-white border-b border-indigo-900/40">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI 맞춤 분석 신청서</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            스마트 독서 세미나 참가 신청서 작성
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            기본 정보와 관심 도서를 입력하시면, 접수와 동시에{' '}
            <strong className="text-amber-300 font-medium">Gemini AI</strong>가 맞춤 추천 도서와 피드백을 즉시 작성해 드립니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. 세션 선택 (Session Selector) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-extrabold">
                  1
                </span>
                참가 희망 세션 선택 (택 1)
              </label>
              <span className="text-xs text-slate-500">전 세션 온라인 Zoom 실시간 동시 송출</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SEMINAR_SESSIONS.map((session) => {
                const isSelected = session.id === selectedSessionId;
                const remaining = session.capacity - session.currentEnrolled;

                return (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            session.badge === '마감임박'
                              ? 'bg-rose-100 text-rose-700'
                              : session.badge === '인기세션'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {session.badge}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          잔여 <strong className="text-indigo-600 font-bold">{remaining}</strong>석
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                        {session.title}
                      </h4>

                      <div className="mt-3 space-y-1 text-[11px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{session.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{session.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={session.instructorAvatar}
                          alt={session.instructor}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        />
                        <span className="text-xs font-medium text-slate-800">{session.instructor}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border transition ${
                          isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. 기본 인적사항 */}
          <div>
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-extrabold">
                2
              </span>
              참가자 기본 인적사항
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  성명 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  이메일 주소 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  휴대폰 번호 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="010-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. 독서 경험 및 AI 분석용 정보 */}
          <div>
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-extrabold">
                3
              </span>
              독서 이력 및 세미나 참여 고민 (Gemini AI 맞춤 진단)
            </label>

            {/* 최근 읽은 책 */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                최근 인상 깊게 읽은 책 또는 관심 있는 도서명 <span className="text-rose-500">*</span>
              </label>
              <div className="relative mb-2">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="도서명을 입력하세요 (예: 아토믹 해빗, 제2의 뇌 만들기, 생각의 탄생 등)"
                  value={recentBook}
                  onChange={(e) => setRecentBook(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-slate-500">인기 도서 태그:</span>
                {BOOK_SUGGESTIONS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setRecentBook(b)}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition ${
                      recentBook === b
                        ? 'bg-amber-500 text-white font-medium'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* 세미나에서 얻고 싶은 점 / 고민 */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                이번 세미나에서 얻고 싶은 점 또는 평소 독서/실행 고민 <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="예: 책을 읽고 나면 일주일만 지나도 내용이 기억나지 않습니다. 핵심 인사이트를 요약하고 실무나 삶의 루틴에 바로 적용하는 실천적인 메모 독서법을 익히고 싶습니다."
                value={readingGoal}
                onChange={(e) => setReadingGoal(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                작성해주신 고민을 바탕으로 Gemini AI가 세미나 당일 연사 및 조원들과 나눌 수 있는 맞춤형 질문지를 준비해드립니다.
              </p>
            </div>
          </div>

          {/* 제출 버튼 및 실시간 처리 안내 */}
          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl font-bold text-base text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transform active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>참가 신청 및 AI 분석 진행 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>신청서 작성 완료 및 제출</span>
                </>
              )}
            </button>

            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500 text-center">
              <span>✓ 참가비 100% 무료</span>
              <span>•</span>
              <span>✓ 구글 스프레드시트 실시간 동기화</span>
              <span>•</span>
              <span>✓ 모바일 스마트 티켓 즉시 발급</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
