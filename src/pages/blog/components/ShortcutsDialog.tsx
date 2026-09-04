import { X } from 'lucide-react'

interface ShortcutsDialogProps {
  onClose: () => void
}

type ShortcutRow = { action: string; keys: string[] }
type Section = { title: string; rows: ShortcutRow[] }

const SECTIONS: Section[] = [
  {
    title: 'WRITING',
    rows: [
      { action: 'Bold',         keys: ['Ctrl', 'B'] },
      { action: 'Italic',       keys: ['Ctrl', 'I'] },
      { action: 'Underline',    keys: ['Ctrl', 'U'] },
      { action: 'Insert Link',  keys: ['Ctrl', 'K'] },
      { action: 'Undo',         keys: ['Ctrl', 'Z'] },
      { action: 'Redo',         keys: ['Ctrl', '⇧', 'Z'] },
      { action: 'Highlight',    keys: ['Ctrl', '⇧', 'H'] },
    ],
  },
  {
    title: 'BLOCKS',
    rows: [
      { action: 'Command menu', keys: ['/'] },
      { action: 'Math equation', keys: ['Ctrl', 'E'] },
      { action: 'Code block',   keys: ['```', 'Enter'] },
      { action: 'Table',        keys: ['Ctrl', '⇧', 'T'] },
      { action: 'Heading 1',    keys: ['#', 'Space'] },
      { action: 'Heading 2',    keys: ['##', 'Space'] },
      { action: 'Bullet list',  keys: ['-', 'Space'] },
      { action: 'Numbered list', keys: ['1.', 'Space'] },
      { action: 'Blockquote',   keys: ['>', 'Space'] },
    ],
  },
  {
    title: 'EDITOR',
    rows: [
      { action: 'Save',         keys: ['Ctrl', 'S'] },
      { action: 'Preview',      keys: ['Ctrl', 'P'] },
      { action: 'Publish',      keys: ['Ctrl', '⇧', 'P'] },
      { action: 'Toggle panel', keys: ['Ctrl', '\\'] },
      { action: 'Shortcuts',    keys: ['?'] },
    ],
  },
]

function Key({ children }: { children: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 22, height: 20, padding: '0 5px',
      background: '#F1F5F9', border: '1px solid #E2E8F0',
      borderBottom: '2px solid #CBD5E1', borderRadius: 4,
      fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#374151',
    }}>
      {children}
    </span>
  )
}

export default function ShortcutsDialog({ onClose }: ShortcutsDialogProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 20 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: '100%', maxWidth: 380, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.16)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 15, color: '#0F172A', margin: 0 }}>Keyboard Shortcuts</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}><X size={16} /></button>
        </div>

        {/* Sections */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 20px 16px' }}>
          {SECTIONS.map(section => (
            <div key={section.title} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.18em', color: '#C47D0E', padding: '10px 0 6px' }}>
                {section.title}
              </div>
              {section.rows.map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F8FAFC' }}>
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#374151' }}>{row.action}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    {row.keys.map((k, j) => (
                      <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Key>{k}</Key>
                        {j < row.keys.length - 1 && <span style={{ color: '#CBD5E1', fontSize: 10 }}>+</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid #F1F5F9', flexShrink: 0 }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.1em', color: '#94A3B8' }}>
            Press ? anywhere in the editor to show this dialog
          </div>
        </div>
      </div>
    </div>
  )
}
