export type Project = {
  id: string
  num: string
  name: string
  tagline: string
  description: string
  category: string
  year: string
  tags: string[]
  heroImg: string
  heroColor: string
  accentColor: string
  screens: { img: string; caption: string }[]
  challenge: string
  approach: string
  outcome: string
  role: string
  duration: string
  platform: string
}

export const PROJECTS: Project[] = [
  {
    id: 'gustoes',
    num: '01',
    name: 'Gustoes',
    tagline: 'Food delivery & restaurant SaaS ecosystem',
    description: 'A full-stack food delivery and restaurant management platform — covering consumer ordering, kitchen management, and a SaaS dashboard for restaurant owners across the Bangladesh market.',
    category: 'SaaS · Food & Beverage',
    year: '2024',
    tags: ['Product Design', 'SaaS', 'Mobile App', 'Dashboard', 'Design System'],
    heroImg: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&h=1000&fit=crop&auto=format&q=85',
    heroColor: '#1C1309',
    accentColor: '#E8913D',
    role: 'Lead Product Designer',
    duration: '6 months',
    platform: 'iOS · Android · Web Dashboard',
    screens: [
      { img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop&auto=format&q=80', caption: 'Consumer ordering interface — home and discovery' },
      { img: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3b48?w=1200&h=800&fit=crop&auto=format&q=80', caption: 'Restaurant dashboard — order management and analytics' },
      { img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop&auto=format&q=80', caption: 'Menu builder — multi-tier customization for restaurants' },
    ],
    challenge: 'Restaurant owners in Bangladesh were using disconnected tools — WhatsApp for orders, spreadsheets for inventory, and no analytics at all. Customers had no reliable discovery or ordering experience.',
    approach: 'I ran discovery interviews with 12 restaurant owners and 40+ frequent diners to map the real workflow. The design prioritized the restaurant-side operations first — if owners couldn\'t manage efficiently, the consumer side would fail regardless of how polished it looked.',
    outcome: 'Gustoes launched with 18 restaurant partners in its first quarter. Average order processing time dropped from 14 minutes to under 4 minutes. Restaurant owners reported 3× reduction in order errors.',
  },
  {
    id: 'storix',
    num: '02',
    name: 'Storix',
    tagline: 'E-commerce SaaS built for the Bangladesh market',
    description: 'A complete e-commerce platform giving Bangladeshi merchants a local-first alternative to global SaaS tools — with native payment integrations, Bengali language support, and workflows tuned to how local businesses actually operate.',
    category: 'SaaS · E-commerce',
    year: '2024',
    tags: ['Product Design', 'SaaS Platform', 'Design System', 'Data Visualization'],
    heroImg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=1000&fit=crop&auto=format&q=85',
    heroColor: '#0E1420',
    accentColor: '#5B8DEF',
    role: 'Product Designer',
    duration: '8 months',
    platform: 'Web · Mobile',
    screens: [
      { img: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop&auto=format&q=80', caption: 'Merchant dashboard — sales overview and inventory' },
      { img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=800&fit=crop&auto=format&q=80', caption: 'Product catalog — bulk edit with smart filters' },
      { img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&auto=format&q=80', caption: 'Order management — logistics and status tracking' },
    ],
    challenge: 'Most e-commerce SaaS tools were built for Western markets. Bangladeshi merchants were either using tools that didn\'t support local payment gateways like bKash and Nagad, or building custom systems at high cost.',
    approach: 'Deep research into how merchant mental models differed from Western assumptions. Rethought onboarding to match local business practices. Built a design system that could flex between Bengali and English without layout breaking.',
    outcome: 'Storix reduced merchant onboarding time to under 20 minutes. Early cohort of 60 merchants processed over BDT 2.4 crore in sales within the first 3 months of launch.',
  },
  {
    id: 'rydeon',
    num: '03',
    name: 'Rydeon',
    tagline: 'Ride-hailing and urban mobility platform concept',
    description: 'A conceptual product design for a ride-hailing platform addressing the unique mobility challenges of dense South Asian cities — with a driver-first focus and real-time safety features for both riders and drivers.',
    category: 'Product Concept · Mobility',
    year: '2023',
    tags: ['Product Design', 'Mobile App', 'Maps & Navigation', 'UX Research'],
    heroImg: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&h=1000&fit=crop&auto=format&q=85',
    heroColor: '#0A140A',
    accentColor: '#6ECF7A',
    role: 'Product Designer & Researcher',
    duration: '4 months',
    platform: 'iOS · Android',
    screens: [
      { img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=800&fit=crop&auto=format&q=80', caption: 'Rider app — home state and ride requesting' },
      { img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop&auto=format&q=80', caption: 'Real-time tracking — driver view with turn-by-turn' },
      { img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&h=800&fit=crop&auto=format&q=80', caption: 'Safety center — emergency and live sharing features' },
    ],
    challenge: 'Existing ride-hailing apps in South Asia were direct ports of Western UX patterns. They performed poorly in low-connectivity environments, didn\'t reflect local payment preferences, and had high driver churn due to poor earnings transparency.',
    approach: 'Started with driver ethnographic research — accompanying drivers on 8 shifts across Dhaka to understand their real workflow. Mapped every friction point from pickup negotiation to payment collection.',
    outcome: 'The concept prototype was tested with 25 drivers and 40 riders over 3 weeks. Driver satisfaction scores averaged 4.6/5. The earnings transparency feature was rated the most valuable improvement over existing apps.',
  },
]
