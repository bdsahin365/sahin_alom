import type { SelectHTMLAttributes } from 'react'

type Option = { label: string; value: string }

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string
  label: string
  options: Option[]
  helper?: string
}

export default function CalcSelect({ id, label, options, helper, ...rest }: Props) {
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

      <div style={{ position: 'relative' }}>
        <select
          id={id}
          {...rest}
          style={{
            width: '100%',
            padding: '11px 36px 11px 14px',
            background: 'var(--bg)',
            border: '1px solid var(--border-strong)',
            color: 'var(--fg)',
            fontFamily: 'Outfit, sans-serif',
            fontSize: 15,
            fontWeight: 500,
            outline: 'none',
            appearance: 'none',
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'border-color 0.18s',
            ...rest.style,
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {/* chevron */}
        <svg
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          width="12" height="12" viewBox="0 0 12 12" fill="none"
        >
          <path d="M2 4l4 4 4-4" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {helper && (
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.08em', color: 'var(--muted)' }}>
          {helper}
        </span>
      )}
    </div>
  )
}
