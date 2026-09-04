import { type ReactNode, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  ChevronLeft, Eye, RotateCcw, Monitor, Tablet, Smartphone,
  Check, Loader2, MoreHorizontal, Copy, Download, History, Archive, Trash2, FileInput,
  Settings2,
} from 'lucide-react'

interface EditorTopBarProps {
  status: 'draft' | 'published' | 'scheduled'
  saved: boolean
  lastSaved: string
  onBack: () => void
  onUndo: () => void
  onRedo: () => void
  onPreview: () => void
  onPublish: () => void
  onHistory: () => void
  onShortcuts: () => void
  previewMode: 'desktop' | 'tablet' | 'mobile' | null
  onPreviewMode: (m: 'desktop' | 'tablet' | 'mobile' | null) => void
  canUndo: boolean
  canRedo: boolean
  onToggleSettings?: () => void
  settingsOpen?: boolean
}

const STATUS_LABELS: Record<string, { label: string; bg: string; color: string; border: string }> = {
  draft:     { label: 'DRAFT',     bg: '#FEF3C7', color: '#92400E', border: '#C47D0E' },
  published: { label: 'PUBLISHED', bg: '#DCFCE7', color: '#15803D', border: '#16A34A' },
  scheduled: { label: 'SCHEDULED', bg: '#EEF2FF', color: '#3730A3', border: '#6366F1' },
}

function IconBtn({
  onClick, title, disabled, children, active,
}: {
  onClick?: () => void; title: string; disabled?: boolean; children: ReactNode; active?: boolean
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 30, borderRadius: 5, border: 'none',
        background: active ? '#FEF3C7' : 'transparent',
        color: active ? '#C47D0E' : disabled ? '#CBD5E1' : '#64748B',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        if (!disabled) (e.currentTarget as HTMLElement).style.background = '#F1F5F9'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = active ? '#FEF3C7' : 'transparent'
      }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 20, background: '#E2E8F0', margin: '0 4px' }} />
}

export default function EditorTopBar({
  status, saved, lastSaved, onBack, onUndo, onRedo, onPreview,
  onPublish, onHistory, onShortcuts, previewMode, onPreviewMode,
  canUndo, canRedo, onToggleSettings, settingsOpen,
}: EditorTopBarProps) {
  const [moreOpen, setMoreOpen] = useState(false)
  const s = STATUS_LABELS[status] || STATUS_LABELS.draft

  return (
    <header style={{
      height: 48, display: 'flex', alignItems: 'center', padding: '0 14px',
      background: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
      gap: 8, flexShrink: 0, position: 'relative', zIndex: 50,
    }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#64748B', fontSize: 12, fontFamily: 'Outfit,sans-serif',
          padding: '4px 6px', borderRadius: 5, transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0F172A'; (e.currentTarget as HTMLElement).style.background = '#F1F5F9' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
      >
        <ChevronLeft size={15} /> <span className="editor-back-text">Articles</span>
      </button>

      <Divider />

      {/* Status badge */}
      <span style={{
        fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.18em',
        padding: '3px 7px', borderRadius: 4, border: `1px solid ${s.border}`,
        background: s.bg, color: s.color, whiteSpace: 'nowrap',
      }}>
        {s.label}
      </span>

      {/* Autosave */}
      <div className="editor-autosave-box" style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 2 }}>
        {saved
          ? <><Check size={11} style={{ color: '#16A34A' }} /><span className="editor-autosave-text" style={{ fontSize: 11, color: '#16A34A', fontFamily: 'Outfit,sans-serif' }}>{lastSaved}</span></>
          : <><Loader2 size={11} style={{ color: '#C47D0E', animation: 'spin 1s linear infinite' }} /><span className="editor-autosave-text" style={{ fontSize: 11, color: '#C47D0E', fontFamily: 'Outfit,sans-serif' }}>Saving…</span></>
        }
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Desktop Actions */}
      <div className="editor-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* Undo / Redo */}
        <IconBtn title="Undo (Ctrl+Z)" onClick={onUndo} disabled={!canUndo}>
          <RotateCcw size={14} />
        </IconBtn>
        <IconBtn title="Redo (Ctrl+Shift+Z)" onClick={onRedo} disabled={!canRedo}>
          <RotateCcw size={14} style={{ transform: 'scaleX(-1)' }} />
        </IconBtn>

        <Divider />

        {/* Preview button */}
        <button
          onClick={onPreview}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            height: 30, padding: '0 10px', border: '1px solid #E2E8F0',
            borderRadius: 5, background: 'transparent', cursor: 'pointer',
            fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.1em',
            color: '#64748B', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'; (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#64748B' }}
        >
          <Eye size={12} /> PREVIEW
        </button>

        {/* Preview modes */}
        <IconBtn title="Desktop preview" onClick={() => onPreviewMode(previewMode === 'desktop' ? null : 'desktop')} active={previewMode === 'desktop'}>
          <Monitor size={14} />
        </IconBtn>
        <IconBtn title="Tablet preview" onClick={() => onPreviewMode(previewMode === 'tablet' ? null : 'tablet')} active={previewMode === 'tablet'}>
          <Tablet size={14} />
        </IconBtn>
        <IconBtn title="Mobile preview" onClick={() => onPreviewMode(previewMode === 'mobile' ? null : 'mobile')} active={previewMode === 'mobile'}>
          <Smartphone size={14} />
        </IconBtn>

        <Divider />
      </div>

      {/* Settings Toggle */}
      {onToggleSettings && (
        <IconBtn title="Article Settings" onClick={onToggleSettings} active={settingsOpen}>
          <Settings2 size={15} />
        </IconBtn>
      )}

      {/* Publish */}
      <button
        onClick={onPublish}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          height: 32, padding: '0 14px', border: 'none',
          borderRadius: 5, background: '#C47D0E', cursor: 'pointer',
          fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600,
          letterSpacing: '0.04em', textTransform: 'uppercase', color: '#FFFFFF',
          transition: 'opacity 0.15s', flexShrink: 0,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
      >
        {status === 'published' ? 'Update' : 'Publish'}
      </button>

      {/* More actions */}
      <div style={{ position: 'relative' }}>
        <IconBtn title="More actions" onClick={() => setMoreOpen(o => !o)}>
          <MoreHorizontal size={16} />
        </IconBtn>
        {moreOpen && (
          <div style={{
            position: 'absolute', right: 0, top: 36, width: 200,
            background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100,
            padding: 4,
          }}>
            {[
              { icon: <Eye size={13} />,       label: 'Preview Article', onClick: () => { onPreview(); setMoreOpen(false) } },
              { icon: <Copy size={13} />,      label: 'Duplicate' },
              { icon: <FileInput size={13} />, label: 'Import Markdown' },
              { icon: <Download size={13} />,  label: 'Export Markdown' },
              { icon: <History size={13} />,   label: 'Version History', onClick: () => { onHistory(); setMoreOpen(false) } },
              null,
              { icon: <Archive size={13} />,   label: 'Archive', color: '#64748B' },
              { icon: <Trash2 size={13} />,    label: 'Delete Article', color: '#EF4444' },
            ].map((item, i) =>
              item === null ? (
                <div key={i} style={{ height: 1, background: '#F1F5F9', margin: '4px 0' }} />
              ) : (
                <button
                  key={i}
                  onClick={item.onClick}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '8px 10px', background: 'none',
                    border: 'none', cursor: 'pointer', borderRadius: 5,
                    fontFamily: 'Outfit,sans-serif', fontSize: 13,
                    color: item.color || '#374151', transition: 'background 0.15s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F8FAFC' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <span style={{ color: item.color || '#94A3B8' }}>{item.icon}</span>
                  {item.label}
                </button>
              )
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .editor-desktop-actions { display: none !important; }
          .editor-autosave-text { display: none !important; }
        }
        @media (max-width: 440px) {
          .editor-back-text { display: none !important; }
        }
      `}</style>
    </header>
  )
}
