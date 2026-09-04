import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Search, X, ArrowUpRight, Zap, Activity, Minus, GitFork, Divide, Waves,
  TrendingUp, TrendingDown, BarChart2, Triangle, ArrowDown, ShieldCheck,
  RefreshCw, Settings, BatteryMedium, Target, Cable } from 'lucide-react'
import { TOOLS, CATEGORIES, type Tool, type ToolCategory } from '../../data/tools'
import EngineerNav from '../../components/EngineerNav'

// ── Icon resolver ─────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Zap, Activity, Minus, GitFork, Divide, Waves, TrendingUp, TrendingDown,
  BarChart2, Triangle, ArrowDown, ShieldCheck, RefreshCw, Settings,
  BatteryMedium, Target, Cable,
}
function ToolIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Comp = ICON_MAP[name] ?? Zap
  return <Comp size={size} strokeWidth={1.5} />
}

// ── Category colour map ───────────────────────────────────────────────────────
const CAT_COLOR: Record<ToolCategory, string> = {
  'Basic Electrical':      '#C47D0E',
  'Power Systems':         '#1E6FD9',
  'Cables & Wiring':       '#16A34A',
  'Protection':            '#DC2626',
  'Motors & Transformers': '#7C3AED',
  'Solar & Backup':        '#D97706',
  'Cost & Estimation':     '#0891B2',
}

// ── Tool Card ─────────────────────────────────────────────────────────────────
function ToolCard({ tool, onClick }: { tool: Tool; onClick: () => void }) {
  const catColor = CAT_COLOR[tool.category] ?? 'var(--accent)'
  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        padding: '20px 20px 16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        outline: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = catColor
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.08)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
      onFocus={e => { e.currentTarget.style.borderColor = catColor }}
      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {/* Popular badge */}
      {tool.popular && (
        <span style={{
          position: 'absolute', top: 12, right: 12,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          background: 'var(--accent-dim)', color: 'var(--accent)',
          padding: '2px 7px', borderRadius: 2,
        }}>Popular</span>
      )}

      {/* Icon */}
      <div style={{
        width: 36, height: 36,
        background: `${catColor}14`,
        border: `1px solid ${catColor}30`,
        borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: catColor,
        flexShrink: 0,
      }}>
        <ToolIcon name={tool.icon} size={16} />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 600,
          fontSize: 14, lineHeight: 1.35, color: 'var(--fg)', marginBottom: 5,
        }}>
          {tool.name}
        </h3>
        <p style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 12.5,
          color: 'var(--fg-dim)', lineHeight: 1.55,
        }}>
          {tool.tagline}
        </p>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: catColor,
        }}>
          {tool.category}
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>
          Open <ArrowUpRight size={9} strokeWidth={2} />
        </span>
      </div>
    </article>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All')
  const [menuOpen, setMenuOpen] = useState(false)

  // SEO
  useEffect(() => {
    const prev = document.title
    document.title = 'Electrical Engineering Tools & Calculators | Md Sahin Alom'
    return () => { document.title = prev }
  }, [])

  // Filter
  const filtered = TOOLS.filter(t => {
    const matchCat  = activeCategory === 'All' || t.category === activeCategory
    const q = query.trim().toLowerCase()
    const matchQ = !q || t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
    return matchCat && matchQ
  })

  const featured = TOOLS.filter(t => t.popular).slice(0, 4)
  const showFeatured = !query && activeCategory === 'All'

  const openTool = (slug: string) => navigate(`/tools/${slug}`)

  return (
    <>
      <EngineerNav
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onBiodata={() => navigate('/biodata')}
        onCV={() => navigate('/cv')}
        onOpenStory={() => {}}
      />

      <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 'var(--nav-h)' }}>

        {/* ── Hero Band ── */}
        <section style={{
          background: 'var(--fg)',
          padding: 'clamp(48px,8vh,88px) var(--px) clamp(40px,6vh,72px)',
        }}>
          <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 24, height: 1, background: 'var(--accent)' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                Engineering Tools
              </span>
            </div>
            <h1 style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800, fontSize: 'clamp(40px,7vw,80px)',
              letterSpacing: '-0.01em', textTransform: 'uppercase',
              color: '#FFFFFF', lineHeight: 0.95, marginBottom: 20,
            }}>
              Electrical<br />Calculators
            </h1>
            <p style={{
              fontFamily: 'Outfit, sans-serif', fontSize: 15,
              color: 'rgba(255,255,255,0.6)', maxWidth: 520, lineHeight: 1.7, marginBottom: 36,
            }}>
              Free, fast, and practical calculators for electrical engineers, students, technicians,
              and contractors — optimised for Bangladesh and IEC standards worldwide.
            </p>

            {/* Search */}
            <div style={{ position: 'relative', maxWidth: 520 }}>
              <Search size={15} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} strokeWidth={1.5} />
              <input
                id="tools-search"
                type="search"
                placeholder="Search: voltage drop, ohm's law, motor…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Search tools"
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 44px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#FFFFFF',
                  fontFamily: 'Outfit, sans-serif', fontSize: 14,
                  borderRadius: 3,
                  outline: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', padding: 2 }}
                >
                  <X size={14} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '48px var(--px) 80px' }}>

          {/* Category Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 48 }}>
            {(['All', ...CATEGORIES] as const).map(cat => {
              const active = activeCategory === cat
              const color = cat === 'All' ? 'var(--accent)' : (CAT_COLOR[cat as ToolCategory] ?? 'var(--accent)')
              return (
                <button
                  key={cat}
                  id={`cat-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '7px 16px',
                    background: active ? color : 'transparent',
                    border: `1px solid ${active ? color : 'var(--border-strong)'}`,
                    color: active ? '#fff' : 'var(--fg-dim)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase',
                    cursor: 'pointer', borderRadius: 2,
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--fg-dim)' } }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Featured Section */}
          {showFeatured && (
            <section style={{ marginBottom: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase' }}>Most Used</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 16,
              }}>
                {featured.map(t => (
                  <ToolCard key={t.slug} tool={t} onClick={() => openTool(t.slug)} />
                ))}
              </div>
            </section>
          )}

          {/* All Tools / Filtered Grid */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--fg-dim)', textTransform: 'uppercase' }}>
                {query ? `Results for "${query}"` : activeCategory === 'All' ? 'All Tools' : activeCategory}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>
                {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: '64px 0', textAlign: 'center' }}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                  No tools found for "{query}"
                </p>
                <button
                  onClick={() => { setQuery(''); setActiveCategory('All') }}
                  style={{
                    marginTop: 20, padding: '10px 20px',
                    background: 'none', border: '1px solid var(--border-strong)',
                    color: 'var(--fg-dim)', cursor: 'pointer',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    transition: 'border-color 0.18s, color 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--fg-dim)' }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 14,
              }}>
                {filtered.map(t => (
                  <ToolCard key={t.slug} tool={t} onClick={() => openTool(t.slug)} />
                ))}
              </div>
            )}
          </section>

          {/* Footer note */}
          <div style={{ marginTop: 64, padding: '24px 0', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--muted)', lineHeight: 1.7, textTransform: 'uppercase' }}>
              All calculators use IEC standards and are optimised for Bangladesh electrical engineering practice (230 V / 400 V, 50 Hz).
              Results are indicative and should be verified by a qualified engineer for safety-critical designs.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
