import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import ResultBox from '../ResultBox'

const MAX_RESISTORS = 10

export default function ResistanceParallel() {
  const [resistors, setResistors] = useState(['100', '220', '470'])

  const reset = () => setResistors(['100', '220', '470'])

  const add = () => setResistors(r => r.length < MAX_RESISTORS ? [...r, ''] : r)
  const remove = (i: number) => setResistors(r => r.length > 2 ? r.filter((_, idx) => idx !== i) : r)
  const set = (i: number, v: string) => setResistors(r => r.map((x, idx) => idx === i ? v : x))

  const values = resistors.map(r => parseFloat(r))
  const allValid = values.every(v => !isNaN(v) && v > 0)

  // 1/R_total = Σ(1/Ri)
  const reciprocalSum = allValid ? values.reduce((a, b) => a + 1 / b, 0) : null
  const total = reciprocalSum !== null && reciprocalSum !== 0 ? 1 / reciprocalSum : null
  const displayVal = total !== null ? parseFloat(total.toFixed(4)).toString() : null
  const status = total !== null ? 'ok' : 'idle'
  const resultText = total !== null ? `${displayVal} Ω` : undefined

  return (
    <CalculatorShell
      title="Parallel Resistance Calculator"
      description="Find the equivalent resistance of any number of resistors wired in parallel. All resistors must have values greater than zero."
      category="Basic Electrical"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        {resistors.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <CalcInput
                id={`res-p-${i}`}
                label={`R${i + 1}`}
                unit="Ω"
                value={r}
                min={0.001}
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
      results={<ResultBox label="Equivalent Parallel Resistance" value={displayVal} unit="Ω" status={status}
        note={allValid ? `1/R = ${values.map(v => `1/${v}`).join(' + ')}` : undefined} />}
      formula={<>
        <p><strong>1 / R_eq = 1/R1 + 1/R2 + ... + 1/Rn</strong></p>
        <p>For two resistors: <strong>R_eq = (R1 × R2) / (R1 + R2)</strong></p>
        <p>The equivalent resistance of a parallel network is always less than the smallest individual resistor.</p>
      </>}
      example={<>
        <p>Two resistors in parallel: 100 Ω ∥ 100 Ω</p>
        <p><strong>R_eq = (100 × 100) / (100 + 100) = 50 Ω</strong></p>
      </>}
      notes={<>
        All resistor values must be greater than zero. A zero-ohm resistor in parallel creates a short circuit.
        Adding more parallel resistors always decreases total resistance.
      </>}
    />
  )
}
