import React from 'react';
import { CheckCircle2, Lock, Play, Trophy } from 'lucide-react';
import { DIFFICULTY_META, DIFFICULTY_ORDER, pickText, UI_COPY } from '../data/translations';
import { DifficultyLevel, Language, ProgressMap, Question, Subject } from '../types/adventure';
import { getSubjectProgress, isLevelUnlocked } from '../utils/storage';

interface ProgressViewProps {
  lang: Language;
  subjects: Subject[];
  questions: Question[];
  progress: ProgressMap;
  onStartQuiz: (subjectId: string, level: DifficultyLevel) => void;
  onOpenSubject: (subjectId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  lang,
  subjects,
  questions,
  progress,
  onStartQuiz,
  onOpenSubject,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {pickText(UI_COPY.progressView.title, lang)}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {pickText(UI_COPY.progressView.subtitle, lang)}
        </p>
      </div>

      <div className="space-y-4">
        {subjects.map((sub) => {
          const subProg = getSubjectProgress(progress, sub.id);
          const subjectTotalPoints = DIFFICULTY_ORDER.reduce(
            (sum, lvl) => sum + (subProg[lvl]?.bestScore || 0),
            0
          );

          return (
            <section
              key={sub.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <button
                    type="button"
                    onClick={() => onOpenSubject(sub.id)}
                    className="text-lg font-extrabold text-slate-900 hover:text-indigo-600 transition-colors"
                  >
                    {pickText(sub.name, lang)}
                  </button>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {pickText(sub.classroom, lang)} · {pickText(sub.teacher, lang)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-extrabold text-indigo-700 font-mono-num">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>
                    {subjectTotalPoints} {pickText(UI_COPY.quiz.pointsLabel, lang)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {DIFFICULTY_ORDER.map((lvl) => {
                  const meta = DIFFICULTY_META[lvl];
                  const unlocked = isLevelUnlocked(progress, sub.id, lvl);
                  const entry = subProg[lvl];
                  const hasQuestions = questions.some(
                    (q) => q.subjectId === sub.id && q.difficulty === lvl
                  );

                  return (
                    <div
                      key={lvl}
                      className={`rounded-xl border p-3.5 flex flex-col justify-between gap-3 ${
                        entry.completed
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : unlocked
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-slate-100/70 border-slate-200/70 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span aria-hidden="true">{meta.marker}</span>
                          <span>{pickText(meta.shortLabel, lang)}</span>
                        </span>
                        {entry.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : !unlocked ? (
                          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : null}
                      </div>

                      {entry.completed ? (
                        <p className="text-xs font-bold font-mono-num text-emerald-800">
                          {entry.bestScore}/{entry.maxPossibleScore} · {entry.correctCount}/
                          {entry.totalCount}
                        </p>
                      ) : (
                        <p className="text-xs font-medium text-slate-500">
                          {unlocked
                            ? pickText(UI_COPY.subjectMap.unlocked, lang)
                            : pickText(UI_COPY.subjectMap.locked, lang)}
                        </p>
                      )}

                      {unlocked && hasQuestions && (
                        <button
                          type="button"
                          onClick={() => onStartQuiz(sub.id, lvl)}
                          className="btn-tactile w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-white hover:bg-indigo-600 hover:text-white text-slate-800 border border-slate-200 transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-3 h-3" />
                          <span>
                            {entry.completed
                              ? pickText(UI_COPY.subjectMap.replayLevel, lang)
                              : pickText(UI_COPY.subjectMap.startLevel, lang)}
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
