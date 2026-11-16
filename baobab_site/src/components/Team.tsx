import React, { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { gsap, revealHeader } from '../gsap'
import { useScrollScene } from '../scroll'
import { fadeUpItem, stagger } from '../motion'
import teamDirectory from '../../equipe.json'
import barsonPhoto from '../assets/barson.jpeg'
import tsioryPhoto from '../assets/tsiory.jpeg'
import fitiavanaPhoto from '../assets/sariaka.jpeg'
import tiahPhoto from '../assets/tiah.jpg'
import tynoPhoto from '../assets/tyno.jpeg'
import mikajyPhoto from '../assets/mikajy.jpeg'
import ryanPhoto from '../assets/ryan.jpg'
import erickPhoto from '../assets/eric.jpg'
import andyPhoto from '../assets/andy.jpeg'

type Pole = 'direction' | 'croissance' | 'technique'

type TeamProfile = (typeof teamDirectory.equipe)[number]

interface TeamRosterEntry {
  name: string
  role: string
  pole: Pole
  profileName: string
  photo?: string
}

interface TeamMember extends Omit<TeamRosterEntry, 'profileName'> {
  profile: TeamProfile
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
const roster: TeamRosterEntry[] = [
  { name: 'Fanamby', role: 'CEO', pole: 'direction', profileName: 'Fanamby' },
  { name: 'Tiah', role: 'Assistant CEO · Relation client', pole: 'direction', profileName: 'Tiah Anthonio', photo: tiahPhoto },
  { name: 'Tyno', role: 'Lead community manager', pole: 'croissance', profileName: 'Binks Tyno', photo: tynoPhoto },
  { name: 'Barson', role: 'Lead partenariat & affiliation', pole: 'croissance', profileName: 'Barson', photo: barsonPhoto },
  { name: 'Fitiavana', role: 'Lead relation client', pole: 'croissance', profileName: 'Rasolofoheriniaina Ny Fitiavana', photo: fitiavanaPhoto },
  { name: 'Tsiory', role: 'Lead commercial & finance', pole: 'croissance', profileName: 'Tsiory Raza', photo: tsioryPhoto },
  { name: 'Mikajy', role: 'Commercial & finance', pole: 'croissance', profileName: 'Mikajy', photo: mikajyPhoto },
  { name: 'Ryan', role: 'Développeur full-stack', pole: 'technique', profileName: 'Ryan', photo: ryanPhoto },
  { name: 'Andy', role: 'Développeur full-stack', pole: 'technique', profileName: 'Andy', photo: andyPhoto },
  { name: 'Erick', role: 'Développeur full-stack', pole: 'technique', profileName: 'Erick', photo: erickPhoto },
]

const getProfile = (name: string): TeamProfile => {
  const profile = teamDirectory.equipe.find((entry) => entry.nom === name)
  if (!profile) throw new Error(`Profil d’équipe introuvable : ${name}`)
  return profile
}

const members: TeamMember[] = roster.map(({ profileName, ...member }) => ({
  ...member,
  profile: getProfile(profileName),
}))

const ProfileField: React.FC<{ label: string; value: string | null; href?: string; isVisible: boolean }> = ({
  label,
  value,
  href,
  isVisible,
}) => (
  <div className="profile-field">
    <dt>{label}</dt>
    <dd>
      {value ? (
        href ? <a href={href} tabIndex={isVisible ? 0 : -1}>{value}</a> : value
      ) : (
        <span className="profile-unavailable">Non renseigné</span>
      )}
    </dd>
  </div>
)

interface TeamMemberCardProps {
  member: TeamMember
  index: number
  reduceMotion: boolean | null
}

const TeamMemberCard = React.forwardRef<HTMLElement, TeamMemberCardProps>(({ member, index, reduceMotion }, ref) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const isFlipped = isHovered || isFocused
  const profile = member.profile
  const phone = profile.contact.telephone?.replace(/[^\d+]/g, '')
  const whatsapp = profile.contact.whatsapp?.replace(/\D/g, '')

  return (
    <motion.article
      ref={(element) => {
        if (typeof ref === 'function') ref(element)
        else if (ref) ref.current = element
      }}
      layout
      className="team-member"
      tabIndex={0}
      aria-label={`${profile.nom ?? member.name}, ${profile.poste ?? member.role}. Utilisez Tab pour afficher les détails.`}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => {
        const nextFocusedElement = event.relatedTarget
        if (!(nextFocusedElement instanceof Node) || !event.currentTarget.contains(nextFocusedElement)) {
          setIsFocused(false)
        }
      }}
      variants={fadeUpItem(reduceMotion, 34)}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96, transition: { duration: 0.16 } }}
      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 28 }}
    >
      <div className={`team-card-inner${isFlipped ? ' is-flipped' : ''}`}>
        <div className="team-card-front" aria-hidden={isFlipped}>
          <div className={`member-portrait${member.photo ? ' has-photo' : ''}`}>
            {member.photo ? (
              <img src={member.photo} alt={`Portrait de ${profile.nom ?? member.name}`} loading="lazy" />
            ) : (
              <span aria-hidden="true">{member.name.slice(0, 1).toUpperCase()}</span>
            )}
            <span className="member-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <div className="member-details">
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        </div>

        <div className="team-card-back" aria-hidden={!isFlipped}>
          <div className="member-profile-heading">
            <span className="eyebrow">Membre de l’équipe</span>
            <h3>{profile.nom ?? member.name}</h3>
            <p>{profile.poste ?? member.role}</p>
          </div>
          <div className="member-profile-scroll">
            <section className="member-profile-section" aria-label="Présentation">
              <h4>À propos</h4>
              <p>{profile.description ?? 'Aucune description renseignée pour le moment.'}</p>
            </section>
            <section className="member-profile-section" aria-label="Coordonnées">
              <h4>Contact</h4>
              <dl className="member-profile-fields">
                <ProfileField label="Email" value={profile.contact.email} href={profile.contact.email ? `mailto:${profile.contact.email}` : undefined} isVisible={isFlipped} />
                <ProfileField label="Téléphone" value={profile.contact.telephone} href={phone ? `tel:${phone}` : undefined} isVisible={isFlipped} />
                <ProfileField label="WhatsApp" value={profile.contact.whatsapp} href={whatsapp ? `https://wa.me/${whatsapp}` : undefined} isVisible={isFlipped} />
              </dl>
            </section>
            <section className="member-profile-section" aria-label="Réseaux sociaux">
              <h4>Réseaux sociaux</h4>
              <dl className="member-profile-fields">
                <ProfileField label="LinkedIn" value={profile.reseaux_sociaux.linkedin} isVisible={isFlipped} />
                <ProfileField label="Facebook" value={profile.reseaux_sociaux.facebook} isVisible={isFlipped} />
                <ProfileField label="Instagram" value={profile.reseaux_sociaux.instagram} isVisible={isFlipped} />
              </dl>
            </section>
          </div>
        </div>
      </div>
    </motion.article>
  )
})
TeamMemberCard.displayName = 'TeamMemberCard'

const Team: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const isGridInView = useInView(gridRef, { once: true, amount: 0.08 })
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
          ref={gridRef}
          className="team-grid"
          layout
          initial={reduceMotion ? false : 'hidden'}
          animate={isGridInView ? 'visible' : 'hidden'}
          variants={stagger(reduceMotion, 0.055)}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleMembers.map((member) => (
              <TeamMemberCard
                key={member.name}
                member={member}
                index={members.indexOf(member)}
                reduceMotion={reduceMotion}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

export default Team
