import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flame,
  HelpCircle,
  Trophy,
  XCircle,
} from 'lucide-react';
import { DIFFICULTY_META, pickText, UI_COPY } from '../data/translations';
import {
  DifficultyLevel,
  Language,
  Question,
  QuizAnswerRecord,
  Subject,
} from '../types/adventure';
import { playSoundEffect } from '../utils/sound';

interface QuizArenaViewProps {
  lang: Language;
  subject: Subject;
  difficulty: DifficultyLevel;
  questions: Question[];
  soundEnabled: boolean;
  onExit: () => void;
  onFinish: (records: QuizAnswerRecord[]) => void;
}

export const QuizArenaView: React.FC<QuizArenaViewProps> = ({
  lang,
  subject,
  difficulty,
  questions,
  soundEnabled,
  onExit,
  onFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [records, setRecords] = useState<QuizAnswerRecord[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedIndex !== null;
  const isLast = currentIndex === questions.length - 1;
  const meta = DIFFICULTY_META[difficulty];

  const handleSelectOption = (optIndex: number) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedIndex(optIndex);
    const isCorrect = optIndex === currentQuestion.correctIndex;
    const earnedPoints = isCorrect ? currentQuestion.points : 0;

    if (isCorrect) {
      playSoundEffect('correct', soundEnabled);
      setScore((prev) => prev + earnedPoints);
      setStreak((prev) => prev + 1);
    } else {
      playSoundEffect('wrong', soundEnabled);
      setStreak(0);
    }

    const record: QuizAnswerRecord = {
      question: currentQuestion,
      selectedIndex: optIndex,
      isCorrect,
      earnedPoints,
    };

    setRecords((prev) => [...prev, record]);
  };

  const handleAdvance = () => {
    if (!isAnswered) return;
    playSoundEffect('click', soundEnabled);
    if (isLast) {
      onFinish(records);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
    }
  };

  // Keyboard shortcuts: 1-4 to pick answer, Enter/Space to advance
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!currentQuestion) return;
      if (!isAnswered) {
        const num = Number(e.key);
        if (num >= 1 && num <= currentQuestion.options.length) {
          e.preventDefault();
          handleSelectOption(num - 1);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleAdvance();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (!currentQuestion) {
    return null;
  }

  const progressPct = Math.round(
    ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100
  );
  const NextArrow = lang === 'ar' ? ArrowLeft : ArrowRight;
  const explanationText = pickText(currentQuestion.explanation, lang);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16 space-y-6">
      {/* Unobtrusive Game HUD Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onExit}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {pickText(UI_COPY.quiz.exitQuiz, lang)}
          </button>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-slate-900 truncate">
              {pickText(subject.name, lang)}
            </p>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 truncate">
              <span aria-hidden="true">{meta.marker}</span>
              <span>{pickText(meta.label, lang)}</span>
            </p>
          </div>
        </div>

        {/* Live Numeric HUD */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="text-center">
            <p className="text-[11px] font-semibold text-slate-500">
              {pickText(UI_COPY.quiz.questionOf, lang)}
            </p>
            <p className="text-base font-extrabold text-slate-900 font-mono-num">
              {currentIndex + 1} / {questions.length}
            </p>
          </div>

          <div className="h-8 w-px bg-slate-200" aria-hidden="true" />

          <div className="text-center">
            <p className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{pickText(UI_COPY.quiz.pointsLabel, lang)}</span>
            </p>
            <p className="text-base font-extrabold text-indigo-700 font-mono-num">{score}</p>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" aria-hidden="true" />

          <div className="text-center hidden sm:block">
            <p className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>{pickText(UI_COPY.quiz.streakLabel, lang)}</span>
            </p>
            <p className="text-base font-extrabold text-orange-600 font-mono-num">{streak}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden" aria-hidden="true">
        <div
          className={`h-full transition-all duration-300 ${meta.barColor}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500">
          <span>
            {pickText(UI_COPY.quiz.questionOf, lang)} {currentIndex + 1}{' '}
            {pickText(UI_COPY.quiz.ofWord, lang)} {questions.length}
          </span>
          <span className="font-mono-num text-indigo-700 font-bold">
            +{currentQuestion.points} {pickText(UI_COPY.quiz.pointsLabel, lang)}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-slate-900 leading-relaxed">
          {pickText(currentQuestion.prompt, lang)}
        </h2>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-3.5">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrectOption = idx === currentQuestion.correctIndex;

            let optionStyle =
              'bg-slate-50 hover:bg-indigo-50/70 border-slate-200 hover:border-indigo-300 text-slate-900';

            if (isAnswered) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500';
              } else {
                optionStyle = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-75';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`btn-tactile w-full min-h-[60px] px-4 py-4 rounded-xl border text-start flex items-center justify-between gap-3 transition-all ${optionStyle}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-8 h-8 rounded-lg bg-white border border-slate-300/80 text-sm font-bold font-mono-num flex items-center justify-center shrink-0 text-slate-700">
                    {idx + 1}
                  </span>
                  <span className="text-base sm:text-lg font-bold leading-snug">
                    {pickText(opt, lang)}
                  </span>
                </div>

                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback + Explanation + Next Button */}
        {isAnswered ? (
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div
              className={`rounded-xl p-4 border flex items-start gap-3 ${
                selectedIndex === currentQuestion.correctIndex
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              {selectedIndex === currentQuestion.correctIndex ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}

              <div className="space-y-1.5 text-sm">
                <p className="font-extrabold">
                  {selectedIndex === currentQuestion.correctIndex
                    ? pickText(UI_COPY.quiz.correctFeedback, lang)
                    : pickText(UI_COPY.quiz.wrongFeedback, lang)}
                </p>
                {explanationText && (
                  <p className="text-slate-700 leading-relaxed">
                    <strong className="font-bold">
                      {pickText(UI_COPY.quiz.explanationLabel, lang)}{' '}
                    </strong>
                    {explanationText}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAdvance}
                className="btn-tactile inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm whitespace-nowrap"
              >
                <span>
                  {isLast
                    ? pickText(UI_COPY.quiz.finishQuiz, lang)
                    : pickText(UI_COPY.quiz.nextQuestion, lang)}
                </span>
                <NextArrow className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-2">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{pickText(UI_COPY.quiz.keyboardHint, lang)}</span>
          </p>
        )}
      </section>
    </div>
  );
};
