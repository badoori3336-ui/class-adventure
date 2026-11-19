import { DifficultyLevel, Language, LocalizedText } from '../types/adventure';

export const DIFFICULTY_ORDER: DifficultyLevel[] = ['easy', 'medium', 'hard', 'extreme'];

export const DIFFICULTY_META: Record<
  DifficultyLevel,
  {
    label: LocalizedText;
    shortLabel: LocalizedText;
    description: LocalizedText;
    pointsPerQuestion: number;
    marker: string;
    accentBg: string;
    accentText: string;
    accentBorder: string;
    barColor: string;
  }
> = {
  easy: {
    label: { ar: 'المستوى السهل', en: 'Easy Level' },
    shortLabel: { ar: 'سهل', en: 'Easy' },
    description: {
      ar: 'أساسيات المادة وبداية الرحلة التعليمية لبناء الثقة.',
      en: 'Core fundamentals to start your quest and build confidence.',
    },
    pointsPerQuestion: 10,
    marker: '🟢',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-800',
    accentBorder: 'border-emerald-200',
    barColor: 'bg-emerald-600',
  },
  medium: {
    label: { ar: 'المستوى المتوسط', en: 'Medium Level' },
    shortLabel: { ar: 'متوسط', en: 'Medium' },
    description: {
      ar: 'تحديات تطبيقية تختبر الفهم والتحليل السريع.',
      en: 'Applied challenges testing comprehension and reasoning.',
    },
    pointsPerQuestion: 20,
    marker: '🟡',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-800',
    accentBorder: 'border-amber-200',
    barColor: 'bg-amber-500',
  },
  hard: {
    label: { ar: 'المستوى الصعب', en: 'Hard Level' },
    shortLabel: { ar: 'صعب', en: 'Hard' },
    description: {
      ar: 'ألغاز ومسائل متقدمة تتطلب تركيزًا ودقة عالية.',
      en: 'Advanced problems requiring sharp focus and accuracy.',
    },
    pointsPerQuestion: 30,
    marker: '🟠',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-800',
    accentBorder: 'border-orange-200',
    barColor: 'bg-orange-600',
  },
  extreme: {
    label: { ar: 'المستوى المتطرف', en: 'Extreme Level' },
    shortLabel: { ar: 'متطرف', en: 'Extreme' },
    description: {
      ar: 'الاختبار الأسطوري النهائي لأبطال الفصل المتميزين.',
      en: 'The ultimate mastery challenge for top class champions.',
    },
    pointsPerQuestion: 50,
    marker: '🔴',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-800',
    accentBorder: 'border-rose-200',
    barColor: 'bg-rose-600',
  },
};

export function pickText(text: LocalizedText, lang: Language): string {
  const primary = text[lang]?.trim();
  if (primary) return primary;
  return text.ar?.trim() || text.en?.trim() || '';
}

export const UI_COPY = {
  brand: 'Class Adventure',
  nav: {
    home: { ar: 'الرئيسية', en: 'Home' },
    subjects: { ar: 'المواد الدراسية', en: 'Subjects' },
    progress: { ar: 'سجل الإنجاز', en: 'Progress' },
    manage: { ar: 'إدارة المواد', en: 'Manage' },
  },
  langToggle: { ar: 'English', en: 'العربية' },
  hero: {
    kicker: { ar: 'مغامرة التعلم لطلاب الصف الثالث الابتدائي', en: 'Interactive Learning Adventure for Grade 3' },
    title: {
      ar: 'حوّل حصص الصف الثالث إلى مغامرة ممتعة!',
      en: 'Turn Grade 3 Lessons Into an Exciting Quest!',
    },
    subtitle: {
      ar: 'اختر مادتك المفضلة، ابدأ بالمستوى السهل وافتح المستويات التالية واحدًا تلو الآخر، واجمع النقاط مع شرح واضح لكل إجابة.',
      en: 'Pick your favorite subject, start on Easy to unlock harder stages one by one, and earn points with kid-friendly explanations.',
    },
    primaryCta: { ar: 'ابدأ المغامرة الآن', en: 'Start Adventure' },
    secondaryCta: { ar: 'إضافة أو تعديل المواد', en: 'Manage Subjects' },
    explorerLabel: { ar: 'اسم البطل:', en: 'Hero Name:' },
    explorerPlaceholder: { ar: 'اكتب اسمك هنا', en: 'Type your name' },
    soundOn: { ar: 'المؤثرات الصوتية: مفعّلة', en: 'Sound Effects: On' },
    soundOff: { ar: 'المؤثرات الصوتية: صامت', en: 'Sound Effects: Muted' },
  },
  stats: {
    totalPoints: { ar: 'مجموع النقاط', en: 'Total Points' },
    subjectsCount: { ar: 'المواد الدراسية', en: 'Subjects' },
    levelsCleared: { ar: 'المستويات المكتملة', en: 'Levels Cleared' },
    accuracy: { ar: 'متوسط الدقة', en: 'Accuracy Rate' },
  },
  subjectsSection: {
    title: { ar: 'المواد الدراسية والفصول', en: 'Subjects & Classrooms' },
    subtitle: {
      ar: 'اختر المادة الدراسية للانتقال إلى خريطة المستويات الأربعة وبدء الاختبار.',
      en: 'Choose any subject to open its four-level quest path and begin your quiz.',
    },
    allClassrooms: { ar: 'جميع الفصول', en: 'All Classrooms' },
    teacherPrefix: { ar: 'المعلم:', en: 'Teacher:' },
    enterSubject: { ar: 'دخول المادة', en: 'Open Quest' },
    levelsUnlockedOf: { ar: 'مستويات مكتملة', en: 'levels cleared' },
    noSubjects: {
      ar: 'لا توجد مواد دراسية بعد. انتقل إلى إدارة المواد لإضافة أول مادة.',
      en: 'No subjects added yet. Go to Manage Subjects to add your first course.',
    },
  },
  subjectMap: {
    backHome: { ar: 'العودة إلى الرئيسية', en: 'Back to Home' },
    unlockRule: {
      ar: 'نظام فتح المستويات: يبدأ الجميع بالمستوى السهل، وإكمال أي مستوى (بأي درجة كانت) يفتح المستوى التالي مباشرة.',
      en: 'Unlock Rule: Everyone starts at Easy. Completing any level with any score automatically unlocks the next tier.',
    },
    startLevel: { ar: 'ابدأ الاختبار', en: 'Start Quiz' },
    replayLevel: { ar: 'إعادة الاختبار', en: 'Replay Level' },
    locked: { ar: 'مغلق', en: 'Locked' },
    unlocked: { ar: 'مفتوح الآن', en: 'Unlocked' },
    completed: { ar: 'مكتمل', en: 'Completed' },
    bestScore: { ar: 'أفضل نتيجة:', en: 'Best Score:' },
    questionsCount: { ar: 'أسئلة', en: 'questions' },
    unlockHint: {
      ar: 'أكمل المستوى السابق لفتح هذا التحدي',
      en: 'Complete the previous level to unlock',
    },
    noQuestionsHint: {
      ar: 'لا توجد أسئلة في هذا المستوى بعد — أضف أسئلة من إدارة المواد.',
      en: 'No questions in this level yet — add questions in Manage.',
    },
    editSubjectQuestions: { ar: 'تعديل أسئلة هذه المادة', en: 'Edit Questions' },
  },
  quiz: {
    exitQuiz: { ar: 'خروج', en: 'Exit' },
    questionOf: { ar: 'السؤال', en: 'Question' },
    ofWord: { ar: 'من', en: 'of' },
    pointsLabel: { ar: 'النقاط', en: 'Points' },
    streakLabel: { ar: 'سلسلة صحيحة', en: 'Streak' },
    correctFeedback: { ar: 'إجابة صحيحة! أحسنت', en: 'Correct Answer! Well done' },
    wrongFeedback: { ar: 'إجابة غير صحيحة — تعلّم من الشرح', en: 'Incorrect — Review the explanation' },
    explanationLabel: { ar: 'الشرح التعليمي:', en: 'Explanation:' },
    nextQuestion: { ar: 'السؤال التالي', en: 'Next Question' },
    finishQuiz: { ar: 'إنهاء وعرض النتائج', en: 'Finish & View Results' },
    keyboardHint: {
      ar: 'تلميح: يمكنك استخدام مفاتيح 1 إلى 4 لاختيار الإجابة بسرعة',
      en: 'Tip: Press keys 1–4 to pick an answer quickly',
    },
  },
  results: {
    title: { ar: 'نتيجة المغامرة', en: 'Quest Results' },
    completedBadge: { ar: 'تم إكمال المستوى بنجاح', en: 'Level Completed' },
    unlockedAlertTitle: { ar: 'تم فتح مستوى جديد!', en: 'New Level Unlocked!' },
    unlockedAlertBody: {
      ar: 'أحسنت! بإكمال هذا الاختبار أصبح بإمكانك الآن خوض تحدي:',
      en: 'Great job! Completing this quiz has unlocked:',
    },
    totalPoints: { ar: 'مجموع النقاط المكتسبة', en: 'Total Points Earned' },
    correctAnswers: { ar: 'الإجابات الصحيحة', en: 'Correct Answers' },
    wrongAnswers: { ar: 'الإجابات الخاطئة', en: 'Wrong Answers' },
    accuracy: { ar: 'نسبة الدقة', en: 'Accuracy' },
    playNextLevel: { ar: 'الانتقال إلى المستوى التالي', en: 'Play Next Level' },
    retryLevel: { ar: 'إعادة المحاولة', en: 'Retry Level' },
    backToSubject: { ar: 'العودة لخريطة المادة', en: 'Back to Subject Map' },
    reviewTitle: { ar: 'مراجعة جميع الأسئلة والإجابات', en: 'Full Question & Answer Review' },
    yourAnswer: { ar: 'إجابتك:', en: 'Your Answer:' },
    correctAnswer: { ar: 'الإجابة الصحيحة:', en: 'Correct Answer:' },
    explanation: { ar: 'الشرح:', en: 'Explanation:' },
    statusCorrect: { ar: 'إجابة صحيحة', en: 'Correct' },
    statusWrong: { ar: 'إجابة خاطئة', en: 'Incorrect' },
  },
  manage: {
    title: { ar: 'إدارة المواد والمعلمين والأسئلة', en: 'Subjects, Teachers & Questions Studio' },
    subtitle: {
      ar: 'أضف موادك الدراسية الحقيقية، حدّث أسماء المعلمين والفصول، وأنشئ أسئلة مخصصة لكل مستوى صعوبة.',
      en: 'Add your real school subjects, update teachers and classrooms, and create custom questions for every difficulty level.',
    },
    tabSubjects: { ar: 'المواد والمعلمون', en: 'Subjects & Teachers' },
    tabQuestions: { ar: 'بنك الأسئلة', en: 'Question Bank' },
    addSubject: { ar: 'إضافة مادة جديدة', en: 'Add New Subject' },
    editSubject: { ar: 'تعديل المادة', en: 'Edit Subject' },
    saveChanges: { ar: 'حفظ التغييرات', en: 'Save Changes' },
    cancel: { ar: 'إلغاء', en: 'Cancel' },
    delete: { ar: 'حذف', en: 'Delete' },
    confirmDelete: { ar: 'تأكيد الحذف', en: 'Confirm Delete' },
    subjectNameAr: { ar: 'اسم المادة (بالعربية)', en: 'Subject Name (Arabic)' },
    subjectNameEn: { ar: 'اسم المادة (بالإنجليزية)', en: 'Subject Name (English)' },
    classroomAr: { ar: 'الفصل / الصف (بالعربية)', en: 'Classroom (Arabic)' },
    classroomEn: { ar: 'الفصل / الصف (بالإنجليزية)', en: 'Classroom (English)' },
    teacherAr: { ar: 'اسم المعلم/ة (بالعربية)', en: 'Teacher Name (Arabic)' },
    teacherEn: { ar: 'اسم المعلم/ة (بالإنجليزية)', en: 'Teacher Name (English)' },
    descriptionAr: { ar: 'وصف مختصر (بالعربية)', en: 'Short Description (Arabic)' },
    descriptionEn: { ar: 'وصف مختصر (بالإنجليزية)', en: 'Short Description (English)' },
    artworkLabel: { ar: 'أيقونة المغامرة', en: 'Quest Emblem' },
    addQuestion: { ar: 'إضافة سؤال جديد', en: 'Add New Question' },
    editQuestion: { ar: 'تعديل السؤال', en: 'Edit Question' },
    filterBySubject: { ar: 'تصفية حسب المادة', en: 'Filter by Subject' },
    filterByLevel: { ar: 'تصفية حسب المستوى', en: 'Filter by Level' },
    questionPromptAr: { ar: 'نص السؤال (بالعربية)', en: 'Question Prompt (Arabic)' },
    questionPromptEn: { ar: 'نص السؤال (بالإنجليزية)', en: 'Question Prompt (English)' },
    optionsHeading: { ar: 'خيارات الإجابة (حدد الإجابة الصحيحة)', en: 'Answer Options (Select the Correct Answer)' },
    explanationAr: { ar: 'شرح الإجابة (اختياري - بالعربية)', en: 'Explanation (Optional - Arabic)' },
    explanationEn: { ar: 'شرح الإجابة (اختياري - بالإنجليزية)', en: 'Explanation (Optional - English)' },
    resetProgressBtn: { ar: 'تصفير تقدم الطالب', en: 'Reset Student Progress' },
    confirmResetProgress: { ar: 'اضغط للتأكيد: تصفير التقدم', en: 'Confirm Reset Progress' },
    restoreDefaultsBtn: { ar: 'استعادة البيانات التجريبية', en: 'Restore Sample Data' },
    confirmRestoreDefaults: { ar: 'اضغط للتأكيد: استعادة الافتراضي', en: 'Confirm Restore Defaults' },
  },
  progressView: {
    title: { ar: 'سجل الإنجاز وفتح المستويات', en: 'Progress & Level Unlocks' },
    subtitle: {
      ar: 'تابع تقدمك في جميع المواد الدراسية والمستويات الأربعة، وارجع لإكمال التحديات المتبقية.',
      en: 'Track your mastery across every subject and all four difficulty tiers.',
    },
  },
};
