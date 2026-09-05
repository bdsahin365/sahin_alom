import { useEffect } from 'react'
import { X, RotateCcw, Eye, GitCompare, History } from 'lucide-react'

interface Version {
  id: string
  label: string
  date: string
  author: string
  summary: string
  isCurrent: boolean
}

interface VersionHistoryProps {
  articleTitle: string
  versions: Version[]
  onClose: () => void
  onRestore: (id: string) => void
}

export default function VersionHistory({ articleTitle, versions, onClose, onRestore }: VersionHistoryProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

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
          maxWidth: 440,
          maxHeight: 'min(88dvh, 600px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(196,125,14,0.15)',
          overflow: 'hidden',
          animation: 'versionModalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
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
                flexShrink: 0,
              }}
            >
              <History size={17} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 16, color: '#0F172A', margin: 0 }}>
                Version History
              </h3>
              <p
                style={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 12,
                  color: '#64748B',
                  margin: '2px 0 0',
                  maxWidth: 260,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {articleTitle || 'Untitled Draft'}
              </p>
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

        {/* Versions List */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '10px 0' }}>
          {versions.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8', fontFamily: 'Outfit,sans-serif', fontSize: 13 }}>
              No previous revisions saved yet. Checkpoints are automatically registered during edits.
            </div>
          ) : (
            versions.map((v, i) => (
              <div
                key={v.id}
                style={{
                  padding: '12px 20px',
                  borderLeft: v.isCurrent ? '3px solid #C47D0E' : '3px solid transparent',
                  background: v.isCurrent ? '#FEF9EC' : 'transparent',
                  borderBottom: i < versions.length - 1 ? '1px solid #F8FAFC' : 'none',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  {v.isCurrent && (
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono,monospace',
                        fontSize: 8.5,
                        letterSpacing: '0.14em',
                        color: '#C47D0E',
                        background: '#FEF3C7',
                        border: '1px solid #F5E6C8',
                        borderRadius: 4,
                        padding: '1px 6px',
                        fontWeight: 700,
                      }}
                    >
                      CURRENT
                    </span>
                  )}
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>
                    {v.label}
                  </span>
                </div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11.5, color: '#64748B', marginBottom: 4 }}>
                  {v.date} · {v.author}
                </div>
                {v.summary && (
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11.5, color: '#94A3B8', fontStyle: 'italic', marginBottom: 8 }}>
                    {v.summary}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: '#64748B',
                      fontSize: 11.5,
                      fontFamily: 'Outfit,sans-serif',
                      fontWeight: 500,
                      padding: 0,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B' }}
                  >
                    <Eye size={12} /> Preview
                  </button>
                  {!v.isCurrent && (
                    <>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: '#64748B',
                          fontSize: 11.5,
                          fontFamily: 'Outfit,sans-serif',
                          fontWeight: 500,
                          padding: 0,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B' }}
                      >
                        <GitCompare size={12} /> Compare
                      </button>
                      <button
                        onClick={() => onRestore(v.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: '#C47D0E',
                          fontSize: 11.5,
                          fontFamily: 'Outfit,sans-serif',
                          fontWeight: 600,
                          padding: 0,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                      >
                        <RotateCcw size={12} /> Restore Revision
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', background: '#FAF8F5', flexShrink: 0 }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.08em', color: '#94A3B8' }}>
            Automatic checkpoints created every 5 minutes during editing sessions
          </div>
        </div>
      </div>
      <style>{`
        @keyframes versionModalPop {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

