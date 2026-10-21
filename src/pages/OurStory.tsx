import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  MapPin,
  Calendar,
  ChevronDown,
  X,
  Gift,
  MessageCircleHeart,
  Coffee,
  TrainFront,
  MailOpen
} from 'lucide-react';

// ============================================================================
// DATA: STRICTLY ACCURATE MEMORIES (No invented dialogue or events)
// ============================================================================
export interface MemoryItem {
  id: string;
  tokenTitle: string;
  questionChoiceTitle: string;
  title: string;
  date: string;
  location: string | null;
  text: string;
  lines: string[];
  badge: string;
}

const MEMORIES: MemoryItem[] = [
  {
    id: 'first-hello',
    tokenTitle: 'The First Hello',
    questionChoiceTitle: 'The First Hello 💌',
    title: 'The First Hello 💌',
    date: '20 September 2026',
    location: null,
    text: 'It started with a simple Salam. I sent the first message, not knowing how many little memories would follow.',
    lines: [
      'It started with a simple Salam.',
      'I sent the first message, not knowing how many little memories would follow.'
    ],
    badge: 'Milestone 01'
  },
  {
    id: 'first-meeting',
    tokenTitle: 'The First Meeting',
    questionChoiceTitle: 'Our First Meeting ☕',
    title: 'Our First Meeting ☕',
    date: '17 October 2026',
    location: 'Cafe Addai, Bagachra Bazar',
    text: 'Our first meeting, with your Ammu and Khalamoni beside you. A simple day that became a special memory for me.',
    lines: [
      'Our first meeting, with your Ammu and Khalamoni beside you.',
      'A simple day that became a special memory for me.'
    ],
    badge: 'Milestone 02'
  },
  {
    id: 'train-moment',
    tokenTitle: 'The Little Train Moment',
    questionChoiceTitle: 'The Train Moment 🚆',
    title: 'A Little Moment on the Train 🚆',
    date: '20 October 2026',
    location: null,
    text: 'I was sitting in another seat when you asked me to come closer. Then you came a little away from your family to talk with me. It was only about a minute, but I remember it.',
    lines: [
      'I was sitting in another seat when you asked me to come closer.',
      'Then you came a little away from your family to talk with me.',
      'It was only about a minute, but I remember it.'
    ],
    badge: 'Milestone 03'
  }
];

const STORAGE_KEY = 'sadiya_our_little_story_selected_memory_v1';

// ============================================================================
// WEB AUDIO API: GENTLE MUSIC BOX SYNTHESIZER (No external MP3 dependencies)
// ============================================================================
class MusicBoxSynth {
  ctx: AudioContext | null = null;
  isPlaying: boolean = false;
  intervalId: ReturnType<typeof setInterval> | null = null;
  noteIndex: number = 0;
  melody: Array<{ freq: number; dur: number }>;

  constructor() {
    // Gentle romantic pentatonic/major lullaby progression in F major
    this.melody = [
      { freq: 349.23, dur: 1.6 }, // F4
      { freq: 440.00, dur: 1.6 }, // A4
      { freq: 523.25, dur: 2.0 }, // C5
      { freq: 440.00, dur: 1.6 }, // A4
      { freq: 392.00, dur: 1.6 }, // G4
      { freq: 523.25, dur: 1.8 }, // C5
      { freq: 587.33, dur: 2.2 }, // D5
      { freq: 523.25, dur: 2.4 }, // C5
      { freq: 440.00, dur: 1.6 }, // A4
      { freq: 349.23, dur: 1.6 }, // F4
      { freq: 392.00, dur: 1.8 }, // G4
      { freq: 440.00, dur: 2.2 }, // A4
      { freq: 392.00, dur: 1.8 }, // G4
      { freq: 329.63, dur: 1.8 }, // E4
      { freq: 349.23, dur: 2.8 }  // F4
    ];
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playNote(freq: number, duration: number) {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const overtoneGain = this.ctx.createGain();

      // Fundamental warm sine wave
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Delicate bell overtone
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, now);

      // Soft music-box envelope
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.055, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      overtoneGain.gain.setValueAtTime(0.0001, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.012, now + 0.02);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.5);

      osc.connect(gain);
      overtone.connect(overtoneGain);
      gain.connect(this.ctx.destination);
      overtoneGain.connect(this.ctx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + duration + 0.05);
      overtone.stop(now + duration * 0.5 + 0.05);
    } catch {
      // Ignore audio context state errors gracefully
    }
  }

  start() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.playCurrentStep();
    this.intervalId = setInterval(() => {
      this.playCurrentStep();
    }, 1150);
  }

  playCurrentStep() {
    if (!this.isPlaying) return;
    const note = this.melody[this.noteIndex % this.melody.length];
    this.playNote(note.freq, note.dur);
    this.noteIndex += 1;
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// ============================================================================
// INTERACTIVE ILLUSTRATIONS FOR EACH MEMORY
// ============================================================================

/**
 * Memory 1 Interactive Visual: Animated Chat Bubble ("Salam")
 */
const FirstHelloVisual: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const [phase, setPhase] = useState<'typing' | 'sent'>('typing');
  const [extraHearts, setExtraHearts] = useState<number[]>([]);

  useEffect(() => {
    if (reducedMotion) {
      setPhase('sent');
      return;
    }
    const timer = setTimeout(() => {
      setPhase('sent');
    }, 1100);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  const handleReplayOrTap = () => {
    const newId = Date.now() + Math.random();
    setExtraHearts((prev) => [...prev.slice(-4), newId]);
    if (!reducedMotion && phase === 'sent') {
      setPhase('typing');
      setTimeout(() => setPhase('sent'), 750);
    }
  };

  return (
    <div
      onClick={handleReplayOrTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleReplayOrTap()}
      aria-label="Interactive chat bubble saying Salam. Tap to replay animation."
      className="relative w-full py-6 px-4 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FDF6F7] to-[#F9E8EC] border border-[#E8D0D5]/70 shadow-inner flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden group transition-all duration-300 hover:border-[#D89A9E]"
    >
      {/* Subtle decorative background sparkles */}
      <div className="absolute top-2.5 left-3 text-[#D4AF37]/50 text-xs">✦</div>
      <div className="absolute bottom-2.5 right-3 text-[#D4AF37]/50 text-xs">✦</div>

      {/* Date pill inside chat preview */}
      <span className="text-[10px] tracking-widest uppercase text-[#8C5860] bg-[#F9E8EC]/90 px-2.5 py-0.5 rounded-full mb-3 border border-[#E8D0D5]/60">
        20 Sept 2026
      </span>

      {/* Chat message container */}
      <div className="w-full max-w-[230px] flex flex-col items-end pr-2">
        <div
          className={`relative px-4 py-2.5 rounded-2xl rounded-br-xs shadow-sm transition-all duration-500 flex items-center gap-2 ${
            phase === 'typing'
              ? 'bg-[#F3DCE0] text-[#5C1D24]'
              : 'bg-gradient-to-r from-[#5C1D24] to-[#722630] text-[#FFFDF9]'
          }`}
        >
          {phase === 'typing' ? (
            <div className="flex items-center space-x-1.5 py-1 px-2" aria-label="Typing message">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5C1D24]/70 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#5C1D24]/70 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#5C1D24]/70 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm tracking-wide">Salam</span>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#FFFDF9]/15">
                <Heart className="w-2.5 h-2.5 text-[#F9E8EC] fill-[#F9E8EC] animate-pulse" />
              </span>
            </div>
          )}

          {/* Tiny glowing heart badge after message appears */}
          {phase === 'sent' && (
            <div
              className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-[#FFFDF9] shadow-md border border-[#E8D0D5] flex items-center justify-center animate-fade-in"
              style={{ boxShadow: '0 0 12px rgba(216, 154, 158, 0.65)' }}
            >
              <Heart className="w-3.5 h-3.5 text-[#C4515C] fill-[#C4515C]" />
            </div>
          )}
        </div>

        {/* Status caption under bubble */}
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#8C5860]">
          <span>{phase === 'typing' ? 'Sending first message...' : 'First message sent ♡'}</span>
        </div>
      </div>

      {/* Floating tap hearts */}
      {extraHearts.map((id) => (
        <span
          key={id}
          className="pointer-events-none absolute bottom-6 right-12 text-[#C4515C] animate-float-up-fast text-xs"
        >
          💗
        </span>
      ))}

      <span className="mt-2 text-[10px] text-[#9E6B72]/80 group-hover:text-[#5C1D24] transition-colors">
        Tap bubble to replay ✨
      </span>
    </div>
  );
};

/**
 * Memory 2 Interactive Visual: Minimal Café Illustration & Floating Warm Cup
 */
const FirstMeetingVisual: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const [steamHearts, setSteamHearts] = useState<number[]>([1, 2]);

  const handleCupTap = () => {
    const nextId = Date.now() + Math.random();
    setSteamHearts((prev) => [...prev.slice(-3), nextId]);
  };

  return (
    <div
      onClick={handleCupTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCupTap()}
      aria-label="Cafe Addai illustration. Tap to send warm heart steam."
      className="relative w-full py-5 px-4 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF2EC] border border-[#E8D5C8]/80 shadow-inner flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden group hover:border-[#D89A9E] transition-all"
    >
      {/* Subtle warm cafe arch illustration */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Soft glowing aura behind coffee cup */}
        <div
          className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#F9E8EC] via-[#F7E7CE]/60 to-transparent blur-md"
          aria-hidden="true"
        />

        {/* SVG Cafe Cup + Saucer + Rising Steam */}
        <svg
          viewBox="0 0 120 110"
          className={`w-28 h-28 overflow-visible ${!reducedMotion ? 'animate-gentle-float' : ''}`}
          aria-hidden="true"
        >
          {/* Rising steam paths */}
          <path
            d="M48 34 C44 25, 53 18, 48 10"
            fill="none"
            stroke="#D89A9E"
            strokeWidth="2"
            strokeLinecap="round"
            className={!reducedMotion ? 'animate-steam-1' : 'opacity-60'}
          />
          <path
            d="M60 31 C56 21, 66 15, 60 6"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            strokeLinecap="round"
            className={!reducedMotion ? 'animate-steam-2' : 'opacity-60'}
          />
          <path
            d="M72 34 C68 25, 76 19, 72 11"
            fill="none"
            stroke="#D89A9E"
            strokeWidth="2"
            strokeLinecap="round"
            className={!reducedMotion ? 'animate-steam-3' : 'opacity-60'}
          />

          {/* Tiny floating heart above cup */}
          <path
            d="M60 19 C60 16.5, 56.5 15, 55 17.5 C53.5 20, 60 23.5, 60 23.5 C60 23.5, 66.5 20, 65 17.5 C63.5 15, 60 16.5, 60 19 Z"
            fill="#C4515C"
            opacity="0.85"
          />

          {/* Saucer */}
          <ellipse cx="60" cy="84" rx="34" ry="7" fill="#EAD7CD" />
          <ellipse cx="60" cy="82.5" rx="28" ry="4.5" fill="#F7EDE6" />

          {/* Cup Handle */}
          <path
            d="M82 52 C93 52, 93 70, 80 70"
            fill="none"
            stroke="#5C1D24"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Cup Body */}
          <path
            d="M36 45 L84 45 L79 73 C77.5 80, 70 83, 60 83 C50 83, 42.5 80, 41 73 Z"
            fill="#FFFDF9"
            stroke="#5C1D24"
            strokeWidth="2.5"
          />

          {/* Warm Coffee Rim */}
          <ellipse cx="60" cy="45" rx="24" ry="5.5" fill="#8C4A32" stroke="#5C1D24" strokeWidth="2" />
          {/* Latte Heart Art */}
          <path
            d="M60 44.5 C60 43.2, 57.5 42.5, 56.8 43.8 C56 45.2, 60 47, 60 47 C60 47, 64 45.2, 63.2 43.8 C62.5 42.5, 60 43.2, 60 44.5 Z"
            fill="#FAF7F2"
          />

          {/* Delicate Gold Trim on Cup */}
          <path
            d="M39 54 Q60 58 81 54"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        </svg>

        {/* Interactive rising heart puffs on tap */}
        {steamHearts.map((id, idx) => (
          <span
            key={id}
            style={{ left: `${44 + (idx % 3) * 8}%` }}
            className="pointer-events-none absolute top-1 text-xs text-[#C4515C] animate-float-up-fast"
          >
            ♡
          </span>
        ))}
      </div>

      {/* Elegant Location Caption Badge */}
      <div className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#D89A9E]/50 shadow-xs text-xs text-[#5C1D24]">
        <MapPin className="w-3.5 h-3.5 text-[#C4515C] shrink-0" />
        <span className="font-medium tracking-wide">Cafe Addai, Bagachra Bazar</span>
      </div>

      <span className="mt-2 text-[10px] text-[#9E6B72]/80 group-hover:text-[#5C1D24] transition-colors">
        Tap the cup for warm wishes ☕
      </span>
    </div>
  );
};

/**
 * Memory 3 Interactive Visual: Illustrated Train Window with Moving Landscape
 */
const TrainMomentVisual: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const [speedBoost, setSpeedBoost] = useState(false);

  const toggleGentleBreeze = () => {
    setSpeedBoost((prev) => !prev);
  };

  return (
    <div
      onClick={toggleGentleBreeze}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleGentleBreeze()}
      aria-label="Illustrated train window with moving scenery. Tap to toggle gentle glow."
      className="relative w-full py-5 px-4 rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-[#F5E9EC] border border-[#E6CCD2]/80 shadow-inner flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden group hover:border-[#D89A9E] transition-all"
    >
      {/* Train Window Frame */}
      <div className="relative w-56 h-32 rounded-2xl border-4 border-[#5C1D24] bg-gradient-to-b from-[#FDE8D7] via-[#F9D5D8] to-[#E9C3C9] shadow-md overflow-hidden">
        {/* Inner Champagne Gold Window Trim */}
        <div className="absolute inset-0.5 rounded-xl border border-[#D4AF37]/60 pointer-events-none z-20" />

        {/* Warm Afternoon Sun / Glow */}
        <div className="absolute top-3 right-6 w-7 h-7 rounded-full bg-[#FFF7D6] opacity-90 shadow-[0_0_16px_#F5D076]" />

        {/* Moving Parallax Distant Hills */}
        <div
          className={`absolute bottom-7 left-0 flex w-[200%] ${
            !reducedMotion ? 'animate-train-hills' : ''
          }`}
          style={{ animationDuration: speedBoost ? '9s' : '16s' }}
        >
          <svg viewBox="0 0 400 50" className="w-1/2 h-12 shrink-0" preserveAspectRatio="none">
            <path
              d="M0 50 Q50 15 110 38 T220 26 T330 35 T400 28 L400 50 Z"
              fill="#D89A9E"
              opacity="0.45"
            />
          </svg>
          <svg viewBox="0 0 400 50" className="w-1/2 h-12 shrink-0" preserveAspectRatio="none">
            <path
              d="M0 50 Q50 15 110 38 T220 26 T330 35 T400 28 L400 50 Z"
              fill="#D89A9E"
              opacity="0.45"
            />
          </svg>
        </div>

        {/* Moving Parallax Foreground Scenery & Trees */}
        <div
          className={`absolute bottom-4 left-0 flex w-[200%] ${
            !reducedMotion ? 'animate-train-trees' : ''
          }`}
          style={{ animationDuration: speedBoost ? '4.5s' : '8s' }}
        >
          {[0, 1].map((dup) => (
            <svg
              key={dup}
              viewBox="0 0 300 45"
              className="w-1/2 h-11 shrink-0"
              preserveAspectRatio="none"
            >
              {/* Soft rolling meadow */}
              <path d="M0 45 L0 32 Q75 26 150 32 T300 30 L300 45 Z" fill="#9E5863" opacity="0.55" />
              {/* Passing Cypress / Countryside Trees */}
              <circle cx="40" cy="24" r="8" fill="#7A3640" opacity="0.75" />
              <rect x="39" y="28" width="2" height="7" fill="#4A151B" />
              <circle cx="115" cy="26" r="6" fill="#7A3640" opacity="0.65" />
              <circle cx="130" cy="22" r="9" fill="#63252E" opacity="0.8" />
              <circle cx="220" cy="25" r="7.5" fill="#7A3640" opacity="0.7" />
              <circle cx="275" cy="23" r="6.5" fill="#63252E" opacity="0.75" />
            </svg>
          ))}
        </div>

        {/* Window Curtain / Upper Shade Bar */}
        <div className="absolute top-0 inset-x-0 h-3.5 bg-[#5C1D24]/90 border-b border-[#D4AF37]/50 z-10 flex items-center justify-center">
          <div className="w-10 h-0.5 rounded-full bg-[#E6C687]/60" />
        </div>

        {/* Bottom Window Sill & Glowing Heart Inside */}
        <div className="absolute bottom-0 inset-x-0 h-5 bg-[#4A151B] z-10 flex items-center justify-between px-3">
          <span className="text-[9px] tracking-widest text-[#F9E8EC]/80 uppercase">20 Oct 2026</span>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-[#F4A2AA] fill-[#F4A2AA] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Subtle Heart Animation Below Window */}
      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#5C1D24]">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="font-serif italic text-sm">“Only about a minute, but I remember it.”</span>
        <Heart className="w-3.5 h-3.5 text-[#C4515C] fill-[#C4515C] animate-pulse" />
      </div>
    </div>
  );
};

// ============================================================================
// MEMORY CARD COMPONENT (Used in Timeline & Memory Box Modal)
// ============================================================================
const MemoryCard: React.FC<{
  memory: MemoryItem;
  index: number;
  reducedMotion: boolean;
  isModal?: boolean;
}> = ({ memory, reducedMotion, isModal = false }) => {
  const cardRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(isModal || reducedMotion);
  const [revealedLineCount, setRevealedLineCount] = useState(
    isModal || reducedMotion ? memory.lines.length : 1
  );

  // Intersection Observer for scroll-triggered reveal
  useEffect(() => {
    if (isModal || reducedMotion) {
      setIsVisible(true);
      setRevealedLineCount(memory.lines.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.22 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isModal, reducedMotion, memory.lines.length]);

  // Gradual line reveal once visible
  useEffect(() => {
    if (!isVisible || reducedMotion) return;
    if (revealedLineCount < memory.lines.length) {
      const timer = setTimeout(() => {
        setRevealedLineCount((prev) => prev + 1);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [isVisible, revealedLineCount, memory.lines.length, reducedMotion]);

  return (
    <article
      ref={cardRef}
      className={`relative rounded-3xl bg-[#FFFDF9]/95 border border-[#E8D0D5] p-5 sm:p-6 shadow-[0_10px_30px_-10px_rgba(92,29,36,0.10)] transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Top Meta Row: Milestone Badge & Date */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-[#8C5860] bg-[#FDF6F7] px-3 py-1 rounded-full border border-[#E8D0D5]/80">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          {memory.badge}
        </span>

        <span className="inline-flex items-center gap-1.5 text-xs text-[#7A444C] font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#D89A9E]" />
          {memory.date}
        </span>
      </div>

      {/* Memory Title */}
      <h3 className="font-serif text-2xl sm:text-[26px] font-semibold text-[#4A151B] leading-snug mb-4">
        {memory.title}
      </h3>

      {/* Interactive Illustration Specific to Milestone */}
      <div className="mb-5">
        {memory.id === 'first-hello' && <FirstHelloVisual reducedMotion={reducedMotion} />}
        {memory.id === 'first-meeting' && <FirstMeetingVisual reducedMotion={reducedMotion} />}
        {memory.id === 'train-moment' && <TrainMomentVisual reducedMotion={reducedMotion} />}
      </div>

      {/* Story Lines with Gradual Reveal */}
      <div className="space-y-2.5 text-[#4A151B]/90 text-[15px] sm:text-base leading-relaxed">
        {memory.lines.map((line, lIdx) => {
          const shown = lIdx < revealedLineCount;
          return (
            <p
              key={lIdx}
              className={`transition-all duration-500 ${
                shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {line}
            </p>
          );
        })}
      </div>

      {/* Subtle Heart Footer Accent when all lines revealed */}
      <div
        className={`mt-4 pt-3 border-t border-[#F3E3E6] flex items-center justify-between transition-opacity duration-500 ${
          revealedLineCount >= memory.lines.length ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="font-cursive text-lg text-[#9E5863]">A little memory kept</span>
        <div className="inline-flex items-center gap-1 text-xs text-[#C4515C]">
          <Heart className="w-3.5 h-3.5 fill-[#C4515C] animate-pulse" />
        </div>
      </div>
    </article>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT: DEDICATED STANDALONE EXPERIENCE FOR SADIYA
// ============================================================================
export default function OurStory() {
  // Experience state
  const [isOpened, setIsOpened] = useState(false);
  const [isOpeningEnvelope, setIsOpeningEnvelope] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // 1 to 5
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [isBoxOpened, setIsBoxOpened] = useState(false);
  const [isBoxOpeningAnim, setIsBoxOpeningAnim] = useState(false);
  const [activeModalMemory, setActiveModalMemory] = useState<MemoryItem | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectionSparkleTrigger, setSelectionSparkleTrigger] = useState(0);

  // Refs for smooth section navigation & scroll tracking
  const synthRef = useRef<MusicBoxSynth | null>(null);
  const sectionRefs: Record<number, React.RefObject<HTMLElement | null>> = {
    1: useRef<HTMLElement>(null),
    2: useRef<HTMLElement>(null),
    3: useRef<HTMLElement>(null),
    4: useRef<HTMLElement>(null),
    5: useRef<HTMLElement>(null)
  };

  // Set page title and ensure isolated pristine experience
  useEffect(() => {
    document.title = 'Our Little Story ♡ — For Sadiya';
    document.body.classList.remove('has-custom-cursor');
    // Save previous overflow style if any
    const originalBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#FAF7F2';

    return () => {
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  // Detect system prefers-reduced-motion & load saved memory choice
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      }

      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved && MEMORIES.some((m) => m.id === saved)) {
          setSelectedMemoryId(saved);
        }
      } catch {
        // Ignore storage errors in restricted iframes
      }

      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', listener);
        }
      };
    }
  }, []);

  // Cleanup Web Audio on unmount
  useEffect(() => {
    synthRef.current = new MusicBoxSynth();
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  // Track active section while scrolling (Steps 2..5 once opened)
  useEffect(() => {
    if (!isOpened) {
      setActiveStep(1);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.38;
      let current = 2;

      [2, 3, 4, 5].forEach((stepNum) => {
        const el = sectionRefs[stepNum]?.current;
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            current = stepNum;
          }
        }
      });

      setActiveStep(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpened]);

  // Toggle optional background music box
  const toggleMusic = useCallback(() => {
    if (!synthRef.current) return;
    if (musicPlaying) {
      synthRef.current.stop();
      setMusicPlaying(false);
    } else {
      synthRef.current.start();
      setMusicPlaying(true);
    }
  }, [musicPlaying]);

  // Open the envelope invitation on Screen 1
  const handleOpenSurprise = () => {
    if (reducedMotion) {
      setIsOpened(true);
      setActiveStep(2);
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    setIsOpeningEnvelope(true);
    setTimeout(() => {
      setIsOpened(true);
      setIsOpeningEnvelope(false);
      setActiveStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  };

  // Select a memory in Section 3 ("One Little Question")
  const handleSelectMemory = (id: string) => {
    setSelectedMemoryId(id);
    setSelectionSparkleTrigger(Date.now());
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Ignore localStorage errors if any
    }
  };

  // Open the gift box in Section 5
  const handleOpenGiftBox = () => {
    if (reducedMotion) {
      setIsBoxOpened(true);
      return;
    }
    setIsBoxOpeningAnim(true);
    setTimeout(() => {
      setIsBoxOpened(true);
      setIsBoxOpeningAnim(false);
    }, 650);
  };

  // Restart the entire story back to Screen 1
  const handleRestartStory = () => {
    setActiveModalMemory(null);
    setIsBoxOpened(false);
    setIsOpeningEnvelope(false);
    setIsOpened(false);
    setActiveStep(1);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  // Scroll to specific section pill
  const scrollToSection = (stepNumber: number) => {
    if (stepNumber === 1) {
      handleRestartStory();
      return;
    }
    const target = sectionRefs[stepNumber]?.current;
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FDF6F7] via-[#FAF7F2] to-[#F9E8EC] text-[#4A151B] font-sans selection:bg-[#F4D5DA] selection:text-[#4A151B] overflow-x-hidden relative isolate">
      {/* ================================================================== */}
      {/* GOOGLE FONTS & CUSTOM KEYFRAME ANIMATIONS                          */}
      {/* ================================================================== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
        .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .font-cursive {
          font-family: 'Alex Brush', cursive !important;
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes floatUpFast {
          0% { opacity: 0.95; transform: translateY(0) scale(0.9); }
          100% { opacity: 0; transform: translateY(-28px) scale(1.25); }
        }
        @keyframes steamRise {
          0% { opacity: 0.2; transform: translateY(2px); }
          50% { opacity: 0.75; transform: translateY(-3px); }
          100% { opacity: 0.2; transform: translateY(2px); }
        }
        @keyframes trainScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shimmerGold {
          0%, 100% { opacity: 0.35; transform: scale(0.95); }
          50% { opacity: 0.9; transform: scale(1.1); }
        }
        @keyframes fadeInStory {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-float-slow {
          animation: floatSlow 5.5s ease-in-out infinite;
        }
        .animate-gentle-float {
          animation: gentleFloat 3.6s ease-in-out infinite;
        }
        .animate-float-up-fast {
          animation: floatUpFast 1.1s ease-out forwards;
        }
        .animate-steam-1 {
          animation: steamRise 2.6s ease-in-out infinite;
        }
        .animate-steam-2 {
          animation: steamRise 3.1s ease-in-out infinite 0.5s;
        }
        .animate-steam-3 {
          animation: steamRise 2.8s ease-in-out infinite 1s;
        }
        .animate-train-hills {
          animation: trainScroll 16s linear infinite;
        }
        .animate-train-trees {
          animation: trainScroll 8s linear infinite;
        }
        .animate-shimmer-gold {
          animation: shimmerGold 3.2s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeInStory 0.45s ease-out forwards;
        }

        /* Subtle paper grain pattern for the personal note */
        .paper-texture {
          background-color: #FFFDF9;
          background-image: radial-gradient(#D89A9E 0.45px, transparent 0.45px), radial-gradient(#D4AF37 0.45px, #FFFDF9 0.45px);
          background-size: 24px 24px;
          background-position: 0 0, 12px 12px;
        }
      `}</style>

      {/* ================================================================== */}
      {/* AMBIENT FLOATING HEARTS & CHAMPAGNE PARTICLES (Background Layer)   */}
      {/* ================================================================== */}
      {!reducedMotion && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute top-[12%] left-[8%] text-[#D89A9E]/35 text-sm animate-float-slow">♡</div>
          <div className="absolute top-[24%] right-[10%] text-[#D4AF37]/40 text-xs animate-shimmer-gold">✦</div>
          <div
            className="absolute top-[52%] left-[6%] text-[#D4AF37]/35 text-xs animate-shimmer-gold"
            style={{ animationDelay: '1.2s' }}
          >
            ✦
          </div>
          <div
            className="absolute top-[68%] right-[8%] text-[#D89A9E]/30 text-base animate-float-slow"
            style={{ animationDelay: '2.1s' }}
          >
            ♡
          </div>
          <div
            className="absolute bottom-[14%] left-[14%] text-[#D89A9E]/30 text-xs animate-float-slow"
            style={{ animationDelay: '1.5s' }}
          >
            ♡
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* STICKY TOP NAVIGATION BAR (Progress Indicator + Music + Restart)   */}
      {/* ================================================================== */}
      <header className="fixed top-0 inset-x-0 z-40 px-4 py-3 pointer-events-none">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Progress Pill ("1 of 5" to "5 of 5") */}
          <div className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/85 backdrop-blur-md border border-[#E8D0D5] shadow-xs">
            <Heart className="w-3.5 h-3.5 text-[#C4515C] fill-[#C4515C]" />
            <span className="text-xs font-medium tracking-wide text-[#5C1D24]" aria-live="polite">
              {activeStep} of 5
            </span>
            {isOpened && (
              <div className="hidden xs:flex items-center gap-1 ml-1 pl-1.5 border-l border-[#E8D0D5]">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => scrollToSection(num)}
                    aria-label={`Go to section ${num} of 5`}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeStep === num
                        ? 'w-4 bg-[#5C1D24]'
                        : 'bg-[#D89A9E]/50 hover:bg-[#D89A9E]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Controls: Optional Music Box Toggle & Restart */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={musicPlaying ? 'Pause gentle music box' : 'Play gentle music box'}
              title={musicPlaying ? 'Pause music' : 'Play gentle melody'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all shadow-xs cursor-pointer ${
                musicPlaying
                  ? 'bg-[#5C1D24] text-[#FFFDF9] border-[#5C1D24]'
                  : 'bg-[#FFFDF9]/85 text-[#5C1D24] border-[#E8D0D5] hover:border-[#D89A9E]'
              }`}
            >
              {musicPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#E6C687] animate-pulse" />
                  <span className="hidden sm:inline">Melody On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#8C5860]" />
                  <span className="hidden sm:inline">Music</span>
                </>
              )}
            </button>

            {isOpened && (
              <button
                type="button"
                onClick={handleRestartStory}
                aria-label="Restart story from the opening invitation"
                title="Restart story"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FFFDF9]/85 backdrop-blur-md border border-[#E8D0D5] text-[#5C1D24] hover:border-[#D89A9E] hover:bg-[#FDF6F7] transition-all shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* SCREEN 1: FULL-SCREEN OPENING INVITATION                           */}
      {/* ================================================================== */}
      {!isOpened ? (
        <main
          ref={sectionRefs[1]}
          className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-5 pt-16 pb-10"
        >
          <div className="w-full max-w-md mx-auto text-center flex flex-col items-center">
            {/* Decorative Top Flourish */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9]/80 border border-[#E8D0D5] text-[11px] tracking-widest uppercase text-[#8C5860] mb-6 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>For Sadiya</span>
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            </div>

            {/* Main Title & Subtitle */}
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#4A151B] tracking-tight mb-3">
              Our Little Story ♡
            </h1>
            <p className="text-sm sm:text-base text-[#7A444C] max-w-xs mx-auto leading-relaxed mb-8">
              Some moments are small. Some moments become memories.
            </p>

            {/* Centerpiece: Glowing Interactive Envelope Illustration */}
            <div
              onClick={handleOpenSurprise}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpenSurprise()}
              aria-label="Interactive love letter envelope for Sadiya. Tap to open."
              className="relative w-64 h-52 flex items-center justify-center my-2 cursor-pointer group select-none"
            >
              {/* Soft Champagne & Rose Glow Behind Envelope */}
              <div
                className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#D89A9E]/45 via-[#E6C687]/40 to-[#F9E8EC]/60 blur-2xl transition-transform duration-700 group-hover:scale-110"
                aria-hidden="true"
              />

              {/* SVG Envelope with Animated Flap & Rising Letter */}
              <svg
                viewBox="0 0 240 190"
                className={`w-64 h-52 overflow-visible transition-transform duration-500 ${
                  !reducedMotion && !isOpeningEnvelope ? 'animate-gentle-float' : ''
                }`}
              >
                {/* Floating tiny sparkles around envelope */}
                <circle cx="22" cy="35" r="2.5" fill="#D4AF37" opacity="0.7" />
                <circle cx="218" cy="42" r="2" fill="#D4AF37" opacity="0.7" />
                <path
                  d="M205 15 C205 13, 202 12, 201 14 C200 16, 205 19, 205 19 C205 19, 210 16, 209 14 C208 12, 205 13, 205 15 Z"
                  fill="#C4515C"
                  opacity="0.65"
                />

                {/* Envelope Back Base */}
                <rect
                  x="25"
                  y="55"
                  width="190"
                  height="115"
                  rx="10"
                  fill="#EAD3D7"
                  stroke="#5C1D24"
                  strokeWidth="2"
                />

                {/* Inside Letter Card (Rises when opening) */}
                <g
                  className="transition-all duration-700 ease-out"
                  style={{
                    transform: isOpeningEnvelope ? 'translateY(-38px)' : 'translateY(0px)'
                  }}
                >
                  <rect
                    x="38"
                    y="48"
                    width="164"
                    height="100"
                    rx="6"
                    fill="#FFFDF9"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                  />
                  {/* Letter Decorative Lines & Heart */}
                  <line x1="65" y1="68" x2="175" y2="68" stroke="#E8D0D5" strokeWidth="2" strokeLinecap="round" />
                  <line x1="80" y1="80" x2="160" y2="80" stroke="#E8D0D5" strokeWidth="2" strokeLinecap="round" />
                  <path
                    d="M120 55 C120 52.5, 116.5 51, 115 53.5 C113.5 56, 120 59.5, 120 59.5 C120 59.5, 126.5 56, 125 53.5 C123.5 51, 120 52.5, 120 55 Z"
                    fill="#C4515C"
                  />
                </g>

                {/* Envelope Side & Bottom Fold Flaps */}
                <path
                  d="M25 58 L120 122 L215 58 L215 162 C215 167, 211 170, 206 170 L34 170 C29 170, 25 167, 25 162 Z"
                  fill="#FFF8F6"
                  stroke="#5C1D24"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Bottom Flap Crease Lines */}
                <path
                  d="M27 168 L120 115 L213 168"
                  fill="#F9E8EC"
                  stroke="#5C1D24"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />

                {/* Top Envelope Flap (Rotates open on tap) */}
                <g
                  className="transition-transform duration-500 origin-[120px_55px]"
                  style={{
                    transform: isOpeningEnvelope ? 'scaleY(-1)' : 'scaleY(1)'
                  }}
                >
                  <path
                    d="M25 56 L120 120 L215 56 Z"
                    fill="#F4DEE2"
                    stroke="#5C1D24"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </g>

                {/* Burgundy Wax Seal with Heart in Center */}
                <g
                  className={`transition-all duration-500 ${
                    isOpeningEnvelope ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                  }`}
                >
                  <circle
                    cx="120"
                    cy="116"
                    r="16"
                    fill="#5C1D24"
                    stroke="#D4AF37"
                    strokeWidth="2"
                  />
                  <circle
                    cx="120"
                    cy="116"
                    r="12"
                    fill="none"
                    stroke="#E6C687"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                  <path
                    d="M120 113.5 C120 111, 116 109.5, 114.5 112.2 C113 115, 120 119.5, 120 119.5 C120 119.5, 127 115, 125.5 112.2 C124 109.5, 120 111, 120 113.5 Z"
                    fill="#FFFDF9"
                  />
                </g>
              </svg>
            </div>

            {/* Personal Invitation Message */}
            <p className="font-serif italic text-xl sm:text-2xl text-[#5C1D24] mt-3 mb-7 px-4">
              “Sadiya, I made a little something for you.”
            </p>

            {/* Primary Call-To-Action Button */}
            <button
              type="button"
              onClick={handleOpenSurprise}
              disabled={isOpeningEnvelope}
              className="relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#5C1D24] via-[#6E232C] to-[#5C1D24] text-[#FFFDF9] font-medium text-base tracking-wide shadow-[0_10px_25px_-5px_rgba(92,29,36,0.4)] hover:shadow-[0_14px_30px_-5px_rgba(92,29,36,0.55)] active:scale-[0.98] transition-all duration-300 border border-[#D4AF37]/50 cursor-pointer"
            >
              <span>{isOpeningEnvelope ? 'Opening...' : 'Open Your Surprise ✨'}</span>
            </button>
          </div>
        </main>
      ) : (
        /* ================================================================== */
        /* MAIN STORY EXPERIENCE (STEPS 2 TO 5)                               */
        /* ================================================================== */
        <main className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-5 pt-20 pb-24 space-y-16">
          {/* Story Header Banner */}
          <div className="text-center pt-2 pb-2 border-b border-[#E8D0D5]/70">
            <p className="font-cursive text-2xl text-[#9E5863] mb-0.5">For Sadiya</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4A151B]">
              Our Little Story ♡
            </h1>
            <p className="text-xs sm:text-sm text-[#7A444C] mt-1.5">
              Some moments are small. Some moments become memories.
            </p>
          </div>

          {/* ============================================================== */}
          {/* SECTION 2: INTERACTIVE MEMORY TIMELINE (Step 2 of 5)           */}
          {/* ============================================================== */}
          <section
            ref={sectionRefs[2]}
            aria-label="Interactive Memory Timeline"
            className="scroll-mt-20 space-y-6"
          >
            <div className="text-center space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-[#8C5860] font-medium">
                Chapter One
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#4A151B]">
                Three Little Milestones
              </h2>
            </div>

            {/* Vertical Timeline Container */}
            <div className="relative space-y-8 before:content-[''] before:absolute before:top-6 before:bottom-6 before:left-4 sm:before:left-5 before:w-0.5 before:bg-gradient-to-b before:from-[#D4AF37]/60 before:via-[#D89A9E]/60 before:to-[#D4AF37]/60">
              {MEMORIES.map((memory, idx) => (
                <div key={memory.id} className="relative pl-10 sm:pl-12">
                  {/* Timeline Node Marker */}
                  <div
                    className="absolute left-1.5 sm:left-2.5 top-6 w-5 h-5 rounded-full bg-[#FFFDF9] border-2 border-[#5C1D24] shadow-xs flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#C4515C]" />
                  </div>

                  <MemoryCard
                    memory={memory}
                    index={idx}
                    reducedMotion={reducedMotion}
                  />
                </div>
              ))}
            </div>

            {/* Gentle Scroll Prompt to Next Section */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => scrollToSection(3)}
                className="inline-flex flex-col items-center gap-1 text-xs text-[#8C5860] hover:text-[#5C1D24] transition-colors py-2 px-4 cursor-pointer"
              >
                <span>Continue downward</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 3: A TINY INTERACTIVE QUESTION (Step 3 of 5)           */}
          {/* ============================================================== */}
          <section
            ref={sectionRefs[3]}
            aria-label="One Little Question"
            className="scroll-mt-20"
          >
            <div className="relative rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-[#FDF6F7] border border-[#E8D0D5] p-6 sm:p-7 shadow-[0_12px_32px_-12px_rgba(92,29,36,0.12)] overflow-hidden">
              {/* Decorative Corner Sparkle */}
              <div className="flex items-center justify-center mb-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F9E8EC] border border-[#E8D0D5]">
                  <Heart className="w-4 h-4 text-[#C4515C] fill-[#C4515C]" />
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-center text-[#4A151B] mb-2">
                One Little Question 💗
              </h2>
              <p className="text-center text-sm sm:text-[15px] text-[#6E3B42] mb-6 leading-relaxed">
                Which little moment would you like to keep in our memory box?
              </p>

              {/* 3 Selectable Cards */}
              <div className="space-y-3" role="radiogroup" aria-label="Choose a moment to keep">
                {MEMORIES.map((memory) => {
                  const isSelected = selectedMemoryId === memory.id;
                  return (
                    <button
                      key={memory.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectMemory(memory.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#FDF2F4] via-[#FFFDF9] to-[#FAF0E4] border-[#5C1D24] shadow-[0_0_20px_rgba(216,154,158,0.45)] scale-[1.01]'
                          : 'bg-[#FFFDF9] border-[#E8D0D5] hover:border-[#D89A9E] hover:bg-[#FDF6F7]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-[#5C1D24] text-[#FFFDF9] border-[#5C1D24]'
                              : 'bg-[#FDF6F7] text-[#5C1D24] border-[#E8D0D5]'
                          }`}
                        >
                          {memory.id === 'first-hello' && <MessageCircleHeart className="w-5 h-5" />}
                          {memory.id === 'first-meeting' && <Coffee className="w-5 h-5" />}
                          {memory.id === 'train-moment' && <TrainFront className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-serif text-lg font-semibold text-[#4A151B]">
                            {memory.questionChoiceTitle}
                          </div>
                          <div className="text-xs text-[#8C5860]">{memory.date}</div>
                        </div>
                      </div>

                      {/* Selection Indicator with Sparkle */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        {isSelected ? (
                          <span
                            key={selectionSparkleTrigger}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#5C1D24] text-[#FFFDF9] shadow-xs animate-fade-in"
                          >
                            <Heart className="w-3.5 h-3.5 fill-[#FFFDF9]" />
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full border border-[#D89A9E]/70 bg-[#FFFDF9]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Personalized Confirmation Message */}
              {selectedMemoryId && (
                <div
                  key={selectionSparkleTrigger}
                  className="mt-6 pt-5 border-t border-[#E8D0D5]/80 text-center animate-fade-in"
                  aria-live="polite"
                >
                  <div className="inline-flex items-center justify-center gap-1.5 text-[#C4515C] mb-1">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <Heart className="w-4 h-4 fill-[#C4515C] animate-pulse" />
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="font-serif italic text-xl text-[#4A151B] font-medium">
                    “Then let’s keep this little memory close. ♡”
                  </p>
                  <p className="text-[11px] text-[#8C5860] mt-1.5">
                    Saved privately on your phone inside our memory box below.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 4: A SMALL PERSONAL NOTE (Step 4 of 5)                 */}
          {/* ============================================================== */}
          <section
            ref={sectionRefs[4]}
            aria-label="A Little Note for You"
            className="scroll-mt-20"
          >
            <div className="relative rounded-3xl paper-texture border border-[#E2C6CC] p-7 sm:p-8 shadow-[0_14px_35px_-12px_rgba(92,29,36,0.14)] overflow-hidden">
              {/* Subtle Champagne Gold Inner Frame */}
              <div
                className="absolute inset-2.5 rounded-2xl border border-[#D4AF37]/35 pointer-events-none"
                aria-hidden="true"
              />

              {/* Top Wax-Seal Style Emblem */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-full bg-[#5C1D24] border-2 border-[#D4AF37] shadow-xs flex items-center justify-center mb-4">
                  <MailOpen className="w-4 h-4 text-[#FFFDF9]" />
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#4A151B] mb-4">
                  A Little Note for You ♡
                </h2>

                {/* Sincere, gentle, factual note */}
                <p className="font-serif text-lg sm:text-xl text-[#4A151B]/95 leading-relaxed max-w-xs mx-auto mb-6">
                  “I’m happy that our story began. I hope we keep getting to know each other, one little moment at a time.”
                </p>

                {/* Decorative Divider */}
                <div className="flex items-center gap-2 mb-4" aria-hidden="true">
                  <span className="w-8 h-px bg-[#D89A9E]" />
                  <Heart className="w-3 h-3 text-[#C4515C] fill-[#C4515C]" />
                  <span className="w-8 h-px bg-[#D89A9E]" />
                </div>

                {/* Signature Footer */}
                <p className="text-xs sm:text-sm font-medium text-[#7A444C] tracking-wide">
                  Made with care, just for you. ♡
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 5: OUR LITTLE MEMORY BOX (Step 5 of 5)                 */}
          {/* ============================================================== */}
          <section
            ref={sectionRefs[5]}
            aria-label="Our Little Memory Box"
            className="scroll-mt-20"
          >
            <div className="relative rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FDF6F7] to-[#F9E8EC] border border-[#E8D0D5] p-6 sm:p-7 shadow-[0_12px_32px_-12px_rgba(92,29,36,0.14)] text-center overflow-hidden">
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-[#8C5860] mb-1">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Keepsake
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#4A151B] mb-2">
                Our Little Memory Box ✨
              </h2>
              <p className="text-xs sm:text-sm text-[#7A444C] max-w-xs mx-auto mb-6">
                {isBoxOpened
                  ? 'Tap any memory token below to revisit that moment.'
                  : 'A small place to hold the moments we have shared so far.'}
              </p>

              {/* Delicate Gift Box SVG Illustration */}
              <div className="relative flex flex-col items-center justify-center my-2">
                {/* Champagne Glow */}
                <div
                  className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-[#D89A9E]/35 via-[#E6C687]/40 to-transparent blur-xl pointer-events-none"
                  aria-hidden="true"
                />

                <svg
                  viewBox="0 0 180 155"
                  className={`w-44 h-36 overflow-visible ${
                    !reducedMotion && !isBoxOpened ? 'animate-gentle-float' : ''
                  }`}
                  aria-hidden="true"
                >
                  {/* Floating sparkles when box opens */}
                  {isBoxOpened && (
                    <g className="animate-fade-in">
                      <circle cx="45" cy="24" r="3" fill="#D4AF37" />
                      <circle cx="135" cy="24" r="2.5" fill="#D4AF37" />
                      <path
                        d="M90 16 C90 13, 86 11.5, 84.5 14.5 C83 17.5, 90 21.5, 90 21.5 C90 21.5, 97 17.5, 95.5 14.5 C94 11.5, 90 13, 90 16 Z"
                        fill="#C4515C"
                      />
                    </g>
                  )}

                  {/* Gift Box Base */}
                  <rect
                    x="42"
                    y="72"
                    width="96"
                    height="66"
                    rx="6"
                    fill="#FFFDF9"
                    stroke="#5C1D24"
                    strokeWidth="2.5"
                  />
                  {/* Soft Blush Inner Shading */}
                  <rect x="45" y="75" width="90" height="60" rx="4" fill="#F9E8EC" opacity="0.65" />

                  {/* Vertical Burgundy Satin Ribbon on Box Base */}
                  <rect
                    x="82"
                    y="72"
                    width="16"
                    height="66"
                    fill="#5C1D24"
                  />
                  <line x1="85" y1="72" x2="85" y2="138" stroke="#D4AF37" strokeWidth="1" />
                  <line x1="95" y1="72" x2="95" y2="138" stroke="#D4AF37" strokeWidth="1" />

                  {/* Animated Gift Box Lid & Ribbon Bow */}
                  <g
                    className="transition-all duration-700 ease-out"
                    style={{
                      transform:
                        isBoxOpened || isBoxOpeningAnim
                          ? 'translateY(-28px) rotate(-8deg)'
                          : 'translateY(0px) rotate(0deg)',
                      transformOrigin: '90px 60px'
                    }}
                  >
                    {/* Ribbon Bow Loops */}
                    <path
                      d="M90 54 C72 34, 54 44, 66 56 C74 62, 86 56, 90 54 Z"
                      fill="#5C1D24"
                      stroke="#D4AF37"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M90 54 C108 34, 126 44, 114 56 C106 62, 94 56, 90 54 Z"
                      fill="#5C1D24"
                      stroke="#D4AF37"
                      strokeWidth="1.2"
                    />

                    {/* Box Lid */}
                    <rect
                      x="36"
                      y="54"
                      width="108"
                      height="20"
                      rx="5"
                      fill="#F4DEE2"
                      stroke="#5C1D24"
                      strokeWidth="2.5"
                    />
                    {/* Lid Center Ribbon Cap */}
                    <rect x="81" y="54" width="18" height="20" fill="#5C1D24" />
                    <circle cx="90" cy="54" r="5" fill="#D4AF37" />
                  </g>
                </svg>

                {/* Open the Box Button (Before Opening) */}
                {!isBoxOpened && (
                  <button
                    type="button"
                    onClick={handleOpenGiftBox}
                    disabled={isBoxOpeningAnim}
                    className="mt-2 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#5C1D24] text-[#FFFDF9] text-sm font-medium tracking-wide shadow-md hover:bg-[#4A151B] active:scale-[0.98] transition-all cursor-pointer border border-[#D4AF37]/50"
                  >
                    <Gift className="w-4 h-4 text-[#E6C687]" />
                    <span>{isBoxOpeningAnim ? 'Opening Box...' : 'Open the Box'}</span>
                  </button>
                )}
              </div>

              {/* Revealed Three Memory Tokens Inside the Box */}
              {isBoxOpened && (
                <div className="mt-4 space-y-3 text-left animate-fade-in">
                  <div className="grid grid-cols-1 gap-3">
                    {MEMORIES.map((memory) => {
                      const isKeptFavorite = selectedMemoryId === memory.id;
                      return (
                        <button
                          key={memory.id}
                          type="button"
                          onClick={() => setActiveModalMemory(memory)}
                          className={`group w-full p-4 rounded-2xl border bg-[#FFFDF9] transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer hover:border-[#5C1D24] hover:shadow-md ${
                            isKeptFavorite
                              ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50'
                              : 'border-[#E8D0D5]'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Token Icon Circle */}
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FDF6F7] to-[#F9E8EC] border border-[#E8D0D5] flex items-center justify-center text-[#5C1D24] group-hover:bg-[#5C1D24] group-hover:text-[#FFFDF9] transition-colors shrink-0">
                              {memory.id === 'first-hello' && <MessageCircleHeart className="w-5 h-5" />}
                              {memory.id === 'first-meeting' && <Coffee className="w-5 h-5" />}
                              {memory.id === 'train-moment' && <TrainFront className="w-5 h-5" />}
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-serif text-lg font-semibold text-[#4A151B]">
                                  {memory.tokenTitle}
                                </span>
                                {isKeptFavorite && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAF0E4] text-[#5C1D24] border border-[#D4AF37]/60">
                                    <Heart className="w-2.5 h-2.5 text-[#C4515C] fill-[#C4515C]" />
                                    Kept Close
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#8C5860] mt-0.5">
                                {memory.date} • Tap to open memory card
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-medium text-[#5C1D24] group-hover:translate-x-0.5 transition-transform">
                            Open →
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Read Our Story Again Button */}
              <div className="mt-8 pt-5 border-t border-[#E8D0D5]/70 flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleRestartStory}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFFDF9] border border-[#D89A9E] text-[#5C1D24] text-sm font-medium hover:bg-[#FDF6F7] hover:border-[#5C1D24] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4 text-[#C4515C]" />
                  <span>Read Our Story Again</span>
                </button>
              </div>
            </div>
          </section>

          {/* Subtle Footer */}
          <footer className="text-center pt-2 pb-6 text-xs text-[#8C5860]">
            <p className="font-serif italic text-sm text-[#5C1D24]">Our Little Story ♡</p>
            <p className="mt-0.5 text-[11px] opacity-80">Made especially for Sadiya</p>
          </footer>
        </main>
      )}

      {/* ================================================================== */}
      {/* MODAL FOR MEMORY TOKEN PREVIEW (When clicking a token in Section 5) */}
      {/* ================================================================== */}
      {activeModalMemory && (
        <div
          className="fixed inset-0 z-50 bg-[#2B090D]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={activeModalMemory.title}
          onClick={() => setActiveModalMemory(null)}
        >
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAF7F2] p-1.5 shadow-2xl border border-[#D4AF37]/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Modal Button */}
            <button
              type="button"
              onClick={() => setActiveModalMemory(null)}
              aria-label="Close memory card"
              className="absolute top-5 right-5 z-20 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FFFDF9] border border-[#E8D0D5] text-[#5C1D24] hover:bg-[#FDF6F7] shadow-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <MemoryCard
              memory={activeModalMemory}
              index={0}
              reducedMotion={reducedMotion}
              isModal={true}
            />

            <div className="px-4 py-3 text-center">
              <button
                type="button"
                onClick={() => setActiveModalMemory(null)}
                className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#5C1D24] text-[#FFFDF9] text-xs font-medium tracking-wide hover:bg-[#4A151B] transition-colors cursor-pointer"
              >
                Back to Memory Box ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
