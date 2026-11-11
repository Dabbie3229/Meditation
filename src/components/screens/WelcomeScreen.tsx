import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Check, Image as ImageIcon } from 'lucide-react';
import { TopStatusBar } from '../navigation/TopStatusBar';

interface Wallpaper {
  id: string;
  name: string;
  theme: string;
  url: string;
  textColor: 'light' | 'dark';
  scrimGradient: string;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'still-waters',
    name: 'Still Waters',
    theme: 'Peace & Serenity',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    textColor: 'light',
    scrimGradient: 'from-slate-950/70 via-slate-950/30 to-slate-950/85',
  },
  {
    id: 'morning-mercy',
    name: 'Morning Mercies',
    theme: 'Dawn & Hope',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    textColor: 'light',
    scrimGradient: 'from-slate-950/65 via-black/25 to-slate-950/85',
  },
  {
    id: 'whispering-pines',
    name: 'Whispering Pines',
    theme: 'Tranquil Forest & Light',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    textColor: 'light',
    scrimGradient: 'from-emerald-950/70 via-black/30 to-slate-950/85',
  },
  {
    id: 'ocean-horizon',
    name: 'Ocean of Grace',
    theme: 'Renewal & Rest',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    textColor: 'light',
    scrimGradient: 'from-sky-950/70 via-black/30 to-slate-950/85',
  },
  {
    id: 'golden-meadow',
    name: 'Golden Meadow',
    theme: 'Warmth & Presence',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    textColor: 'light',
    scrimGradient: 'from-amber-950/70 via-black/30 to-slate-950/85',
  },
  {
    id: 'starlit-heavens',
    name: 'Starlit Heavens',
    theme: 'Majesty & Wonder',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    textColor: 'light',
    scrimGradient: 'from-emerald-950/70 via-black/40 to-slate-950/90',
  },
];

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted, onSkip }) => {
  // Load saved wallpaper preference
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const saved = localStorage.getItem('welcome_wallpaper_id');
    if (saved) {
      const idx = WALLPAPERS.findIndex((w) => w.id === saved);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showWallpaperPicker, setShowWallpaperPicker] = useState<boolean>(false);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const activeWallpaper = WALLPAPERS[currentIndex];

  // Save selected wallpaper to localStorage
  useEffect(() => {
    localStorage.setItem('welcome_wallpaper_id', activeWallpaper.id);
  }, [activeWallpaper]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % WALLPAPERS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + WALLPAPERS.length) % WALLPAPERS.length);
  };

  // Touch swipe gesture handlers
  const minSwipeDistance = 45;

  const onTouchStartHandler = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchMoveHandler = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    setIsSwiping(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Mouse drag support for desktop swiping
  const mouseStartX = useRef<number | null>(null);

  const onMouseDownHandler = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
  };

  const onMouseUpHandler = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const distance = mouseStartX.current - e.clientX;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    mouseStartX.current = null;
  };

  return (
    <div
      onTouchStart={onTouchStartHandler}
      onTouchMove={onTouchMoveHandler}
      onTouchEnd={onTouchEndHandler}
      onMouseDown={onMouseDownHandler}
      onMouseUp={onMouseUpHandler}
      className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none cursor-grab active:cursor-grabbing"
    >
      {/* Dynamic Background Image with Smooth Crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {WALLPAPERS.map((wp, idx) => (
          <div
            key={wp.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={wp.url}
              alt={wp.name}
              className="w-full h-full object-cover filter brightness-[0.92]"
              onError={(e) => {
                // Elegant fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Scrim Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-b ${wp.scrimGradient}`} />
          </div>
        ))}
      </div>

      {/* Top Status Bar (always high contrast) */}
      <TopStatusBar darkText={false} />

      {/* Top Header & Wallpaper Badge */}
      <div className="relative z-20 flex flex-col items-center pt-2 px-6 text-center">
        {/* Swipe Affordance Pill / Wallpaper Selector Button */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowWallpaperPicker(!showWallpaperPicker);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 text-xs font-medium text-white shadow-sm transition-all cursor-pointer active:scale-95"
            title="Click or swipe to choose wallpaper"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-300" />
            <span>{activeWallpaper.name}</span>
            <span className="text-[10px] text-white/70">({currentIndex + 1}/{WALLPAPERS.length})</span>
          </button>
        </div>

        {/* Wallpaper Picker Quick Tray Dropdown */}
        {showWallpaperPicker && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-14 z-40 w-[90%] max-w-xs p-2.5 rounded-2xl bg-emerald-950/95 backdrop-blur-xl border border-white/20 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="text-[10px] uppercase font-semibold text-white/70 px-2 py-1 mb-1">
              Select Your Wallpaper
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto no-scrollbar p-1">
              {WALLPAPERS.map((wp, idx) => (
                <button
                  key={wp.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowWallpaperPicker(false);
                  }}
                  className={`group relative h-16 rounded-xl overflow-hidden border text-left transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'border-emerald-400 ring-2 ring-emerald-500/50'
                      : 'border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 p-1.5 flex flex-col justify-end">
                    <span className="text-[10px] font-bold text-white leading-tight drop-shadow-sm">
                      {wp.name}
                    </span>
                    {currentIndex === idx && (
                      <Check className="w-3.5 h-3.5 text-emerald-300 absolute top-1.5 right-1.5" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Open Bible Icon */}
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md shadow-md border border-white/30 flex items-center justify-center text-white mb-4">
          <BookOpen className="w-6 h-6 stroke-[1.8]" />
        </div>

        {/* Title */}
        <h1 className="font-serif text-[34px] leading-tight font-normal text-white tracking-tight drop-shadow-md">
          Meditate<br />on the Word
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-base text-white/90 font-normal max-w-[270px] leading-relaxed drop-shadow-sm">
          Take a moment with God’s Word daily.
        </p>
      </div>

      {/* Center Interactive Swipe Zone with Subtle Arrow Guides */}
      <div className="relative z-10 flex-1 flex items-center justify-between px-3 pointer-events-auto">
        {/* Previous Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-90 cursor-pointer"
          aria-label="Previous wallpaper"
          title="Previous wallpaper"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Center Swipe Hint Notice */}
        <div className="flex flex-col items-center justify-center text-center py-4 px-3 rounded-xl bg-black/20 backdrop-blur-xs border border-white/10 text-white/80 max-w-[200px]">
          <span className="text-[11px] font-medium tracking-wide">
            Swipe left or right
          </span>
          <span className="text-[10px] text-white/60 mt-0.5">
            to choose wallpaper
          </span>
        </div>

        {/* Next Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-90 cursor-pointer"
          aria-label="Next wallpaper"
          title="Next wallpaper"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Action Area */}
      <div className="relative z-20 px-6 pb-10 flex flex-col items-center">
        {/* Interactive Pagination Dots (one for each wallpaper) */}
        <div className="flex items-center gap-2 mb-6">
          {WALLPAPERS.map((wp, idx) => (
            <button
              key={wp.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 h-2 bg-white shadow-sm'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Switch to ${wp.name}`}
              aria-label={`Switch to wallpaper ${wp.name}`}
            />
          ))}
        </div>

        {/* Primary CTA */}
        <button
          onClick={onGetStarted}
          className="w-full max-w-sm h-14 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-700/30 active:scale-[0.98] transition-all cursor-pointer text-base"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Secondary Link */}
        <button
          onClick={onSkip}
          className="mt-3.5 text-xs font-medium text-white/80 hover:text-white transition-colors py-2 px-4 cursor-pointer"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};
