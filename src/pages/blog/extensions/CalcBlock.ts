import { Node, mergeAttributes } from '@tiptap/react'

export interface CalcGivenParam {
  label: string
  symbol?: string
  value: string
  unit?: string
  note?: string
}

export interface CalcNomenclature {
  symbol: string
  meaning: string
  unit?: string
}

export interface CalcStepItem {
  title?: string
  math: string
  explanation?: string
  highlight?: string
}

export interface CalcEquipmentSpec {
  label: string
  value: string
  badge?: string
}

export interface CalcBlockAttrs {
  title: string
  category?: string
  standardRef?: string
  given: CalcGivenParam[]
  formula: string
  nomenclature?: CalcNomenclature[]
  steps: (CalcStepItem | string)[]
  result: string
  resultUnit: string
  resultNote: string
  equipmentSpecs?: CalcEquipmentSpec[]
  interactiveType?: string
  defaultInputs?: Record<string, number | string>
}

export const CalcBlock = Node.create({
  name: 'calcBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title:           { default: 'Engineering Calculation & Sizing' },
      category:        { default: 'ELECTRICAL POWER DISTRIBUTION' },
      standardRef:     { default: 'BNBC 2020 Part 8 / IEC 60364' },
      given:           { default: [] },
      formula:         { default: '' },
      nomenclature:    { default: [] },
      steps:           { default: [] },
      result:          { default: '' },
      resultUnit:      { default: '' },
      resultNote:      { default: '' },
      equipmentSpecs:  { default: [] },
      interactiveType: { default: '' },
      defaultInputs:   { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="calc-block"]',
        getAttrs: dom => {
          if (typeof dom === 'string') return {}
          const element = dom as HTMLElement
          const raw = element.getAttribute('data-attrs')
          if (raw) {
            try {
              return JSON.parse(decodeURIComponent(raw))
            } catch {}
          }
          return {}
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const attrs: CalcBlockAttrs = node.attrs as CalcBlockAttrs
    const serialized = encodeURIComponent(JSON.stringify(attrs))

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'calc-block',
        'data-attrs': serialized,
        class: 'calc-block-wrapper',
      }),
      // Header
      [
        'div',
        { class: 'calc-block-header' },
        [
          'div',
          { class: 'calc-header-meta' },
          ['span', { class: 'calc-category-badge' }, `⚡ ${attrs.category || 'ENGINEERING CALCULATION'}`],
          attrs.standardRef ? ['span', { class: 'calc-standard-badge' }, `📜 ${attrs.standardRef}`] : '',
        ],
        ['h4', { class: 'calc-title' }, attrs.title || 'Engineering Calculation'],
      ],
      // Given Parameters Grid
      ...(attrs.given && attrs.given.length > 0
        ? [
            [
              'div',
              { class: 'calc-section calc-given-section' },
              [
                'div',
                { class: 'calc-section-head' },
                ['span', { class: 'calc-section-label' }, '1. GIVEN DESIGN PARAMETERS & ASSUMPTIONS'],
              ],
              [
                'div',
                { class: 'calc-given-grid' },
                ...attrs.given.map(g => [
                  'div',
                  { class: 'calc-given-card' },
                  [
                    'div',
                    { class: 'calc-given-top' },
                    ['span', { class: 'calc-given-label' }, g.label],
                    g.symbol ? ['span', { class: 'calc-given-symbol' }, g.symbol] : '',
                  ],
                  [
                    'div',
                    { class: 'calc-given-val-row' },
                    ['span', { class: 'calc-given-val' }, g.value],
                    g.unit ? ['span', { class: 'calc-given-unit' }, ` ${g.unit}`] : '',
                  ],
                  g.note ? ['span', { class: 'calc-given-note' }, g.note] : '',
                ]),
              ],
            ],
          ]
        : []),
      // Formula Section & Nomenclature
      ...(attrs.formula
        ? [
            [
              'div',
              { class: 'calc-section calc-formula-section' },
              [
                'div',
                { class: 'calc-section-head' },
                ['span', { class: 'calc-section-label' }, '2. GOVERNING MATHEMATICAL EQUATION'],
              ],
              ['div', { class: 'calc-formula-display' }, `$$${attrs.formula.replace(/^\$\$|\$\$$/g, '')}$$`],
              ...(attrs.nomenclature && attrs.nomenclature.length > 0
                ? [
                    [
                      'div',
                      { class: 'calc-nomenclature-box' },
                      ['span', { class: 'calc-nomen-title' }, 'Variable Nomenclature & Units:'],
                      [
                        'div',
                        { class: 'calc-nomen-grid' },
                        ...attrs.nomenclature.map(n => [
                          'div',
                          { class: 'calc-nomen-item' },
                          ['span', { class: 'calc-nomen-sym' }, n.symbol],
                          ['span', { class: 'calc-nomen-eq' }, '='],
                          ['span', { class: 'calc-nomen-desc' }, `${n.meaning}${n.unit ? ` (${n.unit})` : ''}`],
                        ]),
                      ],
                    ],
                  ]
                : []),
            ],
          ]
        : []),
      // Step-by-Step Derivation
      ...(attrs.steps && attrs.steps.length > 0
        ? [
            [
              'div',
              { class: 'calc-section calc-steps-section' },
              [
                'div',
                { class: 'calc-section-head' },
                ['span', { class: 'calc-section-label' }, '3. STEP-BY-STEP MATHEMATICAL DERIVATION'],
              ],
              [
                'div',
                { class: 'calc-steps-list' },
                ...attrs.steps.map((s, idx) => {
                  if (typeof s === 'string') {
                    return [
                      'div',
                      { class: 'calc-step-row' },
                      ['span', { class: 'calc-step-badge' }, `Step ${idx + 1}`],
                      ['div', { class: 'calc-step-content' }, s],
                    ]
                  }
                  return [
                    'div',
                    { class: 'calc-step-card' },
                    [
                      'div',
                      { class: 'calc-step-header' },
                      ['span', { class: 'calc-step-badge' }, `Step ${idx + 1}`],
                      s.title ? ['span', { class: 'calc-step-title' }, s.title] : '',
                    ],
                    ['div', { class: 'calc-step-math' }, s.math],
                    s.explanation ? ['div', { class: 'calc-step-expl' }, `💡 Rationale: ${s.explanation}`] : '',
                  ]
                }),
              ],
            ],
          ]
        : []),
      // Result & Sizing Recommendation
      ...(attrs.result
        ? [
            [
              'div',
              { class: 'calc-result-box' },
              [
                'div',
                { class: 'calc-result-header' },
                ['span', { class: 'calc-result-tag' }, '4. FINAL COMPUTED RESULT'],
                attrs.standardRef ? ['span', { class: 'calc-compliance-tag' }, `✓ Compliant with ${attrs.standardRef}`] : '',
              ],
              [
                'div',
                { class: 'calc-result-main' },
                ['span', { class: 'calc-result-number' }, attrs.result],
                ['span', { class: 'calc-result-unit-large' }, attrs.resultUnit ? ` ${attrs.resultUnit}` : ''],
              ],
              ...(attrs.resultNote
                ? [['div', { class: 'calc-result-note-box' }, `🎯 Engineering Decision: ${attrs.resultNote}`]]
                : []),
              ...(attrs.equipmentSpecs && attrs.equipmentSpecs.length > 0
                ? [
                    [
                      'div',
                      { class: 'calc-equipment-specs-grid' },
                      ...attrs.equipmentSpecs.map(spec => [
                        'div',
                        { class: 'calc-spec-item' },
                        ['span', { class: 'calc-spec-lbl' }, spec.label],
                        ['span', { class: 'calc-spec-val' }, spec.value],
                        spec.badge ? ['span', { class: 'calc-spec-badge' }, spec.badge] : '',
                      ]),
                    ],
                  ]
                : []),
            ],
          ]
        : []),
    ]
  },

  addNodeView() {
    return ({ node, updateAttributes, editor }) => {
      const dom = document.createElement('div')
      dom.setAttribute('data-type', 'calc-block')

      const render = () => {
        const attrs: CalcBlockAttrs = node.attrs as CalcBlockAttrs
        const category = attrs.category || 'ELECTRICAL POWER CALCULATION'
        const standard = attrs.standardRef || 'BNBC 2020 / IEC 60364'

        dom.innerHTML = `
          <div class="calc-block-container" style="border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; margin: 24px 0; background: #FFFFFF; box-shadow: 0 4px 20px rgba(0,0,0,0.04); font-family: Outfit, sans-serif;">
            
            <!-- Top Header -->
            <div style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); padding: 16px 20px; color: #FFFFFF; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; border-bottom: 3px solid #C47D0E;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
                  <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.18em; background: #C47D0E; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: 700;">⚡ ${category}</span>
                  ${standard ? `<span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.12em; background: rgba(255,255,255,0.12); color: #F8FAFC; padding: 2px 8px; border-radius: 4px;">📜 ${standard}</span>` : ''}
                </div>
                <h4 style="margin: 0; font-size: 17px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.01em;">${attrs.title || 'Engineering Calculation & Sizing'}</h4>
              </div>
              <div style="display: flex; gap: 6px; align-items: center;">
                ${editor.isEditable ? '<button data-action="edit" style="background: #C47D0E; border: none; color: #FFFFFF; font-size: 11px; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px rgba(196,125,14,0.3);">✎ Edit Calculation</button>' : ''}
              </div>
            </div>

            <!-- Parameters Grid -->
            ${attrs.given?.length ? `
            <div style="padding: 16px 20px; background: #FAF8F5; border-bottom: 1px solid #F1F5F9;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.15em; color: #92400E; font-weight: 700; background: #FEF3C7; padding: 2px 7px; border-radius: 3px;">1. GIVEN PARAMETERS & ASSUMPTIONS</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px;">
                ${attrs.given.map(g => `
                  <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <span style="font-size: 11.5px; color: #64748B; font-weight: 500;">${g.label}</span>
                      ${g.symbol ? `<span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #C47D0E; font-weight: 700;">${g.symbol}</span>` : ''}
                    </div>
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: #0F172A;">
                      ${g.value} <span style="font-size: 12px; color: #475569; font-weight: 500;">${g.unit || ''}</span>
                    </div>
                    ${g.note ? `<div style="font-size: 10.5px; color: #94A3B8; margin-top: 3px;">ℹ️ ${g.note}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>` : ''}

            <!-- Governing Formula Section -->
            ${attrs.formula ? `
            <div style="padding: 16px 20px; border-bottom: 1px solid #F1F5F9; background: #FEFDF9;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.15em; color: #92400E; font-weight: 700; background: #FEF3C7; padding: 2px 7px; border-radius: 3px;">2. GOVERNING FORMULA & NOMENCLATURE</span>
              </div>
              <div style="background: #FFFFFF; border: 1px solid #F5E6C8; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 12px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);">
                <div class="calc-formula-raw" style="font-family: 'JetBrains Mono', monospace; font-size: 17px; color: #0F172A; font-weight: 600;">
                  $$${attrs.formula.replace(/^\$\$|\$\$$/g, '')}$$
                </div>
              </div>
              ${attrs.nomenclature?.length ? `
              <div style="background: #FAF8F5; border-radius: 6px; padding: 10px 14px; border: 1px solid #F1F5F9;">
                <div style="font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 6px; font-family: 'JetBrains Mono', monospace;">VARIABLES NOMENCLATURE:</div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 6px; font-size: 12px;">
                  ${attrs.nomenclature.map(n => `
                    <div style="display: flex; gap: 6px; align-items: baseline;">
                      <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #C47D0E;">${n.symbol}</span>
                      <span style="color: #94A3B8;">=</span>
                      <span style="color: #334155;">${n.meaning}${n.unit ? ` (${n.unit})` : ''}</span>
                    </div>
                  `).join('')}
                </div>
              </div>` : ''}
            </div>` : ''}

            <!-- Step-by-Step Derivation -->
            ${attrs.steps?.length ? `
            <div style="padding: 16px 20px; border-bottom: 1px solid #F1F5F9; background: #FFFFFF;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.15em; color: #92400E; font-weight: 700; background: #FEF3C7; padding: 2px 7px; border-radius: 3px;">3. STEP-BY-STEP MATHEMATICAL DERIVATION</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${attrs.steps.map((s, idx) => {
                  if (typeof s === 'string') {
                    return `
                      <div style="display: flex; gap: 10px; align-items: baseline; padding: 8px 12px; background: #FAF8F5; border-radius: 6px; border-left: 3px solid #C47D0E; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #334155;">
                        <span style="font-size: 10px; font-weight: 700; color: #C47D0E; background: #FEF3C7; padding: 1px 6px; border-radius: 3px;">Step ${idx + 1}</span>
                        <span>${s}</span>
                      </div>
                    `
                  }
                  return `
                    <div style="background: #FAF8F5; border-radius: 8px; border: 1px solid #F1F5F9; border-left: 3px solid #C47D0E; padding: 10px 14px;">
                      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #C47D0E; background: #FEF3C7; padding: 1px 6px; border-radius: 3px;">Step ${idx + 1}</span>
                        ${s.title ? `<span style="font-size: 13px; font-weight: 700; color: #0F172A;">${s.title}</span>` : ''}
                      </div>
                      <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: #1E293B; margin: 4px 0; font-weight: 600;">${s.math}</div>
                      ${s.explanation ? `<div style="font-size: 11.5px; color: #64748B; margin-top: 4px; font-style: italic;">💡 ${s.explanation}</div>` : ''}
                    </div>
                  `
                }).join('')}
              </div>
            </div>` : ''}

            <!-- Final Result & Sizing Selection -->
            ${attrs.result ? `
            <div style="background: linear-gradient(180deg, #FEF9EC 0%, #FEF3C7 100%); padding: 20px; border-top: 1px solid #F5E6C8;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.2em; color: #92400E; font-weight: 700;">4. FINAL SIZING & EQUIPMENT SELECTION</span>
                ${standard ? `<span style="font-size: 11px; color: #16A34A; font-weight: 600; display: inline-flex; align-items: center; gap: 3px;">✓ Standard Compliant</span>` : ''}
              </div>
              <div style="font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 38px; color: #92400E; text-transform: uppercase; line-height: 1; margin: 4px 0 10px 0;">
                ${attrs.result} <span style="font-size: 22px; color: #B45309; font-weight: 600;">${attrs.resultUnit || ''}</span>
              </div>
              ${attrs.resultNote ? `
                <div style="background: rgba(255,255,255,0.85); border-left: 3px solid #C47D0E; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #334155; line-height: 1.5; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                  🎯 <strong>Engineering Recommendation:</strong> ${attrs.resultNote}
                </div>
              ` : ''}

              ${attrs.equipmentSpecs?.length ? `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; margin-top: 10px;">
                ${attrs.equipmentSpecs.map(spec => `
                  <div style="background: #FFFFFF; border: 1px solid #F5E6C8; border-radius: 6px; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px;">
                    <span style="font-size: 10.5px; color: #78350F; text-transform: uppercase; font-weight: 600; font-family: 'JetBrains Mono', monospace;">${spec.label}</span>
                    <span style="font-size: 13px; font-weight: 700; color: #0F172A;">${spec.value}</span>
                    ${spec.badge ? `<span style="font-size: 9.5px; color: #16A34A; font-weight: 600;">${spec.badge}</span>` : ''}
                  </div>
                `).join('')}
              </div>` : ''}
            </div>` : ''}

          </div>
        `

        // Wire edit button
        const editBtn = dom.querySelector('[data-action="edit"]')
        if (editBtn) {
          editBtn.addEventListener('click', () => {
            const w = editor as any
            if (w.__openCalcModal) {
              w.__openCalcModal()
            }
          })
        }
      }

      render()
      return {
        dom,
        update: updatedNode => {
          if (updatedNode.type.name !== 'calcBlock') return false
          render()
          return true
        },
      }
    }
  },
})
