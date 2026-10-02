import React, { useState } from 'react';
import { Rocket, ShieldCheck, Key, FolderTree, GitBranch, Globe, Copy, Check, FileSpreadsheet, Sparkles, ExternalLink, FileCode } from 'lucide-react';

interface VercelDeployGuideProps {
  onOpenSheetGuide: () => void;
  onOpenCodeViewer: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const VercelDeployGuide: React.FC<VercelDeployGuideProps> = ({
  onOpenSheetGuide,
  onOpenCodeViewer,
  onShowToast,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
    onShowToast('success', '복사 완료', `'${text}'가 복사되었습니다.`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-slate-800">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
          <Rocket className="w-3.5 h-3.5" />
          코딩 초보자를 위한 100% 무료 배포 멘토링
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          GitHub & Vercel 무료 배포 완벽 가이드
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
          이 웹앱은 <strong>GitHub</strong>에 코드를 올리고 <strong>Vercel(버셀)</strong>을 통해 클릭 몇 번으로 전 세계 어디서나 접속할 수 있는 웹사이트로 무료 배포할 수 있도록 설계되었습니다. 초보자도 그대로 따라 하실 수 있도록 1단계부터 3단계까지 상세히 정리했습니다.
        </p>
      </div>

      {/* Recommended Path: Direct GitHub Export Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold mb-2 border border-indigo-500/30">
            <GitBranch className="w-3.5 h-3.5 text-amber-300" />
            <span>가장 쉽고 빠른 추천 방식</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">
            Google AI Studio에서 GitHub으로 1초 만에 바로 내보내기
          </h3>
          <p className="text-slate-300 text-xs mt-1.5 leading-relaxed max-w-xl">
            압축 파일을 내 컴퓨터에 다운로드받아 풀 필요 없이, 상단 툴바의 <strong>[GitHub 아이콘 또는 Export]</strong>를 누르면 모든 코드 파일이 내 GitHub 저장소로 자동 생성됩니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCodeViewer}
          className="w-full md:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <FileCode className="w-4 h-4 text-amber-300" />
          <span>전체 소스코드 브라우저에서 보기</span>
        </button>
      </div>

      {/* Security Explanation Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-amber-950">
              [필수 보안 원칙] API 키를 코드 파일에 직접 적지 않는 이유
            </h3>
            <p className="text-xs text-amber-900/80 mt-1.5 leading-relaxed">
              집 현관문 비밀번호를 대문 앞에 써붙여놓지 않듯이, <strong>Gemini API 키</strong>나 <strong>웹훅 주소</strong>를 코드 파일에 직접 적어두면 누구나 내 비밀 키를 훔쳐 쓸 수 있습니다.<br />
              따라서 코드는 GitHub에 안전하게 올리고, 실제 비밀 키는 <strong>Vercel 대시보드의 'Environment Variables(환경 변수)'</strong>라는 안전한 비밀 금고에만 등록하는 것이 웹 표준 보안 규칙입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: File Structure */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
            1
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            1단계: 프로젝트 파일 구조 & 내 컴퓨터에 폴더 만드는 법
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
          <strong>"폴더에 저장한다"</strong>는 것은 내 컴퓨터 바탕화면에 폴더를 하나 만들고, 그 안에 하위 폴더와 파일들을 이름대로 차곡차곡 넣어두는 것을 의미합니다. 아래의 실습 가이드를 따라 해보세요!
        </p>

        {/* Practical Folder Creation Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4">
            <span className="text-[11px] font-bold text-indigo-700 block mb-1">A. 메인 폴더 만들기</span>
            <p className="text-xs text-slate-700 leading-relaxed">
              바탕화면 빈 곳에서 <strong>마우스 우클릭 &gt; [새 폴더]</strong>를 누르고 폴더 이름을 <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-mono text-[11px]">my-reading-app</code>으로 정합니다.
            </p>
          </div>
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4">
            <span className="text-[11px] font-bold text-indigo-700 block mb-1">B. 하위 폴더 2개 만들기</span>
            <p className="text-xs text-slate-700 leading-relaxed">
              그 폴더 안으로 들어가서 <code className="bg-white px-1 py-0.5 rounded border font-mono text-[11px]">api</code> 폴더와 <code className="bg-white px-1 py-0.5 rounded border font-mono text-[11px]">src</code> 폴더를 만듭니다. (src 폴더 안에는 <code className="bg-white px-1 py-0.5 rounded border font-mono text-[11px]">components</code>, <code className="bg-white px-1 py-0.5 rounded border font-mono text-[11px]">services</code>, <code className="bg-white px-1 py-0.5 rounded border font-mono text-[11px]">constants</code> 폴더 생성)
            </p>
          </div>
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4">
            <span className="text-[11px] font-bold text-indigo-700 block mb-1">C. 파일 저장하기</span>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>VS Code(추천)</strong> 또는 메모장에서 코드를 복사한 뒤, 안내된 위치에 정확한 파일명(확장자 포함)으로 <strong>[저장]</strong>하시면 됩니다.
            </p>
          </div>
        </div>

        {/* Tree Visual */}
        <div className="bg-slate-950 text-slate-200 rounded-xl p-5 font-mono text-xs overflow-x-auto border border-slate-800 leading-loose">
          <p className="text-indigo-400 font-bold">📁 my-reading-app/ (바탕화면에 만든 메인 폴더)</p>
          <p className="pl-4">├── 📁 <span className="text-amber-300 font-bold">api/</span> <span className="text-slate-500">(새 폴더)</span></p>
          <p className="pl-8">├── <span className="text-emerald-400 font-semibold">analyze-reading.ts</span></p>
          <p className="pl-8">└── <span className="text-emerald-400 font-semibold">submit-sheet.ts</span></p>
          <p className="pl-4">├── 📁 <span className="text-amber-300 font-bold">src/</span> <span className="text-slate-500">(새 폴더)</span></p>
          <p className="pl-8">├── 📁 <span className="text-sky-300 font-bold">components/</span> <span className="text-slate-500">(src 안의 새 폴더)</span></p>
          <p className="pl-12">├── ApplicationForm.tsx, ProcessingModal.tsx, SeminarTicketModal.tsx ...</p>
          <p className="pl-8">├── 📁 <span className="text-sky-300 font-bold">services/</span> <span className="text-slate-500">(src 안의 새 폴더)</span></p>
          <p className="pl-12">├── api.ts, storage.ts</p>
          <p className="pl-8">├── 📁 <span className="text-sky-300 font-bold">constants/</span> <span className="text-slate-500">(src 안의 새 폴더)</span></p>
          <p className="pl-12">├── seminarData.ts</p>
          <p className="pl-8">├── <span className="text-emerald-400 font-semibold">App.tsx</span>, <span className="text-emerald-400 font-semibold">main.tsx</span>, <span className="text-emerald-400 font-semibold">types.ts</span>, <span className="text-emerald-400 font-semibold">index.css</span></p>
          <p className="pl-4">├── <span className="text-emerald-400 font-semibold">package.json</span> <span className="text-slate-500">(메인 폴더 바로 아래)</span></p>
          <p className="pl-4">├── <span className="text-emerald-400 font-semibold">tsconfig.json</span> <span className="text-slate-500">(메인 폴더 바로 아래)</span></p>
          <p className="pl-4">├── <span className="text-emerald-400 font-semibold">vite.config.ts</span> <span className="text-slate-500">(메인 폴더 바로 아래)</span></p>
          <p className="pl-4">├── <span className="text-emerald-400 font-semibold">server.ts</span> <span className="text-slate-500">(메인 폴더 바로 아래)</span></p>
          <p className="pl-4">├── <span className="text-emerald-400 font-semibold">index.html</span> <span className="text-slate-500">(메인 폴더 바로 아래)</span></p>
          <p className="pl-4">└── <span className="text-emerald-400 font-semibold">.env.example</span> <span className="text-slate-500">(메인 폴더 바로 아래)</span></p>
        </div>
      </div>

      {/* Step 2: GitHub Push */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
            2
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            2단계: GitHub에 소스코드 올리기
          </h3>
        </div>

        <ol className="space-y-3 text-xs sm:text-sm text-slate-600 list-decimal list-inside leading-relaxed">
          <li>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-semibold inline-flex items-center gap-1">
              GitHub.com <ExternalLink className="w-3 h-3" />
            </a>
            에 로그인 후 우측 상단 <strong>[+] &gt; [New repository]</strong>를 클릭합니다.
          </li>
          <li>
            저장소 이름(Repository name)에 <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono">smart-reading-seminar</code> 등을 입력하고 <strong>[Create repository]</strong>를 누릅니다.
          </li>
          <li>
            내 컴퓨터의 프로젝트 폴더에서 터미널을 열고 코드를 업로드합니다:
            <div className="bg-slate-900 text-slate-200 rounded-lg p-3 my-2 font-mono text-xs overflow-x-auto">
              git init<br />
              git add .<br />
              git commit -m "스마트 독서 세미나 웹앱 첫 배포"<br />
              git branch -M main<br />
              git remote add origin https://github.com/내아이디/smart-reading-seminar.git<br />
              git push -u origin main
            </div>
          </li>
        </ol>
      </div>

      {/* Step 3: Vercel Deploy & Environment Variables */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
            3
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            3단계: Vercel에서 무료 배포하고 환경 변수(Environment Variables) 입력하기
          </h3>
        </div>

        <ol className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          <li>
            <strong>1)</strong>{' '}
            <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-semibold inline-flex items-center gap-1">
              Vercel.com <ExternalLink className="w-3 h-3" />
            </a>
            에 접속하여 GitHub 계정으로 간편 가입 및 로그인합니다.
          </li>
          <li>
            <strong>2)</strong> 대시보드에서 <strong>[Add New...] &gt; [Project]</strong>를 누르고, 방금 올린 GitHub 저장소를 <strong>[Import]</strong>합니다.
          </li>
          <li>
            <strong>3)</strong> <u>가장 중요한 단계!</u> 배포 화면 중간의 <strong>[Environment Variables]</strong> 아코디언 메뉴를 열고 아래의 2가지 변수를 입력합니다:
          </li>
        </ol>

        {/* Variables Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 w-1/3">Environment Variable Key (키 이름)</th>
                <th className="p-3">Value (넣어야 할 값 설명)</th>
                <th className="p-3 w-20 text-center">복사</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-white hover:bg-slate-50 transition">
                <td className="p-3 font-mono font-bold text-indigo-700">
                  GEMINI_API_KEY
                </td>
                <td className="p-3 text-slate-600">
                  <span className="font-semibold text-slate-900">[필수]</span> Google AI Studio에서 무료로 발급받은 Gemini API 키
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    (aistudio.google.com/app/apikey 에서 1초 만에 무료 발급 가능)
                  </div>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => copyToClipboard('GEMINI_API_KEY', 'gemini')}
                    className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Key 이름 복사"
                  >
                    {copiedKey === 'gemini' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>

              <tr className="bg-white hover:bg-slate-50 transition">
                <td className="p-3 font-mono font-bold text-emerald-700">
                  GOOGLE_SHEET_WEBHOOK_URL
                </td>
                <td className="p-3 text-slate-600">
                  <span className="font-semibold text-slate-900">[선택]</span> 구글 스프레드시트 Apps Script 웹 앱 배포 URL
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    (상단 '구글 시트 연동' 메뉴에서 생성한 웹 앱 URL, 예: https://script.google.com/macros/s/.../exec)
                  </div>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => copyToClipboard('GOOGLE_SHEET_WEBHOOK_URL', 'sheet')}
                    className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Key 이름 복사"
                  >
                    {copiedKey === 'sheet' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-800">
              입력 후 하단의 <strong>[Deploy]</strong> 버튼을 누르면 1~2분 뒤 내 고유 도메인 주소(예: xxx.vercel.app)가 생성됩니다!
            </span>
          </div>
          <button
            onClick={onOpenSheetGuide}
            className="text-xs font-bold text-emerald-700 hover:underline shrink-0"
          >
            구글 시트 연동 코드 보기 &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
