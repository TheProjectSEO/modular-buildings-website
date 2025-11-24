import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { FAQSection, FAQItem } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContactForm } from '@/components/forms/ContactForm'
import { InternalLinksSection } from '@/components/sections/InternalLinksSection'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import { getPageBySlug, type Page, type FAQ, type StructuredData } from '@/lib/supabase'
import { STATES } from '@/lib/mockDataGenerators'
import {
  Clock,
  Shield,
  Building2,
  CheckCircle,
  Users,
  Zap,
  Award,
  MapPin,
  DollarSign,
  Ruler,
  Thermometer,
} from 'lucide-react'

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
  staticFaqs: FAQItem[]
): FAQItem[] {
  if (dbFaqs && dbFaqs.length > 0) {
    return dbFaqs
      .filter((faq) => faq.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((faq) => ({ question: faq.question, answer: faq.answer }))
  }
  return staticFaqs
}

interface PageProps {
  params: Promise<{
    type: string
  }>
}

const CLASSROOM_TYPES = {
  single: {
    name: 'Single Modular Classrooms',
    shortName: 'Single Classrooms',
    description:
      'Individual modular classroom units perfect for temporary space needs, permanent additions, or standalone educational facilities.',
    heroDescription:
      'Our single modular classrooms provide complete, self-contained learning environments that can be deployed quickly and customized to your exact specifications.',
    capacity: '20-35 students',
    size: '720-960 sq ft',
    deliveryTime: '4-6 weeks',
    features: [
      'Complete HVAC system with individual climate control',
      'Full electrical with dedicated circuits for technology',
      'High-efficiency LED lighting throughout',
      'ADA-compliant entrance and interior',
      'Fire-rated construction with sprinkler-ready design',
      'Premium acoustic insulation for quiet learning',
      'Multiple window configurations available',
      'Built-in storage and cabinetry options',
    ],
    specifications: [
      { label: 'Standard Width', value: '24 feet' },
      { label: 'Standard Length', value: '30-40 feet' },
      { label: 'Ceiling Height', value: "9'-10' clearance" },
      { label: 'Student Capacity', value: '20-35 students' },
      { label: 'Foundation', value: 'Pier/block or permanent' },
      { label: 'Roof Type', value: 'Metal or membrane' },
    ],
  },
  'double-wide': {
    name: 'Double-Wide Modular Classrooms',
    shortName: 'Double-Wide Classrooms',
    description:
      'Spacious double-wide modular classrooms offering expanded learning space, greater flexibility, and room for specialized activities.',
    heroDescription:
      'Double-wide classrooms combine two modules into one seamless space, providing the square footage needed for larger classes, specialized labs, or multi-purpose educational areas.',
    capacity: '35-50 students',
    size: '1,440-1,920 sq ft',
    deliveryTime: '5-8 weeks',
    features: [
      'Open floor plan with no center columns',
      'Dual HVAC zones for optimal comfort',
      'Enhanced electrical capacity for technology-rich environments',
      'Wide entrance options for equipment and accessibility',
      'Configurable interior partitions available',
      'Science lab and computer lab ready',
      'Superior acoustic separation',
      'Large window options for natural light',
    ],
    specifications: [
      { label: 'Standard Width', value: '48 feet' },
      { label: 'Standard Length', value: '30-40 feet' },
      { label: 'Ceiling Height', value: "9'-12' clearance" },
      { label: 'Student Capacity', value: '35-50 students' },
      { label: 'Foundation', value: 'Concrete slab or pier' },
      { label: 'Roof Type', value: 'Metal standing seam' },
    ],
  },
  'multi-complexes': {
    name: 'Multi-Classroom Complexes',
    shortName: 'Multi-Complexes',
    description:
      'Connected modular classroom buildings featuring multiple rooms, hallways, administrative spaces, and shared facilities in campus-style configurations.',
    heroDescription:
      'Our multi-classroom complexes provide complete educational facilities with interconnected buildings, covered walkways, and centralized support spaces for comprehensive campus solutions.',
    capacity: '100-500+ students',
    size: '3,000-20,000+ sq ft',
    deliveryTime: '8-16 weeks',
    features: [
      'Multiple classroom configurations in one complex',
      'Interior hallways connecting all spaces',
      'Administrative offices and teacher workrooms',
      'Central HVAC plant for efficiency',
      'Covered walkways and canopies',
      'Common areas and multipurpose rooms',
      'Complete restroom facilities',
      'Storage, maintenance, and utility rooms',
    ],
    specifications: [
      { label: 'Configurations', value: '2-20+ classrooms' },
      { label: 'Building Width', value: '48-72 feet' },
      { label: 'Ceiling Height', value: "9'-14' clearance" },
      { label: 'Campus Capacity', value: '100-500+ students' },
      { label: 'Foundation', value: 'Permanent concrete' },
      { label: 'Structural', value: 'Steel frame construction' },
    ],
  },
  restrooms: {
    name: 'Modular Classrooms with Restrooms',
    shortName: 'Classrooms with Restrooms',
    description:
      'Self-contained classroom units featuring integrated ADA-compliant restroom facilities, ideal for standalone locations or remote sites.',
    heroDescription:
      'Our classrooms with integrated restrooms provide complete, self-sufficient learning environments that require no additional building connections, perfect for temporary sites or remote locations.',
    capacity: '25-40 students',
    size: '900-1,400 sq ft',
    deliveryTime: '5-7 weeks',
    features: [
      'Integrated ADA-compliant restrooms',
      'Separate student and staff facilities available',
      'Complete plumbing including water heater',
      'Hands-free fixtures and sanitizer stations',
      'Proper ventilation and exhaust systems',
      'Easy maintenance access',
      'Water-efficient fixtures',
      'Self-contained waste system options',
    ],
    specifications: [
      { label: 'Standard Size', value: '900-1,400 sq ft' },
      { label: 'Restroom Count', value: '2-4 stalls' },
      { label: 'ADA Compliant', value: 'Fully accessible' },
      { label: 'Water Connection', value: 'Standard municipal or tank' },
      { label: 'Waste System', value: 'Sewer or holding tank' },
      { label: 'Ventilation', value: 'Powered exhaust fans' },
    ],
  },
  kitchens: {
    name: 'Modular Classrooms with Kitchens',
    shortName: 'Classrooms with Kitchens',
    description:
      'Specialized classroom modules equipped with commercial-grade kitchen facilities for culinary arts, home economics, and food service training programs.',
    heroDescription:
      'Our kitchen-equipped classrooms feature professional-grade appliances and food preparation areas designed for culinary education, home economics, and hospitality training programs.',
    capacity: '20-30 students',
    size: '1,000-1,600 sq ft',
    deliveryTime: '6-9 weeks',
    features: [
      'Commercial-grade kitchen equipment',
      'Multiple cooking stations for hands-on learning',
      'Demonstration area with mirror or camera system',
      'Industrial ventilation hood systems',
      'Commercial refrigeration and storage',
      'Stainless steel work surfaces',
      'Fire suppression systems',
      'Separate prep and cooking zones',
    ],
    specifications: [
      { label: 'Kitchen Area', value: '400-600 sq ft' },
      { label: 'Cooking Stations', value: '4-8 student stations' },
      { label: 'Ventilation', value: 'Commercial hood system' },
      { label: 'Fire Suppression', value: 'Ansul or equivalent' },
      { label: 'Electrical', value: '200-400 amp service' },
      { label: 'Gas Connection', value: 'Natural or propane' },
    ],
  },
}

const TYPES_LIST = ['single', 'double-wide', 'multi-complexes', 'restrooms', 'kitchens']

function generateFAQs(typeName: string, typeData: (typeof CLASSROOM_TYPES)[keyof typeof CLASSROOM_TYPES]): FAQItem[] {
  return [
    {
      question: `What is included with ${typeName}?`,
      answer: `Our ${typeName.toLowerCase()} come fully equipped with HVAC systems, electrical wiring, lighting, flooring, interior finishes, and all necessary structural components. Standard features include ${typeData.features.slice(0, 3).join(', ').toLowerCase()}. Additional customization options are available to meet your specific educational requirements.`,
    },
    {
      question: `How long does it take to deliver and install ${typeName.toLowerCase()}?`,
      answer: `Manufacturing typically takes ${typeData.deliveryTime} depending on customization level. Installation on-site generally requires 1-5 days for standard configurations. The total timeline from order to occupancy is typically 6-12 weeks, significantly faster than traditional construction.`,
    },
    {
      question: `What size options are available for ${typeName.toLowerCase()}?`,
      answer: `Our ${typeName.toLowerCase()} are available in sizes ranging from ${typeData.size}. Standard configurations accommodate ${typeData.capacity}. Custom sizes can be designed to meet specific space requirements and student capacity needs.`,
    },
    {
      question: `Are ${typeName.toLowerCase()} compliant with building codes?`,
      answer: `Yes, all our ${typeName.toLowerCase()} meet or exceed IBC (International Building Code), state educational facility standards, ADA accessibility requirements, and local building codes. We handle all permit applications and inspections as part of our turnkey service.`,
    },
    {
      question: `Can ${typeName.toLowerCase()} be customized?`,
      answer: `Absolutely. We offer extensive customization including interior layouts, finishes, window configurations, door placements, technology infrastructure, cabinetry, and specialized equipment. Our design team works with you to create the ideal learning environment.`,
    },
    {
      question: `What warranty is provided with ${typeName.toLowerCase()}?`,
      answer: `Our ${typeName.toLowerCase()} come with a comprehensive warranty including 10-year structural coverage, 5-year warranty on HVAC and electrical systems, and 1-year coverage on finishes and fixtures. Extended warranty options are available.`,
    },
    {
      question: `Can ${typeName.toLowerCase()} be relocated?`,
      answer: `Yes, one of the key advantages of modular construction is relocatability. Our ${typeName.toLowerCase()} can be disassembled and moved to new locations if your needs change. This flexibility is ideal for schools with fluctuating enrollment.`,
    },
    {
      question: `What foundation is required for ${typeName.toLowerCase()}?`,
      answer: `Foundation requirements vary based on the specific configuration and local codes. Options include pier/block systems for temporary installations, concrete runners for semi-permanent use, and full concrete slabs for permanent installations. We assess your site and recommend the best solution.`,
    },
  ]
}

export async function generateStaticParams() {
  return TYPES_LIST.map((type) => ({
    type,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params

  // Try to fetch from database first
  const slug = `modular-classrooms/${type}`
  const dbPage = await getPageBySlug(slug)

  if (dbPage) {
    return {
      title: dbPage.meta_title || `${dbPage.title} | Portable Classroom Buildings | Modular Buildings Co`,
      description: dbPage.meta_description || dbPage.content?.substring(0, 160),
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
  const typeData = CLASSROOM_TYPES[type as keyof typeof CLASSROOM_TYPES]

  if (!typeData) {
    return {
      title: 'Classroom Type Not Found | Modular Buildings Co',
    }
  }

  return {
    title: `${typeData.name} | Portable Classroom Buildings | Modular Buildings Co`,
    description: typeData.description,
    openGraph: {
      title: typeData.name,
      description: typeData.description,
      images: [getPlaceholderImage(1200, 630, typeData.shortName)],
    },
  }
}

export default async function ClassroomTypePage({ params }: PageProps) {
  const { type } = await params

  // Try to fetch from database
  const slug = `modular-classrooms/${type}`
  const dbPage = await getPageBySlug(slug)

  // Get static fallback data
  const staticData = CLASSROOM_TYPES[type as keyof typeof CLASSROOM_TYPES]

  // If no database page and no static data, show 404
  if (!dbPage && !staticData) {
    notFound()
  }

  // Use database content if available, otherwise fall back to static
  // For backward compatibility, keep typeData reference pointing to staticData
  const typeData = staticData

  // Get custom fields from database if available
  const customFields = (dbPage?.custom_fields || {}) as Record<string, unknown>
  const pageTitle = dbPage?.title || typeData?.name || ''
  const pageShortName = (customFields.shortName as string) || typeData?.shortName || ''

  // Merge FAQs - prefer database FAQs if available
  const faqs = mergeFAQs(dbPage?.faqs, typeData ? generateFAQs(typeData.name, typeData) : [])

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Modular Classrooms', href: '/modular-classrooms' },
    { label: pageShortName, href: `/modular-classrooms/${type}` },
  ]

  const stateLinks = Object.entries(STATES).map(([slug, state]) => ({
    title: `${pageShortName} in ${state.name}`,
    url: `/modular-classrooms/${type}/${slug}`,
    description: `Find ${pageShortName.toLowerCase()} available in ${state.name}. Fast delivery and professional installation.`,
  }))

  const otherTypes = TYPES_LIST.filter((t) => t !== type).map((t) => {
    const data = CLASSROOM_TYPES[t as keyof typeof CLASSROOM_TYPES]
    return {
      title: data.shortName,
      url: `/modular-classrooms/${t}`,
      description: data.description,
    }
  })

  return (
    <>
      {/* Structured Data JSON-LD from database */}
      <StructuredDataScript structuredData={dbPage?.structured_data} />

      {/* Category Banner */}
      <CategoryBanner
        title={pageTitle}
        backgroundImage={getPlaceholderImage(1920, 400, pageShortName)}
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
                {typeData.name}
              </h2>
              <p className="text-lg text-mb-gray mb-6">{typeData.heroDescription}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <Users className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Capacity</h3>
                  <p className="text-sm text-mb-gray">{typeData.capacity}</p>
                </div>
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <Ruler className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Size Range</h3>
                  <p className="text-sm text-mb-gray">{typeData.size}</p>
                </div>
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <Clock className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Delivery Time</h3>
                  <p className="text-sm text-mb-gray">{typeData.deliveryTime}</p>
                </div>
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <Award className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Warranty</h3>
                  <p className="text-sm text-mb-gray">10-year structural</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-mb-navy text-white font-semibold rounded-mb hover:bg-mb-navy/90 transition-colors"
                >
                  Get a Quote
                </Link>
                <Link
                  href="#locations"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-mb-navy text-mb-navy font-semibold rounded-mb hover:bg-mb-navy hover:text-white transition-colors"
                >
                  Find in Your State
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src={getPlaceholderImage(800, 600, typeData.shortName)}
                alt={typeData.name}
                width={800}
                height={600}
                className="rounded-mb-lg shadow-mb-hover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-mb-dark mb-4">
              Features and Specifications
            </h2>
            <p className="text-lg text-mb-gray max-w-3xl mx-auto">
              Our {typeData.shortName.toLowerCase()} come equipped with premium features designed
              for modern educational environments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Features List */}
            <div>
              <h3 className="text-xl font-bold text-mb-dark mb-6">Standard Features</h3>
              <div className="space-y-4">
                {typeData.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-0.5" />
                    <span className="text-mb-gray">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Table */}
            <div>
              <h3 className="text-xl font-bold text-mb-dark mb-6">Specifications</h3>
              <div className="bg-white rounded-mb-lg overflow-hidden border border-mb-border-gray">
                <table className="w-full">
                  <tbody>
                    {typeData.specifications.map((spec, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-mb-bg-light'}
                      >
                        <td className="px-6 py-4 font-semibold text-mb-dark">{spec.label}</td>
                        <td className="px-6 py-4 text-mb-gray">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-mb-navy text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold mb-4">
              Why Choose {typeData.shortName}?
            </h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Discover the advantages of our {typeData.shortName.toLowerCase()} for your
              educational facility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6">
              <Clock className="w-12 h-12 text-mb-warning mb-4" />
              <h3 className="text-xl font-bold mb-2">Fast Deployment</h3>
              <p className="opacity-90">
                Factory manufacturing and quick installation means your classroom is ready in weeks,
                not months.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6">
              <DollarSign className="w-12 h-12 text-mb-warning mb-4" />
              <h3 className="text-xl font-bold mb-2">Cost Savings</h3>
              <p className="opacity-90">
                Save 20-40% compared to traditional construction with reduced labor costs and
                material waste.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6">
              <Shield className="w-12 h-12 text-mb-warning mb-4" />
              <h3 className="text-xl font-bold mb-2">Code Compliant</h3>
              <p className="opacity-90">
                Meets all IBC, ADA, and state educational facility requirements with full
                certification.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6">
              <Thermometer className="w-12 h-12 text-mb-warning mb-4" />
              <h3 className="text-xl font-bold mb-2">Energy Efficient</h3>
              <p className="opacity-90">
                High-performance insulation and efficient systems reduce operating costs
                year-round.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6">
              <Building2 className="w-12 h-12 text-mb-warning mb-4" />
              <h3 className="text-xl font-bold mb-2">Fully Customizable</h3>
              <p className="opacity-90">
                Customize layouts, finishes, and features to create the ideal learning environment.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6">
              <Zap className="w-12 h-12 text-mb-warning mb-4" />
              <h3 className="text-xl font-bold mb-2">Technology Ready</h3>
              <p className="opacity-90">
                Pre-wired for modern educational technology including smart boards and networking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-mb-dark mb-4">
              Ideal Applications for {typeData.shortName}
            </h2>
            <p className="text-lg text-mb-gray max-w-3xl mx-auto">
              Our {typeData.shortName.toLowerCase()} serve diverse educational needs across
              multiple settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-mb-bg-light rounded-mb-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-mb-navy rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-mb-dark mb-2">K-12 Schools</h3>
              <p className="text-sm text-mb-gray">
                Permanent or temporary additions for growing schools
              </p>
            </div>
            <div className="text-center p-6 bg-mb-bg-light rounded-mb-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-mb-navy rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-mb-dark mb-2">Universities</h3>
              <p className="text-sm text-mb-gray">
                Flexible classroom space for campus expansions
              </p>
            </div>
            <div className="text-center p-6 bg-mb-bg-light rounded-mb-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-mb-navy rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-mb-dark mb-2">Charter Schools</h3>
              <p className="text-sm text-mb-gray">
                Quick-deploy facilities for new educational programs
              </p>
            </div>
            <div className="text-center p-6 bg-mb-bg-light rounded-mb-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-mb-navy rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-mb-dark mb-2">Training Centers</h3>
              <p className="text-sm text-mb-gray">
                Corporate and vocational training facilities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* State Links Section */}
      <section id="locations" className="section-padding bg-mb-bg-light">
        <InternalLinksSection
          links={stateLinks}
          title={`Find ${typeData.shortName} in Your State`}
          subtitle="We deliver and install across all 50 states with local expertise"
          columns={3}
          showIcon={true}
        />
      </section>

      {/* FAQ Section */}
      <FAQSection
        questions={faqs}
        title={`Frequently Asked Questions About ${typeData.shortName}`}
        subtitle="Find answers to common questions about our modular classroom solutions"
        className="bg-white"
      />

      {/* Other Types */}
      <InternalLinksSection
        links={otherTypes}
        title="Explore Other Classroom Types"
        subtitle="Browse our complete range of modular classroom configurations"
        columns={4}
        showIcon={true}
        className="bg-mb-bg-light"
      />

      {/* Contact Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-bold text-mb-dark mb-4">
                Request a Quote for {typeData.shortName}
              </h2>
              <p className="text-lg text-mb-gray">
                Tell us about your project and our education specialists will provide a detailed
                quote within 24 hours.
              </p>
            </div>
            <div className="bg-mb-bg-light p-8 md:p-12 rounded-mb-lg">
              <ContactForm
                productInterest={typeData.name}
                sourcePage={`/modular-classrooms/${type}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={`Ready to Get Started with ${typeData.shortName}?`}
        subtitle="Contact Us Today"
        description="Our education specialists are ready to help you design the perfect classroom solution for your school."
        primaryButton={{
          text: 'Request a Quote',
          href: '/contact',
          variant: 'primary',
        }}
        secondaryButton={{
          text: 'Call Us Now',
          href: 'tel:+905376563068',
          variant: 'outline',
        }}
        variant="contained"
        backgroundColor="navy"
      />
    </>
  )
}
