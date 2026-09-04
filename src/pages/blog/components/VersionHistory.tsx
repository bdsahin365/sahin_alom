import { X, RotateCcw, Eye, GitCompare } from 'lucide-react'

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
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 20 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: '100%', maxWidth: 400, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.16)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '18px 20px 12px', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 15, color: '#0F172A', margin: 0 }}>Version History</h2>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginTop: 2, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{articleTitle}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, borderRadius: 4 }}>
            <X size={16} />
          </button>
        </div>

        {/* Versions */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
          {versions.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: '#94A3B8', fontFamily: 'Outfit,sans-serif', fontSize: 13 }}>
              No versions saved yet. Versions are created automatically every 5 minutes.
            </div>
          ) : versions.map((v, i) => (
            <div key={v.id} style={{
              padding: '12px 20px',
              borderLeft: v.isCurrent ? '3px solid #C47D0E' : '3px solid transparent',
              background: v.isCurrent ? '#FEF9EC' : 'transparent',
              borderBottom: i < versions.length - 1 ? '1px solid #F8FAFC' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                {v.isCurrent && (
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, letterSpacing: '0.15em', color: '#C47D0E', background: '#FEF3C7', border: '1px solid #F5E6C8', borderRadius: 3, padding: '1px 5px' }}>
                    CURRENT
                  </span>
                )}
                <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{v.label}</span>
              </div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#64748B', marginBottom: 4 }}>
                {v.date} · {v.author}
              </div>
              {v.summary && (
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8', fontStyle: 'italic', marginBottom: 8 }}>
                  {v.summary}
                </div>
              )}
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#64748B', fontSize: 11, fontFamily: 'Outfit,sans-serif', padding: 0 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B' }}>
                  <Eye size={11} /> Preview
                </button>
                {!v.isCurrent && (
                  <>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#64748B', fontSize: 11, fontFamily: 'Outfit,sans-serif', padding: 0 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B' }}>
                      <GitCompare size={11} /> Compare
                    </button>
                    <button
                      onClick={() => onRestore(v.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#64748B', fontSize: 11, fontFamily: 'Outfit,sans-serif', padding: 0 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B' }}>
                      <RotateCcw size={11} /> Restore
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid #F1F5F9', flexShrink: 0 }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.12em', color: '#94A3B8' }}>
            Versions saved automatically every 5 minutes
          </div>
        </div>
      </div>
    </div>
  )
}
