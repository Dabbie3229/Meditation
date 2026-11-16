import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  BookOpen,
  ArrowRight,
  Play,
  Check,
  Loader2,
  Sparkles,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { TopStatusBar } from '../navigation/TopStatusBar';
import { BottomTabBar } from '../navigation/BottomTabBar';
import { MainTab, Verse } from '../../types';
import { CATEGORIES, SCRIPTURE_COLLECTION, TODAY_VERSE } from '../../data/scriptures';
import {
  BibleTranslation,
  getSavedBibleTranslation,
  getTranslationDisplayLabel,
  saveBibleTranslation,
  saveRecentSearchedVerse,
  searchFullBibleApi,
  searchLocalVerses,
} from '../../services/scriptureSearch';
import { BibleTranslationPickerModal } from '../modals/BibleTranslationPickerModal';

interface ExploreScreenProps {
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  onSelectVerse: (verse: Verse) => void;
  onUpdateFeaturedVerse?: (verse: Verse) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  currentTab,
  onTabChange,
  onSelectVerse,
  onUpdateFeaturedVerse,
}) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [translation, setTranslation] = useState<BibleTranslation>(() =>
    getSavedBibleTranslation()
  );
  const [showTranslationPicker, setShowTranslationPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [apiResults, setApiResults] = useState<Verse[]>([]);
  const [apiMode, setApiMode] = useState<string | null>(null);
  const [totalApiMatches, setTotalApiMatches] = useState<number>(0);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [justSetId, setJustSetId] = useState<string | null>(null);

  const handleChangeTranslation = (id: string) => {
    setTranslation(id);
    saveBibleTranslation(id);
  };

  const filterTabs = ['All', 'Faith', 'Healing', 'Wisdom', 'More'];
  const trimmedQuery = searchQuery.trim();

  const localVerseMatches = trimmedQuery ? searchLocalVerses(trimmedQuery) : [];

  useEffect(() => {
    if (trimmedQuery.length < 2) {
      setApiResults([]);
      setApiMode(null);
      setTotalApiMatches(0);
      setApiError(null);
      setIsSearchingApi(false);
      return;
    }

    let cancelled = false;
    setIsSearchingApi(true);
    setApiError(null);

    const timer = setTimeout(async () => {
      const res = await searchFullBibleApi(trimmedQuery, translation, 30);
      if (cancelled) return;
      setIsSearchingApi(false);
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

  const handleManualLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmedQuery.length < 2) return;
    setIsSearchingApi(true);
    setApiError(null);
    const res = await searchFullBibleApi(trimmedQuery, translation, 30);
    setIsSearchingApi(false);
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
    } else {
      setApiResults([]);
      if (localVerseMatches.length === 0) {
        setApiError(
          res.error || 'No Bible match found. Try e.g. "Isaiah 26:1" or "John 3:16".'
        );
      }
    }
  };

  const handleMeditateVerse = (v: Verse) => {
    saveRecentSearchedVerse(v);
    onSelectVerse(v);
  };

  const handleSetFeatured = (v: Verse) => {
    saveRecentSearchedVerse(v);
    if (onUpdateFeaturedVerse) {
      onUpdateFeaturedVerse(v);
    }
    setJustSetId(v.id);
    setTimeout(() => setJustSetId(null), 1800);
  };

  const filteredCategories = CATEGORIES.filter((cat) => {
    const matchesFilter =
      activeFilter === 'All' ||
      activeFilter === 'More' ||
      cat.title.toLowerCase().includes(activeFilter.toLowerCase());

    const matchesSearch =
      !trimmedQuery ||
      cat.title.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
      cat.subtitle.toLowerCase().includes(trimmedQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getVersesForCategory = (catId: string): Verse[] => {
    return SCRIPTURE_COLLECTION[catId] || [
      TODAY_VERSE,
      {
        id: `${catId}-1`,
        reference: 'Romans 8:28',
        quote: 'And we know that in all things God works for the good of those who love him.',
        book: 'Romans',
        chapter: 8,
        verse: 28,
        category: catId,
        reflectionPrompts: [
          'How does knowing God works all things for good comfort you today?',
          'What trial can you entrust to His redemptive power?'
        ],
        themeImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      }
    ];
  };

  const apiRefs = new Set(apiResults.map((v) => v.reference.toLowerCase()));
  const dedupedLocalMatches = localVerseMatches.filter(
    (v) => !apiRefs.has(v.reference.toLowerCase())
  );

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-white dark:bg-[#071f15] text-slate-800 dark:text-emerald-50 transition-colors">
      {/* Top Status Bar */}
      <TopStatusBar darkText={true} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-4 no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Explore
            </h1>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
              Search all 66 Bible books or browse topics
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTranslationPicker(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer shrink-0"
            title="Switch Bible translation (KJV, NLT, MSG, ESV, AMP...)"
          >
            <span>{getTranslationDisplayLabel(translation)}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Popular Translations Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'KJV', label: 'KJV' },
            { id: 'NLT', label: 'NLT' },
            { id: 'MSG', label: 'MSG' },
            { id: 'NKJV', label: 'NKJV' },
            { id: 'ESV', label: 'ESV' },
            { id: 'AMP', label: 'AMP' },
            { id: 'NASB', label: 'NASB' },
            { id: 'CSB17', label: 'CSB' },
          ].map((tr) => (
            <button
              key={tr.id}
              type="button"
              onClick={() => handleChangeTranslation(tr.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                translation.toUpperCase() === tr.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {tr.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowTranslationPicker(true)}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 bg-white dark:bg-[#062016] text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 cursor-pointer"
          >
            38+ Versions →
          </button>
        </div>

        {/* Always-Visible Full-Bible Search Bar */}
        <form onSubmit={handleManualLookup} className="mb-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any verse (Isaiah 26:1, John 3:16) or word..."
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-emerald-50/50 dark:bg-[#062016] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear scripture search"
                className="absolute right-2.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </form>

        {/* Full Bible Genesis–Revelation Entry Card */}
        {!trimmedQuery && (
          <button
            type="button"
            onClick={() => onTabChange('bible')}
            className="w-full mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99] text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold leading-tight">
                  Read Full Holy Bible
                </div>
                <div className="text-[11px] text-emerald-50/90 truncate mt-0.5">
                  Genesis to Revelation • All 66 Books & Chapters
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white shrink-0" />
          </button>
        )}

        {/* Active Search Results Section */}
        {trimmedQuery ? (
          <div className="space-y-3 mb-5">
            {isSearchingApi && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
                <span>Searching Genesis to Revelation for “{trimmedQuery}”...</span>
              </div>
            )}

            {apiResults.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>
                      {apiMode === 'keyword'
                        ? `Bible Matches (${totalApiMatches})`
                        : 'Holy Bible Match'}
                    </span>
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {translation.toUpperCase()}
                  </span>
                </div>

                {apiResults.map((v, idx) => (
                  <div
                    key={`${v.id}-${idx}`}
                    className={`p-3.5 rounded-2xl border shadow-2xs ${
                      idx === 0 && apiMode !== 'keyword'
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700'
                        : 'bg-white dark:bg-[#062016] border-emerald-100 dark:border-emerald-900/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-950 dark:text-white">
                        {v.reference}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        {v.category}
                      </span>
                    </div>
                    <p className="font-serif text-xs text-slate-700 dark:text-emerald-100 leading-relaxed mb-3">
                      “{v.quote}”
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleMeditateVerse(v)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-white stroke-none" />
                        <span>Meditate Now</span>
                      </button>
                      {onUpdateFeaturedVerse && (
                        <button
                          type="button"
                          onClick={() => handleSetFeatured(v)}
                          className="py-1.5 px-2.5 rounded-xl bg-white dark:bg-[#071f15] text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                        >
                          {justSetId === v.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Set!</span>
                            </>
                          ) : (
                            <span>Set as Today's</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {dedupedLocalMatches.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 dark:text-emerald-300/80">
                  Curated Verses ({dedupedLocalMatches.length})
                </p>
                {dedupedLocalMatches.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-2xl bg-white dark:bg-[#062016] border border-emerald-100 dark:border-emerald-900/70 shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-950 dark:text-white">
                        {v.reference}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800">
                        {v.category}
                      </span>
                    </div>
                    <p className="font-serif text-xs text-slate-700 dark:text-emerald-100/90 leading-relaxed mb-2.5">
                      “{v.quote}”
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleMeditateVerse(v)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-white stroke-none" />
                        <span>Meditate Now</span>
                      </button>
                      {onUpdateFeaturedVerse && (
                        <button
                          type="button"
                          onClick={() => handleSetFeatured(v)}
                          className="py-1.5 px-2.5 rounded-xl bg-emerald-50/70 dark:bg-[#071f15] text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                        >
                          {justSetId === v.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Set!</span>
                            </>
                          ) : (
                            <span>Set as Today's</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isSearchingApi && apiResults.length === 0 && dedupedLocalMatches.length === 0 && filteredCategories.length === 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-center space-y-2">
                <p className="text-xs font-semibold text-emerald-950 dark:text-white">
                  {apiError || `No verses matched “${trimmedQuery}”`}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-emerald-200/80">
                  Try a Bible reference like “Isaiah 26:1” or “John 3:16”, or browse all 66 books in the Bible tab.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Quick Search Chips when search box is empty */
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {['Isaiah 26:1', 'John 3:16', 'Psalm 23:1-3', 'Romans 8:28'].map((ref) => (
              <button
                key={ref}
                type="button"
                onClick={() => setSearchQuery(ref)}
                className="px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap shrink-0 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200/70 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                {ref}
              </button>
            ))}
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-95 ${
                activeFilter === tab
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-white dark:bg-[#062016] text-slate-600 dark:text-emerald-200/80 border border-emerald-200/80 dark:border-emerald-900 hover:border-emerald-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          {filteredCategories.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedCategory(item.id)}
              role="button"
              tabIndex={0}
              className="group relative h-32 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] border border-emerald-100/80 dark:border-emerald-900"
            >
              {/* Background Photography with fallback styling */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Gradient Scrim */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-90 transition-opacity group-hover:opacity-80`}
              />

              {/* Card Label */}
              <div className="absolute inset-0 p-3.5 flex flex-col justify-end text-white">
                <h3 className="font-bold text-sm leading-tight text-white drop-shadow-sm group-hover:translate-x-0.5 transition-transform">
                  {item.title}
                </h3>
                <p className="text-[11px] text-white/80 font-normal leading-tight mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Category Verses Drawer / View */}
        {selectedCategory && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white dark:bg-[#071f15] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-emerald-100 dark:border-emerald-900 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-900/60">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <h3 className="font-bold text-sm capitalize text-slate-900 dark:text-white">
                    {CATEGORIES.find((c) => c.id === selectedCategory)?.title} Verses
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-200 hover:bg-emerald-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2.5">
                {getVersesForCategory(selectedCategory).map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedCategory(null);
                      handleMeditateVerse(v);
                    }}
                    className="p-3 rounded-xl bg-emerald-50/60 dark:bg-[#062016] hover:bg-emerald-100/70 border border-emerald-100 dark:border-emerald-900/60 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-950 dark:text-emerald-300 mb-1">
                      <span>{v.reference}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="font-serif text-xs text-slate-700 dark:text-emerald-100/90 line-clamp-2">
                      “{v.quote}”
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Tab Bar */}
      <BottomTabBar currentTab={currentTab} onTabChange={onTabChange} />

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
