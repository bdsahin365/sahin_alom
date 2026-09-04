import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import CalcSelect from '../CalcSelect'
import ResultBox from '../ResultBox'

// Standard kVA ratings (IEC)
const STANDARD_KVA = [5, 10, 15, 25, 37.5, 50, 75, 100, 150, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000]

const DEFAULTS = { loadKW: '50', pf: '0.85', demandFactor: '0.8', diversityFactor: '1.0', growthFactor: '1.2' }

export default function TransformerSizing() {
  const [loadKW, setLoadKW] = useState(DEFAULTS.loadKW)
  const [pf, setPf] = useState(DEFAULTS.pf)
  const [demandFactor, setDemandFactor] = useState(DEFAULTS.demandFactor)
  const [diversityFactor, setDiversityFactor] = useState(DEFAULTS.diversityFactor)
  const [growthFactor, setGrowthFactor] = useState(DEFAULTS.growthFactor)
  const [primaryV, setPrimaryV] = useState('11000')
  const [secondaryV, setSecondaryV] = useState('400')

  const reset = () => {
    setLoadKW(DEFAULTS.loadKW); setPf(DEFAULTS.pf)
    setDemandFactor(DEFAULTS.demandFactor); setDiversityFactor(DEFAULTS.diversityFactor)
    setGrowthFactor(DEFAULTS.growthFactor)
    setPrimaryV('11000'); setSecondaryV('400')
  }

  const KW = parseFloat(loadKW), PF = parseFloat(pf)
  const DF = parseFloat(demandFactor), DivF = parseFloat(diversityFactor), GF = parseFloat(growthFactor)
  const V1 = parseFloat(primaryV), V2 = parseFloat(secondaryV)

  const allValid = !isNaN(KW) && !isNaN(PF) && !isNaN(DF) && !isNaN(DivF) && !isNaN(GF) &&
    KW > 0 && PF > 0 && DF > 0 && DivF > 0 && GF > 0

  // Design kVA = kW / PF × DF × GF / DivF
  const designKVA = allValid ? (KW / PF) * DF * GF / DivF : null
  const turnsRatio = (!isNaN(V1) && !isNaN(V2) && V2 > 0) ? V1 / V2 : null

  // Find next standard kVA >= designKVA
  const stdKVA = designKVA !== null
    ? STANDARD_KVA.find(s => s >= designKVA) ?? null
    : null

  const fmt = (v: number | null, d = 2) => v !== null ? parseFloat(v.toFixed(d)).toString() : null
  const status = stdKVA !== null ? 'ok' : 'idle'
  const resultText = stdKVA !== null ? `${stdKVA} kVA transformer` : undefined

  return (
    <CalculatorShell
      title="Transformer Sizing Calculator"
      description="Estimate the required transformer kVA rating from connected load, power factor, demand factor, and a future growth allowance."
      category="Motors & Transformers"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcInput id="tx-kw" label="Total Connected Load" unit="kW" value={loadKW}
          min={1} step={1} onChange={e => setLoadKW(e.target.value)} />
        <CalcInput id="tx-pf" label="Load Power Factor" unit="" value={pf}
          min={0.5} max={1} step={0.01} onChange={e => setPf(e.target.value)} />
        <CalcInput id="tx-df" label="Demand Factor" unit="" value={demandFactor}
          min={0.1} max={1} step={0.05}
          helper="Fraction of connected load actually used simultaneously"
          onChange={e => setDemandFactor(e.target.value)} />
        <CalcInput id="tx-divf" label="Diversity Factor" unit="" value={diversityFactor}
          min={0.5} max={3} step={0.1}
          helper="Typically 1.0–1.5; higher = more diversity between loads"
          onChange={e => setDiversityFactor(e.target.value)} />
        <CalcInput id="tx-gf" label="Growth Factor" unit="" value={growthFactor}
          min={1} max={2} step={0.05}
          helper="1.2 = 20% future growth allowance"
          onChange={e => setGrowthFactor(e.target.value)} />
        <CalcInput id="tx-v1" label="Primary Voltage" unit="V" value={primaryV}
          min={100} step={100} onChange={e => setPrimaryV(e.target.value)} />
        <CalcInput id="tx-v2" label="Secondary Voltage" unit="V" value={secondaryV}
          min={100} step={10} onChange={e => setSecondaryV(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Required kVA (Design)" value={fmt(designKVA)} unit="kVA"
          note="Before rounding to standard size" status={status} />
        <ResultBox label="Recommended Standard kVA" value={stdKVA} unit="kVA"
          note="Next standard IEC transformer size" status={status} />
        <ResultBox label="Turns Ratio (V1 : V2)" value={fmt(turnsRatio, 3)} unit=":1"
          note={`${primaryV} V / ${secondaryV} V`}
          status={!isNaN(V1) && !isNaN(V2) && V2 > 0 ? 'ok' : 'idle'} />
      </>}
      formula={<>
        <p><strong>kVA_design = (kW / PF) × Demand Factor × Growth Factor / Diversity Factor</strong></p>
        <p><strong>Turns Ratio = V_primary / V_secondary</strong></p>
        <p>Select the next larger standard kVA rating from the IEC series.</p>
      </>}
      example={<>
        <p>Load = 50 kW, PF = 0.85, DF = 0.8, GF = 1.2, DivF = 1.0:</p>
        <p>kVA = (50 / 0.85) × 0.8 × 1.2 / 1.0 = 56.47 kVA</p>
        <p><strong>Standard size: 63 kVA (next size up from 56.47)</strong></p>
      </>}
      notes={<>
        Demand factor and diversity factor vary by installation type — consult the electrical installation designer and local utility.
        Typical demand factor for industrial: 0.6–0.8. Residential: 0.4–0.7.
        Bangladesh utilities (DESCO, DPDC) require coordination for HV transformer installations above 50 kVA.
      </>}
    />
  )
}
