import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileMenu } from '../MobileMenu'

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    timeline: jest.fn(() => ({
      set: jest.fn().mockReturnThis(),
      fromTo: jest.fn().mockReturnThis(),
      to: jest.fn().mockReturnThis(),
      reverse: jest.fn().mockReturnThis(),
    })),
    set: jest.fn(),
  },
}))

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
    label: 'Contact',
    link: '/contact',
    external: true,
  },
]

const defaultProps = {
  menuItems: mockMenuItems,
  logoText: 'Test Logo',
  locale: 'en',
  onLanguageChange: jest.fn(),
  isLanguageChanging: false,
  isTenantMenu: false,
}

describe('MobileMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders hamburger button', () => {
    render(<MobileMenu {...defaultProps} />)

    const hamburgerButton = screen.getByRole('button', { name: /toggle mobile menu/i })
    expect(hamburgerButton).toBeInTheDocument()
  })

  it('renders hamburger lines', () => {
    render(<MobileMenu {...defaultProps} />)

    const hamburgerLines = screen.getAllByRole('button')[0].querySelectorAll('.hamburger-line')
    expect(hamburgerLines).toHaveLength(3)
  })

  it('toggles menu visibility when hamburger is clicked', () => {
    render(<MobileMenu {...defaultProps} />)

    const hamburgerButton = screen.getByRole('button', { name: /toggle mobile menu/i })

    // Initially closed
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')

    // Click to open
    fireEvent.click(hamburgerButton)
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true')

    // Click to close
    fireEvent.click(hamburgerButton)
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders menu items when menu is open', () => {
    render(<MobileMenu {...defaultProps} />)

    const hamburgerButton = screen.getByRole('button', { name: /toggle mobile menu/i })
    fireEvent.click(hamburgerButton)

    // Check if menu items are rendered
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders external link icon for external links', () => {
    render(<MobileMenu {...defaultProps} />)

    const hamburgerButton = screen.getByRole('button', { name: /toggle mobile menu/i })
    fireEvent.click(hamburgerButton)

    const contactLink = screen.getByText('Contact')
    const externalIcon = contactLink.querySelector('svg')
    expect(externalIcon).toBeInTheDocument()
  })

  it('renders language switcher buttons', () => {
    render(<MobileMenu {...defaultProps} />)

    const hamburgerButton = screen.getByRole('button', { name: /toggle mobile menu/i })
    fireEvent.click(hamburgerButton)

    expect(screen.getByText('EN')).toBeInTheDocument()
    expect(screen.getByText('HR')).toBeInTheDocument()
  })

  it('calls onLanguageChange when language button is clicked', () => {
    const mockOnLanguageChange = jest.fn()
    render(<MobileMenu {...defaultProps} onLanguageChange={mockOnLanguageChange} />)

    const hamburgerButton = screen.getByRole('button', { name: /toggle mobile menu/i })
    fireEvent.click(hamburgerButton)

    const hrButton = screen.getByText('HR')
    fireEvent.click(hrButton)

    expect(mockOnLanguageChange).toHaveBeenCalledWith('hr')
  })

  it('disables language buttons when language is changing', () => {
    render(<MobileMenu {...defaultProps} isLanguageChanging={true} />)

    const hamburgerButton = screen.getByRole('button', { name: /toggle mobile menu/i })
    fireEvent.click(hamburgerButton)

    const enButton = screen.getByText('EN')
    const hrButton = screen.getByText('HR')

    expect(enButton).toBeDisabled()
    expect(hrButton).toBeDisabled()
  })

  it('closes menu when menu item is clicked', () => {
    render(<MobileMenu {...defaultProps} />)

    const hamburgerButton = screen.getByRole('button', { name: /toggle mobile menu/i })

    // Open menu
    fireEvent.click(hamburgerButton)
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true')

    // Click menu item
    const homeLink = screen.getByText('Home')
    fireEvent.click(homeLink)

    // Menu should be closed
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
  })
})
