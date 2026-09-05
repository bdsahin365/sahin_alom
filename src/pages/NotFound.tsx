import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Zap, AlertTriangle, RefreshCw, Home, Wrench, BookOpen,
  ArrowRight, ShieldAlert, Cpu, Activity, CheckCircle2
} from 'lucide-react'
import EngineerNav from '../components/EngineerNav'
import SEOHead from '../components/SEOHead'
import { useSite } from '../context/SiteContext'

export default function NotFound() {
  const navigate = useNavigate()
  const { data: { engineer: E } } = useSite()
  const [breakerTripped, setBreakerTripped] = useState(true)
  const [resetting, setResetting] = useState(false)

  const handleResetBreaker = () => {
    setResetting(true)
    setTimeout(() => {
      setBreakerTripped(false)
      setResetting(false)
      setTimeout(() => {
        navigate('/')
      }, 900)
    }, 600)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--fg)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SEOHead
        title="404 — Feeder Circuit Open (Page Not Found)"
        description="The requested feeder route or page address is open or de-energized."
      />

      <EngineerNav />

      {/* CAD Electrical Grid Ambient Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(196,125,14,0.15) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px, 8px 8px',
        opacity: 0.6,
        zIndex: 0
      }} />

      {/* Warm Electrical Arc Glow */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        background: breakerTripped
          ? 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 60%)'
          : 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 60%)',
        pointerEvents: 'none',
        transition: 'background 0.5s ease',
        zIndex: 0
      }} />

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(var(--nav-h) + 24px) var(--px) 48px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: 680,
          width: '100%',
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          boxShadow: '0 20px 60px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          position: 'relative'
        }}>

          {/* Top Industrial Equipment Terminal Ribbon */}
          <div style={{
            background: breakerTripped ? '#0D1218' : '#14532D',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-strong)',
            transition: 'background 0.4s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: breakerTripped ? '#EF4444' : '#22C55E',
                boxShadow: breakerTripped ? '0 0 10px #EF4444' : '0 0 10px #22C55E'
              }} />
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                letterSpacing: '0.14em',
                color: '#FAF8F5',
                textTransform: 'uppercase',
                fontWeight: 700
              }}>
                {breakerTripped ? 'FAULT RELAY: TRIP CODE 404' : 'FEEDER STATUS: ENERGIZED & NORMAL'}
              </span>
            </div>

            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: breakerTripped ? '#F87171' : '#86EFAC',
              letterSpacing: '0.1em'
            }}>
              {breakerTripped ? 'CIRCUIT OPEN' : 'BUS CLOSED'}
            </span>
          </div>

          <div style={{ padding: 'clamp(28px, 5vw, 44px)' }}>

            {/* Giant 404 Schematic Display */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 10
              }}>
                <span className="display" style={{
                  fontSize: 'clamp(64px, 12vw, 110px)',
                  lineHeight: 0.9,
                  color: breakerTripped ? '#DC2626' : '#16A34A',
                  letterSpacing: '-0.03em',
                  transition: 'color 0.4s ease'
                }}>
                  404
                </span>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  borderLeft: '2px solid var(--border)',
                  paddingLeft: 14
                }}>
                  <span style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 'clamp(18px, 3vw, 24px)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--fg)',
                    lineHeight: 1.1
                  }}>
                    Circuit Breaker Tripped
                  </span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    color: 'var(--accent)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 600
                  }}>
                    Route Non-Conductive
                  </span>
                </div>
              </div>

              <p style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 14.5,
                color: 'var(--fg-dim)',
                lineHeight: 1.65,
                maxWidth: 520,
                margin: '0 auto',
                fontWeight: 300
              }}>
                The requested feeder path or page address cannot be energized. The circuit was interrupted because the destination does not exist in the active Single-Line Diagram.
              </p>
            </div>

            {/* Electrical Telemetry Meter Box */}
            <div style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '16px 20px',
              marginBottom: 28,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 14
            }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Bus Voltage</div>
                <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: breakerTripped ? '#EF4444' : '#16A34A' }}>
                  {breakerTripped ? '0.00 kV' : '11.00 kV'}
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Path Impedance</div>
                <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--fg)' }}>
                  {breakerTripped ? '∞ Ω (Open)' : '0.02 Ω (Normal)'}
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Arc Chute Relay</div>
                <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: breakerTripped ? '#C47D0E' : '#16A34A' }}>
                  {breakerTripped ? 'DISCHARGED' : 'ARMED'}
                </div>
              </div>
            </div>

            {/* Interactive Reset Breaker Lever / Action Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleResetBreaker}
                disabled={resetting || !breakerTripped}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: breakerTripped ? 'var(--accent)' : '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 4,
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  cursor: (resetting || !breakerTripped) ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 14px rgba(196,125,14,0.3)',
                }}
              >
                {resetting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Closing Interrupter Contacts...
                  </>
                ) : !breakerTripped ? (
                  <>
                    <CheckCircle2 size={16} /> Feeder Restored! Redirecting Home...
                  </>
                ) : (
                  <>
                    <Zap size={16} /> Reset Circuit Breaker &amp; Return Home
                  </>
                )}
              </button>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: 10,
                width: '100%',
                marginTop: 8
              }}>
                <Link
                  to="/"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 4, textDecoration: 'none', color: 'var(--fg)',
                    fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500
                  }}
                >
                  <Home size={13} style={{ color: 'var(--accent)' }} /> Home
                </Link>

                <Link
                  to="/tools"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 4, textDecoration: 'none', color: 'var(--fg)',
                    fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500
                  }}
                >
                  <Wrench size={13} style={{ color: 'var(--accent)' }} /> 20+ Tools
                </Link>

                <Link
                  to="/blog"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 4, textDecoration: 'none', color: 'var(--fg)',
                    fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500
                  }}
                >
                  <BookOpen size={13} style={{ color: 'var(--accent)' }} /> Articles
                </Link>

                <Link
                  to="/contact"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 4, textDecoration: 'none', color: 'var(--fg)',
                    fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500
                  }}
                >
                  <Zap size={13} style={{ color: 'var(--accent)' }} /> Consultation
                </Link>
              </div>
            </div>

          </div>

          {/* Schematic Sub-Footer */}
          <div style={{
            background: 'var(--bg)',
            borderTop: '1px solid var(--border)',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 10,
            fontFamily: 'JetBrains Mono,monospace',
            color: 'var(--muted)'
          }}>
            <span>ENGR: {E.name} (PE)</span>
            <span>SYSTEM: 50Hz / 400V / 11kV</span>
          </div>

        </div>
      </main>
    </div>
  )
}
