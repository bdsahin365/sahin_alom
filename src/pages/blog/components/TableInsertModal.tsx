import { useState } from 'react'
import { X, Table as TableIcon } from 'lucide-react'

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
          maxWidth: 420,
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
              <TableIcon size={16} />
            </div>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 16, color: '#0F172A', margin: 0 }}>
              Insert Table
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
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Visual Grid Picker (up to 6x6) */}
          <div>
            <div
              style={{
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 10,
                letterSpacing: '0.12em',
                color: '#64748B',
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              QUICK GRID PICKER ({hoveredRow || rows} × {hoveredCol || cols})
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 4,
                padding: 8,
                background: '#FAF8F5',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
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
                        width: 24,
                        height: 24,
                        borderRadius: 3,
                        background: isHovered ? '#C47D0E' : '#E2E8F0',
                        cursor: 'pointer',
                        transition: 'background 0.1s',
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
                }}
              >
                ROWS
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={rows}
                onChange={e => setRows(parseInt(e.target.value) || 1)}
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
                COLUMNS
              </label>
              <input
                type="number"
                min={1}
                max={15}
                value={cols}
                onChange={e => setCols(parseInt(e.target.value) || 1)}
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

          {/* Header Row Checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#334155' }}>
            <input
              type="checkbox"
              checked={withHeaderRow}
              onChange={e => setWithHeaderRow(e.target.checked)}
              style={{ accentColor: '#C47D0E', width: 16, height: 16 }}
            />
            <span>Include Header Row</span>
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
              background: '#C47D0E',
              color: '#FFFFFF',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  )
}
