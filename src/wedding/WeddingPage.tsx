import { useState, useCallback, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useWeddingConfig } from './useWeddingConfig'
import './wedding.css'

import WLoader  from './sections/WLoader'
import WHero    from './sections/WHero'
import WCouple  from './sections/WCouple'
import WStory   from './sections/WStory'
import WRhythm  from './sections/WRhythm'
import WEvents  from './sections/WEvents'
import WVenue   from './sections/WVenue'
import WRSVP    from './sections/WRSVP'
import WCursor  from './sections/WCursor'

export default function WeddingPage() {
  const { config, loading } = useWeddingConfig()
  const [loaderDone, setLoaderDone] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  // ── Hide scrollbar while on this page ─────────────────────────────────────
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'w-scrollbar-hide'
    style.textContent = `
      ::-webkit-scrollbar { display: none !important; width: 0 !important; }
      html { scrollbar-width: none !important; }
    `
    document.head.appendChild(style)
    return () => { document.getElementById('w-scrollbar-hide')?.remove() }
  }, [])

  const handleLoaderDone = useCallback(() => setLoaderDone(true), [])

  // ── Still fetching from Supabase — show minimal dark screen ───────────────
  if (loading) {
    return (
      <div className="w-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100svh' }}>
        <div style={{ fontFamily: 'serif', fontSize: 48, color: '#C9A55A', opacity: 0.4 }}>﷽</div>
      </div>
    )
  }

  // ── Kill Switch ─────────────────────────────────────────────────────────────
  if (!config.enabled) {
    return (
      <div className="w-root">
        <div className="w-noise-overlay" aria-hidden="true" />
        <main className="w-closed" role="main">
          <div className="w-closed__bismillah">{config.bismillah}</div>
          <h1 className="w-closed__title">The Invitation<br />is Closed</h1>
          <p className="w-closed__body">This invitation is no longer accepting RSVPs. We are grateful for your well-wishes and prayers.</p>
          <a href="/" className="w-closed__link">← Return Home</a>
        </main>
      </div>
    )
  }

  return (
    <div className="w-root" id="wedding-root">
      <title>{`${config.displayName} — Wedding Invitation`}</title>
      <div className="w-noise-overlay" aria-hidden="true" />

      <div className="w-progress" aria-hidden="true">
        <motion.div className="w-progress__bar" style={{ scaleX }} />
      </div>

      <WCursor />
      <WLoader config={config} onComplete={handleLoaderDone} />

      <motion.main
        role="main"
        aria-label={`${config.displayName} Wedding Invitation`}
        initial={{ opacity: 0 }}
        animate={loaderDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <WHero    config={config} />
        <WCouple  config={config} />
        <WStory   config={config} />
        <WRhythm  config={config} />
        <WEvents  config={config} />
        <WVenue   config={config} />
        <WRSVP    config={config} />

        <footer className="w-footer">
          <div className="w-container" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 48, justifyContent: 'center' }}>
              <div style={{ flex: 1, maxWidth: 120, height: 1, background: 'var(--w-border-dim)' }} />
              <div style={{ fontFamily: 'var(--w-font-arabic)', fontSize: 'clamp(20px, 3vw, 32px)', color: 'var(--w-gold)', opacity: 0.45 }}>❋</div>
              <div style={{ flex: 1, maxWidth: 120, height: 1, background: 'var(--w-border-dim)' }} />
            </div>
            <div className="w-footer__dua">{config.closingDua}</div>
            <div className="w-footer__translation">{config.closingDuaTranslation}</div>
            <div className="w-footer__source">{config.closingDuaSource}</div>
            <div className="w-footer__names">{config.displayName}</div>
            <div style={{ marginTop: 48, fontFamily: 'var(--w-font-mono)', fontSize: 9, letterSpacing: '0.16em', color: 'rgba(201,165,90,0.2)', textTransform: 'uppercase' }}>
              February 2026 · {config.venueArea}
            </div>
          </div>
        </footer>
      </motion.main>
    </div>
  )
}
