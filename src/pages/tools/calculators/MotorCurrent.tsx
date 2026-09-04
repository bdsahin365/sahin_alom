import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import CalcSelect from '../CalcSelect'
import ResultBox from '../ResultBox'

const SQRT3 = Math.sqrt(3)
const DEFAULTS = { power: '7.5', voltage: '400', pf: '0.85', efficiency: '90', phase: '3phase', unit: 'kW' }

export default function MotorCurrent() {
  const [power, setPower] = useState(DEFAULTS.power)
  const [voltage, setVoltage] = useState(DEFAULTS.voltage)
  const [pf, setPf] = useState(DEFAULTS.pf)
  const [efficiency, setEfficiency] = useState(DEFAULTS.efficiency)
  const [phase, setPhase] = useState(DEFAULTS.phase)
  const [unit, setUnit] = useState(DEFAULTS.unit)

  const reset = () => {
    setPower(DEFAULTS.power); setVoltage(DEFAULTS.voltage); setPf(DEFAULTS.pf)
    setEfficiency(DEFAULTS.efficiency); setPhase(DEFAULTS.phase); setUnit(DEFAULTS.unit)
  }

  const P_input = parseFloat(power), V = parseFloat(voltage)
  const PF = parseFloat(pf), EFF = parseFloat(efficiency) / 100

  // Convert HP to kW if needed
  const P_kW = unit === 'HP' ? P_input * 0.7457 : P_input
  const P_W = P_kW * 1000

  const allValid = !isNaN(P_W) && !isNaN(V) && !isNaN(PF) && !isNaN(EFF) &&
    P_W > 0 && V > 0 && PF > 0 && PF <= 1 && EFF > 0 && EFF <= 1

  // I = P / (V × PF × η)  [single phase]
  // I = P / (√3 × V × PF × η)  [three phase]
  const FLC = allValid
    ? P_W / ((phase === '3phase' ? SQRT3 : 1) * V * PF * EFF)
    : null

  const startCurrent = FLC !== null ? FLC * 6 : null   // DOL starting: typically 6× FLC

  const fmt = (v: number | null, d = 2) => v !== null ? parseFloat(v.toFixed(d)).toString() : null
  const status = FLC !== null ? 'ok' : 'idle'
  const resultText = FLC !== null ? `FLC = ${fmt(FLC)} A` : undefined

  return (
    <CalculatorShell
      title="Motor Current Calculator"
      description="Calculate the full-load current (FLC) of a single-phase or three-phase AC motor from rated power, voltage, power factor, and efficiency."
      category="Motors & Transformers"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcSelect id="mc-phase" label="Motor Type" value={phase}
          onChange={e => { setPhase(e.target.value); setVoltage(e.target.value === '3phase' ? '400' : '230') }}
          options={[
            { value: '3phase', label: 'Three-Phase Motor (400 V)' },
            { value: '1phase', label: 'Single-Phase Motor (230 V)' },
          ]}
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <CalcInput id="mc-power" label="Rated Power" unit={unit} value={power}
              min={0.1} step={0.5} onChange={e => setPower(e.target.value)} />
          </div>
          <CalcSelect id="mc-unit" label="Unit" value={unit}
            onChange={e => setUnit(e.target.value)}
            options={[
              { value: 'kW', label: 'kW' },
              { value: 'HP', label: 'HP' },
            ]}
            helper=""
          />
        </div>
        <CalcInput id="mc-v" label="Rated Voltage" unit="V" value={voltage}
          min={100} step={10} onChange={e => setVoltage(e.target.value)} />
        <CalcInput id="mc-pf" label="Power Factor (PF)" unit="" value={pf}
          min={0.5} max={1} step={0.01} helper="Typical: 0.80–0.92 at full load"
          onChange={e => setPf(e.target.value)} />
        <CalcInput id="mc-eff" label="Efficiency (η)" unit="%" value={efficiency}
          min={50} max={99} step={1} helper="Typical: 88–95% for IE2/IE3 motors"
          onChange={e => setEfficiency(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Full-Load Current (FLC)" value={fmt(FLC)} unit="A"
          note={allValid ? (phase === '3phase' ? `I = P / (√3 × V × PF × η)` : `I = P / (V × PF × η)`) : undefined}
          status={status} />
        <ResultBox label="DOL Starting Current (est.)" value={fmt(startCurrent)} unit="A"
          note="Approx. 6× FLC for direct-on-line start" status={status} />
        {unit === 'HP' && P_kW && (
          <ResultBox label="Power in kW" value={fmt(P_kW, 3)} unit="kW"
            note="1 HP = 0.7457 kW" status={status} />
        )}
      </>}
      formula={<>
        <p><strong>Three-phase: I = P / (√3 × V × PF × η)</strong></p>
        <p><strong>Single-phase: I = P / (V × PF × η)</strong></p>
        <p>Where P is shaft output power (W), η is efficiency (0–1).</p>
        <p>DOL starting current ≈ 6 × FLC (varies with motor class).</p>
      </>}
      example={<>
        <p>7.5 kW, three-phase, 400 V, PF = 0.85, η = 90%:</p>
        <p>I = 7500 / (√3 × 400 × 0.85 × 0.90)</p>
        <p><strong>I = 7500 / 528.7 ≈ 14.19 A</strong></p>
      </>}
      notes={<>
        Motor nameplate values should be used where available — calculated FLC may differ slightly from nameplate due to manufacturing tolerances.
        Starting current for DOL is typically 5–8× FLC; star-delta starting reduces this to about 1/3.
        Use calculated FLC to size circuit breakers, cables, and overload relays.
      </>}
    />
  )
}
