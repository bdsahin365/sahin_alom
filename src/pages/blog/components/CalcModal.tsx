import { useState } from 'react'
import { X, Plus, Trash2, Calculator, Sparkles, Check, ChevronRight, BookOpen, Layers, ShieldCheck } from 'lucide-react'
import type { CalcBlockAttrs, CalcGivenParam, CalcNomenclature, CalcStepItem, CalcEquipmentSpec } from '../extensions/CalcBlock'

interface CalcModalProps {
  initial?: Partial<CalcBlockAttrs>
  onInsert: (attrs: CalcBlockAttrs) => void
  onClose: () => void
}

const PRESETS: { label: string; desc: string; category: string; data: CalcBlockAttrs }[] = [
  {
    label: 'Three-Phase Load Current & Breaker Sizing',
    category: 'ELECTRICAL POWER DISTRIBUTION',
    desc: 'Calculate full-load line current (IL) and continuous 125% breaker sizing (BNBC 2020)',
    data: {
      title: 'Three-Phase Load Current & 125% Breaker Sizing',
      category: 'ELECTRICAL POWER DISTRIBUTION',
      standardRef: 'BNBC 2020 Part 8 Sec 1.4 / IEC 60364',
      given: [
        { label: 'Total Connected Power (P)', symbol: 'P', value: '100', unit: 'kW', note: 'Continuous 3-Phase Industrial Load' },
        { label: 'Line-to-Line Voltage (VL)', symbol: 'V_L', value: '415', unit: 'V', note: 'Standard LT Supply Voltage' },
        { label: 'Operating Power Factor (cos φ)', symbol: 'cos φ', value: '0.85', unit: 'lagging', note: 'Standard Inductive Power Factor' },
        { label: 'Supply Frequency (f)', symbol: 'f', value: '50', unit: 'Hz', note: 'National Grid Standard' },
      ],
      formula: 'I_L = \\frac{P}{\\sqrt{3} \\times V_L \\times \\cos\\phi}',
      nomenclature: [
        { symbol: 'I_L', meaning: 'Full Load Line Current', unit: 'A' },
        { symbol: 'P', meaning: 'Total Connected Active Power', unit: 'Watts' },
        { symbol: 'V_L', meaning: 'Line-to-Line System Voltage', unit: 'Volts (415V)' },
        { symbol: 'cos φ', meaning: 'Operating Power Factor', unit: 'dimensionless' },
        { symbol: '√3', meaning: 'Three-Phase Geometry Constant', unit: '≈ 1.732' },
      ],
      steps: [
        {
          title: 'Convert Active Power to Base Watts',
          math: 'P = 100 \\text{ kW} = 100 \\times 10^3 = 100,000 \\text{ W}',
          explanation: 'Standard SI unit conversion is required before applying the electrical power formula.',
        },
        {
          title: 'Calculate Three-Phase Denominator Product',
          math: '\\text{Denominator} = \\sqrt{3} \\times 415 \\text{ V} \\times 0.85 = 1.73205 \\times 415 \\times 0.85 = 610.98 \\text{ V}',
          explanation: 'Combines phase constant, nominal line voltage, and displacement power factor.',
        },
        {
          title: 'Solve for Full-Load Operating Current (IL)',
          math: 'I_L = \\frac{100,000}{610.98} = 163.67 \\text{ A}',
          explanation: 'Represents the continuous steady-state current drawn at nominal 415V supply.',
        },
        {
          title: 'Apply Continuous Duty Overcurrent Factor (125% Rule)',
          math: 'I_{\\text{rated}} = I_L \\times 1.25 = 163.67 \\text{ A} \\times 1.25 = 204.59 \\text{ A}',
          explanation: 'BNBC 2020 Part 8 Sec 1.4 mandates continuous loads operating >3 hours to have minimum 125% safety margin.',
        },
      ],
      result: '163.67 A (FLC) → 250 A MCCB',
      resultUnit: 'Rated Breaker',
      resultNote: 'Selected Switchgear: 250 A 3-Pole Adjustable Thermal-Magnetic MCCB (Setting: Ir = 0.85 × 250A = 212.5A) with minimum breaking capacity Icu ≥ 35 kA at 415V.',
      equipmentSpecs: [
        { label: 'Recommended Breaker', value: '250 A 3P MCCB', badge: 'Adjustable Trip' },
        { label: 'Feeder Cable Sizing', value: '4C × 70 mm² Cu/XLPE', badge: '≤ 2.5% VD' },
        { label: 'Protection Rating', value: '35 kA (1s withstand)', badge: 'IEC 60947-2' },
      ],
    },
  },
  {
    label: '1000 kVA Substation Transformer Sizing',
    category: 'SUBSTATION & HV/LV TRANSFORMER',
    desc: 'Calculate HV (11kV) and LV (415V) full-load currents & main LT busbar sizing',
    data: {
      title: '1000 kVA Substation Transformer HV/LV Current & Busbar Sizing',
      category: 'SUBSTATION & HV/LV TRANSFORMER',
      standardRef: 'BNBC 2020 Part 8 / IEC 60076',
      given: [
        { label: 'Transformer Rated Capacity (S)', symbol: 'S', value: '1000', unit: 'kVA', note: 'ONAN Cast Resin / Oil Immersed' },
        { label: 'Primary High Voltage (V_HV)', symbol: 'V_{HV}', value: '11', unit: 'kV', note: '11,000 Volts Delta Connected' },
        { label: 'Secondary Low Voltage (V_LV)', symbol: 'V_{LV}', value: '415', unit: 'V', note: '415 Volts Star Connected (Wye)' },
        { label: 'Transformer Percent Impedance (%Z)', symbol: '%Z', value: '5.75', unit: '%', note: 'IEC 60076 Standard Impedance' },
      ],
      formula: 'I_{LV} = \\frac{S \\times 10^3}{\\sqrt{3} \\times V_{LV}}, \\quad I_{HV} = \\frac{S \\times 10^3}{\\sqrt{3} \\times V_{HV}}',
      nomenclature: [
        { symbol: 'S', meaning: 'Apparent Power Rating', unit: 'kVA' },
        { symbol: 'I_{LV}', meaning: 'Secondary Low Voltage Full Load Current', unit: 'A' },
        { symbol: 'I_{HV}', meaning: 'Primary High Voltage Full Load Current', unit: 'A' },
        { symbol: 'V_{LV}', meaning: 'Nominal Secondary Voltage (415V)', unit: 'V' },
        { symbol: 'V_{HV}', meaning: 'Nominal Primary Voltage (11,000V)', unit: 'V' },
      ],
      steps: [
        {
          title: 'Calculate Secondary (LV 415V) Full Load Current',
          math: 'I_{LV} = \\frac{1000 \\times 1000}{\\sqrt{3} \\times 415} = \\frac{1,000,000}{718.80} = 1391.24 \\text{ A}',
          explanation: 'Rated secondary phase-to-phase current delivered to the main LT panel at full transformer load.',
        },
        {
          title: 'Calculate Primary (HV 11kV) Full Load Current',
          math: 'I_{HV} = \\frac{1000 \\times 1000}{\\sqrt{3} \\times 11,000} = \\frac{1,000,000}{19,052.56} = 52.49 \\text{ A}',
          explanation: 'Nominal primary current drawn from the 11kV grid feeder through the Vacuum Circuit Breaker (VCB).',
        },
        {
          title: 'Main LT Busbar Continuous Rating (125% S.F.)',
          math: 'I_{\\text{busbar}} = 1391.24 \\text{ A} \\times 1.25 = 1739.05 \\text{ A} \\rightarrow \\text{Select } 2000 \\text{ A}',
          explanation: 'Main copper busbar must accommodate transformer short-term overload capacity and thermal derating in 40°C ambient.',
        },
      ],
      result: '1391.24 A (LV) / 52.49 A (HV)',
      resultUnit: 'Full Load Current',
      resultNote: 'Main LT Incomer Switchgear: 2000 A 4-Pole Air Circuit Breaker (ACB) with Microprocessor Trip Unit (LSIG). HT Incomer: 630 A 11kV Vacuum Circuit Breaker (VCB).',
      equipmentSpecs: [
        { label: 'LT Main Incomer', value: '2000 A 4P Drawout ACB', badge: '50 kA / 1s' },
        { label: 'HT Incomer Breaker', value: '630 A 11kV VCB Panel', badge: '25 kA / 3s' },
        { label: 'LT Main Busbar', value: '2 × (100 × 10 mm) Cu', badge: '2000 A Rated' },
      ],
    },
  },
  {
    label: 'Short Circuit Fault Level (Isc & kA)',
    category: 'FAULT ANALYSIS & SHORT CIRCUIT',
    desc: 'Calculate symmetrical prospective short-circuit current (Isc) & MVA at LT busbar',
    data: {
      title: 'Transformer Secondary Symmetrical Fault Level (Isc)',
      category: 'FAULT ANALYSIS & SHORT CIRCUIT',
      standardRef: 'IEC 60909 / BNBC 2020 Part 8',
      given: [
        { label: 'Transformer Rating (S)', symbol: 'S', value: '1000', unit: 'kVA', note: 'Distribution Substation Transformer' },
        { label: 'Secondary Voltage (V_LV)', symbol: 'V_{LV}', value: '415', unit: 'V', note: 'Secondary Low Voltage' },
        { label: 'Percent Impedance (%Z)', symbol: '%Z', value: '5.75', unit: '%', note: 'Nameplate Transformer Impedance' },
        { label: 'Grid Fault Capacity', symbol: 'S_{grid}', value: 'Infinite Bus', unit: '', note: 'Conservative assumption for maximum fault current' },
      ],
      formula: 'I_{SC} = \\frac{I_{FL}}{\\%Z / 100} = \\frac{S \\times 10^3}{\\sqrt{3} \\times V_{LV} \\times (\\%Z / 100)}',
      nomenclature: [
        { symbol: 'I_{SC}', meaning: 'Prospective Symmetrical Short-Circuit Current', unit: 'kA rms' },
        { symbol: 'I_{FL}', meaning: 'Secondary Full Load Current (1391.24 A)', unit: 'A' },
        { symbol: '%Z', meaning: 'Transformer Percent Impedance Voltage', unit: '%' },
        { symbol: 'S_{SC}', meaning: 'Short Circuit Apparent Fault Power', unit: 'MVA' },
      ],
      steps: [
        {
          title: 'Calculate Secondary Full Load Current (IFL)',
          math: 'I_{FL} = \\frac{1,000,000}{\\sqrt{3} \\times 415} = 1391.24 \\text{ A}',
          explanation: 'Base nominal current of the 1000 kVA transformer at 415V.',
        },
        {
          title: 'Calculate Prospective Symmetrical Short Circuit Current (Isc)',
          math: 'I_{SC} = \\frac{1391.24 \\text{ A}}{0.0575} = 24,195.5 \\text{ A} = 24.20 \\text{ kA rms}',
          explanation: 'Maximum prospective symmetrical rms fault current during a bolted 3-phase short circuit at transformer LT terminals.',
        },
        {
          title: 'Calculate Short Circuit Fault MVA',
          math: 'S_{SC} = \\sqrt{3} \\times 415 \\text{ V} \\times 24.20 \\text{ kA} = 17.39 \\text{ MVA}',
          explanation: 'Total short-circuit apparent power delivered by the transformer during an unattenuated fault.',
        },
      ],
      result: '24.20 kA rms (17.39 MVA)',
      resultUnit: 'Fault Level',
      resultNote: 'All downstream LT switchboards, ACBs, MCCBs, and busbar supports must be rated for a minimum breaking capacity (Icu) of 35 kA / 50 kA with 1-second short-time withstand.',
      equipmentSpecs: [
        { label: 'Minimum LT Icu', value: '35 kA (50 kA Recommended)', badge: 'IEC 60947-2' },
        { label: 'Busbar Bracing', value: '50 kA Peak Dynamic Withstand', badge: 'Certified' },
        { label: 'Cable Shield Withstand', value: '24.2 kA for 0.2 sec', badge: 'XLPE Insulated' },
      ],
    },
  },
  {
    label: 'Power Factor Improvement (PFI) Bank Sizing',
    category: 'POWER FACTOR CORRECTION',
    desc: 'Calculate required capacitor bank rating (kVAr) to improve PF from 0.75 to 0.98',
    data: {
      title: 'Automatic Power Factor Improvement (PFI) Bank Sizing',
      category: 'POWER FACTOR CORRECTION',
      standardRef: 'BNBC 2020 Part 8 / IEEE 18',
      given: [
        { label: 'Peak Active Load (P)', symbol: 'P', value: '500', unit: 'kW', note: 'Maximum Operating Demand' },
        { label: 'Existing Power Factor (cos φ1)', symbol: '\\cos\\phi_1', value: '0.75', unit: 'lagging', note: 'Uncompensated Industrial Motors' },
        { label: 'Target Power Factor (cos φ2)', symbol: '\\cos\\phi_2', value: '0.98', unit: 'lagging', note: 'BNBC 2020 & Utility Penalty-Free Target' },
      ],
      formula: 'Q_C = P \\times (\\tan\\phi_1 - \\tan\\phi_2) = P \\times \\left(\\tan(\\arccos(\\cos\\phi_1)) - \\tan(\\arccos(\\cos\\phi_2))\\right)',
      nomenclature: [
        { symbol: 'Q_C', meaning: 'Required Capacitor Bank Reactive Power', unit: 'kVAr' },
        { symbol: 'P', meaning: 'Peak Active Operating Load', unit: 'kW' },
        { symbol: '\\phi_1', meaning: 'Initial Phase Angle (arccos 0.75 = 41.41°)', unit: 'degrees' },
        { symbol: '\\phi_2', meaning: 'Target Phase Angle (arccos 0.98 = 11.48°)', unit: 'degrees' },
      ],
      steps: [
        {
          title: 'Calculate Initial Phase Angle and Tangent',
          math: '\\phi_1 = \\arccos(0.75) = 41.41^\\circ \\implies \\tan(\\phi_1) = 0.8819',
          explanation: 'Initial reactive power multiplier representing existing uncorrected reactive demand.',
        },
        {
          title: 'Calculate Target Phase Angle and Tangent',
          math: '\\phi_2 = \\arccos(0.98) = 11.48^\\circ \\implies \\tan(\\phi_2) = 0.2031',
          explanation: 'Target reactive power multiplier corresponding to high-efficiency 0.98 PF operation.',
        },
        {
          title: 'Calculate Required Reactive Power (Qc)',
          math: 'Q_C = 500 \\text{ kW} \\times (0.8819 - 0.2031) = 500 \\times 0.6788 = 339.40 \\text{ kVAr}',
          explanation: 'Net reactive capacitive power needed to cancel inductive kVAR drawn by factory motors.',
        },
        {
          title: 'Select Standard PFI Bank Step Configuration',
          math: 'Q_{\\text{selected}} = 350 \\text{ kVAr} = (10 \\times 25 \\text{ kVAr}) + (2 \\times 50 \\text{ kVAr})',
          explanation: 'Provides flexible multi-stage automatic switching through a microprocessor-based 12-step PF controller.',
        },
      ],
      result: '350 kVAr (12 Steps)',
      resultUnit: 'Capacitor Bank',
      resultNote: 'Must include 7% Detuned Harmonic Filter Reactors (tuning frequency 189 Hz) to suppress 5th and 7th harmonics and prevent resonance with VFD non-linear loads.',
      equipmentSpecs: [
        { label: 'PFI Bank Capacity', value: '350 kVAr at 440V', badge: 'Heavy Duty' },
        { label: 'Detuned Reactors', value: '7% (189 Hz Tuning)', badge: 'Harmonic Filter' },
        { label: 'Step Switching', value: '12-Step Microprocessor APFC', badge: 'Auto/Manual' },
      ],
    },
  },
  {
    label: 'Cable Sizing & Voltage Drop (%VD)',
    category: 'CABLE SIZING & VOLTAGE DROP',
    desc: 'Verify conductor cross-section and permissible voltage drop % per BNBC 2020',
    data: {
      title: '4C × 70 sq.mm Cu/XLPE Feeder Cable Voltage Drop',
      category: 'CABLE SIZING & VOLTAGE DROP',
      standardRef: 'BNBC 2020 Part 8 Sec 1.6 / IEC 60364-5-52',
      given: [
        { label: 'Design Load Current (I)', symbol: 'I', value: '150', unit: 'A', note: 'Continuous 3-Phase Industrial Feeder' },
        { label: 'One-Way Route Length (L)', symbol: 'L', value: '120', unit: 'm', note: 'Substation to Production DB' },
        { label: 'Conductor Specification', symbol: 'Type', value: '4C × 70 mm² Cu/XLPE/SWA/PVC', unit: '', note: 'Armored Multi-Core Copper Cable' },
        { label: 'AC Resistance at 90°C (R)', symbol: 'R', value: '0.342', unit: 'Ω/km', note: 'Operating Temperature Resistance' },
        { label: 'Reactance at 50Hz (X)', symbol: 'X', value: '0.075', unit: 'Ω/km', note: 'Cable Inductive Reactance' },
        { label: 'Nominal Supply Voltage (VL)', symbol: 'V_L', value: '415', unit: 'V', note: '3-Phase 4-Wire System' },
      ],
      formula: '\\%VD = \\frac{\\sqrt{3} \\times I \\times L \\times (R \\cos\\phi + X \\sin\\phi)}{V_L \\times 1000} \\times 100',
      nomenclature: [
        { symbol: '\\%VD', meaning: 'Percentage Voltage Drop', unit: '%' },
        { symbol: 'I', meaning: 'Design Load Current (150 A)', unit: 'A' },
        { symbol: 'L', meaning: 'One-Way Route Length in Meters (120 m)', unit: 'm' },
        { symbol: 'R', meaning: 'AC Conductor Resistance per Unit Length', unit: 'Ω/km' },
        { symbol: 'X', meaning: 'Conductor Inductive Reactance', unit: 'Ω/km' },
        { symbol: 'V_L', meaning: 'Nominal Line-to-Line Voltage (415 V)', unit: 'V' },
      ],
      steps: [
        {
          title: 'Calculate Effective Combined Impedance (Z)',
          math: 'Z_{\\text{eff}} = (R \\cos\\phi + X \\sin\\phi) = (0.342 \\times 0.85) + (0.075 \\times 0.527) = 0.2907 + 0.0395 = 0.3302 \\text{ } \\Omega/\\text{km}',
          explanation: 'Accounts for both resistive and inductive phase displacement voltage drops across the conductor.',
        },
        {
          title: 'Calculate Total Line-to-Line Voltage Drop (Vdrop)',
          math: 'V_{\\text{drop}} = \\sqrt{3} \\times 150 \\text{ A} \\times \\left(\\frac{120}{1000} \\text{ km}\\right) \\times 0.3302 \\text{ } \\Omega/\\text{km} = 1.732 \\times 150 \\times 0.12 \\times 0.3302 = 10.29 \\text{ V}',
          explanation: 'Absolute voltage drop occurring between the main LT switchboard and the distribution board.',
        },
        {
          title: 'Calculate Percentage Voltage Drop (%VD)',
          math: '\\%VD = \\left(\\frac{10.29 \\text{ V}}{415 \\text{ V}}\\right) \\times 100 = 2.48\\%',
          explanation: 'Meets BNBC 2020 limit (≤ 3.0% for main feeder circuits, ≤ 5.0% total from substation to final sub-circuit).',
        },
      ],
      result: '2.48% (10.29 V Drop)',
      resultUnit: 'Voltage Drop',
      resultNote: 'The selected 4C × 70 mm² Cu/XLPE/SWA cable is fully compliant with BNBC 2020 (<3% feeder limit) and carries 150A continuous current with comfortable thermal margin (cable current capacity = 230A in cable tray).',
      equipmentSpecs: [
        { label: 'Selected Feeder', value: '4C × 70 mm² Cu/XLPE/SWA', badge: 'BNBC Compliant' },
        { label: 'Voltage Drop Margin', value: '2.48% (Max allowable 3.0%)', badge: 'PASS' },
        { label: 'Thermal Derating Capacity', value: '202 A (with 0.88 tray factor)', badge: 'Safe Margin' },
      ],
    },
  },
  {
    label: 'BNBC 2020 Lumen Method Lighting Design',
    category: 'INTERIOR LIGHTING DESIGN',
    desc: 'Calculate total LED luminaires and lux uniformity for industrial/commercial floor',
    data: {
      title: 'Garments Sewing Floor Lighting Design (BNBC 2020)',
      category: 'INTERIOR LIGHTING DESIGN',
      standardRef: 'BNBC 2020 Part 8 Chap 1 / IESNA RP-7',
      given: [
        { label: 'Target Illuminance (E)', symbol: 'E', value: '500', unit: 'Lux (lx)', note: 'BNBC Standard for Garment Sewing & Inspection' },
        { label: 'Room Dimensions (L × W)', symbol: 'L \\times W', value: '30m × 20m (600 m²)', unit: '', note: 'Clear working floor area' },
        { label: 'Working Height / Mounting Height', symbol: 'H_m', value: '2.5', unit: 'm', note: 'Height from working plane (0.8m) to luminaire' },
        { label: 'Selected Luminaire Flux (Φ)', symbol: '\\Phi', value: '4000', unit: 'Lumens (lm)', note: '40W High-Efficiency LED Panel (100 lm/W)' },
        { label: 'Utilization Factor (UF)', symbol: 'UF', value: '0.62', unit: '', note: 'Based on Room Index K=2.4 and 70/50/20 reflectances' },
        { label: 'Maintenance Factor (MF)', symbol: 'MF', value: '0.80', unit: '', note: 'Clean industrial environment with regular cleaning' },
      ],
      formula: 'N = \\frac{E \\times A}{n \\times \\Phi \\times UF \\times MF}',
      nomenclature: [
        { symbol: 'N', meaning: 'Total Number of Luminaires Required', unit: 'fixtures' },
        { symbol: 'E', meaning: 'Required Maintained Illuminance', unit: 'Lux (lm/m²)' },
        { symbol: 'A', meaning: 'Total Working Floor Area (600 m²)', unit: 'm²' },
        { symbol: '\\Phi', meaning: 'Luminous Flux per Luminaire (4000 lm)', unit: 'Lumens' },
        { symbol: 'UF', meaning: 'Utilization Factor (Coefficients of Utilization)', unit: 'dimensionless' },
        { symbol: 'MF', meaning: 'Maintenance Factor (Aging & Dust depreciation)', unit: 'dimensionless' },
      ],
      steps: [
        {
          title: 'Calculate Gross Floor Working Area',
          math: 'A = 30 \\text{ m} \\times 20 \\text{ m} = 600 \\text{ m}^2',
          explanation: 'Total horizontal working plane area requiring uniform 500 Lux illuminance.',
        },
        {
          title: 'Calculate Gross Required Luminous Flux (Φtotal)',
          math: '\\Phi_{\\text{total}} = \\frac{E \\times A}{UF \\times MF} = \\frac{500 \\text{ lx} \\times 600 \\text{ m}^2}{0.62 \\times 0.80} = \\frac{300,000}{0.496} = 604,838.71 \\text{ Lumens}',
          explanation: 'Gross flux emitted by all light sources compensating for ceiling absorption and dust degradation.',
        },
        {
          title: 'Calculate Number of Luminaires (N)',
          math: 'N = \\frac{604,838.71 \\text{ lm}}{4000 \\text{ lm/fixture}} = 151.21 \\rightarrow \\text{Round up to } 152 \\text{ Fixtures}',
          explanation: 'Minimum number of fixtures needed to achieve average maintained illuminance E ≥ 500 Lux.',
        },
        {
          title: 'Determine Grid Layout & Lighting Power Density (LPD)',
          math: '\\text{Grid: } 19 \\text{ Rows} \\times 8 \\text{ Columns} = 152 \\text{ Fixtures}. \\quad \\text{LPD} = \\frac{152 \\times 40 \\text{ W}}{600 \\text{ m}^2} = 10.13 \\text{ W/m}^2',
          explanation: 'Installed LPD is 10.13 W/m², fully compliant with BNBC 2020 maximum allowable limit of 12.0 W/m².',
        },
      ],
      result: '152 Fixtures (19 × 8 Grid)',
      resultUnit: '40W LED Panels',
      resultNote: 'Installed Lighting Power Density: 10.13 W/m² (BNBC allows up to 12.0 W/m²). Fixture spacing-to-height ratio (SHR = 1.25) guarantees uniformity U0 ≥ 0.65 with low glare UGR < 19.',
      equipmentSpecs: [
        { label: 'Total Luminaire Count', value: '152 Units (40W 2x2 LED)', badge: 'BNBC Compliant' },
        { label: 'Lighting Power Density', value: '10.13 W/m² (Max 12 W/m²)', badge: 'PASS' },
        { label: 'Uniformity Ratio (U0)', value: '≥ 0.65 (Even Distribution)', badge: 'Good' },
      ],
    },
  },
]

const DEFAULT_CALC: CalcBlockAttrs = {
  title: 'Three-Phase Load Current & 125% Breaker Sizing',
  category: 'ELECTRICAL POWER DISTRIBUTION',
  standardRef: 'BNBC 2020 Part 8 Sec 1.4 / IEC 60364',
  given: [
    { label: 'Total Connected Power (P)', symbol: 'P', value: '100', unit: 'kW', note: 'Continuous 3-Phase Industrial Load' },
    { label: 'Line-to-Line Voltage (VL)', symbol: 'V_L', value: '415', unit: 'V', note: 'Standard LT Supply Voltage' },
    { label: 'Operating Power Factor (cos φ)', symbol: 'cos φ', value: '0.85', unit: 'lagging', note: 'Standard Inductive Power Factor' },
  ],
  formula: 'I_L = \\frac{P}{\\sqrt{3} \\times V_L \\times \\cos\\phi}',
  nomenclature: [
    { symbol: 'I_L', meaning: 'Full Load Line Current', unit: 'A' },
    { symbol: 'P', meaning: 'Total Connected Active Power', unit: 'Watts' },
    { symbol: 'V_L', meaning: 'Line-to-Line System Voltage', unit: 'Volts (415V)' },
  ],
  steps: [
    {
      title: 'Convert Active Power to Base Watts',
      math: 'P = 100 \\text{ kW} = 100,000 \\text{ W}',
      explanation: 'Convert kilowatts to watts.',
    },
    {
      title: 'Solve for Full-Load Operating Current (IL)',
      math: 'I_L = \\frac{100,000}{\\sqrt{3} \\times 415 \\times 0.85} = 163.67 \\text{ A}',
      explanation: 'Continuous running current.',
    },
  ],
  result: '163.67 A (FLC) → 250 A MCCB',
  resultUnit: 'Rated Breaker',
  resultNote: 'Selected 250A 3P Adjustable MCCB with 35 kA breaking capacity.',
  equipmentSpecs: [
    { label: 'Recommended Breaker', value: '250 A 3P MCCB', badge: 'Adjustable Trip' },
    { label: 'Feeder Cable Sizing', value: '4C × 70 mm² Cu/XLPE', badge: '≤ 2.5% VD' },
  ],
}

export default function CalcModal({ initial, onInsert, onClose }: CalcModalProps) {
  const [attrs, setAttrs] = useState<CalcBlockAttrs>({ ...DEFAULT_CALC, ...initial })
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets')

  const upd = (patch: Partial<CalcBlockAttrs>) => setAttrs(a => ({ ...a, ...patch }))

  // Given helpers
  const updGiven = (i: number, patch: Partial<CalcGivenParam>) =>
    setAttrs(a => {
      const g = [...a.given]
      g[i] = { ...g[i], ...patch }
      return { ...a, given: g }
    })
  const addGiven = () => setAttrs(a => ({ ...a, given: [...a.given, { label: '', symbol: '', value: '', unit: '', note: '' }] }))
  const delGiven = (i: number) => setAttrs(a => ({ ...a, given: a.given.filter((_, j) => j !== i) }))

  // Nomenclature helpers
  const updNomen = (i: number, patch: Partial<CalcNomenclature>) =>
    setAttrs(a => {
      const n = [...(a.nomenclature || [])]
      n[i] = { ...n[i], ...patch }
      return { ...a, nomenclature: n }
    })
  const addNomen = () => setAttrs(a => ({ ...a, nomenclature: [...(a.nomenclature || []), { symbol: '', meaning: '', unit: '' }] }))
  const delNomen = (i: number) => setAttrs(a => ({ ...a, nomenclature: (a.nomenclature || []).filter((_, j) => j !== i) }))

  // Step helpers
  const updStep = (i: number, patch: Partial<CalcStepItem>) =>
    setAttrs(a => {
      const s = [...a.steps]
      const current = typeof s[i] === 'string' ? { math: s[i] as string } : (s[i] as CalcStepItem)
      s[i] = { ...current, ...patch }
      return { ...a, steps: s }
    })
  const addStep = () => setAttrs(a => ({ ...a, steps: [...a.steps, { title: '', math: '', explanation: '' }] }))
  const delStep = (i: number) => setAttrs(a => ({ ...a, steps: a.steps.filter((_, j) => j !== i) }))

  // Equipment helpers
  const updSpec = (i: number, patch: Partial<CalcEquipmentSpec>) =>
    setAttrs(a => {
      const eq = [...(a.equipmentSpecs || [])]
      eq[i] = { ...eq[i], ...patch }
      return { ...a, equipmentSpecs: eq }
    })
  const addSpec = () => setAttrs(a => ({ ...a, equipmentSpecs: [...(a.equipmentSpecs || []), { label: '', value: '', badge: '' }] }))
  const delSpec = (i: number) => setAttrs(a => ({ ...a, equipmentSpecs: (a.equipmentSpecs || []).filter((_, j) => j !== i) }))

  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setAttrs({ ...preset.data })
    setActiveTab('custom')
  }

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(11, 17, 24, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'clamp(8px, 3vh, 20px) 10px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          width: '100%',
          maxWidth: 880,
          maxHeight: 'min(94dvh, 880px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(196,125,14,0.15)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid #1E293B',
            flexShrink: 0,
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            color: '#FFFFFF',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: '#C47D0E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(196,125,14,0.4)',
                flexShrink: 0,
              }}
            >
              <Calculator size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#FFFFFF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Engineering Calculation & Sizing Builder
              </h2>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Pre-engineered electrical formulas, BNBC 2020 sizing & step-by-step derivations
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 6, display: 'flex', borderRadius: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#FAF8F5' }}>
          <button
            onClick={() => setActiveTab('presets')}
            style={{
              flex: 1,
              padding: '11px',
              border: 'none',
              background: activeTab === 'presets' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'presets' ? '#C47D0E' : '#64748B',
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              borderBottom: activeTab === 'presets' ? '2px solid #C47D0E' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Sparkles size={13} /> STANDARD ENGINEERING PRESETS ({PRESETS.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            style={{
              flex: 1,
              padding: '11px',
              border: 'none',
              background: activeTab === 'custom' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'custom' ? '#C47D0E' : '#64748B',
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              borderBottom: activeTab === 'custom' ? '2px solid #C47D0E' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Layers size={13} /> CUSTOMIZE CALCULATION & SIZING
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#FFFFFF' }}>
          {activeTab === 'presets' ? (
            <div>
              <div style={{ marginBottom: 14, fontSize: 13, color: '#64748B', fontFamily: 'Outfit,sans-serif' }}>
                Select an industry-standard electrical calculation to customize with parameters, step-by-step arithmetic, and code compliance:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 12 }}>
                {PRESETS.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectPreset(p)}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '16px',
                      background: '#FAF8F5',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'
                      ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(196,125,14,0.12)'
                      ;(e.currentTarget as HTMLElement).style.background = '#FEF9EC'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'
                      ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                      ;(e.currentTarget as HTMLElement).style.background = '#FAF8F5'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8.5, letterSpacing: '0.15em', background: '#FEF3C7', color: '#92400E', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>
                        {p.category}
                      </span>
                      <ChevronRight size={16} color="#C47D0E" />
                    </div>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#0F172A', marginBottom: 4 }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.4, marginBottom: 10 }}>
                      {p.desc}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#92400E', fontFamily: 'JetBrains Mono,monospace', background: 'rgba(255,255,255,0.7)', padding: '4px 8px', borderRadius: 4, border: '1px solid #F5E6C8' }}>
                      <strong>Result:</strong> {p.data.result} {p.data.resultUnit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Category & Standard Ref */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700, marginBottom: 4 }}>
                    ENGINEERING CATEGORY
                  </label>
                  <input
                    type="text"
                    value={attrs.category || ''}
                    onChange={e => upd({ category: e.target.value })}
                    placeholder="e.g. ELECTRICAL POWER DISTRIBUTION"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700, marginBottom: 4 }}>
                    STANDARD / CODE REFERENCE
                  </label>
                  <input
                    type="text"
                    value={attrs.standardRef || ''}
                    onChange={e => upd({ standardRef: e.target.value })}
                    placeholder="e.g. BNBC 2020 Part 8 Sec 1.4 / IEC 60364"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700, marginBottom: 4 }}>
                  CALCULATION TITLE
                </label>
                <input
                  type="text"
                  value={attrs.title}
                  onChange={e => upd({ title: e.target.value })}
                  placeholder="e.g. Three-Phase Load Current Calculation (IL)"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 14, fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>

              {/* Formula & Nomenclature */}
              <div>
                <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700, marginBottom: 4 }}>
                  GOVERNING FORMULA (LATEX FORMAT)
                </label>
                <input
                  type="text"
                  value={attrs.formula}
                  onChange={e => upd({ formula: e.target.value })}
                  placeholder="e.g. I_L = \frac{P}{\sqrt{3} \times V_L \times \cos\phi}"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: '#C47D0E', background: '#0F172A', boxSizing: 'border-box' }}
                />
              </div>

              {/* Given Parameters */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700 }}>
                    1. GIVEN PARAMETERS ({attrs.given.length})
                  </label>
                  <button
                    onClick={addGiven}
                    style={{ background: '#FAF8F5', border: '1px solid #CBD5E1', color: '#C47D0E', padding: '3px 9px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Plus size={12} /> Add Parameter
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {attrs.given.map((g, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 6, alignItems: 'center', background: '#FAF8F5', padding: '6px 10px', borderRadius: 6, border: '1px solid #F1F5F9' }}>
                      <input
                        type="text"
                        placeholder="Label (e.g. Active Power)"
                        value={g.label}
                        onChange={e => updGiven(i, { label: e.target.value })}
                        style={{ padding: '6px 8px', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 12 }}
                      />
                      <input
                        type="text"
                        placeholder="Symbol (e.g. P)"
                        value={g.symbol || ''}
                        onChange={e => updGiven(i, { symbol: e.target.value })}
                        style={{ padding: '6px 8px', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 12, fontFamily: 'JetBrains Mono,monospace' }}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 100)"
                        value={g.value}
                        onChange={e => updGiven(i, { value: e.target.value })}
                        style={{ padding: '6px 8px', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 12, fontWeight: 600 }}
                      />
                      <input
                        type="text"
                        placeholder="Unit (e.g. kW)"
                        value={g.unit || ''}
                        onChange={e => updGiven(i, { unit: e.target.value })}
                        style={{ padding: '6px 8px', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 12 }}
                      />
                      <button
                        onClick={() => delGiven(i)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nomenclature */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700 }}>
                    VARIABLE NOMENCLATURE KEY ({attrs.nomenclature?.length || 0})
                  </label>
                  <button
                    onClick={addNomen}
                    style={{ background: '#FAF8F5', border: '1px solid #CBD5E1', color: '#C47D0E', padding: '3px 9px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Plus size={12} /> Add Variable
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(attrs.nomenclature || []).map((n, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 3fr 1fr auto', gap: 6, alignItems: 'center', background: '#FAF8F5', padding: '6px 10px', borderRadius: 6, border: '1px solid #F1F5F9' }}>
                      <input
                        type="text"
                        placeholder="Symbol (e.g. IL)"
                        value={n.symbol}
                        onChange={e => updNomen(i, { symbol: e.target.value })}
                        style={{ padding: '6px 8px', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 12, fontFamily: 'JetBrains Mono,monospace' }}
                      />
                      <input
                        type="text"
                        placeholder="Meaning (e.g. Full Load Current)"
                        value={n.meaning}
                        onChange={e => updNomen(i, { meaning: e.target.value })}
                        style={{ padding: '6px 8px', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 12 }}
                      />
                      <input
                        type="text"
                        placeholder="Unit (e.g. A)"
                        value={n.unit || ''}
                        onChange={e => updNomen(i, { unit: e.target.value })}
                        style={{ padding: '6px 8px', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 12 }}
                      />
                      <button
                        onClick={() => delNomen(i)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Derivation */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700 }}>
                    2. STEP-BY-STEP DERIVATION ({attrs.steps.length})
                  </label>
                  <button
                    onClick={addStep}
                    style={{ background: '#FAF8F5', border: '1px solid #CBD5E1', color: '#C47D0E', padding: '3px 9px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Plus size={12} /> Add Step
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {attrs.steps.map((s, i) => {
                    const stepObj = typeof s === 'string' ? { math: s, title: '', explanation: '' } : s
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, background: '#FAF8F5', padding: '10px 12px', borderRadius: 8, border: '1px solid #F1F5F9', borderLeft: '3px solid #C47D0E' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: '#C47D0E', fontWeight: 700 }}>
                            STEP {i + 1}
                          </span>
                          <button
                            onClick={() => delStep(i)}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 2 }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Step Title (e.g. Convert Power to Base Watts)"
                          value={stepObj.title || ''}
                          onChange={e => updStep(i, { title: e.target.value })}
                          style={{ padding: '6px 8px', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 12, fontWeight: 600 }}
                        />
                        <input
                          type="text"
                          placeholder="Math Calculation / Equation (e.g. P = 100 kW = 100,000 W)"
                          value={stepObj.math || ''}
                          onChange={e => updStep(i, { math: e.target.value })}
                          style={{ padding: '6px 8px', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 12, fontFamily: 'JetBrains Mono,monospace' }}
                        />
                        <input
                          type="text"
                          placeholder="Engineering Rationale / Note (Optional)"
                          value={stepObj.explanation || ''}
                          onChange={e => updStep(i, { explanation: e.target.value })}
                          style={{ padding: '5px 8px', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 11.5, color: '#64748B' }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Result & Recommendation */}
              <div style={{ background: '#FEF9EC', border: '1px solid #F5E6C8', borderRadius: 8, padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#92400E', fontWeight: 700, marginBottom: 4 }}>
                      FINAL COMPUTED RESULT VALUE
                    </label>
                    <input
                      type="text"
                      value={attrs.result}
                      onChange={e => upd({ result: e.target.value })}
                      placeholder="e.g. 163.67"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: '#92400E', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#92400E', fontWeight: 700, marginBottom: 4 }}>
                      PRIMARY UNIT
                    </label>
                    <input
                      type="text"
                      value={attrs.resultUnit}
                      onChange={e => upd({ resultUnit: e.target.value })}
                      placeholder="e.g. A (LV) / 250A Breaker"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#92400E', fontWeight: 700, marginBottom: 4 }}>
                    ENGINEERING DECISION / SELECTION NOTE
                  </label>
                  <textarea
                    rows={2}
                    value={attrs.resultNote}
                    onChange={e => upd({ resultNote: e.target.value })}
                    placeholder="e.g. Selected 250 A 3-Pole Adjustable MCCB with minimum breaking capacity 35 kA."
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderTop: '1px solid #E2E8F0',
            background: '#FAF8F5',
            flexShrink: 0,
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 12, color: '#64748B', fontFamily: 'JetBrains Mono, monospace' }}>
            {attrs.steps.length} derivation steps • {attrs.given.length} parameters
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #CBD5E1',
                borderRadius: 6,
                background: '#FFFFFF',
                cursor: 'pointer',
                fontFamily: 'Outfit,sans-serif',
                fontSize: 13,
                fontWeight: 600,
                color: '#475569',
                minHeight: 38,
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onInsert(attrs)
                onClose()
              }}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: 6,
                background: '#C47D0E',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontFamily: 'Outfit,sans-serif',
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(196,125,14,0.35)',
                minHeight: 38,
              }}
            >
              <Check size={16} /> Insert Engineering Calculation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
