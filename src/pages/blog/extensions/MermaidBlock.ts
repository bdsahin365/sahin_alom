import { Node, mergeAttributes } from '@tiptap/react'

export interface MermaidLegendItem {
  symbol: string
  label: string
  desc: string
  color?: string
}

export interface MermaidPowerFlowStep {
  stepNum: number
  title: string
  desc: string
}

export interface MermaidBlockAttrs {
  code: string
  caption: string
  figNum: string
  category?: string
  voltageTier?: string
  standardRef?: string
  legend?: MermaidLegendItem[]
  steps?: MermaidPowerFlowStep[]
}

export const MermaidBlock = Node.create({
  name: 'mermaidBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      code:        { default: 'graph TD\n  A[Start] --> B[End]' },
      caption:     { default: '' },
      figNum:      { default: '' },
      category:    { default: 'ELECTRICAL POWER SCHEMATIC & SLD' },
      voltageTier: { default: '33kV / 11kV / 0.415kV' },
      standardRef: { default: 'BNBC 2020 Part 8 / IEC 60364' },
      legend:      { default: [] },
      steps:       { default: [] },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="mermaid-block"]',
        getAttrs: dom => {
          if (typeof dom === 'string') return {}
          const el = dom as HTMLElement
          const raw = el.getAttribute('data-attrs')
          if (raw) {
            try {
              return JSON.parse(decodeURIComponent(raw))
            } catch {}
          }
          return {
            code: el.getAttribute('data-code') || el.innerText,
            caption: el.getAttribute('data-caption') || '',
            figNum: el.getAttribute('data-fig') || '',
            category: el.getAttribute('data-category') || 'ELECTRICAL POWER SCHEMATIC & SLD',
            voltageTier: el.getAttribute('data-voltage') || '',
            standardRef: el.getAttribute('data-standard') || '',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const attrs: MermaidBlockAttrs = {
      code: node.attrs.code || 'graph TD\n  A --> B',
      caption: node.attrs.caption || '',
      figNum: node.attrs.figNum || '',
      category: node.attrs.category || 'ELECTRICAL POWER SCHEMATIC & SLD',
      voltageTier: node.attrs.voltageTier || '',
      standardRef: node.attrs.standardRef || '',
      legend: node.attrs.legend || [],
      steps: node.attrs.steps || [],
    }

    const serialized = encodeURIComponent(JSON.stringify(attrs))

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'mermaid-block',
        'data-attrs': serialized,
        'data-code': attrs.code,
        'data-caption': attrs.caption,
        'data-fig': attrs.figNum,
        class: 'mermaid-diagram-card',
      }),
      // Diagram Card Header
      [
        'div',
        { class: 'mermaid-diagram-header' },
        [
          'div',
          { class: 'mermaid-header-meta' },
          ['span', { class: 'mermaid-label' }, `📊 ${attrs.category}`],
          attrs.voltageTier ? ['span', { class: 'mermaid-voltage-badge' }, `⚡ ${attrs.voltageTier}`] : '',
          attrs.standardRef ? ['span', { class: 'mermaid-standard-badge' }, `📜 ${attrs.standardRef}`] : '',
        ],
        ...(attrs.figNum || attrs.caption
          ? [
              [
                'h4',
                { class: 'mermaid-title' },
                attrs.figNum ? `${attrs.figNum}: ` : '',
                attrs.caption || 'Electrical Schematic',
              ],
            ]
          : []),
      ],
      // Render Zone
      [
        'div',
        { class: 'mermaid-render-zone' },
        ['pre', { class: 'mermaid' }, attrs.code],
      ],
      // Electrical Legend & Abbreviations Drawer
      ...(attrs.legend && attrs.legend.length > 0
        ? [
            [
              'div',
              { class: 'mermaid-legend-container' },
              [
                'div',
                { class: 'mermaid-legend-head' },
                ['span', { class: 'mermaid-legend-title' }, '🔑 ELECTRICAL SYMBOLS & ABBREVIATIONS KEY'],
              ],
              [
                'div',
                { class: 'mermaid-legend-grid' },
                ...attrs.legend.map(item => [
                  'div',
                  { class: 'mermaid-legend-item' },
                  [
                    'span',
                    {
                      class: 'mermaid-legend-symbol',
                      style: item.color ? `border-left-color: ${item.color}; color: ${item.color}` : '',
                    },
                    item.symbol,
                  ],
                  ['span', { class: 'mermaid-legend-label' }, item.label],
                  ['span', { class: 'mermaid-legend-desc' }, item.desc],
                ]),
              ],
            ],
          ]
        : []),
      // Power Flow & Operating Sequence Steps
      ...(attrs.steps && attrs.steps.length > 0
        ? [
            [
              'div',
              { class: 'mermaid-flow-container' },
              [
                'div',
                { class: 'mermaid-flow-head' },
                ['span', { class: 'mermaid-flow-title' }, '⚡ POWER FLOW & OPERATING SEQUENCE'],
              ],
              [
                'div',
                { class: 'mermaid-flow-list' },
                ...attrs.steps.map(s => [
                  'div',
                  { class: 'mermaid-flow-step' },
                  ['span', { class: 'mermaid-flow-num' }, `${s.stepNum}`],
                  [
                    'div',
                    { class: 'mermaid-flow-content' },
                    ['span', { class: 'mermaid-flow-step-title' }, s.title],
                    ['span', { class: 'mermaid-flow-step-desc' }, s.desc],
                  ],
                ]),
              ],
            ],
          ]
        : []),
      // Caption Footer
      ...(attrs.caption
        ? [
            [
              'div',
              { class: 'mermaid-caption-footer' },
              ['span', { class: 'mermaid-caption-text' }, `${attrs.figNum ? attrs.figNum + ' — ' : ''}${attrs.caption}`],
            ],
          ]
        : []),
    ]
  },

  addNodeView() {
    return ({ node, updateAttributes, editor }) => {
      const dom = document.createElement('div')
      dom.setAttribute('data-type', 'mermaid-block')
      dom.style.cssText =
        'border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;margin:24px 0;background:#FFFFFF;box-shadow:0 4px 20px rgba(0,0,0,0.04);font-family:Outfit,sans-serif;'

      const render = () => {
        const attrs: MermaidBlockAttrs = {
          code: node.attrs.code || 'graph TD\n  A --> B',
          caption: node.attrs.caption || '',
          figNum: node.attrs.figNum || '',
          category: node.attrs.category || 'ELECTRICAL POWER SCHEMATIC & SLD',
          voltageTier: node.attrs.voltageTier || '',
          standardRef: node.attrs.standardRef || '',
          legend: node.attrs.legend || [],
          steps: node.attrs.steps || [],
        }

        dom.innerHTML = `
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); padding: 14px 20px; color: #FFFFFF; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; border-bottom: 3px solid #059669;">
            <div>
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px; flex-wrap: wrap;">
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.18em; background: #059669; color: #FFFFFF; padding: 2px 7px; border-radius: 4px; font-weight: 700;">📊 ${attrs.category}</span>
                ${attrs.voltageTier ? `<span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; background: rgba(255,255,255,0.15); color: #F8FAFC; padding: 2px 7px; border-radius: 4px;">⚡ ${attrs.voltageTier}</span>` : ''}
                ${attrs.figNum ? `<span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; background: rgba(196,125,14,0.3); color: #FEF3C7; padding: 2px 7px; border-radius: 4px; font-weight: 700;">${attrs.figNum}</span>` : ''}
              </div>
              <h4 style="margin: 0; font-size: 15px; font-weight: 700; color: #FFFFFF;">${attrs.caption || 'Electrical Diagram & Single Line Diagram'}</h4>
            </div>
            ${editor.isEditable ? '<button data-action="edit" style="background: #059669; border: none; color: #FFFFFF; font-size: 11px; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px rgba(5,150,105,0.3);">✎ Edit Diagram</button>' : ''}
          </div>

          <!-- Diagram View Area -->
          <div style="padding: 24px; background: #FFFFFF; display: flex; justify-content: center; overflow-x: auto;" class="mermaid-target-wrapper">
            <div class="mermaid-preview-container" style="min-height: 120px; display: flex; align-items: center; justify-content: center; color: #94A3B8; font-size: 12px; width: 100%;">
              Rendering electrical diagram…
            </div>
          </div>

          <!-- Legend / Glossary -->
          ${attrs.legend?.length ? `
          <div style="padding: 14px 20px; background: #FAF8F5; border-top: 1px solid #F1F5F9;">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.15em; color: #475569; font-weight: 700; margin-bottom: 8px;">🔑 ELECTRICAL SYMBOLS & ABBREVIATIONS:</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
              ${attrs.legend.map(item => `
                <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px 10px; display: flex; gap: 8px; align-items: center;">
                  <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${item.color || '#C47D0E'}; background: #FEF3C7; padding: 2px 6px; border-radius: 3px;">${item.symbol}</span>
                  <div>
                    <div style="font-size: 12px; font-weight: 600; color: #0F172A;">${item.label}</div>
                    <div style="font-size: 10.5px; color: #64748B;">${item.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>` : ''}

          <!-- Power Flow Steps -->
          ${attrs.steps?.length ? `
          <div style="padding: 14px 20px; background: #FEFDF9; border-top: 1px solid #F1F5F9;">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.15em; color: #92400E; font-weight: 700; margin-bottom: 8px;">⚡ POWER FLOW & OPERATING SEQUENCE:</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${attrs.steps.map(s => `
                <div style="display: flex; gap: 10px; align-items: baseline; font-size: 12.5px; color: #334155;">
                  <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; background: #059669; color: #FFFFFF; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${s.stepNum}</span>
                  <div>
                    <strong style="color: #0F172A;">${s.title}:</strong> ${s.desc}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>` : ''}

          ${attrs.caption ? `
          <div style="padding: 8px 16px; background: #FAF8F5; border-top: 1px solid #F1F5F9; text-align: center;">
            <span style="font-family: Outfit, sans-serif; font-size: 12px; color: #64748B; font-style: italic;">${attrs.figNum ? attrs.figNum + ': ' : ''}${attrs.caption}</span>
          </div>` : ''}
        `

        // Wire edit button
        const editBtn = dom.querySelector('[data-action="edit"]')
        if (editBtn) {
          editBtn.addEventListener('click', () => {
            const w = editor as any
            if (w.__openMermaidModal) {
              w.__openMermaidModal()
            }
          })
        }

        // Render Mermaid SVG
        const target = dom.querySelector('.mermaid-preview-container') as HTMLElement
        if (target) {
          const w = window as any
          if (w.mermaid) {
            const id = 'mermaid-editor-' + Math.random().toString(36).slice(2)
            try {
              w.mermaid.render(id, attrs.code).then(({ svg }: { svg: string }) => {
                if (target) target.innerHTML = svg
              }).catch(() => {
                if (target) target.innerHTML = `<pre style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#64748B;margin:0;overflow-x:auto;">${attrs.code}</pre>`
              })
            } catch {
              target.innerHTML = `<pre style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#64748B;margin:0;overflow-x:auto;">${attrs.code}</pre>`
            }
          } else {
            target.innerHTML = `<pre style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#64748B;margin:0;overflow-x:auto;">${attrs.code}</pre>`
          }
        }
      }

      render()
      return {
        dom,
        update: updatedNode => {
          if (updatedNode.type.name !== 'mermaidBlock') return false
          render()
          return true
        },
      }
    }
  },
})
