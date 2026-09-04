import { useState, useRef, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

interface MermaidModalProps {
  initial?: string
  caption?: string
  figNum?: string
  onInsert: (attrs: { code: string; caption: string; figNum: string }) => void
  onClose: () => void
}

const TEMPLATES = [
  { label: 'Flowchart', code: 'graph TD\n  A[Start] --> B{Decision?}\n  B -- Yes --> C[Action A]\n  B -- No --> D[Action B]\n  C --> E[End]\n  D --> E' },
  { label: 'Sequence', code: 'sequenceDiagram\n  participant Client\n  participant Server\n  participant DB\n  Client->>Server: Request\n  Server->>DB: Query\n  DB-->>Server: Data\n  Server-->>Client: Response' },
  { label: 'State', code: 'stateDiagram-v2\n  [*] --> Idle\n  Idle --> Running : start()\n  Running --> Idle : stop()\n  Running --> Fault : error()\n  Fault --> Idle : reset()' },
  { label: 'Class', code: 'classDiagram\n  class Circuit {\n    +voltage: float\n    +current: float\n    +resistance: float\n    +calcPower() float\n  }' },
  { label: 'Gantt', code: 'gantt\n  title Project Schedule\n  dateFormat  YYYY-MM-DD\n  section Design\n  Schematic : 2025-01-01, 7d\n  PCB Layout : 7d\n  section Testing\n  Unit Tests : 5d\n  Integration : 5d' },
  { label: 'Pie Chart', code: "pie title Power Losses\n  \"Copper\" : 45\n  \"Core\" : 25\n  \"Stray\" : 15\n  \"Friction\" : 15" },
  { label: 'Single Line Diagram', code: 'graph LR\n  Grid([33kV Grid])\n  T1[/Transformer\\n33kV/11kV/]\n  Bus1((11kV Busbar))\n  CB1[Circuit Breaker]\n  Load1[Load 1\\n500kW]\n  Grid --> T1\n  T1 --> Bus1\n  Bus1 --> CB1\n  CB1 --> Load1' },
]

export default function MermaidModal({ initial = '', caption: initCaption = '', figNum: initFigNum = '', onInsert, onClose }: MermaidModalProps) {
  const [code, setCode] = useState(initial || TEMPLATES[0].code)
  const [caption, setCaption] = useState(initCaption)
  const [figNum, setFigNum] = useState(initFigNum)
  const [renderKey, setRenderKey] = useState(0)
  const previewRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const renderDiagram = () => {
    const w = window as any
    const el = previewRef.current
    if (!el) return
    if (w.mermaid && code.trim()) {
      el.innerHTML = '<div style="color:#94A3B8;font-size:12px;font-family:Outfit,sans-serif;padding:12px;text-align:center">Rendering…</div>'
      const id = 'mermaid-modal-' + Date.now()
      w.mermaid.render(id, code).then(({ svg }: { svg: string }) => {
        if (el) { el.innerHTML = svg; const svgEl = el.querySelector('svg'); if (svgEl) { svgEl.style.maxWidth = '100%'; svgEl.style.height = 'auto' } }
      }).catch((err: any) => {
        if (el) el.innerHTML = `<div style="color:#EF4444;font-size:11px;font-family:JetBrains Mono,monospace;white-space:pre-wrap;padding:12px">${String(err).slice(0, 200)}</div>`
      })
    } else if (!w.mermaid) {
      el.innerHTML = '<div style="color:#94A3B8;font-size:12px;font-family:Outfit,sans-serif;padding:12px;text-align:center">Loading Mermaid…</div>'
    }
  }

  // Load Mermaid from CDN if not present
  useEffect(() => {
    const w = window as any
    if (!w.mermaid) {
      const s = document.createElement('script')
      s.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
      s.onload = () => {
        w.mermaid.initialize({ startOnLoad: false, theme: 'base', themeVariables: { primaryColor: '#FEF3C7', primaryTextColor: '#0F172A', primaryBorderColor: '#C47D0E', lineColor: '#64748B', fontFamily: 'Outfit,sans-serif' } })
        renderDiagram()
      }
      document.head.appendChild(s)
    } else {
      renderDiagram()
    }
  }, [])

  // Re-render on code change (debounced)
  useEffect(() => {
    const t = setTimeout(() => renderDiagram(), 600)
    return () => clearTimeout(t)
  }, [code, renderKey])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 700, padding: 20 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: '100%', maxWidth: 680, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 15, color: '#0F172A', margin: 0 }}>Mermaid Diagram</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, display: 'flex' }}><X size={16} /></button>
        </div>

        {/* Templates */}
        <div style={{ padding: '10px 20px', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#94A3B8', marginBottom: 6 }}>TEMPLATES</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {TEMPLATES.map(t => (
              <button key={t.label} onClick={() => { setCode(t.code); setRenderKey(k => k + 1) }} style={{
                padding: '3px 10px', border: '1px solid #E2E8F0', borderRadius: 4, background: '#FAFAFA',
                cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#374151', transition: 'all 0.1s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'; (e.currentTarget as HTMLElement).style.color = '#C47D0E'; (e.currentTarget as HTMLElement).style.background = '#FEF9EC' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#374151'; (e.currentTarget as HTMLElement).style.background = '#FAFAFA' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor + Preview split */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', gap: 0 }}>
          {/* Code */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #E2E8F0' }}>
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #F1F5F9', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#C47D0E', background: '#0F172A' }}>
              DIAGRAM CODE
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              style={{
                flex: 1, padding: '16px', resize: 'none', border: 'none', outline: 'none',
                fontFamily: 'JetBrains Mono,monospace', fontSize: 12, lineHeight: 1.65,
                background: '#0F172A', color: '#C47D0E', minHeight: 240,
              }}
            />
          </div>
          {/* Preview */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #F1F5F9', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#C47D0E', background: '#F8FAFC', flexShrink: 0 }}>
              LIVE PREVIEW
            </div>
            <div ref={previewRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }} />
          </div>
        </div>

        {/* Caption + Figure number */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 10, flexShrink: 0 }}>
          <div style={{ flex: '0 0 90px' }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, letterSpacing: '0.15em', color: '#94A3B8', marginBottom: 4 }}>FIG NO.</div>
            <input value={figNum} onChange={e => setFigNum(e.target.value)} placeholder="Fig. 1" style={{ width: '100%', height: 30, padding: '0 8px', border: '1px solid #E2E8F0', borderRadius: 5, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, letterSpacing: '0.15em', color: '#94A3B8', marginBottom: 4 }}>CAPTION</div>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Three-phase power flow diagram" style={{ width: '100%', height: 30, padding: '0 8px', border: '1px solid #E2E8F0', borderRadius: 5, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 16px', flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, height: 36, border: '1px solid #E2E8F0', borderRadius: 6, background: 'transparent', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#374151' }}>
            Cancel
          </button>
          <button
            onClick={() => onInsert({ code, caption, figNum })}
            disabled={!code.trim()}
            style={{
              flex: 1, height: 36, border: 'none', borderRadius: 6,
              background: code.trim() ? '#C47D0E' : '#E2E8F0', cursor: code.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: code.trim() ? '#FFFFFF' : '#94A3B8',
            }}>
            Insert Diagram
          </button>
        </div>
      </div>
    </div>
  )
}
