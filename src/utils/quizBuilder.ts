import { Question } from '../types/adventure';

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function shuffleQuestionOptions(question: Question): Question {
  const indexed = question.options.map((opt, idx) => ({
    opt,
    isCorrect: idx === question.correctIndex,
  }));
  const shuffled = shuffleArray(indexed);
  const newCorrectIndex = shuffled.findIndex((item) => item.isCorrect);

  return {
    ...question,
    options: shuffled.map((item) => item.opt),
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}

/**
 * Selects a randomized round of questions for a quiz attempt,
 * prioritizing questions not seen in the previous attempt,
 * and shuffles both question order and answer option order.
 */
export function buildQuizRound(
  pool: Question[],
  recentQuestionIds: string[],
  roundSize = 4
): Question[] {
  if (pool.length === 0) return [];

  const recentSet = new Set(recentQuestionIds);
  const unseen = shuffleArray(pool.filter((q) => !recentSet.has(q.id)));
  const seen = shuffleArray(pool.filter((q) => recentSet.has(q.id)));

  const targetCount = Math.min(roundSize, pool.length);
  const chosen = [...unseen, ...seen].slice(0, targetCount);

  return shuffleArray(chosen).map(shuffleQuestionOptions);
}
