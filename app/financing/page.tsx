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
  title: 'Financing Options',
  description: 'Flexible financing and payment plans for Modular Buildings Co buildings. We work with major financial institutions to offer affordable solutions for your project.',
}

interface FinancingOption {
  name: string
  icon: string
  features: string[]
  description: string
}

const financingOptions: FinancingOption[] = [
  {
    name: 'Bank Financing',
    icon: '🏦',
    description: 'Partner with major international banks for competitive financing terms',
    features: [
      'Flexible repayment terms (5-20 years)',
      'Competitive interest rates',
      'Custom payment schedules',
      'Large project capability',
      'International bank network',
    ],
  },
  {
    name: 'Lease Programs',
    icon: '📋',
    description: 'Operational and financial lease options for short to long-term needs',
    features: [
      'Operating lease options',
      'Finance lease programs',
      'Flexible lease terms',
      'Maintenance packages available',
      'Transfer options at lease end',
    ],
  },
  {
    name: 'Equipment Financing',
    icon: '⚙️',
    description: 'Specialized financing for building equipment and systems',
    features: [
      'HVAC system financing',
      'Solar panel installation',
      'Smart building technology',
      'Security systems',
      'Warranty coverage options',
    ],
  },
  {
    name: 'Government Programs',
    icon: '🏛️',
    description: 'Access to government grants and subsidies where applicable',
    features: [
      'Green building incentives',
      'Infrastructure development grants',
      'Social housing programs',
      'Educational facility subsidies',
      'Healthcare facility funding',
    ],
  },
]

const paymentPlans = [
  {
    name: 'Milestone Payment Plan',
    description: 'Pay in phases as construction progresses',
    timeline: [
      { phase: 'Design & Engineering', percentage: '15%' },
      { phase: 'Manufacturing Start', percentage: '35%' },
      { phase: 'Delivery & Installation', percentage: '35%' },
      { phase: 'Completion & Handover', percentage: '15%' },
    ],
  },
  {
    name: 'Custom Payment Schedule',
    description: 'Tailored payment plan based on your project timeline and cash flow',
    timeline: [
      { phase: 'Initial Deposit', percentage: '20%' },
      { phase: 'Manufacturing Phase', percentage: '30%' },
      { phase: 'Pre-Delivery', percentage: '30%' },
      { phase: 'Final Payment', percentage: '20%' },
    ],
  },
  {
    name: 'Deferred Payment',
    description: 'Flexible timing for payment execution with approved credit',
    timeline: [
      { phase: 'Order Placement', percentage: '10%' },
      { phase: 'Manufacturing', percentage: '40%' },
      { phase: 'Delivery & Installation', percentage: '30%' },
      { phase: 'Post-Completion', percentage: '20%' },
    ],
  },
]

const faqItems: FAQItem[] = [
  {
    question: 'What are the typical payment terms?',
    answer: 'Payment terms vary based on the project size and financing option selected. Typical terms include milestone payments starting at 15-20% deposit, with remaining balance due upon delivery and installation. For larger projects, custom payment schedules can be arranged.',
  },
  {
    question: 'Can Modular Buildings Co help secure financing?',
    answer: 'Yes, we maintain relationships with major financial institutions and can guide you through the financing process. Our team can provide project documentation, cost estimates, and other information needed for loan applications.',
  },
  {
    question: 'Do you offer lease-to-own options?',
    answer: 'Yes, we offer flexible lease programs that can transition to ownership. Our lease options include both operational and financial lease structures, allowing you to evaluate the building before making a final purchase decision.',
  },
  {
    question: 'Are there financing options for government projects?',
    answer: 'Absolutely. We have extensive experience working with government agencies and can facilitate access to government programs, grants, and subsidies. We handle all necessary documentation and compliance requirements.',
  },
  {
    question: 'What is the typical loan approval timeline?',
    answer: 'Loan approval typically takes 4-8 weeks, depending on the bank and project complexity. However, we recommend starting the financing process early. Our team can provide documentation to accelerate the approval process.',
  },
  {
    question: 'Are interest rates competitive?',
    answer: 'Yes, our bank partnerships ensure competitive interest rates. We work with multiple financial institutions, allowing us to find rates and terms that match your budget and project timeline.',
  },
  {
    question: 'Can financing be arranged for international projects?',
    answer: 'Yes, we work with international financial institutions to facilitate financing for projects worldwide. We can connect you with banks that specialize in cross-border project financing.',
  },
  {
    question: 'What happens if the project timeline is delayed?',
    answer: 'We work with you and your financial institution to adjust payment schedules if project timelines change. Communication is key, and we ensure all parties are informed of any timeline modifications.',
  },
]

export default function FinancingPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Financing', href: '/financing' },
  ]

  return (
    <>
      <CategoryBanner
        title="Financing Options"
        backgroundImage={getPlaceholderImage(1920, 400, 'Financing')}
        breadcrumbs={breadcrumbs}
      />

      {/* Introduction Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 font-bold mb-6 text-mb-dark">
                Make Your Project Affordable
              </h2>
              <p className="text-lg text-mb-gray mb-4">
                At Modular Buildings Co, we understand that financing is a critical part of your building project. That's why we offer multiple flexible financing options tailored to your specific needs and budget.
              </p>
              <p className="text-lg text-mb-gray mb-6">
                Whether you're building a single facility or a large-scale development, our partnership with leading financial institutions ensures you have access to competitive rates and flexible terms.
              </p>
              <div className="space-y-3 mb-8">
                {['Competitive interest rates', 'Flexible payment terms', 'Expert guidance', 'Fast approval process'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-mb-warning flex-shrink-0" />
                    <span className="text-mb-gray">{item}</span>
                  </div>
                ))}
              </div>
              <Button variant="primary">
                <a href="/contact">Get Financing Quote</a>
              </Button>
            </div>
            <div className="relative h-96 rounded-mb-lg overflow-hidden">
              <Image
                src={getPlaceholderImage(600, 500, 'Financing Options')}
                alt="Financing Solutions"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Financing Options Grid */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-4 text-mb-dark">
            Financing Solutions
          </h2>
          <p className="text-center text-mb-gray mb-12 max-w-2xl mx-auto">
            Explore our comprehensive financing options designed to fit your project requirements and financial situation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {financingOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-mb-lg p-8 border border-mb-border-gray hover:shadow-lg transition-shadow"
              >
                <div className="text-6xl mb-4">{option.icon}</div>
                <h3 className="text-2xl font-bold text-mb-dark mb-2">
                  {option.name}
                </h3>
                <p className="text-mb-gray mb-6">
                  {option.description}
                </p>
                <ul className="space-y-3">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-mb-warning flex-shrink-0 mt-0.5" />
                      <span className="text-mb-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Plans */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-12 text-mb-dark">
            Flexible Payment Plans
          </h2>

          <div className="space-y-12">
            {paymentPlans.map((plan, planIndex) => (
              <div
                key={planIndex}
                className="bg-mb-bg-light rounded-mb-lg p-8 border border-mb-border-gray"
              >
                <h3 className="text-2xl font-bold text-mb-dark mb-2">
                  {plan.name}
                </h3>
                <p className="text-mb-gray mb-8">
                  {plan.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {plan.timeline.map((phase, phaseIndex) => (
                    <div
                      key={phaseIndex}
                      className="bg-white rounded-mb p-4 border border-mb-border-gray text-center"
                    >
                      <div className="text-3xl font-bold text-mb-warning mb-2">
                        {phase.percentage}
                      </div>
                      <p className="text-sm text-mb-gray">
                        {phase.phase}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-mb-warning/10 rounded-mb-lg border border-mb-warning/30">
            <h3 className="text-xl font-bold text-mb-dark mb-4">
              Custom Payment Plans Available
            </h3>
            <p className="text-mb-gray mb-6">
              Don't see a payment plan that fits your needs? We can create a custom payment schedule tailored specifically to your project timeline, cash flow requirements, and budget constraints.
            </p>
            <Button variant="warning">
              <a href="/contact">Request Custom Plan</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Financing Process */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-12 text-mb-dark">
            Our Financing Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                step: '1',
                title: 'Consultation',
                description: 'Meet with our finance team to discuss your project and financing needs.',
              },
              {
                step: '2',
                title: 'Documentation',
                description: 'We prepare comprehensive project documentation for financial institutions.',
              },
              {
                step: '3',
                title: 'Bank Selection',
                description: 'We match you with suitable banks and facilitate the application process.',
              },
              {
                step: '4',
                title: 'Approval',
                description: 'Work with the bank to finalize terms and secure loan approval.',
              },
              {
                step: '5',
                title: 'Implementation',
                description: 'Project proceeds with agreed payment schedule and financing terms.',
              },
            ].map((process, index) => (
              <div key={index}>
                <div className="bg-white rounded-mb-lg p-6 border-2 border-mb-navy text-center h-full">
                  <div className="w-10 h-10 bg-mb-warning text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    {process.step}
                  </div>
                  <h3 className="font-bold text-mb-dark mb-2">
                    {process.title}
                  </h3>
                  <p className="text-sm text-mb-gray">
                    {process.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Benefits */}
      <ContentBlockSection
        title="Financial Benefits of Modular Construction"
        content={`
          <p className="mb-6">Beyond flexible financing options, choosing Modular Buildings Co provides significant financial advantages throughout your building's lifecycle.</p>

          <h3 className="text-2xl font-bold mb-4">Cost Savings</h3>
          <ul className="list-disc list-inside space-y-3 mb-6">
            <li><strong>40-50% faster construction:</strong> Reduced labor costs and faster project completion mean lower overall financing costs.</li>
            <li><strong>Minimal site disruption:</strong> Lower on-site labor and equipment requirements reduce indirect costs.</li>
            <li><strong>Quality control:</strong> Factory-controlled manufacturing reduces rework and quality issues that add costs.</li>
            <li><strong>Weather independent:</strong> Modular construction is not delayed by weather, reducing timeline risks.</li>
            <li><strong>Energy efficiency:</strong> Our buildings meet strict energy standards, reducing operational costs for decades.</li>
            <li><strong>Reduced waste:</strong> Controlled manufacturing minimizes material waste, improving your environmental ROI.</li>
          </ul>

          <h3 className="text-2xl font-bold mb-4">Long-term Value</h3>
          <p>Modular Buildings Co buildings retain their value and performance over time. The combination of quality construction, durability, and energy efficiency means your investment continues to deliver value long after completion. Many of our buildings from the 1990s are still in use today, proving the lasting value of modular construction.</p>
        `}
        layout="text-only"
        backgroundColor="white"
      />

      {/* FAQ Section */}
      <FAQSection
        questions={faqItems}
        title="Financing FAQ"
        subtitle="Get answers to common financing questions"
        className="bg-mb-bg-light"
      />

      {/* CTA Section */}
      <CTASection
        title="Let's Finance Your Project"
        subtitle="Expert Guidance"
        description="Our financing specialists are ready to help you find the perfect payment plan and secure competitive financing for your building project."
        primaryButton={{
          text: 'Schedule Consultation',
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
