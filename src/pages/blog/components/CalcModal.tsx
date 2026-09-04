import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { CalcBlockAttrs } from '../extensions/CalcBlock'

interface CalcModalProps {
  initial?: Partial<CalcBlockAttrs>
  onInsert: (attrs: CalcBlockAttrs) => void
  onClose: () => void
}

const DEFAULT: CalcBlockAttrs = {
  title: '', given: [], formula: '', steps: [], result: '', resultUnit: '', resultNote: '',
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#C47D0E', marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  )
}

function SInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 5, fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#0F172A', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box' }} />
  )
}

export default function CalcModal({ initial, onInsert, onClose }: CalcModalProps) {
  const [attrs, setAttrs] = useState<CalcBlockAttrs>({ ...DEFAULT, ...initial })

  const upd = (patch: Partial<CalcBlockAttrs>) => setAttrs(a => ({ ...a, ...patch }))

  const updGiven = (i: number, patch: Partial<{ label: string; value: string; unit: string }>) =>
    setAttrs(a => { const g = [...a.given]; g[i] = { ...g[i], ...patch }; return { ...a, given: g } })
  const addGiven = () => setAttrs(a => ({ ...a, given: [...a.given, { label: '', value: '', unit: '' }] }))
  const delGiven = (i: number) => setAttrs(a => ({ ...a, given: a.given.filter((_, j) => j !== i) }))

  const updStep = (i: number, v: string) =>
    setAttrs(a => { const s = [...a.steps]; s[i] = v; return { ...a, steps: s } })
  const addStep = () => setAttrs(a => ({ ...a, steps: [...a.steps, ''] }))
  const delStep = (i: number) => setAttrs(a => ({ ...a, steps: a.steps.filter((_, j) => j !== i) }))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600, padding: 20 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: '100%', maxWidth: 540, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 15, color: '#0F172A', margin: 0 }}>Engineering Calculation Block</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}><X size={16} /></button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px' }}>
          <Row label="TITLE">
            <SInput value={attrs.title} onChange={v => upd({ title: v })} placeholder="Three-Phase Power — Active Power" />
          </Row>

          {/* Given */}
          <Row label="GIVEN VALUES">
            {attrs.given.map((g, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                <input value={g.label} onChange={e => updGiven(i, { label: e.target.value })} placeholder="Label (e.g. Voltage)"
                  style={{ flex: 2, height: 30, padding: '0 8px', border: '1px solid #E2E8F0', borderRadius: 5, fontFamily: 'Outfit,sans-serif', fontSize: 11, outline: 'none' }} />
                <input value={g.value} onChange={e => updGiven(i, { value: e.target.value })} placeholder="Value"
                  style={{ flex: 1, height: 30, padding: '0 8px', border: '1px solid #E2E8F0', borderRadius: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, outline: 'none' }} />
                <input value={g.unit} onChange={e => updGiven(i, { unit: e.target.value })} placeholder="Unit"
                  style={{ flex: 1, height: 30, padding: '0 8px', border: '1px solid #E2E8F0', borderRadius: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, outline: 'none' }} />
                <button onClick={() => delGiven(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', padding: 4 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EF4444' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#CBD5E1' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button onClick={addGiven} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '7px', background: 'transparent', border: '1px dashed #E2E8F0', borderRadius: 5, color: '#94A3B8', fontSize: 11, fontFamily: 'Outfit,sans-serif', cursor: 'pointer', marginTop: 2 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'; (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}>
              <Plus size={12} /> Add given value
            </button>
          </Row>

          <Row label="FORMULA">
            <SInput value={attrs.formula} onChange={v => upd({ formula: v })} placeholder="P = √3 × V × I × cosφ" />
          </Row>

          {/* Steps */}
          <Row label="SOLUTION STEPS">
            {attrs.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                <input value={s} onChange={e => updStep(i, e.target.value)} placeholder={`Step ${i + 1}…`}
                  style={{ flex: 1, height: 30, padding: '0 8px', border: '1px solid #E2E8F0', borderRadius: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, outline: 'none' }} />
                <button onClick={() => delStep(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', padding: 4 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EF4444' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#CBD5E1' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button onClick={addStep} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '7px', background: 'transparent', border: '1px dashed #E2E8F0', borderRadius: 5, color: '#94A3B8', fontSize: 11, fontFamily: 'Outfit,sans-serif', cursor: 'pointer', marginTop: 2 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'; (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}>
              <Plus size={12} /> Add step
            </button>
          </Row>

          {/* Result */}
          <Row label="RESULT">
            <div style={{ display: 'flex', gap: 8 }}>
              <SInput value={attrs.result} onChange={v => upd({ result: v })} placeholder="12.22" />
              <input value={attrs.resultUnit} onChange={e => upd({ resultUnit: e.target.value })} placeholder="kW"
                style={{ width: 80, height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, outline: 'none', flexShrink: 0 }} />
            </div>
          </Row>

          <Row label="RESULT NOTE">
            <SInput value={attrs.resultNote} onChange={v => upd({ resultNote: v })} placeholder="Active power delivered by the three-phase system" />
          </Row>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 20px', borderTop: '1px solid #F1F5F9', flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, height: 36, border: '1px solid #E2E8F0', borderRadius: 6, background: 'transparent', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#374151' }}>
            Cancel
          </button>
          <button onClick={() => onInsert(attrs)} style={{ flex: 1, height: 36, border: 'none', borderRadius: 6, background: '#C47D0E', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FFFFFF' }}>
            Insert Block
          </button>
        </div>
      </div>
    </div>
  )
}
