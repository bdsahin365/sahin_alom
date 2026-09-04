import { useState } from 'react'
import { ChevronDown, User, Tag, Image, Globe, Calendar, Search } from 'lucide-react'

type ArticleStatus = 'draft' | 'published' | 'scheduled'
type SettingsTab = 'general' | 'publishing' | 'seo'

interface ArticleMeta {
  status: ArticleStatus
  author: string
  category: string
  tags: string[]
  featuredImage: string
  publishDate: string
  visibility: 'public' | 'private'
  metaTitle: string
  metaDesc: string
  slug: string
  canonicalUrl: string
}

interface SettingsPanelProps {
  meta: ArticleMeta
  onChange: (patch: Partial<ArticleMeta>) => void
  visible: boolean
  onOpenImageUpload?: () => void
}

const CATEGORIES = ['Engineering', 'Electrical', 'Power Systems', 'Tutorial', 'Research', 'Documentation', 'Project']

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.18em', color: '#C47D0E', marginBottom: 6, textTransform: 'uppercase' }}>
      {children}
    </div>
  )
}
function SField({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: 18 }}>{children}</div>
}
function SInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [focus, setFocus] = useState(false)
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: '100%', height: 32, padding: '0 10px',
        border: `1px solid ${focus ? '#C47D0E' : '#E2E8F0'}`,
        borderRadius: 5, fontFamily: 'Outfit,sans-serif', fontSize: 12,
        color: '#0F172A', background: '#FFFFFF', outline: 'none',
        boxShadow: focus ? '0 0 0 3px rgba(196,125,14,0.08)' : 'none',
        transition: 'all 0.15s',
      }}
    />
  )
}
function STextarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  const [focus, setFocus] = useState(false)
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: '100%', padding: '8px 10px', resize: 'vertical',
        border: `1px solid ${focus ? '#C47D0E' : '#E2E8F0'}`,
        borderRadius: 5, fontFamily: 'Outfit,sans-serif', fontSize: 12,
        color: '#0F172A', background: '#FFFFFF', outline: 'none',
        boxShadow: focus ? '0 0 0 3px rgba(196,125,14,0.08)' : 'none',
        transition: 'all 0.15s', lineHeight: 1.5,
      }}
    />
  )
}

export default function SettingsPanel({ meta, onChange, visible, onOpenImageUpload }: SettingsPanelProps) {
  const [tab, setTab] = useState<SettingsTab>('general')
  const [tagInput, setTagInput] = useState('')

  const addTag = (raw: string) => {
    const vals = raw.split(',').map(t => t.trim()).filter(Boolean)
    onChange({ tags: [...new Set([...meta.tags, ...vals])] })
    setTagInput('')
  }

  const seoScore = (() => {
    let score = 0
    if (meta.metaTitle.length > 20) score += 30
    if (meta.metaDesc.length > 80) score += 30
    if (meta.slug) score += 20
    if (meta.featuredImage) score += 20
    return score
  })()

  if (!visible) return null

  return (
    <aside style={{
      width: 268, flexShrink: 0, background: '#FFFFFF',
      borderLeft: '1px solid #E2E8F0', display: 'flex',
      flexDirection: 'column', overflowY: 'auto',
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', flexShrink: 0 }}>
        {(['general', 'publishing', 'seo'] as SettingsTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, height: 38, border: 'none', background: 'transparent',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.12em',
              textTransform: 'uppercase', cursor: 'pointer',
              color: tab === t ? '#C47D0E' : '#64748B',
              borderBottom: tab === t ? '2px solid #C47D0E' : '2px solid transparent',
              transition: 'all 0.15s', fontWeight: tab === t ? 600 : 400,
            }}
          >
            {t === 'general' ? 'General' : t === 'publishing' ? 'Publish' : 'SEO'}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 16px', overflowY: 'auto', flex: 1 }}>

        {/* ── GENERAL TAB ── */}
        {tab === 'general' && (
          <>
            <SField>
              <SLabel>Status</SLabel>
              <div style={{ position: 'relative' }}>
                <select
                  value={meta.status}
                  onChange={e => onChange({ status: e.target.value as ArticleStatus })}
                  style={{
                    width: '100%', height: 32, padding: '0 28px 0 10px',
                    border: '1px solid #E2E8F0', borderRadius: 5, appearance: 'none',
                    fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#0F172A',
                    background: '#FFFFFF', cursor: 'pointer', outline: 'none',
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
              </div>
            </SField>

            <SField>
              <SLabel>Author</SLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: 5, background: '#FAFAFA' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#C47D0E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={12} style={{ color: '#fff' }} />
                </div>
                <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#0F172A' }}>{meta.author}</span>
              </div>
            </SField>

            <SField>
              <SLabel>Category</SLabel>
              <div style={{ position: 'relative' }}>
                <select
                  value={meta.category}
                  onChange={e => onChange({ category: e.target.value })}
                  style={{
                    width: '100%', height: 32, padding: '0 28px 0 10px',
                    border: '1px solid #E2E8F0', borderRadius: 5, appearance: 'none',
                    fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#0F172A',
                    background: '#FFFFFF', cursor: 'pointer', outline: 'none',
                  }}
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
              </div>
            </SField>

            <SField>
              <SLabel>Tags</SLabel>
              <div
                style={{ border: '1px solid #E2E8F0', borderRadius: 5, padding: '6px 8px', cursor: 'text', minHeight: 38, background: '#FFFFFF' }}
                onClick={() => (document.getElementById('tag-input-blog') as HTMLInputElement)?.focus()}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {meta.tags.map((t, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 6px', background: '#FEF3C7', color: '#92400E', borderRadius: 4, fontSize: 11, fontFamily: 'Outfit,sans-serif', fontWeight: 500 }}>
                      {t}
                      <button onClick={() => onChange({ tags: meta.tags.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B45309', padding: 0, fontSize: 13, lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                  <input
                    id="tag-input-blog"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) }
                      if (e.key === 'Backspace' && !tagInput && meta.tags.length) onChange({ tags: meta.tags.slice(0, -1) })
                    }}
                    placeholder={meta.tags.length ? '' : 'Add tags…'}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 12, fontFamily: 'Outfit,sans-serif', color: '#374151', minWidth: 80, flex: 1 }}
                  />
                </div>
              </div>
              <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, fontFamily: 'Outfit,sans-serif' }}>Enter or comma to add</p>
            </SField>

            <SField>
              <SLabel>Featured Image</SLabel>
              {meta.featuredImage ? (
                <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #E2E8F0', marginBottom: 6, position: 'relative', cursor: 'pointer' }}
                  onClick={() => onOpenImageUpload?.()}
                  title="Click to change image">
                  <img src={meta.featuredImage} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.35)'; (e.currentTarget as HTMLElement).querySelector('.change-label')!.style.opacity = '1' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0)'; (e.currentTarget as HTMLElement).querySelector('.change-label')!.style.opacity = '0' }}>
                    <span className="change-label" style={{ opacity: 0, color: '#fff', fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', gap: 5 }}>↺ Change Image</span>
                  </div>
                </div>
              ) : (
                <div style={{ border: '1px dashed #E2E8F0', borderRadius: 6, padding: '20px 12px', textAlign: 'center', marginBottom: 6, cursor: 'pointer', transition: 'all 0.15s' }}
                  onClick={() => onOpenImageUpload?.()}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'; (e.currentTarget as HTMLElement).style.background = '#FEF9EC' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <Image size={20} style={{ color: '#CBD5E1', margin: '0 auto 6px', display: 'block' }} />
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', fontWeight: 500 }}>Click to upload image</div>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 10, color: '#94A3B8', marginTop: 2 }}>JPG, PNG, WebP · Max 10 MB</div>
                </div>
              )}
              {meta.featuredImage && (
                <button onClick={() => onChange({ featuredImage: '' })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: 11, fontFamily: 'Outfit,sans-serif', fontWeight: 500, padding: 0, marginTop: 2 }}>
                  × Remove image
                </button>
              )}
            </SField>
          </>
        )}

        {/* ── PUBLISHING TAB ── */}
        {tab === 'publishing' && (
          <>
            <SField>
              <SLabel>Publish Date</SLabel>
              <SInput value={meta.publishDate} onChange={v => onChange({ publishDate: v })} placeholder="Publish immediately" />
            </SField>
            <SField>
              <SLabel>Visibility</SLabel>
              <div style={{ position: 'relative' }}>
                <select
                  value={meta.visibility}
                  onChange={e => onChange({ visibility: e.target.value as 'public' | 'private' })}
                  style={{ width: '100%', height: 32, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 5, appearance: 'none', fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#0F172A', background: '#FFFFFF', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
              </div>
            </SField>
            <div style={{ height: 1, background: '#F1F5F9', margin: '8px 0 16px' }} />
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>URL Slug</div>
            <SField>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#64748B', marginBottom: 6 }}>sahinalom.com/blog/</div>
              <SInput value={meta.slug} onChange={v => onChange({ slug: v })} placeholder="my-article-slug" />
            </SField>
          </>
        )}

        {/* ── SEO TAB ── */}
        {tab === 'seo' && (
          <>
            {/* SEO Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: '#FAFAFA', border: '1px solid #F1F5F9', borderRadius: 8, marginBottom: 16 }}>
              <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
                <svg width="44" height="44" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#C47D0E" strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 18 * seoScore / 100} ${2 * Math.PI * 18 * (1 - seoScore / 100)}`}
                    strokeLinecap="round" transform="rotate(-90 22 22)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit,sans-serif', fontSize: 11, fontWeight: 700, color: '#C47D0E' }}>
                  {seoScore}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#94A3B8', marginBottom: 2 }}>SEO SCORE</div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 600, color: seoScore >= 70 ? '#16A34A' : seoScore >= 40 ? '#C47D0E' : '#EF4444' }}>
                  {seoScore >= 70 ? 'Good' : seoScore >= 40 ? 'Needs work' : 'Needs attention'}
                </div>
              </div>
            </div>

            <SField>
              <SLabel>Meta Title</SLabel>
              <SInput value={meta.metaTitle} onChange={v => onChange({ metaTitle: v })} placeholder="Article title for search engines" />
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 10, color: meta.metaTitle.length > 60 ? '#EF4444' : '#94A3B8', marginTop: 3 }}>
                {meta.metaTitle.length}/60 characters
              </div>
            </SField>

            <SField>
              <SLabel>Meta Description</SLabel>
              <STextarea value={meta.metaDesc} onChange={v => onChange({ metaDesc: v })} placeholder="Brief description for search results…" rows={3} />
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 10, color: meta.metaDesc.length > 160 ? '#EF4444' : '#94A3B8', marginTop: 3 }}>
                {meta.metaDesc.length}/160 characters
              </div>
            </SField>

            <SField>
              <SLabel>Canonical URL</SLabel>
              <SInput value={meta.canonicalUrl} onChange={v => onChange({ canonicalUrl: v })} placeholder="https://sahinalom.com/blog/…" />
            </SField>

            {/* Search preview */}
            <SField>
              <SLabel>Search Preview</SLabel>
              <div style={{ padding: '10px', border: '1px solid #E2E8F0', borderRadius: 6, background: '#FAFAFA' }}>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#1A0DAB', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {meta.metaTitle || 'Article title…'}
                </div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#006621', marginBottom: 3 }}>
                  sahinalom.com › blog › {meta.slug || 'article-slug'}
                </div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#545454', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                  {meta.metaDesc || 'Meta description will appear here…'}
                </div>
              </div>
            </SField>
          </>
        )}
      </div>
    </aside>
  )
}
