---
name: framer-motion-animations
description: >-
  Advanced Framer Motion and web animation skill providing production-ready spring physics,
  scroll-triggered reveals, layout transitions, gesture controls, and hardware-accelerated micro-interactions.
  Use when creating animations, transitions, modals, parallax effects, or interactive kinetic UI.
---

# Framer Motion & Web Animations Pro Skill

A comprehensive cookbook and architecture reference for crafting fluid, high-performance animations with Framer Motion and modern Web APIs.

---

## 1. Core Physics & Transition Presets

### 1.1 Curated Spring Presets
```tsx
// 1. Snappy & Responsive (Buttons, Dropdowns, Tooltips)
export const springSnappy = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

// 2. Smooth & Elegant (Cards, Modal Entrances, Drawers)
export const springSmooth = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
  mass: 0.8,
}

// 3. Heavy Kinetic (Hero Headlines, Page Transitions)
export const springHeavy = {
  type: 'spring',
  stiffness: 180,
  damping: 22,
  mass: 1.2,
}

// 4. Cubic Bezier Luxury Ease (Alternative to Springs)
export const luxuryEase = {
  duration: 0.7,
  ease: [0.16, 1, 0.3, 1], // Custom snappy exponential ease-out
}
```

---

## 2. Production Component Recipes

### 2.1 Scroll Reveal Wrapper
```tsx
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  const offset = 24
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
      x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### 2.2 Staggered Cascade Container
```tsx
import { motion } from 'framer-motion'

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}
```

### 2.3 Interactive Magnetic Button / Card Hover Lift
```tsx
import { motion } from 'framer-motion'

export function MagneticCard({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </motion.div>
  )
}
```

### 2.4 Animated Modal / Drawer with AnimatePresence
```tsx
import { motion, AnimatePresence } from 'framer-motion'

export function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)', zIndex: 1000
            }}
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', zIndex: 1001,
              maxWidth: 540, width: '90%',
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

---

## 3. Performance & GPU Optimization Best Practices

1. **Hardware Accelerated Properties Only**:
   - Always animate `transform` (`x`, `y`, `scale`, `rotate`) and `opacity`.
   - Never animate `height`, `width`, `top`, `left`, `margin`, or `padding` directly during scroll loops.
2. **Layout Animations**:
   - Use `layout` or `layoutId` props for smooth shared element transitions without manual bounding rect calculations.
3. **Reduced Motion**:
   - Framer Motion automatically respects `useReducedMotion()`. Always provide fallback non-animated or fade-only variants when true.
