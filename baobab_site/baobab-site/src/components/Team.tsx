import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import barsonPhoto from '../baobab-site/assets/barson.jpeg'
import tsioryPhoto from '../baobab-site/assets/tsiory.jpeg'
import fitiavanaPhoto from '../baobab-site/assets/sariaka.jpeg'

interface TeamMember {
  name: string
  role: string
  photo?: string
}

// Names and roles are taken from membres.md. Portraits are only assigned where filenames match.
const members: TeamMember[] = [
  { name: 'Fanamby', role: 'CEO' },
  { name: 'Tiah', role: 'Assistant CEO · Relation client' },
  { name: 'Tyno', role: 'Lead community manager' },
  { name: 'Nick', role: 'Community manager' },
  { name: 'Barson', role: 'Lead partenariat & affiliation', photo: barsonPhoto },
  { name: 'Cédric', role: 'Partenariat & affiliation' },
  { name: 'Fitiavana', role: 'Lead relation client', photo: fitiavanaPhoto },
  { name: 'Tsiory', role: 'Lead commercial & finance', photo: tsioryPhoto },
  { name: 'Mikajy', role: 'Commercial & finance' },
  { name: 'Ryan', role: 'Développeur full-stack' },
  { name: 'Andy', role: 'Développeur full-stack' },
  { name: 'Erick', role: 'Développeur full-stack' },
]

const Team: React.FC = () => {
  const reduceMotion = useReducedMotion()

  return (
    <section id="equipe" className="team">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Une équipe engagée</span>
          <h2>12 talents, un même élan</h2>
          <p>Une équipe tech aux expertises complémentaires, réunie pour concevoir des solutions numériques utiles et adaptées à chaque projet.</p>
        </div>
        <div className="team-grid">
          {members.map((member, index) => (
            <motion.article
              key={member.name}
              className="team-member"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : (index % 4) * 0.07, ease: 'easeOut' }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
            >
              <div className={`member-portrait${member.photo ? ' has-photo' : ''}`}>
                {member.photo ? (
                  <img src={member.photo} alt={`Portrait de ${member.name}`} loading="lazy" />
                ) : (
                  <span aria-hidden="true">{member.name.slice(0, 1).toUpperCase()}</span>
                )}
                <span className="member-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="member-details">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
