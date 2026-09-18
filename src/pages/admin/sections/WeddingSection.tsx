import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Heart,
  Users,
  Eye,
  Search,
  RefreshCw,
  Download,
  Loader2,
  Clock,
  Phone,
  Trash2,
  Image,
  Calendar,
  MapPin,
  Mail,
  HeartHandshake,
  Check,
  Upload,
} from 'lucide-react'
import { useSite } from '../../../context/SiteContext'
import { supabase } from '../../../lib/supabase'
import { DEFAULT_WEDDING_CONFIG } from '../../../wedding/weddingConfig'
import { compressAndConvertToBase64, formatBytes } from '../../../lib/imageUtils'
import {
  Section,
  Grid2,
  Input,
  Textarea,
  Switch,
  Separator,
  Badge,
} from '../components/AdminPrimitives'

export type WeddingRSVP = {
  id: string
  name: string
  phone: string
  event: string
  guests: number
  created_at: string
}

export default function WeddingSection() {
  const { data, updateWedding } = useSite()
  const W = { ...DEFAULT_WEDDING_CONFIG, ...(data.wedding || {}) }
  const [heroUploading, setHeroUploading] = useState(false)
  const [groomUploading, setGroomUploading] = useState(false)
  const [brideUploading, setBrideUploading] = useState(false)
  const [heroMsg, setHeroMsg] = useState<string | null>(null)
  const [groomMsg, setGroomMsg] = useState<string | null>(null)
  const [brideMsg, setBrideMsg] = useState<string | null>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)
  const groomInputRef = useRef<HTMLInputElement>(null)
  const brideInputRef = useRef<HTMLInputElement>(null)

  // ── RSVP Database State ────────────────────────────────────────────────────
  const [rsvps, setRsvps] = useState<WeddingRSVP[]>([])
  const [loadingRsvps, setLoadingRsvps] = useState(true)
  const [rsvpQuery, setRsvpQuery] = useState('')
  const [rsvpFilter, setRsvpFilter] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchRSVPs = useCallback(async () => {
    setLoadingRsvps(true)
    try {
      const records: WeddingRSVP[] = []

      // 1. Try wedding_rsvps table
      try {
        const { data: tableData, error } = await supabase
          .from('wedding_rsvps')
          .select('*')
          .order('created_at', { ascending: false })
        if (!error && tableData) {
          records.push(
            ...tableData.map(r => ({
              id: r.id,
              name: r.name || 'Guest',
              phone: r.phone || '',
              event: r.event || 'All Celebrations',
              guests: Number(r.guests) || 1,
              created_at: r.created_at,
            }))
          )
        }
      } catch {}

      // 2. Also fetch from contact_messages where subject contains [Wedding RSVP]
      try {
        const { data: msgs } = await supabase
          .from('contact_messages')
          .select('*')
          .ilike('subject', '%[Wedding RSVP]%')
          .order('created_at', { ascending: false })

        if (msgs) {
          for (const m of msgs) {
            const phoneMatch =
              m.message?.match(/Phone \/ WhatsApp: (.*)/)?.[1] ||
              (m.email !== 'wedding-guest@sahinalom.com' ? m.email : '') ||
              ''
            const eventMatch = m.message?.match(/Event: (.*)/)?.[1] || 'All Three Celebrations'
            const guestsMatch = m.message?.match(/Attending Guests: (.*)/)?.[1] || '1'
            const isDuplicate = records.some(
              r => r.name.toLowerCase() === m.name?.toLowerCase() && (r.phone === phoneMatch || !phoneMatch)
            )
            if (!isDuplicate) {
              records.push({
                id: m.id,
                name: m.name || 'Guest',
                phone: phoneMatch.trim(),
                event: eventMatch.trim(),
                guests: parseInt(guestsMatch, 10) || 1,
                created_at: m.created_at,
              })
            }
          }
        }
      } catch {}

      setRsvps(records)
    } catch (err) {
      console.warn('RSVP fetch error:', err)
    } finally {
      setLoadingRsvps(false)
    }
  }, [])

  useEffect(() => {
    fetchRSVPs()
  }, [fetchRSVPs])

  const handleDeleteRSVP = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this RSVP?')) return
    setDeletingId(id)
    try {
      await supabase.from('wedding_rsvps').delete().eq('id', id)
      await supabase.from('contact_messages').delete().eq('id', id)
      setRsvps(prev => prev.filter(r => r.id !== id))
    } catch {
      alert('Failed to delete RSVP entry.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleExportCSV = () => {
    if (!rsvps.length) {
      alert('No RSVP submissions to export.')
      return
    }
    const headers = ['Guest Name', 'Phone / WhatsApp', 'Ceremony Event', 'Guests Count', 'Submission Date']
    const rows = rsvps.map(r => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.event || '').replace(/"/g, '""')}"`,
      r.guests || 1,
      `"${new Date(r.created_at).toLocaleString()}"`,
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `wedding-guest-list-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtered RSVPs
  const filteredRSVPs = rsvps.filter(r => {
    const matchesQuery =
      !rsvpQuery.trim() ||
      r.name.toLowerCase().includes(rsvpQuery.toLowerCase()) ||
      r.phone.toLowerCase().includes(rsvpQuery.toLowerCase())
    const matchesEvent =
      rsvpFilter === 'all' || r.event.toLowerCase().includes(rsvpFilter.toLowerCase())
    return matchesQuery && matchesEvent
  })

  const totalGuests = rsvps.reduce((sum, r) => sum + (r.guests || 1), 0)
  const holudGuests = rsvps
    .filter(
      r =>
        r.event.toLowerCase().includes('holud') ||
        r.event.toLowerCase().includes('three') ||
        r.event.toLowerCase().includes('all')
    )
    .reduce((sum, r) => sum + (r.guests || 1), 0)
  const nikahGuests = rsvps
    .filter(
      r =>
        r.event.toLowerCase().includes('nikah') ||
        r.event.toLowerCase().includes('three') ||
        r.event.toLowerCase().includes('all')
    )
    .reduce((sum, r) => sum + (r.guests || 1), 0)
  const walimaGuests = rsvps
    .filter(
      r =>
        r.event.toLowerCase().includes('walima') ||
        r.event.toLowerCase().includes('three') ||
        r.event.toLowerCase().includes('all')
    )
    .reduce((sum, r) => sum + (r.guests || 1), 0)

  const makeFileHandler = (
    field: 'heroImage' | 'groomPhoto' | 'bridePhoto',
    setUploading: (v: boolean) => void,
    setMsg: (v: string | null) => void
  ) => async (file: File) => {
    setUploading(true)
    try {
      const { base64, originalSize, compressedSize } = await compressAndConvertToBase64(file, {
        maxWidth: field === 'heroImage' ? 1400 : 600,
        maxHeight: field === 'heroImage' ? 900 : 800,
        quality: 0.82,
        mimeType: 'image/jpeg',
      })
      updateWedding({ [field]: base64 })
      setMsg(`Saved (${formatBytes(originalSize)} → ${formatBytes(compressedSize)})`)
      setTimeout(() => setMsg(null), 3500)
    } catch {
      setMsg('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const heroHandler = makeFileHandler('heroImage', setHeroUploading, setHeroMsg)
  const groomHandler = makeFileHandler('groomPhoto', setGroomUploading, setGroomMsg)
  const brideHandler = makeFileHandler('bridePhoto', setBrideUploading, setBrideMsg)

  function ImageUploadRow({
    field,
    label,
    uploading,
    msg,
    inputRef,
    onFile,
    aspect,
  }: {
    field: 'heroImage' | 'groomPhoto' | 'bridePhoto'
    label: string
    uploading: boolean
    msg: string | null
    inputRef: React.RefObject<HTMLInputElement | null>
    onFile: (f: File) => void
    aspect?: 'wide' | 'portrait'
  }) {
    return (
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 8 }}>
          {label}
        </label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {W[field] && (
            <div style={{ width: aspect === 'portrait' ? 60 : 100, height: aspect === 'portrait' ? 80 : 62, borderRadius: 6, overflow: 'hidden', border: '1px solid #E2E8F0', flexShrink: 0 }}>
              <img src={W[field]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              ref={inputRef as any}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) onFile(f)
                e.target.value = ''
              }}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 11px',
                  borderRadius: 5,
                  background: '#C47D0E',
                  color: '#fff',
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  border: 'none',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                }}
              >
                {uploading ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={11} />}
                {uploading ? 'Processing…' : 'Upload from device'}
              </button>
              {W[field] && (
                <button
                  type="button"
                  onClick={() => updateWedding({ [field]: '' })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: 11, fontFamily: 'Outfit,sans-serif', fontWeight: 500 }}
                >
                  × Clear
                </button>
              )}
            </div>
            <input
              value={W[field]}
              onChange={e => updateWedding({ [field]: e.target.value })}
              placeholder="Paste image URL…"
              style={{ width: '100%', height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 11, outline: 'none', color: '#374151', boxSizing: 'border-box' }}
            />
            {msg && (
              <span style={{ fontSize: 11, color: '#16A34A', fontFamily: 'Outfit,sans-serif', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                <Check size={11} /> {msg}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Kill Switch Banner */}
      <div style={{ background: '#FFFDF9', border: '1px solid #FED7AA', borderRadius: 10, padding: '18px 20px', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'flex-start', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ width: 40, height: 40, background: '#FEF3C7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#B45309' }}>
          <Heart size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Marriage Invitation Page</span>
            <Badge variant={W.enabled ? 'success' : 'secondary'}>
              {W.enabled ? 'Live & Accepting Guests' : 'Offline / Closed'}
            </Badge>
          </div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginBottom: 14 }}>
            Manage your digital wedding invitation at <code style={{ fontFamily: 'monospace', fontSize: 11, background: '#F1F5F9', padding: '1px 6px', borderRadius: 4 }}>/wedding</code>. When disabled, visitors see a refined invitation closed banner.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingTop: 6, borderTop: '1px solid #F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Switch checked={W.enabled} onChange={v => updateWedding({ enabled: v })} />
              <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 600, color: W.enabled ? '#16A34A' : '#64748B' }}>
                {W.enabled ? 'Invitation page is LIVE' : 'Invitation page is CLOSED'}
              </span>
            </div>
            <a
              href="/wedding"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, background: '#0F172A', color: '#FFFFFF', fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
            >
              <Eye size={13} /> View Invitation Page →
            </a>
          </div>
        </div>
      </div>

      {/* ── 1. RSVP Submissions & Guest List ─────────────────────────────────── */}
      <Section
        title="Guest RSVPs & Attendance"
        description="Live submissions received from the wedding invitation form."
        icon={<Users size={16} />}
        badge={
          <Badge variant="success">
            {rsvps.length} RSVPs · {totalGuests} Total Guests
          </Badge>
        }
        defaultOpen={true}
      >
        {/* Quick Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 16 }}>
          <div style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'Outfit,sans-serif' }}>Total Submissions</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{rsvps.length}</div>
          </div>
          <div style={{ padding: '12px 14px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#92400E', fontFamily: 'Outfit,sans-serif' }}>Attending Guests</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#B45309', marginTop: 2 }}>{totalGuests}</div>
          </div>
          <div style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'Outfit,sans-serif' }}>Gaye Holud</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{holudGuests}</div>
          </div>
          <div style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'Outfit,sans-serif' }}>Nikah Ceremony</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{nikahGuests}</div>
          </div>
          <div style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'Outfit,sans-serif' }}>Walima Reception</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{walimaGuests}</div>
          </div>
        </div>

        {/* Action toolbar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <input
              value={rsvpQuery}
              onChange={e => setRsvpQuery(e.target.value)}
              placeholder="Search guest by name or phone…"
              style={{ width: '100%', height: 34, padding: '0 10px 0 32px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 12, outline: 'none', fontFamily: 'Outfit,sans-serif', boxSizing: 'border-box' }}
            />
            <Search size={13} style={{ position: 'absolute', left: 10, top: 11, color: '#94A3B8' }} />
          </div>

          <select
            value={rsvpFilter}
            onChange={e => setRsvpFilter(e.target.value)}
            style={{ height: 34, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 12, outline: 'none', background: '#FFFFFF', color: '#374151', fontFamily: 'Outfit,sans-serif' }}
          >
            <option value="all">All Ceremonies</option>
            <option value="holud">Gaye Holud</option>
            <option value="nikah">Nikah</option>
            <option value="walima">Walima</option>
          </select>

          <button
            type="button"
            onClick={fetchRSVPs}
            title="Refresh list"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 34, padding: '0 11px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: '#475569', fontFamily: 'Outfit,sans-serif' }}
          >
            <RefreshCw size={12} style={{ animation: loadingRsvps ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 34, padding: '0 12px', background: '#C47D0E', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}
          >
            <Download size={12} /> Export CSV
          </button>
        </div>

        {/* RSVPs Table / List */}
        {loadingRsvps && rsvps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: '#94A3B8', fontSize: 12 }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px', color: '#C47D0E' }} />
            Loading guest list from database…
          </div>
        ) : filteredRSVPs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px', background: '#F8FAFC', borderRadius: 8, border: '1px dashed #E2E8F0' }}>
            <Users size={32} style={{ color: '#CBD5E1', margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A', marginBottom: 2 }}>No RSVP submissions yet</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>When guests RSVP on the wedding page, their names, phone numbers, and attendance details will appear here.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredRSVPs.map(r => {
              const cleanPhone = (r.phone || '').replace(/[^0-9+]/g, '')
              return (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8,
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 160 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                      {r.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A' }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                        <Clock size={10} />
                        {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 9px',
                          background: '#DCFCE7',
                          color: '#15803D',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                        title="Chat on WhatsApp"
                      >
                        <Phone size={10} /> {r.phone}
                      </a>
                    )}

                    <span style={{ padding: '3px 8px', background: '#F1F5F9', color: '#475569', borderRadius: 4, fontSize: 11, fontWeight: 500 }}>
                      {r.event}
                    </span>

                    <span style={{ padding: '3px 8px', background: '#FEF3C7', color: '#92400E', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                      {r.guests} {r.guests === 1 ? 'Guest' : 'Guests'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteRSVP(r.id)}
                      disabled={deletingId === r.id}
                      title="Remove RSVP"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#CBD5E1', borderRadius: 4 }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Section>

      {/* ── 2. Visual Assets ─────────────────────────────────────────────────── */}
      <Section title="Visual Assets" description="Hero background image, groom and bride portrait photos." icon={<Image size={16} />}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <label style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500, color: '#374151' }}>Show couple portrait section on /wedding</label>
          <Switch checked={W.showCouplePhotos} onChange={v => updateWedding({ showCouplePhotos: v })} />
        </div>
        <Separator />
        <ImageUploadRow field="heroImage" label="Hero Background Image (16:9 recommended)" uploading={heroUploading} msg={heroMsg} inputRef={heroInputRef} onFile={heroHandler} aspect="wide" />
        <Separator />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ImageUploadRow field="groomPhoto" label="Groom's Portrait (3:4)" uploading={groomUploading} msg={groomMsg} inputRef={groomInputRef} onFile={groomHandler} aspect="portrait" />
          <ImageUploadRow field="bridePhoto" label="Bride's Portrait (3:4)" uploading={brideUploading} msg={brideMsg} inputRef={brideInputRef} onFile={brideHandler} aspect="portrait" />
        </div>
      </Section>

      {/* ── 3. Couple Details ────────────────────────────────────────────────── */}
      <Section title="Couple Details" description="Names and headline text shown across the page." icon={<Heart size={16} />}>
        <Grid2>
          <Input label="Groom's Short Name" value={W.groomName} onChange={v => updateWedding({ groomName: v })} placeholder="Sahin" />
          <Input label="Groom's Full Name" value={W.groomFullName} onChange={v => updateWedding({ groomFullName: v })} placeholder="Md. Sahin Alom" />
          <Input label="Bride's Short Name" value={W.brideName} onChange={v => updateWedding({ brideName: v })} placeholder="Nusrat" />
          <Input label="Bride's Full Name" value={W.brideFullName} onChange={v => updateWedding({ brideFullName: v })} placeholder="Nusrat Jahan" />
        </Grid2>
        <Input label="Display Name (shown on hero)" value={W.displayName} onChange={v => updateWedding({ displayName: v })} placeholder="Sahin & Nusrat" />
        <Input label="Tagline" value={W.tagline} onChange={v => updateWedding({ tagline: v })} placeholder="A Destined Union" />
        <Input label="Hero Subtitle" value={W.heroSubtitle} onChange={v => updateWedding({ heroSubtitle: v })} />
        <Input label="Loader Tagline (cinematic intro)" value={W.loaderTagline} onChange={v => updateWedding({ loaderTagline: v })} />
      </Section>

      {/* ── 4. Our Story Timeline ────────────────────────────────────────────── */}
      <Section title="Our Story Timeline" description="3 story chapters in the interactive timeline section." icon={<Clock size={16} />} defaultOpen={false}>
        {W.story.map((item, i) => (
          <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 12, color: '#0F172A', marginBottom: 12 }}>Chapter {i + 1}</div>
            <Grid2>
              <Input label="Day #" value={item.day} onChange={v => { const s = [...W.story]; s[i] = { ...s[i], day: v }; updateWedding({ story: s }) }} placeholder="08" />
              <Input label="Full Date Text" value={item.fullDate} onChange={v => { const s = [...W.story]; s[i] = { ...s[i], fullDate: v }; updateWedding({ story: s }) }} placeholder="08 Feb 2026" />
            </Grid2>
            <Input label="Chapter Title" value={item.title} onChange={v => { const s = [...W.story]; s[i] = { ...s[i], title: v }; updateWedding({ story: s }) }} />
            <Textarea label="Chapter Body" value={item.body} onChange={v => { const s = [...W.story]; s[i] = { ...s[i], body: v }; updateWedding({ story: s }) }} rows={3} />
          </div>
        ))}
      </Section>

      {/* ── 5. Events & Ceremonies ───────────────────────────────────────────── */}
      <Section title="Events & Ceremonies" description="Gaye Holud, Nikah, Walima — dates, times, and descriptions." icon={<Calendar size={16} />} defaultOpen={false}>
        {W.events.map((ev, i) => (
          <div key={ev.id} style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 12, color: '#0F172A', marginBottom: 12 }}>{ev.label}</div>
            <Grid2>
              <Input label="English Label" value={ev.label} onChange={v => { const e = [...W.events]; e[i] = { ...e[i], label: v }; updateWedding({ events: e }) }} />
              <Input label="Bengali Label (বাংলা)" value={ev.arabic} onChange={v => { const e = [...W.events]; e[i] = { ...e[i], arabic: v }; updateWedding({ events: e }) }} />
              <Input label="Date" value={ev.date} onChange={v => { const e = [...W.events]; e[i] = { ...e[i], date: v }; updateWedding({ events: e }) }} placeholder="12.02.26" />
              <Input label="Day of Week" value={ev.day} onChange={v => { const e = [...W.events]; e[i] = { ...e[i], day: v }; updateWedding({ events: e }) }} placeholder="Thursday" />
            </Grid2>
            <Input label="Time" value={ev.time} onChange={v => { const e = [...W.events]; e[i] = { ...e[i], time: v }; updateWedding({ events: e }) }} placeholder="4:00 PM onwards" />
            <Textarea label="Description" value={ev.description} onChange={v => { const e = [...W.events]; e[i] = { ...e[i], description: v }; updateWedding({ events: e }) }} rows={2} />
          </div>
        ))}
      </Section>

      {/* ── 6. Venue & Location ──────────────────────────────────────────────── */}
      <Section title="Venue & Directions" description="Location address and Google Maps integration." icon={<MapPin size={16} />} defaultOpen={false}>
        <Input label="Venue Name" value={W.venueName} onChange={v => updateWedding({ venueName: v })} />
        <Input label="Area / District" value={W.venueArea} onChange={v => updateWedding({ venueArea: v })} placeholder="Gazipur, Bangladesh" />
        <Textarea label="Full Address Detail" value={W.venueDetail} onChange={v => updateWedding({ venueDetail: v })} rows={2} />
        <Input label="Google Maps URL" value={W.venueMapsUrl} onChange={v => updateWedding({ venueMapsUrl: v })} placeholder="https://maps.google.com/?q=..." />
      </Section>

      {/* ── 7. RSVP Configuration ────────────────────────────────────────────── */}
      <Section title="RSVP Settings" description="Deadline date, post-RSVP confirmation note, and optional Formspree webhook." icon={<Mail size={16} />} defaultOpen={false}>
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '10px 14px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B' }}>
            RSVP submissions are automatically stored in your Supabase database and displayed in the <strong>Guest RSVPs & Attendance</strong> panel above. You can optionally paste a Formspree ID below to also forward alerts to your email.
          </div>
        </div>
        <Input label="Formspree Form ID (Optional Email Forwarding)" value={W.rsvpFormspreeId} onChange={v => updateWedding({ rsvpFormspreeId: v })} placeholder="xpzgkwqr" />
        <Input label="RSVP Deadline" value={W.rsvpDeadline} onChange={v => updateWedding({ rsvpDeadline: v })} placeholder="January 31, 2026" />
        <Textarea label="Confirmation Note (shown to guest after RSVP submit)" value={W.rsvpConfirmationNote} onChange={v => updateWedding({ rsvpConfirmationNote: v })} rows={2} />
      </Section>

      {/* ── 8. Closing Dua & Blessings ───────────────────────────────────────── */}
      <Section title="Closing Dua & Blessings" description="Arabic dua, translation, and reference at the page footer." icon={<HeartHandshake size={16} />} defaultOpen={false}>
        <Input label="Arabic Dua Text" value={W.closingDua} onChange={v => updateWedding({ closingDua: v })} />
        <Input label="English Translation" value={W.closingDuaTranslation} onChange={v => updateWedding({ closingDuaTranslation: v })} />
        <Input label="Source Reference" value={W.closingDuaSource} onChange={v => updateWedding({ closingDuaSource: v })} placeholder="— Quran 25:74" />
      </Section>
    </div>
  )
}
