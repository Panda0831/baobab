import React, { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { gsap, SplitText } from '../gsap'
import { DURATION, EASE, fadeUpItem, stagger } from '../motion'
import { useScrollScene, maskReveal, parallax } from '../scroll'

const principles = [
  ['01', 'Comprendre', 'Partir du terrain, des contraintes et des personnes.', 'observe'],
  ['02', 'Faire simple', 'Rendre les parcours clairs et les outils utiles.', 'shape'],
  ['03', 'Avancer ensemble', 'Garder le dialogue ouvert à chaque étape du projet.', 'connect'],
]

const About: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Déclaration cinétique (mots scrubbés), parallaxe de l'intro et de
  // l'illustration, et dévoilement masqué de la maquette d'atelier.
  useScrollScene(sectionRef, ({ scope, q }) => {
    let split: SplitText | undefined
    const statement = scope.querySelector('.kinetic-statement') as HTMLElement | null
    if (statement) {
      split = SplitText.create(statement, { type: 'words' })
      gsap.fromTo(
        split.words,
        { opacity: 0.13 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: statement,
            start: 'top 82%',
            end: 'top 28%',
            scrub: true,
          },
        },
      )
    }

    parallax(q('.method-intro'), { trigger: scope, from: { y: 36 }, to: { y: -20 } })
    parallax(q('.method-glow'), { trigger: scope, from: { y: -40 }, to: { y: 60 } })

    const artwork = q('.method-artwork')[0]
    const artWindow = q('.art-window')[0]
    if (artwork) {
      parallax([artwork], { trigger: scope, from: { y: 70, rotate: 3.5 }, to: { y: -55, rotate: -2 } })
    }
    // Le cache ne s'applique qu'à la maquette : les cartes flottantes qui
    // débordent du cadre restent entières.
    if (artWindow) {
      maskReveal([artWindow], {
        trigger: artwork ?? artWindow,
        start: 'top 84%',
        duration: 1.1,
        from: 'bottom',
        inner: false,
      })
      parallax([artWindow], {
        trigger: artwork ?? artWindow,
        start: 'top 92%',
        end: 'top 42%',
        scrub: 0.8,
        from: { scale: 0.94 },
        to: { scale: 1 },
      })
    }

    return () => split?.revert()
  })

  return (
    <section id="about" className="about about-method" ref={sectionRef}>
      <div className="method-glow method-glow-one" aria-hidden="true" />
      <div className="method-glow method-glow-two" aria-hidden="true" />
      <div className="container">
        <div className="method-intro">
          <span className="eyebrow">Notre approche</span>
          <h2 className="kinetic-statement">La technologie doit éclaircir le <em>quotidien.</em></h2>
        </div>

        <div className="method-stage">
          <motion.div className="method-story" initial={reduceMotion ? false : { opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.28 }} transition={{ duration: reduceMotion ? 0 : DURATION.long, ease: EASE }}>
            <p className="method-label">UN PARTENAIRE IMPLIQUÉ</p>
            <p className="method-copy">Née d’une conviction simple : un bon outil numérique vous fait avancer, il ne vous ralentit pas.</p>
            <div className="method-note"><span aria-hidden="true">B.</span><p>Une petite équipe, avec le temps d’écouter et l’envie de bien faire.</p></div>
            <motion.a href="#contact" className="secondary-button" whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>Rencontrez-nous <span aria-hidden="true">↗</span></motion.a>
          </motion.div>

          <div className="method-artwork">
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
          </div>
        </div>

        <motion.div className="method-principles" initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger(reduceMotion, 0.1)}>
          {principles.map(([number, title, copy, icon]) => <motion.article key={number} variants={fadeUpItem(reduceMotion, 24)} transition={{ duration: reduceMotion ? 0 : DURATION.base, ease: EASE }} whileHover={reduceMotion ? undefined : { y: -6 }}>
            <div className={`principle-illustration ${icon}`} aria-hidden="true"><i /><i /><i /></div>
            <span>{number}</span><h3>{title}</h3><p>{copy}</p>
          </motion.article>)}
        </motion.div>
      </div>
    </section>
  )
}

export default About
