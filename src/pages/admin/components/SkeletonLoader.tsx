import React from 'react'

export function SkeletonBox({
  className = '',
  style = {},
  height,
  width,
  rounded = 6,
}: {
  className?: string
  style?: React.CSSProperties
  height?: number | string
  width?: number | string
  rounded?: number | string
}) {
  return (
    <div
      className={`admin-skeleton-shimmer ${className}`}
      style={{
        height: height ?? '100%',
        width: width ?? '100%',
        borderRadius: rounded,
        background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
        backgroundSize: '200% 100%',
        animation: 'adminSkeletonWave 1.6s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

export function KPICardsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 10,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SkeletonBox height={14} width="45%" />
            <SkeletonBox height={28} width={28} rounded={6} />
          </div>
          <SkeletonBox height={28} width="60%" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <SkeletonBox height={16} width="35%" rounded={4} />
            <SkeletonBox height={16} width="25%" rounded={4} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 10,
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <SkeletonBox height={18} width={180} />
          <SkeletonBox height={12} width={260} style={{ marginTop: 6 }} />
        </div>
        <SkeletonBox height={28} width={90} rounded={6} />
      </div>
      <SkeletonBox height={200} rounded={8} />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 18, borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
        <SkeletonBox height={18} width={160} />
        <SkeletonBox height={32} width={200} rounded={6} />
      </div>
      <div style={{ padding: '12px 18px', display: 'flex', gap: 16, borderBottom: '1px solid #F1F5F9' }}>
        {[1, 2, 3, 4, 5].map(col => (
          <SkeletonBox key={col} height={14} width={`${100 / 5}%`} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          style={{
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            borderBottom: r === rows - 1 ? 'none' : '1px solid #F8FAFC',
          }}
        >
          <SkeletonBox height={20} width={20} rounded={4} />
          <div style={{ flex: 2 }}>
            <SkeletonBox height={14} width="80%" />
            <SkeletonBox height={10} width="50%" style={{ marginTop: 4 }} />
          </div>
          <SkeletonBox height={14} width="15%" />
          <SkeletonBox height={20} width="15%" rounded={4} />
          <SkeletonBox height={14} width="15%" />
          <SkeletonBox height={28} width={60} rounded={6} />
        </div>
      ))}
    </div>
  )
}
