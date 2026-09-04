import { useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { Bold, Italic, Underline, Link, Highlighter, Code, MessageSquare, MoreHorizontal } from 'lucide-react'

interface FloatingToolbarProps {
  editor: Editor | null
}

export default function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editor) return
    const update = () => {
      const bar = ref.current
      if (!bar) return
      const { from, to } = editor.state.selection
      const hasSelection = from !== to && editor.state.selection.content().size > 0
      if (!hasSelection) { bar.style.display = 'none'; return }

      // Position above the selection
      const view = editor.view
      const start = view.coordsAtPos(from)
      const end = view.coordsAtPos(to)
      const midX = (start.left + end.right) / 2
      const top = Math.min(start.top, end.top)
      const rect = bar.getBoundingClientRect()
      bar.style.display = 'flex'
      bar.style.left = Math.max(8, midX - rect.width / 2) + 'px'
      bar.style.top = (top - 44 + window.scrollY) + 'px'
    }
    editor.on('selectionUpdate', update)
    editor.on('transaction', update)
    document.addEventListener('mouseup', update)
    return () => {
      editor.off('selectionUpdate', update)
      editor.off('transaction', update)
      document.removeEventListener('mouseup', update)
    }
  }, [editor])

  if (!editor) return null

  const btn = (
    onClick: () => void,
    icon: React.ReactNode,
    title: string,
    active = false
  ) => (
    <button
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick() }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 28, height: 28, border: 'none', borderRadius: 4,
        background: active ? '#FEF3C7' : 'transparent',
        color: active ? '#C47D0E' : '#374151',
        cursor: 'pointer', transition: 'all 0.1s', flexShrink: 0,
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#F1F5F9' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {icon}
    </button>
  )

  const divider = () => (
    <div style={{ width: 1, height: 18, background: '#E2E8F0', margin: '0 2px', flexShrink: 0 }} />
  )

  return (
    <div
      ref={ref}
      style={{
        display: 'none', position: 'fixed', zIndex: 200,
        alignItems: 'center', gap: 2, padding: '3px 5px',
        background: '#FFFFFF', border: '1px solid #E2E8F0',
        borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        pointerEvents: 'all',
      }}
    >
      {btn(() => editor.chain().focus().toggleBold().run(), <Bold size={13} />, 'Bold (Ctrl+B)', editor.isActive('bold'))}
      {btn(() => editor.chain().focus().toggleItalic().run(), <Italic size={13} />, 'Italic (Ctrl+I)', editor.isActive('italic'))}
      {btn(() => editor.chain().focus().toggleUnderline().run(), <Underline size={13} />, 'Underline (Ctrl+U)', editor.isActive('underline'))}
      {divider()}
      {btn(() => {
        const url = window.prompt('URL:', editor.getAttributes('link').href)
        if (url) editor.chain().focus().setLink({ href: url }).run()
        else editor.chain().focus().unsetLink().run()
      }, <Link size={13} />, 'Link (Ctrl+K)', editor.isActive('link'))}
      {btn(() => editor.chain().focus().toggleHighlight().run(), <Highlighter size={13} />, 'Highlight', editor.isActive('highlight'))}
      {btn(() => editor.chain().focus().toggleCode().run(), <Code size={13} />, 'Inline code', editor.isActive('code'))}
      {divider()}
      {btn(() => {}, <MessageSquare size={13} />, 'Add comment')}
      {btn(() => {}, <MoreHorizontal size={13} />, 'More formatting')}
    </div>
  )
}
