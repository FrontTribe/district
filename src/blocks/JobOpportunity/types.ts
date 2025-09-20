export interface JobOpportunityFeature {
  featureText: string
}

export interface JobOpportunityBlockProps {
  title: string
  subtitle?: string
  description: string
  buttonText: string
  buttonUrl: string
  badgeText: string
  features: JobOpportunityFeature[]
  ctaNote: string
  backgroundImage?: {
    id: string
    url: string
    alt: string
  }
  sectionId?: string
}
