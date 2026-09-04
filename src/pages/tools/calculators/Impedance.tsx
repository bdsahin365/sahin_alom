import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import ResultBox from '../ResultBox'

const DEFAULTS = { resistance: '10', xl: '20', xc: '5' }

export default function Impedance() {
  const [resistance, setResistance] = useState(DEFAULTS.resistance)
  const [xl, setXl] = useState(DEFAULTS.xl)
  const [xc, setXc] = useState(DEFAULTS.xc)

  const reset = () => { setResistance(DEFAULTS.resistance); setXl(DEFAULTS.xl); setXc(DEFAULTS.xc) }

  const R = parseFloat(resistance), XL = parseFloat(xl), XC = parseFloat(xc)
  const allValid = !isNaN(R) && !isNaN(XL) && !isNaN(XC)

  const Xnet = allValid ? XL - XC : null
  const Z = Xnet !== null ? Math.sqrt(R * R + Xnet * Xnet) : null
  const phiDeg = Z !== null && Xnet !== null ? (Math.atan2(Xnet, R) * 180) / Math.PI : null

  const displayZ = Z !== null ? parseFloat(Z.toFixed(4)).toString() : null
  const displayPhi = phiDeg !== null ? parseFloat(phiDeg.toFixed(2)).toString() : null
  const displayXnet = Xnet !== null ? parseFloat(Xnet.toFixed(4)).toString() : null
  const status = Z !== null ? 'ok' : 'idle'
  const resultText = Z !== null ? `Z = ${displayZ} Ω, φ = ${displayPhi}°` : undefined

  return (
    <CalculatorShell
      title="Impedance Calculator"
      description="Calculate total impedance and phase angle of a series RLC AC circuit from resistance and reactances."
      category="Basic Electrical"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcInput id="imp-r" label="Resistance (R)" unit="Ω" value={resistance}
          min={0} step={0.1} onChange={e => setResistance(e.target.value)} />
        <CalcInput id="imp-xl" label="Inductive Reactance (XL)" unit="Ω" value={xl}
          min={0} step={0.1} helper="Use Inductive Reactance calculator to find XL"
          onChange={e => setXl(e.target.value)} />
        <CalcInput id="imp-xc" label="Capacitive Reactance (XC)" unit="Ω" value={xc}
          min={0} step={0.1} helper="Use Capacitive Reactance calculator to find XC"
          onChange={e => setXc(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Total Impedance (Z)" value={displayZ} unit="Ω"
          note={allValid ? `Z = √(R² + (XL−XC)²)` : undefined} status={status} />
        <ResultBox label="Net Reactance (X)" value={displayXnet} unit="Ω"
          note="XL − XC  (positive = inductive)" status={status} />
        <ResultBox label="Phase Angle (φ)" value={displayPhi} unit="°"
          note="+ve = inductive, −ve = capacitive" status={status} />
      </>}
      formula={<>
        <p><strong>Z = √(R² + (XL − XC)²)</strong></p>
        <p><strong>φ = arctan((XL − XC) / R)</strong>  (in degrees)</p>
        <p>If XL &gt; XC → inductive circuit (current lags voltage).</p>
        <p>If XC &gt; XL → capacitive circuit (current leads voltage).</p>
        <p>If XL = XC → resonance, Z = R (purely resistive).</p>
      </>}
      example={<>
        <p>R = 10 Ω, XL = 20 Ω, XC = 5 Ω:</p>
        <p>Xnet = 20 − 5 = 15 Ω</p>
        <p><strong>Z = √(10² + 15²) = √325 ≈ 18.03 Ω</strong></p>
        <p>φ = arctan(15/10) ≈ 56.3° (inductive)</p>
      </>}
      notes={<>
        Enter reactance values directly. Use the Inductive Reactance and Capacitive Reactance calculators
        to compute XL and XC from frequency and component values first.
        For a purely resistive circuit, set XL = XC = 0.
      </>}
    />
  )
}
