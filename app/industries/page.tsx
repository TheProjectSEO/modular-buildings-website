import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection, FAQItem } from '@/components/sections/FAQSection'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, Stethoscope, Landmark, GraduationCap, Church, ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Industries We Serve | Modular Buildings Co',
  description: 'Modular Buildings Co provides modular building solutions for construction, medical, government, education, and religious sectors. Discover industry-specific solutions tailored to your needs.',
  openGraph: {
    title: 'Industries We Serve | Modular Buildings Co',
    description: 'Specialized modular building solutions for construction, medical, government, education, and religious sectors.',
    images: [getPlaceholderImage(1200, 630, 'Modular Buildings Co Industries')],
  },
}

interface Industry {
  slug: string
  name: string
  description: string
  icon: React.ReactNode
  features: string[]
  imageUrl: string
}

const industries: Industry[] = [
  {
    slug: 'construction',
    name: 'Construction',
    description: 'Modular solutions for construction sites including offices, workforce housing, storage facilities, and temporary structures that can be rapidly deployed and relocated as projects progress.',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Site offices and management facilities',
      'Workforce accommodation and dormitories',
      'Equipment storage and warehouses',
      'Security checkpoints and guard houses',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Construction Industry'),
  },
  {
    slug: 'medical',
    name: 'Medical & Healthcare',
    description: 'Purpose-built healthcare facilities including clinics, laboratories, emergency response units, and medical administrative buildings designed to meet strict healthcare regulations.',
    icon: <Stethoscope className="w-8 h-8" />,
    features: [
      'Modular clinics and medical centers',
      'Laboratory and testing facilities',
      'Emergency and disaster response units',
      'Medical storage and pharmacy buildings',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Medical Industry'),
  },
  {
    slug: 'government',
    name: 'Government',
    description: 'Secure and compliant modular buildings for government agencies, military installations, public services, and administrative facilities built to meet federal specifications.',
    icon: <Landmark className="w-8 h-8" />,
    features: [
      'Administrative offices and civic centers',
      'Military barracks and command centers',
      'Border security and checkpoint facilities',
      'Public service and community buildings',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Government Industry'),
  },
  {
    slug: 'education',
    name: 'Education',
    description: 'Modern educational facilities including classrooms, administrative buildings, libraries, and student housing designed to create optimal learning environments.',
    icon: <GraduationCap className="w-8 h-8" />,
    features: [
      'Modular classrooms and lecture halls',
      'Administrative and faculty offices',
      'Student dormitories and housing',
      'Libraries and study centers',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Education Industry'),
  },
  {
    slug: 'religion',
    name: 'Religious Institutions',
    description: 'Thoughtfully designed worship spaces, community halls, and fellowship buildings that honor religious traditions while providing modern amenities and accessibility.',
    icon: <Church className="w-8 h-8" />,
    features: [
      'Worship halls and chapels',
      'Community and fellowship centers',
      'Religious education classrooms',
      'Administrative and clergy offices',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Religious Buildings'),
  },
  {
    slug: 'retail',
    name: 'Retail',
    description: 'Versatile modular retail spaces including pop-up stores, showrooms, kiosks, and permanent retail locations designed to create memorable shopping experiences.',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Pop-up stores and seasonal retail',
      'Showrooms and display spaces',
      'Kiosks and small format stores',
      'Permanent retail buildings',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Retail Industry'),
  },
  {
    slug: 'events-hospitality',
    name: 'Events & Hospitality',
    description: 'Temporary and permanent structures for events, festivals, hotels, resorts, and hospitality venues designed to create exceptional guest experiences.',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Event structures and venues',
      'VIP and hospitality lounges',
      'Hotel and lodging modules',
      'Resort and glamping facilities',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Events Hospitality'),
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    description: 'Industrial modular buildings for manufacturing operations including production facilities, cleanrooms, warehouses, and quality testing laboratories.',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Production and assembly facilities',
      'Cleanrooms and controlled environments',
      'Warehouses and distribution centers',
      'Quality and testing laboratories',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Manufacturing Industry'),
  },
  {
    slug: 'oil-gas',
    name: 'Oil & Gas',
    description: 'Rugged modular buildings for oil fields, refineries, and energy operations including offices, camps, and industrial facilities built for extreme environments.',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Field offices and command centers',
      'Workforce camps and accommodation',
      'Control rooms and monitoring stations',
      'Industrial support facilities',
    ],
    imageUrl: getPlaceholderImage(600, 400, 'Oil Gas Industry'),
  },
]

const faqs: FAQItem[] = [
  {
    question: 'How does Modular Buildings Co customize solutions for different industries?',
    answer: 'Modular Buildings Co works closely with clients in each industry to understand specific requirements, regulations, and operational needs. Our engineering team designs custom solutions that incorporate industry-specific features, compliance standards, and functional layouts. We have dedicated specialists for each sector who ensure that every building meets the unique demands of your industry.',
  },
  {
    question: 'Are your modular buildings compliant with industry regulations?',
    answer: 'Yes, all Modular Buildings Co modular buildings are designed and manufactured to meet applicable industry regulations and building codes. This includes healthcare facility standards, educational building requirements, government specifications, and religious institution guidelines. We provide full documentation and certifications as required for permitting and compliance.',
  },
  {
    question: 'Can modular buildings be expanded or reconfigured later?',
    answer: 'Absolutely! One of the key advantages of modular construction is flexibility. Our buildings can be easily expanded by adding additional modules, reconfigured internally to meet changing needs, or even relocated to different sites. This adaptability makes them ideal for growing organizations and evolving requirements.',
  },
  {
    question: 'What is the typical timeline for industry-specific projects?',
    answer: 'Project timelines vary based on size and complexity, but modular construction is typically 30-50% faster than traditional methods. A standard modular classroom can be delivered in 4-6 weeks, while larger facilities like medical clinics may take 8-12 weeks. We provide detailed project schedules during the consultation phase.',
  },
  {
    question: 'Do you provide turnkey solutions including installation?',
    answer: 'Yes, Modular Buildings Co offers complete turnkey solutions that include design, manufacturing, delivery, installation, and finishing. We handle all aspects of the project including site preparation guidance, utility connections, and interior fit-out. Our clients receive a ready-to-use facility with minimal involvement required.',
  },
  {
    question: 'What warranty and support do you provide after installation?',
    answer: 'All Modular Buildings Co modular buildings come with comprehensive warranties covering structural components (10 years), exterior finishes (5 years), and systems (2 years). We also offer extended maintenance contracts and ongoing technical support. Our customer service team is available to address any questions or concerns throughout the building lifecycle.',
  },
]

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Industries', href: '/industries' },
]

export default function IndustriesPage() {
  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title="Industries We Serve"
        backgroundImage={getPlaceholderImage(1920, 400, 'Industries Banner')}
        breadcrumbs={breadcrumbs}
      />

      {/* Introduction Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
              Specialized Solutions for Every Sector
            </h2>
            <p className="text-lg text-mb-gray leading-relaxed">
              With over 25 years of experience, Modular Buildings Co has developed expertise in serving diverse industries
              with customized modular building solutions. Our team understands the unique requirements,
              regulations, and challenges of each sector, enabling us to deliver buildings that perfectly
              match your operational needs.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-12 md:py-16 bg-mb-bg-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="group bg-white rounded-mb-lg overflow-hidden border border-mb-border-gray hover:shadow-mb-hover transition-all duration-300"
              >
                {/* Industry Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={industry.imageUrl}
                    alt={industry.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mb-dark/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 bg-mb-warning p-3 rounded-mb">
                    {industry.icon}
                  </div>
                </div>

                {/* Industry Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-mb-dark mb-3 group-hover:text-mb-navy transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-sm text-mb-gray mb-4 line-clamp-3">
                    {industry.description}
                  </p>

                  {/* Features Preview */}
                  <ul className="space-y-2 mb-4">
                    {industry.features.slice(0, 2).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-mb-gray">
                        <CheckCircle2 className="w-4 h-4 text-mb-navy flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Learn More Link */}
                  <div className="flex items-center gap-2 text-mb-navy font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Modular Buildings Co Section */}
      <section className="py-12 md:py-16 bg-mb-navy text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold mb-4">
              Why Industries Choose Modular Buildings Co
            </h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Trusted by businesses and organizations worldwide for reliable, high-quality modular solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-mb-warning mb-2">25+</div>
              <div className="text-lg font-semibold mb-1">Years Experience</div>
              <p className="text-sm opacity-80">Industry-leading expertise</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-mb-warning mb-2">50+</div>
              <div className="text-lg font-semibold mb-1">Countries Served</div>
              <p className="text-sm opacity-80">Global delivery network</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-mb-warning mb-2">10,000+</div>
              <div className="text-lg font-semibold mb-1">Projects Completed</div>
              <p className="text-sm opacity-80">Proven track record</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-mb-warning mb-2">98%</div>
              <div className="text-lg font-semibold mb-1">Client Satisfaction</div>
              <p className="text-sm opacity-80">Excellence in service</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        questions={faqs}
        title="Frequently Asked Questions"
        subtitle="Common questions about our industry-specific solutions"
        className="bg-white"
      />

      {/* CTA Section */}
      <CTASection
        title="Ready to Discuss Your Project?"
        subtitle="Get Industry-Specific Solutions"
        description="Our team of industry specialists is ready to help you find the perfect modular solution for your sector. Contact us today for a free consultation and customized quote."
        primaryButton={{
          text: 'Request a Quote',
          href: '/contact?inquiry=quote',
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'View All Products',
          href: '/products',
          variant: 'outline',
        }}
        variant="contained"
        backgroundColor="navy"
      />
    </>
  )
}
