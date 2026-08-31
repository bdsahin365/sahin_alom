import sahinPhoto from '../img/sahin.png'

export const ENGINEER = {
  name: 'Md Sahin Alom',
  initials: 'SAHIN',
  photo: sahinPhoto,
  title: 'Electrical Engineer',
  subtitle: 'Power Systems · ABC Licensed',
  location: 'Zirabo, Ashulia, Savar, Dhaka',
  email: 'info@sahinalom.com',
  phone: '01760816120',
  linkedin: 'https://linkedin.com/in/sahinalom',
  tagline: 'Designing reliable, efficient and safe electrical power infrastructure for modern industrial and garment manufacturing facilities.',
  bio: [
    'I am Md Sahin Alom — an Electrical Engineer based in Savar, Dhaka, Bangladesh, with practical experience in industrial electrical maintenance, power distribution networks, and standby generation systems.',
    'My work includes hands-on maintenance of LV/MV distribution, transformer and switchgear operations, Automatic Transfer Switch (ATS) wiring, and single-line diagram (SLD) preparation using AutoCAD Electrical.',
    'I combine thorough technical analysis with practical site execution, ensuring that industrial power systems are safe, compliant, and built for uninterrupted production.',
  ],
  yearsExp: '2+',
  projectsMW: '1250 KVA',
  projectsCount: '5+',
  clients: 'RMG Sector',
}

export const CREDENTIALS = [
  {
    label: 'ABC License',
    value: 'Electrical Licensing Board',
    detail: 'Electricity Licensing Board (ELB), Bangladesh · Category A, B & C',
    url: '',
  },
  {
    label: 'Prompt Engineering',
    value: 'Generative AI & Prompting',
    detail: 'LinkedIn Learning · Issued Jan 2025',
    url: 'https://www.linkedin.com/learning/certificates/f8a91a6c479f690d316965810fa87921a3ec71caa28aa8d54391ee97b3c1fbd9/',
  },
  {
    label: 'Design Thinking',
    value: 'Design Thinking in AI Age',
    detail: 'LinkedIn Learning · Issued Jan 2025',
    url: 'https://www.linkedin.com/learning/certificates/c37b971869567938016f63c0017f044150f06cc9f6f0d5857519102fe1ef157f/',
  },
  {
    label: 'Jira & PM',
    value: 'Managing Jira Projects',
    detail: 'Atlassian · Issued Jan 2024 · ID: 70e90c15ad04',
    url: 'https://www.linkedin.com/learning/certificates/70e90c15ad046dcac394160b884ad55c10d7e807dc900a42fd66e258ad322637/',
  },
  {
    label: 'UX Design',
    value: 'Foundations of UX Design',
    detail: 'Coursera / Google · Issued May 2023',
    url: 'https://coursera.org/share/7b1fa4f3f951f5cc8bdf82cd9db6f63b',
  },
  {
    label: 'IT & Networks',
    value: 'Technical Support Fundamentals',
    detail: 'Coursera / Google · Issued May 2023 · ID: NWGWMNS22HRY',
    url: 'https://coursera.org/share/83b8b4f8bcf0c4434589fca7c2e561af',
  },
]

export const EXPERTISE = [
  {
    id: 'power-systems',
    num: '01',
    title: 'Power Systems Analysis',
    tags: ['Load Flow', 'Short-Circuit', 'Stability Studies', 'Harmonic Analysis', 'PSCAD', 'PSS/E'],
    desc: 'Comprehensive power flow, fault analysis and transient stability studies for transmission and distribution networks using industry-standard simulation tools.',
  },
  {
    id: 'hv-substation',
    num: '02',
    title: 'HV Substation Design',
    tags: ['69kV–500kV', 'Single-Line Diagrams', 'Protection Schemes', 'Grounding', 'AutoCAD', 'ETAP'],
    desc: 'End-to-end substation engineering from conceptual design through detailed design packages, IFC drawings and commissioning support.',
  },
  {
    id: 'renewables',
    num: '03',
    title: 'Renewable Energy Integration',
    tags: ['Solar PV', 'Wind', 'BESS', 'Interconnection', 'Grid Code', 'Power Quality'],
    desc: 'Grid integration engineering for utility-scale solar, wind and energy storage projects — from interconnection studies to protection coordination and SCADA.',
  },
  {
    id: 'protection',
    num: '04',
    title: 'Protection & Control',
    tags: ['Relay Coordination', 'IEC 61850', 'SCADA', 'PLC', 'Arc Flash', 'NFPA 70E'],
    desc: 'Protection system design, relay coordination studies, arc flash hazard analysis and control system engineering for industrial and utility clients.',
  },
  {
    id: 'grid-planning',
    num: '05',
    title: 'Transmission Planning',
    tags: ['N-1 Contingency', 'Capacity Studies', 'Voltage Regulation', 'Loss Analysis', 'GIS'],
    desc: 'Long-range transmission planning studies assessing reliability, thermal limits and voltage performance under base case and contingency conditions.',
  },
  {
    id: 'power-quality',
    num: '06',
    title: 'Power Quality & EMC',
    tags: ['THD', 'Flicker', 'Capacitor Banks', 'Filters', 'IEEE 519', 'EN 50160'],
    desc: 'Power quality assessment, harmonic mitigation design and electromagnetic compatibility studies for industrial facilities and grid-connected assets.',
  },
]

export type Project = {
  id: string
  num: string
  title: string
  client: string
  location: string
  capacity: string
  year: string
  category: string
  img: string
  imgColor: string
  summary: string
  scope: string[]
  deliverables: string[]
  outcome: string
  tools: string[]
}

export const PROJECTS: Project[] = [
  {
    id: 'styllent-knit-generator',
    num: '01',
    title: '1250 KVA Generator & ATS Installation',
    client: 'Styllent Knit Limited',
    location: 'Dhaka, Bangladesh',
    capacity: '1250 KVA',
    year: '2024',
    category: 'Industrial Power · Standby Generation',
    img: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1400&h=900&fit=crop&auto=format&q=85',
    imgColor: '#1A1208',
    summary: 'End-to-end engineering, installation, and commissioning of a 1250 KVA standby diesel generator set with Automatic Transfer Switch (ATS) for Styllent Knit Limited — ensuring 100% power reliability for continuous garment knitting and sewing lines.',
    scope: [
      'Load assessment and generator sizing study',
      'Site survey and foundation / civil works coordination',
      'Electrical panel and automatic transfer switch (ATS) design',
      'Cabling, earthing, and fuel system installation',
      'Commissioning, load testing, and operator handover',
    ],
    deliverables: ['Generator sizing report', 'Single-line diagram (SLD)', 'ATS wiring schematics', 'Earthing design', 'Commissioning test records'],
    outcome: 'Zero downtime during grid fluctuations; seamless power switchover in under 8 seconds, protecting sensitive sewing machines and knitting looms.',
    tools: ['AutoCAD Electrical', 'ETAP', 'CYMGRD', 'Fluke Earth Tester'],
  },
  {
    id: 'rooftop-solar-rmg',
    num: '02',
    title: '1.2 MWp Rooftop Solar PV Net-Metering',
    client: 'Pacific Composite Textiles Ltd',
    location: 'Gazipur, Bangladesh',
    capacity: '1.2 MWp',
    year: '2024',
    category: 'Renewable Energy · BREB Net-Metering',
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1400&h=900&fit=crop&auto=format&q=85',
    imgColor: '#0A1A10',
    summary: 'Complete electrical engineering design and BREB net-metering interconnection for a 1.2 MWp industrial rooftop solar installation across 3 shed buildings of a green composite garment facility.',
    scope: [
      'Solar PV array string sizing and roof shading analysis',
      'LT synchronizing panel & bi-directional net-metering integration with 11kV substation',
      'DC/AC cable schedule, inverter station design, and surge protection',
      'Lightning Protection System (LPS) as per BNBC / IEC 62305',
      'BREB grid-compliance testing and net-metering synchronization',
    ],
    deliverables: ['PVSyst simulation & yield assessment', 'Complete electrical layout and AC/DC single-line diagrams', 'Net-metering protection coordination study', 'Structural earthing & LPS drawing package', 'As-built documentation & commissioning report'],
    outcome: 'Generates ~1.65 GWh clean energy annually, reducing factory grid utility bills by 28% while advancing factory LEED Platinum decarbonization goals.',
    tools: ['PVSyst', 'AutoCAD Electrical', 'ETAP', 'SMA Sunny Design'],
  },
  {
    id: 'substation-pfi-upgrade',
    num: '03',
    title: '2500 KVA Substation & 1200 kVAR PFI Upgrade',
    client: 'Aman Graphics & Apparel Ltd',
    location: 'Narayanganj, Bangladesh',
    capacity: '2500 KVA',
    year: '2023',
    category: 'Substation Engineering · Power Quality',
    img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1400&h=900&fit=crop&auto=format&q=85',
    imgColor: '#0F0A00',
    summary: 'Modernization of an 11/0.415 kV 2500 KVA indoor substation, HT vacuum circuit breaker (VCB) overhaul, and installation of a 1200 kVAR microprocessor-controlled Power Factor Improvement (PFI) plant.',
    scope: [
      '11kV HT switchgear panel and VCB relay calibration',
      'Transformer oil dielectric testing and bushing maintenance',
      '1200 kVAR automatic PFI plant with detuned harmonic filters design',
      'Main Distribution Board (MDB) & Sub-Distribution Board (SDB) re-balancing',
      'Power quality harmonic survey and transient analysis',
    ],
    deliverables: ['Substation layout and section drawings', 'Relay coordination & fault current calculation', 'PFI sizing and harmonic mitigation report', 'DESCO inspection compliance documentation', 'Thermographic survey report'],
    outcome: 'Maintained power factor above 0.98 lagging, eliminating utility low power factor penalty and reducing overall line thermal losses by 14%.',
    tools: ['AutoCAD', 'ETAP', 'Fluke 435 Power Quality Analyzer', 'Schneider Easergy'],
  },
  {
    id: 'bbt-safety-remediation',
    num: '04',
    title: '1600A Busbar Trunking & RSC Electrical Remediation',
    client: 'Elegance Fashion Wear Ltd',
    location: 'Savar / Ashulia, Bangladesh',
    capacity: '1600A / 1000 KVA',
    year: '2023',
    category: 'Industrial Safety · RSC Compliance',
    img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1400&h=900&fit=crop&auto=format&q=85',
    imgColor: '#050D1A',
    summary: 'Comprehensive electrical safety remediation and installation of 1600A sandwich-type Busbar Trunking (BBT) across 4 production floors to satisfy RMG Sustainability Council (RSC) and Accord/Alliance safety guidelines.',
    scope: [
      'Electrical hazard identification, single-line diagram updates, and load audit',
      'Design and installation of 1600A sandwich-type copper BBT risers & tap-off units',
      'Residual current protection (RCCB/ELCB) and circuit breaker coordination',
      'Dedicated earth pit network overhaul with resistance reduced to < 0.8 Ohm',
      'RSC / Accord safety audit liaison and CAP (Corrective Action Plan) closure',
    ],
    deliverables: ['Updated as-built single-line diagrams (SLD) for all floors', 'BBT route layout & isometric installation drawings', 'Earth loop impedance and insulation resistance logs', 'RSC Electrical Safety Audit closure report', 'Preventive maintenance standard operating procedure'],
    outcome: '100% RSC electrical safety audit compliance achieved with zero pending findings; enhanced fire safety and reduced production floor wiring clutter.',
    tools: ['AutoCAD Electrical', 'Megger Insulation Tester', 'FLIR Thermal Imaging Camera'],
  },
]

export const SERVICES = [
  { id: 's1', num: '01', name: 'Power Systems Studies', detail: 'Load flow · fault analysis · stability · harmonics · contingency' },
  { id: 's2', num: '02', name: 'Substation Engineering', detail: 'Concept through IFC — 11kV to 500kV AC systems' },
  { id: 's3', num: '03', name: 'Renewable Grid Integration', detail: 'Solar · wind · BESS interconnection and compliance studies' },
  { id: 's4', num: '04', name: 'Protection & Control', detail: 'Relay coordination · arc flash · IEC 61850 · SCADA' },
  { id: 's5', num: '05', name: 'Technical Due Diligence', detail: 'Independent engineer reviews for lenders and investors' },
  { id: 's6', num: '06', name: 'Expert Witness & Review', detail: 'Technical expert services for disputes and regulatory proceedings' },
]

export type Experience = {
  id: string
  role: string
  company: string
  location: string
  period: string
  current: boolean
  description: string
  highlights: string[]
}

export const EXPERIENCE: Experience[] = [
  {
    id: 'styllent-knit',
    role: 'Junior Electrical Engineer',
    company: 'Styllent Knit Limited',
    location: 'Dhaka, Bangladesh',
    period: '2024 — Present',
    current: true,
    description: 'Responsible for electrical system maintenance, power distribution, and infrastructure projects at a large garment manufacturing facility.',
    highlights: [
      'Engineered and commissioned a 1250 KVA standby diesel generator installation, eliminating production downtime during grid outages',
      'Oversee daily operations of the facility\'s LV/MV power distribution network',
      'Coordinate preventive maintenance schedules for transformers, switchgear, and motor control centres',
      'Prepare electrical drawings, single-line diagrams, and load schedules using AutoCAD Electrical',
    ],
  },
  {
    id: 'blusyenergy',
    role: 'UX Engineer',
    company: 'Blusyenergy Ltd',
    location: 'Remote',
    period: '2022 — 2024',
    current: false,
    description: 'Worked at the intersection of electrical engineering and digital product design, building user-facing tools and dashboards for energy monitoring and management platforms.',
    highlights: [
      'Designed and developed interactive energy dashboards for real-time power monitoring',
      'Collaborated with electrical engineers to translate technical data into accessible UI/UX',
      'Built data visualisation components for grid performance and consumption analytics',
      'Bridged engineering and product teams to improve technical product usability',
    ],
  },
]

export const EDUCATION = [
  { period: '2024', degree: 'BSc in Electrical & Electronic Engineering', institution: 'Green University of Bangladesh', note: 'EEE Department' },
  { period: '2018', degree: 'Diploma in Engineering (Electronics & Telecommunication)', institution: 'BCMC College of Engineering & Technology', note: 'ET Discipline' },
  { period: '2014', degree: 'Secondary School Certificate (SSC)', institution: 'Panikauria Secondary School', note: 'Science Group' },
]
