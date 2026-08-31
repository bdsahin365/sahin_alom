import { useState, useEffect } from 'react'
import { ArrowUpRight, Sun, Moon, ArrowLeft, Menu, X } from 'lucide-react'

type NavProps = {
  dark: boolean
  setDark: (v: boolean) => void
  currentPage: 'portfolio' | 'casestudy'
  onBack?: () => void
}

export default function Nav({ dark, setDark, currentPage, onBack }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = ['Work', 'About', 'Services', 'Contact']

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        backgroundColor: scrolled
          ? dark ? 'rgba(17,17,16,0.94)' : 'rgba(245,242,237,0.94)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'background-color 0.3s, border-color 0.3s',
      }}>
        <div style={{
          maxWidth: 'var(--max-w)', margin: '0 auto',
          padding: '0 var(--px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 60,
        }}>
          {/* Logo / back */}
          {currentPage === 'casestudy' && onBack ? (
            <button onClick={onBack} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: 8, padding: 0,
            }}>
              <ArrowLeft size={16} strokeWidth={1.5} />
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 300, letterSpacing: '-0.03em' }}>MSA</span>
            </button>
          ) : (
            <a href="#" style={{ textDecoration: 'none', color: 'var(--fg)' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 300, letterSpacing: '-0.03em' }}>MSA</span>
            </a>
          )}

          {/* Desktop nav links */}
          {currentPage === 'portfolio' && (
            <div className="desktop-nav" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              {navLinks.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.01em', transition: 'color 0.18s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  {l}
                </a>
              ))}
            </div>
          )}

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              style={{
                width: 34, height: 34, borderRadius: '50%',
                border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--muted)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--fg)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)' }}
            >
              {dark ? <Sun size={13} strokeWidth={1.5} /> : <Moon size={13} strokeWidth={1.5} />}
            </button>

            <a href="#contact" className="desktop-nav"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', background: 'var(--fg)', color: 'var(--bg)',
                borderRadius: 2, fontSize: 12, fontWeight: 500, letterSpacing: '0.02em',
                textDecoration: 'none', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.78')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
            >
              Let's talk
              <ArrowUpRight size={12} strokeWidth={2} />
            </a>

            {/* Mobile hamburger */}
            <button
              className="mobile-nav"
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg)', padding: 4, display: 'none' }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      <div style={{
        position: 'fixed', inset: 0, top: 60, zIndex: 198,
        background: 'var(--bg)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: 'clamp(32px,6vw,56px) var(--px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        overflowY: 'auto',
      }}>
        <div>
          {navLinks.map((l, i) => (
            <a key={l} href={`#${l.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 0', borderBottom: '1px solid var(--border)',
                fontFamily: 'Fraunces, serif', fontOpticalSizing: 'auto',
                fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 300,
                letterSpacing: '-0.02em', color: 'var(--fg)', textDecoration: 'none',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateX(0)' : 'translateX(20px)',
                transition: `opacity 0.35s ${0.08 + i * 0.06}s ease, transform 0.4s ${0.08 + i * 0.06}s cubic-bezier(0.16,1,0.3,1)`,
              }}
            >
              <span>{l}</span>
              <ArrowUpRight size={18} strokeWidth={1.5} style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
        <div style={{ paddingTop: 40 }}>
          <a href="#contact" onClick={() => setMenuOpen(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', background: 'var(--fg)', color: 'var(--bg)',
              borderRadius: 2, fontSize: 14, fontWeight: 500, textDecoration: 'none',
            }}>
            Let's talk
            <ArrowUpRight size={14} strokeWidth={1.5} />
          </a>
          <p className="mono" style={{ marginTop: 20, fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>sahinalom.com</p>
        </div>
      </div>
    </>
  )
}
