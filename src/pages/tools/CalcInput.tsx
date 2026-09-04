import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  unit?: string
  helper?: string
  error?: string
}

export default function CalcInput({ id, label, unit, helper, error, ...rest }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--fg-dim)',
        }}
      >
        {label}
      </label>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={id}
          type="number"
          {...rest}
          style={{
            width: '100%',
            padding: unit ? '11px 52px 11px 14px' : '11px 14px',
            background: 'var(--bg)',
            border: `1px solid ${error ? 'var(--red)' : 'var(--border-strong)'}`,
            color: 'var(--fg)',
            fontFamily: 'Outfit, sans-serif',
            fontSize: 16,
            fontWeight: 500,
            outline: 'none',
            transition: 'border-color 0.18s',
            borderRadius: 2,
            appearance: 'none',
            MozAppearance: 'textfield',
            ...rest.style,
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.currentTarget.style.borderColor = error ? 'var(--red)' : 'var(--border-strong)')}
        />
        {unit && (
          <span
            style={{
              position: 'absolute',
              right: 13,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: 'var(--muted)',
              letterSpacing: '0.1em',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {(helper || error) && (
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9.5,
            letterSpacing: '0.08em',
            color: error ? 'var(--red)' : 'var(--muted)',
          }}
        >
          {error ?? helper}
        </span>
      )}
    </div>
  )
}
