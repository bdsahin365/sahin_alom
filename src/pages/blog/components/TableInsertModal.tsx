import { useState, useEffect } from 'react'
import { X, Table as TableIcon, Check } from 'lucide-react'

interface TableInsertModalProps {
  onConfirm: (rows: number, cols: number, withHeaderRow: boolean) => void
  onClose: () => void
}

export default function TableInsertModal({ onConfirm, onClose }: TableInsertModalProps) {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [withHeaderRow, setWithHeaderRow] = useState(true)
  const [hoveredRow, setHoveredRow] = useState(0)
  const [hoveredCol, setHoveredCol] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleConfirm = () => {
    const r = Math.max(1, Math.min(20, rows))
    const c = Math.max(1, Math.min(10, cols))
    onConfirm(r, c, withHeaderRow)
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
          maxWidth: 440,
          boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(196,125,14,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'min(92dvh, 560px)',
          animation: 'tableModalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
              <TableIcon size={17} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 16, color: '#0F172A', margin: 0 }}>
                Insert Table
              </h3>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748B', letterSpacing: '0.05em' }}>
                TABULAR MATRIX
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
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto', flex: 1 }}>
          {/* Visual Grid Picker (up to 6x6) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                QUICK GRID MATRIX
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#C47D0E',
                  background: '#FEF9EC',
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: '1px solid #F5E6C8',
                }}
              >
                {hoveredRow || rows} × {hoveredCol || cols}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 6,
                padding: 12,
                background: '#FAF8F5',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                maxWidth: 240,
                margin: '0 auto',
              }}
              onMouseLeave={() => {
                setHoveredRow(0)
                setHoveredCol(0)
              }}
            >
              {Array.from({ length: 6 }).map((_, rIdx) =>
                Array.from({ length: 6 }).map((_, cIdx) => {
                  const rNum = rIdx + 1
                  const cNum = cIdx + 1
                  const isHovered = (hoveredRow >= rNum && hoveredCol >= cNum) || (!hoveredRow && rows >= rNum && cols >= cNum)
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onMouseEnter={() => {
                        setHoveredRow(rNum)
                        setHoveredCol(cNum)
                      }}
                      onClick={() => {
                        setRows(rNum)
                        setCols(cNum)
                      }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        background: isHovered ? '#C47D0E' : '#E2E8F0',
                        cursor: 'pointer',
                        transition: 'background 0.1s, transform 0.1s',
                        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                        boxShadow: isHovered ? '0 2px 6px rgba(196,125,14,0.3)' : 'none',
                      }}
                    />
                  )
                })
              )}
            </div>
          </div>

          {/* Number Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
                ROWS (1–20)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={rows}
                onChange={e => setRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                style={{
                  width: '100%',
                  height: 40,
                  padding: '0 12px',
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 13.5,
                  color: '#0F172A',
                  background: '#FAF8F5',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

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
                COLUMNS (1–10)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={cols}
                onChange={e => setCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                style={{
                  width: '100%',
                  height: 40,
                  padding: '0 12px',
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 13.5,
                  color: '#0F172A',
                  background: '#FAF8F5',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Header Row Checkbox */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 13,
              color: '#334155',
              padding: '10px 12px',
              borderRadius: 8,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
            }}
          >
            <input
              type="checkbox"
              checked={withHeaderRow}
              onChange={e => setWithHeaderRow(e.target.checked)}
              style={{ accentColor: '#C47D0E', width: 17, height: 17, cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 500 }}>Include Header Row (Bold & Shaded)</span>
          </label>
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
              background: '#C47D0E',
              color: '#FFFFFF',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(196,125,14,0.25)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Insert Table
          </button>
        </div>
      </div>
      <style>{`
        @keyframes tableModalPop {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

