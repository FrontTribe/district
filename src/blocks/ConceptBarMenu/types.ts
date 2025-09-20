export interface MenuItem {
  itemName: string
  itemDescription?: string
  itemPrice?: string
  isPopular?: boolean
}

export interface MenuCategory {
  categoryName: string
  categoryDescription?: string
  categoryImage: {
    id: string
    url: string
    alt: string
  }
  menuItems: MenuItem[]
}

export interface ConceptBarMenuBlockProps {
  title: string
  subtitle?: string
  menuCategories: MenuCategory[]
  sectionId?: string
}
