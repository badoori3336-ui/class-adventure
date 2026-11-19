import React, { useState } from 'react';
import {
  Check,
  Edit3,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { DIFFICULTY_META, DIFFICULTY_ORDER, pickText, UI_COPY } from '../data/translations';
import {
  DifficultyLevel,
  Language,
  Question,
  Subject,
  SubjectImageKey,
  SubjectTheme,
} from '../types/adventure';
import { SUBJECT_IMAGE_PATHS } from '../utils/storage';
import { SafeImage } from './SafeImage';

interface ManagerViewProps {
  lang: Language;
  subjects: Subject[];
  questions: Question[];
  initialSubjectFilter?: string;
  onSaveSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
  onSaveQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
  onResetProgress: () => void;
  onRestoreDefaults: () => void;
}

const IMAGE_KEYS: { key: SubjectImageKey; labelAr: string; labelEn: string }[] = [
  { key: 'math', labelAr: 'الرياضيات والمنطق', labelEn: 'Math & Logic' },
  { key: 'science', labelAr: 'العلوم والمختبر', labelEn: 'Science & Lab' },
  { key: 'language', labelAr: 'اللغات والآداب', labelEn: 'Languages & Stories' },
  { key: 'tech', labelAr: 'التقنية والبرمجة', labelEn: 'Tech & Computing' },
];

const THEME_BY_IMAGE: Record<SubjectImageKey, SubjectTheme> = {
  math: 'royal',
  science: 'emerald',
  language: 'crimson',
  tech: 'indigo',
};

export const ManagerView: React.FC<ManagerViewProps> = ({
  lang,
  subjects,
  questions,
  initialSubjectFilter,
  onSaveSubject,
  onDeleteSubject,
  onSaveQuestion,
  onDeleteQuestion,
  onResetProgress,
  onRestoreDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'questions'>(
    initialSubjectFilter ? 'questions' : 'subjects'
  );

  // Subject Form State
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [subNameAr, setSubNameAr] = useState('');
  const [subNameEn, setSubNameEn] = useState('');
  const [subClassAr, setSubClassAr] = useState('');
  const [subClassEn, setSubClassEn] = useState('');
  const [subTeacherAr, setSubTeacherAr] = useState('');
  const [subTeacherEn, setSubTeacherEn] = useState('');
  const [subDescAr, setSubDescAr] = useState('');
  const [subDescEn, setSubDescEn] = useState('');
  const [subImageKey, setSubImageKey] = useState<SubjectImageKey>('math');
  const [confirmDeleteSubjectId, setConfirmDeleteSubjectId] = useState<string | null>(null);

  // Question Filter & Form State
  const [filterSubjectId, setFilterSubjectId] = useState<string>(
    initialSubjectFilter || subjects[0]?.id || ''
  );
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qSubjectId, setQSubjectId] = useState<string>(
    initialSubjectFilter || subjects[0]?.id || ''
  );
  const [qDifficulty, setQDifficulty] = useState<DifficultyLevel>('easy');
  const [qPromptAr, setQPromptAr] = useState('');
  const [qPromptEn, setQPromptEn] = useState('');
  const [qOptionsAr, setQOptionsAr] = useState<string[]>(['', '', '', '']);
  const [qOptionsEn, setQOptionsEn] = useState<string[]>(['', '', '', '']);
  const [qCorrectIdx, setQCorrectIdx] = useState<number>(0);
  const [qExpAr, setQExpAr] = useState('');
  const [qExpEn, setQExpEn] = useState('');
  const [confirmDeleteQuestionId, setConfirmDeleteQuestionId] = useState<string | null>(null);

  // Safety Reset Confirm States
  const [confirmResetProg, setConfirmResetProg] = useState(false);
  const [confirmRestoreDef, setConfirmRestoreDef] = useState(false);

  const openNewSubjectForm = () => {
    setEditingSubjectId(null);
    setSubNameAr('');
    setSubNameEn('');
    setSubClassAr('');
    setSubClassEn('');
    setSubTeacherAr('');
    setSubTeacherEn('');
    setSubDescAr('');
    setSubDescEn('');
    setSubImageKey('math');
    setShowSubjectForm(true);
  };

  const openEditSubjectForm = (sub: Subject) => {
    setEditingSubjectId(sub.id);
    setSubNameAr(sub.name.ar);
    setSubNameEn(sub.name.en);
    setSubClassAr(sub.classroom.ar);
    setSubClassEn(sub.classroom.en);
    setSubTeacherAr(sub.teacher.ar);
    setSubTeacherEn(sub.teacher.en);
    setSubDescAr(sub.description.ar);
    setSubDescEn(sub.description.en);
    setSubImageKey(sub.imageKey);
    setShowSubjectForm(true);
  };

  const handleSubmitSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const nameAr = subNameAr.trim() || subNameEn.trim();
    const nameEn = subNameEn.trim() || subNameAr.trim();
    const classAr = subClassAr.trim() || subClassEn.trim() || 'الصف العام';
    const classEn = subClassEn.trim() || subClassAr.trim() || 'General Class';
    const teacherAr = subTeacherAr.trim() || subTeacherEn.trim();
    const teacherEn = subTeacherEn.trim() || subTeacherAr.trim();
    if (!nameAr || !teacherAr) return;

    const id = editingSubjectId || `sub-${Date.now()}`;
    onSaveSubject({
      id,
      name: { ar: nameAr, en: nameEn },
      classroom: { ar: classAr, en: classEn },
      teacher: { ar: teacherAr, en: teacherEn },
      description: {
        ar: subDescAr.trim() || subDescEn.trim() || `اختبارات ومراحل ${nameAr}`,
        en: subDescEn.trim() || subDescAr.trim() || `${nameEn} interactive quests and quizzes`,
      },
      imageKey: subImageKey,
      theme: THEME_BY_IMAGE[subImageKey],
    });
    setShowSubjectForm(false);
    if (!filterSubjectId) setFilterSubjectId(id);
  };

  const openNewQuestionForm = () => {
    setEditingQuestionId(null);
    setQSubjectId(filterSubjectId || subjects[0]?.id || '');
    setQDifficulty(filterDifficulty === 'all' ? 'easy' : filterDifficulty);
    setQPromptAr('');
    setQPromptEn('');
    setQOptionsAr(['', '', '', '']);
    setQOptionsEn(['', '', '', '']);
    setQCorrectIdx(0);
    setQExpAr('');
    setQExpEn('');
    setShowQuestionForm(true);
  };

  const openEditQuestionForm = (q: Question) => {
    setEditingQuestionId(q.id);
    setQSubjectId(q.subjectId);
    setQDifficulty(q.difficulty);
    setQPromptAr(q.prompt.ar);
    setQPromptEn(q.prompt.en);
    setQOptionsAr([
      q.options[0]?.ar || '',
      q.options[1]?.ar || '',
      q.options[2]?.ar || '',
      q.options[3]?.ar || '',
    ]);
    setQOptionsEn([
      q.options[0]?.en || '',
      q.options[1]?.en || '',
      q.options[2]?.en || '',
      q.options[3]?.en || '',
    ]);
    setQCorrectIdx(q.correctIndex);
    setQExpAr(q.explanation.ar);
    setQExpEn(q.explanation.en);
    setShowQuestionForm(true);
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const promptAr = qPromptAr.trim() || qPromptEn.trim();
    const promptEn = qPromptEn.trim() || qPromptAr.trim();
    if (!promptAr || !qSubjectId) return;

    const options = [0, 1, 2, 3].map((i) => ({
      ar: qOptionsAr[i].trim() || qOptionsEn[i].trim() || `خيار ${i + 1}`,
      en: qOptionsEn[i].trim() || qOptionsAr[i].trim() || `Option ${i + 1}`,
    }));

    const points = DIFFICULTY_META[qDifficulty].pointsPerQuestion;

    onSaveQuestion({
      id: editingQuestionId || `q-${Date.now()}`,
      subjectId: qSubjectId,
      difficulty: qDifficulty,
      prompt: { ar: promptAr, en: promptEn },
      options,
      correctIndex: qCorrectIdx,
      explanation: {
        ar: qExpAr.trim() || qExpEn.trim(),
        en: qExpEn.trim() || qExpAr.trim(),
      },
      points,
    });
    setShowQuestionForm(false);
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterSubjectId && q.subjectId !== filterSubjectId) return false;
    if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16 space-y-8">
      {/* Page Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {pickText(UI_COPY.manage.title, lang)}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            {pickText(UI_COPY.manage.subtitle, lang)}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'subjects'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {pickText(UI_COPY.manage.tabSubjects, lang)} ({subjects.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'questions'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {pickText(UI_COPY.manage.tabQuestions, lang)} ({questions.length})
          </button>
        </div>
      </div>

      {/* TAB 1: SUBJECTS & TEACHERS */}
      {activeTab === 'subjects' && (
        <section className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={openNewSubjectForm}
              className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{pickText(UI_COPY.manage.addSubject, lang)}</span>
            </button>
          </div>

          {showSubjectForm && (
            <form
              onSubmit={handleSubmitSubject}
              className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-sm space-y-5"
            >
              <h2 className="text-lg font-extrabold text-slate-900">
                {editingSubjectId
                  ? pickText(UI_COPY.manage.editSubject, lang)
                  : pickText(UI_COPY.manage.addSubject, lang)}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.subjectNameAr, lang)} *
                  </label>
                  <input
                    type="text"
                    required
                    value={subNameAr}
                    onChange={(e) => setSubNameAr(e.target.value)}
                    placeholder="مثال: التاريخ الوطني"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.subjectNameEn, lang)}
                  </label>
                  <input
                    type="text"
                    value={subNameEn}
                    onChange={(e) => setSubNameEn(e.target.value)}
                    placeholder="e.g. National History"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.teacherAr, lang)} *
                  </label>
                  <input
                    type="text"
                    required
                    value={subTeacherAr}
                    onChange={(e) => setSubTeacherAr(e.target.value)}
                    placeholder="مثال: أ. محمد الغامدي"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.teacherEn, lang)}
                  </label>
                  <input
                    type="text"
                    value={subTeacherEn}
                    onChange={(e) => setSubTeacherEn(e.target.value)}
                    placeholder="e.g. Mr. Mohammed Al-Ghamdi"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.classroomAr, lang)}
                  </label>
                  <input
                    type="text"
                    value={subClassAr}
                    onChange={(e) => setSubClassAr(e.target.value)}
                    placeholder="مثال: الصف الثالث ابتدائي (أ)"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.classroomEn, lang)}
                  </label>
                  <input
                    type="text"
                    value={subClassEn}
                    onChange={(e) => setSubClassEn(e.target.value)}
                    placeholder="e.g. Grade 3-A"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.descriptionAr, lang)}
                  </label>
                  <input
                    type="text"
                    value={subDescAr}
                    onChange={(e) => setSubDescAr(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.descriptionEn, lang)}
                  </label>
                  <input
                    type="text"
                    value={subDescEn}
                    onChange={(e) => setSubDescEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">
                  {pickText(UI_COPY.manage.artworkLabel, lang)}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {IMAGE_KEYS.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSubImageKey(item.key)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
                        subImageKey === item.key
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-1 ring-indigo-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <SafeImage
                        src={SUBJECT_IMAGE_PATHS[item.key]}
                        alt={item.labelEn}
                        fallbackType={item.key}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <span className="text-start">
                        {lang === 'ar' ? item.labelAr : item.labelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubjectForm(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  {pickText(UI_COPY.manage.cancel, lang)}
                </button>
                <button
                  type="submit"
                  className="btn-tactile inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  <Check className="w-4 h-4" />
                  <span>{pickText(UI_COPY.manage.saveChanges, lang)}</span>
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((sub) => {
              const qCount = questions.filter((q) => q.subjectId === sub.id).length;
              return (
                <div
                  key={sub.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <SafeImage
                        src={SUBJECT_IMAGE_PATHS[sub.imageKey]}
                        alt={pickText(sub.name, lang)}
                        fallbackType={sub.imageKey}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="text-base font-extrabold text-slate-900 truncate">
                        {pickText(sub.name, lang)}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 truncate">
                        {pickText(sub.teacher, lang)} · {pickText(sub.classroom, lang)}
                      </p>
                      <p className="text-xs text-slate-500 font-mono-num">
                        {qCount} {pickText(UI_COPY.subjectMap.questionsCount, lang)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditSubjectForm(sub)}
                      aria-label={pickText(UI_COPY.manage.editSubject, lang)}
                      className="p-2.5 text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {confirmDeleteSubjectId === sub.id ? (
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteSubject(sub.id);
                          setConfirmDeleteSubjectId(null);
                        }}
                        className="px-3 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl whitespace-nowrap"
                      >
                        {pickText(UI_COPY.manage.confirmDelete, lang)}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteSubjectId(sub.id)}
                        aria-label={pickText(UI_COPY.manage.delete, lang)}
                        className="p-2.5 text-slate-600 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: QUESTION BANK */}
      {activeTab === 'questions' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterSubjectId}
                onChange={(e) => setFilterSubjectId(e.target.value)}
                aria-label={pickText(UI_COPY.manage.filterBySubject, lang)}
                className="px-3.5 py-2 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
              >
                <option value="">{pickText(UI_COPY.subjectsSection.allClassrooms, lang)}</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {pickText(sub.name, lang)}
                  </option>
                ))}
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) =>
                  setFilterDifficulty(e.target.value as DifficultyLevel | 'all')
                }
                aria-label={pickText(UI_COPY.manage.filterByLevel, lang)}
                className="px-3.5 py-2 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
              >
                <option value="all">{pickText(UI_COPY.manage.filterByLevel, lang)}: All</option>
                {DIFFICULTY_ORDER.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {DIFFICULTY_META[lvl].marker} {pickText(DIFFICULTY_META[lvl].shortLabel, lang)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={openNewQuestionForm}
              disabled={subjects.length === 0}
              className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{pickText(UI_COPY.manage.addQuestion, lang)}</span>
            </button>
          </div>

          {showQuestionForm && (
            <form
              onSubmit={handleSubmitQuestion}
              className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-sm space-y-5"
            >
              <h2 className="text-lg font-extrabold text-slate-900">
                {editingQuestionId
                  ? pickText(UI_COPY.manage.editQuestion, lang)
                  : pickText(UI_COPY.manage.addQuestion, lang)}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.filterBySubject, lang)}
                  </label>
                  <select
                    value={qSubjectId}
                    onChange={(e) => setQSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {pickText(sub.name, lang)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.filterByLevel, lang)}
                  </label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {DIFFICULTY_ORDER.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {DIFFICULTY_META[lvl].marker} {pickText(DIFFICULTY_META[lvl].label, lang)} (
                        {DIFFICULTY_META[lvl].pointsPerQuestion}{' '}
                        {pickText(UI_COPY.quiz.pointsLabel, lang)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.questionPromptAr, lang)} *
                  </label>
                  <input
                    type="text"
                    required
                    value={qPromptAr}
                    onChange={(e) => setQPromptAr(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.questionPromptEn, lang)}
                  </label>
                  <input
                    type="text"
                    value={qPromptEn}
                    onChange={(e) => setQPromptEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-700">
                  {pickText(UI_COPY.manage.optionsHeading, lang)}
                </p>
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 rounded-xl border ${
                      qCorrectIdx === idx
                        ? 'bg-emerald-50/70 border-emerald-400'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <label className="sm:col-span-2 flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={qCorrectIdx === idx}
                        onChange={() => setQCorrectIdx(idx)}
                        className="w-4 h-4 text-emerald-600"
                      />
                      <span>#{idx + 1}</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={qOptionsAr[idx]}
                      onChange={(e) => {
                        const copy = [...qOptionsAr];
                        copy[idx] = e.target.value;
                        setQOptionsAr(copy);
                      }}
                      placeholder={`AR #${idx + 1}`}
                      className="sm:col-span-5 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={qOptionsEn[idx]}
                      onChange={(e) => {
                        const copy = [...qOptionsEn];
                        copy[idx] = e.target.value;
                        setQOptionsEn(copy);
                      }}
                      placeholder={`EN #${idx + 1}`}
                      className="sm:col-span-5 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.explanationAr, lang)}
                  </label>
                  <input
                    type="text"
                    value={qExpAr}
                    onChange={(e) => setQExpAr(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {pickText(UI_COPY.manage.explanationEn, lang)}
                  </label>
                  <input
                    type="text"
                    value={qExpEn}
                    onChange={(e) => setQExpEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuestionForm(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  {pickText(UI_COPY.manage.cancel, lang)}
                </button>
                <button
                  type="submit"
                  className="btn-tactile inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  <Check className="w-4 h-4" />
                  <span>{pickText(UI_COPY.manage.saveChanges, lang)}</span>
                </button>
              </div>
            </form>
          )}

          {/* Questions List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const sub = subjects.find((s) => s.id === q.subjectId);
              const meta = DIFFICULTY_META[q.difficulty];
              return (
                <div
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                      <span>{sub ? pickText(sub.name, lang) : q.subjectId}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {meta.marker} {pickText(meta.shortLabel, lang)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num text-indigo-700">+{q.points} pts</span>
                    </div>
                    <p className="text-base font-extrabold text-slate-900">
                      {pickText(q.prompt, lang)}
                    </p>
                    <p className="text-xs font-semibold text-emerald-700">
                      {pickText(UI_COPY.results.correctAnswer, lang)}{' '}
                      {q.options[q.correctIndex] ? pickText(q.options[q.correctIndex], lang) : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditQuestionForm(q)}
                      aria-label={pickText(UI_COPY.manage.editQuestion, lang)}
                      className="p-2.5 text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 rounded-xl"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {confirmDeleteQuestionId === q.id ? (
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteQuestion(q.id);
                          setConfirmDeleteQuestionId(null);
                        }}
                        className="px-3 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl whitespace-nowrap"
                      >
                        {pickText(UI_COPY.manage.confirmDelete, lang)}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteQuestionId(q.id)}
                        aria-label={pickText(UI_COPY.manage.delete, lang)}
                        className="p-2.5 text-slate-600 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Data & Progress Controls */}
      <section className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {confirmResetProg ? (
            <button
              type="button"
              onClick={() => {
                onResetProgress();
                setConfirmResetProg(false);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
            >
              {pickText(UI_COPY.manage.confirmResetProgress, lang)}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmResetProg(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{pickText(UI_COPY.manage.resetProgressBtn, lang)}</span>
            </button>
          )}

          {confirmRestoreDef ? (
            <button
              type="button"
              onClick={() => {
                onRestoreDefaults();
                setConfirmRestoreDef(false);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl"
            >
              {pickText(UI_COPY.manage.confirmRestoreDefaults, lang)}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmRestoreDef(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{pickText(UI_COPY.manage.restoreDefaultsBtn, lang)}</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
