import React, { useState } from 'react';
import { ArrowLeft, Home, Check, Sparkles, PenLine, Mic, Square, Heart, Share2, BarChart2, ChevronRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { TopStatusBar } from '../navigation/TopStatusBar';
import { Verse } from '../../types';
import { useAudioTranscriber } from '../../hooks/useAudioTranscriber';

interface SessionCompleteScreenProps {
  verse: Verse;
  onGoHome: () => void;
  onViewProgress: () => void;
  onSaveNote: (noteText: string, hasVoice: boolean) => void;
  onToggleFavorite: (verseId: string) => void;
  isFavorite: boolean;
  onShare: (verse: Verse) => void;
}

export const SessionCompleteScreen: React.FC<SessionCompleteScreenProps> = ({
  verse,
  onGoHome,
  onViewProgress,
  onSaveNote,
  onToggleFavorite,
  isFavorite = false,
  onShare,
}) => {
  const [noteText, setNoteText] = useState('');
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const {
    isRecording,
    isTranscribing,
    recordingSeconds,
    error: transcribeError,
    toggleRecording,
  } = useAudioTranscriber({
    contextHint: `Meditation reflection on ${verse.reference}`,
    onTranscript: (transcript) => {
      setHasVoiceNote(true);
      setNoteText((prev) => (prev.trim() ? `${prev.trim()}\n${transcript}` : transcript));
    },
  });

  const handleSave = () => {
    if (noteText.trim() || hasVoiceNote) {
      onSaveNote(noteText, hasVoiceNote);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 no-scrollbar">
      {/* Top Status Bar */}
      <TopStatusBar darkText={true} />

      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-2">
        <button
          onClick={onGoHome}
          aria-label="Back"
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <button
          onClick={onGoHome}
          aria-label="Home"
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
        >
          <Home className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 flex-1 flex flex-col items-center pt-2 pb-6">
        {/* Checkmark badge with gold sparkles */}
        <div className="relative mb-3 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-2 animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -bottom-1 -left-2 animate-pulse" />
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border-4 border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
        </div>

        {/* Title & Affirmation */}
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Session Complete!
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center font-medium">
          You just meditated on God’s Word.
        </p>

        {/* Journaling Prompt Card */}
        <div className="w-full mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            <PenLine className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Journaling Prompt</span>
          </div>

          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
            What stood out to you?
          </p>

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write your thoughts..."
            rows={3}
            className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 resize-none transition-all"
          />

          {transcribeError && (
            <div className="mt-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-[11px] text-emerald-900 dark:text-emerald-100">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>{transcribeError}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-2 mt-3">
            {/* Voice Note Transcription Button */}
            <button
              type="button"
              onClick={toggleRecording}
              disabled={isTranscribing}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60 ${
                isRecording
                  ? 'bg-emerald-700 text-white border border-emerald-600 animate-pulse'
                  : isTranscribing
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300'
                  : hasVoiceNote
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Transcribing...</span>
                </>
              ) : isRecording ? (
                <>
                  <Square className="w-3 h-3 fill-white" />
                  <span>Stop ({recordingSeconds}s)</span>
                </>
              ) : hasVoiceNote ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Transcribed! Add More</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>Speak &amp; Transcribe</span>
                </>
              )}
            </button>

            {/* Save Note Button */}
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-emerald-600/20"
            >
              <span>{noteSaved ? 'Saved! ✓' : 'Save Note'}</span>
            </button>
          </div>
        </div>

        {/* Action List Items */}
        <div className="w-full mt-4 space-y-2">
          {/* Save to Favorites */}
          <button
            onClick={() => onToggleFavorite(verse.id)}
            className="w-full py-3.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Heart
                className={`w-4 h-4 ${
                  isFavorite
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-rose-500'
                }`}
              />
              <span>{isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Share Verse */}
          <button
            onClick={() => onShare(verse)}
            className="w-full py-3.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Share2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Share Verse</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* View Progress */}
          <button
            onClick={onViewProgress}
            className="w-full py-3.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <BarChart2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>View Progress</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
