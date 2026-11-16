# Meditate on the Word

Daily Christian Scripture meditation, full 66-book Bible reading & search across 38 English translations, AI-powered morning & evening prayer reflections, natural streaming AI companion chat, microphone voice transcription, and gentle acoustic piano meditation audio—styled in a serene **Green & White** sanctuary theme.

---

## Key Features

### 1. Complete Holy Bible (Genesis to Revelation) & 38 Translations
- **All 66 Books, 31,100+ Verses**: Read any chapter from Genesis 1 to Revelation 22 and search by exact reference (e.g., `Isaiah 26:1`, `John 3:16`, `Psalm 23:1-3`) or keyword across the entire Bible.
- **38 Active English Translations**: Includes **KJV** and **BBE** locally bundled for instant offline/zero-latency access, plus **NLT**, **MSG** (The Message), **NKJV**, **ESV**, **NASB**, **AMP**, **CSB**, **WEB**, **BSB**, **NET**, **CEB**, **GNTD**, **ASV**, **RSV**, **LSB**, **MEV**, **CEVD**, **YLT**, and more via server-side caching. *(Note: NIV is copyright-restricted by Biblica and displays an explanatory notice.)*

### 2. Daily Prayer Reflection (Gemini AI)
- Automatically generates a unique **Morning** and **Evening** devotional (reflection + heartfelt first-person prayer) anchored to your currently selected Scripture verse and mood focus (`POST /api/devotional` using `gemini-4-hydrogen`).
- Defaults to Morning or Evening based on local time, caches daily devotionals per verse in `localStorage`, and supports one-tap **New** regeneration and **Copy** prayer actions.

### 3. Natural Sanctuary AI Companion Chat (Streaming + Voice)
- Dedicated full-screen **AI Chat** tab (`CompanionScreen`) designed for relaxed, natural two-way conversation across everyday life, faith questions, prayer, and Scripture study.
- **Real-Time SSE Streaming** (`POST /api/chat/stream`) for immediate word-by-word replies using `gemini-4-hydrogen` (and `gemini-3.1-flash-lite` in fast mode on `/api/chat`).
- **Conversation Styles**: Switch between *Just Chat*, *Prayer*, *Bible Study*, and *Quiet Space* with persistent multi-turn history.
- **Two-Way Voice Support**: Speak naturally via microphone transcription and optionally toggle **Voice On** (or tap **Listen** on any message) to hear replies spoken aloud.

### 4. Microphone Audio Transcription (`gemini-3.5-transcribe`)
- Real browser `MediaRecorder` capture (`useAudioTranscriber`) paired with `POST /api/transcribe` (`gemini-3.5-transcribe`).
- Integrated into both the **AI Chat** composer (with optional auto-send when recording stops) and the **Session Complete** journaling prompt (**Speak & Transcribe**).

### 5. Real Acoustic Piano Music & Scripture Voice Studio
- **Acoustic Grand Piano & Contemplative Keys**: Curated quiet piano tracks (*Gymnopédie No. 1*, *Clair de Lune*, *Moonlight Sonata*, Chopin Nocturnes, Schubert, Scriabin) calibrated at gentle prayer volumes, plus custom MP3/WAV uploads saved privately in browser IndexedDB (`soundStorage.ts`).
- **Scripture Voice Studio**: 12 voice personas (6 feminine, 6 masculine) powered by `POST /api/tts` (`gemini-3.8-flash-lite-tts`) with softness levels, independent music/voice volume sliders, and client-side fallback.
- **Guided Meditation Player**: Animated breathing pacer, configurable session durations (3–30 min), streak tracking, and dark/light **Green & White** themes.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion, Lucide React
- **Backend**: Express.js (`node server.ts` on Node 22 native TypeScript strip-types), Vite dev middleware
- **AI SDK**: `@google/genai` (server-side only):
  - `gemini-4-hydrogen` — Daily Prayer Reflections & streaming multi-turn companion chat
  - `gemini-3.1-flash-lite` — Fast-mode chat responses
  - `gemini-3.5-transcribe` — Pre-recorded microphone audio transcription
  - `gemini-3.8-flash-lite-tts` — Guided Scripture voice synthesis
- **Bible Data**: Local JSON (`data/bible/kjv.json`, `data/bible/bbe.json`) + `bibleService.ts` live translation fetcher & cache

---

## Project Structure

```text
├── .env.example                       # Environment variable template (GEMINI_API_KEY, APP_URL)
├── bibleService.ts                    # Full 66-book Bible index, parser, search & 38 translations
├── index.html                         # HTML entry point and page metadata
├── metadata.json                      # App capabilities & microphone frame permission
├── package.json                       # Scripts and dependencies
├── server.ts                          # Express API routes (/api/bible/*, /api/chat*, /api/devotional, /api/transcribe, /api/tts)
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite + Tailwind CSS v4 configuration
├── data/
│   └── bible/
│       ├── kjv.json                   # Complete King James Version (66 books, 31,102 verses)
│       └── bbe.json                   # Complete Bible in Basic English (66 books, 31,104 verses)
└── src/
    ├── main.tsx                       # Client entry point
    ├── App.tsx                        # Root state, navigation, phone frame & showcase view
    ├── index.css                      # Global Tailwind CSS v4 styles
    ├── types.ts                       # Shared TypeScript interfaces and screen/tab types
    ├── data/
    │   ├── scriptures.ts              # Curated moods, topical categories & featured verses
    │   └── soundsCatalog.ts           # Ambient piano track metadata
    ├── hooks/
    │   └── useAudioTranscriber.ts     # MediaRecorder capture + /api/transcribe hook
    ├── services/
    │   ├── audioEngine.ts             # Web Audio playback, filtering & breathing cue engine
    │   ├── narrationEngine.ts         # TTS narration playback & fallback manager
    │   ├── scriptureSearch.ts         # Client Bible search, translation storage & chapter loader
    │   └── soundStorage.ts            # IndexedDB storage for custom uploaded meditation audio
    └── components/
        ├── DailyPrayerReflection.tsx  # Gemini AI Morning & Evening devotional card
        ├── ErrorBoundary.tsx          # React error boundary
        ├── ShowcaseGrid.tsx           # 10-screen interactive gallery overview
        ├── modals/
        │   ├── BibleTranslationPickerModal.tsx
        │   ├── ScriptureSearchModal.tsx
        │   ├── SoundCatalogModal.tsx
        │   └── VoiceStudioModal.tsx
        ├── navigation/
        │   ├── BottomTabBar.tsx       # 6-tab bar (Home, Bible, AI Chat, Explore, Progress, Settings)
        │   └── TopStatusBar.tsx
        └── screens/
            ├── WelcomeScreen.tsx
            ├── PreferencesScreen.tsx
            ├── HomeScreen.tsx
            ├── BibleScreen.tsx        # Full 66-book chapter reader & translation switcher
            ├── CompanionScreen.tsx    # Streaming AI companion chat & voice conversation
            ├── PlayerScreen.tsx       # Meditation player & breathing timer
            ├── SessionCompleteScreen.tsx # Post-session journaling & voice transcription
            ├── ExploreScreen.tsx
            ├── ProgressScreen.tsx
            └── SettingsScreen.tsx
```

---

## API Endpoints (`server.ts`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check (`{ ok: true }`) |
| `GET` | `/api/bible/translations` | Lists all 38 supported English translations |
| `GET` | `/api/bible/books` | Lists all 66 Bible books (`Genesis` – `Revelation`) |
| `GET` | `/api/bible/chapter` | Fetches a book chapter (`?book=&chapter=&translation=`) |
| `GET` | `/api/bible-search` | Searches references or keywords across the full Bible (`?q=&translation=`) |
| `POST` | `/api/devotional` | Generates structured Morning & Evening devotionals via `gemini-4-hydrogen` |
| `POST` | `/api/chat` | Multi-turn Gemini chat (`gemini-4-hydrogen` / `gemini-3.1-flash-lite`) |
| `POST` | `/api/chat/stream` | Real-time SSE streaming multi-turn companion chat |
| `POST` | `/api/transcribe` | Transcribes base64 microphone audio via `gemini-3.5-transcribe` |
| `POST` | `/api/tts` | Generates Scripture speech audio via `gemini-3.8-flash-lite-tts` |
| `GET` | `/api/voice-status` | Returns voice persona catalog & availability |

---

## Getting Started

### Prerequisites
- Node.js 22+ (runs `server.ts` natively with `node server.ts`)
- npm 9+

### Setup & Run

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Copy `.env.example` to `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   PORT=3000
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Type-check & build for production**
   ```bash
   npm run lint
   npm run build
   npm run start
   ```
