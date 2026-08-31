import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowLeft, Printer, Mail, Phone, MapPin, Globe,
  ShieldCheck, Award, Zap, Briefcase, GraduationCap,
  Copy, Check, ExternalLink, Sparkles, Building2,
  CheckCircle2, User, FileCheck, Share2, Compass, BookmarkCheck
} from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { EXPERIENCE } from '../data/engineer'
import sahinPhoto from '../img/sahin.png'

export default function Biodata() {
  const navigate = useNavigate()
  const onBack = () => navigate('/')
  const { data: { engineer: E, education, credentials, expertise, projects } } = useSite()
  const experience = EXPERIENCE
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    document.title = `Official Biodata — ${E.name} | Class ABC Licensed Electrical Engineer`
    return () => { document.title = E.name }
  }, [E.name])

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `Biodata — ${E.name}`, url: window.location.href }).catch(() => {})
    } else {
      copyText(window.location.href, 'link')
    }
  }

  return (
    <div className="biodata-root" style={{ minHeight: '100svh', background: '#FAF8F5', color: '#111827', fontFamily: 'Outfit,sans-serif', position: 'relative', overflowX: 'hidden' }}>

      {/* ── Background Subtle Watermark & Texture ── */}
      <div className="no-print" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.35, backgroundImage: 'radial-gradient(#D6CEBE 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* ── Floating Command Toolbar ── */}
      <header className="no-print" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250, 248, 245, 0.92)',
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

        {/* Center label */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={16} color="#C47D0E" />
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, letterSpacing: '0.18em', color: '#374151', textTransform: 'uppercase', fontWeight: 600 }}>
            OFFICIAL BIODATA & EXECUTIVE DOSSIER
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleShare}
            title="Share Biodata"
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
            <span>{copied === 'link' ? 'Copied Link!' : 'Share'}</span>
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

      {/* ── Main Biodata Document Body ── */}
      <main style={{ maxWidth: 880, margin: '0 auto', padding: 'clamp(28px,5vh,64px) var(--px)', position: 'relative', zIndex: 1 }}>

        {/* Document Board Frame */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2DCD0',
          borderRadius: 2,
          boxShadow: '0 12px 48px rgba(13,18,24,0.06), 0 2px 6px rgba(0,0,0,0.02)',
          padding: 'clamp(28px,5vw,56px)',
          position: 'relative'
        }}>

          {/* ── Official Regal Header Band ── */}
          <div style={{
            padding: 'clamp(28px, 4vh, 40px) clamp(24px, 4vw, 44px)',
            background: 'linear-gradient(135deg, #0D1218 0%, #1A222C 100%)',
            color: '#FAF8F5', marginBottom: 36, position: 'relative',
            overflow: 'hidden', border: '1px solid #2A3644'
          }}>
            {/* Guilloche Gold Corner Accents */}
            <div style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTop: '2px solid #C47D0E', borderLeft: '2px solid #C47D0E' }} />
            <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTop: '2px solid #C47D0E', borderRight: '2px solid #C47D0E' }} />
            <div style={{ position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottom: '2px solid #C47D0E', borderLeft: '2px solid #C47D0E' }} />
            <div style={{ position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottom: '2px solid #C47D0E', borderRight: '2px solid #C47D0E' }} />

            <div className="biodata-header-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'clamp(20px, 3vw, 36px)',
            }}>
              {/* Left: Identity Details */}
              <div style={{ minWidth: 0 }}>
                {/* Document Classification */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.28em', color: '#C47D0E', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>
                  <span>CURRICULUM VITAE</span>
                  <span>·</span>
                  <span>OFFICIAL BIODATA</span>
                </div>

                {/* Candidate Name */}
                <h1 style={{
                  fontFamily: 'Barlow Condensed,sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(36px, 5.5vw, 56px)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  lineHeight: 0.95,
                  margin: '0 0 8px',
                  color: '#FFFFFF'
                }}>
                  {E.name}
                </h1>

                {/* Subtitle / License */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
                  <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 'clamp(15px, 2vw, 19px)', color: '#C47D0E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {E.title}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5, color: '#D1D5DB', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Class ABC Licensed (ELB)
                  </span>
                </div>

                {/* Direct Contact Ribbon */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div
                    onClick={() => copyText(E.phone, 'phone')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '4px 10px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', transition: 'background 0.15s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    title="Click to copy phone"
                  >
                    <Phone size={12} color="#C47D0E" />
                    <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#E5E7EB', fontWeight: 500 }}>{E.phone}</span>
                    {copied === 'phone' && <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4ADE80', fontWeight: 700 }}>COPIED!</span>}
                  </div>

                  <div
                    onClick={() => copyText(E.email, 'email')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '4px 10px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', transition: 'background 0.15s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    title="Click to copy email"
                  >
                    <Mail size={12} color="#C47D0E" />
                    <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#E5E7EB' }}>{E.email}</span>
                    {copied === 'email' && <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4ADE80', fontWeight: 700 }}>COPIED!</span>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <MapPin size={12} color="#C47D0E" />
                    <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#E5E7EB' }}>{E.location}</span>
                  </div>
                </div>
              </div>

              {/* Right: Official Candidate Photograph */}
              {(E.photo || sahinPhoto) && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <div style={{
                    width: 114, height: 138, borderRadius: 3, overflow: 'hidden',
                    border: '2px solid #C47D0E',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)', background: '#111827',
                    position: 'relative'
                  }}>
                    <img
                      src={E.photo || sahinPhoto}
                      alt={E.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(13,18,24,0.85)', backdropFilter: 'blur(4px)',
                      borderTop: '1px solid rgba(196,125,14,0.4)',
                      padding: '2px 0', textAlign: 'center'
                    }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: '#C47D0E', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                        OFFICIAL PHOTO
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── 01. Career & Professional Objective ── */}
          <Section title="01. Professional Objective" icon={<Compass size={15} color="#C47D0E" />}>
            <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.8, fontWeight: 400, margin: 0, padding: '14px 18px', background: '#FAFAF8', borderLeft: '3px solid #C47D0E', border: '1px solid #EDE8DF', borderLeftWidth: 3 }}>
              {E.tagline} {E.bio[0]}
            </p>
          </Section>

          {/* ── 02. Personal Particulars & Vital Details ── */}
          <Section title="02. Personal Particulars" icon={<User size={15} color="#C47D0E" />}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px 24px', background: '#FAFAF8', padding: '16px 20px', border: '1px solid #EDE8DF' }}>
              {[
                { l: 'Full Name',        v: E.name },
                { l: 'Designation',      v: `${E.title} (EEE)` },
                { l: 'Statutory License',v: 'Class ABC (Electricity Licensing Board)' },
                { l: 'Nationality',      v: 'Bangladeshi (By Birth)' },
                { l: 'Religion',         v: 'Islam' },
                { l: 'Marital Status',   v: 'Single' },
                { l: 'Contact Mobile',   v: E.phone },
                { l: 'Email Address',    v: E.email },
                { l: 'Present Location', v: E.location },
                { l: 'LinkedIn Profile', v: 'linkedin.com/in/sahinalom', link: E.linkedin },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, paddingBottom: 8, borderBottom: '1px dashed #EDE8DF', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#6B7280', textTransform: 'uppercase', flexShrink: 0, minWidth: 120 }}>
                    {r.l}:
                  </span>
                  {r.link ? (
                    <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#C47D0E', fontWeight: 600, textDecoration: 'none' }}>
                      {r.v} ↗
                    </a>
                  ) : (
                    <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#111827', fontWeight: 600 }}>
                      {r.v}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* ── 03. Academic & Educational Qualifications ── */}
          <Section title="03. Educational Background" icon={<GraduationCap size={15} color="#C47D0E" />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {education.map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 1fr',
                    gap: 16,
                    padding: '14px 18px',
                    background: '#FAFAF8',
                    border: '1px solid #EDE8DF',
                    alignItems: 'start'
                  }}
                >
                  <div style={{ paddingTop: 2 }}>
                    <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 24, color: '#C47D0E', lineHeight: 1 }}>
                      {e.period}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 14.5, color: '#0D1218', lineHeight: 1.3, marginBottom: 2 }}>
                      {e.degree}
                    </div>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#4B5563', marginBottom: e.note ? 4 : 0 }}>
                      {e.institution}
                    </div>
                    {e.note && (
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: '#6B7280', letterSpacing: '0.08em', background: '#EDE8DF', padding: '1px 7px', borderRadius: 2 }}>
                        {e.note}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── 04. Statutory Licensing & Professional Memberships ── */}
          <Section title="04. Certifications & Statutory Licensing" icon={<ShieldCheck size={15} color="#C47D0E" />}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              {credentials.map((c, i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px 16px',
                    border: i === 0 ? '1px solid rgba(196,125,14,0.35)' : '1px solid #EDE8DF',
                    background: i === 0 ? 'rgba(196,125,14,0.05)' : '#FAFAF8',
                    borderRadius: 2,
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
                    <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 16, color: '#0D1218', lineHeight: 1.1, textTransform: 'uppercase' }}>
                      {c.label}
                    </div>
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-print"
                        style={{
                          color: '#C47D0E', fontSize: 10, textDecoration: 'none',
                          fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.05em',
                          fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 2
                        }}
                      >
                        Verify <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12.5, color: '#C47D0E', fontWeight: 600, marginBottom: 2 }}>
                    {c.value}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: '#6B7280', letterSpacing: '0.04em' }}>
                    {c.detail}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── 05. Professional Experience (Industrial Track Record) ── */}
          <Section title="05. Professional Experience" icon={<Briefcase size={15} color="#C47D0E" />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {experience.map(job => (
                <div key={job.id} style={{ padding: '16px 18px', background: '#FAFAF8', border: '1px solid #EDE8DF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 14.5, color: '#0D1218' }}>
                        {job.role}
                      </div>
                      <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 16, color: '#C47D0E', textTransform: 'uppercase' }}>
                        {job.company} · {job.location}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#374151', background: '#EAE5DB', padding: '2px 8px', borderRadius: 2, fontWeight: 600 }}>
                      {job.period}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12.5, color: '#4B5563', lineHeight: 1.6, margin: '8px 0' }}>
                    {job.description}
                  </p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {job.highlights.map((h, j) => (
                      <li key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: '#C47D0E', fontSize: 10, marginTop: 4 }}>◆</span>
                        <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                          {h}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* ── 06. Technical Skills & Practice Areas ── */}
          <Section title="06. Technical Engineering Competencies" icon={<Zap size={15} color="#C47D0E" />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {expertise.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '170px 1fr',
                    gap: 16,
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: '#FAFAF8',
                    border: '1px solid #EDE8DF'
                  }}
                >
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 700, color: '#0D1218' }}>
                    {item.title}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {item.tags.map((t, j) => (
                      <span
                        key={j}
                        style={{
                          padding: '2px 7px',
                          background: '#EAE5DB',
                          border: '1px solid #DDD7CB',
                          fontFamily: 'JetBrains Mono,monospace',
                          fontSize: 9,
                          color: '#374151',
                          letterSpacing: '0.04em',
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
          </Section>

          {/* ── 07. Formal Solemn Declaration & Verification Seal ── */}
          <div style={{ marginTop: 40, paddingTop: 28, borderTop: '2px solid #0D1218' }}>
            <div style={{ padding: '16px 20px', background: '#FAFAF8', border: '1px solid #EDE8DF', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <BookmarkCheck size={16} color="#C47D0E" />
                <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0D1218' }}>
                  Solemn Affirmation
                </span>
              </div>
              <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12.5, color: '#4B5563', lineHeight: 1.7, margin: 0 }}>
                I hereby declare under solemn affirmation that all information and particulars stated in this official Biodata are true, correct, and verifiable in all aspects to the best of my knowledge and belief.
              </p>
            </div>

            {/* Signature Block */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                  PLACE: SAVAR, DHAKA, BANGLADESH
                </div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  STATUS: VERIFIED CLASS ABC ENGINEER
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'Barlow Condensed,sans-serif',
                  fontWeight: 800,
                  fontSize: 22,
                  color: '#C47D0E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  borderBottom: '1px solid #0D1218',
                  paddingBottom: 4,
                  minWidth: 160
                }}>
                  {E.name}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: '#6B7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>
                  Signature of Candidate
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── Responsive & Print Custom Styling ── */}
      <style>{`
        @media (max-width: 680px) {
          .biodata-header-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
        @media print {
          .no-print { display: none !important; }
          body, .biodata-root {
            background: #FFFFFF !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          main {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .biodata-header-grid {
            grid-template-columns: 1fr auto !important;
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

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
        <h2 style={{
          fontFamily: 'Barlow Condensed,sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(16px,2.5vw,20px)',
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
      {children}
    </div>
  )
}
