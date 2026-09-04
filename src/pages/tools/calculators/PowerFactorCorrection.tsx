import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import ResultBox from '../ResultBox'

const DEFAULTS = { kw: '80', currentPF: '0.75', targetPF: '0.95', voltage: '400', frequency: '50' }

export default function PowerFactorCorrection() {
  const [kw, setKw] = useState(DEFAULTS.kw)
  const [currentPF, setCurrentPF] = useState(DEFAULTS.currentPF)
  const [targetPF, setTargetPF] = useState(DEFAULTS.targetPF)
  const [voltage, setVoltage] = useState(DEFAULTS.voltage)
  const [frequency, setFrequency] = useState(DEFAULTS.frequency)

  const reset = () => {
    setKw(DEFAULTS.kw); setCurrentPF(DEFAULTS.currentPF); setTargetPF(DEFAULTS.targetPF)
    setVoltage(DEFAULTS.voltage); setFrequency(DEFAULTS.frequency)
  }

  const KW = parseFloat(kw), PF1 = parseFloat(currentPF), PF2 = parseFloat(targetPF)
  const V = parseFloat(voltage), f = parseFloat(frequency)

  const allValid = !isNaN(KW) && !isNaN(PF1) && !isNaN(PF2) &&
    KW > 0 && PF1 > 0 && PF1 < 1 && PF2 > 0 && PF2 <= 1 && PF2 > PF1

  // Q_C = P × (tan φ1 − tan φ2)
  const phi1 = allValid ? Math.acos(PF1) : null
  const phi2 = allValid ? Math.acos(PF2) : null
  const kVAR_required = (phi1 !== null && phi2 !== null)
    ? KW * (Math.tan(phi1) - Math.tan(phi2))
    : null

  // Capacitance: C = Q / (2πf × V²) in Farads → µF
  const C_uF = (kVAR_required !== null && !isNaN(V) && !isNaN(f) && V > 0 && f > 0)
    ? (kVAR_required * 1000) / (2 * Math.PI * f * V * V) * 1e6
    : null

  // kVA improvement
  const kVA_before = allValid ? KW / PF1 : null
  const kVA_after  = allValid ? KW / PF2 : null
  const kVA_saved  = (kVA_before !== null && kVA_after !== null) ? kVA_before - kVA_after : null

  const fmt = (v: number | null, d = 2) => v !== null ? parseFloat(v.toFixed(d)).toString() : null
  const status = kVAR_required !== null ? 'ok' : 'idle'
  const resultText = kVAR_required !== null ? `${fmt(kVAR_required)} kVAR capacitor bank` : undefined

  const errorPF = PF2 <= PF1 && !isNaN(PF1) && !isNaN(PF2)

  return (
    <CalculatorShell
      title="Power Factor Correction Calculator"
      description="Calculate the required capacitor bank size (kVAR) to improve power factor from an existing value to a target value."
      category="Power Systems"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcInput id="pfc-kw" label="Real Power (P)" unit="kW" value={kw}
          min={1} step={1} onChange={e => setKw(e.target.value)} />
        <CalcInput id="pfc-pf1" label="Existing Power Factor" unit="" value={currentPF}
          min={0.3} max={0.99} step={0.01}
          helper="Current power factor of the load (from meter or PF calculator)"
          onChange={e => setCurrentPF(e.target.value)} />
        <CalcInput id="pfc-pf2" label="Target Power Factor" unit="" value={targetPF}
          min={0.9} max={1} step={0.01}
          error={errorPF ? 'Target PF must be higher than existing PF' : undefined}
          helper="Utility requirement: typically ≥0.90 to ≥0.95"
          onChange={e => setTargetPF(e.target.value)} />
        <CalcInput id="pfc-v" label="System Voltage" unit="V" value={voltage}
          min={100} step={10} helper="Three-phase line-to-line voltage (e.g. 400 V)"
          onChange={e => setVoltage(e.target.value)} />
        <CalcInput id="pfc-f" label="Frequency" unit="Hz" value={frequency}
          min={50} max={60} step={10} onChange={e => setFrequency(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Capacitor Bank Required" value={fmt(kVAR_required)} unit="kVAR"
          note="Total reactive compensation needed" status={status} />
        <ResultBox label="Capacitance per Phase" value={fmt(C_uF, 1)} unit="µF"
          note="For three-phase star-connected bank" status={status} />
        <ResultBox label="kVA Reduction" value={fmt(kVA_saved)} unit="kVA"
          note={allValid ? `kVA: ${fmt(kVA_before)} → ${fmt(kVA_after)}` : undefined}
          status={status} />
      </>}
      formula={<>
        <p><strong>Q_C (kVAR) = P × (tan φ₁ − tan φ₂)</strong></p>
        <p>Where φ₁ = arccos(PF₁) and φ₂ = arccos(PF₂)</p>
        <p><strong>C (F) = Q_C / (2π × f × V²)</strong></p>
        <p>Capacitance shown is per-phase for a star (Y) connected bank.</p>
      </>}
      example={<>
        <p>P = 80 kW, PF₁ = 0.75, PF₂ = 0.95:</p>
        <p>φ₁ = arccos(0.75) = 41.41°, φ₂ = arccos(0.95) = 18.19°</p>
        <p>Q_C = 80 × (tan 41.41° − tan 18.19°) = 80 × (0.882 − 0.329)</p>
        <p><strong>Q_C = 80 × 0.553 = 44.2 kVAR</strong></p>
      </>}
      notes={<>
        Bangladesh utilities impose penalty charges on industrial consumers with power factor below 0.85–0.90.
        Install capacitor banks at the point of supply or distribution board, not at individual motors (unless dedicated units).
        Use automatic power factor correction (APFC) panels with thyristor-switched capacitors for variable loads.
        Over-correction (leading PF) can cause voltage rise — do not exceed unity PF.
      </>}
    />
  )
}
