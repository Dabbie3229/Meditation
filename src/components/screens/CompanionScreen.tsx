import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Trash2,
  Sparkles,
  BookOpen,
  Heart,
  Feather,
  MessageCircle,
  Loader2,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import { TopStatusBar } from '../navigation/TopStatusBar';
import { BottomTabBar } from '../navigation/BottomTabBar';
import { MainTab, MoodType, Verse } from '../../types';
import { useAudioTranscriber } from '../../hooks/useAudioTranscriber';

type ConversationStyle = 'friend' | 'prayer' | 'scholar' | 'listener';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface CompanionScreenProps {
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  verse: Verse;
  mood: MoodType;
  userName: string;
}

const CONVERSATION_STYLES: Array<{
  id: ConversationStyle;
  label: string;
  icon: React.FC<{ className?: string }>;
}> = [
  { id: 'friend', label: 'Just Chat', icon: MessageCircle },
  { id: 'prayer', label: 'Prayer', icon: Heart },
  { id: 'scholar', label: 'Bible Study', icon: BookOpen },
  { id: 'listener', label: 'Quiet Space', icon: Feather },
];

export const CompanionScreen: React.FC<CompanionScreenProps> = ({
  currentTab,
  onTabChange,
  verse,
  mood,
  userName = 'Friend',
}) => {
  const [style, setStyle] = useState<ConversationStyle>('friend');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('meditate_chat_history_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((m: any) => ({
            id: String(m.id || Date.now()),
            role: m.role === 'user' ? 'user' : 'model',
            text: String(m.text || ''),
            timestamp: String(m.timestamp || ''),
          }));
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingReply, setStreamingReply] = useState('');
  const [speakReplies, setSpeakReplies] = useState(false);
  const [autoSendVoice, setAutoSendVoice] = useState(true);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
    try {
      localStorage.setItem('meditate_chat_history_v1', JSON.stringify(messages.slice(-30)));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingReply, isStreaming]);

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      stopSpeech();
    };
  }, [stopSpeech]);

  const speakText = useCallback(
    (text: string, msgId: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const clean = text.replace(/[*_`#]/g, '').trim();
      if (!clean) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google'))
        ) || voices.find((v) => v.lang.startsWith('en'));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 0.96;
      utterance.pitch = 1.0;

      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);

      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    },
    []
  );

  const sendMessage = useCallback(
    async (textOverride?: string) => {
      const cleanText = (textOverride ?? input).trim();
      if (!cleanText || isStreaming) return;

      setError(null);
      stopSpeech();

      const currentHistory = messagesRef.current;
      const userMsg: ChatMessage = {
        id: `u_${Date.now()}`,
        role: 'user',
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      if (!textOverride) setInput('');
      setIsStreaming(true);
      setStreamingReply('');

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            message: cleanText,
            history: currentHistory.map((m) => ({ role: m.role, text: m.text })),
            rolePersona: style,
            speedMode: 'balanced',
            userName,
            verseContext: {
              reference: verse.reference,
              quote: verse.quote,
              mood,
            },
          }),
        });

        if (!response.ok || !response.body) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error || 'Could not reach your companion right now.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const jsonStr = trimmed.slice(5).trim();
            if (!jsonStr) continue;

            try {
              const payload = JSON.parse(jsonStr);
              if (payload.error) {
                throw new Error(payload.error);
              }
              if (payload.delta) {
                accumulated += payload.delta;
                setStreamingReply(accumulated);
              }
            } catch (parseErr: any) {
              if (parseErr?.message && !parseErr.message.includes('JSON')) {
                throw parseErr;
              }
            }
          }
        }

        const finalReply = accumulated.trim();
        if (!finalReply) {
          throw new Error('No response came through. Please try sending again.');
        }

        const modelMsg: ChatMessage = {
          id: `m_${Date.now()}`,
          role: 'model',
          text: finalReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, modelMsg]);
        setStreamingReply('');

        if (speakReplies) {
          speakText(finalReply, modelMsg.id);
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setError(err?.message || 'Unable to respond right now. Please try again.');
        }
      } finally {
        setIsStreaming(false);
        setStreamingReply('');
      }
    },
    [input, isStreaming, mood, speakReplies, speakText, stopSpeech, style, userName, verse.quote, verse.reference]
  );

  const {
    isRecording,
    isTranscribing,
    recordingSeconds,
    error: micError,
    clearError: clearMicError,
    toggleRecording,
  } = useAudioTranscriber({
    contextHint: 'Natural conversation with spiritual companion',
    onTranscript: (transcript) => {
      const cleaned = transcript.trim();
      if (!cleaned) return;
      if (autoSendVoice && !input.trim()) {
        sendMessage(cleaned);
      } else {
        setInput((prev) => (prev.trim() ? `${prev.trim()} ${cleaned}` : cleaned));
      }
    },
  });

  const handleClearChat = () => {
    stopSpeech();
    setMessages([]);
    setError(null);
    clearMicError();
    try {
      localStorage.removeItem('meditate_chat_history_v1');
    } catch {
      // ignore
    }
  };

  const handleCopy = async (msg: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // ignore
    }
  };

  const quickPrompts = [
    "Here's how my day is going...",
    'Can we pray together for a moment?',
    `Let's talk about ${verse.reference}`,
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-white dark:bg-[#071f15] text-slate-900 dark:text-emerald-50 transition-colors">
      {/* Top Status Bar */}
      <TopStatusBar darkText={true} />

      {/* Natural Companion Header */}
      <div className="px-4 py-2.5 border-b border-emerald-100 dark:border-emerald-900/70 bg-white dark:bg-[#071f15] shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/70 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0 relative">
              <Sparkles className="w-4.5 h-4.5" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#071f15] absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                Your Sanctuary Companion
              </h1>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 truncate">
                Always here to listen &amp; talk naturally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (speakReplies) stopSpeech();
                setSpeakReplies((v) => !v);
              }}
              title={speakReplies ? 'Mute spoken replies' : 'Speak AI replies aloud'}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                speakReplies
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800'
              }`}
            >
              {speakReplies ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{speakReplies ? 'Voice On' : 'Voice'}</span>
            </button>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearChat}
                title="Start a fresh conversation"
                aria-label="Clear chat"
                className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Simple Human Tone Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-2.5 pb-0.5">
          {CONVERSATION_STYLES.map((item) => {
            const Icon = item.icon;
            const active = style === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setStyle(item.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50/70 dark:bg-[#062016] text-emerald-900 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-900/70 hover:border-emerald-300'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-emerald-50/20 dark:bg-[#051810] no-scrollbar">
        {/* Natural Opening Greeting Bubble */}
        <div className="flex flex-col items-start">
          <div className="max-w-[88%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 bg-white dark:bg-[#062016] border border-emerald-100 dark:border-emerald-900/70 text-xs leading-relaxed text-slate-800 dark:text-emerald-50 shadow-2xs">
            Hey {userName} 🌿 Talk with me about anything on your mind today—how you’re really feeling, something going on in your life, a prayer request, or anything from Scripture. I’m listening.
          </div>
        </div>

        {/* Optional Quick Conversation Starters (only before first user message) */}
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#062016] hover:bg-emerald-50 dark:hover:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 text-[11px] font-medium text-emerald-800 dark:text-emerald-200 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Saved Multi-turn Messages */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSpeakingThis = speakingMsgId === msg.id;
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-br-sm shadow-xs'
                    : 'bg-white dark:bg-[#062016] text-slate-800 dark:text-emerald-50 border border-emerald-100 dark:border-emerald-900/70 rounded-bl-sm shadow-2xs'
                }`}
              >
                {msg.text}
              </div>

              <div className="flex items-center gap-2.5 mt-1 px-1">
                {msg.timestamp && (
                  <span className="text-[10px] text-slate-400 dark:text-emerald-400/60">
                    {msg.timestamp}
                  </span>
                )}
                {!isUser && (
                  <>
                    <button
                      type="button"
                      onClick={() => (isSpeakingThis ? stopSpeech() : speakText(msg.text, msg.id))}
                      className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      {isSpeakingThis ? (
                        <>
                          <Square className="w-2.5 h-2.5 fill-current" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-2.5 h-2.5" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(msg)}
                      className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-2.5 h-2.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Streaming AI Reply Bubble */}
        {isStreaming && (
          <div className="flex flex-col items-start">
            <div className="max-w-[88%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 bg-white dark:bg-[#062016] border border-emerald-200 dark:border-emerald-800/80 text-xs leading-relaxed text-slate-800 dark:text-emerald-50 whitespace-pre-wrap shadow-2xs">
              {streamingReply ? (
                streamingReply
              ) : (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:120ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:240ms]" />
                </span>
              )}
            </div>
          </div>
        )}

        <div ref={threadEndRef} />
      </div>

      {/* Error Banner */}
      {(error || micError) && (
        <div className="mx-3 mb-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-[11px] text-emerald-950 dark:text-emerald-100 shrink-0">
          <AlertCircle className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span className="flex-1">{error || micError}</span>
        </div>
      )}

      {/* Natural Input Composer */}
      <div className="px-3 pt-2 pb-2 bg-white dark:bg-[#062016] border-t border-emerald-100 dark:border-emerald-900/70 shrink-0">
        {(isRecording || isTranscribing) && (
          <div className="mb-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 text-[11px] font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              {isRecording ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  <span>Listening... {recordingSeconds}s (tap stop when done)</span>
                </>
              ) : (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Turning your voice into words...</span>
                </>
              )}
            </span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-end gap-2"
        >
          <button
            type="button"
            onClick={toggleRecording}
            disabled={isTranscribing || isStreaming}
            title={isRecording ? 'Stop speaking' : 'Speak naturally with your microphone'}
            aria-label={isRecording ? 'Stop recording' : 'Speak to chat'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:opacity-50 ${
              isRecording
                ? 'bg-emerald-700 text-white animate-pulse shadow-sm'
                : 'bg-emerald-50 dark:bg-[#04170f] text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400'
            }`}
          >
            {isTranscribing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRecording ? (
              <Square className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Say whatever is on your heart..."
            rows={1}
            className="flex-1 max-h-24 text-xs px-3.5 py-2.5 rounded-xl bg-emerald-50/50 dark:bg-[#04170f] border border-emerald-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || isStreaming || isRecording}
            aria-label="Send message"
            className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between px-1 pt-1.5">
          <button
            type="button"
            onClick={() => setAutoSendVoice((v) => !v)}
            className="text-[10px] font-medium text-slate-500 dark:text-emerald-300/75 hover:text-emerald-800 dark:hover:text-emerald-200 cursor-pointer"
          >
            Voice mic: <span className="font-semibold text-emerald-700 dark:text-emerald-400">{autoSendVoice ? 'Auto-sends when you stop' : 'Inserts into box first'}</span>
          </button>
          <span className="text-[10px] text-slate-400 dark:text-emerald-400/60">
            Enter to send
          </span>
        </div>
      </div>

      {/* Fixed Bottom Tab Bar */}
      <BottomTabBar currentTab={currentTab} onTabChange={onTabChange} />
    </div>
  );
};
