import { useParams, Link } from 'react-router'
import { TOOLS } from '../../data/tools'

// Lazy-loaded calculator components
import OhmsLaw from './calculators/OhmsLaw'
import ElectricalPower from './calculators/ElectricalPower'
import ResistanceSeries from './calculators/ResistanceSeries'
import ResistanceParallel from './calculators/ResistanceParallel'
import VoltageDivider from './calculators/VoltageDivider'
import CurrentDivider from './calculators/CurrentDivider'
import Impedance from './calculators/Impedance'
import InductiveReactance from './calculators/InductiveReactance'
import CapacitiveReactance from './calculators/CapacitiveReactance'
import PowerFactor from './calculators/PowerFactor'
import SinglePhasePower from './calculators/SinglePhasePower'
import ThreePhasePower from './calculators/ThreePhasePower'
import VoltageDrop from './calculators/VoltageDrop'
import CableSizing from './calculators/CableSizing'
import TransformerSizing from './calculators/TransformerSizing'
import BreakerSize from './calculators/BreakerSize'
import FuseSize from './calculators/FuseSize'
import MotorCurrent from './calculators/MotorCurrent'
import EnergyConsumption from './calculators/EnergyConsumption'
import PowerFactorCorrection from './calculators/PowerFactorCorrection'

const CALCULATOR_MAP: Record<string, React.ComponentType> = {
  'ohms-law':                 OhmsLaw,
  'electrical-power':         ElectricalPower,
  'resistance-series':        ResistanceSeries,
  'resistance-parallel':      ResistanceParallel,
  'voltage-divider':          VoltageDivider,
  'current-divider':          CurrentDivider,
  'impedance':                Impedance,
  'inductive-reactance':      InductiveReactance,
  'capacitive-reactance':     CapacitiveReactance,
  'power-factor':             PowerFactor,
  'single-phase-power':       SinglePhasePower,
  'three-phase-power':        ThreePhasePower,
  'voltage-drop':             VoltageDrop,
  'cable-sizing':             CableSizing,
  'transformer-sizing':       TransformerSizing,
  'breaker-size':             BreakerSize,
  'fuse-size':                FuseSize,
  'motor-current':            MotorCurrent,
  'energy-consumption':       EnergyConsumption,
  'power-factor-correction':  PowerFactorCorrection,
}

export default function ToolPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const Calculator = CALCULATOR_MAP[slug]
  const tool = TOOLS.find(t => t.slug === slug)

  if (!Calculator) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--nav-h)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 'var(--px)' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase' }}>
            404 — Tool Not Found
          </span>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 6vw, 56px)', textTransform: 'uppercase', marginTop: 16, marginBottom: 24 }}>
            Unknown Tool
          </h1>
          <p style={{ color: 'var(--fg-dim)', marginBottom: 32 }}>
            No calculator found for "<code>{slug}</code>".
          </p>
          <Link to="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--accent)', color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
            ← Back to Tools
          </Link>
        </div>
      </div>
    )
  }

  return <Calculator />
}
