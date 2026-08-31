import { useState, useRef, useEffect, useCallback } from 'react'
import {
  X, Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight,
  Sparkles, Send, Flame, Zap, Heart, ThumbsUp, Lightbulb, Check
} from 'lucide-react'
import breakerVideo from '../vid/How_circuit_breaker_works_202608220725.mp4'
import fieldVideo from '../vid/lv_0_20260822030810.mp4'
import sahinAvatar from '../img/sahin.png'

export type StoryItem = {
  id: string
  title: string
  subtitle: string
  category: string
  videoUrl: string
  timestamp: string
}

export const STORIES: StoryItem[] = [
  {
    id: 'story-breaker',
    title: 'How Circuit Breakers Work',
    subtitle: 'Trip mechanism, arc chute & thermal-magnetic protection in industrial power systems',
    category: 'Protection Engineering',
    videoUrl: breakerVideo,
    timestamp: 'Featured Story',
  },
  {
    id: 'story-field',
    title: 'Industrial Field Operations',
    subtitle: 'On-site power distribution, switchgear maintenance & electrical commissioning',
    category: 'Field Engineering',
    videoUrl: fieldVideo,
    timestamp: 'Field Log',
  },
]

type Props = {
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

type FloatingReaction = {
  id: number
  emoji: string
  x: number
}

export default function StoryModal({ isOpen, onClose, initialIndex = 0 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [reactions, setReactions] = useState<FloatingReaction[]>([])
  const [replyText, setReplyText] = useState('')
  const [replySent, setReplySent] = useState(false)
  const [isVideoLoading, setIsVideoLoading] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentStory = STORIES[currentIndex]

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setProgress(0)
      setIsPlaying(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, initialIndex])

  // Navigation handlers
  const nextStory = useCallback(() => {
    if (currentIndex < STORIES.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setProgress(0)
      setIsVideoLoading(true)
    } else {
      onClose()
    }
  }, [currentIndex, onClose])

  const prevStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setProgress(0)
      setIsVideoLoading(true)
    } else {
      setProgress(0)
      if (videoRef.current) videoRef.current.currentTime = 0
    }
  }, [currentIndex])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') nextStory()
      if (e.key === 'ArrowLeft') prevStory()
      if (e.key === ' ') {
        e.preventDefault()
        togglePlay()
      }
      if (e.key === 'm' || e.key === 'M') setIsMuted(prev => !prev)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, nextStory, prevStory])

  // Video progress updater
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const current = videoRef.current.currentTime
    const duration = videoRef.current.duration || 1
    setProgress((current / duration) * 100)
  }

  const handleVideoEnded = () => {
    nextStory()
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleMouseDown = () => {
    holdTimerRef.current = setTimeout(() => {
      setIsHolding(true)
      videoRef.current?.pause()
    }, 150)
  }

  const handleMouseUp = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
    if (isHolding) {
      setIsHolding(false)
      if (isPlaying) videoRef.current?.play()
    }
  }

  // Floating reaction animation
  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random()
    const x = Math.random() * 60 + 20 // random 20% to 80% width
    setReactions(prev => [...prev, { id, emoji, x }])
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id))
    }, 1800)
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    setReplySent(true)
    setReplyText('')
    triggerReaction('💬')
    setTimeout(() => setReplySent(false), 2500)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        background: 'rgba(5, 8, 12, 0.94)',
        backdropFilter: 'blur(30px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        overflow: 'hidden',
        animation: 'fadeIn 0.25s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* ── Ambient Background Blur (Desktop Theatre Mode) ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-20px',
          zIndex: 0,
          opacity: 0.25,
          filter: 'blur(80px) saturate(1.8)',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <video
          key={`ambient-${currentStory.id}`}
          src={currentStory.videoUrl}
          muted
          autoPlay
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* ── Left / Right Arrow Skip Buttons (Desktop) ── */}
      <button
        onClick={prevStory}
        aria-label="Previous Story"
        style={{
          position: 'absolute',
          left: 'max(24px, calc(50% - 280px))',
          zIndex: 30,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backdropFilter: 'blur(10px)',
          opacity: currentIndex === 0 ? 0.3 : 0.85,
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextStory}
        aria-label="Next Story"
        style={{
          position: 'absolute',
          right: 'max(24px, calc(50% - 280px))',
          zIndex: 30,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backdropFilter: 'blur(10px)',
          opacity: 0.85,
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <ChevronRight size={24} />
      </button>

      {/* ── Main Story Card Container (9:16 Mobile-First Ratio) ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 420,
          height: '100%',
          maxHeight: 'min(92vh, 800px)',
          background: '#0D1218',
          borderRadius: 'clamp(0px, 2vw, 16px)',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.12)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {/* ── Top Gradient Scrim & Progress Bars ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 65%, transparent 100%)',
            padding: '14px 14px 28px',
          }}
        >
          {/* Segmented Story Progress Bars */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            {STORIES.map((s, idx) => {
              let fillPct = 0
              if (idx < currentIndex) fillPct = 100
              else if (idx === currentIndex) fillPct = progress
              return (
                <div
                  key={s.id}
                  style={{
                    flex: 1,
                    height: 3,
                    background: 'rgba(255,255,255,0.25)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${fillPct}%`,
                      background: '#FFFFFF',
                      transition: idx === currentIndex ? 'width 0.1s linear' : 'none',
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* Story Profile & Controls Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Avatar with gold ring */}
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  padding: 2,
                  background: 'linear-gradient(135deg, #C47D0E, #F59E0B, #10B981)',
                  boxShadow: '0 0 10px rgba(196,125,14,0.4)',
                  flexShrink: 0,
                }}
              >
                <img
                  src={sahinAvatar}
                  alt="Md Sahin Alom"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    background: '#1A222C',
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 13.5, color: '#FFFFFF' }}>
                    Md Sahin Alom
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#C47D0E', background: 'rgba(196,125,14,0.15)', padding: '1px 5px', borderRadius: 2, fontWeight: 600 }}>
                    ABC
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: 'rgba(255,255,255,0.65)' }}>
                    {currentStory.timestamp}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>•</span>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: '#F59E0B' }}>
                    {currentStory.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Mute / Play / Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={e => { e.stopPropagation(); setIsMuted(m => !m) }}
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              <button
                onClick={e => { e.stopPropagation(); togglePlay() }}
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} style={{ marginLeft: 2 }} />}
              </button>

              <button
                onClick={e => { e.stopPropagation(); onClose() }}
                title="Close (Esc)"
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 4,
                }}
              >
                <X size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Left / Right Tap Touch Zones ── */}
        <div
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            const clickX = e.clientX - rect.left
            if (clickX < rect.width * 0.35) prevStory()
            else nextStory()
          }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            cursor: 'pointer',
          }}
        />

        {/* ── Video Player Core ── */}
        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* ── Facebook-style Skeleton Loader ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 40,
              background: '#0D1218',
              display: 'flex',
              flexDirection: 'column',
              padding: '80px 16px 120px',
              opacity: isVideoLoading ? 1 : 0,
              pointerEvents: isVideoLoading ? 'auto' : 'none',
              transition: 'opacity 0.4s ease',
            }}
          >
            {/* Shimmer video area */}
            <div style={{
              flex: 1,
              borderRadius: 12,
              background: 'linear-gradient(90deg, #1a2230 25%, #243040 50%, #1a2230 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite linear',
              marginBottom: 20,
            }} />

            {/* Shimmer text lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                height: 20,
                width: '75%',
                borderRadius: 6,
                background: 'linear-gradient(90deg, #1a2230 25%, #243040 50%, #1a2230 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite linear',
              }} />
              <div style={{
                height: 14,
                width: '55%',
                borderRadius: 6,
                background: 'linear-gradient(90deg, #1a2230 25%, #243040 50%, #1a2230 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s 0.2s infinite linear',
              }} />
              <div style={{
                height: 14,
                width: '40%',
                borderRadius: 6,
                background: 'linear-gradient(90deg, #1a2230 25%, #243040 50%, #1a2230 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s 0.4s infinite linear',
              }} />
            </div>

            {/* Loading label */}
            <div style={{
              marginTop: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#C47D0E',
                animation: 'pulse 1s ease-in-out infinite',
              }} />
              <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                Loading video…
              </span>
            </div>
          </div>

          <video
            ref={videoRef}
            key={currentStory.id}
            src={currentStory.videoUrl}
            autoPlay
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onCanPlay={() => setIsVideoLoading(false)}
            onWaiting={() => setIsVideoLoading(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Pause overlay icon */}
          {!isPlaying && !isHolding && (
            <div
              style={{
                position: 'absolute',
                zIndex: 25,
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                backdropFilter: 'blur(8px)',
                pointerEvents: 'none',
              }}
            >
              <Play size={28} style={{ marginLeft: 3 }} />
            </div>
          )}

          {/* Floating animated reactions */}
          {reactions.map(r => (
            <div
              key={r.id}
              style={{
                position: 'absolute',
                bottom: 120,
                left: `${r.x}%`,
                fontSize: 32,
                zIndex: 35,
                pointerEvents: 'none',
                animation: 'floatUp 1.8s ease-out forwards',
              }}
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* ── Bottom Scrim & Interaction Drawer ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 25,
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
            padding: '36px 16px 16px',
          }}
        >
          {/* Story Caption & Subtitle */}
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 20, color: '#FFFFFF', letterSpacing: '0.02em', textTransform: 'uppercase', margin: '0 0 4px', lineHeight: 1.15 }}>
              {currentStory.title}
            </h3>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.45, margin: 0, fontWeight: 300 }}>
              {currentStory.subtitle}
            </p>
          </div>

          {/* Quick Reaction Emojis Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 12 }}>
            {[
              { e: '⚡', label: 'Electric' },
              { e: '🔥', label: 'Fire' },
              { e: '💡', label: 'Insight' },
              { e: '👏', label: 'Bravo' },
              { e: '❤️', label: 'Love' },
            ].map(item => (
              <button
                key={item.e}
                onClick={e => { e.stopPropagation(); triggerReaction(item.e) }}
                title={item.label}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 20,
                  padding: '6px 10px',
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'transform 0.15s, background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.2)'
                  e.currentTarget.style.background = 'rgba(196,125,14,0.35)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                }}
              >
                {item.e}
              </button>
            ))}
          </div>

          {/* Reply / Quick Message Bar */}
          <form
            onSubmit={handleSendReply}
            onClick={e => e.stopPropagation()}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <input
              type="text"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Send message to Sahin…"
              style={{
                flex: 1,
                height: 38,
                background: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.22)',
                borderRadius: 20,
                padding: '0 14px',
                fontFamily: 'Outfit,sans-serif',
                fontSize: 12.5,
                color: '#FFFFFF',
                outline: 'none',
                backdropFilter: 'blur(10px)',
              }}
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: replyText.trim() ? '#C47D0E' : 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: replyText.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              {replySent ? <Check size={16} /> : <Send size={15} />}
            </button>
          </form>
        </div>
      </div>

      {/* ── Keyframe Animations ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 0.9;
            transform: translateY(-80px) scale(1.4) rotate(10deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-160px) scale(1.8) rotate(-15deg);
          }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }
      `}</style>
    </div>
  )
}
