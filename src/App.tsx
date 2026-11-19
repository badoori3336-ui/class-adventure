import { useEffect, useMemo, useState } from 'react';
import { HomeView } from './components/HomeView';
import { ManagerView } from './components/ManagerView';
import { ProgressView } from './components/ProgressView';
import { QuizArenaView } from './components/QuizArenaView';
import { ResultsView } from './components/ResultsView';
import { SubjectMapView } from './components/SubjectMapView';
import { TopBar } from './components/TopBar';
import { SEED_QUESTIONS, SEED_SUBJECTS } from './data/seedData';
import { UI_COPY } from './data/translations';
import {
  AppView,
  DifficultyLevel,
  Language,
  ProgressMap,
  Question,
  QuizAnswerRecord,
  QuizResult,
  Subject,
} from './types/adventure';
import { buildQuizRound } from './utils/quizBuilder';
import { playSoundEffect } from './utils/sound';
import {
  createEmptySubjectProgress,
  getNextLevel,
  isLevelUnlocked,
  loadExplorerName,
  loadLanguage,
  loadProgress,
  loadQuestions,
  loadRecentQuestions,
  loadSoundEnabled,
  loadSubjects,
  saveExplorerName,
  saveLanguage,
  saveProgress,
  saveQuestions,
  saveRecentQuestions,
  saveSoundEnabled,
  saveSubjects,
} from './utils/storage';

export default function App() {
  const [lang, setLang] = useState<Language>(() => loadLanguage());
  const [subjects, setSubjects] = useState<Subject[]>(() => loadSubjects(SEED_SUBJECTS));
  const [questions, setQuestions] = useState<Question[]>(() => loadQuestions(SEED_QUESTIONS));
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
  const [recentQuestions, setRecentQuestions] = useState<Record<string, string[]>>(() =>
    loadRecentQuestions()
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => loadSoundEnabled());
  const [explorerName, setExplorerName] = useState<string>(() => loadExplorerName());

  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    () => subjects[0]?.id || ''
  );
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel>('easy');
  const [activeRoundQuestions, setActiveRoundQuestions] = useState<Question[]>([]);
  const [quizSessionKey, setQuizSessionKey] = useState<number>(0);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [manageSubjectFilter, setManageSubjectFilter] = useState<string | undefined>(undefined);

  // Sync HTML direction and lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    saveLanguage(lang);
  }, [lang]);

  useEffect(() => {
    saveSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    saveQuestions(questions);
  }, [questions]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    saveExplorerName(explorerName);
  }, [explorerName]);

  useEffect(() => {
    saveRecentQuestions(recentQuestions);
  }, [recentQuestions]);

  const activeSubject = useMemo(
    () => subjects.find((s) => s.id === selectedSubjectId) || subjects[0],
    [subjects, selectedSubjectId]
  );

  const handleToggleLanguage = () => {
    playSoundEffect('click', soundEnabled);
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleNavigate = (view: AppView) => {
    playSoundEffect('click', soundEnabled);
    if (view !== 'manage') {
      setManageSubjectFilter(undefined);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToSubjects = () => {
    playSoundEffect('click', soundEnabled);
    setActiveView('home');
    setTimeout(() => {
      const el = document.getElementById('subjects-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleSelectSubject = (subjectId: string) => {
    playSoundEffect('click', soundEnabled);
    setSelectedSubjectId(subjectId);
    setActiveView('subject');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartQuiz = (subjectId: string, level: DifficultyLevel) => {
    if (!isLevelUnlocked(progress, subjectId, level)) return;
    const pool = questions.filter(
      (q) => q.subjectId === subjectId && q.difficulty === level
    );
    if (pool.length === 0) return;

    const recentKey = `${subjectId}_${level}`;
    const prevIds = recentQuestions[recentKey] || [];
    const round = buildQuizRound(pool, prevIds, 4);

    setRecentQuestions((prev) => ({
      ...prev,
      [recentKey]: round.map((q) => q.id),
    }));

    playSoundEffect('click', soundEnabled);
    setSelectedSubjectId(subjectId);
    setActiveDifficulty(level);
    setActiveRoundQuestions(round);
    setQuizSessionKey((prev) => prev + 1);
    setActiveView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishQuiz = (records: QuizAnswerRecord[]) => {
    if (!activeSubject) return;

    const totalPoints = records.reduce((sum, r) => sum + r.earnedPoints, 0);
    const maxPoints = records.reduce((sum, r) => sum + r.question.points, 0);
    const correctCount = records.filter((r) => r.isCorrect).length;
    const wrongCount = records.length - correctCount;

    const prevSubjectProgress = progress[activeSubject.id] ?? createEmptySubjectProgress();
    const prevLevelEntry = prevSubjectProgress[activeDifficulty];
    const wasAlreadyCompleted = prevLevelEntry?.completed === true;

    const nextLevel = getNextLevel(activeDifficulty);
    const newlyUnlockedLevel =
      !wasAlreadyCompleted && nextLevel !== null ? nextLevel : null;

    if (newlyUnlockedLevel) {
      playSoundEffect('unlock', soundEnabled);
    } else {
      playSoundEffect('complete', soundEnabled);
    }

    // Any score counts as completing the level and unlocks the next tier
    const shouldUpdateBest =
      !prevLevelEntry.completed || totalPoints >= prevLevelEntry.bestScore;

    const updatedProgress: ProgressMap = {
      ...progress,
      [activeSubject.id]: {
        ...prevSubjectProgress,
        [activeDifficulty]: {
          completed: true,
          bestScore: shouldUpdateBest ? totalPoints : prevLevelEntry.bestScore,
          maxPossibleScore: maxPoints,
          correctCount: shouldUpdateBest ? correctCount : prevLevelEntry.correctCount,
          totalCount: records.length,
          attempts: (prevLevelEntry.attempts || 0) + 1,
          lastPlayedAt: new Date().toISOString(),
        },
      },
    };

    setProgress(updatedProgress);
    setLastResult({
      subjectId: activeSubject.id,
      difficulty: activeDifficulty,
      totalPoints,
      maxPoints,
      correctCount,
      wrongCount,
      records,
      newlyUnlockedLevel,
      completedAt: new Date().toISOString(),
    });
    setActiveView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSubject = (subject: Subject) => {
    playSoundEffect('click', soundEnabled);
    setSubjects((prev) => {
      const exists = prev.some((s) => s.id === subject.id);
      if (exists) {
        return prev.map((s) => (s.id === subject.id ? subject : s));
      }
      return [...prev, subject];
    });
  };

  const handleDeleteSubject = (subjectId: string) => {
    playSoundEffect('click', soundEnabled);
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    setQuestions((prev) => prev.filter((q) => q.subjectId !== subjectId));
    setProgress((prev) => {
      const copy = { ...prev };
      delete copy[subjectId];
      return copy;
    });
  };

  const handleSaveQuestion = (question: Question) => {
    playSoundEffect('click', soundEnabled);
    setQuestions((prev) => {
      const exists = prev.some((q) => q.id === question.id);
      if (exists) {
        return prev.map((q) => (q.id === question.id ? question : q));
      }
      return [...prev, question];
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    playSoundEffect('click', soundEnabled);
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleResetProgress = () => {
    playSoundEffect('click', soundEnabled);
    setProgress({});
    setRecentQuestions({});
    setLastResult(null);
  };

  const handleRestoreDefaults = () => {
    playSoundEffect('click', soundEnabled);
    setSubjects(SEED_SUBJECTS);
    setQuestions(SEED_QUESTIONS);
    setProgress({});
    setRecentQuestions({});
    setLastResult(null);
    setSelectedSubjectId(SEED_SUBJECTS[0]?.id || '');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        lang={lang}
        activeView={activeView}
        onNavigate={handleNavigate}
        onJumpToSubjects={handleJumpToSubjects}
        onToggleLanguage={handleToggleLanguage}
      />

      <main className="flex-1">
        {activeView === 'home' && (
          <HomeView
            lang={lang}
            subjects={subjects}
            questions={questions}
            progress={progress}
            explorerName={explorerName}
            soundEnabled={soundEnabled}
            onExplorerNameChange={setExplorerName}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            onSelectSubject={handleSelectSubject}
            onOpenManage={() => handleNavigate('manage')}
          />
        )}

        {activeView === 'subject' && activeSubject && (
          <SubjectMapView
            lang={lang}
            subject={activeSubject}
            questions={questions}
            progress={progress}
            onBack={() => handleNavigate('home')}
            onStartQuiz={(lvl) => handleStartQuiz(activeSubject.id, lvl)}
            onEditQuestions={(subId) => {
              setManageSubjectFilter(subId);
              setActiveView('manage');
            }}
          />
        )}

        {activeView === 'quiz' && activeSubject && (
          <QuizArenaView
            key={`${activeSubject.id}-${activeDifficulty}-${quizSessionKey}`}
            lang={lang}
            subject={activeSubject}
            difficulty={activeDifficulty}
            questions={activeRoundQuestions}
            soundEnabled={soundEnabled}
            onExit={() => setActiveView('subject')}
            onFinish={handleFinishQuiz}
          />
        )}

        {activeView === 'results' && activeSubject && lastResult && (
          <ResultsView
            lang={lang}
            subject={activeSubject}
            result={lastResult}
            questions={questions}
            onRetry={() => handleStartQuiz(activeSubject.id, lastResult.difficulty)}
            onPlayNextLevel={(nextLvl) => handleStartQuiz(activeSubject.id, nextLvl)}
            onBackToSubject={() => setActiveView('subject')}
          />
        )}

        {activeView === 'progress' && (
          <ProgressView
            lang={lang}
            subjects={subjects}
            questions={questions}
            progress={progress}
            onStartQuiz={handleStartQuiz}
            onOpenSubject={handleSelectSubject}
          />
        )}

        {activeView === 'manage' && (
          <ManagerView
            lang={lang}
            subjects={subjects}
            questions={questions}
            initialSubjectFilter={manageSubjectFilter}
            onSaveSubject={handleSaveSubject}
            onDeleteSubject={handleDeleteSubject}
            onSaveQuestion={handleSaveQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onResetProgress={handleResetProgress}
            onRestoreDefaults={handleRestoreDefaults}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p className="font-bold text-slate-700">{UI_COPY.brand}</p>
          <p>
            {lang === 'ar'
              ? 'منصة تعليمية تفاعلية · جميع المراحل تفتح تدريجيًا بالاستمرار والتعلّم'
              : 'Interactive Learning Quests · Complete any level to unlock the next challenge'}
          </p>
        </div>
      </footer>
    </div>
  );
}
