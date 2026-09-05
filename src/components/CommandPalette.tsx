import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { 
  Search, X, Zap, Calculator, BookOpen, FileText, User, ArrowUpRight, 
  Phone, MessageSquare, Mail, Sparkles, ChevronRight, Layers, ShieldCheck
} from 'lucide-react'
import { TOOLS } from '../data/tools'
import { INITIAL_ARTICLES } from '../lib/articlesService'
import { siteConfig } from '../config/siteConfig'

type Props = {
  isOpen: boolean
  onClose: () => void
}

type SearchItem = {
  id: string
  title: string
  subtitle: string
  category: 'Tools' | 'Articles' | 'Portfolio' | 'Actions'
  badge?: string
  icon: React.ReactNode
  onSelect: () => void
}

export default function CommandPalette({ isOpen, onClose }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeFilter, setActiveFilter] = useState<'All' | 'Tools' | 'Articles' | 'Portfolio' | 'Actions'>('All')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Build searchable items catalogue
  const allItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = []

    // 1. Engineering Tools
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

    // 2. Blog Articles
    INITIAL_ARTICLES.forEach(art => {
      items.push({
        id: `article-${art.slug}`,
        title: art.title,
        subtitle: `${art.excerpt.slice(0, 75)}... • ${art.read_time} min read`,
        category: 'Articles',
        badge: 'Engineering Journal',
        icon: <BookOpen size={15} className="text-blue-600" />,
        onSelect: () => {
          navigate(`/blog/${art.slug}`)
          onClose()
        }
      })
    })

    // 3. Portfolio Sections
    const sections = [
      { name: 'Core Electrical Expertise', href: '#expertise', desc: 'Substation, Switchgear, BNBC Compliance' },
      { name: 'Featured Engineering Projects', href: '#projects', desc: 'Substations, Industrial Plants, Solar PV' },
      { name: 'Professional Engineering Services', href: '#services', desc: 'Design, Audits, Power Flow Simulation' },
      { name: 'About Md Sahin Alom', href: '#about', desc: 'Credentials, Experience, ABC License' },
      { name: 'Direct Contact & Consultation', href: '#contact', desc: 'Phone, Email, Office, Inquiries' },
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

    // 4. Quick Actions
    items.push(
      {
        id: 'action-whatsapp',
        title: 'Quick WhatsApp Consultation',
        subtitle: 'Chat directly on WhatsApp for engineering inquiries',
        category: 'Actions',
        badge: 'Direct Chat',
        icon: <MessageSquare size={15} className="text-green-600" />,
        onSelect: () => {
          window.open(`https://wa.me/8801700000000?text=${encodeURIComponent('Hello Engr. Sahin Alom, I would like to consult with you regarding an electrical engineering project.')}`, '_blank')
          onClose()
        }
      },
      {
        id: 'action-call',
        title: 'Call Engineering Office',
        subtitle: `Direct line: ${siteConfig.author.phone}`,
        category: 'Actions',
        badge: 'Phone Call',
        icon: <Phone size={15} className="text-amber-600" />,
        onSelect: () => {
          window.location.href = `tel:${siteConfig.author.phone}`
          onClose()
        }
      },
      {
        id: 'action-email',
        title: 'Send Project Email',
        subtitle: `Email: ${siteConfig.author.email}`,
        category: 'Actions',
        badge: 'Email',
        icon: <Mail size={15} className="text-blue-600" />,
        onSelect: () => {
          window.location.href = `mailto:${siteConfig.author.email}?subject=Electrical%20Engineering%20Consultation%20Inquiry`
          onClose()
        }
      }
    )

    return items
  }, [navigate, onClose])

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

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(13, 18, 24, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(16px, 10vh, 80px) 16px',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 640,
          background: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(196, 125, 14, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
          animation: 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            borderBottom: '1px solid #ECE7DE',
            background: '#FAF8F5',
          }}
        >
          <Search size={18} style={{ color: '#C47D0E', flexShrink: 0 }} strokeWidth={2.2} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search 20+ calculators, articles, standards, pages..."
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
                padding: 4,
                display: 'flex',
              }}
            >
              <X size={14} />
            </button>
          )}
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              fontWeight: 700,
              color: '#8A94A6',
              background: '#EAE6DD',
              padding: '2px 7px',
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
            padding: '8px 16px',
            borderBottom: '1px solid #F0ECE4',
            background: '#FFFFFF',
            overflowX: 'auto',
          }}
        >
          {(['All', 'Tools', 'Articles', 'Portfolio', 'Actions'] as const).map(filter => {
            const active = activeFilter === filter
            return (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter)
                  setSelectedIndex(0)
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: '1px solid',
                  borderColor: active ? '#C47D0E' : 'transparent',
                  background: active ? 'rgba(196, 125, 14, 0.1)' : 'transparent',
                  color: active ? '#C47D0E' : '#64748B',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10.5,
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
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
            padding: '8px 0',
            maxHeight: 420,
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
                    padding: '10px 18px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(196, 125, 14, 0.08)' : 'transparent',
                    borderLeft: `3px solid ${isSelected ? '#C47D0E' : 'transparent'}`,
                    transition: 'background 0.1s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                          fontSize: 9,
                          color: '#C47D0E',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        Select <ArrowUpRight size={10} />
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
            padding: '10px 18px',
            borderTop: '1px solid #ECE7DE',
            background: '#FAF8F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            color: '#8A94A6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span><strong style={{ color: '#0D1218' }}>↑↓</strong> Navigate</span>
            <span><strong style={{ color: '#0D1218' }}>↵</strong> Select</span>
            <span><strong style={{ color: '#0D1218' }}>ESC</strong> Close</span>
          </div>
          <span style={{ color: '#C47D0E', fontWeight: 600 }}>
            Md Sahin Alom • Engineering Hub
          </span>
        </div>
      </div>
    </div>
  )
}
