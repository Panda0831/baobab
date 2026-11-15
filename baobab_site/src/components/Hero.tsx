import React, { useLayoutEffect, useRef } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'
import { gsap, SplitText } from '../gsap'
import { useScrollScene } from '../scroll'
import { useIsMobile } from '../hooks'

const Hero: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const heroRef = useRef<HTMLElement>(null)

  // Inclinaison douce du produit au survol : désactivée au tactile et en reduced motion.
  const tiltEnabled = !reduceMotion && !isMobile
  const rotateX = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 })
  const rotateY = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 })

  const handleTilt = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    rotateY.set(x * 7)
    rotateX.set(y * -5)
  }

  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  // Entrée cinématique : une seule timeline GSAP, jouée avant le premier paint.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const scope = gsap.utils.selector(heroRef)
      gsap.set(scope('.hero-kicker'), { autoAlpha: 0, y: 16 })
      gsap.set(scope('.hero-copy h1'), { autoAlpha: 0 })
      gsap.set(scope('.hero-lead'), { autoAlpha: 0, y: 24 })
      gsap.set(scope('.hero-actions'), { autoAlpha: 0, y: 20 })
      gsap.set(scope('.hero-signature'), { autoAlpha: 0, y: 12 })
      gsap.set(scope('.hero-scroll'), { autoAlpha: 0 })
      gsap.set(scope('.product-reveal'), { autoAlpha: 0, y: 110, rotationX: 14, scale: 0.93 })
      gsap.set(scope('.product-chip'), { autoAlpha: 0, y: 20, x: (i: number) => (i === 0 ? 28 : -24) })
      gsap.set(scope('.orbit'), { autoAlpha: 0 })

      const split = SplitText.create(scope('.hero-copy h1')[0] as unknown as HTMLElement, {
        type: 'words,chars',
        mask: 'chars',
      })

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power4.out' } })
      tl.to(scope('.hero-kicker'), { autoAlpha: 1, y: 0, duration: 0.55 }, 0)
        .to(scope('.hero-copy h1'), { autoAlpha: 1, duration: 0.02 }, 0.06)
        .from(
          split.chars,
          { yPercent: 118, rotateX: -55, stagger: 0.016, duration: 0.9 },
          0.06,
        )
        .to(scope('.hero-lead'), { autoAlpha: 1, y: 0, duration: 0.7 }, 0.52)
        .to(scope('.hero-actions'), { autoAlpha: 1, y: 0, duration: 0.65 }, 0.64)
        .to(scope('.hero-signature'), { autoAlpha: 1, y: 0, duration: 0.6 }, 0.8)
        .to(
          scope('.product-reveal'),
          { autoAlpha: 1, y: 0, rotationX: 0, scale: 1, duration: 1.2, ease: 'power4.out' },
          0.3,
        )
        .to(
          scope('.product-chip'),
          { autoAlpha: 1, y: 0, x: 0, duration: 0.6, stagger: 0.16, ease: 'back.out(1.7)' },
          1,
        )
        .to(scope('.orbit'), { autoAlpha: 1, duration: 1.3, stagger: 0.12 }, 0.85)
        .to(
          scope('.product-wave path'),
          { drawSVG: '0% 100%', duration: 1.5, ease: 'power2.inOut' },
          1.05,
        )
        .to(scope('.hero-scroll'), { autoAlpha: 1, duration: 0.5 }, 1.4)

      return () => {
        split.revert()
        tl.kill()
      }
    })
    return () => mm.revert()
  }, [])

  // Parallaxe scrubbée : la copie s'éloigne, le produit descend, l'aura grandit.
  // Les amplitudes sont réduites sur mobile et jamais créées en reduced motion.
  useScrollScene(heroRef, ({ scope, q }) => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 760px)', () => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
      })
      timeline
        .to(q('.hero-copy'), { y: -72, ease: 'none', duration: 1 }, 0)
        .to(q('.hero-product'), { y: 105, rotate: 4, ease: 'none', duration: 1 }, 0)
        .to(q('.hero-aura'), { scale: 1.22, ease: 'none', duration: 1 }, 0)
        .to([q('.hero-copy')[0], q('.hero-product')[0]], { autoAlpha: 0, ease: 'none', duration: 0.4 }, 0.6)
    })

    mm.add('(max-width: 759px)', () => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
      })
      timeline
        .to(q('.hero-copy'), { y: -18, ease: 'none', duration: 1 }, 0)
        .to(q('.hero-product'), { y: 30, rotate: 0.6, ease: 'none', duration: 1 }, 0)
        .to(q('.hero-aura'), { scale: 1.06, ease: 'none', duration: 1 }, 0)
    })

    return () => mm.revert()
  })

  return (
    <section id="accueil" className="hero hero-cinematic" ref={heroRef}>
      <div className="hero-aura" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="container hero-stage">
        <div className="hero-copy">
          <p className="hero-kicker"><span aria-hidden="true" /> Baobab · agence technologique</p>
          <h1>Donnons une forme claire à ce qui <em>compte.</em></h1>
          <p className="hero-lead">Sites, applications et logiciels sur mesure : des outils clairs, utiles et durables.</p>
          <div className="hero-actions">
            <motion.a href="#services" className="cta-button hero-primary" whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}><span className="cta-shine" aria-hidden="true" />Explorer notre savoir-faire <span aria-hidden="true">↓</span></motion.a>
            <motion.a href="#contact" className="hero-secondary" whileHover={reduceMotion ? undefined : { x: 3 }}>Parlons de votre projet <span aria-hidden="true">↗</span></motion.a>
          </div>
          <div className="hero-signature"><span className="signature-dot" aria-hidden="true" /><span>Stratégie · Design · Technologie</span></div>
        </div>

        <div
          className="hero-product"
          onPointerMove={handleTilt}
          onPointerLeave={resetTilt}
        >
          <motion.div className="orbit orbit-one" aria-hidden="true" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 34, repeat: Infinity, ease: 'linear' }} />
          <motion.div className="orbit orbit-two" aria-hidden="true" animate={reduceMotion ? undefined : { rotate: -360 }} transition={{ duration: 46, repeat: Infinity, ease: 'linear' }} />
          <div className="product-reveal">
            <div className="product-chip chip-top"><span className="chip-spark" aria-hidden="true">✦</span><div><b>Idée en mouvement</b><small>Du besoin à l’expérience</small></div></div>
            <div className="product-chip chip-bottom"><span className="chip-status" aria-hidden="true" /><div><b>Construire ensemble</b><small>Avec méthode et attention</small></div></div>
            <motion.div
              className="product-window"
              style={{ rotateX, rotateY, transformPerspective: 1200 }}
            >
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
          </div>
        </div>
      </div>
      <a href="#services" className="hero-scroll" aria-label="Découvrir les solutions"><span>Faire défiler</span><i aria-hidden="true" /></a>
    </section>
  )
}

export default Hero
