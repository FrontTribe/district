'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export type RealEstateLiveCameraViewProps = {
  heading: string
  subtitle?: string
  /** URL of the live stream or embedded iframe src (e.g. YouTube embed, HLS, or static image fallback) */
  streamUrl?: string
  /** Optional placeholder image when stream is unavailable */
  fallbackImageUrl?: string
  sectionId?: string
}

export function RealEstateLiveCameraView({
  heading,
  subtitle,
  streamUrl,
  fallbackImageUrl,
  sectionId = 'live-camera',
}: RealEstateLiveCameraViewProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)
      gsap.set(q('.re-camera__header, .re-camera__frame'), { opacity: 0, y: 28 })
      gsap.to(q('.re-camera__header'), {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 82%' },
      })
      gsap.to(q('.re-camera__frame'), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 82%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const isEmbed =
    streamUrl?.includes('youtube') ||
    streamUrl?.includes('vimeo') ||
    streamUrl?.startsWith('<')

  return (
    <section ref={sectionRef} id={sectionId} className="re-camera">
      <div className="re-camera__container">
        <div className="re-camera__header">
          <h2 className="re-camera__heading">{heading}</h2>
          {subtitle && <p className="re-camera__subtitle">{subtitle}</p>}
        </div>
        <div className="re-camera__frame-wrap">
          <div className="re-camera__frame" ref={frameRef}>
          {streamUrl ? (
            isEmbed ? (
              <div
                className="re-camera__embed"
                dangerouslySetInnerHTML={{
                  __html: streamUrl.startsWith('<')
                    ? streamUrl
                    : `<iframe src="${streamUrl}" title="Live view" allowfullscreen></iframe>`,
                }}
              />
            ) : (
              <video
                className="re-camera__video"
                src={streamUrl}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
              />
            )
          ) : (
            <div className="re-camera__placeholder">
              {fallbackImageUrl ? (
                <img src={fallbackImageUrl} alt="Live view placeholder" />
              ) : (
                <div className="re-camera__placeholder-fallback">
                  <span className="re-camera__placeholder-icon" aria-hidden />
                  <p>Live camera view</p>
                  <p className="re-camera__placeholder-note">Stream URL can be configured in CMS</p>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  )
}
