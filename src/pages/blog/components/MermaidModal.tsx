import { useState, useRef, useEffect } from 'react'
import { X, GitGraph, Sparkles, Check, ChevronRight, Eye, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import type { MermaidBlockAttrs, MermaidLegendItem, MermaidPowerFlowStep } from '../extensions/MermaidBlock'

interface MermaidModalProps {
  initial?: Partial<MermaidBlockAttrs>
  onInsert: (attrs: MermaidBlockAttrs) => void
  onClose: () => void
}

const ELECTRICAL_TEMPLATES: {
  label: string
  desc: string
  category: string
  voltageTier: string
  standardRef: string
  figNum: string
  caption: string
  code: string
  legend: MermaidLegendItem[]
  steps: MermaidPowerFlowStep[]
}[] = [
  {
    label: 'Substation Single Line Diagram (33kV/11kV/415V)',
    desc: 'Complete industrial power substation single-line diagram from grid incoming to LT switchgear',
    category: 'SUBSTATION POWER DISTRIBUTION',
    voltageTier: '33kV HT / 11kV MT / 0.415kV LT',
    standardRef: 'BNBC 2020 Part 8 / IEC 60076 / IEEE 141',
    figNum: 'Fig. 1',
    caption: '33kV / 11kV / 0.415kV Industrial Substation Single Line Diagram (SLD)',
    code: `graph TD
    classDef grid fill:#FEE2E2,stroke:#DC2626,stroke-width:2px,color:#991B1B;
    classDef tx fill:#FEF3C7,stroke:#C47D0E,stroke-width:2px,color:#92400E;
    classDef sw fill:#E0E7FF,stroke:#4338CA,stroke-width:2px,color:#3730A3;
    classDef load fill:#DCFCE7,stroke:#16A34A,stroke-width:2px,color:#166534;

    Grid([33kV National Grid Incomer]):::grid --> LA[33kV Lightning Arrester]
    LA --> ISO1[33kV Gang Isolator & Earth Switch]
    ISO1 --> VCB33[33kV Vacuum Circuit Breaker - VCB]
    VCB33 --> PT[Power Transformer 33kV/11kV 5MVA]:::tx
    PT --> VCB11[11kV Incomer VCB Switchgear]:::sw
    VCB11 --> Bus11((11kV Main Busbar)):::sw
    
    Bus11 --> DT1[Dist. Transformer 11kV/0.415kV 1000kVA]:::tx
    Bus11 --> DT2[Dist. Transformer 11kV/0.415kV 1000kVA]:::tx
    
    DT1 --> ACB1[2000A LT Main ACB]:::sw
    DT2 --> ACB2[2000A LT Main ACB]:::sw
    
    ACB1 --> BusLT((415V Main LT Switchboard)):::sw
    ACB2 --> BusLT
    
    BusLT --> PFI[350 kVAr Automatic PFI Bank]:::load
    BusLT --> MDB1[MDB 1 - Production Plant]:::load
    BusLT --> MDB2[MDB 2 - HVAC & Utility]:::load`,
    legend: [
      { symbol: 'VCB', label: 'Vacuum Circuit Breaker', desc: '11kV/33kV Medium Voltage switching with arc interruption in vacuum chamber', color: '#4338CA' },
      { symbol: 'ACB', label: 'Air Circuit Breaker', desc: '415V Low Voltage drawout main incomer breaker with LSIG protection trip unit', color: '#4338CA' },
      { symbol: 'LA', label: 'Lightning Arrester', desc: 'Heavy-duty Metal Oxide Surge Arrester for transient surge diversion to ground', color: '#DC2626' },
      { symbol: 'PT / DT', label: 'Power & Distribution Transformers', desc: 'Step-down voltage conversion (33kV/11kV and 11kV/415V Star-Delta configuration)', color: '#C47D0E' },
      { symbol: 'PFI', label: 'Power Factor Improvement Bank', desc: '350 kVAr multi-step capacitor bank maintaining power factor cos φ ≥ 0.98', color: '#16A34A' },
      { symbol: 'MDB', label: 'Main Distribution Board', desc: 'Downstream feeder distribution panel supplying floor sub-distribution boards', color: '#16A34A' },
    ],
    steps: [
      { stepNum: 1, title: '33kV Grid Transmission Incomer', desc: 'Power arrives via 33kV double-circuit overhead line, protected by Surge Arresters and Gang Isolators.' },
      { stepNum: 2, title: 'Primary Step-Down Transformation (33kV to 11kV)', desc: '5MVA Power Transformer steps down transmission voltage to 11kV distribution level.' },
      { stepNum: 3, title: '11kV Vacuum Circuit Breaker (VCB) Switchboard', desc: 'Distributes 11kV power through microprocessor-controlled overcurrent & earth fault relays.' },
      { stepNum: 4, title: 'Secondary Step-Down (11kV to 415V Low Voltage)', desc: 'Dual 1000 kVA Delta-Star distribution transformers step down to 3-phase 415V / 230V.' },
      { stepNum: 5, title: 'Main LT Air Circuit Breakers (ACB) & Busbar', desc: '2000A Drawout ACBs feed the main 415V busbar with bus-coupler interlock logic.' },
      { stepNum: 6, title: 'Automatic Power Factor Correction & Plant Feeders', desc: '350 kVAr detuned PFI bank maintains PF > 0.98 while MDBs supply production loads.' },
    ],
  },
  {
    label: 'ATS & Generator Backup Architecture',
    desc: 'Dual-source utility vs diesel generator automatic transfer switch with mechanical interlock',
    category: 'EMERGENCY POWER & ATS CONTROL',
    voltageTier: '415V 3-Phase 50Hz',
    standardRef: 'BNBC 2020 Part 8 / NFPA 110',
    figNum: 'Fig. 2',
    caption: 'Automatic Transfer Switch (ATS) & Generator Backup Architecture',
    code: `graph TD
    classDef mains fill:#FEE2E2,stroke:#DC2626,stroke-width:2px,color:#991B1B;
    classDef gen fill:#FEF3C7,stroke:#C47D0E,stroke-width:2px,color:#92400E;
    classDef ats fill:#E0E7FF,stroke:#4338CA,stroke-width:2px,color:#3730A3;
    classDef loads fill:#DCFCE7,stroke:#16A34A,stroke-width:2px,color:#166534;

    Mains[Grid Utility Power 415V 3-Phase]:::mains --> Incomer1[Mains Incomer ACB/MCCB]
    DG[500 kVA Standby Diesel Generator]:::gen --> Incomer2[Generator Incomer ACB/MCCB]
    
    Incomer1 --> ATS{ATS Controller & Mechanical Interlock}:::ats
    Incomer2 --> ATS
    
    ATS -- Normal Mode: Grid Active --> EssentialBus((Essential Plant Busbar 415V)):::ats
    ATS -- Emergency Mode: Mains Fail --> AutoStart[Auto Start Signal to DG 10s Delay]
    AutoStart -.-> DG
    
    EssentialBus --> FirePump[Fire Fighting & Hydrant Pumps]:::loads
    EssentialBus --> Lighting[Emergency & Exit Lighting]:::loads
    EssentialBus --> Server[Data Center & PLC Automation UPS]:::loads
    EssentialBus --> CriticalMachines[Critical Production Lines]:::loads`,
    legend: [
      { symbol: 'ATS', label: 'Automatic Transfer Switch', desc: '4-Pole motorized switch with electrical and mechanical interlock preventing backfeed', color: '#4338CA' },
      { symbol: 'DG', label: 'Diesel Generator', desc: '500 kVA emergency prime power generator with auto-cranking and electronic governor', color: '#C47D0E' },
      { symbol: 'Interlock', label: 'Mechanical Interlock', desc: 'Physical bar ensuring Mains and Generator breakers can NEVER close simultaneously', color: '#DC2626' },
      { symbol: 'Essential Bus', label: 'Emergency Power Busbar', desc: 'Dedicated 415V busbar serving life safety, fire protection, and critical servers', color: '#16A34A' },
    ],
    steps: [
      { stepNum: 1, title: 'Normal Operation (Mains Utility Healthy)', desc: 'ATS is locked to Mains Incomer; 500 kVA Generator remains in standby standby mode.' },
      { stepNum: 2, title: 'Mains Failure & Under-Voltage Detection', desc: 'ATS controller senses voltage drop below 80% on any phase for > 3 seconds.' },
      { stepNum: 3, title: 'Auto Start Signal to Generator', desc: 'Dry contact initiates engine cranking; DG achieves rated voltage and 50Hz frequency in 8-10 seconds.' },
      { stepNum: 4, title: 'Load Transfer to Generator Source', desc: 'Mains breaker opens with confirmed air gap, then Generator breaker closes onto Essential Bus.' },
      { stepNum: 5, title: 'Mains Restoration & Cool-Down Sequence', desc: 'Upon grid return for > 60s, ATS switches back to Grid and runs DG in cool-down for 5 minutes.' },
    ],
  },
  {
    label: 'On-Grid Rooftop Solar PV & Net Metering',
    desc: 'Grid-tied rooftop solar array with string inverter, DC combiner & bi-directional metering',
    category: 'RENEWABLE ENERGY & SOLAR PV',
    voltageTier: '1000V DC / 415V AC',
    standardRef: 'SREDA / Net Metering Guidelines 2018 / IEC 62446',
    figNum: 'Fig. 3',
    caption: '100 kWp Grid-Tied Rooftop Solar PV & Net-Metering Configuration',
    code: `graph LR
    classDef solar fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E;
    classDef inv fill:#DCFCE7,stroke:#16A34A,stroke-width:2px,color:#166534;
    classDef grid fill:#E0E7FF,stroke:#2563EB,stroke-width:2px,color:#1E40AF;

    PV1[Rooftop PV Strings Array 1 - 50 kWp]:::solar --> DCB1[DC Combiner Box & SPD]
    PV2[Rooftop PV Strings Array 2 - 50 kWp]:::solar --> DCB2[DC Combiner Box & SPD]
    
    DCB1 --> Inv[100 kW Solar On-Grid Inverter - MPPT]:::inv
    DCB2 --> Inv
    
    Inv --> ACCB[AC Combiner & 200A MCCB with Surge Protection]:::inv
    ACCB --> LTPanel[Factory Main LT Panel 415V]
    
    LTPanel --> PlantLoad[Self-Consumed Factory Load]
    LTPanel --> NetMeter((Bi-Directional Net-Energy Meter)):::grid
    NetMeter <--> UtilityGrid[National Grid DESCO/BREB 11kV/415V]:::grid`,
    legend: [
      { symbol: 'PV Array', label: 'Photovoltaic Solar Modules', desc: 'Tier-1 Mono-PERC solar panels connected in series strings generating up to 1000V DC', color: '#D97706' },
      { symbol: 'MPPT Inv', label: 'Grid-Tie Solar Inverter', desc: 'High-efficiency Maximum Power Point Tracking (MPPT) inverter converting DC to 415V AC', color: '#16A34A' },
      { symbol: 'DCB / SPD', label: 'DC Combiner & Surge Protection', desc: 'Houses 1000V DC fuses, isolators, and Type II surge arresters for lightning protection', color: '#D97706' },
      { symbol: 'Net-Meter', label: 'Bi-Directional Energy Meter', desc: 'Four-quadrant smart meter recording import and export kWh for utility billing credits', color: '#2563EB' },
    ],
    steps: [
      { stepNum: 1, title: 'Solar DC Generation on Rooftop', desc: 'Solar modules convert sunlight into high-voltage direct current (DC) power.' },
      { stepNum: 2, title: 'DC Collection & Surge Suppression', desc: 'DC combiner box groups string cables with fast-acting 1000V DC gPV fuses and SPDs.' },
      { stepNum: 3, title: 'MPPT DC to 3-Phase AC Inversion', desc: '100 kW On-grid inverter synchronizes AC output with grid frequency (50 Hz) and voltage (415V).' },
      { stepNum: 4, title: 'Self-Consumption by Factory Loads', desc: 'Solar power is consumed directly by factory machinery, reducing utility grid draw.' },
      { stepNum: 5, title: 'Surplus Export via Net-Metering', desc: 'Any excess solar generation is exported to the national grid and credited to monthly electric bills.' },
    ],
  },
  {
    label: 'Star-Delta Motor Starter Power Circuit',
    desc: 'Industrial 3-phase induction motor Star-Delta reduced voltage starter schematic',
    category: 'INDUSTRIAL MOTOR CONTROL',
    voltageTier: '415V 3-Phase 50Hz',
    standardRef: 'IEC 60947-4-1 / BNBC 2020',
    figNum: 'Fig. 4',
    caption: 'Star-Delta Reduced Voltage Starter Power Circuit Schematic',
    code: `graph TD
    classDef source fill:#F1F5F9,stroke:#475569,stroke-width:2px,color:#0F172A;
    classDef contactor fill:#FEF3C7,stroke:#C47D0E,stroke-width:2px,color:#92400E;
    classDef motor fill:#DCFCE7,stroke:#16A34A,stroke-width:2px,color:#166534;

    Supply[3-Phase 415V Supply L1 L2 L3]:::source --> MCCB[Molded Case Circuit Breaker - MCCB]
    MCCB --> KM1[Main Contactor KM1]:::contactor
    KM1 --> OLR[Bimetallic Thermal Overload Relay]
    
    OLR --> Motor([3-Phase Motor U1 V1 W1]):::motor
    Motor --> MotorTerminals([Motor Output Terminals U2 V2 W2]):::motor
    
    MotorTerminals --> KM3[Delta Contactor KM3 - Full Speed Run]:::contactor
    MotorTerminals --> KM2[Star Contactor KM2 - Star Point Start]:::contactor
    
    KM2 -.-> StarShort[Shorting Bar: 33% Voltage & 33% Starting Current]`,
    legend: [
      { symbol: 'KM1', label: 'Main Power Contactor', desc: 'Closes during both Start and Run modes to feed motor winding inputs U1, V1, W1', color: '#C47D0E' },
      { symbol: 'KM2', label: 'Star Contactor', desc: 'Shorts terminals U2, V2, W2 together to form a Star point, reducing phase voltage to 58%', color: '#C47D0E' },
      { symbol: 'KM3', label: 'Delta Contactor', desc: 'Connects motor in full Delta configuration (U1-W2, V1-U2, W1-V2) for full rated speed and torque', color: '#C47D0E' },
      { symbol: 'OLR', label: 'Thermal Overload Relay', desc: 'Monitors current in phase winding (set at 0.58 × Full Load Current) for motor thermal protection', color: '#DC2626' },
    ],
    steps: [
      { stepNum: 1, title: 'Starting Sequence (Star Mode)', desc: 'Contactor KM1 and KM2 close simultaneously; motor starts in Star point configuration.' },
      { stepNum: 2, title: 'Inrush Current Reduction (33% of DOL)', desc: 'Winding voltage is reduced to 415V / √3 = 240V; starting current drops from 6x to 2x FLC.' },
      { stepNum: 3, title: 'Timer Delay Transition (5 to 10 Seconds)', desc: 'As motor reaches 85% of synchronous speed, electronic timer drops KM2 with 50ms dwell time.' },
      { stepNum: 4, title: 'Full Speed Run (Delta Mode)', desc: 'Delta contactor KM3 closes, applying full 415V line voltage across each winding for continuous operation.' },
    ],
  },
  {
    label: 'Building Power Distribution Tree (BBT Rising Main)',
    desc: 'Complete power distribution hierarchy from substation to final circuits via busbar trunking',
    category: 'BUILDING RISING MAIN & BBT',
    voltageTier: '415V / 230V 50Hz',
    standardRef: 'BNBC 2020 Part 8 / IEC 61439-6',
    figNum: 'Fig. 5',
    caption: 'Multi-Story Commercial Building Power Distribution Tree',
    code: `graph TD
    classDef sub fill:#FEF3C7,stroke:#C47D0E,stroke-width:2px,color:#92400E;
    classDef mdb fill:#E0E7FF,stroke:#4338CA,stroke-width:2px,color:#3730A3;
    classDef floor fill:#DCFCE7,stroke:#16A34A,stroke-width:2px,color:#166534;

    Substation[Substation Transformer 11kV/415V]:::sub --> MDB[Main Distribution Board - MDB]:::mdb
    
    MDB --> BBT[Busbar Trunking System - 1000A Rising Main]:::mdb
    MDB --> PFI[PFI Capacitor Bank]:::sub
    MDB --> HVAC[Central Chiller / HVAC DB]:::mdb
    
    BBT --> SDB1[Floor 1 Sub-Distribution Board]:::floor
    BBT --> SDB2[Floor 2 Sub-Distribution Board]:::floor
    BBT --> SDB3[Floor 3 Sub-Distribution Board]:::floor
    
    SDB1 --> LDB1[Lighting DB]
    SDB1 --> PDB1[Raw Power Sockets DB]
    SDB1 --> UPS1[Dedicated Server UPS DB]`,
    legend: [
      { symbol: 'BBT', label: 'Busbar Trunking System', desc: 'Enclosed copper sandwich rising main with compact fire-rated casing feeding each floor', color: '#4338CA' },
      { symbol: 'MDB', label: 'Main Distribution Board', desc: 'Central low voltage switchboard located in ground floor substation room', color: '#4338CA' },
      { symbol: 'SDB', label: 'Sub-Distribution Board', desc: 'Floor-level electrical panel receiving power via BBT tap-off box with local MCCB', color: '#16A34A' },
      { symbol: 'LDB / PDB', label: 'Lighting & Power DBs', desc: 'Final sub-circuit panels with MCBs & RCBOs supplying individual room lights and sockets', color: '#16A34A' },
    ],
    steps: [
      { stepNum: 1, title: 'Substation Transformation & Main Distribution', desc: '415V power is fed from the transformer into the Main Distribution Board (MDB).' },
      { stepNum: 2, title: 'Rising Main Busbar Trunking (BBT)', desc: '1000A Sandwich copper BBT carries power vertically through dedicated electrical shafts.' },
      { stepNum: 3, title: 'Floor Tap-Off Isolation Units', desc: 'Plug-in tap-off boxes on each floor extract power through dedicated MCCB isolators.' },
      { stepNum: 4, title: 'Floor Sub-Distribution & Final Circuiting', desc: 'Floor SDB distributes power to Lighting DB, Raw Power DB, and Clean UPS DB.' },
    ],
  },
]

export default function MermaidModal({ initial, onInsert, onClose }: MermaidModalProps) {
  const [activeTemplate, setActiveTemplate] = useState(ELECTRICAL_TEMPLATES[0])
  const [code, setCode] = useState(initial?.code || ELECTRICAL_TEMPLATES[0].code)
  const [caption, setCaption] = useState(initial?.caption || ELECTRICAL_TEMPLATES[0].caption)
  const [figNum, setFigNum] = useState(initial?.figNum || ELECTRICAL_TEMPLATES[0].figNum)
  const [category, setCategory] = useState(initial?.category || ELECTRICAL_TEMPLATES[0].category)
  const [voltageTier, setVoltageTier] = useState(initial?.voltageTier || ELECTRICAL_TEMPLATES[0].voltageTier)
  const [standardRef, setStandardRef] = useState(initial?.standardRef || ELECTRICAL_TEMPLATES[0].standardRef)
  const [legend, setLegend] = useState<MermaidLegendItem[]>(initial?.legend || ELECTRICAL_TEMPLATES[0].legend)
  const [steps, setSteps] = useState<MermaidPowerFlowStep[]>(initial?.steps || ELECTRICAL_TEMPLATES[0].steps)

  const [activeTab, setActiveTab] = useState<'presets' | 'editor' | 'preview'>('presets')
  const [zoomLevel, setZoomLevel] = useState(100)
  const previewRef = useRef<HTMLDivElement>(null)

  const renderDiagram = () => {
    const w = window as any
    const el = previewRef.current
    if (!el) return
    if (w.mermaid && code.trim()) {
      el.innerHTML =
        '<div style="color:#94A3B8;font-size:12px;font-family:Outfit,sans-serif;padding:24px;text-align:center">Rendering electrical diagram…</div>'
      const id = 'mermaid-modal-' + Math.random().toString(36).slice(2)
      w.mermaid
        .render(id, code)
        .then(({ svg }: { svg: string }) => {
          if (el) {
            el.innerHTML = svg
            const svgEl = el.querySelector('svg')
            if (svgEl) {
              svgEl.style.maxWidth = '100%'
              svgEl.style.height = 'auto'
              svgEl.style.transition = 'transform 0.2s ease'
              svgEl.style.transform = `scale(${zoomLevel / 100})`
              svgEl.style.transformOrigin = 'center center'
            }
          }
        })
        .catch((err: any) => {
          if (el) {
            el.innerHTML = `<div style="color:#EF4444;font-size:11px;font-family:JetBrains Mono,monospace;white-space:pre-wrap;padding:12px">Syntax notice: ${String(err).slice(0, 160)}</div>`
          }
        })
    }
  }

  // Load Mermaid script
  useEffect(() => {
    const w = window as any
    if (!w.mermaid) {
      const s = document.createElement('script')
      s.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
      s.onload = () => {
        w.mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
          fontFamily: 'Outfit, sans-serif',
        })
        renderDiagram()
      }
      document.head.appendChild(s)
    } else {
      renderDiagram()
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => renderDiagram(), 300)
    return () => clearTimeout(t)
  }, [code, zoomLevel, activeTab])

  const handleSelectTemplate = (tpl: typeof ELECTRICAL_TEMPLATES[0]) => {
    setActiveTemplate(tpl)
    setCode(tpl.code)
    setCaption(tpl.caption)
    setFigNum(tpl.figNum)
    setCategory(tpl.category)
    setVoltageTier(tpl.voltageTier)
    setStandardRef(tpl.standardRef)
    setLegend(tpl.legend)
    setSteps(tpl.steps)
    setActiveTab('editor')
  }

  const handleInsert = () => {
    onInsert({
      code,
      caption,
      figNum,
      category,
      voltageTier,
      standardRef,
      legend,
      steps,
    })
    onClose()
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
          maxWidth: 920,
          maxHeight: 'min(94dvh, 880px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(5,150,105,0.2)',
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
                background: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(5,150,105,0.4)',
                flexShrink: 0,
              }}
            >
              <GitGraph size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#FFFFFF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Electrical Diagram & Schematic Builder
              </h2>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Single Line Diagrams (SLD), ATS generator control, solar PV & power distribution schematics
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
              color: activeTab === 'presets' ? '#059669' : '#64748B',
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              borderBottom: activeTab === 'presets' ? '2px solid #059669' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Sparkles size={13} /> STANDARD ELECTRICAL DIAGRAMS ({ELECTRICAL_TEMPLATES.length})
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            style={{
              flex: 1,
              padding: '11px',
              border: 'none',
              background: activeTab === 'editor' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'editor' ? '#059669' : '#64748B',
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              borderBottom: activeTab === 'editor' ? '2px solid #059669' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Layers size={13} /> CUSTOMIZE CODE & SCHEMATIC
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            style={{
              flex: 1,
              padding: '11px',
              border: 'none',
              background: activeTab === 'preview' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'preview' ? '#059669' : '#64748B',
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              borderBottom: activeTab === 'preview' ? '2px solid #059669' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Eye size={13} /> INTERACTIVE PREVIEW & ZOOM
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#FFFFFF' }}>
          {activeTab === 'presets' && (
            <div>
              <div style={{ marginBottom: 14, fontSize: 13, color: '#64748B', fontFamily: 'Outfit,sans-serif' }}>
                Choose a standard electrical engineering diagram to load with voltage color-coding, symbols legend, and power flow sequence:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 14 }}>
                {ELECTRICAL_TEMPLATES.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectTemplate(t)}
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
                      ;(e.currentTarget as HTMLElement).style.borderColor = '#059669'
                      ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(5,150,105,0.12)'
                      ;(e.currentTarget as HTMLElement).style.background = '#F0FDF4'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'
                      ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                      ;(e.currentTarget as HTMLElement).style.background = '#FAF8F5'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8.5, letterSpacing: '0.15em', background: '#DCFCE7', color: '#166534', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>
                        {t.category}
                      </span>
                      <ChevronRight size={16} color="#059669" />
                    </div>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#0F172A', marginBottom: 4 }}>
                      {t.label}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.4, marginBottom: 10 }}>
                      {t.desc}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 10.5, fontFamily: 'JetBrains Mono,monospace', color: '#475569' }}>
                      <span style={{ background: '#FFFFFF', padding: '2px 6px', borderRadius: 3, border: '1px solid #E2E8F0' }}>⚡ {t.voltageTier}</span>
                      <span style={{ background: '#FFFFFF', padding: '2px 6px', borderRadius: 3, border: '1px solid #E2E8F0' }}>📜 {t.standardRef}</span>
                      <span style={{ background: '#FFFFFF', padding: '2px 6px', borderRadius: 3, border: '1px solid #E2E8F0' }}>🔑 {t.legend.length} Symbols</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Category, Voltage & Standard */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700, marginBottom: 4 }}>
                    DIAGRAM CATEGORY
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. SUBSTATION POWER DISTRIBUTION"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700, marginBottom: 4 }}>
                    VOLTAGE TIER
                  </label>
                  <input
                    type="text"
                    value={voltageTier}
                    onChange={e => setVoltageTier(e.target.value)}
                    placeholder="e.g. 33kV / 11kV / 0.415kV"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700, marginBottom: 4 }}>
                    STANDARD REFERENCE
                  </label>
                  <input
                    type="text"
                    value={standardRef}
                    onChange={e => setStandardRef(e.target.value)}
                    placeholder="e.g. BNBC 2020 Part 8 / IEC 60076"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Fig Num & Caption */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700, marginBottom: 4 }}>
                    FIGURE ID
                  </label>
                  <input
                    type="text"
                    value={figNum}
                    onChange={e => setFigNum(e.target.value)}
                    placeholder="e.g. Fig. 1"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: 'JetBrains Mono,monospace', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700, marginBottom: 4 }}>
                    DIAGRAM CAPTION / TITLE
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="e.g. 33kV / 11kV / 0.415kV Industrial Substation Single Line Diagram (SLD)"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 600, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Code */}
              <div>
                <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', fontWeight: 700, marginBottom: 4 }}>
                  MERMAID DIAGRAM CODE
                </label>
                <textarea
                  rows={9}
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: 'none',
                    borderRadius: 8,
                    background: '#0F172A',
                    color: '#34D399',
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div>
              {/* Zoom Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, background: '#FAF8F5', padding: '8px 14px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#475569', fontFamily: 'Outfit,sans-serif' }}>
                  Interactive Schematic Preview
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={() => setZoomLevel(z => Math.max(50, z - 15))}
                    style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, fontSize: 11 }}
                  >
                    <ZoomOut size={13} />
                  </button>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: '#0F172A', minWidth: 42, textAlign: 'center' }}>
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(z => Math.min(200, z + 15))}
                    style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, fontSize: 11 }}
                  >
                    <ZoomIn size={13} />
                  </button>
                  <button
                    onClick={() => setZoomLevel(100)}
                    style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: 11 }}
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                </div>
              </div>

              {/* Render Zone */}
              <div
                ref={previewRef}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  padding: 24,
                  minHeight: 280,
                  background: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'auto',
                }}
              />
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
            {category} • {voltageTier}
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
              onClick={handleInsert}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: 6,
                background: '#059669',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontFamily: 'Outfit,sans-serif',
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(5,150,105,0.35)',
                minHeight: 38,
              }}
            >
              <Check size={16} /> Insert Electrical Diagram
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
