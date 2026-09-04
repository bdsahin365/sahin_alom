import { Node, mergeAttributes } from '@tiptap/react'

export interface CalcBlockAttrs {
  title: string
  given: { label: string; value: string; unit: string }[]
  formula: string
  steps: string[]
  result: string
  resultUnit: string
  resultNote: string
}

export const CalcBlock = Node.create({
  name: 'calcBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title:      { default: 'Untitled Calculation' },
      given:      { default: [] },
      formula:    { default: '' },
      steps:      { default: [] },
      result:     { default: '' },
      resultUnit: { default: '' },
      resultNote: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="calc-block"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'calc-block' })]
  },

  addNodeView() {
    return ({ node, updateAttributes, editor }) => {
      const dom = document.createElement('div')
      dom.setAttribute('data-type', 'calc-block')

      const render = () => {
        const attrs: CalcBlockAttrs = node.attrs as CalcBlockAttrs
        dom.innerHTML = `
          <div class="calc-block-wrapper">
            <div class="calc-block-header">
              <span class="calc-label">CALCULATION</span>
              <span class="calc-title">${attrs.title || 'Untitled Calculation'}</span>
            </div>
            ${attrs.given?.length ? `
            <div class="calc-section">
              <span class="calc-section-label">GIVEN</span>
              ${attrs.given.map((g: { label: string; value: string; unit: string }) => `
                <div class="calc-given-row">
                  <span class="calc-given-label">${g.label}</span>
                  <span class="calc-given-value">${g.value}${g.unit ? ' ' + g.unit : ''}</span>
                </div>`).join('')}
            </div>` : ''}
            ${attrs.formula ? `
            <div class="calc-section calc-formula-section">
              <span class="calc-section-label">FORMULA</span>
              <div class="calc-formula">${attrs.formula}</div>
            </div>` : ''}
            ${attrs.steps?.length ? `
            <div class="calc-section">
              <span class="calc-section-label">SOLUTION</span>
              ${attrs.steps.map((s: string) => `<div class="calc-step">${s}</div>`).join('')}
            </div>` : ''}
            ${attrs.result ? `
            <div class="calc-result-section">
              <span class="calc-result-label">RESULT</span>
              <div class="calc-result-value">${attrs.result}<span class="calc-result-unit"> ${attrs.resultUnit || ''}</span></div>
              ${attrs.resultNote ? `<div class="calc-result-note">${attrs.resultNote}</div>` : ''}
            </div>` : ''}
          </div>
        `

        if (editor.isEditable) {
          const editBtn = document.createElement('button')
          editBtn.className = 'calc-edit-btn'
          editBtn.textContent = '✎ Edit Block'
          editBtn.onclick = () => {
            const title = window.prompt('Calculation title:', attrs.title)
            if (title !== null) updateAttributes({ title })
          }
          dom.appendChild(editBtn)
        }
      }

      render()
      return { dom }
    }
  },
})
