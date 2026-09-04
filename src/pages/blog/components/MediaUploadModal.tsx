import { useState, useRef, useCallback } from 'react'
import { X, Upload, Link2, Image as ImageIcon, Check, Loader2, Trash2, AlertCircle } from 'lucide-react'
import { compressAndConvertToBase64, formatBytes } from '../../../lib/imageUtils'

interface MediaUploadModalProps {
  /** Called with the final Base64 data URL or URL once user confirms */
  onConfirm: (url: string) => void
  onClose: () => void
  /** Label context – e.g. "Featured Image" or "Inline Image" */
  label?: string
  /** Accepted mime types */
  accept?: string
}

type Tab = 'upload' | 'url'

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
  const [compressionInfo, setCompressionInfo] = useState<{ original: number; compressed: number } | null>(null)
  const [error, setError] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (f: File) => {
    setError('')
    setUploadedUrl('')
    setCompressionInfo(null)
    const isImage = f.type.startsWith('image/')
    if (accept === 'image/*' && !isImage) {
      setError('Please select an image file (JPG, PNG, WebP, SVG, GIF)')
      return
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File is too large. Maximum size is 20 MB.')
      return
    }

    setFile(f)
    setUploading(true)

    try {
      const { base64, originalSize, compressedSize } = await compressAndConvertToBase64(f, {
        maxWidth: 1400,
        maxHeight: 1000,
        quality: 0.82,
        mimeType: 'image/jpeg',
      })
      setPreview(base64)
      setUploadedUrl(base64)
      setCompressionInfo({ original: originalSize, compressed: compressedSize })
    } catch (err: any) {
      setError('Failed to compress image: ' + (err?.message || 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const handleConfirm = () => {
    if (tab === 'url') {
      const url = urlInput.trim()
      if (!url) { setError('Please enter a URL'); return }
      onConfirm(url)
    } else {
      if (uploadedUrl) {
        onConfirm(uploadedUrl)
        return
      }
      if (!file) {
        setError('Please select a file')
      }
    }
  }

  const canConfirm = tab === 'url' ? !!urlInput.trim() : !!uploadedUrl

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 700, padding: 20 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 15, color: '#0F172A', margin: 0 }}>
              Add {label}
            </h2>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#64748B', marginTop: 2 }}>
              Uploads save directly to database as Base64 — no cloud storage needed
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, borderRadius: 4, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9' }}>
          {[
            { id: 'upload' as Tab, label: 'UPLOAD FROM DEVICE' },
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
                    borderRadius: 10, padding: '36px 20px', textAlign: 'center', cursor: 'pointer',
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
                    JPG, PNG, WebP, SVG · Compressed to Base64 automatically
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
                    <ImageIcon size={16} style={{ color: '#C47D0E', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8' }}>
                        {formatBytes(file.size)}
                        {compressionInfo && ` → ${formatBytes(compressionInfo.compressed)} (Base64)`}
                      </div>
                    </div>
                    <button onClick={() => { setFile(null); setPreview(''); setUploadedUrl(''); setCompressionInfo(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, display: 'flex', flexShrink: 0 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EF4444' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Progress / Status */}
                  {uploading && (
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#C47D0E', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Compressing to Base64…
                    </div>
                  )}
                  {uploadedUrl && !uploading && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, color: '#16A34A', fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500 }}>
                      <Check size={13} /> Ready to save to database ({compressionInfo ? `${formatBytes(compressionInfo.original)} → ${formatBytes(compressionInfo.compressed)}` : 'Compressed'})
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── URL TAB ── */}
          {tab === 'url' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#C47D0E', marginBottom: 6 }}>IMAGE URL OR BASE64</div>
              <div style={{ position: 'relative' }}>
                <Link2 size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  autoFocus
                  value={urlInput}
                  onChange={e => { setUrlInput(e.target.value); setError('') }}
                  onKeyDown={e => { if (e.key === 'Enter' && urlInput.trim()) handleConfirm() }}
                  placeholder="https://example.com/image.jpg or data:image/..."
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
              {uploading ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Compressing…</> : 'Insert Image'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
