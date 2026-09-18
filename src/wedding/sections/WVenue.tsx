import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { WeddingConfig } from '../weddingConfig'

interface WVenueProps { config: WeddingConfig }

export default function WVenue({ config }: WVenueProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  const leftVariants = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } } }
  const rightVariants = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const } } }

  return (
    <section className="w-venue w-section" ref={ref}>
      <svg className="w-venue__kantha" viewBox="0 0 400 800" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 12 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <g key={`${row}-${col}`} transform={`translate(${col * 64 + 16}, ${row * 64 + 16})`}>
              <rect x="0" y="0" width="32" height="32" transform="rotate(45 16 16)" stroke="#C9A55A" strokeWidth="0.8" fill="none" opacity="0.5" />
              <circle cx="16" cy="16" r="2" fill="#C9A55A" opacity="0.4" />
            </g>
          ))
        )}
      </svg>

      <div className="w-container">
        <div className="w-venue__inner">
          <motion.div variants={leftVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <div className="w-label" style={{ marginBottom: 24 }}>
              <span className="w-label__text">Venue</span>
              <div className="w-label__line" />
              <span className="w-label__num">05</span>
            </div>

            <h2 className="w-venue__heading">Where<br/>it all<br/>unfolds</h2>

            <p className="w-venue__detail">
              <strong style={{ color: 'var(--w-gold)', fontWeight: 400 }}>{config.venueName}</strong>
              <br />{config.venueDetail}
              <br /><br />
              Nestled among the green fields and ancestral homes of {config.venueArea} — a place where generations have gathered, prayed, and celebrated life.
            </p>

            <a href={config.venueMapsUrl} target="_blank" rel="noopener noreferrer" className="w-venue__map-btn" data-cursor-hover>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              Open in Google Maps
            </a>
          </motion.div>

          <motion.div variants={rightVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <div className="w-venue__map-frame">
              <div className="w-venue__map-overlay" />
              <svg width="100%" height="100%" viewBox="0 0 400 300" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
                <rect width="400" height="300" fill="#1A1714" />
                <g stroke="#2C2925" strokeWidth="1.5">
                  <line x1="200" y1="0" x2="200" y2="300" /><line x1="0" y1="150" x2="400" y2="150" />
                  <line x1="100" y1="0" x2="100" y2="300" /><line x1="300" y1="0" x2="300" y2="300" />
                  <line x1="0" y1="75" x2="400" y2="75" /><line x1="0" y1="225" x2="400" y2="225" />
                </g>
                <line x1="0" y1="150" x2="400" y2="150" stroke="#2A2520" strokeWidth="6" />
                <line x1="200" y1="0" x2="200" y2="300" stroke="#2A2520" strokeWidth="6" />
                <rect x="20" y="20" width="60" height="40" rx="2" fill="#1C2018" opacity="0.7" />
                <rect x="220" y="170" width="80" height="50" rx="2" fill="#1C2018" opacity="0.7" />
              </svg>
              <div className="w-venue__map-pin">
                <motion.div className="w-venue__map-pin-icon"
                  animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                </motion.div>
                <div className="w-venue__map-name">{config.venueArea}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
