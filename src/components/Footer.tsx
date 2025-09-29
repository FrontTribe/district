import React from 'react'
import Link from 'next/link'
import './Footer.scss'

interface FooterLink {
  text: string
  url: string
  openInNewTab?: boolean | null | undefined
  id?: string | null | undefined
}

interface FooterContact {
  heading: string
  email: string
  phone?: string | null
  instagram?: string | null
}

interface FooterAddress {
  heading: string
  venue: string
  street: string
  city: string
  country: string
}

interface FooterLeftContent {
  heading: string
  subheading?: string | null
}

interface FooterRightContent {
  contact: FooterContact
  address: FooterAddress
}

interface FooterBottomContent {
  copyright: string
  links?: FooterLink[] | null | undefined
  madeBy: string
}

interface FooterProps {
  // New structure
  leftContent?: FooterLeftContent
  rightContent?: FooterRightContent
  bottomContent?: FooterBottomContent
  // Old structure (for backward compatibility)
  columns?: FooterColumn[]
  bottomSection?: {
    copyright?: string
    socialLinks?: SocialLink[]
  }
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

interface SocialLink {
  platform: string
  url: string
}

export const Footer: React.FC<FooterProps> = ({
  leftContent,
  rightContent,
  bottomContent,
  columns = [],
  bottomSection,
}) => {
  // If new structure is provided, use it; otherwise fall back to old structure
  const hasNewStructure = leftContent && rightContent && bottomContent

  if (hasNewStructure) {
    return (
      <footer className="footer">
        <div className="footer__container">
          {/* Main Content */}
          <div className="footer__main">
            {/* Left Content */}
            <div className="footer__left">
              {leftContent?.heading && (
                <h2
                  className="footer__heading"
                  dangerouslySetInnerHTML={{ __html: leftContent?.heading }}
                />
              )}
              {leftContent.subheading && (
                <p className="footer__subheading">{leftContent.subheading}</p>
              )}
            </div>

            {/* Right Content */}
            <div className="footer__right">
              {/* Contact */}
              <div className="footer__contact">
                <h3 className="footer__section-heading">{rightContent.contact.heading}</h3>
                <div className="footer__contact-details">
                  <a href={`mailto:${rightContent.contact.email}`} className="footer__link">
                    {rightContent.contact.email}
                  </a>
                  {rightContent.contact.phone && (
                    <a href={`tel:${rightContent.contact.phone}`} className="footer__link">
                      {rightContent.contact.phone}
                    </a>
                  )}
                  {rightContent.contact.instagram && (
                    <a
                      href={`https://instagram.com/${rightContent.contact.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer__instagram"
                      aria-label="Instagram"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <line
                          x1="17.5"
                          y1="6.5"
                          x2="17.51"
                          y2="6.5"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="footer__address">
                <h3 className="footer__section-heading">{rightContent.address.heading}</h3>
                <div className="footer__address-details">
                  <p className="footer__venue">{rightContent.address.venue}</p>
                  <p className="footer__street">{rightContent.address.street}</p>
                  <p className="footer__city">{rightContent.address.city}</p>
                  <p className="footer__country">{rightContent.address.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="footer__bottom">
            <div className="footer__bottom-left">
              <p className="footer__copyright">
                {bottomContent.copyright.replace(/\d{4}/, new Date().getFullYear().toString())}
              </p>
              {bottomContent.links && bottomContent.links.length > 0 && (
                <div className="footer__links">
                  {bottomContent.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      className="footer__bottom-link"
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="footer__bottom-right">
              <p className="footer__made-by">{bottomContent.madeBy}</p>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Fallback to old structure
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        {columns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {columns.map((column, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.url}
                        target={link.openInNewTab ? '_blank' : undefined}
                        rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {link.text}
                        {link.openInNewTab && (
                          <svg
                            className="ml-1 h-3 w-3 inline"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Bottom section */}
        {(bottomSection?.copyright || bottomSection?.socialLinks) && (
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Copyright */}
              {bottomSection.copyright && (
                <div className="text-gray-400 text-sm mb-4 md:mb-0">
                  {bottomSection.copyright.replace(/\d{4}/, new Date().getFullYear().toString())}
                </div>
              )}

              {/* Social links */}
              {bottomSection.socialLinks && bottomSection.socialLinks.length > 0 && (
                <div className="flex space-x-4">
                  {bottomSection.socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={`Follow us on ${social.platform}`}
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49zm-7.83 12.447c2.026 0 3.744-.753 5.153-2.162 1.409-1.409 2.162-3.127 2.162-5.153s-.753-3.744-2.162-5.153c-1.409-1.409-3.127-2.162-5.153-2.162s-3.744.753-5.153 2.162C1.297 8.703.544 10.421.544 12.447s.753 3.744 2.162 5.153c1.409 1.409 3.127 2.162 5.153 2.162z" />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}
