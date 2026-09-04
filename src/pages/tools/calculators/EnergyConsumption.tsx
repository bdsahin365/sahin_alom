import { useState } from 'react'
import CalculatorShell from '../CalculatorShell'
import CalcInput from '../CalcInput'
import ResultBox from '../ResultBox'

// Bangladesh electricity tariff (BERC 2024 approximate, residential flat-rate)
const BDT_TARIFF_PER_KWH = 8.45   // BDT per kWh (average residential tier)

const DEFAULTS = { power: '1000', hours: '8', days: '30', tariff: String(BDT_TARIFF_PER_KWH) }

export default function EnergyConsumption() {
  const [power, setPower] = useState(DEFAULTS.power)
  const [hours, setHours] = useState(DEFAULTS.hours)
  const [days, setDays] = useState(DEFAULTS.days)
  const [tariff, setTariff] = useState(DEFAULTS.tariff)

  const reset = () => { setPower(DEFAULTS.power); setHours(DEFAULTS.hours); setDays(DEFAULTS.days); setTariff(DEFAULTS.tariff) }

  const W = parseFloat(power), H = parseFloat(hours), D = parseFloat(days), T = parseFloat(tariff)
  const allValid = !isNaN(W) && !isNaN(H) && !isNaN(D) && !isNaN(T) && W > 0 && H > 0 && D > 0 && T > 0

  const kWh_day   = allValid ? (W / 1000) * H : null
  const kWh_month = allValid ? kWh_day! * D : null
  const cost_day   = allValid ? kWh_day! * T : null
  const cost_month = allValid ? kWh_month! * T : null

  const fmt = (v: number | null, d = 2) => v !== null ? parseFloat(v.toFixed(d)).toString() : null
  const status = kWh_day !== null ? 'ok' : 'idle'
  const resultText = kWh_day !== null
    ? `Daily: ${fmt(kWh_day)} kWh | Monthly: ${fmt(kWh_month)} kWh | Cost: ৳${fmt(cost_month)}`
    : undefined

  return (
    <CalculatorShell
      title="Energy Consumption Calculator"
      description="Estimate daily and monthly electricity usage in kWh and calculate the electricity bill in BDT based on BERC tariff rates."
      category="Cost & Estimation"
      onReset={reset}
      resultText={resultText}
      inputs={<>
        <CalcInput id="ec-w" label="Appliance Power" unit="W" value={power}
          min={1} step={10} helper="e.g. 1000 W = 1 kW. Check appliance nameplate or spec sheet."
          onChange={e => setPower(e.target.value)} />
        <CalcInput id="ec-h" label="Hours of Use per Day" unit="h/day" value={hours}
          min={0.1} max={24} step={0.5} onChange={e => setHours(e.target.value)} />
        <CalcInput id="ec-d" label="Days per Month" unit="days" value={days}
          min={1} max={31} step={1} onChange={e => setDays(e.target.value)} />
        <CalcInput id="ec-t" label="Electricity Tariff" unit="BDT/kWh" value={tariff}
          min={0.01} step={0.1}
          helper="BERC 2024 residential avg ≈ ৳8.45/kWh. Check your electricity bill for your actual rate."
          onChange={e => setTariff(e.target.value)} />
      </>}
      results={<>
        <ResultBox label="Daily Usage" value={fmt(kWh_day, 3)} unit="kWh" status={status} />
        <ResultBox label="Monthly Usage" value={fmt(kWh_month, 2)} unit="kWh" status={status} />
        <ResultBox label="Daily Cost" value={fmt(cost_day, 2)} unit="BDT" note="৳" status={status} />
        <ResultBox label="Monthly Cost" value={fmt(cost_month, 2)} unit="BDT" note="৳" status={status} />
      </>}
      formula={<>
        <p><strong>kWh = (Power in W / 1000) × Hours</strong></p>
        <p><strong>Cost (BDT) = kWh × Tariff Rate</strong></p>
        <p>Monthly kWh = Daily kWh × Days per month</p>
      </>}
      example={<>
        <p>Air conditioner: 1500 W, 8 h/day, 30 days, ৳8.45/kWh:</p>
        <p>Daily kWh = (1500 / 1000) × 8 = 12 kWh</p>
        <p>Monthly kWh = 12 × 30 = 360 kWh</p>
        <p><strong>Monthly cost = 360 × 8.45 = ৳3042</strong></p>
      </>}
      notes={<>
        The tariff rate varies by consumer category (residential, commercial, industrial) and consumption tier.
        Bangladesh BERC revises tariffs periodically — verify your current rate from your electricity bill or BERC website.
        This tool does not account for demand charges, VAT, meter rent, or surcharges.
      </>}
    />
  )
}
