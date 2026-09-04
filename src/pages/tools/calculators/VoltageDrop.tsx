import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import CalcSelect from '../CalcSelect'
import ResultBox from '../ResultBox'

// Resistivity in Ω·mm²/m (conductor resistivity at 75°C operating temp)
const RESISTIVITY: Record<string, number> = {
  copper:    0.0217,
  aluminium: 0.0357,
}

const DEFAULTS = { current: '20', length: '50', voltage: '230', phase: '1phase', material: 'copper', pf: '0.85' }

export default function VoltageDrop() {
  const [current, setCurrent] = useState(DEFAULTS.current)
  const [length, setLength] = useState(DEFAULTS.length)
  const [voltage, setVoltage] = useState(DEFAULTS.voltage)
  const [csa, setCsa] = useState('4')   // cross-sectional area mm²
  const [phase, setPhase] = useState(DEFAULTS.phase)
  const [material, setMaterial] = useState(DEFAULTS.material)
  const [pf, setPf] = useState(DEFAULTS.pf)

  const reset = () => {
    setCurrent(DEFAULTS.current); setLength(DEFAULTS.length)
    setVoltage(DEFAULTS.voltage); setCsa('4')
    setPhase(DEFAULTS.phase); setMaterial(DEFAULTS.material); setPf(DEFAULTS.pf)
  }

  const I = parseFloat(current), L = parseFloat(length)
  const V = parseFloat(voltage), A = parseFloat(csa), PF = parseFloat(pf)
  const ρ = RESISTIVITY[material] ?? 0.0217
  const allValid = !isNaN(I) && !isNaN(L) && !isNaN(V) && !isNaN(A) && I > 0 && L > 0 && A > 0 && V > 0

  // VD = (ρ × L × I × k) / A   where k=2 for single-phase (go+return), √3 for 3-phase
  const k = phase === '3phase' ? Math.sqrt(3) : 2
  const vd = allValid ? (ρ * L * I * k) / A : null
  const vdPct = (vd !== null) ? (vd / V) * 100 : null
  const vAtLoad = (vd !== null) ? V - vd : null

  const tooHigh = vdPct !== null && vdPct > 5   // IEC/BD acceptable limit ~5%

  const fmt = (v: number | null, d = 3) => v !== null ? parseFloat(v.toFixed(d)).toString() : null
  const status = vd !== null ? (tooHigh ? 'error' : 'ok') : 'idle'
  const resultText = vd !== null ? `VD = ${fmt(vd, 2)} V (${fmt(vdPct, 2)}%)` : undefined

  return (
    <CalculatorShell
      title="Voltage Drop Calculator"
      description="Calculate voltage drop along a cable run for single or three-phase circuits. Uses conductor resistivity at operating temperature."
      category="Cables & Wiring"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcSelect id="vd-phase" label="System" value={phase}
          onChange={e => {
            setPhase(e.target.value)
            setVoltage(e.target.value === '3phase' ? '400' : '230')
          }}
          options={[
            { value: '1phase', label: 'Single Phase (230 V)' },
            { value: '3phase', label: 'Three Phase (400 V)' },
          ]}
        />
        <CalcInput id="vd-v" label="Supply Voltage" unit="V" value={voltage}
          min={1} step={1} onChange={e => setVoltage(e.target.value)} />
        <CalcInput id="vd-i" label="Load Current" unit="A" value={current}
          min={0.1} step={0.1} onChange={e => setCurrent(e.target.value)} />
        <CalcInput id="vd-l" label="One-Way Cable Length" unit="m" value={length}
          min={1} step={1} helper="Single-phase: multiplied by 2 internally"
          onChange={e => setLength(e.target.value)} />
        <CalcSelect id="vd-mat" label="Conductor Material" value={material}
          onChange={e => setMaterial(e.target.value)}
          options={[
            { value: 'copper',    label: 'Copper (Cu)' },
            { value: 'aluminium', label: 'Aluminium (Al)' },
          ]}
        />
        <CalcInput id="vd-csa" label="Cable CSA" unit="mm²" value={csa}
          min={0.5} step={0.5}
          helper="Common: 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95 mm²"
          onChange={e => setCsa(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Voltage Drop (VD)" value={fmt(vd, 2)} unit="V"
          note={allValid ? `${fmt(vdPct, 2)}% of supply voltage` : undefined}
          status={status} />
        <ResultBox label="Voltage at Load End" value={fmt(vAtLoad, 1)} unit="V" status={status} />
        {tooHigh && (
          <div style={{ padding: '12px 16px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 4 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--red)', letterSpacing: '0.1em' }}>
              ⚠ EXCEEDS 5% LIMIT — increase cable CSA or reduce cable length
            </span>
          </div>
        )}
      </>}
      formula={<>
        <p><strong>Single-phase:</strong> VD = (2 × ρ × L × I) / A</p>
        <p><strong>Three-phase:</strong> VD = (√3 × ρ × L × I) / A</p>
        <p>Where: ρ = resistivity (Ω·mm²/m), L = one-way length (m), I = current (A), A = CSA (mm²)</p>
        <p>Copper ρ ≈ 0.0217 Ω·mm²/m @ 75°C | Aluminium ρ ≈ 0.0357 Ω·mm²/m</p>
      </>}
      example={<>
        <p>Single phase, 230 V, 20 A, 50 m run, 4 mm² copper:</p>
        <p>VD = (2 × 0.0217 × 50 × 20) / 4 = 10.85 V</p>
        <p><strong>VD% = 10.85 / 230 × 100 = 4.72%  ✓ (within 5%)</strong></p>
      </>}
      notes={<>
        IEC 60364 and Bangladesh BSTI standards recommend maximum voltage drop of 5% for final circuits (3% for lighting).
        Results shown use resistivity only (ignores reactance) — adequate for cables up to 50 mm².
        For large cables or long runs, reactance should also be considered.
      </>}
    />
  )
}
