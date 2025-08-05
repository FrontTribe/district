# Globals - Menu and Footer

This project now includes global configurations for Menu and Footer that can be assigned to specific tenants or used for the main domain.

## Overview

The globals system allows you to:

- Create tenant-specific menus and footers
- Create main domain menus and footers (when no tenant is assigned)
- Manage navigation and footer content through the Payload CMS admin interface

## Global Types

### Menu Global

- **Slug**: `menu`
- **Fields**:
  - `tenant`: Relationship to tenants (optional - if not set, used for main domain)
  - `menuItems`: Array of menu items with:
    - `label`: Display text
    - `link`: URL or path
    - `scrollTarget`: Section ID to scroll to (optional - overrides link for smooth scrolling)
    - `external`: Boolean for external links
    - `children`: Submenu items (optional)
  - `logo`: Media upload for logo image
  - `logoText`: Text logo fallback

### Footer Global

- **Slug**: `footer`
- **Fields**:
  - `tenant`: Relationship to tenants (optional - if not set, used for main domain)
  - `columns`: Array of footer columns with:
    - `title`: Column title
    - `links`: Array of links with label, link, and external flag
  - `bottomSection`: Group containing:
    - `copyright`: Copyright text
    - `socialLinks`: Array of social media links with platform and URL

## How to Use

### 1. Accessing Globals in Admin

1. Go to your Payload CMS admin panel
2. Navigate to "Globals" in the sidebar
3. You'll see "Menu" and "Footer" options
4. Click on either to edit the global configuration

### 2. Creating Tenant-Specific Globals

1. In the global editor, assign a tenant to the global
2. Configure the menu items or footer content
3. Save the global
4. The global will only be displayed for that specific tenant

### 3. Creating Main Domain Globals

1. Leave the tenant field empty
2. Configure the content
3. Save the global
4. The global will be displayed for the main domain (when no tenant subdomain is detected)

### 4. Menu Structure Example

```json
{
  "menuItems": [
    {
      "label": "Home",
      "link": "/",
      "scrollTarget": "hero",
      "external": false
    },
    {
      "label": "Features",
      "link": "/#features",
      "scrollTarget": "features",
      "external": false
    },
    {
      "label": "About",
      "link": "/about",
      "external": false,
      "children": [
        {
          "label": "Our Story",
          "link": "/about/story",
          "scrollTarget": "story",
          "external": false
        },
        {
          "label": "Team",
          "link": "/about/team",
          "scrollTarget": "team",
          "external": false
        }
      ]
    },
    {
      "label": "Contact",
      "link": "https://external-site.com",
      "external": true
    }
  ]
}
```

### 5. Footer Structure Example

```json
{
  "columns": [
    {
      "title": "Company",
      "links": [
        {
          "label": "About Us",
          "link": "/about",
          "external": false
        },
        {
          "label": "Careers",
          "link": "/careers",
          "external": false
        }
      ]
    },
    {
      "title": "Support",
      "links": [
        {
          "label": "Help Center",
          "link": "/help",
          "external": false
        },
        {
          "label": "Contact",
          "link": "/contact",
          "external": false
        }
      ]
    }
  ],
  "bottomSection": {
    "copyright": "© 2024 Your Company. All rights reserved.",
    "socialLinks": [
      {
        "platform": "facebook",
        "url": "https://facebook.com/yourcompany"
      },
      {
        "platform": "twitter",
        "url": "https://twitter.com/yourcompany"
      }
    ]
  }
}
```

## Section Scrolling & Navigation

### Overview

The system now supports smooth scrolling to sections within landing pages. Each block can have a unique section ID, and menu items can target these sections for smooth navigation.

### How Section Scrolling Works

1. **Section IDs**: Each block (Hero, Features, Section) can have an optional `sectionId` field
2. **Menu Targets**: Menu items can have a `scrollTarget` field that matches a section ID
3. **Smooth Scrolling**: When a menu item with a scrollTarget is clicked, the page smoothly scrolls to that section
4. **Fallback**: If no scrollTarget is specified, the menu item behaves normally (follows the link)

### Block Types with Section Support

- **Hero Block**: Add `sectionId` to create a scrollable hero section
- **Features Block**: Add `sectionId` to create a scrollable features section
- **Section Block**: New block type specifically for creating content sections with IDs

### Section Block Features

- **Title**: Optional section title
- **Section ID**: Required unique identifier for scrolling
- **Background Color**: Choose from multiple color options
- **Blocks**: Container for other blocks (Hero, Features, etc.)
- **Padding**: Adjustable padding (small, medium, large, extra large)
- **Height**: Control section height (auto, small, medium, large, full screen, custom)

### Usage Example

1. **Create a page** with multiple blocks (Hero, Features, Section)
2. **Add section IDs** to each block (e.g., "hero", "features", "about", "contact")
3. **Create a menu** with menu items that have matching scrollTarget values
4. **Test navigation** by clicking menu items - they should smoothly scroll to sections

**Example Page Structure:**

- Hero block with `sectionId: "hero"`
- Features block with `sectionId: "features"`
- Section block with `sectionId: "about"`
- Section block with `sectionId: "contact"`

**Example Menu Structure:**

- "Home" with `scrollTarget: "hero"`
- "Features" with `scrollTarget: "features"`
- "About" with `scrollTarget: "about"`
- "Contact" with `scrollTarget: "contact"`

## Technical Implementation

### Frontend Rendering

The globals are automatically fetched and rendered based on the current tenant:

- If a tenant subdomain is detected, tenant-specific globals are displayed
- If no tenant is detected, main domain globals are displayed
- If no globals are found, default/empty states are shown

### Access Control

- Superadmins can create and edit all globals
- Tenant admins can only create and edit globals for their assigned tenant
- The access control ensures proper data isolation between tenants

### Live Preview

Globals are included in the live preview system, so you can see changes in real-time while editing.

## Troubleshooting

### Global Not Showing

1. Check if the global has been assigned to the correct tenant
2. Verify the global is saved and published
3. Check the browser console for any errors
4. Ensure the tenant subdomain is correctly detected

### Menu/Footer Not Rendering

1. Verify the global data structure matches the expected format
2. Check that all required fields are populated
3. Look for any TypeScript errors in the console

### Access Issues

1. Ensure you have the correct role (superadmin or tenant-admin)
2. Verify your tenant assignment if you're a tenant-admin
3. Check the access control configuration in the global definitions

### Section Scrolling Issues

1. **Section not scrolling**: Verify the section ID matches exactly (case-sensitive)
2. **Menu not working**: Check that the scrollTarget field is populated in the menu item
3. **Smooth scroll not working**: Ensure the section has a valid ID attribute
4. **Scroll position wrong**: The system accounts for the fixed header (80px offset)
