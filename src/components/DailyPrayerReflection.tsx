import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sun, Moon, Sparkles, RefreshCw, Copy, Check, AlertCircle } from 'lucide-react';
import { MoodType, Verse } from '../types';

export interface DevotionalEntry {
  title: string;
  reflection: string;
  prayer: string;
}

export interface DailyDevotionalData {
  themeTitle: string;
  morning: DevotionalEntry;
  evening: DevotionalEntry;
}

interface DailyPrayerReflectionProps {
  verse: Verse;
  mood?: MoodType;
  userName?: string;
  compact?: boolean;
}

type ReflectionPeriod = 'morning' | 'evening';

const CACHE_PREFIX = 'meditate_devotional_v1_';
const MAX_CACHED_ITEMS = 15;
const inFlightRequests = new Map<string, Promise<DailyDevotionalData>>();

function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getCacheKey(verse: Verse): string {
  const safeId = (verse.id || verse.reference).replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${CACHE_PREFIX}${safeId}_${getTodayDateKey()}`;
}

function readCachedDevotional(key: string): DailyDevotionalData | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { devotional?: DailyDevotionalData };
    if (
      parsed?.devotional?.themeTitle &&
      parsed?.devotional?.morning?.prayer &&
      parsed?.devotional?.evening?.prayer
    ) {
      return parsed.devotional;
    }
    return null;
  } catch {
    return null;
  }
}

function writeCachedDevotional(key: string, devotional: DailyDevotionalData): void {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        devotional,
        savedAt: Date.now(),
      })
    );

    // Prune oldest devotional cache entries to keep storage compact
    const keys: { k: string; savedAt: number }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) {
        try {
          const item = JSON.parse(localStorage.getItem(k) || '{}');
          keys.push({ k, savedAt: Number(item.savedAt) || 0 });
        } catch {
          keys.push({ k, savedAt: 0 });
        }
      }
    }
    if (keys.length > MAX_CACHED_ITEMS) {
      keys.sort((a, b) => a.savedAt - b.savedAt);
      const excess = keys.length - MAX_CACHED_ITEMS;
      for (let i = 0; i < excess; i++) {
        localStorage.removeItem(keys[i].k);
      }
    }
  } catch {
    // Ignore storage quota errors gracefully
  }
}

async function fetchDevotionalFromServer(
  verse: Verse,
  mood?: MoodType,
  userName?: string,
  refreshNonce?: string
): Promise<DailyDevotionalData> {
  const res = await fetch('/api/devotional', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reference: verse.reference,
      quote: verse.quote,
      mood,
      userName,
      refreshNonce,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || 'Could not generate today’s prayer reflection.');
  }
  if (!data?.devotional) {
    throw new Error('Devotional response was empty. Please try again.');
  }
  return data.devotional as DailyDevotionalData;
}

export const DailyPrayerReflection: React.FC<DailyPrayerReflectionProps> = ({
  verse,
  mood,
  userName,
  compact = false,
}) => {
  const defaultPeriod: ReflectionPeriod = new Date().getHours() < 17 ? 'morning' : 'evening';
  const [period, setPeriod] = useState<ReflectionPeriod>(defaultPeriod);
  const [devotional, setDevotional] = useState<DailyDevotionalData | null>(() =>
    readCachedDevotional(getCacheKey(verse))
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedPeriod, setCopiedPeriod] = useState<ReflectionPeriod | null>(null);
  const latestRequestIdRef = useRef<number>(0);

  const loadDevotional = useCallback(
    async (forceFresh: boolean) => {
      const cacheKey = getCacheKey(verse);
      const requestId = ++latestRequestIdRef.current;

      if (!forceFresh) {
        const cached = readCachedDevotional(cacheKey);
        if (cached) {
          setDevotional(cached);
          setError(null);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError(null);

      try {
        let promise: Promise<DailyDevotionalData>;
        const dedupeKey = forceFresh ? `${cacheKey}_${Date.now()}` : cacheKey;

        if (!forceFresh && inFlightRequests.has(cacheKey)) {
          promise = inFlightRequests.get(cacheKey)!;
        } else {
          const nonce = forceFresh ? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` : undefined;
          promise = fetchDevotionalFromServer(verse, mood, userName, nonce).finally(() => {
            inFlightRequests.delete(dedupeKey);
          });
          inFlightRequests.set(dedupeKey, promise);
        }

        const result = await promise;
        writeCachedDevotional(cacheKey, result);

        if (latestRequestIdRef.current === requestId) {
          setDevotional(result);
          setError(null);
        }
      } catch (err: any) {
        if (latestRequestIdRef.current === requestId) {
          setError(err?.message || 'Unable to generate prayer reflection right now.');
        }
      } finally {
        if (latestRequestIdRef.current === requestId) {
          setLoading(false);
        }
      }
    },
    [verse.id, verse.reference, verse.quote, mood, userName]
  );

  useEffect(() => {
    const cached = readCachedDevotional(getCacheKey(verse));
    if (cached) {
      setDevotional(cached);
      setError(null);
      setLoading(false);
    } else {
      setDevotional(null);
      loadDevotional(false);
    }
  }, [verse.id, verse.reference, verse.quote, loadDevotional]);

  const activeEntry = devotional ? devotional[period] : null;

  const handleCopyPrayer = async () => {
    if (!activeEntry) return;
    const formatted = `${activeEntry.title} (${period === 'morning' ? 'Morning' : 'Evening'} Prayer • ${verse.reference})\n\n${activeEntry.reflection}\n\nPrayer: ${activeEntry.prayer}`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedPeriod(period);
      setTimeout(() => setCopiedPeriod(null), 2000);
    } catch {
      // Clipboard might be unavailable in restricted contexts
    }
  };

  return (
    <section
      aria-label="Daily Prayer Reflection"
      className={`w-full rounded-2xl bg-white dark:bg-[#062016] border border-emerald-100 dark:border-emerald-900/70 shadow-xs overflow-hidden transition-colors ${
        compact ? 'p-3.5' : 'p-4'
      }`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white truncate">
              Daily Prayer Reflection
            </h2>
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5 truncate pl-7.5">
            {devotional?.themeTitle ? `${devotional.themeTitle} • ${verse.reference}` : `Rooted in ${verse.reference}`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadDevotional(true)}
          disabled={loading}
          title="Generate a fresh morning & evening devotional"
          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Writing' : 'New'}</span>
        </button>
      </div>

      {/* Morning / Evening Toggle */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-emerald-50/80 dark:bg-[#04170f] border border-emerald-100 dark:border-emerald-900/60 mb-3">
        <button
          type="button"
          onClick={() => setPeriod('morning')}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            period === 'morning'
              ? 'bg-white dark:bg-emerald-900/80 text-emerald-900 dark:text-white shadow-xs border border-emerald-200/80 dark:border-emerald-700/60'
              : 'text-emerald-800/70 dark:text-emerald-300/70 hover:text-emerald-900 dark:hover:text-emerald-100'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
          <span>Morning</span>
        </button>

        <button
          type="button"
          onClick={() => setPeriod('evening')}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            period === 'evening'
              ? 'bg-white dark:bg-emerald-900/80 text-emerald-900 dark:text-white shadow-xs border border-emerald-200/80 dark:border-emerald-700/60'
              : 'text-emerald-800/70 dark:text-emerald-300/70 hover:text-emerald-900 dark:hover:text-emerald-100'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
          <span>Evening</span>
        </button>
      </div>

      {/* Body */}
      {loading && !devotional && (
        <div className="py-5 px-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100/80 dark:border-emerald-900/40 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 animate-spin" />
          <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
            Preparing your morning &amp; evening reflection for {verse.reference}...
          </p>
        </div>
      )}

      {error && !loading && !devotional && (
        <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-700 dark:text-emerald-100 leading-relaxed">{error}</p>
            <button
              type="button"
              onClick={() => loadDevotional(true)}
              className="mt-2 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {error && devotional && !loading && (
        <div className="mb-2.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2">
          <span className="text-[11px] text-emerald-900 dark:text-emerald-200 truncate">{error}</span>
          <button
            type="button"
            onClick={() => loadDevotional(true)}
            className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline shrink-0 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {activeEntry && (
        <div className={`space-y-2.5 transition-opacity ${loading ? 'opacity-60' : 'opacity-100'}`}>
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                {activeEntry.title}
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {period === 'morning' ? 'Morning Light' : 'Evening Rest'}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-emerald-50/90">
              {activeEntry.reflection}
            </p>
          </div>

          {/* Highlighted Prayer Box */}
          <div className="rounded-xl bg-emerald-50/75 dark:bg-[#04170f] border border-emerald-100 dark:border-emerald-900/70 p-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {period === 'morning' ? 'Morning Prayer' : 'Evening Prayer'}
              </span>
              <button
                type="button"
                onClick={handleCopyPrayer}
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {copiedPeriod === period ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-serif italic text-xs leading-relaxed text-emerald-950 dark:text-emerald-100">
              “{activeEntry.prayer}”
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
