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
  title: 'Installation Services',
  description: 'Professional installation services for Modular Buildings Co buildings. Expert teams ensure perfect site assembly and commissioning for your project.',
}

interface InstallationService {
  name: string
  icon: string
  description: string
  details: string[]
}

const installationServices: InstallationService[] = [
  {
    name: 'Site Preparation',
    icon: '🏗️',
    description: 'Complete site assessment and preparation for modular building installation',
    details: [
      'Site survey and analysis',
      'Foundation design and construction',
      'Utility connections planning',
      'Safety compliance verification',
      'Equipment staging area setup',
    ],
  },
  {
    name: 'Module Delivery',
    icon: '🚚',
    description: 'Secure transport and careful delivery of building modules to your site',
    details: [
      'Specialized transport vehicles',
      'GPS tracking and updates',
      'Insurance coverage included',
      'Route planning optimization',
      'Delivery window coordination',
    ],
  },
  {
    name: 'Module Assembly',
    icon: '🔧',
    description: 'Expert installation and connection of modular components on-site',
    details: [
      'Precise module positioning',
      'Structural connection installation',
      'Quality inspection at each stage',
      'Certified installation teams',
      'Documentation and punch-list',
    ],
  },
  {
    name: 'System Commissioning',
    icon: '⚡',
    description: 'Testing and activation of all building systems and utilities',
    details: [
      'HVAC system testing',
      'Electrical and plumbing verification',
      'Safety system activation',
      'Fire suppression systems check',
      'Building automation setup',
    ],
  },
  {
    name: 'Staff Training',
    icon: '📚',
    description: 'Comprehensive training for building operators and maintenance staff',
    details: [
      'System operation training',
      'Safety procedures',
      'Maintenance best practices',
      'Emergency procedures',
      'Documentation handover',
    ],
  },
  {
    name: 'Post-Installation Support',
    icon: '🛠️',
    description: 'Ongoing support and warranty service after installation is complete',
    details: [
      'Extended warranty options',
      'Maintenance programs',
      '24/7 emergency support',
      'Repair services',
      'System upgrades',
    ],
  },
]

const installationProcess = [
  {
    phase: 'Planning',
    duration: '2-4 weeks',
    activities: [
      'Site visits and surveys',
      'Coordination with local authorities',
      'Foundation design finalization',
      'Safety plan development',
      'Installation schedule creation',
    ],
  },
  {
    phase: 'Preparation',
    duration: '2-6 weeks',
    activities: [
      'Foundation construction',
      'Utility infrastructure setup',
      'Safety barriers installation',
      'Equipment positioning',
      'Final site walkthrough',
    ],
  },
  {
    phase: 'Installation',
    duration: '2-12 weeks',
    activities: [
      'Module delivery and staging',
      'Structural assembly',
      'Connection and fastening',
      'Quality inspections',
      'Completion verification',
    ],
  },
  {
    phase: 'Commissioning',
    duration: '1-2 weeks',
    activities: [
      'System testing',
      'Safety verification',
      'Performance validation',
      'Documentation completion',
      'Handover preparation',
    ],
  },
]

const faqItems: FAQItem[] = [
  {
    question: 'How long does installation typically take?',
    answer: 'Installation timelines vary based on project complexity. Typical installation takes 2-12 weeks from site preparation through final commissioning. Small buildings can be installed in as little as 2 weeks, while large complexes may take 12+ weeks. We provide detailed timelines during the planning phase.',
  },
  {
    question: 'Does Modular Buildings Co handle the entire installation process?',
    answer: 'Yes, Modular Buildings Co provides comprehensive installation services from site preparation through final commissioning. Our certified teams handle all aspects including transportation, assembly, system testing, and staff training.',
  },
  {
    question: 'What if there are site-specific challenges?',
    answer: 'Our experienced installation teams are trained to handle various site conditions and challenges. We conduct thorough site assessments to identify potential issues early and develop customized solutions. We maintain open communication throughout the process.',
  },
  {
    question: 'Are installation costs included in the building price?',
    answer: 'Installation costs vary based on location, site conditions, and project complexity. We provide detailed installation quotes along with building quotations so you have complete transparency on all costs.',
  },
  {
    question: 'What happens if issues arise during installation?',
    answer: 'Quality assurance is built into every step of our installation process. Our teams perform inspections at each stage to identify and address issues immediately. We maintain detailed documentation and conduct final quality verification before handover.',
  },
  {
    question: 'Does Modular Buildings Co provide training after installation?',
    answer: 'Yes, we provide comprehensive staff training covering system operation, maintenance procedures, safety protocols, and emergency procedures. Training is customized based on building type and your team\'s needs.',
  },
  {
    question: 'What warranty and support is available after installation?',
    answer: 'All Modular Buildings Co buildings include standard warranties covering structural and system components. We offer extended warranty options and comprehensive maintenance programs. 24/7 emergency support is available for all buildings.',
  },
  {
    question: 'Can installation be done in phases?',
    answer: 'Yes, for larger projects, we can plan phased installations to match your occupancy needs and budget schedule. Each phase is managed as a separate project with its own timeline and coordination.',
  },
]

export default function InstallationPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Installation', href: '/installation' },
  ]

  return (
    <>
      <CategoryBanner
        title="Installation Services"
        backgroundImage={getPlaceholderImage(1920, 400, 'Installation')}
        breadcrumbs={breadcrumbs}
      />

      {/* Introduction Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 font-bold mb-6 text-mb-dark">
                Expert Installation, Perfect Results
              </h2>
              <p className="text-lg text-mb-gray mb-4">
                The final step in your building project is just as important as the initial design. Modular Buildings Co's certified installation teams bring decades of experience and expertise to ensure your building is assembled precisely, safely, and on schedule.
              </p>
              <p className="text-lg text-mb-gray mb-6">
                From site preparation and module delivery to system commissioning and staff training, we handle every aspect of installation with professional excellence and attention to detail.
              </p>
              <div className="space-y-3 mb-8">
                {['Certified installation teams', 'Comprehensive quality control', 'Transparent timelines', 'Full documentation'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-mb-warning flex-shrink-0" />
                    <span className="text-mb-gray">{item}</span>
                  </div>
                ))}
              </div>
              <Button variant="primary">
                <a href="/contact">Schedule Installation</a>
              </Button>
            </div>
            <div className="relative h-96 rounded-mb-lg overflow-hidden">
              <Image
                src={getPlaceholderImage(600, 500, 'Installation Team')}
                alt="Professional Installation"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Installation Services Grid */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-4 text-mb-dark">
            Our Installation Services
          </h2>
          <p className="text-center text-mb-gray mb-12 max-w-2xl mx-auto">
            Comprehensive services covering every stage of bringing your modular building to life.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {installationServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-mb-lg p-8 border border-mb-border-gray hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-mb-dark mb-2">
                  {service.name}
                </h3>
                <p className="text-mb-gray mb-6 text-sm">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-mb-warning flex-shrink-0 mt-0.5" />
                      <span className="text-mb-gray">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Process Timeline */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-12 text-mb-dark">
            Installation Timeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {installationProcess.map((phase, index) => (
              <div
                key={index}
                className="bg-mb-bg-light rounded-mb-lg p-8 border-2 border-mb-navy relative"
              >
                <div className="text-4xl font-bold text-mb-warning mb-2">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold text-mb-dark mb-2">
                  {phase.phase}
                </h3>
                <p className="text-mb-warning font-semibold text-sm mb-4">
                  Typical Duration: {phase.duration}
                </p>
                <ul className="space-y-2">
                  {phase.activities.map((activity, activityIndex) => (
                    <li key={activityIndex} className="flex items-start gap-2 text-sm">
                      <span className="text-mb-warning">→</span>
                      <span className="text-mb-gray">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-mb-lg overflow-hidden">
              <Image
                src={getPlaceholderImage(600, 500, 'Quality Control')}
                alt="Quality Assurance"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-h2 font-bold mb-6 text-mb-dark">
                Quality Assurance at Every Stage
              </h2>
              <p className="text-lg text-mb-gray mb-6">
                Quality control is not an afterthought—it's woven into every step of the installation process. Our certified teams perform multiple inspections to ensure your building meets our exacting standards.
              </p>

              <div className="space-y-4">
                {[
                  'Daily site inspections and progress checks',
                  'Structural alignment verification with precision tools',
                  'System testing and performance validation',
                  'Safety compliance verification',
                  'Documentation and photo records',
                  'Final walk-through and punch-list completion',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-mb-warning flex-shrink-0 mt-0.5" />
                    <span className="text-mb-gray">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Details */}
      <ContentBlockSection
        title="Our Installation Excellence"
        content={`
          <h3 className="text-2xl font-bold mb-4">Why Modular Buildings Co Installation Is Superior</h3>
          <p className="mb-6">With thousands of installations completed around the world, Modular Buildings Co has refined the process of transforming manufactured modules into functional buildings. Our installation teams combine technical expertise with practical experience.</p>

          <h3 className="text-2xl font-bold mb-4">Site Coordination & Management</h3>
          <p className="mb-6">We provide comprehensive site management that minimizes disruption to surrounding areas and ensures smooth workflows. Our teams coordinate with local authorities, manage safety protocols, and maintain clear communication with all stakeholders throughout the installation process.</p>

          <h3 className="text-2xl font-bold mb-4">Advanced Equipment & Techniques</h3>
          <p className="mb-6">Our installation teams utilize advanced equipment including precision leveling systems, structural monitoring technology, and digital project management tools. These technologies ensure accuracy, efficiency, and complete documentation of the installation process.</p>

          <h3 className="text-2xl font-bold mb-4">Experienced & Certified Teams</h3>
          <p>All Modular Buildings Co installation team members are fully trained and certified. They understand modular construction principles, safety requirements, and quality standards. Many of our installation supervisors have 10+ years of experience with thousands of successful installations.</p>
        `}
        layout="text-only"
        backgroundColor="white"
      />

      {/* FAQ Section */}
      <FAQSection
        questions={faqItems}
        title="Installation FAQ"
        subtitle="Get answers to common installation questions"
        className="bg-mb-bg-light"
      />

      {/* CTA Section */}
      <CTASection
        title="Ready to Install Your Building?"
        subtitle="Expert Installation Teams"
        description="Let our certified installation specialists guide you through the process from site preparation to final commissioning. We're ready to bring your building project to completion."
        primaryButton={{
          text: 'Contact Installation Team',
          href: '/contact',
          variant: 'primary',
        }}
        secondaryButton={{
          text: 'View Completed Projects',
          href: '/projects',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}
