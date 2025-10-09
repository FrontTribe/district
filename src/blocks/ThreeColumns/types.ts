export interface ThreeColumnsColumn {
  title: string
  subtitle?: string
  backgroundImage?: {
    id: string
    url: string
    alt: string
  }
  fullHeight?: boolean
  comingSoon?: boolean
  gradient?: {
    enabled: boolean
    type?: 'linear' | 'radial'
    direction?:
      | 'to-bottom'
      | 'to-top'
      | 'to-right'
      | 'to-left'
      | 'to-bottom-right'
      | 'to-bottom-left'
      | 'to-top-right'
      | 'to-top-left'
    position?:
      | 'center'
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right'
    startColor?: string
    endColor?: string
    opacity?: number
  }
  link?: {
    tenant?: {
      id: string
      subdomain: string
      name: string
    }
    text: string
    openInNewTab?: boolean
  }
  socialNetworks?: {
    facebook?: string
    instagram?: string
  }
}

export interface ThreeColumnsBlockProps {
  columns: Array<ThreeColumnsColumn>
  sectionId?: string
}
