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
  title: 'Careers at Modular Buildings Co',
  description: 'Join our growing team at Modular Buildings Co. Explore career opportunities in engineering, manufacturing, sales, and more. Build your future with us.',
}

interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract'
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead'
}

interface Benefit {
  icon: string
  title: string
  description: string
}

const jobOpenings: JobOpening[] = [
  {
    id: '1',
    title: 'Senior Structural Engineer',
    department: 'Engineering',
    location: 'Ankara, Turkey',
    type: 'Full-time',
    level: 'Senior',
  },
  {
    id: '2',
    title: 'Manufacturing Operations Manager',
    department: 'Operations',
    location: 'Ankara, Turkey',
    type: 'Full-time',
    level: 'Senior',
  },
  {
    id: '3',
    title: 'Account Executive - Europe',
    department: 'Sales',
    location: 'London, UK',
    type: 'Full-time',
    level: 'Mid',
  },
  {
    id: '4',
    title: 'Product Design Engineer',
    department: 'Engineering',
    location: 'Istanbul, Turkey',
    type: 'Full-time',
    level: 'Mid',
  },
  {
    id: '5',
    title: 'Installation Supervisor',
    department: 'Operations',
    location: 'Multiple Locations',
    type: 'Full-time',
    level: 'Mid',
  },
  {
    id: '6',
    title: 'Quality Assurance Technician',
    department: 'Quality',
    location: 'Ankara, Turkey',
    type: 'Full-time',
    level: 'Entry',
  },
]

const benefits: Benefit[] = [
  {
    icon: '💼',
    title: 'Competitive Compensation',
    description: 'Attractive salary and benefits package competitive with industry standards.',
  },
  {
    icon: '🏫',
    title: 'Professional Development',
    description: 'Continuous learning opportunities, certifications, and career advancement paths.',
  },
  {
    icon: '⏰',
    title: 'Flexible Work',
    description: 'Flexible working arrangements and work-life balance initiatives.',
  },
  {
    icon: '🏥',
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance, fitness programs, and wellness initiatives.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Family Benefits',
    description: 'Parental leave, childcare support, and family-friendly policies.',
  },
  {
    icon: '🌍',
    title: 'International Exposure',
    description: 'Opportunities to work on projects across 130+ countries worldwide.',
  },
]

const departments = [
  {
    name: 'Engineering',
    icon: '🏗️',
    description: 'Design and develop innovative building solutions',
    roles: ['Structural Engineers', 'CAD Specialists', 'Product Designers', 'Sustainability Engineers'],
  },
  {
    name: 'Manufacturing',
    icon: '🏭',
    description: 'Lead production of quality building components',
    roles: ['Production Managers', 'Machine Operators', 'Quality Technicians', 'Logistics Coordinators'],
  },
  {
    name: 'Sales & Business Development',
    icon: '📈',
    description: 'Drive business growth and customer relationships',
    roles: ['Account Executives', 'Business Developers', 'Project Managers', 'Customer Support'],
  },
  {
    name: 'Operations & Installation',
    icon: '🔧',
    description: 'Deliver projects on time and on budget',
    roles: ['Installation Supervisors', 'Site Managers', 'Safety Officers', 'Equipment Technicians'],
  },
]

const faqItems: FAQItem[] = [
  {
    question: 'What is it like to work at Modular Buildings Co?',
    answer: 'Modular Buildings Co is a dynamic, innovative company with a global presence. We foster a collaborative culture where employees from diverse backgrounds contribute to exciting projects. Our team values innovation, quality, and continuous improvement. With operations across 130+ countries, we offer exposure to international projects and diverse career opportunities.',
  },
  {
    question: 'What are the main career paths at Modular Buildings Co?',
    answer: 'Modular Buildings Co offers career opportunities across engineering, manufacturing, sales, operations, quality assurance, finance, and human resources. Within each department, there are clear advancement paths from entry-level positions to senior leadership roles. We support professional development and internal mobility.',
  },
  {
    question: 'Do you offer internship programs?',
    answer: 'Yes, we offer internship programs for students and recent graduates. Internships provide valuable experience in real-world projects and help develop professional skills. We actively recruit high-performing interns for full-time positions. Contact our HR department for internship opportunities.',
  },
  {
    question: 'What qualifications are typically required?',
    answer: 'Required qualifications vary by position. Engineering roles typically require relevant degrees (civil, mechanical, architectural engineering). Sales roles need strong communication skills and industry knowledge. We value practical experience and certifications as much as formal education. Specific requirements are listed in job postings.',
  },
  {
    question: 'Does Modular Buildings Co support continuing education?',
    answer: 'Absolutely. We invest in employee development through training programs, certification support, and tuition reimbursement for relevant degrees. We encourage employees to pursue professional certifications (PE, LEED, PMP, etc.) and provide paid time for professional development.',
  },
  {
    question: 'Are there opportunities for international assignments?',
    answer: 'Yes, with operations in multiple countries and projects worldwide, we regularly offer international assignment opportunities for experienced employees. These assignments provide valuable experience and professional growth.',
  },
  {
    question: 'What is the application and hiring timeline?',
    answer: 'Application timelines vary by position and urgency. Typically, the hiring process takes 4-8 weeks from application to offer. We conduct initial phone screenings, technical interviews, and in-person meetings. We keep candidates informed throughout the process.',
  },
  {
    question: 'How can I apply for a position at Modular Buildings Co?',
    answer: 'You can apply through our careers page using our online application system. Submit your resume, cover letter, and relevant certifications. You can also reach out directly to our HR department at careers@modular-buildings.co with your information.',
  },
]

export default function CareersPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Careers', href: '/careers' },
  ]

  return (
    <>
      <CategoryBanner
        title="Careers at Modular Buildings Co"
        backgroundImage={getPlaceholderImage(1920, 400, 'Careers')}
        breadcrumbs={breadcrumbs}
      />

      {/* Introduction Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 font-bold mb-6 text-mb-dark">
                Build Your Career With Us
              </h2>
              <p className="text-lg text-mb-gray mb-4">
                At Modular Buildings Co, we're not just building prefabricated and modular buildings—we're building careers. We believe our people are our greatest asset, and we're committed to fostering a workplace where talented individuals can grow, innovate, and make a meaningful impact.
              </p>
              <p className="text-lg text-mb-gray mb-6">
                With operations across 130+ countries and thousands of employees worldwide, Modular Buildings Co offers diverse career opportunities for engineers, builders, innovators, and business professionals. Join us and be part of a company transforming the construction industry.
              </p>
              <div className="space-y-3 mb-8">
                {['Global opportunities', 'Innovation-focused culture', 'Continuous learning', 'Competitive benefits'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-mb-warning flex-shrink-0" />
                    <span className="text-mb-gray">{item}</span>
                  </div>
                ))}
              </div>
              <Button variant="primary">
                <a href="#open-positions">Browse Open Positions</a>
              </Button>
            </div>
            <div className="relative h-96 rounded-mb-lg overflow-hidden">
              <Image
                src={getPlaceholderImage(600, 500, 'Modular Buildings Co Team')}
                alt="Modular Buildings Co Team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Modular Buildings Co */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-12 text-mb-dark">
            Why Choose Modular Buildings Co?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-mb-lg p-8 border border-mb-border-gray hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-mb-dark mb-3">
                  {benefit.title}
                </h3>
                <p className="text-mb-gray">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-12 text-mb-dark">
            Explore Our Departments
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-mb-bg-light rounded-mb-lg p-8 border border-mb-border-gray hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{dept.icon}</div>
                <h3 className="text-2xl font-bold text-mb-dark mb-2">
                  {dept.name}
                </h3>
                <p className="text-mb-gray mb-6">
                  {dept.description}
                </p>
                <p className="font-semibold text-mb-dark mb-3">Key Roles:</p>
                <ul className="space-y-2">
                  {dept.roles.map((role, roleIndex) => (
                    <li key={roleIndex} className="flex items-start gap-2 text-sm">
                      <span className="text-mb-warning">→</span>
                      <span className="text-mb-gray">{role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding bg-mb-bg-light" id="open-positions">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-4 text-mb-dark">
            Open Positions
          </h2>
          <p className="text-center text-mb-gray mb-12 max-w-2xl mx-auto">
            Join our team! Below are current openings. For more positions or to submit a general application, contact careers@modular-buildings.co
          </p>

          <div className="space-y-4">
            {jobOpenings.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-mb-lg p-6 border border-mb-border-gray hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-mb-dark mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-mb-gray">
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">{job.department}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        📍 {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        Level: {job.level}
                      </span>
                    </div>
                  </div>
                  <Button variant="primary">
                    <a href="/contact">Apply Now</a>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 p-8 bg-white rounded-mb-lg border border-mb-border-gray">
            <h3 className="text-xl font-bold text-mb-dark mb-3">
              Don't See Your Role?
            </h3>
            <p className="text-mb-gray mb-6">
              We're always looking for talented individuals. Submit your resume and let us know how you can contribute to Modular Buildings Co's mission.
            </p>
            <Button variant="outline">
              <a href="/contact">Submit Your Resume</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <ContentBlockSection
        title="Our Company Culture"
        content={`
          <h3 className="text-2xl font-bold mb-4">A Culture of Innovation & Excellence</h3>
          <p className="mb-6">At Modular Buildings Co, we cultivate a workplace where creativity thrives, collaboration is valued, and every voice is heard. Our culture is built on innovation, quality, and mutual respect.</p>

          <h3 className="text-2xl font-bold mb-4">Our Core Beliefs</h3>
          <ul className="list-disc list-inside space-y-3 mb-6">
            <li><strong>Innovation:</strong> We encourage creative thinking and welcome new ideas that improve our products and processes.</li>
            <li><strong>Quality:</strong> Excellence is not optional—it's embedded in everything we do.</li>
            <li><strong>Collaboration:</strong> Our diverse teams work together to achieve ambitious goals.</li>
            <li><strong>Integrity:</strong> We conduct business ethically and transparently, building trust with customers and colleagues.</li>
            <li><strong>Continuous Improvement:</strong> We learn from experience and constantly seek to improve our methods.</li>
            <li><strong>Social Responsibility:</strong> We care about our communities and our environment.</li>
          </ul>

          <h3 className="text-2xl font-bold mb-4">Work-Life Balance</h3>
          <p>We believe happy, healthy employees do their best work. We offer flexible working arrangements, remote work options where appropriate, and encourage employees to maintain a healthy work-life balance. Our wellness programs support physical and mental health.</p>
        `}
        layout="text-only"
        backgroundColor="white"
      />

      {/* FAQ Section */}
      <FAQSection
        questions={faqItems}
        title="Careers FAQ"
        subtitle="Get answers to questions about working at Modular Buildings Co"
        className="bg-mb-bg-light"
      />

      {/* CTA Section */}
      <CTASection
        title="Ready to Join Our Team?"
        subtitle="Build Your Future"
        description="Explore opportunities at Modular Buildings Co and become part of a global company transforming the construction industry at Modular Buildings Co. Apply now or submit your resume."
        primaryButton={{
          text: 'Browse Positions',
          href: '#open-positions',
          variant: 'primary',
        }}
        secondaryButton={{
          text: 'Contact HR',
          href: '/contact',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}
