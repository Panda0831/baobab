import React, { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { gsap, revealHeader } from '../gsap'
import { useScrollScene } from '../scroll'
import { fadeUpItem, stagger } from '../motion'
import barsonPhoto from '../baobab-site/assets/barson.jpeg'
import tsioryPhoto from '../baobab-site/assets/tsiory.jpeg'
import fitiavanaPhoto from '../baobab-site/assets/sariaka.jpeg'
import tiahPhoto from '../baobab-site/assets/tiah.jpg'
import tynoPhoto from '../baobab-site/assets/tyno.jpeg'
import mikajyPhoto from '../baobab-site/assets/mikajy.jpeg'
import ryanPhoto from '../baobab-site/assets/ryan.jpg'
import erickPhoto from '../baobab-site/assets/eric.jpg'
import andyPhoto from '../baobab-site/assets/andy.jpeg'

type Pole = 'direction' | 'croissance' | 'technique'

interface TeamMember {
  name: string
  role: string
  pole: Pole
  photo?: string
}

interface PoleFilter {
  id: Pole | 'tous'
  label: string
}

const poles: PoleFilter[] = [
  { id: 'tous', label: 'Toute l’équipe' },
  { id: 'direction', label: 'Direction' },
  { id: 'croissance', label: 'Croissance' },
  { id: 'technique', label: 'Technique' },
]

// Noms et rôles issus de membres.md. Les portraits ne sont associés que si le fichier correspond.
const members: TeamMember[] = [
  { name: 'Fanamby', role: 'CEO', pole: 'direction' },
  { name: 'Tiah', role: 'Assistant CEO · Relation client', pole: 'direction', photo: tiahPhoto },
  { name: 'Tyno', role: 'Lead community manager', pole: 'croissance', photo: tynoPhoto },
  { name: 'Barson', role: 'Lead partenariat & affiliation', pole: 'croissance', photo: barsonPhoto },
  { name: 'Fitiavana', role: 'Lead relation client', pole: 'croissance', photo: fitiavanaPhoto },
  { name: 'Tsiory', role: 'Lead commercial & finance', pole: 'croissance', photo: tsioryPhoto },
  { name: 'Mikajy', role: 'Commercial & finance', pole: 'croissance', photo: mikajyPhoto },
  { name: 'Ryan', role: 'Développeur full-stack', pole: 'technique', photo: ryanPhoto },
  { name: 'Andy', role: 'Développeur full-stack', pole: 'technique', photo: andyPhoto },
  { name: 'Erick', role: 'Développeur full-stack', pole: 'technique', photo: erickPhoto },
]

const Team: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [activePole, setActivePole] = useState<Pole | 'tous'>('tous')
  const visibleMembers = activePole === 'tous' ? members : members.filter((member) => member.pole === activePole)

  // En-tête en rideau + portraits dévoilés par un cache qui monte, une seule
  // fois à l'arrivée. Les membres filtrés ensuite gardent leur état révélé.
  useScrollScene(sectionRef, ({ scope, q }) => {
    const header = scope.querySelector('.section-header')
    const cleanupHeader = header ? revealHeader(header) : undefined

    const portraits = q('.member-portrait')
    portraits.forEach((portrait, index) => {
      const image = portrait.querySelector<HTMLElement>('img')
      const delay = (index % 4) * 0.05

      gsap.set(portrait, { clipPath: 'inset(100% 0% 0% 0%)', webkitClipPath: 'inset(100% 0% 0% 0%)' })
      gsap.to(portrait, {
        clipPath: 'inset(0% 0% 0% 0%)',
        webkitClipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.9,
        delay,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: portrait, start: 'top 90%', once: true },
      })

      if (image) {
        gsap.fromTo(
          image,
          { scale: 1.12 },
          {
            scale: 1,
            duration: 1.15,
            delay,
            ease: 'power3.out',
            // Rendu au CSS après révélation pour ne pas bloquer le survol.
            clearProps: 'transform',
            scrollTrigger: { trigger: portrait, start: 'top 90%', once: true },
          },
        )
      }
    })

    return () => cleanupHeader?.()
  })

  return (
    <section id="equipe" className="team" ref={sectionRef} aria-labelledby="team-title">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Une équipe engagée</span>
          <h2 id="team-title">10 talents, un même élan</h2>
          <p>Des expertises complémentaires, une même exigence : des outils utiles.</p>
        </div>

        <div className="team-filters" role="group" aria-label="Filtrer l’équipe par pôle">
          {poles.map((pole) => {
            const isActive = activePole === pole.id
            const count = pole.id === 'tous' ? members.length : members.filter((member) => member.pole === pole.id).length
            return (
              <button
                key={pole.id}
                type="button"
                className={`team-filter${isActive ? ' is-active' : ''}`}
                aria-pressed={isActive}
                onClick={() => setActivePole(pole.id)}
              >
                {isActive && (
                  <motion.span
                    className="filter-pill"
                    layoutId="team-filter-pill"
                    aria-hidden="true"
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34, mass: 0.6 }}
                  />
                )}
                <span className="filter-label">{pole.label}</span>
                <span className="filter-count" aria-hidden="true">{count}</span>
              </button>
            )
          })}
        </div>

        <p className="visually-hidden" role="status" aria-live="polite">
          {visibleMembers.length} profils affichés.
        </p>

        <motion.div
          className="team-grid"
          layout
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={stagger(reduceMotion, 0.055)}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleMembers.map((member) => (
              <motion.article
                layout
                key={member.name}
                className="team-member"
                variants={fadeUpItem(reduceMotion, 34)}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96, transition: { duration: 0.16 } }}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 28 }}
                whileHover={reduceMotion ? undefined : { y: -6 }}
              >
                <div className={`member-portrait${member.photo ? ' has-photo' : ''}`}>
                  {member.photo ? (
                    <img src={member.photo} alt={`Portrait de ${member.name}`} loading="lazy" />
                  ) : (
                    <span aria-hidden="true">{member.name.slice(0, 1).toUpperCase()}</span>
                  )}
                  <span className="member-number" aria-hidden="true">{String(members.indexOf(member) + 1).padStart(2, '0')}</span>
                </div>
                <div className="member-details">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

export default Team
