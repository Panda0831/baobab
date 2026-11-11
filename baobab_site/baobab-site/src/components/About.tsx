import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const principles = [
  ['01', 'Comprendre', 'Partir du terrain, des contraintes et des personnes.', 'observe'],
  ['02', 'Faire simple', 'Rendre les parcours clairs et les outils utiles.', 'shape'],
  ['03', 'Avancer ensemble', 'Garder le dialogue ouvert à chaque étape du projet.', 'connect'],
]

const About: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const introY = useTransform(scrollYProgress, [0, 0.48, 1], [36, 0, -20])
  const artworkY = useTransform(scrollYProgress, [0, 0.5, 1], [70, 0, -55])
  const artworkRotate = useTransform(scrollYProgress, [0, 0.5, 1], [3.5, 0, -2])

  return (
    <section id="about" className="about about-method" ref={sectionRef}>
      <div className="method-glow method-glow-one" aria-hidden="true" />
      <div className="method-glow method-glow-two" aria-hidden="true" />
      <div className="container">
        <motion.div className="method-intro" style={{ y: reduceMotion ? 0 : introY }} initial={reduceMotion ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65 }}>
          <span className="eyebrow">Notre approche</span>
          <div><h2>La technologie doit éclaircir le quotidien.</h2><p>Nous partons du réel pour concevoir des expériences numériques qui trouvent naturellement leur place dans le travail des équipes et dans la vie de leurs utilisateurs.</p></div>
        </motion.div>

        <div className="method-stage">
          <motion.div className="method-story" initial={reduceMotion ? false : { opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.28 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <p className="method-label">UN PARTENAIRE IMPLIQUÉ</p>
            <p className="method-copy">Baobab est née d’une conviction simple : les outils numériques doivent aider les personnes à mieux avancer, pas ajouter de complexité. Notre équipe reste proche des besoins, des décisions et de ce qui rend un produit réellement utile.</p>
            <div className="method-note"><span aria-hidden="true">B.</span><p>Une petite équipe, avec le temps d’écouter et l’envie de bien faire.</p></div>
            <motion.a href="#contact" className="secondary-button" whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>Rencontrez-nous <span aria-hidden="true">↗</span></motion.a>
          </motion.div>

          <motion.div className="method-artwork" style={{ y: reduceMotion ? 0 : artworkY, rotate: reduceMotion ? 0 : artworkRotate }} initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div className="art-orbit art-orbit-one" aria-hidden="true" />
            <motion.div className="art-orbit art-orbit-two" aria-hidden="true" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} />
            <div className="art-window">
              <div className="art-window-bar"><span><i /><i /><i /></span><b>ATELIER / VISION</b><em>01</em></div>
              <div className="art-window-body">
                <div className="art-copy"><span>DES IDÉES À CLARIFIER</span><strong>Concevoir<br /><i>avec attention.</i></strong><small>Le bon outil commence toujours par une bonne écoute.</small></div>
                <div className="art-map" aria-hidden="true"><i className="map-ring ring-a" /><i className="map-ring ring-b" /><i className="map-node node-a" /><i className="map-node node-b" /><i className="map-node node-c" /><svg viewBox="0 0 280 180" preserveAspectRatio="none"><path d="M28 137C64 110 71 65 109 78s35 41 73 11 34-51 70-31" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 7" /></svg></div>
                <div className="art-pulse-row"><span>INTENTION</span><i /><i /><i /><b>CLARTÉ</b></div>
              </div>
            </div>
            <motion.div className="art-float-card art-float-left" initial={reduceMotion ? false : { opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: reduceMotion ? 0 : 0.55 }}><span className="float-dots" aria-hidden="true"><i /><i /><i /></span><b>Écouter</b><small>Ce qui compte vraiment</small></motion.div>
            <motion.div className="art-float-card art-float-right" initial={reduceMotion ? false : { opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: reduceMotion ? 0 : 0.7 }}><span className="float-signal" aria-hidden="true" /><b>Construire</b><small>Une réponse juste</small></motion.div>
          </motion.div>
        </div>

        <motion.div className="method-principles" initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } } }}>
          {principles.map(([number, title, copy, icon]) => <motion.article key={number} variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 24 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }} whileHover={reduceMotion ? undefined : { y: -6 }}>
            <div className={`principle-illustration ${icon}`} aria-hidden="true"><i /><i /><i /></div>
            <span>{number}</span><h3>{title}</h3><p>{copy}</p>
          </motion.article>)}
        </motion.div>
      </div>
    </section>
  )
}

export default About
