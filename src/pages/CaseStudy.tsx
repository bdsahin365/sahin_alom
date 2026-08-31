import { useEffect, useRef, type ReactNode } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); io.disconnect() } },
      { threshold: 0.06 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal${delay ? ` reveal-delay-${delay}` : ''} ${className}`}>
      {children}
    </div>
  )
}

function SectionMark({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--accent)' }}>{num}</span>
      <div style={{ width: 16, height: 1, background: 'var(--border-strong)' }} />
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</span>
    </div>
  )
}

export default function CaseStudy({ project: p, onBack }: { project: Project; onBack: () => void }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{
        minHeight: '82vh', background: p.heroColor,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(96px,12vh,136px) var(--px) clamp(48px,7vh,80px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Hero image overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${p.heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.18,
        }} />

        {/* Ghost number */}
        <div aria-hidden style={{
          position: 'absolute', right: 'var(--px)', top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'Fraunces, serif',
          fontSize: 'clamp(120px, 18vw, 240px)', fontWeight: 300,
          letterSpacing: '-0.07em', lineHeight: 0.85,
          color: 'rgba(255,255,255,0.04)', userSelect: 'none', pointerEvents: 'none',
        }}>
          {p.num}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 960 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{p.category}</span>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>{p.year}</span>
          </div>

          <h1 style={{
            fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto',
            fontSize: 'clamp(52px, 7.5vw, 116px)', fontWeight: 300,
            letterSpacing: '-0.04em', color: '#fff', lineHeight: 0.95, marginBottom: 28,
          }}>
            {p.name}
          </h1>

          <p style={{ fontSize: 'clamp(15px, 1.4vw, 19px)', fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: 560 }}>
            {p.description}
          </p>
        </div>
      </div>

      {/* ── Meta strip ────────────────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)' }}>
          <div style={{ display: 'flex', borderLeft: '1px solid var(--border)', overflowX: 'auto' }}>
            {[
              { label: 'Role', value: p.role },
              { label: 'Duration', value: p.duration },
              { label: 'Platform', value: p.platform },
              { label: 'Year', value: p.year },
            ].map((m, i) => (
              <div key={m.label} style={{
                padding: 'clamp(20px,3vw,32px) clamp(20px,3vw,36px)',
                borderRight: '1px solid var(--border)', flexShrink: 0,
                minWidth: 120,
              }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>{m.label}</div>
                <div style={{ fontSize: 14, fontWeight: 400, color: 'var(--fg)' }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)' }}>

        {/* Challenge */}
        <section style={{ padding: 'clamp(64px,9vh,104px) 0', borderBottom: '1px solid var(--border)' }}>
          <div className="two-col" style={{ alignItems: 'start', gap: 'clamp(40px, 7vw, 88px)' }}>
            <Reveal>
              <SectionMark num="01" label="The Challenge" />
              <h2 style={{ fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto', fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.15 }}>
                Problem &amp; Context
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ fontSize: 'clamp(15px, 1.3vw, 18px)', fontWeight: 300, color: 'var(--fg)', lineHeight: 1.75, marginBottom: 28 }}>
                {p.challenge}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {p.tags.map(t => (
                  <span key={t} style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 2, fontSize: 11, color: 'var(--muted)' }}>{t}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Full-width screen */}
        <section style={{ padding: 'clamp(48px,7vh,80px) 0', borderBottom: '1px solid var(--border)' }}>
          <Reveal>
            <div style={{ borderRadius: 2, overflow: 'hidden', aspectRatio: '16/9', background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              <img src={p.screens[0].img} alt={p.screens[0].caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <p className="mono" style={{ marginTop: 14, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em' }}>
              Fig. 01 — {p.screens[0].caption}
            </p>
          </Reveal>
        </section>

        {/* Approach */}
        <section style={{ padding: 'clamp(64px,9vh,104px) 0', borderBottom: '1px solid var(--border)' }}>
          <Reveal><SectionMark num="02" label="Research & Strategy" /></Reveal>
          <div className="two-col" style={{ alignItems: 'start', gap: 'clamp(40px, 7vw, 88px)' }}>
            <Reveal>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto', fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.15, marginBottom: 20 }}>
                Approach &amp; Method
              </h2>
              <p style={{ fontSize: 15, fontWeight: 300, color: 'var(--muted)', lineHeight: 1.75 }}>{p.approach}</p>
            </Reveal>
            <Reveal delay={2}>
              <div style={{ border: '1px solid var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                {['User Interviews', 'Competitive Analysis', 'User Journey Mapping', 'Information Architecture', 'Usability Testing'].map((step, i) => (
                  <div key={step} style={{
                    padding: '16px 24px', background: 'var(--card-bg)',
                    display: 'flex', gap: 16, alignItems: 'center',
                    borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em', minWidth: 22 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--fg)' }}>{step}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Design screens */}
        <section style={{ padding: 'clamp(64px,9vh,104px) 0', borderBottom: '1px solid var(--border)' }}>
          <Reveal><SectionMark num="03" label="Visual Design" /></Reveal>
          <Reveal>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto', fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.15, marginBottom: 48 }}>
              Interfaces &amp; Design System
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 20 }}>
            {p.screens.slice(1).map((s, i) => (
              <Reveal key={i} delay={(i + 1) as 1 | 2}>
                <div style={{ borderRadius: 2, overflow: 'hidden', aspectRatio: '4/3', background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                  <img src={s.img} alt={s.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <p className="mono" style={{ marginTop: 12, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}>Fig. 0{i + 2} — {s.caption}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Outcome */}
        <section style={{ padding: 'clamp(64px,9vh,104px) 0' }}>
          <Reveal><SectionMark num="04" label="Results" /></Reveal>
          <div className="two-col" style={{ alignItems: 'center', gap: 'clamp(40px, 7vw, 88px)' }}>
            <Reveal>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto', fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.15 }}>
                Outcome &amp; Impact
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ fontSize: 'clamp(15px, 1.3vw, 18px)', fontWeight: 300, color: 'var(--fg)', lineHeight: 1.75 }}>{p.outcome}</p>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── Back CTA ──────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--fg)', padding: 'clamp(72px,10vh,120px) var(--px)', textAlign: 'center' }}>
        <p className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(245,242,237,0.3)', textTransform: 'uppercase', marginBottom: 32 }}>
          All work
        </p>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto',
            fontSize: 'clamp(28px, 4.5vw, 68px)', fontWeight: 300,
            letterSpacing: '-0.03em', color: 'var(--bg)', lineHeight: 1,
            display: 'inline-flex', alignItems: 'center', gap: 20,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.55')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          View all projects
          <ArrowUpRight size={32} strokeWidth={1} />
        </button>
      </div>
    </main>
  )
}
