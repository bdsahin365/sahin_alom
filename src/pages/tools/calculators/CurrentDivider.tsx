import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import ResultBox from '../ResultBox'

const DEFAULTS = { itotal: '10', r1: '1000', r2: '2000' }

export default function CurrentDivider() {
  const [itotal, setItotal] = useState(DEFAULTS.itotal)
  const [r1, setR1] = useState(DEFAULTS.r1)
  const [r2, setR2] = useState(DEFAULTS.r2)

  const reset = () => { setItotal(DEFAULTS.itotal); setR1(DEFAULTS.r1); setR2(DEFAULTS.r2) }

  const IT = parseFloat(itotal), R1 = parseFloat(r1), R2 = parseFloat(r2)
  const allValid = !isNaN(IT) && !isNaN(R1) && !isNaN(R2) && R1 > 0 && R2 > 0

  // I1 flows through R1; branch with lower R gets more current
  const i1 = allValid ? (IT * R2) / (R1 + R2) : null
  const i2 = allValid ? (IT * R1) / (R1 + R2) : null

  const d1 = i1 !== null ? parseFloat(i1.toFixed(4)).toString() : null
  const d2 = i2 !== null ? parseFloat(i2.toFixed(4)).toString() : null
  const status = i1 !== null ? 'ok' : 'idle'
  const resultText = i1 !== null ? `I1 = ${d1} A, I2 = ${d2} A` : undefined

  return (
    <CalculatorShell
      title="Current Divider Calculator"
      description="Find the current through each branch of a two-resistor parallel network given the total current entering the node."
      category="Basic Electrical"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcInput id="cd-it" label="Total Current (IT)" unit="A" value={itotal}
          min={0} step={0.1} onChange={e => setItotal(e.target.value)} />
        <CalcInput id="cd-r1" label="R1 (Branch 1)" unit="Ω" value={r1}
          min={0.001} step={1} onChange={e => setR1(e.target.value)} />
        <CalcInput id="cd-r2" label="R2 (Branch 2)" unit="Ω" value={r2}
          min={0.001} step={1} onChange={e => setR2(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Current through R1 (I1)" value={d1} unit="A"
          note={allValid ? `I1 = IT × R2/(R1+R2)` : undefined} status={status} />
        <ResultBox label="Current through R2 (I2)" value={d2} unit="A"
          note={allValid ? `I2 = IT × R1/(R1+R2)` : undefined} status={status} />
      </>}
      formula={<>
        <p><strong>I1 = IT × R2 / (R1 + R2)</strong></p>
        <p><strong>I2 = IT × R1 / (R1 + R2)</strong></p>
        <p>Note: the branch with the <em>lower</em> resistance carries the <em>higher</em> current.</p>
        <p>Verify: I1 + I2 = IT</p>
      </>}
      example={<>
        <p>IT = 10 A, R1 = 1 kΩ, R2 = 2 kΩ:</p>
        <p><strong>I1 = 10 × 2000 / 3000 = 6.67 A</strong></p>
        <p><strong>I2 = 10 × 1000 / 3000 = 3.33 A</strong></p>
      </>}
      notes={<>
        This calculator is for a simple two-branch parallel network.
        Voltage across both branches is equal.
        For more than two branches, apply the same formula iteratively or use nodal analysis.
      </>}
    />
  )
}
