import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import ResultBox from '../ResultBox'

const DEFAULTS = { vin: '12', r1: '1000', r2: '2000' }

export default function VoltageDivider() {
  const [vin, setVin] = useState(DEFAULTS.vin)
  const [r1, setR1] = useState(DEFAULTS.r1)
  const [r2, setR2] = useState(DEFAULTS.r2)

  const reset = () => { setVin(DEFAULTS.vin); setR1(DEFAULTS.r1); setR2(DEFAULTS.r2) }

  const V = parseFloat(vin), R1 = parseFloat(r1), R2 = parseFloat(r2)
  const allValid = !isNaN(V) && !isNaN(R1) && !isNaN(R2) && R1 > 0 && R2 > 0

  const vout = allValid ? (V * R2) / (R1 + R2) : null
  const ratio = allValid ? R2 / (R1 + R2) : null
  const displayVal = vout !== null ? parseFloat(vout.toFixed(4)).toString() : null
  const status = vout !== null ? 'ok' : 'idle'
  const resultText = vout !== null ? `${displayVal} V` : undefined

  return (
    <CalculatorShell
      title="Voltage Divider Calculator"
      description="Calculate the output voltage of a two-resistor voltage divider network. R2 is the lower resistor (connected to ground)."
      category="Basic Electrical"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcInput id="vd-vin" label="Input Voltage (Vin)" unit="V" value={vin}
          min={0} step={0.1} onChange={e => setVin(e.target.value)} />
        <CalcInput id="vd-r1" label="R1 (upper resistor)" unit="Ω" value={r1}
          min={0.001} step={1} helper="Connected between Vin and output"
          onChange={e => setR1(e.target.value)} />
        <CalcInput id="vd-r2" label="R2 (lower resistor)" unit="Ω" value={r2}
          min={0.001} step={1} helper="Connected between output and GND"
          onChange={e => setR2(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Output Voltage (Vout)" value={displayVal} unit="V"
          note={allValid ? `Vout = Vin × R2/(R1+R2) = ${vin} × ${r2}/(${r1}+${r2})` : undefined}
          status={status} />
        {ratio !== null && (
          <ResultBox label="Voltage Ratio" value={parseFloat((ratio * 100).toFixed(2)).toString()} unit="%"
            note="Vout as % of Vin" status={status} />
        )}
      </>}
      formula={<>
        <p><strong>Vout = Vin × R2 / (R1 + R2)</strong></p>
        <p>Where R1 is the upper resistor (Vin to output) and R2 is the lower resistor (output to GND).</p>
        <p>The current through the divider: <strong>I = Vin / (R1 + R2)</strong></p>
      </>}
      example={<>
        <p>Vin = 12 V, R1 = 1 kΩ, R2 = 2 kΩ:</p>
        <p><strong>Vout = 12 × 2000 / (1000 + 2000) = 8 V</strong></p>
      </>}
      notes={<>
        This formula assumes no load is connected at Vout. Connecting a load in parallel with R2 will lower the actual output voltage.
        Choose resistor values significantly lower than any expected load resistance for better accuracy.
      </>}
    />
  )
}
