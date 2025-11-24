import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { FAQSection, FAQItem } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContactForm } from '@/components/forms/ContactForm'
import { InternalLinksSection } from '@/components/sections/InternalLinksSection'
import { ImageGallery } from '@/components/ui/ImageGallery'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import { STATES } from '@/lib/mockDataGenerators'
import {
  Clock,
  Shield,
  Building2,
  CheckCircle,
  Users,
  Award,
  MapPin,
  Phone,
  Truck,
  Wrench,
  FileCheck,
  ThumbsUp,
} from 'lucide-react'

interface PageProps {
  params: Promise<{
    type: string
    location: string
  }>
}

const CLASSROOM_TYPES = {
  single: {
    name: 'Single Modular Classrooms',
    shortName: 'Single Classrooms',
    description:
      'Individual modular classroom units perfect for temporary space needs, permanent additions, or standalone educational facilities.',
    capacity: '20-35 students',
    size: '720-960 sq ft',
    deliveryTime: '4-6 weeks',
  },
  'double-wide': {
    name: 'Double-Wide Modular Classrooms',
    shortName: 'Double-Wide Classrooms',
    description:
      'Spacious double-wide modular classrooms offering expanded learning space, greater flexibility, and room for specialized activities.',
    capacity: '35-50 students',
    size: '1,440-1,920 sq ft',
    deliveryTime: '5-8 weeks',
  },
  'multi-complexes': {
    name: 'Multi-Classroom Complexes',
    shortName: 'Multi-Complexes',
    description:
      'Connected modular classroom buildings featuring multiple rooms, hallways, administrative spaces, and shared facilities.',
    capacity: '100-500+ students',
    size: '3,000-20,000+ sq ft',
    deliveryTime: '8-16 weeks',
  },
  restrooms: {
    name: 'Modular Classrooms with Restrooms',
    shortName: 'Classrooms with Restrooms',
    description:
      'Self-contained classroom units featuring integrated ADA-compliant restroom facilities.',
    capacity: '25-40 students',
    size: '900-1,400 sq ft',
    deliveryTime: '5-7 weeks',
  },
  kitchens: {
    name: 'Modular Classrooms with Kitchens',
    shortName: 'Classrooms with Kitchens',
    description:
      'Specialized classroom modules equipped with commercial-grade kitchen facilities for culinary arts and home economics.',
    capacity: '20-30 students',
    size: '1,000-1,600 sq ft',
    deliveryTime: '6-9 weeks',
  },
}

const TYPES_LIST = ['single', 'double-wide', 'multi-complexes', 'restrooms', 'kitchens']

function generateLocationFAQs(
  typeName: string,
  stateName: string,
  stateCode: string
): FAQItem[] {
  return [
    {
      question: `Do you deliver ${typeName.toLowerCase()} to ${stateName}?`,
      answer: `Yes, we provide complete delivery and installation services for ${typeName.toLowerCase()} throughout ${stateName}. Our logistics team coordinates all aspects of transportation, permitting, and setup to ensure a smooth process. We have extensive experience working with ${stateName} school districts and educational institutions.`,
    },
    {
      question: `Are your classrooms compliant with ${stateName} building codes?`,
      answer: `Absolutely. All our modular classrooms are designed to meet or exceed ${stateName} building codes, IBC standards, ADA accessibility requirements, and state educational facility regulations. We handle all necessary permits and inspections, ensuring full compliance with ${stateCode} requirements.`,
    },
    {
      question: `How long does installation take in ${stateName}?`,
      answer: `For standard ${typeName.toLowerCase()}, on-site installation typically takes 1-3 days. Larger multi-classroom complexes may require 1-2 weeks. Our ${stateName} installation teams are experienced professionals who work efficiently while maintaining the highest quality standards.`,
    },
    {
      question: `What is the cost of ${typeName.toLowerCase()} in ${stateName}?`,
      answer: `Pricing varies based on size, features, and customization level. We offer competitive rates for the ${stateName} market and can work within your budget. Contact us for a detailed quote specific to your project requirements. Financing and lease options are available.`,
    },
    {
      question: `Do you offer installation services in ${stateName}?`,
      answer: `Yes, we provide complete turnkey installation services across ${stateName}. This includes site preparation guidance, foundation work coordination, crane and rigging services, utility connections, and final inspection support. Our local teams ensure professional installation that meets all ${stateName} requirements.`,
    },
    {
      question: `Can I rent ${typeName.toLowerCase()} in ${stateName}?`,
      answer: `Yes, we offer flexible rental and lease-to-own options for ${typeName.toLowerCase()} in ${stateName}. Rental periods can range from short-term (6 months) to multi-year agreements. This is ideal for schools needing temporary classroom space during construction or renovation projects.`,
    },
    {
      question: `What warranty coverage is available in ${stateName}?`,
      answer: `All our ${typeName.toLowerCase()} come with comprehensive warranty coverage regardless of location. This includes a 10-year structural warranty, 5-year warranty on HVAC and electrical systems, and 1-year coverage on finishes. We have service partners throughout ${stateName} for any warranty needs.`,
    },
    {
      question: `How do I get a quote for ${typeName.toLowerCase()} in ${stateName}?`,
      answer: `Getting a quote is easy. Simply fill out our contact form, call our ${stateName} team directly, or request a site visit. We'll gather your requirements, assess your site, and provide a detailed quote within 24-48 hours. Our quotes include all costs with no hidden fees.`,
    },
  ]
}

export async function generateStaticParams() {
  const params: { type: string; location: string }[] = []

  TYPES_LIST.forEach((type) => {
    Object.keys(STATES).forEach((stateSlug) => {
      params.push({ type, location: stateSlug })
    })
  })

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, location } = await params
  const typeData = CLASSROOM_TYPES[type as keyof typeof CLASSROOM_TYPES]
  const stateData = STATES[location as keyof typeof STATES]

  if (!typeData || !stateData) {
    return {
      title: 'Page Not Found | Modular Buildings Co',
    }
  }

  return {
    title: `${typeData.shortName} in ${stateData.name} | Modular Classrooms | Modular Buildings Co`,
    description: `${typeData.description} Professional delivery and installation throughout ${stateData.name}. Fast deployment, code-compliant, fully customizable.`,
    openGraph: {
      title: `${typeData.shortName} in ${stateData.name}`,
      description: `${typeData.description} Available in ${stateData.name}.`,
      images: [getPlaceholderImage(1200, 630, `${typeData.shortName} ${stateData.name}`)],
    },
  }
}

export default async function LocationPage({ params }: PageProps) {
  const { type, location } = await params
  const typeData = CLASSROOM_TYPES[type as keyof typeof CLASSROOM_TYPES]
  const stateData = STATES[location as keyof typeof STATES]

  if (!typeData || !stateData) {
    notFound()
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Modular Classrooms', href: '/modular-classrooms' },
    { label: typeData.shortName, href: `/modular-classrooms/${type}` },
    { label: stateData.name, href: `/modular-classrooms/${type}/${location}` },
  ]

  const faqs = generateLocationFAQs(typeData.name, stateData.name, stateData.code)

  const galleryImages = [
    {
      url: getPlaceholderImage(800, 600, `${typeData.shortName} Exterior`),
      alt: `${typeData.shortName} exterior view in ${stateData.name}`,
    },
    {
      url: getPlaceholderImage(800, 600, `${typeData.shortName} Interior`),
      alt: `${typeData.shortName} interior classroom`,
    },
    {
      url: getPlaceholderImage(800, 600, `${typeData.shortName} Detail`),
      alt: `${typeData.shortName} detail view`,
    },
    {
      url: getPlaceholderImage(800, 600, `${typeData.shortName} Installation`),
      alt: `${typeData.shortName} installation process`,
    },
  ]

  const otherStates = Object.entries(STATES)
    .filter(([slug]) => slug !== location)
    .slice(0, 6)
    .map(([slug, state]) => ({
      title: `${typeData.shortName} in ${state.name}`,
      url: `/modular-classrooms/${type}/${slug}`,
      description: `Find ${typeData.shortName.toLowerCase()} available in ${state.name}.`,
    }))

  const otherTypes = TYPES_LIST.filter((t) => t !== type)
    .slice(0, 4)
    .map((t) => {
      const data = CLASSROOM_TYPES[t as keyof typeof CLASSROOM_TYPES]
      return {
        title: `${data.shortName} in ${stateData.name}`,
        url: `/modular-classrooms/${t}/${location}`,
        description: data.description,
      }
    })

  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title={`${typeData.shortName} in ${stateData.name}`}
        backgroundImage={getPlaceholderImage(1920, 400, `${typeData.shortName} ${stateData.name}`)}
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
                {typeData.name} in {stateData.name}
              </h2>
              <p className="text-lg text-mb-gray mb-6">
                Looking for {typeData.shortName.toLowerCase()} in {stateData.name}? Modular Buildings Co provides
                comprehensive modular classroom solutions throughout the state, with full compliance
                to {stateData.code} building codes and educational facility regulations.
              </p>
              <p className="text-lg text-mb-gray mb-6">
                Our {typeData.shortName.toLowerCase()} are ideal for {stateData.name} schools,
                universities, charter schools, and training centers. With fast delivery and
                professional installation, you can have your classroom operational in weeks, not
                months.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <MapPin className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Statewide Service</h3>
                  <p className="text-sm text-mb-gray">All {stateData.name} cities</p>
                </div>
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <Clock className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Fast Delivery</h3>
                  <p className="text-sm text-mb-gray">{typeData.deliveryTime}</p>
                </div>
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <Shield className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Code Compliant</h3>
                  <p className="text-sm text-mb-gray">{stateData.code} certified</p>
                </div>
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <Award className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">10-Year Warranty</h3>
                  <p className="text-sm text-mb-gray">Full structural coverage</p>
                </div>
              </div>
            </div>

            <div>
              <ImageGallery images={galleryImages} />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-mb-dark mb-4">
              Why Choose Our {typeData.shortName} in {stateData.name}
            </h2>
            <p className="text-lg text-mb-gray max-w-3xl mx-auto">
              We have extensive experience delivering modular classrooms throughout {stateData.name}
              . Our team understands the unique requirements of the {stateData.region} region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-mb-lg border border-mb-border-gray">
              <Truck className="w-12 h-12 text-mb-navy mb-4" />
              <h3 className="text-xl font-bold text-mb-dark mb-2">
                Statewide Delivery
              </h3>
              <p className="text-mb-gray">
                Professional delivery services to any location in {stateData.name}. Our logistics
                team handles all transportation coordination.
              </p>
            </div>
            <div className="bg-white p-6 rounded-mb-lg border border-mb-border-gray">
              <Wrench className="w-12 h-12 text-mb-navy mb-4" />
              <h3 className="text-xl font-bold text-mb-dark mb-2">
                Expert Installation
              </h3>
              <p className="text-mb-gray">
                Our {stateData.name} installation teams have years of experience with modular
                classroom setup and site preparation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-mb-lg border border-mb-border-gray">
              <FileCheck className="w-12 h-12 text-mb-navy mb-4" />
              <h3 className="text-xl font-bold text-mb-dark mb-2">
                Permit Assistance
              </h3>
              <p className="text-mb-gray">
                We handle all {stateData.code} permit applications and inspections as part of our
                turnkey service.
              </p>
            </div>
            <div className="bg-white p-6 rounded-mb-lg border border-mb-border-gray">
              <Shield className="w-12 h-12 text-mb-navy mb-4" />
              <h3 className="text-xl font-bold text-mb-dark mb-2">
                Code Compliance
              </h3>
              <p className="text-mb-gray">
                All classrooms meet {stateData.name} building codes, IBC standards, and ADA
                accessibility requirements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-mb-lg border border-mb-border-gray">
              <Phone className="w-12 h-12 text-mb-navy mb-4" />
              <h3 className="text-xl font-bold text-mb-dark mb-2">
                Local Support
              </h3>
              <p className="text-mb-gray">
                Dedicated {stateData.name} service team available for ongoing support, maintenance,
                and warranty service.
              </p>
            </div>
            <div className="bg-white p-6 rounded-mb-lg border border-mb-border-gray">
              <ThumbsUp className="w-12 h-12 text-mb-navy mb-4" />
              <h3 className="text-xl font-bold text-mb-dark mb-2">
                Proven Track Record
              </h3>
              <p className="text-mb-gray">
                Hundreds of successful classroom installations across {stateData.name} schools and
                educational institutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features and Benefits */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 font-bold text-mb-dark mb-6">
                {typeData.shortName} Features
              </h2>
              <p className="text-lg text-mb-gray mb-6">
                Our {typeData.shortName.toLowerCase()} come fully equipped for immediate educational
                use with all necessary systems and features.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-mb-dark">Complete HVAC System</h3>
                    <p className="text-mb-gray">
                      Individual climate control for year-round comfort in {stateData.name} weather
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-mb-dark">Full Electrical System</h3>
                    <p className="text-mb-gray">
                      Pre-wired for lighting, outlets, and educational technology integration
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-mb-dark">ADA Compliant Design</h3>
                    <p className="text-mb-gray">
                      Accessible entrances, pathways, and facilities meeting all requirements
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-mb-dark">Fire-Safe Construction</h3>
                    <p className="text-mb-gray">
                      Fire-rated materials and sprinkler-ready design for student safety
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-mb-dark">Premium Finishes</h3>
                    <p className="text-mb-gray">
                      Durable flooring, painted walls, and acoustic ceiling for learning environment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src={getPlaceholderImage(800, 600, `${typeData.shortName} Features`)}
                alt={`${typeData.shortName} features in ${stateData.name}`}
                width={800}
                height={600}
                className="rounded-mb-lg shadow-mb-hover"
              />
              <div className="absolute -bottom-6 -right-6 bg-mb-navy text-white p-6 rounded-mb-lg hidden md:block">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5" />
                  <span className="font-bold">Capacity</span>
                </div>
                <div className="text-2xl font-bold">{typeData.capacity}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="section-padding bg-mb-navy text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold mb-4">
              Popular Applications in {stateData.name}
            </h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Our {typeData.shortName.toLowerCase()} serve diverse educational needs throughout
              {stateData.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">K-12 Schools</h3>
              <p className="text-sm opacity-90">
                Public and private schools needing additional classroom space
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Universities</h3>
              <p className="text-sm opacity-90">
                Higher education institutions and community colleges
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Charter Schools</h3>
              <p className="text-sm opacity-90">
                New and expanding charter school programs
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Training Centers</h3>
              <p className="text-sm opacity-90">
                Corporate and vocational training facilities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        questions={faqs}
        title={`Frequently Asked Questions About ${typeData.shortName} in ${stateData.name}`}
        subtitle={`Common questions about modular classrooms in ${stateData.name}`}
        className="bg-white"
      />

      {/* Other States */}
      <InternalLinksSection
        links={otherStates}
        title={`${typeData.shortName} in Other States`}
        subtitle="We deliver across all 50 states with local expertise"
        columns={3}
        showIcon={true}
        className="bg-mb-bg-light"
      />

      {/* Other Types in This State */}
      <InternalLinksSection
        links={otherTypes}
        title={`Other Classroom Types Available in ${stateData.name}`}
        subtitle="Explore our complete range of modular classroom solutions"
        columns={4}
        showIcon={true}
        className="bg-white"
      />

      {/* Contact Form Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-bold text-mb-dark mb-4">
                Get a Quote for {typeData.shortName} in {stateData.name}
              </h2>
              <p className="text-lg text-mb-gray">
                Fill out the form below and our {stateData.name} team will contact you with a
                detailed quote within 24 hours.
              </p>
            </div>
            <div className="bg-white p-8 md:p-12 rounded-mb-lg">
              <ContactForm
                productInterest={`${typeData.name} in ${stateData.name}`}
                sourcePage={`/modular-classrooms/${type}/${location}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={`Ready to Get Started in ${stateData.name}?`}
        subtitle="Contact Our Team Today"
        description={`Our ${stateData.name} team is ready to help you design the perfect ${typeData.shortName.toLowerCase()} solution for your school.`}
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
