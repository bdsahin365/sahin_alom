import React from 'react'
import { useSite } from '../context/SiteContext'

export function SkeletonItem({
  width = '100%',
  height = 16,
  rounded = 4,
  style = {},
  className = '',
}: {
  width?: number | string
  height?: number | string
  rounded?: number | string
  style?: React.CSSProperties
  className?: string
}) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius: rounded,
        flexShrink: 0,
        ...style,
      }}
    />
  )
}

function SectionLabelSkeleton({ n, labelWidth = 90 }: { n: string; labelWidth?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          letterSpacing: '0.22em',
          color: 'var(--accent)',
          fontWeight: 700,
        }}
      >
        {n}
      </span>
      <div style={{ width: 42, height: 1, background: 'var(--border-strong)' }} />
      <SkeletonItem width={labelWidth} height={10} rounded={2} />
    </div>
  )
}

export default function PortfolioSkeleton() {
  const { data } = useSite()
  const showServices = data?.showServicesSection !== false

  return (
    <div
      className="portfolio-skeleton-root"
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--fg)',
        overflowX: 'hidden',
      }}
      aria-busy="true"
      aria-label="Loading engineering portfolio..."
    >
      {/* ── System Telemetry Status Bar ────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-2)',
          padding: '8px var(--px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--accent)',
            }}
          >
            <span
              className="radar-pulse"
              style={{
                position: 'absolute',
                inset: -2,
                borderRadius: '50%',
                background: 'var(--accent)',
              }}
            />
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.18em',
              color: 'var(--fg-dim)',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            INITIALIZING ENGINEERING DOSSIER · FETCHING LIVE SPECIFICATIONS
          </span>
        </div>
        <div
          className="desktop-only"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9.5,
            letterSpacing: '0.14em',
            color: 'var(--muted)',
            textTransform: 'uppercase',
          }}
        >
          IEC / IEEE / BNBC 2020 COMPLIANT
        </div>
      </div>

      {/* ── Hero Section Skeleton ──────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          padding: 'clamp(36px, 6vh, 64px) var(--px) clamp(48px, 8vh, 80px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'center',
          }}
        >
          {/* Left Hero Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Top Monospace Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <SkeletonItem width={180} height={26} rounded={4} />
              <SkeletonItem width={90} height={20} rounded={4} />
            </div>

            {/* Headline Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
              <SkeletonItem width="88%" height="clamp(42px, 5.5vw, 64px)" rounded={6} />
              <SkeletonItem width="72%" height="clamp(42px, 5.5vw, 64px)" rounded={6} />
            </div>

            {/* Tagline Paragraph Lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
              <SkeletonItem width="96%" height={15} rounded={3} />
              <SkeletonItem width="90%" height={15} rounded={3} />
              <SkeletonItem width="65%" height={15} rounded={3} />
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
              <SkeletonItem width={150} height={46} rounded={4} />
              <SkeletonItem width={140} height={46} rounded={4} />
            </div>

            {/* 4-Cell Metric Telemetry Grid */}
            <div
              className="hero-stats-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 16,
                marginTop: 28,
                paddingTop: 24,
                borderTop: '1px solid var(--border)',
              }}
            >
              {[
                { wVal: 65, wLbl: 75 },
                { wVal: 85, wLbl: 90 },
                { wVal: 55, wLbl: 80 },
                { wVal: 75, wLbl: 85 },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <SkeletonItem width={m.wVal} height={28} rounded={4} />
                  <SkeletonItem width={m.wLbl} height={11} rounded={2} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Column: Portrait Silhouette Card */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Ambient Backlight Glow */}
            <div
              style={{
                position: 'absolute',
                width: 320,
                height: 420,
                borderRadius: '50%',
                background: 'var(--accent-glow)',
                filter: 'blur(48px)',
                pointerEvents: 'none',
              }}
            />

            <div
              className="skeleton-cad-card"
              style={{
                width: '100%',
                maxWidth: 400,
                height: 'clamp(380px, 50vh, 500px)',
                borderRadius: 8,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SkeletonItem width={90} height={14} rounded={3} />
                <SkeletonItem width={50} height={14} rounded={3} />
              </div>

              {/* Center Silhouette Graphic Placeholder */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  margin: '16px 0',
                }}
              >
                <div
                  className="skeleton-shimmer"
                  style={{
                    width: '80%',
                    height: '88%',
                    borderRadius: 6,
                    opacity: 0.8,
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SkeletonItem width={120} height={12} rounded={3} />
                <SkeletonItem width={80} height={12} rounded={3} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Credential Strip Skeleton ──────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-2)',
          padding: '28px var(--px)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--max-w)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
          }}
        >
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="skeleton-cad-card"
              style={{
                padding: '16px 18px',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <SkeletonItem width={36} height={36} rounded={6} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <SkeletonItem width="80%" height={14} rounded={3} />
                <SkeletonItem width="55%" height={11} rounded={2} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About Section Skeleton ─────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          padding: 'var(--section-py) var(--px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <SectionLabelSkeleton n="01" labelWidth={70} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(32px, 5vw, 64px)',
          }}
        >
          {/* Blueprint Photo Box */}
          <div
            className="skeleton-cad-card"
            style={{
              height: 380,
              borderRadius: 8,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <SkeletonItem width={120} height={14} rounded={3} />
            <div className="skeleton-shimmer" style={{ width: '100%', height: '70%', borderRadius: 6 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <SkeletonItem width={70} height={18} rounded={3} />
              <SkeletonItem width={90} height={18} rounded={3} />
            </div>
          </div>

          {/* About Narrative Lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <SkeletonItem width="60%" height={32} rounded={6} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <SkeletonItem width="100%" height={15} rounded={3} />
              <SkeletonItem width="96%" height={15} rounded={3} />
              <SkeletonItem width="92%" height={15} rounded={3} />
              <SkeletonItem width="78%" height={15} rounded={3} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <SkeletonItem width="98%" height={15} rounded={3} />
              <SkeletonItem width="94%" height={15} rounded={3} />
              <SkeletonItem width="85%" height={15} rounded={3} />
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              {[1, 2, 3, 4, 5].map(t => (
                <SkeletonItem key={t} width={90} height={28} rounded={4} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Expertise Bento Skeleton ──────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          padding: 'var(--section-py) var(--px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <SectionLabelSkeleton n="02" labelWidth={130} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map(card => (
            <div
              key={card}
              className="skeleton-cad-card"
              style={{
                padding: 24,
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SkeletonItem width={28} height={28} rounded={6} />
                <SkeletonItem width={40} height={12} rounded={2} />
              </div>
              <SkeletonItem width="70%" height={22} rounded={4} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <SkeletonItem width="100%" height={13} rounded={2} />
                <SkeletonItem width="85%" height={13} rounded={2} />
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                <SkeletonItem width={60} height={20} rounded={4} />
                <SkeletonItem width={75} height={20} rounded={4} />
                <SkeletonItem width={50} height={20} rounded={4} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Selected Works (Projects) Skeleton ─────────────────────────────────── */}
      <section
        style={{
          maxWidth: 'var(--max-w)',
          margin: '0 auto',
          padding: 'var(--section-py) var(--px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <SectionLabelSkeleton n="03" labelWidth={140} />

        {/* Project Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {[1, 2, 3].map(p => (
            <div
              key={p}
              className="skeleton-cad-card"
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/10' }}>
                <SkeletonItem width="100%" height="100%" rounded={0} />
              </div>
              <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <SkeletonItem width={110} height={12} rounded={2} />
                <SkeletonItem width="82%" height={22} rounded={4} />
                <SkeletonItem width="96%" height={14} rounded={2} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <SkeletonItem width={100} height={12} rounded={2} />
                  <SkeletonItem width={50} height={14} rounded={2} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Section Skeleton ──────────────────────────────────────────── */}
      {showServices && (
        <section
          style={{
            maxWidth: 'var(--max-w)',
            margin: '0 auto',
            padding: 'var(--section-py) var(--px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <SectionLabelSkeleton n="04" labelWidth={90} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className="skeleton-cad-card"
                style={{
                  padding: '20px 24px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 20,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1 }}>
                  <SkeletonItem width={24} height={24} rounded={4} />
                  <SkeletonItem width="45%" height={20} rounded={4} />
                </div>
                <SkeletonItem width="35%" height={14} rounded={2} className="desktop-only" />
                <SkeletonItem width={28} height={28} rounded={4} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Footer Skeleton ────────────────────────────────────────────────────── */}
      <footer
        style={{
          padding: '40px var(--px)',
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--max-w)',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <SkeletonItem width={140} height={28} rounded={4} />
          <SkeletonItem width={220} height={12} rounded={2} />
          <SkeletonItem width={80} height={12} rounded={2} />
        </div>
      </footer>
    </div>
  )
}
