import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WeddingConfig } from '../weddingConfig'

interface WLoaderProps { config: WeddingConfig; onComplete: () => void }

export default function WLoader({ config, onComplete }: WLoaderProps) {
  const [phase, setPhase] = useState<'intro' | 'split' | 'done'>('intro')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('split'), 1800)
    const t2 = setTimeout(() => { setPhase('done'); onComplete() }, 2900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div className="w-loader" exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <motion.div className="w-loader__curtain w-loader__curtain--left"
            animate={phase === 'split' ? { x: '-100%' } : { x: '0%' }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }} />
          <motion.div className="w-loader__curtain w-loader__curtain--right"
            animate={phase === 'split' ? { x: '100%' } : { x: '0%' }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }} />
          <motion.div className="w-loader__center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: phase === 'split' ? 0 : 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: phase === 'split' ? 0 : 0.2 }}>
            <motion.div className="w-loader__line" initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ transformOrigin: 'top' }} />
            <motion.div className="w-bismillah" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              {config.bismillah}
            </motion.div>
            <motion.div className="w-loader__tagline" initial={{ opacity: 0, letterSpacing: '0.45em' }} animate={{ opacity: 1, letterSpacing: '0.25em' }} transition={{ duration: 1.1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              {config.loaderTagline}
            </motion.div>
            <motion.div className="w-loader__line" initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ transformOrigin: 'bottom' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
