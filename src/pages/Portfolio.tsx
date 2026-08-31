import { useState, useEffect, useRef, type ReactNode } from 'react'
import {
  ArrowDown, ArrowUpRight, ArrowRight,
  MoveRight, ChevronRight,
} from 'lucide-react'
import { PROJECTS, type Project } from '../data/projects'
import sahinPhoto from '../img/sahin.png'

// ── Reveal ──────────────────────────────────────────────────────────────────
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

function Label({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
      <div style={{ width: 20, height: 1, background: 'var(--accent)', flexShrink: 0 }} />
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase' }}>
        {children}
      </span>
    </div>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [in_, setIn] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setIn(true), 120)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  const lines = [
    { text: 'I design digital', italic: false },
    { text: 'products that make', italic: false },
    { text: 'complex things', italic: true },
    { text: 'feel simple.', italic: false },
  ]

  return (
    <section style={{
      minHeight: '100svh', display: 'grid',
      gridTemplateRows: '1fr auto',
      padding: 'clamp(96px,12vh,140px) var(--px) clamp(40px,6vh,72px)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ghost monogram */}
      <div aria-hidden style={{
        position: 'absolute',
        right: 'calc(var(--px) * -0.1)',
        top: '50%',
        transform: `translateY(calc(-52% + ${scrollY * 0.1}px))`,
        fontFamily: 'Fraunces, serif',
        fontSize: 'clamp(120px, 17vw, 260px)',
        fontWeight: 300, letterSpacing: '-0.07em', lineHeight: 0.85,
        color: 'transparent',
        WebkitTextStroke: '1px var(--border)',
        userSelect: 'none', pointerEvents: 'none',
        zIndex: 0, opacity: 0.6,
      }}>
        SAHIN
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, alignSelf: 'end', maxWidth: 1000 }}>
        {/* Eyebrow */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36,
          opacity: in_ ? 1 : 0, transform: in_ ? 'none' : 'translateY(10px)',
          transition: 'opacity 0.6s 0.08s ease, transform 0.6s 0.08s ease',
        }}>
          <div style={{ width: 28, height: 1, background: 'var(--accent)' }} />
          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            Product Designer · UI/UX · Entrepreneur
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ margin: '0 0 36px' }}>
          {lines.map((l, i) => (
            <div key={i} style={{ overflow: 'hidden', lineHeight: 1.05 }}>
              <div style={{
                fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto',
                fontSize: 'clamp(40px, 6.2vw, 92px)', fontWeight: 300,
                letterSpacing: '-0.03em',
                color: l.italic ? 'var(--accent)' : 'var(--fg)',
                fontStyle: l.italic ? 'italic' : 'normal',
                opacity: in_ ? 1 : 0,
                transform: in_ ? 'translateY(0)' : 'translateY(105%)',
                transition: `opacity 0.8s ${0.2 + i * 0.1}s cubic-bezier(0.16,1,0.3,1), transform 0.8s ${0.2 + i * 0.1}s cubic-bezier(0.16,1,0.3,1)`,
              }}>
                {l.text}
              </div>
            </div>
          ))}
        </h1>

        <p style={{
          fontSize: 'clamp(14px, 1.3vw, 18px)', fontWeight: 300, color: 'var(--muted)',
          lineHeight: 1.7, maxWidth: 500, marginBottom: 48,
          opacity: in_ ? 1 : 0, transform: in_ ? 'none' : 'translateY(14px)',
          transition: 'opacity 0.6s 0.62s, transform 0.6s 0.62s',
        }}>
          I'm Md Sahin Alom — a Product Designer and entrepreneur focused on creating
          useful, intuitive and business-driven digital experiences.
        </p>

        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap',
          opacity: in_ ? 1 : 0, transform: in_ ? 'none' : 'translateY(10px)',
          transition: 'opacity 0.6s 0.74s, transform 0.6s 0.74s',
        }}>
          <a href="#work" className="btn-primary">
            View my work
            <ArrowDown size={14} strokeWidth={1.5} />
          </a>
          <a href="#contact" className="btn-outline">
            Let's work together
            <ArrowUpRight size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, paddingTop: 40,
        opacity: in_ ? 1 : 0, transition: 'opacity 0.6s 1.3s',
      }}>
        <div style={{ width: 1, height: 52, background: `linear-gradient(var(--border-strong), transparent)` }} />
        <span className="mono" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--muted-light)', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>scroll</span>
      </div>
    </section>
  )
}

// ── Marquee strip ─────────────────────────────────────────────────────────────
function Strip() {
  const items = ['Product Design', 'UI/UX Design', 'SaaS Products', 'Web & Mobile', 'Design Systems', 'Digital Products', 'Entrepreneurship', 'UX Strategy', 'Product Thinking', 'Interaction Design']
  const all = [...items, ...items]
  return (
    <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden', padding: '16px 0' }}>
      <div className="marquee-track" style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}>
        {all.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase', whiteSpace: 'nowrap', padding: '0 20px' }}>{d}</span>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Work ──────────────────────────────────────────────────────────────────────
function ProjectItem({ p, index, onSelect }: { p: Project; index: number; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Reveal>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onSelect}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: 0,
          borderTop: index === 0 ? '1px solid var(--border)' : 'none',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden',
          cursor: 'pointer',
          minHeight: 460,
        }}
      >
        {/* Image pane */}
        <div style={{
          order: index % 2 === 0 ? 1 : 2,
          overflow: 'hidden',
          background: p.heroColor,
          position: 'relative',
          minHeight: 280,
        }}>
          <img
            src={p.heroImg} alt={p.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: hovered ? 0.75 : 0.6,
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
              minHeight: 280,
            }}
          />
          {/* Project number */}
          <span className="mono" style={{
            position: 'absolute', top: 24, left: 28,
            fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)',
          }}>
            {p.num}
          </span>
          {/* Year badge */}
          <span className="mono" style={{
            position: 'absolute', bottom: 24, right: 28,
            fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)',
          }}>
            {p.year}
          </span>
        </div>

        {/* Content pane */}
        <div style={{
          order: index % 2 === 0 ? 2 : 1,
          padding: 'clamp(36px, 5vw, 60px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          background: 'var(--bg)',
          borderLeft: index % 2 === 0 ? '1px solid var(--border)' : 'none',
          borderRight: index % 2 !== 0 ? '1px solid var(--border)' : 'none',
        }}>
          <div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
              <span className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--muted)', textTransform: 'uppercase' }}>{p.category}</span>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border-strong)' }} />
              <span className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: 'var(--muted-light)' }}>{p.platform}</span>
            </div>

            <h3 style={{
              fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto',
              fontSize: 'clamp(36px, 3.8vw, 60px)', fontWeight: 300,
              letterSpacing: '-0.03em', color: 'var(--fg)', lineHeight: 1, marginBottom: 16,
            }}>
              {p.name}
            </h3>

            <p style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', fontWeight: 300, color: 'var(--muted)', lineHeight: 1.72, marginBottom: 28 }}>
              {p.tagline}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {p.tags.slice(0, 3).map(t => (
                <span key={t} style={{
                  padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 2,
                  fontSize: 11, color: 'var(--muted-light)', letterSpacing: '0.01em',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginTop: 44,
            paddingTop: 28, borderTop: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>
              View case study
            </span>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border-strong)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              color: hovered ? 'var(--accent)' : 'var(--fg)',
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <ArrowUpRight size={14} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function Work({ onSelectProject }: { onSelectProject: (id: string) => void }) {
  return (
    <section id="work" style={{ padding: 'var(--section-py) 0' }}>
      <div style={{ padding: '0 var(--px)', maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <Label>Selected Work</Label>
              <h2 className="display-xl">Products I've designed</h2>
            </div>
            <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--muted)', maxWidth: 280, lineHeight: 1.7, paddingBottom: 8 }}>
              A selection of products, interfaces and digital experiences.
            </p>
          </div>
        </Reveal>
      </div>

      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        {PROJECTS.map((p, i) => (
          <ProjectItem key={p.id} p={p} index={i} onSelect={() => onSelectProject(p.id)} />
        ))}
      </div>
    </section>
  )
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)', padding: 'var(--section-py) var(--px)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div className="two-col" style={{ alignItems: 'start' }}>

          {/* Left: headline + image */}
          <div>
            <Reveal>
              <Label>About</Label>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto', fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--fg)', lineHeight: 1.05, marginBottom: 40 }}>
                Designer.<br />
                <em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>Problem solver.</em><br />
                Builder.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <div style={{ maxWidth: 320, borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '3/4', background: 'var(--border)' }}>
                <img
                  src={sahinPhoto}
                  alt="Md Sahin Alom"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </Reveal>
          </div>

          {/* Right: bio, stats, skills */}
          <div style={{ paddingTop: 'clamp(0px, 5vw, 72px)' }}>
            <Reveal>
              <p style={{ fontSize: 'clamp(15px, 1.3vw, 19px)', fontWeight: 300, color: 'var(--fg)', lineHeight: 1.72, marginBottom: 24 }}>
                I'm a Product & UI/UX Designer from Dhaka, Bangladesh, working at the intersection
                of design, strategy and digital product development.
              </p>
              <p style={{ fontSize: 15, fontWeight: 300, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 24 }}>
                Over the years I've designed end-to-end digital products — from concept and
                user research through to shipped interfaces — for startups, businesses and my
                own ventures. I care deeply about making complex systems feel clear and effortless.
              </p>
              <p style={{ fontSize: 15, fontWeight: 300, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 48 }}>
                Beyond client work, I founded <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Epixelab</strong> — a digital agency that blends design,
                development and strategy to help businesses build better digital products.
              </p>
            </Reveal>

            {/* Stats — horizontal rule style, not cards */}
            <Reveal delay={2}>
              <div style={{ display: 'flex', gap: 0, marginBottom: 44, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                {[{ n: '4+', l: 'Years experience' }, { n: '30+', l: 'Projects shipped' }, { n: '15+', l: 'Happy clients' }].map((s, i) => (
                  <div key={s.n} style={{ flex: 1, padding: 'clamp(18px, 3vw, 28px) 20px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(32px, 3vw, 44px)', fontWeight: 300, letterSpacing: '-0.04em', color: 'var(--fg)', lineHeight: 1 }}>{s.n}</div>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)', marginTop: 6, textTransform: 'uppercase' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={3}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Figma', 'Product Strategy', 'Design Systems', 'Prototyping', 'User Research', 'Interaction Design', 'Wireframing', 'Visual Design'].map(s => (
                  <span key={s} style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 2, fontSize: 11, color: 'var(--muted)' }}>{s}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Philosophy ───────────────────────────────────────────────────────────────
function Philosophy() {
  return (
    <section style={{ padding: 'var(--section-py) var(--px)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <Reveal>
          <Label>Design Philosophy</Label>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto', fontSize: 'clamp(32px, 4.5vw, 72px)', fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--fg)', lineHeight: 1.08, maxWidth: 800, marginBottom: 72 }}>
            Good design isn't decoration.
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>It's clarity.</em>
          </h2>
        </Reveal>

        {/* Principles as ruled text rows */}
        {[
          { n: '01', t: 'Understand', b: 'Every good solution starts with honest inquiry — into the people, the problem, and the context that surrounds it.' },
          { n: '02', t: 'Simplify', b: 'Remove what isn\'t necessary. Design is the discipline of knowing what to take away, not what to add.' },
          { n: '03', t: 'Build', b: 'Ideas only matter when they become real. Good design crosses the gap between concept and a thing people actually use.' },
        ].map((p, i) => (
          <Reveal key={p.n} delay={(i + 1) as 1 | 2 | 3}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '64px 1fr 1fr',
              gap: '0 clamp(20px, 4vw, 56px)',
              padding: 'clamp(28px, 3.5vw, 44px) 0',
              borderTop: '1px solid var(--border)',
              alignItems: 'start',
            }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--accent)', paddingTop: 4 }}>{p.n}</span>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto', fontSize: 'clamp(22px, 2.4vw, 36px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.1 }}>
                {p.t}
              </h3>
              <p style={{ fontSize: 15, fontWeight: 300, color: 'var(--muted)', lineHeight: 1.72 }}>{p.b}</p>
            </div>
          </Reveal>
        ))}
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </div>
    </section>
  )
}

// ── Epixelab ──────────────────────────────────────────────────────────────────
function Epixelab() {
  return (
    <section style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'var(--section-py) var(--px)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div className="two-col" style={{ alignItems: 'center', gap: 'clamp(48px, 8vw, 100px)' }}>
          <Reveal>
            <Label>Entrepreneurship</Label>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto', fontSize: 'clamp(36px, 4.5vw, 68px)', fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--fg)', lineHeight: 1.05, marginBottom: 28 }}>
              Beyond design,<br />
              <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>I build.</em>
            </h2>
            <p style={{ fontSize: 16, fontWeight: 300, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>
              <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Epixelab</strong> is the digital agency I founded to bridge
              great design and real business impact. We work with founders, startups and
              businesses to design and build products that perform.
            </p>
            <p style={{ fontSize: 15, fontWeight: 300, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 40 }}>
              This means I understand more than pixels — I understand production, timelines,
              budgets, and what it takes to get something shipped.
            </p>
            <a href="https://epixelab.com" target="_blank" rel="noopener noreferrer"
              className="btn-outline-sm">
              Visit Epixelab
              <ArrowUpRight size={13} strokeWidth={1.5} />
            </a>
          </Reveal>

          {/* Service list — ruled, no box borders */}
          <Reveal delay={2}>
            <div>
              {['Design', 'Development', 'Digital Products', 'E-commerce', 'Strategy & Marketing'].map((s, i) => (
                <div
                  key={s}
                  className="service-item"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 0',
                    borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 400, color: 'var(--fg)' }}>{s}</span>
                  <MoveRight size={14} strokeWidth={1.5} style={{ color: 'var(--muted-light)', flexShrink: 0 }} />
                </div>
              ))}
              <p className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted-light)', textTransform: 'uppercase', marginTop: 20 }}>
                Design-led studio · Dhaka, BD · Est. 2022
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── Services ──────────────────────────────────────────────────────────────────
const SVCS = [
  { n: '01', name: 'Product Design', desc: 'End-to-end product design from research to final UI.' },
  { n: '02', name: 'UI/UX Design', desc: 'Interfaces that are intuitive, accessible and beautiful.' },
  { n: '03', name: 'Website Design', desc: 'Marketing sites and web experiences with clear purpose.' },
  { n: '04', name: 'Mobile App Design', desc: 'Native iOS and Android app design that feels right.' },
  { n: '05', name: 'SaaS Product Design', desc: 'Complex dashboards, platforms and web products.' },
  { n: '06', name: 'Design Systems', desc: 'Scalable component libraries and design tokens.' },
  { n: '07', name: 'UX Strategy', desc: 'User research, flows and information architecture.' },
  { n: '08', name: 'Product Prototyping', desc: 'High-fidelity prototypes for testing and pitching.' },
]

function Services() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="services" style={{ padding: 'var(--section-py) var(--px)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <Label>Services</Label>
              <h2 className="display-xl">How I can help</h2>
            </div>
            <a href="#contact" className="btn-outline-sm">
              Start a project <ArrowUpRight size={13} strokeWidth={1.5} />
            </a>
          </div>
        </Reveal>

        <div>
          {SVCS.map((s, i) => (
            <Reveal key={s.n}>
              <div
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '44px 1fr auto',
                  gap: '0 20px',
                  alignItems: 'center',
                  padding: 'clamp(18px, 2.2vw, 26px) 0',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'default',
                }}
              >
                <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted-light)' }}>{s.n}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(12px, 2vw, 32px)', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto',
                    fontSize: 'clamp(18px, 2vw, 30px)', fontWeight: 300, letterSpacing: '-0.02em',
                    color: active === i ? 'var(--accent)' : 'var(--fg)',
                    transition: 'color 0.2s ease',
                  }}>
                    {s.name}
                  </span>
                  <span style={{
                    fontSize: 13, fontWeight: 300, color: 'var(--muted)',
                    opacity: active === i ? 1 : 0,
                    transform: active === i ? 'translateX(0)' : 'translateX(6px)',
                    transition: 'opacity 0.2s ease, transform 0.25s ease',
                    whiteSpace: 'nowrap',
                  }}>
                    {s.desc}
                  </span>
                </div>
                <ChevronRight
                  size={14} strokeWidth={1.5}
                  style={{
                    color: active === i ? 'var(--accent)' : 'var(--border-strong)',
                    transform: active === i ? 'translateX(3px)' : 'translateX(0)',
                    transition: 'color 0.2s, transform 0.25s cubic-bezier(0.16,1,0.3,1)',
                    flexShrink: 0,
                  }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Experience ────────────────────────────────────────────────────────────────
const EXP = [
  { period: '2022 — Now', role: 'Founder & Lead Designer', org: 'Epixelab', type: 'Agency', desc: 'Founded and lead a digital agency across design, product strategy and client delivery.' },
  { period: '2021 — Now', role: 'Freelance Product Designer', org: 'Independent', type: 'Freelance', desc: 'Working with founders and agencies on product design, SaaS UI/UX and web design globally.' },
  { period: '2020 — 2022', role: 'UI/UX Designer', org: 'Client Work', type: 'Design', desc: 'Delivered end-to-end digital product design across e-commerce, SaaS and mobile apps.' },
  { period: '2018 — 2022', role: 'BSc Computer Science', org: 'University', type: 'Education', desc: 'Technical foundations combined with design principles and systems thinking.' },
]

function Experience() {
  return (
    <section style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)', padding: 'var(--section-py) var(--px)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <Reveal>
          <Label>Experience</Label>
          <h2 className="display-xl" style={{ marginBottom: 56 }}>Background</h2>
        </Reveal>

        {EXP.map((e, i) => (
          <Reveal key={i}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'clamp(100px, 16%, 170px) 1fr auto',
              gap: '8px clamp(20px, 4vw, 48px)',
              padding: 'clamp(22px, 3vw, 36px) 0',
              borderBottom: '1px solid var(--border)',
              alignItems: 'start',
            }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.06em', color: 'var(--muted)', paddingTop: 3, lineHeight: 1.6 }}>{e.period}</span>
              <div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--fg)' }}>{e.role}</span>
                  <span style={{ fontSize: 13, fontWeight: 300, color: 'var(--muted)' }}>— {e.org}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>{e.desc}</p>
              </div>
              <span style={{
                padding: '3px 9px', border: '1px solid var(--border)', borderRadius: 2,
                fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', whiteSpace: 'nowrap',
                marginTop: 2,
              }}>
                {e.type}
              </span>
            </div>
          </Reveal>
        ))}

        <Reveal delay={2}>
          <div style={{ display: 'flex', gap: 24, marginTop: 48, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 300, color: 'var(--muted)' }}>Find me on</span>
            {['LinkedIn', 'Behance', 'Dribbble', 'Fiverr', 'Upwork'].map(s => (
              <a key={s} href="#" className="link-underline"
                style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)', textDecoration: 'none' }}>
                {s}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" style={{ background: 'var(--fg)', padding: 'clamp(100px, 14vh, 160px) var(--px)', textAlign: 'center' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <Reveal>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--bg)', opacity: 0.35, display: 'block', marginBottom: 40 }}>
            Let's work together
          </span>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto', fontSize: 'clamp(36px, 6vw, 92px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.06, color: 'var(--bg)', marginBottom: 28 }}>
            Have a product idea?
            <br />
            <em style={{ fontStyle: 'italic', opacity: 0.5 }}>Let's make it real.</em>
          </h2>
          <p style={{ fontSize: 'clamp(14px, 1.3vw, 17px)', fontWeight: 300, color: 'var(--bg)', opacity: 0.5, lineHeight: 1.7, maxWidth: 440, margin: '0 auto 52px' }}>
            Available for selected freelance projects, product design
            opportunities and collaborations.
          </p>
          <a href="mailto:info@sahinalom.com" className="btn-ghost-inv">
            Start a conversation
            <ArrowUpRight size={15} strokeWidth={1.5} />
          </a>
        </Reveal>
        <Reveal delay={3}>
          <p className="mono" style={{ marginTop: 72, fontSize: 11, color: 'var(--bg)', opacity: 0.22, letterSpacing: '0.08em' }}>
            sahinalom.com
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: 'clamp(40px,5vh,56px) var(--px)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 40 }}>
          <div>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--fg)', display: 'block', marginBottom: 6 }}>MSA</span>
            <span style={{ fontSize: 13, fontWeight: 300, color: 'var(--muted)' }}>Md Sahin Alom — Product Designer & Entrepreneur</span>
          </div>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Work', 'About', 'Services', 'Contact'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="link-underline footer-link">{l}</a>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['LinkedIn', 'Behance', 'Dribbble'].map(s => (
                <a key={s} href="#" className="link-underline footer-link">{s}</a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--muted-light)', letterSpacing: '0.04em' }}>© 2026 Md Sahin Alom. All rights reserved.</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--muted-light)', letterSpacing: '0.08em' }}>Zirabo, Ashulia, Savar, Dhaka</span>
        </div>
      </div>
    </footer>
  )
}

export default function Portfolio({ onSelectProject }: { onSelectProject: (id: string) => void }) {
  return (
    <main>
      <Hero />
      <Strip />
      <Work onSelectProject={onSelectProject} />
      <About />
      <Philosophy />
      <Epixelab />
      <Services />
      <Experience />
      <Contact />
      <Footer />
    </main>
  )
}
