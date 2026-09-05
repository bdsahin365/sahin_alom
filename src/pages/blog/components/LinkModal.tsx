import { useState, useEffect } from 'react'
import { X, Link2, ExternalLink, Trash2 } from 'lucide-react'

interface LinkModalProps {
  initialUrl?: string
  initialText?: string
  onConfirm: (url: string, text?: string) => void
  onRemove?: () => void
  onClose: () => void
}

export default function LinkModal({
  initialUrl = '',
  initialText = '',
  onConfirm,
  onRemove,
  onClose,
}: LinkModalProps) {
  const [url, setUrl] = useState(initialUrl)
  const [text, setText] = useState(initialText)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleConfirm = () => {
    let finalUrl = url.trim()
    if (!finalUrl) {
      setError('Please enter a valid URL')
      return
    }
    // Auto-prepend https:// if missing
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('/') && !finalUrl.startsWith('#')) {
      finalUrl = 'https://' + finalUrl
    }
    onConfirm(finalUrl, text.trim() || undefined)
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
          maxWidth: 460,
          boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(196,125,14,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'min(92dvh, 480px)',
          animation: 'linkModalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
                background: 'rgba(196,125,14,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C47D0E',
                border: '1px solid rgba(196,125,14,0.2)',
              }}
            >
              <Link2 size={17} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 16, color: '#0F172A', margin: 0 }}>
                {initialUrl ? 'Edit Hyperlink' : 'Insert Hyperlink'}
              </h3>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748B', letterSpacing: '0.05em' }}>
                TECHNICAL REFERENCE
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
          {/* Link URL */}
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
              DESTINATION URL *
            </label>
            <div style={{ position: 'relative' }}>
              <ExternalLink
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
                placeholder="https://example.com/specifications"
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
                    e.currentTarget.style.borderColor = '#C47D0E'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(196,125,14,0.12)'
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

          {/* Link Display Text (optional) */}
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
              DISPLAY TEXT (OPTIONAL)
            </label>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Leave blank to use selected text or destination URL"
              style={{
                width: '100%',
                height: 42,
                padding: '0 12px',
                border: '1px solid #E2E8F0',
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
                e.currentTarget.style.borderColor = '#C47D0E'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(196,125,14,0.12)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderTop: '1px solid #F1F5F9',
            background: '#FAF8F5',
            flexShrink: 0,
            gap: 10,
          }}
        >
          <div>
            {initialUrl && onRemove && (
              <button
                onClick={() => {
                  onRemove()
                  onClose()
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  border: 'none',
                  background: 'rgba(220,38,38,0.08)',
                  color: '#DC2626',
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: 6,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)' }}
              >
                <Trash2 size={13} /> Remove Link
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
                background: '#C47D0E',
                color: '#FFFFFF',
                fontFamily: 'Outfit,sans-serif',
                fontSize: 12.5,
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(196,125,14,0.25)',
                transition: 'transform 0.15s, opacity 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              {initialUrl ? 'Update Link' : 'Insert Link'}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes linkModalPop {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

