import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import ResultBox from '../ResultBox'

const DEFAULTS = { voltage: '230', current: '10', pf: '0.85' }

export default function SinglePhasePower() {
  const [voltage, setVoltage] = useState(DEFAULTS.voltage)
  const [current, setCurrent] = useState(DEFAULTS.current)
  const [pf, setPf] = useState(DEFAULTS.pf)

  const reset = () => { setVoltage(DEFAULTS.voltage); setCurrent(DEFAULTS.current); setPf(DEFAULTS.pf) }

  const V = parseFloat(voltage), I = parseFloat(current), PF = parseFloat(pf)
  const allValid = !isNaN(V) && !isNaN(I) && !isNaN(PF) && V > 0 && I >= 0 && PF > 0 && PF <= 1

  const kVA  = allValid ? (V * I) / 1000 : null
  const kW   = allValid ? (V * I * PF) / 1000 : null
  const kVAR = (kVA !== null && kW !== null) ? Math.sqrt(kVA * kVA - kW * kW) : null

  const fmt = (v: number | null, d = 3) => v !== null ? parseFloat(v.toFixed(d)).toString() : null
  const status = kW !== null ? 'ok' : 'idle'
  const resultText = kW !== null ? `P = ${fmt(kW)} kW, S = ${fmt(kVA)} kVA, Q = ${fmt(kVAR)} kVAR` : undefined

  return (
    <CalculatorShell
      title="Single-Phase Power Calculator"
      description="Calculate real, apparent, and reactive power for a single-phase AC load. Default voltage is 230 V (Bangladesh/IEC standard)."
      category="Power Systems"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcInput id="sp-v" label="Voltage (V)" unit="V" value={voltage}
          min={1} step={1} helper="Bangladesh: 230 V (single phase)"
          onChange={e => setVoltage(e.target.value)} />
        <CalcInput id="sp-i" label="Current (I)" unit="A" value={current}
          min={0} step={0.1} onChange={e => setCurrent(e.target.value)} />
        <CalcInput id="sp-pf" label="Power Factor (PF)" unit="" value={pf}
          min={0.01} max={1} step={0.01} helper="Typical: 0.8–0.95 for industrial loads"
          onChange={e => setPf(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Real Power (P)" value={fmt(kW)} unit="kW"
          note="Useful power doing actual work" status={status} />
        <ResultBox label="Apparent Power (S)" value={fmt(kVA)} unit="kVA"
          note="Total power drawn from supply" status={status} />
        <ResultBox label="Reactive Power (Q)" value={fmt(kVAR)} unit="kVAR"
          note="Non-working power (inductive/capacitive)" status={status} />
      </>}
      formula={<>
        <p><strong>P = V × I × PF</strong>  (real power, kW)</p>
        <p><strong>S = V × I</strong>  (apparent power, kVA)</p>
        <p><strong>Q = √(S² − P²)</strong>  (reactive power, kVAR)</p>
      </>}
      example={<>
        <p>V = 230 V, I = 10 A, PF = 0.85:</p>
        <p>S = 230 × 10 / 1000 = 2.3 kVA</p>
        <p><strong>P = 2.3 × 0.85 = 1.955 kW</strong></p>
        <p>Q = √(2.3² − 1.955²) ≈ 1.21 kVAR</p>
      </>}
      notes={<>
        Bangladesh standard single-phase supply is 230 V, 50 Hz.
        Actual voltage may vary ±6% (216–244 V) under normal conditions.
        Equipment must be rated for both the nominal voltage and the full current drawn at the actual power factor.
      </>}
    />
  )
}
