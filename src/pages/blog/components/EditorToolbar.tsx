import { useState, useRef, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Code2,
  Table as TableIcon,
  Image as ImageIcon,
  Paperclip,
  ChevronDown,
  Sigma,
  Calculator,
  GitGraph,
  Sparkles,
  Plus,
} from 'lucide-react'

// YouTube SVG icon
const YoutubeIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

interface EditorToolbarProps {
  editor: Editor | null
  onOpenImageModal: () => void
  onOpenFileModal: () => void
  onOpenMathModal: () => void
  onOpenCalcModal: () => void
  onOpenMermaidModal: () => void
  onOpenTableModal: () => void
  onOpenYoutubeModal: () => void
  onOpenLinkModal: () => void
}

export default function EditorToolbar({
  editor,
  onOpenImageModal,
  onOpenFileModal,
  onOpenMathModal,
  onOpenCalcModal,
  onOpenMermaidModal,
  onOpenTableModal,
  onOpenYoutubeModal,
  onOpenLinkModal,
}: EditorToolbarProps) {
  const [headingDropdownOpen, setHeadingDropdownOpen] = useState(false)
  const [alignDropdownOpen, setAlignDropdownOpen] = useState(false)
  const [listDropdownOpen, setListDropdownOpen] = useState(false)
  const [insertDropdownOpen, setInsertDropdownOpen] = useState(false)

  const headingRef = useRef<HTMLDivElement>(null)
  const alignRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const insertRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headingRef.current && !headingRef.current.contains(e.target as Node)) setHeadingDropdownOpen(false)
      if (alignRef.current && !alignRef.current.contains(e.target as Node)) setAlignDropdownOpen(false)
      if (listRef.current && !listRef.current.contains(e.target as Node)) setListDropdownOpen(false)
      if (insertRef.current && !insertRef.current.contains(e.target as Node)) setInsertDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!editor) return null

  // Active heading label
  let currentHeadingLabel = 'Normal Text'
  if (editor.isActive('heading', { level: 1 })) currentHeadingLabel = 'Heading 1'
  else if (editor.isActive('heading', { level: 2 })) currentHeadingLabel = 'Heading 2'
  else if (editor.isActive('heading', { level: 3 })) currentHeadingLabel = 'Heading 3'
  else if (editor.isActive('heading', { level: 4 })) currentHeadingLabel = 'Heading 4'

  const btn = (
    onClick: () => void,
    icon: React.ReactNode,
    title: string,
    active = false,
    disabled = false
  ) => (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        border: 'none',
        borderRadius: 5,
        background: active ? '#FEF3C7' : 'transparent',
        color: active ? '#C47D0E' : disabled ? '#CBD5E1' : '#334155',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        if (!active && !disabled) (e.currentTarget as HTMLElement).style.background = '#F1F5F9'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = active ? '#FEF3C7' : 'transparent'
      }}
    >
      {icon}
    </button>
  )

  const divider = () => (
    <div style={{ width: 1, height: 18, background: '#E2E8F0', margin: '0 3px', flexShrink: 0 }} />
  )

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '4px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        flexWrap: 'wrap',
        position: 'sticky',
        top: 0,
        zIndex: 45,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      {/* ── 1. HEADING / BLOCK TYPE DROPDOWN ── */}
      <div ref={headingRef} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setHeadingDropdownOpen(o => !o)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 30,
            padding: '0 8px',
            border: '1px solid #E2E8F0',
            borderRadius: 5,
            background: headingDropdownOpen ? '#FAF8F5' : '#FFFFFF',
            fontFamily: 'Outfit,sans-serif',
            fontSize: 12,
            fontWeight: 600,
            color: '#0F172A',
            cursor: 'pointer',
            minWidth: 105,
            justifyContent: 'space-between',
          }}
        >
          <span>{currentHeadingLabel}</span>
          <ChevronDown size={12} style={{ color: '#94A3B8' }} />
        </button>

        {headingDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: 34,
              left: 0,
              width: 170,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 100,
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <button
              onClick={() => {
                editor.chain().focus().setParagraph().run()
                setHeadingDropdownOpen(false)
              }}
              style={{
                textAlign: 'left',
                padding: '6px 10px',
                border: 'none',
                background: currentHeadingLabel === 'Normal Text' ? '#FEF3C7' : 'transparent',
                color: currentHeadingLabel === 'Normal Text' ? '#C47D0E' : '#334155',
                borderRadius: 4,
                fontFamily: 'Outfit,sans-serif',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Normal Text
            </button>

            {[1, 2, 3, 4].map(level => (
              <button
                key={level}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: level as any }).run()
                  setHeadingDropdownOpen(false)
                }}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  border: 'none',
                  background: currentHeadingLabel === `Heading ${level}` ? '#FEF3C7' : 'transparent',
                  color: currentHeadingLabel === `Heading ${level}` ? '#C47D0E' : '#334155',
                  borderRadius: 4,
                  fontFamily: 'Barlow Condensed, Outfit, sans-serif',
                  fontSize: 17 - level * 1,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                H{level} — Heading {level}
              </button>
            ))}
          </div>
        )}
      </div>

      {divider()}

      {/* ── 2. INLINE FORMATTING ── */}
      {btn(() => editor.chain().focus().toggleBold().run(), <Bold size={14} />, 'Bold (Ctrl+B)', editor.isActive('bold'))}
      {btn(() => editor.chain().focus().toggleItalic().run(), <Italic size={14} />, 'Italic (Ctrl+I)', editor.isActive('italic'))}
      {btn(() => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon size={14} />, 'Underline (Ctrl+U)', editor.isActive('underline'))}
      {btn(() => editor.chain().focus().toggleStrike().run(), <Strikethrough size={14} />, 'Strikethrough', editor.isActive('strike'))}
      {btn(() => editor.chain().focus().toggleCode().run(), <Code size={14} />, 'Inline Code', editor.isActive('code'))}
      {btn(() => editor.chain().focus().toggleHighlight().run(), <Highlighter size={14} />, 'Highlight', editor.isActive('highlight'))}

      {/* Hyperlink */}
      {btn(onOpenLinkModal, <Link2 size={14} />, 'Insert / Edit Link (Ctrl+K)', editor.isActive('link'))}

      {divider()}

      {/* ── 3. ALIGNMENT DROPDOWN ── */}
      <div ref={alignRef} style={{ position: 'relative' }}>
        <button
          type="button"
          title="Text Alignment"
          onClick={() => setAlignDropdownOpen(o => !o)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            border: 'none',
            borderRadius: 5,
            background: alignDropdownOpen ? '#F1F5F9' : 'transparent',
            color: '#334155',
            cursor: 'pointer',
          }}
        >
          {editor.isActive({ textAlign: 'center' }) ? (
            <AlignCenter size={14} />
          ) : editor.isActive({ textAlign: 'right' }) ? (
            <AlignRight size={14} />
          ) : editor.isActive({ textAlign: 'justify' }) ? (
            <AlignJustify size={14} />
          ) : (
            <AlignLeft size={14} />
          )}
        </button>

        {alignDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: 34,
              left: 0,
              width: 140,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 100,
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {[
              { label: 'Align Left', icon: <AlignLeft size={13} />, val: 'left' },
              { label: 'Align Center', icon: <AlignCenter size={13} />, val: 'center' },
              { label: 'Align Right', icon: <AlignRight size={13} />, val: 'right' },
              { label: 'Justify', icon: <AlignJustify size={13} />, val: 'justify' },
            ].map(al => (
              <button
                key={al.val}
                onClick={() => {
                  editor.chain().focus().setTextAlign(al.val).run()
                  setAlignDropdownOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  textAlign: 'left',
                  padding: '6px 10px',
                  border: 'none',
                  background: editor.isActive({ textAlign: al.val }) ? '#FEF3C7' : 'transparent',
                  color: editor.isActive({ textAlign: al.val }) ? '#C47D0E' : '#334155',
                  borderRadius: 4,
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {al.icon}
                <span>{al.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── 4. LISTS DROPDOWN ── */}
      <div ref={listRef} style={{ position: 'relative' }}>
        <button
          type="button"
          title="Lists & Checklists"
          onClick={() => setListDropdownOpen(o => !o)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            border: 'none',
            borderRadius: 5,
            background: listDropdownOpen ? '#F1F5F9' : 'transparent',
            color: '#334155',
            cursor: 'pointer',
          }}
        >
          {editor.isActive('orderedList') ? (
            <ListOrdered size={14} />
          ) : editor.isActive('taskList') ? (
            <CheckSquare size={14} />
          ) : (
            <List size={14} />
          )}
        </button>

        {listDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: 34,
              left: 0,
              width: 160,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 100,
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <button
              onClick={() => {
                editor.chain().focus().toggleBulletList().run()
                setListDropdownOpen(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                border: 'none',
                background: editor.isActive('bulletList') ? '#FEF3C7' : 'transparent',
                color: editor.isActive('bulletList') ? '#C47D0E' : '#334155',
                borderRadius: 4,
                fontFamily: 'Outfit,sans-serif',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              <List size={13} /> Bulleted List
            </button>

            <button
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run()
                setListDropdownOpen(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                border: 'none',
                background: editor.isActive('orderedList') ? '#FEF3C7' : 'transparent',
                color: editor.isActive('orderedList') ? '#C47D0E' : '#334155',
                borderRadius: 4,
                fontFamily: 'Outfit,sans-serif',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              <ListOrdered size={13} /> Numbered List
            </button>

            <button
              onClick={() => {
                editor.chain().focus().toggleTaskList().run()
                setListDropdownOpen(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                border: 'none',
                background: editor.isActive('taskList') ? '#FEF3C7' : 'transparent',
                color: editor.isActive('taskList') ? '#C47D0E' : '#334155',
                borderRadius: 4,
                fontFamily: 'Outfit,sans-serif',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              <CheckSquare size={13} /> Task Checklist
            </button>
          </div>
        )}
      </div>

      {divider()}

      {/* ── 5. BASIC BLOCKS: QUOTE, DIVIDER, CODE BLOCK ── */}
      {btn(() => editor.chain().focus().toggleBlockquote().run(), <Quote size={14} />, 'Blockquote', editor.isActive('blockquote'))}
      {btn(() => editor.chain().focus().toggleCodeBlock().run(), <Code2 size={14} />, 'Code Block (Lowlight)', editor.isActive('codeBlock'))}
      {btn(() => editor.chain().focus().setHorizontalRule().run(), <Minus size={14} />, 'Horizontal Line')}

      {divider()}

      {/* ── 6. SPECIAL INSERT DROPDOWN / QUICK BUTTONS ── */}
      {btn(onOpenImageModal, <ImageIcon size={14} />, 'Insert Image (Upload or URL)')}
      {btn(onOpenTableModal, <TableIcon size={14} />, 'Insert Table')}
      {btn(onOpenMathModal, <Sigma size={14} />, 'Insert Math Equation (KaTeX)')}
      {btn(onOpenCalcModal, <Calculator size={14} />, 'Insert Engineering Calculation Block')}
      {btn(onOpenMermaidModal, <GitGraph size={14} />, 'Insert Mermaid Diagram')}
      {btn(onOpenFileModal, <Paperclip size={14} />, 'Attach File (PDF, DWG, SLD)')}
      {btn(onOpenYoutubeModal, <YoutubeIcon size={14} />, 'Embed YouTube Video')}

      {/* Insert Mega Menu */}
      <div ref={insertRef} style={{ position: 'relative', marginLeft: 4 }}>
        <button
          type="button"
          onClick={() => setInsertDropdownOpen(o => !o)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            height: 28,
            padding: '0 10px',
            borderRadius: 5,
            border: '1px solid rgba(196,125,14,0.3)',
            background: insertDropdownOpen ? '#FEF3C7' : '#FAF8F5',
            fontFamily: 'Outfit,sans-serif',
            fontSize: 11.5,
            fontWeight: 700,
            color: '#C47D0E',
            cursor: 'pointer',
          }}
        >
          <Plus size={12} strokeWidth={2.5} /> Insert Block <ChevronDown size={11} />
        </button>

        {insertDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: 32,
              right: 0,
              width: 220,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 100,
              padding: 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {[
              { icon: <ImageIcon size={14} style={{ color: '#2563EB' }} />, label: 'Image (Upload / URL)', action: onOpenImageModal },
              { icon: <TableIcon size={14} style={{ color: '#0891B2' }} />, label: 'Table (Custom Grid)', action: onOpenTableModal },
              { icon: <Sigma size={14} style={{ color: '#9333EA' }} />, label: 'Math Formula (KaTeX)', action: onOpenMathModal },
              { icon: <Calculator size={14} style={{ color: '#C47D0E' }} />, label: 'Calculation Block', action: onOpenCalcModal },
              { icon: <GitGraph size={14} style={{ color: '#059669' }} />, label: 'Mermaid Diagram', action: onOpenMermaidModal },
              { icon: <Paperclip size={14} style={{ color: '#475569' }} />, label: 'File Attachment', action: onOpenFileModal },
              { icon: <YoutubeIcon size={14} style={{ color: '#DC2626' }} />, label: 'YouTube Video', action: onOpenYoutubeModal },
              { icon: <Link2 size={14} style={{ color: '#2563EB' }} />, label: 'Hyperlink', action: onOpenLinkModal },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInsertDropdownOpen(false)
                  item.action()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '7px 10px',
                  border: 'none',
                  background: 'transparent',
                  color: '#1E293B',
                  borderRadius: 5,
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.background = '#F8FAFC'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
