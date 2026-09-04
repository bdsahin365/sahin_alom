import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Clock, Tag, ArrowRight, Search, BookOpen } from 'lucide-react'
import { supabase } from '../lib/supabase'

type Article = {
  id: string
  title: string
  excerpt: string
  slug: string
  category: string
  tags: string[]
  read_time: number
  featured_image: string
  updated_at: string
}

export default function BlogIndex() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    supabase
      .from('articles')
      .select('id,title,excerpt,slug,category,tags,read_time,featured_image,updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .then(({ data }) => { setArticles(data || []); setLoading(false) })
  }, [])

  // Unique categories
  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))]

  const filtered = articles.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q || a.title?.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q)
    const matchCat = activeCategory === 'All' || a.category === activeCategory
    return matchSearch && matchCat
  })

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }
    catch { return '' }
  }

  return (
    <>
      {/* Inline KaTeX CSS */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />

      <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

        {/* Header */}
        <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '48px 0 40px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: '#C47D0E', marginBottom: 12 }}>
              SAHINALOM.COM / BLOG
            </div>
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 'clamp(36px,6vw,64px)', lineHeight: 0.92, letterSpacing: '-0.01em', textTransform: 'uppercase', color: '#0F172A', marginBottom: 16 }}>
              Engineering<br />Articles
            </h1>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 17, color: '#64748B', lineHeight: 1.6, maxWidth: 520, marginBottom: 28 }}>
              Technical writing on electrical engineering, power systems, mathematics, and engineering practice.
            </p>

            {/* Search */}
            <div style={{ position: 'relative', maxWidth: 400 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles…"
                style={{
                  width: '100%', height: 42, padding: '0 16px 0 36px',
                  border: '1px solid #E2E8F0', borderRadius: 8,
                  fontFamily: 'Outfit,sans-serif', fontSize: 14, color: '#0F172A',
                  background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => { e.target.style.borderColor = '#C47D0E' }}
                onBlur={e => { e.target.style.borderColor = '#E2E8F0' }}
              />
            </div>
          </div>
        </header>

        {/* Category filters */}
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 0, overflowX: 'auto' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  height: 44, padding: '0 16px', border: 'none', background: 'transparent',
                  fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.12em',
                  textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap',
                  color: activeCategory === cat ? '#C47D0E' : '#64748B',
                  borderBottom: activeCategory === cat ? '2px solid #C47D0E' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles grid */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>

          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8', fontFamily: 'Outfit,sans-serif', fontSize: 13 }}>
              Loading articles…
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <BookOpen size={36} style={{ color: '#CBD5E1', margin: '0 auto 16px', display: 'block' }} />
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 16, color: '#64748B' }}>
                {search ? `No articles matching "${search}"` : 'No published articles yet.'}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
            {filtered.map((article, i) => (
              <article
                key={article.id}
                onClick={() => navigate(`/blog/${article.slug}`)}
                style={{
                  background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10,
                  overflow: 'hidden', cursor: 'pointer',
                  transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s',
                  display: 'flex', flexDirection: 'column',
                  ...(i === 0 && filtered.length > 1 ? { gridColumn: '1/-1' } : {}),
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-3px)'
                  el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.09)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Featured image */}
                {article.featured_image && (
                  <div style={{ height: i === 0 && filtered.length > 1 ? 260 : 160, overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', display: 'block' }}
                    />
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Category + read time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    {article.category && (
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#C47D0E' }}>
                        {article.category.toUpperCase()}
                      </span>
                    )}
                    {article.category && article.read_time > 0 && <span style={{ color: '#DDD9D0', fontSize: 10 }}>·</span>}
                    {article.read_time > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8' }}>
                        <Clock size={9} /> {article.read_time} min read
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
                    fontSize: i === 0 && filtered.length > 1 ? 28 : 20,
                    lineHeight: 0.95, letterSpacing: '-0.01em', textTransform: 'uppercase',
                    color: '#0F172A', margin: '0 0 10px',
                  }}>
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 14, color: '#64748B', lineHeight: 1.6, margin: '0 0 16px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                      {article.excerpt}
                    </p>
                  )}

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                    <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8' }}>
                      {formatDate(article.updated_at)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600, color: '#C47D0E', letterSpacing: '0.04em' }}>
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
