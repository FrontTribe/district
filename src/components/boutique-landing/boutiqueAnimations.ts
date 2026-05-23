import { gsap, ScrollTrigger } from '@/lib/gsap'

function boutiqueScroller(): HTMLElement | undefined {
  return typeof document !== 'undefined' ? document.documentElement : undefined
}

function boutiqueScrollTrigger(trigger: Element, start: string) {
  const scroller = boutiqueScroller()
  return scroller ? { trigger, start, scroller } : { trigger, start }
}

function splitTextSafely(el: HTMLElement): HTMLElement[] {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null)
  const textNodes: Text[] = []
  let n: Node | null
  while ((n = walker.nextNode())) {
    if (n.nodeValue?.trim()) textNodes.push(n as Text)
  }
  const wrapped: HTMLElement[] = []
  textNodes.forEach((tn) => {
    const frag = document.createDocumentFragment()
    const parts = tn.nodeValue!.split(/(\s+)/)
    parts.forEach((part) => {
      if (!part) return
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part))
      } else {
        const span = document.createElement('span')
        span.className = 'split-word'
        span.textContent = part
        frag.appendChild(span)
        wrapped.push(span)
      }
    })
    tn.parentNode?.replaceChild(frag, tn)
  })
  return wrapped
}

function lineRevealTargets(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === '1') {
    return Array.from(el.querySelectorAll('.split-word'))
  }
  el.dataset.split = '1'
  return splitTextSafely(el)
}

function isHeroReveal(el: HTMLElement) {
  return el.closest('.boutique-hero') != null
}

function setupReveals(root: HTMLElement) {
  root.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
    if (!(el instanceof HTMLElement)) return
    const targets = lineRevealTargets(el)
    if (!targets.length) return

    gsap.killTweensOf(targets)
    gsap.set(targets, { yPercent: 110, opacity: 0 })

    const tween = {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      stagger: 0.04,
      ease: 'expo.out' as const,
    }

    if (isHeroReveal(el)) {
      gsap.to(targets, { ...tween, delay: 0.1 })
      return
    }

    gsap.to(targets, {
      ...tween,
      scrollTrigger: boutiqueScrollTrigger(el, 'top 88%'),
    })
  })

  gsap.utils.toArray(root.querySelectorAll('[data-reveal="fade-up"]')).forEach((el) => {
    if (!(el instanceof HTMLElement)) return
    const delay = parseFloat(el.dataset.delay || '0')
    gsap.killTweensOf(el)
    const tween = {
      y: 0,
      opacity: 1,
      duration: 1.1,
      delay,
      ease: 'expo.out' as const,
    }
    if (isHeroReveal(el)) {
      gsap.fromTo(el, { y: 40, opacity: 0 }, tween)
      return
    }
    gsap.fromTo(el, { y: 40, opacity: 0 }, {
      ...tween,
      scrollTrigger: boutiqueScrollTrigger(el, 'top 90%'),
    })
  })

  gsap.utils.toArray(root.querySelectorAll('[data-reveal="stagger"]')).forEach((el) => {
    const kids = (el as HTMLElement).children
    gsap.fromTo(
      kids,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: boutiqueScrollTrigger(el, 'top 85%'),
      },
    )
  })

  gsap.utils.toArray(root.querySelectorAll('[data-reveal="curtain"]')).forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: boutiqueScrollTrigger(el, 'top 85%'),
      },
    )
    const inner = (el as HTMLElement).querySelector('.curtain-inner') || el
    gsap.fromTo(
      inner,
      { scale: 1.18 },
      {
        scale: 1,
        duration: 1.8,
        ease: 'expo.out',
        scrollTrigger: boutiqueScrollTrigger(el, 'top 85%'),
      },
    )
  })

  gsap.utils.toArray(root.querySelectorAll('[data-parallax]')).forEach((el) => {
    if ((el as HTMLElement).closest('.boutique-hero')) return
    const factor = parseFloat((el as HTMLElement).dataset.parallax || '0.2')
    gsap.fromTo(
      el,
      { yPercent: -factor * 50 },
      {
        yPercent: factor * 50,
        ease: 'none',
        scrollTrigger: {
          ...boutiqueScrollTrigger(el, 'top bottom'),
          end: 'bottom top',
          scrub: 1.2,
        },
      },
    )
  })

  root.querySelectorAll('[data-count]').forEach((el) => {
    const end = parseFloat(el.getAttribute('data-count') || '0')
    const suffix = el.getAttribute('data-suffix') || ''
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10)
    const obj = { v: 0 }
    gsap.to(obj, {
      v: end,
      duration: 1.8,
      ease: 'expo.out',
      scrollTrigger: boutiqueScrollTrigger(el, 'top 85%'),
      onUpdate: () => {
        el.textContent = obj.v.toFixed(decimals) + suffix
      },
    })
  })

  gsap.utils.toArray(root.querySelectorAll('.boutique-rooms .room-card')).forEach((card) => {
    gsap.fromTo(
      card,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: boutiqueScrollTrigger(card as Element, 'top 85%'),
      },
    )
  })
}

export function killBoutiqueAnimations(root: HTMLElement) {
  ScrollTrigger.getAll().forEach((st) => {
    const trigger = st.trigger
    if (trigger instanceof Element && root.contains(trigger)) {
      st.kill()
    }
  })
  gsap.killTweensOf(root.querySelectorAll('.split-word, [data-reveal]'))
}

export function initBoutiqueAnimations(root: HTMLElement) {
  if (typeof window === 'undefined') return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return

  killBoutiqueAnimations(root)
  requestAnimationFrame(() => {
    setupReveals(root)
    ScrollTrigger.refresh()
  })
}
