# Meditate on the Word

Daily Christian Scripture meditation web application featuring genuine studio-recorded acoustic grand piano music, customizable voice whisper narration, and guided prayer reflection routines.

---

## Overview

**Meditate on the Word** provides an environment for daily contemplative Scripture reading and prayer. The app combines:

- **Real Acoustic Piano & Keyboard Music**: Genuine, studio-recorded acoustic grand piano music (Erik Satie, Claude Debussy, Chopin, Beethoven, Schubert) playing at gentle, quiet volumes designed specifically to accompany Christian prayer without distraction.
- **Custom Sound Uploads**: Private on-device IndexedDB storage allowing users to upload and play their own meditation MP3 and WAV audio files.
- **YouTube & Free Audio Guide**: Curated recommendations and 1-click searches for peaceful piano and worship instrumental tracks.
- **Scripture Voice Studio**: Whisper narration with 12 distinct voices (6 feminine, 6 masculine) powered by Google Gemini TTS with acoustic low-pass filtering.
- **Guided Breath Pacer**: Synchronized rhythmic visual pacer (Inhale, Hold, Exhale, Rest) with adjustable session timers and reflection prompts.

---

## Core Features

### 1. Real Acoustic Piano Engine
- Features real studio-recorded acoustic piano recordings on real instruments (no electronic or synthetic sounds).
- Curated masterworks: *Gymnopédie No. 1*, *Clair de Lune*, *Moonlight Sonata (Adagio)*, *Chopin Nocturne Op. 9 No. 2*, *Chopin Nocturne in C# Minor*, *Gnossienne No. 1*, and *Schubert Andante*.
- Gentle, whisper-soft default volume calibration (0.32) that never overpowers or distracts from prayer.
- Smooth crossfades when starting, pausing, or changing tracks.
- Full support for user-uploaded MP3/WAV files stored permanently in browser IndexedDB.

### 2. Scripture Voice Studio
- **12 Voice Personas**:
  - *Feminine*: Seraphina, Miriam, Eden, Hannah, Abigail, Selena.
  - *Masculine*: Elijah, Gabriel, David, Solomon, Samuel, Malachi.
- **Softness Modes**: Feather Soft, Mild & Still, Gentle Breath.
- **Dedicated Volume Controls**: Independent volume sliders for whisper voice and ambient background music.
- **Quick Controls**: Instant switch between voice meditation and music-only meditation.

### 3. Guided Meditation & Prayer Routines
- Multi-phase contemplation sequence: Stillness, Scripture Listening, Deep Reflection, and Prayerful Surrender.
- Configurable meditation timer (3, 5, 10, 15, 20, or 30 minutes).
- Fullscreen distraction-free mode with an animated breathing guide.

### 4. Scripture Catalog & Tracking
- Curated passages categorized across themes such as Peace, Anxiety, Healing, Trust, Evening Rest, and Gratitude.
- Daily verse recommendations and scripture search.
- Session streak tracker and personal meditation notes.

---

## Technical Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion), Lucide React
- **Audio Processing**: Web Audio API (custom oscillators, biquad filter nodes, algorithmic impulse response reverb)
- **Backend**: Express.js with `tsx` serving API routes and proxying Vite development middleware
- **Voice Synthesis**: `@google/genai` (Gemini Flash TTS endpoint) with client-side Web Speech API fallback

---

## Project Structure

```text
├── index.html                   # HTML entry point and global styling
├── metadata.json                # Project configuration and capabilities
├── package.json                 # Scripts and package dependencies
├── server.ts                    # Express server handling TTS and Vite middlewares
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
└── src/
    ├── main.tsx                 # Client application entry point
    ├── App.tsx                  # Root component and screen routing
    ├── index.css                # Tailwind CSS v4 directives
    ├── types.ts                 # Shared data models and interfaces
    ├── components/
    │   ├── ErrorBoundary.tsx    # Application error handling boundary
    │   ├── ShowcaseGrid.tsx     # Scripture card showcase view
    │   ├── modals/
    │   │   ├── SoundCatalogModal.tsx  # Ambient soundscape picker
    │   │   └── VoiceStudioModal.tsx   # Voice persona and whisper controls
    │   ├── navigation/
    │   │   └── BottomNav.tsx          # Navigation controls
    │   └── screens/
    │       ├── HomeScreen.tsx         # Dashboard and daily verse
    │       ├── PlayerScreen.tsx       # Active meditation player and controls
    │       ├── ExploreScreen.tsx      # Topical scripture library
    │       ├── ProgressScreen.tsx     # Streak counter and session history
    │       ├── PreferencesScreen.tsx  # Sound and voice presets
    │       ├── SettingsScreen.tsx     # General application settings
    │       ├── SessionCompleteScreen.tsx # Post-meditation reflection
    │       └── WelcomeScreen.tsx      # Onboarding introduction
    ├── data/
    │   ├── scriptures.ts        # Database of scripture meditation passages
    │   └── soundsCatalog.ts     # Metadata for procedural soundscapes
    └── services/
        ├── audioEngine.ts       # Procedural 432 Hz synthesizer and audio chain
        └── narrationEngine.ts   # TTS client dispatch and audio processing
```

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Optional: Set your Gemini API key in a `.env` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
   *Note: If no API key is supplied, the application automatically uses the client-side Web Speech whisper processing engine.*

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

4. Type-check and lint:
   ```bash
   npm run lint
   ```

5. Build for production:
   ```bash
   npm run build
   npm run start
   ```

---

## Audio Architecture Details

- **432 Hz Fundamental Pitch**: Note frequencies are converted using standard harmonic shifting:
  `f_432 = f_440 * (432 / 440)`.
- **Procedural Cathedral Reverb**: An impulse response buffer is dynamically synthesized with an exponential decay envelope, eliminating the need to load large audio sample assets.
- **Whisper Smoothing Chain**: Spoken audio is shaped through a Butterworth low-pass filter (2,400 Hz to 3,200 Hz cutoff) and blended with subtle room reflections to produce a gentle, peaceful tone.
