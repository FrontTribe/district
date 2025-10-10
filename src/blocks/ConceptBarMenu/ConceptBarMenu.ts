import { Block } from 'payload'

const ConceptBarMenu: Block = {
  slug: 'concept-bar-menu',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Menu Title',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Menu Subtitle',
      localized: true,
    },
    {
      name: 'popularBadgeText',
      type: 'text',
      label: 'Popular Badge Text',
      required: true,
      defaultValue: 'Popular',
      localized: true,
    },
    {
      name: 'menuCategories',
      type: 'array',
      label: 'Menu Categories',
      minRows: 1,
      localized: true,
      fields: [
        {
          name: 'categoryName',
          type: 'text',
          label: 'Category Name',
          required: true,
        },
        {
          name: 'categoryDescription',
          type: 'textarea',
          label: 'Category Description',
        },
        {
          name: 'categoryImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Category Image',
          required: true,
        },
        {
          name: 'menuItems',
          type: 'array',
          label: 'Menu Items',
          localized: true,
          fields: [
            {
              name: 'itemName',
              type: 'text',
              label: 'Item Name',
              required: true,
            },
            {
              name: 'itemDescription',
              type: 'textarea',
              label: 'Item Description',
            },
            {
              name: 'itemPrice',
              type: 'text',
              label: 'Item Price',
            },
            {
              name: 'isPopular',
              type: 'checkbox',
              label: 'Mark as Popular',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
      admin: {
        description: 'Optional ID for this section (used for navigation)',
      },
    },
  ],
}

export default ConceptBarMenu
