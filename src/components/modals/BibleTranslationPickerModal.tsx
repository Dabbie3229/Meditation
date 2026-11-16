import React, { useState, useEffect } from 'react';
import { X, Search, Check, BookOpen, Info } from 'lucide-react';
import {
  BibleTranslationMeta,
  DEFAULT_FEATURED_TRANSLATIONS,
  fetchAvailableTranslations,
} from '../../services/scriptureSearch';

interface BibleTranslationPickerModalProps {
  currentTranslation: string;
  onSelect: (translationId: string) => void;
  onClose: () => void;
}

export const BibleTranslationPickerModal: React.FC<BibleTranslationPickerModalProps> = ({
  currentTranslation,
  onSelect,
  onClose,
}) => {
  const [translations, setTranslations] = useState<BibleTranslationMeta[]>(
    DEFAULT_FEATURED_TRANSLATIONS
  );
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchAvailableTranslations().then((list) => {
      if (!cancelled) setTranslations(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const q = filter.trim().toLowerCase();
  const isSearchingNiv = q === 'niv' || q.includes('new international');

  const filtered = q
    ? translations.filter(
        (t) =>
          t.shortName.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.fullName.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      )
    : translations;

  const featuredList = filtered.filter((t) => t.featured);
  const moreList = filtered.filter((t) => !t.featured);

  const renderItem = (t: BibleTranslationMeta) => {
    const isActive = currentTranslation.toUpperCase() === t.id.toUpperCase();
    return (
      <button
        key={t.id}
        type="button"
        onClick={() => {
          onSelect(t.id);
          onClose();
        }}
        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
          isActive
            ? 'bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 shadow-xs'
            : 'bg-white dark:bg-[#062016] border-emerald-100 dark:border-emerald-900/70 hover:border-emerald-300'
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold tracking-wide shrink-0">
              {t.shortName}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {t.fullName}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-emerald-300/80 mt-1 truncate">
            {t.description}
          </p>
        </div>

        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
            isActive
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-400'
          }`}
        >
          {isActive && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </div>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#071f15] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-900 flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-emerald-950 dark:text-white leading-tight">
                  Choose Bible Translation
                </h2>
                <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                  {translations.length} complete English versions available
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close translations"
              className="w-8 h-8 rounded-full bg-white dark:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search KJV, NLT, MSG, ESV, NKJV, AMP, CSB..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-white dark:bg-[#062016] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl border border-emerald-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              autoFocus
            />
            {filter && (
              <button
                type="button"
                onClick={() => setFilter('')}
                className="absolute right-2.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {isSearchingNiv && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5" />
              <div className="text-[11px] text-emerald-950 dark:text-emerald-100 leading-relaxed">
                <strong>Note on NIV:</strong> Biblica restricts the New International Version from free public Bible APIs without a paid publisher license. Popular alternatives ready right now include <strong>NLT</strong>, <strong>CSB</strong>, <strong>ESV</strong>, <strong>NKJV</strong>, <strong>MSG</strong>, <strong>BSB</strong>, and <strong>WEB</strong>.
              </div>
            </div>
          )}

          {featuredList.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 dark:text-emerald-300/80">
                Popular Translations
              </p>
              {featuredList.map(renderItem)}
            </div>
          )}

          {moreList.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 dark:text-emerald-300/80">
                All More Translations ({moreList.length})
              </p>
              {moreList.map(renderItem)}
            </div>
          )}

          {filtered.length === 0 && !isSearchingNiv && (
            <div className="text-center py-6 text-xs text-slate-500 dark:text-emerald-300/70">
              No translation matched “{filter}”. Try KJV, NLT, MSG, ESV, AMP, or BSB.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
