import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { ContentBlockSection } from '@/components/sections/ContentBlockSection'
import { FAQSection, type FAQItem } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import Image from 'next/image'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Maintenance & Repair Services',
  description: 'Comprehensive maintenance and repair services for Modular Buildings Co buildings. Professional support keeps your building in perfect condition for decades.',
}

interface MaintenancePackage {
  name: string
  icon: string
  description: string
  includes: string[]
  period: string
}

const maintenancePackages: MaintenancePackage[] = [
  {
    name: 'Basic Maintenance',
    icon: '🔍',
    period: 'Annual',
    description: 'Essential maintenance to keep your building in good working order',
    includes: [
      'Annual building inspection',
      'Roof and exterior checks',
      'Drainage system inspection',
      'Basic repairs and adjustments',
      '2 service visits per year',
    ],
  },
  {
    name: 'Standard Maintenance',
    icon: '🛠️',
    period: 'Semi-Annual',
    description: 'Comprehensive regular maintenance with expert support',
    includes: [
      'Bi-annual professional inspections',
      'HVAC system maintenance',
      'Plumbing and electrical checks',
      'Preventive repairs and replacements',
      '4 service visits per year',
      'Emergency support (business hours)',
    ],
  },
  {
    name: 'Premium Maintenance',
    icon: '⭐',
    period: 'Quarterly',
    description: 'Complete care program with priority support and 24/7 emergency access',
    includes: [
      'Quarterly comprehensive inspections',
      'All system preventive maintenance',
      'Roof and facade maintenance',
      'Landscaping and exterior care',
      '8 service visits per year',
      '24/7 emergency support',
      'Priority scheduling',
    ],
  },
  {
    name: 'Custom Maintenance',
    icon: '📋',
    period: 'Custom',
    description: 'Tailored programs based on your specific building needs',
    includes: [
      'Customized inspection schedules',
      'Specialized system maintenance',
      'Industry-specific requirements',
      'Performance monitoring',
      'Flexible service frequency',
      'Dedicated contact person',
    ],
  },
]

const commonRepairs = [
  {
    category: 'Structural',
    icon: '🏗️',
    services: ['Foundation repairs', 'Structural reinforcement', 'Connection maintenance', 'Settlement assessment'],
  },
  {
    category: 'HVAC Systems',
    icon: '❄️',
    services: ['Unit repair and replacement', 'Filter changes', 'Refrigerant service', 'Ductwork cleaning'],
  },
  {
    category: 'Plumbing',
    icon: '💧',
    services: ['Leak repairs', 'Pipe replacement', 'Water pressure regulation', 'Fixture replacement'],
  },
  {
    category: 'Electrical',
    icon: '⚡',
    services: ['Circuit repairs', 'Outlet maintenance', 'Panel upgrades', 'Safety system testing'],
  },
  {
    category: 'Roofing',
    icon: '🏠',
    services: ['Leak detection and repair', 'Membrane replacement', 'Flashing repairs', 'Drainage restoration'],
  },
  {
    category: 'Interior Finishes',
    icon: '🎨',
    services: ['Wall and ceiling repairs', 'Floor maintenance', 'Door and window fixes', 'Paint and finishes'],
  },
]

const faqItems: FAQItem[] = [
  {
    question: 'How often should Modular Buildings Co buildings be maintained?',
    answer: 'Modular Buildings Co buildings are designed for minimal maintenance, but regular care extends their life and performance. We recommend annual inspections for basic maintenance, with more frequent service (quarterly) for premium care. Specific requirements depend on climate, usage, and building type.',
  },
  {
    question: 'What\'s covered under warranty?',
    answer: 'New Modular Buildings Co buildings come with a standard 10-year structural warranty covering major components and systems. Additional extended warranties are available. Coverage includes manufacturing defects but not normal wear and tear. Maintenance program enrollment may enhance warranty benefits.',
  },
  {
    question: 'Can I perform my own maintenance?',
    answer: 'Basic maintenance like cleaning gutters and filters can be done in-house. However, we recommend professional maintenance for HVAC, electrical, and plumbing systems. Our maintenance programs provide professional expertise while you focus on core operations.',
  },
  {
    question: 'What happens if major repairs are needed?',
    answer: 'Our technical team assesses repair needs and provides detailed estimates. Many repairs can be scheduled during planned maintenance windows. For emergency repairs, we offer 24/7 support. We work with original suppliers to ensure compatible components.',
  },
  {
    question: 'Are replacement parts readily available?',
    answer: 'Yes, we maintain inventory of common replacement parts for all Modular Buildings Co buildings. Most standard parts are available within days. We also facilitate ordering of specialized components from manufacturers, typically available within 2-4 weeks.',
  },
  {
    question: 'How can I enroll in a maintenance program?',
    answer: 'Contact our maintenance team to discuss your building\'s needs and select an appropriate maintenance package. We provide customized proposals and flexible enrollment options. Programs can begin immediately or after your initial warranty period.',
  },
  {
    question: 'What happens after the warranty period ends?',
    answer: 'Modular Buildings Co buildings are built to last 50+ years with proper maintenance. After the initial warranty, maintenance programs and pay-as-you-go repair services keep your building functioning optimally. Many of our 1990s buildings are still in excellent condition today.',
  },
  {
    question: 'Can maintenance programs be upgraded or modified?',
    answer: 'Yes, programs can be adjusted based on your evolving needs. As your building ages or usage changes, we can modify the maintenance level, add specialized services, or customize schedules.',
  },
]

export default function MaintenancePage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Maintenance', href: '/maintenance' },
  ]

  return (
    <>
      <CategoryBanner
        title="Maintenance & Repair Services"
        backgroundImage={getPlaceholderImage(1920, 400, 'Maintenance')}
        breadcrumbs={breadcrumbs}
      />

      {/* Introduction Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 font-bold mb-6 text-mb-dark">
                Expert Care for Your Building
              </h2>
              <p className="text-lg text-mb-gray mb-4">
                A Modular Buildings Co building is a long-term investment. Proper maintenance preserves its value, performance, and functionality for decades. Our professional maintenance and repair services keep your building in optimal condition.
              </p>
              <p className="text-lg text-mb-gray mb-6">
                From routine inspections to emergency repairs, our certified technicians provide expert care tailored to your building's specific needs. We help you avoid costly problems through preventive maintenance and rapid response when issues arise.
              </p>
              <div className="space-y-3 mb-8">
                {['Certified technicians', 'Preventive maintenance', '24/7 emergency support', 'Genuine spare parts'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-mb-warning flex-shrink-0" />
                    <span className="text-mb-gray">{item}</span>
                  </div>
                ))}
              </div>
              <Button variant="primary">
                <a href="/contact">Enroll in Program</a>
              </Button>
            </div>
            <div className="relative h-96 rounded-mb-lg overflow-hidden">
              <Image
                src={getPlaceholderImage(600, 500, 'Maintenance Services')}
                alt="Professional Maintenance"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Packages */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-4 text-mb-dark">
            Maintenance Packages
          </h2>
          <p className="text-center text-mb-gray mb-12 max-w-2xl mx-auto">
            Choose the maintenance level that best fits your building and operational needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {maintenancePackages.slice(0, 2).map((pkg, index) => (
              <div
                key={index}
                className="bg-white rounded-mb-lg p-8 border border-mb-border-gray hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{pkg.icon}</div>
                <h3 className="text-2xl font-bold text-mb-dark mb-2">
                  {pkg.name}
                </h3>
                <p className="text-mb-warning font-semibold mb-3">
                  Service Frequency: {pkg.period}
                </p>
                <p className="text-mb-gray mb-6">
                  {pkg.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {pkg.includes.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                      <span className="text-mb-gray text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">
                  <a href="/contact">Select Package</a>
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {maintenancePackages.slice(2).map((pkg, index) => (
              <div
                key={index + 2}
                className="bg-white rounded-mb-lg p-8 border border-mb-border-gray hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{pkg.icon}</div>
                <h3 className="text-2xl font-bold text-mb-dark mb-2">
                  {pkg.name}
                </h3>
                <p className="text-mb-warning font-semibold mb-3">
                  Service Frequency: {pkg.period}
                </p>
                <p className="text-mb-gray mb-6">
                  {pkg.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {pkg.includes.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                      <span className="text-mb-gray text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">
                  <a href="/contact">Select Package</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Repair Services */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-12 text-mb-dark">
            Repair Services We Provide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commonRepairs.map((repair, index) => (
              <div
                key={index}
                className="bg-mb-bg-light rounded-mb-lg p-8 border border-mb-border-gray"
              >
                <div className="text-4xl mb-4">{repair.icon}</div>
                <h3 className="text-xl font-bold text-mb-dark mb-4">
                  {repair.category}
                </h3>
                <ul className="space-y-3">
                  {repair.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="flex items-start gap-2">
                      <span className="text-mb-warning font-bold">→</span>
                      <span className="text-mb-gray">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-mb-navy text-white">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-12">
            Why Choose Modular Buildings Co Maintenance?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Expert Technicians',
                description: 'Trained specialists with deep knowledge of Modular Buildings Co buildings and systems.',
              },
              {
                title: 'Preventive Care',
                description: 'Regular maintenance prevents costly problems and extends building life.',
              },
              {
                title: 'Fast Response',
                description: '24/7 emergency support ensures rapid response to urgent issues.',
              },
              {
                title: 'Quality Parts',
                description: 'Genuine Modular Buildings Co components and compatible replacements only.',
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6 border border-white/20 rounded-mb-lg">
                <h3 className="text-lg font-bold mb-3">
                  {benefit.title}
                </h3>
                <p className="opacity-90 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maintenance Details */}
      <ContentBlockSection
        title="Building a Long-Term Relationship"
        content={`
          <h3 className="text-2xl font-bold mb-4">Preventive Maintenance Saves Money</h3>
          <p className="mb-6">Regular preventive maintenance is significantly more cost-effective than emergency repairs. By addressing small issues before they become major problems, you avoid expensive breakdowns and extend your building's lifespan.</p>

          <h3 className="text-2xl font-bold mb-4">Our Maintenance Approach</h3>
          <ul className="list-disc list-inside space-y-3 mb-6">
            <li><strong>Regular Inspections:</strong> Scheduled inspections identify potential issues early.</li>
            <li><strong>Preventive Service:</strong> We maintain systems before problems occur.</li>
            <li><strong>Rapid Response:</strong> Emergency issues receive immediate attention 24/7.</li>
            <li><strong>Documentation:</strong> Complete records of all maintenance and repairs.</li>
            <li><strong>Transparent Pricing:</strong> Clear cost estimates before any work begins.</li>
            <li><strong>Genuine Parts:</strong> Only authentic Modular Buildings Co and compatible components used.</li>
          </ul>

          <h3 className="text-2xl font-bold mb-4">Long-Term Building Health</h3>
          <p>Modular Buildings Co buildings are designed to last 50+ years or more with proper maintenance. Many buildings we installed in the 1990s remain in excellent condition today. Enrolling in our maintenance program protects your investment and ensures your building serves its purpose reliably for decades.</p>
        `}
        layout="text-only"
        backgroundColor="white"
      />

      {/* FAQ Section */}
      <FAQSection
        questions={faqItems}
        title="Maintenance FAQ"
        subtitle="Common questions about our maintenance and repair services"
        className="bg-mb-bg-light"
      />

      {/* CTA Section */}
      <CTASection
        title="Keep Your Building in Perfect Condition"
        subtitle="Expert Maintenance Support"
        description="Enroll in our maintenance program today and protect your building investment. Our certified technicians provide expert care to keep your building performing optimally."
        primaryButton={{
          text: 'Enroll Now',
          href: '/contact',
          variant: 'primary',
        }}
        secondaryButton={{
          text: 'Get a Quote',
          href: '/contact',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}
