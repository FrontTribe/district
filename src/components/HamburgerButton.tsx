'use client'

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

interface HamburgerButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onToggle }) => {
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    onToggle()
  }

  // GSAP animation for hamburger to X transformation
  useEffect(() => {
    if (!hamburgerRef.current) return

    const hamburger = hamburgerRef.current
    const line1 = hamburger.querySelector('.hamburger-line:nth-child(1)')
    const line2 = hamburger.querySelector('.hamburger-line:nth-child(2)')
    const line3 = hamburger.querySelector('.hamburger-line:nth-child(3)')

    if (isOpen) {
      // Transform to X with timeline for better control
      const openTl = gsap.timeline()
      openTl
        .to(line1, { rotation: 45, y: 6, duration: 0.3, ease: 'power2.out' })
        .to(line2, { opacity: 0, duration: 0.2, ease: 'power2.out' }, '-=0.2')
        .to(line3, { rotation: -45, y: -6, duration: 0.3, ease: 'power2.out' }, '-=0.3')
    } else {
      // Transform back to hamburger with timeline
      const closeTl = gsap.timeline()
      closeTl
        .to(line1, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' })
        .to(line2, { opacity: 1, duration: 0.2, ease: 'power2.out' }, '-=0.2')
        .to(line3, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.3')
    }
  }, [isOpen])

  return (
    <button
      ref={hamburgerRef}
      className="mobile-hamburger"
      onClick={handleClick}
      aria-label="Toggle mobile menu"
      aria-expanded={isOpen}
    >
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>
  )
}
