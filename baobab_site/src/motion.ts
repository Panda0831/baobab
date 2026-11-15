import type { Transition, Variants } from 'framer-motion'

/**
 * Système de motion design du site.
 * Une seule famille d'easings, une échelle de durées courte et des
 * variantes partagées pour que toutes les sections se répondent.
 */

export type Bezier = [number, number, number, number]

export const EASE: Bezier = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT: Bezier = [0.65, 0, 0.35, 1]

export const DURATION = {
  micro: 0.18,
  short: 0.3,
  base: 0.52,
  long: 0.82,
} as const

export const springSoft = { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 } as const
export const springSnappy = { type: 'spring', stiffness: 340, damping: 32, mass: 0.7 } as const
export const springGentle = { type: 'spring', stiffness: 90, damping: 18 } as const

export const viewportOnce = { once: true, amount: 0.25 } as const

export function fadeUp(reduceMotion: boolean | null, delay = 0, distance = 24): {
  initial: false | { opacity: number; y: number }
  whileInView: { opacity: number; y: number }
  viewport: typeof viewportOnce
  transition: Transition
} {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: viewportOnce,
    transition: { duration: reduceMotion ? 0 : DURATION.base, delay: reduceMotion ? 0 : delay, ease: EASE },
  }
}

export function stagger(reduceMotion: boolean | null, step = 0.075, delayChildren = 0.04): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : step,
        delayChildren: reduceMotion ? 0 : delayChildren,
      },
    },
  }
}

export function fadeUpItem(reduceMotion: boolean | null, distance = 20): Variants {
  return {
    hidden: { opacity: 0, y: reduceMotion ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : DURATION.base, ease: EASE },
    },
  }
}
