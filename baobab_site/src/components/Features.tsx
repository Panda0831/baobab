import React, { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { requestService, services, type ServiceIcon } from '../content'
import { gsap, ScrollTrigger, revealHeader } from '../gsap'
import { DURATION, EASE } from '../motion'
import { useScrollScene, DESKTOP, revealEach, parallax, horizontalScroll } from '../scroll'

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
  const sectionRef = useRef<HTMLElement>(null)
  const trackWrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLElement>(null)

  // Mise en scène : rideau sur le titre, parallaxe des orbes, rail horizontal
  // épinglé sur desktop, grille révélée ligne par ligne sur mobile.
  useScrollScene(sectionRef, ({ scope, q }) => {
    const header = scope.querySelector('.section-header')
    const cleanupHeader = header ? revealHeader(header) : undefined
    if (header) parallax([header], { trigger: scope, from: { y: 34 }, to: { y: -18 } })

    const line = q('.services-motion-line')[0]
    if (line) {
      gsap.fromTo(line, { xPercent: -30 }, {
        xPercent: 130,
        ease: 'none',
        scrollTrigger: { trigger: scope, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    }
    parallax(q('.services-orb-left'), { trigger: scope, from: { yPercent: -8 }, to: { yPercent: 10 } })
    parallax(q('.services-orb-right'), { trigger: scope, from: { yPercent: 12 }, to: { yPercent: -12 } })

    const media = gsap.matchMedia()

    // Desktop : le rail se parcourt horizontalement, les cartes se dévoilent
    // au fil de leur entrée réelle dans le viewport.
    media.add(DESKTOP, () => {
      const wrap = trackWrapRef.current
      const track = trackRef.current
      const section = sectionRef.current
      if (!wrap || !track || !section) return

      section.classList.add('is-horizontal')

      const cards = gsap.utils.toArray<HTMLElement>(track.querySelectorAll('.feature-card'))
      const revealed = new Set<HTMLElement>()
      let started = false
      gsap.set(cards, { autoAlpha: 0, y: 44 })

      // Ne révèle que les cartes réellement arrivées dans le viewport. `started`
      // évite de dévoiler tout le rail avant que la section ne soit atteinte.
      const revealCards = (batch: HTMLElement[]) => {
        batch.forEach((card) => revealed.add(card))
        if (batch.length) {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            overwrite: true,
          })
        }
      }

      const revealVisible = () => {
        if (!started) return
        const limit = window.innerWidth * 0.94
        revealCards(cards.filter((card) => !revealed.has(card) && card.getBoundingClientRect().left < limit))
      }

      const { timeline } = horizontalScroll({
        wrap,
        track,
        onProgress: (progress) => {
          if (progress > 0) started = true
          revealVisible()
        },
        onEnd: () => revealCards(cards.filter((card) => !revealed.has(card))),
      })
      if (progressRef.current) timeline.to(progressRef.current, { scaleX: 1, duration: 1, ease: 'none' }, 0)

      ScrollTrigger.create({
        trigger: wrap,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          started = true
          revealVisible()
        },
      })

      return () => {
        section.classList.remove('is-horizontal')
        revealed.clear()
      }
    })

    // Tablette / mobile (ou écran desktop très bas) : la grille reste verticale.
    media.add('(max-width: 1023px), (max-height: 619px)', () => {
      revealEach(q('.feature-card'), { start: 'top 90%', y: 26, duration: 0.7, columns: 2 })
    })

    return () => {
      media.revert()
      cleanupHeader?.()
    }
  })

  // Inclinaison au pointeur : micro-interaction, réservée aux pointeurs fins.
  React.useEffect(() => {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return
    const section = sectionRef.current
    if (!section) return

    const cards = Array.from(section.querySelectorAll<HTMLElement>('.feature-card'))
    const cleanups = cards.map((element) => {
      const rotationX = gsap.quickTo(element, 'rotationX', { duration: 0.55, ease: 'power3' })
      const rotationY = gsap.quickTo(element, 'rotationY', { duration: 0.55, ease: 'power3' })
      const onMove = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width - 0.5
        const py = (event.clientY - rect.top) / rect.height - 0.5
        element.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
        element.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
        rotationX(py * -4.5)
        rotationY(px * 5)
      }
      const onLeave = () => {
        rotationX(0)
        rotationY(0)
      }
      element.addEventListener('pointermove', onMove)
      element.addEventListener('pointerleave', onLeave)
      return () => {
        element.removeEventListener('pointermove', onMove)
        element.removeEventListener('pointerleave', onLeave)
        gsap.set(element, { rotationX: 0, rotationY: 0 })
      }
    })

    return () => cleanups.forEach((fn) => fn())
  }, [reduceMotion])

  return (
    <section id="services" className="features" ref={sectionRef} aria-labelledby="services-title">
      <div className="services-motion-line" aria-hidden="true" />
      <div className="services-orb services-orb-left" aria-hidden="true" />
      <div className="services-orb services-orb-right" aria-hidden="true" />
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Nos expertises</span>
          <h2 id="services-title">Du premier cadrage au produit en ligne.</h2>
          <p>Six expertises complémentaires, une seule équipe engagée.</p>
        </div>
        <div className="features-track-wrap" ref={trackWrapRef}>
          <div className="features-grid" ref={trackRef}>
            {services.map((service, index) => (
              <article key={service.title} className="feature-card">
                <i className="feature-topline" aria-hidden="true" />
                <span className="feature-index" aria-hidden="true">0{index + 1}</span>
                <a className="feature-link" href="#contact" onClick={() => requestService(service.id)}>
                  <div className="feature-icon">
                    <AnimatedIcon name={service.icon} reduceMotion={Boolean(reduceMotion)} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className="feature-cta">Parler de ce besoin <span aria-hidden="true">↗</span></span>
                </a>
              </article>
            ))}
          </div>
          <div className="features-progress" aria-hidden="true">
            <div className="features-progress-track"><i ref={progressRef} /></div>
            <span>06 expertises · défilez</span>
          </div>
        </div>
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
