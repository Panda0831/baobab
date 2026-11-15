import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { site } from '../content'
import logo from '../baobab-site/assets/logo-baobab.png'

const Footer: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.footer
      className="footer"
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } } }}
    >
      <div className="container">
        <motion.div className="footer-content" variants={item} transition={{ duration: 0.45, ease: 'easeOut' }}>
          <motion.a href="#accueil" className="footer-logo" whileHover={reduceMotion ? undefined : { x: 3 }}>
            Baobab<span aria-hidden="true">.</span>
          </motion.a>
          <p>Une agence tech qui imagine et construit des solutions numériques pour tous les secteurs.</p>
        </motion.div>
        <motion.nav className="footer-links" aria-label="Navigation de pied de page" variants={item} transition={{ duration: 0.45, ease: 'easeOut' }}>
          <a href="#accueil">Accueil</a>
          <a href="#services">Solutions</a>
          <a href="#plateforme">Plateforme</a>
          <a href="#about">À propos</a>
          <a href="#methode">Méthode</a>
          <a href="#equipe">Équipe</a>
          <a href="#faq">Questions fréquentes</a>
        </motion.nav>
        <motion.div className="footer-social footer-discover" variants={item} transition={{ duration: 0.45, ease: 'easeOut' }}>
          <span>Un projet en tête ?</span>
          <motion.a
            href="#contact"
            className="footer-discover-link"
            whileHover={reduceMotion ? undefined : { x: 4 }}
          >
            Parlons de votre projet <span aria-hidden="true">↗</span>
          </motion.a>
          <p>Décrivez votre besoin : le formulaire prépare un e-mail prêt à envoyer.</p>
          <a className="footer-email" href={`mailto:${site.email}`}>{site.email}</a>
        </motion.div>
        <motion.div className="footer-signature" variants={item} transition={{ duration: 0.45, ease: 'easeOut' }}>
          <img className="footer-signature-tree" src={logo} alt="" aria-hidden="true" width="112" height="112" loading="lazy" decoding="async" />
          <div>
            <p className="footer-signature-name">Baobab<span aria-hidden="true">.</span></p>
            <p className="footer-signature-line">La technologie qui fait avancer vos idées.</p>
          </div>
        </motion.div>
        <motion.div className="footer-bottom" variants={item} transition={{ duration: 0.45, ease: 'easeOut' }}>
          <p>© {new Date().getFullYear()} Baobab. Tous droits réservés.</p>
          <a href="#accueil">Retour en haut ↑</a>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
