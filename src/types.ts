export interface SeminarSession {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  currentEnrolled: number;
  instructor: string;
  instructorRole: string;
  instructorAvatar: string;
  description: string;
  targetAudience: string;
  badge: string;
}

export interface RecommendedBook {
  title: string;
  author: string;
  reason: string;
  tag: string;
}

export interface RoadmapStep {
  step: string;
  description: string;
}

export interface AIAnalysisResult {
  personaSummary: string;
  feedbackMessage: string;
  keyInsightKeywords: string[];
  recommendedBooks: RecommendedBook[];
  tailoredQuestions: string[];
  growthRoadmap: RoadmapStep[];
}

export interface ApplicationSubmission {
  id: string; // e.g. RD-2026-9281
  name: string;
  email: string;
  phone: string;
  jobOrField: string;
  recentBook: string;
  readingGoal: string;
  selectedSessionId: string;
  selectedSessionTitle: string;
  customQuestion?: string;
  createdAt: string;
  status: 'confirmed' | 'pending';
  aiAnalysis: AIAnalysisResult;
  savedToGoogleSheet: boolean;
  sheetErrorMessage?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
