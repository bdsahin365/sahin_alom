import { useState, useEffect } from 'react'
import { X, Play, Video } from 'lucide-react'

const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

interface YoutubeModalProps {
  onConfirm: (url: string) => void
  onClose: () => void
}

export default function YoutubeModal({ onConfirm, onClose }: YoutubeModalProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleConfirm = () => {
    const raw = url.trim()
    if (!raw) {
      setError('Please enter a YouTube video URL')
      return
    }
    if (!raw.includes('youtube.com') && !raw.includes('youtu.be')) {
      setError('Please enter a valid YouTube link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)')
      return
    }
    onConfirm(raw)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(11, 17, 24, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(220,38,38,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'min(92dvh, 480px)',
          animation: 'ytModalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            background: '#FAF8F5',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DC2626',
                border: '1px solid rgba(220,38,38,0.2)',
              }}
            >
              <YoutubeIcon size={18} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 16, color: '#0F172A', margin: 0 }}>
                Embed YouTube Video
              </h3>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748B', letterSpacing: '0.05em' }}>
                RICH MEDIA PLAYER
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F1F5F9'
              e.currentTarget.style.color = '#0F172A'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#94A3B8'
            }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', flex: 1 }}>
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 10,
                letterSpacing: '0.12em',
                color: '#64748B',
                marginBottom: 6,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              YOUTUBE VIDEO URL *
            </label>
            <div style={{ position: 'relative' }}>
              <Video
                size={15}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: error ? '#DC2626' : '#94A3B8',
                }}
              />
              <input
                autoFocus
                value={url}
                onChange={e => {
                  setUrl(e.target.value)
                  setError('')
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleConfirm()
                }}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 12px 0 36px',
                  border: error ? '1.5px solid #DC2626' : '1px solid #E2E8F0',
                  borderRadius: 8,
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 13.5,
                  color: '#0F172A',
                  background: '#FAF8F5',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={e => {
                  if (!error) {
                    e.currentTarget.style.borderColor = '#DC2626'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.12)'
                  }
                }}
                onBlur={e => {
                  if (!error) {
                    e.currentTarget.style.borderColor = '#E2E8F0'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              />
            </div>
            {error && (
              <span style={{ fontSize: 11.5, color: '#DC2626', marginTop: 5, display: 'block', fontWeight: 500 }}>
                {error}
              </span>
            )}
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 12,
              color: '#64748B',
              lineHeight: 1.5,
            }}
          >
            Supports standard YouTube video links, shorts, unlisted videos, and timestamped URLs. Embedded videos will render in responsive 16:9 engineering layout with native controls.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            padding: '14px 20px',
            borderTop: '1px solid #F1F5F9',
            background: '#FAF8F5',
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              background: '#FFFFFF',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#64748B',
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F8FAFC'
              e.currentTarget.style.borderColor = '#CBD5E1'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#FFFFFF'
              e.currentTarget.style.borderColor = '#E2E8F0'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: 8,
              background: '#DC2626',
              color: '#FFFFFF',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(220,38,38,0.25)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            <Play size={12} fill="currentColor" /> Embed Video
          </button>
        </div>
      </div>
      <style>{`
        @keyframes ytModalPop {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

