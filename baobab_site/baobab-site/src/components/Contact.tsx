import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { services, site, SERVICE_EVENT } from '../content'
import { DURATION, EASE } from '../motion'

const OTHER_SUBJECT = 'Autre demande'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

type Errors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = { name: '', email: '', subject: '', message: '' }

const FieldError: React.FC<{ id: string; reduceMotion: boolean | null; children: React.ReactNode }> = ({ id, reduceMotion, children }) => (
  <motion.p
    className="field-error"
    id={id}
    initial={reduceMotion ? false : { opacity: 0, y: -4 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: reduceMotion ? 0 : DURATION.micro, ease: EASE }}
  >
    {children}
  </motion.p>
)

function validate(form: FormState): Errors {
  const errors: Errors = {}
  if (form.name.trim().length < 2) errors.name = 'Indiquez votre nom, même un prénom suffit.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Vérifiez le format de votre adresse e-mail.'
  if (!form.subject) errors.subject = 'Choisissez le sujet qui correspond le mieux à votre demande.'
  if (form.message.trim().length < 20) errors.message = 'Décrivez votre projet en quelques mots (20 caractères minimum).'
  return errors
}

function buildMailto(form: FormState) {
  const subject = `Projet ${form.subject} — ${form.name.trim()}`
  const body = [
    `Bonjour l’équipe Baobab,`,
    '',
    `Nom : ${form.name.trim()}`,
    `E-mail : ${form.email.trim()}`,
    `Sujet : ${form.subject}`,
    '',
    form.message.trim(),
    '',
    '—',
    'Message préparé depuis le site baobab.',
  ].join('\n')
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const Contact: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'ready'>('idle')
  const [mailtoHref, setMailtoHref] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const noticeRef = useRef<HTMLParagraphElement>(null)

  // Une carte de service préremplit le sujet et ramène l'utilisateur sur le formulaire.
  useEffect(() => {
    const onService = (event: Event) => {
      const id = (event as CustomEvent<string>).detail
      const service = services.find((item) => item.id === id)
      if (!service) return
      setForm((current) => ({ ...current, subject: service.shortTitle }))
      setErrors((current) => ({ ...current, subject: undefined }))
      setStatus('idle')
      setCopyState('idle')
    }
    window.addEventListener(SERVICE_EVENT, onService)
    return () => window.removeEventListener(SERVICE_EVENT, onService)
  }, [])

  const updateField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.currentTarget.value
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
    if (status === 'ready') setStatus('idle')
    if (copyState !== 'idle') setCopyState('idle')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)

    const firstError = Object.keys(nextErrors)[0] as keyof FormState | undefined
    if (firstError) {
      const field = formRef.current?.elements.namedItem(firstError)
      if (field instanceof HTMLElement) field.focus()
      noticeRef.current?.focus()
      return
    }

    const href = buildMailto(form)
    setMailtoHref(href)
    setStatus('ready')
    setCopyState('idle')
    // Ouvre la messagerie de l'utilisateur avec le message déjà rédigé.
    window.location.href = href
  }

  const copyMessage = async () => {
    const service = form.subject
    const summary = [
      `À : ${site.email}`,
      `Objet : Projet ${service} — ${form.name.trim()}`,
      '',
      `Bonjour l’équipe Baobab,`,
      '',
      form.message.trim(),
      '',
      `Nom : ${form.name.trim()}`,
      `E-mail : ${form.email.trim()}`,
      `Sujet : ${service}`,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(summary)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  const describedBy = (field: keyof FormState) => (errors[field] ? `contact-${field}-error` : undefined)

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container contact-layout">
        <motion.div className="contact-copy" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.55 }}>
          <span className="eyebrow">Et si on construisait la suite ?</span>
          <h2 id="contact-title">Parlons de ce que vous voulez rendre possible.</h2>
          <p>Un besoin à clarifier, une idée à explorer ou un produit à concevoir ? Présentez-nous votre projet. Nous commencerons par écouter.</p>

          <div className="contact-channels">
            <a href={`mailto:${site.email}`} className="contact-channel">
              <span className="contact-channel-icon" aria-hidden="true">✉</span>
              <span><strong>Écrire à l’équipe</strong><small>{site.email}</small></span>
            </a>
            <div className="contact-channel">
              <span className="contact-channel-icon" aria-hidden="true">◷</span>
              <span><strong>Premier échange</strong><small>Sans engagement, pour clarifier votre besoin.</small></span>
            </div>
          </div>

          <div className="contact-aside"><span className="contact-mark" aria-hidden="true">B.</span><p><strong>Baobab</strong><br />Une équipe technologique à l’écoute de vos projets.</p></div>
        </motion.div>

        <motion.form
          ref={formRef}
          className="contact-form"
          onSubmit={handleSubmit}
          noValidate
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.1 }}
        >
          <p className="form-intro">Choisissez un sujet, racontez-nous l’essentiel : le formulaire prépare un e-mail prêt à envoyer.</p>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="contact-name">Nom</label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                value={form.name}
                placeholder="Votre nom"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy('name')}
                onChange={updateField('name')}
              />
              {errors.name && <FieldError id="contact-name-error" reduceMotion={reduceMotion}>{errors.name}</FieldError>}
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">E-mail</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                placeholder="vous@entreprise.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy('email')}
                onChange={updateField('email')}
              />
              {errors.email && <FieldError id="contact-email-error" reduceMotion={reduceMotion}>{errors.email}</FieldError>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="contact-subject">Sujet</label>
            <select
              id="contact-subject"
              name="subject"
              value={form.subject}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={describedBy('subject')}
              onChange={updateField('subject')}
            >
              <option value="">Quel est votre besoin ?</option>
              {services.map((service) => <option key={service.id} value={service.shortTitle}>{service.shortTitle}</option>)}
              <option value={OTHER_SUBJECT}>{OTHER_SUBJECT}</option>
            </select>
            {errors.subject && <FieldError id="contact-subject-error" reduceMotion={reduceMotion}>{errors.subject}</FieldError>}
          </div>

          <div className="form-field">
            <label htmlFor="contact-message">Votre message</label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              value={form.message}
              placeholder="Quelques lignes sur votre projet, votre contexte et vos échéances…"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy('message')}
              onChange={updateField('message')}
            />
            {errors.message && <FieldError id="contact-message-error" reduceMotion={reduceMotion}>{errors.message}</FieldError>}
          </div>

          <div className="form-submit-row">
            <button className="cta-button" type="submit">Préparer mon message <span aria-hidden="true">↗</span></button>
            <span className="form-privacy">Aucun serveur ne stocke vos données.</span>
          </div>

          <p className="form-notice" ref={noticeRef} role="status" aria-live="polite" tabIndex={-1}>
            {Object.keys(errors).length > 0 ? 'Quelques champs demandent votre attention.' : ''}
          </p>

          <AnimatePresence initial={false}>
          {status === 'ready' && (
            <motion.div
              className="form-ready"
              role="status"
              aria-live="polite"
              initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: reduceMotion ? 0 : DURATION.base, ease: EASE }}
            >
              <strong>Votre message est prêt.</strong>
              <p>Votre logiciel de messagerie aurait dû s’ouvrir avec le message prérempli. Sinon, utilisez l’un des boutons ci-dessous.</p>
              <div className="form-ready-actions">
                <a className="cta-button" href={mailtoHref}>Ouvrir ma messagerie <span aria-hidden="true">↗</span></a>
                <button type="button" className="copy-button" onClick={copyMessage}>
                  {copyState === 'copied' ? 'Message copié ✓' : copyState === 'failed' ? 'Copie impossible' : 'Copier le message'}
                </button>
              </div>
              <p className="form-ready-hint">Destinataire : {site.email}</p>
            </motion.div>
          )}
          </AnimatePresence>

          <p className="form-setup-note">Vous préférez écrire directement ? <a href={`mailto:${site.email}`}>{site.email}</a></p>
        </motion.form>
      </div>
    </section>
  )
}

export default Contact
