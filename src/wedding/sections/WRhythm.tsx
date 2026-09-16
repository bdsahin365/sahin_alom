import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { WeddingConfig } from '../weddingConfig'

interface WRhythmProps { config: WeddingConfig }

export default function WRhythm({ config }: WRhythmProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })

  const W_SVG = 700, H_SVG = 100, AMP = 28, FREQ = 0.018

  function buildSinePath(phaseOffset: number): string {
    const pts: string[] = []
    for (let x = 0; x <= W_SVG; x += 3) {
      const y = H_SVG / 2 + AMP * Math.sin(FREQ * x * Math.PI + phaseOffset)
      pts.push(x === 0 ? `M${x},${y}` : `L${x},${y}`)
    }
    return pts.join(' ')
  }

  const wave1 = buildSinePath(0)
  const wave2 = buildSinePath(Math.PI)
  const headlineChars = config.rhythmHeadline.split('')

  return (
    <section className="w-rhythm w-section" ref={ref}>
      <div className="w-rhythm__glow" />
      <div className="w-container">
        <motion.h2 className="w-rhythm__headline" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
          {headlineChars.map((char, i) => (
            <motion.span key={i} style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.035, ease: [0.16, 1, 0.3, 1] }}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p className="w-rhythm__body"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          {config.rhythmBody}
        </motion.p>

        <div className="w-rhythm__svg-wrap">
          <svg viewBox={`0 0 ${W_SVG} ${H_SVG}`} className="w-rhythm__svg" aria-hidden="true">
            <motion.path d={wave1} fill="none" stroke="#C9A55A" strokeWidth="1.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} />
            <motion.path d={wave2} fill="none" stroke="#7B2D3F" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7"
              initial={{ pathLength: 0, opacity: 0 }} animate={isInView ? { pathLength: 1, opacity: 0.7 } : {}}
              transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }} />
            <motion.line x1={W_SVG / 2} y1="0" x2={W_SVG / 2} y2={H_SVG}
              stroke="#C9A55A" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4 4"
              initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 1.4 }} />
            <motion.circle cx={W_SVG / 2} cy={H_SVG / 2} r="4" fill="#C9A55A"
              initial={{ scale: 0, opacity: 0 }} animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.8, type: 'spring', stiffness: 300 }}
              style={{ transformOrigin: `${W_SVG / 2}px ${H_SVG / 2}px` }} />
          </svg>
        </div>
      </div>
    </section>
  )
}
