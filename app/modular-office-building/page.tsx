import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductGrid } from '@/components/ui/ProductGrid'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContactForm } from '@/components/forms/ContactForm'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import type { Metadata } from 'next'
import {
  CheckCircle,
  Building2,
  Clock,
  Shield,
  DollarSign,
  Zap,
  Award,
  Truck,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Modular Office Buildings | Prefabricated Office Solutions | Modular Buildings Co',
  description:
    'Explore our range of modular office buildings including single-wide, double-wide, multi-complexes, and sales offices. Fast installation, customizable designs, and cost-effective solutions for your business needs.',
  keywords:
    'modular office buildings, prefabricated office, portable office, single-wide office, double-wide office, sales office, modular construction',
}

const officeTypes = [
  {
    slug: 'single-wide',
    title: 'Single-Wide Modular Offices',
    description:
      'Compact and efficient single-wide modular offices perfect for small teams and temporary needs.',
    imageUrl: getPlaceholderImage(400, 300, 'Single-Wide Office'),
  },
  {
    slug: 'double-wide',
    title: 'Double-Wide Modular Offices',
    description:
      'Spacious double-wide offices offering more room for larger teams and expanded operations.',
    imageUrl: getPlaceholderImage(400, 300, 'Double-Wide Office'),
  },
  {
    slug: 'multi-complexes',
    title: 'Multi-Complex Modular Offices',
    description:
      'Large-scale modular office complexes ideal for corporate headquarters and major operations.',
    imageUrl: getPlaceholderImage(400, 300, 'Multi-Complex Office'),
  },
  {
    slug: 'sales-offices',
    title: 'Sales Offices',
    description:
      'Professional sales offices designed for real estate, construction sites, and retail environments.',
    imageUrl: getPlaceholderImage(400, 300, 'Sales Office'),
  },
]

const keyFeatures = [
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Rapid Installation',
    description:
      'Get your office up and running in weeks, not months. Our modular construction process reduces installation time by up to 50%.',
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: 'Cost-Effective',
    description:
      'Save 20-40% compared to traditional construction while getting a premium quality office building.',
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: 'Fully Customizable',
    description:
      'Design your office layout to match your exact needs with flexible floor plans and finishing options.',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Built to Last',
    description:
      'Premium materials and construction techniques ensure your modular office stands the test of time.',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Energy Efficient',
    description:
      'Superior insulation and modern HVAC systems reduce energy costs and environmental impact.',
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Relocatable',
    description:
      'Need to move? Modular offices can be relocated to new sites as your business needs change.',
  },
]

const benefits = [
  'Factory-controlled quality construction',
  'Minimal site disruption during installation',
  'Compliant with all building codes and regulations',
  'Sustainable and eco-friendly building option',
  'Expandable as your business grows',
  'Professional interior finishes available',
  '10-year structural warranty included',
  'Financing options available',
  'Turn-key solutions with furniture and IT infrastructure',
  'Nationwide delivery and installation',
  'Permitting assistance included',
  'Post-installation support and maintenance',
]

const faqs = [
  {
    question: 'What is a modular office building?',
    answer:
      'A modular office building is a prefabricated structure manufactured in a controlled factory environment and then transported to your site for assembly. These buildings are constructed using the same materials and building codes as traditional offices but offer faster installation, lower costs, and greater flexibility.',
  },
  {
    question: 'How long does it take to install a modular office?',
    answer:
      'Installation time varies based on the size and complexity of your project. Single-wide offices can typically be installed in 1-2 days, while larger multi-complex buildings may take 2-4 weeks. The entire process from order to occupancy is usually 4-8 weeks, compared to 6-12 months for traditional construction.',
  },
  {
    question: 'Are modular offices as durable as traditional buildings?',
    answer:
      'Yes! Modular offices are built to the same building codes and standards as conventional construction. In fact, they often exceed traditional construction quality because they are built in a controlled factory environment with rigorous quality control processes. Our buildings come with a 10-year structural warranty.',
  },
  {
    question: 'Can modular offices be customized?',
    answer:
      'Absolutely. We offer extensive customization options including floor plan configurations, interior finishes, exterior cladding, windows and doors, HVAC systems, electrical layouts, and more. Our design team works with you to create an office that perfectly matches your requirements.',
  },
  {
    question: 'What sizes are available for modular offices?',
    answer:
      'We offer modular offices ranging from compact single-wide units (12x60 ft) to large multi-complex buildings that can span thousands of square feet. Single-wide, double-wide, and custom multi-module configurations are available to suit any space requirement.',
  },
  {
    question: 'Do modular offices meet building codes?',
    answer:
      'Yes, all our modular office buildings are designed and constructed to meet or exceed local, state, and national building codes. We handle permitting assistance and ensure your building is fully compliant with all applicable regulations in your area.',
  },
  {
    question: 'Can a modular office be relocated?',
    answer:
      'Yes, one of the key advantages of modular construction is relocatability. If your business needs change or you move to a new location, your modular office can be disassembled and transported to a new site. This provides long-term flexibility and protects your investment.',
  },
  {
    question: 'What is the cost of a modular office building?',
    answer:
      'Costs vary based on size, configuration, and customization options. Generally, modular offices cost 20-40% less than traditional construction. Contact us for a detailed quote tailored to your specific requirements and location.',
  },
]

export default function ModularOfficeBuildingPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Modular Office Buildings', href: '/modular-office-building' },
  ]

  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title="Modular Office Buildings"
        backgroundImage={getPlaceholderImage(1920, 400, 'Modular Office Buildings')}
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
                Professional Modular Office Solutions
              </h2>
              <p className="text-lg text-mb-gray mb-6">
                Transform your workspace with our premium modular office buildings. Whether you need
                a compact single-wide office for a construction site or a large multi-complex
                corporate headquarters, we deliver quality, speed, and value.
              </p>
              <p className="text-lg text-mb-gray mb-8">
                Our modular offices are built in state-of-the-art manufacturing facilities using
                premium materials and rigorous quality control. Get a professional workspace in
                weeks, not months, at a fraction of traditional construction costs.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#office-types"
                  className="inline-flex items-center px-6 py-3 bg-mb-navy text-white font-semibold rounded-mb hover:bg-mb-navy/90 transition-colors"
                >
                  Explore Office Types
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 bg-mb-warning text-white font-semibold rounded-mb hover:bg-mb-warning/90 transition-colors"
                >
                  Get a Free Quote
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-mb-lg overflow-hidden">
              <img
                src={getPlaceholderImage(800, 600, 'Modular Office')}
                alt="Modern modular office building"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Office Types Section */}
      <section id="office-types" className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Modular Office Types
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Choose from our range of modular office configurations designed to meet diverse
              business needs and space requirements.
            </p>
          </div>

          <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
            {officeTypes.map((type) => (
              <ProductCard
                key={type.slug}
                title={type.title}
                category="Modular Office"
                imageUrl={type.imageUrl}
                href={`/modular-office-building/${type.slug}`}
              />
            ))}
          </ProductGrid>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">Key Features</h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Our modular office buildings combine innovative design with superior construction to
              deliver exceptional workspaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-mb-bg-light p-8 rounded-mb-lg hover:shadow-lg transition-shadow"
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
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Why Choose Modular Office Buildings?
            </h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Discover the advantages of modular construction for your office space needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
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

      {/* Applications Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-mb-lg overflow-hidden">
              <img
                src={getPlaceholderImage(800, 600, 'Office Applications')}
                alt="Modular office applications"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-h2 font-bold text-mb-dark mb-6">
                Applications Across Industries
              </h2>
              <p className="text-lg text-mb-gray mb-6">
                Our modular office buildings serve businesses across a wide range of industries and
                applications:
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-mb-navy flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Construction Site Offices</h3>
                    <p className="text-mb-gray">
                      Temporary headquarters for project management and site operations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-mb-navy flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Corporate Expansion</h3>
                    <p className="text-mb-gray">
                      Quick expansion of office space for growing businesses.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-mb-navy flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Educational Institutions</h3>
                    <p className="text-mb-gray">
                      Administrative offices and faculty workspaces for schools and universities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-mb-navy flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Healthcare Facilities</h3>
                    <p className="text-mb-gray">
                      Medical office buildings and administrative centers for healthcare providers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-mb-navy flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Government Agencies</h3>
                    <p className="text-mb-gray">
                      Secure office facilities for federal, state, and local government operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Common questions about modular office buildings"
        questions={faqs}
        className="bg-mb-bg-light"
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
                Ready to discuss your modular office building project? Fill out the form below and
                our team will contact you with a customized quote.
              </p>
            </div>

            <div className="bg-mb-bg-light p-8 md:p-12 rounded-mb-lg">
              <ContactForm
                productInterest="Modular Office Building"
                sourcePage="/modular-office-building"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Build Your Modular Office?"
        description="Contact our team today to discuss your modular office building needs. We provide free consultations, detailed quotes, and expert guidance throughout your project."
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
