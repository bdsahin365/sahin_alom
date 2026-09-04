import { Node, mergeAttributes } from '@tiptap/react'

export const MermaidBlock = Node.create({
  name: 'mermaidBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      code:    { default: 'graph TD\n  A[Start] --> B[End]' },
      caption: { default: '' },
      figNum:  { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="mermaid-block"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'mermaid-block' })]
  },

  addNodeView() {
    return ({ node, updateAttributes, editor }) => {
      const dom = document.createElement('div')
      dom.setAttribute('data-type', 'mermaid-block')
      dom.style.cssText = 'border:1px solid #E2E8F0;border-radius:8px;overflow:hidden;margin:16px 0;'

      const render = () => {
        const { code, caption, figNum } = node.attrs
        dom.innerHTML = `
          <div style="display:flex;border-bottom:1px solid #E2E8F0;">
            <div style="flex:1;padding:12px 16px;background:#0F172A;border-right:1px solid #334155;">
              <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.15em;color:#C47D0E;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
                DIAGRAM CODE
                ${editor.isEditable ? '<button data-action="edit" style="background:none;border:1px solid #334155;color:#94A3B8;font-size:10px;padding:2px 8px;border-radius:4px;cursor:pointer;font-family:Outfit,sans-serif;">Edit</button>' : ''}
              </div>
              <pre style="margin:0;font-family:'JetBrains Mono',monospace;font-size:12px;color:#C47D0E;line-height:1.6;white-space:pre-wrap;">${code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
            </div>
            <div style="flex:1;padding:12px 16px;background:#F8FAFC;">
              <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.15em;color:#C47D0E;margin-bottom:8px;">VISUAL PREVIEW</div>
              <div class="mermaid-preview" data-code="${encodeURIComponent(code)}" style="min-height:80px;display:flex;align-items:center;justify-content:center;color:#94A3B8;font-size:12px;font-family:Outfit,sans-serif;">
                ⟳ Rendering diagram…
              </div>
            </div>
          </div>
          ${caption || figNum ? `
          <div style="padding:8px 16px;background:#FAFAFA;border-top:1px solid #F1F5F9;">
            <span style="font-family:Outfit,sans-serif;font-size:12px;color:#64748B;font-style:italic;">${figNum ? figNum + ': ' : ''}${caption}</span>
          </div>` : ''}
        `

        // Wire edit button
        const editBtn = dom.querySelector('[data-action="edit"]')
        if (editBtn) {
          editBtn.addEventListener('click', () => {
            const newCode = window.prompt('Mermaid diagram code:', code)
            if (newCode !== null) updateAttributes({ code: newCode })
          })
        }

        // Attempt Mermaid render (if mermaid is loaded)
        const preview = dom.querySelector('.mermaid-preview') as HTMLElement
        if (preview) {
          const w = window as any
          if (w.mermaid) {
            const id = 'mermaid-' + Math.random().toString(36).slice(2)
            w.mermaid.render(id, code).then(({ svg }: { svg: string }) => {
              preview.innerHTML = svg
            }).catch(() => {
              preview.innerHTML = '<span style="color:#94A3B8;font-size:11px;">Preview unavailable in editor</span>'
            })
          } else {
            preview.innerHTML = '<span style="color:#94A3B8;font-size:11px;font-family:Outfit,sans-serif;">Mermaid preview renders in article view</span>'
          }
        }
      }

      render()
      return { dom, update: () => { render(); return true } }
    }
  },
})
