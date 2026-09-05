import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowLeft, Printer, Mail, Phone, MapPin, Globe,
  ShieldCheck, Award, Zap, Briefcase, GraduationCap,
  Copy, Check, ExternalLink, Sparkles, CheckCircle2,
  Share2, Wrench, FileCheck, Layers
} from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { EXPERIENCE } from '../data/engineer'
import sahinPhoto from '../img/sahin.png'

export default function CV() {
  const navigate = useNavigate()
  const onBack = () => navigate('/')
  const { data: { engineer: E, education, credentials, expertise, settings } } = useSite()
  const experience = EXPERIENCE
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    document.title = `Curriculum Vitae — ${E.name} | ABC Licensed Electrical Engineer`
    return () => { document.title = E.name }
  }, [E.name])

  const copyText = (text: string, label: string) => {
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

  return (
    <div className="cv-root" style={{ minHeight: '100svh', background: '#FAF8F5', fontFamily: 'Outfit,sans-serif', color: '#111827', position: 'relative', overflowX: 'hidden' }}>

      {/* ── Background Grid ── */}
      <div className="no-print" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.3, backgroundImage: 'radial-gradient(#D6CEBE 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* ── Top Floating Command Bar ── */}
      <header className="no-print" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250, 248, 245, 0.94)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(215, 207, 192, 0.8)',
        padding: '0 var(--px)', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
      }}>
        {/* Back navigation */}
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#4B5563', fontFamily: 'Outfit,sans-serif',
            fontSize: 13, fontWeight: 600, padding: '8px 12px',
            borderRadius: 6, transition: 'all 0.2s ease',
            backgroundColor: 'rgba(0,0,0,0.03)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#C47D0E'
            e.currentTarget.style.backgroundColor = 'rgba(196,125,14,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#4B5563'
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'
          }}
        >
          <ArrowLeft size={16} strokeWidth={2} /> Back to Portfolio
        </button>

        {/* Center status tag */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#16A34A', boxShadow: '0 0 10px #16A34A' }} />
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, letterSpacing: '0.15em', color: '#374151', textTransform: 'uppercase', fontWeight: 600 }}>
            CURRICULUM VITAE · CLASS ABC LICENSED
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleShare}
            title="Share CV Link"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', background: 'transparent',
              border: '1px solid #D1C7B7', color: '#374151',
              fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', borderRadius: 4, transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#C47D0E'
              e.currentTarget.style.color = '#C47D0E'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#D1C7B7'
              e.currentTarget.style.color = '#374151'
            }}
          >
            {copied === 'link' ? <Check size={14} color="#16A34A" /> : <Share2 size={14} />}
            <span>{copied === 'link' ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => window.print()}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 18px', background: '#C47D0E',
              border: 'none', color: '#FFFFFF',
              fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', borderRadius: 4, letterSpacing: '0.04em',
              boxShadow: '0 2px 8px rgba(196,125,14,0.3)',
              transition: 'transform 0.15s ease, background 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#A86C0C'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#C47D0E'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <Printer size={14} strokeWidth={2.2} /> Print / Save PDF
          </button>
        </div>
      </header>

      {/* ── Main CV Document Body ── */}
      <main style={{ maxWidth: 940, margin: '0 auto', padding: 'clamp(28px,5vh,64px) var(--px)', position: 'relative', zIndex: 1 }}>

        {/* ── Document Container ── */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2DCD0',
          borderRadius: 2,
          boxShadow: '0 12px 48px rgba(13,18,24,0.06), 0 2px 6px rgba(0,0,0,0.02)',
          padding: 'clamp(28px,5vw,56px)',
          position: 'relative'
        }}>

          {/* Top Dossier Metadata Ribbon */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 18, borderBottom: '1px solid #EDE8DF', marginBottom: 28, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, background: '#C47D0E', borderRadius: 1 }} />
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.18em', color: '#6B7280', textTransform: 'uppercase' }}>
                DOC REF: CV-2025/SAHIN-ALOM
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#9CA3AF' }}>
                SAVAR, DHAKA, BANGLADESH
              </span>
            </div>
          </div>

          {/* ── Header: Name, Title, Contact Grid ── */}
          <div className="cv-header-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: 'clamp(16px, 2.5vw, 28px)',
            marginBottom: 28,
            paddingBottom: 24,
            borderBottom: '2px solid #0D1218',
          }}>
            {/* 1. Portrait Photo */}
            {(E.photo || sahinPhoto) && (
              <div style={{
                width: 104, height: 128, borderRadius: 3, overflow: 'hidden',
                border: '1.5px solid #0D1218', flexShrink: 0,
                background: '#F3EFEA', boxShadow: '0 4px 14px rgba(13,18,24,0.1)',
                position: 'relative'
              }}>
                <img
                  src={E.photo || sahinPhoto}
                  alt={E.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#C47D0E' }} />
              </div>
            )}

            {/* 2. Identity */}
            <div style={{ minWidth: 0 }}>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5, letterSpacing: '0.22em', color: '#C47D0E', textTransform: 'uppercase', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                {E.title} · Power Systems
              </span>
              <h1 style={{
                fontFamily: 'Barlow Condensed,sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(32px, 4.5vw, 54px)',
                textTransform: 'uppercase',
                letterSpacing: '0.01em',
                lineHeight: 0.95,
                color: '#0D1218',
                margin: '0',
              }}>
                {E.name}
              </h1>
            </div>

            {/* 3. Contact Details Card */}
            <div className="cv-header-contact" style={{
              display: 'flex', flexDirection: 'column', gap: 6,
              background: '#FAFAF8', border: '1px solid #EDE8DF',
              padding: '10px 16px', borderRadius: 4, flexShrink: 0,
              minWidth: 215
            }}>
              <div
                onClick={() => copyText(E.phone, 'phone')}
                style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between', cursor: 'pointer', padding: '2px 0' }}
                title="Click to copy phone"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Phone size={12} color="#C47D0E" />
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12.5, color: '#1F2937', fontWeight: 600 }}>{E.phone}</span>
                </div>
                {copied === 'phone' ? <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8.5, color: '#16A34A', fontWeight: 700 }}>COPIED!</span> : <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8.5, color: '#9CA3AF' }}>TEL</span>}
              </div>

              <div
                onClick={() => copyText(E.email, 'email')}
                style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between', cursor: 'pointer', padding: '2px 0' }}
                title="Click to copy email"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Mail size={12} color="#C47D0E" />
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12.5, color: '#4B5563' }}>{E.email}</span>
                </div>
                {copied === 'email' ? <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8.5, color: '#16A34A', fontWeight: 700 }}>COPIED!</span> : <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8.5, color: '#9CA3AF' }}>MAIL</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between', padding: '2px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <MapPin size={12} color="#C47D0E" />
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12.5, color: '#4B5563' }}>{E.location}</span>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8.5, color: '#9CA3AF' }}>LOC</span>
              </div>

              <a
                href={E.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between', color: '#C47D0E', textDecoration: 'none', padding: '2px 0', fontWeight: 600, fontSize: 12 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Globe size={12} color="#C47D0E" />
                  <span>linkedin.com/in/sahinalom</span>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#C47D0E' }}>↗</span>
              </a>
            </div>
          </div>

          {/* ── Executive Summary Profile ── */}
          <div style={{ marginBottom: 32, padding: '18px 22px', background: '#FAFAF8', borderLeft: '3px solid #C47D0E', borderTop: '1px solid #EDE8DF', borderRight: '1px solid #EDE8DF', borderBottom: '1px solid #EDE8DF' }}>
            <SectionHead title="Professional Summary" icon={<Sparkles size={14} color="#C47D0E" />} />
            <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.75, fontWeight: 400, margin: 0 }}>
              {E.bio[0]} {E.bio[1]} {E.bio[2]}
            </p>
          </div>

          {/* ── Two-Column Main Content Layout ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,300px),1fr))', gap: 'clamp(28px,5vw,48px)', alignItems: 'start' }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

              {/* Statutory Licenses & Certifications */}
              <div>
                <SectionHead title="Licensing & Certifications" icon={<ShieldCheck size={14} color="#C47D0E" />} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {credentials.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '11px 13px',
                        background: i === 0 ? 'rgba(196,125,14,0.06)' : '#FAFAF8',
                        border: i === 0 ? '1px solid rgba(196,125,14,0.35)' : '1px solid #EDE8DF',
                        borderRadius: 2,
                        position: 'relative'
                      }}
                    >
                      {i === 0 && (
                        <span style={{
                          position: 'absolute', top: 7, right: 7,
                          fontFamily: 'JetBrains Mono,monospace', fontSize: 8,
                          background: '#C47D0E', color: '#FFFFFF',
                          padding: '1px 6px', borderRadius: 2, fontWeight: 700, letterSpacing: '0.08em'
                        }}>
                          PRIMARY
                        </span>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 15.5, color: '#0D1218', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                          {c.label}
                        </span>
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="no-print"
                            style={{
                              fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5,
                              color: '#C47D0E', textDecoration: 'none', letterSpacing: '0.06em',
                              fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 2
                            }}
                          >
                            Verify <ExternalLink size={9} />
                          </a>
                        )}
                      </div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 12.5, color: '#C47D0E', marginBottom: 1 }}>
                        {c.value}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: '#6B7280', letterSpacing: '0.03em' }}>
                        {c.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <SectionHead title="Educational Background" icon={<GraduationCap size={14} color="#C47D0E" />} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {education.map((e, i) => (
                    <div
                      key={i}
                      style={{
                        paddingBottom: i < education.length - 1 ? 14 : 0,
                        borderBottom: i < education.length - 1 ? '1px dashed #EDE8DF' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                        <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 19, color: '#C47D0E', lineHeight: 1 }}>
                          {e.period}
                        </span>
                        {e.note && (
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#6B7280', letterSpacing: '0.08em', background: '#EDE8DF', padding: '1px 6px', borderRadius: 2 }}>
                            {e.note}
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 13.5, color: '#0D1218', lineHeight: 1.35, marginBottom: 2 }}>
                        {e.degree}
                      </div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#6B7280' }}>
                        {e.institution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Practical Software */}
              <div>
                <SectionHead title="Tools & Instrumentation" icon={<Wrench size={14} color="#C47D0E" />} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {(E.cvTools && E.cvTools.length > 0 ? E.cvTools : [
                    'AutoCAD Electrical', 'Single-Line Diagrams (SLD)', 'Load Schedule Analysis',
                    'Generator / ATS Wiring', 'Transformer & Switchgear', 'Power Factor Improvement (PFI)',
                    'Fluke Earth Tester', 'Megger Insulation Tester', 'MS Office / Excel', 'ETAP', 'PVSyst'
                  ]).map((t, j) => (
                    <span
                      key={j}
                      style={{
                        padding: '3px 8px',
                        background: '#F3F0EA',
                        border: '1px solid #E5DFD3',
                        fontFamily: 'JetBrains Mono,monospace',
                        fontSize: 9.5,
                        color: '#374151',
                        borderRadius: 2
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

              {/* Professional Experience */}
              <div>
                <SectionHead title="Professional Experience" icon={<Briefcase size={14} color="#C47D0E" />} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {experience.map((job, i) => (
                    <div
                      key={job.id}
                      style={{
                        paddingBottom: i < experience.length - 1 ? 24 : 0,
                        borderBottom: i < experience.length - 1 ? '1px solid #EDE8DF' : 'none',
                        position: 'relative'
                      }}
                    >
                      {/* Top Job Line */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#0D1218', margin: 0 }}>
                              {job.role}
                            </h3>
                            {job.current && (
                              <span style={{ padding: '1px 8px', background: '#16A34A', color: '#FFFFFF', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 2, fontWeight: 600 }}>
                                Present
                              </span>
                            )}
                          </div>
                          <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 17, color: '#C47D0E', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
                            {job.company}
                          </div>
                          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: '#6B7280', letterSpacing: '0.08em', marginTop: 3 }}>
                            {job.location}
                          </div>
                        </div>
                        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5, color: '#374151', letterSpacing: '0.06em', background: '#FAFAF8', padding: '3px 8px', border: '1px solid #EDE8DF', borderRadius: 2, fontWeight: 500, flexShrink: 0 }}>
                          {job.period}
                        </span>
                      </div>

                      {/* Job Description */}
                      <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#4B5563', lineHeight: 1.65, fontWeight: 300, margin: '8px 0 12px' }}>
                        {job.description}
                      </p>

                      {/* Key Highlights */}
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {job.highlights.map((h, j) => (
                          <li key={j} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                            <span style={{ color: '#C47D0E', fontSize: 10, marginTop: 4, flexShrink: 0 }}>◆</span>
                            <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12.5, color: '#374151', lineHeight: 1.6, fontWeight: 400 }}>
                              {h}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Core Practice Areas */}
              <div>
                <SectionHead title="Core Technical Competencies" icon={<Zap size={14} color="#C47D0E" />} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {expertise.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 12px',
                        background: '#FAFAF8',
                        border: '1px solid #EDE8DF',
                        borderRadius: 2
                      }}
                    >
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 13, color: '#0D1218', marginBottom: 4 }}>
                        {item.title}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {item.tags.map((t, j) => (
                          <span
                            key={j}
                            style={{
                              padding: '2px 6px',
                              background: '#EAE5DB',
                              border: '1px solid #DDD7CB',
                              fontFamily: 'JetBrains Mono,monospace',
                              fontSize: 9,
                              color: '#374151',
                              borderRadius: 2
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ── Official Authentication Seal & Signature Block ── */}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '2px solid #0D1218', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <ShieldCheck size={16} color="#C47D0E" />
                <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0D1218' }}>
                  Official Declaration
                </span>
              </div>
              <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11.5, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
                {E.declaration || 'Certified electrical engineer credentialed by the Electricity Licensing Board (ELB), Bangladesh. All details and educational qualifications are accurate and verifiable.'}
              </p>
            </div>

            <div style={{ justifySelf: 'end', textAlign: 'right' }}>
              <div style={{ display: 'inline-block', textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Barlow Condensed,sans-serif',
                  fontWeight: 800,
                  fontSize: 22,
                  color: '#C47D0E',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #0D1218',
                  paddingBottom: 4,
                  minWidth: 160
                }}>
                  {E.name}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
                  ABC Licensed · {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── Responsive & Print Styles ── */}
      <style>{`
        @media (max-width: 760px) {
          .cv-header-grid {
            grid-template-columns: auto 1fr !important;
            gap: 16px !important;
          }
          .cv-header-contact {
            grid-column: 1 / -1 !important;
            width: 100% !important;
          }
        }
        @media (max-width: 480px) {
          .cv-header-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media print {
          .no-print { display: none !important; }
          body, .cv-root {
            background: #FFFFFF !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          main {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .cv-header-grid {
            grid-template-columns: auto 1fr auto !important;
          }
          @page {
            margin: 12mm;
            size: A4 portrait;
          }
        }
      `}</style>
    </div>
  )
}

function SectionHead({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <h2 style={{
        fontFamily: 'Barlow Condensed,sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(15px,2.2vw,18px)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#0D1218',
        margin: 0,
        whiteSpace: 'nowrap'
      }}>
        {title}
      </h2>
      <div style={{ flex: 1, height: 1, background: '#EDE8DF' }} />
    </div>
  )
}
