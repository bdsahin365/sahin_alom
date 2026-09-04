import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import CalcSelect from '../CalcSelect'
import ResultBox from '../ResultBox'

type Mode = 'find-current' | 'find-voltage' | 'find-resistance'

const DEFAULTS = { voltage: '12', current: '3', resistance: '4' }

export default function OhmsLaw() {
  const [mode, setMode] = useState<Mode>('find-current')
  const [voltage, setVoltage] = useState(DEFAULTS.voltage)
  const [current, setCurrent] = useState(DEFAULTS.current)
  const [resistance, setResistance] = useState(DEFAULTS.resistance)

  const reset = () => { setVoltage(DEFAULTS.voltage); setCurrent(DEFAULTS.current); setResistance(DEFAULTS.resistance); setMode('find-current') }

  // Compute
  let result: number | null = null
  let label = ''; let unit = ''; let note = ''

  const V = parseFloat(voltage), I = parseFloat(current), R = parseFloat(resistance)

  if (mode === 'find-current' && !isNaN(V) && !isNaN(R) && R !== 0) {
    result = V / R; label = 'Current (I)'; unit = 'A'; note = `I = V ÷ R = ${V} ÷ ${R}`
  } else if (mode === 'find-voltage' && !isNaN(I) && !isNaN(R)) {
    result = I * R; label = 'Voltage (V)'; unit = 'V'; note = `V = I × R = ${I} × ${R}`
  } else if (mode === 'find-resistance' && !isNaN(V) && !isNaN(I) && I !== 0) {
    result = V / I; label = 'Resistance (R)'; unit = 'Ω'; note = `R = V ÷ I = ${V} ÷ ${I}`
  }

  const displayVal = result !== null ? parseFloat(result.toFixed(4)).toString() : null
  const status = result !== null ? 'ok' : 'idle'
  const resultText = result !== null ? `${displayVal} ${unit}` : undefined

  return (
    <CalculatorShell
      title="Ohm's Law Calculator"
      description="Calculate voltage, current, or resistance from any two known values. Select what you want to find, then enter the other two values."
      category="Basic Electrical"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcSelect
          id="ohm-mode"
          label="Find"
          value={mode}
          onChange={e => setMode(e.target.value as Mode)}
          options={[
            { value: 'find-current',    label: 'Current (I) — from V and R' },
            { value: 'find-voltage',    label: 'Voltage (V) — from I and R' },
            { value: 'find-resistance', label: 'Resistance (R) — from V and I' },
          ]}
        />
        {mode !== 'find-voltage' && (
          <CalcInput id="ohm-v" label="Voltage (V)" unit="V" value={voltage}
            min={0} step={0.1} onChange={e => setVoltage(e.target.value)} />
        )}
        {mode !== 'find-current' && (
          <CalcInput id="ohm-i" label="Current (I)" unit="A" value={current}
            min={0} step={0.01} onChange={e => setCurrent(e.target.value)} />
        )}
        {mode !== 'find-resistance' && (
          <CalcInput id="ohm-r" label="Resistance (R)" unit="Ω" value={resistance}
            min={0} step={0.1} onChange={e => setResistance(e.target.value)} />
        )}
      </>}
      results={<ResultBox label={label || 'Result'} value={displayVal} unit={unit} note={note} status={status} />}
      formula={<>
        <p><strong>V = I × R</strong> — Voltage equals current times resistance.</p>
        <p><strong>I = V / R</strong> — Current equals voltage divided by resistance.</p>
        <p><strong>R = V / I</strong> — Resistance equals voltage divided by current.</p>
        <p style={{ marginTop: 8 }}>Where: V = Volts (V), I = Amperes (A), R = Ohms (Ω)</p>
      </>}
      example={<>
        <p>A 12 V battery connected to a 4 Ω resistor:</p>
        <p><strong>I = V / R = 12 / 4 = 3 A</strong></p>
        <p>The circuit draws 3 amperes of current.</p>
      </>}
      notes={<>
        Ohm's Law applies to linear (resistive) loads at constant temperature.
        It does not directly apply to non-linear devices such as diodes, transistors, or LED circuits.
        Always verify polarity and ensure resistance is not zero before dividing.
      </>}
    />
  )
}
