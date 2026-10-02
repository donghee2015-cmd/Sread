import React, { useState, useEffect } from 'react';
import { FolderTree, Copy, Check, Download, FileCode, X, Search, FileText } from 'lucide-react';

interface ProjectFile {
  path: string;
  name: string;
  content: string;
  size: number;
}

interface SourceCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const SourceCodeViewerModal: React.FC<SourceCodeViewerModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/project-files')
      .then((res) => res.json())
      .then((data) => {
        if (data.files && data.files.length > 0) {
          setFiles(data.files);
          // Default to src/App.tsx or first file
          const appFile = data.files.find((f: ProjectFile) => f.path === 'src/App.tsx') || data.files[0];
          setSelectedFile(appFile);
        }
      })
      .catch((err) => {
        console.error('Failed to load project files', err);
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredFiles = files.filter((f) =>
    f.path.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('success', '복사 완료', `${selectedFile.path} 내용이 클립보드에 복사되었습니다.`);
  };

  const handleDownloadSingleFile = () => {
    if (!selectedFile) return;
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    onShowToast('success', '다운로드 완료', `${selectedFile.name} 파일이 다운로드되었습니다.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FolderTree className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>프로젝트 전체 소스코드 뷰어 & 1클릭 복사</span>
                <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  총 {files.length}개 파일
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                압축 풀기 오류가 나거나 파일 내용을 바로 확인하고 싶을 때 복사할 수 있습니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split Pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: File Tree / List */}
          <div className="w-64 sm:w-72 bg-slate-950/60 border-r border-slate-800 flex flex-col shrink-0">
            {/* Search Box */}
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="파일명 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5 font-mono text-xs">
              {loading ? (
                <div className="p-4 text-center text-slate-500 text-xs">파일 목록 로딩 중...</div>
              ) : (
                filteredFiles.map((f) => {
                  const isSelected = selectedFile?.path === f.path;
                  return (
                    <button
                      key={f.path}
                      onClick={() => setSelectedFile(f)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between group transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span className="truncate text-[11px]">{f.path}</span>
                      <span className="text-[10px] opacity-50 shrink-0 ml-1">
                        {(f.size / 1024).toFixed(1)}k
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {selectedFile ? (
              <>
                {/* Code Viewer Toolbar */}
                <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate font-mono text-xs">
                    <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-white font-bold">{selectedFile.path}</span>
                    <span className="text-[10px] text-slate-400">({selectedFile.size} bytes)</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? '복사됨!' : '이 파일 전체 복사'}
                    </button>

                    <button
                      onClick={handleDownloadSingleFile}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>단일 파일 저장</span>
                    </button>
                  </div>
                </div>

                {/* Code Area */}
                <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 bg-slate-950/40 leading-relaxed selection:bg-indigo-600 selection:text-white">
                  <pre className="whitespace-pre">{selectedFile.content}</pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                파일을 선택해 주세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
