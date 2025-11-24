import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { ContentBlockSection } from '@/components/sections/ContentBlockSection'
import { FAQSection, type FAQItem } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Modular Buildings Co',
  description: 'Learn about Modular Buildings Co, a global leader in prefabricated and modular building solutions since 1995. Our mission is to revolutionize construction.',
}

export default function AboutPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]

  const faqItems: FAQItem[] = [
    {
      question: 'When was Modular Buildings Co founded?',
      answer: 'Modular Buildings Co was established in 1995, with over 25 years of experience in designing and manufacturing prefabricated and modular buildings. We have grown to become a trusted partner for construction solutions across 130+ countries worldwide.',
    },
    {
      question: 'What countries does Modular Buildings Co serve?',
      answer: 'Modular Buildings Co serves customers in over 130 countries across Europe, Asia, Africa, the Middle East, and the Americas. Our global network includes distribution centers, partner networks, and manufacturing facilities to ensure rapid and efficient service delivery.',
    },
    {
      question: 'What certifications does Modular Buildings Co hold?',
      answer: 'Modular Buildings Co holds multiple international certifications including ISO 9001 (Quality Management), ISO 14001 (Environmental Management), and CE compliance for European markets. Our facilities meet strict international building codes and standards.',
    },
    {
      question: 'How many projects has Modular Buildings Co completed?',
      answer: 'Since our inception, Modular Buildings Co has successfully completed thousands of projects, ranging from small residential units to large-scale commercial complexes. Each project demonstrates our commitment to quality, innovation, and customer satisfaction.',
    },
    {
      question: 'Does Modular Buildings Co offer custom design solutions?',
      answer: 'Yes, we offer fully customizable solutions tailored to your specific needs. Our engineering team works closely with clients to design buildings that meet exact requirements while maintaining cost-efficiency and quality standards.',
    },
    {
      question: 'What is Modular Buildings Co\'s environmental commitment?',
      answer: 'Modular Buildings Co is committed to sustainable construction practices. We use eco-friendly materials, optimize energy efficiency in our designs, and minimize waste during manufacturing. Our modular approach inherently reduces construction waste and site disruption.',
    },
  ]

  return (
    <>
      <CategoryBanner
        title="About Modular Buildings Co"
        backgroundImage={getPlaceholderImage(1920, 400, 'About Modular Buildings Co')}
        breadcrumbs={breadcrumbs}
      />

      {/* Company Overview Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 font-bold mb-6 text-mb-dark">
                Global Leader in Modular Construction
              </h2>
              <p className="text-lg text-mb-gray mb-4">
                Since 1995, Modular Buildings Co has been at the forefront of prefabricated and modular building innovation. What started as a local manufacturer has evolved into a global enterprise serving customers across 130+ countries.
              </p>
              <p className="text-lg text-mb-gray mb-6">
                We believe that construction should be faster, safer, and more sustainable. Our modular approach revolutionizes the building industry by reducing timelines by 40-50% while maintaining the highest quality standards.
              </p>
              <div className="flex gap-4">
                <Button variant="primary">
                  <a href="/contact">Request a Quote</a>
                </Button>
                <Button variant="outline">
                  <a href="/projects">View Our Projects</a>
                </Button>
              </div>
            </div>
            <div className="relative h-96 rounded-mb-lg overflow-hidden">
              <Image
                src={getPlaceholderImage(600, 500, 'Modular Buildings Co Facility')}
                alt="Modular Buildings Co Manufacturing Facility"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="p-8 bg-white rounded-mb-lg border border-mb-border-gray">
              <div className="text-4xl font-bold text-mb-warning mb-4">
                Our Mission
              </div>
              <p className="text-lg text-mb-gray leading-relaxed">
                To revolutionize the global construction industry by providing innovative, sustainable, and cost-effective prefabricated and modular building solutions that transform how people live and work.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 bg-white rounded-mb-lg border border-mb-border-gray">
              <div className="text-4xl font-bold text-mb-navy mb-4">
                Our Vision
              </div>
              <p className="text-lg text-mb-gray leading-relaxed">
                To be the world's most trusted and innovative modular building company, recognized for delivering superior quality, sustainability, and customer value in every project we undertake.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-12 text-mb-dark">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Quality',
                description: 'We maintain the highest standards in every product and service, exceeding customer expectations consistently.',
                icon: '✓',
              },
              {
                title: 'Innovation',
                description: 'We continuously invest in R&D to develop cutting-edge solutions for modern construction challenges.',
                icon: '⚡',
              },
              {
                title: 'Sustainability',
                description: 'We prioritize eco-friendly practices and materials, reducing environmental impact without compromising performance.',
                icon: '🌱',
              },
              {
                title: 'Customer Focus',
                description: 'We listen to our customers and deliver customized solutions that exceed their needs and budgets.',
                icon: '👥',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="p-6 bg-mb-bg-light rounded-mb-lg border border-mb-border-gray text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-mb-dark">
                  {value.title}
                </h3>
                <p className="text-mb-gray">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company History Timeline */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-12 text-mb-dark">
            Our Journey
          </h2>
          <div className="max-w-4xl mx-auto">
            {[
              {
                year: '1995',
                title: 'Founded in Turkey',
                description: 'Modular Buildings Co is established in Ankara, Turkey, beginning our mission to revolutionize construction with prefabricated solutions.',
              },
              {
                year: '2005',
                title: 'International Expansion',
                description: 'We expand operations across Europe and the Middle East, establishing our first international manufacturing facilities.',
              },
              {
                year: '2010',
                title: 'Global Recognition',
                description: 'Modular Buildings Co becomes the preferred choice for major construction projects across Asia, Africa, and the Americas.',
              },
              {
                year: '2015',
                title: 'Innovation & Sustainability',
                description: 'We achieve ISO 14001 certification and introduce our eco-friendly product line, reducing environmental impact.',
              },
              {
                year: '2020',
                title: 'Digital Transformation',
                description: 'We implement advanced digital tools and IoT systems for enhanced production efficiency and customer experience.',
              },
              {
                year: '2024',
                title: 'Global Leader',
                description: 'Modular Buildings Co now serves 130+ countries with thousands of completed projects, maintaining our position as industry pioneers.',
              },
            ].map((milestone, index) => (
              <div key={index} className="flex gap-8 mb-8 last:mb-0">
                <div className="flex-shrink-0 text-center">
                  <div className="w-24 h-24 bg-mb-warning rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {milestone.year}
                    </span>
                  </div>
                </div>
                <div className="flex-grow pt-4">
                  <h3 className="text-xl font-bold text-mb-dark mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-mb-gray">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="section-padding bg-mb-navy text-white">
        <div className="container-custom">
          <h2 className="text-h2 font-bold text-center mb-12">
            By The Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '25+', label: 'Years of Experience' },
              { number: '130+', label: 'Countries Served' },
              { number: '5000+', label: 'Projects Completed' },
              { number: '99%', label: 'Customer Satisfaction' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 border border-white/20 rounded-mb-lg">
                <div className="text-5xl font-bold text-mb-warning mb-3">
                  {stat.number}
                </div>
                <p className="text-lg opacity-90">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Modular Buildings Co */}
      <ContentBlockSection
        title="Why Choose Modular Buildings Co?"
        content={`
          <h3 className="text-2xl font-bold mb-4">We Offer More Than Just Buildings</h3>
          <ul className="list-disc list-inside space-y-3 mb-6">
            <li><strong>Speed of Construction:</strong> Our modular approach reduces project timelines by 40-50% compared to traditional construction methods.</li>
            <li><strong>Quality Assurance:</strong> Every component is manufactured in controlled environments with rigorous quality checks, ensuring superior durability and safety.</li>
            <li><strong>Cost Efficiency:</strong> Factory-controlled manufacturing minimizes waste and reduces labor costs, providing better value for your investment.</li>
            <li><strong>Sustainability:</strong> We prioritize eco-friendly materials and processes, with modular designs that reduce environmental impact throughout the building lifecycle.</li>
            <li><strong>Customization:</strong> Our experienced engineering team delivers fully customized solutions tailored to your specific project requirements.</li>
            <li><strong>Global Support:</strong> With operations in multiple countries, we provide reliable support and maintenance services wherever you build.</li>
          </ul>
          <p>Whether you're building schools, offices, hospitals, or residential complexes, Modular Buildings Co combines proven expertise with innovative solutions to deliver projects on time and on budget.</p>
        `}
        layout="text-only"
        backgroundColor="white"
      />

      {/* FAQ Section */}
      <FAQSection
        questions={faqItems}
        title="Frequently Asked Questions"
        subtitle="Learn more about Modular Buildings Co and our commitment to excellence"
        className="bg-mb-bg-light"
      />

      {/* CTA Section */}
      <CTASection
        title="Ready to Build Your Next Project?"
        subtitle="Let's Work Together"
        description="Contact our team today to discuss your prefabricated or modular building project. We'll provide expert guidance and a customized solution that meets your needs."
        primaryButton={{
          text: 'Get a Free Quote',
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
