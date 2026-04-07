import {
  RealEstateHero,
  RealEstateAboutUs,
  RealEstateProjectsWeDid,
  RealEstateCurrentProjects,
  RealEstateLiveCameraView,
  RealEstateLookingForJob,
  RealEstateContact,
} from '@/components/real-estate-page'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Real Estate — Preview',
  description: 'Component-based preview for the real estate tenant page.',
}

/** Placeholder images for hero and project cards */
const PLACEHOLDER_HERO =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80'
const PLACEHOLDER_PROJECT =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
]

export default function PreviewRealEstatePage() {
  return (
    <main className="real-estate-preview">
      <RealEstateHero
        sectionId="hero"
        heading="Building Tomorrow"
        subheading="Premium development and real estate in the heart of the city."
        backgroundImageUrl={PLACEHOLDER_HERO}
      />

      <RealEstateAboutUs
        sectionId="about-us"
        eyebrow="Who we are"
        heading="We create spaces that inspire"
        body={
          '<p>With over two decades of experience, we develop residential and commercial projects that blend design, sustainability, and community. Every project is built on trust and long-term partnerships.</p>'
        }
      />

      <RealEstateProjectsWeDid
        sectionId="projects-we-did"
        eyebrow="Portfolio"
        heading="Projects we did"
        subtitle="A selection of our completed developments."
        projects={[
          {
            title: 'Marina Heights',
            description: 'Luxury waterfront residences with panoramic views.',
            imageUrl: PLACEHOLDER_PROJECT,
            location: 'Split',
            year: '2023',
            galleryImages: GALLERY_IMAGES,
          },
          {
            title: 'Green Park Residence',
            description: 'Sustainable living with green spaces and modern amenities.',
            imageUrl: PLACEHOLDER_PROJECT,
            location: 'Zagreb',
            year: '2022',
            galleryImages: GALLERY_IMAGES,
          },
          {
            title: 'Central Square',
            description: 'Mixed-use development in the city center.',
            imageUrl: PLACEHOLDER_PROJECT,
            location: 'Rijeka',
            year: '2021',
            galleryImages: GALLERY_IMAGES,
          },
        ]}
      />

      <RealEstateCurrentProjects
        sectionId="current-projects"
        eyebrow="In progress"
        heading="Current projects"
        subtitle="Discover what we are building next."
        projects={[
          {
            title: 'Skyline Tower',
            description: 'High-rise residential and commercial complex. Completion expected 2025.',
            imageUrl: PLACEHOLDER_PROJECT,
            status: 'In development',
            ctaText: 'View details',
            ctaUrl: '#',
          },
          {
            title: 'Riverside Quarter',
            description: 'New neighborhood with parks, retail, and housing.',
            imageUrl: PLACEHOLDER_PROJECT,
            status: 'Planning',
            ctaText: 'Learn more',
            ctaUrl: '#',
          },
        ]}
      />

      <RealEstateLiveCameraView
        sectionId="live-camera"
        heading="Live construction view"
        subtitle="Watch the progress on our flagship site in real time."
        streamUrl="https://www.youtube.com/embed/mqJLCYASw2E?autoplay=1&mute=1&rel=0"
        fallbackImageUrl={PLACEHOLDER_PROJECT}
      />

      <RealEstateLookingForJob
        sectionId="careers"
        badge="Careers"
        heading="Looking for a job?"
        subtitle="Join our team"
        description="We are always looking for talented people in construction, project management, and design. Send us your CV and we will get back to you."
        features={['Competitive salary', 'Growth opportunities', 'Great team']}
        buttonText="Send your CV"
        buttonUrl="mailto:jobs@example.com"
        ctaNote="We review every application within two weeks."
      />

      <RealEstateContact
        sectionId="contact"
        eyebrow="Get in touch"
        heading="Contact us"
        leftText="Have a question or want to discuss a project? We would love to hear from you."
        address="Sample Street 1, 10000 Zagreb"
        email="info@example.com"
        phone="+385 1 234 5678"
      />
    </main>
  )
}
