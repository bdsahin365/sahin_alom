import { Check, AlertTriangle, X, Calendar } from 'lucide-react'

interface PublishDialogProps {
  onClose: () => void
  onPublish: () => void
  onSaveDraft: () => void
  article: {
    title: string
    slug: string
    featuredImage: string
    category: string
    metaTitle: string
    metaDesc: string
    author: string
    status: string
  }
}

export default function PublishDialog({ onClose, onPublish, onSaveDraft, article }: PublishDialogProps) {
  const checks = [
    { label: 'Title',            ok: !!article.title,        value: article.title?.slice(0, 48) || '—', fix: null },
    { label: 'URL Slug',         ok: !!article.slug,         value: article.slug ? `sahinalom.com/blog/${article.slug}` : '—', fix: 'Set slug in SEO tab' },
    { label: 'Featured Image',   ok: !!article.featuredImage, value: article.featuredImage ? 'Set' : 'Not set', fix: 'Add in General tab' },
    { label: 'Category',         ok: !!article.category,     value: article.category || '—', fix: 'Select in General tab' },
    { label: 'SEO Title',        ok: article.metaTitle.length > 20, value: article.metaTitle ? `${article.metaTitle.length}/60 chars` : 'Not set', fix: 'Set in SEO tab' },
    { label: 'Meta Description', ok: article.metaDesc.length > 80, value: article.metaDesc ? `${article.metaDesc.length}/160 chars` : 'Not set', fix: article.metaDesc.length > 0 && article.metaDesc.length <= 80 ? `Too short (${article.metaDesc.length}/160)` : 'Set in SEO tab' },
    { label: 'Author',           ok: !!article.author,       value: article.author || '—', fix: null },
  ]

  const seoScore = checks.filter(c => c.ok).length / checks.length * 100

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 500, padding: 20,
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: 12, width: '100%', maxWidth: 440,
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px 16px' }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 18, color: '#0F172A', margin: 0 }}>
              Ready to Publish?
            </h2>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#64748B', marginTop: 4 }}>
              Pre-flight checklist
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, borderRadius: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* Checklist */}
        <div style={{ padding: '0 24px', marginBottom: 16 }}>
          {checks.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < checks.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
              <div style={{ flexShrink: 0 }}>
                {c.ok
                  ? <Check size={14} style={{ color: '#16A34A' }} />
                  : <AlertTriangle size={14} style={{ color: '#C47D0E' }} />
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500, color: '#374151' }}>{c.label}</span>
                {' — '}
                <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: c.ok ? '#64748B' : '#C47D0E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.fix && !c.ok ? c.fix : c.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* SEO Score */}
        <div style={{ margin: '0 24px 16px', padding: '12px 16px', background: '#FAFAFA', border: '1px solid #F1F5F9', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="19" fill="none" stroke="#E2E8F0" strokeWidth="4" />
              <circle cx="24" cy="24" r="19" fill="none" stroke={seoScore >= 70 ? '#16A34A' : '#C47D0E'} strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 19 * seoScore / 100} ${2 * Math.PI * 19}`}
                strokeLinecap="round" transform="rotate(-90 24 24)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 700, color: seoScore >= 70 ? '#16A34A' : '#C47D0E' }}>
              {Math.round(seoScore)}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.18em', color: '#94A3B8' }}>SEO READINESS</div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 18, color: '#C47D0E', lineHeight: 1.2 }}>
              {Math.round(seoScore)}/100
            </div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: seoScore >= 70 ? '#16A34A' : '#94A3B8', marginTop: 1 }}>
              {seoScore >= 70 ? 'Good to publish' : 'Consider completing checklist'}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: '#F1F5F9', margin: '0 24px' }} />

        {/* Schedule toggle */}
        <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={13} style={{ color: '#94A3B8' }} />
          <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B' }}>Schedule for later — set date in Publishing tab</span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, padding: '0 24px 20px' }}>
          <button
            onClick={onSaveDraft}
            style={{
              flex: 1, height: 36, border: '1px solid #E2E8F0', borderRadius: 6,
              background: 'transparent', cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
              fontSize: 12, fontWeight: 500, color: '#374151', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F8FAFC' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            Save Draft
          </button>
          <button
            onClick={onPublish}
            style={{
              flex: 1, height: 36, border: 'none', borderRadius: 6,
              background: '#C47D0E', cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
              fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: '#FFFFFF', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            Publish Now
          </button>
        </div>
      </div>
    </div>
  )
}
