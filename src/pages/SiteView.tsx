import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import EngineerNav from '../components/EngineerNav'
import EngineerPortfolio from './EngineerPortfolio'
import StoryModal, { STORIES } from '../components/StoryModal'
import sahinAvatar from '../img/sahin.png'

export default function SiteView() {
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
        <EngineerPortfolio />
      </div>

      {/* ── Facebook / Instagram Stories Full-Screen Video Modal ── */}
      <StoryModal
        isOpen={storyOpen}
        onClose={() => setStoryOpen(false)}
        initialIndex={storyIndex}
      />

      {/* ── Floating Story Bubble (Bottom Left) ── */}
      <button
        onClick={() => handleOpenStory(0)}
        title="Watch Engineering Video Shorts (2)"
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
          transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'
          e.currentTarget.style.boxShadow = '0 12px 36px rgba(196,125,14,0.3)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{
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
            src={sahinAvatar}
            alt="Shorts"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid #FFFFFF',
            }}
          />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 12, color: '#0D1218', lineHeight: 1.1 }}>
            Field Shorts
          </div>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: '#C47D0E', fontWeight: 600 }}>
            ▶ 2 Stories
          </div>
        </div>
      </button>
    </>
  )
}
