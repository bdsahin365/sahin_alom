import { useState, useRef, useEffect, type ReactNode, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router'
import {
  LayoutDashboard, User, Award, Zap, FolderOpen,
  Briefcase, GraduationCap, Settings2,
  Plus, Trash2, ChevronUp, ChevronDown, ChevronRight,
  Eye, RotateCcw, Save, Check, Loader2,
  PanelLeftClose, PanelLeftOpen,
  Search, ImageIcon, X, Tag,
  ToggleLeft, ToggleRight,
  AlertTriangle, Globe, Pencil,
  Inbox, LogOut, Mail, Clock, BookOpen, Menu,
} from 'lucide-react'
import ArticlesList from './blog/ArticlesList'
import { supabase } from '../lib/supabase'
import { cn } from '../lib/utils'
import {
  useSite,
  type Credential, type ExpertiseItem, type ServiceItem,
  type EducationItem, type Project,
} from '../context/SiteContext'
import sahinPhoto from '../img/sahin.png'

// ── shadcn-style primitives ──────────────────────────────────────────────────

function Card({ className, children, style }: { className?: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, ...style }}>
      {children}
    </div>
  )
}

function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex flex-col space-y-1.5', className)} style={{ padding: '16px clamp(14px, 3vw, 24px) 12px' }}>{children}</div>
}

function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <h3 className={cn('text-sm font-semibold leading-none tracking-tight', className)} style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 14, color: '#0F172A', letterSpacing: '-0.01em' }}>{children}</h3>
}

function CardDescription({ children }: { children: ReactNode }) {
  return <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginTop: 4 }}>{children}</p>
}

function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('pt-0', className)} style={{ padding: '0 clamp(14px, 3vw, 24px) 20px' }}>{children}</div>
}

function Button({
  children, variant = 'default', size = 'default', className, style, onClick, type = 'button', disabled,
}: {
  children: ReactNode; variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary'
  size?: 'default' | 'sm' | 'icon'; className?: string; style?: React.CSSProperties
  onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean
}) {
  void className
  const base = 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
  const variants = {
    default: 'bg-[#C47D0E] text-white hover:bg-[#A86C0C]',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  }
  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-7 px-3 text-xs',
    icon: 'h-8 w-8',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontWeight: 500,
        fontSize: size === 'sm' ? 12 : 13, cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s', border: 'none',
        ...(size === 'default' ? { height: 36, padding: '0 16px' } : {}),
        ...(size === 'sm' ? { height: 28, padding: '0 10px' } : {}),
        ...(size === 'icon' ? { height: 32, width: 32, padding: 0 } : {}),
        ...(variant === 'default' ? { background: '#C47D0E', color: '#FFFFFF' } : {}),
        ...(variant === 'outline' ? { background: 'transparent', color: '#374151', border: '1px solid #E2E8F0' } : {}),
        ...(variant === 'ghost' ? { background: 'transparent', color: '#374151' } : {}),
        ...(variant === 'secondary' ? { background: '#F1F5F9', color: '#0F172A' } : {}),
        ...(variant === 'destructive' ? { background: '#EF4444', color: '#FFFFFF' } : {}),
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      onMouseEnter={e => {
        if (disabled) return
        const el = e.currentTarget as HTMLElement
        if (variant === 'default') el.style.background = '#A86C0C'
        if (variant === 'outline') el.style.background = '#F8FAFC'
        if (variant === 'ghost') el.style.background = '#F1F5F9'
        if (variant === 'secondary') el.style.background = '#E2E8F0'
        if (variant === 'destructive') el.style.background = '#DC2626'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        if (variant === 'default') el.style.background = '#C47D0E'
        if (variant === 'outline') el.style.background = 'transparent'
        if (variant === 'ghost') el.style.background = 'transparent'
        if (variant === 'secondary') el.style.background = '#F1F5F9'
        if (variant === 'destructive') el.style.background = '#EF4444'
      }}
    >
      {children}
    </button>
  )
}

function Input({
  label, value, onChange, placeholder = '', type = 'text', hint,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; hint?: string
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
      <label style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: '#9CA3AF', fontSize: 11 }}>{hint}</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          height: 36, padding: '0 12px',
          border: `1px solid ${focus ? '#C47D0E' : '#E2E8F0'}`,
          borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 13,
          color: '#0F172A', background: '#FFFFFF', outline: 'none',
          transition: 'border-color 0.15s', width: '100%',
          boxShadow: focus ? '0 0 0 3px rgba(196,125,14,0.1)' : 'none',
        }}
      />
    </div>
  )
}

function Textarea({
  label, value, onChange, placeholder = '', rows = 3, hint,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; rows?: number; hint?: string
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
      <label style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: '#9CA3AF', fontSize: 11 }}>{hint}</span>}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          padding: '8px 12px', resize: 'vertical',
          border: `1px solid ${focus ? '#C47D0E' : '#E2E8F0'}`,
          borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 13,
          color: '#0F172A', background: '#FFFFFF', outline: 'none',
          transition: 'border-color 0.15s', width: '100%', lineHeight: 1.6,
          boxShadow: focus ? '0 0 0 3px rgba(196,125,14,0.1)' : 'none',
        }}
      />
    </div>
  )
}

function Grid2({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '0 16px' }}>{children}</div>
}

function Separator() {
  return <div style={{ height: 1, background: '#F1F5F9', margin: '20px 0' }} />
}

function Badge({ children, variant = 'secondary' }: { children: ReactNode; variant?: 'secondary' | 'outline' | 'success' | 'warning' }) {
  const styles = {
    secondary: { background: '#F1F5F9', color: '#475569' },
    outline:   { background: 'transparent', color: '#64748B', border: '1px solid #E2E8F0' },
    success:   { background: '#DCFCE7', color: '#15803D' },
    warning:   { background: '#FEF3C7', color: '#92400E' },
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 11, fontWeight: 500, ...styles[variant] }}>
      {children}
    </span>
  )
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: checked ? '#C47D0E' : '#E2E8F0',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: checked ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%', background: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </button>
  )
}

// Tag chip editor
function TagChips({ label, tags, onChange }: { label: string; tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const add = (raw: string) => {
    const vals = raw.split(',').map(t => t.trim()).filter(Boolean)
    onChange([...new Set([...tags, ...vals])])
    setInput('')
  }
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>{label}</label>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: 6, cursor: 'text', minHeight: 40, background: '#FFFFFF' }}
      >
        {tags.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: '#FEF3C7', color: '#92400E', borderRadius: 4, fontSize: 11, fontFamily: 'Outfit,sans-serif', fontWeight: 500 }}>
            {t}
            <button onClick={() => onChange(tags.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B45309', padding: 0, display: 'flex', fontSize: 13, lineHeight: 1 }}>×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input) }
            if (e.key === 'Backspace' && !input && tags.length) onChange(tags.slice(0, -1))
          }}
          placeholder={tags.length ? '' : 'Add tags…'}
          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 12, fontFamily: 'Outfit,sans-serif', color: '#374151', minWidth: 100, flex: 1 }}
        />
      </div>
      <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4, fontFamily: 'Outfit,sans-serif' }}>Enter or comma to add · × to remove</p>
    </div>
  )
}

// Unsplash image picker
function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Array<{ id: string; thumb: string; full: string }>>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const FALLBACK = [
    { id: '1', thumb: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&h=130&fit=crop', full: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1400&h=900&fit=crop&auto=format&q=85' },
    { id: '2', thumb: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200&h=130&fit=crop', full: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1400&h=900&fit=crop&auto=format&q=85' },
    { id: '3', thumb: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=130&fit=crop', full: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1400&h=900&fit=crop&auto=format&q=85' },
    { id: '4', thumb: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&h=130&fit=crop', full: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1400&h=900&fit=crop&auto=format&q=85' },
    { id: '5', thumb: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=200&h=130&fit=crop', full: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=1400&h=900&fit=crop&auto=format&q=85' },
    { id: '6', thumb: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=130&fit=crop', full: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1400&h=900&fit=crop&auto=format&q=85' },
  ]

  const search = async () => {
    if (!query.trim()) { setResults(FALLBACK); return }
    setLoading(true)
    try {
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=9&client_id=pPuLbQVRzQ9QoVB7pzWRGSIqoJWmHGoMmr_sVzLwGpU`)
      if (!res.ok) throw new Error()
      const json = await res.json()
      setResults(json.results.map((p: any) => ({
        id: p.id,
        thumb: p.urls.small,
        full: `${p.urls.raw}&w=1400&h=900&fit=crop&auto=format&q=85`,
      })))
    } catch { setResults(FALLBACK) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (open && !results.length) setResults(FALLBACK) }, [open])

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Project Image</label>
      <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
        {value && (
          <div style={{ width: 80, height: 52, borderRadius: 6, overflow: 'hidden', border: '1px solid #E2E8F0', flexShrink: 0 }}>
            <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <input value={value} onChange={e => onChange(e.target.value)} placeholder="Paste image URL or search below…"
            style={{ width: '100%', height: 36, padding: '0 12px', border: '1px solid #E2E8F0', borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#374151' }} />
          <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C47D0E', fontSize: 11, fontFamily: 'Outfit,sans-serif', fontWeight: 600, marginTop: 4, padding: 0 }}>
            {open ? '↑ Close search' : '🔍 Search Unsplash'}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ border: '1px solid #E2E8F0', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="solar farm, substation, wind turbine…"
              style={{ flex: 1, padding: '8px 12px', border: 'none', outline: 'none', fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#374151' }} />
            <button onClick={search} style={{ padding: '0 14px', background: '#C47D0E', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12, fontFamily: 'Outfit,sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
              {loading ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={12} />} Search
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, padding: 2, background: '#F1F5F9' }}>
            {results.map(r => (
              <button key={r.id} onClick={() => { onChange(r.full); setOpen(false) }}
                style={{ padding: 0, border: value === r.full ? '2px solid #C47D0E' : '2px solid transparent', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', background: 'none' }}>
                <img src={r.thumb} alt="" style={{ width: '100%', height: 64, objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Collapsible section
function Section({ title, description, defaultOpen = true, children }: { title: string; description?: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Card style={{ marginBottom: 16 } as any}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px clamp(14px, 3vw, 24px)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{title}</div>
          {description && <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginTop: 2 }}>{description}</div>}
        </div>
        <ChevronDown size={15} style={{ color: '#94A3B8', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ padding: '0 clamp(14px, 3vw, 24px) 20px', borderTop: '1px solid #F1F5F9' }}>
          <div style={{ paddingTop: 16 }}>{children}</div>
        </div>
      )}
    </Card>
  )
}

// List item row (credentials, services, education)
function ItemRow({ label, meta, expanded, onToggle, i, total, onDelete, onMove, children }: {
  label: ReactNode; meta?: string; expanded: boolean; onToggle: () => void
  i: number; total: number; onDelete: () => void; onMove: (d: 'up' | 'down') => void; children: ReactNode
}) {
  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: 6, marginBottom: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #E2E8F0' }}>
          <button onClick={() => i > 0 && onMove('up')} disabled={i === 0} style={{ background: 'none', border: 'none', cursor: i > 0 ? 'pointer' : 'default', color: i > 0 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}><ChevronUp size={11} /></button>
          <button onClick={() => i < total - 1 && onMove('down')} disabled={i >= total - 1} style={{ background: 'none', border: 'none', cursor: i < total - 1 ? 'pointer' : 'default', color: i < total - 1 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}><ChevronDown size={11} /></button>
        </div>
        <button onClick={onToggle} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ flex: 1, fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{label}</span>
          {meta && <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8' }}>{meta}</span>}
          <ChevronDown size={13} style={{ color: '#CBD5E1', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
        </button>
        <button onClick={onDelete} style={{ padding: '0 12px', background: 'none', border: 'none', borderLeft: '1px solid #E2E8F0', cursor: 'pointer', color: '#CBD5E1', height: '100%', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}>
          <Trash2 size={13} />
        </button>
      </div>
      {expanded && <div style={{ padding: '16px 16px 8px', borderTop: '1px solid #F1F5F9', background: '#FFFFFF' }}>{children}</div>}
    </div>
  )
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '10px', background: 'transparent', border: '1px dashed #E2E8F0', borderRadius: 6, color: '#94A3B8', fontSize: 12, fontFamily: 'Outfit,sans-serif', fontWeight: 500, cursor: 'pointer', marginTop: 4, transition: 'all 0.15s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'; (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}>
      <Plus size={13} /> {label}
    </button>
  )
}

// ── Nav items ────────────────────────────────────────────────────────────────
type SectionId = 'overview' | 'profile' | 'credentials' | 'expertise' | 'projects' | 'services' | 'education' | 'settings' | 'messages' | 'articles'

const NAV_ITEMS: { id: SectionId; label: string; icon: ReactNode }[] = [
  { id: 'overview',    label: 'Overview',    icon: <LayoutDashboard size={15} /> },
  { id: 'articles',    label: 'Articles',    icon: <BookOpen size={15} /> },
  { id: 'profile',     label: 'Profile',     icon: <User size={15} /> },
  { id: 'credentials', label: 'Credentials', icon: <Award size={15} /> },
  { id: 'expertise',   label: 'Expertise',   icon: <Zap size={15} /> },
  { id: 'projects',    label: 'Projects',    icon: <FolderOpen size={15} /> },
  { id: 'services',    label: 'Services',    icon: <Briefcase size={15} /> },
  { id: 'education',   label: 'Education',   icon: <GraduationCap size={15} /> },
  { id: 'settings',    label: 'Settings',    icon: <Settings2 size={15} /> },
  { id: 'messages',    label: 'Messages',    icon: <Inbox size={15} /> },
]

// ── Section editors ──────────────────────────────────────────────────────────

function OverviewPanel({ onNavigate }: { onNavigate: (s: SectionId) => void }) {
  const { data, updateEngineer } = useSite()
  const { engineer: E } = data

  const sections = [
    { id: 'profile' as SectionId,     label: 'Profile',     ok: !!(E.name && E.email && E.tagline) },
    { id: 'credentials' as SectionId, label: 'Credentials', ok: data.credentials.length > 0 },
    { id: 'expertise' as SectionId,   label: 'Expertise',   ok: data.expertise.length > 0 },
    { id: 'projects' as SectionId,    label: 'Projects',    ok: data.projects.length > 0 },
    { id: 'services' as SectionId,    label: 'Services',    ok: data.services.length > 0 },
    { id: 'education' as SectionId,   label: 'Education',   ok: data.education.length > 0 },
  ]
  const score = Math.round(sections.filter(s => s.ok).length / sections.length * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero card */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <CardTitle>{E.name || 'Your Name'}</CardTitle>
              <CardDescription>{E.title} · {E.location}</CardDescription>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Switch checked={E.available} onChange={v => updateEngineer({ available: v })} />
              <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: E.available ? '#16A34A' : '#64748B', fontWeight: 500 }}>
                {E.available ? 'Available for work' : 'Not available'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(100px,1fr))', gap: 1, background: '#F1F5F9', borderRadius: 6, overflow: 'hidden' }}>
            {[{ l: 'Experience', v: E.yearsExp }, { l: 'Total Capacity', v: E.projectsMW }, { l: 'Projects', v: E.projectsCount }, { l: 'Clients', v: E.clients }].map(s => (
              <div key={s.l} style={{ padding: '16px', background: '#FFFFFF' }}>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 22, color: '#C47D0E', lineHeight: 1, marginBottom: 4 }}>{s.v}</div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completeness */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardTitle>Content completeness</CardTitle>
            <Badge variant={score === 100 ? 'success' : score >= 60 ? 'warning' : 'secondary'}>{score}%</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ height: 6, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ height: '100%', width: `${score}%`, background: score === 100 ? '#16A34A' : '#C47D0E', borderRadius: 99, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => onNavigate(s.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6, border: '1px solid #F1F5F9', background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F8FAFC')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.ok ? '#16A34A' : '#E2E8F0', flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#374151' }}>{s.label}</span>
                <ChevronRight size={12} style={{ color: '#CBD5E1' }} />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfilePanel() {
  const { data: { engineer: E }, updateEngineer } = useSite()
  const u = (k: keyof typeof E) => (v: string | boolean) => updateEngineer({ [k]: v } as any)
  const updateBio = (i: number, v: string) => { const b = [...E.bio]; b[i] = v; updateEngineer({ bio: b }) }

  return (
    <div>
      <Section title="Profile Photo" description="Your photo shown in the about section, CV, and biodata">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
          <div style={{ width: 80, height: 100, borderRadius: 6, overflow: 'hidden', border: '1px solid #E2E8F0', background: '#F8FAFC', flexShrink: 0 }}>
            {E.photo ? (
              <img src={E.photo} alt={E.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 11 }}>No photo</div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <Input label="Photo URL" value={E.photo || ''} onChange={u('photo') as (v: string) => void} placeholder="Photo image URL or path" />
            <button
              type="button"
              onClick={() => updateEngineer({ photo: sahinPhoto })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C47D0E', fontSize: 12, fontFamily: 'Outfit,sans-serif', fontWeight: 600, marginTop: 4, padding: 0 }}
            >
              ↺ Reset to default photo (sahin.png)
            </button>
          </div>
        </div>
      </Section>

      <Section title="Personal Information" description="Name, contact, and role details">
        <Grid2>
          <Input label="Full Name"    value={E.name}     onChange={u('name') as (v: string) => void} />
          <Input label="Initials"     value={E.initials} onChange={u('initials') as (v: string) => void} />
          <Input label="Job Title"    value={E.title}    onChange={u('title') as (v: string) => void} />
          <Input label="Subtitle"     value={E.subtitle} onChange={u('subtitle') as (v: string) => void} />
          <Input label="Location"     value={E.location} onChange={u('location') as (v: string) => void} />
          <Input label="Email"        value={E.email}    onChange={u('email') as (v: string) => void}    type="email" />
          <Input label="Phone"        value={E.phone}    onChange={u('phone') as (v: string) => void}    type="tel" />
          <Input label="LinkedIn URL" value={E.linkedin} onChange={u('linkedin') as (v: string) => void} />
        </Grid2>
        <Textarea label="Tagline" hint="one sentence, shown in hero" value={E.tagline} onChange={u('tagline') as (v: string) => void} rows={2} />
      </Section>

      <Section title="Key Statistics" description="Numbers shown in the hero section">
        <Grid2>
          <Input label="Years Experience"   value={E.yearsExp}       onChange={u('yearsExp') as (v: string) => void}       placeholder="8+" />
          <Input label="Capacity Delivered" value={E.projectsMW}     onChange={u('projectsMW') as (v: string) => void}     placeholder="15+ MVA" />
          <Input label="Projects Completed" value={E.projectsCount}  onChange={u('projectsCount') as (v: string) => void}  placeholder="40+" />
          <Input label="Clients Served"     value={E.clients}        onChange={u('clients') as (v: string) => void}        placeholder="20+" />
        </Grid2>
      </Section>

      <Section title="Biography" description={`${E.bio.length} paragraph${E.bio.length !== 1 ? 's' : ''}`}>
        {E.bio.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Textarea label={`Paragraph ${i + 1}`} value={p} onChange={v => updateBio(i, v)} rows={3} />
            </div>
            <button onClick={() => updateEngineer({ bio: E.bio.filter((_, j) => j !== i) })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', marginTop: 22, padding: 6, transition: 'color 0.15s', borderRadius: 4 }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <AddButton label="Add paragraph" onClick={() => updateEngineer({ bio: [...E.bio, ''] })} />
      </Section>

      <Section title="Availability">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch checked={E.available} onChange={v => updateEngineer({ available: v })} />
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 500, fontSize: 13, color: '#1E293B' }}>Available for new projects</div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginTop: 2 }}>Shows a green indicator in the hero section when enabled</div>
          </div>
        </div>
      </Section>
    </div>
  )
}

function CredentialsPanel() {
  const { data: { credentials: creds }, updateCredentials } = useSite()
  const [exp, setExp] = useState<number | null>(null)
  const upd  = (i: number, p: Partial<Credential>) => updateCredentials(creds.map((c, j) => j === i ? { ...c, ...p } : c))
  const move = (i: number, d: 'up' | 'down') => { const n = [...creds]; [n[i], n[i + (d === 'up' ? -1 : 1)]] = [n[i + (d === 'up' ? -1 : 1)], n[i]]; updateCredentials(n) }

  return (
    <Section title="Credentials & Certifications" description="Shown in the marquee strip, about section, CV, and biodata">
      {creds.map((c, i) => (
        <ItemRow key={i} label={c.label || <em style={{ color: '#94A3B8' }}>Untitled</em>} meta={c.value} expanded={exp === i} onToggle={() => setExp(exp === i ? null : i)} i={i} total={creds.length} onDelete={() => { updateCredentials(creds.filter((_, j) => j !== i)); setExp(null) }} onMove={d => move(i, d)}>
          <Grid2>
            <Input label="Label / Badge" value={c.label} onChange={v => upd(i, { label: v })} placeholder="ABC License" />
            <Input label="Title / Value"  value={c.value} onChange={v => upd(i, { value: v })} placeholder="Electrical Licensing Board" />
          </Grid2>
          <Input label="Detail / Issuer" value={c.detail} onChange={v => upd(i, { detail: v })} placeholder="Electricity Licensing Board (ELB) Bangladesh · Category A, B & C" />
          <Input label="Credential URL (optional)" value={c.url || ''} onChange={v => upd(i, { url: v })} placeholder="https://www.linkedin.com/learning/certificates/..." />
        </ItemRow>
      ))}
      <AddButton label="Add credential" onClick={() => { updateCredentials([...creds, { label: '', value: '', detail: '', url: '' }]); setExp(creds.length) }} />
    </Section>
  )
}

function ExpertisePanel() {
  const { data: { expertise }, updateExpertise } = useSite()
  const [exp, setExp] = useState<number | null>(null)
  const upd  = (i: number, p: Partial<ExpertiseItem>) => updateExpertise(expertise.map((e, j) => j === i ? { ...e, ...p } : e))
  const move = (i: number, d: 'up' | 'down') => { const n = [...expertise]; [n[i], n[i + (d === 'up' ? -1 : 1)]] = [n[i + (d === 'up' ? -1 : 1)], n[i]]; updateExpertise(n) }

  return (
    <Section title="Technical Expertise" description={`${expertise.length} areas of practice`}>
      {expertise.map((e, i) => (
        <ItemRow key={e.id} label={e.title || <em style={{ color: '#94A3B8' }}>Untitled area</em>} meta={`${e.tags.length} tags`} expanded={exp === i} onToggle={() => setExp(exp === i ? null : i)} i={i} total={expertise.length} onDelete={() => { updateExpertise(expertise.filter((_, j) => j !== i)); setExp(null) }} onMove={d => move(i, d)}>
          <Input label="Title" value={e.title} onChange={v => upd(i, { title: v })} placeholder="Power Systems Analysis" />
          <Textarea label="Description" value={e.desc} onChange={v => upd(i, { desc: v })} rows={3} />
          <TagChips label="Tags" tags={e.tags} onChange={t => upd(i, { tags: t })} />
        </ItemRow>
      ))}
      <AddButton label="Add expertise area" onClick={() => { const n = expertise.length + 1; updateExpertise([...expertise, { id: `area-${Date.now()}`, num: String(n).padStart(2, '0'), title: '', tags: [], desc: '' }]); setExp(expertise.length) }} />
    </Section>
  )
}

function ProjectsPanel() {
  const { data: { projects }, updateProjects } = useSite()
  const [exp, setExp] = useState<number | null>(null)
  const upd  = (i: number, p: Partial<Project>) => updateProjects(projects.map((pr, j) => j === i ? { ...pr, ...p } : pr))
  const updList = (i: number, key: 'scope' | 'deliverables' | 'tools', raw: string) => upd(i, { [key]: raw.split('\n').map(s => s.trim()).filter(Boolean) })
  const move = (i: number, d: 'up' | 'down') => { const n = [...projects]; [n[i], n[i + (d === 'up' ? -1 : 1)]] = [n[i + (d === 'up' ? -1 : 1)], n[i]]; updateProjects(n) }

  return (
    <Section title="Projects" description={`${projects.length} featured projects`}>
      {projects.map((p, i) => (
        <ItemRow key={p.id} label={p.title || <em style={{ color: '#94A3B8' }}>Untitled project</em>} meta={p.capacity} expanded={exp === i} onToggle={() => setExp(exp === i ? null : i)} i={i} total={projects.length} onDelete={() => { updateProjects(projects.filter((_, j) => j !== i)); setExp(null) }} onMove={d => move(i, d)}>
          <Grid2>
            <Input label="Title"           value={p.title}    onChange={v => upd(i, { title: v })} />
            <Input label="Category"        value={p.category} onChange={v => upd(i, { category: v })} placeholder="Renewable Integration" />
            <Input label="Client"          value={p.client}   onChange={v => upd(i, { client: v })} />
            <Input label="Location"        value={p.location} onChange={v => upd(i, { location: v })} />
            <Input label="Capacity"        value={p.capacity} onChange={v => upd(i, { capacity: v })} placeholder="150 MW AC" />
            <Input label="Year"            value={p.year}     onChange={v => upd(i, { year: v })} />
          </Grid2>
          <Textarea label="Summary" value={p.summary} onChange={v => upd(i, { summary: v })} rows={3} />
          <ImagePicker value={p.img} onChange={v => upd(i, { img: v })} />
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ flex: '0 0 auto' }}>
              <label style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Image bg color</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={p.imgColor || '#D4CFC5'} onChange={e => upd(i, { imgColor: e.target.value })} style={{ width: 36, height: 32, padding: 2, border: '1px solid #E2E8F0', borderRadius: 6, cursor: 'pointer' }} />
                <input value={p.imgColor || ''} onChange={e => upd(i, { imgColor: e.target.value })} placeholder="#D4CFC5" style={{ width: 90, height: 32, padding: '0 8px', border: '1px solid #E2E8F0', borderRadius: 6, fontFamily: 'monospace', fontSize: 12, outline: 'none', color: '#374151' }} />
              </div>
            </div>
          </div>
          <Grid2>
            <Textarea label="Scope (one per line)"        value={p.scope.join('\n')}        onChange={v => updList(i, 'scope', v)}        rows={4} />
            <Textarea label="Tools (one per line)"        value={p.tools.join('\n')}        onChange={v => updList(i, 'tools', v)}        rows={4} />
          </Grid2>
          <Textarea label="Deliverables (one per line)"   value={p.deliverables.join('\n')} onChange={v => updList(i, 'deliverables', v)} rows={3} />
          <Textarea label="Outcome / Key Result"          value={p.outcome}                 onChange={v => upd(i, { outcome: v })}        rows={2} />
        </ItemRow>
      ))}
      <AddButton label="Add project" onClick={() => { const n = projects.length + 1; updateProjects([...projects, { id: `proj-${Date.now()}`, num: String(n).padStart(2, '0'), title: '', client: '', location: '', capacity: '', year: String(new Date().getFullYear()), category: '', img: '', imgColor: '#D4CFC5', summary: '', scope: [], deliverables: [], outcome: '', tools: [] }]); setExp(projects.length) }} />
    </Section>
  )
}

function ServicesPanel() {
  const { data: { services }, updateServices } = useSite()
  const upd  = (i: number, p: Partial<ServiceItem>) => updateServices(services.map((s, j) => j === i ? { ...s, ...p } : s))
  const move = (i: number, d: 'up' | 'down') => { const n = [...services]; [n[i], n[i + (d === 'up' ? -1 : 1)]] = [n[i + (d === 'up' ? -1 : 1)], n[i]]; updateServices(n) }

  return (
    <Section title="Services" description={`${services.length} services listed`}>
      {services.map((s, i) => (
        <div key={s.id} style={{ border: '1px solid #E2E8F0', borderRadius: 6, marginBottom: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'stretch', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #E2E8F0' }}>
              <button onClick={() => i > 0 && move(i, 'up')} disabled={i === 0} style={{ background: 'none', border: 'none', cursor: i > 0 ? 'pointer' : 'default', color: i > 0 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}><ChevronUp size={11} /></button>
              <button onClick={() => i < services.length - 1 && move(i, 'down')} disabled={i >= services.length - 1} style={{ background: 'none', border: 'none', cursor: i < services.length - 1 ? 'pointer' : 'default', color: i < services.length - 1 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}><ChevronDown size={11} /></button>
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#C47D0E', padding: '0 10px', display: 'flex', alignItems: 'center', minWidth: 36 }}>{s.num}</span>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', padding: '10px 12px', background: '#FFFFFF' }}>
              <input value={s.name} onChange={e => upd(i, { name: e.target.value })} placeholder="Service name" style={{ height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 13, outline: 'none', color: '#1E293B' }} />
              <input value={s.detail} onChange={e => upd(i, { detail: e.target.value })} placeholder="Keywords / detail" style={{ height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 13, outline: 'none', color: '#374151' }} />
            </div>
            <button onClick={() => updateServices(services.filter((_, j) => j !== i))} style={{ padding: '0 12px', background: 'none', border: 'none', borderLeft: '1px solid #E2E8F0', cursor: 'pointer', color: '#CBD5E1', transition: 'color 0.15s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}>
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
      <AddButton label="Add service" onClick={() => { const n = services.length + 1; updateServices([...services, { id: `svc-${Date.now()}`, num: String(n).padStart(2, '0'), name: '', detail: '' }]) }} />
    </Section>
  )
}

function EducationPanel() {
  const { data: { education, settings }, updateEducation, updateSettings } = useSite()
  const upd  = (i: number, p: Partial<EducationItem>) => updateEducation(education.map((e, j) => j === i ? { ...e, ...p } : e))
  const move = (i: number, d: 'up' | 'down') => { const n = [...education]; [n[i], n[i + (d === 'up' ? -1 : 1)]] = [n[i + (d === 'up' ? -1 : 1)], n[i]]; updateEducation(n) }

  return (
    <div>
      <Section title="Education" description={`${education.length} entries`}>
        {education.map((e, i) => (
          <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: 6, marginBottom: 8, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'stretch', background: '#F8FAFC' }}>
              <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #E2E8F0' }}>
                <button onClick={() => i > 0 && move(i, 'up')} disabled={i === 0} style={{ background: 'none', border: 'none', cursor: i > 0 ? 'pointer' : 'default', color: i > 0 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}><ChevronUp size={11} /></button>
                <button onClick={() => i < education.length - 1 && move(i, 'down')} disabled={i >= education.length - 1} style={{ background: 'none', border: 'none', cursor: i < education.length - 1 ? 'pointer' : 'default', color: i < education.length - 1 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}><ChevronDown size={11} /></button>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '0 10px', padding: '10px 12px', background: '#FFFFFF' }}>
                <input value={e.period}      onChange={ev => upd(i, { period: ev.target.value })}      placeholder="2020" style={{ height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#1E293B' }} />
                <input value={e.degree}      onChange={ev => upd(i, { degree: ev.target.value })}      placeholder="Degree / Certificate" style={{ height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#1E293B' }} />
                <input value={e.institution} onChange={ev => upd(i, { institution: ev.target.value })} placeholder="Institution" style={{ height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#374151' }} />
                <input value={e.note}        onChange={ev => upd(i, { note: ev.target.value })}        placeholder="Grade / Note" style={{ height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 4, fontFamily: 'Outfit,sans-serif', fontSize: 12, outline: 'none', color: '#374151' }} />
              </div>
              <button onClick={() => updateEducation(education.filter((_, j) => j !== i))} style={{ padding: '0 12px', background: 'none', border: 'none', borderLeft: '1px solid #E2E8F0', cursor: 'pointer', color: '#CBD5E1', transition: 'color 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        <AddButton label="Add entry" onClick={() => updateEducation([...education, { period: '', degree: '', institution: '', note: '' }])} />
      </Section>

      <Section title="Software & Tools" description="Tag chips shown in the education section">
        <TagChips label="Tools" tags={settings.tools} onChange={tools => updateSettings({ tools })} />
      </Section>
    </div>
  )
}

function SettingsPanel() {
  const { data: { settings, engineer }, updateSettings, updateEngineer } = useSite()
  return (
    <div>
      <Section title="Site Metadata">
        <Input label="Browser Tab Title" value={settings.siteTitle} onChange={v => updateSettings({ siteTitle: v })} placeholder="Md Sahin Alom — Electrical Engineer" />
        <Textarea label="Meta Description" hint="for SEO" value={settings.pageDescription} onChange={v => updateSettings({ pageDescription: v })} rows={2} />
      </Section>
      <Section title="Social Links">
        <Input label="LinkedIn URL" value={settings.social.linkedin} onChange={v => updateSettings({ social: { ...settings.social, linkedin: v } })} placeholder="https://linkedin.com/in/yourname" />
        <Input label="Twitter / X"  value={settings.social.twitter}  onChange={v => updateSettings({ social: { ...settings.social, twitter: v } })}  placeholder="https://x.com/yourhandle" />
        <Input label="GitHub"       value={settings.social.github}   onChange={v => updateSettings({ social: { ...settings.social, github: v } })}   placeholder="https://github.com/yourname" />
      </Section>
      <Section title="Availability">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch checked={engineer.available} onChange={v => updateEngineer({ available: v })} />
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 500, fontSize: 13, color: '#1E293B' }}>Available for new projects</div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginTop: 2 }}>Shows green indicator in hero when enabled</div>
          </div>
        </div>
      </Section>
    </div>
  )
}

type Message = {
  id: string; name: string; email: string; subject: string
  message: string; created_at: string; read: boolean
}

function MessagesPanel() {
  const [msgs, setMsgs]   = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen]   = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setMsgs(data ?? []); setLoading(false) })
  }, [])

  const markRead = async (id: string) => {
    await supabase.from('contact_messages').update({ read: true }).eq('id', id)
    setMsgs(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const unread = msgs.filter(m => !m.read).length

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', margin: 0 }}>Contact Messages</h2>
        {unread > 0 && (
          <span style={{ padding: '2px 8px', background: '#C47D0E', color: '#fff', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{unread} new</span>
        )}
      </div>

      {loading && <div style={{ color: '#94A3B8', fontSize: 13 }}>Loading…</div>}
      {!loading && msgs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#94A3B8' }}>
          <Mail size={32} strokeWidth={1} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontSize: 14, fontWeight: 500 }}>No messages yet</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Messages from the contact form will appear here</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.map(m => (
          <div key={m.id} style={{
            background: '#FFFFFF', border: `1px solid ${!m.read ? '#C47D0E' : '#E2E8F0'}`,
            borderLeft: `3px solid ${!m.read ? '#C47D0E' : '#E2E8F0'}`,
            borderRadius: 6, overflow: 'hidden',
          }}>
            {/* Header row */}
            <button
              onClick={() => { setOpen(open === m.id ? null : m.id); if (!m.read) markRead(m.id) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontWeight: m.read ? 500 : 700, fontSize: 13, color: '#0F172A' }}>{m.name}</span>
                  {!m.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C47D0E', flexShrink: 0 }} />}
                </div>
                <div style={{ fontSize: 12, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.subject}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={10} />
                  {new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                </span>
                <ChevronRight size={14} style={{ color: '#94A3B8', transform: open === m.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </button>
            {/* Expanded body */}
            {open === m.id && (
              <div style={{ padding: '0 16px 16px', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{ padding: '3px 8px', background: '#F1F5F9', borderRadius: 4, fontSize: 11, color: '#64748B' }}>
                    <Mail size={9} style={{ display: 'inline', marginRight: 4 }} />{m.email}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{m.message}</p>
                <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, padding: '7px 14px', background: '#C47D0E', color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 600, borderRadius: 4 }}>
                  <Mail size={12} /> Reply via email
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const PANELS: Record<SectionId, (props: { onNavigate: (s: SectionId) => void }) => ReactNode> = {
  overview:    ({ onNavigate }) => <OverviewPanel onNavigate={onNavigate} />,
  articles:    () => <ArticlesList />,
  profile:     () => <ProfilePanel />,
  credentials: () => <CredentialsPanel />,
  expertise:   () => <ExpertisePanel />,
  projects:    () => <ProjectsPanel />,
  services:    () => <ServicesPanel />,
  education:   () => <EducationPanel />,
  settings:    () => <SettingsPanel />,
  messages:    () => <MessagesPanel />,
}

// ── Dashboard shell ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const onViewSite = () => navigate('/')
  const { data, saved, resetToDefaults, updateEngineer } = useSite()
  const [section, setSection] = useState<SectionId>('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const active = NAV_ITEMS.find(n => n.id === section)!

  useEffect(() => {
    document.title = data.settings.siteTitle || 'Site Editor'
    return () => { document.title = data.settings.siteTitle || document.title }
  }, [data.settings.siteTitle])

  const selectSection = (s: SectionId) => {
    setSection(s)
    setMobileDrawerOpen(false)
  }

  const isMoreTab = !['overview', 'articles', 'projects', 'messages'].includes(section)

  return (
    <div className="admin-shell" style={{ display: 'flex', height: '100vh', background: '#F8FAFC', fontFamily: 'Outfit,sans-serif', overflow: 'hidden', position: 'relative' }}>

      {/* ── Desktop Sidebar (Hidden on <= 768px via CSS) ── */}
      <aside className="admin-desktop-sidebar" style={{
        width: collapsed ? 56 : 232,
        flexShrink: 0, background: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.16,1,0.3,1)',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: collapsed ? '0 12px' : '0 16px', borderBottom: '1px solid #F1F5F9', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, background: '#C47D0E', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Pencil size={13} strokeWidth={2} style={{ color: '#FFFFFF' }} />
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A', lineHeight: 1.2 }}>Site Editor</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{data.engineer.initials}</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV_ITEMS.map(item => {
            const isActive = section === item.id
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: collapsed ? '9px 0' : '9px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: isActive ? '#FEF3C7' : 'transparent',
                  border: 'none', borderRadius: 0,
                  color: isActive ? '#92400E' : '#64748B',
                  cursor: 'pointer', fontSize: 13, fontWeight: isActive ? 600 : 400,
                  fontFamily: 'Outfit,sans-serif',
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                  borderLeft: isActive ? '3px solid #C47D0E' : '3px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#F8FAFC' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </button>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: collapsed ? '8px 0' : 12, borderTop: '1px solid #F1F5F9', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {!collapsed && (
            <>
              <Button onClick={onViewSite} style={{ width: '100%', justifyContent: 'center' } as any}>
                <Eye size={13} /> Preview site
              </Button>
              <Button variant="ghost" onClick={() => setShowReset(true)} style={{ width: '100%', justifyContent: 'center', color: '#EF4444', fontSize: 12 } as any}>
                <RotateCcw size={12} /> Reset defaults
              </Button>
            </>
          )}
          <button
            title="Sign out"
            onClick={async () => { await supabase.auth.signOut(); navigate('/admin/login') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, justifyContent: collapsed ? 'center' : 'flex-start',
              width: '100%', padding: collapsed ? '9px 0' : '8px 10px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94A3B8', fontSize: 12, fontFamily: 'Outfit,sans-serif',
              borderRadius: 4, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLElement).style.color = '#EF4444' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
          >
            <LogOut size={14} />
            {!collapsed && 'Sign out'}
          </button>
        </div>
      </aside>

      {/* ── Mobile Slide-Over Drawer Overlay ── */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="admin-mobile-backdrop"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
            zIndex: 998, animation: 'fadeIn 0.2s ease-out',
          }}
        />
      )}

      {/* ── Mobile Slide-Over Drawer ── */}
      <aside
        className="admin-mobile-drawer"
        style={{
          position: 'fixed', top: 0, bottom: 0, left: 0,
          width: 'min(310px, 84vw)', background: '#FFFFFF',
          zIndex: 999, display: 'flex', flexDirection: 'column',
          boxShadow: mobileDrawerOpen ? '4px 0 32px rgba(0,0,0,0.18)' : 'none',
          transform: mobileDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1)',
          overflow: 'hidden',
        }}
      >
        {/* Drawer Header with user pill & close */}
        <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', background: '#F1F5F9', border: '1px solid #E2E8F0', flexShrink: 0 }}>
              <img src={data.engineer.photo || sahinPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 13, color: '#0F172A', lineHeight: 1.2 }}>{data.engineer.name}</div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#C47D0E', letterSpacing: '0.1em' }}>SITE EDITOR</div>
            </div>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#64748B', display: 'flex', borderRadius: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Availability Status Banner */}
        <div style={{ padding: '10px 16px', background: '#FAF8F5', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontFamily: 'Outfit,sans-serif', color: '#475569', fontWeight: 500 }}>
            Availability Status
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontFamily: 'Outfit,sans-serif', color: data.engineer.available ? '#16A34A' : '#94A3B8', fontWeight: 500 }}>
              {data.engineer.available ? 'Available' : 'Busy'}
            </span>
            <Switch checked={data.engineer.available} onChange={v => updateEngineer({ available: v })} />
          </div>
        </div>

        {/* Drawer Navigation items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          <div style={{ padding: '4px 16px 8px', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#94A3B8', textTransform: 'uppercase' }}>
            All Sections
          </div>
          {NAV_ITEMS.map(item => {
            const isActive = section === item.id
            return (
              <button
                key={item.id}
                onClick={() => selectSection(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '12px 16px',
                  background: isActive ? '#FEF3C7' : 'transparent',
                  border: 'none', color: isActive ? '#92400E' : '#374151',
                  cursor: 'pointer', fontSize: 14, fontWeight: isActive ? 600 : 500,
                  fontFamily: 'Outfit,sans-serif', textAlign: 'left',
                  borderLeft: isActive ? '4px solid #C47D0E' : '4px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ color: isActive ? '#C47D0E' : '#64748B', display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C47D0E' }} />}
              </button>
            )
          })}
        </nav>

        {/* Drawer Footer actions */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 8, background: '#FFFFFF' }}>
          <Button onClick={() => { setMobileDrawerOpen(false); onViewSite(); }} style={{ width: '100%', justifyContent: 'center' } as any}>
            <Eye size={14} /> Preview site
          </Button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="ghost"
              onClick={() => { setMobileDrawerOpen(false); setShowReset(true); }}
              style={{ flex: 1, justifyContent: 'center', color: '#EF4444', fontSize: 11, padding: '0 8px' } as any}
            >
              <RotateCcw size={12} /> Reset
            </Button>
            <Button
              variant="outline"
              onClick={async () => { await supabase.auth.signOut(); navigate('/admin/login') }}
              style={{ flex: 1, justifyContent: 'center', fontSize: 11, padding: '0 8px' } as any}
            >
              <LogOut size={12} /> Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* ── Main View ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top Header */}
        <header style={{
          height: 56, borderBottom: '1px solid #E2E8F0', background: '#FFFFFF',
          display: 'flex', alignItems: 'center', padding: '0 clamp(12px, 3vw, 20px)',
          gap: 12, flexShrink: 0, zIndex: 10,
        }}>
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="admin-collapse-toggle"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94A3B8', display: 'flex', padding: 4, borderRadius: 4, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; (e.currentTarget as HTMLElement).style.color = '#374151' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="admin-mobile-menu-btn"
            aria-label="Open menu"
            style={{
              background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer',
              color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 6, flexShrink: 0,
            }}
          >
            <Menu size={18} />
          </button>

          {/* Title & Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <span style={{ color: '#C47D0E', display: 'flex', flexShrink: 0 }}>{active.icon}</span>
            <h1 style={{ fontWeight: 600, fontSize: 14, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {active.label}
            </h1>
          </div>

          {/* Live Save indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            {saved
              ? <><Check size={13} style={{ color: '#16A34A' }} /><span style={{ fontSize: 11, color: '#16A34A', fontWeight: 500 }}>Saved</span></>
              : <><Loader2 size={13} style={{ color: '#C47D0E', animation: 'spin 1s linear infinite' }} /><span style={{ fontSize: 11, color: '#C47D0E', fontWeight: 500 }}>Saving…</span></>
            }
          </div>

          {/* Preview button */}
          <Button onClick={onViewSite} size="sm">
            <Eye size={12} /> <span className="btn-preview-text">Preview</span>
          </Button>
        </header>

        {/* Content area */}
        <main className="admin-content-main" style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {PANELS[section]({ onNavigate: s => setSection(s) })}
          </div>
        </main>
      </div>

      {/* ── Native Mobile App Bottom Navigation Bar (Visible only <= 768px) ── */}
      <nav className="admin-bottom-bar">
        {[
          { id: 'overview' as SectionId, label: 'Overview', icon: <LayoutDashboard size={19} /> },
          { id: 'articles' as SectionId, label: 'Articles', icon: <BookOpen size={19} /> },
          { id: 'projects' as SectionId, label: 'Projects', icon: <FolderOpen size={19} /> },
          { id: 'messages' as SectionId, label: 'Messages', icon: <Inbox size={19} /> },
          { id: 'more' as const,         label: 'More',     icon: <Menu size={19} /> },
        ].map(tab => {
          const isCurrent = tab.id === 'more' ? isMoreTab : section === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'more') {
                  setMobileDrawerOpen(true)
                } else {
                  setSection(tab.id)
                }
              }}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3, height: '100%', background: 'none',
                border: 'none', cursor: 'pointer', padding: '6px 0',
                color: isCurrent ? '#C47D0E' : '#64748B',
                transition: 'color 0.15s, transform 0.15s',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transform: isCurrent ? 'translateY(-1px)' : 'none', transition: 'transform 0.15s' }}>
                {tab.icon}
              </div>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 10, fontWeight: isCurrent ? 600 : 500, letterSpacing: '0.01em', lineHeight: 1 }}>
                {tab.label}
              </span>
              {isCurrent && (
                <div style={{ position: 'absolute', top: 4, width: 4, height: 4, borderRadius: '50%', background: '#C47D0E' }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Reset confirmation dialog */}
      {showReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: 16 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 24, maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
              <AlertTriangle size={20} style={{ color: '#EF4444', flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', margin: '0 0 8px' }}>Reset to defaults?</h3>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: 0 }}>All edits will be permanently discarded and replaced with the original sample content.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setShowReset(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { resetToDefaults(); setShowReset(false) }}>Reset everything</Button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Styles for Mobile Responsive App Shell */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Desktop defaults */
        .admin-mobile-menu-btn { display: none !important; }
        .admin-mobile-drawer { display: none; }
        .admin-mobile-backdrop { display: none; }
        .admin-bottom-bar { display: none !important; }
        .admin-content-main { padding: 24px; }

        /* Mobile app styling (<= 768px) */
        @media (max-width: 768px) {
          .admin-desktop-sidebar { display: none !important; }
          .admin-collapse-toggle { display: none !important; }
          .admin-mobile-menu-btn { display: flex !important; }
          .admin-mobile-drawer { display: flex !important; }
          .admin-mobile-backdrop { display: block !important; }
          .admin-content-main { padding: 14px 12px 88px !important; }

          .admin-bottom-bar {
            display: flex !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 58px;
            background: rgba(255, 255, 255, 0.97);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-top: 1px solid #E2E8F0;
            box-shadow: 0 -4px 16px rgba(0,0,0,0.04);
            z-index: 950;
            padding-bottom: env(safe-area-inset-bottom, 0);
          }

          /* Compact preview text on narrow phone screens */
          @media (max-width: 400px) {
            .btn-preview-text { display: none; }
          }
        }
      `}</style>
    </div>
  )
}
