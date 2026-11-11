import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Search,
  Volume2,
  Check,
  Music2,
  Sparkles,
  Upload,
  Youtube,
  Trash2,
  ExternalLink,
  Copy,
  FolderOpen,
  Play,
  Pause,
  AlertCircle,
  FileAudio,
} from 'lucide-react';
import { MusicStyle, SoundCategory, SoundTrack } from '../../types';
import { SOUND_CATALOG, SOUND_CATEGORIES } from '../../data/soundsCatalog';
import { audioEngine } from '../../services/audioEngine';
import { soundStorage, CustomUploadedSound } from '../../services/soundStorage';

interface SoundCatalogModalProps {
  currentStyle: MusicStyle;
  onSelectStyle: (style: MusicStyle) => void;
  onClose: () => void;
  volume?: number;
  onVolumeChange?: (vol: number) => void;
}

type ModalTab = 'library' | 'upload' | 'youtube';

export const SoundCatalogModal: React.FC<SoundCatalogModalProps> = ({
  currentStyle,
  onSelectStyle,
  onClose,
  volume = 0.8,
  onVolumeChange,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('library');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [localVolume, setLocalVolume] = useState(volume);
  const [customSounds, setCustomSounds] = useState<CustomUploadedSound[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user uploaded sounds from IndexedDB on mount
  useEffect(() => {
    soundStorage.getAllSounds().then((sounds) => {
      setCustomSounds(sounds);
    });
  }, []);

  const handleSelectProcedural = (style: MusicStyle) => {
    onSelectStyle(style);
    audioEngine.start(style);
  };

  const handleSelectCustom = async (sound: CustomUploadedSound) => {
    onSelectStyle(sound.id as MusicStyle);
    await audioEngine.playCustomAudio(sound.blob, sound.id, sound.name);
  };

  const handleDeleteCustom = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await soundStorage.deleteSound(id);
    const updated = await soundStorage.getAllSounds();
    setCustomSounds(updated);
    if (currentStyle === id) {
      handleSelectProcedural('Gymnopedie No. 1');
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Check valid audio types
    if (!file.type.startsWith('audio/') && !/\.(mp3|wav|m4a|aac|ogg)$/i.test(file.name)) {
      setUploadFeedback('⚠️ Please select a valid audio file (.mp3, .wav, .m4a, .aac)');
      setTimeout(() => setUploadFeedback(null), 3500);
      return;
    }

    setIsUploading(true);
    setUploadFeedback('Saving to your private meditation sound library...');

    try {
      const saved = await soundStorage.saveSound(file);
      const updated = await soundStorage.getAllSounds();
      setCustomSounds(updated);

      // Play immediately
      await handleSelectCustom(saved);
      setUploadFeedback(`✨ Uploaded & playing: "${saved.name}"!`);
      setTimeout(() => setUploadFeedback(null), 3500);
    } catch (err) {
      console.warn('Upload failed:', err);
      setUploadFeedback('Failed to save audio file. Please try again.');
      setTimeout(() => setUploadFeedback(null), 3500);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleVol = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setLocalVolume(v);
    audioEngine.setVolume(v);
    if (onVolumeChange) onVolumeChange(v);
  };

  const copySearchQuery = (query: string) => {
    navigator.clipboard.writeText(query);
    setCopyFeedback(`Copied: "${query}"`);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const filteredSounds = SOUND_CATALOG.filter((sound) => {
    const matchesCategory =
      selectedCategory === 'All' || sound.category === selectedCategory;
    const matchesSearch =
      sound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sound.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sound.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
      >
        {/* Header */}
        <div className="p-4 border-b border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <Music2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Real Piano & Keyboard Music
              </h2>
              <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                Genuine acoustic grand piano recordings & custom uploads
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close sound catalog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 border-b border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/60 p-1 gap-1">
          <button
            onClick={() => setActiveTab('library')}
            className={`py-2 px-1 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'library'
                ? 'bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shadow-xs border border-emerald-200/60 dark:border-emerald-800'
                : 'text-slate-600 dark:text-emerald-300/70 hover:text-emerald-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Piano ({SOUND_CATALOG.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-1 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shadow-xs border border-emerald-200/60 dark:border-emerald-800'
                : 'text-slate-600 dark:text-emerald-300/70 hover:text-emerald-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload ({customSounds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('youtube')}
            className={`py-2 px-1 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shadow-xs border border-emerald-200/60 dark:border-emerald-800'
                : 'text-slate-600 dark:text-emerald-300/70 hover:text-emerald-900 dark:hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>YouTube Guide</span>
          </button>
        </div>

        {/* Feedback Alert Banner */}
        {uploadFeedback && (
          <div className="bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1.5 text-xs text-emerald-900 dark:text-emerald-200 font-medium flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 animate-in fade-in">
            <span>{uploadFeedback}</span>
            <button
              onClick={() => setUploadFeedback(null)}
              className="text-emerald-600 hover:text-emerald-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {copyFeedback && (
          <div className="bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1.5 text-xs text-emerald-800 dark:text-emerald-200 font-medium flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 animate-in fade-in">
            <span>{copyFeedback}</span>
            <button
              onClick={() => setCopyFeedback(null)}
              className="text-emerald-500 hover:text-emerald-800 dark:hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* TAB 1: PROCEDURAL SOOTHING SOUNDS LIBRARY */}
        {activeTab === 'library' && (
          <>
            {/* Search bar & Category filters */}
            <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/60 border-b border-emerald-100/70 dark:border-emerald-900/60 space-y-2">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Satie, Debussy, Chopin, Beethoven, piano..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {['All', ...SOUND_CATEGORIES.filter((c) => c !== 'Custom Uploads')].map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sound List Container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar">
              {filteredSounds.map((sound) => {
                const isCurrent = currentStyle === sound.id;
                return (
                  <div
                    key={sound.id}
                    onClick={() => handleSelectProcedural(sound.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group ${
                      isCurrent
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105 ${
                        isCurrent
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      <span>{sound.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {sound.name}
                          </h3>
                          {sound.badge && (
                            <span className="text-[9px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.2 rounded-md">
                              {sound.badge}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-900 shrink-0">
                          {sound.tag}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                        {sound.description}
                      </p>

                      {isCurrent && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-0.5">
                            <span className="w-1 h-3 bg-emerald-600 rounded-full animate-bounce" />
                            <span className="w-1 h-4 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.15s]" />
                            <span className="w-1 h-2.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.3s]" />
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                            Playing Real Acoustic Piano
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 mt-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isCurrent
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-300 dark:border-slate-700 group-hover:border-emerald-400'
                        }`}
                      >
                        {isCurrent && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* TAB 2: UPLOAD CUSTOM SOUNDS */}
        {activeTab === 'upload' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {/* Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-emerald-300 dark:border-emerald-800 hover:border-emerald-500 rounded-3xl p-6 bg-emerald-50/50 dark:bg-emerald-950/30 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Upload Your Own Meditation Sounds
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-3">
                Select an MP3, WAV, or M4A audio file from your computer or phone. Saved privately on your device.
              </p>
              <button
                type="button"
                className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs cursor-pointer"
              >
                Choose Audio File...
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>

            {/* List of Uploaded Sounds */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Your Uploaded Library ({customSounds.length})
                </h4>
                {customSounds.length > 0 && (
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    Stored in device storage
                  </span>
                )}
              </div>

              {customSounds.length === 0 ? (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-center space-y-1.5">
                  <FileAudio className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No custom audio uploaded yet
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Check the <strong>"YouTube Guide"</strong> tab above for free, safe meditation tracks you can download and upload here!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customSounds.map((sound) => {
                    const isCurrent = currentStyle === sound.id;
                    return (
                      <div
                        key={sound.id}
                        onClick={() => handleSelectCustom(sound)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isCurrent
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <FileAudio className="w-4 h-4" />
                          </div>

                          <div className="overflow-hidden">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {sound.name}
                            </h5>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {sound.durationSeconds > 0
                                ? `${Math.floor(sound.durationSeconds / 60)}:${(
                                    sound.durationSeconds % 60
                                  )
                                    .toString()
                                    .padStart(2, '0')}`
                                : 'Audio'} • {(sound.fileSize / (1024 * 1024)).toFixed(1)} MB
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80">
                              Active
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustom(e, sound.id)}
                            className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete custom track"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: YOUTUBE & FREE MEDITATION SOUNDS GUIDE */}
        {activeTab === 'youtube' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {/* Header info */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold mb-0.5">Find & Upload Free Meditation Sounds</p>
                <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                  You can search YouTube Audio Library or free audio sites for peaceful ambient meditation MP3 tracks and upload them in the <strong>Upload</strong> tab!
                </p>
              </div>
            </div>

            {/* Curated YouTube Search Queries */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Recommended Peaceful Searches on YouTube
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tap to copy or open in YouTube to find high-rated peaceful tracks:
              </p>

              <div className="space-y-2">
                {[
                  {
                    title: 'Peaceful Real Grand Piano for Prayer',
                    query: 'real acoustic grand piano meditation music peaceful quiet',
                    desc: 'Real studio-recorded acoustic grand piano with soft, slow touch',
                  },
                  {
                    title: 'Gentle Christian Hymns on Piano',
                    query: 'gentle hymns on acoustic piano quiet prayer meditation instrumental',
                    desc: 'Acoustic piano hymns played slowly and reverently for prayer',
                  },
                  {
                    title: 'Erik Satie & Impressionist Piano Pieces',
                    query: 'Erik Satie Gymnopedie peaceful acoustic piano meditation',
                    desc: 'Delicate, minimal classical piano pieces for contemplation',
                  },
                  {
                    title: 'Chopin Quiet Nocturnes on Real Piano',
                    query: 'Chopin nocturnes quiet real acoustic piano meditation sleep',
                    desc: 'Gentle, tender acoustic piano recorded in live concert halls',
                  },
                  {
                    title: 'YouTube Audio Library (Genre: Classical, Mood: Calm)',
                    query: 'YouTube Audio Library genre classical instrument piano mood calm free download',
                    desc: 'Official 100% free royalty-free MP3 downloads direct from YouTube Studio',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => copySearchQuery(item.query)}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                          title="Copy search text"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                            item.query
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Youtube className="w-3 h-3" />
                          <span>Search</span>
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Free Royalty-Free MP3 Platforms */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Trusted Free Meditation MP3 Downloads:</span>
              </h4>
              <ul className="text-xs text-emerald-900 dark:text-emerald-300 space-y-1.5 pl-1">
                <li className="flex items-center justify-between">
                  <span>• <strong>Chosic (Meditation Music)</strong>: Free relaxing MP3s</span>
                  <a
                    href="https://www.chosic.com/free-music/meditation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] underline text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5"
                  >
                    Open <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li className="flex items-center justify-between">
                  <span>• <strong>Fesliyan Studios (Peaceful)</strong>: Free instrumental tracks</span>
                  <a
                    href="https://www.fesliyanstudios.com/royalty-free-music/downloads-c/peaceful-and-relaxing-music/22"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] underline text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5"
                  >
                    Open <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li className="flex items-center justify-between">
                  <span>• <strong>Internet Archive (Spiritual Audio)</strong>: Public domain audio</span>
                  <a
                    href="https://archive.org/details/audio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] underline text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5"
                  >
                    Open <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer Master Volume Slider */}
        <div className="p-3 bg-white dark:bg-slate-950 border-t border-emerald-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium shrink-0">
            <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Sound Volume</span>
          </div>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={localVolume}
            onChange={handleVol}
            className="flex-1 accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer"
            aria-label="Volume level"
          />

          <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 w-8 text-right">
            {Math.round(localVolume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
