export type ScreenId = 
  | 'welcome' 
  | 'preferences' 
  | 'home' 
  | 'bible'
  | 'chat'
  | 'player' 
  | 'completed' 
  | 'explore' 
  | 'progress' 
  | 'settings';

export type MainTab = 'home' | 'bible' | 'chat' | 'explore' | 'progress' | 'settings';

export type DurationOption = {
  id: string;
  name: string;
  durationLabel: string;
  seconds: number;
  icon: 'zap' | 'clock' | 'flower';
};

export type SoundCategory = 'Real Piano' | 'Quiet Contemplation' | 'Sanctuary Keys' | 'Custom Uploads';

export type MusicStyle =
  | 'Gymnopedie No. 1'
  | 'Clair de Lune'
  | 'Moonlight Sonata'
  | 'Chopin Nocturne Op. 9 No. 2'
  | 'Chopin Nocturne in C# Minor'
  | 'Gnossienne No. 1'
  | 'Schubert Andante'
  | 'Scriabin Lento Prelude'
  | 'Chopin Nocturne Op. 37'
  | (string & {});

export type VoiceSmoothnessLevel = 'silky' | 'warm' | 'soft';

export interface SoundTrack {
  id: MusicStyle;
  name: string;
  category: SoundCategory;
  description: string;
  composer?: string;
  icon: string;
  tag: string;
  badge?: string;
  audioUrl?: string;
  isCustom?: boolean;
}

export type MoodType = 'Peace' | 'Joy' | 'Courage' | 'Healing' | 'Gratitude';

export interface MoodConfig {
  id: MoodType;
  label: string;
  iconName: string;
  color: string;
  bgActive: string;
  verseReference: string;
}

export interface Verse {
  id: string;
  reference: string;
  quote: string;
  book: string;
  chapter: number;
  verse: number;
  category: string;
  reflectionPrompts: string[];
  themeImageUrl: string;
}

export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  gradient: string;
  badge?: string;
  verseCount: number;
}

export interface JournalNote {
  id: string;
  date: string;
  verseRef: string;
  text: string;
  hasAudio?: boolean;
}

export interface MeditationSession {
  id: string;
  date: string;
  verseRef: string;
  durationMinutes: number;
  mood: MoodType;
  musicStyle: MusicStyle;
  completedAt: string;
}

export type VoiceGender = 'feminine' | 'masculine';

export type VoicePersonaId =
  | 'seraphina'
  | 'miriam'
  | 'eden'
  | 'hannah'
  | 'abigail'
  | 'selena'
  | 'elijah'
  | 'gabriel'
  | 'david'
  | 'solomon'
  | 'samuel'
  | 'malachi'
  | 'kore'
  | 'fenrir'
  | 'aoede'
  | 'charon'
  | 'zephyr'
  | 'puck';

export interface VoicePersona {
  id: VoicePersonaId;
  name: string;
  gender: VoiceGender;
  voiceName: string;
  description: string;
  tone: string;
  badge?: string;
  previewPrompt?: string;
  stylePrompt?: string;
}

export interface UserPreferences {
  userName: string;
  reminderTime: string;
  reminderEnabled: boolean;
  musicStyle: MusicStyle;
  initialFocus: string;
  selectedFocuses?: string[];
  voiceEnabled?: boolean;
  voiceGender?: VoiceGender;
  voicePersona?: VoicePersonaId;
  whisperSoftness?: 'feather' | 'mild' | 'gentle';
  whisperVolume?: number;
  voiceSmoothness?: VoiceSmoothnessLevel;
  customSoundId?: string;
  isDarkMode: boolean;
  volume: number;
}
