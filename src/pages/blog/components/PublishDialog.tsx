import { useEffect } from 'react'
import { Check, AlertTriangle, X, Calendar, Rocket } from 'lucide-react'

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const checks = [
    { label: 'Article Title',    ok: !!article.title,        value: article.title?.slice(0, 44) || '—', fix: 'Add a clear title in header' },
    { label: 'URL Slug',         ok: !!article.slug,         value: article.slug ? `sahinalom.com/blog/${article.slug}` : '—', fix: 'Set slug in SEO tab' },
    { label: 'Cover Image',      ok: !!article.featuredImage, value: article.featuredImage ? 'Configured' : 'Not set', fix: 'Add cover in General tab' },
    { label: 'Category',         ok: !!article.category,     value: article.category || '—', fix: 'Select category in General tab' },
    { label: 'SEO Title',        ok: article.metaTitle.length > 20, value: article.metaTitle ? `${article.metaTitle.length}/60 chars` : 'Not set', fix: 'Set meta title in SEO tab' },
    { label: 'Meta Description', ok: article.metaDesc.length > 80, value: article.metaDesc ? `${article.metaDesc.length}/160 chars` : 'Not set', fix: article.metaDesc.length > 0 && article.metaDesc.length <= 80 ? `Too short (${article.metaDesc.length}/160)` : 'Set in SEO tab' },
    { label: 'Author Signature', ok: !!article.author,       value: article.author || '—', fix: null },
  ]

  const seoScore = Math.round((checks.filter(c => c.ok).length / checks.length) * 100)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(11, 17, 24, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          width: '100%',
          maxWidth: 460,
          boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(196,125,14,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'min(92dvh, 620px)',
          animation: 'publishModalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            background: '#FAF8F5',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(196,125,14,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C47D0E',
                border: '1px solid rgba(196,125,14,0.2)',
              }}
            >
              <Rocket size={17} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 16, color: '#0F172A', margin: 0 }}>
                Ready to Publish?
              </h3>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748B', letterSpacing: '0.05em' }}>
                PRE-FLIGHT VERIFICATION
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F1F5F9'
              e.currentTarget.style.color = '#0F172A'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#94A3B8'
            }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* SEO Score Banner */}
          <div
            style={{
              padding: '12px 16px',
              background: '#FAF8F5',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
              <svg width="44" height="44" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="19" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                <circle
                  cx="24"
                  cy="24"
                  r="19"
                  fill="none"
                  stroke={seoScore >= 70 ? '#16A34A' : '#C47D0E'}
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 19 * seoScore / 100} ${2 * Math.PI * 19}`}
                  strokeLinecap="round"
                  transform="rotate(-90 24 24)"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 12,
                  fontWeight: 700,
                  color: seoScore >= 70 ? '#16A34A' : '#C47D0E',
                }}
              >
                {seoScore}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.14em', color: '#64748B', textTransform: 'uppercase' }}>
                SEO READINESS INDEX
              </div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#0F172A', lineHeight: 1.2 }}>
                {seoScore}/100 {seoScore >= 70 ? '— Optimized' : '— Action Suggested'}
              </div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11.5, color: seoScore >= 70 ? '#16A34A' : '#C47D0E', marginTop: 2 }}>
                {seoScore >= 70 ? 'Article meets core publishing criteria.' : 'Resolve yellow items to maximize reach.'}
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {checks.map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  background: c.ok ? '#F8FAFC' : '#FEF9EC',
                  border: `1px solid ${c.ok ? '#F1F5F9' : '#F5E6C8'}`,
                  borderRadius: 8,
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  {c.ok ? (
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  ) : (
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C47D0E' }}>
                      <AlertTriangle size={12} strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12.5, fontWeight: 600, color: '#1E293B' }}>
                      {c.label}
                    </span>
                    <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11.5, color: c.ok ? '#64748B' : '#C47D0E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '50%' }}>
                      {c.fix && !c.ok ? c.fix : c.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Schedule note */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Calendar size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11.5, color: '#64748B' }}>
              Want to publish later? Set publication date in the <strong>Publishing</strong> settings tab.
            </span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            padding: '14px 20px',
            borderTop: '1px solid #F1F5F9',
            background: '#FAF8F5',
            flexShrink: 0,
          }}
        >
          <button
            onClick={onSaveDraft}
            style={{
              flex: 1,
              height: 40,
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              background: '#FFFFFF',
              cursor: 'pointer',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#374151',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F8FAFC'
              e.currentTarget.style.borderColor = '#CBD5E1'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#FFFFFF'
              e.currentTarget.style.borderColor = '#E2E8F0'
            }}
          >
            Save Draft
          </button>
          <button
            onClick={onPublish}
            style={{
              flex: 1.2,
              height: 40,
              border: 'none',
              borderRadius: 8,
              background: '#C47D0E',
              cursor: 'pointer',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(196,125,14,0.25)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Publish Now
          </button>
        </div>
      </div>
      <style>{`
        @keyframes publishModalPop {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

