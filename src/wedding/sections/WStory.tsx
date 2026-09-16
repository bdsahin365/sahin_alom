import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import type { WeddingConfig } from '../weddingConfig'

function StoryChapter({ item, index, align }: { item: WeddingConfig['story'][number]; index: number; align: 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-12% 0px' })
  const dir = align === 'left' ? -30 : 30

  return (
    <div ref={ref} className={`w-story__chapter${align === 'right' ? ' w-story__chapter--right' : ''}`}>
      <motion.div
        initial={{ opacity: 0, x: dir }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: dir }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      >
        <div className="w-story__num">{String(index + 1).padStart(2, '0')} // Story</div>
        <div className="w-story__date">{item.fullDate}</div>
        <h3 className="w-story__title">{item.title}</h3>
        <p className="w-story__body">{item.body}</p>
      </motion.div>
    </div>
  )
}

interface WStoryProps { config: WeddingConfig }

export default function WStory({ config }: WStoryProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgX  = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const bgOp = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 0.028, 0.028, 0])
  const spineScaleY = useTransform(scrollYProgress, [0.05, 0.95], [0, 1])
  const labelRef = useRef(null)
  const labelInView = useInView(labelRef, { once: true })

  const story = config.story

  return (
    <section className="w-story w-section" ref={sectionRef}>
      {story.map((item) => (
        <motion.div key={item.day} className="w-story__bg-day" style={{ x: bgX, opacity: bgOp }} aria-hidden="true">
          {item.day}
        </motion.div>
      ))}

      <div className="w-container w-story__container">
        <motion.div
          className="w-label"
          ref={labelRef}
          initial={{ opacity: 0, y: 20 }}
          animate={labelInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="w-label__text">Our Story</span>
          <div className="w-label__line" />
          <span className="w-label__num">03</span>
        </motion.div>

        <div className="w-story__grid">
          <div>
            <StoryChapter item={story[0]} index={0} align="left" />
            {story[2] && <StoryChapter item={story[2]} index={2} align="left" />}
          </div>
          <motion.div className="w-story__spine" style={{ scaleY: spineScaleY, transformOrigin: 'top' }} />
          <div>
            {story[1] && <StoryChapter item={story[1]} index={1} align="right" />}
          </div>
        </div>
      </div>
    </section>
  )
}
