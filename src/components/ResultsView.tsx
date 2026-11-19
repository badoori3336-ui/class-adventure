import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Map,
  RotateCcw,
  Unlock,
  XCircle,
} from 'lucide-react';
import { DIFFICULTY_META, pickText, UI_COPY } from '../data/translations';
import { DifficultyLevel, Language, Question, QuizResult, Subject } from '../types/adventure';
import { getNextLevel } from '../utils/storage';

interface ResultsViewProps {
  lang: Language;
  subject: Subject;
  result: QuizResult;
  questions: Question[];
  onRetry: () => void;
  onPlayNextLevel: (nextLevel: DifficultyLevel) => void;
  onBackToSubject: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  lang,
  subject,
  result,
  questions,
  onRetry,
  onPlayNextLevel,
  onBackToSubject,
}) => {
  const meta = DIFFICULTY_META[result.difficulty];
  const totalQuestions = result.records.length;
  const accuracy =
    totalQuestions > 0 ? Math.round((result.correctCount / totalQuestions) * 100) : 0;

  const nextLevel = getNextLevel(result.difficulty);
  const nextLevelHasQuestions =
    nextLevel !== null &&
    questions.some((q) => q.subjectId === subject.id && q.difficulty === nextLevel);

  const DirArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16 space-y-8">
      {/* Results Summary Hero */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{pickText(UI_COPY.results.completedBadge, lang)}</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {pickText(UI_COPY.results.title, lang)} — {pickText(subject.name, lang)}
            </h1>
            <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <span aria-hidden="true">{meta.marker}</span>
              <span>{pickText(meta.label, lang)}</span>
              <span aria-hidden="true">·</span>
              <span>{pickText(subject.teacher, lang)}</span>
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-6 py-4 text-center shrink-0">
            <p className="text-xs font-bold text-indigo-700">
              {pickText(UI_COPY.results.totalPoints, lang)}
            </p>
            <p className="text-3xl font-extrabold text-indigo-700 font-mono-num mt-0.5">
              {result.totalPoints}
              <span className="text-sm font-semibold text-indigo-400">
                /{result.maxPoints}
              </span>
            </p>
          </div>
        </div>

        {/* New Level Unlocked Notification */}
        {result.newlyUnlockedLevel && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-start gap-3">
            <Unlock className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-base font-extrabold text-emerald-950">
                {pickText(UI_COPY.results.unlockedAlertTitle, lang)}
              </p>
              <p className="text-sm font-medium text-emerald-900">
                {pickText(UI_COPY.results.unlockedAlertBody, lang)}{' '}
                <strong className="font-extrabold">
                  {DIFFICULTY_META[result.newlyUnlockedLevel].marker}{' '}
                  {pickText(DIFFICULTY_META[result.newlyUnlockedLevel].label, lang)}
                </strong>
              </p>
            </div>
          </div>
        )}

        {/* 4 Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">
              {pickText(UI_COPY.results.totalPoints, lang)}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-indigo-700 font-mono-num">
              {result.totalPoints}
            </p>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-800">
              {pickText(UI_COPY.results.correctAnswers, lang)}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-700 font-mono-num">
              {result.correctCount}
            </p>
          </div>

          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-rose-800">
              {pickText(UI_COPY.results.wrongAnswers, lang)}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-rose-700 font-mono-num">
              {result.wrongCount}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">
              {pickText(UI_COPY.results.accuracy, lang)}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 font-mono-num">
              {accuracy}%
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {nextLevel && nextLevelHasQuestions && (
            <button
              type="button"
              onClick={() => onPlayNextLevel(nextLevel)}
              className="btn-tactile inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm whitespace-nowrap"
            >
              <Award className="w-4 h-4" />
              <span>
                {pickText(UI_COPY.results.playNextLevel, lang)} (
                {pickText(DIFFICULTY_META[nextLevel].shortLabel, lang)})
              </span>
              <DirArrow className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onRetry}
            className="btn-tactile inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{pickText(UI_COPY.results.retryLevel, lang)}</span>
          </button>

          <button
            type="button"
            onClick={onBackToSubject}
            className="btn-tactile inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl whitespace-nowrap"
          >
            <Map className="w-4 h-4" />
            <span>{pickText(UI_COPY.results.backToSubject, lang)}</span>
          </button>
        </div>
      </section>

      {/* Full Question-by-Question Review */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          {pickText(UI_COPY.results.reviewTitle, lang)}
        </h2>

        <div className="space-y-4">
          {result.records.map((rec, index) => {
            const chosenOpt = rec.question.options[rec.selectedIndex];
            const correctOpt = rec.question.options[rec.question.correctIndex];
            const explanation = pickText(rec.question.explanation, lang);

            return (
              <article
                key={rec.question.id + '-' + index}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-500 font-mono-num">
                    {pickText(UI_COPY.quiz.questionOf, lang)} {index + 1} · +{rec.earnedPoints}/
                    {rec.question.points} {pickText(UI_COPY.quiz.pointsLabel, lang)}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-extrabold ${
                      rec.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {rec.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{pickText(UI_COPY.results.statusCorrect, lang)}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>{pickText(UI_COPY.results.statusWrong, lang)}</span>
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {pickText(rec.question.prompt, lang)}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div
                    className={`rounded-xl p-3.5 border ${
                      rec.isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}
                  >
                    <p className="text-xs font-bold opacity-80 mb-1">
                      {pickText(UI_COPY.results.yourAnswer, lang)}
                    </p>
                    <p className="font-bold">
                      {chosenOpt ? pickText(chosenOpt, lang) : '—'}
                    </p>
                  </div>

                  <div className="rounded-xl p-3.5 border bg-emerald-50/60 border-emerald-200 text-emerald-950">
                    <p className="text-xs font-bold text-emerald-800 mb-1">
                      {pickText(UI_COPY.results.correctAnswer, lang)}
                    </p>
                    <p className="font-bold">
                      {correctOpt ? pickText(correctOpt, lang) : '—'}
                    </p>
                  </div>
                </div>

                {explanation && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-sm text-slate-700 leading-relaxed">
                    <strong className="font-bold text-slate-900">
                      {pickText(UI_COPY.results.explanation, lang)}{' '}
                    </strong>
                    {explanation}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
