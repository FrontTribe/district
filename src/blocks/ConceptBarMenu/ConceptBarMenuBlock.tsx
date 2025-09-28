'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ConceptBarMenuBlockProps } from './types'
import './ConceptBarMenu.scss'

export const ConceptBarMenuBlock: React.FC<ConceptBarMenuBlockProps> = ({
  title,
  subtitle,
  popularBadgeText,
  menuCategories,
  sectionId,
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyImageRef = useRef<HTMLDivElement>(null)
  const menuListRef = useRef<HTMLDivElement>(null)
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeCategory, setActiveCategory] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef)

      // Set initial states
      gsap.set(q('.concept-bar__title'), { opacity: 0, y: 30 })
      gsap.set(q('.concept-bar__subtitle'), { opacity: 0, y: 20 })
      gsap.set(q('.concept-bar__menu-sections'), { opacity: 0, x: -30 })
      gsap.set(q('.concept-bar__sticky-image'), { opacity: 0, scale: 0.8 })

      // Animate title and subtitle
      gsap.to(q('.concept-bar__title'), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.to(q('.concept-bar__subtitle'), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Animate menu sections
      gsap.to(q('.concept-bar__menu-sections'), {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Animate sticky image with reveal effect
      gsap.to(q('.concept-bar__sticky-image'), {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            // Add crossfade animation to the initial image
            const initialImage = q('.concept-bar__image')[0]
            if (initialImage) {
              gsap.fromTo(
                initialImage,
                {
                  opacity: 0,
                  scale: 1.1,
                  filter: 'blur(10px)',
                },
                {
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                  duration: 0.6,
                  delay: 0.2,
                  ease: 'power2.out',
                },
              )
            }
          },
        },
      })

      // Create scroll triggers for each category
      categoryRefs.current.forEach((categoryRef, index) => {
        if (categoryRef) {
          ScrollTrigger.create({
            trigger: categoryRef,
            start: 'top 70%',
            end: 'bottom 30%',
            onEnter: () => {
              setActiveCategory(index)
              // Animate image change with crossfade effect
              if (stickyImageRef.current) {
                const imageContainer = stickyImageRef.current.querySelector(
                  '.concept-bar__image-container',
                )
                const image = stickyImageRef.current.querySelector('.concept-bar__image')

                if (imageContainer && image) {
                  // Crossfade animation - faster and smoother for scrolling
                  gsap.fromTo(
                    image,
                    {
                      opacity: 0,
                      scale: 1.1,
                      filter: 'blur(10px)',
                    },
                    {
                      opacity: 1,
                      scale: 1,
                      filter: 'blur(0px)',
                      duration: 0.4,
                      ease: 'power2.out',
                    },
                  )
                }
              }
            },
            onEnterBack: () => {
              setActiveCategory(index)
            },
          })
        }
      })

      // Animate menu items on scroll - faster and more responsive
      q('.concept-bar__menu-item').forEach((item: HTMLElement, index: number) => {
        gsap.set(item, { opacity: 0, y: 10 })
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          delay: index * 0.02,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [menuCategories])

  const _handleCategoryClick = (index: number) => {
    setActiveCategory(index)
    if (categoryRefs.current[index]) {
      categoryRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  return (
    <section ref={sectionRef} id={sectionId} className="concept-bar">
      <div className="concept-bar__container">
        {/* Header */}
        <div className="concept-bar__header">
          <h2 className="concept-bar__title">{title}</h2>
          {subtitle && <p className="concept-bar__subtitle">{subtitle}</p>}
        </div>

        <div className="concept-bar__content">
          {/* Left Side - Menu Categories with Items */}
          <div className="concept-bar__menu-sections" ref={menuListRef}>
            {menuCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                ref={(el) => {
                  categoryRefs.current[categoryIndex] = el
                }}
                className="concept-bar__category-section"
                id={`category-${categoryIndex}`}
              >
                <div className="concept-bar__category-header">
                  <h3 className="concept-bar__category-title">{category.categoryName}</h3>
                  {category.categoryDescription && (
                    <p className="concept-bar__category-subtitle">{category.categoryDescription}</p>
                  )}
                </div>

                <div className="concept-bar__menu-items">
                  {category.menuItems.map((item, itemIndex) => (
                    <div key={itemIndex} className="concept-bar__menu-item">
                      <div className="concept-bar__item-content">
                        <div className="concept-bar__item-header">
                          <h4 className="concept-bar__item-name">
                            {item.itemName}
                            {item.isPopular && (
                              <span className="concept-bar__popular-badge">{popularBadgeText}</span>
                            )}
                          </h4>
                          {item.itemPrice && (
                            <span className="concept-bar__item-price">€{item.itemPrice}</span>
                          )}
                        </div>
                        {item.itemDescription && (
                          <p className="concept-bar__item-description">{item.itemDescription}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Sticky Image */}
          <div className="concept-bar__sticky-image" ref={stickyImageRef}>
            {menuCategories[activeCategory]?.categoryImage && (
              <div className="concept-bar__image-container">
                <img
                  src={menuCategories[activeCategory].categoryImage.url}
                  alt={menuCategories[activeCategory].categoryImage.alt}
                  className="concept-bar__image"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
