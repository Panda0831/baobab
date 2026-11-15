import React, { useLayoutEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { gsap, ScrollTrigger } from '../gsap'
import { DURATION, EASE } from '../motion'

const steps = [
  {
    number: '01',
    title: 'Écoute & cadrage',
    copy: 'Objectifs, utilisateurs et contraintes posés noir sur blanc.',
    deliverable: 'Objectifs et périmètre partagés',
  },
  {
    number: '02',
    title: 'Conception',
    copy: 'Parcours, maquettes et choix techniques, validés avec vous.',
    deliverable: 'Parcours et maquettes validés',
  },
  {
    number: '03',
    title: 'Construction',
    copy: 'On développe par étapes, avec des démonstrations régulières.',
    deliverable: 'Versions testables à chaque étape',
  },
  {
    number: '04',
    title: 'Mise en ligne & suivi',
    copy: 'Livraison, prise en main et évolutions : le produit vit avec vos usages.',
    deliverable: 'Produit en ligne et équipe autonome',
  },
]

const Process: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Rail qui se dessine au scroll + étapes qui s'allument quand on les traverse.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const scope = gsap.utils.selector(sectionRef)
      const list = scope('.process-steps')[0] as HTMLElement | undefined
      const progress = scope('.process-progress')[0] as HTMLElement | undefined
      if (list && progress) {
        gsap.to(progress, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: 'top 72%',
            end: 'bottom 60%',
            scrub: 0.6,
          },
        })
      }
      scope('.process-step').forEach((step) => {
        ScrollTrigger.create({
          trigger: step as HTMLElement,
          start: 'top 66%',
          onEnter: () => step.classList.add('is-passed'),
          onLeaveBack: () => step.classList.remove('is-passed'),
        })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="methode" className="process" ref={sectionRef} aria-labelledby="process-title">
      <div className="process-glow" aria-hidden="true" />
      <div className="container process-layout">
        <motion.div
          className="process-intro"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduceMotion ? 0 : DURATION.base, ease: EASE }}
        >
          <span className="eyebrow">Notre méthode</span>
          <h2 id="process-title">Un chemin clair, du premier échange à la mise en ligne.</h2>
          <p>Vous savez toujours où en est le projet. Chaque étape se termine par un livrable concret.</p>
          <a href="#contact" className="secondary-button">Démarrer un projet <span aria-hidden="true">↗</span></a>
        </motion.div>

        <ol className="process-steps">
          <li className="process-progress" aria-hidden="true" />
          {steps.map((step, index) => (
            <motion.li
              key={step.number}
              className="process-step"
              initial={reduceMotion ? false : { opacity: 0, x: 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduceMotion ? 0 : DURATION.base, delay: reduceMotion ? 0 : index * 0.08, ease: EASE }}
            >
              <i className="process-dot" aria-hidden="true" />
              <motion.span
                className="process-number"
                aria-hidden="true"
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: reduceMotion ? 0 : DURATION.short, delay: reduceMotion ? 0 : 0.1, ease: EASE }}
              >{step.number}</motion.span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
                <motion.span
                  className="process-deliverable"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26, delay: 0.12 }}
                ><i aria-hidden="true" />{step.deliverable}</motion.span>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Process
