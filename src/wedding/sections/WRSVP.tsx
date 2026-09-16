import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import type { WeddingConfig } from '../weddingConfig'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface WRSVPProps { config: WeddingConfig }

export default function WRSVP({ config }: WRSVPProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [event, setEvent] = useState('')
  const [guests, setGuests] = useState('1')
  const [status, setStatus] = useState<FormState>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setStatus('submitting')

    const eventObj = config.events.find(ev => ev.id === event)
    const eventLabel = event === 'all'
      ? 'All Three Celebrations'
      : (eventObj ? `${eventObj.label} (${eventObj.date})` : (event || 'All Three Celebrations'))

    try {
      // 1. Primary: save directly to wedding_rsvps table
      try {
        await supabase.from('wedding_rsvps').insert({
          name: name.trim(),
          phone: phone.trim(),
          event: eventLabel,
          guests: parseInt(guests, 10) || 1,
          created_at: new Date().toISOString(),
        })
      } catch (tabErr) {
        console.warn('Direct wedding_rsvps table insert notice:', tabErr)
      }

      // 2. Secondary: guaranteed backup in contact_messages
      try {
        await supabase.from('contact_messages').insert({
          name: name.trim(),
          email: phone.trim() || 'wedding-guest@sahinalom.com',
          subject: `[Wedding RSVP] ${name.trim()} · ${eventLabel} (${guests} ${guests === '1' ? 'Guest' : 'Guests'})`,
          message: `Wedding RSVP Confirmation:\n• Guest Name: ${name.trim()}\n• Phone / WhatsApp: ${phone.trim()}\n• Event: ${eventLabel}\n• Attending Guests: ${guests}\n• Submitted: ${new Date().toLocaleString()}`,
          created_at: new Date().toISOString(),
        })
      } catch (backupErr) {
        console.warn('Backup RSVP notice:', backupErr)
      }

      // 3. Optional Formspree forwarding
      if (config.rsvpFormspreeId) {
        await fetch(`https://formspree.io/f/${config.rsvpFormspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: name.trim(), phone: phone.trim(), event: eventLabel, guests }),
        }).catch(() => {})
      }

      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const fieldVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] } }),
  }

  return (
    <section className="w-rsvp w-section">
      <div className="w-container">
        <div className="w-rsvp__inner" ref={ref}>
          <motion.div className="w-label" initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <span className="w-label__text">RSVP</span>
            <div className="w-label__line" />
            <span className="w-label__num">06</span>
          </motion.div>

          <motion.h2 className="w-rsvp__heading" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            Will you<br/>join us?
          </motion.h2>
          <motion.p className="w-rsvp__sub" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
            Kindly respond before {config.rsvpDeadline}
          </motion.p>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="success" className="w-rsvp__success" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                <motion.div className="w-rsvp__success-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.2 }}>✓</motion.div>
                <div className="w-rsvp__success-text">Barakallahu Feekum</div>
                <p className="w-rsvp__success-note">{config.rsvpConfirmationNote}</p>
              </motion.div>
            ) : (
              <motion.form key="form" className="w-rsvp__form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} noValidate>
                {[
                  { i: 0, id: 'w-rsvp-name', label: 'Full Name', type: 'text', value: name, onChange: setName, placeholder: 'Your name' },
                  { i: 1, id: 'w-rsvp-phone', label: 'Phone / WhatsApp', type: 'tel', value: phone, onChange: setPhone, placeholder: '+880 — ———' },
                ].map(({ i, id, label, type, value, onChange, placeholder }) => (
                  <motion.div key={id} className="w-rsvp__field" variants={fieldVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={i}>
                    <label className="w-rsvp__label" htmlFor={id}>{label}</label>
                    <input id={id} type={type} className="w-rsvp__input" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
                  </motion.div>
                ))}

                <motion.div className="w-rsvp__field" variants={fieldVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={2}>
                  <label className="w-rsvp__label" htmlFor="w-rsvp-event">Attending</label>
                  <select id="w-rsvp-event" className="w-rsvp__select" value={event} onChange={e => setEvent(e.target.value)}>
                    <option value="">Select event(s)</option>
                    {config.events.map(ev => <option key={ev.id} value={ev.id}>{ev.label} — {ev.date}</option>)}
                    <option value="all">All three celebrations</option>
                  </select>
                </motion.div>

                <motion.div className="w-rsvp__field" variants={fieldVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={3}>
                  <label className="w-rsvp__label" htmlFor="w-rsvp-guests">Number of Guests</label>
                  <select id="w-rsvp-guests" className="w-rsvp__select" value={guests} onChange={e => setGuests(e.target.value)}>
                    {['1', '2', '3', '4', '5', '6+'].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </motion.div>

                <motion.div variants={fieldVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={4}>
                  <button type="submit" className="w-rsvp__btn" disabled={status === 'submitting'} data-cursor-hover>
                    {status === 'submitting' ? (
                      <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', fontSize: 14 }}>◌</motion.span> Sending…</>
                    ) : (
                      <>Confirm Attendance <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                    )}
                  </button>
                  {status === 'error' && (
                    <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: 16, fontFamily: 'var(--w-font-mono)', fontSize: 10, letterSpacing: '0.14em', color: '#7B2D3F', textTransform: 'uppercase' }}>
                      Something went wrong — please try again.
                    </motion.p>
                  )}
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
