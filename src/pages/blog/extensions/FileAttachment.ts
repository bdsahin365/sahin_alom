import { Node, mergeAttributes } from '@tiptap/react'

export interface FileAttachmentAttrs {
  name: string
  url: string
  size: number
  fileType: string
}

const ICONS: Record<string, string> = {
  pdf: '📄', zip: '📦', rar: '📦', '7z': '📦', tar: '📦',
  xlsx: '📊', xls: '📊', csv: '📊',
  dwg: '📐', dxf: '📐', svg: '📐',
  drawio: '🗂️', xml: '🗂️',
  docx: '📝', doc: '📝', txt: '📝', md: '📝',
}

const COLORS: Record<string, string> = {
  pdf: '#EF4444', zip: '#F97316', rar: '#F97316', '7z': '#F97316', tar: '#F97316',
  xlsx: '#16A34A', xls: '#16A34A', csv: '#16A34A',
  dwg: '#6366F1', dxf: '#6366F1', svg: '#6366F1',
  drawio: '#C47D0E', xml: '#C47D0E',
}

function bytesToSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export const FileAttachment = Node.create({
  name: 'fileAttachment',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      name:     { default: '' },
      url:      { default: '' },
      size:     { default: 0 },
      fileType: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="file-attachment"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'file-attachment' })]
  },

  addNodeView() {
    return ({ node }) => {
      const { name, url, size } = node.attrs as FileAttachmentAttrs
      const ext = name.split('.').pop()?.toLowerCase() ?? 'file'
      const icon = ICONS[ext] ?? '📎'
      const color = COLORS[ext] ?? '#64748B'

      const dom = document.createElement('div')
      dom.setAttribute('data-type', 'file-attachment')
      dom.style.cssText = 'margin:12px 0;'

      dom.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:1px solid #E2E8F0;border-left:4px solid ${color};border-radius:8px;background:#FAFAFA;font-family:Outfit,sans-serif;">
          <span style="font-size:20px;flex-shrink:0;">${icon}</span>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;color:#0F172A;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</div>
            <div style="font-size:11px;color:#94A3B8;margin-top:2px;">${ext.toUpperCase()} · ${bytesToSize(size)}</div>
          </div>
          <a href="${url}" target="_blank" rel="noreferrer" download="${name}"
            style="display:flex;align-items:center;gap:6px;padding:6px 12px;background:${color};color:#fff;text-decoration:none;border-radius:5px;font-size:11px;font-weight:600;letter-spacing:0.08em;font-family:JetBrains Mono,monospace;flex-shrink:0;white-space:nowrap;"
            onclick="event.stopPropagation()">
            ⬇ DOWNLOAD
          </a>
        </div>
      `

      return { dom }
    }
  },
})
