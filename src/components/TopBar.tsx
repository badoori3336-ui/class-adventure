import React from 'react';
import { pickText, UI_COPY } from '../data/translations';
import { AppView, Language } from '../types/adventure';

interface TopBarProps {
  lang: Language;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onJumpToSubjects: () => void;
  onToggleLanguage: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  lang,
  activeView,
  onNavigate,
  onJumpToSubjects,
  onToggleLanguage,
}) => {
  const navItems: { id: string; label: string; isActive: boolean; action: () => void }[] = [
    {
      id: 'home',
      label: pickText(UI_COPY.nav.home, lang),
      isActive: activeView === 'home',
      action: () => onNavigate('home'),
    },
    {
      id: 'subjects',
      label: pickText(UI_COPY.nav.subjects, lang),
      isActive: activeView === 'subject' || activeView === 'quiz' || activeView === 'results',
      action: onJumpToSubjects,
    },
    {
      id: 'progress',
      label: pickText(UI_COPY.nav.progress, lang),
      isActive: activeView === 'progress',
      action: () => onNavigate('progress'),
    },
    {
      id: 'manage',
      label: pickText(UI_COPY.nav.manage, lang),
      isActive: activeView === 'manage',
      action: () => onNavigate('manage'),
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-white/70 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="text-xl font-extrabold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-4 rounded"
        >
          {UI_COPY.brand}
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              className={`relative py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-4 rounded ${
                item.isActive
                  ? 'text-indigo-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="btn-tactile px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
          >
            {UI_COPY.langToggle[lang]}
          </button>
        </div>
      </div>

      {/* Compact mobile navigation row */}
      <nav
        className="md:hidden border-t border-slate-100 bg-slate-50/90 px-4 py-1.5 flex items-center justify-between gap-2 overflow-x-auto"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.action}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              item.isActive
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};
