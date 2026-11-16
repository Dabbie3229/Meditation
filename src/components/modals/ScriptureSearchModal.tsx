import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  BookOpen,
  Play,
  Check,
  Loader2,
  Sparkles,
  History,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { Verse } from '../../types';
import {
  BibleTranslation,
  getAllLocalVerses,
  getRecentSearchedVerses,
  getSavedBibleTranslation,
  getTranslationDisplayLabel,
  saveBibleTranslation,
  saveRecentSearchedVerse,
  searchFullBibleApi,
  searchLocalVerses,
} from '../../services/scriptureSearch';
import { BibleTranslationPickerModal } from './BibleTranslationPickerModal';

interface ScriptureSearchModalProps {
  onClose: () => void;
  onSelectVerse: (verse: Verse) => void;
  onSetFeaturedVerse?: (verse: Verse) => void;
  onOpenFullBible?: () => void;
  activeVerseId?: string;
}

const QUICK_SUGGESTIONS = [
  'Isaiah 26:1',
  'John 3:16',
  'Psalm 23:1-3',
  'Romans 8:28',
  'Genesis 1:1',
  'Revelation 21:4',
  'Peace',
  'Strength',
  'Shepherd',
];

export const ScriptureSearchModal: React.FC<ScriptureSearchModalProps> = ({
  onClose,
  onSelectVerse,
  onSetFeaturedVerse,
  onOpenFullBible,
  activeVerseId,
}) => {
  const [query, setQuery] = useState('');
  const [translation, setTranslation] = useState<BibleTranslation>(() =>
    getSavedBibleTranslation()
  );
  const [showTranslationPicker, setShowTranslationPicker] = useState(false);
  const [localResults, setLocalResults] = useState<Verse[]>([]);
  const [apiResults, setApiResults] = useState<Verse[]>([]);
  const [apiMode, setApiMode] = useState<string | null>(null);
  const [totalApiMatches, setTotalApiMatches] = useState<number>(0);
  const [apiTranslationName, setApiTranslationName] = useState<string>('');
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [recentVerses, setRecentVerses] = useState<Verse[]>(() => getRecentSearchedVerses());
  const [justSetId, setJustSetId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeTranslation = (id: string) => {
    setTranslation(id);
    saveBibleTranslation(id);
  };

  const trimmedQuery = query.trim();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Instant curated local search
  useEffect(() => {
    if (!trimmedQuery) {
      setLocalResults([]);
      setApiResults([]);
      setApiError(null);
      return;
    }
    setLocalResults(searchLocalVerses(trimmedQuery));
  }, [trimmedQuery]);

  // Automatic debounced search across the ENTIRE Bible (all 66 books / 31,102 verses)
  useEffect(() => {
    if (trimmedQuery.length < 2) {
      setApiResults([]);
      setApiMode(null);
      setTotalApiMatches(0);
      setApiError(null);
      setIsLoadingApi(false);
      return;
    }

    let cancelled = false;
    setIsLoadingApi(true);
    setApiError(null);

    const timer = setTimeout(async () => {
      const res = await searchFullBibleApi(trimmedQuery, translation, 30);
      if (cancelled) return;
      setIsLoadingApi(false);

      if (res.found) {
        const list =
          res.matches && res.matches.length > 0
            ? res.matches
            : res.verse
            ? [res.verse]
            : [];
        if (
          res.mode === 'reference' &&
          res.verse &&
          res.matches &&
          res.matches.length > 1
        ) {
          setApiResults([res.verse, ...res.matches]);
        } else {
          setApiResults(list);
        }
        setApiMode(res.mode || 'keyword');
        setTotalApiMatches(res.totalMatches || list.length);
        setApiTranslationName(res.translationName || translation.toUpperCase());
        setRecentVerses(getRecentSearchedVerses());
        setApiError(null);
      } else {
        setApiResults([]);
        setTotalApiMatches(0);
        setApiError(res.error || null);
      }
    }, 260);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmedQuery, translation]);

  const handleManualBibleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (trimmedQuery.length < 2) return;

    setIsLoadingApi(true);
    setApiError(null);
    const res = await searchFullBibleApi(trimmedQuery, translation, 30);
    setIsLoadingApi(false);

    if (res.found) {
      const list =
        res.matches && res.matches.length > 0
          ? res.matches
          : res.verse
          ? [res.verse]
          : [];
      setApiResults(list);
      setApiMode(res.mode || 'keyword');
      setTotalApiMatches(res.totalMatches || list.length);
      setApiTranslationName(res.translationName || translation.toUpperCase());
      setRecentVerses(getRecentSearchedVerses());
    } else {
      setApiResults([]);
      if (localResults.length === 0) {
        setApiError(
          res.error ||
            'No match found. Try a Bible reference like "Isaiah 26:1", "John 3:16", or a word like "peace".'
        );
      }
    }
  };

  const handleMeditate = (verse: Verse) => {
    saveRecentSearchedVerse(verse);
    onSelectVerse(verse);
    onClose();
  };

  const handleSetToday = (verse: Verse) => {
    saveRecentSearchedVerse(verse);
    setRecentVerses(getRecentSearchedVerses());
    if (onSetFeaturedVerse) {
      onSetFeaturedVerse(verse);
    }
    setJustSetId(verse.id);
    setTimeout(() => setJustSetId(null), 1800);
  };

  // Deduplicate curated local results against live Bible API results
  const apiRefs = new Set(apiResults.map((v) => v.reference.toLowerCase()));
  const dedupedLocalResults = localResults.filter(
    (v) => !apiRefs.has(v.reference.toLowerCase())
  );

  const curatedFallbackList = getAllLocalVerses().slice(0, 5);

  const renderVerseCard = (v: Verse, badgeLabel?: string, highlight?: boolean) => {
    const isCurrent = activeVerseId === v.id;
    const isJustSet = justSetId === v.id;

    return (
      <div
        key={`${v.id}-${badgeLabel || 'local'}`}
        className={`p-3.5 rounded-2xl border transition-all ${
          highlight
            ? 'bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 shadow-xs'
            : 'bg-white dark:bg-[#062016] border-emerald-100 dark:border-emerald-900/70 hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-bold text-emerald-950 dark:text-white truncate">
              {v.reference}
            </span>
            {isCurrent && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 shrink-0">
                Active
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800 shrink-0">
            {badgeLabel || v.category}
          </span>
        </div>

        <p className="font-serif text-xs text-slate-700 dark:text-emerald-100/90 leading-relaxed mb-3">
          “{v.quote}”
        </p>

        <div className="flex items-center gap-2 pt-1.5 border-t border-emerald-100/70 dark:border-emerald-900/50">
          <button
            type="button"
            onClick={() => handleMeditate(v)}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Play className="w-3 h-3 fill-white stroke-none" />
            <span>Meditate Now</span>
          </button>

          {onSetFeaturedVerse && (
            <button
              type="button"
              onClick={() => handleSetToday(v)}
              className={`py-2 px-2.5 rounded-xl text-[11px] font-medium border transition-colors flex items-center gap-1 cursor-pointer ${
                isJustSet
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400 dark:bg-emerald-900 dark:text-emerald-200'
                  : 'bg-white dark:bg-[#071f15] text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50'
              }`}
            >
              {isJustSet ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-300" />
                  <span>Set!</span>
                </>
              ) : (
                <span>Set as Today's</span>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#071f15] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-900/70 flex flex-col max-h-[88vh] overflow-hidden"
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
                  Search Entire Bible
                </h2>
                <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                  Every verse from Genesis to Revelation
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close scripture search"
              className="w-8 h-8 rounded-full bg-white dark:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleManualBibleLookup} className="space-y-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3.5 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Isaiah 26:1, John 3:16, or any word..."
                className="w-full pl-10 pr-9 py-2.5 text-xs bg-white dark:bg-[#062016] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl border border-emerald-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 flex items-center justify-center hover:bg-emerald-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Translation Selector & Browse Full Bible */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { id: 'KJV', label: 'KJV' },
                  { id: 'NLT', label: 'NLT' },
                  { id: 'MSG', label: 'MSG' },
                  { id: 'ESV', label: 'ESV' },
                  { id: 'NKJV', label: 'NKJV' },
                  { id: 'AMP', label: 'AMP' },
                ].map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => handleChangeTranslation(tr.id)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      translation.toUpperCase() === tr.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-[#062016] text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    {tr.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowTranslationPicker(true)}
                  className="flex items-center gap-0.5 px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap shrink-0 bg-emerald-100 dark:bg-emerald-900/70 text-emerald-900 dark:text-emerald-100 border border-emerald-300/80 dark:border-emerald-700 cursor-pointer"
                >
                  <span>
                    {['KJV', 'NLT', 'MSG', 'ESV', 'NKJV', 'AMP'].includes(translation.toUpperCase())
                      ? 'More (38+)'
                      : getTranslationDisplayLabel(translation)}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {onOpenFullBible && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFullBible();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/70 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-[10px] font-semibold transition-colors cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-300" />
                  <span>Gen–Rev</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {!trimmedQuery ? (
            <>
              {/* Quick Suggestions */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 dark:text-emerald-300/80 mb-2">
                  Try Searching Any Verse or Word
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SUGGESTIONS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setQuery(chip)}
                      className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentVerses.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <History className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 dark:text-emerald-300/80">
                      Recently Searched
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    {recentVerses.slice(0, 4).map((v) => renderVerseCard(v, 'Recent'))}
                  </div>
                </div>
              )}

              {/* Suggested Meditation Verses */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 dark:text-emerald-300/80 mb-2">
                  Beloved Meditation Scriptures
                </p>
                <div className="space-y-2.5">
                  {curatedFallbackList.map((v) => renderVerseCard(v))}
                </div>
              </div>
            </>
          ) : (
            <>
              {isLoadingApi && (
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
                  <span>Searching Genesis to Revelation for “{trimmedQuery}”...</span>
                </div>
              )}

              {apiResults.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      {apiMode === 'keyword'
                        ? `Bible Search (${totalApiMatches} matches)`
                        : 'Holy Bible Match'}
                    </p>
                    {apiTranslationName && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {apiTranslationName}
                      </span>
                    )}
                  </div>
                  {apiResults.map((v, i) =>
                    renderVerseCard(v, v.category, i === 0 && apiMode !== 'keyword')
                  )}
                </div>
              )}

              {dedupedLocalResults.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 dark:text-emerald-300/80">
                    Curated Meditation Verses ({dedupedLocalResults.length})
                  </p>
                  {dedupedLocalResults.map((v) => renderVerseCard(v))}
                </div>
              )}

              {!isLoadingApi && apiResults.length === 0 && dedupedLocalResults.length === 0 && (
                <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 text-center space-y-2.5">
                  <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="text-xs font-semibold text-emerald-950 dark:text-white">
                    {apiError || `No verses found for “${trimmedQuery}”`}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-emerald-200/80 leading-relaxed">
                    Try a reference like{' '}
                    <button
                      type="button"
                      onClick={() => setQuery('Isaiah 26:1')}
                      className="font-bold text-emerald-700 dark:text-emerald-300 underline cursor-pointer"
                    >
                      Isaiah 26:1
                    </button>{' '}
                    or{' '}
                    <button
                      type="button"
                      onClick={() => setQuery('John 3:16')}
                      className="font-bold text-emerald-700 dark:text-emerald-300 underline cursor-pointer"
                    >
                      John 3:16
                    </button>
                    .
                  </p>
                  {onOpenFullBible && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenFullBible();
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Open Full Bible (Gen–Rev)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showTranslationPicker && (
        <BibleTranslationPickerModal
          currentTranslation={translation}
          onSelect={handleChangeTranslation}
          onClose={() => setShowTranslationPicker(false)}
        />
      )}
    </div>
  );
};
