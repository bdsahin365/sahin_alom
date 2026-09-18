import { useState } from 'react'
import { ArrowUpRight, BarChart3, Calendar, Layers, ShieldCheck, Sparkles } from 'lucide-react'

interface MonthlyData {
  month: string
  inquiries: number
  consultations: number
}

const SIX_MONTHS_DATA: MonthlyData[] = [
  { month: 'Apr', inquiries: 18, consultations: 12 },
  { month: 'May', inquiries: 24, consultations: 17 },
  { month: 'Jun', inquiries: 29, consultations: 22 },
  { month: 'Jul', inquiries: 34, consultations: 26 },
  { month: 'Aug', inquiries: 41, consultations: 33 },
  { month: 'Sep', inquiries: 48, consultations: 39 },
]

const DISCIPLINE_BREAKDOWN = [
  {
    name: '132/33kV Substation & Grid',
    capacity: '16.5 MVA',
    pct: 38,
    color: '#C47D0E',
    projects: 15,
  },
  {
    name: 'Solar PV & Renewable Integration',
    capacity: '14.0 MWp',
    pct: 32,
    color: '#0284C7',
    projects: 12,
  },
  {
    name: 'Industrial Captive Power',
    capacity: '8.5 MW',
    pct: 20,
    color: '#16A34A',
    projects: 9,
  },
  {
    name: 'Commercial MEP & Life Safety',
    capacity: '4.2 MVA',
    pct: 10,
    color: '#8B5CF6',
    projects: 6,
  },
]

export default function ProAnalyticsCharts() {
  const [activeHoverIdx, setActiveHoverIdx] = useState<number | null>(5)
  const [timeframe, setTimeframe] = useState<'6m' | '12m'>('6m')

  // SVG dimensions for main trend chart
  const width = 640
  const height = 210
  const padLeft = 36
  const padRight = 24
  const padTop = 20
  const padBottom = 30

  const maxVal = 55
  const chartW = width - padLeft - padRight
  const chartH = height - padTop - padBottom

  const points = SIX_MONTHS_DATA.map((d, i) => {
    const x = padLeft + (i / (SIX_MONTHS_DATA.length - 1)) * chartW
    const y = padTop + chartH - (d.inquiries / maxVal) * chartH
    return { x, y, ...d }
  })

  // Generate smooth cubic bezier SVG curve
  const curvePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`
    const prev = arr[i - 1]
    const cx1 = prev.x + (pt.x - prev.x) / 2
    const cy1 = prev.y
    const cx2 = prev.x + (pt.x - prev.x) / 2
    const cy2 = pt.y
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`
  }, '')

  // Area fill under curve
  const lastPt = points[points.length - 1]
  const firstPt = points[0]
  const areaPath = `${curvePath} L ${lastPt.x},${padTop + chartH} L ${firstPt.x},${padTop + chartH} Z`

  const activePoint = activeHoverIdx !== null ? points[activeHoverIdx] : points[points.length - 1]

  return (
    <div className="admin-charts-grid" style={{ width: '100%' }}>
      {/* 1. Main Trend Line Chart */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '20px 22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3
                style={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#0F172A',
                  margin: 0,
                }}
              >
                Inquiry & Consultation Velocity
              </h3>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 4,
                  background: '#FEF3C7',
                  color: '#92400E',
                  fontFamily: 'Outfit,sans-serif',
                }}
              >
                +28% Trajectory
              </span>
            </div>
            <p
              style={{
                fontFamily: 'Outfit,sans-serif',
                fontSize: 12,
                color: '#64748B',
                marginTop: 4,
                marginBottom: 0,
              }}
            >
              Monthly inbound technical inquiries & commissioned consultations
            </p>
          </div>

          <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 2, borderRadius: 6 }}>
            <button
              type="button"
              onClick={() => setTimeframe('6m')}
              style={{
                padding: '4px 10px',
                borderRadius: 4,
                border: 'none',
                background: timeframe === '6m' ? '#FFFFFF' : 'transparent',
                color: timeframe === '6m' ? '#0F172A' : '#64748B',
                fontSize: 11,
                fontFamily: 'Outfit,sans-serif',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: timeframe === '6m' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Past 6M
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('12m')}
              style={{
                padding: '4px 10px',
                borderRadius: 4,
                border: 'none',
                background: timeframe === '12m' ? '#FFFFFF' : 'transparent',
                color: timeframe === '12m' ? '#0F172A' : '#64748B',
                fontSize: 11,
                fontFamily: 'Outfit,sans-serif',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: timeframe === '12m' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              YTD 2026
            </button>
          </div>
        </div>

        {/* Dynamic Metric Hover Readout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, marginBottom: 6 }}>
          <div>
            <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Outfit,sans-serif' }}>Selected Month</span>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontFamily: 'Outfit,sans-serif' }}>
              {activePoint.month} 2026
            </div>
          </div>
          <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />
          <div>
            <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Outfit,sans-serif' }}>Total Inquiries</span>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#C47D0E', fontFamily: 'Outfit,sans-serif' }}>
              {activePoint.inquiries}
            </div>
          </div>
          <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />
          <div>
            <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Outfit,sans-serif' }}>Commissioned</span>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#16A34A', fontFamily: 'Outfit,sans-serif' }}>
              {activePoint.consultations}
            </div>
          </div>
        </div>

        {/* Responsive Interactive SVG Chart */}
        <div style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="proChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C47D0E" stopOpacity="0.28" />
                <stop offset="60%" stopColor="#C47D0E" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#C47D0E" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 15, 30, 45].map(v => {
              const y = padTop + chartH - (v / maxVal) * chartH
              return (
                <g key={v}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="#F1F5F9"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize="10"
                    fill="#94A3B8"
                    fontFamily="Outfit, sans-serif"
                  >
                    {v}
                  </text>
                </g>
              )
            })}

            {/* Area gradient */}
            <path d={areaPath} fill="url(#proChartGradient)" />

            {/* Bezier Trend line */}
            <path
              d={curvePath}
              fill="none"
              stroke="#C47D0E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Point Markers */}
            {points.map((pt, i) => {
              const isHovered = activeHoverIdx === i
              return (
                <g
                  key={pt.month}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setActiveHoverIdx(i)}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    fill="#FFFFFF"
                    stroke="#C47D0E"
                    strokeWidth={isHovered ? 3 : 2}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                  {/* Invisible larger hover hit area */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={18}
                    fill="transparent"
                  />
                  {/* X Axis label */}
                  <text
                    x={pt.x}
                    y={padTop + chartH + 18}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isHovered ? '600' : '500'}
                    fill={isHovered ? '#0F172A' : '#64748B'}
                    fontFamily="Outfit, sans-serif"
                  >
                    {pt.month}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* 2. Secondary Breakdown Chart */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '20px 22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3
                style={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#0F172A',
                  margin: 0,
                }}
              >
                Discipline Capacity Allocation
              </h3>
              <p
                style={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 12,
                  color: '#64748B',
                  marginTop: 4,
                  marginBottom: 0,
                }}
              >
                Engineered grid capacity & project share by discipline
              </p>
            </div>
            <span
              style={{
                fontFamily: 'Outfit,sans-serif',
                fontSize: 11,
                fontWeight: 600,
                color: '#16A34A',
                background: '#DCFCE7',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              43.2 MVA Total
            </span>
          </div>

          {/* Multi-segment distribution progress bar */}
          <div
            style={{
              height: 12,
              borderRadius: 6,
              overflow: 'hidden',
              display: 'flex',
              marginTop: 18,
              marginBottom: 20,
              background: '#F1F5F9',
            }}
          >
            {DISCIPLINE_BREAKDOWN.map(item => (
              <div
                key={item.name}
                style={{
                  width: `${item.pct}%`,
                  height: '100%',
                  background: item.color,
                  transition: 'width 0.3s ease',
                }}
                title={`${item.name}: ${item.pct}% (${item.capacity})`}
              />
            ))}
          </div>

          {/* Breakdown Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DISCIPLINE_BREAKDOWN.map(item => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'Outfit,sans-serif',
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: '#1E293B',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </div>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#64748B' }}>
                      {item.projects} commissioned projects
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: 'Outfit,sans-serif',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#0F172A',
                    }}
                  >
                    {item.capacity}
                  </div>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8' }}>
                    {item.pct}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11.5,
            color: '#64748B',
            fontFamily: 'Outfit,sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <ShieldCheck size={14} style={{ color: '#16A34A' }} />
            <span>BNBC 2020 & IEEE 80 Standards Certified</span>
          </div>
          <span style={{ fontWeight: 600, color: '#0F172A' }}>ELB Class A</span>
        </div>
      </div>
    </div>
  )
}
