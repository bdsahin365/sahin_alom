import { useState, useEffect, useRef } from 'react'
import { X, Sigma } from 'lucide-react'

interface MathModalProps {
  initial?: string
  display?: boolean
  onInsert: (latex: string, display: boolean) => void
  onClose: () => void
}

const SYMBOLS = [
  'α','β','γ','δ','ε','ζ','η','θ','λ','μ','ν','ξ','π','ρ','σ','τ','φ','χ','ψ','ω',
  'Α','Β','Γ','Δ','Ε','Ζ','Λ','Μ','Π','Σ','Φ','Ψ','Ω',
  '∑','∫','∮','√','∛','∞','∂','∇','∆','∏',
  '×','÷','±','≈','≠','≤','≥','≡','∝','∈','∉','⊂','⊃','∪','∩',
  '°','′','″',
]

const TEMPLATES = [
  { label: 'Fraction',     latex: '\\frac{a}{b}' },
  { label: 'Square root',  latex: '\\sqrt{x}' },
  { label: 'Power',        latex: 'a^{n}' },
  { label: 'Subscript',    latex: 'a_{n}' },
  { label: 'Sum',          latex: '\\sum_{i=0}^{n} x_i' },
  { label: 'Integral',     latex: '\\int_{a}^{b} f(x)\\,dx' },
  { label: 'Matrix',       latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: 'Power (3φ)',   latex: 'P = \\sqrt{3} \\times V_L \\times I_L \\times \\cos\\varphi' },
  { label: 'Ohm\'s law',   latex: 'V = I \\times R' },
  { label: 'Voltage drop', latex: '\\Delta V = \\frac{\\rho \\cdot L \\cdot I}{A}' },
]

export default function MathModal({ initial = '', display = true, onInsert, onClose }: MathModalProps) {
  const [latex, setLatex] = useState(initial)
  const [isDisplay, setIsDisplay] = useState(display)
  const [preview, setPreview] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Render KaTeX preview
  useEffect(() => {
    const w = window as any
    if (w.katex && latex.trim()) {
      try {
        const html = w.katex.renderToString(latex, {
          displayMode: isDisplay, throwOnError: false,
          trust: true, strict: false,
        })
        setPreview(html)
      } catch {
        setPreview('<span style="color:#EF4444;font-size:12px">Syntax error</span>')
      }
    } else if (!latex.trim()) {
      setPreview('')
    }
  }, [latex, isDisplay])

  // Dynamically load KaTeX if not present
  useEffect(() => {
    const w = window as any
    if (!w.katex) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css'
      document.head.appendChild(link)
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js'
      script.onload = () => setLatex(l => l) // trigger re-render
      document.head.appendChild(script)
    }
  }, [])

  // Keyboard shortcut for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const insertSymbol = (sym: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const newVal = latex.slice(0, start) + sym + latex.slice(end)
    setLatex(newVal)
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + sym.length, start + sym.length) }, 0)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(11, 17, 24, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'clamp(10px, 4vh, 24px) 12px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          width: '100%',
          maxWidth: 540,
          maxHeight: 'min(92dvh, 640px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.3), 0 0 0 1px rgba(196,125,14,0.15)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid #ECE7DE',
            background: '#FAF8F5',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(196,125,14,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C47D0E' }}>
              <Sigma size={16} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#0F172A', margin: 0 }}>
                Insert KaTeX Math Equation
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A94A6', padding: 6, display: 'flex', borderRadius: 4 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Mode tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9', background: '#FFFFFF', flexShrink: 0 }}>
          {[{ label: 'DISPLAY BLOCK (Centered)', val: true }, { label: 'INLINE FORMULA', val: false }].map(t => (
            <button
              key={t.label}
              onClick={() => setIsDisplay(t.val)}
              style={{
                flex: 1,
                height: 38,
                border: 'none',
                background: 'transparent',
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 10,
                fontWeight: isDisplay === t.val ? 700 : 500,
                letterSpacing: '0.12em',
                cursor: 'pointer',
                color: isDisplay === t.val ? '#C47D0E' : '#64748B',
                borderBottom: isDisplay === t.val ? '2px solid #C47D0E' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
          {/* Live preview */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.15em', color: '#C47D0E', fontWeight: 700, marginBottom: 6 }}>
              LIVE PREVIEW
            </div>
            <div
              style={{
                minHeight: 76,
                background: '#FEF9EC',
                border: '1px solid #F5E6C8',
                borderRadius: 8,
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isDisplay ? 20 : 16,
                overflowX: 'auto',
              }}
              dangerouslySetInnerHTML={{ __html: preview || '<span style="color:#CBD5E1;font-size:13px;font-family:Outfit,sans-serif">KaTeX equation preview appears here…</span>' }}
            />
          </div>

          {/* LaTeX input */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.15em', color: '#C47D0E', fontWeight: 700, marginBottom: 6 }}>
              LATEX SOURCE
            </div>
            <textarea
              ref={textareaRef}
              value={latex}
              onChange={e => setLatex(e.target.value)}
              rows={3}
              placeholder="P = \sqrt{3} \times V_L \times I_L \times \cos\varphi"
              style={{
                width: '100%',
                padding: '10px 12px',
                resize: 'vertical',
                background: '#0D1218',
                color: '#F59E0B',
                border: '1px solid #243040',
                borderRadius: 8,
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 13,
                lineHeight: 1.6,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Templates */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.15em', color: '#64748B', fontWeight: 700, marginBottom: 6 }}>
              STANDARD ENGINEERING TEMPLATES
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {TEMPLATES.map(t => (
                <button
                  key={t.label}
                  onClick={() => setLatex(t.latex)}
                  style={{
                    padding: '4px 9px',
                    border: '1px solid #E2E8F0',
                    borderRadius: 5,
                    background: '#FAFAFA',
                    cursor: 'pointer',
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: '#334155',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'; (e.currentTarget as HTMLElement).style.color = '#C47D0E'; (e.currentTarget as HTMLElement).style.background = '#FEF9EC' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#334155'; (e.currentTarget as HTMLElement).style.background = '#FAFAFA' }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Symbols */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.15em', color: '#64748B', fontWeight: 700, marginBottom: 6 }}>
              QUICK INSERT SYMBOLS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {SYMBOLS.map(sym => (
                <button
                  key={sym}
                  onClick={() => insertSymbol(sym)}
                  style={{
                    width: 30,
                    height: 30,
                    border: '1px solid #E2E8F0',
                    borderRadius: 5,
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 13,
                    color: '#1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'; (e.currentTarget as HTMLElement).style.color = '#C47D0E'; (e.currentTarget as HTMLElement).style.background = '#FEF9EC' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#1E293B'; (e.currentTarget as HTMLElement).style.background = '#FFFFFF' }}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div style={{ display: 'flex', gap: 10, padding: '12px 20px', borderTop: '1px solid #ECE7DE', background: '#FAF8F5', flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 38,
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              background: '#FFFFFF',
              cursor: 'pointer',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 13,
              fontWeight: 500,
              color: '#475569',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => { if (latex.trim()) onInsert(latex.trim(), isDisplay) }}
            disabled={!latex.trim()}
            style={{
              flex: 1,
              height: 38,
              border: 'none',
              borderRadius: 6,
              background: latex.trim() ? '#C47D0E' : '#E2E8F0',
              cursor: latex.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: latex.trim() ? '#FFFFFF' : '#94A3B8',
              transition: 'all 0.15s',
            }}
          >
            Insert Equation
          </button>
        </div>
      </div>
    </div>
  )
}

