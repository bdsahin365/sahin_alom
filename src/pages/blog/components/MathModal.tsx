import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600, padding: 20 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 15, color: '#0F172A', margin: 0 }}>
            Insert Equation
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}><X size={16} /></button>
        </div>

        {/* Mode tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9' }}>
          {[{ label: 'DISPLAY', val: true }, { label: 'INLINE', val: false }].map(t => (
            <button key={t.label} onClick={() => setIsDisplay(t.val)} style={{
              flex: 1, height: 36, border: 'none', background: 'transparent',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em',
              cursor: 'pointer', color: isDisplay === t.val ? '#C47D0E' : '#64748B',
              borderBottom: isDisplay === t.val ? '2px solid #C47D0E' : '2px solid transparent',
              transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 20px' }}>
          {/* Live preview */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#C47D0E', marginBottom: 8 }}>LIVE PREVIEW</div>
            <div
              style={{
                minHeight: 80, background: '#FEF9EC', border: '1px solid #F5E6C8',
                borderRadius: 8, padding: '20px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: isDisplay ? 20 : 16,
              }}
              dangerouslySetInnerHTML={{ __html: preview || '<span style="color:#CBD5E1;font-size:13px;font-family:Outfit,sans-serif">Preview appears here…</span>' }}
            />
          </div>

          {/* LaTeX input */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#C47D0E', marginBottom: 6 }}>LATEX SOURCE</div>
            <textarea
              ref={textareaRef}
              value={latex}
              onChange={e => setLatex(e.target.value)}
              rows={3}
              placeholder="P = \sqrt{3} \times V_L \times I_L \times \cos\varphi"
              style={{
                width: '100%', padding: '10px 12px', resize: 'vertical',
                background: '#0F172A', color: '#C47D0E', border: 'none',
                borderRadius: 6, fontFamily: 'JetBrains Mono,monospace', fontSize: 13,
                lineHeight: 1.6, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Templates */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#94A3B8', marginBottom: 6 }}>TEMPLATES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {TEMPLATES.map(t => (
                <button key={t.label} onClick={() => setLatex(t.latex)} style={{
                  padding: '3px 8px', border: '1px solid #E2E8F0', borderRadius: 4,
                  background: '#FAFAFA', cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
                  fontSize: 11, color: '#374151', transition: 'all 0.1s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'; (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#374151' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Symbols */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#94A3B8', marginBottom: 6 }}>QUICK INSERT</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {SYMBOLS.map(sym => (
                <button key={sym} onClick={() => insertSymbol(sym)} style={{
                  width: 28, height: 28, border: '1px solid #E2E8F0', borderRadius: 4,
                  background: '#FFFFFF', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 12, color: '#374151', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', transition: 'all 0.1s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'; (e.currentTarget as HTMLElement).style.color = '#C47D0E'; (e.currentTarget as HTMLElement).style.background = '#FEF9EC' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#374151'; (e.currentTarget as HTMLElement).style.background = '#FFFFFF' }}>
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{ flex: 1, height: 36, border: '1px solid #E2E8F0', borderRadius: 6, background: 'transparent', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#374151' }}>
              Cancel
            </button>
            <button
              onClick={() => { if (latex.trim()) onInsert(latex.trim(), isDisplay) }}
              disabled={!latex.trim()}
              style={{
                flex: 1, height: 36, border: 'none', borderRadius: 6, background: latex.trim() ? '#C47D0E' : '#E2E8F0',
                cursor: latex.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Outfit,sans-serif',
                fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: latex.trim() ? '#FFFFFF' : '#94A3B8', transition: 'all 0.15s',
              }}>
              Insert Equation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
