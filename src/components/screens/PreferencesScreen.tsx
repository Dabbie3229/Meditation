import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Music,
  Compass,
  ChevronDown,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  Search,
  Mic,
  Volume2,
} from 'lucide-react';
import { TopStatusBar } from '../navigation/TopStatusBar';
import { MusicStyle, UserPreferences, VoiceGender, VoicePersona } from '../../types';
import { SOUND_CATALOG } from '../../data/soundsCatalog';
import { SoundCatalogModal } from '../modals/SoundCatalogModal';
import { VoiceStudioModal } from '../modals/VoiceStudioModal';
import { narrationEngine, VOICE_PERSONAS } from '../../services/narrationEngine';
import { TODAY_VERSE } from '../../data/scriptures';

interface FocusTheme {
  id: string;
  name: string;
  icon: string;
  scripture: string;
  category: string;
}

interface FocusThemePage {
  title: string;
  subtitle: string;
  themes: FocusTheme[];
}

export const FOCUS_PAGES: FocusThemePage[] = [
  {
    title: 'Inner Peace & Foundations',
    subtitle: 'Stillness, faith, healing, and overcoming anxiety',
    themes: [
      { id: 'Peace', name: 'Peace & Rest', icon: '🕊️', scripture: 'Ps 46:10', category: 'Peace' },
      { id: 'Faith', name: 'Deep Faith', icon: '✝️', scripture: 'Heb 11:1', category: 'Faith' },
      { id: 'Healing', name: 'Healing & Wholeness', icon: '🌿', scripture: 'Jer 17:14', category: 'Healing' },
      { id: 'Growth', name: 'Spiritual Growth', icon: '🌱', scripture: 'Col 2:7', category: 'Growth' },
      { id: 'Fear', name: 'Overcoming Fear & Anxiety', icon: '🛡️', scripture: '2 Tim 1:7', category: 'Courage' },
      { id: 'Closeness with God', name: 'Closeness with God', icon: '🤝', scripture: 'Jas 4:8', category: 'Intimacy' },
    ],
  },
  {
    title: 'Heart, Mercy & Wisdom',
    subtitle: 'Forgiveness, unconditional love, and clear guidance',
    themes: [
      { id: 'Forgiveness', name: 'Forgiveness & Letting Go', icon: '🕊️', scripture: 'Eph 4:32', category: 'Mercy' },
      { id: 'Love', name: 'God’s Unfailing Love', icon: '💖', scripture: 'Rom 8:38', category: 'Love' },
      { id: 'Wisdom', name: 'Wisdom & Direction', icon: '🧭', scripture: 'Jas 1:5', category: 'Wisdom' },
      { id: 'Strength', name: 'Strength in Weakness', icon: '⚡', scripture: 'Isa 40:31', category: 'Strength' },
      { id: 'Joy', name: 'Joy & Rejoicing', icon: '☀️', scripture: 'Neh 8:10', category: 'Joy' },
      { id: 'Patience', name: 'Patience & Stillness', icon: '🌸', scripture: 'Ps 37:7', category: 'Patience' },
    ],
  },
  {
    title: 'Life Calling, Provision & Praise',
    subtitle: 'Finances, protection, divine purpose, and thanksgiving',
    themes: [
      { id: 'Finances', name: 'Trusting God with Finances', icon: '💰', scripture: 'Phil 4:19', category: 'Provision' },
      { id: 'Praise', name: 'Praise & Thanksgiving', icon: '🙌', scripture: 'Ps 100:4', category: 'Worship' },
      { id: 'Protection', name: 'Spiritual Protection', icon: '⚔️', scripture: 'Eph 6:11', category: 'Protection' },
      { id: 'Hope', name: 'Hope in Hard Times', icon: '🕯️', scripture: 'Rom 15:13', category: 'Hope' },
      { id: 'Purpose', name: 'Purpose & Calling', icon: '🌾', scripture: 'Jer 29:11', category: 'Calling' },
      { id: 'Grace', name: 'Grace & Humility', icon: '👑', scripture: 'Jas 4:6', category: 'Grace' },
    ],
  },
];

interface PreferencesScreenProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onContinue: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({
  preferences,
  onUpdatePreferences,
  onContinue,
  onBack,
  onSkip,
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [showVoiceStudio, setShowVoiceStudio] = useState(false);
  
  // Interactive page state controlled by the 3 dots
  const [activeFocusPageIndex, setActiveFocusPageIndex] = useState(0);

  // Selected focuses list (supports multiple selection!)
  const [selectedFocuses, setSelectedFocuses] = useState<string[]>(() => {
    if (preferences.selectedFocuses && preferences.selectedFocuses.length > 0) {
      return preferences.selectedFocuses;
    }
    return [preferences.initialFocus || 'Peace'];
  });

  const popularMusicStyles: MusicStyle[] = [
    'Gymnopedie No. 1',
    'Clair de Lune',
    'Moonlight Sonata',
    'Chopin Nocturne Op. 9 No. 2',
    'Gnossienne No. 1',
    'Chopin Nocturne in C# Minor',
    'Schubert Andante',
  ];

  const timePresets = ['06:30 AM', '07:00 AM', '08:00 AM', '09:00 AM', '07:30 PM', '09:00 PM'];

  const toggleFocus = (themeId: string) => {
    let nextSelected: string[];
    if (selectedFocuses.includes(themeId)) {
      if (selectedFocuses.length > 1) {
        nextSelected = selectedFocuses.filter((f) => f !== themeId);
      } else {
        nextSelected = selectedFocuses; // keep at least 1
      }
    } else {
      nextSelected = [...selectedFocuses, themeId];
    }
    setSelectedFocuses(nextSelected);
    onUpdatePreferences({
      initialFocus: nextSelected[0],
      selectedFocuses: nextSelected,
    });
  };

  const handleNextPage = () => {
    setActiveFocusPageIndex((prev) => (prev + 1) % FOCUS_PAGES.length);
  };

  const handlePrevPage = () => {
    setActiveFocusPageIndex((prev) => (prev - 1 + FOCUS_PAGES.length) % FOCUS_PAGES.length);
  };

  const currentPage = FOCUS_PAGES[activeFocusPageIndex];

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 no-scrollbar">
      {/* Top Status Bar */}
      <TopStatusBar darkText={true} />

      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between px-6 py-2">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <button
          onClick={onSkip}
          className="text-sm font-semibold text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 px-3 py-1.5 transition-colors cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pt-1 pb-6 flex flex-col">
        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center">
          Set Your Preferences
        </h1>
        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 text-center max-w-[280px] mx-auto">
          Help us personalize your meditation experience.
        </p>

        {/* Section 1: Reminder Time */}
        <div className="mt-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            <Bell className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Reminder Time</span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTimePicker(!showTimePicker)}
              className="w-full h-12 px-4 rounded-xl bg-emerald-50/70 dark:bg-[#062016] border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between text-slate-800 dark:text-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span className="text-sm font-medium">{preferences.reminderTime || '8:00 AM'}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  showTimePicker ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Options */}
            {showTimePicker && (
              <div className="absolute top-14 left-0 right-0 z-20 p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-1.5 animate-in fade-in zoom-in-95 duration-150">
                {timePresets.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      onUpdatePreferences({ reminderTime: time });
                      setShowTimePicker(false);
                    }}
                    className={`py-2 px-1 text-xs font-medium rounded-lg text-center transition-colors cursor-pointer ${
                      preferences.reminderTime === time
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Preferred Sound Style */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Music className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Preferred Sound Style</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCatalogModal(true)}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>All 14 Sounds →</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {popularMusicStyles.map((style) => {
              const isSelected = preferences.musicStyle === style;
              const sound = SOUND_CATALOG.find((s) => s.id === style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => onUpdatePreferences({ musicStyle: style })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25 font-semibold'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                  }`}
                >
                  {sound?.icon && <span className="text-xs">{sound.icon}</span>}
                  <span>{style}</span>
                </button>
              );
            })}
          </div>

          {/* Sound Catalog Modal */}
          {showCatalogModal && (
            <SoundCatalogModal
              currentStyle={preferences.musicStyle}
              onSelectStyle={(s) => {
                onUpdatePreferences({ musicStyle: s });
                setShowCatalogModal(false);
              }}
              onClose={() => setShowCatalogModal(false)}
            />
          )}
        </div>

        {/* Section: Scripture Whisper Voice (Feminine vs Masculine) */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Mic className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Scripture Whisper Voice</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowVoiceStudio(true)}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Voice Studio</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  narrationEngine.setVoiceGender(preferences.voiceGender || 'feminine');
                  narrationEngine.recite(TODAY_VERSE);
                }}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Feminine Voice Option */}
            <button
              type="button"
              onClick={() => {
                onUpdatePreferences({ voiceGender: 'feminine' });
                narrationEngine.setVoiceGender('feminine');
              }}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                (preferences.voiceGender || 'feminine') === 'feminine'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-slate-900 dark:text-white shadow-xs ring-1 ring-emerald-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">🌸</span>
                {(preferences.voiceGender || 'feminine') === 'feminine' && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                )}
              </div>
              <div className="font-bold text-xs">Feminine Voice</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Gentle, warm & serene</div>
            </button>

            {/* Masculine Voice Option */}
            <button
              type="button"
              onClick={() => {
                onUpdatePreferences({ voiceGender: 'masculine' });
                narrationEngine.setVoiceGender('masculine');
              }}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                preferences.voiceGender === 'masculine'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-slate-900 dark:text-white shadow-xs ring-1 ring-emerald-600/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">🌿</span>
                {preferences.voiceGender === 'masculine' && (
                  <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                )}
              </div>
              <div className="font-bold text-xs">Masculine Voice</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Deep, calm & reverent</div>
            </button>
          </div>
        </div>

        {/* Section 3: Interactive Biblical Focus Explorer (Powered by the 3 Dots!) */}
        <div className="mt-6">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Compass className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Biblical Focus Themes</span>
            </div>

            {/* Selection Counter Pill */}
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
              {selectedFocuses.length} selected
            </span>
          </div>

          {/* Current Page Category Title */}
          <div className="flex items-center justify-between mb-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{currentPage.title}</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  (Set {activeFocusPageIndex + 1} of 3)
                </span>
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {currentPage.subtitle}
              </p>
            </div>

            {/* Prev & Next arrows for fast paging */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevPage}
                className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-emerald-100 transition-colors cursor-pointer"
                aria-label="Previous themes"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-emerald-100 transition-colors cursor-pointer"
                aria-label="Next themes"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid of Focus Theme Badges */}
          <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
            {currentPage.themes.map((theme) => {
              const isSelected = selectedFocuses.includes(theme.id);
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => toggleFocus(theme.id)}
                  className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between group active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 border-emerald-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{theme.icon}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-white/20 text-white font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {theme.scripture}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold leading-tight">{theme.name}</span>
                    {isSelected && <Check className="w-3 h-3 stroke-[3] shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* --- THE THREE INTERACTIVE DOTS (Active Page Controllers) --- */}
          <div className="flex flex-col items-center justify-center mt-4">
            <div className="flex items-center gap-2.5 p-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              {FOCUS_PAGES.map((page, idx) => {
                const isActive = activeFocusPageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveFocusPageIndex(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center ${
                      isActive
                        ? 'w-8 h-3 bg-emerald-600 shadow-xs'
                        : 'w-3 h-3 bg-slate-300 dark:bg-slate-700 hover:bg-emerald-300 dark:hover:bg-emerald-900'
                    }`}
                    title={`Explore ${page.title}`}
                    aria-label={`Go to themes page ${idx + 1}: ${page.title}`}
                  />
                );
              })}
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              Tap the 3 dots to switch between 18 biblical focus themes
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="px-6 pb-8 pt-2 flex flex-col items-center">
        {/* Continue CTA */}
        <button
          onClick={onContinue}
          className="w-full max-w-sm h-14 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all cursor-pointer text-base"
        >
          <span>Continue with {selectedFocuses.length} Focus{selectedFocuses.length > 1 ? 'es' : ''}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Voice Studio Modal */}
      <VoiceStudioModal
        verse={TODAY_VERSE}
        isOpen={showVoiceStudio}
        onClose={() => setShowVoiceStudio(false)}
        voiceEnabled={preferences.voiceEnabled !== false}
        onToggleVoiceEnabled={(enabled) => onUpdatePreferences({ voiceEnabled: enabled })}
        onSelectPersona={(persona) => {
          onUpdatePreferences({
            voicePersona: persona.id,
            voiceGender: persona.gender,
          });
        }}
      />
    </div>
  );
};
