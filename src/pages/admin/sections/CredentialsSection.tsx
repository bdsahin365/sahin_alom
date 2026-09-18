import { useState } from 'react'
import { useSite, Credential } from '../../../context/SiteContext'
import {
  Section,
  ItemRow,
  Grid2,
  Input,
  AddButton,
} from '../components/AdminPrimitives'

export default function CredentialsSection() {
  const { data: { credentials: creds }, updateCredentials } = useSite()
  const [exp, setExp] = useState<number | null>(null)
  const upd = (i: number, p: Partial<Credential>) =>
    updateCredentials(creds.map((c, j) => (j === i ? { ...c, ...p } : c)))
  const move = (i: number, d: 'up' | 'down') => {
    const n = [...creds]
    const target = i + (d === 'up' ? -1 : 1)
    ;[n[i], n[target]] = [n[target], n[i]]
    updateCredentials(n)
  }

  return (
    <Section title="Credentials & Certifications" description="Shown in the marquee strip, about section, CV, and biodata">
      {creds.map((c, i) => (
        <ItemRow
          key={i}
          label={c.label || <em style={{ color: '#94A3B8' }}>Untitled</em>}
          meta={c.value}
          expanded={exp === i}
          onToggle={() => setExp(exp === i ? null : i)}
          i={i}
          total={creds.length}
          onDelete={() => {
            updateCredentials(creds.filter((_, j) => j !== i))
            setExp(null)
          }}
          onMove={d => move(i, d)}
        >
          <Grid2>
            <Input label="Label / Badge" value={c.label} onChange={v => upd(i, { label: v })} placeholder="ABC License" />
            <Input label="Title / Value" value={c.value} onChange={v => upd(i, { value: v })} placeholder="Electrical Licensing Board" />
          </Grid2>
          <Input label="Detail / Issuer" value={c.detail} onChange={v => upd(i, { detail: v })} placeholder="Electricity Licensing Board (ELB) Bangladesh · Category A, B & C" />
          <Input label="Credential URL (optional)" value={c.url || ''} onChange={v => upd(i, { url: v })} placeholder="https://www.linkedin.com/learning/certificates/..." />
        </ItemRow>
      ))}
      <AddButton
        label="Add credential"
        onClick={() => {
          updateCredentials([...creds, { label: '', value: '', detail: '', url: '' }])
          setExp(creds.length)
        }}
      />
    </Section>
  )
}
