import { CollectionConfig } from 'payload'
import { revalidatePageDeleteHook, revalidatePageHook } from '@/utils/revalidate'
import Hero from '@/blocks/Hero'
import Features from '@/blocks/Features'
import Section from '@/blocks/Section'
import Text from '@/blocks/Text/Text'
import { ThreeColumns } from '@/blocks/ThreeColumns'
import BotiqueIntro from '@/blocks/BotiqueIntro'
import BoutiqueContact from '@/blocks/BoutiqueContact'
import Rooms from '@/blocks/Rooms'
import Rooftop from '@/blocks/Rooftop'
import RooftopFeatures from '@/blocks/RooftopFeatures'
import Location from '@/blocks/Location/Location'
import ConceptBarMenu from '@/blocks/ConceptBarMenu'
import JobOpportunity from '@/blocks/JobOpportunity'
import Image from '@/blocks/Image'
import { Intro } from '@/blocks/Intro'
import { ImageGrid } from '@/blocks/ImageGrid'
import { FloorPlan } from '@/blocks/FloorPlan'
import RealEstateLandingNav from '@/blocks/RealEstateLandingNav'
import RealEstateLandingHero from '@/blocks/RealEstateLandingHero'
import RealEstateLandingMarquee from '@/blocks/RealEstateLandingMarquee'
import RealEstateLandingManifesto from '@/blocks/RealEstateLandingManifesto'
import RealEstateLandingTypology from '@/blocks/RealEstateLandingTypology'
import RealEstateLandingGallery from '@/blocks/RealEstateLandingGallery'
import RealEstateLandingCurrentProject from '@/blocks/RealEstateLandingCurrentProject'
import RealEstateLandingPartner from '@/blocks/RealEstateLandingPartner'
import RealEstateLandingInquiry from '@/blocks/RealEstateLandingInquiry'
import RealEstateLandingUnitBrowser from '@/blocks/RealEstateLandingUnitBrowser'
import RealEstateLandingPastProjects from '@/blocks/RealEstateLandingPastProjects'
import RealEstateHero from '@/blocks/RealEstateHero'
import RealEstateAboutUs from '@/blocks/RealEstateAboutUs'
import RealEstateProjectsWeDid from '@/blocks/RealEstateProjectsWeDid'
import RealEstateCurrentProjects from '@/blocks/RealEstateCurrentProjects'
import RealEstateLiveCamera from '@/blocks/RealEstateLiveCamera'
import RealEstateLookingForJob from '@/blocks/RealEstateLookingForJob'
import RealEstateContact from '@/blocks/RealEstateContact'
import { Anchor } from '@/blocks/Anchor'

const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: { en: 'Page', hr: 'Stranica' },
    plural: { en: 'Pages', hr: 'Stranice' },
  },
  admin: {
    useAsTitle: 'title',
    group: { en: 'Site Content', hr: 'Sadržaj stranice' },
    description: {
      en:
        'Pages for tenants and main domain. Layout blocks are grouped in the editor: District · Real estate (RE landing + legacy RE), District · Boutique, District · Momento (reserved), District · Hub & pages. RE landing form and contact row: edit “RE Landing — Inquiry” in the page layout. The RE landing strip footer is edited in the Footers collection (not in the page layout).',
      hr:
        'Stranice za stanare i glavnu domenu. Blokovi u layoutu su u Adminu grupirani: District · Nekretnine (RE landing + stari RE), District · Boutique, District · Momento (rezervirano), District · Hub i stranice. RE landing obrazac i red kontakta: „RE landing — upit” u layoutu. Jednoredno tamno podnožje na RE landing stranici uređuje se u kolekciji Podnožja, ne u layoutu stranice.',
    },
  },
  access: {
    read: ({ req }) => {
      if ((req.user as any)?.role === 'superadmin') {
        return true
      }
      return {
        tenant: {
          equals: (req.user as any)?.tenant?.id || (req.user as any)?.tenant,
        },
      }
    },
    create: ({ req }) =>
      (req.user as any)?.role === 'superadmin' || (req.user as any)?.role === 'tenant-admin',

    update: ({ req }) => {
      if ((req.user as any)?.role === 'superadmin') {
        return true
      }
      return {
        tenant: {
          equals: (req.user as any)?.tenant?.id || (req.user as any)?.tenant,
        },
      }
    },
    delete: ({ req }) => {
      if ((req.user as any)?.role === 'superadmin') {
        return true
      }
      return {
        tenant: {
          equals: (req.user as any)?.tenant?.id || (req.user as any)?.tenant,
        },
      }
    },
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && (req.user as any)?.role === 'tenant-admin') {
          data.tenant = (req.user as any)?.tenant?.id || (req.user as any)?.tenant
          return data
        }
        return data
      },
    ],
    afterChange: [revalidatePageHook],
    afterDelete: [revalidatePageDeleteHook],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      admin: {
        position: 'sidebar',
      },
      access: {
        read: () => true,
        create: ({ req }) => {
          const user = req.user as any
          return user?.role === 'superadmin'
        },
        update: ({ req }) => {
          const user = req.user as any
          return user?.role === 'superadmin'
        },
      },
      // admin: {
      //   condition: ({ user }) => user?.role === 'superadmin',
      // },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        Hero,
        Features,
        Text,
        ThreeColumns,
        BotiqueIntro,
        BoutiqueContact,
        Rooms,
        Rooftop,
        RooftopFeatures,
        Location,
        ConceptBarMenu,
        JobOpportunity,
        Image,
        Intro,
        ImageGrid,
        FloorPlan,
        RealEstateLandingNav,
        RealEstateLandingHero,
        RealEstateLandingMarquee,
        RealEstateLandingManifesto,
        RealEstateLandingTypology,
        RealEstateLandingGallery,
        RealEstateLandingCurrentProject,
        RealEstateLandingPartner,
        RealEstateLandingInquiry,
        RealEstateLandingUnitBrowser,
        RealEstateLandingPastProjects,
        RealEstateHero,
        RealEstateAboutUs,
        RealEstateProjectsWeDid,
        RealEstateCurrentProjects,
        RealEstateLiveCamera,
        RealEstateLookingForJob,
        RealEstateContact,
        Anchor,
      ],
      localized: true,
      admin: {
        initCollapsed: true,
      },
    },
  ],
}

export default Pages
