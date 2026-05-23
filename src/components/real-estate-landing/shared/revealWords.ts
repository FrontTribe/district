'use client'

import { gsap } from '@/lib/gsap'

type WordAnimOpts = {
  stagger?: number
  duration?: number
  delay?: number
}

/** Entrance reveal for `.word > i` nodes (hero load, no scroll trigger). */
export function animateWordsEntrance(scope: Element | null, opts: WordAnimOpts = {}) {
  if (typeof window === 'undefined' || !scope || !gsap) return null
  const words = scope.querySelectorAll('.word > i')
  if (!words.length) return null
  gsap.set(words, { yPercent: 102 })
  return gsap.to(words, {
    yPercent: 0,
    duration: opts.duration ?? 1.2,
    ease: 'expo.out',
    stagger: opts.stagger ?? 0.06,
    delay: opts.delay ?? 0,
  })
}

export function revealWordsIn(
  scope: Element | null,
  opts: {
    trigger?: Element | null
    start?: string
    stagger?: number
    duration?: number
    delay?: number
    scrub?: boolean
  } = {},
) {
  if (typeof window === 'undefined' || !scope || !gsap) return null
  const words = scope.querySelectorAll('.word > i')
  if (!words.length) return null
  const trigger = opts.trigger || scope
  return gsap.fromTo(
    words,
    { yPercent: 102 },
    {
      yPercent: 0,
      duration: opts.duration ?? 1.1,
      ease: 'expo.out',
      stagger: opts.stagger ?? 0.045,
      delay: opts.delay ?? 0,
      scrollTrigger:
        opts.scrub === false
          ? undefined
          : {
              trigger,
              start: opts.start || 'top 80%',
              once: true,
            },
    },
  )
}
