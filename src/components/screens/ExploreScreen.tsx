import React, { useState } from 'react';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { TopStatusBar } from '../navigation/TopStatusBar';
import { BottomTabBar } from '../navigation/BottomTabBar';
import { MainTab, Verse } from '../../types';
import { CATEGORIES, SCRIPTURE_COLLECTION, TODAY_VERSE } from '../../data/scriptures';

interface ExploreScreenProps {
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  onSelectVerse: (verse: Verse) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  currentTab,
  onTabChange,
  onSelectVerse,
}) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filterTabs = ['All', 'Faith', 'Healing', 'Wisdom', 'More'];

  const filteredCategories = CATEGORIES.filter((cat) => {
    const matchesFilter =
      activeFilter === 'All' ||
      activeFilter === 'More' ||
      cat.title.toLowerCase().includes(activeFilter.toLowerCase());

    const matchesSearch =
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

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

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Status Bar */}
      <TopStatusBar darkText={true} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-4 no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Explore
          </h1>
          <button
            onClick={() => {
              setShowSearch(!showSearch);
              if (showSearch) setSearchQuery('');
            }}
            aria-label="Search topics"
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
        </div>

        {/* Search input if active */}
        {showSearch && (
          <div className="mb-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, themes, or verses..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                autoFocus
              />
            </div>
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
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300'
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
              className="group relative h-32 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] border border-slate-200/60 dark:border-slate-800"
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
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <h3 className="font-bold text-sm capitalize text-slate-900 dark:text-white">
                    {CATEGORIES.find((c) => c.id === selectedCategory)?.title} Verses
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
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
                      onSelectVerse(v);
                    }}
                    className="p-3 rounded-xl bg-emerald-50/60 dark:bg-slate-800/60 hover:bg-emerald-100/70 border border-emerald-100 dark:border-slate-700/60 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-950 dark:text-emerald-300 mb-1">
                      <span>{v.reference}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="font-serif text-xs text-slate-700 dark:text-slate-200 line-clamp-2">
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
    </div>
  );
};
