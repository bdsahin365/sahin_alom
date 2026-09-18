import { useState, ReactNode } from 'react'
import {
  ChevronRight, TrendingUp, ArrowUpRight, MessageSquare, Zap, FolderCheck, BookOpen,
  BarChart3, Calendar, Layers, ShieldCheck, Sparkles
} from 'lucide-react'
import { useSite, type Project } from '../../../context/SiteContext'
import sahinPhoto from '../../../img/sahin.png'
import { ProProjectsTable, ProjectModal } from './ProjectsSection'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Switch,
  SectionId,
} from '../components/AdminPrimitives'

// ─── MINI SPARKLINES ──────────────────────────────────────────────────────────

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 72
  const height = 26
  const padding = 2

  const points = data
    .map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - padding * 2)
      const y = height - padding - ((val - min) / range) * (height - padding * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} style={{ overflow: 'visible', flexShrink: 0 }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

// ─── PRO KPI CARDS ────────────────────────────────────────────────────────────

interface KPICardData {
  id: string
  title: string
  value: string | number
  changePercent: number
  changeType: 'increase' | 'decrease' | 'neutral'
  periodText: string
  icon: ReactNode
  iconBg: string
  iconColor: string
  sparklineData: number[]
  onClick?: () => void
  badgeText?: string
}

function ProKPICards({
  inquiriesCount = 48,
  unreadInquiriesCount = 3,
  capacityDelivered = '15+ MVA',
  projectsCount = 42,
  articlesCount = 24,
  onNavigate,
}: {
  inquiriesCount?: number
  unreadInquiriesCount?: number
  capacityDelivered?: string
  projectsCount?: number
  articlesCount?: number
  onNavigate?: (tab: string) => void
}) {
  const cards: KPICardData[] = [
    {
      id: 'messages',
      title: 'Consultation Inquiries',
      value: inquiriesCount,
      changePercent: 14.2,
      changeType: 'increase',
      periodText: 'vs last month',
      badgeText: unreadInquiriesCount > 0 ? `${unreadInquiriesCount} new` : undefined,
      icon: <MessageSquare size={18} />,
      iconBg: '#FEF3C7',
      iconColor: '#C47D0E',
      sparklineData: [22, 28, 31, 35, 41, inquiriesCount],
      onClick: () => onNavigate?.('messages'),
    },
    {
      id: 'capacity',
      title: 'Delivered Grid Capacity',
      value: capacityDelivered,
      changePercent: 8.5,
      changeType: 'increase',
      periodText: 'vs last month',
      icon: <Zap size={18} />,
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      sparklineData: [8, 10, 11.5, 13, 14.2, 15.5],
      onClick: () => onNavigate?.('projects'),
    },
    {
      id: 'projects',
      title: 'Engineered Projects',
      value: projectsCount,
      changePercent: 12.0,
      changeType: 'increase',
      periodText: 'vs last month',
      badgeText: '100% On-Time',
      icon: <FolderCheck size={18} />,
      iconBg: '#DCFCE7',
      iconColor: '#16A34A',
      sparklineData: [28, 30, 34, 37, 39, projectsCount],
      onClick: () => onNavigate?.('projects'),
    },
    {
      id: 'articles',
      title: 'Technical Publications',
      value: articlesCount,
      changePercent: 28.4,
      changeType: 'increase',
      periodText: 'vs last month',
      icon: <BookOpen size={18} />,
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
      sparklineData: [12, 14, 16, 19, 21, articlesCount],
      onClick: () => onNavigate?.('articles'),
    },
  ]

  return (
    <div className="admin-kpi-grid" style={{ width: '100%' }}>
      {cards.map(c => {
        const isUp = c.changeType === 'increase'
        const badgeColor = isUp ? '#15803D' : '#B91C1C'
        const badgeBg = isUp ? '#DCFCE7' : '#FEE2E2'

        return (
          <div
            key={c.id}
            onClick={c.onClick}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: c.onClick ? 'pointer' : 'default',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12.5, fontWeight: 500, color: '#64748B', display: 'block' }}>
                  {c.title}
                </span>
                {c.badgeText && (
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: 4,
                      padding: '2px 7px',
                      borderRadius: 99,
                      background: '#C47D0E',
                      color: '#FFFFFF',
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: 'Outfit,sans-serif',
                    }}
                  >
                    {c.badgeText}
                  </span>
                )}
              </div>

              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: c.iconBg,
                  color: c.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {c.icon}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14, gap: 10 }}>
              <div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 24, fontWeight: 700, color: '#0F172A', lineHeight: 1.1 }}>
                  {c.value}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: 'JetBrains Mono,monospace',
                      color: badgeColor,
                      background: badgeBg,
                      padding: '1px 6px',
                      borderRadius: 4,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <TrendingUp size={11} /> +{c.changePercent}%
                  </span>
                  <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Outfit,sans-serif' }}>
                    {c.periodText}
                  </span>
                </div>
              </div>

              <MiniSparkline data={c.sparklineData} color={c.iconColor} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── PRO ANALYTICS CHARTS ─────────────────────────────────────────────────────

const SIX_MONTHS_DATA = [
  { month: 'Apr', inquiries: 18, consultations: 12 },
  { month: 'May', inquiries: 24, consultations: 17 },
  { month: 'Jun', inquiries: 29, consultations: 22 },
  { month: 'Jul', inquiries: 34, consultations: 26 },
  { month: 'Aug', inquiries: 41, consultations: 33 },
  { month: 'Sep', inquiries: 48, consultations: 39 },
]

const DISCIPLINE_BREAKDOWN = [
  { name: '132/33kV Substation & Grid', capacity: '16.5 MVA', pct: 38, color: '#C47D0E', projects: 15 },
  { name: 'Solar PV & Renewable', capacity: '14.0 MWp', pct: 32, color: '#0284C7', projects: 12 },
  { name: 'Industrial Captive Power', capacity: '8.5 MW', pct: 20, color: '#16A34A', projects: 9 },
  { name: 'Commercial MEP & Safety', capacity: '4.2 MVA', pct: 10, color: '#8B5CF6', projects: 6 },
]

function ProAnalyticsCharts() {
  const [activeHoverIdx, setActiveHoverIdx] = useState<number | null>(5)
  const width = 640
  const height = 210
  const padLeft = 36
  const padRight = 24
  const padTop = 20
  const padBottom = 30

  const plotWidth = width - padLeft - padRight
  const plotHeight = height - padTop - padBottom

  const maxVal = 60
  const getX = (idx: number) => padLeft + (idx / (SIX_MONTHS_DATA.length - 1)) * plotWidth
  const getY = (val: number) => padTop + plotHeight - (val / maxVal) * plotHeight

  const inqPoints = SIX_MONTHS_DATA.map((d, i) => `${getX(i).toFixed(1)},${getY(d.inquiries).toFixed(1)}`).join(' ')
  const consultPoints = SIX_MONTHS_DATA.map((d, i) => `${getX(i).toFixed(1)},${getY(d.consultations).toFixed(1)}`).join(' ')

  const areaPoints = `${getX(0)},${getY(0)} ${inqPoints} ${getX(SIX_MONTHS_DATA.length - 1)},${getY(0)}`

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 16,
        width: '100%',
      }}
    >
      {/* Chart 1: Main Trend Line */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 15, fontWeight: 600, color: '#0F172A', margin: 0 }}>
              Consultation & Engagement Trends
            </h3>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
              6-Month inquiries vs completed power consultations
            </p>
          </div>
          <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono,monospace', color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
            +26.8% Growth
          </span>
        </div>

        {/* SVG Chart */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C47D0E" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#C47D0E" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 20, 40, 60].map(val => (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={getY(val)}
                  x2={width - padRight}
                  y2={getY(val)}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={getY(val) + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94A3B8"
                  fontFamily="JetBrains Mono,monospace"
                >
                  {val}
                </text>
              </g>
            ))}

            {/* Area fill */}
            <polygon points={areaPoints} fill="url(#goldAreaGrad)" />

            {/* Inquiries line */}
            <polyline
              fill="none"
              stroke="#C47D0E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={inqPoints}
            />

            {/* Consultations line */}
            <polyline
              fill="none"
              stroke="#0284C7"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={consultPoints}
            />

            {/* Month labels & interactive dots */}
            {SIX_MONTHS_DATA.map((d, i) => {
              const cx = getX(i)
              const cyInq = getY(d.inquiries)
              const isHovered = activeHoverIdx === i

              return (
                <g key={d.month} onMouseEnter={() => setActiveHoverIdx(i)} style={{ cursor: 'pointer' }}>
                  <text
                    x={cx}
                    y={height - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isHovered ? '600' : '400'}
                    fill={isHovered ? '#0F172A' : '#64748B'}
                    fontFamily="Outfit,sans-serif"
                  >
                    {d.month}
                  </text>
                  <circle
                    cx={cx}
                    cy={cyInq}
                    r={isHovered ? 5 : 3.5}
                    fill="#C47D0E"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 11, color: '#64748B', fontFamily: 'Outfit,sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#C47D0E' }} />
            <span>Consultation Inquiries</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0284C7' }} />
            <span>Completed Projects</span>
          </div>
        </div>
      </div>

      {/* Chart 2: Engineering Discipline Capacity Breakdown */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 15, fontWeight: 600, color: '#0F172A', margin: 0 }}>
                Discipline Capacity Share
              </h3>
              <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                Cumulative energized capacity breakdown
              </p>
            </div>
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono,monospace', color: '#0284C7', background: '#E0F2FE', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
              43.2 MVA Total
            </span>
          </div>

          {/* Progress Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DISCIPLINE_BREAKDOWN.map(d => (
              <div key={d.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500, color: '#334155' }}>{d.name}</span>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 600, color: '#0F172A' }}>
                    {d.capacity} ({d.pct}%)
                  </span>
                </div>
                <div style={{ height: 7, borderRadius: 99, background: '#F1F5F9', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${d.pct}%`,
                      background: d.color,
                      borderRadius: 99,
                      transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 14, borderTop: '1px solid #F1F5F9', fontSize: 11, color: '#64748B' }}>
          <span>Primary License: ELB Class A (#ELB-2022-A9)</span>
          <span style={{ color: '#16A34A', fontWeight: 600 }}>Active in Good Standing</span>
        </div>
      </div>
    </div>
  )
}

// ─── MASTER OVERVIEW SECTION ──────────────────────────────────────────────────

export default function OverviewSection({ onNavigate }: { onNavigate: (s: SectionId) => void }) {
  const { data, updateEngineer, updateProjects } = useSite()
  const { engineer: E, projects } = data

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const handleSaveProject = (newOrUpdated: Project) => {
    const existingIndex = projects.findIndex(p => p.id === newOrUpdated.id)
    if (existingIndex >= 0) {
      updateProjects(projects.map(p => (p.id === newOrUpdated.id ? newOrUpdated : p)))
    } else {
      updateProjects([newOrUpdated, ...projects])
    }
  }

  const handleDeleteProject = (id: string) => {
    updateProjects(projects.filter(p => p.id !== id))
  }

  const sections = [
    { id: 'branding' as SectionId,    label: 'Logo & Visual Identity', ok: true },
    { id: 'shorts' as SectionId,      label: 'Video Shorts & Stories', ok: (data.shorts || []).length > 0 },
    { id: 'profile' as SectionId,     label: 'Profile & Bio',          ok: !!(E.name && E.email && E.tagline) },
    { id: 'credentials' as SectionId, label: 'Credentials & Licenses', ok: data.credentials.length > 0 },
    { id: 'expertise' as SectionId,   label: 'Core Expertise',         ok: data.expertise.length > 0 },
    { id: 'projects' as SectionId,    label: 'Projects Portfolio',     ok: data.projects.length > 0 },
    { id: 'services' as SectionId,    label: 'Services',               ok: data.services.length > 0 },
    { id: 'education' as SectionId,   label: 'Education & Career',     ok: data.education.length > 0 },
    { id: 'settings' as SectionId,    label: 'SEO & Web Analytics',    ok: !!data.settings.siteTitle },
  ]
  const score = Math.round((sections.filter(s => s.ok).length / sections.length) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Executive Operations Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: 14,
          padding: '22px 24px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img
            src={sahinPhoto}
            alt={E.name || 'Sahin Alom'}
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #C47D0E',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
                Welcome, {E.name || 'Md. Sahin Alom'}
              </h1>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  fontFamily: 'JetBrains Mono,monospace',
                  padding: '2px 8px',
                  borderRadius: 99,
                  background: 'rgba(196, 125, 14, 0.25)',
                  color: '#FDE68A',
                  border: '1px solid rgba(196, 125, 14, 0.4)',
                }}
              >
                PE · ELB CLASS A
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94A3B8', fontFamily: 'Outfit,sans-serif' }}>
              Electrical Power Systems Engineer · Substation Specialist · High-Voltage Grid Infrastructure
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 14px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono,monospace', color: '#94A3B8', textTransform: 'uppercase' }}>
                Availability
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: E.available ? '#4ADE80' : '#F87171' }}>
                {E.available ? 'Available for Consulting' : 'Currently Engaged'}
              </div>
            </div>
            <Switch checked={E.available} onChange={v => updateEngineer({ available: v })} />
          </div>
        </div>
      </div>

      {/* 1. KPI Summary Cards */}
      <ProKPICards
        inquiriesCount={48}
        unreadInquiriesCount={3}
        capacityDelivered={E.projectsMW || '15+ MVA'}
        projectsCount={projects.length || 42}
        articlesCount={24}
        onNavigate={tab => onNavigate(tab as SectionId)}
      />

      {/* 2. Visualizations: Main Trend Line & Secondary Breakdown */}
      <ProAnalyticsCharts />

      {/* 3. Main Data Section: Pro Projects Data Table */}
      <ProProjectsTable
        projects={projects}
        onEdit={p => {
          setEditingProject(p)
          setModalOpen(true)
        }}
        onDelete={handleDeleteProject}
        onAdd={() => {
          setEditingProject(null)
          setModalOpen(true)
        }}
      />

      {/* Project Modal for Add / Edit */}
      <ProjectModal
        isOpen={modalOpen}
        initialData={editingProject}
        onSave={handleSaveProject}
        onClose={() => {
          setModalOpen(false)
          setEditingProject(null)
        }}
      />

      {/* 4. Portfolio Content Completeness */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <CardTitle>Content Completeness & Quality Score</CardTitle>
              <CardDescription>
                Live assessment of portfolio readiness for international power consulting clients
              </CardDescription>
            </div>
            <Badge variant={score >= 80 ? 'gold' : 'neutral'}>{score}% Complete</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ height: 6, borderRadius: 99, background: '#F1F5F9', overflow: 'hidden', marginBottom: 14 }}>
            <div
              style={{
                height: '100%',
                width: `${score}%`,
                background: score >= 80 ? '#C47D0E' : '#3B82F6',
                borderRadius: 99,
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
            {sections.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => onNavigate(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 6,
                  border: '1px solid #F1F5F9',
                  background: '#FAFAFA',
                  cursor: 'pointer',
                  fontSize: 12.5,
                  fontFamily: 'Outfit,sans-serif',
                  textAlign: 'left',
                  color: '#1E293B',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: s.ok ? '#16A34A' : '#EF4444',
                    }}
                  />
                  <span>{s.label}</span>
                </div>
                <ChevronRight size={13} style={{ color: '#94A3B8' }} />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
