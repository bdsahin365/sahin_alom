import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, X, Zap, Calculator, BookOpen, Layers,
  Phone, MessageSquare, Mail, ArrowUpRight, Play, FolderOpen
} from 'lucide-react'
import { TOOLS } from '../data/tools'
import { getStoredArticles } from '../lib/articlesService'
import { useSite } from '../context/SiteContext'
import { siteConfig } from '../config/siteConfig'

type Props = {
  isOpen: boolean
  onClose: () => void
}

type SearchItem = {
  id: string
  title: string
  subtitle: string
  category: 'Tools' | 'Articles' | 'Projects' | 'Shorts' | 'Portfolio' | 'Actions'
  badge?: string
  icon: React.ReactNode
  onSelect: () => void
}

export default function CommandPalette({ isOpen, onClose }: Props) {
  const navigate = useNavigate()
  const { data } = useSite()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeFilter, setActiveFilter] = useState<'All' | 'Tools' | 'Articles' | 'Projects' | 'Shorts' | 'Actions'>('All')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Build searchable items catalogue from dynamic context and articles
  const allItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = []

    // 1. Engineering Tools (IEC Calculators)
    TOOLS.forEach(tool => {
      items.push({
        id: `tool-${tool.slug}`,
        title: tool.name,
        subtitle: `${tool.tagline} • ${tool.category}`,
        category: 'Tools',
        badge: tool.category,
        icon: <Calculator size={15} className="text-amber-600" />,
        onSelect: () => {
          navigate(`/tools/${tool.slug}`)
          onClose()
        }
      })
    })

    // 2. Dynamic Articles (from database / local storage)
    const dynamicArticles = getStoredArticles()
    dynamicArticles.forEach(art => {
      items.push({
        id: `article-${art.slug}`,
        title: art.title,
        subtitle: `${(art.excerpt || '').slice(0, 75)}... • ${art.read_time || 5} min read`,
        category: 'Articles',
        badge: art.category || 'Engineering Journal',
        icon: <BookOpen size={15} className="text-blue-600" />,
        onSelect: () => {
          navigate(`/blog/${art.slug}`)
          onClose()
        }
      })
    })

    // 3. Dynamic Projects Portfolio
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach(proj => {
        items.push({
          id: `proj-${proj.id}`,
          title: proj.title,
          subtitle: `${proj.category} • ${proj.capacity || proj.location || 'Engineering Project'}`,
          category: 'Projects',
          badge: proj.category || 'Project',
          icon: <FolderOpen size={15} className="text-amber-600" />,
          onSelect: () => {
            if (window.location.pathname === '/') {
              const el = document.querySelector('#projects')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
              else window.location.hash = '#projects'
            } else {
              navigate('/#projects')
            }
            onClose()
          }
        })
      })
    }

    // 4. Video Shorts & Stories
    if (data.shorts && data.shorts.length > 0) {
      data.shorts.filter(s => s.enabled !== false).forEach(short => {
        items.push({
          id: `short-${short.id}`,
          title: short.title,
          subtitle: `${short.subtitle || 'Video Demonstration'} • ${short.category}`,
          category: 'Shorts',
          badge: short.timestamp || 'Video Short',
          icon: <Play size={15} className="text-rose-500" />,
          onSelect: () => {
            if (window.location.pathname === '/') {
              window.dispatchEvent(new CustomEvent('open-story', { detail: { storyId: short.id } }))
            } else {
              navigate(`/?story=${encodeURIComponent(short.id)}`)
            }
            onClose()
          }
        })
      })
    }

    // 5. Portfolio Sections & Key Pages
    const sections = [
      { name: 'Core Electrical Expertise', href: '#expertise', desc: 'Substation, Switchgear, BNBC Compliance' },
      { name: 'Featured Engineering Projects', href: '#projects', desc: 'Substations, Industrial Plants, Solar PV' },
      { name: 'Professional Engineering Services', href: '#services', desc: 'Design, Audits, Power Flow Simulation' },
      { name: 'About Md Sahin Alom', href: '#about', desc: 'Credentials, Experience, ABC License' },
      { name: 'Schedule Engineering Review', to: '/contact', desc: 'Direct technical consultation booking & inquiries' },
      { name: 'Full Engineering CV / Resume', to: '/cv', desc: 'Career history, certifications, education' },
      { name: 'Personal & Professional Biodata', to: '/biodata', desc: 'Detailed professional profile & background' },
      { name: 'Tools & Calculators Hub', to: '/tools', desc: '20+ IEC standard electrical calculators' },
      { name: 'Technical Blog & Journal', to: '/blog', desc: 'Deep-dive technical guides & BNBC explanations' },
    ]

    sections.forEach(sec => {
      items.push({
        id: `section-${sec.name}`,
        title: sec.name,
        subtitle: sec.desc,
        category: 'Portfolio',
        badge: 'Section',
        icon: <Layers size={15} className="text-emerald-600" />,
        onSelect: () => {
          if (sec.to) {
            navigate(sec.to)
          } else if (sec.href) {
            if (window.location.pathname === '/') {
              const el = document.querySelector(sec.href)
              if (el) el.scrollIntoView({ behavior: 'smooth' })
              else window.location.hash = sec.href
            } else {
              navigate('/' + sec.href)
            }
          }
          onClose()
        }
      })
    })

    // 6. Direct Contact & Quick Actions (Dynamic Engineer Phone / WhatsApp / Email)
    const engPhone = data.engineer?.phone || siteConfig.author.phone
    const engEmail = data.engineer?.email || siteConfig.author.email
    const engWhatsApp = data.engineer?.whatsapp || engPhone.replace(/[^0-9]/g, '')

    items.push(
      {
        id: 'action-whatsapp',
        title: 'Quick WhatsApp Consultation',
        subtitle: `Chat directly on WhatsApp (${engWhatsApp})`,
        category: 'Actions',
        badge: 'Direct Chat',
        icon: <MessageSquare size={15} className="text-green-600" />,
        onSelect: () => {
          const cleanWA = engWhatsApp.startsWith('0') ? '88' + engWhatsApp : engWhatsApp
          window.open(`https://wa.me/${cleanWA}?text=${encodeURIComponent(`Hello Engr. ${data.engineer?.name || 'Sahin Alom'}, I would like to consult with you regarding an electrical engineering project.`)}`, '_blank')
          onClose()
        }
      },
      {
        id: 'action-call',
        title: 'Call Engineering Office',
        subtitle: `Direct line: ${engPhone}`,
        category: 'Actions',
        badge: 'Phone Call',
        icon: <Phone size={15} className="text-amber-600" />,
        onSelect: () => {
          window.location.href = `tel:${engPhone}`
          onClose()
        }
      },
      {
        id: 'action-email',
        title: 'Send Project Email',
        subtitle: `Email: ${engEmail}`,
        category: 'Actions',
        badge: 'Email',
        icon: <Mail size={15} className="text-blue-600" />,
        onSelect: () => {
          window.location.href = `mailto:${engEmail}?subject=Electrical%20Engineering%20Consultation%20Inquiry`
          onClose()
        }
      }
    )

    return items
  }, [navigate, onClose, data])

  // Filter items based on activeFilter and query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allItems.filter(item => {
      const matchFilter = activeFilter === 'All' || item.category === activeFilter
      if (!matchFilter) return false
      if (!q) return true
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      )
    })
  }, [allItems, query, activeFilter])

  // Keyboard navigation inside modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, filteredItems.length - 1)))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].onSelect()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex, onClose])

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 'clamp(12px, 5vh, 64px) 12px',
            overflow: 'hidden',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(13, 18, 24, 0.72)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              maxWidth: 640,
              background: '#FFFFFF',
              borderRadius: 14,
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(196, 125, 14, 0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'min(86dvh, 580px)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header Search Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 18px',
                borderBottom: '1px solid #ECE7DE',
                background: '#FAF8F5',
              }}
            >
              <Search size={19} style={{ color: '#C47D0E', flexShrink: 0 }} strokeWidth={2.2} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search calculators, articles, standards, projects..."
                value={query}
                onChange={e => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#0D1218',
                  outline: 'none',
                  height: 38,
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#8A94A6',
                    padding: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={15} />
                </button>
              )}
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#8A94A6',
                  background: '#EAE6DD',
                  padding: '3px 8px',
                  borderRadius: 4,
                  letterSpacing: '0.05em',
                }}
              >
                ESC
              </span>
            </div>

            {/* Filter Pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderBottom: '1px solid #F0ECE4',
                background: '#FFFFFF',
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {(['All', 'Tools', 'Articles', 'Projects', 'Shorts', 'Actions'] as const).map(filter => {
                const active = activeFilter === filter
                return (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter)
                      setSelectedIndex(0)
                    }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 6,
                      border: '1px solid',
                      borderColor: active ? '#C47D0E' : 'transparent',
                      background: active ? 'rgba(196, 125, 14, 0.12)' : 'transparent',
                      color: active ? '#C47D0E' : '#64748B',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 11,
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                      minHeight: 28,
                    }}
                  >
                    {filter === 'All' ? '✦ All' : filter}
                  </button>
                )
              })}
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '6px 0',
              }}
            >
              {filteredItems.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8A94A6' }}>
                  <Zap size={28} style={{ margin: '0 auto 10px', color: '#C47D0E', opacity: 0.5 }} />
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600, color: '#0D1218' }}>
                    No matches found for "{query}"
                  </p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, marginTop: 4 }}>
                    Try searching for 'voltage drop', 'lighting', 'transformer', 'substation', or 'contact'
                  </p>
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex
                  return (
                    <div
                      key={item.id}
                      data-index={index}
                      onClick={item.onSelect}
                      onMouseEnter={() => setSelectedIndex(index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 16px',
                        minHeight: 48,
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(196, 125, 14, 0.08)' : 'transparent',
                        borderLeft: `3px solid ${isSelected ? '#C47D0E' : 'transparent'}`,
                        transition: 'background 0.1s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            background: isSelected ? '#FFFFFF' : '#FAF8F5',
                            border: '1px solid #ECE7DE',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: isSelected ? '0 2px 6px rgba(196, 125, 14, 0.15)' : 'none',
                          }}
                        >
                          {item.icon}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontFamily: 'Outfit, sans-serif',
                                fontWeight: 600,
                                fontSize: 13.5,
                                color: '#0D1218',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.title}
                            </span>
                            {item.badge && (
                              <span
                                style={{
                                  fontFamily: 'JetBrains Mono, monospace',
                                  fontSize: 9,
                                  fontWeight: 700,
                                  color: '#C47D0E',
                                  background: 'rgba(196, 125, 14, 0.1)',
                                  padding: '1px 6px',
                                  borderRadius: 4,
                                  flexShrink: 0,
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p
                            style={{
                              fontFamily: 'Outfit, sans-serif',
                              fontSize: 11.5,
                              color: '#64748B',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              marginTop: 2,
                            }}
                          >
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        {isSelected && (
                          <span
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: 9.5,
                              color: '#C47D0E',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            Select <ArrowUpRight size={11} />
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer Shortcut Hints */}
            <div
              style={{
                padding: '10px 16px',
                borderTop: '1px solid #ECE7DE',
                background: '#FAF8F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                color: '#8A94A6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span><strong style={{ color: '#0D1218' }}>↑↓</strong> Navigate</span>
                <span><strong style={{ color: '#0D1218' }}>↵</strong> Select</span>
                <span><strong style={{ color: '#0D1218' }}>ESC</strong> Close</span>
              </div>
              <span style={{ color: '#C47D0E', fontWeight: 600 }}>
                Md Sahin Alom • Engineering Hub
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

