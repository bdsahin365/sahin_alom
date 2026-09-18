import { useState, useEffect } from 'react'
import { RotateCcw, Loader2, Mail, Trash2, Clock, ChevronRight } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from '../components/AdminPrimitives'

export type Message = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  read: boolean
}

const MSGS_CACHE_KEY = 'msa_contact_msgs_cache'

export default function MessagesSection() {
  const [msgs, setMsgs] = useState<Message[]>(() => {
    try {
      const cached = localStorage.getItem(MSGS_CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {}
    return []
  })
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [open, setOpen] = useState<string | null>(null)

  const loadMessages = async () => {
    setRefreshing(true)
    try {
      const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 3500)
      )
      const fetchPromise = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      const res = (await Promise.race([fetchPromise, timeoutPromise])) as any
      if (res && res.data) {
        setMsgs(res.data)
        try {
          localStorage.setItem(MSGS_CACHE_KEY, JSON.stringify(res.data))
        } catch {}
      }
    } catch (err) {
      console.warn('Supabase contact messages fetch notice:', err)
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadMessages()
  }, [])

  const markRead = async (id: string) => {
    try {
      await supabase.from('contact_messages').update({ read: true }).eq('id', id)
    } catch {}
    setMsgs(prev => {
      const updated = prev.map(m => (m.id === id ? { ...m, read: true } : m))
      try {
        localStorage.setItem(MSGS_CACHE_KEY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const deleteMsg = async (id: string) => {
    if (!window.confirm('Delete this contact message?')) return
    try {
      await supabase.from('contact_messages').delete().eq('id', id)
    } catch {}
    setMsgs(prev => {
      const updated = prev.filter(m => m.id !== id)
      try {
        localStorage.setItem(MSGS_CACHE_KEY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const unread = msgs.filter(m => !m.read).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div>
                <CardTitle>Contact Inquiries & Messages</CardTitle>
                <CardDescription>Direct consultation inquiries and project messages received from your portfolio contact form.</CardDescription>
              </div>
              {unread > 0 && (
                <span style={{ padding: '2px 8px', background: '#C47D0E', color: '#fff', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                  {unread} new
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void loadMessages()}
                disabled={refreshing}
              >
                <RotateCcw size={12} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                {refreshing ? 'Refreshing…' : 'Refresh'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages List */}
      {loading && msgs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontFamily: 'Outfit,sans-serif', fontSize: 13 }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px', color: '#C47D0E' }} />
          Loading messages…
        </div>
      )}

      {!loading && msgs.length === 0 && (
        <Card>
          <CardContent style={{ textAlign: 'center', padding: '48px 20px', color: '#94A3B8' }}>
            <Mail size={36} strokeWidth={1.2} style={{ margin: '0 auto 12px', color: '#C47D0E', opacity: 0.6 }} />
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>
              No messages received yet
            </div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', maxWidth: 360, margin: '0 auto' }}>
              When clients and visitors submit inquiries via the contact form on your website, they will immediately appear here.
            </div>
          </CardContent>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.map(m => (
          <div
            key={m.id}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${!m.read ? '#C47D0E' : '#E2E8F0'}`,
              borderLeft: `3px solid ${!m.read ? '#C47D0E' : '#E2E8F0'}`,
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: open === m.id ? '0 4px 12px rgba(0,0,0,0.04)' : 'none',
            }}
          >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setOpen(open === m.id ? null : m.id)
                  if (!m.read) markRead(m.id)
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minWidth: 0,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: m.read ? 500 : 700, fontSize: 13.5, color: '#0F172A' }}>{m.name}</span>
                    {!m.read && (
                      <span style={{ padding: '1px 6px', background: '#FEF3C7', color: '#92400E', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.subject || 'No subject'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} />
                    {new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </span>
                  <ChevronRight size={14} style={{ color: '#94A3B8', transform: open === m.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </button>

              <button
                type="button"
                onClick={() => deleteMsg(m.id)}
                style={{
                  padding: '0 14px',
                  background: 'none',
                  border: 'none',
                  borderLeft: '1px solid #F1F5F9',
                  cursor: 'pointer',
                  color: '#CBD5E1',
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}
                title="Delete message"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {/* Expanded body */}
            {open === m.id && (
              <div style={{ padding: '0 16px 16px', borderTop: '1px solid #F1F5F9', background: '#FAF8F5' }}>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{ padding: '4px 10px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 11, color: '#475569', fontWeight: 500 }}>
                    <Mail size={11} style={{ display: 'inline', marginRight: 5, color: '#C47D0E' }} />
                    {m.email}
                  </span>
                </div>
                <div style={{ padding: '12px 14px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 6, marginBottom: 12 }}>
                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {m.message}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Engineering Inquiry')}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 14px',
                      background: '#C47D0E',
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 5,
                      fontFamily: 'Outfit,sans-serif',
                    }}
                  >
                    <Mail size={12} /> Reply via email
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
