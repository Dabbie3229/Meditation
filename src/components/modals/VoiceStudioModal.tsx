import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Check,
  RefreshCw,
  Wand2,
  Play,
  Pause,
  Mic,
  MicOff,
} from 'lucide-react';
import { Verse, VoicePersona, VoicePersonaId, VoiceSmoothnessLevel } from '../../types';
import {
  narrationEngine,
  VOICE_PERSONAS,
  WhisperSoftnessLevel,
} from '../../services/narrationEngine';

interface VoiceStudioModalProps {
  verse: Verse;
  isOpen: boolean;
  onClose: () => void;
  onSelectPersona: (persona: VoicePersona) => void;
  voiceEnabled?: boolean;
  onToggleVoiceEnabled?: (enabled: boolean) => void;
}

export const VoiceStudioModal: React.FC<VoiceStudioModalProps> = ({
  verse,
  isOpen,
  onClose,
  onSelectPersona,
  voiceEnabled = narrationEngine.getIsVoiceEnabled(),
  onToggleVoiceEnabled,
}) => {
  const [activePersona, setActivePersona] = useState<VoicePersona>(
    narrationEngine.getActivePersona()
  );
  const [softness, setSoftness] = useState<WhisperSoftnessLevel>(
    narrationEngine.getSoftnessLevel()
  );
  const [smoothness, setSmoothness] = useState<VoiceSmoothnessLevel>(
    narrationEngine.getSmoothnessLevel()
  );
  const [whisperVol, setWhisperVol] = useState<number>(
    narrationEngine.getWhisperVolume()
  );
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(voiceEnabled);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [activeGenderTab, setActiveGenderTab] = useState<'feminine' | 'masculine'>('feminine');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleVoice = (enabled: boolean) => {
    setIsVoiceActive(enabled);
    narrationEngine.setVoiceEnabled(enabled);
    if (onToggleVoiceEnabled) onToggleVoiceEnabled(enabled);
    setSuccessMessage(
      enabled
        ? '✨ Voice narration enabled'
        : '🕊️ Voice muted — Ambient meditation only'
    );
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const handleSelectVoice = (persona: VoicePersona) => {
    setActivePersona(persona);
    narrationEngine.setActivePersona(persona.id);
    onSelectPersona(persona);
    setSuccessMessage(`Switched to ${persona.name}`);
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const handleGenerateFreshVoice = async (persona: VoicePersona) => {
    setIsGenerating(true);
    setPreviewingId(persona.id);
    setActivePersona(persona);
    narrationEngine.setActivePersona(persona.id);
    onSelectPersona(persona);

    try {
      await narrationEngine.generateVoiceForVerse(verse, persona, {
        forceRegenerate: true,
      });
      narrationEngine.recite(verse, {
        onEnd: () => setPreviewingId(null),
        forceRegenerate: false,
      });
      setSuccessMessage(`✨ Generated new voice: ${persona.name.split('•')[0].trim()}!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      narrationEngine.recite(verse, {
        onEnd: () => setPreviewingId(null),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestPreview = (e: React.MouseEvent, persona: VoicePersona) => {
    e.stopPropagation();
    if (previewingId === persona.id) {
      narrationEngine.stop();
      setPreviewingId(null);
      return;
    }
    setPreviewingId(persona.id);
    narrationEngine.setActivePersona(persona.id);
    narrationEngine.recite(verse, {
      onEnd: () => setPreviewingId(null),
    });
  };

  const handleSoftnessChange = (level: WhisperSoftnessLevel) => {
    setSoftness(level);
    narrationEngine.setSoftnessLevel(level);
    setWhisperVol(narrationEngine.getWhisperVolume());
  };

  const handleSmoothnessChange = (level: VoiceSmoothnessLevel) => {
    setSmoothness(level);
    narrationEngine.setSmoothnessLevel(level);
    setSuccessMessage(
      level === 'silky'
        ? '✨ Silky Velvet (Ultra-Smooth) filter active'
        : level === 'warm'
        ? '✨ Warm Sanctuary filter active'
        : '✨ Feather Soft filter active'
    );
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const handleWhisperVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setWhisperVol(val);
    narrationEngine.setWhisperVolume(val);
  };

  const femininePersonas = VOICE_PERSONAS.filter(
    (p) =>
      p.gender === 'feminine' &&
      ['seraphina', 'miriam', 'eden', 'hannah', 'abigail', 'selena'].includes(p.id)
  );

  const masculinePersonas = VOICE_PERSONAS.filter(
    (p) =>
      p.gender === 'masculine' &&
      ['elijah', 'gabriel', 'david', 'solomon', 'samuel', 'malachi'].includes(p.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950/70 via-emerald-900/50 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 leading-tight">
                Scripture Voice & Whisper Studio
              </h3>
              <p className="text-xs text-emerald-200/80">
                12 soothing voices or pure ambient soundscape
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success toast if triggered */}
        {successMessage && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-5 py-2 text-xs text-emerald-300 flex items-center gap-2 font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* PRIMARY OPTION: Voice ON/OFF (Take Voice Out Completely) */}
          <div className="bg-gradient-to-r from-emerald-950/70 to-slate-800/80 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isVoiceActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white/10 text-white/50'
                }`}
              >
                {isVoiceActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Spoken Whisper Recitation
                </h4>
                <p className="text-xs text-white/70">
                  {isVoiceActive
                    ? 'Voice is active — Whispering scripture every 30s'
                    : 'Voice is OFF — Pure soothing ambient music & quiet meditation'}
                </p>
              </div>
            </div>

            {/* Toggle switch button */}
            <button
              type="button"
              onClick={() => handleToggleVoice(!isVoiceActive)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                isVoiceActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-white/15 hover:bg-white/25 text-white/90 border border-white/20'
              }`}
            >
              {isVoiceActive ? 'Voice: ON' : 'Turn Voice OFF'}
            </button>
          </div>

          {/* Active Verse Banner */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                Now Meditating On
              </span>
              <p className="text-sm font-serif italic text-white/95 truncate">
                "{verse.quote}"
              </p>
              <p className="text-xs text-white/60">{verse.reference}</p>
            </div>
            <button
              onClick={() => handleGenerateFreshVoice(activePersona)}
              disabled={isGenerating || !isVoiceActive}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-xs font-semibold text-white shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate Take</span>
                </>
              )}
            </button>
          </div>

          {/* Granular Whisper Softness & Volume Controls (if voice is enabled) */}
          {isVoiceActive && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/80 font-semibold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Whisper Volume</span>
                </span>
                <span className="text-emerald-300 font-mono text-[11px]">
                  {Math.round(whisperVol * 100)}% •{' '}
                  {whisperVol <= 0.2 ? 'Ultra-Soft' : whisperVol <= 0.35 ? 'Mild' : 'Clear'}
                </span>
              </div>

              {/* Volume Slider */}
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.01"
                value={whisperVol}
                onChange={handleWhisperVolChange}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
              />

              {/* 3 Softness presets */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  {
                    id: 'feather',
                    label: 'Feather Soft',
                    sub: 'Ultra-mild & breathless',
                  },
                  {
                    id: 'mild',
                    label: 'Mild Whisper',
                    sub: 'Balanced calm stillness',
                  },
                  {
                    id: 'gentle',
                    label: 'Gentle Voice',
                    sub: 'Softly audible prayer',
                  },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleSoftnessChange(lvl.id as WhisperSoftnessLevel)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      softness === lvl.id
                        ? 'bg-emerald-600/35 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/50'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <p className="text-xs font-bold leading-none mb-1 text-white">{lvl.label}</p>
                    <p className="text-[10px] text-white/60 leading-tight">{lvl.sub}</p>
                  </button>
                ))}
              </div>

              {/* Voice Smoothness & Sibilance De-Esser Controls */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white/80 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Voice Smoothness & De-Esser</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-medium">
                    {smoothness === 'silky' ? 'Silky Velvet (Ultra-Smooth)' : smoothness === 'warm' ? 'Warm Sanctuary' : 'Feather Breath'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    {
                      id: 'silky',
                      title: 'Silky Velvet',
                      desc: 'Maximum smoothing & zero harshness',
                    },
                    {
                      id: 'warm',
                      title: 'Warm Sanctuary',
                      desc: 'Deep chest resonance & warmth',
                    },
                    {
                      id: 'soft',
                      title: 'Feather Breath',
                      desc: 'Ultra-lowpass delicate whisper',
                    },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSmoothnessChange(s.id as VoiceSmoothnessLevel)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        smoothness === s.id
                          ? 'bg-amber-400/20 border-amber-300 text-white ring-1 ring-amber-400/40'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <p className="text-[11px] font-bold text-white">{s.title}</p>
                      <p className="text-[9px] text-white/60 leading-tight">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Voice Gender Switcher Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 p-1 bg-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveGenderTab('feminine')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeGenderTab === 'feminine'
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>🌸</span>
                  <span>Feminine Voices (6)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGenderTab('masculine')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeGenderTab === 'masculine'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>🌿</span>
                  <span>Masculine Voices (6)</span>
                </button>
              </div>

              <span className="text-[11px] text-emerald-300 font-medium">
                {activeGenderTab === 'feminine' ? '6 Gentle Voices' : '6 Grounded Voices'}
              </span>
            </div>

            {/* Voice Cards Grid */}
            <div className="grid grid-cols-1 gap-2.5">
              {(activeGenderTab === 'feminine' ? femininePersonas : masculinePersonas).map(
                (persona) => {
                  const isSelected = activePersona.id === persona.id;
                  const isThisPreviewing = previewingId === persona.id;

                  return (
                    <div
                      key={persona.id}
                      onClick={() => handleSelectVoice(persona)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-600/25 via-teal-600/20 to-slate-800/90 border-emerald-400 ring-1 ring-emerald-400/40 shadow-md'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white/10 text-white/70'
                          }`}
                        >
                          {persona.gender === 'feminine' ? '🌸' : '🌿'}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white truncate">
                              {persona.name}
                            </span>
                            {persona.badge && (
                              <span
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 bg-emerald-500/30 text-emerald-200 border-emerald-500/40"
                              >
                                {persona.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-white/60 line-clamp-1">
                            {persona.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Preview Audio Button */}
                        <button
                          type="button"
                          onClick={(e) => handleTestPreview(e, persona)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isThisPreviewing
                              ? 'bg-amber-400 text-slate-950 animate-pulse'
                              : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                          }`}
                          title={isThisPreviewing ? 'Stop preview' : 'Listen preview'}
                        >
                          {isThisPreviewing ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>

                        {/* Selected Indicator */}
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-xs text-white/40 font-medium">Select</span>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-slate-950/80 flex items-center justify-between">
          <p className="text-[11px] text-white/60">
            Selected: <span className="font-semibold text-white">{activePersona.name}</span>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
