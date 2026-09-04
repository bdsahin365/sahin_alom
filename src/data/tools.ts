// ── Electrical Engineering Tools Registry ─────────────────────────────────────
// Single source of truth consumed by ToolsPage (listing) and ToolPage (dispatch).

export type ToolCategory =
  | 'Basic Electrical'
  | 'Power Systems'
  | 'Cables & Wiring'
  | 'Protection'
  | 'Motors & Transformers'
  | 'Solar & Backup'
  | 'Cost & Estimation'

export type Tool = {
  slug: string
  name: string
  tagline: string
  category: ToolCategory
  icon: string       // lucide-react icon component name
  popular?: boolean
  keywords: string[]
}

export const TOOLS: Tool[] = [
  {
    slug: 'ohms-law',
    name: "Ohm's Law Calculator",
    tagline: 'Find voltage, current, or resistance from any two values.',
    category: 'Basic Electrical',
    icon: 'Zap',
    popular: true,
    keywords: ['ohm', 'voltage', 'current', 'resistance', 'V', 'I', 'R'],
  },
  {
    slug: 'electrical-power',
    name: 'Electrical Power Calculator',
    tagline: 'Calculate real power in watts from voltage, current, and power factor.',
    category: 'Basic Electrical',
    icon: 'Activity',
    popular: true,
    keywords: ['power', 'watt', 'voltage', 'current', 'P', 'W', 'kW'],
  },
  {
    slug: 'resistance-series',
    name: 'Series Resistance Calculator',
    tagline: 'Total resistance of resistors connected in series.',
    category: 'Basic Electrical',
    icon: 'Minus',
    keywords: ['series', 'resistance', 'resistor', 'total', 'R total'],
  },
  {
    slug: 'resistance-parallel',
    name: 'Parallel Resistance Calculator',
    tagline: 'Equivalent resistance of resistors connected in parallel.',
    category: 'Basic Electrical',
    icon: 'GitFork',
    keywords: ['parallel', 'resistance', 'resistor', 'equivalent', 'R eq'],
  },
  {
    slug: 'voltage-divider',
    name: 'Voltage Divider Calculator',
    tagline: 'Output voltage of a two-resistor voltage divider network.',
    category: 'Basic Electrical',
    icon: 'Divide',
    keywords: ['voltage divider', 'output voltage', 'R1', 'R2', 'Vout'],
  },
  {
    slug: 'current-divider',
    name: 'Current Divider Calculator',
    tagline: 'Branch current in a two-resistor parallel network.',
    category: 'Basic Electrical',
    icon: 'GitFork',
    keywords: ['current divider', 'branch', 'parallel', 'I1', 'I2'],
  },
  {
    slug: 'impedance',
    name: 'Impedance Calculator',
    tagline: 'Total impedance of R, L, C in a series AC circuit.',
    category: 'Basic Electrical',
    icon: 'Waves',
    keywords: ['impedance', 'Z', 'AC', 'reactance', 'resistance', 'RL', 'RC', 'RLC'],
  },
  {
    slug: 'inductive-reactance',
    name: 'Inductive Reactance Calculator',
    tagline: 'Reactance of an inductor at a given frequency.',
    category: 'Basic Electrical',
    icon: 'TrendingUp',
    keywords: ['inductive', 'reactance', 'XL', 'inductor', 'frequency', 'Hz', 'henry'],
  },
  {
    slug: 'capacitive-reactance',
    name: 'Capacitive Reactance Calculator',
    tagline: 'Reactance of a capacitor at a given frequency.',
    category: 'Basic Electrical',
    icon: 'TrendingDown',
    keywords: ['capacitive', 'reactance', 'XC', 'capacitor', 'frequency', 'Hz', 'farad'],
  },
  {
    slug: 'power-factor',
    name: 'Power Factor Calculator',
    tagline: 'Find power factor, real, reactive, and apparent power.',
    category: 'Power Systems',
    icon: 'BarChart2',
    popular: true,
    keywords: ['power factor', 'PF', 'kW', 'kVAR', 'kVA', 'cos phi', 'real power', 'reactive'],
  },
  {
    slug: 'single-phase-power',
    name: 'Single-Phase Power Calculator',
    tagline: 'Real, reactive, and apparent power for single-phase loads.',
    category: 'Power Systems',
    icon: 'Minus',
    keywords: ['single phase', '1-phase', 'power', '230V', 'kW', 'kVA', 'kVAR'],
  },
  {
    slug: 'three-phase-power',
    name: 'Three-Phase Power Calculator',
    tagline: 'Power for balanced three-phase loads (star or delta).',
    category: 'Power Systems',
    icon: 'Triangle',
    popular: true,
    keywords: ['three phase', '3-phase', '400V', 'star', 'delta', 'kW', 'kVA', 'motor'],
  },
  {
    slug: 'voltage-drop',
    name: 'Voltage Drop Calculator',
    tagline: 'Voltage drop across a cable run for single or three-phase.',
    category: 'Cables & Wiring',
    icon: 'ArrowDown',
    popular: true,
    keywords: ['voltage drop', 'cable', 'wire', 'VD', 'conductor', 'length', 'mm2'],
  },
  {
    slug: 'cable-sizing',
    name: 'Cable Sizing Calculator',
    tagline: 'Minimum cable cross-section for a given load and cable run.',
    category: 'Cables & Wiring',
    icon: 'Cable',
    popular: true,
    keywords: ['cable sizing', 'conductor', 'mm2', 'cross section', 'AWG', 'ampacity'],
  },
  {
    slug: 'transformer-sizing',
    name: 'Transformer Sizing Calculator',
    tagline: 'Select transformer kVA rating based on connected load.',
    category: 'Motors & Transformers',
    icon: 'RefreshCw',
    keywords: ['transformer', 'kVA', 'sizing', 'load', 'primary', 'secondary', 'turns ratio'],
  },
  {
    slug: 'breaker-size',
    name: 'Breaker Size Calculator',
    tagline: 'Minimum circuit breaker rating for a given load current.',
    category: 'Protection',
    icon: 'ShieldCheck',
    popular: true,
    keywords: ['breaker', 'MCB', 'MCCB', 'circuit breaker', 'rating', 'ampere', 'protection'],
  },
  {
    slug: 'fuse-size',
    name: 'Fuse Size Calculator',
    tagline: 'Appropriate fuse rating for overcurrent protection.',
    category: 'Protection',
    icon: 'Zap',
    keywords: ['fuse', 'rating', 'protection', 'ampere', 'HRC', 'overcurrent'],
  },
  {
    slug: 'motor-current',
    name: 'Motor Current Calculator',
    tagline: 'Full-load current of single-phase or three-phase motors.',
    category: 'Motors & Transformers',
    icon: 'Settings',
    popular: true,
    keywords: ['motor', 'current', 'FLC', 'full load', 'kW', 'HP', 'efficiency', '3-phase'],
  },
  {
    slug: 'energy-consumption',
    name: 'Energy Consumption Calculator',
    tagline: 'Daily and monthly kWh usage with BDT electricity cost.',
    category: 'Cost & Estimation',
    icon: 'BatteryMedium',
    keywords: ['energy', 'kWh', 'consumption', 'cost', 'BDT', 'electricity bill', 'tariff'],
  },
  {
    slug: 'power-factor-correction',
    name: 'Power Factor Correction Calculator',
    tagline: 'Capacitor bank size to improve power factor to target.',
    category: 'Power Systems',
    icon: 'Target',
    keywords: ['power factor correction', 'capacitor bank', 'PFC', 'kVAR', 'cos phi', 'APFC'],
  },
]

export const CATEGORIES: ToolCategory[] = [
  'Basic Electrical',
  'Power Systems',
  'Cables & Wiring',
  'Protection',
  'Motors & Transformers',
  'Solar & Backup',
  'Cost & Estimation',
]
