import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { useSite, ServiceItem } from '../../../context/SiteContext'
import { Section, AddButton } from '../components/AdminPrimitives'

export default function ServicesSection() {
  const { data, updateServices, updateShowServicesSection, deleteItemFromTable } = useSite()
  const { services } = data
  const isEnabled = data.showServicesSection !== false

  const upd = (i: number, p: Partial<ServiceItem>) =>
    updateServices(services.map((s, j) => (j === i ? { ...s, ...p } : s)))
  const move = (i: number, d: 'up' | 'down') => {
    const n = [...services]
    const target = i + (d === 'up' ? -1 : 1)
    ;[n[i], n[target]] = [n[target], n[i]]
    updateServices(n)
  }

  const handleDelete = (i: number) => {
    const item = services[i]
    updateServices(services.filter((_, j) => j !== i))
    if (item?.id && deleteItemFromTable) {
      void deleteItemFromTable('services', item.id)
    }
  }

  return (
    <Section title="Services" description={`${services.length} services listed`}>
      {/* Visibility Toggle Card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: isEnabled ? 'rgba(196, 125, 14, 0.05)' : '#F8FAFC',
        border: `1px solid ${isEnabled ? 'rgba(196, 125, 14, 0.35)' : '#E2E8F0'}`,
        borderRadius: 8,
        marginBottom: 20,
        transition: 'all 0.2s ease',
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Homepage Section Visibility</span>
            <span style={{
              fontSize: 10,
              fontFamily: 'monospace',
              padding: '2px 8px',
              borderRadius: 4,
              background: isEnabled ? '#16A34A' : '#64748B',
              color: '#FFFFFF',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}>
              {isEnabled ? 'ENABLED (VISIBLE)' : 'DISABLED (HIDDEN)'}
            </span>
          </div>
          <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 3 }}>
            Turn the Services section on or off on the homepage and navigation menu.
          </div>
        </div>

        <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={e => updateShowServicesSection(e.target.checked)}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 26,
            background: isEnabled ? '#C47D0E' : '#CBD5E1',
            transition: 'background-color 0.25s ease',
          }}>
            <span style={{
              position: 'absolute',
              height: 20,
              width: 20,
              left: isEnabled ? 25 : 3,
              bottom: 3,
              background: '#FFFFFF',
              borderRadius: '50%',
              transition: 'left 0.25s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }} />
          </span>
        </label>
      </div>
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
              onClick={() => handleDelete(i)}
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
