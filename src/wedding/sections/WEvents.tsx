import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { WeddingConfig } from '../weddingConfig'

function EventCard({ event, index }: { event: WeddingConfig['events'][number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <motion.div ref={ref} className="w-event-card"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}>
      <div className="w-event__num">{String(index + 1).padStart(2, '0')}</div>
      <div>
        <div className="w-event__label">{event.label}</div>
        <div className="w-event__arabic">{event.arabic}</div>
      </div>
      <div className="w-event__rule" />
      <div>
        <div className="w-event__date">{event.date}</div>
        <div className="w-event__day">{event.day}</div>
        <div className="w-event__time" style={{ marginTop: 6 }}>{event.time}</div>
      </div>
      <div className="w-event__rule" />
      <p className="w-event__desc">{event.description}</p>
    </motion.div>
  )
}

interface WEventsProps { config: WeddingConfig }

export default function WEvents({ config }: WEventsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section className="w-events w-section">
      <div className="w-container">
        <motion.div className="w-label" ref={ref}
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <span className="w-label__text">The Celebrations</span>
          <div className="w-label__line" />
          <span className="w-label__num">04</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: 'var(--w-font-display)', fontWeight: 300, fontStyle: 'italic',
            fontSize: 'clamp(44px, 6vw, 90px)', lineHeight: 0.92, letterSpacing: '-0.02em',
            color: 'var(--w-parchment)', marginBottom: 'clamp(50px, 7vh, 80px)' }}>
          Three sacred<br/>occasions
        </motion.h2>

        <div className="w-events__grid">
          {config.events.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ height: 1, width: 40, background: 'var(--w-border)' }} />
          <span style={{ fontFamily: 'var(--w-font-mono)', fontSize: 9.5, letterSpacing: '0.18em', color: 'rgba(201,165,90,0.4)', textTransform: 'uppercase' }}>
            All events · {config.venueName} · {config.venueArea}
          </span>
        </motion.div>
      </div>
    </section>
  )
}
