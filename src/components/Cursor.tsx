import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -100, y: -100 })
  const ringPosRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let isHoveringInteractive = false

    const onMove = (e: MouseEvent) => {
      // Only show on desktop screens
      if (window.innerWidth <= 768) {
        setIsVisible(false)
        document.body.classList.remove('has-custom-cursor')
        return
      }

      posRef.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) {
        setIsVisible(true)
        document.body.classList.add('has-custom-cursor')
      }

      dot.style.opacity = isHoveringInteractive ? '0' : '1'
      ring.style.opacity = '1'
    }

    const onTouchStart = () => {
      setIsVisible(false)
      document.body.classList.remove('has-custom-cursor')
      if (dot) dot.style.opacity = '0'
      if (ring) ring.style.opacity = '0'
    }

    const onMouseLeaveDoc = (e: MouseEvent) => {
      if (!e.relatedTarget && !(e as any).toElement) {
        if (dot) dot.style.opacity = '0'
        if (ring) ring.style.opacity = '0'
      }
    }

    const onEnterLink = () => {
      isHoveringInteractive = true
      if (ring) {
        ring.style.transform = `translate(-50%, -50%) scale(2)`
        ring.style.borderColor = 'var(--accent, #C47D0E)'
        ring.style.backgroundColor = 'rgba(196, 125, 14, 0.15)'
      }
      if (dot) dot.style.opacity = '0'
    }

    const onLeaveLink = () => {
      isHoveringInteractive = false
      if (ring) {
        ring.style.transform = `translate(-50%, -50%) scale(1)`
        ring.style.borderColor = 'var(--accent, #C47D0E)'
        ring.style.backgroundColor = 'transparent'
      }
      if (dot) dot.style.opacity = '1'
    }

    function animate() {
      if (dot) {
        dot.style.left = `${posRef.current.x}px`
        dot.style.top = `${posRef.current.y}px`
      }
      if (ring) {
        ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.18
        ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.18
        ring.style.left = `${ringPosRef.current.x}px`
        ring.style.top = `${ringPosRef.current.y}px`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('mouseleave', onMouseLeaveDoc)

    const interactiveEls = () => document.querySelectorAll('a, button, input, textarea, [data-cursor="pointer"], [role="button"]')
    const addListeners = () => {
      interactiveEls().forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink as EventListener)
        el.removeEventListener('mouseleave', onLeaveLink as EventListener)
        el.addEventListener('mouseenter', onEnterLink as EventListener)
        el.addEventListener('mouseleave', onLeaveLink as EventListener)
      })
    }
    addListeners()
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('mouseleave', onMouseLeaveDoc)
      document.body.classList.remove('has-custom-cursor')
      observer.disconnect()
    }
  }, [isVisible])

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor-element"
        style={{
          position: 'fixed', pointerEvents: 'none', zIndex: 100002,
          width: 6, height: 6, borderRadius: '50%',
          background: '#C47D0E', opacity: 0,
          boxShadow: '0 0 10px rgba(196,125,14,0.9)',
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 0.15s ease',
          top: 0, left: 0,
        }}
      />
      <div
        ref={ringRef}
        className="custom-cursor-element"
        style={{
          position: 'fixed', pointerEvents: 'none', zIndex: 100001,
          width: 36, height: 36, borderRadius: '50%',
          border: '1.5px solid #C47D0E', opacity: 0,
          boxShadow: '0 0 12px rgba(196,125,14,0.25)',
          transform: 'translate(-50%, -50%) scale(1)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s, background-color 0.2s, opacity 0.15s ease',
          top: 0, left: 0,
        }}
      />
    </>
  )
}
