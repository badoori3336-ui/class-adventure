export type Language = 'ar' | 'en';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'extreme';

export interface LocalizedText {
  ar: string;
  en: string;
}

export type SubjectImageKey = 'math' | 'science' | 'language' | 'tech';

export type SubjectTheme = 'royal' | 'emerald' | 'crimson' | 'indigo' | 'amber';

export interface Subject {
  id: string;
  name: LocalizedText;
  classroom: LocalizedText;
  teacher: LocalizedText;
  description: LocalizedText;
  imageKey: SubjectImageKey;
  theme: SubjectTheme;
}

export interface Question {
  id: string;
  subjectId: string;
  difficulty: DifficultyLevel;
  prompt: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  explanation: LocalizedText;
  points: number;
}

export interface LevelCompletion {
  completed: boolean;
  bestScore: number;
  maxPossibleScore: number;
  correctCount: number;
  totalCount: number;
  attempts: number;
  lastPlayedAt: string;
}

export type SubjectProgress = Record<DifficultyLevel, LevelCompletion>;

export type ProgressMap = Record<string, SubjectProgress>;

export interface QuizAnswerRecord {
  question: Question;
  selectedIndex: number;
  isCorrect: boolean;
  earnedPoints: number;
}

export interface QuizResult {
  subjectId: string;
  difficulty: DifficultyLevel;
  totalPoints: number;
  maxPoints: number;
  correctCount: number;
  wrongCount: number;
  records: QuizAnswerRecord[];
  newlyUnlockedLevel: DifficultyLevel | null;
  completedAt: string;
}

export type AppView = 'home' | 'subject' | 'quiz' | 'results' | 'manage' | 'progress';
