import { useEffect } from 'react'
import { X, Keyboard } from 'lucide-react'

interface ShortcutsDialogProps {
  onClose: () => void
}

type ShortcutRow = { action: string; keys: string[] }
type Section = { title: string; rows: ShortcutRow[] }

const SECTIONS: Section[] = [
  {
    title: 'FORMATTING & WRITING',
    rows: [
      { action: 'Bold text',           keys: ['Ctrl', 'B'] },
      { action: 'Italic text',         keys: ['Ctrl', 'I'] },
      { action: 'Underline text',      keys: ['Ctrl', 'U'] },
      { action: 'Insert Hyperlink',    keys: ['Ctrl', 'K'] },
      { action: 'Undo edit',           keys: ['Ctrl', 'Z'] },
      { action: 'Redo edit',           keys: ['Ctrl', 'Shift', 'Z'] },
      { action: 'Highlight selection', keys: ['Ctrl', 'Shift', 'H'] },
    ],
  },
  {
    title: 'BLOCK ELEMENTS',
    rows: [
      { action: 'Command slash palette', keys: ['/'] },
      { action: 'LaTeX Math equation',   keys: ['Ctrl', 'E'] },
      { action: 'Code snippet block',    keys: ['```', 'Enter'] },
      { action: 'Insert tabular grid',   keys: ['Ctrl', 'Shift', 'T'] },
      { action: 'Heading 1',             keys: ['#', 'Space'] },
      { action: 'Heading 2',             keys: ['##', 'Space'] },
      { action: 'Bullet list',           keys: ['-', 'Space'] },
      { action: 'Numbered list',         keys: ['1.', 'Space'] },
      { action: 'Callout blockquote',    keys: ['>', 'Space'] },
    ],
  },
  {
    title: 'ENGINEERING WORKFLOW',
    rows: [
      { action: 'Save article draft',   keys: ['Ctrl', 'S'] },
      { action: 'Preview live article', keys: ['Ctrl', 'P'] },
      { action: 'Open publish dialog',  keys: ['Ctrl', 'Shift', 'P'] },
      { action: 'Toggle settings pane', keys: ['Ctrl', '\\'] },
      { action: 'Open shortcuts cheat', keys: ['?'] },
    ],
  },
]

function Key({ children }: { children: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 24,
        height: 22,
        padding: '0 6px',
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderBottom: '2.5px solid #94A3B8',
        borderRadius: 5,
        fontFamily: 'JetBrains Mono,monospace',
        fontSize: 10.5,
        fontWeight: 600,
        color: '#0F172A',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      {children}
    </span>
  )
}

export default function ShortcutsDialog({ onClose }: ShortcutsDialogProps) {
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
          maxHeight: 'min(88dvh, 580px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(196,125,14,0.15)',
          overflow: 'hidden',
          animation: 'shortcutsModalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
              <Keyboard size={17} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 16, color: '#0F172A', margin: 0 }}>
                Keyboard Shortcuts
              </h3>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748B', letterSpacing: '0.05em' }}>
                ACCELERATORS
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

        {/* Sections */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '12px 20px 16px' }}>
          {SECTIONS.map(section => (
            <div key={section.title} style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 9.5,
                  letterSpacing: '0.14em',
                  color: '#C47D0E',
                  padding: '6px 0 8px',
                  fontWeight: 700,
                }}
              >
                {section.title}
              </div>
              <div style={{ background: '#FAF8F5', borderRadius: 8, border: '1px solid #E2E8F0', padding: '2px 12px' }}>
                {section.rows.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: i < section.rows.length - 1 ? '1px solid #F1F5F9' : 'none',
                    }}
                  >
                    <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#1E293B', fontWeight: 500 }}>
                      {row.action}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {row.keys.map((k, j) => (
                        <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Key>{k}</Key>
                          {j < row.keys.length - 1 && <span style={{ color: '#94A3B8', fontSize: 11, fontWeight: 700 }}>+</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', background: '#FAF8F5', flexShrink: 0 }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.05em', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Press</span> <Key>?</Key> <span>anywhere in the engineering editor to summon this guide</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shortcutsModalPop {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

