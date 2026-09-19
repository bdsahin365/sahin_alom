import { useState } from 'react'
import { ChevronUp, ChevronDown, Trash2, Plus, Briefcase, GraduationCap, Wrench, Check } from 'lucide-react'
import { useSite, EducationItem, Experience } from '../../../context/SiteContext'
import { Section, AddButton, TagChips, Switch } from '../components/AdminPrimitives'

export default function EducationSection() {
  const {
    data: { education = [], experience = [], settings },
    updateEducation,
    updateExperience,
    updateSettings,
    deleteItemFromTable,
  } = useSite()

  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'tools'>('experience')

  // ── Work Experience Handlers ──
  const updExp = (i: number, p: Partial<Experience>) => {
    updateExperience(experience.map((e, j) => (j === i ? { ...e, ...p } : e)))
  }

  const moveExp = (i: number, d: 'up' | 'down') => {
    const n = [...experience]
    const target = i + (d === 'up' ? -1 : 1)
    ;[n[i], n[target]] = [n[target], n[i]]
    updateExperience(n)
  }

  const handleDeleteExp = (i: number) => {
    const item = experience[i]
    updateExperience(experience.filter((_, j) => j !== i))
    if (item?.id && deleteItemFromTable) {
      void deleteItemFromTable('experience', item.id)
    }
  }

  const addHighlight = (jobIdx: number) => {
    const currentHighlights = experience[jobIdx].highlights || []
    updExp(jobIdx, { highlights: [...currentHighlights, ''] })
  }

  const updateHighlight = (jobIdx: number, hIdx: number, val: string) => {
    const currentHighlights = [...(experience[jobIdx].highlights || [])]
    currentHighlights[hIdx] = val
    updExp(jobIdx, { highlights: currentHighlights })
  }

  const removeHighlight = (jobIdx: number, hIdx: number) => {
    const currentHighlights = (experience[jobIdx].highlights || []).filter((_, j) => j !== hIdx)
    updExp(jobIdx, { highlights: currentHighlights })
  }

  // ── Education Handlers ──
  const updEdu = (i: number, p: Partial<EducationItem>) =>
    updateEducation(education.map((e, j) => (j === i ? { ...e, ...p } : e)))

  const moveEdu = (i: number, d: 'up' | 'down') => {
    const n = [...education]
    const target = i + (d === 'up' ? -1 : 1)
    ;[n[i], n[target]] = [n[target], n[i]]
    updateEducation(n)
  }

  const handleDeleteEdu = (i: number) => {
    const item = education[i]
    updateEducation(education.filter((_, j) => j !== i))
    if ((item as any)?.id && deleteItemFromTable) {
      void deleteItemFromTable('education', (item as any).id)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Sub-Navigation Tabs (Smooth Momentum Scroll) ── */}
      <div
        className="admin-scrollable-tabs"
        style={{
          display: 'flex',
          gap: 8,
          paddingBottom: 12,
          borderBottom: '1px solid #E2E8F0',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('experience')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            background: activeTab === 'experience' ? '#C47D0E' : '#F1F5F9',
            color: activeTab === 'experience' ? '#FFFFFF' : '#475569',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
        >
          <Briefcase size={14} />
          <span>Work Experience ({experience.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('education')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            background: activeTab === 'education' ? '#C47D0E' : '#F1F5F9',
            color: activeTab === 'education' ? '#FFFFFF' : '#475569',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
        >
          <GraduationCap size={14} />
          <span>Education ({education.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tools')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            background: activeTab === 'tools' ? '#C47D0E' : '#F1F5F9',
            color: activeTab === 'tools' ? '#FFFFFF' : '#475569',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
        >
          <Wrench size={14} />
          <span>Software &amp; Tools ({(settings?.tools || []).length})</span>
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 1. WORK EXPERIENCE TAB ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'experience' && (
        <Section
          title="Work Experience & Career History"
          description="Job titles, company details, responsibilities, and bullet point highlights shown on your CV and Portfolio."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {experience.map((job, i) => (
              <div
                key={job.id || i}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  background: '#FFFFFF',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  overflow: 'hidden',
                }}
              >
                {/* Header bar of job card */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#94A3B8',
                    }}>
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                    <strong style={{ fontSize: 13, color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                      {job.role || 'Untitled Role'}
                    </strong>
                    {job.company && (
                      <span style={{ fontSize: 12, color: '#64748B' }}>
                        · {job.company}
                      </span>
                    )}
                    {job.current && (
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#B45309',
                        background: '#FEF3C7',
                        border: '1px solid #FDE68A',
                        padding: '1px 6px',
                        borderRadius: 3,
                        textTransform: 'uppercase',
                      }}>
                        PRESENT
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => i > 0 && moveExp(i, 'up')}
                      disabled={i === 0}
                      title="Move Up"
                      style={{
                        background: 'none', border: 'none', cursor: i > 0 ? 'pointer' : 'default',
                        color: i > 0 ? '#64748B' : '#CBD5E1', padding: '4px 6px', borderRadius: 4
                      }}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => i < experience.length - 1 && moveExp(i, 'down')}
                      disabled={i >= experience.length - 1}
                      title="Move Down"
                      style={{
                        background: 'none', border: 'none', cursor: i < experience.length - 1 ? 'pointer' : 'default',
                        color: i < experience.length - 1 ? '#64748B' : '#CBD5E1', padding: '4px 6px', borderRadius: 4
                      }}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExp(i)}
                      title="Delete Job"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#EF4444', padding: '4px 6px', borderRadius: 4, marginLeft: 4
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                        JOB / POSITION TITLE
                      </label>
                      <input
                        value={job.role || ''}
                        onChange={e => updExp(i, { role: e.target.value })}
                        placeholder="e.g. Junior Electrical Engineer"
                        style={{
                          width: '100%', height: 34, padding: '0 10px',
                          border: '1px solid #E2E8F0', borderRadius: 5,
                          fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                        COMPANY / ORGANIZATION
                      </label>
                      <input
                        value={job.company || ''}
                        onChange={e => updExp(i, { company: e.target.value })}
                        placeholder="e.g. Styllent Knit Limited"
                        style={{
                          width: '100%', height: 34, padding: '0 10px',
                          border: '1px solid #E2E8F0', borderRadius: 5,
                          fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                        LOCATION
                      </label>
                      <input
                        value={job.location || ''}
                        onChange={e => updExp(i, { location: e.target.value })}
                        placeholder="e.g. Dhaka, Bangladesh or Remote"
                        style={{
                          width: '100%', height: 34, padding: '0 10px',
                          border: '1px solid #E2E8F0', borderRadius: 5,
                          fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                        EMPLOYMENT PERIOD
                      </label>
                      <input
                        value={job.period || ''}
                        onChange={e => updExp(i, { period: e.target.value })}
                        placeholder="e.g. Apr 2026 — Present"
                        style={{
                          width: '100%', height: 34, padding: '0 10px',
                          border: '1px solid #E2E8F0', borderRadius: 5,
                          fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Present position toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F8FAFC', padding: '8px 12px', borderRadius: 6 }}>
                    <input
                      type="checkbox"
                      id={`current-${i}`}
                      checked={!!job.current}
                      onChange={e => updExp(i, { current: e.target.checked })}
                      style={{ cursor: 'pointer', width: 16, height: 16 }}
                    />
                    <label htmlFor={`current-${i}`} style={{ fontSize: 12.5, fontWeight: 500, color: '#334155', cursor: 'pointer' }}>
                      This is my current / active position (Displays "PRESENT" badge)
                    </label>
                  </div>

                  {/* Description / Scope */}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      ROLE OVERVIEW / SUMMARY STATEMENT
                    </label>
                    <textarea
                      rows={2}
                      value={job.description || ''}
                      onChange={e => updExp(i, { description: e.target.value })}
                      placeholder="Responsible for electrical system maintenance, power distribution, and infrastructure projects at a large garment manufacturing facility."
                      style={{
                        width: '100%', padding: '8px 10px',
                        border: '1px solid #E2E8F0', borderRadius: 5,
                        fontSize: 12.5, fontFamily: 'Outfit, sans-serif', outline: 'none',
                        lineHeight: 1.5, resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Highlights Bullet Points */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>
                        ACCOMPLISHMENTS &amp; KEY HIGHLIGHTS (BULLET POINTS)
                      </label>
                      <button
                        type="button"
                        onClick={() => addHighlight(i)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 11.5, fontWeight: 600, color: '#C47D0E'
                        }}
                      >
                        <Plus size={12} /> Add bullet point
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {(job.highlights || []).map((h, hIdx) => (
                        <div key={hIdx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: '#94A3B8', fontSize: 14 }}>•</span>
                          <input
                            value={h}
                            onChange={e => updateHighlight(i, hIdx, e.target.value)}
                            placeholder="e.g. Engineered and commissioned a 1250 KVA standby diesel generator installation..."
                            style={{
                              flex: 1, height: 32, padding: '0 10px',
                              border: '1px solid #E2E8F0', borderRadius: 4,
                              fontSize: 12.5, fontFamily: 'Outfit, sans-serif', outline: 'none'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeHighlight(i, hIdx)}
                            title="Remove bullet"
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: '#CBD5E1', padding: 4, borderRadius: 4,
                              transition: 'color 0.15s'
                            }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ))}

            <AddButton
              label="Add Job Experience Entry"
              onClick={() => updateExperience([
                ...experience,
                {
                  id: `exp-${Date.now()}`,
                  role: '',
                  company: '',
                  location: '',
                  period: '',
                  current: false,
                  description: '',
                  highlights: [''],
                }
              ])}
            />
          </div>
        </Section>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 2. EDUCATION TAB ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'education' && (
        <Section title="Academic Qualifications & Degrees" description={`${education.length} entries shown on CV and Portfolio`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {education.map((e, i) => (
              <div key={(e as any).id || i} style={{ border: '1px solid #E2E8F0', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'stretch', background: '#F8FAFC' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #E2E8F0' }}>
                    <button
                      type="button"
                      onClick={() => i > 0 && moveEdu(i, 'up')}
                      disabled={i === 0}
                      style={{ background: 'none', border: 'none', cursor: i > 0 ? 'pointer' : 'default', color: i > 0 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}
                    >
                      <ChevronUp size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => i < education.length - 1 && moveEdu(i, 'down')}
                      disabled={i >= education.length - 1}
                      style={{ background: 'none', border: 'none', cursor: i < education.length - 1 ? 'pointer' : 'default', color: i < education.length - 1 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}
                    >
                      <ChevronDown size={11} />
                    </button>
                  </div>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '0 10px', padding: '10px 12px', background: '#FFFFFF' }}>
                    <div>
                      <label style={{ fontSize: 10, color: '#64748B', display: 'block', marginBottom: 2 }}>YEAR / PERIOD</label>
                      <input
                        value={e.period}
                        onChange={ev => updEdu(i, { period: ev.target.value })}
                        placeholder="2023"
                        style={{ height: 32, width: '100%', padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#1E293B' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: '#64748B', display: 'block', marginBottom: 2 }}>DEGREE / CERTIFICATE</label>
                      <input
                        value={e.degree}
                        onChange={ev => updEdu(i, { degree: ev.target.value })}
                        placeholder="BSc in EEE"
                        style={{ height: 32, width: '100%', padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#1E293B' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: '#64748B', display: 'block', marginBottom: 2 }}>INSTITUTION</label>
                      <input
                        value={e.institution}
                        onChange={ev => updEdu(i, { institution: ev.target.value })}
                        placeholder="Green University of Bangladesh"
                        style={{ height: 32, width: '100%', padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#374151' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: '#64748B', display: 'block', marginBottom: 2 }}>GRADE / DEPARTMENT NOTE</label>
                      <input
                        value={e.note}
                        onChange={ev => updEdu(i, { note: ev.target.value })}
                        placeholder="EEE Department"
                        style={{ height: 32, width: '100%', padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#374151' }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteEdu(i)}
                    style={{ padding: '0 12px', background: 'none', border: 'none', borderLeft: '1px solid #E2E8F0', cursor: 'pointer', color: '#CBD5E1', transition: 'color 0.15s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            <AddButton label="Add Degree / Education" onClick={() => updateEducation([...education, { period: '', degree: '', institution: '', note: '' }])} />
          </div>
        </Section>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── 3. TOOLS TAB ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tools' && (
        <Section title="Software & Tools" description="Engineering tools, calculation software, and CAD tools shown on CV and Portfolio">
          <TagChips label="Tools & Software List" tags={settings?.tools || []} onChange={tools => updateSettings({ tools })} />
        </Section>
      )}

    </div>
  )
}
