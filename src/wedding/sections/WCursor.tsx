import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Wedding-scoped custom cursor.
 * Renders ONLY within the /wedding route.
 * Adds `cursor: none` to .w-root while mounted.
 */
export default function WCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const ringX   = useMotionValue(-100)
  const ringY   = useMotionValue(-100)

  const smoothX = useSpring(ringX, { stiffness: 120, damping: 18, mass: 0.6 })
  const smoothY = useSpring(ringY, { stiffness: 120, damping: 18, mass: 0.6 })

  const isHovering = useRef(false)

  useEffect(() => {
    // Hide native cursor on .w-root
    const root = document.querySelector('.w-root') as HTMLElement | null
    if (root) root.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      ringX.set(e.clientX)
      ringY.set(e.clientY)
    }

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor-hover]')) {
        isHovering.current = true
      }
    }
    const onLeave = () => { isHovering.current = false }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onEnter)
    window.addEventListener('mouseout', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onEnter)
      window.removeEventListener('mouseout', onLeave)
      if (root) root.style.cursor = ''
    }
  }, [cursorX, cursorY, ringX, ringY])

  // Only show on desktop
  if (typeof window !== 'undefined' && window.innerWidth < 769) return null

  return (
    <>
      {/* Dot — follows cursor instantly */}
      <motion.div
        className="w-cursor"
        style={{ x: cursorX, y: cursorY }}
      >
        <div className="w-cursor__dot" />
      </motion.div>

      {/* Ring — follows with spring lag */}
      <motion.div
        className="w-cursor"
        style={{ x: smoothX, y: smoothY }}
      >
        <motion.div
          className="w-cursor__ring"
          animate={isHovering.current ? 'hover' : 'idle'}
          variants={{
            idle:  { width: 36, height: 36, opacity: 1 },
            hover: { width: 56, height: 56, opacity: 0.8 },
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        />
      </motion.div>
    </>
  )
}
