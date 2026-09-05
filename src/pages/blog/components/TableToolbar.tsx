import { useEffect, useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'
import {
  Trash2, Plus, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Split, Rows, Columns, Check, Table2, X
} from 'lucide-react'

interface TableToolbarProps {
  editor: Editor | null
}

export default function TableToolbar({ editor }: TableToolbarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inTable, setInTable] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (!editor) return

    const update = () => {
      const active = editor.isActive('table')
      setInTable(active)

      if (!active) {
        setPos(null)
        return
      }

      // Find table DOM element coordinates
      const { from } = editor.state.selection
      const dom = editor.view.domAtPos(from).node as HTMLElement
      const tableEl = dom instanceof HTMLElement ? dom.closest('table') : null

      if (tableEl) {
        const rect = tableEl.getBoundingClientRect()
        setPos({
          top: Math.max(56, rect.top - 46),
          left: Math.max(12, rect.left),
        })
      } else {
        const coords = editor.view.coordsAtPos(from)
        setPos({
          top: Math.max(56, coords.top - 46),
          left: Math.max(12, coords.left),
        })
      }
    }

    editor.on('selectionUpdate', update)
    editor.on('transaction', update)
    window.addEventListener('resize', update)
    document.addEventListener('scroll', update, true)

    return () => {
      editor.off('selectionUpdate', update)
      editor.off('transaction', update)
      window.removeEventListener('resize', update)
      document.removeEventListener('scroll', update, true)
    }
  }, [editor])

  if (!editor || !inTable || !pos) return null

  const btnStyle = (danger = false, active = false): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    height: 28,
    padding: '0 8px',
    border: danger ? '1px solid #FECACA' : '1px solid #E2E8F0',
    borderRadius: 5,
    background: danger ? '#FEF2F2' : active ? '#FEF3C7' : '#FFFFFF',
    color: danger ? '#DC2626' : active ? '#C47D0E' : '#334155',
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 500,
    fontFamily: 'Outfit, sans-serif',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
  })

  const divider = (
    <div style={{ width: 1, height: 18, background: '#E2E8F0', margin: '0 2px' }} />
  )

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 6px',
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderRadius: 8,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)',
        pointerEvents: 'all',
        maxWidth: 'calc(100vw - 24px)',
        overflowX: 'auto',
      }}
    >
      {/* Table Label Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px', color: '#64748B', fontSize: 11, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
        <Table2 size={13} color="#C47D0E" />
        <span style={{ letterSpacing: '0.05em' }}>TABLE</span>
      </div>

      {divider}

      {/* Row Operations */}
      <button
        title="Insert Row Above"
        style={btnStyle()}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().addRowBefore().run() }}
      >
        <ArrowUp size={12} /> Row Above
      </button>

      <button
        title="Insert Row Below"
        style={btnStyle()}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().addRowAfter().run() }}
      >
        <ArrowDown size={12} /> Row Below
      </button>

      <button
        title="Delete Current Row"
        style={btnStyle(true)}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().deleteRow().run() }}
      >
        <Rows size={12} /> Del Row
      </button>

      {divider}

      {/* Column Operations */}
      <button
        title="Insert Column Left"
        style={btnStyle()}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().addColumnBefore().run() }}
      >
        <ArrowLeft size={12} /> Col Left
      </button>

      <button
        title="Insert Column Right"
        style={btnStyle()}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().addColumnAfter().run() }}
      >
        <ArrowRight size={12} /> Col Right
      </button>

      <button
        title="Delete Current Column"
        style={btnStyle(true)}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().deleteColumn().run() }}
      >
        <Columns size={12} /> Del Col
      </button>

      {divider}

      {/* Toggle Header Row */}
      <button
        title="Toggle Header Row"
        style={btnStyle(false, editor.isActive('tableHeader'))}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHeaderRow().run() }}
      >
        Header
      </button>

      {/* Merge or Split */}
      <button
        title="Merge or Split Selected Cells"
        style={btnStyle()}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().mergeOrSplit().run() }}
      >
        <Split size={12} /> Merge/Split
      </button>

      {divider}

      {/* DELETE ENTIRE TABLE - PROMINENT RED BUTTON */}
      <button
        title="Delete Entire Table (Delete Table)"
        style={{
          ...btnStyle(true),
          background: '#DC2626',
          color: '#FFFFFF',
          borderColor: '#B91C1C',
          fontWeight: 700,
          padding: '0 10px',
        }}
        onMouseDown={e => {
          e.preventDefault()
          editor.chain().focus().deleteTable().run()
        }}
      >
        <Trash2 size={13} color="#FFFFFF" /> Delete Table
      </button>
    </div>
  )
}
