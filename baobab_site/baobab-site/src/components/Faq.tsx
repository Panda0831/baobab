import React, { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { revealHeader } from '../gsap'
import { useScrollScene, revealEach } from '../scroll'
import { DURATION, EASE } from '../motion'

const questions = [
  {
    question: 'Combien de temps prend un projet ?',
    answer: 'Un site vitrine se conçoit en quelques semaines ; une application métier avance par étapes. Le calendrier est fixé après le cadrage, et ajusté si le périmètre évolue.',
  },
  {
    question: 'Nous avons déjà un site : faut-il tout refaire ?',
    answer: 'Pas nécessairement. Nous regardons ce qui fonctionne et ce qui freine : la refonte peut être partielle, progressive ou complète selon le diagnostic.',
  },
  {
    question: 'Comment se déroule la collaboration ?',
    answer: 'Un interlocuteur identifié, des points réguliers et un accès aux versions en cours. Nous privilégions les démonstrations concrètes aux longs documents.',
  },
  {
    question: 'Travaillez-vous avec nos équipes techniques ?',
    answer: 'Oui : intégration à une équipe existante, reprise d’un code en place, ou documentation claire pour une passation.',
  },
  {
    question: 'Et après la mise en ligne ?',
    answer: 'Nous assurons la prise en main, les corrections et les évolutions. Vous restez propriétaire de votre produit et de vos données.',
  },
]

const FaqItem: React.FC<{ index: number; question: string; answer: string; reduceMotion: boolean | null }> = ({ index, question, answer, reduceMotion }) => {
  const [open, setOpen] = useState(false)
  const questionId = `faq-question-${index}`
  const panelId = `faq-panel-${index}`

  return (
    <div className={`faq-item${open ? ' is-open' : ''}`}>
      <button
        type="button"
        id={questionId}
        className="faq-question"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{question}</span>
        <i aria-hidden="true">+</i>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            className="faq-answer"
            id={panelId}
            role="region"
            aria-labelledby={questionId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0, transition: { duration: 0.16, ease: 'easeIn' } }}
            transition={{ duration: reduceMotion ? 0 : 0.34, ease: EASE }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Faq: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  useScrollScene(sectionRef, ({ scope, q }) => {
    const intro = scope.querySelector('.faq-intro')
    const cleanupHeader = intro ? revealHeader(intro) : undefined
    revealEach(q('.faq-item'), { start: 'top 92%', y: 16, duration: 0.6, stagger: 0.05, columns: 3 })
    return () => cleanupHeader?.()
  })

  return (
    <section id="faq" className="faq" ref={sectionRef} aria-labelledby="faq-title">
      <div className="container faq-layout">
        <div className="faq-intro">
          <span className="eyebrow">Questions fréquentes</span>
          <h2 id="faq-title">Ce que les porteurs de projet demandent souvent.</h2>
          <p>Une question qui n’est pas ici ? Écrivez-nous, nous répondons simplement.</p>
          <a href="#contact" className="text-link">Poser votre question <span aria-hidden="true">↗</span></a>
        </div>
        <div className="faq-list">
          {questions.map((item, index) => (
            <FaqItem key={item.question} index={index} question={item.question} answer={item.answer} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq
