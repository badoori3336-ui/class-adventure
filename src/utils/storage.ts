import badgeLanguageImg from '../assets/images/badge_subject_language_1795089023601.jpg';
import badgeMathImg from '../assets/images/badge_subject_math_1795089022471.jpg';
import badgeScienceImg from '../assets/images/badge_subject_science_1795089022267.jpg';
import badgeTechImg from '../assets/images/badge_subject_tech_1795089023372.jpg';
import heroAdventureMapImg from '../assets/images/hero_adventure_map_1795089022322.jpg';
import { DIFFICULTY_ORDER } from '../data/translations';
import {
  DifficultyLevel,
  Language,
  LevelCompletion,
  ProgressMap,
  Question,
  Subject,
  SubjectImageKey,
  SubjectProgress,
} from '../types/adventure';

const STORAGE_KEYS = {
  subjects: 'class_adventure_subjects_v5_g3',
  questions: 'class_adventure_questions_v6_g3',
  progress: 'class_adventure_progress_v2_g3',
  recentQuestions: 'class_adventure_recent_q_v1',
  language: 'class_adventure_lang_v1',
  sound: 'class_adventure_sound_v1',
  explorer: 'class_adventure_explorer_v1',
};

export const SUBJECT_IMAGE_PATHS: Record<SubjectImageKey, string> = {
  math: badgeMathImg,
  science: badgeScienceImg,
  language: badgeLanguageImg,
  tech: badgeTechImg,
};

export const HERO_BANNER_IMAGE = heroAdventureMapImg;

export function createEmptyLevelCompletion(): LevelCompletion {
  return {
    completed: false,
    bestScore: 0,
    maxPossibleScore: 0,
    correctCount: 0,
    totalCount: 0,
    attempts: 0,
    lastPlayedAt: '',
  };
}

export function createEmptySubjectProgress(): SubjectProgress {
  return {
    easy: createEmptyLevelCompletion(),
    medium: createEmptyLevelCompletion(),
    hard: createEmptyLevelCompletion(),
    extreme: createEmptyLevelCompletion(),
  };
}

export function getSubjectProgress(progress: ProgressMap, subjectId: string): SubjectProgress {
  return progress[subjectId] ?? createEmptySubjectProgress();
}

export function isLevelUnlocked(
  progress: ProgressMap,
  subjectId: string,
  level: DifficultyLevel
): boolean {
  if (level === 'easy') return true;
  const subProgress = getSubjectProgress(progress, subjectId);
  const idx = DIFFICULTY_ORDER.indexOf(level);
  if (idx <= 0) return true;
  const prevLevel = DIFFICULTY_ORDER[idx - 1];
  return subProgress[prevLevel]?.completed === true;
}

export function getNextLevel(level: DifficultyLevel): DifficultyLevel | null {
  const idx = DIFFICULTY_ORDER.indexOf(level);
  if (idx < 0 || idx >= DIFFICULTY_ORDER.length - 1) return null;
  return DIFFICULTY_ORDER[idx + 1];
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSubjects(seed: Subject[]): Subject[] {
  return loadFromStorage<Subject[]>(STORAGE_KEYS.subjects, seed);
}

export function saveSubjects(subjects: Subject[]): void {
  saveToStorage(STORAGE_KEYS.subjects, subjects);
}

export function loadQuestions(seed: Question[]): Question[] {
  return loadFromStorage<Question[]>(STORAGE_KEYS.questions, seed);
}

export function saveQuestions(questions: Question[]): void {
  saveToStorage(STORAGE_KEYS.questions, questions);
}

export function loadProgress(): ProgressMap {
  return loadFromStorage<ProgressMap>(STORAGE_KEYS.progress, {});
}

export function saveProgress(progress: ProgressMap): void {
  saveToStorage(STORAGE_KEYS.progress, progress);
}

export function loadLanguage(): Language {
  return loadFromStorage<Language>(STORAGE_KEYS.language, 'ar');
}

export function saveLanguage(lang: Language): void {
  saveToStorage(STORAGE_KEYS.language, lang);
}

export function loadSoundEnabled(): boolean {
  return loadFromStorage<boolean>(STORAGE_KEYS.sound, true);
}

export function saveSoundEnabled(enabled: boolean): void {
  saveToStorage(STORAGE_KEYS.sound, enabled);
}

export function loadExplorerName(): string {
  return loadFromStorage<string>(STORAGE_KEYS.explorer, '');
}

export function saveExplorerName(name: string): void {
  saveToStorage(STORAGE_KEYS.explorer, name);
}

export function loadRecentQuestions(): Record<string, string[]> {
  return loadFromStorage<Record<string, string[]>>(STORAGE_KEYS.recentQuestions, {});
}

export function saveRecentQuestions(recent: Record<string, string[]>): void {
  saveToStorage(STORAGE_KEYS.recentQuestions, recent);
}
