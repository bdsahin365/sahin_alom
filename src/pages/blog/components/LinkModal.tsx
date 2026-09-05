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
          maxWidth: 440,
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
                background: 'rgba(196,125,14,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C47D0E',
              }}
            >
              <Link2 size={16} />
            </div>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 16, color: '#0F172A', margin: 0 }}>
              {initialUrl ? 'Edit Hyperlink' : 'Insert Hyperlink'}
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
              }}
            >
              DESTINATION URL
            </label>
            <div style={{ position: 'relative' }}>
              <ExternalLink
                size={14}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
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
                  height: 38,
                  padding: '0 12px 0 34px',
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
            </div>
            {error && (
              <span style={{ fontSize: 11.5, color: '#DC2626', marginTop: 4, display: 'block' }}>{error}</span>
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
              }}
            >
              DISPLAY TEXT (OPTIONAL)
            </label>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Leave blank to use selected text"
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
                  gap: 4,
                  border: 'none',
                  background: 'none',
                  color: '#DC2626',
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                <Trash2 size={13} /> Remove Link
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
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
                background: '#C47D0E',
                color: '#FFFFFF',
                fontFamily: 'Outfit,sans-serif',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {initialUrl ? 'Update Link' : 'Insert Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
