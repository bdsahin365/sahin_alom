import { ReactNode } from 'react'
import { TrendingUp, ArrowUpRight, MessageSquare, Zap, FolderCheck, BookOpen } from 'lucide-react'

export interface KPICardData {
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

export default function ProKPICards({
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
    <div
      className="admin-kpi-grid"
      style={{
        width: '100%',
      }}
    >
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
            onMouseEnter={e => {
              if (c.onClick) {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-2px)'
                el.style.boxShadow = '0 8px 20px -4px rgba(15, 23, 42, 0.08), 0 0 0 1px #CBD5E1'
              }
            }}
            onMouseLeave={e => {
              if (c.onClick) {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'none'
                el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'
              }
            }}
          >
            {/* Top row: Label, Badge & Icon */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: '#64748B',
                    letterSpacing: '0.01em',
                    display: 'block',
                  }}
                >
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
                      letterSpacing: '0.02em',
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

            {/* Middle: Metric value & Sparkline */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginTop: 14,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {c.value}
              </div>
              <MiniSparkline data={c.sparklineData} color={c.iconColor} />
            </div>

            {/* Bottom: Trend percentage & comparison subtext */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: badgeBg,
                  color: badgeColor,
                  fontWeight: 600,
                  fontFamily: 'Outfit,sans-serif',
                }}
              >
                <TrendingUp size={12} strokeWidth={2.5} />
                +{c.changePercent}%
              </span>
              <span
                style={{
                  color: '#94A3B8',
                  fontFamily: 'Outfit,sans-serif',
                }}
              >
                {c.periodText}
              </span>

              {c.onClick && (
                <ArrowUpRight
                  size={13}
                  style={{ marginLeft: 'auto', color: '#CBD5E1', transition: 'color 0.15s' }}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
