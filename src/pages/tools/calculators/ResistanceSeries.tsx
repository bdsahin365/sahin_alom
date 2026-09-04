import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import ResultBox from '../ResultBox'

const MAX_RESISTORS = 10

export default function ResistanceSeries() {
  const [resistors, setResistors] = useState(['100', '220', '470'])

  const reset = () => setResistors(['100', '220', '470'])

  const add = () => setResistors(r => r.length < MAX_RESISTORS ? [...r, ''] : r)
  const remove = (i: number) => setResistors(r => r.length > 2 ? r.filter((_, idx) => idx !== i) : r)
  const set = (i: number, v: string) => setResistors(r => r.map((x, idx) => idx === i ? v : x))

  const values = resistors.map(r => parseFloat(r))
  const allValid = values.every(v => !isNaN(v) && v >= 0)
  const total = allValid ? values.reduce((a, b) => a + b, 0) : null
  const displayVal = total !== null ? parseFloat(total.toFixed(4)).toString() : null
  const status = total !== null ? 'ok' : 'idle'
  const resultText = total !== null ? `${displayVal} Ω` : undefined

  return (
    <CalculatorShell
      title="Series Resistance Calculator"
      description="Add the resistance values of resistors connected in series to find the total equivalent resistance."
      category="Basic Electrical"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        {resistors.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <CalcInput
                id={`res-s-${i}`}
                label={`R${i + 1}`}
                unit="Ω"
                value={r}
                min={0}
                step={1}
                onChange={e => set(i, e.target.value)}
              />
            </div>
            {resistors.length > 2 && (
              <button
                onClick={() => remove(i)}
                title="Remove"
                style={{
                  flexShrink: 0, height: 43, width: 36,
                  background: 'none', border: '1px solid var(--border-strong)',
                  color: 'var(--muted)', cursor: 'pointer', borderRadius: 2,
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 16,
                  transition: 'border-color 0.18s, color 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--muted)' }}
              >×</button>
            )}
          </div>
        ))}
        {resistors.length < MAX_RESISTORS && (
          <button
            onClick={add}
            style={{
              alignSelf: 'flex-start',
              background: 'none', border: '1px solid var(--border-strong)',
              color: 'var(--fg-dim)', cursor: 'pointer', borderRadius: 2,
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '7px 14px',
              transition: 'border-color 0.18s, color 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--fg-dim)' }}
          >+ Add Resistor</button>
        )}
      </>}
      results={<ResultBox label="Total Series Resistance" value={displayVal} unit="Ω" status={status}
        note={allValid ? `${resistors.join(' + ')} Ω` : undefined} />}
      formula={<>
        <p><strong>R_total = R1 + R2 + R3 + ... + Rn</strong></p>
        <p>In a series circuit, the same current flows through every resistor. The total resistance is simply the arithmetic sum of all individual resistances.</p>
      </>}
      example={<>
        <p>Three resistors: 100 Ω + 220 Ω + 470 Ω</p>
        <p><strong>R_total = 100 + 220 + 470 = 790 Ω</strong></p>
      </>}
      notes={<>
        In a series circuit, the equivalent resistance is always greater than the largest individual resistor.
        Current is the same through all resistors, but voltage is divided proportionally.
      </>}
    />
  )
}
