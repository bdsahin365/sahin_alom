import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import CalcSelect from '../CalcSelect'
import ResultBox from '../ResultBox'

// IEC standard cable sizes (mm²)
const CABLE_SIZES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300]

// Approximate current ratings (A) for copper cable in conduit/duct @ 30°C (IEC 60364-5-52 Table B.52.5)
const COPPER_RATINGS: Record<number, number> = {
  1.5: 17.5, 2.5: 24, 4: 32, 6: 41, 10: 57, 16: 76, 25: 101,
  35: 125, 50: 151, 70: 192, 95: 232, 120: 269, 150: 309, 185: 353, 240: 415, 300: 477,
}
// Aluminium approx 80% of copper for same CSA
const ALU_RATINGS: Record<number, number> = Object.fromEntries(
  Object.entries(COPPER_RATINGS).map(([k, v]) => [k, Math.round(v * 0.78)])
)

const DEFAULTS = { current: '20', lengthM: '50', voltage: '230', phase: '1phase', material: 'copper', vdPctMax: '5', ambTemp: '30' }

export default function CableSizing() {
  const [current, setCurrent] = useState(DEFAULTS.current)
  const [lengthM, setLengthM] = useState(DEFAULTS.lengthM)
  const [voltage, setVoltage] = useState(DEFAULTS.voltage)
  const [phase, setPhase] = useState(DEFAULTS.phase)
  const [material, setMaterial] = useState(DEFAULTS.material)
  const [vdPctMax, setVdPctMax] = useState(DEFAULTS.vdPctMax)
  const [ambTemp, setAmbTemp] = useState(DEFAULTS.ambTemp)

  const reset = () => {
    setCurrent(DEFAULTS.current); setLengthM(DEFAULTS.lengthM)
    setVoltage(DEFAULTS.voltage); setPhase(DEFAULTS.phase)
    setMaterial(DEFAULTS.material); setVdPctMax(DEFAULTS.vdPctMax); setAmbTemp(DEFAULTS.ambTemp)
  }

  const I = parseFloat(current), L = parseFloat(lengthM), V = parseFloat(voltage)
  const VD_MAX_PCT = parseFloat(vdPctMax), TEMP = parseFloat(ambTemp)
  const ρ = material === 'copper' ? 0.0217 : 0.0357
  const k = phase === '3phase' ? Math.sqrt(3) : 2

  // Temperature derating (simplified IEC)
  const tempFactor = TEMP <= 30 ? 1 : TEMP <= 35 ? 0.94 : TEMP <= 40 ? 0.87 : TEMP <= 45 ? 0.79 : 0.71
  const ratings = material === 'copper' ? COPPER_RATINGS : ALU_RATINGS

  // Find smallest cable that satisfies both ampacity AND voltage drop
  const allValid = !isNaN(I) && !isNaN(L) && !isNaN(V) && !isNaN(VD_MAX_PCT) && I > 0 && L > 0 && V > 0

  let recommended: number | null = null
  let vdAtRec: number | null = null
  let vdPctAtRec: number | null = null

  if (allValid) {
    for (const size of CABLE_SIZES) {
      const ratedCurrent = (ratings[size] ?? 0) * tempFactor
      if (ratedCurrent < I) continue
      const vd = (ρ * L * I * k) / size
      const vdPct = (vd / V) * 100
      if (vdPct <= VD_MAX_PCT) {
        recommended = size
        vdAtRec = parseFloat(vd.toFixed(2))
        vdPctAtRec = parseFloat(vdPct.toFixed(2))
        break
      }
    }
  }

  const fmt = (v: number | null, d = 2) => v !== null ? parseFloat(v.toFixed(d)).toString() : null
  const status = recommended !== null ? 'ok' : allValid ? 'error' : 'idle'
  const resultText = recommended !== null ? `${recommended} mm² ${material} cable` : undefined

  return (
    <CalculatorShell
      title="Cable Sizing Calculator"
      description="Find the minimum cable cross-section (mm²) for a given load, based on current-carrying capacity and voltage drop limit. Uses IEC 60364 standard ratings."
      category="Cables & Wiring"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcSelect id="cs-phase" label="System" value={phase}
          onChange={e => { setPhase(e.target.value); setVoltage(e.target.value === '3phase' ? '400' : '230') }}
          options={[
            { value: '1phase', label: 'Single Phase (230 V)' },
            { value: '3phase', label: 'Three Phase (400 V)' },
          ]}
        />
        <CalcInput id="cs-v" label="Supply Voltage" unit="V" value={voltage}
          min={1} step={1} onChange={e => setVoltage(e.target.value)} />
        <CalcInput id="cs-i" label="Design Current" unit="A" value={current}
          min={0.5} step={0.5} helper="Full-load current of the load"
          onChange={e => setCurrent(e.target.value)} />
        <CalcInput id="cs-l" label="One-Way Cable Length" unit="m" value={lengthM}
          min={1} step={1} onChange={e => setLengthM(e.target.value)} />
        <CalcSelect id="cs-mat" label="Conductor Material" value={material}
          onChange={e => setMaterial(e.target.value)}
          options={[
            { value: 'copper',    label: 'Copper (Cu)' },
            { value: 'aluminium', label: 'Aluminium (Al)' },
          ]}
        />
        <CalcInput id="cs-vd" label="Max Voltage Drop" unit="%" value={vdPctMax}
          min={1} max={10} step={0.5} helper="IEC/BSTI recommend ≤5% for power, ≤3% for lighting"
          onChange={e => setVdPctMax(e.target.value)} />
        <CalcInput id="cs-temp" label="Ambient Temperature" unit="°C" value={ambTemp}
          min={20} max={50} step={5} helper="Used for temperature derating factor"
          onChange={e => setAmbTemp(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Recommended Cable Size" value={recommended !== null ? `${recommended}` : null}
          unit="mm²" note={material === 'copper' ? 'Copper conductor' : 'Aluminium conductor'}
          status={status} />
        {vdAtRec !== null && <ResultBox label="Voltage Drop at This Size" value={vdAtRec} unit="V"
          note={`${vdPctAtRec}% of ${voltage} V`} status={status} />}
        {allValid && recommended === null && (
          <div style={{ padding: '14px 16px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 4 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--red)', letterSpacing: '0.1em' }}>
              No standard cable size satisfies these requirements. Consider splitting the circuit or increasing supply voltage.
            </span>
          </div>
        )}
      </>}
      formula={<>
        <p><strong>Step 1:</strong> Find smallest cable where rated current ≥ design current (after temp derating)</p>
        <p><strong>Step 2:</strong> Verify voltage drop: VD = (ρ × k × L × I) / A ≤ max allowed</p>
        <p>If Step 2 fails, move up to the next standard size and check again.</p>
      </>}
      example={<>
        <p>Single-phase 230 V, 20 A load, 50 m run, copper, 5% VD limit:</p>
        <p>4 mm² → 32 A rating ✓, VD = (2 × 0.0217 × 50 × 20) / 4 = 10.85 V = 4.72% ✓</p>
        <p><strong>Result: 4 mm² copper is adequate.</strong></p>
      </>}
      notes={<>
        Ratings are based on IEC 60364-5-52 for cables in conduit/trunking at 30°C ambient, single circuit.
        For cables in free air, bundled cables, or high ambient temperatures, additional derating applies.
        Always verify with the actual cable manufacturer datasheet for final design.
      </>}
    />
  )
}
