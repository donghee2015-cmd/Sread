import React, { useState } from 'react';
import { Search, FileSpreadsheet, Download, User, Calendar, ExternalLink, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ApplicationSubmission } from '../types';
import { exportApplicationsToCSV } from '../services/storage';

interface LookupTicketProps {
  applications: ApplicationSubmission[];
  onSelectApplication: (app: ApplicationSubmission) => void;
  onApplyClick: () => void;
}

export const LookupTicket: React.FC<LookupTicketProps> = ({
  applications,
  onSelectApplication,
  onApplyClick,
}) => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<ApplicationSubmission | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const clean = query.trim().toLowerCase();
    if (!clean) {
      setResult(null);
      return;
    }

    const found = applications.find(
      (item) =>
        item.id.toLowerCase() === clean ||
        item.email.toLowerCase() === clean ||
        item.name.toLowerCase() === clean ||
        item.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '')
    );
    setResult(found || null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Search Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
        <div className="max-w-xl mx-auto text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
            <Search className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            신청 내역 & 스마트 티켓 조회
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            신청 시 등록하셨던 <strong className="text-slate-800">이메일 주소</strong> 또는 발급받으신{' '}
            <strong className="text-slate-800">접수번호(RD-2026-XXXX)</strong>를 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-2">
          <input
            type="text"
            placeholder="이메일 주소, 이름, 접수번호 입력..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition cursor-pointer"
          >
            조회하기
          </button>
        </form>

        {/* Search Result Display */}
        {searched && (
          <div className="mt-6 max-w-lg mx-auto">
            {result ? (
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-indigo-700">{result.id}</span>
                    <span className="text-xs font-bold text-slate-900">{result.name} 님</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{result.selectedSessionTitle}</p>
                </div>
                <button
                  onClick={() => onSelectApplication(result)}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  티켓 열기
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-600">
                  입력하신 정보와 일치하는 신청 내역을 찾을 수 없습니다.
                </p>
                <button
                  onClick={onApplyClick}
                  className="mt-2 text-xs font-bold text-indigo-600 hover:underline inline-block"
                >
                  지금 새로 참가 신청하기 &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Admin / Organizer Application List Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                접수된 참가자 명단 현황
              </h3>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                총 {applications.length}명
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              접수된 내역은 브라우저 로컬 저장소와 연동된 구글 스프레드시트에 보관됩니다.
            </p>
          </div>

          <button
            onClick={exportApplicationsToCSV}
            className="self-start sm:self-auto px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            엑셀/CSV 다운로드
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            현재 접수된 참가 신청 내역이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">접수번호</th>
                  <th className="py-3 px-4">성명</th>
                  <th className="py-3 px-4">선택 세션</th>
                  <th className="py-3 px-4">최근 읽은 책</th>
                  <th className="py-3 px-4">AI 독서 페르소나</th>
                  <th className="py-3 px-4">시트 연동</th>
                  <th className="py-3 px-4 text-right">상세보기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-medium text-indigo-700">
                      {app.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {app.name}
                    </td>
                    <td className="py-3 px-4 max-w-[180px] truncate" title={app.selectedSessionTitle}>
                      {app.selectedSessionTitle}
                    </td>
                    <td className="py-3 px-4 max-w-[120px] truncate" title={app.recentBook}>
                      {app.recentBook}
                    </td>
                    <td className="py-3 px-4 max-w-[180px] truncate text-slate-600">
                      {app.aiAnalysis?.personaSummary || '분석 완료'}
                    </td>
                    <td className="py-3 px-4">
                      {app.savedToGoogleSheet ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          구글시트
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">로컬</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectApplication(app)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-semibold transition cursor-pointer"
                      >
                        티켓 보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
