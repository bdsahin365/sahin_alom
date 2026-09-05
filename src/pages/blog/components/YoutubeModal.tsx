import { useState } from 'react'
import { X, Play } from 'lucide-react'

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
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 750,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          width: '100%',
          maxWidth: 460,
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
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
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DC2626',
              }}
            >
              <YoutubeIcon size={18} />
            </div>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 16, color: '#0F172A', margin: 0 }}>
              Embed YouTube Video
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
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
              }}
            >
              YOUTUBE VIDEO URL
            </label>
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
                height: 38,
                padding: '0 12px',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                fontFamily: 'Outfit,sans-serif',
                fontSize: 13,
                color: '#0F172A',
                background: '#FAF8F5',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {error && (
              <span style={{ fontSize: 11.5, color: '#DC2626', marginTop: 4, display: 'block' }}>{error}</span>
            )}
          </div>

          <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', lineHeight: 1.5, margin: 0 }}>
            Supports standard YouTube video links, shorts, and timestamped URLs.
          </p>
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
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              background: '#FFFFFF',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 12,
              fontWeight: 500,
              color: '#64748B',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '8px 18px',
              border: 'none',
              borderRadius: 6,
              background: '#DC2626',
              color: '#FFFFFF',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Play size={12} fill="currentColor" /> Embed Video
          </button>
        </div>
      </div>
    </div>
  )
}
