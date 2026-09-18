import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { useSite, EducationItem } from '../../../context/SiteContext'
import { Section, AddButton, TagChips } from '../components/AdminPrimitives'

export default function EducationSection() {
  const { data: { education, settings }, updateEducation, updateSettings } = useSite()
  const upd = (i: number, p: Partial<EducationItem>) =>
    updateEducation(education.map((e, j) => (j === i ? { ...e, ...p } : e)))
  const move = (i: number, d: 'up' | 'down') => {
    const n = [...education]
    const target = i + (d === 'up' ? -1 : 1)
    ;[n[i], n[target]] = [n[target], n[i]]
    updateEducation(n)
  }

  return (
    <div>
      <Section title="Education" description={`${education.length} entries`}>
        {education.map((e, i) => (
          <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: 6, marginBottom: 8, overflow: 'hidden' }}>
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
                  onClick={() => i < education.length - 1 && move(i, 'down')}
                  disabled={i >= education.length - 1}
                  style={{ background: 'none', border: 'none', cursor: i < education.length - 1 ? 'pointer' : 'default', color: i < education.length - 1 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}
                >
                  <ChevronDown size={11} />
                </button>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '0 10px', padding: '10px 12px', background: '#FFFFFF' }}>
                <input value={e.period} onChange={ev => upd(i, { period: ev.target.value })} placeholder="2020" style={{ height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#1E293B' }} />
                <input value={e.degree} onChange={ev => upd(i, { degree: ev.target.value })} placeholder="Degree / Certificate" style={{ height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#1E293B' }} />
                <input value={e.institution} onChange={ev => upd(i, { institution: ev.target.value })} placeholder="Institution" style={{ height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#374151' }} />
                <input value={e.note} onChange={ev => upd(i, { note: ev.target.value })} placeholder="Grade / Note" style={{ height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#374151' }} />
              </div>
              <button
                type="button"
                onClick={() => updateEducation(education.filter((_, j) => j !== i))}
                style={{ padding: '0 12px', background: 'none', border: 'none', borderLeft: '1px solid #E2E8F0', cursor: 'pointer', color: '#CBD5E1', transition: 'color 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        <AddButton label="Add entry" onClick={() => updateEducation([...education, { period: '', degree: '', institution: '', note: '' }])} />
      </Section>

      <Section title="Software & Tools" description="Tag chips shown in the education section">
        <TagChips label="Tools" tags={settings.tools} onChange={tools => updateSettings({ tools })} />
      </Section>
    </div>
  )
}
