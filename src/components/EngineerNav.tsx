import { useState, useEffect } from 'react'
import { ArrowUpRight, Menu, X, Zap, Play, Wrench, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useSite } from '../context/SiteContext'
import sahinAvatar from '../img/sahin.png'

type Props = {
  menuOpen: boolean
  setMenuOpen: (v: boolean) => void
  onBiodata: () => void
  onCV: () => void
  onOpenStory: (index?: number) => void
}

export default function EngineerNav({ menuOpen, setMenuOpen, onBiodata, onCV, onOpenStory }: Props) {
  const navigate = useNavigate()
  const { data: { engineer: E } } = useSite()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = ['About', 'Expertise', 'Projects', 'Services', 'Contact']

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 'var(--nav-h)',
        background: scrolled ? 'rgba(247,245,240,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}>
        <div style={{
          maxWidth: 'var(--max-w)', margin: '0 auto',
          padding: '0 var(--px)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '100%', gap: 20,
        }}>
          {/* Left Brand & Story Avatar Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Logo */}
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ width: 28, height: 28, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={13} strokeWidth={2.5} style={{ color: '#FFFFFF' }} />
              </div>
              <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.04em', color: 'var(--fg)', textTransform: 'uppercase' as const }}>
                {E.initials}
              </span>
            </a>

            {/* Story Ring Shorts Trigger Button */}
            <button
              onClick={() => onOpenStory(0)}
              title="Watch Video Shorts & Stories"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(196, 125, 14, 0.35)',
                borderRadius: 99,
                padding: '3px 10px 3px 3px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: '0 2px 8px rgba(196, 125, 14, 0.12)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.04)'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(196, 125, 14, 0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(196, 125, 14, 0.12)'
              }}
            >
              {/* Animated Story Ring Avatar */}
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                padding: 2,
                background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <img
                  src={sahinAvatar}
                  alt="Story"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid #FFFFFF',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: '#0D1218',
                  letterSpacing: '0.02em',
                }}>
                  Shorts
                </span>
                <span style={{
                  background: '#C47D0E',
                  color: '#FFFFFF',
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 8,
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: 8,
                  lineHeight: 1.2,
                }}>
                  2
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="desktop-only" style={{ gap: 32, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            {links.map(l => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="link-line"
                style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'var(--fg-dim)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}
              >{l}</a>
            ))}
          </div>

          {/* Right Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            {E.available && (
              <div className="desktop-only" style={{ alignItems: 'center', gap: 7 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--green)', letterSpacing: '0.2em', textTransform: 'uppercase' as const }}>Available</span>
              </div>
            )}
            <button onClick={onCV} className="btn-outline-sm desktop-only" style={{ display: 'flex' }}>
              CV
            </button>
            <button onClick={onBiodata} className="btn-outline-sm desktop-only" style={{ display: 'flex' }}>
              Biodata
            </button>
            <button
              onClick={() => navigate('/tools')}
              className="btn-outline-sm desktop-only"
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <Wrench size={10} strokeWidth={2} /> Tools
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="btn-outline-sm desktop-only"
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <BookOpen size={10} strokeWidth={2} /> Blog
            </button>
            <a href="#contact" className="btn-primary desktop-only" style={{ padding: '9px 18px', fontSize: 11, letterSpacing: '0.1em', gap: 6 }}>
              Hire me <ArrowUpRight size={12} strokeWidth={2} />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button className="mobile-only" onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg)', padding: 4, display: 'flex' }}>
              {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu Drawer */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 190,
        background: 'var(--bg-2)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'var(--px)', overflowY: 'auto',
      }}>
        {/* Featured Video Shorts Card for Mobile Menu */}
        <div style={{ marginBottom: 20, paddingTop: 60 }}>
          <button
            onClick={() => { setMenuOpen(false); onOpenStory(0) }}
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
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                padding: 2,
                background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img src={sahinAvatar} alt="Sahin" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 13, color: '#0D1218' }}>
                  Watch Video Shorts & Stories
                </div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#C47D0E' }}>
                  2 Featured Videos ▶
                </div>
              </div>
            </div>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#C47D0E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <Play size={12} style={{ marginLeft: 2 }} />
            </div>
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {links.map((l, i) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'clamp(14px,2.5vh,20px) 0', borderBottom: '1px solid var(--border)',
                fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800,
                fontSize: 'clamp(32px,8vw,60px)', textTransform: 'uppercase' as const,
                color: 'var(--fg)', textDecoration: 'none',
                opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'none' : 'translateX(24px)',
                transition: `opacity 0.4s ${0.06 + i * 0.06}s cubic-bezier(0.16,1,0.3,1), transform 0.4s ${0.06 + i * 0.06}s cubic-bezier(0.16,1,0.3,1)`,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--fg)')}
            >
              <span>{l}</span>
              <ArrowUpRight size={18} strokeWidth={1.5} style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>

        <div style={{ paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <button onClick={() => { onCV(); setMenuOpen(false) }} style={{ padding: '12px', background: 'var(--bg-2)', border: '1px solid var(--border-strong)', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.15em', color: 'var(--fg-dim)', textTransform: 'uppercase', cursor: 'pointer' }}>CV</button>
            <button onClick={() => { onBiodata(); setMenuOpen(false) }} style={{ padding: '12px', background: 'var(--bg-2)', border: '1px solid var(--border-strong)', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.15em', color: 'var(--fg-dim)', textTransform: 'uppercase', cursor: 'pointer' }}>Biodata</button>
            <button onClick={() => { navigate('/tools'); setMenuOpen(false) }} style={{ padding: '12px', background: 'var(--bg-2)', border: '1px solid var(--border-strong)', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.15em', color: 'var(--fg-dim)', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}><Wrench size={10} strokeWidth={2} />Tools</button>
            <button onClick={() => { navigate('/blog'); setMenuOpen(false) }} style={{ padding: '12px', background: 'var(--bg-2)', border: '1px solid var(--border-strong)', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.15em', color: 'var(--fg-dim)', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}><BookOpen size={10} strokeWidth={2} />Blog</button>
          </div>
          <a href="#contact" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Get in Touch <ArrowUpRight size={14} strokeWidth={2} />
          </a>
          <p style={{ marginTop: 14, fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
            {E.name} · {E.title} · ABC Licensed
          </p>
        </div>
      </div>
    </>
  )
}
