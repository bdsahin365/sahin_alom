import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { useSite, ServiceItem } from '../../../context/SiteContext'
import { Section, AddButton } from '../components/AdminPrimitives'

export default function ServicesSection() {
  const { data: { services }, updateServices } = useSite()
  const upd = (i: number, p: Partial<ServiceItem>) =>
    updateServices(services.map((s, j) => (j === i ? { ...s, ...p } : s)))
  const move = (i: number, d: 'up' | 'down') => {
    const n = [...services]
    const target = i + (d === 'up' ? -1 : 1)
    ;[n[i], n[target]] = [n[target], n[i]]
    updateServices(n)
  }

  return (
    <Section title="Services" description={`${services.length} services listed`}>
      {services.map((s, i) => (
        <div key={s.id} style={{ border: '1px solid #E2E8F0', borderRadius: 6, marginBottom: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'stretch', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #E2E8F0' }}>
              <button
                type="button"
                onClick={() => i > 0 && move(i, 'up')}
                disabled={i === 0}
                style={{ background: 'none', border: 'none', cursor: i > 0 ? 'pointer' : 'default', color: i > 0 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}
              >
                <ChevronUp size={11} />
              </button>
              <button
                type="button"
                onClick={() => i < services.length - 1 && move(i, 'down')}
                disabled={i >= services.length - 1}
                style={{ background: 'none', border: 'none', cursor: i < services.length - 1 ? 'pointer' : 'default', color: i < services.length - 1 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}
              >
                <ChevronDown size={11} />
              </button>
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#C47D0E', padding: '0 10px', display: 'flex', alignItems: 'center', minWidth: 36 }}>
              {s.num}
            </span>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', padding: '10px 12px', background: '#FFFFFF' }}>
              <input
                value={s.name}
                onChange={e => upd(i, { name: e.target.value })}
                placeholder="Service name"
                style={{ height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 13, outline: 'none', color: '#1E293B' }}
              />
              <input
                value={s.detail}
                onChange={e => upd(i, { detail: e.target.value })}
                placeholder="Keywords / detail"
                style={{ height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 13, outline: 'none', color: '#374151' }}
              />
            </div>
            <button
              type="button"
              onClick={() => updateServices(services.filter((_, j) => j !== i))}
              style={{ padding: '0 12px', background: 'none', border: 'none', borderLeft: '1px solid #E2E8F0', cursor: 'pointer', color: '#CBD5E1', transition: 'color 0.15s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
      <AddButton
        label="Add service"
        onClick={() => {
          const n = services.length + 1
          updateServices([...services, { id: `svc-${Date.now()}`, num: String(n).padStart(2, '0'), name: '', detail: '' }])
        }}
      />
    </Section>
  )
}
