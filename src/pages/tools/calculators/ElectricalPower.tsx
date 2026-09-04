import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import CalcSelect from '../CalcSelect'
import ResultBox from '../ResultBox'

type Mode = 'P=VI' | 'P=I2R' | 'P=V2/R'

const DEFAULTS = { voltage: '230', current: '10', resistance: '23', pf: '1' }

export default function ElectricalPower() {
  const [mode, setMode] = useState<Mode>('P=VI')
  const [voltage, setVoltage] = useState(DEFAULTS.voltage)
  const [current, setCurrent] = useState(DEFAULTS.current)
  const [resistance, setResistance] = useState(DEFAULTS.resistance)
  const [pf, setPf] = useState(DEFAULTS.pf)

  const reset = () => {
    setVoltage(DEFAULTS.voltage); setCurrent(DEFAULTS.current)
    setResistance(DEFAULTS.resistance); setPf(DEFAULTS.pf); setMode('P=VI')
  }

  const V = parseFloat(voltage), I = parseFloat(current)
  const R = parseFloat(resistance), PF = parseFloat(pf)

  let result: number | null = null; let note = ''
  if (mode === 'P=VI' && !isNaN(V) && !isNaN(I) && !isNaN(PF)) {
    result = V * I * PF; note = `P = V × I × PF = ${V} × ${I} × ${PF}`
  } else if (mode === 'P=I2R' && !isNaN(I) && !isNaN(R)) {
    result = I * I * R; note = `P = I² × R = ${I}² × ${R}`
  } else if (mode === 'P=V2/R' && !isNaN(V) && !isNaN(R) && R !== 0) {
    result = (V * V) / R; note = `P = V² / R = ${V}² / ${R}`
  }

  const kW = result !== null ? parseFloat((result / 1000).toFixed(4)) : null
  const displayVal = result !== null ? parseFloat(result.toFixed(2)).toString() : null
  const status = result !== null ? 'ok' : 'idle'
  const resultText = result !== null ? `${displayVal} W (${kW} kW)` : undefined

  return (
    <CalculatorShell
      title="Electrical Power Calculator"
      description="Calculate real power in watts using voltage and current, I²R, or V²/R. Enter power factor for AC circuits."
      category="Basic Electrical"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcSelect
          id="pow-mode" label="Formula" value={mode}
          onChange={e => setMode(e.target.value as Mode)}
          options={[
            { value: 'P=VI',   label: 'P = V × I × PF  (AC/DC)' },
            { value: 'P=I2R',  label: 'P = I² × R  (heat loss)' },
            { value: 'P=V2/R', label: 'P = V² / R' },
          ]}
        />
        {(mode === 'P=VI' || mode === 'P=V2/R') && (
          <CalcInput id="pow-v" label="Voltage (V)" unit="V" value={voltage}
            min={0} step={1} onChange={e => setVoltage(e.target.value)} />
        )}
        {(mode === 'P=VI' || mode === 'P=I2R') && (
          <CalcInput id="pow-i" label="Current (I)" unit="A" value={current}
            min={0} step={0.1} onChange={e => setCurrent(e.target.value)} />
        )}
        {(mode === 'P=I2R' || mode === 'P=V2/R') && (
          <CalcInput id="pow-r" label="Resistance (R)" unit="Ω" value={resistance}
            min={0} step={0.1} onChange={e => setResistance(e.target.value)} />
        )}
        {mode === 'P=VI' && (
          <CalcInput id="pow-pf" label="Power Factor (PF)" unit="" value={pf}
            min={0} max={1} step={0.01}
            helper="For DC or purely resistive loads, use PF = 1"
            onChange={e => setPf(e.target.value)} />
        )}
      </>}
      results={<>
        <ResultBox label="Real Power" value={displayVal} unit="W" note={note} status={status} />
        {kW !== null && <ResultBox label="Real Power (kW)" value={kW} unit="kW" status={status} />}
      </>}
      formula={<>
        <p><strong>P = V × I × PF</strong> — AC real power</p>
        <p><strong>P = I² × R</strong> — power dissipated as heat in a resistor</p>
        <p><strong>P = V² / R</strong> — power from voltage across a resistor</p>
        <p style={{ marginTop: 8 }}>PF ranges from 0 to 1. Purely resistive loads have PF = 1.</p>
      </>}
      example={<>
        <p>A 230 V, 10 A load with PF = 0.85:</p>
        <p><strong>P = 230 × 10 × 0.85 = 1955 W ≈ 1.96 kW</strong></p>
      </>}
      notes={<>
        For DC circuits, power factor is always 1 — omit the PF term.
        This formula gives <em>real</em> power. Apparent power (kVA) = V × I without PF.
        Use the Power Factor calculator to find reactive power (kVAR) separately.
      </>}
    />
  )
}
