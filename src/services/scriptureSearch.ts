import { Verse } from '../types';
import {
  TODAY_VERSE,
  MOOD_SCRIPTURES,
  SCRIPTURE_COLLECTION,
  EXTRA_SCRIPTURES,
} from '../data/scriptures';

export type BibleTranslation = string;

export interface BibleTranslationMeta {
  id: string;
  shortName: string;
  fullName: string;
  featured?: boolean;
  source: 'local' | 'bolls';
  description: string;
}

export const DEFAULT_FEATURED_TRANSLATIONS: BibleTranslationMeta[] = [
  { id: 'KJV', shortName: 'KJV', fullName: 'King James Version', featured: true, source: 'local', description: 'Classic 1769 Authorized Version' },
  { id: 'NLT', shortName: 'NLT', fullName: 'New Living Translation', featured: true, source: 'bolls', description: 'Warm, clear everyday modern English' },
  { id: 'MSG', shortName: 'MSG', fullName: 'The Message', featured: true, source: 'bolls', description: 'Contemporary conversational paraphrase' },
  { id: 'NKJV', shortName: 'NKJV', fullName: 'New King James Version', featured: true, source: 'bolls', description: 'Modernized classic reverence' },
  { id: 'ESV', shortName: 'ESV', fullName: 'English Standard Version', featured: true, source: 'bolls', description: 'Essentially literal modern translation' },
  { id: 'NASB', shortName: 'NASB', fullName: 'New American Standard Bible (1995)', featured: true, source: 'bolls', description: 'Word-for-word precision' },
  { id: 'AMP', shortName: 'AMP', fullName: 'Amplified Bible', featured: true, source: 'bolls', description: 'Expanded meanings & nuance' },
  { id: 'CSB17', shortName: 'CSB', fullName: 'Christian Standard Bible', featured: true, source: 'bolls', description: 'Optimal equivalence, clear & faithful' },
  { id: 'WEB', shortName: 'WEB', fullName: 'World English Bible', featured: true, source: 'bolls', description: 'Modern public domain English' },
  { id: 'BSB', shortName: 'BSB', fullName: 'Berean Standard Bible', featured: true, source: 'bolls', description: 'Clean, smooth contemporary English' },
  { id: 'NET', shortName: 'NET', fullName: 'New English Translation', featured: true, source: 'bolls', description: 'Scholarly modern English' },
  { id: 'BBE', shortName: 'BBE', fullName: 'Bible in Basic English', featured: true, source: 'local', description: 'Simple, accessible English' },
];

export interface BibleBookMeta {
  index: number;
  name: string;
  testament: 'OT' | 'NT';
  chapterCount: number;
  verseCount: number;
}

export interface BibleChapterVerse {
  verse: number;
  text: string;
  normalized: Verse;
}

export interface BibleChapterData {
  book: string;
  bookIndex: number;
  testament: 'OT' | 'NT';
  chapter: number;
  totalChapters: number;
  translation: string;
  translationShortName?: string;
  translationName: string;
  verses: BibleChapterVerse[];
}

export interface BibleLookupResult {
  found: boolean;
  mode?: 'reference' | 'chapter' | 'book' | 'keyword';
  verse?: Verse;
  matches?: Verse[];
  totalMatches?: number;
  translation?: string;
  translationName?: string;
  error?: string;
}

const RECENT_VERSES_KEY = 'meditate_recent_searched_verses';
const TRANSLATION_PREF_KEY = 'meditate_bible_translation';
const MAX_RECENT_VERSES = 12;

export function getSavedBibleTranslation(): string {
  try {
    const saved = localStorage.getItem(TRANSLATION_PREF_KEY);
    if (saved && saved.trim()) return saved.trim().toUpperCase();
  } catch {
    // ignore
  }
  return 'KJV';
}

export function saveBibleTranslation(translationId: string): void {
  try {
    localStorage.setItem(TRANSLATION_PREF_KEY, translationId.trim().toUpperCase());
  } catch {
    // ignore
  }
}

export function getTranslationDisplayLabel(
  id: string,
  catalog: BibleTranslationMeta[] = DEFAULT_FEATURED_TRANSLATIONS
): string {
  const found = catalog.find((t) => t.id.toUpperCase() === id.toUpperCase());
  return found ? found.shortName : id.toUpperCase();
}

export function getRecentSearchedVerses(): Verse[] {
  try {
    const raw = localStorage.getItem(RECENT_VERSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecentSearchedVerse(verse: Verse): void {
  try {
    const existing = getRecentSearchedVerses().filter(
      (v) => v.id !== verse.id && v.reference.toLowerCase() !== verse.reference.toLowerCase()
    );
    const updated = [verse, ...existing].slice(0, MAX_RECENT_VERSES);
    localStorage.setItem(RECENT_VERSES_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

export function getAllLocalVerses(): Verse[] {
  const combined: Verse[] = [
    ...getRecentSearchedVerses(),
    TODAY_VERSE,
    ...Object.values(MOOD_SCRIPTURES).flat(),
    ...Object.values(SCRIPTURE_COLLECTION).flat(),
    ...EXTRA_SCRIPTURES,
  ];

  const seenRefs = new Set<string>();
  const deduped: Verse[] = [];
  for (const v of combined) {
    const key = v.reference.toLowerCase().trim();
    if (!seenRefs.has(key)) {
      seenRefs.add(key);
      deduped.push(v);
    }
  }
  return deduped;
}

export function searchLocalVerses(query: string): Verse[] {
  const cleaned = query.trim().toLowerCase();
  if (!cleaned) return [];

  const tokens = cleaned.split(/\s+/).filter(Boolean);
  const all = getAllLocalVerses();

  const scored: { verse: Verse; score: number }[] = [];

  for (const v of all) {
    const refLower = v.reference.toLowerCase();
    const bookLower = v.book.toLowerCase();
    const catLower = v.category.toLowerCase();
    const quoteLower = v.quote.toLowerCase();
    const haystack = `${refLower} ${bookLower} ${catLower} ${quoteLower}`;

    const allMatch = tokens.every((t) => haystack.includes(t));
    if (!allMatch) continue;

    let score = 0;
    if (refLower === cleaned) score += 100;
    else if (refLower.startsWith(cleaned)) score += 60;
    else if (refLower.includes(cleaned)) score += 45;

    if (bookLower.startsWith(cleaned)) score += 30;
    if (catLower.includes(cleaned)) score += 25;
    if (quoteLower.includes(cleaned)) score += 15;

    scored.push({ verse: v, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((item) => item.verse);
}

export function looksLikeBibleReference(query: string): boolean {
  const q = query.trim();
  if (q.length < 3) return false;
  return /^(?:[1-3]\s*)?[a-zA-Z]{2,}(?:\s+[a-zA-Z]+)*\s+\d+(?:(?::|\s+|\.)\d+(?:\s*[-–]\s*\d+)?)?$/.test(
    q
  );
}

let cachedTranslations: BibleTranslationMeta[] | null = null;

export async function fetchAvailableTranslations(): Promise<BibleTranslationMeta[]> {
  if (cachedTranslations) return cachedTranslations;
  try {
    const res = await fetch('/api/bible/translations');
    if (!res.ok) return DEFAULT_FEATURED_TRANSLATIONS;
    const data = (await res.json()) as { translations?: BibleTranslationMeta[] };
    if (data.translations && data.translations.length > 0) {
      cachedTranslations = data.translations;
      return cachedTranslations;
    }
  } catch {
    // fallback
  }
  return DEFAULT_FEATURED_TRANSLATIONS;
}

export async function searchFullBibleApi(
  query: string,
  translation: BibleTranslation = 'KJV',
  limit = 40
): Promise<BibleLookupResult> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return {
      found: false,
      error: 'Please enter at least 2 characters (e.g. Isaiah 26:1, John 3:16, peace).',
    };
  }

  try {
    const res = await fetch(
      `/api/bible-search?q=${encodeURIComponent(trimmed)}&translation=${encodeURIComponent(
        translation
      )}&limit=${limit}`
    );
    const data = (await res.json()) as BibleLookupResult;
    if (!res.ok || !data.found) {
      return {
        found: false,
        matches: [],
        error: data.error || 'No matching verses found in the Bible.',
      };
    }

    if (data.verse && data.mode === 'reference') {
      saveRecentSearchedVerse(data.verse);
    }
    return data;
  } catch {
    return {
      found: false,
      matches: [],
      error: 'Could not reach the Bible search service right now.',
    };
  }
}

export const lookupBibleReference = searchFullBibleApi;

export async function fetchBibleBooks(
  translation: BibleTranslation = 'KJV'
): Promise<BibleBookMeta[]> {
  const res = await fetch(`/api/bible/books?translation=${encodeURIComponent(translation)}`);
  if (!res.ok) {
    throw new Error('Failed to load Bible books');
  }
  const data = (await res.json()) as { books: BibleBookMeta[] };
  return data.books || [];
}

export async function fetchBibleChapter(
  book: string,
  chapter: number,
  translation: BibleTranslation = 'KJV'
): Promise<BibleChapterData> {
  const res = await fetch(
    `/api/bible/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}&translation=${encodeURIComponent(
      translation
    )}`
  );
  if (!res.ok) {
    throw new Error(`Failed to load ${book} ${chapter}`);
  }
  return (await res.json()) as BibleChapterData;
}
