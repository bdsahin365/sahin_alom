import { useState, useEffect, useRef, type ReactNode } from 'react'
import {
  ArrowUpRight, ArrowDown,
  Zap, Server, Wind, ShieldCheck, Network, Activity,
  MapPin, Mail, Phone, Globe,
} from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { supabase } from '../lib/supabase'
import sahinPhoto from '../img/sahin.png'

// ── Reveal ─────────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); io.disconnect() } },
      { threshold: 0.05 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function Reveal({ children, delay = 0, style = {} }: { children: ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal${delay ? ` reveal-delay-${delay}` : ''}`} style={style}>{children}</div>
  )
}

// Section index tag
function SIdx({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase' as const }}>{n}</span>
      <div style={{ width: 40, height: 1, background: 'var(--border-strong)' }} />
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--fg-dim)', textTransform: 'uppercase' as const }}>{label}</span>
    </div>
  )
}

const EXPERTISE_ICONS: Record<string, ReactNode> = {
  'power-systems': <Activity size={18} strokeWidth={1} />,
  'hv-substation': <Zap size={18} strokeWidth={1} />,
  'renewables':    <Wind size={18} strokeWidth={1} />,
  'protection':    <ShieldCheck size={18} strokeWidth={1} />,
  'grid-planning': <Network size={18} strokeWidth={1} />,
  'power-quality': <Server size={18} strokeWidth={1} />,
}

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const { data: { engineer: E } } = useSite()
  const [in_, setIn] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setIn(true), 80)
    const i = setInterval(() => setTick(n => n + 1), 1200)
    return () => { clearTimeout(t); clearInterval(i) }
  }, [])

  const fade = (delay: number): React.CSSProperties => ({
    opacity: in_ ? 1 : 0,
    transform: in_ ? 'none' : 'translateY(20px)',
    transition: `opacity 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.9s ${delay}s cubic-bezier(0.16,1,0.3,1)`,
  })

  // Split name words for staggered reveal
  const nameParts = (E.name || 'Md Sahin Alom').split(' ')

  return (
    <section id="hero" style={{
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: `calc(var(--nav-h) + 40px) var(--px) clamp(40px,6vh,72px)`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Structural grid lines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {[20, 40, 60, 80].map(pct => (
          <div key={pct} style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${pct}%`, width: 1,
            background: 'var(--border)',
            opacity: 0.5,
          }} />
        ))}
        {/* Amber vertical accent line */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '20%',
          width: 1, background: 'var(--accent)', opacity: 0.25,
        }} />
        {/* Horizontal rule at 60% height */}
        <div style={{
          position: 'absolute', top: '62%', left: 0, right: 0,
          height: 1, background: 'var(--border)',
        }} />
      </div>

      {/* Amber glow orb */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        width: 700, height: 700,
        transform: 'translate(-50%,-50%)',
        background: 'radial-gradient(circle, rgba(232,160,32,0.06) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Top bar */}
      <div style={{ ...fade(0.1), position: 'absolute', top: 'calc(var(--nav-h) + 24px)', left: 'var(--px)', right: 'var(--px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <SIdx n="01" label="Introduction" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: E.available ? 'var(--green)' : 'var(--fg-dim)', boxShadow: E.available ? '0 0 10px var(--green)' : 'none' }} />
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: E.available ? 'var(--green)' : 'var(--fg-dim)' }}>
            {E.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Main headline — massive condensed */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Name line */}
        <div style={{ ...fade(0.15), marginBottom: 'clamp(8px,1.5vh,20px)', display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' as const }}>{E.initials}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-strong)' }} />
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--fg-dim)', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>{E.location}</span>
        </div>

        {/* Giant type */}
        <h1 className="display" style={{
          fontSize: 'clamp(72px,13.5vw,210px)',
          lineHeight: 0.91,
          color: 'var(--fg)',
          marginBottom: 'clamp(6px,1vh,12px)',
        }}>
          {['Power', 'Systems'].map((word, i) => (
            <div key={word} style={{
              ...fade(0.22 + i * 0.08),
              display: 'flex', alignItems: 'flex-end', gap: '0.04em',
            }}>
              <span>{word}</span>
              {i === 0 && (
                <span style={{ fontSize: '0.25em', fontFamily: 'JetBrains Mono,monospace', fontWeight: 400, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '0.15em', paddingLeft: '0.2em', textTransform: 'uppercase' as const, lineHeight: 1 }}>
                  &amp;
                </span>
              )}
            </div>
          ))}
          <div style={fade(0.38)}>
            <span style={{ color: 'var(--accent)' }}>Engineer</span>
          </div>
        </h1>

        {/* Rule + tagline */}
        <div style={{ ...fade(0.48), display: 'flex', alignItems: 'flex-start', gap: 'clamp(24px,4vw,64px)', marginTop: 'clamp(20px,3vh,36px)', paddingTop: 'clamp(20px,3vh,36px)', borderTop: '1px solid var(--border-strong)', flexWrap: 'wrap' }}>
          <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(15px,1.5vw,18px)', color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 480, fontWeight: 300 }}>
            {E.tagline}
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginLeft: 'auto' }}>
            <a href="#contact" className="btn-primary" style={{ gap: 10, fontSize: 12 }}>
              Hire me <ArrowUpRight size={14} strokeWidth={2} />
            </a>
            <a href="#projects" className="btn-outline" style={{ fontSize: 12 }}>
              View work
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ ...fade(0.58), display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, marginTop: 'clamp(28px,4vh,56px)', borderTop: '1px solid var(--border)' }}>
          {[
            { v: E.yearsExp,      l: 'Years exp.' },
            { v: E.projectsMW,   l: 'Total Capacity' },
            { v: E.projectsCount, l: 'Projects' },
            { v: E.clients,       l: 'Clients' },
          ].map((s, i) => (
            <div key={s.l} style={{ padding: 'clamp(16px,2.5vh,24px) 0', borderRight: i < 3 ? '1px solid var(--border)' : 'none', paddingRight: i < 3 ? 24 : 0, paddingLeft: i > 0 ? 24 : 0 }}>
              <div className="display" style={{ fontSize: 'clamp(28px,4.5vw,56px)', color: 'var(--accent)', lineHeight: 1, marginBottom: 6 }}>{s.v}</div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase' as const }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ ...fade(0.7), position: 'absolute', bottom: 32, right: 'var(--px)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' as const }}>Scroll</span>
        <ArrowDown size={12} strokeWidth={2} style={{ color: 'var(--muted)', animation: `${tick % 2 === 0 ? 'none' : 'none'}`, opacity: 0.7 }} />
      </div>
    </section>
  )
}

// ── Credential Strip ─────────────────────────────────────────────────────────
function CredStrip() {
  const { data: { credentials } } = useSite()
  const items = [...credentials, ...credentials]
  return (
    <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-2)' }}>
      <div className="marquee-track" style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', gap: 0, padding: '0' }}>
        {items.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
            <div style={{ padding: 'clamp(14px,2vh,20px) clamp(24px,4vw,48px)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 3, height: 3, background: 'var(--accent)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 500, color: 'var(--fg)', letterSpacing: '0.02em' }}>{c.label}</span>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--fg-dim)', letterSpacing: '0.1em' }}>{c.value}</span>
            </div>
            <div style={{ width: 1, height: 16, background: 'var(--border-strong)', flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── About ────────────────────────────────────────────────────────────────────
function About() {
  const { data: { engineer: E } } = useSite()
  return (
    <section id="about" style={{ padding: 'var(--section-py) var(--px)', maxWidth: 'var(--max-w)', margin: '0 auto' }}>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'clamp(32px,5vh,60px)', marginBottom: 'clamp(40px,6vh,72px)' }}>
        <Reveal>
          <SIdx n="02" label="About" />
        </Reveal>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,400px),1fr))', gap: 'clamp(40px,7vw,100px)', alignItems: 'start' }}>
        {/* Left — portrait */}
        <Reveal>
          <div>
            {/* Portrait frame */}
            <div style={{
              aspectRatio: '4/5', background: 'var(--bg-3)',
              border: '1px solid var(--border-strong)',
              overflow: 'hidden', position: 'relative',
              boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
            }}>
              <img
                src={E.photo || sahinPhoto}
                alt={E.name || "Md Sahin Alom"}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Amber frame accent */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'var(--accent)' }} />
              <div style={{ position: 'absolute', top: 16, left: 16 }}>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' as const }}>ABC Licensed · Electrical Engineer</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right — bio */}
        <div>
          <Reveal>
            <h2 className="display" style={{ fontSize: 'clamp(40px,6vw,80px)', color: 'var(--fg)', marginBottom: 'clamp(24px,4vh,40px)', letterSpacing: '-0.01em' }}>
              {E.name}
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'clamp(24px,4vh,40px)', paddingBottom: 'clamp(24px,4vh,40px)', borderBottom: '1px solid var(--border)' }}>
              <span className="display" style={{ fontSize: 'clamp(14px,2vw,18px)', color: 'var(--accent)', letterSpacing: 0 }}>{E.title}</span>
              <div style={{ width: 4, height: 4, background: 'var(--border-strong)', borderRadius: '50%' }} />
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--fg-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{E.subtitle}</span>
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {(E.bio || []).map((p, i) => (
                <p key={i} style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(15px,1.4vw,17px)', color: 'var(--fg-dim)', lineHeight: 1.75, fontWeight: 300 }}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={3}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'clamp(28px,4vh,48px)', paddingTop: 'clamp(28px,4vh,48px)', borderTop: '1px solid var(--border)' }}>
              {[
                { icon: <MapPin size={14} strokeWidth={1.5} />, v: E.location },
                { icon: <Mail size={14} strokeWidth={1.5} />,   v: E.email },
                { icon: <Phone size={14} strokeWidth={1.5} />,  v: E.phone },
                { icon: <Globe size={14} strokeWidth={1.5} />,  v: E.linkedin, link: E.linkedin },
              ].filter(r => r.v).map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{r.icon}</span>
                  {r.link
                    ? <a href={r.link} target="_blank" rel="noopener noreferrer" className="link-line" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 14, color: 'var(--fg-dim)', fontWeight: 400 }}>{r.v}</a>
                    : <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 14, color: 'var(--fg-dim)' }}>{r.v}</span>
                  }
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── Expertise ────────────────────────────────────────────────────────────────
function Expertise() {
  const { data: { expertise } } = useSite()
  const [hov, setHov] = useState<number | null>(null)

  return (
    <section id="expertise" style={{ padding: 'var(--section-py) 0', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(40px,6vh,72px)', paddingBottom: 'clamp(32px,5vh,56px)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <SIdx n="03" label="Expertise" />
              <h2 className="display" style={{ fontSize: 'clamp(44px,7vw,96px)', color: 'var(--fg)', marginTop: 16 }}>Technical<br />Practice</h2>
            </div>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 15, color: 'var(--fg-dim)', maxWidth: 340, lineHeight: 1.7, fontWeight: 300 }}>
              {expertise.length} specialized areas spanning the full lifecycle of power infrastructure — from planning through commissioning.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,320px),1fr))', gap: 1, background: 'var(--border)' }}>
          {expertise.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3 + 1) as 1 | 2 | 3}>
              <div
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                style={{
                  padding: 'clamp(28px,4vw,48px)',
                  background: hov === i ? 'var(--bg-3)' : 'var(--bg-2)',
                  cursor: 'default',
                  transition: 'background 0.25s ease',
                  borderLeft: hov === i ? '2px solid var(--accent)' : '2px solid transparent',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Large background number */}
                <div className="display" style={{
                  position: 'absolute', top: -10, right: 16,
                  fontSize: 'clamp(80px,10vw,130px)',
                  color: 'var(--border-strong)',
                  lineHeight: 1, pointerEvents: 'none',
                  transition: 'color 0.25s',
                  ...(hov === i ? { color: 'rgba(232,160,32,0.07)' } : {}),
                }}>{item.num}</div>

                <div style={{ color: hov === i ? 'var(--accent)' : 'var(--fg-dim)', marginBottom: 20, transition: 'color 0.25s', position: 'relative', zIndex: 1 }}>
                  {EXPERTISE_ICONS[item.id] ?? <Zap size={18} strokeWidth={1} />}
                </div>
                <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(16px,1.8vw,20px)', fontWeight: 600, color: 'var(--fg)', marginBottom: 12, position: 'relative', zIndex: 1, lineHeight: 1.2 }}>{item.title}</h3>
                <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, marginBottom: 20, fontWeight: 300, position: 'relative', zIndex: 1 }}>{item.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, position: 'relative', zIndex: 1 }}>
                  {item.tags.slice(0, 4).map((t, j) => (
                    <span key={j} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Projects ─────────────────────────────────────────────────────────────────
function Projects() {
  const { data: { projects } } = useSite()
  const [active, setActive] = useState(0)
  const proj = projects[active]

  if (!projects.length) return null

  return (
    <section id="projects" style={{ padding: 'var(--section-py) 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)' }}>

        {/* Section header */}
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(32px,5vh,56px)', paddingBottom: 'clamp(24px,4vh,40px)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <SIdx n="04" label="Projects" />
              <h2 className="display" style={{ fontSize: 'clamp(44px,7vw,96px)', color: 'var(--fg)', marginTop: 16 }}>Featured<br />Work</h2>
            </div>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 15, color: 'var(--fg-dim)', maxWidth: 320, lineHeight: 1.7, fontWeight: 300 }}>
              Landmark infrastructure projects delivered across South Asia and beyond.
            </p>
          </div>
        </Reveal>

        {/* Tab strip */}
        <Reveal>
          <div style={{ display: 'flex', gap: 0, marginBottom: 'clamp(28px,4vh,48px)', overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid var(--border)' }}>
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                style={{
                  flexShrink: 0,
                  display: 'flex', flexDirection: 'column', gap: 6,
                  padding: 'clamp(14px,2.5vh,20px) clamp(16px,3vw,32px)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: active === i ? '2px solid var(--accent)' : '2px solid transparent',
                  marginBottom: -1,
                  textAlign: 'left' as const,
                  transition: 'border-color 0.2s',
                }}
              >
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: active === i ? 'var(--accent)' : 'var(--muted)', textTransform: 'uppercase' as const, transition: 'color 0.2s' }}>{p.num}</span>
                <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(13px,1.5vw,15px)', fontWeight: 600, color: active === i ? 'var(--fg)' : 'var(--fg-dim)', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>{p.title}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Active project showcase */}
        {proj && (
          <div key={proj.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>

            {/* ── Left: image + capacity ── */}
            <Reveal>
              <div style={{ position: 'relative' }}>
                {/* Ghosted project number */}
                <div className="display" style={{
                  position: 'absolute', top: -24, left: -8, zIndex: 0,
                  fontSize: 'clamp(100px,18vw,220px)', lineHeight: 1,
                  color: 'var(--border)', pointerEvents: 'none', userSelect: 'none',
                  letterSpacing: '-0.02em',
                }}>{proj.num}</div>

                {/* Image */}
                <div className="project-card" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3', background: proj.imgColor || '#D4CFC5', zIndex: 1 }}>
                  {proj.img
                    ? <img src={proj.img} alt={proj.title} className="project-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    : <div style={{ width: '100%', height: '100%', background: `linear-gradient(140deg, ${proj.imgColor || '#E8E4DA'}, var(--bg-3))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={48} strokeWidth={0.5} style={{ color: 'var(--accent)', opacity: 0.3 }} />
                      </div>
                  }
                  {/* Gradient overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />

                  {/* Capacity badge — bottom-left */}
                  {proj.capacity && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(16px,3vw,24px)' }}>
                      <div className="display" style={{ fontSize: 'clamp(28px,5vw,60px)', color: '#FFFFFF', lineHeight: 1, textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>{proj.capacity}</div>
                      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginTop: 4 }}>Installed Capacity</div>
                    </div>
                  )}

                  {/* Year — top right */}
                  <div style={{ position: 'absolute', top: 16, right: 16, padding: '4px 10px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.15em' }}>{proj.year}</span>
                  </div>
                </div>

                {/* Meta strip below image */}
                <div style={{ display: 'flex', gap: 0, marginTop: 2, background: 'var(--border)' }}>
                  {[
                    { l: 'Client',   v: proj.client },
                    { l: 'Location', v: proj.location },
                    { l: 'Category', v: proj.category },
                  ].filter(m => m.v).map((m, mi) => (
                    <div key={mi} style={{ flex: 1, padding: '12px 14px', background: 'var(--bg-2)' }}>
                      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' as const, marginBottom: 4 }}>{m.l}</div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: 'var(--fg)', fontWeight: 500, lineHeight: 1.3 }}>{m.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ── Right: details ── */}
            <Reveal delay={1}>
              <div style={{ paddingTop: 'clamp(0px,2vh,32px)' }}>
                {/* Title + category */}
                <div style={{ marginBottom: 'clamp(20px,3vh,36px)' }}>
                  <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.22em', color: 'var(--accent)', textTransform: 'uppercase' as const, marginBottom: 10 }}>{proj.category}</div>
                  <h3 className="display" style={{ fontSize: 'clamp(28px,4.5vw,56px)', color: 'var(--fg)', lineHeight: 0.95, marginBottom: 16 }}>{proj.title}</h3>
                  <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.75, fontWeight: 300 }}>{proj.summary}</p>
                </div>

                {/* Scope */}
                {proj.scope.length > 0 && (
                  <div style={{ marginBottom: 'clamp(20px,3vh,32px)', paddingBottom: 'clamp(20px,3vh,32px)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' as const, marginBottom: 16 }}>Scope of Work</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {proj.scope.map((s, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <div style={{ width: 18, height: 1, background: 'var(--accent)', marginTop: 9, flexShrink: 0 }} />
                          <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.6 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outcome callout */}
                {proj.outcome && (
                  <div style={{ padding: 'clamp(16px,2.5vw,24px)', background: 'var(--accent-dim)', borderLeft: '3px solid var(--accent)', marginBottom: 'clamp(20px,3vh,32px)' }}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.22em', color: 'var(--accent)', textTransform: 'uppercase' as const, marginBottom: 8 }}>Key Result</div>
                    <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 14, color: 'var(--fg)', lineHeight: 1.65, fontWeight: 400 }}>{proj.outcome}</p>
                  </div>
                )}

                {/* Deliverables */}
                {proj.deliverables.length > 0 && (
                  <div style={{ marginBottom: 'clamp(20px,3vh,32px)', paddingBottom: 'clamp(20px,3vh,32px)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' as const, marginBottom: 12 }}>Deliverables</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {proj.deliverables.map((d, j) => (
                        <span key={j} style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: 'var(--fg-dim)', padding: '5px 12px', background: 'var(--bg-3)', border: '1px solid var(--border)' }}>{d}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tools */}
                {proj.tools.length > 0 && (
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' as const, marginBottom: 12 }}>Software Used</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {proj.tools.map((t, j) => <span key={j} className="tag">{t}</span>)}
                    </div>
                  </div>
                )}

                {/* Prev / next navigation */}
                {projects.length > 1 && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 'clamp(24px,4vh,40px)', paddingTop: 'clamp(24px,4vh,40px)', borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={() => setActive(a => (a - 1 + projects.length) % projects.length)}
                      style={{ flex: 1, padding: '12px', background: 'var(--bg-2)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--fg-dim)', textTransform: 'uppercase' as const, transition: 'border-color 0.2s, color 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--fg-dim)' }}
                    >← Prev</button>
                    <button
                      onClick={() => setActive(a => (a + 1) % projects.length)}
                      style={{ flex: 1, padding: '12px', background: 'var(--accent)', border: '1px solid var(--accent)', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.12em', color: '#FFFFFF', textTransform: 'uppercase' as const, transition: 'opacity 0.2s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                    >Next →</button>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  )
}

// ── Services ──────────────────────────────────────────────────────────────────
function Services() {
  const { data: { services } } = useSite()
  const [hov, setHov] = useState<number | null>(null)

  return (
    <section id="services" style={{ padding: 'var(--section-py) 0', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(40px,6vh,72px)', paddingBottom: 'clamp(32px,5vh,56px)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <SIdx n="05" label="Services" />
              <h2 className="display" style={{ fontSize: 'clamp(44px,7vw,96px)', color: 'var(--fg)', marginTop: 16 }}>What I<br />Deliver</h2>
            </div>
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(Math.min(i + 1, 5)) as 1 | 2 | 3 | 4 | 5}>
              <div
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'clamp(20px,4vw,56px)',
                  padding: 'clamp(20px,3vh,32px) 0',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'default',
                  transition: 'padding-left 0.3s cubic-bezier(0.16,1,0.3,1)',
                  paddingLeft: hov === i ? 'clamp(10px,2vw,24px)' : 0,
                }}
              >
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: hov === i ? 'var(--accent)' : 'var(--muted)', letterSpacing: '0.2em', flexShrink: 0, minWidth: 28, transition: 'color 0.2s' }}>{s.num}</span>
                <div style={{ width: hov === i ? 32 : 0, height: 1, background: 'var(--accent)', transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(16px,2vw,22px)', fontWeight: 500, color: hov === i ? 'var(--fg)' : 'var(--fg-dim)', transition: 'color 0.2s', flex: 1 }}>{s.name}</span>
                <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: 'var(--muted)', display: 'block', maxWidth: 300, lineHeight: 1.5, textAlign: 'right' as const }}>{s.detail}</span>
                <ArrowUpRight size={14} strokeWidth={1.5} style={{ color: hov === i ? 'var(--accent)' : 'transparent', transition: 'color 0.2s', flexShrink: 0 }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Education ─────────────────────────────────────────────────────────────────
function Education() {
  const { data: { education, settings } } = useSite()

  return (
    <section id="education" style={{ padding: 'var(--section-py) 0' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)' }}>
        <Reveal>
          <div style={{ paddingBottom: 'clamp(32px,5vh,56px)', marginBottom: 'clamp(40px,6vh,72px)', borderBottom: '1px solid var(--border)' }}>
            <SIdx n="06" label="Education" />
            <h2 className="display" style={{ fontSize: 'clamp(44px,7vw,96px)', color: 'var(--fg)', marginTop: 16 }}>Background<br />&amp; Training</h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))', gap: 'clamp(40px,7vw,96px)' }}>
          {/* Timeline */}
          <div>
            <Reveal>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase' as const, marginBottom: 32 }}>Academic Timeline</div>
            </Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {education.map((e, i) => (
                <Reveal key={i} delay={(Math.min(i + 1, 5)) as 1 | 2 | 3 | 4 | 5}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 0, position: 'relative' }}>
                    {/* Year */}
                    <div style={{ paddingTop: 4, paddingRight: 24, textAlign: 'right' as const }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.05em', lineHeight: 1 }}>{e.period}</span>
                    </div>
                    {/* Content */}
                    <div style={{ paddingLeft: 24, paddingBottom: 36, borderLeft: '1px solid var(--border-strong)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 6, left: -4, width: 7, height: 7, border: '1px solid var(--accent)', background: 'var(--bg)', borderRadius: '50%' }} />
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(15px,1.5vw,17px)', fontWeight: 600, color: 'var(--fg)', marginBottom: 4, lineHeight: 1.3 }}>{e.degree}</div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: 'var(--fg-dim)', marginBottom: 4 }}>{e.institution}</div>
                      {e.note && <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em' }}>{e.note}</div>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Tools */}
          <Reveal delay={2}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase' as const, marginBottom: 32 }}>Software &amp; Tools</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(settings.tools || []).map((t, i) => (
                  <span key={i} className="tag" style={{ cursor: 'default' }}>{t}</span>
                ))}
              </div>

              {/* Expertise highlight */}
              <div style={{ marginTop: 48, padding: 'clamp(24px,4vw,40px)', background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase' as const, marginBottom: 20 }}>Core Specialization</div>
                <div className="display" style={{ fontSize: 'clamp(28px,4.5vw,56px)', color: 'var(--fg)', lineHeight: 0.95, marginBottom: 20 }}>Power<br />Systems<br />Analysis</div>
                <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, fontWeight: 300 }}>
                  From load flow studies to fault analysis, protection coordination to harmonic assessment — delivering engineering rigour on every engagement.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const { data: { engineer: E } } = useSite()
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [sending, setSending] = useState(false)
  const [formErr, setFormErr] = useState('')

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setSending(true)
    setFormErr('')
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name, email: form.email,
      subject: form.subject, message: form.message,
    })
    setSending(false)
    if (error) {
      setFormErr('Something went wrong. Please try emailing directly.')
    } else {
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSent(false), 6000)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 0',
    background: 'transparent',
    border: 'none', borderBottom: '1px solid var(--border-strong)',
    color: 'var(--fg)', fontFamily: 'Outfit,sans-serif', fontSize: 15,
    outline: 'none', fontWeight: 300,
    transition: 'border-color 0.2s',
  }

  return (
    <section id="contact" style={{ padding: 'var(--section-py) 0', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)' }}>
        <Reveal>
          <div style={{ paddingBottom: 'clamp(32px,5vh,56px)', marginBottom: 'clamp(40px,6vh,72px)', borderBottom: '1px solid var(--border)' }}>
            <SIdx n="07" label="Contact" />
            <h2 className="display" style={{ fontSize: 'clamp(44px,7vw,96px)', color: 'var(--fg)', marginTop: 16 }}>Start a<br />Project</h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))', gap: 'clamp(40px,7vw,100px)' }}>
          {/* Info panel */}
          <Reveal>
            <div>
              <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(16px,1.8vw,20px)', color: 'var(--fg-dim)', lineHeight: 1.75, fontWeight: 300, marginBottom: 'clamp(28px,5vh,48px)' }}>
                Available for consulting engagements, full-time opportunities, and infrastructure advisory across energy transition projects.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
                {[
                  { label: 'Email', value: E.email,   href: `mailto:${E.email}` },
                  { label: 'Phone', value: E.phone,   href: `tel:${E.phone}` },
                  { label: 'LinkedIn', value: 'Connect on LinkedIn', href: E.linkedin },
                ].filter(r => r.value).map((r, i) => (
                  <div key={i} style={{ paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' as const, marginBottom: 6 }}>{r.label}</div>
                    <a href={r.href} target={r.label === 'LinkedIn' ? '_blank' : undefined} rel="noopener noreferrer" className="link-line"
                      style={{ fontFamily: 'Outfit,sans-serif', fontSize: 16, color: 'var(--fg)', fontWeight: 400 }}>
                      {r.value}
                    </a>
                  </div>
                ))}
              </div>

              {/* Availability callout */}
              <div style={{ padding: 'clamp(20px,3vw,32px)', border: `1px solid ${E.available ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`, background: E.available ? 'rgba(34,197,94,0.05)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: E.available ? 'var(--green)' : 'var(--muted)', boxShadow: E.available ? '0 0 10px var(--green)' : 'none' }} />
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: E.available ? 'var(--green)' : 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
                    {E.available ? 'Currently available' : 'Not available'}
                  </span>
                </div>
                <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.65, fontWeight: 300 }}>
                  {E.available ? 'Open to new consulting projects and full-time roles starting immediately.' : 'Not currently accepting new projects — check back soon.'}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={2}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { key: 'name',    label: 'Full Name',     type: 'text' },
                { key: 'email',   label: 'Email Address', type: 'email' },
                { key: 'subject', label: 'Subject',       type: 'text' },
              ].map(f => (
                <label key={f.key} style={{ display: 'block' }}>
                  <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' as const, marginBottom: 4 }}>{f.label}</div>
                  <input
                    type={f.type}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    required
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--accent)')}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = 'var(--border-strong)')}
                  />
                </label>
              ))}
              <label style={{ display: 'block', marginBottom: 32 }}>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' as const, marginBottom: 4, marginTop: 8 }}>Message</div>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required
                  style={{ ...inputStyle, resize: 'none' as const }}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderBottomColor = 'var(--border-strong)')}
                />
              </label>

              {formErr && (
                <div style={{ padding: '10px 14px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', fontFamily: 'Outfit,sans-serif', fontSize: 13, color: 'var(--red)', marginBottom: 4 }}>
                  {formErr}
                </div>
              )}

              <button type="submit" disabled={sending} className="btn-primary" style={{ alignSelf: 'flex-start', letterSpacing: '0.08em', opacity: sending ? 0.7 : 1 }}>
                {sent ? '✓ Message sent' : sending ? 'Sending…' : <>Send message <ArrowUpRight size={14} strokeWidth={2} /></>}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const { data: { engineer: E } } = useSite()
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: 'clamp(28px,5vh,48px) var(--px)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 24, height: 24, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={12} strokeWidth={2.5} style={{ color: '#FFFFFF' }} />
          </div>
          <span className="display" style={{ fontSize: 20, color: 'var(--fg)', letterSpacing: 0 }}>{E.initials}</span>
        </div>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
          &copy; {new Date().getFullYear()} {E.name} · Power Systems Engineer
        </span>
        <a href="#hero" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--fg-dim)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}>
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function EngineerPortfolio() {
  return (
    <>
      <Hero />
      <CredStrip />
      <About />
      <Expertise />
      <Projects />
      <Services />
      <Education />
      <Contact />
      <Footer />
    </>
  )
}
