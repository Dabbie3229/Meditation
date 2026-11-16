import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  BIBLE_TRANSLATIONS,
  getBibleBooks,
  getBibleChapter,
  resolveTranslationMeta,
  searchFullBible,
} from './bibleService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolvePort(): number {
  const portFlagIdx = process.argv.indexOf('--port');
  if (portFlagIdx !== -1 && process.argv[portFlagIdx + 1]) {
    const cliPort = Number(process.argv[portFlagIdx + 1]);
    if (Number.isFinite(cliPort) && cliPort > 0) return cliPort;
  }
  const envPort = Number(process.env.PORT);
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev && (!envPort || (process.env.NGINX_PORT && envPort === Number(process.env.NGINX_PORT)))) {
    return Number(process.env.DEFAULT_APP_PORT) || 3000;
  }
  return envPort || 3000;
}

async function startServer() {
  const app = express();
  const PORT = resolvePort();

  app.use(express.json({ limit: '25mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // List all supported English Bible translations (KJV, NLT, MSG, ESV, NKJV, NASB, AMP, CSB, WEB, BSB, etc.)
  app.get('/api/bible/translations', (_req, res) => {
    res.json({
      translations: BIBLE_TRANSLATIONS,
      restrictedNotice:
        'NIV is copyright-restricted by Biblica and requires a commercial publisher license; 38 other complete English translations including KJV, NLT, MSG, ESV, NKJV, NASB, AMP, CSB, WEB, BSB, NET, and BBE are fully active.',
    });
  });

  // List all 66 books of the Bible (Genesis to Revelation)
  app.get('/api/bible/books', (req, res) => {
    try {
      const meta = resolveTranslationMeta(req.query.translation);
      const books = getBibleBooks();
      return res.json({ books, translation: meta.id });
    } catch (err: any) {
      console.error('Error in /api/bible/books:', err);
      return res.status(500).json({ error: 'Failed to load Bible books' });
    }
  });

  // Read any chapter of any book (Genesis 1 to Revelation 22) in any supported translation
  app.get('/api/bible/chapter', async (req, res) => {
    const book = typeof req.query.book === 'string' ? req.query.book.trim() : '';
    const chapter = Number(req.query.chapter) || 1;
    const rawTr = typeof req.query.translation === 'string' ? req.query.translation.trim() : 'KJV';

    if (rawTr.toUpperCase().startsWith('NIV')) {
      return res.status(403).json({
        error:
          'NIV is restricted by Biblica copyright on public Bible APIs. Please choose NLT, MSG, ESV, NKJV, CSB, BSB, or KJV.',
      });
    }

    if (!book) {
      return res.status(400).json({ error: 'Missing book parameter' });
    }

    try {
      const result = await getBibleChapter(book, chapter, rawTr);
      if (!result) {
        return res.status(404).json({ error: `Book or chapter "${book} ${chapter}" not found in ${rawTr}` });
      }
      return res.json(result);
    } catch (err: any) {
      console.error('Error in /api/bible/chapter:', err);
      return res.status(500).json({ error: 'Failed to load chapter' });
    }
  });

  // Full Bible search across all 66 books / 31,102 verses (references AND keywords) in any supported translation
  app.get('/api/bible-search', async (req, res) => {
    const rawQuery = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const rawTr = typeof req.query.translation === 'string' ? req.query.translation.trim() : 'KJV';
    const limit = Math.min(60, Math.max(1, Number(req.query.limit) || 40));

    if (rawTr.toUpperCase().startsWith('NIV')) {
      return res.status(403).json({
        found: false,
        error:
          'NIV is restricted by Biblica copyright on public Bible APIs. Please select NLT, MSG, ESV, NKJV, CSB, BSB, or KJV.',
      });
    }

    if (!rawQuery || rawQuery.length < 2) {
      return res.status(400).json({
        found: false,
        error: 'Please enter a Bible reference (e.g. Isaiah 26:1, John 3:16) or keyword.',
      });
    }

    try {
      const result = await searchFullBible(rawQuery, rawTr, limit);
      if (!result.found) {
        return res.status(404).json({
          ...result,
          error: `No verses matched "${rawQuery}". Try a reference like "Isaiah 26:1" or "John 3:16", or a word like "peace".`,
        });
      }
      return res.json(result);
    } catch (err: any) {
      console.error('Error in /api/bible-search:', err);
      return res.status(500).json({
        found: false,
        error: 'Failed to search the Bible.',
      });
    }
  });

  // Initialize Gemini client server-side
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // TTS Endpoint using gemini-3.8-flash-lite-tts with spiritual cadence & warm tone
  app.post('/api/tts', async (req, res) => {
    try {
      const { text, voiceName = 'Aoede', style, speed } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Missing text parameter' });
      }

      if (!ai && process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }

      if (!ai) {
        return res.status(503).json({ error: 'AI voice service unavailable - no API key configured' });
      }

      // Format Scripture text for maximum fluid smoothness and natural meditative melody
      let formattedText = text.trim();
      formattedText = formattedText
        .replace(/^[“"']|[”"']$/g, '')
        .replace(/\b(Psalm|Proverbs|John|Matthew|Romans|Jeremiah|Isaiah|Hebrews|Ephesians|Timothy|James)\s+\d+[:\d+]*/gi, '')
        .replace(/<breath>/gi, '')
        .replace(/\.{2,}/g, '.')
        .trim();

      // Ensure peaceful, lyrical cadence with gentle commas for smooth breath pauses
      if (formattedText.toLowerCase().includes('be still') && formattedText.toLowerCase().includes('god')) {
        formattedText = 'Be still, and know, that I am God.';
      }

      // Default to an ultra-silky, smooth, tranquil sanctuary whisper
      const defaultStyle =
        'Spoken with an exceptionally smooth, silky, gentle, and continuous soft whisper. Zero harshness, zero vocal fry, zero abrupt stops. Calm, tender, comforting, and spoken with seamless peaceful warmth and holy stillness.';
      const speechStyle = style
        ? `${style}. Exceptionally smooth, silky soft whisper, seamless tranquil cadence, zero vocal harshness.`
        : defaultStyle;

      // Map voice personas to valid Gemini TTS prebuilt voices ('Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr', 'Aoede')
      const voiceMapping: Record<string, string> = {
        seraphina: 'Aoede',
        miriam: 'Kore',
        eden: 'Zephyr',
        hannah: 'Aoede',
        abigail: 'Kore',
        selena: 'Zephyr',
        elijah: 'Charon',
        gabriel: 'Fenrir',
        david: 'Puck',
        solomon: 'Charon',
        samuel: 'Puck',
        malachi: 'Fenrir',
        aoede: 'Aoede',
        charon: 'Charon',
        fenrir: 'Fenrir',
        kore: 'Kore',
        zephyr: 'Zephyr',
        puck: 'Puck',
      };

      const resolvedVoice = voiceMapping[voiceName.toLowerCase()] || voiceName;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: formattedText,
                speechMetadata: {
                  style: speechStyle,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: resolvedVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        return res.status(500).json({ error: 'No audio returned from speech model' });
      }

      return res.json({
        audio: base64Audio,
        format: 'audio/wav',
        voice: resolvedVoice,
        text: formattedText,
      });
    } catch (err: any) {
      console.error('Error in /api/tts:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate voice' });
    }
  });

  // Voice personas catalog & status
  app.get('/api/voice-status', (_req, res) => {
    res.json({
      available: Boolean(process.env.GEMINI_API_KEY),
      defaultFeminine: 'seraphina',
      defaultMasculine: 'elijah',
      voices: [
        // Feminine Voices
        {
          id: 'seraphina',
          name: 'Seraphina • Sacred Sanctuary',
          gender: 'feminine',
          voiceName: 'Aoede',
          tone: 'Warm, compassionate sanctuary presence',
          badge: 'Sanctuary',
          description: 'A warm, soothing feminine voice that feels like a sacred sanctuary, peaceful and grounding.',
          stylePrompt: 'A warm, deeply comforting sanctuary voice spoken slowly with serene breath and holy stillness',
        },
        {
          id: 'miriam',
          name: 'Miriam • Feather Whisper',
          gender: 'feminine',
          voiceName: 'Kore',
          tone: 'Ultra-soft, slow, tranquil whisper',
          badge: 'Feather Soft',
          description: 'The gentlest feather-light whisper for resting deeply in God’s quiet presence.',
          stylePrompt: 'A barely audible, extremely gentle, feather-soft feminine sacred whisper, peaceful stillness, slow breath',
        },
        {
          id: 'eden',
          name: 'Eden • Celestial Breeze',
          gender: 'feminine',
          voiceName: 'Zephyr',
          tone: 'Floating, airy peace, quiet stillness',
          badge: 'Airy Breeze',
          description: 'Soft, airy and tranquil, drifting like a gentle breath of morning wind.',
          stylePrompt: 'A gentle, slow, breathy ethereal whisper floating quietly in meditation',
        },
        {
          id: 'hannah',
          name: 'Hannah • Tender Prayer',
          gender: 'feminine',
          voiceName: 'Aoede',
          tone: 'Quiet, reverent, humble prayer of faith',
          badge: 'Tender Prayer',
          description: 'A deeply sincere, intimate and heartfelt whispered prayer.',
          stylePrompt: 'A tender, deeply humble and quiet prayerful whisper spoken with reverence and peace',
        },
        {
          id: 'abigail',
          name: 'Abigail • Gentle Grace',
          gender: 'feminine',
          voiceName: 'Kore',
          tone: 'Calming, reassuring, peaceful consolation',
          badge: 'Gentle Grace',
          description: 'A soft, reassuring voice that calms restless thoughts and brings consolation.',
          stylePrompt: 'A soothing, tenderly reassuring whisper that calms anxiety and brings deep peace',
        },
        {
          id: 'selena',
          name: 'Selena • Pure Stillness',
          gender: 'feminine',
          voiceName: 'Zephyr',
          tone: 'Slow, relaxing, restorative bedtime cadence',
          badge: 'Deep Rest',
          description: 'A slow, serene bedtime whisper designed for total physical and mental relaxation.',
          stylePrompt: 'A very slow, relaxing, deeply restful whisper for holy sleep and peaceful meditation',
        },

        // Masculine Voices
        {
          id: 'elijah',
          name: 'Elijah • Gentle Shepherd',
          gender: 'masculine',
          voiceName: 'Charon',
          tone: 'Comforting, grounded, peaceful baritone',
          badge: 'Shepherd',
          description: 'A comforting masculine voice reciting scripture with quiet fatherly reassurance and calm.',
          stylePrompt: 'A comforting, deep, warm baritone spoken softly with quiet reassurance and peaceful stillness',
        },
        {
          id: 'gabriel',
          name: 'Gabriel • Cinematic Holy Echo',
          gender: 'masculine',
          voiceName: 'Fenrir',
          tone: 'Deep, resonant, subtle reverent echo',
          badge: 'Cinematic',
          description: 'Movie-like deep masculine presence echoing gently across quiet eternity.',
          stylePrompt: 'A slow, deep, subtle sacred masculine whisper, echoing gently in quiet reverence',
        },
        {
          id: 'david',
          name: 'David • Contemplative Heart',
          gender: 'masculine',
          voiceName: 'Puck',
          tone: 'Warm, sincere, contemplative friend',
          badge: 'Warm Friend',
          description: 'An intimate, authentic voice like meditating with a trusted friend in faith.',
          stylePrompt: 'A slow, gentle, comforting masculine whisper reciting scripture with peaceful heart',
        },
        {
          id: 'solomon',
          name: 'Solomon • Ancient Wisdom',
          gender: 'masculine',
          voiceName: 'Charon',
          tone: 'Deep, quiet, contemplative sacred presence',
          badge: 'Ancient Calm',
          description: 'A quiet, reflective voice conveying timeless biblical peace and steadfast faith.',
          stylePrompt: 'A very quiet, slow, deep contemplative whisper reflecting ancient biblical peace',
        },
        {
          id: 'samuel',
          name: 'Samuel • Still Small Voice',
          gender: 'masculine',
          voiceName: 'Puck',
          tone: 'Ultra-gentle, delicate, sacred whisper',
          badge: 'Still Voice',
          description: 'Reminiscent of 1 Kings 19:12—a still, small voice whispering God’s promises.',
          stylePrompt: 'An ultra-gentle, still small voice whisper, spoken softly and tenderly with sacred calm',
        },
        {
          id: 'malachi',
          name: 'Malachi • Evening Vesper',
          gender: 'masculine',
          voiceName: 'Fenrir',
          tone: 'Low, mellow, peaceful dusk reflection',
          badge: 'Evening Calm',
          description: 'A mellow, low-pitched dusk voice that settles the spirit at the end of the day.',
          stylePrompt: 'A low, mellow, calming masculine evening whisper, slow cadence and holy stillness',
        },
      ],
    });
  });

  // Daily Prayer Reflection Endpoint using Gemini AI (gemini-4-hydrogen)
  app.post('/api/devotional', async (req, res) => {
    try {
      const {
        reference,
        quote,
        mood,
        userName,
        refreshNonce,
      } = (req.body ?? {}) as {
        reference?: string;
        quote?: string;
        mood?: string;
        userName?: string;
        refreshNonce?: string | number;
      };

      const cleanReference = typeof reference === 'string' ? reference.trim() : '';
      const cleanQuote = typeof quote === 'string' ? quote.trim() : '';

      if (!cleanReference || !cleanQuote) {
        return res.status(400).json({ error: 'Please provide both a Bible verse reference and text.' });
      }

      if (!ai && process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }

      if (!ai) {
        return res.status(503).json({
          error: 'Gemini AI devotional service is unavailable. Add GEMINI_API_KEY in Settings > Secrets.',
        });
      }

      const todayLabel = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      const systemInstruction = [
        'You are a gentle, spiritually grounded Christian devotional guide.',
        'Create a brief, unique, deeply comforting morning and evening devotional anchored directly in the provided Bible verse.',
        'Voice & Tone: peaceful, reverent, warm, practical, Christ-centered, never preachy or repetitive.',
        'Length Rules (strictly follow):',
        '- themeTitle: 3 to 6 evocative words capturing the spiritual theme of the verse.',
        '- morning.title and evening.title: 3 to 6 words each.',
        '- morning.reflection: exactly 2 to 3 concise sentences focusing on waking intention, trust, and carrying the verse into the day.',
        '- morning.prayer: exactly 2 to 3 concise sentences written in first-person prayer ("Lord..." or "Father...").',
        '- evening.reflection: exactly 2 to 3 concise sentences focusing on releasing burdens, gratitude, and resting in God’s peace tonight.',
        '- evening.prayer: exactly 2 to 3 concise sentences written in first-person evening prayer.',
        'Never include markdown formatting, bullet points, or disclaimers inside the JSON string fields.',
      ].join('\n');

      const promptParts = [
        `Date: ${todayLabel}`,
        `Selected Scripture: ${cleanReference} — "${cleanQuote}"`,
        mood ? `Current Heart Focus / Mood: ${mood}` : null,
        userName ? `Reader Name (weave gently if natural, do not overuse): ${userName}` : null,
        refreshNonce ? `Fresh Reflection Variation Seed: ${refreshNonce}` : null,
        'Generate a fresh, unique morning and evening devotional rooted specifically in the wording and promise of this verse.',
      ].filter(Boolean);

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: promptParts.join('\n'),
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              themeTitle: {
                type: Type.STRING,
                description: '3 to 6 word spiritual theme title rooted in the verse.',
              },
              morning: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: 'Brief 3 to 6 word title for the morning devotional.',
                  },
                  reflection: {
                    type: Type.STRING,
                    description: '2 to 3 sentence morning reflection rooted in the selected verse.',
                  },
                  prayer: {
                    type: Type.STRING,
                    description: '2 to 3 sentence heartfelt morning prayer.',
                  },
                },
                required: ['title', 'reflection', 'prayer'],
              },
              evening: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: 'Brief 3 to 6 word title for the evening devotional.',
                  },
                  reflection: {
                    type: Type.STRING,
                    description: '2 to 3 sentence evening reflection rooted in the selected verse.',
                  },
                  prayer: {
                    type: Type.STRING,
                    description: '2 to 3 sentence peaceful evening prayer.',
                  },
                },
                required: ['title', 'reflection', 'prayer'],
              },
            },
            required: ['themeTitle', 'morning', 'evening'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        return res.status(502).json({ error: 'Gemini returned an empty devotional response. Please try again.' });
      }

      const cleanedJson = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleanedJson);

      if (
        !parsed?.themeTitle ||
        !parsed?.morning?.reflection ||
        !parsed?.morning?.prayer ||
        !parsed?.evening?.reflection ||
        !parsed?.evening?.prayer
      ) {
        return res.status(502).json({ error: 'Received an incomplete devotional structure. Please regenerate.' });
      }

      return res.json({
        devotional: parsed,
        reference: cleanReference,
        model: 'gemini-4-hydrogen',
        generatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Error in /api/devotional:', err);
      const status = Number(err?.status) || Number(err?.code) || 500;
      const msg = String(err?.message || 'Failed to generate daily prayer reflection');

      if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED') || status === 401 || status === 403) {
        return res.status(403).json({
          error: 'Gemini API key permission issue. Please verify your GEMINI_API_KEY in Settings > Secrets.',
        });
      }
      if (msg.includes('RESOURCE_EXHAUSTED') || status === 429) {
        return res.status(429).json({
          error: 'Gemini API rate limit or quota reached. Please pause briefly or check billing in Settings > Secrets.',
        });
      }

      return res.status(status >= 400 && status < 600 ? status : 500).json({
        error: msg,
      });
    }
  });

  const buildChatConfig = (params: {
    rolePersona?: string;
    speedMode?: string;
    verseContext?: { reference?: string; quote?: string; mood?: string };
    userName?: string;
  }) => {
    const roleInstructions: Record<string, string> = {
      friend:
        'You are a warm, genuine, empathetic friend and spiritual companion. Talk naturally like a caring person—relaxed, human, relatable, never robotic, preachy, or formulaic. Meet the user wherever they are: whether chatting casually about their day, venting stress, wrestling with doubt, celebrating joy, or asking about God. Only quote a Bible verse when it naturally helps or when they ask, and keep the conversation flowing two-way.',
      pastoral:
        'You are a warm, compassionate friend and spiritual guide. Talk naturally and empathetically, helping the user connect everyday life, feelings, and decisions with grace and Scripture in a relaxed, conversational voice.',
      scholar:
        'You are a friendly, insightful Biblical study companion. Explain historical context, original language nuance, and Scripture connections in clear, natural everyday English without sounding stiff or academic.',
      prayer:
        'You are a caring prayer friend. Listen attentively to what is on the user’s heart, respond naturally with warmth, and pray with them personally as if sitting beside them.',
      listener:
        'You are a gentle, calm Christian listener. Help the user breathe, talk freely without judgment, and find quiet peace.',
    };

    const roleKey = params.rolePersona || 'friend';
    const contextLines = [
      roleInstructions[roleKey] || roleInstructions.friend,
      params.userName ? `You are speaking with ${params.userName}. Use their name only occasionally when natural.` : null,
      params.verseContext?.reference && params.verseContext?.quote
        ? `Their currently highlighted verse in the app is ${params.verseContext.reference} ("${params.verseContext.quote}")${
            params.verseContext.mood ? ` and their mood tag is ${params.verseContext.mood}` : ''
          }. Only reference it if relevant to what they bring up—let them lead the topic naturally.`
        : null,
      'Keep replies concise and natural (usually 1 to 3 short paragraphs, no bullet-list dumps unless asked). Never fabricate Bible quotes.',
    ].filter(Boolean);

    const selectedModel = params.speedMode === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-4-hydrogen';
    const chatConfig: Record<string, any> = {
      systemInstruction: contextLines.join('\n'),
    };
    if (selectedModel === 'gemini-4-hydrogen') {
      chatConfig.thinkingConfig = {
        thinkingLevel: params.speedMode === 'deep' ? ThinkingLevel.HIGH : ThinkingLevel.LOW,
      };
    }

    return { selectedModel, chatConfig };
  };

  const sanitizeChatHistory = (history: unknown) =>
    Array.isArray(history)
      ? history
          .filter(
            (item: any) =>
              item &&
              (item.role === 'user' || item.role === 'model') &&
              typeof item.text === 'string' &&
              item.text.trim().length > 0
          )
          .slice(-24)
          .map((item: any) => ({
            role: item.role as 'user' | 'model',
            parts: [{ text: item.text.trim() }],
          }))
      : [];

  // Multi-turn Gemini Natural Companion Chatbot Endpoint (Unary)
  app.post('/api/chat', async (req, res) => {
    try {
      const {
        message,
        history = [],
        rolePersona = 'friend',
        speedMode = 'balanced',
        verseContext,
        userName,
      } = (req.body ?? {}) as {
        message?: string;
        history?: Array<{ role: 'user' | 'model'; text: string }>;
        rolePersona?: 'friend' | 'pastoral' | 'scholar' | 'prayer' | 'listener';
        speedMode?: 'balanced' | 'deep' | 'fast';
        verseContext?: { reference?: string; quote?: string; mood?: string };
        userName?: string;
      };

      const cleanMessage = typeof message === 'string' ? message.trim() : '';
      if (!cleanMessage) {
        return res.status(400).json({ error: 'Please enter a message to continue the conversation.' });
      }

      if (!ai && process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }

      if (!ai) {
        return res.status(503).json({
          error: 'Gemini chat service is unavailable. Configure GEMINI_API_KEY in Settings > Secrets.',
        });
      }

      const { selectedModel, chatConfig } = buildChatConfig({
        rolePersona,
        speedMode,
        verseContext,
        userName,
      });

      const chat = ai.chats.create({
        model: selectedModel,
        history: sanitizeChatHistory(history),
        config: chatConfig,
      });

      const response = await chat.sendMessage({
        message: cleanMessage,
      });

      const replyText = (response.text ?? '').trim();
      if (!replyText) {
        return res.status(502).json({ error: 'Gemini returned an empty reply. Please try sending again.' });
      }

      return res.json({
        reply: replyText,
        model: selectedModel,
        rolePersona,
      });
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      const status = Number(err?.status) || Number(err?.code) || 500;
      const msg = String(err?.message || 'Failed to generate chat response');

      if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED') || status === 401 || status === 403) {
        return res.status(403).json({
          error: 'Gemini API key permission error. Check your GEMINI_API_KEY in Settings > Secrets.',
        });
      }
      if (msg.includes('RESOURCE_EXHAUSTED') || status === 429) {
        return res.status(429).json({
          error: 'Gemini API rate limit or quota reached. Please wait a moment or check Settings > Secrets.',
        });
      }

      return res.status(status >= 400 && status < 600 ? status : 500).json({ error: msg });
    }
  });

  // Streaming Multi-turn Gemini Natural Companion Endpoint (SSE)
  app.post('/api/chat/stream', async (req, res) => {
    try {
      const {
        message,
        history = [],
        rolePersona = 'friend',
        speedMode = 'balanced',
        verseContext,
        userName,
      } = (req.body ?? {}) as {
        message?: string;
        history?: Array<{ role: 'user' | 'model'; text: string }>;
        rolePersona?: 'friend' | 'pastoral' | 'scholar' | 'prayer' | 'listener';
        speedMode?: 'balanced' | 'deep' | 'fast';
        verseContext?: { reference?: string; quote?: string; mood?: string };
        userName?: string;
      };

      const cleanMessage = typeof message === 'string' ? message.trim() : '';
      if (!cleanMessage) {
        return res.status(400).json({ error: 'Please type or speak a message first.' });
      }

      if (!ai && process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }

      if (!ai) {
        return res.status(503).json({
          error: 'Chat service is unavailable. Configure GEMINI_API_KEY in Settings > Secrets.',
        });
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      const { selectedModel, chatConfig } = buildChatConfig({
        rolePersona,
        speedMode,
        verseContext,
        userName,
      });

      const chat = ai.chats.create({
        model: selectedModel,
        history: sanitizeChatHistory(history),
        config: chatConfig,
      });

      const stream = await chat.sendMessageStream({
        message: cleanMessage,
      });

      for await (const chunk of stream) {
        const delta = chunk.text || '';
        if (delta) {
          res.write(`data: ${JSON.stringify({ delta })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      return res.end();
    } catch (err: any) {
      console.error('Error in /api/chat/stream:', err);
      const msg = String(err?.message || 'Unable to stream response right now.');
      let friendly = msg;
      if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED')) {
        friendly = 'API key permission error. Please check GEMINI_API_KEY in Settings > Secrets.';
      } else if (msg.includes('RESOURCE_EXHAUSTED')) {
        friendly = 'Rate limit reached briefly. Please pause a moment and try again.';
      }

      if (!res.headersSent) {
        return res.status(500).json({ error: friendly });
      }
      res.write(`data: ${JSON.stringify({ error: friendly })}\n\n`);
      return res.end();
    }
  });

  // Audio Transcription Endpoint using gemini-3.5-transcribe
  app.post('/api/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType = 'audio/webm', contextHint } = (req.body ?? {}) as {
        audioBase64?: string;
        mimeType?: string;
        contextHint?: string;
      };

      if (!audioBase64 || typeof audioBase64 !== 'string') {
        return res.status(400).json({ error: 'Missing recorded audio data.' });
      }

      if (!ai && process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }

      if (!ai) {
        return res.status(503).json({
          error: 'Audio transcription service is unavailable. Configure GEMINI_API_KEY in Settings > Secrets.',
        });
      }

      // Strip any data URL prefix if present and normalize mime type (drop codec parameters like ";codecs=opus")
      const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/i, '').trim();
      const normalizedMime = String(mimeType || 'audio/webm').split(';')[0].trim() || 'audio/webm';

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: normalizedMime,
                data: cleanBase64,
              },
            },
            {
              text: 'Transcribe this audio.',
            },
          ],
        },
      });

      const partText =
        response.candidates?.[0]?.content?.parts
          ?.map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
          .join('')
          .trim() || '';
      const rawTranscript = (response.text ?? partText ?? '').trim();

      if (!rawTranscript) {
        console.warn('Empty transcript from gemini-3.5-transcribe:', {
          mime: normalizedMime,
          bytes: cleanBase64.length,
          contextHint,
          finishReason: response.candidates?.[0]?.finishReason,
          parts: response.candidates?.[0]?.content?.parts,
        });
        return res.status(422).json({
          error: 'Could not detect clear speech in the recording. Please try speaking closer to the microphone.',
        });
      }

      return res.json({
        transcript: rawTranscript,
        model: 'gemini-3.5-transcribe',
      });
    } catch (err: any) {
      console.error('Error in /api/transcribe:', err);
      const status = Number(err?.status) || Number(err?.code) || 500;
      const msg = String(err?.message || 'Failed to transcribe audio');

      if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED') || status === 401 || status === 403) {
        return res.status(403).json({
          error: 'Gemini API key permission error. Check your GEMINI_API_KEY in Settings > Secrets.',
        });
      }
      if (msg.includes('RESOURCE_EXHAUSTED') || status === 429) {
        return res.status(429).json({
          error: 'Gemini API quota reached during transcription. Please try again shortly.',
        });
      }

      return res.status(status >= 400 && status < 600 ? status : 500).json({ error: msg });
    }
  });

  // Serve static assets or mount Vite in dev
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vitePromise = createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use((req, res, next) => {
      vitePromise
        .then((vite) => vite.middlewares(req, res, next))
        .catch(next);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
