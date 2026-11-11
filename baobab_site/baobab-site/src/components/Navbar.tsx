import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const links = [
  ['Accueil', '#accueil'],
  ['Solutions', '#services'],
  ['Plateforme', '#plateforme'],
  ['À propos', '#about'],
  ['Équipe', '#equipe'],
  ['Contact', '#contact'],
]

const Navbar: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState('#accueil')

  useEffect(() => {
    const sections = links.map(([, href]) => document.querySelector(href)).filter((section): section is Element => Boolean(section))
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) setActive(`#${visible.target.id}`)
    }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.15, 0.35] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <motion.nav
      className="navbar"
      aria-label="Navigation principale"
      initial={reduceMotion ? false : { y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' }}
    >
      <div className="container">
        <a href="#accueil" className="logo" aria-label="Baobab, accueil">
          Baobab<span aria-hidden="true">.</span>
        </a>
        <ul className="nav-links">
          {links.map(([label, href], index) => (
            <motion.li
              key={href}
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : 0.12 + index * 0.045 }}
              whileHover={reduceMotion ? undefined : { y: -2 }}
            >
              <a href={href} className={`nav-link${active === href ? ' is-active' : ''}`} aria-current={active === href ? 'location' : undefined}>{label}</a>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.nav>
  )
}

export default Navbar
