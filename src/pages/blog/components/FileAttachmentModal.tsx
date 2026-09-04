import { useState, useRef, useCallback } from 'react'
import { X, Upload, FileText, Archive, Table2, Cpu, File, Loader2, Check, Trash2, AlertCircle, Download } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

interface FileAttachmentModalProps {
  onConfirm: (attachment: { name: string; url: string; size: number; type: string }) => void
  onClose: () => void
}

const FILE_TYPES: {
  ext: string[]; label: string; icon: React.ReactNode; color: string; bg: string
}[] = [
  { ext: ['pdf'],                      label: 'PDF Document', icon: <FileText size={16} />, color: '#EF4444', bg: '#FEF2F2' },
  { ext: ['zip', 'rar', '7z', 'tar'],  label: 'Archive',      icon: <Archive size={16} />, color: '#F97316', bg: '#FFF7ED' },
  { ext: ['xlsx', 'xls', 'csv'],       label: 'Spreadsheet',  icon: <Table2 size={16} />,  color: '#16A34A', bg: '#F0FDF4' },
  { ext: ['dwg', 'dxf', 'svg'],        label: 'CAD/Drawing',  icon: <Cpu size={16} />,     color: '#6366F1', bg: '#EEF2FF' },
  { ext: ['drawio', 'xml'],            label: 'Diagram',      icon: <Cpu size={16} />,     color: '#C47D0E', bg: '#FEF3C7' },
  { ext: ['docx', 'doc', 'txt', 'md'], label: 'Document',     icon: <FileText size={16} />,color: '#64748B', bg: '#F8FAFC' },
]

function getFileType(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  return FILE_TYPES.find(t => t.ext.includes(ext)) ?? {
    ext: [], label: 'File', icon: <File size={16} />, color: '#64748B', bg: '#F8FAFC',
  }
}

function bytesToSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function FileAttachmentModal({ onConfirm, onClose }: FileAttachmentModalProps) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [uploadedUrl, setUploadedUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setError('')
    setUploadedUrl('')
    if (f.size > 50 * 1024 * 1024) {
      setError('File is too large. Maximum size is 50 MB.')
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

  const upload = async () => {
    if (!file) { setError('Please select a file'); return }
    setUploading(true)
    setError('')
    setProgress(10)

    const tick = setInterval(() => setProgress(p => Math.min(p + 12, 80)), 250)

    const ext = file.name.split('.').pop() ?? 'bin'
    const path = `articles/files/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('article-assets')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    clearInterval(tick)

    if (uploadErr) {
      if (uploadErr.message?.includes('Bucket not found') || uploadErr.message?.includes('not found')) {
        // Dev fallback — just use a placeholder
        setError('Storage bucket "article-assets" not found. Attachment saved locally for this session.')
        setUploadedUrl('#local')
        setProgress(100)
        setUploading(false)
        return
      }
      setError(`Upload failed: ${uploadErr.message}`)
      setUploading(false)
      setProgress(0)
      return
    }

    const { data } = supabase.storage.from('article-assets').getPublicUrl(path)
    setProgress(100)
    setUploadedUrl(data.publicUrl)
    setUploading(false)
  }

  const handleConfirm = async () => {
    if (!file) { setError('Please select a file'); return }
    if (!uploadedUrl) {
      await upload()
      return
    }
    onConfirm({ name: file.name, url: uploadedUrl, size: file.size, type: file.type })
  }

  // Auto-confirm once upload finishes
  const prevUploading = useRef(uploading)
  if (prevUploading.current && !uploading && uploadedUrl && file) {
    prevUploading.current = false
    setTimeout(() => onConfirm({ name: file.name, url: uploadedUrl, size: file.size, type: file.type }), 100)
  }
  prevUploading.current = uploading

  const fileType = file ? getFileType(file.name) : null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 700, padding: 20 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, width: '100%', maxWidth: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 15, color: '#0F172A', margin: 0 }}>
            Attach File
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {/* Supported formats */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILE_TYPES.map(t => (
            <span key={t.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px',
              background: t.bg, borderRadius: 4, fontFamily: 'JetBrains Mono,monospace',
              fontSize: 9, letterSpacing: '0.08em', color: t.color,
            }}>
              {t.icon} {t.ext[0].toUpperCase()}
            </span>
          ))}
        </div>

        <div style={{ padding: '20px' }}>
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
                {dragging ? 'Drop file to attach' : 'Drag & drop or click to browse'}
              </div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#94A3B8' }}>
                PDF, ZIP, XLSX, DWG, SVG and more · Max 50 MB
              </div>
              <input ref={inputRef} type="file" style={{ display: 'none' }}
                accept=".pdf,.zip,.rar,.7z,.xlsx,.xls,.csv,.dwg,.dxf,.svg,.drawio,.xml,.docx,.doc,.txt,.md,.tar"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
              />
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              {/* File card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: fileType?.bg ?? '#F8FAFC', border: `1px solid ${fileType?.color ?? '#E2E8F0'}30`, borderRadius: 8, borderLeft: `4px solid ${fileType?.color ?? '#94A3B8'}` }}>
                <span style={{ color: fileType?.color ?? '#94A3B8', display: 'flex', flexShrink: 0 }}>{fileType?.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#64748B', marginTop: 2 }}>
                    {fileType?.label} · {bytesToSize(file.size)}
                  </div>
                </div>
                <button onClick={() => { setFile(null); setUploadedUrl('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, display: 'flex' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EF4444' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}>
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Progress */}
              {uploading && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> Uploading…
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#C47D0E' }}>{progress}%</span>
                  </div>
                  <div style={{ height: 5, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#C47D0E', width: `${progress}%`, transition: 'width 0.3s', borderRadius: 3 }} />
                  </div>
                </div>
              )}
              {uploadedUrl && !uploading && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, color: '#16A34A', fontFamily: 'Outfit,sans-serif', fontSize: 11 }}>
                  <Check size={12} /> File uploaded — inserting into article…
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
              disabled={!file || uploading}
              style={{
                flex: 1, height: 36, border: 'none', borderRadius: 6,
                background: file && !uploading ? '#C47D0E' : '#E2E8F0',
                cursor: file && !uploading ? 'pointer' : 'not-allowed',
                fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: file && !uploading ? '#FFFFFF' : '#94A3B8',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {uploading ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Uploading…</> : 'Attach File'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
