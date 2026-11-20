import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Lock,
  Settings2,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { DIFFICULTY_META, DIFFICULTY_ORDER, pickText, UI_COPY } from '../data/translations';
import { Language, ProgressMap, Question, Subject } from '../types/adventure';
import {
  getSubjectProgress,
  HERO_BANNER_IMAGE,
  isLevelUnlocked,
  SUBJECT_IMAGE_PATHS,
} from '../utils/storage';
import { SafeImage } from './SafeImage';

interface HomeViewProps {
  lang: Language;
  subjects: Subject[];
  questions: Question[];
  progress: ProgressMap;
  explorerName: string;
  soundEnabled: boolean;
  onExplorerNameChange: (name: string) => void;
  onToggleSound: () => void;
  onSelectSubject: (subjectId: string) => void;
  onOpenManage: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  lang,
  subjects,
  questions,
  progress,
  explorerName,
  soundEnabled,
  onExplorerNameChange,
  onToggleSound,
  onSelectSubject,
  onOpenManage,
}) => {
  const [selectedClassroom, setSelectedClassroom] = useState<string>('ALL');

  const classrooms = useMemo(() => {
    const unique = new Set<string>();
    subjects.forEach((sub) => {
      const label = pickText(sub.classroom, lang);
      if (label) unique.add(label);
    });
    return Array.from(unique);
  }, [subjects, lang]);

  const filteredSubjects = useMemo(() => {
    if (selectedClassroom === 'ALL') return subjects;
    return subjects.filter((sub) => pickText(sub.classroom, lang) === selectedClassroom);
  }, [subjects, selectedClassroom, lang]);

  const stats = useMemo(() => {
    let totalPoints = 0;
    let clearedLevels = 0;
    let totalCorrect = 0;
    let totalAnswered = 0;

    subjects.forEach((sub) => {
      const subProg = getSubjectProgress(progress, sub.id);
      DIFFICULTY_ORDER.forEach((lvl) => {
        const entry = subProg[lvl];
        if (entry?.completed) {
          clearedLevels += 1;
          totalPoints += entry.bestScore;
          totalCorrect += entry.correctCount;
          totalAnswered += entry.totalCount;
        }
      });
    });

    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return {
      totalPoints,
      subjectsCount: subjects.length,
      clearedLevels,
      totalPossibleLevels: subjects.length * 4,
      accuracy,
    };
  }, [subjects, progress]);

  const DirArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const handleStartAdventure = () => {
    if (subjects.length > 0) {
      onSelectSubject(subjects[0].id);
    } else {
      onOpenManage();
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Split Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="bg-white/92 backdrop-blur-md border border-white/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-indigo-600 tracking-normal">
                  {pickText(UI_COPY.hero.kicker, lang)}
                </p>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight text-balance">
                  {pickText(UI_COPY.hero.title, lang)}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  {pickText(UI_COPY.hero.subtitle, lang)}
                </p>
              </div>

              {/* Workspace Quick Settings (Explorer Name + Sound Toggle) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <User className="w-4 h-4 text-slate-500 shrink-0" />
                  <label htmlFor="explorer-name-input" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                    {pickText(UI_COPY.hero.explorerLabel, lang)}
                  </label>
                  <input
                    id="explorer-name-input"
                    type="text"
                    value={explorerName}
                    onChange={(e) => onExplorerNameChange(e.target.value)}
                    placeholder={pickText(UI_COPY.hero.explorerPlaceholder, lang)}
                    className="bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none w-32 sm:w-40"
                  />
                </div>

                <button
                  type="button"
                  onClick={onToggleSound}
                  className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                  <span>
                    {soundEnabled
                      ? pickText(UI_COPY.hero.soundOn, lang)
                      : pickText(UI_COPY.hero.soundOff, lang)}
                  </span>
                </button>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleStartAdventure}
                  className="btn-tactile inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 whitespace-nowrap shrink-0"
                >
                  <Compass className="w-5 h-5" />
                  <span>{pickText(UI_COPY.hero.primaryCta, lang)}</span>
                  <DirArrow className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenManage}
                  className="btn-tactile inline-flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl whitespace-nowrap shrink-0"
                >
                  <Settings2 className="w-4 h-4 text-slate-500" />
                  <span>{pickText(UI_COPY.hero.secondaryCta, lang)}</span>
                </button>
              </div>
            </div>

            {/* Hero Overworld Illustration */}
            <div className="lg:col-span-6 flex">
              <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm min-h-[240px]">
                <SafeImage
                  src={HERO_BANNER_IMAGE}
                  alt="Class Adventure World Map"
                  fallbackType="hero"
                  className="w-full h-full lg:h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 4-Column Stats Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500">
                {pickText(UI_COPY.stats.totalPoints, lang)}
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-indigo-700 font-mono-num">
                {stats.totalPoints}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500">
                {pickText(UI_COPY.stats.subjectsCount, lang)}
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-num">
                {stats.subjectsCount}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500">
                {pickText(UI_COPY.stats.levelsCleared, lang)}
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono-num">
                {stats.clearedLevels}
                <span className="text-base font-semibold text-slate-400">
                  /{stats.totalPossibleLevels}
                </span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500">
                {pickText(UI_COPY.stats.accuracy, lang)}
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono-num">
                {stats.accuracy}%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects & Classrooms Section */}
      <section id="subjects-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-balance">
              {pickText(UI_COPY.subjectsSection.title, lang)}
            </h2>
            <p className="text-sm sm:text-base font-medium text-slate-800">
              {pickText(UI_COPY.subjectsSection.subtitle, lang)}
            </p>
          </div>

          {/* Interactive Classroom Filter Bar */}
          {classrooms.length > 0 && (
            <div
              className="flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-sm border border-white/80 rounded-xl overflow-x-auto max-w-full shadow-2xs"
              role="tablist"
              aria-label="Classroom Filter"
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedClassroom === 'ALL'}
                onClick={() => setSelectedClassroom('ALL')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedClassroom === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pickText(UI_COPY.subjectsSection.allClassrooms, lang)}
              </button>
              {classrooms.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  role="tab"
                  aria-selected={selectedClassroom === cls}
                  onClick={() => setSelectedClassroom(cls)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedClassroom === cls
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Subjects Grid */}
        {filteredSubjects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-4">
            <p className="text-slate-600 font-medium">
              {pickText(UI_COPY.subjectsSection.noSubjects, lang)}
            </p>
            <button
              type="button"
              onClick={onOpenManage}
              className="btn-tactile px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              {pickText(UI_COPY.manage.addSubject, lang)}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => {
              const subProg = getSubjectProgress(progress, subject.id);
              const clearedCount = DIFFICULTY_ORDER.filter(
                (lvl) => subProg[lvl]?.completed
              ).length;
              const subjectQuestionsCount = questions.filter(
                (q) => q.subjectId === subject.id
              ).length;

              return (
                <article
                  key={subject.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <div className="space-y-4">
                    {/* Emblem + Subject Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                        <SafeImage
                          src={SUBJECT_IMAGE_PATHS[subject.imageKey]}
                          alt={pickText(subject.name, lang)}
                          fallbackType={subject.imageKey}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="text-lg font-extrabold text-slate-900 truncate">
                          {pickText(subject.name, lang)}
                        </h3>
                        {/* Unboxed clean metadata with typographic separator */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-medium text-slate-500">
                          <span>{pickText(subject.classroom, lang)}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {pickText(UI_COPY.subjectsSection.teacherPrefix, lang)}{' '}
                            <strong className="text-slate-700 font-semibold">
                              {pickText(subject.teacher, lang)}
                            </strong>
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono-num">
                          {clearedCount}/4 {pickText(UI_COPY.subjectsSection.levelsUnlockedOf, lang)} ·{' '}
                          {subjectQuestionsCount} {pickText(UI_COPY.subjectMap.questionsCount, lang)}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {pickText(subject.description, lang)}
                    </p>

                    {/* 4-Level Status Track (Explicit Icon + Text, Never Color-Only) */}
                    <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100">
                      {DIFFICULTY_ORDER.map((lvl) => {
                        const meta = DIFFICULTY_META[lvl];
                        const unlocked = isLevelUnlocked(progress, subject.id, lvl);
                        const completed = subProg[lvl]?.completed;

                        return (
                          <div
                            key={lvl}
                            className={`rounded-lg px-2 py-2 text-center border text-[11px] font-bold flex flex-col items-center justify-center gap-1 ${
                              completed
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : unlocked
                                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                                  : 'bg-slate-50/50 border-slate-100 text-slate-400'
                            }`}
                          >
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <span aria-hidden="true">{meta.marker}</span>
                              <span>{pickText(meta.shortLabel, lang)}</span>
                            </span>
                            {completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : unlocked ? (
                              <Award className="w-3.5 h-3.5 text-indigo-600" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectSubject(subject.id)}
                    className="btn-tactile w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl whitespace-nowrap"
                  >
                    <span>{pickText(UI_COPY.subjectsSection.enterSubject, lang)}</span>
                    <DirArrow className="w-4 h-4" />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
