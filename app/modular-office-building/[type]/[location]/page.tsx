import { notFound } from 'next/navigation'
import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductGrid } from '@/components/ui/ProductGrid'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContactForm } from '@/components/forms/ContactForm'
import { InternalLinksSection } from '@/components/sections/InternalLinksSection'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import type { Metadata } from 'next'
import {
  CheckCircle,
  Building2,
  Clock,
  Shield,
  MapPin,
  Award,
  Truck,
  Phone,
} from 'lucide-react'

// Office types data
const officeTypes: Record<string, { title: string; shortTitle: string; description: string }> = {
  'single-wide': {
    title: 'Single-Wide Modular Offices',
    shortTitle: 'Single-Wide',
    description: 'Compact and efficient single-wide modular offices perfect for small teams and temporary needs.',
  },
  'double-wide': {
    title: 'Double-Wide Modular Offices',
    shortTitle: 'Double-Wide',
    description: 'Spacious double-wide offices offering more room for larger teams and expanded operations.',
  },
  'multi-complexes': {
    title: 'Multi-Complex Modular Offices',
    shortTitle: 'Multi-Complex',
    description: 'Large-scale modular office complexes ideal for corporate headquarters and major operations.',
  },
  'sales-offices': {
    title: 'Sales Offices',
    shortTitle: 'Sales Office',
    description: 'Professional sales offices designed for real estate, construction sites, and retail environments.',
  },
}

// Location/State data
const locationData: Record<
  string,
  {
    name: string
    code: string
    region: string
    majorCities: string[]
    population: number
  }
> = {
  texas: {
    name: 'Texas',
    code: 'TX',
    region: 'Southwest',
    majorCities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso'],
    population: 29000000,
  },
  california: {
    name: 'California',
    code: 'CA',
    region: 'West',
    majorCities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento'],
    population: 39500000,
  },
  florida: {
    name: 'Florida',
    code: 'FL',
    region: 'Southeast',
    majorCities: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah'],
    population: 21500000,
  },
  'new-york': {
    name: 'New York',
    code: 'NY',
    region: 'Northeast',
    majorCities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany'],
    population: 20200000,
  },
  pennsylvania: {
    name: 'Pennsylvania',
    code: 'PA',
    region: 'Northeast',
    majorCities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Reading', 'Erie', 'Scranton'],
    population: 13000000,
  },
  ohio: {
    name: 'Ohio',
    code: 'OH',
    region: 'Midwest',
    majorCities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton'],
    population: 11800000,
  },
  illinois: {
    name: 'Illinois',
    code: 'IL',
    region: 'Midwest',
    majorCities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield'],
    population: 12800000,
  },
  georgia: {
    name: 'Georgia',
    code: 'GA',
    region: 'Southeast',
    majorCities: ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah', 'Athens'],
    population: 10700000,
  },
  'north-carolina': {
    name: 'North Carolina',
    code: 'NC',
    region: 'Southeast',
    majorCities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville'],
    population: 10400000,
  },
  michigan: {
    name: 'Michigan',
    code: 'MI',
    region: 'Midwest',
    majorCities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing'],
    population: 10000000,
  },
  arizona: {
    name: 'Arizona',
    code: 'AZ',
    region: 'Southwest',
    majorCities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale'],
    population: 7300000,
  },
  colorado: {
    name: 'Colorado',
    code: 'CO',
    region: 'Mountain',
    majorCities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Boulder'],
    population: 5800000,
  },
}

// Key features for all location pages
const keyFeatures = [
  {
    icon: <MapPin className="w-8 h-8" />,
    title: 'Local Service',
    description: 'Dedicated teams serving your area with fast response times.',
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Fast Delivery',
    description: 'Quick delivery and installation across the entire state.',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Code Compliant',
    description: 'All buildings meet local and state building codes.',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Quality Assured',
    description: 'Premium construction with 10-year structural warranty.',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Rapid Setup',
    description: 'Operational in weeks, not months.',
  },
  {
    icon: <Phone className="w-8 h-8" />,
    title: 'Local Support',
    description: 'Ongoing support from regional service teams.',
  },
]

// Benefits list
const benefits = [
  'Full compliance with state building codes',
  'Local installation teams available',
  'Buildings designed for regional climate',
  'Fast statewide delivery',
  'Permitting assistance included',
  'Site preparation guidance',
  '10-year structural warranty',
  'Financing options available',
]

interface PageProps {
  params: Promise<{
    type: string
    location: string
  }>
}

export async function generateStaticParams() {
  const types = ['single-wide', 'double-wide', 'multi-complexes', 'sales-offices']
  const locations = Object.keys(locationData)

  const params: { type: string; location: string }[] = []

  types.forEach((type) => {
    locations.forEach((location) => {
      params.push({ type, location })
    })
  })

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, location } = await params
  const typeData = officeTypes[type]
  const locData = locationData[location]

  if (!typeData || !locData) {
    return {
      title: 'Modular Office Buildings | Modular Buildings Co',
    }
  }

  return {
    title: `${typeData.title} in ${locData.name} | Modular Offices ${locData.code} | Modular Buildings Co`,
    description: `${typeData.description} Professional delivery and installation throughout ${locData.name}. Fast setup, code-compliant construction, and local support.`,
    keywords: `${type.replace('-', ' ')} modular office ${locData.name}, portable office ${locData.code}, modular construction ${locData.name}, prefabricated office ${locData.name}`,
  }
}

export default async function ModularOfficeLocationPage({ params }: PageProps) {
  const { type, location } = await params
  const typeData = officeTypes[type]
  const locData = locationData[location]

  if (!typeData || !locData) {
    notFound()
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Modular Office Buildings', href: '/modular-office-building' },
    { label: typeData.title, href: `/modular-office-building/${type}` },
    { label: locData.name, href: `/modular-office-building/${type}/${location}` },
  ]

  // Generate FAQs specific to this type and location
  const faqs = [
    {
      question: `How much do ${typeData.shortTitle.toLowerCase()} modular offices cost in ${locData.name}?`,
      answer: `The cost of ${typeData.shortTitle.toLowerCase()} modular offices in ${locData.name} varies based on size, configuration, and customization options. Contact us for a detailed quote specific to your ${locData.name} project. We offer competitive pricing and can provide financing options to fit your budget.`,
    },
    {
      question: `How long does it take to install a ${typeData.shortTitle.toLowerCase()} office in ${locData.name}?`,
      answer: `Installation time for ${typeData.shortTitle.toLowerCase()} modular offices in ${locData.name} typically ranges from 1-4 weeks depending on the size and complexity. Our ${locData.name} installation teams are experienced and efficient, ensuring your project is completed on schedule.`,
    },
    {
      question: `Do your modular offices meet ${locData.name} building codes?`,
      answer: `Yes, all our modular office buildings are designed and constructed to meet or exceed ${locData.name} (${locData.code}) building codes and regulations. We handle permitting assistance and ensure full compliance with local requirements in ${locData.name} and all ${locData.region} region states.`,
    },
    {
      question: `Can you deliver to any city in ${locData.name}?`,
      answer: `Absolutely! We deliver and install modular offices throughout ${locData.name}, including ${locData.majorCities.slice(0, 4).join(', ')}, and all other cities across the state. Our logistics team coordinates efficient delivery to any location in ${locData.code}.`,
    },
    {
      question: `What permits are required for a modular office in ${locData.name}?`,
      answer: `Permit requirements in ${locData.name} vary by city and county. Common requirements include building permits, electrical permits, and site approvals. Our team provides full permitting assistance and guides you through the ${locData.name} regulatory process.`,
    },
    {
      question: `Do you offer site preparation services in ${locData.name}?`,
      answer: `Yes, we can coordinate site preparation services throughout ${locData.name}. This includes site surveys, foundation installation, utility connections, and grading. Our local partners in ${locData.code} ensure your site is properly prepared for your modular office.`,
    },
    {
      question: `Can a modular office in ${locData.name} handle the local climate?`,
      answer: `Yes, our modular offices are engineered for the ${locData.region} climate conditions found in ${locData.name}. We use appropriate insulation, HVAC systems, and construction materials to ensure optimal performance and energy efficiency year-round in ${locData.code}.`,
    },
    {
      question: `Is financing available for modular offices in ${locData.name}?`,
      answer: `Yes, we offer various financing options for ${locData.name} customers including equipment financing, lease-to-own programs, and traditional lending arrangements. Our finance team works with you to find the best solution for your budget and business needs.`,
    },
  ]

  // Links to other locations for this type
  const otherLocationLinks = Object.entries(locationData)
    .filter(([slug]) => slug !== location)
    .slice(0, 6)
    .map(([slug, data]) => ({
      title: `${typeData.shortTitle} in ${data.name}`,
      url: `/modular-office-building/${type}/${slug}`,
      description: `Professional ${typeData.shortTitle.toLowerCase()} modular offices delivered and installed across ${data.name}.`,
    }))

  // Links to other office types in this location
  const otherTypeLinks = Object.entries(officeTypes)
    .filter(([slug]) => slug !== type)
    .map(([slug, data]) => ({
      title: `${data.shortTitle} in ${locData.name}`,
      url: `/modular-office-building/${slug}/${location}`,
      description: data.description,
    }))

  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title={`${typeData.title} in ${locData.name}`}
        backgroundImage={getPlaceholderImage(1920, 400, `${typeData.shortTitle} ${locData.name}`)}
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
                {typeData.title} in {locData.name}
              </h2>
              <p className="text-lg text-mb-gray mb-6">
                Looking for {typeData.shortTitle.toLowerCase()} modular offices in {locData.name}?
                We provide comprehensive modular office solutions throughout the state, with full
                compliance to {locData.code} building codes and regulations.
              </p>
              <p className="text-lg text-mb-gray mb-6">
                Our {typeData.shortTitle.toLowerCase()} modular offices are ideal for {locData.name}{' '}
                businesses, construction sites, schools, and government facilities. With fast
                delivery to {locData.majorCities.slice(0, 3).join(', ')}, and all other{' '}
                {locData.name} cities, you can have your office operational in weeks.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <MapPin className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Statewide Service</h3>
                  <p className="text-sm text-mb-gray">All {locData.name} cities</p>
                </div>
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <Clock className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Fast Delivery</h3>
                  <p className="text-sm text-mb-gray">2-6 weeks typical</p>
                </div>
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <Shield className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">Code Compliant</h3>
                  <p className="text-sm text-mb-gray">{locData.code} certified</p>
                </div>
                <div className="bg-mb-bg-light p-4 rounded-mb">
                  <Award className="w-8 h-8 text-mb-navy mb-2" />
                  <h3 className="font-bold mb-1">10-Year Warranty</h3>
                  <p className="text-sm text-mb-gray">Full structural coverage</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <a
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 bg-mb-warning text-white font-semibold rounded-mb hover:bg-mb-warning/90 transition-colors"
                >
                  Get a Free Quote
                </a>
                <a
                  href="tel:+905376563068"
                  className="inline-flex items-center px-6 py-3 bg-mb-navy text-white font-semibold rounded-mb hover:bg-mb-navy/90 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-mb-lg overflow-hidden">
              <img
                src={getPlaceholderImage(800, 600, `${typeData.shortTitle} ${locData.name}`)}
                alt={`${typeData.title} in ${locData.name}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Why Choose Us in {locData.name}
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              We provide comprehensive modular office solutions with local expertise and statewide
              coverage across {locData.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-mb-lg hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-mb-navy/10 rounded-full text-mb-navy">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-mb-dark mb-3">{feature.title}</h3>
                <p className="text-mb-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 font-bold text-mb-dark mb-6">
                Benefits of {typeData.title} in {locData.name}
              </h2>
              <p className="text-lg text-mb-gray mb-8">
                Our modular offices are designed for {locData.region} climate conditions and
                constructed to meet all {locData.name} building requirements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                    <span className="text-mb-gray font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-mb-lg overflow-hidden">
              <img
                src={getPlaceholderImage(800, 600, `${locData.name} Benefits`)}
                alt={`Modular office benefits in ${locData.name}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cities Served Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Cities We Serve in {locData.name}
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              We deliver and install {typeData.shortTitle.toLowerCase()} modular offices throughout{' '}
              {locData.name}, serving all major cities and surrounding areas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {locData.majorCities.map((city, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-mb text-center hover:shadow-md transition-shadow"
              >
                <Building2 className="w-8 h-8 text-mb-navy mx-auto mb-2" />
                <span className="font-semibold text-mb-dark">{city}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-mb-gray mt-8">
            Plus all other cities and counties throughout {locData.name} ({locData.code})
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle={`Common questions about ${typeData.shortTitle.toLowerCase()} modular offices in ${locData.name}`}
        questions={faqs}
        className="bg-white"
      />

      {/* Other Office Types in This Location */}
      <InternalLinksSection
        title={`Other Modular Office Types in ${locData.name}`}
        subtitle="Explore our complete range of modular office solutions"
        links={otherTypeLinks}
        columns={3}
        showIcon={true}
      />

      {/* Other Locations for This Type */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              {typeData.title} in Other States
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              We deliver {typeData.shortTitle.toLowerCase()} modular offices nationwide. Select
              another state for location-specific information.
            </p>
          </div>

          <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
            {otherLocationLinks.slice(0, 6).map((link, index) => (
              <ProductCard
                key={index}
                title={link.title}
                category={typeData.shortTitle}
                imageUrl={getPlaceholderImage(400, 300, link.title)}
                href={link.url}
              />
            ))}
          </ProductGrid>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
                Get a Free Quote for {locData.name}
              </h2>
              <p className="text-lg text-mb-gray">
                Ready to discuss your {typeData.shortTitle.toLowerCase()} modular office project in{' '}
                {locData.name}? Fill out the form below and our {locData.code} team will contact you
                with a customized quote.
              </p>
            </div>

            <div className="bg-mb-bg-light p-8 md:p-12 rounded-mb-lg">
              <ContactForm
                productInterest={`${typeData.title} in ${locData.name}`}
                sourcePage={`/modular-office-building/${type}/${location}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={`Get Your ${typeData.shortTitle} Office in ${locData.name}`}
        description={`Contact our ${locData.name} team today to discuss your modular office needs. We provide free consultations, detailed quotes, and expert guidance throughout your project.`}
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
