import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { gsap, ScrollTrigger } from './gsap'

/**
 * Moteur de scroll du site.
 *
 * Toutes les scènes GSAP/ScrollTrigger passent par `useScrollScene` : le
 * contexte est créé au montage, recalculé après le chargement des fontes, et
 * entièrement réverté au démontage (tweens, ScrollTriggers, pins, styles
 * inline). Les media queries sont gérées par gsap.matchMedia, ce qui garantit
 * qu'un redimensionnement ou un changement de préférence de mouvement
 * reconstruit proprement la scène.
 */

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const DESKTOP = '(min-width: 1024px) and (min-height: 620px)'

export interface ScrollScene {
  scope: HTMLElement
  q: (selector: string) => HTMLElement[]
}

/**
 * Branche une scène de scroll sur une section React.
 * `build` peut retourner une fonction de nettoyage supplémentaire.
 */
export function useScrollScene(
  ref: RefObject<HTMLElement | null>,
  build: (scene: ScrollScene) => void | (() => void),
  query: string = MOTION_OK,
) {
  const buildRef = useRef(build)
  buildRef.current = build

  useLayoutEffect(() => {
    const media = gsap.matchMedia()

    media.add(query, () => {
      const scope = ref.current
      if (!scope) return

      const q = gsap.utils.selector(scope) as (selector: string) => HTMLElement[]
      const context = gsap.context(() => buildRef.current({ scope, q }), scope)

      // Les fontes changent la hauteur des titres : on recalcule les
      // déclencheurs une fois qu'elles sont prêtes (et au chargement complet).
      const refresh = () => ScrollTrigger.refresh()
      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
      fonts?.ready.then(refresh).catch(() => undefined)
      window.addEventListener('load', refresh)

      return () => {
        window.removeEventListener('load', refresh)
        context.revert()
      }
    })

    return () => media.revert()
  }, [ref, query])
}

type Targets = gsap.TweenTarget

export interface RevealOptions {
  /** Élément qui pilote le déclencheur. Par défaut le premier élément animé. */
  trigger?: Element | null
  start?: string
  end?: string
  y?: number
  x?: number
  scale?: number
  duration?: number
  stagger?: number
  delay?: number
  once?: boolean
  ease?: string
}

/**
 * Révélation douce au scroll. Avec `stagger`, un seul déclencheur orchestre
 * toute la série (listes, pieds de section) ; sinon chaque élément peut avoir
 * son propre déclencheur via `revealEach`.
 */
export function reveal(targets: Targets, options: RevealOptions = {}) {
  const els = gsap.utils.toArray<HTMLElement>(targets)
  if (!els.length) return

  const {
    trigger,
    start = 'top 86%',
    end,
    y = 32,
    x = 0,
    scale,
    duration = 0.85,
    stagger = 0,
    delay = 0,
    once = true,
    ease = 'power4.out',
  } = options

  gsap.set(els, { autoAlpha: 0, y, x, ...(scale ? { scale } : {}) })
  return gsap.to(els, {
    autoAlpha: 1,
    y: 0,
    x: 0,
    ...(scale ? { scale: 1 } : {}),
    duration,
    stagger,
    delay,
    ease,
    scrollTrigger: { trigger: trigger ?? els[0], start, end, once },
  })
}

/** Un déclencheur par élément : idéal pour une grille qui entre ligne par ligne. */
export function revealEach(targets: Targets, options: RevealOptions & { columns?: number } = {}) {
  const els = gsap.utils.toArray<HTMLElement>(targets)
  const { columns = 3, stagger = 0.06, ...rest } = options

  els.forEach((el, index) => {
    reveal([el], {
      ...rest,
      trigger: el,
      delay: (index % columns) * stagger,
    })
  })
}

export interface MaskRevealOptions {
  trigger?: Element | null
  start?: string
  duration?: number
  stagger?: number
  delay?: number
  /** Bord depuis lequel le visuel se dévoile. */
  from?: 'bottom' | 'left' | 'right' | 'top'
  /** Sélecteur du média interne à remettre à l'échelle pendant le dévoilement. */
  inner?: string | false
  innerScale?: number
}

const INSETS = {
  bottom: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  top: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
  left: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  right: ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
} as const

/**
 * Dévoilement cinématique façon cache : le cadre se découvre, le média
 * respire légèrement. `clip-path` reste composité sur GPU.
 */
export function maskReveal(targets: Targets, options: MaskRevealOptions = {}) {
  const els = gsap.utils.toArray<HTMLElement>(targets)
  if (!els.length) return

  const {
    trigger,
    start = 'top 85%',
    duration = 1,
    stagger = 0,
    delay = 0,
    from = 'bottom',
    inner = 'img, video',
    innerScale = 1.12,
  } = options

  const [clipFrom, clipTo] = INSETS[from]
  const media = inner
    ? els.flatMap((el) => Array.from(el.querySelectorAll<HTMLElement>(inner)))
    : []

  gsap.set(els, { clipPath: clipFrom, webkitClipPath: clipFrom })
  if (media.length) gsap.set(media, { scale: innerScale })

  const timeline = gsap.timeline({
    scrollTrigger: { trigger: trigger ?? els[0], start, once: true },
    delay,
  })

  timeline.to(
    els,
    { clipPath: clipTo, webkitClipPath: clipTo, duration, stagger, ease: 'power4.inOut' },
    0,
  )
  if (media.length) {
    timeline.to(
      media,
      {
        scale: 1,
        duration: duration + 0.15,
        stagger,
        ease: 'power3.out',
        // Rend la main au CSS (survol, filtres) une fois le dévoilement fini.
        clearProps: 'transform',
      },
      0,
    )
  }
  return timeline
}

export interface ParallaxOptions {
  trigger?: Element | null
  start?: string
  end?: string
  scrub?: number | boolean
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  ease?: string
}

/**
 * Parallaxe pilotée par la position du scroll. On n'anime que des transforms.
 */
export function parallax(targets: Targets, options: ParallaxOptions = {}) {
  const els = gsap.utils.toArray<HTMLElement>(targets)
  if (!els.length) return

  const {
    trigger,
    start = 'top bottom',
    end = 'bottom top',
    scrub = 0.6,
    from = {},
    to = {},
    ease = 'none',
  } = options

  return gsap.fromTo(els, from, {
    ...to,
    ease,
    scrollTrigger: { trigger: trigger ?? els[0], start, end, scrub },
  })
}

export interface HorizontalScrollOptions {
  wrap: HTMLElement
  track: HTMLElement
  start?: string
  scrub?: number
  /** Appelé à chaque progression et à chaque rafraîchissement. */
  onProgress?: (progress: number) => void
  /** Appelé une fois l'épinglage terminé, quand le rail est à sa fin. */
  onEnd?: () => void
}

/**
 * Section épinglée qui se parcourt horizontalement. La distance est calculée
 * depuis la largeur réelle du rail et recalculée à chaque refresh.
 */
export function horizontalScroll({
  wrap,
  track,
  start = 'top 88px',
  scrub = 0.7,
  onProgress,
  onEnd,
}: HorizontalScrollOptions) {
  const distance = () => Math.max(0, track.scrollWidth - wrap.clientWidth)

  let scrollTrigger: ScrollTrigger | undefined

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: wrap,
      start,
      end: () => `+=${distance()}`,
      pin: true,
      scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => onProgress?.(self.progress),
      // `this` n'est pas garanti selon la façon dont GSAP invoque le retour :
      // on lit l'instance via une référence stable.
      onRefresh: () => {
        if (scrollTrigger) onProgress?.(scrollTrigger.progress)
      },
      // En fin d'épinglage, le rail est à sa position finale : on peut révéler
      // ce qui n'a pas été croisé lors d'un saut de scroll (ancre, clavier).
      onLeave: () => {
        onProgress?.(1)
        onEnd?.()
      },
    },
  })

  scrollTrigger = timeline.scrollTrigger

  timeline.to(track, { x: () => -distance() }, 0)

  return { timeline, distance }
}
