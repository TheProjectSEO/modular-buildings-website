import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { ContentBlockSection } from '@/components/sections/ContentBlockSection'
import { FAQSection, type FAQItem } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import type { Metadata } from 'next'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import Image from 'next/image'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Certifications & Standards',
  description: 'Modular Buildings Co holds multiple international certifications and quality standards. Learn about our ISO compliance, CE marks, and industry certifications.',
}

interface Certification {
  name: string
  issuer: string
  year: string
  description: string
  icon: string
}

const certifications: Certification[] = [
  {
    name: 'ISO 9001:2015',
    issuer: 'International Organization for Standardization',
    year: '2005',
    description: 'Quality Management System - Ensures consistent product quality and customer satisfaction across all operations.',
    icon: '✓',
  },
  {
    name: 'ISO 14001:2015',
    issuer: 'International Organization for Standardization',
    year: '2015',
    description: 'Environmental Management System - Demonstrates commitment to reducing environmental impact and sustainable practices.',
    icon: '🌍',
  },
  {
    name: 'CE Marking',
    issuer: 'European Commission',
    year: '2008',
    description: 'European Conformity - Certifies compliance with health, safety, and environmental protection requirements for European markets.',
    icon: '🇪🇺',
  },
  {
    name: 'OHSAS 18001',
    issuer: 'Occupational Health and Safety',
    year: '2010',
    description: 'Occupational Health & Safety - Ensures safe working conditions and workplace safety standards at all manufacturing facilities.',
    icon: '⚠️',
  },
  {
    name: 'TSE (Turkish Standards)',
    issuer: 'Turkish Standards Institute',
    year: '2000',
    description: 'Turkish national quality standards - Compliance with Turkish product safety and quality regulations.',
    icon: '🏆',
  },
  {
    name: 'BREEAM Certification',
    issuer: 'Building Research Establishment',
    year: '2018',
    description: 'Environmental Assessment Method - Recognizes buildings designed and built with sustainability as a core principle.',
    icon: '♻️',
  },
]

const standards = [
  {
    category: 'Building Codes',
    items: [
      'European Building Code (ETAG)',
      'Turkish Building Code (TBC)',
      'British Building Standards (BS)',
      'German Building Codes (DIN)',
    ],
  },
  {
    category: 'Quality Standards',
    items: [
      'DIN EN 13361 (Temporary structures)',
      'EN 1090 (Steel structures)',
      'EN 13830 (Curtain walls)',
      'EN 14509 (Sandwich panels)',
    ],
  },
  {
    category: 'Safety Standards',
    items: [
      'EN 1991 (Structural reliability)',
      'EN 1992 (Concrete design)',
      'EN 1993 (Steel design)',
      'EN 1994 (Composite design)',
    ],
  },
  {
    category: 'Environmental Standards',
    items: [
      'EN 15804 (Life cycle assessment)',
      'EN ISO 6946 (Thermal resistance)',
      'EN 13369 (Common rules for precast products)',
      'EN 14683 (Water vapor diffusion)',
    ],
  },
]

const faqItems: FAQItem[] = [
  {
    question: 'What does ISO 9001 certification mean?',
    answer: 'ISO 9001 is the international standard for quality management systems. Our certification means that Modular Buildings Co\'s manufacturing processes, quality control, and customer service meet rigorous international standards for consistency and excellence.',
  },
  {
    question: 'Is Modular Buildings Co CE marked?',
    answer: 'Yes, all our products carrying CE marking comply with EU directives on product safety, health, and environmental protection. This certification is mandatory for selling construction products in the European Union.',
  },
  {
    question: 'What is BREEAM certification?',
    answer: 'BREEAM (Building Research Establishment Environmental Assessment Method) is an environmental assessment tool that evaluates the sustainability of buildings. Our certification indicates our buildings are designed and built with environmental responsibility.',
  },
  {
    question: 'Are Modular Buildings Co buildings safe?',
    answer: 'Yes, safety is paramount. Our buildings comply with all relevant international safety standards including OHSAS 18001 for occupational health and safety, and we follow strict building codes and structural design standards.',
  },
  {
    question: 'Do Modular Buildings Co buildings meet European standards?',
    answer: 'Absolutely. All our products destined for European markets comply with CE marking requirements and European standards including EN 13361, EN 1090, and other relevant European technical standards.',
  },
  {
    question: 'How often are Modular Buildings Co facilities audited?',
    answer: 'Our facilities undergo regular internal audits and external audits by certification bodies annually. We maintain continuous compliance with all ISO standards and building codes.',
  },
]

export default function CertificationsPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Certifications', href: '/certifications' },
  ]

  return (
    <>
      <CategoryBanner
        title="Certifications & Quality Standards"
        backgroundImage={getPlaceholderImage(1920, 400, 'Certifications')}
        breadcrumbs={breadcrumbs}
      />

      {/* Introduction Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 font-bold mb-6 text-mb-dark">
                Quality You Can Trust
              </h2>
              <p className="text-lg text-mb-gray mb-4">
                Modular Buildings Co's comprehensive certification portfolio demonstrates our unwavering commitment to quality, safety, and environmental responsibility. We hold multiple international certifications that ensure every building meets or exceeds global standards.
              </p>
              <p className="text-lg text-mb-gray mb-6">
                From ISO 9001 quality management to CE marking compliance and BREEAM environmental certification, our credentials speak to our dedication to excellence in every aspect of our business.
              </p>
              <div className="space-y-3">
                {['Industry-leading quality standards', 'International compliance', 'Continuous improvement', 'Safety assured'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-mb-warning flex-shrink-0" />
                    <span className="text-mb-gray">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-96 rounded-mb-lg overflow-hidden">
              <Image
                src={getPlaceholderImage(600, 500, 'Quality Control')}
                alt="Modular Buildings Co Quality Control"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* International Certifications Grid */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-4 text-mb-dark">
            International Certifications
          </h2>
          <p className="text-center text-mb-gray mb-12 max-w-2xl mx-auto">
            Modular Buildings Co holds industry-leading certifications from globally recognized organizations, ensuring compliance with the highest standards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white rounded-mb-lg p-6 border border-mb-border-gray hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{cert.icon}</div>
                <h3 className="text-xl font-bold text-mb-dark mb-2">
                  {cert.name}
                </h3>
                <p className="text-sm text-mb-warning font-semibold mb-3">
                  {cert.issuer} • {cert.year}
                </p>
                <p className="text-mb-gray text-sm">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards Compliance */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-12 text-mb-dark">
            Standards & Compliance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {standards.map((standardGroup, index) => (
              <div
                key={index}
                className="bg-mb-bg-light rounded-mb-lg p-6 border border-mb-border-gray"
              >
                <h3 className="text-lg font-bold text-mb-dark mb-4 border-b-2 border-mb-warning pb-3">
                  {standardGroup.category}
                </h3>
                <ul className="space-y-3">
                  {standardGroup.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <span className="text-mb-warning font-bold mt-1">
                        ✓
                      </span>
                      <span className="text-mb-gray text-sm">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Process */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-12 text-mb-dark">
            Our Certification Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Documentation',
                description: 'Comprehensive documentation of all processes, materials, and standards used in manufacturing and construction.',
              },
              {
                step: '2',
                title: 'Audit',
                description: 'External audits by independent certification bodies to verify compliance with international standards.',
              },
              {
                step: '3',
                title: 'Certification',
                description: 'Award of certifications upon successful completion of audit and verification processes.',
              },
              {
                step: '4',
                title: 'Maintenance',
                description: 'Ongoing compliance monitoring and regular re-certification audits to maintain certification status.',
              },
            ].map((process, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-mb-lg p-6 border-2 border-mb-navy text-center h-full">
                  <div className="w-12 h-12 bg-mb-warning text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {process.step}
                  </div>
                  <h3 className="text-lg font-bold text-mb-dark mb-3">
                    {process.title}
                  </h3>
                  <p className="text-sm text-mb-gray">
                    {process.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-1 bg-mb-warning transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Assurance Details */}
      <ContentBlockSection
        title="Our Quality Assurance Commitment"
        content={`
          <p className="mb-6">Quality is not an afterthought at Modular Buildings Co—it's embedded in every step of our manufacturing process. Our quality assurance practices ensure that every building component meets or exceeds international standards.</p>

          <h3 className="text-2xl font-bold mb-4">Quality Control Measures</h3>
          <ul className="list-disc list-inside space-y-3 mb-6">
            <li><strong>Material Inspection:</strong> All raw materials are tested and verified before entering the manufacturing process.</li>
            <li><strong>Process Monitoring:</strong> Real-time monitoring of manufacturing processes ensures consistency and precision.</li>
            <li><strong>Component Testing:</strong> Each component undergoes rigorous testing for structural integrity, durability, and safety compliance.</li>
            <li><strong>Final Inspection:</strong> Completed units are inspected before shipment to ensure they meet all specifications.</li>
            <li><strong>Documentation:</strong> Comprehensive documentation accompanies each building for traceability and compliance verification.</li>
            <li><strong>Continuous Improvement:</strong> Regular audits and customer feedback drive continuous improvements in our processes.</li>
          </ul>

          <p>Our commitment to quality has earned us the trust of thousands of customers worldwide and numerous industry certifications and awards.</p>
        `}
        layout="text-only"
        backgroundColor="white"
      />

      {/* FAQ Section */}
      <FAQSection
        questions={faqItems}
        title="Certifications FAQ"
        subtitle="Get answers to common questions about our certifications and standards"
        className="bg-mb-bg-light"
      />

      {/* CTA Section */}
      <CTASection
        title="Certified Quality Meets Your Needs"
        subtitle="Build with Confidence"
        description="Contact our team to learn more about our certifications, quality standards, and how they ensure your project meets the highest requirements."
        primaryButton={{
          text: 'Request Documentation',
          href: '/contact',
          variant: 'primary',
        }}
        secondaryButton={{
          text: 'View Our Projects',
          href: '/projects',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}
