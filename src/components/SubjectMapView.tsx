import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Play,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Unlock,
} from 'lucide-react';
import { DIFFICULTY_META, DIFFICULTY_ORDER, pickText, UI_COPY } from '../data/translations';
import { DifficultyLevel, Language, ProgressMap, Question, Subject } from '../types/adventure';
import { getSubjectProgress, isLevelUnlocked, SUBJECT_IMAGE_PATHS } from '../utils/storage';
import { SafeImage } from './SafeImage';

interface SubjectMapViewProps {
  lang: Language;
  subject: Subject;
  questions: Question[];
  progress: ProgressMap;
  onBack: () => void;
  onStartQuiz: (difficulty: DifficultyLevel) => void;
  onEditQuestions: (subjectId: string) => void;
}

export const SubjectMapView: React.FC<SubjectMapViewProps> = ({
  lang,
  subject,
  questions,
  progress,
  onBack,
  onStartQuiz,
  onEditQuestions,
}) => {
  const subProgress = getSubjectProgress(progress, subject.id);
  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors whitespace-nowrap"
        >
          <BackArrow className="w-4 h-4" />
          <span>{pickText(UI_COPY.subjectMap.backHome, lang)}</span>
        </button>

        <button
          type="button"
          onClick={() => onEditQuestions(subject.id)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors whitespace-nowrap"
        >
          <Settings2 className="w-4 h-4" />
          <span>{pickText(UI_COPY.subjectMap.editSubjectQuestions, lang)}</span>
        </button>
      </div>

      {/* Subject Banner Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-xs">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
          <SafeImage
            src={SUBJECT_IMAGE_PATHS[subject.imageKey]}
            alt={pickText(subject.name, lang)}
            fallbackType={subject.imageKey}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {pickText(subject.name, lang)}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-600">
            <span>{pickText(subject.classroom, lang)}</span>
            <span aria-hidden="true">·</span>
            <span>
              {pickText(UI_COPY.subjectsSection.teacherPrefix, lang)}{' '}
              <strong className="text-slate-900 font-bold">{pickText(subject.teacher, lang)}</strong>
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {pickText(subject.description, lang)}
          </p>
        </div>
      </section>

      {/* Level Unlock Rule Notice */}
      <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-indigo-950 leading-relaxed">
          {pickText(UI_COPY.subjectMap.unlockRule, lang)}
        </p>
      </div>

      {/* 4 Progressive Difficulty Stages */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DIFFICULTY_ORDER.map((lvl, index) => {
          const meta = DIFFICULTY_META[lvl];
          const unlocked = isLevelUnlocked(progress, subject.id, lvl);
          const completion = subProgress[lvl];
          const levelQuestions = questions.filter(
            (q) => q.subjectId === subject.id && q.difficulty === lvl
          );
          const hasQuestions = levelQuestions.length > 0;

          return (
            <div
              key={lvl}
              className={`rounded-2xl border p-6 flex flex-col justify-between gap-5 transition-all ${
                unlocked
                  ? 'bg-white border-slate-200 shadow-xs hover:border-indigo-300'
                  : 'bg-slate-100/80 border-slate-200/80 opacity-85'
              }`}
            >
              <div className="space-y-3">
                {/* Stage Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-500 font-mono-num">
                      0{index + 1}. {meta.pointsPerQuestion} {pickText(UI_COPY.quiz.pointsLabel, lang)} /{' '}
                      {levelQuestions.length} {pickText(UI_COPY.subjectMap.questionsCount, lang)}
                    </p>
                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      <span aria-hidden="true">{meta.marker}</span>
                      <span>{pickText(meta.label, lang)}</span>
                    </h2>
                  </div>

                  {/* Explicit Status Indicator (Icon + Text, never hue-only) */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold whitespace-nowrap shrink-0 ${
                      completion.completed
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : unlocked
                          ? `${meta.accentBg} ${meta.accentBorder} ${meta.accentText}`
                          : 'bg-slate-200/70 border-slate-300 text-slate-600'
                    }`}
                  >
                    {completion.completed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{pickText(UI_COPY.subjectMap.completed, lang)}</span>
                      </>
                    ) : unlocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>{pickText(UI_COPY.subjectMap.unlocked, lang)}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>{pickText(UI_COPY.subjectMap.locked, lang)}</span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {pickText(meta.description, lang)}
                </p>

                {completion.completed && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{pickText(UI_COPY.subjectMap.bestScore, lang)}</span>
                    <span className="font-mono-num text-emerald-700 font-bold">
                      {completion.bestScore} / {completion.maxPossibleScore} (
                      {completion.correctCount}/{completion.totalCount})
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {!unlocked ? (
                <div className="px-4 py-3 rounded-xl bg-slate-200/70 text-slate-600 text-xs font-bold flex items-center justify-center gap-2 text-center">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>{pickText(UI_COPY.subjectMap.unlockHint, lang)}</span>
                </div>
              ) : !hasQuestions ? (
                <button
                  type="button"
                  onClick={() => onEditQuestions(subject.id)}
                  className="btn-tactile w-full px-4 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold text-center"
                >
                  {pickText(UI_COPY.subjectMap.noQuestionsHint, lang)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onStartQuiz(lvl)}
                  className={`btn-tactile w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap ${
                    completion.completed
                      ? 'bg-slate-900 hover:bg-indigo-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  }`}
                >
                  {completion.completed ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>{pickText(UI_COPY.subjectMap.replayLevel, lang)}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>{pickText(UI_COPY.subjectMap.startLevel, lang)}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};
