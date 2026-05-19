# ThreeColumns Block

This folder contains the organized structure for the ThreeColumns block component.

## File Structure

```
src/blocks/ThreeColumns/
├── index.ts              # Main exports
├── ThreeColumns.ts       # Payload CMS block definition
├── ThreeColumnsBlock.tsx # React component with GSAP animations
├── types.ts              # Shared TypeScript interfaces
└── README.md             # This documentation
```

## Files

### `index.ts`

Main export file that provides access to all ThreeColumns functionality:

- `ThreeColumns` - Payload CMS block definition
- `ThreeColumnsBlock` - React component
- All types and interfaces

### `ThreeColumns.ts`

Contains the Payload CMS block configuration with all the fields:

- Columns array (title, optional italic accent, kicker, index label, description, background image, full height, gradient, link, coming soon)
- Gradient options (linear/radial, direction/position, colors, opacity)
- Section ID for navigation

### `ThreeColumnsBlock.tsx`

React component that renders the full-viewport **District hub** triptych (see `District Landing/styles-final.css` in the repo):

- Three equal columns: background image, gradient veil, index line, kicker, large title (Fraunces + gold Instrument Serif accent), description (revealed on hover on desktop), pill CTA
- GSAP staggered fade-in on load
- Linked columns wrap the whole card in an `<a>` to the tenant subdomain
- Responsive: stacked columns under 900px with description always visible

### `types.ts`

Shared TypeScript interfaces:

- `ThreeColumnsColumn` - Individual column interface
- `ThreeColumnsBlockProps` - Component props interface

## Usage

### In Payload CMS Collections

```typescript
import { ThreeColumns } from '@/blocks/ThreeColumns'

// Add to blocks array
blocks: [ThreeColumns]
```

### In React Components

```typescript
import { ThreeColumnsBlock } from '@/blocks/ThreeColumns'

// Use the component
<ThreeColumnsBlock columns={columns} sectionId="my-section" />
```

## Features

- **3-column layout** with customizable content
- **Background images** with smooth reveal animations
- **Gradient overlays** (linear/radial) with full customization
- **Full height columns** option
- **GSAP animations** for professional reveal effects
- **Responsive design** for all screen sizes
- **Accessibility** with proper ARIA labels and focus states
