import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import CalcSelect from '../CalcSelect'
import ResultBox from '../ResultBox'

type Mode = 'from-kw-kva' | 'from-kw-kvar' | 'from-angle'

const DEFAULTS = { kw: '80', kva: '100', kvar: '60', angle: '36.87' }

export default function PowerFactor() {
  const [mode, setMode] = useState<Mode>('from-kw-kva')
  const [kw, setKw] = useState(DEFAULTS.kw)
  const [kva, setKva] = useState(DEFAULTS.kva)
  const [kvar, setKvar] = useState(DEFAULTS.kvar)
  const [angle, setAngle] = useState(DEFAULTS.angle)

  const reset = () => { setKw(DEFAULTS.kw); setKva(DEFAULTS.kva); setKvar(DEFAULTS.kvar); setAngle(DEFAULTS.angle); setMode('from-kw-kva') }

  let pf: number | null = null, kwOut: number | null = null, kvaOut: number | null = null, kvarOut: number | null = null

  const KW = parseFloat(kw), KVA = parseFloat(kva), KVAR = parseFloat(kvar), ANGLE = parseFloat(angle)

  if (mode === 'from-kw-kva' && !isNaN(KW) && !isNaN(KVA) && KVA > 0) {
    pf = KW / KVA; kvarOut = Math.sqrt(KVA * KVA - KW * KW); kwOut = KW; kvaOut = KVA
  } else if (mode === 'from-kw-kvar' && !isNaN(KW) && !isNaN(KVAR)) {
    kvaOut = Math.sqrt(KW * KW + KVAR * KVAR); pf = kvaOut > 0 ? KW / kvaOut : null; kwOut = KW; kvarOut = KVAR
  } else if (mode === 'from-angle' && !isNaN(ANGLE)) {
    pf = Math.cos(ANGLE * Math.PI / 180)
    if (!isNaN(KW) && KW > 0) {
      kwOut = KW; kvaOut = KW / pf; kvarOut = Math.sqrt(kvaOut * kvaOut - KW * KW)
    }
  }

  const fmt = (v: number | null, d = 3) => v !== null ? parseFloat(v.toFixed(d)).toString() : null
  const status = pf !== null ? 'ok' : 'idle'
  const resultText = pf !== null ? `PF = ${fmt(pf, 4)}, kW = ${fmt(kwOut)}, kVA = ${fmt(kvaOut)}, kVAR = ${fmt(kvarOut)}` : undefined

  return (
    <CalculatorShell
      title="Power Factor Calculator"
      description="Calculate power factor and the power triangle components: real power (kW), apparent power (kVA), and reactive power (kVAR)."
      category="Power Systems"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcSelect id="pf-mode" label="Known Values" value={mode}
          onChange={e => setMode(e.target.value as Mode)}
          options={[
            { value: 'from-kw-kva',  label: 'kW and kVA known' },
            { value: 'from-kw-kvar', label: 'kW and kVAR known' },
            { value: 'from-angle',   label: 'Phase angle (φ) known' },
          ]}
        />
        {mode === 'from-angle' && (
          <CalcInput id="pf-angle" label="Phase Angle (φ)" unit="°" value={angle}
            min={0} max={90} step={0.1} helper="Angle between voltage and current"
            onChange={e => setAngle(e.target.value)} />
        )}
        {(mode === 'from-kw-kva' || mode === 'from-kw-kvar' || mode === 'from-angle') && (
          <CalcInput id="pf-kw" label="Real Power (P)" unit="kW" value={kw}
            min={0} step={1} onChange={e => setKw(e.target.value)} />
        )}
        {mode === 'from-kw-kva' && (
          <CalcInput id="pf-kva" label="Apparent Power (S)" unit="kVA" value={kva}
            min={0} step={1} onChange={e => setKva(e.target.value)} />
        )}
        {mode === 'from-kw-kvar' && (
          <CalcInput id="pf-kvar" label="Reactive Power (Q)" unit="kVAR" value={kvar}
            min={0} step={1} onChange={e => setKvar(e.target.value)} />
        )}
      </>}
      results={<>
        <ResultBox label="Power Factor (PF)" value={fmt(pf, 4)} unit=""
          note={pf !== null ? `cos φ = ${fmt(pf, 4)} | Angle = ${fmt(pf !== null ? Math.acos(pf) * 180 / Math.PI : null, 2)}°` : undefined}
          status={status} />
        <ResultBox label="Real Power (P)" value={fmt(kwOut)} unit="kW" status={status} />
        <ResultBox label="Apparent Power (S)" value={fmt(kvaOut)} unit="kVA" status={status} />
        <ResultBox label="Reactive Power (Q)" value={fmt(kvarOut)} unit="kVAR" status={status} />
      </>}
      formula={<>
        <p><strong>PF = P (kW) / S (kVA) = cos φ</strong></p>
        <p><strong>S² = P² + Q²</strong>  (power triangle)</p>
        <p><strong>Q = √(S² − P²)</strong></p>
        <p>PF ranges from 0 to 1. Unity PF (1.0) means all power is useful (resistive load).</p>
      </>}
      example={<>
        <p>A load: P = 80 kW, S = 100 kVA</p>
        <p><strong>PF = 80 / 100 = 0.80</strong></p>
        <p><strong>Q = √(100² − 80²) = 60 kVAR</strong></p>
      </>}
      notes={<>
        A low power factor (below 0.85) increases reactive current, causing higher cable losses and voltage drop.
        Many utilities in Bangladesh and globally penalise industrial customers for PF below 0.90.
        Use the Power Factor Correction calculator to size a capacitor bank to improve PF.
      </>}
    />
  )
}
