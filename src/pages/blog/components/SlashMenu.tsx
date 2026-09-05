import { useEffect, useRef, useState, forwardRef } from 'react'
import {
  Type, Heading1, Heading2, Heading3, Heading4,
  List, ListOrdered, ListChecks, Quote, Minus, Image, Table2,
  Code2, Video, AlertCircle, Sigma, Calculator, GitBranch, Zap,
  BookOpen, Link, Files, Trash2,
} from 'lucide-react'

export type SlashItem = {
  id: string
  title: string
  description: string
  category: string
  icon: React.ReactNode
  shortcut?: string
  command: (editor: any) => void
}

const CATEGORIES = ['BASIC', 'RICH CONTENT', 'ENGINEERING', 'CODE', 'DOCUMENTATION']

export function buildSlashItems(editor: any): SlashItem[] {
  return [
    // BASIC
    {
      id: 'paragraph', title: 'Text', description: 'Plain paragraph', category: 'BASIC',
      icon: <Type size={14} />, shortcut: 'Enter',
      command: () => editor.chain().focus().setParagraph().run(),
    },
    {
      id: 'h1', title: 'Heading 1', description: 'Large section header', category: 'BASIC',
      icon: <Heading1 size={14} />, shortcut: '#',
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      id: 'h2', title: 'Heading 2', description: 'Subsection header', category: 'BASIC',
      icon: <Heading2 size={14} />, shortcut: '##',
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: 'h3', title: 'Heading 3', description: 'Sub-subsection', category: 'BASIC',
      icon: <Heading3 size={14} />, shortcut: '###',
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      id: 'h4', title: 'Heading 4', description: 'Minor heading', category: 'BASIC',
      icon: <Heading4 size={14} />,
      command: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    },
    {
      id: 'bullet', title: 'Bullet List', description: 'Unordered list', category: 'BASIC',
      icon: <List size={14} />, shortcut: '-',
      command: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      id: 'ordered', title: 'Numbered List', description: 'Ordered list', category: 'BASIC',
      icon: <ListOrdered size={14} />, shortcut: '1.',
      command: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      id: 'task', title: 'Task List', description: 'Checkbox list', category: 'BASIC',
      icon: <ListChecks size={14} />,
      command: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      id: 'quote', title: 'Quote', description: 'Block quotation', category: 'BASIC',
      icon: <Quote size={14} />, shortcut: '>',
      command: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      id: 'divider', title: 'Divider', description: 'Horizontal rule', category: 'BASIC',
      icon: <Minus size={14} />, shortcut: '---',
      command: () => editor.chain().focus().setHorizontalRule().run(),
    },
    // RICH CONTENT
    {
      id: 'image', title: 'Image', description: 'Upload or drag & drop', category: 'RICH CONTENT',
      icon: <Image size={14} />,
      command: (ed: any) => { ed.__openImageModal?.() },
    },
    {
      id: 'table', title: 'Table', description: 'Insert a 3×3 table', category: 'RICH CONTENT',
      icon: <Table2 size={14} />,
      command: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      id: 'delete-table', title: 'Delete Table', description: 'Delete current table', category: 'RICH CONTENT',
      icon: <Trash2 size={14} />,
      command: () => editor.chain().focus().deleteTable().run(),
    },
    {
      id: 'youtube', title: 'YouTube Video', description: 'Paste a YouTube URL', category: 'RICH CONTENT',
      icon: <Video size={14} />,
      command: () => {
        const src = window.prompt('YouTube URL:')
        if (src) editor.chain().focus().setYoutubeVideo({ src }).run()
      },
    },
    {
      id: 'callout-info', title: 'Callout — Info', description: 'Note block', category: 'RICH CONTENT',
      icon: <AlertCircle size={14} />,
      command: () => {
        editor.chain().focus().insertContent({
          type: 'blockquote',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '💡 Note: …' }] }],
        }).run()
      },
    },
    // ENGINEERING
    {
      id: 'math', title: 'Math Equation', description: 'LaTeX display equation', category: 'ENGINEERING',
      icon: <Sigma size={14} />, shortcut: 'Ctrl+E',
      command: (ed: any) => { ed.__openMathModal?.() },
    },
    {
      id: 'calc', title: 'Engineering Calculation', description: 'Step-by-step calculation block', category: 'ENGINEERING',
      icon: <Calculator size={14} />,
      command: (ed: any) => { ed.__openCalcModal?.() },
    },
    {
      id: 'mermaid', title: 'Mermaid Diagram', description: 'Flowchart, sequence, state', category: 'ENGINEERING',
      icon: <GitBranch size={14} />,
      command: (ed: any) => { ed.__openMermaidModal?.() },
    },
    {
      id: 'electrical', title: 'Electrical Diagram', description: 'SVG, draw.io, single line', category: 'ENGINEERING',
      icon: <Zap size={14} />,
      command: () => {
        const url = window.prompt('Diagram image URL (SVG/PNG):')
        if (url) editor.chain().focus().setImage({ src: url }).run()
      },
    },
    // CODE
    {
      id: 'code', title: 'Code Block', description: 'Syntax highlighted code', category: 'CODE',
      icon: <Code2 size={14} />, shortcut: '```',
      command: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    // DOCUMENTATION
    {
      id: 'toc', title: 'Table of Contents', description: 'Auto-generated from headings', category: 'DOCUMENTATION',
      icon: <BookOpen size={14} />,
      command: () => {
        editor.chain().focus().insertContent('<p><strong>Table of Contents</strong></p>').run()
      },
    },
    {
      id: 'link', title: 'Link', description: 'Hyperlink', category: 'DOCUMENTATION',
      icon: <Link size={14} />, shortcut: 'Ctrl+K',
      command: () => {
        const url = window.prompt('URL:')
        if (url) editor.chain().focus().setLink({ href: url }).run()
      },
    },
    {
      id: 'file', title: 'File Attachment', description: 'PDF, ZIP, Excel, CAD, DWG', category: 'DOCUMENTATION',
      icon: <Files size={14} />,
      command: (ed: any) => { ed.__openFileModal?.() },
    },
  ]
}

interface SlashMenuProps {
  editor: any
  position: { top: number; left: number } | null
  query: string
  onClose: () => void
  onSelect: (item: SlashItem) => void
}

export default function SlashMenu({ editor, position, query, onClose, onSelect }: SlashMenuProps) {
  const [search, setSearch] = useState(query)
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const items = buildSlashItems(editor)
  const filtered = items.filter(it =>
    !search || it.title.toLowerCase().includes(search.toLowerCase()) || it.description.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => { setSearch(query) }, [query])
  useEffect(() => { setActiveIdx(0) }, [search])
  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter')     { e.preventDefault(); if (filtered[activeIdx]) onSelect(filtered[activeIdx]) }
      if (e.key === 'Escape')    { e.preventDefault(); onClose() }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [filtered, activeIdx, onSelect, onClose])

  // Auto-scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`) as HTMLElement
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  if (!position) return null

  // Group by category, preserve order
  const grouped: Record<string, SlashItem[]> = {}
  for (const cat of CATEGORIES) {
    const catItems = filtered.filter(it => it.category === cat)
    if (catItems.length) grouped[cat] = catItems
  }

  let globalIdx = 0

  return (
    <div
      style={{
        position: 'fixed', top: position.top, left: position.left,
        width: 320, maxHeight: 480, background: '#FFFFFF',
        border: '1px solid #E2E8F0', borderRadius: 10,
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        zIndex: 1000, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid #F1F5F9' }}>
        <span style={{ color: '#94A3B8', fontSize: 13 }}>⌕</span>
        <input
          ref={inputRef}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Type to filter…"
          style={{
            flex: 1, border: 'none', outline: 'none', fontFamily: 'Outfit,sans-serif',
            fontSize: 13, color: '#0F172A', background: 'transparent',
          }}
        />
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
      </div>

      {/* Items */}
      <div ref={listRef} style={{ overflowY: 'auto', flex: 1, padding: '4px 4px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: '#94A3B8', fontFamily: 'Outfit,sans-serif', fontSize: 13 }}>
            No blocks match "{search}"
          </div>
        ) : (
          Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat}>
              <div style={{
                fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em',
                color: '#C47D0E', padding: '8px 10px 4px', userSelect: 'none',
              }}>
                {cat}
              </div>
              {catItems.map(item => {
                const idx = globalIdx++
                const isActive = idx === activeIdx
                return (
                  <button
                    key={item.id}
                    data-idx={idx}
                    onClick={() => onSelect(item)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '8px 10px', border: 'none',
                      borderRadius: 6, cursor: 'pointer', textAlign: 'left',
                      background: isActive ? '#FEF3C7' : 'transparent',
                      borderLeft: isActive ? '3px solid #C47D0E' : '3px solid transparent',
                      transition: 'background 0.1s',
                    }}
                  >
                    <span style={{ color: isActive ? '#C47D0E' : '#64748B', flexShrink: 0, display: 'flex' }}>
                      {item.icon}
                    </span>
                    <span style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: 500, color: isActive ? '#92400E' : '#0F172A' }}>
                        {item.title}
                      </div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#94A3B8', marginTop: 1 }}>
                        {item.description}
                      </div>
                    </span>
                    {item.shortcut && (
                      <span style={{
                        fontFamily: 'JetBrains Mono,monospace', fontSize: 9,
                        background: '#F1F5F9', border: '1px solid #E2E8F0',
                        borderRadius: 4, padding: '2px 5px', color: '#64748B',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
