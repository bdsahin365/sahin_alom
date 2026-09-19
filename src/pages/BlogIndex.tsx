import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  ArrowRight,
  ArrowUpRight,
  Search,
  BookOpen,
  Calendar,
  Layers,
  CheckCircle2,
  X,
  SlidersHorizontal,
  Zap,
  Activity,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { fetchPublishedArticles, Article } from '../lib/articlesService'
import EngineerNav from '../components/EngineerNav'
import SEOHead from '../components/SEOHead'
import HeaderLogo from '../components/HeaderLogo'
import { useSite } from '../context/SiteContext'
import { getBlogTitleStyles, getBlogBodyStyles, isBengali } from '../lib/langUtils'
import sahinAvatar from '../img/sahin.png'

const luxuryEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function BlogIndex() {
  const navigate = useNavigate()
  const { data: { engineer: E } } = useSite()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'read_time'>('newest')

  useEffect(() => {
    fetchPublishedArticles().then(data => {
      setArticles(data || [])
      setLoading(false)
    })
  }, [])

  // Unique categories with counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: articles.length }
    articles.forEach(a => {
      const cat = a.category?.trim() || 'General'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [articles])

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(articles.map(a => a.category?.trim() || 'General').filter(Boolean)))]
  }, [articles])

  // Filtered and sorted articles
  const filtered = useMemo(() => {
    let list = articles.filter(a => {
      const q = search.trim().toLowerCase()
      const matchSearch =
        !q ||
        a.title?.toLowerCase().includes(q) ||
        a.excerpt?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q) ||
        a.tags?.some(t => t.toLowerCase().includes(q))

      const cat = a.category?.trim() || 'General'
      const matchCat = activeCategory === 'All' || cat === activeCategory
      return matchSearch && matchCat
    })

    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.updated_at || b.created_at || '').getTime() - new Date(a.updated_at || a.created_at || '').getTime())
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.updated_at || a.created_at || '').getTime() - new Date(b.updated_at || b.created_at || '').getTime())
    } else if (sortBy === 'read_time') {
      list.sort((a, b) => (b.read_time || 0) - (a.read_time || 0))
    }

    return list
  }, [articles, search, activeCategory, sortBy])

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return ''
    }
  }

  // Highlight featured article: first article if 'All' and no search
  const isDefaultView = activeCategory === 'All' && !search.trim()
  const featuredArticle = isDefaultView && filtered.length > 0 ? filtered[0] : null
  const gridArticles = isDefaultView && filtered.length > 1 ? filtered.slice(1) : filtered

  const totalCalculations = articles.length
  const totalReadMinutes = useMemo(() => {
    return articles.reduce((acc, a) => acc + (a.read_time || 5), 0)
  }, [articles])

  // Breadcrumbs schema for SEO
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Engineering Journal & Technical Articles — Md Sahin Alom',
    description: 'High-voltage substation engineering, power system analysis, protection coordination, and BNBC 2020 calculations by Md Sahin Alom.',
    url: typeof window !== 'undefined' ? window.location.href : 'https://sahinalom.com/blog',
    author: {
      '@type': 'Person',
      name: E.name || 'Md Sahin Alom',
      jobTitle: 'Senior Electrical Engineer',
      url: 'https://sahinalom.com',
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: filtered.map((a, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://sahinalom.com/blog/${a.slug}`,
        name: a.title,
      })),
    },
  }

  return (
    <>
      <SEOHead
        title="Engineering Journal & Technical Papers"
        description="Authoritative technical writing on power systems, high-voltage substation engineering, industrial electrical design, and BNBC 2020 compliance by Md Sahin Alom."
        keywords={['Electrical Engineering Blog', 'Substation Design', 'BNBC 2020', 'SLD Calculation', 'Power Systems Engineer', 'Md Sahin Alom']}
        schema={jsonLdSchema}
      />

      <EngineerNav />

      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 'var(--nav-h)', color: 'var(--fg)' }}>
        {/* ══ HERO DOSSIER BANNER (Matches Homepage Taste) ════════════════════ */}
        <header
          style={{
            position: 'relative',
            padding: 'clamp(56px, 9vh, 92px) 0 clamp(44px, 7vh, 72px)',
            background: 'linear-gradient(to bottom, var(--bg-2) 0%, var(--bg) 100%)',
            borderBottom: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Technical Blueprint Dot Matrix */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(var(--border-strong) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              opacity: 0.35,
              pointerEvents: 'none',
            }}
          />

          {/* Warm Ambient Illumination Accent */}
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              right: '12%',
              width: 480,
              height: 480,
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--px)', position: 'relative', zIndex: 1 }}>
            {/* Architectural Dossier Ribbon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                05 // TECHNICAL JOURNAL & RESEARCH
              </span>
              <div style={{ width: 44, height: 1, background: 'var(--border-strong)' }} />
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  color: 'var(--fg-dim)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                FIELD-TESTED CALCULATIONS
              </span>
            </div>

            {/* Scale Typography Headline */}
            <h1
              className="display"
              style={{
                fontSize: 'clamp(36px, 6.4vw, 84px)',
                lineHeight: 1.02,
                color: 'var(--fg)',
                letterSpacing: '-0.025em',
                maxWidth: 1080,
                marginBottom: 20,
              }}
            >
              <span className="font-playfair italic font-normal" style={{ textTransform: 'none', marginRight: 12, color: 'var(--accent)' }}>
                Power Systems
              </span>
              <span>Dossier &amp; Research</span>
            </h1>

            {/* Subtitle / Excerpt */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(15px, 1.8vw, 18px)',
                color: 'var(--fg-dim)',
                lineHeight: 1.68,
                maxWidth: 720,
                fontWeight: 350,
                marginBottom: 36,
              }}
            >
              Peer-reviewed technical methodologies, single-line diagrams, substation transformer sizing, and statutory compliance guides (BNBC 2020 / IEEE / IEC) authored by certified power systems engineer {E.name || 'Md Sahin Alom'}.
            </p>

            {/* Telemetry Strip (Value + Unit + Label + Monospace index) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: 16,
                paddingTop: 24,
                borderTop: '1px solid var(--border)',
                maxWidth: 820,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span className="display" style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: 'var(--accent)' }}>
                    {articles.length}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    PAPERS
                  </span>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: 2 }}>
                  Published Research
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span className="display" style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: 'var(--fg)' }}>
                    {totalReadMinutes}+
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    MIN
                  </span>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: 2 }}>
                  Engineering Content
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span className="display" style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: 'var(--fg)' }}>
                    BNBC / IEC
                  </span>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: 2 }}>
                  Statutory Standards
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ══ STICKY CAD FILTER & SEARCH CONTROLS ══════════════════════════════ */}
        <section
          style={{
            position: 'sticky',
            top: 'var(--nav-h)',
            zIndex: 30,
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              maxWidth: 'var(--max-w)',
              margin: '0 auto',
              padding: '12px var(--px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            {/* Search Input Box */}
            <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: 460 }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search technical papers, SLDs, formulas..."
                style={{
                  width: '100%',
                  height: 40,
                  padding: '0 36px 0 38px',
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: 'var(--fg)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--accent)'
                  e.target.style.background = 'var(--card-bg)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border)'
                  e.target.style.background = 'var(--bg-2)'
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  title="Clear search"
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    padding: 4,
                    display: 'flex',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Right Controls: Sort & Active Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 9.5,
                    letterSpacing: '0.15em',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  SORT:
                </span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  style={{
                    height: 36,
                    padding: '0 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    background: 'var(--bg-2)',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: 'var(--fg)',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="newest">Latest Release</option>
                  <option value="oldest">Earliest First</option>
                  <option value="read_time">Longest Read</option>
                </select>
              </div>

              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10.5,
                  color: 'var(--muted)',
                  letterSpacing: '0.12em',
                  padding: '4px 10px',
                  background: 'var(--bg-2)',
                  borderRadius: 4,
                  border: '1px solid var(--border)',
                }}
              >
                {filtered.length} {filtered.length === 1 ? 'FILE' : 'FILES'}
              </div>
            </div>
          </div>

          {/* Dynamic Category Filter Pills */}
          <div style={{ borderTop: '1px solid var(--border)' }}>
            <div
              style={{
                maxWidth: 'var(--max-w)',
                margin: '0 auto',
                padding: '0 var(--px)',
                display: 'flex',
                gap: 6,
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {categories.map(cat => {
                const count = categoryCounts[cat] || 0
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      height: 42,
                      padding: '0 14px',
                      border: 'none',
                      background: 'transparent',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      color: isActive ? 'var(--accent)' : 'var(--fg-dim)',
                      fontWeight: isActive ? 700 : 500,
                      borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{cat}</span>
                    <span
                      style={{
                        background: isActive ? 'var(--accent-dim)' : 'var(--bg-2)',
                        color: isActive ? 'var(--accent)' : 'var(--muted)',
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontSize: 9,
                        fontWeight: 700,
                        border: '1px solid var(--border)',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══ ARTICLES REPOSITORY ═══════════════════════════════════════════════ */}
        <main style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: 'clamp(36px, 5vh, 64px) var(--px) clamp(60px, 8vh, 100px)' }}>
          {/* Loading Skeleton */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  border: '2px solid var(--border-strong)',
                  borderTopColor: 'var(--accent)',
                  borderRadius: '50%',
                  margin: '0 auto 18px',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                INITIALIZING TECHNICAL PAPERS...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 24px',
                background: 'var(--card-bg)',
                borderRadius: 10,
                border: '1px solid var(--border)',
                maxWidth: 580,
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 8,
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--border-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--accent)',
                }}
              >
                <BookOpen size={24} strokeWidth={1.8} />
              </div>
              <h2
                className="display"
                style={{
                  fontSize: 22,
                  color: 'var(--fg)',
                  marginBottom: 8,
                }}
              >
                No Matching Technical Papers
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: 'var(--fg-dim)',
                  lineHeight: 1.6,
                  marginBottom: 24,
                  fontWeight: 350,
                }}
              >
                {search
                  ? `No research items matching query "${search}".`
                  : `No published technical articles in "${activeCategory}".`}
              </p>
              <button
                onClick={() => {
                  setSearch('')
                  setActiveCategory('All')
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  background: 'var(--accent)',
                  color: '#FFFFFF',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* ══ FEATURED ARTICLE HERO CARD (2fr / 1fr Horizontal Bento) ═══════ */}
          {!loading && featuredArticle && (
            <section style={{ marginBottom: 44 }}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              >
                <div
                  onClick={() => navigate(`/blog/${featuredArticle.slug}`)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
                    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--accent)'
                    el.style.boxShadow = '0 16px 36px -10px rgba(0,0,0,0.09)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--border)'
                    el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.03)'
                  }}
                >
                  {/* Left: Cover Visual with Dark Cinematic Vignette */}
                  <div
                    style={{
                      position: 'relative',
                      minHeight: 320,
                      aspectRatio: '16/10',
                      background: 'var(--bg-3)',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={featuredArticle.featured_image || '/img/lighting-design-cover.jpg'}
                      alt={featuredArticle.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                      }}
                    />

                    {/* Dark Vignette Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(9, 12, 18, 0.72) 0%, rgba(9, 12, 18, 0.15) 50%, transparent 100%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Floating Telemetry Badge Top Left */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'rgba(9, 12, 18, 0.75)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        padding: '4px 10px',
                        borderRadius: 4,
                        pointerEvents: 'none',
                      }}
                    >
                      <Sparkles size={11} style={{ color: 'var(--accent)' }} />
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: '0.16em',
                          color: '#FFFFFF',
                          textTransform: 'uppercase',
                        }}
                      >
                        FEATURED RESEARCH
                      </span>
                    </div>

                    {/* Arrow Disclosure Top Right */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'rgba(9, 12, 18, 0.65)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        pointerEvents: 'none',
                      }}
                    >
                      <ArrowUpRight size={15} strokeWidth={2.2} />
                    </div>

                    {/* Bottom Specs Pill */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        left: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        pointerEvents: 'none',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: '#FFFFFF',
                          background: 'rgba(196, 125, 14, 0.9)',
                          padding: '2px 8px',
                          borderRadius: 3,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {featuredArticle.category || 'ELECTRICAL'}
                      </span>
                      {featuredArticle.read_time > 0 && (
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 9.5,
                            color: 'rgba(255, 255, 255, 0.9)',
                            background: 'rgba(9, 12, 18, 0.65)',
                            backdropFilter: 'blur(6px)',
                            padding: '2px 8px',
                            borderRadius: 3,
                          }}
                        >
                          {featuredArticle.read_time} MIN READ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Editorial Content ("Less is More") */}
                  <div
                    style={{
                      padding: 'clamp(24px, 3.8vw, 44px)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      {/* Meta Coordinates */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          marginBottom: 10,
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 10,
                          color: 'var(--fg-dim)',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                          SEC.01
                        </span>
                        <span>•</span>
                        <span>{formatDate(featuredArticle.updated_at || featuredArticle.created_at || '')}</span>
                        <span>•</span>
                        <span style={{ color: 'var(--muted)' }}>BNBC 2020 AUDITED</span>
                      </div>

                      {/* Title */}
                      <h2
                        style={{
                          fontFamily: isBengali(featuredArticle.title) ? "'Hind Siliguri', sans-serif" : "'Inter', sans-serif",
                          fontSize: 'clamp(22px, 2.6vw, 32px)',
                          fontWeight: 700,
                          color: 'var(--fg)',
                          lineHeight: isBengali(featuredArticle.title) ? 1.35 : 1.25,
                          marginBottom: 14,
                        }}
                      >
                        {featuredArticle.title}
                      </h2>

                      {/* Excerpt */}
                      {featuredArticle.excerpt && (
                        <p
                          style={{
                            fontFamily: isBengali(featuredArticle.excerpt) ? "'Hind Siliguri', sans-serif" : "'Inter', sans-serif",
                            fontSize: 14.5,
                            color: 'var(--fg-dim)',
                            lineHeight: 1.65,
                            fontWeight: 350,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            marginBottom: 20,
                          }}
                        >
                          {featuredArticle.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Author Footnote & Deep Dive CTA */}
                    <div
                      style={{
                        paddingTop: 16,
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={sahinAvatar}
                          alt="Md Sahin Alom"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1.5px solid var(--accent)',
                          }}
                        />
                        <div>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12.5, color: 'var(--fg)' }}>
                            {featuredArticle.author || 'Md Sahin Alom'}
                          </div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            ABC Certified Engineer
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'var(--accent)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Read Paper <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          )}

          {/* ══ REPOSITORY GRID (Matches Project Card Aesthetics) ══════════════ */}
          {!loading && gridArticles.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
                gap: 'clamp(20px, 2.5vw, 32px)',
              }}
            >
              {gridArticles.map((article, idx) => (
                <motion.div
                  key={article.id || idx}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  style={{ height: '100%' }}
                >
                  <article
                    onClick={() => navigate(`/blog/${article.slug}`)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'var(--accent)'
                      el.style.boxShadow = '0 16px 36px -10px rgba(0,0,0,0.09)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'var(--border)'
                      el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)'
                    }}
                  >
                    {/* Visual Showcase Banner */}
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '16/10',
                        overflow: 'hidden',
                        background: 'var(--bg-3)',
                      }}
                    >
                      <img
                        src={article.featured_image || '/img/lighting-design-cover.jpg'}
                        alt={article.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                        }}
                      />

                      {/* Subtle Dark Vignette */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(9, 12, 18, 0.72) 0%, rgba(9, 12, 18, 0.1) 45%, transparent 100%)',
                          pointerEvents: 'none',
                        }}
                      />

                      {/* Floating Telemetry & Arrow Pill */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          right: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          pointerEvents: 'none',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 9.5,
                            fontWeight: 700,
                            color: '#FFFFFF',
                            background: 'rgba(9, 12, 18, 0.65)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            padding: '3px 9px',
                            borderRadius: 4,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {article.category || 'TECHNICAL'}
                        </span>

                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: 'rgba(9, 12, 18, 0.65)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                          }}
                        >
                          <ArrowUpRight size={13} strokeWidth={2.2} />
                        </div>
                      </div>

                      {/* Bottom Read Time Pill */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 10,
                          left: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          pointerEvents: 'none',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 9.5,
                            fontWeight: 700,
                            color: '#FFFFFF',
                            background: 'rgba(196, 125, 14, 0.85)',
                            padding: '2px 8px',
                            borderRadius: 3,
                            letterSpacing: '0.08em',
                          }}
                        >
                          {article.read_time || 5} MIN READ
                        </span>
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 9.5,
                            color: 'rgba(255, 255, 255, 0.85)',
                            background: 'rgba(9, 12, 18, 0.55)',
                            backdropFilter: 'blur(6px)',
                            padding: '2px 7px',
                            borderRadius: 3,
                          }}
                        >
                          {formatDate(article.updated_at || article.created_at || '')}
                        </span>
                      </div>
                    </div>

                    {/* Card Body ("Less is More") */}
                    <div
                      style={{
                        padding: 'clamp(18px, 2.2vw, 24px)',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                      }}
                    >
                      {/* Meta coordinate line */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 6,
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 10,
                          color: 'var(--fg-dim)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                          DOC-0{idx + 2}
                        </span>
                        <span style={{ color: 'var(--border-strong)' }}>•</span>
                        <span>{article.category || 'Engineering'}</span>
                      </div>

                      {/* Confident Title */}
                      <h3
                        style={{
                          fontFamily: isBengali(article.title) ? "'Hind Siliguri', sans-serif" : "'Inter', sans-serif",
                          fontSize: 'clamp(17px, 1.5vw, 20px)',
                          fontWeight: 700,
                          color: 'var(--fg)',
                          lineHeight: isBengali(article.title) ? 1.35 : 1.3,
                          marginBottom: 8,
                        }}
                      >
                        {article.title}
                      </h3>

                      {/* Succinct 2-line Excerpt */}
                      {article.excerpt && (
                        <p
                          style={{
                            fontFamily: isBengali(article.excerpt) ? "'Hind Siliguri', sans-serif" : "'Inter', sans-serif",
                            fontSize: 13.5,
                            color: 'var(--fg-dim)',
                            lineHeight: 1.6,
                            fontWeight: 350,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            marginBottom: 14,
                            flex: 1,
                          }}
                        >
                          {article.excerpt}
                        </p>
                      )}

                      {/* Bottom Hairline Disclosure */}
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: 12,
                          borderTop: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 9.5,
                            color: 'var(--muted)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Engineering Spec
                        </span>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 10.5,
                            color: 'var(--accent)',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}
                        >
                          View Paper <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </article>
                </motion.div>
              ))}
            </div>
          )}

          {/* ══ BOTTOM ENGINEERING CALLOUT BANNER ══════════════════════════════ */}
          <section
            style={{
              marginTop: 'clamp(56px, 8vh, 88px)',
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 'clamp(32px, 5vw, 56px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle radial ambient glow */}
            <div
              style={{
                position: 'absolute',
                top: '-30%',
                right: '-10%',
                width: 360,
                height: 360,
                borderRadius: '50%',
                background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
                filter: 'blur(30px)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                CONSULTATION &amp; STATUTORY AUDIT
              </div>

              <h3
                className="display"
                style={{
                  fontSize: 'clamp(26px, 3.8vw, 44px)',
                  lineHeight: 1.08,
                  color: 'var(--fg)',
                  marginBottom: 14,
                }}
              >
                Require Peer Review for Substation or Industrial Electrical Systems?
              </h3>

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14.5,
                  color: 'var(--fg-dim)',
                  lineHeight: 1.7,
                  fontWeight: 350,
                  marginBottom: 28,
                }}
              >
                From 33kV/11kV substation load flow analysis to BNBC 2020 single-line diagrams, obtain rigorous peer review and statutory clearance consulting directly from {E.name || 'Md Sahin Alom'}.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/contact')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 26px',
                    background: 'var(--accent)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 6,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(196,125,14,0.3)',
                    transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'none'
                  }}
                >
                  Request Review Proposal <ArrowUpRight size={14} strokeWidth={2.2} />
                </button>

                <button
                  onClick={() => navigate('/cv')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 22px',
                    background: 'transparent',
                    color: 'var(--fg)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 6,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease, color 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--fg)'
                  }}
                >
                  View Engineer Dossier
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* ══ SHARED EDITORIAL FOOTER ══════════════════════════════════════════ */}
        <footer
          style={{
            borderTop: '1px solid var(--border)',
            padding: 'clamp(32px, 5vh, 56px) var(--px)',
            background: 'var(--bg)',
          }}
        >
          <div
            style={{
              maxWidth: 'var(--max-w)',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <HeaderLogo compact={true} showSubtitle={false} />

            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                color: 'var(--muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              &copy; {new Date().getFullYear()} {E.name} · Certified Electrical Engineer · Class ABC Licensed
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                color: 'var(--fg-dim)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'color 0.2s',
                fontWeight: 700,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--fg-dim)')}
            >
              Back to top ↑
            </button>
          </div>
        </footer>
      </div>
    </>
  )
}
