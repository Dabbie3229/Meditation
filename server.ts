import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

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

  // Serve static assets or mount Vite in dev
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
