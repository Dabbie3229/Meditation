import React, { useState, useEffect } from 'react';
import { User, Crown, BookOpen, Zap, Clock, Sparkles, Feather, Smile, Shield, Heart, ChevronDown, Play, X, Check, Search, MessageCircle, Mic } from 'lucide-react';
import { TopStatusBar } from '../navigation/TopStatusBar';
import { BottomTabBar } from '../navigation/BottomTabBar';
import { MainTab, MoodType, Verse } from '../../types';
import { MOODS, TODAY_VERSE, MOOD_SCRIPTURES } from '../../data/scriptures';
import { ScriptureSearchModal } from '../modals/ScriptureSearchModal';
import { DailyPrayerReflection } from '../DailyPrayerReflection';

interface HomeScreenProps {
  userName: string;
  selectedDuration: number;
  onSelectDuration: (mins: number) => void;
  selectedMood: MoodType;
  onSelectMood: (mood: MoodType) => void;
  onStartMeditation: (verse?: Verse) => void;
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  streakDays: number;
  featuredVerse?: Verse;
  onUpdateFeaturedVerse?: (verse: Verse) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName = 'Dabbie',
  selectedDuration,
  onSelectDuration,
  selectedMood,
  onSelectMood,
  onStartMeditation,
  currentTab,
  onTabChange,
  streakDays = 12,
  featuredVerse = TODAY_VERSE,
  onUpdateFeaturedVerse,
}) => {
  // State for the fly-down scripture list & search modal
  const [expandedMood, setExpandedMood] = useState<MoodType | null>(selectedMood);
  const [activeVerse, setActiveVerse] = useState<Verse>(featuredVerse);
  const [justSetVerseId, setJustSetVerseId] = useState<string | null>(null);
  const [showScriptureSearch, setShowScriptureSearch] = useState(false);

  useEffect(() => {
    setActiveVerse(featuredVerse);
  }, [featuredVerse]);

  const durationOptions = [
    { label: 'Quick', duration: 3, timeLabel: '3 min', icon: Zap },
    { label: 'Standard', duration: 10, timeLabel: '10 min', icon: Clock },
    { label: 'Deep', duration: 25, timeLabel: '20–30 min', icon: Sparkles },
  ];

  const getMoodIcon = (id: MoodType) => {
    switch (id) {
      case 'Peace':
        return Feather;
      case 'Joy':
        return Smile;
      case 'Courage':
        return Shield;
      case 'Healing':
        return Sparkles;
      case 'Gratitude':
        return Heart;
      default:
        return Feather;
    }
  };

  const getMoodColors = (id: MoodType) => {
    switch (id) {
      case 'Peace':
        return {
          activeBg: 'bg-sky-100 dark:bg-sky-950/80 border-2 border-sky-400 dark:border-sky-500 text-sky-950 dark:text-sky-100 shadow-md shadow-sky-500/20',
          iconBg: 'bg-sky-200/90 text-sky-700 dark:bg-sky-900 dark:text-sky-300',
          badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/90 dark:text-sky-300 border-sky-200 dark:border-sky-800',
          indicator: 'text-sky-500',
          ring: 'ring-2 ring-sky-400/40',
        };
      case 'Joy':
        return {
          activeBg: 'bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-400 dark:border-amber-500 text-amber-950 dark:text-amber-100 shadow-md shadow-amber-500/20',
          iconBg: 'bg-amber-200/90 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
          badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/90 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          indicator: 'text-amber-500',
          ring: 'ring-2 ring-amber-400/40',
        };
      case 'Courage':
        return {
          activeBg: 'bg-teal-100 dark:bg-teal-950/80 border-2 border-teal-400 dark:border-teal-500 text-teal-950 dark:text-teal-100 shadow-md shadow-teal-500/20',
          iconBg: 'bg-teal-200/90 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
          badge: 'bg-teal-50 text-teal-700 dark:bg-teal-950/90 dark:text-teal-300 border-teal-200 dark:border-teal-800',
          indicator: 'text-teal-500',
          ring: 'ring-2 ring-teal-400/40',
        };
      case 'Healing':
        return {
          activeBg: 'bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-400 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-md shadow-emerald-500/20',
          iconBg: 'bg-emerald-200/90 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
          badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/90 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          indicator: 'text-emerald-500',
          ring: 'ring-2 ring-emerald-400/40',
        };
      case 'Gratitude':
        return {
          activeBg: 'bg-rose-100 dark:bg-rose-950/80 border-2 border-rose-400 dark:border-rose-500 text-rose-950 dark:text-rose-100 shadow-md shadow-rose-500/20',
          iconBg: 'bg-rose-200/90 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
          badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/90 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          indicator: 'text-rose-500',
          ring: 'ring-2 ring-rose-400/40',
        };
    }
  };

  const handleMoodClick = (moodId: MoodType) => {
    onSelectMood(moodId);
    if (expandedMood === moodId) {
      // Toggle close if already open
      setExpandedMood(null);
    } else {
      // Open with smooth fly-down effect
      setExpandedMood(moodId);
    }
  };

  const handleSetVerseAsFeatured = (v: Verse) => {
    setActiveVerse(v);
    if (onUpdateFeaturedVerse) {
      onUpdateFeaturedVerse(v);
    }
    setJustSetVerseId(v.id);
    setTimeout(() => {
      setJustSetVerseId(null);
    }, 2000);
  };

  const moodVerses = expandedMood ? MOOD_SCRIPTURES[expandedMood] || [] : [];
  const currentMoodColors = expandedMood ? getMoodColors(expandedMood) : null;

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-white dark:bg-[#071f15] text-slate-800 dark:text-emerald-50 transition-colors">
      {/* Top Status Bar */}
      <TopStatusBar darkText={true} />

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-6 no-scrollbar">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onTabChange('settings')}
            className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-800 dark:text-emerald-200 hover:opacity-90 transition-opacity cursor-pointer"
            aria-label="Profile settings"
          >
            <User className="w-5 h-5 stroke-[2]" />
          </button>

          <button
            onClick={() => onTabChange('progress')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
            title={`${streakDays} Day Streak`}
          >
            <Crown className="w-4 h-4 fill-emerald-500 text-emerald-600" />
            <span className="text-xs font-bold tabular-nums">{streakDays}</span>
          </button>
        </div>

        {/* Greeting */}
        <div className="mb-3.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Good evening, {userName}</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-xl">🌿</span>
          </h1>
          <p className="text-xs font-medium text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
            Pause. Meditate. Connect.
          </p>
        </div>

        {/* Scripture Search Trigger Bar + Full Bible Shortcut */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setShowScriptureSearch(true)}
            className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-emerald-50/70 dark:bg-[#062016] border border-emerald-200/80 dark:border-emerald-800/80 hover:border-emerald-400 flex items-center gap-2 text-left transition-colors cursor-pointer group"
          >
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-500 dark:text-emerald-200/80 truncate group-hover:text-emerald-900 dark:group-hover:text-white transition-colors">
              Search Isaiah 26:1, John 3:16...
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('bible')}
            title="Browse Genesis to Revelation"
            className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Full Bible</span>
          </button>
        </div>

        {/* Today's Verse Featured Card */}
        <div
          onClick={() => onStartMeditation(activeVerse)}
          role="button"
          tabIndex={0}
          className="group relative w-full rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 active:scale-[0.99] border border-amber-200/60 dark:border-slate-800"
        >
          {/* Scenic Background image */}
          <div className="h-44 w-full relative">
            <img
              src={activeVerse.themeImageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'}
              alt="Misty golden mountain sunrise"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Soft overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/25" />

            {/* Inner Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between text-white text-center">
              {/* Badge */}
              <div className="flex items-center justify-center gap-1.5 self-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium tracking-wide">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Today’s Verse ({activeVerse.category})</span>
              </div>

              {/* Scripture Quote */}
              <div className="my-auto px-1">
                <blockquote className="font-serif text-lg sm:text-xl font-normal leading-snug drop-shadow-md">
                  “{activeVerse.quote}”
                </blockquote>
                <p className="text-xs font-light text-amber-200/90 mt-1.5 tracking-wide">
                  — {activeVerse.reference}
                </p>
              </div>

              {/* Tap to meditate pill */}
              <div className="text-[10px] uppercase font-semibold tracking-wider text-white/80 group-hover:text-white transition-colors">
                Tap to Meditate →
              </div>
            </div>
          </div>
        </div>

        {/* Quick Duration Options */}
        <div className="grid grid-cols-3 gap-2.5 mt-5">
          {durationOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedDuration === opt.duration;
            return (
              <button
                key={opt.duration}
                type="button"
                onClick={() => onSelectDuration(opt.duration)}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 border-2 border-emerald-600 dark:border-emerald-400 text-emerald-900 dark:text-emerald-200 shadow-sm'
                    : 'bg-white dark:bg-[#062016] border border-emerald-100 dark:border-emerald-900/60 text-slate-700 dark:text-emerald-100 hover:border-emerald-300'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold leading-tight">{opt.label}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{opt.timeLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Daily Prayer Reflection (Gemini AI Morning & Evening Devotional) */}
        <div className="mt-5">
          <DailyPrayerReflection
            verse={activeVerse}
            mood={selectedMood}
            userName={userName}
          />
        </div>

        {/* Natural AI Companion Chat Launcher */}
        <button
          type="button"
          onClick={() => onTabChange('chat')}
          className="mt-3 w-full px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-between gap-3 shadow-sm transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-bold leading-tight">
                Talk with Sanctuary Companion
              </div>
              <div className="text-[11px] text-emerald-100 truncate">
                Chat or speak naturally about life, faith, or prayer
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/15 text-[11px] font-semibold shrink-0">
            <Mic className="w-3.5 h-3.5" />
            <span>Chat</span>
          </div>
        </button>

        {/* Choose Mood Section with Interactive Fly-Down Effect */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Feather className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200">
                Choose Mood
              </span>
            </div>
            {expandedMood && (
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
                <span>Tap again to collapse</span>
                <ChevronDown className="w-3 h-3 rotate-180" />
              </span>
            )}
          </div>

          {/* Mood Buttons Row */}
          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((mood) => {
              const Icon = getMoodIcon(mood.id);
              const isSelected = selectedMood === mood.id;
              const isExpanded = expandedMood === mood.id;
              const colors = getMoodColors(mood.id);

              return (
                <button
                  key={mood.id}
                  onClick={() => handleMoodClick(mood.id)}
                  type="button"
                  className={`relative flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
                    isExpanded
                      ? colors.activeBg
                      : isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100'
                      : 'bg-white dark:bg-[#062016] border border-emerald-100/80 dark:border-emerald-900/60 text-slate-600 dark:text-slate-400 hover:border-emerald-300'
                  }`}
                  aria-expanded={isExpanded}
                >
                  {/* Subtle active indicator beacon */}
                  {isExpanded && (
                    <span className="absolute -top-1 w-2 h-2 rounded-full bg-current animate-ping" />
                  )}

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-transform ${
                      isExpanded ? 'scale-110 ' + colors.iconBg : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-tight">{mood.label}</span>

                  {/* Little chevron indicating fly-down status */}
                  <ChevronDown
                    className={`w-3 h-3 mt-0.5 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-current' : 'text-slate-300 dark:text-slate-600 opacity-60'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Animated Fly-Down Scripture List Panel */}
          {expandedMood && (
            <div className="mt-3 overflow-hidden rounded-2xl bg-white dark:bg-[#062016] border border-emerald-100 dark:border-emerald-900/60 shadow-lg animate-in fade-in slide-in-from-top-3 duration-250">
              {/* Fly-down Header */}
              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/60 border-b border-emerald-100/70 dark:border-emerald-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${currentMoodColors?.iconBg}`}>
                    {React.createElement(getMoodIcon(expandedMood), { className: 'w-3.5 h-3.5' })}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Scriptures on {expandedMood}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {moodVerses.length} promises of God for your soul
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedMood(null)}
                  className="w-6 h-6 rounded-full bg-slate-200/70 dark:bg-slate-700/80 hover:bg-slate-300 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors"
                  aria-label="Close scriptures list"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Fly-down Verses Items */}
              <div className="p-3 space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
                {moodVerses.map((v) => {
                  const isCurrentActive = activeVerse.id === v.id;
                  const isJustSet = justSetVerseId === v.id;

                  return (
                    <div
                      key={v.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isCurrentActive
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 shadow-xs'
                          : 'bg-white dark:bg-emerald-950/30 border-emerald-100/80 dark:border-emerald-900/60 hover:border-emerald-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Verse Title & Category Tag */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{v.reference}</span>
                          {isCurrentActive && (
                            <span className="text-[9px] font-semibold bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-1.5 py-0.2 rounded-md">
                              Active
                            </span>
                          )}
                        </span>

                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${currentMoodColors?.badge}`}>
                          {v.category}
                        </span>
                      </div>

                      {/* Verse Quotation */}
                      <p className="font-serif text-xs text-slate-700 dark:text-slate-200 italic leading-relaxed mb-3">
                        “{v.quote}”
                      </p>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                        {/* Meditate button */}
                        <button
                          onClick={() => onStartMeditation(v)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Play className="w-3 h-3 fill-white stroke-none" />
                          <span>Meditate Now</span>
                        </button>

                        {/* Set as featured button */}
                        <button
                          onClick={() => handleSetVerseAsFeatured(v)}
                          className={`py-1.5 px-2.5 rounded-lg text-[11px] font-medium border transition-colors flex items-center gap-1 cursor-pointer ${
                            isJustSet
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                          title="Set as featured verse on the home card"
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Tab Bar */}
      <BottomTabBar currentTab={currentTab} onTabChange={onTabChange} />

      {/* Scripture Search Modal */}
      {showScriptureSearch && (
        <ScriptureSearchModal
          activeVerseId={activeVerse.id}
          onClose={() => setShowScriptureSearch(false)}
          onSelectVerse={(v) => {
            handleSetVerseAsFeatured(v);
            onStartMeditation(v);
          }}
          onSetFeaturedVerse={handleSetVerseAsFeatured}
          onOpenFullBible={() => onTabChange('bible')}
        />
      )}
    </div>
  );
};

