import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

type FeatureIconName = 'web' | 'mobile' | 'backend' | 'ai' | 'data' | 'advice'

interface Feature {
  icon: FeatureIconName
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: 'web', title: 'Développement web',
    description: 'Des sites et applications rapides, accessibles et conçus autour des usages de vos clients.',
  },
  {
    icon: 'mobile', title: 'Applications mobiles',
    description: 'Des expériences mobiles utiles, pensées pour accompagner les usages sur le terrain.',
  },
  {
    icon: 'backend', title: 'Logiciel & backend',
    description: 'Des fondations fiables pour relier vos outils, vos données et vos processus métier.',
  },
  { icon: 'ai', title: 'IA & automatisation', description: 'Identifiez les tâches répétitives et imaginez des automatisations adaptées à votre activité.' },
  { icon: 'data', title: 'Data & solutions intelligentes', description: 'Structurez et rendez vos informations plus faciles à lire pour éclairer vos décisions.' },
  { icon: 'advice', title: 'Conseil numérique', description: 'Du cadrage à la mise en œuvre, avancez avec une équipe proche et impliquée.' },
]

const draw = {
  hidden: { pathLength: 0, opacity: 0.4 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.75, ease: 'easeInOut' } },
}

const AnimatedIcon: React.FC<{ name: FeatureIconName; reduceMotion: boolean }> = ({ name, reduceMotion }) => {
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
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const headingY = useTransform(scrollYProgress, [0, 0.5, 1], [34, 0, -18])
  const gridY = useTransform(scrollYProgress, [0, 0.5, 1], [52, 0, -28])
  const accentX = useTransform(scrollYProgress, [0, 1], ['-20%', '120%'])

  return (
    <section id="services" className="features" ref={sectionRef}>
      <motion.div className="services-motion-line" aria-hidden="true" style={{ x: reduceMotion ? '0%' : accentX }} />
      <div className="services-orb services-orb-left" aria-hidden="true" />
      <div className="services-orb services-orb-right" aria-hidden="true" />
      <div className="container">
        <motion.div
          className="section-header"
          style={{ y: reduceMotion ? 0 : headingY }}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="eyebrow">Nos expertises</span>
          <h2>Du premier cadrage au produit en ligne.</h2>
          <p>Une équipe pluridisciplinaire pour concevoir des solutions numériques utiles, pensées selon votre métier et vos utilisateurs.</p>
        </motion.div>
        <motion.div
          className="features-grid"
          style={{ y: reduceMotion ? 0 : gridY }}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } } }}
        >
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              className="feature-card"
              variants={{ hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.94, rotateX: reduceMotion ? 0 : 5 }, visible: { opacity: 1, scale: 1, rotateX: 0 } }}
              transition={{ duration: reduceMotion ? 0 : 0.62, delay: reduceMotion ? 0 : (index % 3) * 0.035, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -9, rotateX: -2, rotateY: index % 2 ? -2 : 2, scale: 1.012 }}
            >
              <motion.div
                className="feature-icon"
                initial={reduceMotion ? false : { rotate: -10, scale: 0.72 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.45 }}
                whileHover={reduceMotion ? undefined : { rotate: -7, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              >
                <AnimatedIcon name={feature.icon} reduceMotion={Boolean(reduceMotion)} />
              </motion.div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
        <motion.div className="solution-footnote" initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5 }}>
          <span className="solution-footnote-mark" aria-hidden="true">B.</span>
          <p><strong>Une seule équipe, de la réflexion à la réalisation.</strong><br />Nous adaptons les outils et l’approche au projet, plutôt que l’inverse.</p>
          <a href="#contact">Parlons de votre besoin <span aria-hidden="true">↗</span></a>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
