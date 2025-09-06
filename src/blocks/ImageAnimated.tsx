'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Props = {
  src: string
  alt?: string
  width?: number
  height?: number
  caption?: string
  className?: string
}

export default function ImageAnimated({ src, alt = '', width, height, caption, className }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if ((gsap as any).registeredScrollTrigger !== true) {
      gsap.registerPlugin(ScrollTrigger)
      ;(gsap as any).registeredScrollTrigger = true
    }

    if (!imgRef.current || !wrapperRef.current) return

    const img = imgRef.current
    const tl = gsap.timeline({ paused: true })

    // Start fully clipped from the right, reveal to left->right with subtle scale
    gsap.set(img, { clipPath: 'inset(0 100% 0 0)', scale: 1.2, transformOrigin: '50% 50%' })
    tl.to(img, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.out' }, 0).to(
      img,
      {
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
      },
      0,
    )

    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => tl.play(),
    })

    return () => {
      st.kill()
      tl.kill()
    }
  }, [])

  return (
    <div
      className="image-animated"
      ref={wrapperRef}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <img
        ref={imgRef}
        className={className}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
      />
      {caption && <figcaption className="image-block__caption">{caption}</figcaption>}
    </div>
  )
}
