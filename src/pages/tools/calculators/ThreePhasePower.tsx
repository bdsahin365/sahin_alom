import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import CalcSelect from '../CalcSelect'
import ResultBox from '../ResultBox'

const DEFAULTS = { voltage: '400', current: '20', pf: '0.85' }
const SQRT3 = Math.sqrt(3)

export default function ThreePhasePower() {
  const [voltage, setVoltage] = useState(DEFAULTS.voltage)
  const [current, setCurrent] = useState(DEFAULTS.current)
  const [pf, setPf] = useState(DEFAULTS.pf)
  const [connection, setConnection] = useState('line-to-line')

  const reset = () => { setVoltage(DEFAULTS.voltage); setCurrent(DEFAULTS.current); setPf(DEFAULTS.pf); setConnection('line-to-line') }

  const VL = parseFloat(voltage), I = parseFloat(current), PF = parseFloat(pf)
  const allValid = !isNaN(VL) && !isNaN(I) && !isNaN(PF) && VL > 0 && I >= 0 && PF > 0 && PF <= 1

  // Both star and delta three-phase power: P = √3 × VL × I × PF
  const kVA  = allValid ? (SQRT3 * VL * I) / 1000 : null
  const kW   = (kVA !== null) ? kVA * PF : null
  const kVAR = (kVA !== null && kW !== null) ? Math.sqrt(kVA * kVA - kW * kW) : null
  // Phase voltage
  const Vph = allValid && connection === 'line-to-line' ? VL / SQRT3 : VL
  const VphDisplay = allValid ? parseFloat((connection === 'line-to-line' ? VL / SQRT3 : VL * SQRT3).toFixed(2)).toString() : null

  const fmt = (v: number | null, d = 3) => v !== null ? parseFloat(v.toFixed(d)).toString() : null
  const status = kW !== null ? 'ok' : 'idle'
  const resultText = kW !== null ? `P = ${fmt(kW)} kW, S = ${fmt(kVA)} kVA` : undefined

  return (
    <CalculatorShell
      title="Three-Phase Power Calculator"
      description="Calculate real, apparent, and reactive power for a balanced three-phase load. Works for both star (Y) and delta (Δ) configurations. Default voltage 400 V L-L (Bangladesh/IEC)."
      category="Power Systems"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcSelect id="tp-conn" label="Voltage Reference" value={connection}
          onChange={e => setConnection(e.target.value)}
          options={[
            { value: 'line-to-line',  label: 'Line-to-Line (VLL) — e.g. 400 V' },
            { value: 'line-to-neutral', label: 'Line-to-Neutral (VLN) — e.g. 230 V' },
          ]}
          helper="400 V L-L = 230 V L-N for a star system"
        />
        <CalcInput id="tp-v" label={connection === 'line-to-line' ? 'Line Voltage (VLL)' : 'Phase Voltage (VLN)'}
          unit="V" value={voltage} min={1} step={1}
          helper={connection === 'line-to-line' ? 'Bangladesh 3-phase: 400 V L-L' : 'Bangladesh 3-phase: 230 V L-N'}
          onChange={e => setVoltage(e.target.value)} />
        <CalcInput id="tp-i" label="Line Current (I)" unit="A" value={current}
          min={0} step={0.1} onChange={e => setCurrent(e.target.value)} />
        <CalcInput id="tp-pf" label="Power Factor (PF)" unit="" value={pf}
          min={0.01} max={1} step={0.01} helper="Typical motors: 0.80–0.92"
          onChange={e => setPf(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Real Power (P)" value={fmt(kW)} unit="kW"
          note="P = √3 × VLL × I × PF" status={status} />
        <ResultBox label="Apparent Power (S)" value={fmt(kVA)} unit="kVA" status={status} />
        <ResultBox label="Reactive Power (Q)" value={fmt(kVAR)} unit="kVAR" status={status} />
        {allValid && (
          <ResultBox label={connection === 'line-to-line' ? 'Phase Voltage (VLN)' : 'Line Voltage (VLL)'}
            value={VphDisplay} unit="V"
            note={connection === 'line-to-line' ? 'VLN = VLL / √3' : 'VLL = VLN × √3'} status={status} />
        )}
      </>}
      formula={<>
        <p><strong>P = √3 × VLL × I × PF</strong>  (real power)</p>
        <p><strong>S = √3 × VLL × I</strong>  (apparent power)</p>
        <p><strong>Q = √(S² − P²)</strong>  (reactive power)</p>
        <p>√3 ≈ 1.7321</p>
        <p>Same formula applies to both Star and Delta configurations when using line values.</p>
      </>}
      example={<>
        <p>VLL = 400 V, I = 20 A, PF = 0.85:</p>
        <p>S = √3 × 400 × 20 / 1000 = 13.86 kVA</p>
        <p><strong>P = 13.86 × 0.85 = 11.78 kW</strong></p>
      </>}
      notes={<>
        Bangladesh three-phase supply: 400 V line-to-line (L-L), 230 V line-to-neutral (L-N), at 50 Hz.
        This calculator assumes a balanced three-phase load. Unbalanced loads require per-phase analysis.
        For motors, use the Motor Current calculator to find full-load current first.
      </>}
    />
  )
}
