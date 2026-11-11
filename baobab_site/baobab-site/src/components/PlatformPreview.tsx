import React, { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

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
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const windowY = useTransform(scrollYProgress, [0, 0.48, 1], [74, 0, -38])
  const windowScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.93, 1, 0.97])
  const introY = useTransform(scrollYProgress, [0, 0.65, 1], [32, 0, -18])
  const activeView = views[activeIndex]

  return (
    <section className="platform" id="plateforme" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="platform-intro"
          style={{ y: reduceMotion ? 0 : introY }}
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <span className="eyebrow">Une idée, plusieurs usages</span>
          <h2>Des outils numériques qui rendent les projets plus lisibles.</h2>
          <p>Les bons produits rassemblent ce qui est aujourd’hui dispersé. Cette maquette illustre notre façon d’aborder une interface : clarifier les données, relier les usages et accompagner les équipes.</p>
          <div className="platform-tabs" aria-label="Explorer les usages de la plateforme">
            {views.map((view, index) => (
              <button
                key={view.label}
                type="button"
                className={`platform-tab${index === activeIndex ? ' is-active' : ''}`}
                aria-pressed={index === activeIndex}
                aria-controls="platform-demo"
                onClick={() => setActiveIndex(index)}
              >
                <span className="tab-index">0{index + 1}</span>{view.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          id="platform-demo"
          className="platform-window"
          style={{ y: reduceMotion ? 0 : windowY, scale: reduceMotion ? 1 : windowScale }}
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
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
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: reduceMotion ? 0 : 0.22 }}
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
                        fill="none" stroke="#6f9854" strokeWidth="3" strokeLinecap="round"
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
                      initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                      transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    >
                      <p className="insight-label">{activeView.badge}</p>
                      <div className="mini-bars" aria-hidden="true">
                        {activeView.bars.map((height, index) => (
                          <motion.i key={`${activeView.label}-${index}`} initial={reduceMotion ? false : { scaleY: 0.2 }} animate={{ scaleY: 1 }} transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.035 }} style={{ height: `${height}%`, transformOrigin: 'bottom' }} />
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
                  initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -7 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
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
