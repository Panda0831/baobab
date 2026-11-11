import React, { FormEvent, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const Contact: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const [attempted, setAttempted] = useState(false)
  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const [notice, setNotice] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAttempted(true)
    const form = event.currentTarget
    const invalid = Array.from(form.elements).filter((element): element is HTMLInputElement | HTMLTextAreaElement => element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement).filter((element) => !element.validity.valid).map((element) => element.name)
    setInvalidFields(invalid)
    if (!form.checkValidity()) {
      form.reportValidity()
      setNotice('Vérifiez les champs indiqués avant de continuer.')
      return
    }
    setNotice('Vos informations sont prêtes, mais aucun service d’envoi n’est encore configuré sur ce site. Aucun message n’a été transmis.')
  }

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, validity } = event.currentTarget
    setNotice('')
    if (validity.valid) setInvalidFields((fields) => fields.filter((field) => field !== name))
  }

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container contact-layout">
        <motion.div className="contact-copy" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.55 }}>
          <span className="eyebrow">Et si on construisait la suite ?</span>
          <h2 id="contact-title">Parlons de ce que vous voulez rendre possible.</h2>
          <p>Un besoin à clarifier, une idée à explorer ou un produit à concevoir ? Présentez-nous votre projet. Nous commencerons par écouter.</p>
          <div className="contact-aside"><span className="contact-mark" aria-hidden="true">B.</span><p><strong>Baobab</strong><br />Une équipe technologique à l’écoute de vos projets.</p></div>
        </motion.div>
        <motion.form className="contact-form" onSubmit={handleSubmit} noValidate initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.1 }}>
          <div className="form-row">
            <label>Nom<input name="name" autoComplete="name" required aria-invalid={attempted && invalidFields.includes('name')} placeholder="Votre nom" onChange={handleFieldChange} /></label>
            <label>E-mail<input name="email" type="email" autoComplete="email" required aria-invalid={attempted && invalidFields.includes('email')} placeholder="vous@entreprise.com" onChange={handleFieldChange} /></label>
          </div>
          <label>Sujet<input name="subject" required aria-invalid={attempted && invalidFields.includes('subject')} placeholder="Comment pouvons-nous vous aider ?" onChange={handleFieldChange} /></label>
          <label>Votre message<textarea name="message" rows={5} required aria-invalid={attempted && invalidFields.includes('message')} placeholder="Quelques lignes sur votre projet…" onChange={handleFieldChange} /></label>
          <div className="form-submit-row"><button className="cta-button" type="submit">Vérifier mon message <span aria-hidden="true">↗</span></button><span className="form-privacy">Vos champs restent dans cette page.</span></div>
          <p className="form-notice" role="status" aria-live="polite">{notice}</p>
          <p className="form-setup-note">Le site ne dispose pas encore d’adresse de contact ni de service de traitement des messages.</p>
        </motion.form>
      </div>
    </section>
  )
}

export default Contact
