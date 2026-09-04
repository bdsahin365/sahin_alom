import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import ResultBox from '../ResultBox'

const DEFAULTS = { frequency: '50', capacitance: '100' }   // 100 µF

export default function CapacitiveReactance() {
  const [frequency, setFrequency] = useState(DEFAULTS.frequency)
  const [capacitance, setCapacitance] = useState(DEFAULTS.capacitance)   // in µF

  const reset = () => { setFrequency(DEFAULTS.frequency); setCapacitance(DEFAULTS.capacitance) }

  const f = parseFloat(frequency), C_uF = parseFloat(capacitance)
  const C = C_uF / 1e6   // convert µF → F
  const allValid = !isNaN(f) && !isNaN(C_uF) && f > 0 && C_uF > 0

  // XC = 1 / (2πfC)
  const XC = allValid ? 1 / (2 * Math.PI * f * C) : null
  const displayVal = XC !== null ? parseFloat(XC.toFixed(4)).toString() : null
  const status = XC !== null ? 'ok' : 'idle'
  const resultText = XC !== null ? `XC = ${displayVal} Ω` : undefined

  return (
    <CalculatorShell
      title="Capacitive Reactance Calculator"
      description="Calculate the AC opposition (reactance) of a capacitor at a specific frequency. Uses the formula XC = 1 / (2πfC)."
      category="Basic Electrical"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcInput id="xc-f" label="Frequency (f)" unit="Hz" value={frequency}
          min={0.001} step={1}
          helper="Bangladesh/IEC mains: 50 Hz. North America: 60 Hz"
          onChange={e => setFrequency(e.target.value)} />
        <CalcInput id="xc-c" label="Capacitance (C)" unit="µF" value={capacitance}
          min={0.001} step={1}
          helper="Enter in microfarads (µF). 1 µF = 10⁻⁶ F"
          onChange={e => setCapacitance(e.target.value)} />
      </>}
      results={<ResultBox label="Capacitive Reactance (XC)" value={displayVal} unit="Ω"
        note={allValid ? `XC = 1 / (2π × ${f} × ${C_uF}µF)` : undefined}
        status={status} />}
      formula={<>
        <p><strong>XC = 1 / (2π × f × C)</strong></p>
        <p>Where:</p>
        <ul style={{ paddingLeft: 20, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>f = frequency in Hertz (Hz)</li>
          <li>C = capacitance in Farads (F)</li>
          <li>XC = capacitive reactance in Ohms (Ω)</li>
        </ul>
      </>}
      example={<>
        <p>A 100 µF capacitor at 50 Hz:</p>
        <p>C = 100 × 10⁻⁶ F, f = 50 Hz</p>
        <p><strong>XC = 1 / (2π × 50 × 100 × 10⁻⁶) = 31.83 Ω</strong></p>
      </>}
      notes={<>
        Capacitive reactance decreases as frequency increases — a capacitor acts like a near short at very high frequencies.
        At DC (f = 0 Hz), XC is infinite — capacitors block DC.
        Real capacitors also have equivalent series resistance (ESR).
      </>}
    />
  )
}
