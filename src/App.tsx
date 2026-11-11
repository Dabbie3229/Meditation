/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ScreenId, MainTab, MoodType, UserPreferences, Verse, JournalNote, MeditationSession } from './types';
import { TODAY_VERSE } from './data/scriptures';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { PreferencesScreen } from './components/screens/PreferencesScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { PlayerScreen } from './components/screens/PlayerScreen';
import { SessionCompleteScreen } from './components/screens/SessionCompleteScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { ProgressScreen } from './components/screens/ProgressScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { ShowcaseGrid } from './components/ShowcaseGrid';
import { SoundCatalogModal } from './components/modals/SoundCatalogModal';
import { narrationEngine } from './services/narrationEngine';
import { Smartphone, LayoutGrid, Sun, Moon, Volume2, Sparkles, Music2 } from 'lucide-react';

export default function App() {
  // Navigation & View mode
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [viewMode, setViewMode] = useState<'phone' | 'showcase'>('phone');
  const [showSoundCatalog, setShowSoundCatalog] = useState(false);

  // User & App Preferences with localStorage persistence
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('meditate_preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          voiceGender: 'feminine',
          voicePersona: 'seraphina',
          whisperSoftness: 'mild',
          voiceSmoothness: 'silky',
          musicStyle: 'Gymnopedie No. 1',
          ...parsed,
        };
      } catch {
        // fallback
      }
    }
    return {
      userName: 'Dabbie',
      reminderTime: '8:00 AM',
      reminderEnabled: true,
      musicStyle: 'Gymnopedie No. 1',
      initialFocus: 'Peace',
      voiceGender: 'feminine',
      voicePersona: 'seraphina',
      whisperSoftness: 'mild',
      voiceSmoothness: 'silky',
      isDarkMode: false,
      volume: 0.35,
    };
  });

  // Meditation state
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [selectedMood, setSelectedMood] = useState<MoodType>('Peace');
  const [activeVerse, setActiveVerse] = useState<Verse>(TODAY_VERSE);
  const [streakDays, setStreakDays] = useState<number>(12);
  const [totalMinutes, setTotalMinutes] = useState<number>(160);
  const [favorites, setFavorites] = useState<string[]>(['psalm-46-10']);
  const [journalNotes, setJournalNotes] = useState<JournalNote[]>([]);
  const [sessions, setSessions] = useState<MeditationSession[]>([]);

  // Apply dark mode class to document
  useEffect(() => {
    if (preferences.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('meditate_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  const handleStartMeditation = (verse?: Verse) => {
    if (verse) {
      setActiveVerse(verse);
    }
    setCurrentScreen('player');
  };

  const handleCompleteSession = (elapsedSecs: number) => {
    const completedMinutes = Math.max(1, Math.round(elapsedSecs / 60));
    setTotalMinutes((prev) => prev + completedMinutes);
    setStreakDays((prev) => prev + 1);

    const newSession: MeditationSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      verseRef: activeVerse.reference,
      durationMinutes: completedMinutes,
      mood: selectedMood,
      musicStyle: preferences.musicStyle,
      completedAt: 'Today',
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentScreen('completed');
  };

  const handleSaveNote = (noteText: string, hasVoice: boolean) => {
    const newNote: JournalNote = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      verseRef: activeVerse.reference,
      text: noteText,
      hasAudio: hasVoice,
    };
    setJournalNotes((prev) => [newNote, ...prev]);
  };

  const toggleFavorite = (verseId: string) => {
    setFavorites((prev) =>
      prev.includes(verseId) ? prev.filter((id) => id !== verseId) : [...prev, verseId]
    );
  };

  const handleShare = (verse: Verse) => {
    if (navigator.share) {
      navigator.share({
        title: 'Meditate on the Word',
        text: `“${verse.quote}” — ${verse.reference}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`“${verse.quote}” — ${verse.reference}`);
      alert('Verse copied to clipboard!');
    }
  };

  const navigateTab = (tab: MainTab) => {
    setCurrentScreen(tab as ScreenId);
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onGetStarted={() => setCurrentScreen('preferences')}
            onSkip={() => setCurrentScreen('home')}
          />
        );
      case 'preferences':
        return (
          <PreferencesScreen
            preferences={preferences}
            onUpdatePreferences={updatePreferences}
            onContinue={() => setCurrentScreen('home')}
            onBack={() => setCurrentScreen('welcome')}
            onSkip={() => setCurrentScreen('home')}
          />
        );
      case 'home':
        return (
          <HomeScreen
            userName={preferences.userName}
            selectedDuration={selectedDuration}
            onSelectDuration={setSelectedDuration}
            selectedMood={selectedMood}
            onSelectMood={setSelectedMood}
            onStartMeditation={handleStartMeditation}
            currentTab="home"
            onTabChange={navigateTab}
            streakDays={streakDays}
            featuredVerse={activeVerse}
            onUpdateFeaturedVerse={setActiveVerse}
          />
        );
      case 'player':
        return (
          <PlayerScreen
            verse={activeVerse}
            durationMinutes={selectedDuration}
            mood={selectedMood}
            musicStyle={preferences.musicStyle}
            voiceGender={preferences.voiceGender || 'feminine'}
            voicePersona={preferences.voicePersona}
            onUpdateVoiceGender={(gender) => updatePreferences({ voiceGender: gender })}
            onUpdateVoicePersona={(personaId) => updatePreferences({ voicePersona: personaId })}
            onClose={() => setCurrentScreen('home')}
            onComplete={handleCompleteSession}
          />
        );
      case 'completed':
        return (
          <SessionCompleteScreen
            verse={activeVerse}
            onGoHome={() => setCurrentScreen('home')}
            onViewProgress={() => setCurrentScreen('progress')}
            onSaveNote={handleSaveNote}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.includes(activeVerse.id)}
            onShare={handleShare}
          />
        );
      case 'explore':
        return (
          <ExploreScreen
            currentTab="explore"
            onTabChange={navigateTab}
            onSelectVerse={(v) => {
              setActiveVerse(v);
              setCurrentScreen('player');
            }}
          />
        );
      case 'progress':
        return (
          <ProgressScreen
            currentTab="progress"
            onTabChange={navigateTab}
            streakDays={streakDays}
            totalMinutes={totalMinutes}
            recentSessions={sessions}
            onStartMeditation={() => handleStartMeditation(TODAY_VERSE)}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            currentTab="settings"
            onTabChange={navigateTab}
            preferences={preferences}
            onUpdatePreferences={updatePreferences}
            onOpenPreferences={() => setCurrentScreen('preferences')}
          />
        );
      default:
        return null;
    }
  };

  const screensList: { id: ScreenId; label: string }[] = [
    { id: 'welcome', label: '1. Welcome' },
    { id: 'preferences', label: '2. Preferences' },
    { id: 'home', label: '3. Home' },
    { id: 'player', label: '4. Player' },
    { id: 'completed', label: '5. Complete' },
    { id: 'explore', label: '6. Explore' },
    { id: 'progress', label: '7. Progress' },
    { id: 'settings', label: '8. Settings' },
  ];

  return (
    <div className="min-h-screen bg-emerald-50/40 dark:bg-[#041910] text-slate-900 dark:text-emerald-50 flex flex-col font-sans transition-colors">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#062417]/95 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-900/60 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-tight text-emerald-950 dark:text-white leading-none">
                Meditate on the Word
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] text-emerald-700/80 dark:text-emerald-300/80 font-normal">
                Daily Scripture & Peace
              </span>
            </div>
          </div>

          {/* Quick Screen Selector */}
          <div className="hidden lg:flex items-center gap-1 bg-emerald-100/60 dark:bg-emerald-950/70 p-1 rounded-xl">
            {screensList.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentScreen(s.id);
                  setViewMode('phone');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  currentScreen === s.id && viewMode === 'phone'
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'text-emerald-900/80 dark:text-emerald-200 hover:text-emerald-950 dark:hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* View Mode & Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-emerald-50 dark:bg-emerald-950/70 p-0.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80">
              <button
                onClick={() => setViewMode('phone')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'phone'
                    ? 'bg-white dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900 dark:text-emerald-300/80 dark:hover:text-white'
                }`}
                title="Interactive phone device preview"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Interactive Phone</span>
              </button>

              <button
                onClick={() => setViewMode('showcase')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'showcase'
                    ? 'bg-white dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900 dark:text-emerald-300/80 dark:hover:text-white'
                }`}
                title="View all 8 screens simultaneously in showcase mode"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Showcase Gallery</span>
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => updatePreferences({ isDarkMode: !preferences.isDarkMode })}
              aria-label="Toggle dark mode"
              className="w-8 h-8 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200/70 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              {preferences.isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile quick screen selector strip */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
          {screensList.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentScreen(s.id);
                setViewMode('phone');
              }}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                currentScreen === s.id && viewMode === 'phone'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-emerald-100/70 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-6 lg:p-8">
        {viewMode === 'showcase' ? (
          <ShowcaseGrid
            preferences={preferences}
            onUpdatePreferences={updatePreferences}
            onSelectScreenToInteract={(s) => {
              setCurrentScreen(s);
              setViewMode('phone');
            }}
            streakDays={streakDays}
          />
        ) : (
          <div className="flex flex-col items-center">
            {/* Phone Device Bezel Frame */}
            <div className="relative w-full max-w-[390px] h-[812px] bg-slate-900 rounded-[50px] p-3 shadow-2xl ring-1 ring-emerald-950/40 shadow-emerald-950/20 transition-all duration-300">
              {/* Device Speaker & Camera Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-50 pointer-events-none flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              </div>

              {/* Screen Container */}
              <div className="w-full h-full rounded-[42px] overflow-hidden bg-white dark:bg-[#071f15] relative shadow-inner">
                {renderActiveScreen()}
              </div>
            </div>

            {/* Quick helper note under the phone frame */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <button
                onClick={() => setShowSoundCatalog(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Explore 14 meditation sounds"
              >
                <Music2 className="w-3.5 h-3.5" />
                <span>Sound: {preferences.musicStyle} (14 sounds available)</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setViewMode('showcase')}
                className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
              >
                View all screens grid →
              </button>
            </div>
          </div>
        )}

        {/* Global Sound Catalog Modal */}
        {showSoundCatalog && (
          <SoundCatalogModal
            currentStyle={preferences.musicStyle}
            onSelectStyle={(s) => {
              updatePreferences({ musicStyle: s });
            }}
            onClose={() => setShowSoundCatalog(false)}
            volume={preferences.volume}
            onVolumeChange={(v) => updatePreferences({ volume: v })}
          />
        )}
      </main>
    </div>
  );
}
