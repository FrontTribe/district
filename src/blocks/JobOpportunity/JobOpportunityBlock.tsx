'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { JobOpportunityBlockProps } from './types'
import './JobOpportunity.scss'

export const JobOpportunityBlock: React.FC<JobOpportunityBlockProps> = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonUrl,
  badgeText,
  features,
  ctaNote,
  backgroundImage,
  sectionId,
}) => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)

      // Set initial states
      gsap.set(q('.job-opportunity__title'), { opacity: 0, y: 30 })
      gsap.set(q('.job-opportunity__subtitle'), { opacity: 0, y: 20 })
      gsap.set(q('.job-opportunity__description'), { opacity: 0, y: 20 })
      gsap.set(q('.job-opportunity__button'), { opacity: 0, y: 20 })

      // Create timeline for staggered animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Animate elements in sequence
      tl.to(q('.job-opportunity__title'), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      })
        .to(
          q('.job-opportunity__subtitle'),
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4',
        )
        .to(
          q('.job-opportunity__description'),
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.3',
        )
        .to(
          q('.job-opportunity__button'),
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.2',
        )

      // Add hover animation for button
      const button = q('.job-opportunity__button')[0] as HTMLElement
      if (button) {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
          })
        })

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id={sectionId} className="job-opportunity">
      <div className="job-opportunity__container">
        {backgroundImage && (
          <div className="job-opportunity__background">
            <img
              src={backgroundImage.url}
              alt={backgroundImage.alt}
              className="job-opportunity__background-image"
            />
            <div className="job-opportunity__overlay"></div>
          </div>
        )}

        <div className="job-opportunity__content">
          <div className="job-opportunity__badge">
            <span className="job-opportunity__badge-icon"></span>
            <span className="job-opportunity__badge-text">{badgeText}</span>
          </div>

          <h2 className="job-opportunity__title">{title}</h2>
          {subtitle && <h3 className="job-opportunity__subtitle">{subtitle}</h3>}
          <p className="job-opportunity__description">{description}</p>

          <div className="job-opportunity__features">
            {features.map((feature, index) => (
              <div key={index} className="job-opportunity__feature">
                <span className="job-opportunity__feature-icon"></span>
                <span className="job-opportunity__feature-text">{feature.featureText}</span>
              </div>
            ))}
          </div>

          <div className="job-opportunity__cta">
            <a
              href={buttonUrl}
              className="job-opportunity__button"
              target={buttonUrl.startsWith('mailto:') ? undefined : '_blank'}
              rel={buttonUrl.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            >
              <span className="job-opportunity__button-text">{buttonText}</span>
              <span className="job-opportunity__button-icon">→</span>
            </a>
            <p className="job-opportunity__cta-note">{ctaNote}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
