import React, { useState, useEffect } from 'react';
import {
  X,
  Music,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Lightbulb,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  Sliders,
  Check,
  Upload,
  Youtube,
} from 'lucide-react';
import { TopStatusBar } from '../navigation/TopStatusBar';
import { MoodType, MusicStyle, Verse, VoiceGender, VoicePersona, VoicePersonaId, VoiceSmoothnessLevel } from '../../types';
import { audioEngine } from '../../services/audioEngine';
import { narrationEngine, VOICE_PERSONAS, WhisperSoftnessLevel } from '../../services/narrationEngine';
import { SoundCatalogModal } from '../modals/SoundCatalogModal';
import { VoiceStudioModal } from '../modals/VoiceStudioModal';

interface PlayerScreenProps {
  verse: Verse;
  durationMinutes: number;
  mood: MoodType;
  musicStyle: MusicStyle;
  voiceGender?: VoiceGender;
  voicePersona?: VoicePersonaId;
  onUpdateVoiceGender?: (gender: VoiceGender) => void;
  onUpdateVoicePersona?: (personaId: VoicePersonaId) => void;
  onClose: () => void;
  onComplete: (elapsedSeconds: number) => void;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({
  verse,
  durationMinutes = 10,
  mood = 'Peace',
  musicStyle = 'Piano',
  voiceGender = 'feminine',
  voicePersona,
  onUpdateVoiceGender,
  onUpdateVoicePersona,
  onClose,
  onComplete,
}) => {
  const totalSeconds = durationMinutes * 60;
  const [elapsedSeconds, setElapsedSeconds] = useState(134); // starts around 2:14 matching screenshot
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.32); // Gentle, calm default volume
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [showVoiceStudio, setShowVoiceStudio] = useState(false);
  const [activeMusicStyle, setActiveMusicStyle] = useState<MusicStyle>(musicStyle);

  // Scripture Voice Recitation State
  const [isReciting, setIsReciting] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // Can be toggled OFF completely
  const [whisperVolume, setWhisperVolume] = useState<number>(narrationEngine.getWhisperVolume());
  const [repeatInterval, setRepeatInterval] = useState(30); // seconds between whispers
  const [whisperSoftness, setWhisperSoftness] = useState<WhisperSoftnessLevel>('feather');
  const [voiceSmoothness, setVoiceSmoothness] = useState<VoiceSmoothnessLevel>(
    narrationEngine.getSmoothnessLevel()
  );
  const [showQuickSettings, setShowQuickSettings] = useState(false);

  const [activePersona, setActivePersona] = useState<VoicePersona>(() => {
    if (voicePersona) {
      const found = VOICE_PERSONAS.find((p) => p.id === voicePersona);
      if (found) return found;
    }
    return narrationEngine.getActivePersona();
  });
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<VoiceGender>(
    voiceGender || narrationEngine.getVoiceGender() || 'feminine'
  );

  // Pre-generate & cache voice on mount for seamless zero-latency recitation
  useEffect(() => {
    if (voiceEnabled) {
      narrationEngine.generateVoiceForVerse(verse, activePersona).catch(() => {});
    }
  }, [verse, activePersona, voiceEnabled]);

  const handleSelectPersona = (persona: VoicePersona) => {
    setActivePersona(persona);
    setSelectedVoiceGender(persona.gender);
    narrationEngine.setActivePersona(persona.id);
    if (onUpdateVoicePersona) onUpdateVoicePersona(persona.id);
    if (onUpdateVoiceGender) onUpdateVoiceGender(persona.gender);
    if (voiceEnabled) {
      narrationEngine.recite(verse);
    }
    setVoiceFeedback(`Switched to ${persona.name.split('•')[0].trim()}`);
    setTimeout(() => setVoiceFeedback(null), 2500);
  };

  const handleQuickGenerateNewVoice = async (targetPersona?: VoicePersona) => {
    const persona = targetPersona || activePersona;
    setIsGeneratingVoice(true);
    try {
      await narrationEngine.generateVoiceForVerse(verse, persona, { forceRegenerate: true });
      setActivePersona(persona);
      setSelectedVoiceGender(persona.gender);
      narrationEngine.setActivePersona(persona.id);
      if (onUpdateVoicePersona) onUpdateVoicePersona(persona.id);
      if (onUpdateVoiceGender) onUpdateVoiceGender(persona.gender);
      if (voiceEnabled) {
        narrationEngine.recite(verse, { forceRegenerate: false });
      }
      setVoiceFeedback(`✨ Generated new take: ${persona.name.split('•')[0].trim()}!`);
      setTimeout(() => setVoiceFeedback(null), 3000);
    } catch (err) {
      console.warn('Voice generation failed:', err);
      if (voiceEnabled) {
        narrationEngine.recite(verse);
      }
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const handleSetVoiceGender = (gender: VoiceGender) => {
    setSelectedVoiceGender(gender);
    narrationEngine.setVoiceGender(gender);
    const updated = narrationEngine.getActivePersona();
    setActivePersona(updated);
    if (onUpdateVoiceGender) onUpdateVoiceGender(gender);
    if (onUpdateVoicePersona) onUpdateVoicePersona(updated.id);
    if (voiceEnabled) {
      narrationEngine.recite(verse);
    }
  };

  const handleSetSoftness = (level: WhisperSoftnessLevel) => {
    setWhisperSoftness(level);
    narrationEngine.setSoftnessLevel(level);
    setWhisperVolume(narrationEngine.getWhisperVolume());
    if (voiceEnabled) {
      narrationEngine.recite(verse);
    }
  };

  const handleSetSmoothness = (level: VoiceSmoothnessLevel) => {
    setVoiceSmoothness(level);
    narrationEngine.setSmoothnessLevel(level);
    setVoiceFeedback(
      level === 'silky'
        ? '✨ Silky Velvet (Ultra-Smooth)'
        : level === 'warm'
        ? '✨ Warm Sanctuary'
        : '✨ Feather Breath'
    );
    setTimeout(() => setVoiceFeedback(null), 2500);
  };

  const handleWhisperVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setWhisperVolume(val);
    narrationEngine.setWhisperVolume(val);
  };

  // Listen to narration speaking state
  useEffect(() => {
    narrationEngine.setSpeakingCallback((speaking) => {
      setIsReciting(speaking);
    });
  }, []);

  // Sync Audio & Repeating Voice playback with player state
  useEffect(() => {
    if (isPlaying) {
      audioEngine.start(activeMusicStyle);
      audioEngine.setVolume(volume);
      if (voiceEnabled) {
        // Start repeating gentle whisper loop after ambient tone establishes
        const timer = window.setTimeout(() => {
          narrationEngine.startRepeating(verse, repeatInterval);
        }, 1200);
        return () => {
          window.clearTimeout(timer);
          audioEngine.stop();
          narrationEngine.stop();
        };
      } else {
        narrationEngine.stop();
      }
    } else {
      audioEngine.stop();
      narrationEngine.stop();
    }
    return () => {
      audioEngine.stop();
      narrationEngine.stop();
    };
  }, [isPlaying, activeMusicStyle, volume, voiceEnabled, verse, repeatInterval]);

  // Toggle voice completely ON or OFF
  const handleToggleVoiceEnabled = (enabled: boolean) => {
    setVoiceEnabled(enabled);
    narrationEngine.setVoiceEnabled(enabled);
    if (!enabled) {
      narrationEngine.stop();
      setVoiceFeedback('🕊️ Ambient Music Only — Voice Turned Off');
    } else {
      setVoiceFeedback(`✨ Voice Active: ${activePersona.name.split('•')[0].trim()}`);
      if (isPlaying) {
        narrationEngine.startRepeating(verse, repeatInterval);
      }
    }
    setTimeout(() => setVoiceFeedback(null), 3000);
  };

  const handleManualRecite = () => {
    if (!voiceEnabled) {
      handleToggleVoiceEnabled(true);
      return;
    }
    if (isPlaying) {
      narrationEngine.startRepeating(verse, repeatInterval);
    } else {
      narrationEngine.recite(verse);
    }
  };

  const handleChangeInterval = (secs: number) => {
    setRepeatInterval(secs);
    narrationEngine.setRepeatInterval(secs);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRewind15 = () => {
    setElapsedSeconds((prev) => Math.max(0, prev - 15));
  };

  const handleForward15 = () => {
    setElapsedSeconds((prev) => {
      const next = prev + 15;
      if (next >= totalSeconds) {
        onComplete(totalSeconds);
        return totalSeconds;
      }
      return next;
    });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetVal = Number(e.target.value);
    setElapsedSeconds(targetVal);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, (elapsedSeconds / totalSeconds) * 100);

  // Quick background sound presets featuring real acoustic piano recordings
  const soothingSoundPresets: { id: MusicStyle; label: string; icon: string }[] = [
    { id: 'Gymnopedie No. 1', label: 'Gymnopédie No. 1', icon: '🎹' },
    { id: 'Clair de Lune', label: 'Clair de Lune', icon: '🌙' },
    { id: 'Chopin Nocturne Op. 9 No. 2', label: 'Chopin Nocturne', icon: '✨' },
    { id: 'Moonlight Sonata', label: 'Moonlight Adagio', icon: '🕯️' },
    { id: 'Gnossienne No. 1', label: 'Gnossienne No. 1', icon: '🕊️' },
    { id: 'Chopin Nocturne in C# Minor', label: 'C# Minor Nocturne', icon: '⛪' },
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none">
      {/* Background Image with atmospheric glow */}
      <div className="absolute inset-0 z-0">
        <img
          src={
            verse.themeImageUrl ||
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
          }
          alt="Serene landscape"
          className="w-full h-full object-cover opacity-60 scale-105 filter blur-[0.6px] transition-transform duration-1000"
        />
        {/* Soft vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/90" />
      </div>

      {/* Top Status Bar */}
      <TopStatusBar darkText={false} />

      {/* Header controls */}
      <div className="relative z-20 flex items-center justify-between px-5 py-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close meditation"
          className="w-9 h-9 rounded-full bg-black/35 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:text-white hover:bg-black/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Central Pill Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-white/95 shadow-sm">
          <span>🕊️</span>
          <span>
            {durationMinutes} min • {mood}
          </span>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Voice Studio Button */}
          <button
            onClick={() => setShowVoiceStudio(true)}
            aria-label="Voice Studio"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-600/85 hover:bg-emerald-500 backdrop-blur-md border border-emerald-400 text-xs text-white shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Open Scripture Voice Studio (12 Voices & Softness Controls)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-semibold text-[11px] hidden sm:inline">Voice Studio</span>
          </button>

          {/* Background Sound Selector */}
          <button
            onClick={() => setShowStyleMenu(true)}
            aria-label="Sound & Music Catalog"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-xs text-white/95 transition-all active:scale-95 cursor-pointer"
            title="Browse all 14 soothing meditation sounds"
          >
            <Music className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-[11px] max-w-[70px] truncate">
              {activeMusicStyle}
            </span>
          </button>
        </div>
      </div>

      {/* Sound Catalog Modal */}
      {showStyleMenu && (
        <SoundCatalogModal
          currentStyle={activeMusicStyle}
          onSelectStyle={(s) => setActiveMusicStyle(s)}
          onClose={() => setShowStyleMenu(false)}
          volume={volume}
          onVolumeChange={(v) => setVolume(v)}
        />
      )}

      {/* Center Scripture Display & Recitation Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center my-auto">
        <blockquote
          className={`font-serif text-[27px] sm:text-[33px] leading-snug font-normal text-white drop-shadow-md max-w-md tracking-tight transition-all duration-700 ${
            isReciting
              ? 'text-amber-100 scale-102 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)] animate-pulse'
              : 'opacity-95'
          }`}
        >
          “{verse.quote.replace(/[“”"]/g, '')}”
        </blockquote>

        {/* Feedback Toast if voice newly generated or switched */}
        {voiceFeedback && (
          <div className="mt-3 px-3.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-xs font-medium flex items-center gap-1.5 shadow-lg animate-in fade-in slide-in-from-top-1 duration-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{voiceFeedback}</span>
          </div>
        )}

        {/* DUAL MODE SELECTOR: Music Only (No Voice) vs Guided Whisper */}
        <div className="mt-4 flex items-center p-1 bg-black/50 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
          <button
            type="button"
            onClick={() => handleToggleVoiceEnabled(false)}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              !voiceEnabled
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <span>🕊️</span>
            <span>Music Only (No Voice)</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleVoiceEnabled(true)}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              voiceEnabled
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Soft Whisper Voice</span>
          </button>
        </div>

        {/* Dynamic Status / Recite Banner */}
        <div className="mt-3 flex flex-col items-center gap-2 w-full max-w-md">
          {voiceEnabled ? (
            <button
              onClick={handleManualRecite}
              className={`px-4 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer active:scale-95 shadow-md ${
                isReciting
                  ? 'bg-amber-400/25 border-amber-300 text-amber-200 ring-2 ring-amber-400/40'
                  : 'bg-white/15 hover:bg-white/25 border-white/25 text-white/95'
              }`}
              title="Whispers softly every interval • Tap to recite now"
            >
              {isReciting ? (
                <>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-amber-300 rounded-full animate-pulse" />
                    <span className="w-1.5 h-4 bg-amber-300 rounded-full animate-pulse [animation-delay:0.15s]" />
                    <span className="w-1.5 h-3 bg-amber-300 rounded-full animate-pulse [animation-delay:0.3s]" />
                  </div>
                  <span className="tracking-wide">
                    Whispering softly • {activePersona.name.split('•')[0].trim()}...
                  </span>
                </>
              ) : (
                <>
                  <span className="text-amber-300">🍃</span>
                  <span>
                    {activePersona.name.split('•')[0].trim()} ({whisperSoftness} soft) • Tap to whisper
                  </span>
                </>
              )}
            </button>
          ) : (
            <div className="px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/80 font-medium flex items-center gap-1.5">
              <span>🕊️</span>
              <span>Playing {activeMusicStyle} • Rest quietly in God's presence</span>
            </div>
          )}

          {/* Quick Controls Card (When Voice is Enabled) */}
          {voiceEnabled && (
            <div className="w-full bg-black/45 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 shadow-xl space-y-2 mt-1">
              {/* Row 1: Active Voice + Generate New Voice Action */}
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2 overflow-hidden text-left">
                  <span className="text-base">
                    {activePersona.gender === 'feminine' ? '🌸' : '🌿'}
                  </span>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate">
                        {activePersona.name.split('•')[0].trim()}
                      </span>
                      {activePersona.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-emerald-500/40 text-emerald-100 border border-emerald-400/40">
                          {activePersona.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/60 truncate">{activePersona.tone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Quick Settings expander */}
                  <button
                    type="button"
                    onClick={() => setShowQuickSettings(!showQuickSettings)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                      showQuickSettings
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-white/10 hover:bg-white/20 border-white/15 text-white/70'
                    }`}
                    title="Whisper volume & softness settings"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>

                  {/* Generate New Take Button */}
                  <button
                    type="button"
                    onClick={() => handleQuickGenerateNewVoice()}
                    disabled={isGeneratingVoice}
                    className="px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                    title="Generate a brand-new take for this verse"
                  >
                    {isGeneratingVoice ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px]">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span className="text-[10px]">New Voice</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Whisper Volume & Fine Tuning */}
              {showQuickSettings && (
                <div className="pt-2 border-t border-white/10 space-y-2 text-left animate-in fade-in duration-150">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/70 flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-emerald-300" />
                      <span>Whisper Volume:</span>
                    </span>
                    <span className="text-emerald-300 font-mono">
                      {Math.round(whisperVolume * 100)}% (Ultra-Soft)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.60"
                    step="0.01"
                    value={whisperVolume}
                    onChange={handleWhisperVolChange}
                    className="w-full accent-emerald-500 cursor-pointer h-1 bg-white/20 rounded-lg appearance-none"
                  />

                  {/* Softness levels */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    <span className="text-[10px] text-white/60">Softness:</span>
                    <div className="flex items-center gap-1">
                      {[
                        { id: 'feather', label: 'Feather Soft' },
                        { id: 'mild', label: 'Mild' },
                        { id: 'gentle', label: 'Clear' },
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => handleSetSoftness(lvl.id as WhisperSoftnessLevel)}
                          className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                            whisperSoftness === lvl.id
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'bg-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smoothness levels (Silky Velvet / Warm / Soft) */}
                  <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-white/10">
                    <span className="text-[10px] text-white/60 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                      <span>Smoothness:</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {[
                        { id: 'silky', label: 'Silky Velvet' },
                        { id: 'warm', label: 'Warm' },
                        { id: 'soft', label: 'Soft' },
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => handleSetSmoothness(lvl.id as VoiceSmoothnessLevel)}
                          className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                            voiceSmoothness === lvl.id
                              ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                              : 'bg-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Persona Chips (Direct 1-tap switcher featuring new voices) */}
              <div className="flex items-center gap-1.5 w-full overflow-x-auto no-scrollbar py-0.5">
                {[
                  { id: 'seraphina', label: 'Sanctuary', icon: '🕊️' },
                  { id: 'miriam', label: 'Feather', icon: '🍃' },
                  { id: 'eden', label: 'Breeze', icon: '🌸' },
                  { id: 'hannah', label: 'Prayer', icon: '✨' },
                  { id: 'elijah', label: 'Shepherd', icon: '🌿' },
                  { id: 'gabriel', label: 'Cinematic', icon: '🌌' },
                  { id: 'samuel', label: 'Still Voice', icon: '🕯️' },
                  { id: 'david', label: 'Friend', icon: '☀️' },
                ].map((item) => {
                  const persona = VOICE_PERSONAS.find((p) => p.id === item.id);
                  if (!persona) return null;
                  const isSelected = activePersona.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectPersona(persona)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-white text-slate-950 font-bold shadow-sm'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setShowVoiceStudio(true)}
                  className="px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-400/30 transition-all cursor-pointer whitespace-nowrap"
                  title="View all 12 voices in Studio"
                >
                  All 12...
                </button>
              </div>
            </div>
          )}

          {/* Quick Soothing Background Sounds Bar */}
          <div className="flex items-center gap-1.5 w-full overflow-x-auto no-scrollbar pt-1">
            <span className="text-[9px] uppercase tracking-wider text-white/50 shrink-0 mr-0.5">
              Tone:
            </span>
            {soothingSoundPresets.map((preset) => {
              const isCurrent = activeMusicStyle === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setActiveMusicStyle(preset.id);
                    audioEngine.start(preset.id);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? 'bg-emerald-600/90 text-white font-bold border border-emerald-400/50 shadow-sm'
                      : 'bg-black/35 hover:bg-black/50 text-white/70 border border-white/10'
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setShowStyleMenu(true)}
              className="px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-400/30 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
              title="Upload custom MP3 sounds or view YouTube guide"
            >
              <Upload className="w-2.5 h-2.5" />
              <span>+ Upload / YouTube...</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audio Controls Area */}
      <div className="relative z-10 px-6 pb-2">
        {/* Playback action buttons */}
        <div className="flex items-center justify-center gap-8 mb-3">
          {/* Rewind 15s */}
          <button
            onClick={handleRewind15}
            className="flex flex-col items-center text-white/80 hover:text-white transition-transform active:scale-90 cursor-pointer"
            title="Rewind 15 seconds"
          >
            <div className="relative flex items-center justify-center">
              <RotateCcw className="w-7 h-7 stroke-[1.8]" />
              <span className="absolute text-[8px] font-bold">15</span>
            </div>
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl transition-all active:scale-95 cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white stroke-none" />
            ) : (
              <Play className="w-7 h-7 fill-white stroke-none ml-1" />
            )}
          </button>

          {/* Forward 15s */}
          <button
            onClick={handleForward15}
            className="flex flex-col items-center text-white/80 hover:text-white transition-transform active:scale-90 cursor-pointer"
            title="Forward 15 seconds"
          >
            <div className="relative flex items-center justify-center">
              <RotateCw className="w-7 h-7 stroke-[1.8]" />
              <span className="absolute text-[8px] font-bold">15</span>
            </div>
          </button>
        </div>

        {/* Scrubber Bar */}
        <div className="space-y-1.5 mb-4 max-w-sm mx-auto">
          <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute top-0 bottom-0 left-0 bg-white rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={totalSeconds}
            value={elapsedSeconds}
            onChange={handleSeek}
            className="w-full absolute opacity-0 cursor-pointer h-4 -mt-3"
            aria-label="Progress scrubber"
          />

          <div className="flex justify-between items-center text-[11px] font-mono tabular-nums text-white/70 px-0.5">
            <span>{formatTime(elapsedSeconds)}</span>
            <span>{formatTime(totalSeconds)}</span>
          </div>
        </div>

        {/* Reflection Card (Bottom) */}
        <div className="relative rounded-2xl bg-white/10 dark:bg-black/35 backdrop-blur-md border border-white/15 p-3.5 text-left shadow-lg mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
              <Lightbulb className="w-3.5 h-3.5 fill-amber-300 stroke-none" />
              <span>Reflection</span>
            </div>

            {/* Quick Finish Button */}
            <button
              onClick={() => onComplete(elapsedSeconds)}
              className="text-[10px] font-medium text-emerald-200 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              Finish Session →
            </button>
          </div>

          <ul className="text-xs text-white/90 space-y-1 leading-relaxed font-light">
            {verse.reflectionPrompts.slice(0, 2).map((prompt, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-300 text-[10px] mt-0.5">◆</span>
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Voice Studio Modal */}
      <VoiceStudioModal
        verse={verse}
        isOpen={showVoiceStudio}
        onClose={() => setShowVoiceStudio(false)}
        onSelectPersona={handleSelectPersona}
        voiceEnabled={voiceEnabled}
        onToggleVoiceEnabled={handleToggleVoiceEnabled}
      />
    </div>
  );
};
