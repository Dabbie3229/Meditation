/**
 * Studio-Grade Meditative Scripture Narration & Whisper Engine.
 * Features:
 * 1. 12 distinct soothing voice personas (6 Feminine & 6 Masculine) powered by Gemini TTS.
 * 2. Ultra-soft feather-whisper acoustic calibration (gentle lowpass smoothing, zero harsh consonants).
 * 3. Warm room bloom reverb/delay (subtle, peaceful presence instead of loud echo).
 * 4. Granular whisper volume and softness controls (Feather Soft, Mild, Gentle).
 * 5. Full "Voice Off / Music Only" support for pure ambient meditation.
 */
import { Verse, VoiceGender, VoicePersona, VoicePersonaId, VoiceSmoothnessLevel } from '../types';

export type WhisperSoftnessLevel = 'feather' | 'mild' | 'gentle';

export const VOICE_PERSONAS: VoicePersona[] = [
  // --- FEMININE VOICES ---
  {
    id: 'seraphina',
    name: 'Seraphina • Sacred Sanctuary',
    gender: 'feminine',
    voiceName: 'Aoede',
    tone: 'Warm, compassionate sanctuary presence',
    description: 'A warm, soothing feminine voice that feels like a sacred sanctuary, peaceful and grounding.',
    badge: 'Sanctuary',
    previewPrompt: 'Be still and know that I am God.',
    stylePrompt: 'A warm, deeply comforting sanctuary voice spoken slowly with serene breath, sacred warmth, and holy stillness',
  },
  {
    id: 'miriam',
    name: 'Miriam • Feather Whisper',
    gender: 'feminine',
    voiceName: 'Kore',
    tone: 'Ultra-soft, slow, tranquil whisper',
    description: 'The gentlest feather-light whisper for resting deeply in God’s quiet presence.',
    badge: 'Feather Soft',
    previewPrompt: 'Peace I leave with you; my peace I give to you.',
    stylePrompt: 'A barely audible, extremely gentle, feather-soft feminine sacred whisper, peaceful stillness, slow breath',
  },
  {
    id: 'eden',
    name: 'Eden • Celestial Breeze',
    gender: 'feminine',
    voiceName: 'Zephyr',
    tone: 'Floating, airy peace, quiet stillness',
    description: 'Soft, airy and tranquil, drifting like a gentle breath of morning wind.',
    badge: 'Airy Breeze',
    previewPrompt: 'In quietness and trust is your strength.',
    stylePrompt: 'A gentle, slow, breathy ethereal whisper floating quietly in meditation',
  },
  {
    id: 'hannah',
    name: 'Hannah • Tender Prayer',
    gender: 'feminine',
    voiceName: 'Aoede',
    tone: 'Quiet, reverent, humble prayer of faith',
    description: 'A deeply sincere, intimate and heartfelt whispered prayer.',
    badge: 'Tender Prayer',
    previewPrompt: 'My heart rejoices in the Lord; my strength is exalted in God.',
    stylePrompt: 'A tender, deeply humble and quiet prayerful whisper spoken with reverence and peace',
  },
  {
    id: 'abigail',
    name: 'Abigail • Gentle Grace',
    gender: 'feminine',
    voiceName: 'Kore',
    tone: 'Calming, reassuring, peaceful consolation',
    description: 'A soft, reassuring voice that calms restless thoughts and brings consolation.',
    badge: 'Gentle Grace',
    previewPrompt: 'The Lord is close to the brokenhearted and saves those crushed in spirit.',
    stylePrompt: 'A soothing, tenderly reassuring whisper that calms anxiety and brings deep peace',
  },
  {
    id: 'selena',
    name: 'Selena • Pure Stillness',
    gender: 'feminine',
    voiceName: 'Zephyr',
    tone: 'Slow, relaxing, restorative bedtime cadence',
    description: 'A slow, serene bedtime whisper designed for total physical and mental relaxation.',
    badge: 'Deep Rest',
    previewPrompt: 'I will lie down and sleep in peace, for you alone make me dwell in safety.',
    stylePrompt: 'A very slow, relaxing, deeply restful whisper for holy sleep and peaceful meditation',
  },

  // --- MASCULINE VOICES ---
  {
    id: 'elijah',
    name: 'Elijah • Gentle Shepherd',
    gender: 'masculine',
    voiceName: 'Charon',
    tone: 'Comforting, grounded, peaceful baritone',
    description: 'A comforting masculine voice reciting scripture with quiet fatherly reassurance and calm.',
    badge: 'Shepherd',
    previewPrompt: 'The Lord is my shepherd, I shall not want.',
    stylePrompt: 'A comforting, deep, warm baritone spoken softly with quiet reassurance and peaceful stillness',
  },
  {
    id: 'gabriel',
    name: 'Gabriel • Cinematic Holy Echo',
    gender: 'masculine',
    voiceName: 'Fenrir',
    tone: 'Deep, resonant, subtle reverent echo',
    description: 'Movie-like deep masculine presence echoing gently across quiet eternity.',
    badge: 'Cinematic',
    previewPrompt: 'Be still and know that I am God.',
    stylePrompt: 'A slow, deep, subtle sacred masculine whisper, echoing gently in quiet reverence',
  },
  {
    id: 'david',
    name: 'David • Contemplative Heart',
    gender: 'masculine',
    voiceName: 'Puck',
    tone: 'Warm, sincere, contemplative friend',
    description: 'An intimate, authentic voice like meditating with a trusted friend in faith.',
    badge: 'Warm Friend',
    previewPrompt: 'The Lord bless you and keep you; the Lord make his face shine upon you.',
    stylePrompt: 'A slow, gentle, comforting masculine whisper reciting scripture with peaceful heart',
  },
  {
    id: 'solomon',
    name: 'Solomon • Ancient Wisdom',
    gender: 'masculine',
    voiceName: 'Charon',
    tone: 'Deep, quiet, contemplative sacred presence',
    description: 'A quiet, reflective voice conveying timeless biblical peace and steadfast faith.',
    badge: 'Ancient Calm',
    previewPrompt: 'Trust in the Lord with all your heart and lean not on your own understanding.',
    stylePrompt: 'A very quiet, slow, deep contemplative whisper reflecting ancient biblical peace',
  },
  {
    id: 'samuel',
    name: 'Samuel • Still Small Voice',
    gender: 'masculine',
    voiceName: 'Puck',
    tone: 'Ultra-gentle, delicate, sacred whisper',
    description: 'Reminiscent of 1 Kings 19:12—a still, small voice whispering God’s promises.',
    badge: 'Still Voice',
    previewPrompt: 'Speak, Lord, for your servant is listening.',
    stylePrompt: 'An ultra-gentle, still small voice whisper, spoken softly and tenderly with sacred calm',
  },
  {
    id: 'malachi',
    name: 'Malachi • Evening Vesper',
    gender: 'masculine',
    voiceName: 'Fenrir',
    tone: 'Low, mellow, peaceful dusk reflection',
    description: 'A mellow, low-pitched dusk voice that settles the spirit at the end of the day.',
    badge: 'Evening Calm',
    previewPrompt: 'The sun of righteousness shall rise with healing in its wings.',
    stylePrompt: 'A low, mellow, calming masculine evening whisper, slow cadence and holy stillness',
  },

  // Legacy aliases for backward compatibility
  {
    id: 'kore',
    name: 'Kore • Serene Angelic Whisper',
    gender: 'feminine',
    voiceName: 'Kore',
    tone: 'Angelic, gentle, breathy whisper',
    description: 'Delicate feminine whisper filled with holy peace and serenity.',
    previewPrompt: 'Be still and know that I am God.',
  },
  {
    id: 'fenrir',
    name: 'Fenrir • Deep Cinematic Echo',
    gender: 'masculine',
    voiceName: 'Fenrir',
    tone: 'Deep, resonant, echoing reverent whisper',
    description: 'Cinematic masculine whisper echoing in stillness.',
    previewPrompt: 'Be still and know that I am God.',
  },
  {
    id: 'aoede',
    name: 'Aoede • Celestial Holy Whisper',
    gender: 'feminine',
    voiceName: 'Aoede',
    tone: 'Melodic, tranquil sacred whisper',
    description: 'Soft musical undertone, like a calm prayer.',
    previewPrompt: 'The Lord is my shepherd, I shall not want.',
  },
  {
    id: 'charon',
    name: 'Charon • Ancient Sacred Stillness',
    gender: 'masculine',
    voiceName: 'Charon',
    tone: 'Grounded, peaceful, holy calm',
    description: 'Reverent voice conveying ancient stillness.',
    previewPrompt: 'Peace I leave with you.',
  },
  {
    id: 'zephyr',
    name: 'Zephyr • Ethereal Soft Breeze',
    gender: 'feminine',
    voiceName: 'Zephyr',
    tone: 'Floating, quiet stillness',
    description: 'Feather-light whispered breeze.',
    previewPrompt: 'In quietness and trust is your strength.',
  },
  {
    id: 'puck',
    name: 'Puck • Warm Contemplative Friend',
    gender: 'masculine',
    voiceName: 'Puck',
    tone: 'Gentle, comforting friend',
    description: 'Warm, sincere whisper.',
    previewPrompt: 'The Lord bless you and keep you.',
  },
];

class ScriptureNarrationEngine {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;
  private isVoiceEnabled: boolean = true;
  private isCurrentlySpeaking: boolean = false;
  private isGeneratingVoice: boolean = false;
  private repeatTimerId: number | null = null;
  private currentVerse: Verse | null = null;
  private repeatIntervalSeconds: number = 30; // peaceful pause between whispers

  // Active voice persona & gender
  private activePersona: VoicePersona = VOICE_PERSONAS[0];
  private voiceGender: VoiceGender = 'feminine';

  // Whisper softness & gain levels (ultra-soft by default)
  private whisperVolume: number = 0.24; // soft and gentle so it never dominates
  private whisperRate: number = 0.44;
  private softnessLevel: WhisperSoftnessLevel = 'mild';
  private smoothnessLevel: VoiceSmoothnessLevel = 'silky';

  // In-memory audio buffer cache (verseId_personaId -> AudioBuffer)
  private audioCache = new Map<string, AudioBuffer>();

  // Currently playing Web Audio node
  private activeSourceNode: AudioBufferSourceNode | null = null;

  // Callbacks
  private onSpeakingStateChange?: (speaking: boolean) => void;
  private onGeneratingStateChange?: (generating: boolean) => void;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public setSpeakingCallback(callback: (speaking: boolean) => void) {
    this.onSpeakingStateChange = callback;
  }

  public setGeneratingCallback(callback: (generating: boolean) => void) {
    this.onGeneratingStateChange = callback;
  }

  public getIsVoiceEnabled(): boolean {
    return this.isVoiceEnabled;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.isVoiceEnabled = enabled;
    if (!enabled) {
      this.stop();
    } else if (this.currentVerse) {
      this.startRepeating(this.currentVerse);
    }
  }

  public getVoiceGender(): VoiceGender {
    return this.voiceGender;
  }

  public setVoiceGender(gender: VoiceGender) {
    this.voiceGender = gender;
    // Auto-select first matching persona of this gender
    const matching = VOICE_PERSONAS.find((p) => p.gender === gender);
    if (matching && matching.id !== this.activePersona.id) {
      this.activePersona = matching;
    }
    if (this.currentVerse && this.isVoiceEnabled) {
      this.recite(this.currentVerse);
    }
  }

  public getActivePersona(): VoicePersona {
    return this.activePersona;
  }

  public setActivePersona(id: VoicePersonaId | string) {
    const found = VOICE_PERSONAS.find((p) => p.id === id);
    if (found) {
      this.activePersona = found;
      this.voiceGender = found.gender;
      if (this.currentVerse && this.isVoiceEnabled) {
        this.recite(this.currentVerse);
      }
    }
  }

  public getAllPersonas(): VoicePersona[] {
    return VOICE_PERSONAS;
  }

  public getSoftnessLevel(): WhisperSoftnessLevel {
    return this.softnessLevel;
  }

  public setSoftnessLevel(level: WhisperSoftnessLevel) {
    this.softnessLevel = level;
    if (level === 'feather') {
      this.whisperVolume = 0.16; // feather-light whisper
      this.whisperRate = 0.42;
    } else if (level === 'mild') {
      this.whisperVolume = 0.24; // balanced calm whisper
      this.whisperRate = 0.45;
    } else {
      this.whisperVolume = 0.35; // gentle clear voice
      this.whisperRate = 0.48;
    }
  }

  public getSmoothnessLevel(): VoiceSmoothnessLevel {
    return this.smoothnessLevel;
  }

  public setSmoothnessLevel(level: VoiceSmoothnessLevel) {
    this.smoothnessLevel = level;
    if (this.currentVerse && this.isVoiceEnabled) {
      // Re-recite with updated smoothing filter
      this.recite(this.currentVerse);
    }
  }

  public getWhisperVolume(): number {
    return this.whisperVolume;
  }

  public setWhisperVolume(vol: number) {
    this.whisperVolume = Math.max(0.04, Math.min(1.0, vol));
  }

  public isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  public isGenerating(): boolean {
    return this.isGeneratingVoice;
  }

  public getRepeatInterval(): number {
    return this.repeatIntervalSeconds;
  }

  public setRepeatInterval(seconds: number) {
    this.repeatIntervalSeconds = seconds;
    if (this.currentVerse && this.isVoiceEnabled) {
      this.startRepeating(this.currentVerse, seconds);
    }
  }

  public clearVoiceCache(verseId?: string) {
    if (verseId) {
      for (const key of Array.from(this.audioCache.keys())) {
        if (key.startsWith(`${verseId}_`)) {
          this.audioCache.delete(key);
        }
      }
    } else {
      this.audioCache.clear();
    }
  }

  private cleanVerseText(quote: string): string {
    return quote
      .replace(/[“”—"]/g, '')
      .replace(/Psalm|Proverbs|John|Matthew|Romans|Jeremiah|Isaiah|Hebrews|Ephesians|Timothy|James|\d+:\d+/gi, '')
      .trim();
  }

  /**
   * Generates a studio whisper recording using the server Gemini TTS endpoint.
   */
  public async generateVoiceForVerse(
    verse: Verse,
    persona: VoicePersona = this.activePersona,
    options: { forceRegenerate?: boolean; customStyle?: string } = {}
  ): Promise<AudioBuffer | null> {
    const pureText = this.cleanVerseText(verse.quote);
    const cacheKey = `${verse.id}_${persona.id}`;

    if (!options.forceRegenerate && this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
    }

    if (options.forceRegenerate) {
      this.audioCache.delete(cacheKey);
    }

    this.isGeneratingVoice = true;
    if (this.onGeneratingStateChange) this.onGeneratingStateChange(true);

    try {
      const styleToUse =
        options.customStyle ||
        persona.stylePrompt ||
        `${persona.tone}. Recited as a very soft, serene sanctuary whisper with peaceful breathing and holy stillness.`;

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: pureText,
          voiceName: persona.voiceName,
          style: styleToUse,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS server responded with ${response.status}`);
      }

      const data = await response.json();
      if (!data.audio) {
        throw new Error('No audio returned');
      }

      // Convert base64 WAV to ArrayBuffer
      const binaryString = window.atob(data.audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const ctx = this.getAudioContext();
      if (!ctx) return null;

      const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
      this.audioCache.set(cacheKey, audioBuffer);
      return audioBuffer;
    } catch (err) {
      console.warn('AI Voice Generation fallback to synthesized whisper:', err);
      return null;
    } finally {
      this.isGeneratingVoice = false;
      if (this.onGeneratingStateChange) this.onGeneratingStateChange(false);
    }
  }

  /**
   * Plays the generated audio buffer with warm vocal EQ and subtle, cozy room delay.
   * Completely eliminates sharp consonants or piercing highs.
   */
  private playAudioBufferWithCinematicEcho(
    audioBuffer: AudioBuffer,
    onEnded?: () => void
  ) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Stop any currently playing voice
    if (this.activeSourceNode) {
      try {
        this.activeSourceNode.stop();
        this.activeSourceNode.disconnect();
      } catch (_) {}
      this.activeSourceNode = null;
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

    // Master whisper gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.whisperVolume, ctx.currentTime);

    // 1. Dynamics Compressor for buttery smooth syllables (prevents harsh volume jumps)
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-26, ctx.currentTime);
    compressor.knee.setValueAtTime(30, ctx.currentTime);
    compressor.ratio.setValueAtTime(3.5, ctx.currentTime);
    compressor.attack.setValueAtTime(0.03, ctx.currentTime);
    compressor.release.setValueAtTime(0.25, ctx.currentTime);

    // 2. Highpass filter at 85Hz (eliminates low sub-bass rumble/plosives)
    const highPass = ctx.createBiquadFilter();
    highPass.type = 'highpass';
    highPass.frequency.setValueAtTime(85, ctx.currentTime);

    // 3. Warm Low-shelf filter at 190Hz (+2.4dB for deep, peaceful chest presence)
    const warmLowShelf = ctx.createBiquadFilter();
    warmLowShelf.type = 'lowshelf';
    warmLowShelf.frequency.setValueAtTime(190, ctx.currentTime);
    warmLowShelf.gain.setValueAtTime(2.4, ctx.currentTime);

    // 4. De-Esser Notch Filter at 4600Hz (-8dB, tames sibilant 's'/'t' clicks)
    const deEsser = ctx.createBiquadFilter();
    deEsser.type = 'peaking';
    deEsser.frequency.setValueAtTime(4600, ctx.currentTime);
    deEsser.Q.setValueAtTime(2.2, ctx.currentTime);
    deEsser.gain.setValueAtTime(-8.0, ctx.currentTime);

    // 5. Silky Low-Pass Smoothing Filter (cuts high digital fizz and saliva noise)
    const smoothLowPass = ctx.createBiquadFilter();
    smoothLowPass.type = 'lowpass';
    const cutoffFreq =
      this.smoothnessLevel === 'silky'
        ? 2600
        : this.smoothnessLevel === 'soft'
        ? 2100
        : 3200;
    smoothLowPass.frequency.setValueAtTime(cutoffFreq, ctx.currentTime);
    smoothLowPass.Q.setValueAtTime(0.707, ctx.currentTime);

    // 6. Subtle Sanctuary Room Delay (diffuse, tranquil presence)
    const delayNode = ctx.createDelay();
    delayNode.delayTime.setValueAtTime(0.32, ctx.currentTime);

    const feedbackGain = ctx.createGain();
    feedbackGain.gain.setValueAtTime(0.12, ctx.currentTime);

    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.setValueAtTime(900, ctx.currentTime);

    const echoGain = ctx.createGain();
    echoGain.gain.setValueAtTime(0.12, ctx.currentTime);

    // Connect vocal signal chain:
    // source -> compressor -> highPass -> warmLowShelf -> deEsser -> smoothLowPass -> masterGain -> destination
    source.connect(compressor);
    compressor.connect(highPass);
    highPass.connect(warmLowShelf);
    warmLowShelf.connect(deEsser);
    deEsser.connect(smoothLowPass);
    smoothLowPass.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Connect gentle ambient room delay
    smoothLowPass.connect(delayNode);
    delayNode.connect(delayFilter);
    delayFilter.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayFilter.connect(echoGain);
    echoGain.connect(ctx.destination);

    this.activeSourceNode = source;
    this.isCurrentlySpeaking = true;
    if (this.onSpeakingStateChange) this.onSpeakingStateChange(true);

    source.onended = () => {
      this.isCurrentlySpeaking = false;
      this.activeSourceNode = null;
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      if (onEnded) onEnded();
    };

    source.start(0);
  }

  /**
   * Fallback Web Speech synthesis whisper with warm pitch calibration and natural fluid pauses.
   */
  private reciteSpeechSynthesisFallback(
    verse: Verse,
    options: { onStart?: () => void; onEnd?: () => void } = {}
  ) {
    if (!this.synth || !this.isVoiceEnabled) return;

    this.synth.cancel();
    const pureVerse = this.cleanVerseText(verse.quote);

    let speechText = pureVerse;
    if (pureVerse.toLowerCase().includes('be still') && pureVerse.toLowerCase().includes('god')) {
      speechText = 'Be still, and know, that I am God.';
    } else {
      speechText = pureVerse.replace(/[,;:]/g, ', ');
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = this.whisperRate * 0.95;

    const isFeminine = this.activePersona.gender === 'feminine';
    utterance.pitch = isFeminine ? 0.72 : 0.45;
    utterance.volume = this.whisperVolume;

    const voices = this.synth.getVoices();
    const targetNames = isFeminine
      ? ['serena', 'samantha', 'victoria', 'ava', 'karen', 'fiona', 'zira', 'female']
      : ['daniel', 'oliver', 'arthur', 'george', 'david', 'guy', 'male'];

    for (const name of targetNames) {
      const match = voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes(name));
      if (match) {
        utterance.voice = match;
        break;
      }
    }

    utterance.onstart = () => {
      this.isCurrentlySpeaking = true;
      if (options.onStart) options.onStart();
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(true);
    };

    utterance.onend = () => {
      this.isCurrentlySpeaking = false;
      if (options.onEnd) options.onEnd();
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
    };

    utterance.onerror = () => {
      this.isCurrentlySpeaking = false;
      if (options.onEnd) options.onEnd();
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
    };

    try {
      this.synth.speak(utterance);
    } catch (_) {}
  }

  /**
   * Recites the verse in a soft, gentle whisper.
   */
  public async recite(
    verse: Verse,
    options: {
      onStart?: () => void;
      onEnd?: () => void;
      forceRegenerate?: boolean;
      customStyle?: string;
    } = {}
  ) {
    if (!this.isVoiceEnabled) return;

    this.currentVerse = verse;
    const cacheKey = `${verse.id}_${this.activePersona.id}`;

    if (!options.forceRegenerate && this.audioCache.has(cacheKey)) {
      if (options.onStart) options.onStart();
      this.playAudioBufferWithCinematicEcho(this.audioCache.get(cacheKey)!, options.onEnd);
      return;
    }

    const generatedBuffer = await this.generateVoiceForVerse(verse, this.activePersona, {
      forceRegenerate: options.forceRegenerate,
      customStyle: options.customStyle,
    });

    if (generatedBuffer) {
      if (options.onStart) options.onStart();
      this.playAudioBufferWithCinematicEcho(generatedBuffer, options.onEnd);
    } else {
      this.reciteSpeechSynthesisFallback(verse, options);
    }
  }

  /**
   * Repeatedly recites the verse with a serene interval between whispers throughout session.
   */
  public startRepeating(verse: Verse, intervalSeconds?: number) {
    this.currentVerse = verse;
    if (intervalSeconds) {
      this.repeatIntervalSeconds = intervalSeconds;
    }

    this.stopRepeatingOnly();
    if (!this.isVoiceEnabled) return;

    // Initial recite
    this.recite(verse);
    this.scheduleNextRepeat();
  }

  private scheduleNextRepeat() {
    if (!this.isVoiceEnabled || !this.currentVerse) return;

    const ms = (this.repeatIntervalSeconds + (Math.random() * 2 - 1)) * 1000;

    this.repeatTimerId = window.setTimeout(() => {
      if (this.isVoiceEnabled && this.currentVerse) {
        this.recite(this.currentVerse);
        this.scheduleNextRepeat();
      }
    }, ms);
  }

  private stopRepeatingOnly() {
    if (this.repeatTimerId !== null) {
      clearTimeout(this.repeatTimerId);
      this.repeatTimerId = null;
    }
  }

  public stop() {
    this.stopRepeatingOnly();
    if (this.activeSourceNode) {
      try {
        this.activeSourceNode.stop();
        this.activeSourceNode.disconnect();
      } catch (_) {}
      this.activeSourceNode = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (_) {}
    }
    this.isCurrentlySpeaking = false;
    if (this.onSpeakingStateChange) {
      this.onSpeakingStateChange(false);
    }
  }
}

export const narrationEngine = new ScriptureNarrationEngine();
