/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ApplicationForm } from './components/ApplicationForm';
import { ProcessingModal } from './components/ProcessingModal';
import { SeminarTicketModal } from './components/SeminarTicketModal';
import { SeminarInfo } from './components/SeminarInfo';
import { LookupTicket } from './components/LookupTicket';
import { GoogleSheetsGuideModal } from './components/GoogleSheetsGuideModal';
import { VercelDeployGuide } from './components/VercelDeployGuide';
import { SourceCodeViewerModal } from './components/SourceCodeViewerModal';
import { ToastContainer } from './components/Toast';
import {
  getStoredApplications,
  saveApplication,
  getStoredSheetUrl,
  saveStoredSheetUrl,
} from './services/storage';
import { requestAIReadingAnalysis, submitToGoogleSheet } from './services/api';
import { ApplicationSubmission, SeminarSession, ToastMessage } from './types';
import { BookOpen, Sparkles, FileSpreadsheet, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'apply' | 'info' | 'lookup' | 'deploy'>('apply');
  const [applications, setApplications] = useState<ApplicationSubmission[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [selectedTicketApp, setSelectedTicketApp] = useState<ApplicationSubmission | null>(null);
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [showCodeViewerModal, setShowCodeViewerModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize data on mount
  useEffect(() => {
    const apps = getStoredApplications();
    setApplications(apps);
    const savedUrl = getStoredSheetUrl();
    setSheetUrl(savedUrl);
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveSheetUrl = (url: string) => {
    setSheetUrl(url);
    saveStoredSheetUrl(url);
  };

  // Form submission handler
  const handleApplicationSubmit = async (formData: {
    name: string;
    email: string;
    phone: string;
    jobOrField: string;
    recentBook: string;
    readingGoal: string;
    selectedSession: SeminarSession;
    customQuestion?: string;
  }) => {
    setIsSubmitting(true);
    setShowProcessingModal(true);

    const generatedId = `RD-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    try {
      // 1. Gemini AI Analysis
      const aiResponse = await requestAIReadingAnalysis({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        jobOrField: formData.jobOrField,
        recentBook: formData.recentBook,
        readingGoal: formData.readingGoal,
        selectedSession: formData.selectedSession.title,
        customQuestion: formData.customQuestion,
      });

      // 2. Prepare full submission record
      let savedToGoogleSheet = false;
      let sheetErrorMessage: string | undefined;

      const submissionPayload = {
        id: generatedId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        jobOrField: formData.jobOrField,
        recentBook: formData.recentBook,
        readingGoal: formData.readingGoal,
        selectedSessionId: formData.selectedSession.id,
        selectedSessionTitle: formData.selectedSession.title,
        customQuestion: formData.customQuestion,
        createdAt: formattedDate,
        status: 'confirmed' as const,
        aiAnalysis: aiResponse.data,
      };

      // 3. Google Sheet Webhook Sync (if configured)
      if (sheetUrl) {
        try {
          const sheetResult = await submitToGoogleSheet(sheetUrl, submissionPayload);
          savedToGoogleSheet = sheetResult.success;
          if (!sheetResult.success) {
            sheetErrorMessage = sheetResult.message;
          }
        } catch (e: any) {
          savedToGoogleSheet = false;
          sheetErrorMessage = e.message;
        }
      }

      const completeApplication: ApplicationSubmission = {
        ...submissionPayload,
        savedToGoogleSheet,
        sheetErrorMessage,
      };

      // Ensure minimum 1.6s delay for realistic, comforting UX loading animation
      await new Promise((resolve) => setTimeout(resolve, 1600));

      // 4. Save to Local Storage & State
      saveApplication(completeApplication);
      setApplications(getStoredApplications());

      // 5. Provide feedback to user
      setShowProcessingModal(false);
      setIsSubmitting(false);

      if (savedToGoogleSheet) {
        addToast(
          'success',
          '참가 신청 및 구글 시트 등록 완료!',
          `${formData.name}님의 신청서가 구글 스프레드시트에 기록되고 AI 분석 리포트가 발급되었습니다.`
        );
      } else {
        addToast(
          'success',
          '참가 신청 완료!',
          `${formData.name}님의 신청서가 안전하게 접수되었습니다. 발급된 스마트 티켓을 확인하세요.`
        );
      }

      // Open Ticket Modal automatically
      setSelectedTicketApp(completeApplication);
    } catch (err: any) {
      setShowProcessingModal(false);
      setIsSubmitting(false);
      addToast('error', '신청 중 오류 발생', '잠시 후 다시 시도해 주세요.');
    }
  };

  const totalEnrolled = applications.reduce(
    (acc, curr) => acc + (curr ? 1 : 0),
    113 // Base registered count from demo seminar sessions
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Toast Alerts */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasSheetConfigured={Boolean(sheetUrl)}
        onOpenSheetModal={() => setShowSheetModal(true)}
        onOpenCodeViewer={() => setShowCodeViewerModal(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'apply' && (
          <div>
            <HeroSection
              onApplyClick={() => {
                const el = document.getElementById('application-form-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreInfo={() => setActiveTab('info')}
              totalEnrolled={totalEnrolled}
            />
            <div id="application-form-section">
              <ApplicationForm
                onSubmit={handleApplicationSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <SeminarInfo
            onApplyClick={() => {
              setActiveTab('apply');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'lookup' && (
          <LookupTicket
            applications={applications}
            onSelectApplication={(app) => setSelectedTicketApp(app)}
            onApplyClick={() => {
              setActiveTab('apply');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'deploy' && (
          <VercelDeployGuide
            onOpenSheetGuide={() => setShowSheetModal(true)}
            onOpenCodeViewer={() => setShowCodeViewerModal(true)}
            onShowToast={addToast}
          />
        )}
      </main>

      {/* Processing Animation Modal */}
      <ProcessingModal isOpen={showProcessingModal} />

      {/* Smart Seminar Ticket & Personalized Report Modal */}
      <SeminarTicketModal
        application={selectedTicketApp}
        onClose={() => setSelectedTicketApp(null)}
      />

      {/* Google Sheets Apps Script Integration Guide Modal */}
      <GoogleSheetsGuideModal
        isOpen={showSheetModal}
        onClose={() => setShowSheetModal(false)}
        currentSheetUrl={sheetUrl}
        onSaveSheetUrl={handleSaveSheetUrl}
        onShowToast={addToast}
      />

      {/* Full Project Source Code Viewer & 1-Click Copy Modal */}
      <SourceCodeViewerModal
        isOpen={showCodeViewerModal}
        onClose={() => setShowCodeViewerModal(false)}
        onShowToast={addToast}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">스마트 독서 세미나 안내 센터</p>
              <p className="text-[11px] text-slate-400">
                Gemini AI 맞춤 진단 & Google Sheets 실시간 연동 지원
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-300">
            <button
              onClick={() => setActiveTab('apply')}
              className="hover:text-white transition cursor-pointer"
            >
              참가 신청
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className="hover:text-white transition cursor-pointer"
            >
              세미나 안내
            </button>
            <button
              onClick={() => setActiveTab('lookup')}
              className="hover:text-white transition cursor-pointer"
            >
              신청 조회
            </button>
            <button
              onClick={() => setShowSheetModal(true)}
              className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3 h-3" />
              구글 시트 연동 설정
            </button>
            <button
              onClick={() => setActiveTab('deploy')}
              className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Vercel 무료 배포 가이드
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center md:text-right">
            © 2026 Smart Reading Seminar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
