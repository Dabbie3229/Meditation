import React, { useState } from 'react';
import { Settings as SettingsIcon, Music, Bell, Sun, Moon, Info, Share2, Star, HelpCircle, ChevronRight, X, Heart, Mic, Sparkles, Volume2, BookOpen } from 'lucide-react';
import { TopStatusBar } from '../navigation/TopStatusBar';
import { BottomTabBar } from '../navigation/BottomTabBar';
import { MainTab, MusicStyle, UserPreferences, VoiceGender } from '../../types';
import { SoundCatalogModal } from '../modals/SoundCatalogModal';
import { VoiceStudioModal } from '../modals/VoiceStudioModal';
import { BibleTranslationPickerModal } from '../modals/BibleTranslationPickerModal';
import { getSavedBibleTranslation, getTranslationDisplayLabel, saveBibleTranslation } from '../../services/scriptureSearch';
import { narrationEngine, VOICE_PERSONAS } from '../../services/narrationEngine';
import { TODAY_VERSE } from '../../data/scriptures';

interface SettingsScreenProps {
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onOpenPreferences: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentTab,
  onTabChange,
  preferences,
  onUpdatePreferences,
  onOpenPreferences,
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [bibleTranslation, setBibleTranslation] = useState<string>(() =>
    getSavedBibleTranslation()
  );

  const toggleDarkMode = () => {
    onUpdatePreferences({ isDarkMode: !preferences.isDarkMode });
  };

  const musicStyles: MusicStyle[] = ['Piano', 'Acoustic', 'Worship', 'Ambient', 'Lofi'];

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Status Bar */}
      <TopStatusBar darkText={true} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-4 no-scrollbar">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="w-5 h-5 text-slate-800 dark:text-slate-200 stroke-[2]" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Settings
          </h1>
        </div>

        {/* User Profile Card */}
        <div
          onClick={onOpenPreferences}
          role="button"
          tabIndex={0}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between mb-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {preferences.userName.charAt(0) || 'D'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {preferences.userName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <span>Meditating for a better you</span>
                <span>🌿</span>
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Menu Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden mb-5">
          {/* Bible Translation */}
          <button
            type="button"
            onClick={() => setActiveModal('translation')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Bible Translation</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{getTranslationDisplayLabel(bibleTranslation)}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </button>

          {/* Music Style */}
          <button
            type="button"
            onClick={() => setActiveModal('music')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Music className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Music Style</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{preferences.musicStyle}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </button>

          {/* Whisper Voice Selection */}
          <button
            type="button"
            onClick={() => setActiveModal('voice')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Mic className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Whisper Voice Studio</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="capitalize">
                {narrationEngine.getActivePersona().name.split('•')[0].trim()} • {preferences.voiceGender === 'masculine' ? '🌿 Masc' : '🌸 Fem'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </button>

          {/* Reminder */}
          <button
            type="button"
            onClick={() => setActiveModal('reminder')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Bell className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Reminder</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{preferences.reminderTime}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </button>

          {/* Light / Dark Mode Toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              {preferences.isDarkMode ? (
                <Moon className="w-4 h-4 text-emerald-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>Light / Dark Mode</span>
            </div>
            {/* Toggle Switch */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer focus:outline-none ${
                preferences.isDarkMode ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  preferences.isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Secondary Info Links */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden mb-4">
          {/* About the App */}
          <button
            type="button"
            onClick={() => setActiveModal('about')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Info className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>About the App</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Share with Friends */}
          <button
            type="button"
            onClick={() => setActiveModal('share')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Share2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Share with Friends</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Rate the App */}
          <button
            type="button"
            onClick={() => setActiveModal('rate')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              <span>Rate the App</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Help & Support */}
          <button
            type="button"
            onClick={() => setActiveModal('help')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <HelpCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Help & Support</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Bible Translation Picker Modal */}
      {activeModal === 'translation' && (
        <BibleTranslationPickerModal
          currentTranslation={bibleTranslation}
          onSelect={(id) => {
            setBibleTranslation(id);
            saveBibleTranslation(id);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Sound Catalog Modal */}
      {activeModal === 'music' && (
        <SoundCatalogModal
          currentStyle={preferences.musicStyle}
          onSelectStyle={(style) => {
            onUpdatePreferences({ musicStyle: style });
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
          volume={preferences.volume}
          onVolumeChange={(v) => onUpdatePreferences({ volume: v })}
        />
      )}

      {/* Voice Selection Modal */}
      <VoiceStudioModal
        verse={TODAY_VERSE}
        isOpen={activeModal === 'voice'}
        onClose={() => setActiveModal(null)}
        voiceEnabled={preferences.voiceEnabled !== false}
        onToggleVoiceEnabled={(enabled) => onUpdatePreferences({ voiceEnabled: enabled })}
        onSelectPersona={(persona) => {
          onUpdatePreferences({
            voicePersona: persona.id,
            voiceGender: persona.gender,
          });
        }}
      />

      {/* Reminder Picker Modal */}
      {activeModal === 'reminder' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Daily Reminder Time</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '07:30 PM', '09:00 PM'].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    onUpdatePreferences({ reminderTime: t });
                    setActiveModal(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-medium text-center transition-colors cursor-pointer ${
                    preferences.reminderTime === t
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto mb-3 text-emerald-700 dark:text-emerald-300">
              <Heart className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Meditate on the Word</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Designed to help believers find moments of stillness, peace, and communion with God through His Holy Scriptures and serene ambient music.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Rating / Share / Support feedback modals */}
      {(activeModal === 'rate' || activeModal === 'share' || activeModal === 'help') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white capitalize">
              {activeModal === 'rate' ? 'Thank You!' : activeModal === 'share' ? 'Share Meditate' : 'Help & Support'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              {activeModal === 'rate'
                ? 'Your 5-star rating helps spread the peace of God’s Word to others.'
                : activeModal === 'share'
                ? 'Invite friends & family to join daily scripture meditation.'
                : 'Need prayer or guidance? Contact support@meditateword.org'}
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="mt-4 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Tab Bar */}
      <BottomTabBar currentTab={currentTab} onTabChange={onTabChange} />
    </div>
  );
};
