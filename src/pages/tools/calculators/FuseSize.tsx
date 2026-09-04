import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import CalcSelect from '../CalcSelect'
import ResultBox from '../ResultBox'

// Standard fuse ratings (A) — IEC 60269 gG/gL type
const FUSE_RATINGS = [2, 4, 6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630]

const DEFAULTS = { current: '16', loadType: 'general' }

export default function FuseSize() {
  const [current, setCurrent] = useState(DEFAULTS.current)
  const [loadType, setLoadType] = useState(DEFAULTS.loadType)

  const reset = () => { setCurrent(DEFAULTS.current); setLoadType(DEFAULTS.loadType) }

  const I = parseFloat(current)
  const allValid = !isNaN(I) && I > 0

  // IEC: fuse In ≥ 1.0 × I_design (fuses are self-protecting; 1.25× for motors)
  const SF = loadType === 'motor' ? 1.5 : 1.1
  const designCurrent = allValid ? I * SF : null

  const recommended = designCurrent !== null
    ? FUSE_RATINGS.find(r => r >= designCurrent) ?? null
    : null

  const fmt = (v: number | null, d = 2) => v !== null ? parseFloat(v.toFixed(d)).toString() : null
  const status = recommended !== null ? 'ok' : 'idle'
  const resultText = recommended !== null ? `${recommended} A HRC fuse` : undefined

  return (
    <CalculatorShell
      title="Fuse Size Calculator"
      description="Select the correct IEC standard HRC fuse rating for overcurrent protection based on load type and current."
      category="Protection"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcSelect id="fs-loadtype" label="Load Type" value={loadType}
          onChange={e => setLoadType(e.target.value)}
          options={[
            { value: 'general', label: 'General / Resistive (×1.1)' },
            { value: 'motor',   label: 'Motor (×1.5 for starting)' },
            { value: 'cable',   label: 'Cable Protection Only (×1.0)' },
          ]}
          helper="Motor loads require a fuse that tolerates starting inrush"
        />
        <CalcInput id="fs-i" label="Full-Load Current (I)" unit="A" value={current}
          min={0.5} step={0.5} onChange={e => setCurrent(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Design Current" value={fmt(designCurrent, 1)} unit="A"
          note={allValid ? `${current} A × ${SF}` : undefined} status={status} />
        <ResultBox label="Recommended Fuse Rating" value={recommended} unit="A"
          note="IEC 60269 gG/gL type HRC fuse" status={status} />
      </>}
      formula={<>
        <p><strong>I_fuse ≥ I_design × SF</strong></p>
        <p>General loads: SF = 1.1 | Motor loads: SF = 1.5 | Cable protection: SF = 1.0</p>
        <p>Select next standard fuse rating ≥ design current.</p>
      </>}
      example={<>
        <p>Motor FLC = 16 A, SF = 1.5:</p>
        <p>Design = 16 × 1.5 = 24 A</p>
        <p><strong>Recommended: 25 A HRC fuse</strong></p>
      </>}
      notes={<>
        HRC (High Rupturing Capacity) fuses comply with IEC 60269 (gG/gL type for general use, aM type for motor protection).
        Unlike MCBs, blown fuses must be replaced — not reset.
        The fuse current rating must not exceed the cable ampacity.
        For motor protection, gM-type fuses (motor-duty) are preferred over gG.
      </>}
    />
  )
}
