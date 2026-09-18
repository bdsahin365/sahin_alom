import React, { useState, useRef, useEffect, ReactNode } from 'react'
import {
  ChevronDown, ChevronUp, Trash2, Plus, Upload, Loader2, Check, Search, X,
} from 'lucide-react'
import { compressAndConvertToBase64, formatBytes } from '../../../lib/imageUtils'

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

export function Card({ className = '', children, style }: { className?: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children, style }: { className?: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        padding: '16px clamp(14px, 3vw, 24px) 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className = '', children, style }: { className?: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <h3
      className={className}
      style={{
        fontFamily: 'Outfit,sans-serif',
        fontWeight: 600,
        fontSize: 14,
        color: '#0F172A',
        letterSpacing: '-0.01em',
        margin: 0,
        ...style,
      }}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <p
      style={{
        fontFamily: 'Outfit,sans-serif',
        fontSize: 12,
        color: '#64748B',
        margin: '4px 0 0',
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </p>
  )
}

export function CardContent({ className = '', children, style }: { className?: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        padding: '0 clamp(14px, 3vw, 24px) 20px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Button({
  children,
  variant = 'default',
  size = 'default',
  style,
  onClick,
  type = 'button',
  disabled,
}: {
  children: ReactNode
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary'
  size?: 'default' | 'sm' | 'icon'
  className?: string
  style?: React.CSSProperties
  onClick?: (e?: React.MouseEvent) => void
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderRadius: 6,
        fontFamily: 'Outfit,sans-serif',
        fontWeight: 500,
        fontSize: size === 'sm' ? 12 : 13,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        border: 'none',
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

export function Input({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  hint,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  hint?: string
  disabled?: boolean
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
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          height: 36,
          padding: '0 12px',
          border: `1px solid ${focus ? '#C47D0E' : '#E2E8F0'}`,
          borderRadius: 6,
          fontFamily: 'Outfit,sans-serif',
          fontSize: 13,
          color: '#0F172A',
          background: disabled ? '#F8FAFC' : '#FFFFFF',
          outline: 'none',
          transition: 'border-color 0.15s',
          width: '100%',
          boxShadow: focus ? '0 0 0 3px rgba(196,125,14,0.1)' : 'none',
        }}
      />
    </div>
  )
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder = '',
  rows = 3,
  hint,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  hint?: string
  disabled?: boolean
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
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          padding: '8px 12px',
          resize: 'vertical',
          border: `1px solid ${focus ? '#C47D0E' : '#E2E8F0'}`,
          borderRadius: 6,
          fontFamily: 'Outfit,sans-serif',
          fontSize: 13,
          color: '#0F172A',
          background: disabled ? '#F8FAFC' : '#FFFFFF',
          outline: 'none',
          transition: 'border-color 0.15s',
          width: '100%',
          lineHeight: 1.6,
          boxShadow: focus ? '0 0 0 3px rgba(196,125,14,0.1)' : 'none',
        }}
      />
    </div>
  )
}

export function Grid2({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '0 16px' }}>{children}</div>
}

export function Separator() {
  return <div style={{ height: 1, background: '#F1F5F9', margin: '20px 0' }} />
}

export function Badge({ children, variant = 'secondary' }: { children: ReactNode; variant?: 'secondary' | 'outline' | 'success' | 'warning' }) {
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

export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        cursor: 'pointer',
        background: checked ? '#C47D0E' : '#E2E8F0',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </button>
  )
}

export function TagChips({ label, tags, onChange }: { label: string; tags: string[]; onChange: (t: string[]) => void }) {
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
            <button type="button" onClick={() => onChange(tags.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B45309', padding: 0, display: 'flex', fontSize: 13, lineHeight: 1 }}>×</button>
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

export function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Array<{ id: string; thumb: string; full: string }>>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true)
      setUploadMsg('Compressing...')
      const { base64, originalSize, compressedSize } = await compressAndConvertToBase64(file, {
        maxWidth: 1200,
        maxHeight: 900,
        quality: 0.82,
        mimeType: 'image/jpeg',
      })
      onChange(base64)
      setUploadMsg(`Saved (${formatBytes(originalSize)} → ${formatBytes(compressedSize)})`)
      setTimeout(() => setUploadMsg(null), 3500)
    } catch (err: any) {
      alert('Upload failed: ' + (err?.message || 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

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
      <div style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
        {value && (
          <div style={{ width: 80, height: 52, borderRadius: 6, overflow: 'hidden', border: '1px solid #E2E8F0', flexShrink: 0, position: 'relative' }}>
            <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) handleFileUpload(f)
                e.target.value = ''
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '6px 11px', borderRadius: 5, background: '#C47D0E', color: '#fff',
                fontFamily: 'Outfit,sans-serif', fontSize: 11, fontWeight: 600, border: 'none',
                cursor: uploading ? 'not-allowed' : 'pointer',
              }}
            >
              {uploading ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={11} />}
              {uploading ? 'Processing…' : 'Upload from device'}
            </button>

            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 5, cursor: 'pointer', color: '#374151', fontSize: 11, fontFamily: 'Outfit,sans-serif', fontWeight: 500, padding: '6px 10px' }}
            >
              {open ? '↑ Close Unsplash' : '🔍 Search Unsplash'}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: 11, fontFamily: 'Outfit,sans-serif', fontWeight: 500, padding: '0 4px' }}
              >
                × Clear
              </button>
            )}

            {uploadMsg && (
              <span style={{ fontSize: 11, fontFamily: 'Outfit,sans-serif', color: '#16A34A', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <Check size={11} /> {uploadMsg}
              </span>
            )}
          </div>

          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Paste image URL or Base64 data URL…"
            style={{ width: '100%', height: 32, padding: '0 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontFamily: 'Outfit,sans-serif', fontSize: 11, outline: 'none', color: '#374151' }}
          />
        </div>
      </div>

      {open && (
        <div style={{ border: '1px solid #E2E8F0', borderRadius: 6, overflow: 'hidden', marginTop: 8 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="solar farm, substation, wind turbine…"
              style={{ flex: 1, padding: '8px 12px', border: 'none', outline: 'none', fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#374151' }}
            />
            <button
              type="button"
              onClick={search}
              style={{ padding: '0 14px', background: '#C47D0E', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12, fontFamily: 'Outfit,sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {loading ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={12} />} Search
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, padding: 2, background: '#F1F5F9' }}>
            {results.map(r => (
              <button
                type="button"
                key={r.id}
                onClick={() => { onChange(r.full); setOpen(false) }}
                style={{ padding: 0, border: value === r.full ? '2px solid #C47D0E' : '2px solid transparent', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', background: 'none' }}
              >
                <img src={r.thumb} alt="" style={{ width: '100%', height: 64, objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Section({
  title,
  description,
  icon,
  badge,
  defaultOpen = true,
  children,
}: {
  title: string
  description?: string
  icon?: ReactNode
  badge?: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Card style={{ marginBottom: 16 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px clamp(14px, 3vw, 24px)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
          {icon && (
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {icon}
            </div>
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{title}</span>
              {badge}
            </div>
            {description && <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginTop: 2 }}>{description}</div>}
          </div>
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

export function ItemRow({
  label,
  meta,
  expanded,
  onToggle,
  i,
  total,
  onDelete,
  onMove,
  children,
}: {
  label: ReactNode
  meta?: string
  expanded: boolean
  onToggle: () => void
  i: number
  total: number
  onDelete: () => void
  onMove: (d: 'up' | 'down') => void
  children: ReactNode
}) {
  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: 6, marginBottom: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #E2E8F0' }}>
          <button type="button" onClick={() => i > 0 && onMove('up')} disabled={i === 0} style={{ background: 'none', border: 'none', cursor: i > 0 ? 'pointer' : 'default', color: i > 0 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}>
            <ChevronUp size={11} />
          </button>
          <button type="button" onClick={() => i < total - 1 && onMove('down')} disabled={i >= total - 1} style={{ background: 'none', border: 'none', cursor: i < total - 1 ? 'pointer' : 'default', color: i < total - 1 ? '#94A3B8' : '#E2E8F0', padding: '6px 8px' }}>
            <ChevronDown size={11} />
          </button>
        </div>
        <button type="button" onClick={onToggle} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ flex: 1, fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{label}</span>
          {meta && <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8' }}>{meta}</span>}
          <ChevronDown size={13} style={{ color: '#CBD5E1', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          style={{ padding: '0 12px', background: 'none', border: 'none', borderLeft: '1px solid #E2E8F0', cursor: 'pointer', color: '#CBD5E1', height: '100%', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}
        >
          <Trash2 size={13} />
        </button>
      </div>
      {expanded && <div style={{ padding: '16px 16px 8px', borderTop: '1px solid #F1F5F9', background: '#FFFFFF' }}>{children}</div>}
    </div>
  )
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        padding: '10px',
        background: 'transparent',
        border: '1px dashed #E2E8F0',
        borderRadius: 6,
        color: '#94A3B8',
        fontSize: 12,
        fontFamily: 'Outfit,sans-serif',
        fontWeight: 500,
        cursor: 'pointer',
        marginTop: 4,
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = '#C47D0E'
        el.style.color = '#C47D0E'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = '#E2E8F0'
        el.style.color = '#94A3B8'
      }}
    >
      <Plus size={13} /> {label}
    </button>
  )
}

export interface CommandItem {
  id: string
  label: string
  category: 'Pages & Sections' | 'Pro Actions'
  icon: ReactNode
  hint?: string
  shortcut?: string
  onSelect: () => void
}

export function CommandPaletteModal({
  open,
  onClose,
  items,
}: {
  open: boolean
  onClose: () => void
  items: CommandItem[]
}) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = items.filter(
    it =>
      it.label.toLowerCase().includes(query.toLowerCase()) ||
      (it.hint && it.hint.toLowerCase().includes(query.toLowerCase())) ||
      it.category.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => (filtered.length ? (i + 1) % filtered.length : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[activeIndex]) {
          filtered[activeIndex].onSelect()
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, filtered, activeIndex, onClose])

  if (!open) return null

  const categories = Array.from(new Set(filtered.map(f => f.category)))

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.58)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 2100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(28px, 9vh, 96px) 16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 580,
          background: '#FFFFFF',
          borderRadius: 14,
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '76vh',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 16px',
            borderBottom: '1px solid #E2E8F0',
            background: '#FAFAFA',
          }}
        >
          <Search size={18} style={{ color: '#C47D0E', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a section, page, or action to jump..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: 14,
              fontFamily: 'Outfit,sans-serif',
              color: '#0F172A',
              fontWeight: 500,
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#94A3B8', display: 'flex' }}
            >
              <X size={14} />
            </button>
          )}
          <span
            style={{
              fontSize: 10,
              fontFamily: 'JetBrains Mono,monospace',
              padding: '2px 7px',
              borderRadius: 4,
              background: '#F1F5F9',
              color: '#64748B',
              border: '1px solid #E2E8F0',
              letterSpacing: '0.04em',
            }}
          >
            ESC
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 13, fontFamily: 'Outfit,sans-serif' }}>
              No matches found for "<span style={{ color: '#0F172A', fontWeight: 600 }}>{query}</span>"
            </div>
          ) : (
            categories.map(cat => {
              const catItems = filtered.filter(it => it.category === cat)
              return (
                <div key={cat} style={{ marginBottom: 6 }}>
                  <div
                    style={{
                      padding: '6px 12px 4px',
                      fontFamily: 'JetBrains Mono,monospace',
                      fontSize: 10,
                      letterSpacing: '0.12em',
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                    }}
                  >
                    {cat}
                  </div>
                  {catItems.map(item => {
                    const itemGlobalIndex = filtered.indexOf(item)
                    const isSelected = itemGlobalIndex === activeIndex
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          item.onSelect()
                          onClose()
                        }}
                        onMouseEnter={() => setActiveIndex(itemGlobalIndex)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 11,
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: 'none',
                          background: isSelected ? '#FEF3C7' : 'transparent',
                          color: isSelected ? '#92400E' : '#1E293B',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'Outfit,sans-serif',
                          fontSize: 13,
                          transition: 'background 0.1s',
                        }}
                      >
                        <span style={{ color: isSelected ? '#C47D0E' : '#64748B', display: 'flex', flexShrink: 0 }}>
                          {item.icon}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: isSelected ? 600 : 500, lineHeight: 1.2 }}>{item.label}</div>
                          {item.hint && (
                            <div style={{ fontSize: 11, color: isSelected ? '#B45309' : '#94A3B8', marginTop: 2 }}>
                              {item.hint}
                            </div>
                          )}
                        </div>
                        {item.shortcut && (
                          <span
                            style={{
                              fontFamily: 'JetBrains Mono,monospace',
                              fontSize: 10,
                              padding: '2px 7px',
                              borderRadius: 4,
                              background: isSelected ? '#FDE68A' : '#F1F5F9',
                              color: isSelected ? '#78350F' : '#64748B',
                            }}
                          >
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 16px',
            borderTop: '1px solid #F1F5F9',
            background: '#FAFAFA',
            fontSize: 11,
            color: '#94A3B8',
            fontFamily: 'Outfit,sans-serif',
          }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <span>
              <kbd style={{ fontFamily: 'JetBrains Mono,monospace', background: '#E2E8F0', padding: '1px 5px', borderRadius: 3, color: '#475569' }}>
                ↑↓
              </kbd>{' '}
              navigate
            </span>
            <span>
              <kbd style={{ fontFamily: 'JetBrains Mono,monospace', background: '#E2E8F0', padding: '1px 5px', borderRadius: 3, color: '#475569' }}>
                ↵
              </kbd>{' '}
              select
            </span>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', color: '#C47D0E', fontSize: 10, letterSpacing: '0.08em' }}>
            COMMAND PALETTE
          </span>
        </div>
      </div>
    </div>
  )
}

