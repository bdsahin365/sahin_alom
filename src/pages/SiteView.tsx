import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import EngineerNav from '../components/EngineerNav'
import EngineerPortfolio from './EngineerPortfolio'
import PortfolioSkeleton from '../components/PortfolioSkeleton'
import StoryModal, { STORIES } from '../components/StoryModal'
import { useSite } from '../context/SiteContext'
import sahinAvatar from '../img/sahin.png'

export default function SiteView() {
  const { data, loading } = useSite()
  const [menuOpen, setMenuOpen] = useState(false)
  const [storyOpen, setStoryOpen] = useState(false)
  const [storyIndex, setStoryIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') navigate('/admin')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])

  const handleOpenStory = (index = 0) => {
    setStoryIndex(index)
    setStoryOpen(true)
  }

  // Support opening story from search or deep link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const storyIdParam = params.get('story')
    if (storyIdParam && data.shorts) {
      const idx = data.shorts.findIndex(s => s.id === storyIdParam)
      if (idx >= 0) {
        handleOpenStory(idx)
      }
    }

    const openStoryHandler = (e: any) => {
      if (e.detail?.storyId && data.shorts) {
        const idx = data.shorts.findIndex((s: any) => s.id === e.detail.storyId)
        handleOpenStory(idx >= 0 ? idx : 0)
      } else {
        handleOpenStory(e.detail?.index ?? 0)
      }
    }

    window.addEventListener('open-story', openStoryHandler)
    return () => window.removeEventListener('open-story', openStoryHandler)
  }, [data.shorts])

  return (
    <>
      <EngineerNav
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onBiodata={() => navigate('/biodata')}
        onCV={() => navigate('/cv')}
        onOpenStory={handleOpenStory}
      />
      <div style={{ paddingTop: 'var(--nav-h)' }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="portfolio-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <PortfolioSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="portfolio-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <EngineerPortfolio />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Facebook / Instagram Stories Full-Screen Video Modal ── */}
      <StoryModal
        isOpen={storyOpen}
        onClose={() => setStoryOpen(false)}
        initialIndex={storyIndex}
        stories={data.shorts}
      />

      {/* ── Floating Story Bubble (Bottom Left) ── */}
      {!loading && data.showFloatingShortsBubble !== false && (data.shorts || []).filter(s => s.enabled !== false).length > 0 && (
        <motion.button
          onClick={() => handleOpenStory(0)}
          title={`Watch Engineering Video Shorts (${(data.shorts || []).filter(s => s.enabled !== false).length})`}
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ y: -4, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(196, 125, 14, 0.4)',
            borderRadius: 40,
            padding: '6px 14px 6px 6px',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.8)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{
            position: 'relative',
            width: 34,
            height: 34,
            borderRadius: '50%',
            padding: 2,
            background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src={data.engineer.photo || sahinAvatar}
              alt="Shorts"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid #FFFFFF',
              }}
            />
            {/* Live pulsing beacon dot */}
            <span style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: '#22C55E',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 0 6px rgba(34,197,94,0.6)',
            }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 12, color: '#0D1218', lineHeight: 1.1 }}>
              Field Shorts
            </div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: '#C47D0E', fontWeight: 600 }}>
              ▶ {(data.shorts || []).filter(s => s.enabled !== false).length} {((data.shorts || []).filter(s => s.enabled !== false).length) === 1 ? 'Story' : 'Stories'}
            </div>
          </div>
        </motion.button>
      )}
    </>
  )
}
