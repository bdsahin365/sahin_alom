import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { WeddingConfig } from '../weddingConfig'

/**
 * "Meet the Couple" section — editorial side-by-side portrait layout.
 * Shown between Hero and Story when couple photos are configured.
 */

interface WCoupleProps { config: WeddingConfig }

function Portrait({ name, fullName, photo, side, delay }: {
  name: string; fullName: string; photo: string; side: 'left' | 'right'; delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  const dir = side === 'left' ? -30 : 30

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: dir }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
    >
      {/* Portrait frame */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 340,
        aspectRatio: '3/4',
        overflow: 'hidden',
      }}>
        {/* Gold border decoration */}
        <div style={{
          position: 'absolute',
          inset: 0,
          border: '1px solid rgba(201,165,90,0.3)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          inset: 8,
          border: '1px solid rgba(201,165,90,0.12)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {photo ? (
          <img
            src={photo}
            alt={fullName}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'brightness(0.88) saturate(0.85)' }}
          />
        ) : (
          /* Placeholder when no photo uploaded */
          <div style={{
            width: '100%', height: '100%',
            background: 'var(--w-charcoal)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 16,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: '1px solid var(--w-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(201,165,90,0.3)',
              fontSize: 24,
            }}>
              {name.charAt(0)}
            </div>
            <div style={{
              fontFamily: 'var(--w-font-mono)',
              fontSize: 9,
              letterSpacing: '0.18em',
              color: 'rgba(201,165,90,0.3)',
              textTransform: 'uppercase',
            }}>
              Photo coming soon
            </div>
          </div>
        )}
      </div>

      {/* Name label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--w-font-display)',
          fontWeight: 600,
          fontStyle: 'italic',
          fontSize: 'clamp(24px, 3vw, 36px)',
          color: 'var(--w-parchment)',
          letterSpacing: '-0.01em',
          lineHeight: 1,
          marginBottom: 6,
        }}>
          {name}
        </div>
        <div style={{
          fontFamily: 'var(--w-font-mono)',
          fontSize: 9.5,
          letterSpacing: '0.18em',
          color: 'rgba(201,165,90,0.5)',
          textTransform: 'uppercase',
        }}>
          {fullName}
        </div>
      </div>
    </motion.div>
  )
}

export default function WCouple({ config }: WCoupleProps) {
  if (!config.showCouplePhotos && !config.groomPhoto && !config.bridePhoto) return null

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <section className="w-section" style={{ padding: 'clamp(80px, 12vh, 140px) 0', background: 'var(--w-ink)', position: 'relative' }} ref={ref}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 400,
        background: 'radial-gradient(ellipse, rgba(201,165,90,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="w-container">
        {/* Section label */}
        <motion.div
          className="w-label"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="w-label__text">The Couple</span>
          <div className="w-label__line" />
          <span className="w-label__num">02</span>
        </motion.div>

        {/* Portraits grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'clamp(32px, 5vw, 80px)',
          alignItems: 'start',
        }}>
          <Portrait
            name={config.groomName}
            fullName={config.groomFullName}
            photo={config.groomPhoto}
            side="left"
            delay={0.1}
          />

          {/* Divider — center ornament */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            paddingTop: 'clamp(80px, 15%, 140px)',
          }}>
            <div style={{ height: 60, width: 1, background: 'linear-gradient(to bottom, transparent, var(--w-border))' }} />
            <div style={{
              fontFamily: 'var(--w-font-arabic)',
              fontSize: 'clamp(28px, 4vw, 48px)',
              color: 'var(--w-gold)',
              opacity: 0.6,
              lineHeight: 1,
            }}>
              &
            </div>
            <div style={{ height: 60, width: 1, background: 'linear-gradient(to top, transparent, var(--w-border))' }} />
          </div>

          <Portrait
            name={config.brideName}
            fullName={config.brideFullName}
            photo={config.bridePhoto}
            side="right"
            delay={0.2}
          />
        </div>
      </div>
    </section>
  )
}
