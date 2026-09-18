import { ReactNode } from 'react'
import {
  LayoutDashboard, FolderOpen, BookOpen, Inbox,
  Sparkles, User, Award, Zap, Briefcase, GraduationCap,
  Play, Globe, Heart, Download, Upload, LogOut, ChevronRight,
} from 'lucide-react'
import HeaderLogo from '../../components/HeaderLogo'
import sahinPhoto from '../../img/sahin.png'

export type SectionId =
  | 'overview'
  | 'branding'
  | 'shorts'
  | 'articles'
  | 'profile'
  | 'credentials'
  | 'expertise'
  | 'projects'
  | 'services'
  | 'education'
  | 'settings'
  | 'messages'
  | 'wedding'

interface SidebarItem {
  id: SectionId
  label: string
  icon: ReactNode
  badge?: string | number | null
}

interface SidebarGroup {
  category: string
  items: SidebarItem[]
}

interface AdminSidebarProps {
  currentSection: SectionId
  onSelectSection: (id: SectionId) => void
  collapsed: boolean
  onToggleCollapse: () => void
  itemCounts: {
    projects?: number
    articles?: number
    messages?: number
    credentials?: number
    expertise?: number
    services?: number
    education?: number
    shorts?: number
  }
  onExportBackup?: () => void
  onImportBackup?: () => void
  onLogout?: () => void
}

export default function AdminSidebar({
  currentSection,
  onSelectSection,
  collapsed,
  itemCounts,
  onExportBackup,
  onLogout,
}: AdminSidebarProps) {
  const groups: SidebarGroup[] = [
    {
      category: 'Core Operations',
      items: [
        { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
        { id: 'projects', label: 'Projects', icon: <FolderOpen size={16} />, badge: itemCounts.projects },
        { id: 'articles', label: 'Technical Articles', icon: <BookOpen size={16} />, badge: itemCounts.articles },
        { id: 'messages', label: 'Client Inquiries', icon: <Inbox size={16} />, badge: itemCounts.messages },
      ],
    },
    {
      category: 'Identity & Engineering',
      items: [
        { id: 'branding', label: 'Logo & Branding', icon: <Sparkles size={16} /> },
        { id: 'profile', label: 'Profile & Bio', icon: <User size={16} /> },
        { id: 'credentials', label: 'Credentials & Licenses', icon: <Award size={16} />, badge: itemCounts.credentials },
        { id: 'expertise', label: 'Core Expertise', icon: <Zap size={16} />, badge: itemCounts.expertise },
        { id: 'services', label: 'Consulting Services', icon: <Briefcase size={16} />, badge: itemCounts.services },
        { id: 'education', label: 'Education & Career', icon: <GraduationCap size={16} />, badge: itemCounts.education },
        { id: 'shorts', label: 'Field Video Shorts', icon: <Play size={16} />, badge: itemCounts.shorts },
      ],
    },
    {
      category: 'System & Portals',
      items: [
        { id: 'settings', label: 'SEO & Web Analytics', icon: <Globe size={16} /> },
        { id: 'wedding', label: 'Marriage Invitation', icon: <Heart size={16} /> },
      ],
    },
  ]

  return (
    <aside
      className="admin-desktop-sidebar"
      style={{
        width: collapsed ? 64 : 248,
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        background: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 950,
        flexShrink: 0,
      }}
    >
      {/* ── Brand Header (Emblem Icon Only) ─────────────────────────────── */}
      <div
        style={{
          height: 56,
          padding: '0 12px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <HeaderLogo compact={true} showSubtitle={false} />
      </div>

      {/* ── Navigation Items Stream ─────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: collapsed ? '12px 6px' : '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {groups.map((grp, gIdx) => (
          <div key={grp.category || gIdx}>
            {!collapsed && (
              <div
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '4px 10px 6px',
                }}
              >
                {grp.category}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {grp.items.map(item => {
                const isActive = currentSection === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectSection(item.id)}
                    title={collapsed ? item.label : undefined}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      gap: 10,
                      padding: collapsed ? '9px 0' : '8px 12px',
                      borderRadius: 8,
                      border: 'none',
                      background: isActive ? '#FEF3C7' : 'transparent',
                      color: isActive ? '#92400E' : '#475569',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'Outfit,sans-serif',
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      transition: 'all 0.12s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = '#F8FAFC'
                        el.style.color = '#0F172A'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'transparent'
                        el.style.color = '#475569'
                      }
                    }}
                  >
                    <span
                      style={{
                        color: isActive ? '#C47D0E' : '#64748B',
                        display: 'flex',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </span>

                    {!collapsed && (
                      <>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.label}
                        </span>

                        {Boolean(item.badge) && (
                          <span
                            style={{
                              fontFamily: 'JetBrains Mono,monospace',
                              fontSize: 10,
                              fontWeight: 600,
                              padding: '1px 6px',
                              borderRadius: 99,
                              background: isActive ? '#FDE68A' : '#F1F5F9',
                              color: isActive ? '#78350F' : '#64748B',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}

                    {/* Collapsed dot badge */}
                    {collapsed && Boolean(item.badge) && (
                      <span
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 10,
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#C47D0E',
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── User Footer Card ────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid #E2E8F0',
          padding: collapsed ? '12px 6px' : '12px 14px',
          background: '#FAFAFA',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={sahinPhoto}
                alt="Md. Sahin Alom"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid #CBD5E1',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#16A34A',
                  border: '1.5px solid #FFFFFF',
                }}
              />
            </div>

            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: '#0F172A',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Md. Sahin Alom
                </div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#16A34A', fontWeight: 500 }}>
                  Operations Lead
                </div>
              </div>
            )}
          </div>

          {!collapsed && onExportBackup && (
            <button
              type="button"
              onClick={onExportBackup}
              title="Download Full JSON Database Backup"
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = '#C47D0E'
                el.style.borderColor = '#CBD5E1'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = '#64748B'
                el.style.borderColor = '#E2E8F0'
              }}
            >
              <Download size={13} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
