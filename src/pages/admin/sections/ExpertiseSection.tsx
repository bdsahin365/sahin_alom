import { useState } from 'react'
import { useSite, ExpertiseItem } from '../../../context/SiteContext'
import {
  Section,
  ItemRow,
  Input,
  Textarea,
  TagChips,
  AddButton,
} from '../components/AdminPrimitives'

export default function ExpertiseSection() {
  const { data: { expertise }, updateExpertise } = useSite()
  const [exp, setExp] = useState<number | null>(null)
  const upd = (i: number, p: Partial<ExpertiseItem>) =>
    updateExpertise(expertise.map((e, j) => (j === i ? { ...e, ...p } : e)))
  const move = (i: number, d: 'up' | 'down') => {
    const n = [...expertise]
    const target = i + (d === 'up' ? -1 : 1)
    ;[n[i], n[target]] = [n[target], n[i]]
    updateExpertise(n)
  }

  return (
    <Section title="Technical Expertise" description={`${expertise.length} areas of practice`}>
      {expertise.map((e, i) => (
        <ItemRow
          key={e.id}
          label={e.title || <em style={{ color: '#94A3B8' }}>Untitled area</em>}
          meta={`${e.tags.length} tags`}
          expanded={exp === i}
          onToggle={() => setExp(exp === i ? null : i)}
          i={i}
          total={expertise.length}
          onDelete={() => {
            updateExpertise(expertise.filter((_, j) => j !== i))
            setExp(null)
          }}
          onMove={d => move(i, d)}
        >
          <Input label="Title" value={e.title} onChange={v => upd(i, { title: v })} placeholder="Power Systems Analysis" />
          <Textarea label="Description" value={e.desc} onChange={v => upd(i, { desc: v })} rows={3} />
          <TagChips label="Tags" tags={e.tags} onChange={t => upd(i, { tags: t })} />
        </ItemRow>
      ))}
      <AddButton
        label="Add expertise area"
        onClick={() => {
          const n = expertise.length + 1
          updateExpertise([
            ...expertise,
            { id: `area-${Date.now()}`, num: String(n).padStart(2, '0'), title: '', tags: [], desc: '' },
          ])
          setExp(expertise.length)
        }}
      />
    </Section>
  )
}
