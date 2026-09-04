type Props = {
  label: string
  value: string | number | null
  unit?: string
  note?: string
  status?: 'idle' | 'ok' | 'error'
}

export default function ResultBox({ label, value, unit, note, status = 'idle' }: Props) {
  const bg =
    status === 'ok'    ? 'rgba(22,163,74,0.07)'  :
    status === 'error' ? 'rgba(220,38,38,0.07)'  :
    'var(--bg-2)'

  const border =
    status === 'ok'    ? 'rgba(22,163,74,0.35)'  :
    status === 'error' ? 'rgba(220,38,38,0.35)'  :
    'var(--border)'

  const valueColor =
    status === 'ok'    ? 'var(--green)' :
    status === 'error' ? 'var(--red)'   :
    'var(--fg-dim)'

  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 4,
      padding: '28px 24px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      transition: 'background 0.3s, border-color 0.3s',
      minHeight: 120,
      justifyContent: 'center',
    }}>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9.5,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
      }}>
        {label}
      </span>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(36px, 6vw, 56px)',
          lineHeight: 1,
          color: valueColor,
          transition: 'color 0.3s',
          letterSpacing: '-0.01em',
        }}>
          {value === null || value === '' ? '—' : String(value)}
        </span>
        {unit && value !== null && value !== '' && (
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 14,
            color: 'var(--fg-dim)',
            letterSpacing: '0.06em',
          }}>
            {unit}
          </span>
        )}
      </div>

      {note && (
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9.5,
          letterSpacing: '0.08em',
          color: 'var(--muted)',
        }}>
          {note}
        </span>
      )}
    </div>
  )
}
