'use client'

import { gsap } from '@/lib/gsap'

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
