import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ArrowUpRight, CheckCircle2, ShieldCheck, Zap,
  Calendar, MapPin, Building2, Layers, Cpu, Download,
  ExternalLink, ChevronRight, ChevronLeft, Share2, Copy, Check,
  X, Maximize2, AlertCircle, FileText, CheckCircle
} from 'lucide-react'
import { useSite, type Project } from '../context/SiteContext'
import EngineerNav from '../components/EngineerNav'
import SEOHead from '../components/SEOHead'
import sahinPhoto from '../img/sahin.png'

export default function ProjectPost() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: { projects, engineer: E } } = useSite()
  const [copied, setCopied] = useState(false)
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // Find project by slug or ID
  const project = useMemo(() => {
    if (!slug) return projects[0] || null
    return (
      projects.find(p => p.slug === slug) ||
      projects.find(p => p.id === slug) ||
      projects.find(p => p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === slug) ||
      projects[0] || null
    )
  }, [slug, projects])

  // Previous & Next navigation
  const { prevProject, nextProject } = useMemo(() => {
    if (!project) return { prevProject: null, nextProject: null }
    const idx = projects.findIndex(p => p.id === project.id)
    return {
      prevProject: idx > 0 ? projects[idx - 1] : null,
      nextProject: idx < projects.length - 1 ? projects[idx + 1] : null,
    }
  }, [project, projects])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--fg)' }}>
        <EngineerNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} onBiodata={() => navigate('/biodata')} onCV={() => navigate('/cv')} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24 }}>
          <AlertCircle size={48} style={{ color: 'var(--accent)' }} />
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 700 }}>Project Not Found</h2>
          <p style={{ color: 'var(--fg-dim)', fontSize: 14 }}>The requested engineering case study could not be located.</p>
          <Link to="/" style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--accent)', color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}>
            Return to Portfolio
          </Link>
        </div>
      </div>
    )
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }

  const projectUrl = `/projects/${project.slug || project.id}`

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
      <SEOHead
        title={`${project.title} — Engineering Case Study`}
        description={project.summary || `Technical project details for ${project.title} by ${E.name}`}
        image={project.img || E.photo}
        url={window.location.href}
      />

      <EngineerNav
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onBiodata={() => navigate('/biodata')}
        onCV={() => navigate('/cv')}
      />

      {/* ── Top Breadcrumb Bar ────────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-2)',
          padding: '14px var(--px, 24px)',
          marginTop: 64,
        }}
      >
        <div
          style={{
            maxWidth: 'var(--max-w, 1200px)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            fontSize: 12.5,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <Link
              to="/#projects"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                color: 'var(--fg-dim)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--fg-dim)')}
            >
              <ArrowLeft size={13} /> All Projects
            </Link>
            <span style={{ color: 'var(--border-strong)' }}>/</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {project.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 10px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--fg-dim)',
                cursor: 'pointer',
                fontSize: 11.5,
              }}
            >
              {copied ? <Check size={13} style={{ color: 'var(--green)' }} /> : <Copy size={13} />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Cinematic Hero Header ─────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(40px, 7vw, 84px) var(--px, 24px) clamp(36px, 6vw, 64px)',
          background: 'linear-gradient(180deg, var(--bg-2) 0%, var(--bg) 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 'var(--max-w, 1200px)', margin: '0 auto' }}>
          {/* Badges row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 99,
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: '1px solid var(--accent)',
              }}
            >
              {project.category}
            </span>

            {project.capacity && (
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: 99,
                  background: 'var(--bg-3)',
                  color: 'var(--fg)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                  fontWeight: 600,
                  border: '1px solid var(--border)',
                }}
              >
                ⚡ {project.capacity}
              </span>
            )}

            {project.year && (
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: 99,
                  background: 'var(--bg-3)',
                  color: 'var(--fg-dim)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                  border: '1px solid var(--border)',
                }}
              >
                📅 {project.year}
              </span>
            )}
          </div>

          {/* Project Title */}
          <h1
            style={{
              fontFamily: 'var(--font-display, Plus Jakarta Sans), sans-serif',
              fontSize: 'clamp(28px, 5.2vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--fg)',
              margin: '0 0 20px',
              letterSpacing: '-0.02em',
              maxWidth: 960,
            }}
          >
            {project.title}
          </h1>

          {/* Subtitle / Executive Summary */}
          {project.summary && (
            <p
              style={{
                fontSize: 'clamp(15px, 2.2vw, 19px)',
                lineHeight: 1.65,
                color: 'var(--fg-dim)',
                maxWidth: 880,
                margin: 0,
                fontWeight: 350,
              }}
            >
              {project.summary}
            </p>
          )}
        </div>
      </section>

      {/* ── Main Layout: Content Grid & Technical Specs Sidebar ───────────── */}
      <section style={{ padding: 'clamp(32px, 5vw, 64px) var(--px, 24px)' }}>
        <div
          style={{
            maxWidth: 'var(--max-w, 1200px)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: 'clamp(32px, 4.5vw, 64px)',
            alignItems: 'start',
          }}
        >
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40, minWidth: 0 }}>
            {/* Primary Featured Image / Blueprint */}
            {project.img && (
              <div
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  background: project.imgColor || 'var(--bg-3)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
                  position: 'relative',
                }}
              >
                <img
                  src={project.img}
                  alt={project.title}
                  style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 520, objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(6px)',
                    color: '#FFFFFF',
                    fontSize: 10.5,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  ENGINEERING AS-BUILT PHOTO
                </div>
              </div>
            )}

            {/* Scope of Engineering Work */}
            {project.scope && project.scope.length > 0 && (
              <div
                style={{
                  padding: '28px 32px',
                  borderRadius: 12,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: 'var(--accent-dim)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Layers size={17} />
                  </div>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                    Scope of Engineering Work
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {project.scope.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'var(--accent-dim)',
                          color: 'var(--accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 2,
                          fontSize: 10.5,
                          fontFamily: 'JetBrains Mono, monospace',
                          fontWeight: 700,
                        }}
                      >
                        {i + 1}
                      </div>
                      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg)' }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Deliverables */}
            {project.deliverables && project.deliverables.length > 0 && (
              <div
                style={{
                  padding: '28px 32px',
                  borderRadius: 12,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: 'rgba(22, 163, 74, 0.12)',
                      color: 'var(--green, #16A34A)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle2 size={17} />
                  </div>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                    Verified Deliverables & Milestones
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                  {project.deliverables.map((d, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 8,
                        background: 'var(--bg-2)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                      }}
                    >
                      <Check size={15} style={{ color: 'var(--green, #16A34A)', marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--fg)', fontWeight: 500 }}>
                        {d}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Case Study / Technical Narrative */}
            {project.detailedContent && (
              <div
                style={{
                  padding: '28px 32px',
                  borderRadius: 12,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                }}
              >
                <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                  Engineering Case Study & Technical Narrative
                </h2>
                <div
                  style={{
                    fontSize: 15,
                    lineHeight: 1.8,
                    color: 'var(--fg)',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {project.detailedContent}
                </div>
              </div>
            )}

            {/* Verified Outcome & Engineering Impact */}
            {project.outcome && (
              <div
                style={{
                  padding: '24px 28px',
                  borderRadius: 12,
                  background: 'var(--accent-dim)',
                  border: '1.5px solid var(--accent)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: 'var(--accent)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                    Project Outcome & Grid Energization
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginTop: 4, lineHeight: 1.5 }}>
                    {project.outcome}
                  </div>
                </div>
              </div>
            )}

            {/* Blueprint / Gallery Images */}
            {project.gallery && project.gallery.length > 0 && (
              <div>
                <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                  Single-Line Diagrams & Site Photography
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                  {project.gallery.map((imgUrl, gIdx) => (
                    <div
                      key={gIdx}
                      onClick={() => setSelectedGalleryImg(imgUrl)}
                      style={{
                        aspectRatio: '4/3',
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = 'none'
                        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                      }}
                    >
                      <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0')}
                      >
                        <Maximize2 size={20} color="#FFFFFF" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Technical Specifications Matrix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 80 }}>
            {/* Quick Specs Card */}
            <div
              style={{
                borderRadius: 12,
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, fontFamily: "'Inter', sans-serif", borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                Technical Project Matrix
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {project.client && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--fg-dim)' }}>Client / Owner</span>
                    <span style={{ fontWeight: 600, color: 'var(--fg)', textAlign: 'right' }}>{project.client}</span>
                  </div>
                )}

                {project.location && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--fg-dim)' }}>Location</span>
                    <span style={{ fontWeight: 600, color: 'var(--fg)', textAlign: 'right' }}>{project.location}</span>
                  </div>
                )}

                {project.capacity && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--fg-dim)' }}>Grid Rating</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--accent)' }}>
                      {project.capacity}
                    </span>
                  </div>
                )}

                {project.year && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--fg-dim)' }}>Execution Year</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: 'var(--fg)' }}>
                      {project.year}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-dim)' }}>Lead Engineer</span>
                  <span style={{ fontWeight: 600, color: 'var(--fg)' }}>{E.name || 'Md Sahin Alom'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-dim)' }}>License</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>
                    ELB CLASS A, B, C
                  </span>
                </div>
              </div>

              {/* Dynamic Key-Value Specifications if present */}
              {project.specifications && Object.keys(project.specifications).length > 0 && (
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                    Engineering Specifications
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {Object.entries(project.specifications).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                        <span style={{ color: 'var(--fg-dim)' }}>{key}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: 'var(--fg)' }}>
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools & Standards Chips */}
              {project.tools && project.tools.length > 0 && (
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                    Software & Standards
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {project.tools.map((tool, ti) => (
                      <span
                        key={ti}
                        style={{
                          fontSize: 10.5,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: 'var(--bg-2)',
                          border: '1px solid var(--border)',
                          color: 'var(--fg)',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Consultation CTA Card */}
            <div
              style={{
                borderRadius: 12,
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#FFFFFF',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={E.photo || sahinPhoto} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                    Need a Similar Solution?
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>
                    DIRECT ENGINEERING CONSULTATION
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                Consult with Md Sahin Alom on substation engineering, protection relay coordination, or industrial captive power generation.
              </p>

              <Link
                to="/contact"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  height: 38,
                  borderRadius: 6,
                  background: 'var(--accent)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Inquire for Consulting <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Next / Previous Projects Footer ───────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-2)', padding: 'clamp(28px, 4vw, 44px) var(--px, 24px)' }}>
        <div style={{ maxWidth: 'var(--max-w, 1200px)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          {prevProject ? (
            <Link
              to={`/projects/${prevProject.slug || prevProject.id}`}
              style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--fg)' }}
            >
              <ChevronLeft size={20} style={{ color: 'var(--accent)' }} />
              <div>
                <div style={{ fontSize: 10.5, fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Previous Project
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{prevProject.title}</div>
              </div>
            </Link>
          ) : <div />}

          {nextProject && (
            <Link
              to={`/projects/${nextProject.slug || nextProject.id}`}
              style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--fg)', textAlign: 'right' }}
            >
              <div>
                <div style={{ fontSize: 10.5, fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Next Project
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{nextProject.title}</div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--accent)' }} />
            </Link>
          )}
        </div>
      </section>

      {/* Lightbox Modal for Gallery Images */}
      {selectedGalleryImg && (
        <div
          onClick={() => setSelectedGalleryImg(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <img src={selectedGalleryImg} alt="" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }} />
            <button
              type="button"
              onClick={() => setSelectedGalleryImg(null)}
              style={{
                position: 'absolute',
                top: -14,
                right: -14,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#FFFFFF',
                color: '#000000',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
