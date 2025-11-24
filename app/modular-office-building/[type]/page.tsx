import { notFound } from 'next/navigation'
import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductGrid } from '@/components/ui/ProductGrid'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContactForm } from '@/components/forms/ContactForm'
import { InternalLinksSection } from '@/components/sections/InternalLinksSection'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import { getPageBySlug, type Page, type FAQ, type StructuredData } from '@/lib/supabase'
import type { Metadata } from 'next'
import {
  CheckCircle,
  Building2,
  Clock,
  Shield,
  DollarSign,
  Zap,
  Award,
  Ruler,
  Users,
  Truck,
} from 'lucide-react'

// Office type data
const officeTypeData: Record<
  string,
  {
    title: string
    description: string
    longDescription: string
    features: { icon: React.ReactNode; title: string; description: string }[]
    specifications: { label: string; value: string }[]
    benefits: string[]
    faqs: { question: string; answer: string }[]
  }
> = {
  'single-wide': {
    title: 'Single-Wide Modular Offices',
    description:
      'Compact and efficient single-wide modular offices perfect for small teams, temporary needs, and space-constrained sites.',
    longDescription:
      'Our single-wide modular offices offer the perfect solution for businesses that need efficient workspace without the complexity of larger structures. Ranging from 12 to 14 feet in width and up to 70 feet in length, these offices provide between 500 to 1,000 square feet of functional workspace. Ideal for construction site offices, security checkpoints, ticket booths, and small team operations.',
    features: [
      {
        icon: <Ruler className="w-8 h-8" />,
        title: 'Compact Footprint',
        description:
          'Ideal for sites with limited space. Fits in narrow areas where larger buildings cannot be placed.',
      },
      {
        icon: <Clock className="w-8 h-8" />,
        title: 'Quick Installation',
        description:
          'Set up in as little as 1 day. Minimal site preparation required for rapid deployment.',
      },
      {
        icon: <DollarSign className="w-8 h-8" />,
        title: 'Budget-Friendly',
        description:
          'Most cost-effective modular office option. Perfect for startups and temporary projects.',
      },
      {
        icon: <Truck className="w-8 h-8" />,
        title: 'Easy Transport',
        description:
          'Single unit transport reduces shipping costs and simplifies logistics.',
      },
      {
        icon: <Building2 className="w-8 h-8" />,
        title: 'Customizable Layout',
        description:
          'Configure interior space to your exact needs with flexible partition options.',
      },
      {
        icon: <Zap className="w-8 h-8" />,
        title: 'Move-In Ready',
        description:
          'Fully equipped with electrical, HVAC, and plumbing as needed.',
      },
    ],
    specifications: [
      { label: 'Width', value: '12-14 feet' },
      { label: 'Length', value: 'Up to 70 feet' },
      { label: 'Square Footage', value: '500-1,000 sq ft' },
      { label: 'Ceiling Height', value: '8-9 feet' },
      { label: 'Frame', value: 'Galvanized steel' },
      { label: 'Installation Time', value: '1-2 days' },
    ],
    benefits: [
      'Perfect for small teams (2-8 people)',
      'Minimal site preparation needed',
      'Lower foundation requirements',
      'Easy to relocate as needed',
      'Reduced permitting complexity',
      'Quick delivery turnaround',
      'Cost-effective solution',
      'Full customization available',
    ],
    faqs: [
      {
        question: 'What is the maximum size of a single-wide modular office?',
        answer:
          'Single-wide modular offices typically range from 12 to 14 feet in width and can extend up to 70 feet in length, providing approximately 500 to 1,000 square feet of usable space. The exact dimensions depend on local transportation regulations and your specific requirements.',
      },
      {
        question: 'How many people can work in a single-wide office?',
        answer:
          'A single-wide modular office comfortably accommodates 2-8 people depending on the layout and how the space is configured. Open floor plans can fit more workstations, while private office configurations may accommodate fewer occupants.',
      },
      {
        question: 'Can a single-wide office include a restroom?',
        answer:
          'Yes, single-wide offices can include restroom facilities. We offer configurations with built-in restrooms including ADA-compliant options. Plumbing connections will need to be arranged at your site.',
      },
      {
        question: 'What is the installation process for a single-wide office?',
        answer:
          'Installation typically takes 1-2 days. The process involves site preparation (level pad or foundation), crane placement of the unit, utility connections, and final setup. Our team handles the entire process from delivery to move-in ready.',
      },
      {
        question: 'Are single-wide offices suitable for permanent use?',
        answer:
          'Absolutely. While single-wide offices are excellent for temporary applications, they are built to permanent construction standards and can serve as long-term facilities. Many clients use them as permanent offices for years or even decades.',
      },
      {
        question: 'What customization options are available?',
        answer:
          'We offer extensive customization including interior layouts, flooring, wall finishes, exterior colors, window configurations, door placements, HVAC systems, electrical layouts, and more. Our design team works with you to create the perfect workspace.',
      },
    ],
  },
  'double-wide': {
    title: 'Double-Wide Modular Offices',
    description:
      'Spacious double-wide offices offering more room for larger teams, meeting spaces, and expanded operations.',
    longDescription:
      'Double-wide modular offices combine two single-wide sections to create expansive workspaces ranging from 1,500 to 3,000+ square feet. These buildings offer the space needed for larger teams, conference rooms, reception areas, and multiple private offices. Perfect for corporate satellite offices, project headquarters, and growing businesses that need professional workspace quickly.',
    features: [
      {
        icon: <Users className="w-8 h-8" />,
        title: 'Spacious Interior',
        description:
          'Accommodate larger teams with room for private offices, meeting rooms, and open workspaces.',
      },
      {
        icon: <Building2 className="w-8 h-8" />,
        title: 'Professional Layout',
        description:
          'Design includes reception areas, conference rooms, and executive offices.',
      },
      {
        icon: <Shield className="w-8 h-8" />,
        title: 'Premium Construction',
        description:
          'Enhanced structural integrity with seamless interior joins between modules.',
      },
      {
        icon: <Zap className="w-8 h-8" />,
        title: 'Full Utilities',
        description:
          'Complete electrical, HVAC, plumbing, and IT infrastructure capabilities.',
      },
      {
        icon: <Award className="w-8 h-8" />,
        title: 'Executive Finishes',
        description:
          'High-end interior options including commercial carpet, dropped ceilings, and custom millwork.',
      },
      {
        icon: <Clock className="w-8 h-8" />,
        title: '2-Week Setup',
        description:
          'From delivery to occupancy in approximately 2 weeks with full installation.',
      },
    ],
    specifications: [
      { label: 'Width', value: '24-28 feet' },
      { label: 'Length', value: 'Up to 70 feet' },
      { label: 'Square Footage', value: '1,500-3,000+ sq ft' },
      { label: 'Ceiling Height', value: '8-10 feet' },
      { label: 'Frame', value: 'Heavy-duty galvanized steel' },
      { label: 'Installation Time', value: '1-2 weeks' },
    ],
    benefits: [
      'Ideal for teams of 10-25 people',
      'Multiple private offices available',
      'Conference room capability',
      'Reception area options',
      'Full restroom facilities',
      'IT room and server space',
      'Break room configurations',
      'ADA compliant designs',
    ],
    faqs: [
      {
        question: 'How much space does a double-wide modular office provide?',
        answer:
          'Double-wide modular offices typically provide 1,500 to 3,000+ square feet of space. The most common configurations are 24x60 (1,440 sq ft), 24x70 (1,680 sq ft), and 28x70 (1,960 sq ft). Larger configurations are available for expanded needs.',
      },
      {
        question: 'Can double-wide offices include multiple rooms?',
        answer:
          'Yes, double-wide offices can be configured with multiple private offices, conference rooms, reception areas, restrooms, break rooms, and open workspaces. Our design team creates custom floor plans to match your exact operational needs.',
      },
      {
        question: 'What foundation is required for a double-wide office?',
        answer:
          'Double-wide offices can be installed on various foundation types including concrete pier systems, slab foundations, or even temporary blocking for short-term use. Our team assesses your site and recommends the most appropriate foundation solution.',
      },
      {
        question: 'How is the seam between the two sections handled?',
        answer:
          'The connection between the two modular sections is seamlessly finished during installation. Interior walls, flooring, and ceilings are completed on-site to create a unified space with no visible seams. The result is indistinguishable from traditional construction.',
      },
      {
        question: 'Are double-wide offices energy efficient?',
        answer:
          'Yes, our double-wide offices feature superior insulation (R-19 walls, R-30 ceiling), energy-efficient windows, and high-efficiency HVAC systems. These buildings often exceed energy codes and significantly reduce heating and cooling costs.',
      },
      {
        question: 'Can a double-wide office be expanded later?',
        answer:
          'Absolutely. One of the advantages of modular construction is expandability. Additional modules can be joined to your existing double-wide office to add more space as your business grows.',
      },
    ],
  },
  'multi-complexes': {
    title: 'Multi-Complex Modular Offices',
    description:
      'Large-scale modular office complexes ideal for corporate headquarters, major operations, and multi-department facilities.',
    longDescription:
      'Multi-complex modular offices represent the pinnacle of modular construction, combining multiple modules to create expansive facilities of 5,000 to 50,000+ square feet. These buildings serve as corporate headquarters, call centers, educational facilities, and major operations centers. Multi-story configurations are available, providing the same functionality as traditional commercial buildings at a fraction of the time and cost.',
    features: [
      {
        icon: <Building2 className="w-8 h-8" />,
        title: 'Campus Scale',
        description:
          'Create entire office campuses with multiple buildings and departments.',
      },
      {
        icon: <Users className="w-8 h-8" />,
        title: 'Large Capacity',
        description:
          'Accommodate hundreds of employees across multiple floors and buildings.',
      },
      {
        icon: <Award className="w-8 h-8" />,
        title: 'Corporate Quality',
        description:
          'Executive-level finishes matching or exceeding traditional commercial construction.',
      },
      {
        icon: <Shield className="w-8 h-8" />,
        title: 'Multi-Story Options',
        description:
          'Two and three-story configurations available for maximum space efficiency.',
      },
      {
        icon: <Zap className="w-8 h-8" />,
        title: 'Full Infrastructure',
        description:
          'Complete electrical, mechanical, plumbing, and IT infrastructure.',
      },
      {
        icon: <Clock className="w-8 h-8" />,
        title: 'Rapid Deployment',
        description:
          'Large facilities completed in weeks rather than the years required for traditional construction.',
      },
    ],
    specifications: [
      { label: 'Size Range', value: '5,000-50,000+ sq ft' },
      { label: 'Stories', value: '1-3 floors' },
      { label: 'Modules', value: 'Unlimited' },
      { label: 'Ceiling Height', value: '9-12 feet' },
      { label: 'Frame', value: 'Commercial-grade steel' },
      { label: 'Installation Time', value: '4-12 weeks' },
    ],
    benefits: [
      'Corporate headquarters capability',
      'Multi-story configurations',
      'Hundreds of employees accommodated',
      'Full commercial amenities',
      'Data center integration',
      'Large conference facilities',
      'Cafeteria and break areas',
      'Lobby and reception spaces',
    ],
    faqs: [
      {
        question: 'How large can a multi-complex modular office be?',
        answer:
          'Multi-complex modular offices can range from 5,000 to over 50,000 square feet. There is essentially no upper limit - by combining multiple modules and using multi-story designs, we can create facilities of virtually any size to meet your requirements.',
      },
      {
        question: 'Can multi-complex offices have multiple stories?',
        answer:
          'Yes, we offer multi-story configurations up to three floors. Multi-story modular buildings include all necessary structural reinforcement, staircases, elevators, and code-compliant egress systems.',
      },
      {
        question: 'How long does it take to build a multi-complex office?',
        answer:
          'While traditional construction of a similar facility might take 1-3 years, modular multi-complex offices can typically be completed in 4-12 weeks from delivery. Manufacturing occurs concurrently with site preparation, dramatically reducing overall timeline.',
      },
      {
        question: 'Are multi-complex offices suitable for permanent headquarters?',
        answer:
          'Absolutely. Many Fortune 500 companies use modular construction for permanent facilities. Our multi-complex buildings are built to commercial construction standards with 50+ year lifespans and can be indistinguishable from traditional construction.',
      },
      {
        question: 'What amenities can be included in a multi-complex office?',
        answer:
          'Multi-complex offices can include all amenities found in traditional commercial buildings: conference centers, cafeterias, fitness rooms, data centers, mail rooms, storage, restroom facilities, mother rooms, and more. We design to your specifications.',
      },
      {
        question: 'How is HVAC handled in large multi-complex buildings?',
        answer:
          'Large multi-complex buildings utilize commercial HVAC systems including rooftop units, split systems, or central plant configurations. We design the mechanical systems to ensure optimal climate control throughout the facility while maximizing energy efficiency.',
      },
    ],
  },
  'sales-offices': {
    title: 'Sales Offices',
    description:
      'Professional sales offices designed for real estate developments, construction sites, retail environments, and customer-facing operations.',
    longDescription:
      'Our modular sales offices are specifically designed for customer-facing applications where presentation and professionalism are paramount. Perfect for real estate sales centers, automotive dealerships, retail operations, and construction project sales. These buildings feature attractive exteriors, welcoming interiors, and all the amenities needed to convert prospects into customers.',
    features: [
      {
        icon: <Award className="w-8 h-8" />,
        title: 'Premium Presentation',
        description:
          'Attractive design that impresses customers and represents your brand professionally.',
      },
      {
        icon: <Building2 className="w-8 h-8" />,
        title: 'Customer-Focused Layout',
        description:
          'Designed for customer flow with reception, meeting areas, and display spaces.',
      },
      {
        icon: <Shield className="w-8 h-8" />,
        title: 'High-End Finishes',
        description:
          'Quality interior finishes that create a professional sales environment.',
      },
      {
        icon: <Clock className="w-8 h-8" />,
        title: 'Rapid Setup',
        description:
          'Get your sales operation running quickly to capture market opportunities.',
      },
      {
        icon: <DollarSign className="w-8 h-8" />,
        title: 'ROI Focused',
        description:
          'Cost-effective solution that maximizes return on your sales center investment.',
      },
      {
        icon: <Truck className="w-8 h-8" />,
        title: 'Relocatable Asset',
        description:
          'Move your sales office to new developments as projects complete.',
      },
    ],
    specifications: [
      { label: 'Size Range', value: '500-5,000 sq ft' },
      { label: 'Configurations', value: 'Single and double-wide' },
      { label: 'Windows', value: 'Large display windows' },
      { label: 'Entry', value: 'ADA compliant with ramp' },
      { label: 'Frame', value: 'Galvanized steel' },
      { label: 'Installation Time', value: '1-2 weeks' },
    ],
    benefits: [
      'Impressive customer first impression',
      'Display and presentation areas',
      'Multiple meeting rooms',
      'Reception desk included',
      'Restroom facilities',
      'Kitchen/break area',
      'Signage integration',
      'Security systems',
    ],
    faqs: [
      {
        question: 'What makes sales offices different from standard modular offices?',
        answer:
          'Sales offices are specifically designed for customer-facing applications with enhanced aesthetics, welcoming reception areas, meeting rooms for customer consultations, display spaces, and premium finishes. The exterior and interior are designed to create a positive brand impression.',
      },
      {
        question: 'Can sales offices be customized to match our brand?',
        answer:
          'Absolutely. We offer extensive branding options including custom exterior colors, signage integration, branded interior elements, custom reception desks, and coordinated finishes. Your sales office can be a true extension of your brand identity.',
      },
      {
        question: 'Are modular sales offices suitable for permanent locations?',
        answer:
          'Yes, our sales offices are built to permanent construction standards. While many clients use them for temporary sales centers during development phases, they can serve as permanent facilities for years or decades.',
      },
      {
        question: 'What sizes are available for sales offices?',
        answer:
          'Sales offices range from compact 500 sq ft units for small operations to expansive 5,000+ sq ft centers for major developments. Single-wide and double-wide configurations are available, and multiple units can be connected for larger facilities.',
      },
      {
        question: 'Can the sales office be moved to another location later?',
        answer:
          'Yes, one of the key advantages is relocatability. When one development project completes, your sales office can be moved to a new location. This provides excellent return on investment across multiple projects.',
      },
      {
        question: 'What technology integrations are available?',
        answer:
          'We can integrate various technologies including digital displays, video conferencing systems, interactive kiosks, security cameras, access control, and complete IT infrastructure. We work with your technology providers to ensure seamless integration.',
      },
    ],
  },
}

// States for location links
const states = [
  { slug: 'texas', name: 'Texas' },
  { slug: 'california', name: 'California' },
  { slug: 'florida', name: 'Florida' },
  { slug: 'new-york', name: 'New York' },
  { slug: 'pennsylvania', name: 'Pennsylvania' },
  { slug: 'ohio', name: 'Ohio' },
  { slug: 'illinois', name: 'Illinois' },
  { slug: 'georgia', name: 'Georgia' },
]

interface PageProps {
  params: Promise<{
    type: string
  }>
}

export async function generateStaticParams() {
  return [
    { type: 'single-wide' },
    { type: 'double-wide' },
    { type: 'multi-complexes' },
    { type: 'sales-offices' },
  ]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params

  // Try to fetch from database first
  const slug = `modular-office-building/${type}`
  const dbPage = await getPageBySlug(slug)

  if (dbPage) {
    return {
      title: dbPage.meta_title || `${dbPage.title} | Modular Office Buildings | Modular Buildings Co`,
      description: dbPage.meta_description || dbPage.content?.substring(0, 160),
      keywords: `${type.replace('-', ' ')} modular office, ${type.replace('-', ' ')} portable office, modular construction, prefabricated office`,
      openGraph: {
        title: dbPage.og_title || dbPage.meta_title || dbPage.title,
        description: dbPage.og_description || dbPage.meta_description,
        images: dbPage.og_image ? [dbPage.og_image] : undefined,
      },
      alternates: {
        canonical: dbPage.canonical_url,
      },
    }
  }

  // Fallback to static data
  const data = officeTypeData[type]

  if (!data) {
    return {
      title: 'Modular Office Buildings | Modular Buildings Co',
    }
  }

  return {
    title: `${data.title} | Modular Office Buildings | Modular Buildings Co`,
    description: data.description,
    keywords: `${type.replace('-', ' ')} modular office, ${type.replace('-', ' ')} portable office, modular construction, prefabricated office`,
  }
}

// Helper component to render JSON-LD structured data
function StructuredDataScript({ structuredData }: { structuredData?: StructuredData[] }) {
  if (!structuredData || structuredData.length === 0) return null

  return (
    <>
      {structuredData
        .filter((sd) => sd.is_active)
        .map((sd) => (
          <script
            key={sd.id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(sd.json_ld) }}
          />
        ))}
    </>
  )
}

// Helper to merge database FAQs with static FAQs
function mergeFAQs(
  dbFaqs: FAQ[] | undefined,
  staticFaqs: { question: string; answer: string }[]
): { question: string; answer: string }[] {
  if (dbFaqs && dbFaqs.length > 0) {
    return dbFaqs
      .filter((faq) => faq.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((faq) => ({ question: faq.question, answer: faq.answer }))
  }
  return staticFaqs
}

export default async function ModularOfficeTypePage({ params }: PageProps) {
  const { type } = await params

  // Try to fetch from database
  const slug = `modular-office-building/${type}`
  const dbPage = await getPageBySlug(slug)

  // Get static fallback data
  const staticData = officeTypeData[type]

  // If no database page and no static data, show 404
  if (!dbPage && !staticData) {
    notFound()
  }

  // Use database content if available, otherwise fall back to static
  const pageTitle = dbPage?.title || staticData?.title || ''
  const pageDescription = dbPage?.content || staticData?.longDescription || ''
  const shortDescription = dbPage?.meta_description || staticData?.description || ''

  // Get features and specifications from database custom_fields or static data
  const customFields = dbPage?.custom_fields || {}
  const features = customFields.features || staticData?.features || []
  const specifications = customFields.specifications || staticData?.specifications || []
  const benefits = customFields.benefits || staticData?.benefits || []

  // Merge FAQs - prefer database FAQs if available
  const faqs = mergeFAQs(dbPage?.faqs, staticData?.faqs || [])

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Modular Office Buildings', href: '/modular-office-building' },
    { label: pageTitle, href: `/modular-office-building/${type}` },
  ]

  const locationLinks = states.map((state) => ({
    title: `${pageTitle} in ${state.name}`,
    url: `/modular-office-building/${type}/${state.slug}`,
    description: `Professional ${type.replace('-', ' ')} modular offices delivered and installed across ${state.name}.`,
  }))

  const otherTypes = Object.entries(officeTypeData)
    .filter(([slug]) => slug !== type)
    .map(([slug, typeData]) => ({
      title: typeData.title,
      url: `/modular-office-building/${slug}`,
      description: typeData.description,
    }))

  return (
    <>
      {/* Structured Data JSON-LD from database */}
      <StructuredDataScript structuredData={dbPage?.structured_data} />

      {/* Category Banner */}
      <CategoryBanner
        title={pageTitle}
        backgroundImage={getPlaceholderImage(1920, 400, pageTitle)}
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">{pageTitle}</h2>
              <p className="text-lg text-mb-gray mb-6">{pageDescription}</p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 bg-mb-warning text-white font-semibold rounded-mb hover:bg-mb-warning/90 transition-colors"
                >
                  Get a Free Quote
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center px-6 py-3 bg-mb-navy text-white font-semibold rounded-mb hover:bg-mb-navy/90 transition-colors"
                >
                  View Features
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-mb-lg overflow-hidden">
              <img
                src={getPlaceholderImage(800, 600, pageTitle)}
                alt={pageTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">Key Features</h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Discover what makes our {type.replace('-', ' ')} modular offices the ideal solution
              for your workspace needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature: { icon?: React.ReactNode; title: string; description: string }, index: number) => (
              <div
                key={index}
                className="bg-white p-8 rounded-mb-lg hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-mb-navy/10 rounded-full text-mb-navy">
                  {feature.icon || <Building2 className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold text-mb-dark mb-3">{feature.title}</h3>
                <p className="text-mb-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-mb-lg overflow-hidden">
              <img
                src={getPlaceholderImage(800, 600, `${pageTitle} Interior`)}
                alt={`${pageTitle} interior`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-h2 font-bold text-mb-dark mb-6">Specifications</h2>
              <p className="text-lg text-mb-gray mb-8">
                Our {type.replace('-', ' ')} modular offices are built to exacting standards with
                premium materials and construction techniques.
              </p>
              <div className="space-y-4">
                {specifications.map((spec: { label: string; value: string }, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-mb-bg-light rounded-mb"
                  >
                    <span className="font-semibold text-mb-dark">{spec.label}</span>
                    <span className="text-mb-gray">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">Benefits</h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Why choose a {type.replace('-', ' ')} modular office for your business?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-white rounded-mb hover:shadow-md transition-shadow"
              >
                <CheckCircle className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                <span className="text-mb-gray font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Links */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Available Nationwide
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              We deliver and install {type.replace('-', ' ')} modular offices across the United
              States. Select your state for location-specific information.
            </p>
          </div>

          <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
            {states.map((state) => (
              <ProductCard
                key={state.slug}
                title={`${pageTitle.split(' ')[0]} in ${state.name}`}
                category={type.replace('-', ' ')}
                imageUrl={getPlaceholderImage(400, 300, `${state.name} Office`)}
                href={`/modular-office-building/${type}/${state.slug}`}
              />
            ))}
          </ProductGrid>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle={`Common questions about ${type.replace('-', ' ')} modular offices`}
        questions={faqs}
        className="bg-mb-bg-light"
      />

      {/* Other Office Types */}
      <InternalLinksSection
        title="Explore Other Office Types"
        subtitle="Browse our complete range of modular office solutions"
        links={otherTypes}
        columns={3}
        showIcon={true}
      />

      {/* Contact Form Section */}
      <section id="contact" className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
                Get a Free Quote
              </h2>
              <p className="text-lg text-mb-gray">
                Interested in {type.replace('-', ' ')} modular offices? Fill out the form below and
                our team will contact you with a customized quote.
              </p>
            </div>

            <div className="bg-mb-bg-light p-8 md:p-12 rounded-mb-lg">
              <ContactForm
                productInterest={pageTitle}
                sourcePage={`/modular-office-building/${type}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={`Ready to Order Your ${pageTitle.split(' ').slice(0, 2).join(' ')}?`}
        description="Contact our team today to discuss your modular office needs. We provide free consultations, detailed quotes, and expert guidance throughout your project."
        primaryButton={{
          text: 'Request Quote',
          href: '#contact',
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'Call Us Now',
          href: 'tel:+905376563068',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}
