import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import CalcSelect from '../CalcSelect'
import ResultBox from '../ResultBox'

// Standard MCB/MCCB ratings (A) — IEC 60898 / 60947-2
const MCB_RATINGS  = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63]
const MCCB_RATINGS = [63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600]

const DEFAULTS = { current: '20', phase: '1phase', loadType: 'general', safetyFactor: '1.25' }

export default function BreakerSize() {
  const [current, setCurrent] = useState(DEFAULTS.current)
  const [phase, setPhase] = useState(DEFAULTS.phase)
  const [loadType, setLoadType] = useState(DEFAULTS.loadType)
  const [safetyFactor, setSafetyFactor] = useState(DEFAULTS.safetyFactor)

  const reset = () => { setCurrent(DEFAULTS.current); setPhase(DEFAULTS.phase); setLoadType(DEFAULTS.loadType); setSafetyFactor(DEFAULTS.safetyFactor) }

  const I = parseFloat(current), SF = parseFloat(safetyFactor)
  const allValid = !isNaN(I) && !isNaN(SF) && I > 0 && SF >= 1

  // Motor starting: use 150–250% (use 2.5× here) for sizing MCB trip class
  const multiplier = loadType === 'motor' ? 1.0 : 1.0   // SF already set by user
  const designCurrent = allValid ? I * SF * multiplier : null

  const allRatings = [...MCB_RATINGS, ...MCCB_RATINGS].sort((a, b) => a - b)
  const recommended = designCurrent !== null
    ? allRatings.find(r => r >= designCurrent) ?? null
    : null
  const type = recommended !== null && recommended <= 63 ? 'MCB' : 'MCCB'

  const fmt = (v: number | null, d = 2) => v !== null ? parseFloat(v.toFixed(d)).toString() : null
  const status = recommended !== null ? 'ok' : 'idle'
  const resultText = recommended !== null ? `${recommended} A ${type}` : undefined

  return (
    <CalculatorShell
      title="Breaker Size Calculator"
      description="Find the minimum IEC standard circuit breaker rating (MCB or MCCB) for a given load current. Applies a safety factor per IEC 60364."
      category="Protection"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcSelect id="br-phase" label="System" value={phase}
          onChange={e => setPhase(e.target.value)}
          options={[
            { value: '1phase', label: 'Single Phase' },
            { value: '3phase', label: 'Three Phase' },
          ]}
        />
        <CalcSelect id="br-loadtype" label="Load Type" value={loadType}
          onChange={e => setLoadType(e.target.value)}
          options={[
            { value: 'general', label: 'General (resistive, lighting)' },
            { value: 'motor',   label: 'Motor (inductive)' },
            { value: 'welding', label: 'Welding / Intermittent' },
          ]}
          helper="Motor loads need a higher-trip-class breaker (curve C or D)"
        />
        <CalcInput id="br-i" label="Full-Load Current (FLC)" unit="A" value={current}
          min={0.5} step={0.5} helper="Measure or calculate from motor nameplate/load data"
          onChange={e => setCurrent(e.target.value)} />
        <CalcInput id="br-sf" label="Safety Factor" unit="×" value={safetyFactor}
          min={1.0} max={3.0} step={0.05}
          helper="IEC 60364: ≥1.25 for general; 1.5–2.5 for motor start"
          onChange={e => setSafetyFactor(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Design Current" value={fmt(designCurrent, 1)} unit="A"
          note={allValid ? `FLC × SF = ${current} × ${safetyFactor}` : undefined}
          status={status} />
        <ResultBox label="Recommended Breaker" value={recommended} unit="A"
          note={type} status={status} />
      </>}
      formula={<>
        <p><strong>I_design = I_FLC × Safety Factor</strong></p>
        <p>Select the next standard rating ≥ I_design.</p>
        <p>IEC 60364 requires: I_FLC ≤ I_n (breaker rating) ≤ I_z (cable ampacity)</p>
        <p>MCB: ≤63 A | MCCB: 63–1600 A</p>
      </>}
      example={<>
        <p>FLC = 20 A, general load, SF = 1.25:</p>
        <p>Design current = 20 × 1.25 = 25 A</p>
        <p><strong>Recommended: 25 A MCB</strong></p>
      </>}
      notes={<>
        Motor loads require higher-trip-class MCBs (Curve C or D) to tolerate inrush current (typically 6–10× FLC).
        The breaker rating must not exceed the current-carrying capacity of the downstream cable.
        For three-phase systems, size based on the phase current (line current), not total three-phase power.
      </>}
    />
  )
}
