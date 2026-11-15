import React, { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASE } from '../motion'
import { gsap } from '../gsap'
import { useScrollScene, maskReveal, parallax } from '../scroll'

const views = [
  {
    label: 'Explorer',
    kicker: 'Recherche structurée',
    title: 'Les bons repères, au même endroit.',
    copy: 'Des outils de recherche conçus pour organiser les informations et rendre l’exploration plus claire.',
    badge: 'Explorer les données',
    rows: ['Critères personnalisés', 'Informations regroupées', 'Résultats lisibles'],
    bars: [34, 55, 42, 76, 58, 88, 67],
  },
  {
    label: 'Analyser',
    kicker: 'Lecture des données',
    title: 'Voir les tendances plus clairement.',
    copy: 'Une interface visuelle pour rapprocher les indicateurs et faciliter la lecture des projets.',
    badge: 'Analyser les tendances',
    rows: ['Vue synthétique', 'Indicateurs visuels', 'Données comparables'],
    bars: [54, 37, 68, 49, 84, 60, 92],
  },
  {
    label: 'Connecter',
    kicker: 'Écosystème numérique',
    title: 'Relier les outils et les personnes.',
    copy: 'Des expériences numériques qui facilitent la circulation des informations entre les acteurs.',
    badge: 'Connecter les usages',
    rows: ['Parcours coordonnés', 'Informations partagées', 'Outils complémentaires'],
    bars: [43, 64, 52, 78, 61, 72, 89],
  },
]

const PlatformPreview: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeView = views[activeIndex]

  const goTo = (index: number) => {
    const next = (index + views.length) % views.length
    if (next === activeIndex) return
    setDirection(next > activeIndex ? 1 : -1)
    setActiveIndex(next)
  }

  const selectTab = (index: number) => {
    const next = (index + views.length) % views.length
    goTo(index)
    tabRefs.current[next]?.focus()
  }

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        selectTab(index + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        selectTab(index - 1)
        break
      case 'Home':
        event.preventDefault()
        selectTab(0)
        break
      case 'End':
        event.preventDefault()
        selectTab(views.length - 1)
        break
      default:
        break
    }
  }

  // Storytelling scroll : la section s'épingle et traverse les trois usages.
  // Le dévoilement de la fenêtre et la parallaxe mobile passent par le même
  // moteur, donc le nettoyage (pin, tweens, styles) est centralisé.
  useScrollScene(sectionRef, ({ scope, q }) => {
    const win = q('.platform-window')[0]
    if (win) maskReveal([win], { trigger: scope, start: 'top 72%', duration: 1.1, inner: false })

    const media = gsap.matchMedia()

    media.add('(min-width: 900px) and (min-height: 700px)', () => {
      const section = sectionRef.current
      if (!section) return

      section.classList.add('is-pinned')
      const ghosts = q('.platform-ghost')
      const intro = q('.platform-intro')[0]
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=230%',
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(views.length - 1, Math.floor(self.progress * views.length))
            setActiveIndex((current) => (current === index ? current : index))
          },
        },
      })

      timeline.to(q('.platform-storybar i'), { scaleX: 1, duration: 1 }, 0)
      timeline.fromTo(
        win,
        { rotationY: -2.2, rotationX: 1.1, scale: 0.985 },
        { rotationY: 2.2, rotationX: -1.1, scale: 1.015, duration: 1 },
        0,
      )
      if (intro) timeline.to(intro, { y: -26, duration: 1 }, 0)

      ghosts.forEach((ghost, i) => {
        const enter = i === 0 ? 0 : i / views.length + 0.015
        const exit = (i + 1) / views.length
        timeline.fromTo(
          ghost,
          { autoAlpha: 0, yPercent: 12 },
          { autoAlpha: 0.9, yPercent: 0, duration: i === 0 ? 0.05 : 0.06 },
          enter,
        )
        if (i < ghosts.length - 1) {
          timeline.to(ghost, { autoAlpha: 0, yPercent: -12, duration: 0.06 }, exit - 0.06)
        }
      })

      return () => {
        section.classList.remove('is-pinned')
      }
    })

    // Sans épinglage, la section reste une simple scène parallaxe.
    media.add('(max-width: 899px), (max-height: 699px)', () => {
      const intro = q('.platform-intro')[0]
      if (intro) parallax([intro], { trigger: scope, from: { y: 32 }, to: { y: -18 } })
    })

    return () => media.revert()
  })

  return (
    <section className="platform" id="plateforme" ref={sectionRef}>
      <div className="platform-ghost" aria-hidden="true">01</div>
      <div className="platform-ghost" aria-hidden="true">02</div>
      <div className="platform-ghost" aria-hidden="true">03</div>
      <div className="platform-storybar" aria-hidden="true">
        <i />
        <span>0{activeIndex + 1} / 0{views.length}</span>
      </div>
      <div className="container">
        <motion.div
          className="platform-intro"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduceMotion ? 0 : DURATION.base, ease: EASE }}
        >
          <span className="eyebrow">Une idée, plusieurs usages</span>
          <h2>Des outils numériques qui rendent les projets plus lisibles.</h2>
          <p>Clarifier les données, relier les usages, accompagner les équipes : notre façon d’aborder une interface.</p>
          <div className="platform-tabs" role="tablist" aria-label="Explorer les usages de la plateforme">
            {views.map((view, index) => (
              <button
                key={view.label}
                ref={(element) => { tabRefs.current[index] = element }}
                id={`platform-tab-${index}`}
                type="button"
                role="tab"
                className={`platform-tab${index === activeIndex ? ' is-active' : ''}`}
                aria-selected={index === activeIndex}
                aria-controls="platform-demo"
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => goTo(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                {index === activeIndex && (
                  <motion.span
                    className="tab-pill"
                    layoutId="platform-tab-pill"
                    aria-hidden="true"
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34, mass: 0.6 }}
                  />
                )}
                <span className="tab-index" aria-hidden="true">0{index + 1}</span>{view.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          id="platform-demo"
          className="platform-window"
          role="tabpanel"
          aria-labelledby={`platform-tab-${activeIndex}`}
          tabIndex={0}
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: EASE }}
        >
          <div className="platform-topbar">
            <div className="window-controls" aria-hidden="true"><i /><i /><i /></div>
            <div className="window-address"><span /> baobab / workspace</div>
            <span className="preview-label">CONCEPT</span>
          </div>
          <div className="platform-body">
            <aside className="platform-rail" aria-hidden="true">
              <span className="rail-brand">B</span>
              <span className="rail-icon selected"><i /></span>
              <span className="rail-icon"><i /></span>
              <span className="rail-icon"><i /></span>
              <span className="rail-bottom"><i /></span>
            </aside>
            <div className="platform-main">
              <div className="platform-heading">
                <div>
                  <span className="app-breadcrumb">ESPACE NUMÉRIQUE <b>/</b> {activeView.label.toUpperCase()}</span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeView.kicker}
                      initial={reduceMotion ? false : { opacity: 0, x: 16 * direction }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
                      transition={{ duration: reduceMotion ? 0 : DURATION.short, ease: EASE }}
                    >
                      <h3>{activeView.kicker}</h3>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <span className="avatar-stack" aria-label="Équipe Baobab"><i>B</i><i>+</i></span>
              </div>

              <div className="platform-grid">
                <div className="data-panel chart-panel">
                  <div className="panel-title"><span>Vue d’ensemble</span><span className="panel-menu">···</span></div>
                  <div className="chart-caption">Lecture visuelle <span>APERÇU</span></div>
                  <div className="chart-area" aria-label="Visualisation conceptuelle sans données réelles">
                    <div className="chart-guides"><i /><i /><i /><i /></div>
                    <svg viewBox="0 0 480 145" preserveAspectRatio="none" aria-hidden="true">
                      <motion.path
                        key={activeView.label}
                        d={activeIndex === 0 ? 'M0 114 C50 105 53 74 106 85 S163 102 207 62 262 75 309 47 365 63 410 25 455 31 480 12' : activeIndex === 1 ? 'M0 96 C44 112 65 65 110 76 S165 42 210 60 271 27 316 44 369 18 416 31 458 13 480 20' : 'M0 123 C45 103 64 109 106 75 S159 91 208 52 263 69 310 55 364 32 410 42 452 19 480 10'}
                        fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                        initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: reduceMotion ? 0 : 0.8, ease: 'easeInOut' }}
                      />
                    </svg>
                    <span className="chart-dot" />
                  </div>
                  <div className="chart-axis"><span>Lecture simplifiée</span><span>Évolution</span></div>
                </div>

                <div className="data-panel insight-panel">
                  <div className="panel-title"><span>Points clés</span><span className="insight-spark">✳</span></div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeView.label}
                      className="insight-content"
                      initial={reduceMotion ? false : { opacity: 0, x: 16 * direction }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
                      transition={{ duration: reduceMotion ? 0 : DURATION.short, ease: EASE }}
                    >
                      <p className="insight-label">{activeView.badge}</p>
                      <div className="mini-bars" aria-hidden="true">
                        {activeView.bars.map((height, index) => (
                          <motion.i key={`${activeView.label}-${index}`} initial={reduceMotion ? false : { scaleY: 0.15 }} animate={{ scaleY: 1 }} transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : index * 0.03, ease: EASE }} style={{ height: `${height}%`, transformOrigin: 'bottom' }} />
                        ))}
                      </div>
                      <ul>{activeView.rows.map((row) => <li key={row}><span />{row}</li>)}</ul>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeView.title}
                  className="platform-footer-note"
                  aria-live="polite"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: reduceMotion ? 0 : DURATION.short, ease: EASE }}
                >
                  <span className="status-pulse" />
                  <div><strong>{activeView.title}</strong><small>{activeView.copy}</small></div>
                  <span className="footer-note-mark">B.</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        <p className="platform-disclaimer">Exploration visuelle — cette interface et ses données sont illustratives, pas un produit commercialisé.</p>
      </div>
    </section>
  )
}

export default PlatformPreview
