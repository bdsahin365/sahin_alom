import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowLeft, Printer, Mail, Phone, MapPin, Globe,
  ShieldCheck, ExternalLink, Share2, Wrench, Zap,
  Check, FileText, UserPlus, UserCheck, Edit2, Trash2, X
} from 'lucide-react'
import { useSite } from '../context/SiteContext'
import HeaderLogo from '../components/HeaderLogo'

export type ReferenceItem = {
  id: string
  name: string
  title: string
  company: string
  phone?: string
  email?: string
  relation?: string
}

export default function CV() {
  const navigate = useNavigate()
  const onBack = () => navigate('/')
  const { data: { engineer: E, education = [], credentials = [], expertise = [], experience = [], settings }, loading } = useSite()
  const [copied, setCopied] = useState<string | null>(null)
  const [showPhoto, setShowPhoto] = useState(true)

  // ── Offline-Only References (Stored in browser session, never touches database) ──
  const [references, setReferences] = useState<ReferenceItem[]>(() => {
    try {
      const cached = sessionStorage.getItem('cv_custom_references')
      return cached ? JSON.parse(cached) : []
    } catch {
      return []
    }
  })
  const [showRefModal, setShowRefModal] = useState(false)
  const [editingRefId, setEditingRefId] = useState<string | null>(null)
  const [formRef, setFormRef] = useState<Partial<ReferenceItem>>({
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    relation: ''
  })

  useEffect(() => {
    if (!loading) {
      document.title = `Curriculum Vitae — ${E.name || 'Engineer'}`
    }
    return () => { document.title = E.name || 'Engineer' }
  }, [E.name, loading])

  if (loading) {
    return (
      <div className="cv-root" style={{ minHeight: '100svh', background: 'var(--bg)', fontFamily: "'Inter', sans-serif", color: 'var(--fg)', position: 'relative', overflowX: 'hidden' }}>
        <header className="no-print" style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '0 16px', height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
        }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--fg-dim)', fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, padding: '6px 10px',
              borderRadius: 6, backgroundColor: 'var(--bg-2)'
            }}
          >
            <ArrowLeft size={14} strokeWidth={2} /> Back
          </button>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            LOADING...
          </div>
        </header>
        <div style={{ maxWidth: 880, margin: '24px auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="skeleton-shimmer" style={{ width: '50%', height: 28, borderRadius: 4 }} />
                <div className="skeleton-shimmer" style={{ width: '35%', height: 14, borderRadius: 4 }} />
                <div className="skeleton-shimmer" style={{ width: '60%', height: 12, borderRadius: 4 }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: 70, height: 85, borderRadius: 6, flexShrink: 0 }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const copyText = (text: string, label: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `CV — ${E.name}`, url: window.location.href }).catch(() => {})
    } else {
      copyText(window.location.href, 'link')
    }
  }

  // ── Save references locally to browser session only ──
  const saveReferences = (newRefs: ReferenceItem[]) => {
    setReferences(newRefs)
    try {
      sessionStorage.setItem('cv_custom_references', JSON.stringify(newRefs))
    } catch {}
  }

  const openAddRef = () => {
    setEditingRefId(null)
    setFormRef({ name: '', title: '', company: '', phone: '', email: '', relation: '' })
    setShowRefModal(true)
  }

  const openEditRef = (r: ReferenceItem) => {
    setEditingRefId(r.id)
    setFormRef({ ...r })
    setShowRefModal(true)
  }

  const handleSaveRef = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.name?.trim()) return

    if (editingRefId) {
      const updated = references.map(r => r.id === editingRefId ? { ...r, ...formRef } as ReferenceItem : r)
      saveReferences(updated)
    } else {
      const newRef: ReferenceItem = {
        id: `ref-${Date.now()}`,
        name: formRef.name.trim(),
        title: formRef.title?.trim() || '',
        company: formRef.company?.trim() || '',
        phone: formRef.phone?.trim() || '',
        email: formRef.email?.trim() || '',
        relation: formRef.relation?.trim() || '',
      }
      saveReferences([...references, newRef])
    }
    setShowRefModal(false)
  }

  const handleDeleteRef = (id: string) => {
    const updated = references.filter(r => r.id !== id)
    saveReferences(updated)
    if (editingRefId === id) setShowRefModal(false)
  }

  // Summary bio strictly from database
  const bioText = Array.isArray(E.bio) && E.bio.length > 0 
    ? E.bio.filter(Boolean).join(' ') 
    : typeof E.bio === 'string' 
      ? E.bio 
      : ''

  // Software & Tools strictly from database
  const toolsList = (E.cvTools && E.cvTools.length > 0)
    ? E.cvTools
    : (settings?.tools && settings.tools.length > 0)
      ? settings.tools
      : []

  // Dynamic primary credential from database
  const primaryCredential = credentials.find(c => 
    /license|board|accreditation|elb|abc/i.test(c.label) || /license|elb|abc/i.test(c.value)
  ) || credentials[0]

  // Generate clean Plaintext ATS format strictly from DB data & custom references
  const copyPlaintextATS = () => {
    const lines: string[] = []
    lines.push(E.name.toUpperCase())
    if (E.title) lines.push(E.title)
    const contacts = [E.phone, E.email, E.location, E.linkedin].filter(Boolean)
    if (contacts.length) lines.push(contacts.join(' | '))
    lines.push('')

    if (bioText) {
      lines.push('PROFESSIONAL SUMMARY')
      lines.push(bioText)
      lines.push('')
    }

    if (experience.length) {
      lines.push('WORK EXPERIENCE')
      experience.forEach(j => {
        lines.push(`${j.role} | ${j.company}${j.location ? ', ' + j.location : ''} (${j.period})`)
        if (j.description) lines.push(j.description)
        if (j.highlights && j.highlights.length) {
          j.highlights.forEach(h => lines.push(`- ${h}`))
        }
        lines.push('')
      })
    }

    const validEdu = education.filter(e => e.degree?.trim() || e.institution?.trim())
    if (validEdu.length) {
      lines.push('EDUCATION')
      validEdu.forEach(e => {
        lines.push(`${e.degree} | ${e.institution}${e.note ? ' (' + e.note + ')' : ''} (${e.period})`)
      })
      lines.push('')
    }

    if (credentials.length) {
      lines.push('LICENSING & CERTIFICATIONS')
      credentials.forEach(c => {
        lines.push(`${c.label}: ${c.value}${c.detail ? ' — ' + c.detail : ''}`)
      })
      lines.push('')
    }

    if (toolsList.length || expertise.length) {
      lines.push('SKILLS & EXPERTISE')
      if (toolsList.length) lines.push('Tools: ' + toolsList.join(', '))
      if (expertise.length) lines.push('Competencies: ' + expertise.map(x => x.title).join(', '))
      lines.push('')
    }

    if (references.length) {
      lines.push('PROFESSIONAL REFERENCES')
      references.forEach(r => {
        lines.push(`${r.name} | ${r.title}${r.title && r.company ? ', ' : ''}${r.company}`)
        const refContacts = [r.phone, r.email].filter(Boolean)
        if (refContacts.length) lines.push(refContacts.join(' | '))
        if (r.relation) lines.push(`Relationship: ${r.relation}`)
        lines.push('')
      })
    }

    if (E.declaration) {
      lines.push('OFFICIAL DECLARATION')
      lines.push(E.declaration)
      lines.push(`Signed: ${E.name}`)
    }

    copyText(lines.join('\n'), 'plaintext')
  }

  return (
    <div className="cv-root" style={{ minHeight: '100svh', background: 'var(--bg)', fontFamily: "'Inter', -apple-system, sans-serif", color: 'var(--fg)', position: 'relative', overflowX: 'hidden' }}>

      {/* ── Background Blueprint Matrix ── */}
      <div className="no-print" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.35,
        backgroundImage: 'radial-gradient(var(--border-strong) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      {/* ── Top Floating Command Bar ── */}
      <header className="cv-top-bar no-print" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 16px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8
      }}>
        {/* Back navigation */}
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-2)', border: '1px solid var(--border)', cursor: 'pointer',
            color: 'var(--fg)', fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, padding: '6px 10px',
            borderRadius: 6, transition: 'all 0.2s ease', flexShrink: 0
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--fg)'
          }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          <span className="cv-btn-text-desktop">Back to Portfolio</span>
          <span className="cv-btn-text-mobile">Back</span>
        </button>

        {/* Action buttons (Clean, compact & responsive) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          
          {/* Add / Manage Reference Button (Offline Referral Tool) */}
          <button
            onClick={openAddRef}
            title="Add a professional referral or referee before downloading CV (offline & private)"
            className="cv-action-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 10px',
              background: references.length > 0 ? 'rgba(196, 125, 14, 0.12)' : 'transparent',
              border: references.length > 0 ? '1px solid #C47D0E' : '1px solid var(--border-strong)',
              color: references.length > 0 ? '#C47D0E' : 'var(--fg)',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: 6, transition: 'all 0.15s ease',
              flexShrink: 0
            }}
          >
            {references.length > 0 ? <UserCheck size={13} style={{ color: '#C47D0E' }} /> : <UserPlus size={13} />}
            <span className="cv-btn-text-desktop">
              {references.length > 0 ? `Ref (${references.length})` : '+ Reference'}
            </span>
            <span className="cv-btn-text-mobile">
              {references.length > 0 ? `Ref (${references.length})` : '+ Ref'}
            </span>
          </button>

          {/* Photo toggle button */}
          {E.photo && (
            <button
              onClick={() => setShowPhoto(!showPhoto)}
              title="Toggle Photo on/off"
              className="cv-action-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '6px 9px', background: 'transparent',
                border: '1px solid var(--border-strong)', color: showPhoto ? 'var(--fg)' : 'var(--muted)',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: 'pointer', borderRadius: 6, transition: 'all 0.15s ease'
              }}
            >
              <span>Photo: {showPhoto ? 'ON' : 'OFF'}</span>
            </button>
          )}


          {/* Print / Save PDF button */}
          <button
            onClick={() => window.print()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', background: 'var(--accent)',
              border: 'none', color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: 6,
              boxShadow: '0 2px 10px rgba(196,125,14,0.35)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              flexShrink: 0
            }}
          >
            <Printer size={13} strokeWidth={2.2} />
            <span className="cv-btn-text-desktop">Print / Save PDF</span>
            <span className="cv-btn-text-mobile">PDF</span>
          </button>
        </div>
      </header>

      {/* ── Main CV Document Body ── */}
      <main className="cv-main-body" style={{
        maxWidth: 880,
        margin: '0 auto',
        padding: 'clamp(16px, 3vh, 44px) clamp(10px, 2.5vw, 20px)',
        position: 'relative',
        zIndex: 1
      }}>

        {/* ── Modern Swiss Architectural Sheet Container ── */}
        <div className="cv-paper-container" style={{
          background: '#FFFFFF',
          color: '#0F172A',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          boxShadow: '0 16px 44px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)',
          padding: 'clamp(20px, 4vw, 56px)',
          position: 'relative'
        }}>

          {/* ════ HEADER SECTION: MODERN ARCHITECTURAL SWISS ════ */}
          <header className="cv-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 20,
            paddingBottom: 22,
            borderBottom: '2px solid #0F172A',
            marginBottom: 24,
          }}>
            {/* Left/Main Column */}
            <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
              
              {/* Dynamic Status Badge from Database Credentials */}
              {primaryCredential && (
                <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div className="cv-status-badge" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#FEF3C7', border: '1px solid #FDE68A',
                    padding: '3px 8px', borderRadius: 4,
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                    color: '#92400E', textTransform: 'uppercase'
                  }}>
                    <ShieldCheck size={13} strokeWidth={2.4} color="#B45309" />
                    <span>{primaryCredential.label}: {primaryCredential.value}</span>
                  </div>
                </div>
              )}

              {/* Dynamic Name from DB */}
              <h1 className="cv-name-heading" style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(26px, 4.2vw, 42px)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: '#0F172A',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                wordBreak: 'break-word',
              }}>
                {E.name}
              </h1>

              {/* Dynamic Professional Title from DB */}
              {E.title && (
                <div className="cv-title-sub" style={{
                  fontFamily: "'Inter', -apple-system, sans-serif",
                  fontWeight: 600,
                  fontSize: '13px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#475569',
                  marginBottom: 14,
                }}>
                  {E.title}
                </div>
              )}

              {/* Interactive Contact Strip (Web) */}
              <div className="contact-strip-web no-print" style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 6,
                fontSize: '12px',
              }}>
                {E.phone && (
                  <button
                    onClick={() => copyText(E.phone, 'phone')}
                    title="Click to copy phone"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: '#F8FAFC', border: '1px solid #E2E8F0',
                      padding: '5px 9px', borderRadius: 5, cursor: 'pointer',
                      fontSize: '12px', fontWeight: 600, color: '#1E293B',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#C47D0E')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
                  >
                    <Phone size={11} style={{ color: '#C47D0E' }} />
                    <span>{E.phone}</span>
                    {copied === 'phone' && <span style={{ color: '#16A34A', fontSize: 10, fontWeight: 700 }}>✓ COPIED</span>}
                  </button>
                )}

                {E.email && (
                  <button
                    onClick={() => copyText(E.email, 'email')}
                    title="Click to copy email"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: '#F8FAFC', border: '1px solid #E2E8F0',
                      padding: '5px 9px', borderRadius: 5, cursor: 'pointer',
                      fontSize: '12px', fontWeight: 500, color: '#1E293B',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#C47D0E')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
                  >
                    <Mail size={11} style={{ color: '#C47D0E' }} />
                    <span>{E.email}</span>
                    {copied === 'email' && <span style={{ color: '#16A34A', fontSize: 10, fontWeight: 700 }}>✓ COPIED</span>}
                  </button>
                )}

                {E.location && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: '#F8FAFC', border: '1px solid #E2E8F0',
                    padding: '5px 9px', borderRadius: 5,
                    fontSize: '12px', color: '#475569'
                  }}>
                    <MapPin size={11} style={{ color: '#64748B' }} />
                    <span>{E.location}</span>
                  </span>
                )}

                {E.linkedin && (
                  <a
                    href={E.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: '#F8FAFC', border: '1px solid #E2E8F0',
                      padding: '5px 9px', borderRadius: 5,
                      fontSize: '12px', fontWeight: 600, color: '#0F172A',
                      textDecoration: 'none', transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#C47D0E')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
                  >
                    <Globe size={11} style={{ color: '#C47D0E' }} />
                    <span>LinkedIn</span>
                    <ExternalLink size={9} style={{ opacity: 0.6 }} />
                  </a>
                )}
              </div>

              {/* Pure ATS Clean Text Contact Strip for Print */}
              <div className="contact-strip-print print-only" style={{ display: 'none', fontSize: '10pt', color: '#334155', marginTop: 4 }}>
                {[E.phone, E.email, E.location, E.linkedin?.replace(/^https?:\/\/(www\.)?/, '')].filter(Boolean).join('  |  ')}
              </div>
            </div>

            {/* Right: Modern Portrait (Dynamic from DB, toggleable) */}
            {showPhoto && E.photo && (
              <div className="cv-photo-wrapper" style={{
                width: 96,
                height: 116,
                borderRadius: 8,
                overflow: 'hidden',
                border: '2px solid #E2E8F0',
                flexShrink: 0,
                background: '#F8FAFC',
                boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
              }}>
                <img
                  src={E.photo}
                  alt={E.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', display: 'block' }}
                />
              </div>
            )}
          </header>

          {/* ════ SECTION 1: PROFESSIONAL OVERVIEW (From DB only) ════ */}
          {bioText && (
            <section style={{ marginBottom: 26 }}>
              <ATSSectionTitle title="PROFESSIONAL OVERVIEW" />
              <div style={{
                marginTop: 10,
                borderLeft: '3px solid #C47D0E',
                paddingLeft: 14,
                background: 'transparent'
              }}>
                <p style={{
                  fontSize: '13px',
                  color: '#334155',
                  lineHeight: 1.65,
                  fontWeight: 400,
                  margin: 0,
                  textAlign: 'justify',
                }}>
                  {bioText}
                </p>
              </div>
            </section>
          )}

          {/* ════ SECTION 2: WORK EXPERIENCE (From DB only) ════ */}
          {experience.length > 0 && (
            <section style={{ marginBottom: 26 }}>
              <ATSSectionTitle title="WORK EXPERIENCE" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 12 }}>
                {experience.map((job, i) => (
                  <div
                    key={job.id || i}
                    className="job-entry"
                    style={{
                      position: 'relative',
                      borderLeft: '2px solid #F1F5F9',
                      paddingLeft: 14,
                      marginLeft: 2,
                    }}
                  >
                    {/* Architectural dot indicator on screen */}
                    <div className="no-print" style={{
                      position: 'absolute',
                      left: -6,
                      top: 4,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: job.current ? '#C47D0E' : '#94A3B8',
                      border: '2px solid #FFFFFF',
                      boxShadow: job.current ? '0 0 6px rgba(196,125,14,0.5)' : 'none'
                    }} />

                    {/* Resilient Responsive Header */}
                    <div className="cv-job-header" style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      alignItems: 'baseline',
                      gap: '4px 16px',
                      marginBottom: 4,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 8px' }}>
                        <span style={{ fontWeight: 750, fontSize: '14px', color: '#0F172A' }}>
                          {job.role}
                        </span>
                        <span style={{ color: '#94A3B8' }}>|</span>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>
                          {job.company}
                        </span>
                        {job.location && (
                          <span style={{ fontSize: '12px', color: '#64748B' }}>
                            ({job.location})
                          </span>
                        )}
                        {job.current && (
                          <span className="no-print" style={{
                            fontSize: '9.5px',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            color: '#B45309',
                            background: '#FEF3C7',
                            border: '1px solid #FDE68A',
                            padding: '1px 5px',
                            borderRadius: 3,
                            textTransform: 'uppercase'
                          }}>
                            PRESENT
                          </span>
                        )}
                      </div>

                      <span className="cv-job-period" style={{
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 600,
                        color: '#475569',
                        whiteSpace: 'nowrap',
                        textAlign: 'right',
                        flexShrink: 0
                      }}>
                        {job.period}
                      </span>
                    </div>

                    {/* Role Summary / Scope if available */}
                    {job.description && (
                      <p style={{
                        fontSize: '12.5px',
                        color: '#475569',
                        lineHeight: 1.55,
                        margin: '4px 0 6px 0',
                      }}>
                        {job.description}
                      </p>
                    )}

                    {/* Bullet Highlights with Modern Accent Highlight Dots */}
                    {job.highlights && job.highlights.length > 0 && (
                      <ul className="cv-highlights-list" style={{
                        margin: '8px 0 0 0',
                        padding: 0,
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}>
                        {job.highlights.map((h, j) => (
                          <li
                            key={j}
                            className="cv-highlight-item"
                            style={{
                              fontSize: '12.5px',
                              color: '#334155',
                              lineHeight: 1.55,
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 9,
                            }}
                          >
                            {/* Screen Modern Highlight Dot */}
                            <span
                              className="cv-bullet-dot no-print"
                              style={{
                                width: 5.5,
                                height: 5.5,
                                borderRadius: '50%',
                                background: j === 0 ? '#C47D0E' : 'rgba(196, 125, 14, 0.85)',
                                flexShrink: 0,
                                marginTop: 6.5,
                                boxShadow: j === 0 ? '0 0 6px rgba(196,125,14,0.5)' : 'none',
                              }}
                            />
                            {/* Print standard marker */}
                            <span className="print-only" style={{ display: 'none', marginRight: 4 }}>•</span>
                            <span style={{ flex: 1 }}>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ════ SECTION 3: LICENSING & REGULATORY ACCREDITATIONS (From DB) ════ */}
          {credentials.length > 0 && (
            <section style={{ marginBottom: 26 }}>
              <ATSSectionTitle title="LICENSING &amp; CERTIFICATIONS" />
              
              {/* Web View: Modern Architectural Credential Cards */}
              <div className="cv-credentials-grid no-print" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 10,
                marginTop: 12
              }}>
                {credentials.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: 6,
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '12.5px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <ShieldCheck size={13} color="#C47D0E" />
                        {c.label}
                      </span>
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '11px', color: '#C47D0E', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}
                        >
                          <span>Verify</span>
                          <ExternalLink size={9} />
                        </a>
                      )}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 600 }}>
                      {c.value}
                    </div>
                    {c.detail && (
                      <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.4 }}>
                        {c.detail}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Print View: Clean Linear Text for 100% ATS Compatibility */}
              <div className="print-only" style={{ display: 'none', marginTop: 10 }}>
                {credentials.map((c, i) => (
                  <div key={i} style={{ marginBottom: 6, fontSize: '10pt', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{c.label}: </strong>
                      <span>{c.value}</span>
                      {c.detail && <span style={{ color: '#475569' }}> — {c.detail}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ════ SECTION 4: TECHNICAL SKILLS & SOFTWARE (From DB only) ════ */}
          {(toolsList.length > 0 || expertise.length > 0) && (
            <section style={{ marginBottom: 26 }}>
              <ATSSectionTitle title="SKILLS &amp; TECHNICAL EXPERTISE" />
              
              {/* Web View: Modern Swiss Tag Pills */}
              <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                {toolsList.length > 0 && (
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', marginBottom: 6 }}>
                      Engineering Software &amp; Tools
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {toolsList.map((tool, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: '#F8FAFC',
                            border: '1px solid #CBD5E1',
                            borderRadius: 4,
                            padding: '3px 8px',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#1E293B',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <Wrench size={10} style={{ color: '#C47D0E' }} />
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {expertise.length > 0 && (
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', marginBottom: 6 }}>
                      Core Engineering Disciplines
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {expertise.map((exp, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: '#F1F5F9',
                            border: '1px solid #E2E8F0',
                            borderRadius: 4,
                            padding: '3px 8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#0F172A',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <Zap size={10} style={{ color: '#C47D0E' }} />
                          {exp.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Print View: Clean Linear Text for ATS Scanning */}
              <div className="print-only" style={{ display: 'none', marginTop: 10, fontSize: '10pt', lineHeight: 1.6 }}>
                {toolsList.length > 0 && (
                  <div style={{ marginBottom: 4 }}>
                    <strong>Engineering Software &amp; Tools: </strong>
                    <span>{toolsList.join(', ')}</span>
                  </div>
                )}
                {expertise.length > 0 && (
                  <div>
                    <strong>Core Engineering Competencies: </strong>
                    <span>{expertise.map(exp => exp.title + (exp.tags?.length ? ` (${exp.tags.join(', ')})` : '')).join('; ')}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ════ SECTION 5: EDUCATION (Resilient Swiss Layout) ════ */}
          {education.filter(e => e.degree?.trim() || e.institution?.trim()).length > 0 && (
            <section style={{ marginBottom: 26 }}>
              <ATSSectionTitle title="EDUCATION" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                {education.filter(e => e.degree?.trim() || e.institution?.trim()).map((e, i, arr) => (
                  <div
                    key={i}
                    className="cv-edu-row"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '4px 16px',
                      alignItems: 'baseline',
                      paddingBottom: i === arr.length - 1 ? 0 : 10,
                      borderBottom: i === arr.length - 1 ? 'none' : '1px solid #F1F5F9',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 750, fontSize: '14px', color: '#0F172A', lineHeight: 1.3 }}>
                        {e.degree}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#475569', marginTop: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '3px 6px' }}>
                        <span style={{ fontWeight: 500, color: '#334155' }}>{e.institution}</span>
                        {e.note && (
                          <span style={{
                            fontSize: '11px',
                            color: '#64748B',
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            padding: '1px 6px',
                            borderRadius: 3
                          }}>
                            {e.note}
                          </span>
                        )}
                      </div>
                    </div>

                    {e.period && (
                      <div className="cv-edu-period" style={{
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 600,
                        color: '#64748B',
                        textAlign: 'right',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}>
                        {e.period}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ════ SECTION 6: PROFESSIONAL REFERENCES (Offline Referral Tool) ════ */}
          {references.length > 0 && (
            <section style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <ATSSectionTitle title="PROFESSIONAL REFERENCES" />
                <button
                  type="button"
                  onClick={openAddRef}
                  className="no-print"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: 10.5,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#C47D0E',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  <UserPlus size={11} /> + Add Another
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 12,
                marginTop: 10,
              }}>
                {references.map((ref) => (
                  <div
                    key={ref.id}
                    className="cv-reference-card"
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: 6,
                      padding: '12px 14px',
                      background: '#F8FAFC',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 750, fontSize: '14px', color: '#0F172A' }}>
                          {ref.name}
                        </div>
                        {(ref.title || ref.company) && (
                          <div style={{ fontSize: '12.5px', color: '#334155', marginTop: 2 }}>
                            {ref.title}{ref.title && ref.company ? ' · ' : ''}{ref.company}
                          </div>
                        )}
                        {ref.relation && (
                          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: 2 }}>
                            Relationship: {ref.relation}
                          </div>
                        )}
                        {(ref.phone || ref.email) && (
                          <div style={{ fontSize: '12px', color: '#475569', marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: '4px 8px' }}>
                            {ref.phone && <span>{ref.phone}</span>}
                            {ref.phone && ref.email && <span style={{ color: '#CBD5E1' }}>|</span>}
                            {ref.email && <span>{ref.email}</span>}
                          </div>
                        )}
                      </div>

                      {/* Screen-Only Edit / Delete controls */}
                      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <button
                          type="button"
                          onClick={() => openEditRef(ref)}
                          title="Edit Reference"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#64748B', padding: 4, borderRadius: 3
                          }}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRef(ref.id)}
                          title="Remove Reference"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#EF4444', padding: 4, borderRadius: 3
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ════ SECTION 7: OFFICIAL DECLARATION & FORMAL ATTESTATION (Dynamic from DB) ════ */}
          {E.declaration && (
            <footer className="cv-declaration-footer" style={{
              marginTop: 30,
              paddingTop: 20,
              borderTop: '1.5px solid #0F172A',
            }}>
              <div className="cv-declaration-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.8fr) minmax(200px, 1fr)',
                gap: '20px 28px',
                alignItems: 'flex-end',
              }}>
                {/* Left Column: Official Declaration Statement from DB */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    marginBottom: 6,
                  }}>
                    <ShieldCheck size={13} style={{ color: 'var(--accent, #C47D0E)' }} />
                    <span>OFFICIAL DECLARATION</span>
                  </div>
                  <p style={{
                    fontSize: '12px',
                    color: '#475569',
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {E.declaration}
                  </p>
                </div>

                {/* Right Column: Formal Signatory Block */}
                <div className="cv-declaration-sign" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  textAlign: 'right',
                }}>
                  {/* Authentic Signature Hairline */}
                  <div className="cv-signature-line" style={{
                    width: 160,
                    height: '1.5px',
                    background: '#0F172A',
                    marginBottom: 8,
                  }} />

                  {/* Dynamic Name from DB */}
                  <div style={{
                    fontWeight: 800,
                    fontSize: '15.5px',
                    color: '#0F172A',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2,
                  }}>
                    {E.name}
                  </div>

                  {/* Dynamic Title from DB */}
                  {E.title && (
                    <div style={{
                      fontSize: '11px',
                      color: '#64748B',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      marginTop: 3,
                    }}>
                      {E.title}
                    </div>
                  )}

                  {/* Dynamic Credential Note if available in DB */}
                  {primaryCredential && (
                    <div style={{
                      fontSize: '10px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: '#94A3B8',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginTop: 2,
                    }}>
                      {primaryCredential.label}: {primaryCredential.value}
                    </div>
                  )}
                </div>
              </div>
            </footer>
          )}

        </div>
      </main>

      {/* ── Offline Add / Edit Reference Modal Popup ── */}
      {showRefModal && (
        <div className="no-print" style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 12,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            border: '1px solid #CBD5E1',
            animation: 'cvModalFadeIn 0.18s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #E2E8F0',
              background: '#F8FAFC'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: 'rgba(196, 125, 14, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <UserPlus size={15} style={{ color: '#C47D0E' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 750, color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                    {editingRefId ? 'Edit Reference' : 'Add Professional Reference'}
                  </h3>
                  <span style={{ fontSize: 11, color: '#64748B', display: 'block' }}>
                    Saved locally in your browser session for this CV / PDF export
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRefModal(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94A3B8', padding: 4, borderRadius: 4
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveRef} style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: 4 }}>
                  Referee Full Name *
                </label>
                <input
                  required
                  autoFocus
                  value={formRef.name || ''}
                  onChange={e => setFormRef(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Engr. Tanvir Ahmed"
                  style={{
                    width: '100%', height: 36, padding: '0 10px',
                    border: '1px solid #CBD5E1', borderRadius: 6,
                    fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: 4 }}>
                    Designation / Role
                  </label>
                  <input
                    value={formRef.title || ''}
                    onChange={e => setFormRef(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Senior Manager"
                    style={{
                      width: '100%', height: 36, padding: '0 10px',
                      border: '1px solid #CBD5E1', borderRadius: 6,
                      fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: 4 }}>
                    Organization / Company
                  </label>
                  <input
                    value={formRef.company || ''}
                    onChange={e => setFormRef(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g. Energypac Power Ltd"
                    style={{
                      width: '100%', height: 36, padding: '0 10px',
                      border: '1px solid #CBD5E1', borderRadius: 6,
                      fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: 4 }}>
                    Contact Phone
                  </label>
                  <input
                    value={formRef.phone || ''}
                    onChange={e => setFormRef(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. +880 1712-345678"
                    style={{
                      width: '100%', height: 36, padding: '0 10px',
                      border: '1px solid #CBD5E1', borderRadius: 6,
                      fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: 4 }}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formRef.email || ''}
                    onChange={e => setFormRef(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. tanvir@energypac.com"
                    style={{
                      width: '100%', height: 36, padding: '0 10px',
                      border: '1px solid #CBD5E1', borderRadius: 6,
                      fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: 4 }}>
                  Professional Relationship / Endorsement Note
                </label>
                <input
                  value={formRef.relation || ''}
                  onChange={e => setFormRef(prev => ({ ...prev, relation: e.target.value }))}
                  placeholder="e.g. Former Direct Supervisor / Engineering Project Colleague"
                  style={{
                    width: '100%', height: 36, padding: '0 10px',
                    border: '1px solid #CBD5E1', borderRadius: 6,
                    fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                <div>
                  {editingRefId && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRef(editingRefId)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#EF4444', fontSize: 12, fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: 4
                      }}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowRefModal(false)}
                    style={{
                      padding: '8px 14px', background: '#F1F5F9',
                      border: '1px solid #E2E8F0', borderRadius: 6,
                      fontSize: 12.5, fontWeight: 600, color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 18px', background: '#C47D0E',
                      border: 'none', borderRadius: 6,
                      fontSize: 12.5, fontWeight: 700, color: '#FFFFFF',
                      cursor: 'pointer', boxShadow: '0 2px 8px rgba(196,125,14,0.35)'
                    }}
                  >
                    {editingRefId ? 'Update Reference' : 'Add to CV'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Bottom Web Footer (Non-Print) ── */}
      <footer className="no-print" style={{
        borderTop: '1px solid var(--border)',
        padding: '30px 16px',
        background: 'var(--bg)',
      }}>
        <div style={{
          maxWidth: 880, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 14,
        }}>
          <HeaderLogo compact={true} showSubtitle={false} />

          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5,
            color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            &copy; {new Date().getFullYear()} {E.name}
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              background: 'none', border: 'none',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5,
              color: 'var(--fg-dim)', letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', fontWeight: 700,
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--fg-dim)')}
          >
            Back to top ↑
          </button>
        </div>
      </footer>

      {/* ── Responsive & High-Precision Print Styles ── */}
      <style>{`
        @keyframes cvModalFadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Responsive Desktop vs Mobile text helpers */
        @media screen and (min-width: 641px) {
          .cv-btn-text-mobile { display: none !important; }
        }
        @media screen and (max-width: 640px) {
          .cv-btn-text-desktop { display: none !important; }
          .cv-top-bar {
            padding: 0 10px !important;
            height: 52px !important;
          }
          .cv-action-btn {
            padding: 5px 8px !important;
            font-size: 10px !important;
          }
          .cv-paper-container {
            padding: 20px 14px !important;
            border-radius: 6px !important;
          }
          .cv-header {
            flex-direction: column-reverse !important;
            align-items: flex-start !important;
            gap: 14px !important;
            padding-bottom: 16px !important;
            margin-bottom: 20px !important;
          }
          .cv-photo-wrapper {
            width: 80px !important;
            height: 96px !important;
          }
          .cv-name-heading {
            font-size: 26px !important;
          }
          .cv-title-sub {
            font-size: 11.5px !important;
            margin-bottom: 10px !important;
          }
          .contact-strip-web {
            gap: 5px !important;
          }
          .contact-strip-web button,
          .contact-strip-web span,
          .contact-strip-web a {
            font-size: 11px !important;
            padding: 4px 7px !important;
          }
          .cv-job-header {
            display: flex !important;
            flex-direction: column !important;
            gap: 2px !important;
          }
          .cv-job-period {
            text-align: left !important;
            font-size: 11px !important;
            color: #64748B !important;
          }
          .job-entry {
            padding-left: 12px !important;
            margin-left: 0 !important;
          }
          .job-entry ul {
            padding-left: 14px !important;
          }
          .cv-edu-row {
            display: flex !important;
            flex-direction: column !important;
            gap: 2px !important;
            padding-bottom: 8px !important;
          }
          .cv-edu-period {
            text-align: left !important;
            font-size: 11px !important;
            color: #64748B !important;
          }
          .cv-credentials-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          .cv-declaration-grid {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
          .cv-declaration-sign {
            align-items: flex-start !important;
            text-align: left !important;
            width: 100% !important;
          }
          .cv-signature-line {
            margin-left: 0 !important;
          }
        }

        @media screen {
          .print-only { display: none !important; }
        }

        /* High-Precision ATS Print Styles */
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          html, body, .cv-root {
            background: #FFFFFF !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 10pt !important;
            font-family: 'Inter', -apple-system, sans-serif !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .cv-paper-container {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            border-radius: 0 !important;
          }
          .cv-header {
            border-bottom: 2px solid #000000 !important;
            margin-bottom: 16pt !important;
            padding-bottom: 14pt !important;
          }
          .job-entry {
            border-left: none !important;
            padding-left: 0 !important;
            margin-left: 0 !important;
          }
          a {
            text-decoration: none !important;
            color: inherit !important;
          }
          ul {
            page-break-inside: avoid;
            padding-left: 16pt !important;
          }
          ul.cv-highlights-list {
            list-style: disc !important;
            padding-left: 14pt !important;
            margin-top: 4pt !important;
          }
          .cv-highlight-item {
            display: list-item !important;
            margin-bottom: 2pt !important;
          }
          .cv-reference-card {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            margin-bottom: 8pt !important;
          }
          section {
            page-break-inside: auto;
          }
          @page {
            margin: 12mm 14mm;
            size: A4 portrait;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Modern Swiss ATS Section Title:
 * Bold architectural uppercase typography with hairline divider
 */
function ATSSectionTitle({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <h2 style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: '12px',
        fontWeight: 800,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#0F172A',
        margin: '0 0 4px 0',
      }}>
        {title}
      </h2>
      <div style={{ width: '100%', height: '1.5px', background: '#0F172A' }} />
    </div>
  )
}
