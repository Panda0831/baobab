import React, { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import barsonPhoto from '../baobab-site/assets/barson.jpeg'
import tsioryPhoto from '../baobab-site/assets/tsiory.jpeg'
import fitiavanaPhoto from '../baobab-site/assets/sariaka.jpeg'
import tiahPhoto from '../baobab-site/assets/tiah.jpg'

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
  { name: 'Tyno', role: 'Lead community manager', pole: 'croissance' },
  { name: 'Nick', role: 'Community manager', pole: 'croissance' },
  { name: 'Barson', role: 'Lead partenariat & affiliation', pole: 'croissance', photo: barsonPhoto },
  { name: 'Cédric', role: 'Partenariat & affiliation', pole: 'croissance' },
  { name: 'Fitiavana', role: 'Lead relation client', pole: 'croissance', photo: fitiavanaPhoto },
  { name: 'Tsiory', role: 'Lead commercial & finance', pole: 'croissance', photo: tsioryPhoto },
  { name: 'Mikajy', role: 'Commercial & finance', pole: 'croissance' },
  { name: 'Ryan', role: 'Développeur full-stack', pole: 'technique' },
  { name: 'Andy', role: 'Développeur full-stack', pole: 'technique' },
  { name: 'Erick', role: 'Développeur full-stack', pole: 'technique' },
]

const Team: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const [activePole, setActivePole] = useState<Pole | 'tous'>('tous')
  const visibleMembers = activePole === 'tous' ? members : members.filter((member) => member.pole === activePole)

  return (
    <section id="equipe" className="team" aria-labelledby="team-title">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Une équipe engagée</span>
          <h2 id="team-title">12 talents, un même élan</h2>
          <p>Une équipe tech aux expertises complémentaires, réunie pour concevoir des solutions numériques utiles et adaptées à chaque projet.</p>
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

        <motion.div className="team-grid" layout>
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleMembers.map((member) => (
              <motion.article
                layout
                key={member.name}
                className="team-member"
                initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, transition: { duration: 0.16 } }}
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
