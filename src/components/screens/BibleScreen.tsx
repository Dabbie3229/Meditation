import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Play,
  Check,
  Loader2,
  BookMarked,
  ChevronDown,
} from 'lucide-react';
import { TopStatusBar } from '../navigation/TopStatusBar';
import { BottomTabBar } from '../navigation/BottomTabBar';
import { MainTab, Verse } from '../../types';
import {
  BibleBookMeta,
  BibleChapterData,
  BibleTranslation,
  fetchBibleBooks,
  fetchBibleChapter,
  getSavedBibleTranslation,
  getTranslationDisplayLabel,
  saveBibleTranslation,
  saveRecentSearchedVerse,
  searchFullBibleApi,
} from '../../services/scriptureSearch';
import { BibleTranslationPickerModal } from '../modals/BibleTranslationPickerModal';

interface BibleScreenProps {
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  onSelectVerse: (verse: Verse) => void;
  onUpdateFeaturedVerse?: (verse: Verse) => void;
  activeVerseId?: string;
}

type TestamentFilter = 'ALL' | 'OT' | 'NT';

export const BibleScreen: React.FC<BibleScreenProps> = ({
  currentTab,
  onTabChange,
  onSelectVerse,
  onUpdateFeaturedVerse,
  activeVerseId,
}) => {
  const [translation, setTranslation] = useState<BibleTranslation>(() =>
    getSavedBibleTranslation()
  );
  const [showTranslationPicker, setShowTranslationPicker] = useState(false);
  const [books, setBooks] = useState<BibleBookMeta[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [testament, setTestament] = useState<TestamentFilter>('ALL');

  const handleChangeTranslation = (id: string) => {
    setTranslation(id);
    saveBibleTranslation(id);
  };

  // Navigation within the Bible: Books -> Chapters -> Chapter Reader
  const [selectedBook, setSelectedBook] = useState<BibleBookMeta | null>(null);
  const [chapterData, setChapterData] = useState<BibleChapterData | null>(null);
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);
  const [selectedVerseNum, setSelectedVerseNum] = useState<number | null>(null);
  const [highlightedVerseNum, setHighlightedVerseNum] = useState<number | null>(null);

  // Full-Bible Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [searchMode, setSearchMode] = useState<string | null>(null);
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [justSetId, setJustSetId] = useState<string | null>(null);

  const trimmedQuery = searchQuery.trim();

  // Load all 66 books (Genesis to Revelation)
  useEffect(() => {
    let cancelled = false;
    setIsLoadingBooks(true);
    fetchBibleBooks(translation)
      .then((list) => {
        if (!cancelled) {
          setBooks(list);
          setIsLoadingBooks(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoadingBooks(false);
      });
    return () => {
      cancelled = true;
    };
  }, [translation]);

  // Reload currently open chapter if translation toggles
  useEffect(() => {
    if (!chapterData) return;
    let cancelled = false;
    setIsLoadingChapter(true);
    fetchBibleChapter(chapterData.book, chapterData.chapter, translation)
      .then((data) => {
        if (!cancelled) {
          setChapterData(data);
          setIsLoadingChapter(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoadingChapter(false);
      });
    return () => {
      cancelled = true;
    };
  }, [translation]);

  // Live debounced search across all 31,102 verses
  useEffect(() => {
    if (trimmedQuery.length < 2) {
      setSearchResults([]);
      setSearchMode(null);
      setTotalMatches(0);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      const res = await searchFullBibleApi(trimmedQuery, translation, 40);
      if (cancelled) return;
      setIsSearching(false);
      if (res.found) {
        const list =
          res.matches && res.matches.length > 0
            ? res.matches
            : res.verse
            ? [res.verse]
            : [];
        // If single range like Psalm 23:1-3, keep the combined verse first when multi-verse
        if (
          res.mode === 'reference' &&
          res.verse &&
          res.matches &&
          res.matches.length > 1
        ) {
          setSearchResults([res.verse, ...res.matches]);
        } else {
          setSearchResults(list);
        }
        setSearchMode(res.mode || 'keyword');
        setTotalMatches(res.totalMatches || list.length);
        setSearchError(null);
      } else {
        setSearchResults([]);
        setTotalMatches(0);
        setSearchError(res.error || 'No matching verses found.');
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmedQuery, translation]);

  const openChapter = async (
    bookName: string,
    chapterNum: number,
    focusVerse?: number
  ) => {
    setIsLoadingChapter(true);
    setSelectedVerseNum(focusVerse || null);
    setHighlightedVerseNum(focusVerse || null);
    try {
      const data = await fetchBibleChapter(bookName, chapterNum, translation);
      setChapterData(data);
      const matchedBook = books.find((b) => b.name === data.book);
      if (matchedBook) setSelectedBook(matchedBook);
    } catch {
      // ignore
    } finally {
      setIsLoadingChapter(false);
    }
  };

  const handleMeditate = (verse: Verse) => {
    saveRecentSearchedVerse(verse);
    onSelectVerse(verse);
  };

  const handleSetToday = (verse: Verse) => {
    saveRecentSearchedVerse(verse);
    if (onUpdateFeaturedVerse) {
      onUpdateFeaturedVerse(verse);
    }
    setJustSetId(verse.id);
    setTimeout(() => setJustSetId(null), 1800);
  };

  const filteredBooks = books.filter((b) =>
    testament === 'ALL' ? true : b.testament === testament
  );

  const handleBack = () => {
    if (chapterData) {
      setChapterData(null);
      setSelectedVerseNum(null);
      setHighlightedVerseNum(null);
    } else if (selectedBook) {
      setSelectedBook(null);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-white dark:bg-[#071f15] text-slate-800 dark:text-emerald-50 transition-colors">
      <TopStatusBar darkText={true} />

      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-4 no-scrollbar">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {(selectedBook || chapterData) && !trimmedQuery ? (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Back"
                className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {trimmedQuery
                  ? 'Bible Search'
                  : chapterData
                  ? `${chapterData.book} ${chapterData.chapter}`
                  : selectedBook
                  ? selectedBook.name
                  : 'Holy Bible'}
              </h1>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 truncate">
                {trimmedQuery
                  ? 'Searching all 66 books (Genesis–Revelation)'
                  : chapterData
                  ? `${chapterData.verses.length} verses • Tap any verse to meditate`
                  : selectedBook
                  ? `${selectedBook.chapterCount} chapters • ${selectedBook.testament === 'OT' ? 'Old' : 'New'} Testament`
                  : 'Genesis to Revelation • All 66 Books'}
              </p>
            </div>
          </div>

          {/* Translation Picker Button */}
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

        {/* Quick Popular Translation Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 no-scrollbar">
          {[
            { id: 'KJV', label: 'KJV' },
            { id: 'NLT', label: 'NLT' },
            { id: 'MSG', label: 'MSG' },
            { id: 'NKJV', label: 'NKJV' },
            { id: 'ESV', label: 'ESV' },
            { id: 'AMP', label: 'AMP' },
            { id: 'NASB', label: 'NASB' },
            { id: 'CSB17', label: 'CSB' },
            { id: 'WEB', label: 'WEB' },
          ].map((tr) => {
            const isActive = translation.toUpperCase() === tr.id;
            return (
              <button
                key={tr.id}
                type="button"
                onClick={() => handleChangeTranslation(tr.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {tr.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowTranslationPicker(true)}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 bg-white dark:bg-[#062016] text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 cursor-pointer"
          >
            All 38+ Versions →
          </button>
        </div>

        {/* Always-Visible Full-Bible Search Input */}
        <div className="mb-3">
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
                aria-label="Clear search"
                className="absolute right-2.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* 1. ACTIVE SEARCH RESULTS ACROSS ALL 66 BOOKS */}
        {trimmedQuery.length >= 2 ? (
          <div className="space-y-2.5">
            {isSearching && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
                <span>Searching Genesis to Revelation for “{trimmedQuery}”...</span>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <>
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 dark:text-emerald-300/80">
                    {searchMode === 'keyword'
                      ? `${totalMatches} Bible ${totalMatches === 1 ? 'Match' : 'Matches'}${totalMatches > searchResults.length ? ` (showing top ${searchResults.length})` : ''}`
                      : `Scripture Found (${translation.toUpperCase()})`}
                  </span>
                </div>

                {searchResults.map((v) => {
                  const isJustSet = justSetId === v.id;
                  const isCurrent = activeVerseId === v.id;
                  return (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#062016] border border-emerald-100 dark:border-emerald-900/70 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-emerald-950 dark:text-white">
                            {v.reference}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                              Active
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            openChapter(v.book, v.chapter, v.verse);
                          }}
                          className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <BookMarked className="w-3 h-3" />
                          <span>Open Chapter</span>
                        </button>
                      </div>

                      <p className="font-serif text-xs text-slate-700 dark:text-emerald-100/90 leading-relaxed mb-3">
                        “{v.quote}”
                      </p>

                      <div className="flex items-center gap-2 pt-1.5 border-t border-emerald-100/70 dark:border-emerald-900/50">
                        <button
                          type="button"
                          onClick={() => handleMeditate(v)}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-white stroke-none" />
                          <span>Meditate Now</span>
                        </button>

                        {onUpdateFeaturedVerse && (
                          <button
                            type="button"
                            onClick={() => handleSetToday(v)}
                            className="py-1.5 px-2.5 rounded-xl bg-emerald-50/70 dark:bg-[#071f15] text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                          >
                            {isJustSet ? (
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
                  );
                })}
              </>
            )}

            {!isSearching && searchResults.length === 0 && searchError && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 text-center space-y-1.5">
                <p className="text-xs font-semibold text-emerald-950 dark:text-white">
                  {searchError}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-emerald-200/80">
                  Try “Isaiah 26:1”, “John 3:16”, “Genesis 1:1”, or a keyword like “shepherd”.
                </p>
              </div>
            )}
          </div>
        ) : chapterData ? (
          /* 2. FULL CHAPTER READER (ANY CHAPTER FROM GENESIS 1 TO REVELATION 22) */
          <div className="space-y-3">
            {isLoadingChapter ? (
              <div className="flex items-center justify-center py-12 text-emerald-700 dark:text-emerald-300 gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading chapter...</span>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {chapterData.verses.map((vItem) => {
                    const isExpanded = selectedVerseNum === vItem.verse;
                    const isHighlighted = highlightedVerseNum === vItem.verse;
                    const isJustSet = justSetId === vItem.normalized.id;

                    return (
                      <div
                        key={vItem.verse}
                        onClick={() =>
                          setSelectedVerseNum(isExpanded ? null : vItem.verse)
                        }
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isExpanded || isHighlighted
                            ? 'bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-600 shadow-xs'
                            : 'bg-white dark:bg-[#062016] border-emerald-100/80 dark:border-emerald-900/60 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5 shrink-0 w-5">
                            {vItem.verse}
                          </span>
                          <p className="font-serif text-xs sm:text-[13px] text-slate-800 dark:text-emerald-50 leading-relaxed flex-1">
                            {vItem.text}
                          </p>
                        </div>

                        {isExpanded && (
                          <div
                            className="flex items-center gap-2 mt-3 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => handleMeditate(vItem.normalized)}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Play className="w-3 h-3 fill-white stroke-none" />
                              <span>Meditate on {chapterData.book} {chapterData.chapter}:{vItem.verse}</span>
                            </button>

                            {onUpdateFeaturedVerse && (
                              <button
                                type="button"
                                onClick={() => handleSetToday(vItem.normalized)}
                                className="py-1.5 px-2.5 rounded-xl bg-white dark:bg-[#071f15] text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                              >
                                {isJustSet ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Set!</span>
                                  </>
                                ) : (
                                  <span>Set Today's</span>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Chapter Navigation Footer */}
                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    disabled={chapterData.chapter <= 1}
                    onClick={() =>
                      openChapter(chapterData.book, chapterData.chapter - 1)
                    }
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev Ch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChapterData(null)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 cursor-pointer"
                  >
                    All Chapters
                  </button>

                  <button
                    type="button"
                    disabled={chapterData.chapter >= chapterData.totalChapters}
                    onClick={() =>
                      openChapter(chapterData.book, chapterData.chapter + 1)
                    }
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white disabled:opacity-40 cursor-pointer"
                  >
                    <span>Next Ch</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ) : selectedBook ? (
          /* 3. CHAPTER SELECTOR GRID FOR SELECTED BOOK */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                Choose Chapter (1–{selectedBook.chapterCount})
              </span>
              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
              >
                All 66 Books
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: selectedBook.chapterCount }, (_, idx) => idx + 1).map(
                (chNum) => (
                  <button
                    key={chNum}
                    type="button"
                    onClick={() => openChapter(selectedBook.name, chNum)}
                    className="py-3 rounded-xl bg-emerald-50/70 dark:bg-[#062016] hover:bg-emerald-600 hover:text-white border border-emerald-200/80 dark:border-emerald-900 text-xs font-bold text-emerald-950 dark:text-emerald-100 transition-colors cursor-pointer tabular-nums"
                  >
                    {chNum}
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          /* 4. ALL 66 BOOKS OF THE BIBLE (GENESIS TO REVELATION) */
          <div className="space-y-3">
            {/* Quick Try Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['Isaiah 26:1', 'John 3:16', 'Psalm 23:1-3', 'Genesis 1:1', 'Revelation 21:4'].map(
                (ref) => (
                  <button
                    key={ref}
                    type="button"
                    onClick={() => setSearchQuery(ref)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap shrink-0 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    {ref}
                  </button>
                )
              )}
            </div>

            {/* Testament Filter Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-emerald-50/70 dark:bg-emerald-950/60 p-1 rounded-xl border border-emerald-100 dark:border-emerald-900">
              {(
                [
                  { id: 'ALL', label: 'All (66)' },
                  { id: 'OT', label: 'Old Test. (39)' },
                  { id: 'NT', label: 'New Test. (27)' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTestament(tab.id)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    testament === tab.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-900/80 dark:text-emerald-200 hover:bg-white/60 dark:hover:bg-emerald-900/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {isLoadingBooks ? (
              <div className="flex items-center justify-center py-12 text-emerald-700 dark:text-emerald-300 gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading Genesis to Revelation...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filteredBooks.map((book) => (
                  <button
                    key={book.name}
                    type="button"
                    onClick={() => setSelectedBook(book)}
                    className="p-3 rounded-2xl bg-white dark:bg-[#062016] border border-emerald-100 dark:border-emerald-900/70 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/60 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {book.index}. {book.testament}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {book.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-emerald-300/70 mt-0.5">
                      {book.chapterCount} {book.chapterCount === 1 ? 'chapter' : 'chapters'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

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
