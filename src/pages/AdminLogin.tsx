import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  // Already logged in → skip to dashboard
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data?.session) navigate('/admin', { replace: true })
      })
      .catch(() => {})
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      navigate('/admin', { replace: true })
    }
  }

  const inputBase: React.CSSProperties = {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    fontFamily: 'Outfit,sans-serif', fontSize: 15, color: 'var(--fg)',
    fontWeight: 400,
  }

  const fieldWrap: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '14px 16px',
    border: '1px solid var(--border-strong)',
    background: 'var(--bg)',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', fontFamily: 'Outfit,sans-serif', padding: '24px var(--px)',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{ width: 32, height: 32, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} strokeWidth={2.5} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '0.04em', color: 'var(--fg)', textTransform: 'uppercase' as const }}>
            MSA · Admin
          </span>
        </div>

        {/* Heading */}
        <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 'clamp(36px,8vw,52px)', textTransform: 'uppercase' as const, letterSpacing: '-0.01em', color: 'var(--fg)', margin: '0 0 6px' }}>
          Sign In
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-dim)', fontWeight: 300, margin: '0 0 36px' }}>
          Access your portfolio dashboard
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Email */}
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase' as const, marginBottom: 6 }}>Email</div>
            <div
              style={fieldWrap}
              onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
            >
              <Mail size={14} strokeWidth={1.5} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email" placeholder="your@email.com"
                style={{ ...inputBase, '::placeholder': { color: 'var(--muted)' } } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase' as const, marginBottom: 6 }}>Password</div>
            <div
              style={fieldWrap}
              onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
            >
              <Lock size={14} strokeWidth={1.5} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              <input
                type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password" placeholder="••••••••"
                style={inputBase}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: 0, flexShrink: 0 }}>
                {showPw ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', fontFamily: 'Outfit,sans-serif', fontSize: 13, color: 'var(--red)' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{
              marginTop: 8, padding: '14px 24px',
              background: loading ? 'var(--border-strong)' : 'var(--accent)',
              border: 'none', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit,sans-serif', fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => !loading && ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            {loading ? 'Signing in…' : <><span>Sign in</span><ArrowRight size={15} strokeWidth={2} /></>}
          </button>
        </form>

        {/* Footer note */}
        <p style={{ marginTop: 32, fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, textAlign: 'center' as const }}>
          Md Sahin Alom · Portfolio Admin
        </p>
      </div>
    </div>
  )
}
