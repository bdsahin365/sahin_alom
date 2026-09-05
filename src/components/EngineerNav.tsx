import { useState, useEffect, useRef } from 'react'
import { 
  ArrowUpRight, Menu, X, Zap, Play, Search, Calculator, BookOpen, 
  MessageSquare, Phone, ChevronDown, Sparkles, ShieldCheck, Mail
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router'
import { useSite } from '../context/SiteContext'
import sahinAvatar from '../img/sahin.png'
import HeaderLogo from './HeaderLogo'
import CommandPalette from './CommandPalette'
import { siteConfig } from '../config/siteConfig'

type Props = {
  menuOpen?: boolean
  setMenuOpen?: (v: boolean) => void
  onBiodata?: () => void
  onCV?: () => void
  onOpenStory?: (index?: number) => void
}

export default function EngineerNav({
  menuOpen: controlledMenuOpen,
  setMenuOpen: controlledSetMenuOpen,
  onBiodata,
  onCV,
  onOpenStory,
}: Props = {}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: { engineer: E } } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [localMenuOpen, setLocalMenuOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false)
  const toolsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const menuOpen = controlledMenuOpen !== undefined ? controlledMenuOpen : localMenuOpen
  const setMenuOpen = controlledSetMenuOpen ?? setLocalMenuOpen
  const handleBiodata = onBiodata ?? (() => navigate('/biodata'))
  const handleCV = onCV ?? (() => navigate('/cv'))
  const handleOpenStory = onOpenStory ?? ((_index?: number) => navigate('/'))

  const isHome = location.pathname === '/' || location.pathname === ''
  const showSolid = !isHome || scrolled

  // Track scroll depth & progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 30)

      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100))
        setScrollProgress(progress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navItems: { label: string; href?: string; to?: string; badge?: string; hasDropdown?: boolean }[] = [
    { label: 'About', href: '#about' },
    { label: 'Expertise', href: '#expertise' },
    { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Tools', to: '/tools', badge: '20+', hasDropdown: true },
    { label: 'Blog', to: '/blog', badge: 'NEW' },
    { label: 'Contact', href: '#contact' },
  ]

  const quickTools = [
    { name: 'Voltage Drop Calculator', slug: 'voltage-drop', tag: 'Cables & Wiring' },
    { name: 'Cable Sizing (IEC/BNBC)', slug: 'cable-sizing', tag: 'Conductors' },
    { name: 'Transformer Sizing (kVA)', slug: 'transformer-sizing', tag: 'Substations' },
    { name: 'Power Factor Correction', slug: 'power-factor-correction', tag: 'Capacitors' },
    { name: 'Breaker & MCB Sizing', slug: 'breaker-size', tag: 'Protection' },
    { name: 'Three-Phase Motor FLC', slug: 'motor-current', tag: 'Motors' },
  ]

  const handleNavClick = (e: React.MouseEvent, item: { label: string; href?: string; to?: string }) => {
    e.preventDefault()
    setMenuOpen(false)
    setToolsDropdownOpen(false)
    if (item.to) {
      navigate(item.to)
    } else if (item.href) {
      if (location.pathname === '/') {
        const el = document.querySelector(item.href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        else window.location.hash = item.href
      } else {
        navigate('/' + item.href)
      }
    }
  }

  const handleAnchorClick = (e: React.MouseEvent, hash: string) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else window.location.hash = hash
    } else {
      navigate('/' + hash)
    }
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          height: 'var(--nav-h, 68px)',
          background: showSolid ? 'rgba(247, 245, 240, 0.96)' : 'transparent',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: showSolid ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: showSolid ? '0 4px 24px rgba(15, 23, 42, 0.04)' : 'none',
          transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--max-w)',
            margin: '0 auto',
            padding: '0 var(--px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            gap: 16,
          }}
        >
          {/* 1. Left Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            {/* Custom High-Definition Vector SVG Engineering Logo */}
            <HeaderLogo
              onClick={e => {
                e.preventDefault()
                navigate('/')
              }}
            />
          </div>

          {/* 2. Center Desktop Navigation Links with Flyout Mega-Menus */}
          <div
            className="desktop-only"
            style={{
              gap: 22,
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            {navItems.map(item => {
              const isActive = item.to ? location.pathname.startsWith(item.to) : false
              const isTools = item.label === 'Tools'

              return (
                <div
                  key={item.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => {
                    if (isTools) {
                      if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current)
                      setToolsDropdownOpen(true)
                    }
                  }}
                  onMouseLeave={() => {
                    if (isTools) {
                      toolsTimeoutRef.current = setTimeout(() => {
                        setToolsDropdownOpen(false)
                      }, 200)
                    }
                  }}
                >
                  <a
                    href={item.to || item.href}
                    onClick={e => handleNavClick(e, item)}
                    className="link-line"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10.5,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: isActive ? 'var(--accent)' : 'var(--fg-dim)',
                      fontWeight: isActive ? 700 : 500,
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '8px 2px',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
                    onMouseLeave={e => (e.currentTarget.style.color = isActive ? 'var(--accent)' : 'var(--fg-dim)')}
                  >
                    {item.label}

                    {item.badge && (
                      <span
                        style={{
                          fontSize: 7.5,
                          fontWeight: 700,
                          padding: '1px 4px',
                          borderRadius: 3,
                          background: item.badge === 'NEW' ? '#16A34A' : 'rgba(196,125,14,0.15)',
                          color: item.badge === 'NEW' ? '#FFFFFF' : '#C47D0E',
                          letterSpacing: '0.04em',
                          lineHeight: 1.1,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isTools && <ChevronDown size={10} style={{ opacity: 0.6 }} />}

                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: 'var(--accent)',
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </a>

                  {/* Mega-Flyout Menu on Tools */}
                  {isTools && toolsDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 380,
                        background: '#FFFFFF',
                        border: '1px solid #ECE7DE',
                        borderRadius: 10,
                        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(196, 125, 14, 0.1)',
                        padding: 16,
                        zIndex: 300,
                        animation: 'fadeIn 0.15s ease-out',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 12,
                          paddingBottom: 8,
                          borderBottom: '1px solid #F0ECE4',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calculator size={14} style={{ color: '#C47D0E' }} />
                          <span
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              color: '#0D1218',
                            }}
                          >
                            Engineering Calculators
                          </span>
                        </div>
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 9,
                            color: '#16A34A',
                            background: 'rgba(22, 163, 74, 0.1)',
                            padding: '1px 6px',
                            borderRadius: 4,
                            fontWeight: 700,
                          }}
                        >
                          20 Tools Active
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {quickTools.map(qt => (
                          <div
                            key={qt.slug}
                            onClick={() => {
                              setToolsDropdownOpen(false)
                              navigate(`/tools/${qt.slug}`)
                            }}
                            style={{
                              padding: '8px 10px',
                              borderRadius: 6,
                              background: '#FAF8F5',
                              border: '1px solid #EAE6DD',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'rgba(196, 125, 14, 0.08)'
                              e.currentTarget.style.borderColor = '#C47D0E'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = '#FAF8F5'
                              e.currentTarget.style.borderColor = '#EAE6DD'
                            }}
                          >
                            <div
                              style={{
                                fontFamily: 'Outfit, sans-serif',
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#0D1218',
                                lineHeight: 1.25,
                              }}
                            >
                              {qt.name}
                            </div>
                            <div
                              style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: 8.5,
                                color: '#C47D0E',
                                marginTop: 3,
                              }}
                            >
                              {qt.tag}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          paddingTop: 10,
                          borderTop: '1px solid #F0ECE4',
                          textAlign: 'center',
                        }}
                      >
                        <button
                          onClick={() => {
                            setToolsDropdownOpen(false)
                            navigate('/tools')
                          }}
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            color: '#C47D0E',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                          }}
                        >
                          View All 20+ Calculators <ArrowUpRight size={11} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* 3. Right Controls: Quick Search, Live Status Pill & CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Quick Search Shortcut Pill (Cmd+K / Ctrl+K) */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              title="Quick Search (Ctrl+K or ⌘K)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid #DDD9D0',
                borderRadius: 8,
                padding: '6px 10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#C47D0E'
                e.currentTarget.style.background = '#FFFFFF'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#DDD9D0'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)'
              }}
            >
              <Search size={13} style={{ color: '#C47D0E' }} strokeWidth={2.2} />
              <span
                className="desktop-only"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 11.5,
                  color: '#64748B',
                }}
              >
                Search...
              </span>
              <span
                className="desktop-only"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#8A94A6',
                  background: '#EFECE5',
                  padding: '1px 5px',
                  borderRadius: 4,
                  letterSpacing: '0.04em',
                }}
              >
                ⌘K
              </span>
            </button>

            <button onClick={handleCV} className="btn-outline-sm desktop-only" style={{ display: 'flex' }}>
              CV
            </button>
            <button onClick={handleBiodata} className="btn-outline-sm desktop-only" style={{ display: 'flex' }}>
              Biodata
            </button>

            <a
              href="#contact"
              onClick={e => handleAnchorClick(e, '#contact')}
              className="btn-primary desktop-only"
              style={{
                padding: '9px 18px',
                fontSize: 11,
                letterSpacing: '0.1em',
                gap: 6,
                boxShadow: '0 2px 10px rgba(196, 125, 14, 0.25)',
              }}
            >
              Hire me <ArrowUpRight size={12} strokeWidth={2.2} />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              className="mobile-only"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--fg)',
                padding: 4,
                display: 'flex',
              }}
              aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {menuOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        {/* 4. Live Scroll Reading & Progress Bar (Anchored to Nav Bottom) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'transparent',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${scrollProgress}%`,
              background: 'linear-gradient(90deg, #C47D0E 0%, #F59E0B 50%, #16A34A 100%)',
              transition: 'width 0.1s ease-out',
              boxShadow: '0 0 8px rgba(196, 125, 14, 0.5)',
            }}
          />
        </div>
      </nav>

      {/* Global Interactive Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Enhanced Mobile Full-Screen Menu Drawer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 190,
          background: 'var(--bg-2)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'var(--px)',
          overflowY: 'auto',
          paddingTop: 80,
        }}
      >
        {/* Mobile Quick Search Button */}
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => {
              setMenuOpen(false)
              setCommandPaletteOpen(true)
            }}
            style={{
              width: '100%',
              background: '#FFFFFF',
              border: '1px solid #DDD9D0',
              borderRadius: 8,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Search size={16} style={{ color: '#C47D0E' }} />
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#64748B' }}>
                Search calculators & articles...
              </span>
            </div>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                color: '#8A94A6',
                background: '#EFECE5',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              ⌘K
            </span>
          </button>
        </div>

        {/* Featured Video Shorts Card for Mobile Menu */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => {
              setMenuOpen(false)
              handleOpenStory(0)
            }}
            style={{
              width: '100%',
              background: '#FFFFFF',
              border: '1px solid rgba(196,125,14,0.3)',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(196,125,14,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  padding: 2,
                  background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={E.photo || sahinAvatar}
                  alt="Sahin"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13, color: '#0D1218' }}>
                  Watch Video Shorts & Stories
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#C47D0E' }}>
                  2 Featured Videos ▶
                </div>
              </div>
            </div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#C47D0E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <Play size={12} style={{ marginLeft: 2 }} />
            </div>
          </button>
        </div>

        {/* Mobile Nav Links */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {navItems.map((item, i) => {
            const isActive = item.to ? location.pathname.startsWith(item.to) : false
            return (
              <a
                key={item.label}
                href={item.to || item.href}
                onClick={e => handleNavClick(e, item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'clamp(12px, 2.2vh, 18px) 0',
                  borderBottom: '1px solid var(--border)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(28px, 7vw, 48px)',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--accent)' : 'var(--fg)',
                  textDecoration: 'none',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'none' : 'translateX(24px)',
                  transition: `opacity 0.4s ${0.06 + i * 0.05}s cubic-bezier(0.16,1,0.3,1), transform 0.4s ${0.06 + i * 0.05}s cubic-bezier(0.16,1,0.3,1)`,
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = isActive ? 'var(--accent)' : 'var(--fg)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 10,
                        fontWeight: 700,
                        color: item.badge === 'NEW' ? '#16A34A' : '#C47D0E',
                        background: item.badge === 'NEW' ? 'rgba(22,163,74,0.1)' : 'rgba(196,125,14,0.1)',
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <ArrowUpRight size={18} strokeWidth={1.5} style={{ color: isActive ? 'var(--accent)' : 'var(--muted)' }} />
              </a>
            )
          })}
        </div>

        {/* Mobile Footer CTAs & Direct Contact */}
        <div style={{ paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <button
              onClick={() => {
                handleCV()
                setMenuOpen(false)
              }}
              style={{
                padding: '12px',
                background: 'var(--bg-2)',
                border: '1px solid var(--border-strong)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                letterSpacing: '0.15em',
                color: 'var(--fg-dim)',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              CV
            </button>
            <button
              onClick={() => {
                handleBiodata()
                setMenuOpen(false)
              }}
              style={{
                padding: '12px',
                background: 'var(--bg-2)',
                border: '1px solid var(--border-strong)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                letterSpacing: '0.15em',
                color: 'var(--fg-dim)',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Biodata
            </button>
          </div>

          <a
            href="#contact"
            onClick={e => handleAnchorClick(e, '#contact')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Get in Touch <ArrowUpRight size={14} strokeWidth={2} />
          </a>

          <p
            style={{
              marginTop: 14,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9,
              color: 'var(--muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {E.name} · {E.title} · ABC Licensed
          </p>
        </div>
      </div>
    </>
  )
}
