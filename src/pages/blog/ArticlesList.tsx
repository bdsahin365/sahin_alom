import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Plus, BookOpen, Clock, Tag, Eye, Pencil, Trash2, Search, Filter, RotateCcw, Loader2 } from 'lucide-react'
import { fetchAllArticles, deleteArticle, getStoredArticles, Article } from '../../lib/articlesService'

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  draft:     { label: 'DRAFT',     bg: '#FEF3C7', color: '#92400E' },
  published: { label: 'PUBLISHED', bg: '#DCFCE7', color: '#15803D' },
  scheduled: { label: 'SCHEDULED', bg: '#EEF2FF', color: '#3730A3' },
}

export default function ArticlesList() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<Article[]>(() => getStoredArticles())
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = async () => {
    setRefreshing(true)
    try {
      const data = await fetchAllArticles()
      if (data && data.length > 0) {
        setArticles(data)
      }
    } catch (err) {
      console.warn('Background articles refresh notice:', err)
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const filtered = articles.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q || a.title?.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'all' || a.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this article? This cannot be undone.')) return
    setDeleting(id)
    await deleteArticle(id)
    setArticles(a => a.filter(x => x.id !== id))
    setDeleting(null)
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
    } catch { return '—' }
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 20, color: '#0F172A', margin: 0 }}>Articles</h2>
            {refreshing && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#C47D0E', fontFamily: 'Outfit,sans-serif', fontWeight: 500 }}>
                <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> Syncing…
              </span>
            )}
          </div>
          <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginTop: 3 }}>
            {articles.length} article{articles.length !== 1 ? 's' : ''} · {articles.filter(a => a.status === 'published').length} published
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => void load()}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, height: 36, padding: '0 12px',
              background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 6, cursor: refreshing ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500, color: '#475569',
              transition: 'all 0.15s',
            }}
            title="Refresh articles from database"
          >
            <RotateCcw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
          <button
            onClick={() => navigate('/admin/articles/new')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 16px',
              background: '#C47D0E', border: 'none', borderRadius: 6, cursor: 'pointer',
              fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FFFFFF',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            <Plus size={14} /> New Article
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles…"
            style={{
              width: '100%', height: 34, padding: '0 12px 0 30px',
              border: '1px solid #E2E8F0', borderRadius: 6,
              fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#0F172A',
              background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        {/* Status filter */}
        {['all', 'draft', 'published', 'scheduled'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              height: 34, padding: '0 12px', border: '1px solid',
              borderColor: filterStatus === s ? '#C47D0E' : '#E2E8F0',
              borderRadius: 6, background: filterStatus === s ? '#FEF3C7' : '#FFFFFF',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.12em',
              color: filterStatus === s ? '#92400E' : '#64748B',
              cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.15s',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Loading (Only when there are literally no articles and actively initial loading) */}
      {loading && articles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontFamily: 'Outfit,sans-serif', fontSize: 13 }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px', color: '#C47D0E' }} />
          Loading articles…
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: 48, height: 48, background: '#F1F5F9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <BookOpen size={22} style={{ color: '#94A3B8' }} />
          </div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 15, color: '#0F172A', marginBottom: 6 }}>
            {search || filterStatus !== 'all' ? 'No articles match your filters' : 'No articles yet'}
          </div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#64748B', marginBottom: 20 }}>
            {search ? 'Try a different search term' : 'Write your first article — click New Article to start.'}
          </div>
          {!search && (
            <button
              onClick={() => navigate('/admin/articles/new')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 16px',
                background: '#C47D0E', border: 'none', borderRadius: 6, cursor: 'pointer',
                fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FFFFFF',
              }}
            >
              <Plus size={13} /> Write first article
            </button>
          )}
        </div>
      )}

      {/* Articles list */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(article => {
            const s = STATUS_STYLE[article.status] || STATUS_STYLE.draft
            return (
              <div
                key={article.id}
                style={{
                  background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8,
                  padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'box-shadow 0.15s',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/admin/articles/${article.id}`)}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
              >
                {/* Featured image thumb */}
                <div style={{ width: 52, height: 36, borderRadius: 5, overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                  {article.featured_image
                    ? <img src={article.featured_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={14} style={{ color: '#CBD5E1' }} /></div>
                  }
                </div>

                {/* Main content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Hind Siliguri', 'Outfit', sans-serif", fontWeight: 600, fontSize: 13, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                      {article.title || <em style={{ color: '#94A3B8' }}>Untitled</em>}
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, letterSpacing: '0.15em', padding: '2px 6px', borderRadius: 3, background: s.bg, color: s.color, flexShrink: 0 }}>
                      {s.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {article.category && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#64748B' }}>
                        <Tag size={9} /> {article.category}
                      </span>
                    )}
                    {article.read_time > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#64748B' }}>
                        <Clock size={9} /> {article.read_time} min read
                      </span>
                    )}
                    <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8' }}>
                      {formatDate(article.updated_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                  {article.status === 'published' && article.slug && (
                    <a
                      href={`/blog/${article.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="View live"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 5, background: 'transparent', color: '#94A3B8', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; (e.currentTarget as HTMLElement).style.color = '#374151' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
                    >
                      <Eye size={14} />
                    </a>
                  )}
                  <button
                    onClick={() => navigate(`/admin/articles/${article.id}`)}
                    title="Edit"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 5, background: 'transparent', color: '#94A3B8', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; (e.currentTarget as HTMLElement).style.color = '#374151' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    disabled={deleting === article.id}
                    title="Delete"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 5, background: 'transparent', color: deleting === article.id ? '#CBD5E1' : '#94A3B8', border: 'none', cursor: deleting === article.id ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { if (deleting !== article.id) { (e.currentTarget as HTMLElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLElement).style.color = '#EF4444' } }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
