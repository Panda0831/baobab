import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

/**
 * Moteur GSAP du site — un seul endroit où les plugins sont enregistrés.
 * Framer Motion reste responsable des micro-interactions (hover, filtres,
 * accordéons) ; GSAP pilote les mises en scène cinématiques et le scroll.
 */

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin)

gsap.defaults({ ease: 'power4.out', duration: 0.9 })

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin }

export const EASE_OUT = 'power4.out'
export const EASE_IN_OUT = 'power3.inOut'

/** Conditions matchMedia réutilisables — le reduced motion est un palier, pas un interrupteur. */
export const MM = {
  motionOK: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 900px)',
  mobile: '(max-width: 759px)',
}

/** Découpe un texte en lignes masquées (révélation « rideau »). Doit attendre les fontes. */
export function splitLinesMasked(
  element: HTMLElement,
  extra: { linesClass?: string } = {},
): SplitText {
  return SplitText.create(element, {
    type: 'lines',
    mask: 'lines',
    linesClass: `split-line ${extra.linesClass ?? ''}`.trim(),
    autoSplit: true,
  })
}

/** Découpe en mots (révélation cinétique pilotée au scroll). */
export function splitWords(element: HTMLElement): SplitText {
  return SplitText.create(element, {
    type: 'words',
    autoSplit: true,
  })
}

/** Attend les fontes web avant de découper le texte (évite les coupures fausses).
 *  Filet de sécurité : si les fontes traînent, on part quand même après 1,2 s
 *  (autoSplit re-découpera proprement quand elles arriveront). */
export function whenFontsReady(callback: () => void) {
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
  let cancelled = false
  let done = false
  const run = () => {
    if (cancelled || done) return
    done = true
    callback()
  }
  if (!fonts) {
    run()
  } else {
    fonts.ready.then(run)
    const timer = window.setTimeout(run, 1200)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }
  return () => {
    cancelled = true
  }
}

/** Révélation « rideau » d'un en-tête de section : eyebrow, titre découpé en
 *  lignes masquées, paragraphe. Retourne la fonction de nettoyage. */
export function revealHeader(header: Element, start = 'top 82%'): () => void {
  const eyebrow = header.querySelector('.eyebrow')
  const h2 = header.querySelector('h2') as HTMLElement | null
  const paragraph = header.querySelector('p')
  if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, y: 14 })
  if (h2) gsap.set(h2, { autoAlpha: 0 })
  if (paragraph) gsap.set(paragraph, { autoAlpha: 0, y: 16 })

  let split: SplitText | undefined
  let timeline: gsap.core.Timeline | undefined
  const build = () => {
    if (h2) {
      split = splitLinesMasked(h2)
      gsap.set(h2, { autoAlpha: 1 })
    }
    timeline = gsap.timeline({
      scrollTrigger: { trigger: header as HTMLElement, start, once: true },
      defaults: { ease: 'power4.out' },
    })
    if (eyebrow) timeline.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.55 }, 0)
    if (split) timeline.from(split.lines, { yPercent: 118, duration: 0.9, stagger: 0.1 }, 0.06)
    if (paragraph) timeline.to(paragraph, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.4)
    ScrollTrigger.refresh()
  }
  const cancel = whenFontsReady(build)
  return () => {
    cancel()
    timeline?.scrollTrigger?.kill()
    timeline?.kill()
    split?.revert()
    ScrollTrigger.refresh()
  }
}
