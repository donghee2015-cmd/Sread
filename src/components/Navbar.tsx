import React from 'react';
import { BookOpen, Sparkles, FileSpreadsheet, Search, Rocket, CheckCircle2, FileCode } from 'lucide-react';

interface NavbarProps {
  activeTab: 'apply' | 'info' | 'lookup';
  setActiveTab: (tab: 'apply' | 'info' | 'lookup') => void;
  onApplyClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('apply')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-400 group-hover:text-amber-300 transition" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">스마트 독서 세미나</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  Gemini AI 결합
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">참가 신청 & 구글 시트 자동 안내 센터</p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'info'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              세미나 상세 안내
            </button>
            <button
              onClick={() => setActiveTab('lookup')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                activeTab === 'lookup'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              신청 내역 & 티켓 조회
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex border-t border-slate-800 bg-slate-950 px-2 py-1.5 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap transition ${
            activeTab === 'info' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          세미나 안내
        </button>
        <button
          onClick={() => setActiveTab('lookup')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap transition ${
            activeTab === 'lookup' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          티켓 조회
        </button>
      </div>
    </header>
  );
};
