import { useState, useRef, useEffect } from 'react'
import {
  Search, Bell, ExternalLink, Save, Check, Loader2,
  PanelLeftClose, PanelLeftOpen, Menu, User, Settings2,
  LogOut, Shield, ChevronDown, Sparkles, Clock, Mail,
} from 'lucide-react'
import sahinPhoto from '../../img/sahin.png'

interface AdminHeaderProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  onOpenCommandPalette: () => void
  onViewSite: () => void
  onSave: () => void
  isSaving: boolean
  saved: boolean
  lastSaved: string | null
  currentSectionTitle: string
  unreadMessagesCount: number
  recentMessages?: Array<{
    id: string
    name: string
    subject: string
    created_at: string
    read: boolean
  }>
  onNavigateToMessages: () => void
  onNavigateToProfile: () => void
  onLogout: () => void
}

export default function AdminHeader({
  sidebarCollapsed,
  onToggleSidebar,
  onOpenCommandPalette,
  onViewSite,
  onSave,
  isSaving,
  saved,
  lastSaved,
  currentSectionTitle,
  unreadMessagesCount,
  recentMessages = [],
  onNavigateToMessages,
  onNavigateToProfile,
  onLogout,
}: AdminHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      style={{
        height: 56,
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0 clamp(10px, 2vw, 24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        position: 'sticky',
        top: 0,
        zIndex: 900,
      }}
    >
      {/* Left side: Sidebar collapse toggle & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {/* Single unified sidebar toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="admin-collapse-toggle"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            padding: 7,
            borderRadius: 6,
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color = '#0F172A'
            el.style.background = '#F1F5F9'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color = '#64748B'
            el.style.background = '#F8FAFC'
          }}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>

        {/* Breadcrumb path */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <span
            className="admin-breadcrumb-root"
            style={{
              fontFamily: 'Outfit,sans-serif',
              fontSize: 12.5,
              color: '#94A3B8',
              fontWeight: 500,
            }}
          >
            Admin
          </span>
          <span className="admin-breadcrumb-sep" style={{ color: '#CBD5E1', fontSize: 12 }}>/</span>
          <span
            style={{
              fontFamily: 'Outfit,sans-serif',
              fontSize: 13,
              color: '#0F172A',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentSectionTitle}
          </span>
        </div>
      </div>

      {/* Center / Global Search Bar */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: 440 }}>
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="admin-search-trigger"
          style={{
            width: '100%',
            height: 34,
            padding: '0 12px',
            borderRadius: 8,
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            cursor: 'pointer',
            color: '#94A3B8',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = '#CBD5E1'
            el.style.background = '#F1F5F9'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = '#E2E8F0'
            el.style.background = '#F8FAFC'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <Search size={14} style={{ color: '#64748B', flexShrink: 0 }} />
            <span
              style={{
                fontFamily: 'Outfit,sans-serif',
                fontSize: 12,
                color: '#64748B',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Search projects, sections, settings…
            </span>
          </div>

          <kbd
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10.5,
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: 4,
              padding: '1px 6px',
              color: '#64748B',
              flexShrink: 0,
            }}
          >
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right side: Status indicator, Notifications, Save CTA, Profile Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {/* Status Indicator (Saved / Saving / Unsaved) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {isSaving ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#C47D0E' }}>
              <Loader2 size={13} style={{ animation: 'adminSpin 1s linear infinite' }} />
              <span className="admin-status-text" style={{ fontSize: 11.5, color: '#C47D0E', fontWeight: 500 }}>
                Saving…
              </span>
            </div>
          ) : saved ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#16A34A' }}>
              <Check size={13} strokeWidth={2.5} />
              <span className="admin-status-text" style={{ fontSize: 11.5, color: '#16A34A', fontWeight: 500 }}>
                Saved{lastSaved ? ` (${lastSaved})` : ''}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#D97706' }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#F59E0B',
                  display: 'inline-block',
                  animation: 'adminPulseDot 1.8s infinite',
                }}
              />
              <span className="admin-status-text" style={{ fontSize: 11.5, color: '#D97706', fontWeight: 500 }}>
                Unsaved changes
              </span>
            </div>
          )}
        </div>

        {/* Notifications Dropdown Trigger */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(o => !o)}
            title="Notifications & Recent Inquiries"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: notificationsOpen ? '#F1F5F9' : '#FFFFFF',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.15s',
            }}
          >
            <Bell size={15} />
            {unreadMessagesCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  background: '#C47D0E',
                  color: '#FFFFFF',
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: 'Outfit,sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF',
                }}
              >
                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: 42,
                right: 0,
                width: 320,
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                boxShadow: '0 15px 35px -5px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                zIndex: 1100,
                overflow: 'hidden',
                animation: 'adminModalPop 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  background: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                    Notifications
                  </span>
                  {unreadMessagesCount > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 600, background: '#FEF3C7', color: '#92400E', padding: '1px 6px', borderRadius: 4 }}>
                      {unreadMessagesCount} unread
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { onNavigateToMessages(); setNotificationsOpen(false); }}
                  style={{ background: 'none', border: 'none', color: '#C47D0E', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}
                >
                  View All
                </button>
              </div>

              <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                {recentMessages.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94A3B8', fontSize: 12, fontFamily: 'Outfit,sans-serif' }}>
                    No new notifications
                  </div>
                ) : (
                  recentMessages.slice(0, 4).map(msg => (
                    <div
                      key={msg.id}
                      onClick={() => { onNavigateToMessages(); setNotificationsOpen(false); }}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid #F1F5F9',
                        cursor: 'pointer',
                        background: msg.read ? '#FFFFFF' : '#FEF9EE',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F8FAFC')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = msg.read ? '#FFFFFF' : '#FEF9EE')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12.5, fontWeight: 600, color: '#0F172A' }}>
                          {msg.name}
                        </div>
                        <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'Outfit,sans-serif' }}>
                          {msg.created_at ? new Date(msg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recent'}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11.5, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                        {msg.subject || 'Consultation inquiry received'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dedicated Save Changes Button */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || saved}
          title={saved ? 'All changes saved (Ctrl+S)' : 'Save changes to database (Ctrl+S)'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            height: 34,
            padding: '0 14px',
            borderRadius: 8,
            fontFamily: 'Outfit,sans-serif',
            fontWeight: 600,
            fontSize: 12,
            cursor: isSaving || saved ? 'default' : 'pointer',
            transition: 'all 0.18s ease',
            border: saved ? '1px solid #E2E8F0' : 'none',
            background: saved ? '#F8FAFC' : '#C47D0E',
            color: saved ? '#94A3B8' : '#FFFFFF',
            boxShadow: saved ? 'none' : '0 2px 8px rgba(196, 125, 14, 0.28)',
            opacity: isSaving ? 0.75 : 1,
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (!saved && !isSaving) {
              (e.currentTarget as HTMLElement).style.background = '#A86C0C'
            }
          }}
          onMouseLeave={e => {
            if (!saved && !isSaving) {
              (e.currentTarget as HTMLElement).style.background = '#C47D0E'
            }
          }}
        >
          {isSaving ? (
            <>
              <Loader2 size={13} style={{ animation: 'adminSpin 1s linear infinite' }} />
              <span className="btn-save-text">Saving…</span>
            </>
          ) : (
            <>
              <Save size={13} />
              <span className="btn-save-text">{saved ? 'Saved' : 'Save Changes'}</span>
            </>
          )}
        </button>

        {/* Live Preview Button */}
        <button
          type="button"
          onClick={onViewSite}
          title="Open live public portfolio in new tab"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            height: 34,
            padding: '0 11px',
            borderRadius: 8,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            color: '#334155',
            fontFamily: 'Outfit,sans-serif',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = '#CBD5E1'
            el.style.background = '#F8FAFC'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = '#E2E8F0'
            el.style.background = '#FFFFFF'
          }}
        >
          <ExternalLink size={12} />
          <span className="btn-preview-text">Preview</span>
        </button>

        {/* User Profile Avatar with Dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(o => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 2,
              borderRadius: 8,
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={sahinPhoto}
                alt="Md. Sahin Alom"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid #C47D0E',
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
            <ChevronDown size={12} style={{ color: '#94A3B8' }} />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 42,
                right: 0,
                width: 220,
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                boxShadow: '0 15px 35px -5px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                zIndex: 1100,
                overflow: 'hidden',
                animation: 'adminModalPop 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                  Md. Sahin Alom
                </div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#C47D0E', fontWeight: 500, marginTop: 1 }}>
                  Lead Operations Engineer
                </div>
              </div>

              <div style={{ padding: '6px' }}>
                <button
                  type="button"
                  onClick={() => { onNavigateToProfile(); setProfileDropdownOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: 'none',
                    background: 'transparent',
                    color: '#334155',
                    fontSize: 12.5,
                    fontFamily: 'Outfit,sans-serif',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F8FAFC')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <User size={14} style={{ color: '#64748B' }} />
                  <span>Profile & Biodata</span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: 'none',
                    background: 'transparent',
                    color: '#DC2626',
                    fontSize: 12.5,
                    fontFamily: 'Outfit,sans-serif',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginTop: 2,
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#FEE2E2')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
