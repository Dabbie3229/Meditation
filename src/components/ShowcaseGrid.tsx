import React from 'react';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { PreferencesScreen } from './screens/PreferencesScreen';
import { HomeScreen } from './screens/HomeScreen';
import { PlayerScreen } from './screens/PlayerScreen';
import { SessionCompleteScreen } from './screens/SessionCompleteScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ScreenId, UserPreferences } from '../types';
import { TODAY_VERSE } from '../data/scriptures';
import { Smartphone, Eye } from 'lucide-react';

interface ShowcaseGridProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onSelectScreenToInteract: (screenId: ScreenId) => void;
  streakDays: number;
}

export const ShowcaseGrid: React.FC<ShowcaseGridProps> = ({
  preferences,
  onUpdatePreferences,
  onSelectScreenToInteract,
  streakDays,
}) => {
  const screens: { id: ScreenId; title: string; subtitle: string }[] = [
    { id: 'welcome', title: '1. Welcome & Onboarding', subtitle: 'Sunrise cross, daily scripture hook' },
    { id: 'preferences', title: '2. Set Your Preferences', subtitle: 'Reminder time, music style, initial focus' },
    { id: 'home', title: '3. Good Evening Home', subtitle: 'Today’s verse card, duration & moods' },
    { id: 'player', title: '4. Audio Meditation Player', subtitle: 'Active audio player & reflection prompt' },
    { id: 'completed', title: '5. Session Complete', subtitle: 'Celebration, journaling & voice notes' },
    { id: 'explore', title: '6. Explore Topics', subtitle: '8 biblical categories & scriptures' },
    { id: 'progress', title: '7. Your Progress', subtitle: '12-day streak & weekly verses chart' },
    { id: 'settings', title: '8. User Settings', subtitle: 'Profile, preferences & dark mode toggle' },
  ];

  const renderScreen = (id: ScreenId) => {
    switch (id) {
      case 'welcome':
        return (
          <WelcomeScreen
            onGetStarted={() => onSelectScreenToInteract('preferences')}
            onSkip={() => onSelectScreenToInteract('home')}
          />
        );
      case 'preferences':
        return (
          <PreferencesScreen
            preferences={preferences}
            onUpdatePreferences={onUpdatePreferences}
            onContinue={() => onSelectScreenToInteract('home')}
            onBack={() => onSelectScreenToInteract('welcome')}
            onSkip={() => onSelectScreenToInteract('home')}
          />
        );
      case 'home':
        return (
          <HomeScreen
            userName={preferences.userName}
            selectedDuration={10}
            onSelectDuration={() => {}}
            selectedMood="Peace"
            onSelectMood={() => {}}
            onStartMeditation={() => onSelectScreenToInteract('player')}
            currentTab="home"
            onTabChange={(t) => onSelectScreenToInteract(t as ScreenId)}
            streakDays={streakDays}
          />
        );
      case 'player':
        return (
          <PlayerScreen
            verse={TODAY_VERSE}
            durationMinutes={10}
            mood="Peace"
            musicStyle={preferences.musicStyle}
            voiceGender={preferences.voiceGender || 'feminine'}
            voicePersona={preferences.voicePersona}
            onUpdateVoiceGender={(gender) => onUpdatePreferences({ voiceGender: gender })}
            onUpdateVoicePersona={(personaId) => onUpdatePreferences({ voicePersona: personaId })}
            onClose={() => onSelectScreenToInteract('home')}
            onComplete={() => onSelectScreenToInteract('completed')}
          />
        );
      case 'completed':
        return (
          <SessionCompleteScreen
            verse={TODAY_VERSE}
            onGoHome={() => onSelectScreenToInteract('home')}
            onViewProgress={() => onSelectScreenToInteract('progress')}
            onSaveNote={() => {}}
            onToggleFavorite={() => {}}
            isFavorite={false}
            onShare={() => {}}
          />
        );
      case 'explore':
        return (
          <ExploreScreen
            currentTab="explore"
            onTabChange={(t) => onSelectScreenToInteract(t as ScreenId)}
            onSelectVerse={() => onSelectScreenToInteract('player')}
          />
        );
      case 'progress':
        return (
          <ProgressScreen
            currentTab="progress"
            onTabChange={(t) => onSelectScreenToInteract(t as ScreenId)}
            streakDays={streakDays}
            totalMinutes={160}
            recentSessions={[]}
            onStartMeditation={() => onSelectScreenToInteract('player')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            currentTab="settings"
            onTabChange={(t) => onSelectScreenToInteract(t as ScreenId)}
            preferences={preferences}
            onUpdatePreferences={onUpdatePreferences}
            onOpenPreferences={() => onSelectScreenToInteract('preferences')}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-3">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Complete Showcase Gallery (All 8 Screens)</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
          Meditate on the Word App Experience
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Click on any screen below to enter interactive live device mode with real ambient audio, scripture meditation, and journaling.
        </p>
      </div>

      {/* Grid of All Screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {screens.map((screen) => (
          <div key={screen.id} className="flex flex-col items-center">
            {/* Screen Label */}
            <div className="w-full flex items-center justify-between mb-2.5 px-2">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {screen.title}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {screen.subtitle}
                </p>
              </div>
              <button
                onClick={() => onSelectScreenToInteract(screen.id)}
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Test this screen live"
              >
                <Eye className="w-3 h-3" />
                <span>Test</span>
              </button>
            </div>

            {/* Phone Bezel Frame */}
            <div className="group relative w-[290px] h-[590px] bg-slate-900 rounded-[44px] p-2.5 shadow-2xl ring-1 ring-slate-800/80 transition-transform duration-300 hover:-translate-y-1 hover:shadow-emerald-500/10">
              {/* Dynamic Island / Top Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-40 pointer-events-none" />

              {/* Screen Container */}
              <div className="w-full h-full rounded-[36px] overflow-hidden bg-white dark:bg-[#071f15] relative">
                {renderScreen(screen.id)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
