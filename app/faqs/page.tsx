import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { CTASection } from '@/components/sections/CTASection'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Modular Buildings Co',
  description: 'Find answers to common questions about modular buildings, pricing, delivery, installation, and more. Get the information you need about our modular building solutions.',
  openGraph: {
    title: 'Frequently Asked Questions | Modular Buildings Co',
    description: 'Find answers to common questions about modular buildings, pricing, delivery, installation, and more.',
    images: [getPlaceholderImage(1200, 630, 'FAQs')],
  },
}

interface FAQCategory {
  name: string
  faqs: { question: string; answer: string }[]
}

const faqCategories: FAQCategory[] = [
  {
    name: 'General Questions',
    faqs: [
      {
        question: 'What is modular construction?',
        answer: 'Modular construction is a building method where structures are prefabricated in sections (modules) in a factory-controlled environment, then transported to the site and assembled. This approach offers faster construction times, better quality control, and reduced waste compared to traditional on-site construction.',
      },
      {
        question: 'How long do modular buildings last?',
        answer: 'Our modular buildings are built to the same standards as traditional construction and have an expected lifespan of 30+ years with proper maintenance. Many modular buildings have been in use for over 50 years. We provide comprehensive warranties and maintenance guidelines to ensure longevity.',
      },
      {
        question: 'Are modular buildings permanent structures?',
        answer: 'Yes, modular buildings can be permanent structures built to meet all local building codes and regulations. They can also be designed for temporary or relocatable use depending on your needs. The same building can often serve as temporary initially and be converted to permanent use later.',
      },
      {
        question: 'What is the difference between modular and manufactured buildings?',
        answer: 'Modular buildings are built to local building codes and placed on permanent foundations, while manufactured buildings (mobile homes) are built to federal HUD codes and placed on non-permanent foundations. Modular buildings offer more design flexibility and are treated the same as site-built structures for zoning and financing purposes.',
      },
    ],
  },
  {
    name: 'Pricing & Costs',
    faqs: [
      {
        question: 'How much do modular buildings cost?',
        answer: 'Modular building costs vary based on size, design, features, and location. Generally, modular construction is 10-35% less expensive than traditional construction. We provide detailed quotes after understanding your specific requirements. Contact us for a free consultation and customized estimate.',
      },
      {
        question: 'What factors affect the price of a modular building?',
        answer: 'Key pricing factors include building size and configuration, interior finishes and fixtures, HVAC and electrical systems, site preparation requirements, delivery distance, and any special features or customizations. We work with you to optimize design for your budget.',
      },
      {
        question: 'Do you offer financing options?',
        answer: 'Yes, we offer various financing options including purchase, lease, and lease-to-own arrangements. We work with financial partners to provide competitive rates and flexible terms. Our team can help structure a financing solution that fits your budget and cash flow requirements.',
      },
      {
        question: 'Are there any hidden costs I should be aware of?',
        answer: 'We provide transparent, comprehensive quotes that include manufacturing, delivery, and installation. Additional costs may include site preparation, foundation work, utility connections, and permits which we will discuss upfront. We strive for no surprises.',
      },
    ],
  },
  {
    name: 'Design & Customization',
    faqs: [
      {
        question: 'Can modular buildings be customized?',
        answer: 'Absolutely! Our modular buildings can be fully customized including floor plans, exterior finishes, interior layouts, windows, doors, electrical systems, plumbing, and HVAC. Our design team works with you to create buildings that meet your exact specifications.',
      },
      {
        question: 'What sizes of modular buildings are available?',
        answer: 'We offer modular buildings ranging from small single units (around 100 sq ft) to large multi-story complexes (50,000+ sq ft). Single modules typically range from 10-16 feet wide and 20-72 feet long. Multiple modules can be combined for larger structures.',
      },
      {
        question: 'Can I see examples of your work before ordering?',
        answer: 'Yes, we encourage you to view our portfolio of completed projects. We can also arrange visits to similar installations in your area when possible. Our team can provide detailed case studies and references from clients in your industry.',
      },
      {
        question: 'Do you provide design and engineering services?',
        answer: 'Yes, we offer complete design and engineering services including architectural drawings, structural engineering, MEP design, and permitting support. Our in-house team ensures designs are optimized for modular construction while meeting all your requirements.',
      },
    ],
  },
  {
    name: 'Delivery & Installation',
    faqs: [
      {
        question: 'How long does it take to manufacture a modular building?',
        answer: 'Manufacturing time typically ranges from 4-12 weeks depending on size and complexity. While manufacturing proceeds, site preparation can occur simultaneously, significantly reducing overall project timelines. Rush orders may be available for urgent needs.',
      },
      {
        question: 'How are modular buildings delivered?',
        answer: 'Modular buildings are transported on flatbed trucks. Depending on module size, wide-load permits may be required. We coordinate all logistics including route planning, permits, and crane services. Delivery can be arranged to almost any location accessible by truck.',
      },
      {
        question: 'What site preparation is required?',
        answer: 'Site preparation typically includes clearing and grading, foundation installation (concrete slab, piers, or basement), and utility stub-outs. Our team provides detailed site preparation guidelines and can recommend local contractors if needed.',
      },
      {
        question: 'How long does installation take?',
        answer: 'On-site installation typically takes 1-5 days for setting modules, depending on building size and complexity. Complete finishing including utility connections, interior finishing, and final inspections may take an additional 1-4 weeks.',
      },
    ],
  },
  {
    name: 'Quality & Compliance',
    faqs: [
      {
        question: 'Are modular buildings built to code?',
        answer: 'Yes, all our modular buildings are designed and manufactured to meet or exceed applicable local building codes, including IBC, IRC, and state-specific requirements. We work with local authorities to ensure proper permitting and inspections.',
      },
      {
        question: 'What quality standards do you follow?',
        answer: 'We manufacture in ISO-certified facilities with rigorous quality control processes. Every building undergoes multiple inspections during manufacturing. We also perform pre-delivery inspections and post-installation quality checks.',
      },
      {
        question: 'Are your buildings energy efficient?',
        answer: 'Yes, our modular buildings can be designed to meet various energy efficiency standards including ENERGY STAR, LEED, and local green building requirements. Options include high-efficiency insulation, windows, HVAC systems, and LED lighting.',
      },
      {
        question: 'What warranty do you provide?',
        answer: 'We provide comprehensive warranties: 10 years on structural components, 5 years on exterior finishes, and 2 years on systems and equipment. Extended warranty and maintenance contracts are also available.',
      },
    ],
  },
  {
    name: 'After-Sales Support',
    faqs: [
      {
        question: 'Do you provide maintenance services?',
        answer: 'Yes, we offer maintenance contracts and support services to keep your building in optimal condition. This includes scheduled inspections, preventive maintenance, and responsive repairs. We also provide maintenance guidelines for owner-performed upkeep.',
      },
      {
        question: 'Can modular buildings be expanded later?',
        answer: 'Yes, one of the key advantages of modular construction is expandability. Buildings can be designed with future expansion in mind, and additional modules can be added later. Expansions typically take less time and cause less disruption than traditional additions.',
      },
      {
        question: 'Can modular buildings be relocated?',
        answer: 'Yes, modular buildings can be disassembled and relocated to new sites. The ease of relocation depends on the building type and foundation. Buildings designed for relocatability can be moved multiple times throughout their lifespan.',
      },
      {
        question: 'How do I get support if I have issues?',
        answer: 'Our customer service team is available by phone and email during business hours. For warranty issues, contact our support line and a technician will be dispatched as needed. We also provide online resources including manuals and troubleshooting guides.',
      },
    ],
  },
]

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'FAQs', href: '/faqs' },
]

export default function FAQsPage() {
  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title="Frequently Asked Questions"
        backgroundImage={getPlaceholderImage(1920, 400, 'FAQs Banner')}
        breadcrumbs={breadcrumbs}
      />

      {/* Introduction Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
              Get Answers to Your Questions
            </h2>
            <p className="text-lg text-mb-gray leading-relaxed">
              Find answers to the most common questions about modular buildings, our products,
              pricing, delivery, and more. If you can&apos;t find what you&apos;re looking for,
              don&apos;t hesitate to contact our team.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 md:py-16 bg-mb-bg-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-2xl font-bold text-mb-dark mb-6 pb-2 border-b-2 border-mb-navy">
                  {category.name}
                </h3>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <details
                      key={faqIndex}
                      className="group bg-white rounded-mb-lg border border-mb-border-gray overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-mb-bg-light transition-colors">
                        <span className="font-semibold text-mb-dark pr-4">{faq.question}</span>
                        <ChevronDown className="w-5 h-5 text-mb-navy flex-shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-6 pb-6">
                        <p className="text-mb-gray leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-h2 font-bold text-mb-dark mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-mb-gray mb-8">
              Our team is here to help. Contact us for personalized assistance with your modular building project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-mb-navy text-white font-semibold rounded-mb hover:bg-mb-dark transition-colors"
              >
                Contact Us
              </a>
              <a
                href="tel:1-800-MODULAR"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-mb-navy text-mb-navy font-semibold rounded-mb hover:bg-mb-navy hover:text-white transition-colors"
              >
                Call 1-800-MODULAR
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Start Your Project?"
        subtitle="Get a Free Quote Today"
        description="Our team is ready to help you find the perfect modular building solution. Contact us for a free consultation and detailed quote."
        primaryButton={{
          text: 'Request a Quote',
          href: '/contact?inquiry=quote',
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'View Products',
          href: '/products',
          variant: 'outline',
        }}
        variant="contained"
        backgroundColor="navy"
      />
    </>
  )
}
