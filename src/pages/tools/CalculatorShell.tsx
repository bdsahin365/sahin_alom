import { useState, useEffect, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight, RotateCcw, Copy, Check, ChevronDown, ChevronUp, AlertTriangle, ArrowLeft } from 'lucide-react'
import EngineerNav from '../../components/EngineerNav'

type Props = {
  title: string
  description: string
  category: string
  inputs: ReactNode
  results: ReactNode
  formula?: ReactNode
  example?: ReactNode
  notes?: ReactNode
  onReset: () => void
  resultText?: string   // plain text for copy button
}

export default function CalculatorShell({
  title, description, category,
  inputs, results, formula, example, notes,
  onReset, resultText,
}: Props) {
  const [copied, setCopied] = useState(false)
  const [formulaOpen, setFormulaOpen] = useState(false)
  const [exampleOpen, setExampleOpen] = useState(false)

  // Set page title
  useEffect(() => {
    const prev = document.title
    document.title = `${title} — EE Tools | Md Sahin Alom`
    return () => { document.title = prev }
  }, [title])

  const copyResult = async () => {
    if (!resultText) return
    try {
      await navigator.clipboard.writeText(resultText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <>
      <EngineerNav />
      <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--nav-h)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 var(--px)' }}>

        {/* ── Top Navigation Bar: Back button & Breadcrumb ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 24, paddingBottom: 16, flexWrap: 'wrap', gap: 12,
        }}>
          <Link
            to="/tools"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 4,
              background: '#FFFFFF', border: '1px solid var(--border)',
              color: 'var(--fg-dim)', fontFamily: 'Outfit, sans-serif',
              fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
              textTransform: 'uppercase', textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--fg-dim)' }}
          >
            <ArrowLeft size={13} strokeWidth={2} /> Back to Tools
          </Link>

          {/* ── Breadcrumb ── */}
          <nav aria-label="breadcrumb" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)',
          }}>
            <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted)'}
            >HOME</Link>
            <ChevronRight size={10} strokeWidth={2} />
            <Link to="/tools" style={{ color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted)'}
            >TOOLS</Link>
            <ChevronRight size={10} strokeWidth={2} />
            <span style={{ color: 'var(--accent)', textTransform: 'uppercase' }}>{title}</span>
          </nav>
        </div>

        {/* ── Page header ── */}
        <header style={{ marginBottom: 36, borderBottom: '1px solid var(--border)', paddingBottom: 28 }}>
          <div style={{ marginBottom: 10 }}>
            <span style={{
              display: 'inline-block',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9.5, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--accent)',
              background: 'var(--accent-dim)',
              padding: '3px 10px', borderRadius: 2,
            }}>
              {category}
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 800, fontSize: 'clamp(28px,5vw,46px)',
            letterSpacing: '-0.01em', textTransform: 'uppercase',
            color: 'var(--fg)', lineHeight: 1.05, marginBottom: 12,
          }}>
            {title}
          </h1>
          <p style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 15,
            color: 'var(--fg-dim)', maxWidth: 600, lineHeight: 1.65,
          }}>
            {description}
          </p>
        </header>

        {/* ── Main 2-col layout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: 32,
          alignItems: 'start',
          marginBottom: 48,
        }}
          className="calc-grid"
        >
          {/* Left — Inputs */}
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            padding: '28px 24px',
          }}>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--fg-dim)',
              }}>Inputs</span>
              <button
                id="calc-reset-btn"
                onClick={onReset}
                title="Reset to defaults"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'none', border: '1px solid var(--border-strong)',
                  color: 'var(--fg-dim)', cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '5px 10px', borderRadius: 2,
                  transition: 'border-color 0.18s, color 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--fg-dim)' }}
              >
                <RotateCcw size={10} strokeWidth={2} /> Reset
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {inputs}
            </div>
          </div>

          {/* Right — Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--fg-dim)',
              }}>Result</span>
              {resultText && (
                <button
                  id="calc-copy-btn"
                  onClick={copyResult}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: 'none', border: '1px solid var(--border-strong)',
                    color: copied ? 'var(--green)' : 'var(--fg-dim)', cursor: 'pointer',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: '5px 10px', borderRadius: 2,
                    transition: 'border-color 0.18s, color 0.18s',
                  }}
                >
                  {copied ? <Check size={10} strokeWidth={2} /> : <Copy size={10} strokeWidth={2} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            {results}
          </div>
        </div>

        {/* ── Collapsible sections ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 64 }}>
          {/* Formula */}
          {formula && (
            <Accordion
              id="formula-section"
              title="Formula Used"
              open={formulaOpen}
              onToggle={() => setFormulaOpen(o => !o)}
            >
              {formula}
            </Accordion>
          )}

          {/* Example */}
          {example && (
            <Accordion
              id="example-section"
              title="Worked Example"
              open={exampleOpen}
              onToggle={() => setExampleOpen(o => !o)}
            >
              {example}
            </Accordion>
          )}

          {/* Notes */}
          {notes && (
            <div style={{
              border: '1px solid rgba(196,125,14,0.3)',
              background: 'rgba(196,125,14,0.04)',
              borderRadius: 4, padding: '18px 20px',
              display: 'flex', gap: 12,
            }}>
              <AlertTriangle size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} strokeWidth={1.5} />
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.7 }}>
                {notes}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive style — stack columns on mobile */}
      <style>{`
        @media (max-width: 700px) {
          .calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
    </>
  )
}

// ── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ id, title, open, onToggle, children }: {
  id: string; title: string; open: boolean; onToggle: () => void; children: ReactNode
}) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
      <button
        id={id}
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', background: 'var(--bg-2)',
          border: 'none', cursor: 'pointer', gap: 10,
        }}
      >
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-dim)',
        }}>{title}</span>
        {open ? <ChevronUp size={13} strokeWidth={2} style={{ color: 'var(--muted)' }} />
               : <ChevronDown size={13} strokeWidth={2} style={{ color: 'var(--muted)' }} />}
      </button>
      {open && (
        <div style={{
          padding: '20px 20px',
          background: 'var(--bg)',
          borderTop: '1px solid var(--border)',
          fontFamily: 'Outfit, sans-serif', fontSize: 14,
          color: 'var(--fg-dim)', lineHeight: 1.75,
        }}>
          {children}
        </div>
      )}
    </div>
  )
}
