import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const reveal = (delay: number, reduceMotion: boolean | null) => ({
  initial: reduceMotion ? false : { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
})

const Hero: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -72])
  const deviceY = useTransform(scrollYProgress, [0, 1], [0, 105])
  const deviceRotate = useTransform(scrollYProgress, [0, 1], [-5, 4])
  const auraScale = useTransform(scrollYProgress, [0, 1], [1, 1.22])
  const fade = useTransform(scrollYProgress, [0.55, 1], [1, 0])

  return (
    <section id="accueil" className="hero hero-cinematic" ref={heroRef}>
      <motion.div className="hero-aura" aria-hidden="true" style={{ scale: reduceMotion ? 1 : auraScale }} />
      <div className="hero-grain" aria-hidden="true" />
      <div className="container hero-stage">
        <motion.div className="hero-copy" style={{ y: reduceMotion ? 0 : copyY, opacity: reduceMotion ? 1 : fade }}>
          <motion.p className="hero-kicker" {...reveal(0, reduceMotion)}><span aria-hidden="true" /> Baobab · agence technologique</motion.p>
          <motion.h1 {...reveal(0.08, reduceMotion)}>Donnons une forme<br />claire à ce qui <em>compte.</em></motion.h1>
          <motion.p className="hero-lead" {...reveal(0.18, reduceMotion)}>Nous imaginons et construisons des expériences numériques qui aident les équipes, les entreprises et leurs idées à aller plus loin.</motion.p>
          <motion.div className="hero-actions" {...reveal(0.28, reduceMotion)}>
            <motion.a href="#services" className="cta-button hero-primary" whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>Explorer notre savoir-faire <span aria-hidden="true">↓</span></motion.a>
            <motion.a href="#contact" className="hero-secondary" whileHover={reduceMotion ? undefined : { x: 3 }}>Parlons de votre projet <span aria-hidden="true">↗</span></motion.a>
          </motion.div>
          <motion.div className="hero-signature" {...reveal(0.38, reduceMotion)}><span className="signature-dot" aria-hidden="true" /><span>Stratégie · Design · Technologie</span></motion.div>
        </motion.div>

        <motion.div className="hero-product" style={{ y: reduceMotion ? 0 : deviceY, rotate: reduceMotion ? 0 : deviceRotate, opacity: reduceMotion ? 1 : fade }}>
          <motion.div className="orbit orbit-one" aria-hidden="true" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 34, repeat: Infinity, ease: 'linear' }} />
          <motion.div className="orbit orbit-two" aria-hidden="true" animate={reduceMotion ? undefined : { rotate: -360 }} transition={{ duration: 46, repeat: Infinity, ease: 'linear' }} />
          <motion.div className="product-chip chip-top" initial={reduceMotion ? false : { opacity: 0, x: 25, y: 12 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.75 }}><span className="chip-spark" aria-hidden="true">✦</span><div><b>Idée en mouvement</b><small>Du besoin à l’expérience</small></div></motion.div>
          <motion.div className="product-chip chip-bottom" initial={reduceMotion ? false : { opacity: 0, x: -20, y: 12 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.9 }}><span className="chip-status" aria-hidden="true" /><div><b>Construire ensemble</b><small>Avec méthode et attention</small></div></motion.div>
          <motion.div className="product-window" initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 35 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}>
            <div className="product-bar"><div className="product-lights" aria-hidden="true"><i /><i /><i /></div><span>baobab / atelier numérique</span><b>LIVE</b></div>
            <div className="product-content">
              <aside className="product-rail" aria-hidden="true"><strong>B.</strong><i className="rail-active" /><i /><i /><i /></aside>
              <div className="product-main">
                <div className="product-heading"><div><p>VOTRE PROJET</p><h2>Concevoir l’essentiel.</h2></div><span className="product-avatar">B</span></div>
                <div className="product-feature"><div className="feature-copy"><span>EXPÉRIENCE NUMÉRIQUE</span><strong>Une vision claire,<br />un produit vivant.</strong><small>Chaque détail a une fonction.</small></div><div className="feature-orb" aria-hidden="true"><i /><i /><i /></div></div>
                <div className="product-cards"><div><span>01</span><b>Écouter</b><i /></div><div><span>02</span><b>Façonner</b><i /></div><div><span>03</span><b>Faire évoluer</b><i /></div></div>
                <div className="product-wave" aria-hidden="true"><span>Rythme de création</span><svg viewBox="0 0 340 58" preserveAspectRatio="none"><path d="M0 45C30 42 40 20 65 29s34 20 58 2 41 0 65-13 42 13 66-3 23-11 51-14" fill="none" stroke="currentColor" strokeWidth="2" /></svg></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <motion.a href="#services" className="hero-scroll" aria-label="Découvrir les solutions" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduceMotion ? 0 : 1.15 }}><span>Faire défiler</span><i aria-hidden="true" /></motion.a>
    </section>
  )
}

export default Hero
