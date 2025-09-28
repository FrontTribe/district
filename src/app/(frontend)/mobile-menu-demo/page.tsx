'use client'

import React from 'react'
import { MenuWrapper } from '@/components/MenuWrapper'

const mockMenuItems = [
  {
    label: 'Home',
    link: '/',
    scrollTarget: 'hero',
  },
  {
    label: 'About',
    link: '/about',
  },
  {
    label: 'Services',
    link: '/services',
    children: [
      {
        label: 'Web Development',
        link: '/services/web',
      },
      {
        label: 'Mobile Apps',
        link: '/services/mobile',
      },
      {
        label: 'Consulting',
        link: '/services/consulting',
      },
    ],
  },
  {
    label: 'Portfolio',
    link: '/portfolio',
  },
  {
    label: 'Contact',
    link: '/contact',
  },
  {
    label: 'External Link',
    link: 'https://example.com',
    external: true,
  },
]

export default function MobileMenuDemo() {
  return (
    <div className="mobile-menu-demo">
      <MenuWrapper
        menuItems={mockMenuItems}
        logoText="Mobile Menu Demo"
        locale="en"
        menuId="demo-menu"
      />

      <main className="demo-content">
        <section id="hero" className="hero-section">
          <div className="hero-content">
            <h1>Mobile Menu Demo</h1>
            <p>
              This page demonstrates the mobile-optimized menu with hamburger button and GSAP
              animations.
            </p>
            <p>Resize your browser window to see the mobile menu in action!</p>
          </div>
        </section>

        <section id="about" className="demo-section">
          <h2>About Section</h2>
          <p>This is a demo section to test the mobile menu navigation.</p>
        </section>

        <section id="services" className="demo-section">
          <h2>Services Section</h2>
          <p>This section demonstrates how the mobile menu handles nested menu items.</p>
        </section>

        <section id="portfolio" className="demo-section">
          <h2>Portfolio Section</h2>
          <p>Another section to test the smooth scrolling functionality.</p>
        </section>

        <section id="contact" className="demo-section">
          <h2>Contact Section</h2>
          <p>Final section to complete the demo experience.</p>
        </section>
      </main>

      <style jsx>{`
        .mobile-menu-demo {
          min-height: 100vh;
          background: #051e24;
          color: #ffffff;
        }

        .demo-content {
          padding-top: 80px; /* Account for fixed header */
        }

        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
        }

        .hero-content h1 {
          font-family: var(--font-marcellus), 'Marcellus', serif;
          font-size: clamp(2rem, 5vw, 4rem);
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .hero-content p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .demo-section {
          padding: 4rem 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .demo-section h2 {
          font-family: var(--font-marcellus), 'Marcellus', serif;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .demo-section p {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2.5rem;
          }

          .hero-content p {
            font-size: 1rem;
          }

          .demo-section {
            padding: 3rem 1.5rem;
          }

          .demo-section h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
}
