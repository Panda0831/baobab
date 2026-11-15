import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASE } from '../motion'

const steps = [
  {
    number: '01',
    title: 'Écoute & cadrage',
    copy: 'Nous clarifions vos objectifs, vos utilisateurs et vos contraintes. Le périmètre est posé noir sur blanc avant de dessiner quoi que ce soit.',
    deliverable: 'Objectifs et périmètre partagés',
  },
  {
    number: '02',
    title: 'Conception',
    copy: 'Parcours, maquettes et choix techniques sont validés ensemble. Vous voyez le produit avant qu’il soit construit.',
    deliverable: 'Parcours et maquettes validés',
  },
  {
    number: '03',
    title: 'Construction',
    copy: 'Nous développons par étapes, avec des démonstrations régulières. Les ajustements se font en cours de route, pas à la fin.',
    deliverable: 'Versions testables à chaque étape',
  },
  {
    number: '04',
    title: 'Mise en ligne & suivi',
    copy: 'Livraison, prise en main et améliorations après le lancement. Le produit continue de vivre avec vos usages.',
    deliverable: 'Produit en ligne et équipe autonome',
  },
]

const Process: React.FC = () => {
  const reduceMotion = useReducedMotion()

  return (
    <section id="methode" className="process" aria-labelledby="process-title">
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
          <p>Pas de boîte noire : vous savez où en est le projet, ce qui est décidé et ce qui arrive ensuite. Chaque étape se termine par un livrable concret.</p>
          <a href="#contact" className="secondary-button">Démarrer un projet <span aria-hidden="true">↗</span></a>
        </motion.div>

        <ol className="process-steps">
          {steps.map((step, index) => (
            <motion.li
              key={step.number}
              className="process-step"
              initial={reduceMotion ? false : { opacity: 0, x: 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduceMotion ? 0 : DURATION.base, delay: reduceMotion ? 0 : index * 0.08, ease: EASE }}
            >
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
