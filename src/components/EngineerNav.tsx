import { useState, useEffect, useRef } from 'react'
import {
  ArrowUpRight, Menu, X,
  ChevronDown, ChevronRight, Zap, Sun, Moon,
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router'
import { useSite } from '../context/SiteContext'
import HeaderLogo from './HeaderLogo'
import CommandPalette from './CommandPalette'

type Props = {
  menuOpen?: boolean
  setMenuOpen?: (v: boolean) => void
  onBiodata?: () => void
  onCV?: () => void
  onOpenStory?: (index?: number) => void
}

// Customer-journey nav links — 5 items, real labels
const PRIMARY_LINKS: { label: string; href?: string; to?: string }[] = [
  { label: 'About',    href: '#about'    },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Blog',     to:   '/blog'     },
  { label: 'Contact',  to:   '/contact'  },
]

const QUICK_TOOLS = [
  { name: 'Voltage Drop',       slug: 'voltage-drop',            tag: 'Cables'      },
  { name: 'Cable Sizing',       slug: 'cable-sizing',            tag: 'Conductors'  },
  { name: 'Transformer Sizing', slug: 'transformer-sizing',      tag: 'Substations' },
  { name: 'Power Factor',       slug: 'power-factor-correction', tag: 'Capacitors'  },
  { name: 'Breaker Sizing',     slug: 'breaker-size',            tag: 'Protection'  },
  { name: 'Motor FLC',          slug: 'motor-current',           tag: 'Motors'      },
]

export default function EngineerNav({
  menuOpen: controlledMenuOpen,
  setMenuOpen: controlledSetMenuOpen,
  onBiodata,
  onCV,
}: Props = {}) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { data: { engineer: E }, theme, toggleTheme } = useSite()

  const [scrolled,           setScrolled]           = useState(false)
  const [scrollProgress,     setScrollProgress]     = useState(0)
  const [localMenuOpen,      setLocalMenuOpen]      = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [toolsOpen,          setToolsOpen]          = useState(false)
  const toolsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const menuOpen      = controlledMenuOpen    !== undefined ? controlledMenuOpen    : localMenuOpen
  const setMenuOpen   = controlledSetMenuOpen ?? setLocalMenuOpen
  const handleCV      = onCV      ?? (() => navigate('/cv'))
  const handleBiodata = onBiodata ?? (() => navigate('/biodata'))

  const isHome    = location.pathname === '/' || location.pathname === ''
  const isLight   = theme === 'light'
  const showSolid = !isHome || scrolled || isLight || menuOpen

  // Scroll progress + solid trigger
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Global ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(v => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Smooth anchor navigation
  const goAnchor = (hash: string) => {
    setMenuOpen(false)
    setToolsOpen(false)
    if (location.pathname === '/') {
      const el = document.querySelector(hash)
      el ? el.scrollIntoView({ behavior: 'smooth' }) : (window.location.hash = hash)
    } else {
      navigate('/' + hash)
    }
  }

  const handleLink = (e: React.MouseEvent, item: { href?: string; to?: string }) => {
    e.preventDefault()
    if (item.to) { setMenuOpen(false); navigate(item.to) }
    else if (item.href) goAnchor(item.href)
  }

  const isActive = (item: { href?: string; to?: string }) => {
    if (item.to)   return location.pathname.startsWith(item.to)
    if (item.href) return location.hash === item.href
    return false
  }

  // Tools flyout hover
  const openTools  = () => { if (toolsTimer.current) clearTimeout(toolsTimer.current); setToolsOpen(true) }
  const closeTools = () => { toolsTimer.current = setTimeout(() => setToolsOpen(false), 180) }

  const NAV_H = 64

  return (
    <>
      {/* ── Skip to content (a11y) ─────────────────────────────────────────── */}
      <a
        href="#hero"
        style={{
          position: 'fixed', top: 8, left: 8, zIndex: 9999,
          background: 'var(--accent)', color: '#fff',
          padding: '8px 16px', borderRadius: 6,
          fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 600,
          textDecoration: 'none',
          transform: 'translateY(-200%)',
          transition: 'transform 0.2s',
        }}
        onFocus={e  => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
        onBlur={e   => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-200%)')}
      >
        Skip to content
      </a>

      {/* ── Main nav bar ──────────────────────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          height: NAV_H, zIndex: 200,
          background: showSolid ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: showSolid ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: showSolid ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: showSolid ? '1px solid var(--nav-border)' : '1px solid transparent',
          boxShadow: showSolid ? (theme === 'dark' ? '0 4px 30px rgba(0,0,0,0.5)' : '0 4px 24px rgba(13,18,24,0.06)') : 'none',
          transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--max-w, 1440px)', margin: '0 auto',
            padding: '0 var(--px, 28px)', height: '100%',
            display: 'flex', alignItems: 'center',
          }}
        >
          {/* 1. Logo */}
          <div style={{ flexShrink: 0, marginRight: 'clamp(20px, 4vw, 52px)' }}>
            <HeaderLogo
              onClick={e => { e.preventDefault(); navigate('/') }}
              showSubtitle={false}
              textColor={showSolid ? 'var(--fg)' : '#FFFFFF'}
            />
          </div>

          {/* 2. Primary nav links — desktop */}
          <div
            className="desktop-only"
            style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}
          >
            {PRIMARY_LINKS.map(item => {
              const active = isActive(item)
              const linkColor = !showSolid
                ? (active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.82)')
                : (active ? 'var(--fg)' : 'var(--fg-dim)')

              return (
                <a
                  key={item.label}
                  href={item.to ?? item.href}
                  onClick={e => handleLink(e, item)}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    position: 'relative',
                    display: 'inline-flex', alignItems: 'center',
                    padding: '8px 14px', borderRadius: 8,
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 14, fontWeight: active ? 600 : 430,
                    letterSpacing: '-0.01em',
                    color: linkColor,
                    textDecoration: 'none',
                    background: 'transparent',
                    transition: 'color 0.18s, background 0.18s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = !showSolid ? '#FFFFFF' : 'var(--fg)'
                      el.style.background = !showSolid ? 'rgba(255,255,255,0.12)' : 'var(--accent-dim)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = linkColor
                      el.style.background = 'transparent'
                    }
                  }}
                >
                  {item.label}
                  {/* Active accent underline */}
                  {active && (
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute', bottom: 3, left: 14, right: 14,
                        height: 2, borderRadius: 2,
                        background: 'var(--accent)',
                        boxShadow: '0 0 8px var(--accent)',
                      }}
                    />
                  )}
                </a>
              )
            })}

            {/* Tools overflow item with mega flyout */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={openTools}
              onMouseLeave={closeTools}
            >
              <button
                onClick={() => navigate('/tools')}
                aria-expanded={toolsOpen}
                aria-haspopup="true"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8,
                  fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 430,
                  color: !showSolid ? 'rgba(255,255,255,0.85)' : (location.pathname.startsWith('/tools') ? 'var(--fg)' : 'var(--fg-dim)'),
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  transition: 'color 0.18s, background 0.18s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = !showSolid ? '#FFFFFF' : 'var(--fg)'
                  el.style.background = !showSolid ? 'rgba(255,255,255,0.12)' : 'var(--accent-dim)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  if (!location.pathname.startsWith('/tools')) {
                    el.style.color = !showSolid ? 'rgba(255,255,255,0.85)' : 'var(--fg-dim)'
                    el.style.background = 'transparent'
                  }
                }}
              >
                Tools
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, fontWeight: 700,
                  color: !showSolid ? '#FFFFFF' : 'var(--accent)',
                  background: !showSolid ? 'rgba(255,255,255,0.18)' : 'var(--accent-dim)',
                  padding: '1px 5px', borderRadius: 4,
                }}>
                  20+
                </span>
                <ChevronDown
                  size={12}
                  style={{
                    opacity: 0.65,
                    color: !showSolid ? '#FFFFFF' : 'currentColor',
                    transition: 'transform 0.2s',
                    transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {/* Flyout */}
              {toolsOpen && (
                <div
                  onMouseEnter={openTools}
                  onMouseLeave={closeTools}
                  role="menu"
                  style={{
                    position: 'absolute', top: 'calc(100% + 10px)', left: '50%',
                    transform: 'translateX(-50%)',
                    width: 380, background: 'var(--card-bg)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 14, padding: 18,
                    boxShadow: theme === 'dark' ? '0 24px 60px rgba(0,0,0,0.65)' : '0 20px 48px rgba(0,0,0,0.12)',
                    zIndex: 300,
                    animation: 'fadeIn 0.14s cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Zap size={14} style={{ color: 'var(--accent)' }} />
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>
                        Engineering Calculators
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                      color: 'var(--green)', background: 'rgba(22,163,74,0.12)',
                      padding: '2px 8px', borderRadius: 4, fontWeight: 700,
                    }}>
                      20 Active
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {QUICK_TOOLS.map(t => (
                      <button
                        key={t.slug}
                        role="menuitem"
                        onClick={() => { setToolsOpen(false); navigate('/tools/' + t.slug) }}
                        style={{
                          textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                          background: 'var(--bg-2)', border: '1px solid var(--border)',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.background = 'var(--accent-dim)'
                          el.style.borderColor = 'var(--accent)'
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.background = 'var(--bg-2)'
                          el.style.borderColor = 'var(--border)'
                        }}
                      >
                        <div style={{
                          fontFamily: 'Outfit, sans-serif', fontSize: 12,
                          fontWeight: 600, color: 'var(--fg)', lineHeight: 1.25,
                        }}>
                          {t.name}
                        </div>
                        <div style={{
                          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                          color: 'var(--accent)', marginTop: 3, fontWeight: 500,
                        }}>
                          {t.tag}
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => { setToolsOpen(false); navigate('/tools') }}
                    style={{
                      width: '100%', marginTop: 12, paddingTop: 12,
                      borderTop: '1px solid var(--border)',
                      background: 'none', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontFamily: 'Outfit, sans-serif', fontSize: 12.5, fontWeight: 600,
                      color: 'var(--accent)', cursor: 'pointer',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.75')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                  >
                    Explore all 20+ calculators <ArrowUpRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Spacer — mobile only */}
          <div style={{ flex: 1 }} className="mobile-only" />

          {/* 3. Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Sun / Moon Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                width: 36, height: 36, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: showSolid ? 'var(--bg-2)' : 'rgba(255,255,255,0.12)',
                border: showSolid ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.22)',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--accent)'
                el.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = showSolid ? 'var(--border)' : 'rgba(255,255,255,0.22)'
                el.style.transform = 'none'
              }}
            >
              {theme === 'dark' ? (
                <Sun size={15} strokeWidth={2} style={{ color: '#F59E0B' }} />
              ) : (
                <Moon size={15} strokeWidth={2} style={{ color: showSolid ? 'var(--fg)' : '#FFFFFF' }} />
              )}
            </button>

            {/* View CV — quiet ghost, desktop only */}
            <button
              onClick={handleCV}
              className="desktop-only"
              aria-label="View or download CV"
              style={{
                display: 'flex', alignItems: 'center',
                background: 'transparent',
                border: showSolid ? '1px solid var(--border-strong)' : '1px solid rgba(255,255,255,0.32)',
                borderRadius: 8, padding: '7px 14px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em',
                color: showSolid ? 'var(--fg-dim)' : '#FFFFFF',
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--accent)'
                el.style.color = 'var(--accent)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = showSolid ? 'var(--border-strong)' : 'rgba(255,255,255,0.32)'
                el.style.color = showSolid ? 'var(--fg-dim)' : '#FFFFFF'
              }}
            >
              CV
            </button>

            {/* Hire Me — primary amber CTA, desktop only */}
            <a
              href="/contact"
              onClick={e => { e.preventDefault(); navigate('/contact') }}
              className="desktop-only"
              aria-label="Contact me to start a project"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--accent)', color: '#fff',
                fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                fontSize: 13.5, letterSpacing: '0.01em',
                padding: '7px 18px', borderRadius: 8,
                textDecoration: 'none',
                boxShadow: '0 2px 14px rgba(196,125,14,0.30)',
                transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = '#D2861F'
                el.style.transform = 'translateY(-1px)'
                el.style.boxShadow = '0 6px 22px rgba(196,125,14,0.42)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--accent)'
                el.style.transform = ''
                el.style.boxShadow = '0 2px 14px rgba(196,125,14,0.30)'
              }}
            >
              Hire Me <ArrowUpRight size={14} strokeWidth={2.1} />
            </a>

            {/* Mobile hamburger — labeled "Menu", 48px tap target */}
            <button
              className="mobile-only"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 2,
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '8px',
                color: showSolid ? 'var(--fg)' : '#FFFFFF',
                minWidth: 48, minHeight: 48,
              }}
            >
              {menuOpen
                ? <X size={22} strokeWidth={1.8} />
                : (
                  <>
                    <Menu size={22} strokeWidth={1.8} />
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
                      letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1,
                    }}>
                      Menu
                    </span>
                  </>
                )
              }
            </button>
          </div>
        </div>

        {/* Scroll progress bar */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 2, pointerEvents: 'none',
          }}
        >
          <div style={{
            height: '100%', width: scrollProgress + '%',
            background: 'linear-gradient(90deg,#C47D0E 0%,#F59E0B 60%,#16A34A 100%)',
            transition: 'width 0.1s ease-out',
            boxShadow: scrollProgress > 0 ? '0 0 6px rgba(196,125,14,0.5)' : 'none',
          }} />
        </div>
      </nav>

      {/* Command palette */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

      {/* ════════════════════════════════════════════════════════════════════
          Mobile full-screen drawer
      ════════════════════════════════════════════════════════════════════ */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed', inset: 0, zIndex: 190,
          background: 'var(--bg, #F7F5F0)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.16,1,0.3,1)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
          paddingTop: NAV_H,
        }}
      >
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: 'clamp(24px,5vw,36px)',
        }}>

          {/* Mobile Theme Toggle */}
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                width: '100%', minHeight: 48, borderRadius: 10,
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {theme === 'dark' ? <Sun size={17} style={{ color: '#F59E0B' }} /> : <Moon size={17} style={{ color: 'var(--fg)' }} />}
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5,
                color: 'var(--accent)', background: 'var(--accent-dim)',
                padding: '3px 8px', borderRadius: 4, fontWeight: 600,
                textTransform: 'uppercase',
              }}>
                Switch
              </span>
            </button>
          </div>

          {/* Nav links — Barlow Condensed, 48px min tap target, staggered entrance */}
          <nav aria-label="Mobile navigation">
            {[...PRIMARY_LINKS, { label: 'Tools', to: '/tools' }].map((item, i) => {
              const active = isActive(item)
              return (
                <a
                  key={item.label}
                  href={item.to ?? item.href ?? '/'}
                  onClick={e => handleLink(e, item)}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: 'clamp(13px, 2.8vh, 17px) 0',
                    borderBottom: '1px solid var(--border)',
                    fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800,
                    fontSize: 'clamp(28px, 7.5vw, 44px)', textTransform: 'uppercase',
                    color: active ? 'var(--accent)' : 'var(--fg)',
                    textDecoration: 'none', minHeight: 48,
                    // Staggered spring entrance
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'none' : 'translateX(28px)',
                    transition:
                      'opacity 0.4s ' + (0.06 + i * 0.05) + 's cubic-bezier(0.16,1,0.3,1),' +
                      'transform 0.4s ' + (0.06 + i * 0.05) + 's cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronRight
                    size={20}
                    strokeWidth={1.5}
                    style={{ color: active ? 'var(--accent)' : 'var(--muted)', flexShrink: 0 }}
                  />
                </a>
              )
            })}
          </nav>

          <div style={{ flex: 1, minHeight: 24 }} />

          {/* Footer CTAs */}
          <div
            style={{
              paddingTop: 24,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'none' : 'translateY(16px)',
              transition: 'opacity 0.4s 0.42s ease, transform 0.4s 0.42s ease',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              {([
                { label: 'View CV',  fn: handleCV      },
                { label: 'Biodata', fn: handleBiodata },
              ] as { label: string; fn: () => void }[]).map(btn => (
                <button
                  key={btn.label}
                  onClick={() => { setMenuOpen(false); btn.fn() }}
                  style={{
                    padding: 14, minHeight: 52,
                    background: 'var(--bg-2)', border: '1px solid var(--border-strong)',
                    borderRadius: 8,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5,
                    letterSpacing: '0.14em', color: 'var(--fg-dim)',
                    textTransform: 'uppercase', cursor: 'pointer',
                    transition: 'border-color 0.18s, color 0.18s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--accent)'
                    el.style.color = 'var(--accent)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--border-strong)'
                    el.style.color = 'var(--fg-dim)'
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Primary mobile CTA */}
            <a
              href="/contact"
              onClick={e => { e.preventDefault(); setMenuOpen(false); navigate('/contact') }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', minHeight: 56,
                background: 'var(--accent)', color: '#fff',
                fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 15,
                letterSpacing: '0.02em',
                borderRadius: 10, textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(196,125,14,0.34)',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.87')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              Hire Me — Get in Touch <ArrowUpRight size={16} strokeWidth={2} />
            </a>

            {/* Identity footer line */}
            <p style={{
              marginTop: 16, textAlign: 'center',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5,
              color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              {E.name} &middot; {E.title}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
