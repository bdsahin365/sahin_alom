import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import ResultBox from '../ResultBox'

const DEFAULTS = { frequency: '50', inductance: '0.1' }

export default function InductiveReactance() {
  const [frequency, setFrequency] = useState(DEFAULTS.frequency)
  const [inductance, setInductance] = useState(DEFAULTS.inductance)

  const reset = () => { setFrequency(DEFAULTS.frequency); setInductance(DEFAULTS.inductance) }

  const f = parseFloat(frequency), L = parseFloat(inductance)
  const allValid = !isNaN(f) && !isNaN(L) && f > 0 && L >= 0

  // XL = 2πfL
  const XL = allValid ? 2 * Math.PI * f * L : null
  const displayVal = XL !== null ? parseFloat(XL.toFixed(4)).toString() : null
  const status = XL !== null ? 'ok' : 'idle'
  const resultText = XL !== null ? `XL = ${displayVal} Ω` : undefined

  return (
    <CalculatorShell
      title="Inductive Reactance Calculator"
      description="Calculate the AC opposition (reactance) of an inductor at a specific frequency. Uses the formula XL = 2πfL."
      category="Basic Electrical"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcInput id="xl-f" label="Frequency (f)" unit="Hz" value={frequency}
          min={0.001} step={1}
          helper="Bangladesh/IEC mains: 50 Hz. North America: 60 Hz"
          onChange={e => setFrequency(e.target.value)} />
        <CalcInput id="xl-l" label="Inductance (L)" unit="H" value={inductance}
          min={0} step={0.001}
          helper="Enter in Henries (H). 1 mH = 0.001 H"
          onChange={e => setInductance(e.target.value)} />
      </>}
      results={<ResultBox label="Inductive Reactance (XL)" value={displayVal} unit="Ω"
        note={allValid ? `XL = 2π × ${f} × ${L} = ${displayVal} Ω` : undefined}
        status={status} />}
      formula={<>
        <p><strong>XL = 2π × f × L</strong></p>
        <p>Where:</p>
        <ul style={{ paddingLeft: 20, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>f = frequency in Hertz (Hz)</li>
          <li>L = inductance in Henries (H)</li>
          <li>XL = inductive reactance in Ohms (Ω)</li>
        </ul>
      </>}
      example={<>
        <p>A 100 mH inductor at 50 Hz:</p>
        <p>L = 0.1 H, f = 50 Hz</p>
        <p><strong>XL = 2π × 50 × 0.1 = 31.42 Ω</strong></p>
      </>}
      notes={<>
        Inductive reactance increases with frequency — higher frequency means higher opposition.
        Unlike resistance, it does not dissipate energy (no I²R losses); it stores energy in a magnetic field.
        Real inductors also have DC resistance (DCR) which adds to total impedance.
      </>}
    />
  )
}
