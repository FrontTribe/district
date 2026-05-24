import { gsap, ScrollTrigger } from '@/lib/gsap'

const EASE = 'expo.out'

type ScrollOnceOptions = {
  trigger: Element
  start: string
}

function scrollOnce({ trigger, start }: ScrollOnceOptions): ScrollTrigger.Vars {
  return {
    trigger,
    start,
    once: true,
    toggleActions: 'play none none none',
  }
}

function setupHero(root: HTMLElement) {
  const titleWords = root.querySelectorAll('.hero-title .word .inner')
  if (titleWords.length) {
    gsap.fromTo(
      titleWords,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.4,
        ease: EASE,
        stagger: 0.1,
        delay: 0.15,
        immediateRender: false,
      },
    )
  }

  const heroBits = root.querySelectorAll(
    '.hero-meta, .hero-flourish, .hero-bottom > *, .hero .reveal',
  )
  if (heroBits.length) {
    gsap.fromTo(
      heroBits,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: EASE,
        stagger: 0.08,
        delay: 0.45,
        immediateRender: false,
      },
    )
  }
}

function setupScrollSplits(root: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('.split', root).forEach((el) => {
    if (el.closest('.hero')) return

    const words = el.querySelectorAll('.word .inner')
    if (!words.length) return

    const trigger = el.closest('.section-head') ?? el
    gsap.fromTo(
      words,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.1,
        ease: EASE,
        stagger: 0.06,
        immediateRender: false,
        scrollTrigger: scrollOnce({ trigger, start: 'top 88%' }),
      },
    )
  })
}

function setupScrollReveals(root: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('.reveal', root).forEach((el) => {
    if (el.closest('.hero')) return

    const delay = parseFloat(el.dataset.delay || '0') * 0.08
    const trigger = el.closest('.section-head, .offers-wrap, .section') ?? el

    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: EASE,
        delay,
        immediateRender: false,
        scrollTrigger: scrollOnce({ trigger, start: 'top 90%' }),
      },
    )
  })
}

function setupScrollClipReveals(root: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('.reveal-clip', root).forEach((el) => {
    const trigger = el.closest('.story-img, .section, .career-card') ?? el

    gsap.fromTo(
      el,
      { clipPath: 'inset(0 0 100% 0)', scale: 1.04 },
      {
        clipPath: 'inset(0 0 0% 0)',
        scale: 1,
        duration: 1.6,
        ease: EASE,
        immediateRender: false,
        scrollTrigger: scrollOnce({ trigger, start: 'top 88%' }),
      },
    )
  })
}

function setupGalleryTiles(root: HTMLElement) {
  const tiles = gsap.utils.toArray<HTMLElement>('.g-tile', root)
  if (!tiles.length) return

  ScrollTrigger.batch(tiles, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      gsap.fromTo(
        batch,
        {
          opacity: 0,
          y: 50,
          scale: 1.06,
          clipPath: 'inset(8% 8% 8% 8%)',
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.4,
          ease: EASE,
          stagger: 0.08,
          overwrite: 'auto',
          immediateRender: false,
        },
      )
    },
  })
}

function setupOfferCards(root: HTMLElement) {
  const cards = gsap.utils.toArray<HTMLElement>('.offer-card', root)
  if (!cards.length) return

  ScrollTrigger.batch(cards, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) => {
      gsap.fromTo(
        batch,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: EASE,
          stagger: 0.07,
          overwrite: 'auto',
          immediateRender: false,
        },
      )
    },
  })
}

function setupParallax(root: HTMLElement) {
  gsap.utils
    .toArray<HTMLImageElement>('.g-tile img, .story-img img, .career-card img', root)
    .forEach((img) => {
      img.classList.add('momento-parallax-img')

      const trigger = img.closest('.g-tile, .story-img, .career-card')
      if (!trigger) return

      gsap.fromTo(
        img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      )
    })
}

/** Register all Momento landing animations inside a scoped GSAP context. */
export function setupMomentoAnimations(root: HTMLElement): () => void {
  const ctx = gsap.context(() => {
    setupHero(root)
    setupScrollSplits(root)
    setupScrollReveals(root)
    setupScrollClipReveals(root)
    setupGalleryTiles(root)
    setupOfferCards(root)
    setupParallax(root)
  }, root)

  return () => ctx.revert()
}
