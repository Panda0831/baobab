import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { requestService, services, type ServiceIcon } from '../content'
import { DURATION, EASE, fadeUpItem, stagger } from '../motion'
import { useIsMobile } from '../hooks'

const draw = {
  hidden: { pathLength: 0, opacity: 0.4 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.75, ease: 'easeInOut' } },
}

const AnimatedIcon: React.FC<{ name: ServiceIcon; reduceMotion: boolean }> = ({ name, reduceMotion }) => {
  const props = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    variants: draw,
  }

  return (
    <motion.svg
      className={`feature-svg feature-svg-${name}`}
      viewBox="0 0 48 48"
      aria-hidden="true"
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
    >
      {name === 'web' && (
        <>
          <motion.rect {...props} x="7" y="9" width="27" height="24" rx="4" />
          <motion.path {...props} d="M12 16h9M12 22h5M15 33v5M26 33v5M10 38h21" />
          <motion.circle {...props} cx="32" cy="29" r="8" />
          <motion.path {...props} d="m38 35 5 5" />
        </>
      )}
      {name === 'mobile' && (
        <>
          <motion.rect {...props} x="7" y="8" width="34" height="32" rx="6" />
          <motion.path {...props} d="M14 32V26M22 32V19M30 32V23M14 17h.01" />
          <motion.path {...props} d="m12 22 8-7 7 4 9-8" />
        </>
      )}
      {name === 'backend' && (
        <>
          <motion.circle {...props} cx="18" cy="17" r="6" />
          <motion.circle {...props} cx="34" cy="19" r="5" />
          <motion.path {...props} d="M6 39c.7-7 5.1-11 12-11s11.3 4 12 11M29 29c6.8-1.5 11.7 2 13 8" />
          <motion.path {...props} d="M24 22s-4-2.4-4-5.3a2.5 2.5 0 0 1 4-1.9 2.5 2.5 0 0 1 4 1.9c0 2.9-4 5.3-4 5.3Z" />
        </>
      )}
      {name === 'ai' && <><motion.path {...props} d="M24 6v7m0 22v7M6 24h7m22 0h7M11 11l5 5m16 16 5 5m0-26-5 5m-16 16-5 5" /><motion.circle {...props} cx="24" cy="24" r="10" /><motion.path {...props} d="M20 24h8m-4-4v8" /></>}
      {name === 'data' && <><motion.path {...props} d="M8 38V25m10 13V16m11 22V9m11 29V21" /><motion.path {...props} d="M5 39h38" /></>}
      {name === 'advice' && <><motion.path {...props} d="M8 9h32v23H23l-9 7v-7H8z" /><motion.path {...props} d="M15 17h18M15 23h12" /></>}
    </motion.svg>
  )
}

const Features: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const headingY = useTransform(scrollYProgress, [0, 0.5, 1], [34, 0, -18])
  const gridY = useTransform(scrollYProgress, [0, 0.5, 1], isMobile ? [0, 0, 0] : [52, 0, -28])
  const accentX = useTransform(scrollYProgress, [0, 1], ['-20%', '120%'])
  const parallax = reduceMotion || isMobile ? 0 : headingY

  const handleSpotlight = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()
    element.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    element.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  return (
    <section id="services" className="features" ref={sectionRef} aria-labelledby="services-title">
      <motion.div className="services-motion-line" aria-hidden="true" style={{ x: reduceMotion ? '0%' : accentX }} />
      <div className="services-orb services-orb-left" aria-hidden="true" />
      <div className="services-orb services-orb-right" aria-hidden="true" />
      <div className="container">
        <motion.div
          className="section-header"
          style={{ y: reduceMotion ? 0 : parallax }}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduceMotion ? 0 : DURATION.base, ease: EASE }}
        >
          <span className="eyebrow">Nos expertises</span>
          <h2 id="services-title">Du premier cadrage au produit en ligne.</h2>
          <p>Une équipe pluridisciplinaire pour concevoir des solutions numériques utiles, pensées selon votre métier et vos utilisateurs.</p>
        </motion.div>
        <motion.div
          className="features-grid"
          style={{ y: reduceMotion ? 0 : gridY }}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger(reduceMotion, 0.09)}
        >
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              className="feature-card"
              variants={fadeUpItem(reduceMotion, 22)}
              transition={{ duration: reduceMotion ? 0 : DURATION.base, delay: reduceMotion ? 0 : (index % 3) * 0.03, ease: EASE }}
              whileHover={reduceMotion ? undefined : { y: -8, scale: 1.012 }}
              onPointerMove={handleSpotlight}
            >
              <a className="feature-link" href="#contact" onClick={() => requestService(service.id)}>
                <motion.div
                  className="feature-icon"
                  initial={reduceMotion ? false : { rotate: -8, scale: 0.8 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.45 }}
                  whileHover={reduceMotion ? undefined : { rotate: -6, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <AnimatedIcon name={service.icon} reduceMotion={Boolean(reduceMotion)} />
                </motion.div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="feature-cta">Parler de ce besoin <span aria-hidden="true">↗</span></span>
              </a>
            </motion.article>
          ))}
        </motion.div>
        <motion.div className="solution-footnote" initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: reduceMotion ? 0 : DURATION.base, ease: EASE }}>
          <span className="solution-footnote-mark" aria-hidden="true">B.</span>
          <p><strong>Une seule équipe, de la réflexion à la réalisation.</strong><br />Nous adaptons les outils et l’approche au projet, plutôt que l’inverse.</p>
          <a href="#contact">Parlons de votre besoin <span aria-hidden="true">↗</span></a>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
