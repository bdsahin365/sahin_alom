import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import {
  Clock,
  ArrowRight,
  Search,
  BookOpen,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { fetchPublishedArticles, Article } from '../lib/articlesService'
import EngineerNav from '../components/EngineerNav'
import SEOHead from '../components/SEOHead'
import { getBlogTitleStyles, getBlogBodyStyles } from '../lib/langUtils'
import sahinAvatar from '../img/sahin.png'

export default function BlogIndex() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'read_time'>('newest')

  useEffect(() => {
    fetchPublishedArticles().then(data => {
      setArticles(data)
      setLoading(false)
    })
  }, [])

  // Unique categories with counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: articles.length }
    articles.forEach(a => {
      const cat = a.category || 'General'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [articles])

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(articles.map(a => a.category || 'General').filter(Boolean)))]
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

      const cat = a.category || 'General'
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

  // Breadcrumbs schema for SEO
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Engineering Articles & Technical Journal — Md Sahin Alom',
    description: 'Technical insights on electrical engineering, power systems, substation engineering, and BNBC 2020 building services.',
    url: typeof window !== 'undefined' ? window.location.href : 'https://sahinalom.com/blog',
    author: {
      '@type': 'Person',
      name: 'Md Sahin Alom',
      jobTitle: 'Electrical Engineer',
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
        title="Engineering Articles & Technical Journal"
        description="Authoritative technical writing on electrical engineering, substation design, industrial power systems, and BNBC 2020 compliance by Md Sahin Alom."
        keywords={['Electrical Engineering Blog', 'BNBC 2020', 'Substation Design', 'Lighting Design Bangladesh', 'Power Systems', 'Md Sahin Alom']}
        schema={jsonLdSchema}
      />

      <EngineerNav />

      <div style={{ background: '#F7F5F0', minHeight: '100vh', paddingTop: 'var(--nav-h)' }}>
        {/* ══ HERO BANNER ════════════════════════════════════════════════════════ */}
        <header
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)',
            borderBottom: '1px solid #E2E8F0',
            padding: '52px 0 44px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle decorative grid background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(196,125,14,0.08) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              opacity: 0.7,
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            {/* Monospace Dossier Ribbon */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(196,125,14,0.08)',
                border: '1px solid rgba(196,125,14,0.25)',
                padding: '4px 12px',
                borderRadius: 99,
                marginBottom: 16,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C47D0E' }} />
              <span
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                  color: '#C47D0E',
                  textTransform: 'uppercase',
                }}
              >
                SAHINALOM.COM / TECHNICAL DOSSIER & JOURNAL
              </span>
            </div>

            {/* Main Page Title */}
            <h1
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(38px, 6.5vw, 68px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#0F172A',
                marginBottom: 18,
              }}
            >
              Engineering <span style={{ color: '#C47D0E' }}>Articles</span> & Insights
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(16px, 2.2vw, 19px)',
                color: '#475569',
                lineHeight: 1.6,
                maxWidth: 680,
                marginBottom: 28,
              }}
            >
              Field-tested perspectives, standards-driven calculations, substation engineering, and practical building
              electrical services (BNBC 2020 / IEEE / IEC).
            </p>

            {/* Feature Highlights Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#334155',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <CheckCircle2 size={14} style={{ color: '#16A34A' }} />
                <span>BNBC 2020 Compliant</span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#334155',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <Sparkles size={14} style={{ color: '#C47D0E' }} />
                <span>Step-by-Step Calculations</span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#334155',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <ShieldCheck size={14} style={{ color: '#2563EB' }} />
                <span>ABC Licensed Peer Review</span>
              </div>
            </div>
          </div>
        </header>

        {/* ══ FILTER & SEARCH CONTROL STRIP ═══════════════════════════════════ */}
        <section
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            position: 'sticky',
            top: 'var(--nav-h)',
            zIndex: 30,
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              maxWidth: 1080,
              margin: '0 auto',
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 14,
            }}
          >
            {/* Search Input Box */}
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 440 }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                  pointerEvents: 'none',
                }}
              />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles by title, topic, formula…"
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 36px 0 38px',
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 13.5,
                  color: '#0F172A',
                  background: '#FAF8F5',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#C47D0E'
                  e.target.style.background = '#FFFFFF'
                  e.target.style.boxShadow = '0 0 0 3px rgba(196,125,14,0.12)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#E2E8F0'
                  e.target.style.background = '#FAF8F5'
                  e.target.style.boxShadow = 'none'
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
                    color: '#94A3B8',
                    padding: 4,
                    display: 'flex',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Right Controls: Sort & Article Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <SlidersHorizontal size={13} style={{ color: '#64748B' }} />
                <span
                  style={{
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    color: '#64748B',
                    textTransform: 'uppercase',
                  }}
                >
                  SORT:
                </span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  style={{
                    height: 34,
                    padding: '0 10px',
                    border: '1px solid #E2E8F0',
                    borderRadius: 6,
                    background: '#FFFFFF',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: '#1E293B',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="newest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="read_time">Longest Read</option>
                </select>
              </div>

              <div
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 11,
                  color: '#94A3B8',
                  letterSpacing: '0.08em',
                }}
              >
                {filtered.length} {filtered.length === 1 ? 'ARTICLE' : 'ARTICLES'}
              </div>
            </div>
          </div>

          {/* Category Tabs Strip */}
          <div style={{ borderTop: '1px solid #F1F5F9' }}>
            <div
              style={{
                maxWidth: 1080,
                margin: '0 auto',
                padding: '0 24px',
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
                      fontFamily: 'JetBrains Mono,monospace',
                      fontSize: 10,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      color: isActive ? '#C47D0E' : '#64748B',
                      fontWeight: isActive ? 700 : 500,
                      borderBottom: isActive ? '2px solid #C47D0E' : '2px solid transparent',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{cat}</span>
                    <span
                      style={{
                        background: isActive ? 'rgba(196,125,14,0.12)' : '#F1F5F9',
                        color: isActive ? '#C47D0E' : '#94A3B8',
                        padding: '1px 6px',
                        borderRadius: 10,
                        fontSize: 9,
                        fontWeight: 600,
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

        {/* ══ ARTICLES CONTENT AREA ═══════════════════════════════════════════ */}
        <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 80px' }}>
          {/* Loading Skeleton */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: '3px solid #E2E8F0',
                  borderTopColor: '#C47D0E',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: '#64748B' }}>
                Fetching published articles…
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '90px 24px',
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                maxWidth: 600,
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(196,125,14,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: '#C47D0E',
                }}
              >
                <BookOpen size={26} />
              </div>
              <h2
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 24,
                  textTransform: 'uppercase',
                  color: '#0F172A',
                  marginBottom: 8,
                }}
              >
                No Matching Articles
              </h2>
              <p
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 15,
                  color: '#64748B',
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                {search
                  ? `We couldn't find any engineering articles matching "${search}".`
                  : `There are currently no articles in the "${activeCategory}" category.`}
              </p>
              <button
                onClick={() => {
                  setSearch('')
                  setActiveCategory('All')
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 20px',
                  background: '#C47D0E',
                  color: '#FFFFFF',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                View All Articles
              </button>
            </div>
          )}

          {/* ══ FEATURED MAGAZINE SPOTLIGHT CARD ══════════════════════════════ */}
          {!loading && featuredArticle && (
            <section style={{ marginBottom: 40 }}>
              <div
                onClick={() => navigate(`/blog/${featuredArticle.slug}`)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 14,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-4px)'
                  el.style.borderColor = '#C47D0E'
                  el.style.boxShadow = '0 16px 40px rgba(196,125,14,0.12)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'none'
                  el.style.borderColor = '#E2E8F0'
                  el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'
                }}
              >
                {/* Featured Cover Image */}
                <div
                  style={{
                    position: 'relative',
                    minHeight: 280,
                    background: '#0F172A',
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
                      transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                    }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.5) 100%)',
                    }}
                  />

                  {/* Featured Badge Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(196,125,14,0.5)',
                      padding: '4px 10px',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      color: '#F59E0B',
                      fontFamily: 'JetBrains Mono,monospace',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                    }}
                  >
                    <Sparkles size={11} /> FEATURED ARTICLE
                  </div>
                </div>

                {/* Featured Card Content */}
                <div
                  style={{
                    padding: 'clamp(24px, 4vw, 36px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  {/* Category & Read Time Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono,monospace',
                        fontSize: 9.5,
                        letterSpacing: '0.15em',
                        color: '#C47D0E',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: 'rgba(196,125,14,0.08)',
                        padding: '3px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {featuredArticle.category || 'ELECTRICAL ENGINEERING'}
                    </span>
                    <span style={{ color: '#CBD5E1' }}>•</span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: 12,
                        color: '#64748B',
                      }}
                    >
                      <Clock size={12} /> {featuredArticle.read_time || 5} min read
                    </span>
                    <span style={{ color: '#CBD5E1' }}>•</span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: 12,
                        color: '#64748B',
                      }}
                    >
                      <Calendar size={12} /> {formatDate(featuredArticle.updated_at || featuredArticle.created_at || '')}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      ...getBlogTitleStyles(featuredArticle.title),
                      fontSize: 'clamp(22px, 3.2vw, 32px)',
                      color: '#0F172A',
                      margin: '0 0 14px',
                    }}
                  >
                    {featuredArticle.title}
                  </h2>

                  {/* Excerpt */}
                  {featuredArticle.excerpt && (
                    <p
                      style={{
                        ...getBlogBodyStyles(featuredArticle.excerpt),
                        fontSize: 15,
                        color: '#475569',
                        margin: '0 0 20px',
                        lineHeight: 1.7,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      } as React.CSSProperties}
                    >
                      {featuredArticle.excerpt}
                    </p>
                  )}

                  {/* Author & Read Action Button */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: 18,
                      borderTop: '1px solid #F1F5F9',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={sahinAvatar}
                        alt="Md Sahin Alom"
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1px solid #E2E8F0',
                        }}
                      />
                      <div>
                        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 13, color: '#0F172A' }}>
                          {featuredArticle.author || 'Md Sahin Alom'}
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: '#64748B' }}>
                          ABC Licensed Electrical Engineer
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#C47D0E',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Read Deep Dive <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══ ARTICLES GRID ═══════════════════════════════════════════════════ */}
          {!loading && gridArticles.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 24,
              }}
            >
              {gridArticles.map(article => (
                <article
                  key={article.id}
                  onClick={() => navigate(`/blog/${article.slug}`)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = 'translateY(-4px)'
                    el.style.borderColor = '#C47D0E'
                    el.style.boxShadow = '0 12px 28px rgba(196,125,14,0.1)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = 'none'
                    el.style.borderColor = '#E2E8F0'
                    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  {/* Article Thumbnail */}
                  <div
                    style={{
                      height: 180,
                      background: '#0F172A',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={article.featured_image || '/img/lighting-design-cover.jpg'}
                      alt={article.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                      }}
                      onMouseEnter={e => {
                        ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'
                      }}
                      onMouseLeave={e => {
                        ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(6px)',
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontFamily: 'JetBrains Mono,monospace',
                        fontSize: 8.5,
                        letterSpacing: '0.12em',
                        color: '#F59E0B',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {article.category || 'ARTICLE'}
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Read time & Date */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 10,
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: 12,
                        color: '#94A3B8',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={11} /> {formatDate(article.updated_at || article.created_at || '')}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} /> {article.read_time || 5} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      style={{
                        ...getBlogTitleStyles(article.title),
                        fontSize: 20,
                        color: '#0F172A',
                        margin: '0 0 10px',
                        lineHeight: 1.35,
                      }}
                    >
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    {article.excerpt && (
                      <p
                        style={{
                          ...getBlogBodyStyles(article.excerpt),
                          fontSize: 13.5,
                          color: '#64748B',
                          margin: '0 0 16px',
                          flex: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.6,
                        } as React.CSSProperties}
                      >
                        {article.excerpt}
                      </p>
                    )}

                    {/* Tags pill */}
                    {article.tags && article.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                        {article.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              fontFamily: 'JetBrains Mono,monospace',
                              fontSize: 8.5,
                              letterSpacing: '0.06em',
                              padding: '2px 6px',
                              background: '#F1F5F9',
                              color: '#475569',
                              borderRadius: 3,
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'auto',
                        paddingTop: 12,
                        borderTop: '1px solid #F1F5F9',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: 11.5,
                          fontWeight: 500,
                          color: '#64748B',
                        }}
                      >
                        By {article.author || 'Md Sahin Alom'}
                      </span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#C47D0E',
                        }}
                      >
                        Read Article <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ══ BOTTOM CTA BANNER ═════════════════════════════════════════════ */}
          <section
            style={{
              marginTop: 64,
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              borderRadius: 14,
              padding: 'clamp(32px, 5vw, 48px)',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 36px rgba(15,23,42,0.15)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                background: 'radial-gradient(circle, rgba(196,125,14,0.3) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 680 }}>
              <div
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: '#F59E0B',
                  marginBottom: 10,
                  textTransform: 'uppercase',
                }}
              >
                ENGINEERING CONSULTATION & PEER REVIEW
              </div>
              <h3
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(26px, 4vw, 38px)',
                  lineHeight: 1.05,
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Have a Complex Power System or Substation Design Project?
              </h3>
              <p
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 15,
                  color: '#94A3B8',
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                Get expert engineering review, BNBC 2020 load calculations, substation SLD verification, or turnkey
                industrial electrical design consulting directly from Md Sahin Alom.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a
                  href="/#contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    background: '#C47D0E',
                    color: '#FFFFFF',
                    borderRadius: 6,
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.background = '#D97706'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.background = '#C47D0E'
                    ;(e.currentTarget as HTMLElement).style.transform = 'none'
                  }}
                >
                  Schedule Engineering Review <ArrowRight size={14} />
                </a>

                <button
                  onClick={() => navigate('/cv')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '12px 20px',
                    background: 'transparent',
                    color: '#E2E8F0',
                    border: '1px solid #475569',
                    borderRadius: 6,
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'
                    ;(e.currentTarget as HTMLElement).style.color = '#C47D0E'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = '#475569'
                    ;(e.currentTarget as HTMLElement).style.color = '#E2E8F0'
                  }}
                >
                  View Professional Dossier
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
