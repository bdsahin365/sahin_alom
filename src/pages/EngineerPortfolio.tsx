import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ArrowUpRight, ArrowDown,
  Zap, ShieldCheck, Activity, Wind, Layers,
  Mail, Phone, Globe, Download, CheckCircle2,
  Calendar, MapPin, Building,
} from 'lucide-react'
import { useSite, type Project } from '../context/SiteContext'
import { supabase } from '../lib/supabase'
import sahinPhoto from '../img/sahin.png'
import designerImg from '../img/designer.png'
import engineerImg from '../img/engineer.png'
import HeaderLogo from '../components/HeaderLogo'

// ── Physics & Transitions ───────────────────────────────────────────────────
export const luxuryEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const springSmooth = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 24,
  mass: 0.8,
}

// ── Hardware-Accelerated Scroll Reveal ──────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  direction = 'up',
  style = {},
  className = '',
}: {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  style?: React.CSSProperties
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-6% 0px' })
  const offset = 24

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
        x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
      }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{
        duration: 0.72,
        delay: delay * 0.08,
        ease: luxuryEase,
      }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ── Section Index Label ──────────────────────────────────────────────────────
function SIdx({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10,
        letterSpacing: '0.22em',
        color: 'var(--accent)',
        textTransform: 'uppercase',
        fontWeight: 700,
      }}>
        {n}
      </span>
      <div style={{ width: 42, height: 1, background: 'var(--border-strong)' }} />
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10,
        letterSpacing: '0.2em',
        color: 'var(--fg-dim)',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}>
        {label}
      </span>
    </div>
  )
}

// ── Spotlight Constants & Reveal Layer ───────────────────────────────────────
const SPOTLIGHT_R = 280

function RevealLayer({
  image,
  cursorX,
  cursorY,
}: {
  image: string
  cursorX: number
  cursorY: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const divRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const sync = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const div    = divRef.current
    if (!canvas || !div) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const g = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R)
    g.addColorStop(0,    'rgba(255,255,255,1)')
    g.addColorStop(0.4,  'rgba(255,255,255,1)')
    g.addColorStop(0.6,  'rgba(255,255,255,0.75)')
    g.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    g.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    g.addColorStop(1,    'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
    ctx.fill()

    const url = canvas.toDataURL()
    div.style.maskImage          = `url(${url})`
    div.style.webkitMaskImage    = `url(${url})`
    div.style.maskSize           = '100% 100%'
    ;(div.style as any).webkitMaskSize = '100% 100%'
  })

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none', position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div
        ref={divRef}
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          zIndex: 25, pointerEvents: 'none',
        }}
      />
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 1. HERO SECTION (Clean, Premium, Two Buttons Only, No Pill)
// ════════════════════════════════════════════════════════════════════════════
function Hero() {
  const { data: { engineer: E } } = useSite()
  const [in_, setIn]           = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })
  const [isTouch, setIsTouch]  = useState(false)
  const mouseRef  = useRef({ x: -999, y: -999 })
  const smoothRef = useRef({ x: -999, y: -999 })
  const rafRef    = useRef<number | null>(null)
  const navigate  = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => setIn(true), 80)
    if (window.matchMedia('(hover: none)').matches) setIsTouch(true)

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = e.touches[0].clientY
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchstart', onTouch, { passive: true })

    const loop = () => {
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.12
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.12
      setCursorPos({ x: smoothRef.current.x, y: smoothRef.current.y })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      clearTimeout(t)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchstart', onTouch)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-black select-none"
      style={{ minHeight: '100dvh', height: '100dvh' }}
    >
      {/* Layer 1: Base image (Ken Burns zoom) */}
      <div
        className="hero-zoom absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${data.settings.hero?.imageBase || designerImg})`, zIndex: 10 }}
      />

      {/* Cinematic Vignette */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
          background: [
            'linear-gradient(to bottom,',
            '  rgba(0,0,0,0.72) 0%,',
            '  rgba(0,0,0,0.30) 35%,',
            '  rgba(0,0,0,0.30) 65%,',
            '  rgba(0,0,0,0.85) 100%)',
          ].join(''),
        }}
      />

      {/* Layer 2: Cursor / touch spotlight reveal */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
        <RevealLayer image={data.settings.hero?.imageReveal || engineerImg} cursorX={cursorPos.x} cursorY={cursorPos.y} />
      </div>

      {/* ════ Center Hero Content (Pure Typographic Impact) ════ */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center text-center pointer-events-none"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 50,
          padding: '0 clamp(18px, 5vw, 48px)',
        }}
      >
        {/* Main Headline */}
        <h1 style={{ margin: 0, lineHeight: 0.92 }}>
          <span
            className="block font-playfair italic hero-anim hero-reveal"
            style={{
              color: '#FFFFFF',
              letterSpacing: '-0.04em',
              fontSize: 'clamp(42px, 10vw, 112px)',
              animationDelay: '0.18s',
              textShadow: '0 4px 32px rgba(0,0,0,0.65)',
            }}
          >
            {data.settings.hero?.headlineLine1 || 'Power Systems'}
          </span>
          <span
            className="block hero-anim hero-reveal"
            style={{
              color: '#FFFFFF',
              letterSpacing: '-0.035em',
              fontSize: 'clamp(34px, 8.8vw, 98px)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              textTransform: 'uppercase',
              animationDelay: '0.34s',
              textShadow: '0 4px 32px rgba(0,0,0,0.65)',
            }}
          >
            {data.settings.hero?.headlineLine2 || '& Engineering'}
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="hero-anim hero-fade mt-5 sm:mt-6"
          style={{
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.65,
            fontSize: 'clamp(14px, 3.2vw, 18px)',
            maxWidth: 'min(580px, 92vw)',
            animationDelay: '0.5s',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 350,
            textShadow: '0 2px 16px rgba(0,0,0,0.8)',
          }}
        >
          {data.settings.hero?.tagline || E.tagline || 'High-voltage substation design, protection coordination, and renewable grid interconnection engineered to international standards (IEC / IEEE / BNBC).'}
        </p>

        {/* CTAs: Exactly Two Buttons (Contact & CV) */}
        <div
          className="hero-anim hero-fade flex flex-wrap items-center justify-center gap-4 mt-7 sm:mt-9 pointer-events-auto"
          style={{ animationDelay: '0.66s' }}
        >
          <Link
            to={data.settings.hero?.ctaPrimaryLink || '/contact'}
            style={{
              background: 'var(--accent)', color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif", fontWeight: 600,
              fontSize: 'clamp(12.5px, 2.8vw, 14px)',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              padding: '14px 32px',
              borderRadius: 8,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(196,125,14,0.45)',
              transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease',
              minWidth: 150, justifyContent: 'center',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 14px 38px rgba(196,125,14,0.6)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = ''
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(196,125,14,0.45)'
            }}
          >
            {data.settings.hero?.ctaPrimaryText || 'Contact Me'} <ArrowUpRight size={15} strokeWidth={2.2} />
          </Link>

          <Link
            to={data.settings.hero?.ctaSecondaryLink || '/cv'}
            style={{
              background: 'rgba(255,255,255,0.12)', color: '#FFFFFF',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.32)',
              fontFamily: "'Inter', sans-serif", fontWeight: 500,
              fontSize: 'clamp(12.5px, 2.8vw, 14px)',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              padding: '14px 30px',
              borderRadius: 8,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              textDecoration: 'none',
              transition: 'background 0.2s, transform 0.25s cubic-bezier(0.16,1,0.3,1)',
              minWidth: 140, justifyContent: 'center',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'
              ;(e.currentTarget as HTMLElement).style.transform = ''
            }}
          >
            <Download size={14} /> {data.settings.hero?.ctaSecondaryText || 'View CV'}
          </Link>
        </div>

        {/* Mobile Stats Ribbon */}
        <div
          className="sm:hidden hero-anim hero-fade w-full mt-7 pointer-events-auto"
          style={{ animationDelay: '0.8s', maxWidth: 'min(380px, 92vw)' }}
        >
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            background: 'rgba(10, 13, 20, 0.65)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 10,
            padding: '10px 8px',
          }}>
            {[
              { v: E.yearsExp,       l: 'Experience' },
              { v: E.projectsMW,    l: 'Capacity'   },
              { v: E.projectsCount, l: 'Projects'   },
            ].map((s, i) => (
              <div
                key={s.l}
                style={{
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : undefined,
                  textAlign: 'center',
                }}
              >
                <div className="display" style={{ fontSize: 22, color: 'var(--accent)', lineHeight: 1 }}>
                  {s.v}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginTop: 3 }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ Desktop Bottom Ribbon (Identity Left / Stats Right) ════ */}
      <div
        className="hero-anim hero-fade hidden sm:flex absolute justify-between items-end"
        style={{ bottom: 36, left: 'var(--px, 40px)', right: 'var(--px, 40px)', zIndex: 50, animationDelay: '0.75s' }}
      >
        {/* Left: Identity */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5, letterSpacing: '0.22em', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700 }}>
              {E.initials || 'MSA'}
            </span>
            <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.35)' }} />
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
              Electrical Engineer
            </span>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14.5, color: '#FFFFFF', margin: 0 }}>
            {E.name}
          </p>
        </div>

        {/* Center: Scroll Cue */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8.5, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={13} style={{ color: 'rgba(255,255,255,0.5)' }} strokeWidth={1.8} />
          </motion.div>
        </div>

        {/* Right: Glass Stats Box */}
        <div
          style={{
            background: 'rgba(10, 13, 20, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 10,
            padding: '12px 20px',
            width: 320,
          }}
        >
          <p style={{
            fontFamily: 'JetBrains Mono,monospace', fontSize: 8.5, letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 8, textAlign: 'right',
          }}>
            {isTouch ? '✦ Tap to spotlight' : '↖ Move cursor to reveal'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { v: E.yearsExp,       l: 'Yrs Exp.'  },
              { v: E.projectsMW,    l: 'Capacity'  },
              { v: E.projectsCount, l: 'Delivered' },
            ].map((s, i) => (
              <div key={s.l} style={{ textAlign: i === 0 ? 'left' : i === 2 ? 'right' : 'center' }}>
                <div className="display" style={{ fontSize: 26, color: 'var(--accent)', lineHeight: 1 }}>
                  {s.v}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginTop: 3 }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 2. TRUST & ACCREDITATION TICKER (MARQUEE)
// ════════════════════════════════════════════════════════════════════════════
function CredStrip() {
  const { data: { credentials } } = useSite()
  const items = [...credentials, ...credentials]

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      overflow: 'hidden',
      background: 'var(--bg-2)',
      position: 'relative',
    }}>
      <div className="marquee-track" style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', padding: 0 }}>
        {items.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ padding: 'clamp(14px, 2vh, 18px) clamp(24px, 4vw, 44px)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600, color: 'var(--fg)', letterSpacing: '0.01em' }}>
                {c.label}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5, color: 'var(--fg-dim)', letterSpacing: '0.08em', fontWeight: 500 }}>
                {c.value}
              </span>
            </div>
            <div style={{ width: 1, height: 18, background: 'var(--border-strong)', flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 3. EDITORIAL ABOUT SECTION (Premium Typography & Precision)
// ════════════════════════════════════════════════════════════════════════════
function About() {
  const { data: { engineer: E } } = useSite()
  const navigate = useNavigate()

  return (
    <section id="about" style={{ padding: 'var(--section-py) var(--px)', maxWidth: 'var(--max-w)', margin: '0 auto' }}>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'clamp(28px, 4.5vh, 48px)', marginBottom: 'clamp(36px, 5vh, 64px)' }}>
        <Reveal>
          <SIdx n="02" label="Engineering Profile" />
        </Reveal>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(36px, 6vw, 84px)', alignItems: 'start' }}>
        {/* Left: Portrait Card with Architectural Border */}
        <Reveal>
          <div style={{ position: 'relative' }}>
            <div style={{
              aspectRatio: '4/5',
              background: 'var(--bg-3)',
              border: '1px solid var(--border-strong)',
              borderRadius: 8,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
            }}>
              <img
                src={E.photo || sahinPhoto}
                alt={E.name || "Md Sahin Alom"}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Bottom Gradient Overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(10,13,20,0.85) 0%, transparent 45%)',
                pointerEvents: 'none',
              }} />

              {/* Verification Stamp Top Left */}
              <div style={{
                position: 'absolute', top: 16, left: 16,
                background: 'rgba(10,13,20,0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 4, padding: '5px 12px',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <CheckCircle2 size={12} style={{ color: 'var(--accent)' }} />
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5,
                  letterSpacing: '0.14em', color: '#FFFFFF', textTransform: 'uppercase', fontWeight: 600,
                }}>
                  ABC Certified Engineer
                </span>
              </div>

              {/* Bottom Details Overlay */}
              <div style={{ position: 'absolute', bottom: 18, left: 20, right: 20 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>
                  {E.name}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
                  Senior Power Systems Engineer · Substation Specialist
                </div>
              </div>
            </div>

            {/* Quick Contact Ribbon below portrait */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 14,
            }}>
              <a
                href={`mailto:${E.email}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px',
                  background: 'var(--bg-2)', border: '1px solid var(--border)',
                  borderRadius: 6, textDecoration: 'none', color: 'var(--fg)',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
              >
                <Mail size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, color: 'var(--muted)', textTransform: 'uppercase' }}>Email</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {E.email}
                  </div>
                </div>
              </a>

              <a
                href={E.whatsapp ? `https://wa.me/${E.whatsapp}` : `tel:${E.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px',
                  background: 'var(--bg-2)', border: '1px solid var(--border)',
                  borderRadius: 6, textDecoration: 'none', color: 'var(--fg)',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
              >
                <Phone size={14} style={{ color: 'var(--green)', flexShrink: 0 }} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, color: 'var(--muted)', textTransform: 'uppercase' }}>Direct / WhatsApp</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {E.whatsapp || E.phone}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </Reveal>

        {/* Right: Technical Biography & Action Panel */}
        <div>
          <Reveal>
            <h2 className="display" style={{
              fontSize: 'clamp(28px, 5vw, 72px)',
              color: 'var(--fg)',
              marginBottom: 'clamp(16px, 3vh, 28px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.12,
            }}>
              <span className="font-playfair italic font-normal" style={{ textTransform: 'none', marginRight: 10, color: 'var(--accent)' }}>
                High Voltage
              </span>
              <span style={{ fontSize: '0.86em', letterSpacing: '-0.02em' }}>Precision.</span><br />
              <span style={{ fontSize: '0.86em', letterSpacing: '-0.02em' }}>Zero Fault Tolerance.</span>
            </h2>
          </Reveal>

          <Reveal delay={1}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--fg)' }}>
                {E.title}
              </span>
              <div style={{ width: 4, height: 4, background: 'var(--border-strong)', borderRadius: '50%' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 600 }}>
                {E.subtitle || 'Power Systems & Substation Design Specialist'}
              </span>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(E.bio || [
                "Md Sahin Alom is a specialized Electrical Engineer with extensive hands-on expertise in high-voltage substation engineering, industrial power distribution, and power system protection across South Asia.",
                "Proven track record delivering end-to-end electrical design for 33/11kV substations, industrial manufacturing plants, commercial towers, and utility-scale solar PV interconnections adhering strictly to BNBC 2020, IEEE, and IEC standards."
              ]).map((p, i) => (
                <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(15px, 1.3vw, 17px)', color: 'var(--fg-dim)', lineHeight: 1.75, fontWeight: 350 }}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Key Engineering Pillars */}
          <Reveal delay={3}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12,
              marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)',
            }}>
              {[
                { title: 'Substation Engineering', desc: '33/11kV & 132/33kV SLD, GIS/AIS layout, and transformer sizing.' },
                { title: 'Protection Coordination', desc: 'Relay settings, short circuit calculations & discrimination.' },
                { title: 'BNBC 2020 Compliance', desc: 'Complete building electrical safety, LPS & earthing compliance.' },
              ].map(pillar => (
                <div
                  key={pillar.title}
                  style={{
                    padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--border)',
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--fg)', marginBottom: 4 }}>
                    {pillar.title}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: 'var(--fg-dim)', lineHeight: 1.5 }}>
                    {pillar.desc}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Action Buttons */}
          <Reveal delay={4}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32 }}>
              <button
                onClick={() => navigate('/cv')}
                className="btn-primary"
                style={{ borderRadius: 6, padding: '12px 24px' }}
              >
                <Download size={14} /> Download Certified CV
              </button>
              <button
                onClick={() => navigate('/biodata')}
                className="btn-outline"
                style={{ borderRadius: 6, padding: '12px 24px' }}
              >
                View Complete Biodata
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 4. TECHNICAL PRACTICE (BENTO GRID WITH EDITORIAL TYPOGRAPHY)
// ════════════════════════════════════════════════════════════════════════════
const PRACTICE_CARDS = [
  {
    id: 'substation',
    num: '01',
    title: 'High-Voltage Substation Design',
    desc: 'Turnkey engineering for 33/11kV and 132/33kV substations including Single-Line Diagrams (SLD), AIS/GIS switchgear configuration, and outdoor yard layouts.',
    icon: <Zap size={22} strokeWidth={1.6} />,
    tags: ['33/11kV Substation', 'SLD Schematics', 'GIS & AIS', 'Busbar Sizing', 'IEC 61936'],
    span: 'col-span-1 md:col-span-2',
    highlight: '100+ MW Substation Capacity Designed',
  },
  {
    id: 'protection',
    num: '02',
    title: 'Protection & Arc Flash Coordination',
    desc: 'Relay coordination studies, short-circuit current calculations (IEC 60909), and trip curve discrimination to guarantee zero cascading outages.',
    icon: <ShieldCheck size={22} strokeWidth={1.6} />,
    tags: ['Relay Discrimination', 'Short Circuit IEC 60909', 'Arc Flash IEEE 1584', 'Trip Curves'],
    span: 'col-span-1',
  },
  {
    id: 'cable',
    num: '03',
    title: 'Industrial Power Distribution',
    desc: 'Precise cable ampacity sizing, thermal derating factors, short-circuit withstand checks, and voltage drop optimization for high-demand industrial plants.',
    icon: <Activity size={22} strokeWidth={1.6} />,
    tags: ['Cable Derating', 'Busway Systems', 'Voltage Drop', 'Load Flow ETAP'],
    span: 'col-span-1',
  },
  {
    id: 'solar',
    num: '04',
    title: 'Renewable Solar PV Grid Integration',
    desc: 'MW-scale solar PV plant electrical balance of system (eBOS), central inverter stations, MV step-up transformers, and utility grid interconnection.',
    icon: <Wind size={22} strokeWidth={1.6} />,
    tags: ['Utility Solar PV', 'Inverter Stations', 'PVSyst Simulation', 'Grid-Tie Compliance'],
    span: 'col-span-1',
  },
  {
    id: 'bnbc',
    num: '05',
    title: 'Building Compliance & BNBC 2020',
    desc: 'Code-compliant building electrical design, lightning protection systems (LPS), Dialux lighting calculations, and deep earthing grid networks.',
    icon: <Layers size={22} strokeWidth={1.6} />,
    tags: ['BNBC 2020', 'Dialux evo', 'LPS NFC 17-102', 'Earthing Resistance'],
    span: 'col-span-1 md:col-span-2',
    highlight: 'Full Statutory Safety Approvals Guaranteed',
  },
]

function Expertise() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="services" style={{ padding: 'var(--section-py) 0', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)' }}>
        <Reveal>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: 'clamp(36px, 5vh, 64px)', paddingBottom: 'clamp(28px, 4vh, 48px)',
            borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <SIdx n="03" label="Technical Practice" />
              <h2 className="display" style={{
                fontSize: 'clamp(28px, 5.5vw, 76px)',
                color: 'var(--fg)',
                marginTop: 16,
                lineHeight: 1.1,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                gap: '0 clamp(8px, 1.4vw, 14px)',
              }}>
                <span className="font-playfair italic font-normal" style={{ textTransform: 'none' }}>
                  Technical
                </span>
                <span style={{ fontSize: '0.84em', letterSpacing: '-0.02em' }}>
                  Practice
                </span>
              </h2>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'var(--fg-dim)', maxWidth: 360, lineHeight: 1.7, fontWeight: 350 }}>
              Specialized electrical engineering across the complete infrastructure lifecycle — from mathematical feasibility and simulation to physical commissioning.
            </p>
          </div>
        </Reveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRACTICE_CARDS.map((card, idx) => {
            const isHov = hovered === card.id
            return (
              <Reveal key={card.id} delay={idx} className={card.span}>
                <motion.div
                  onMouseEnter={() => setHovered(card.id)}
                  onMouseLeave={() => setHovered(null)}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  style={{
                    height: '100%',
                    padding: 'clamp(24px, 3.5vw, 36px)',
                    background: isHov ? 'var(--bg-3)' : 'var(--card-bg)',
                    border: '1px solid',
                    borderColor: isHov ? 'var(--accent)' : 'var(--border)',
                    borderRadius: 8,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isHov ? '0 16px 36px rgba(0,0,0,0.08)' : 'none',
                    transition: 'border-color 0.25s ease, background 0.25s ease',
                  }}
                >
                  {/* Huge background number */}
                  <div
                    className="display"
                    style={{
                      position: 'absolute', top: -10, right: 14,
                      fontSize: 'clamp(80px, 9vw, 120px)',
                      color: 'var(--border)',
                      lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
                      opacity: isHov ? 0.35 : 0.2,
                      transition: 'opacity 0.25s',
                    }}
                  >
                    {card.num}
                  </div>

                  <div>
                    {/* Header: Icon + Highlight Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 6,
                        background: isHov ? 'var(--accent)' : 'var(--accent-dim)',
                        color: isHov ? '#FFFFFF' : 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.25s ease',
                      }}>
                        {card.icon}
                      </div>

                      {card.highlight && (
                        <span style={{
                          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                          color: 'var(--green)', background: 'rgba(22,163,74,0.12)',
                          padding: '3px 8px', borderRadius: 4, fontWeight: 700,
                        }}>
                          {card.highlight}
                        </span>
                      )}
                    </div>

                    <h3 style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 'clamp(18px, 1.8vw, 22px)',
                      fontWeight: 700, color: 'var(--fg)', marginBottom: 12, lineHeight: 1.25,
                    }}>
                      {card.title}
                    </h3>

                    <p style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: 'var(--fg-dim)',
                      lineHeight: 1.7, marginBottom: 20, fontWeight: 350,
                    }}>
                      {card.desc}
                    </p>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                    {card.tags.map(t => (
                      <span key={t} className="tag" style={{ borderRadius: 4, padding: '3px 8px' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 5. BRAND NEW REDESIGNED PROJECTS SECTION (Completely Rebuilt & Dynamic)
// ════════════════════════════════════════════════════════════════════════════
function Projects() {
  const { data: { projects } } = useSite()
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const categories = useMemo(() => {
    const list = new Set(['All'])
    projects.forEach(p => {
      if (p.category) list.add(p.category)
    })
    return Array.from(list)
  }, [projects])

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return projects
    return projects.filter(p => p.category === activeCategory)
  }, [projects, activeCategory])

  return (
    <section id="projects" style={{ padding: 'var(--section-py) 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)' }}>

        {/* Section Header */}
        <Reveal>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: 'clamp(36px, 5vh, 64px)', paddingBottom: 'clamp(24px, 4vh, 44px)',
            borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <SIdx n="04" label="Selected Engineering" />
              <h2 className="display" style={{
                fontSize: 'clamp(28px, 5.5vw, 76px)',
                color: 'var(--fg)',
                marginTop: 16,
                lineHeight: 1.1,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                gap: '0 clamp(8px, 1.4vw, 14px)',
              }}>
                <span className="font-playfair italic font-normal" style={{ textTransform: 'none' }}>
                  Landmark
                </span>
                <span style={{ fontSize: '0.84em', letterSpacing: '-0.02em' }}>
                  Projects
                </span>
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map(cat => {
                const active = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '7px 16px', borderRadius: 20,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                      letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                      background: active ? 'var(--accent)' : 'var(--bg-2)',
                      color: active ? '#FFFFFF' : 'var(--fg-dim)',
                      border: '1px solid',
                      borderColor: active ? 'var(--accent)' : 'var(--border)',
                      transition: 'all 0.2s ease',
                      fontWeight: 600,
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Dynamic Project Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
          gap: 'clamp(20px, 3vw, 32px)',
        }}>
          {filtered.map((proj, idx) => (
            <Reveal key={proj.id || idx} delay={idx % 4}>
              <motion.article
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.04)'
                }}
              >
                {/* Image / Graphic Banner */}
                <Link
                  to={'/projects/' + (proj.slug || proj.id)}
                  style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: proj.imgColor || 'var(--bg-3)', display: 'block', textDecoration: 'none' }}
                >
                  {proj.img ? (
                    <img
                      src={proj.img}
                      alt={proj.title}
                      loading="lazy"
                      className="project-img"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `linear-gradient(135deg, var(--bg-2) 0%, var(--bg-3) 100%)`,
                    }}>
                      <Zap size={48} strokeWidth={0.6} style={{ color: 'var(--accent)', opacity: 0.35 }} />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,13,20,0.75) 0%, transparent 60%)' }} />

                  {/* Top Bar: Number & Category Chip */}
                  <div style={{
                    position: 'absolute', top: 14, left: 14, right: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                      fontWeight: 700, color: '#FFFFFF', background: 'rgba(10,13,20,0.75)',
                      backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: 4,
                      letterSpacing: '0.1em',
                    }}>
                      {proj.num || `PRJ-${idx + 1}`}
                    </span>

                    {proj.year && (
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5,
                        color: 'rgba(255,255,255,0.9)', background: 'rgba(10,13,20,0.75)',
                        backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: 4,
                      }}>
                        {proj.year}
                      </span>
                    )}
                  </div>

                  {/* Bottom Capacity Banner */}
                  {proj.capacity && (
                    <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
                      <div className="display" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#FFFFFF', lineHeight: 1 }}>
                        {proj.capacity}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>
                        Installed Grid Capacity
                      </div>
                    </div>
                  )}
                </Link>

                {/* Card Body */}
                <div style={{ padding: 'clamp(20px, 3vw, 26px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Category & Client */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'var(--accent)',
                    letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700,
                  }}>
                    <span>{proj.category || 'Power Engineering'}</span>
                    {proj.client && (
                      <>
                        <span style={{ color: 'var(--muted)' }}>•</span>
                        <span style={{ color: 'var(--fg-dim)' }}>{proj.client}</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <Link
                    to={'/projects/' + (proj.slug || proj.id)}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <h3 style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 'clamp(18px, 1.8vw, 22px)',
                      fontWeight: 700, color: 'var(--fg)', lineHeight: 1.25, marginBottom: 12,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg)')}
                    >
                      {proj.title}
                    </h3>
                  </Link>

                  {/* Summary */}
                  <p style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: 'var(--fg-dim)',
                    lineHeight: 1.65, fontWeight: 350, marginBottom: 18, flex: 1,
                  }}>
                    {proj.summary}
                  </p>

                  {/* Scope bullets */}
                  {proj.scope && proj.scope.length > 0 && (
                    <div style={{
                      paddingTop: 14, borderTop: '1px solid var(--border)',
                      marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6,
                    }}>
                      {proj.scope.slice(0, 3).map((sc, sci) => (
                        <div key={sci} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <div style={{ width: 6, height: 1.5, background: 'var(--accent)', marginTop: 8, flexShrink: 0 }} />
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--fg-dim)', lineHeight: 1.4 }}>
                            {sc}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Outcome Box */}
                  {proj.outcome && (
                    <div style={{
                      padding: '10px 14px', background: 'var(--accent-dim)',
                      borderLeft: '2.5px solid var(--accent)', borderRadius: '0 6px 6px 0',
                      marginBottom: 16,
                    }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>
                        Verified Outcome
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--fg)', fontWeight: 500, lineHeight: 1.4 }}>
                        {proj.outcome}
                      </div>
                    </div>
                  )}

                  {/* Software & Tools Chips */}
                  {proj.tools && proj.tools.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 'auto' }}>
                      {proj.tools.map((t, ti) => (
                        <span
                          key={ti}
                          className="tag"
                          style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 4 }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Link to Full Case Study */}
                  <div style={{
                    marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <Link
                      to={'/projects/' + (proj.slug || proj.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        transition: 'gap 0.2s ease',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.gap = '10px')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.gap = '6px')}
                    >
                      <span>Full Case Study</span>
                      <ArrowUpRight size={13} strokeWidth={2.4} />
                    </Link>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'var(--muted)' }}>
                      Single-Line & Specs
                    </span>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>

        {/* Empty State / Notice */}
        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'var(--bg-2)', borderRadius: 10, border: '1px solid var(--border)',
          }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: 'var(--fg-dim)', marginBottom: 8 }}>
              No projects found in this category.
            </p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)' }}>
              Add or edit projects anytime via the Admin Dashboard.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 6. SERVICES & ENGAGEMENT MODELS
// ════════════════════════════════════════════════════════════════════════════
function Services() {
  const { data: { services } } = useSite()
  const [hov, setHov] = useState<number | null>(null)

  return (
    <section id="services-detailed" style={{ padding: 'var(--section-py) 0', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)' }}>
        <Reveal>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: 'clamp(36px, 5vh, 64px)', paddingBottom: 'clamp(24px, 4vh, 44px)',
            borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <SIdx n="05" label="Engagement Models" />
              <h2 className="display" style={{
                fontSize: 'clamp(28px, 5.5vw, 76px)',
                color: 'var(--fg)',
                marginTop: 16,
                lineHeight: 1.1,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                gap: '0 clamp(8px, 1.4vw, 14px)',
              }}>
                <span className="font-playfair italic font-normal" style={{ textTransform: 'none' }}>
                  Engineering
                </span>
                <span style={{ fontSize: '0.84em', letterSpacing: '-0.02em' }}>
                  Services
                </span>
              </h2>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'var(--fg-dim)', maxWidth: 360, lineHeight: 1.7, fontWeight: 350 }}>
              Tailored consulting agreements, turnkey substation design packages, and statutory compliance certifications for contractors and asset owners.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {services.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i + 1, 5)}>
              <div
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'clamp(18px, 4vw, 54px)',
                  padding: 'clamp(20px, 3vh, 32px) 0',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'default',
                  transition: 'padding-left 0.3s cubic-bezier(0.16,1,0.3,1)',
                  paddingLeft: hov === i ? 'clamp(12px, 2.5vw, 24px)' : 0,
                }}
              >
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                  color: hov === i ? 'var(--accent)' : 'var(--muted)',
                  letterSpacing: '0.2em', flexShrink: 0, minWidth: 32, transition: 'color 0.2s', fontWeight: 700,
                }}>
                  {s.num}
                </span>

                <div style={{
                  width: hov === i ? 36 : 0, height: 1, background: 'var(--accent)',
                  transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)', flexShrink: 0,
                }} />

                <span style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 'clamp(16px, 2vw, 22px)',
                  fontWeight: 600, color: hov === i ? 'var(--fg)' : 'var(--fg-dim)',
                  transition: 'color 0.2s', flex: 1,
                }}>
                  {s.name}
                </span>

                <span style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: 'var(--muted)',
                  display: 'block', maxWidth: 340, lineHeight: 1.5, textAlign: 'right',
                }}>
                  {s.detail}
                </span>

                <ArrowUpRight
                  size={16} strokeWidth={1.8}
                  style={{
                    color: hov === i ? 'var(--accent)' : 'transparent',
                    transition: 'color 0.2s', flexShrink: 0,
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

// ════════════════════════════════════════════════════════════════════════════
// 7. ACADEMIC CREDENTIALS, CERTIFICATIONS & TOOLS
// ════════════════════════════════════════════════════════════════════════════
function Education() {
  const { data: { education, settings } } = useSite()

  return (
    <section id="education" style={{ padding: 'var(--section-py) 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)' }}>
        <Reveal>
          <div style={{
            paddingBottom: 'clamp(28px, 4vh, 48px)', marginBottom: 'clamp(36px, 5vh, 64px)',
            borderBottom: '1px solid var(--border)',
          }}>
            <SIdx n="06" label="Qualifications & Software" />
            <h2 className="display" style={{
              fontSize: 'clamp(28px, 5.5vw, 76px)',
              color: 'var(--fg)',
              marginTop: 16,
              lineHeight: 1.1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              gap: '0 clamp(8px, 1.4vw, 14px)',
            }}>
              <span className="font-playfair italic font-normal" style={{ textTransform: 'none' }}>
                Academic
              </span>
              <span style={{ fontSize: '0.84em', letterSpacing: '-0.02em' }}>
                Background
              </span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(36px, 6vw, 84px)' }}>
          {/* Timeline */}
          <div>
            <Reveal>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 28 }}>
                Academic &amp; Certification Timeline
              </div>
            </Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {education.map((e, i) => (
                <Reveal key={i} delay={Math.min(i + 1, 5)}>
                  <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: 0, position: 'relative' }}>
                    {/* Period */}
                    <div style={{ paddingTop: 3, paddingRight: 20, textAlign: 'right' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
                        {e.period}
                      </span>
                    </div>
                    {/* Content */}
                    <div style={{ paddingLeft: 22, paddingBottom: 34, borderLeft: '1px solid var(--border-strong)', position: 'relative' }}>
                      <div style={{
                        position: 'absolute', top: 6, left: -4.5, width: 8, height: 8,
                        border: '1.5px solid var(--accent)', background: 'var(--bg)', borderRadius: '50%',
                      }} />
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(15px, 1.5vw, 17px)', fontWeight: 700, color: 'var(--fg)', lineHeight: 1.3 }}>
                        {e.degree}
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--fg-dim)', marginTop: 3 }}>
                        {e.institution}
                      </div>
                      {e.note && (
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
                          {e.note}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Software stack */}
          <div>
            <Reveal delay={2}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 28 }}>
                Engineering Simulation Software
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                {(settings.tools || [
                  'ETAP', 'AutoCAD Electrical', 'PSS/E', 'Dialux evo', 'MATLAB', 'PSCAD', 'CYMGRD', 'PVSyst', 'Python'
                ]).map((t, i) => (
                  <span
                    key={i}
                    className="tag"
                    style={{
                      borderRadius: 4, padding: '6px 12px', fontSize: 11,
                      background: 'var(--bg-2)', border: '1px solid var(--border)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Specialization Callout Card */}
              <div style={{
                padding: 'clamp(24px, 3.5vw, 36px)', background: 'var(--bg-2)',
                border: '1px solid var(--border)', borderRadius: 8,
              }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 14 }}>
                  Verified Competency
                </div>
                <div className="display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--fg)', lineHeight: 0.95, marginBottom: 14 }}>
                  Power Systems<br />Analysis
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: 'var(--fg-dim)', lineHeight: 1.7, fontWeight: 350 }}>
                  From load flow studies to short circuit withstand, protection coordination to harmonic assessment — delivering rigorous engineering models with guaranteed statutory clearance.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 8. CONSULTATION & DIRECT CONTACT
// ════════════════════════════════════════════════════════════════════════════
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
      setFormErr('Something went wrong. Please try contacting directly via WhatsApp or Email.')
    } else {
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSent(false), 6000)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px',
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    color: 'var(--fg)', fontFamily: "'Inter', sans-serif", fontSize: 14.5,
    outline: 'none', fontWeight: 400,
    transition: 'border-color 0.2s',
  }

  return (
    <section id="contact" style={{ padding: 'var(--section-py) 0', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)' }}>
        <Reveal>
          <div style={{
            paddingBottom: 'clamp(28px, 4vh, 48px)', marginBottom: 'clamp(36px, 5vh, 64px)',
            borderBottom: '1px solid var(--border)',
          }}>
            <SIdx n="07" label="Project Consultation" />
            <h2 className="display" style={{
              fontSize: 'clamp(28px, 5.5vw, 76px)',
              color: 'var(--fg)',
              marginTop: 16,
              lineHeight: 1.1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              gap: '0 clamp(8px, 1.4vw, 14px)',
            }}>
              <span className="font-playfair italic font-normal" style={{ textTransform: 'none' }}>
                Project
              </span>
              <span style={{ fontSize: '0.84em', letterSpacing: '-0.02em' }}>
                Consultation
              </span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(36px, 6vw, 84px)' }}>
          {/* Info Side */}
          <Reveal>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'var(--fg-dim)', lineHeight: 1.75, fontWeight: 350, marginBottom: 32 }}>
                Available for substation turnkey design, industrial power system audits, compliance certification, and expert engineering advisory.
              </p>

              {/* Direct channels */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Official Email', value: E.email, href: `mailto:${E.email}`, icon: <Mail size={16} /> },
                  { label: 'Direct WhatsApp', value: E.whatsapp || E.phone, href: `https://wa.me/${E.whatsapp || E.phone}`, icon: <Phone size={16} /> },
                  { label: 'LinkedIn Profile', value: 'Md Sahin Alom on LinkedIn', href: E.linkedin, icon: <Globe size={16} /> },
                ].filter(r => r.value).map((r, i) => (
                  <div key={i} style={{ paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                      {r.label}
                    </div>
                    <a
                      href={r.href}
                      target={r.label !== 'Official Email' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="link-line"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: 'var(--fg)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      <span style={{ color: 'var(--accent)' }}>{r.icon}</span>
                      {r.value}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Form Side */}
          <Reveal delay={2}>
            <form
              onSubmit={handleSubmit}
              style={{
                background: 'var(--card-bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: 'clamp(24px, 4vw, 36px)',
                display: 'flex', flexDirection: 'column', gap: 16,
                boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
              }}
            >
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--fg)', marginBottom: 4 }}>
                Send an Inquiry
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--fg-dim)', marginBottom: 8 }}>
                Share your project scope, timeline, and location to receive a preliminary consultation proposal.
              </p>

              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Full Name
                </div>
                <input
                  type="text"
                  placeholder="e.g. Engr. Rafiqul Islam"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Email Address
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Project Type / Subject
                </div>
                <input
                  type="text"
                  placeholder="e.g. 33/11kV Substation Design & SLD Review"
                  value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  required
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Message &amp; Project Requirements
                </div>
                <textarea
                  rows={4}
                  placeholder="Describe electrical capacity, timeline, standards, or deliverables needed..."
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              {formErr && (
                <div style={{
                  padding: '10px 14px', background: 'rgba(220,38,38,0.08)',
                  border: '1px solid rgba(220,38,38,0.25)', borderRadius: 6,
                  fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--red)',
                }}>
                  {formErr}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="btn-primary"
                style={{
                  borderRadius: 6, padding: '14px', width: '100%',
                  justifyContent: 'center', opacity: sending ? 0.7 : 1,
                  marginTop: 6,
                }}
              >
                {sent ? '✓ Message Transmitted Successfully' : sending ? 'Transmitting…' : (
                  <>Submit Consultation Inquiry <ArrowUpRight size={15} strokeWidth={2.2} /></>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 9. EDITORIAL FOOTER
// ════════════════════════════════════════════════════════════════════════════
function Footer() {
  const { data: { engineer: E } } = useSite()

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: 'clamp(32px, 5vh, 56px) var(--px)',
      background: 'var(--bg)',
    }}>
      <div style={{
        maxWidth: 'var(--max-w)', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 20,
      }}>
        <HeaderLogo compact={true} showSubtitle={false} />

        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          &copy; {new Date().getFullYear()} {E.name} · Certified Electrical Engineer · Class ABC Licensed
        </div>

        <a
          href="#hero"
          style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            color: 'var(--fg-dim)', letterSpacing: '0.15em', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'color 0.2s', fontWeight: 700,
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--fg-dim)')}
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT HOMEPAGE COMPONENT
// ════════════════════════════════════════════════════════════════════════════
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
