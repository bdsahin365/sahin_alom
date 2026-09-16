import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import type { WeddingConfig } from '../weddingConfig'

interface WHeroProps { config: WeddingConfig }

export default function WHero({ config }: WHeroProps) {
  const heroRef  = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const rawY    = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const imgY    = useSpring(rawY, { stiffness: 60, damping: 18 })
  const textOp  = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const textY   = useTransform(scrollYProgress, [0, 0.5], [0, -40])
  const smoothTextY = useSpring(textY, { stiffness: 80, damping: 20 })

  const nameChars = config.displayName.split('')

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
  }

  const charVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -15 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="w-hero" ref={heroRef}>
      <motion.div className="w-hero__bg" style={{ y: imgY }}>
        <img
          src={config.heroImage || '/wedding-hero.jpg'}
          alt="Wedding hero"
          className="w-hero__img"
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>

      <div className="w-hero__vignette" />

      <motion.div
        className="w-hero__content"
        style={{ opacity: textOp, y: smoothTextY }}
      >
        <motion.div
          className="w-hero__eyebrow"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {config.tagline} · {config.venueArea} · Feb 2026
        </motion.div>

        <motion.h1
          className="w-hero__name"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label={config.displayName}
          style={{ perspective: 800 }}
        >
          {nameChars.map((char, i) => (
            <motion.span key={i} variants={charVariants} style={{ display: char === ' ' ? 'inline' : 'inline-block' }}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="w-hero__subtitle"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          {config.heroSubtitle}
        </motion.p>
      </motion.div>

      <motion.div
        className="w-hero__scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1 }}
      >
        <span className="w-hero__scroll-text">scroll</span>
        <motion.div
          className="w-hero__scroll-line"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  )
}
