import { useState, useRef, useCallback, useEffect } from 'react'
import { X, Upload, Link2, Image, Check, Loader2, Trash2, AlertCircle } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

interface MediaUploadModalProps {
  /** Called with the final public URL once user confirms */
  onConfirm: (url: string) => void
  onClose: () => void
  /** Label context – e.g. "Featured Image" or "Inline Image" */
  label?: string
  /** Accepted mime types */
  accept?: string
}

type Tab = 'upload' | 'url'

function bytesToSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function MediaUploadModal({
  onConfirm, onClose, label = 'Image', accept = 'image/*',
}: MediaUploadModalProps) {
  const [tab, setTab] = useState<Tab>('upload')
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate preview when file selected
  useEffect(() => {
    if (!file) { setPreview(''); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleFile = (f: File) => {
    setError('')
    setUploadedUrl('')
    const isImage = f.type.startsWith('image/')
    if (accept === 'image/*' && !isImage) {
      setError('Please select an image file (JPG, PNG, WebP, SVG, GIF)')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10 MB.')
      return
    }
    setFile(f)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const uploadToSupabase = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    setProgress(10)

    // Simulate progress ticks
    const tick = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 300)

    const ext = file.name.split('.').pop() ?? 'bin'
    const path = `articles/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('article-assets')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    clearInterval(tick)

    if (uploadErr) {
      // Bucket might not exist yet — fall back to object URL for local dev
      if (uploadErr.message?.includes('Bucket not found') || uploadErr.message?.includes('not found')) {
        setError('Storage bucket "article-assets" not found. Create it in Supabase → Storage, then try again. Using local preview for now.')
        setUploadedUrl(preview)
      } else {
        setError(`Upload failed: ${uploadErr.message}`)
      }
      setUploading(false)
      setProgress(0)
      return
    }

    const { data } = supabase.storage.from('article-assets').getPublicUrl(path)
    setProgress(100)
    setUploadedUrl(data.publicUrl)
    setUploading(false)
  }

  const handleConfirm = () => {
    if (tab === 'url') {
      const url = urlInput.trim()
      if (!url) { setError('Please enter a URL'); return }
      onConfirm(url)
    } else {
      if (uploadedUrl) { onConfirm(uploadedUrl); return }
      if (file) { uploadToSupabase().then(() => {}) } else { setError('Please select a file') }
    }
  }

  // Auto-confirm after successful upload
  useEffect(() => {
    if (uploadedUrl && !uploading) onConfirm(uploadedUrl)
  }, [uploadedUrl, uploading])

  const canConfirm = tab === 'url' ? !!urlInput.trim() : !!(file || uploadedUrl)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 700, padding: 20 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 15, color: '#0F172A', margin: 0 }}>
            Add {label}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, borderRadius: 4, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9' }}>
          {[
            { id: 'upload' as Tab, label: 'UPLOAD FILE' },
            { id: 'url' as Tab, label: 'PASTE URL' },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setError('') }} style={{
              flex: 1, height: 38, border: 'none', background: 'transparent',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em',
              cursor: 'pointer', color: tab === t.id ? '#C47D0E' : '#64748B',
              borderBottom: tab === t.id ? '2px solid #C47D0E' : '2px solid transparent',
              transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ padding: '20px' }}>
          {/* ── UPLOAD TAB ── */}
          {tab === 'upload' && (
            <>
              {/* Drop zone */}
              {!file ? (
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => inputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragging ? '#C47D0E' : '#E2E8F0'}`,
                    borderRadius: 10, padding: '40px 20px', textAlign: 'center', cursor: 'pointer',
                    background: dragging ? '#FEF9EC' : '#FAFAFA',
                    transition: 'all 0.2s', marginBottom: 16,
                  }}
                >
                  <div style={{ width: 48, height: 48, background: dragging ? '#FEF3C7' : '#F1F5F9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Upload size={20} style={{ color: dragging ? '#C47D0E' : '#94A3B8' }} />
                  </div>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 14, color: '#0F172A', marginBottom: 4 }}>
                    {dragging ? 'Drop to upload' : 'Drag & drop or click to browse'}
                  </div>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#94A3B8' }}>
                    JPG, PNG, WebP, SVG, GIF · Max 10 MB
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  {/* Preview */}
                  {preview && (
                    <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #E2E8F0', marginBottom: 10, position: 'relative' }}>
                      <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />
                    </div>
                  )}
                  {/* File info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                    <Image size={16} style={{ color: '#C47D0E', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8' }}>{bytesToSize(file.size)}</div>
                    </div>
                    <button onClick={() => { setFile(null); setPreview(''); setUploadedUrl('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, display: 'flex', flexShrink: 0 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EF4444' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Progress bar */}
                  {uploading && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ height: 4, background: '#F1F5F9', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#C47D0E', width: `${progress}%`, transition: 'width 0.3s', borderRadius: 2 }} />
                      </div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> Uploading to Supabase Storage…
                      </div>
                    </div>
                  )}
                  {uploadedUrl && !uploading && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, color: '#16A34A', fontFamily: 'Outfit,sans-serif', fontSize: 11 }}>
                      <Check size={12} /> Uploaded successfully
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── URL TAB ── */}
          {tab === 'url' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#C47D0E', marginBottom: 6 }}>IMAGE URL</div>
              <div style={{ position: 'relative' }}>
                <Link2 size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  autoFocus
                  value={urlInput}
                  onChange={e => { setUrlInput(e.target.value); setError('') }}
                  onKeyDown={e => { if (e.key === 'Enter' && urlInput.trim()) handleConfirm() }}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: '100%', height: 38, padding: '0 12px 0 34px',
                    border: '1px solid #E2E8F0', borderRadius: 6,
                    fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#0F172A',
                    background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#C47D0E' }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0' }}
                />
              </div>
              {/* URL preview */}
              {urlInput.trim() && (
                <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                  <img
                    src={urlInput.trim()}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: 160, objectFit: 'cover', display: 'block' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, marginBottom: 12 }}>
              <AlertCircle size={13} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#DC2626', lineHeight: 1.4 }}>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{ flex: 1, height: 36, border: '1px solid #E2E8F0', borderRadius: 6, background: 'transparent', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#374151' }}>
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm || uploading}
              style={{
                flex: 1, height: 36, border: 'none', borderRadius: 6,
                background: canConfirm && !uploading ? '#C47D0E' : '#E2E8F0',
                cursor: canConfirm && !uploading ? 'pointer' : 'not-allowed',
                fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: canConfirm && !uploading ? '#FFFFFF' : '#94A3B8',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
            >
              {uploading ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Uploading…</> : 'Insert Image'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
