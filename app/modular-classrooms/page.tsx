import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { FAQSection, FAQItem } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContactForm } from '@/components/forms/ContactForm'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import {
  GraduationCap,
  Clock,
  Shield,
  Building2,
  CheckCircle,
  Users,
  Zap,
  Award,
  MapPin,
  DollarSign,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Modular Classrooms | Portable Classroom Buildings | Modular Buildings Co',
  description:
    'Premium modular classrooms and portable classroom buildings for schools, universities, and educational institutions. Fast delivery, customizable designs, and code-compliant construction.',
  openGraph: {
    title: 'Modular Classrooms | Modular Buildings Co',
    description:
      'High-quality modular classroom solutions for educational institutions. Quick deployment and full customization available.',
    images: [getPlaceholderImage(1200, 630, 'Modular Classrooms')],
  },
}

const classroomTypes = [
  {
    slug: 'single',
    name: 'Single Classrooms',
    description:
      'Individual modular classroom units perfect for temporary space needs or permanent additions.',
    image: getPlaceholderImage(400, 300, 'Single Classroom'),
    capacity: '20-35 students',
    size: '720-960 sq ft',
  },
  {
    slug: 'double-wide',
    name: 'Double-Wide Classrooms',
    description:
      'Spacious double-wide modular classrooms offering expanded learning space and flexibility.',
    image: getPlaceholderImage(400, 300, 'Double Wide'),
    capacity: '35-50 students',
    size: '1,440-1,920 sq ft',
  },
  {
    slug: 'multi-complexes',
    name: 'Multi-Classroom Complexes',
    description:
      'Connected modular classroom buildings with multiple rooms, hallways, and shared facilities.',
    image: getPlaceholderImage(400, 300, 'Multi Complex'),
    capacity: '100+ students',
    size: '3,000+ sq ft',
  },
  {
    slug: 'restrooms',
    name: 'Classrooms with Restrooms',
    description:
      'Self-contained classroom units featuring integrated ADA-compliant restroom facilities.',
    image: getPlaceholderImage(400, 300, 'With Restrooms'),
    capacity: '25-40 students',
    size: '900-1,200 sq ft',
  },
  {
    slug: 'kitchens',
    name: 'Classrooms with Kitchens',
    description:
      'Specialized classroom modules equipped with kitchen facilities for culinary arts and home economics.',
    image: getPlaceholderImage(400, 300, 'With Kitchen'),
    capacity: '20-30 students',
    size: '1,000-1,400 sq ft',
  },
]

const keyFeatures = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Rapid Deployment',
    description:
      'Factory-built modules can be installed in weeks, not months, minimizing disruption to school operations.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Code Compliant',
    description:
      'All classrooms meet IBC, ADA, and state educational facility requirements with full certification.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Quality Construction',
    description:
      'Premium materials and factory-controlled manufacturing ensure consistent, superior quality.',
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: 'Full Customization',
    description:
      'Customize layouts, finishes, technology integration, and features to match your educational needs.',
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: 'Cost Effective',
    description:
      'Save 20-40% compared to traditional construction with reduced labor and material waste.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Energy Efficient',
    description:
      'High-performance insulation, LED lighting, and efficient HVAC systems reduce operating costs.',
  },
]

const applications = [
  {
    name: 'K-12 Schools',
    description:
      'Permanent or temporary classroom additions for elementary, middle, and high schools facing enrollment growth.',
    imageUrl: getPlaceholderImage(600, 400, 'K-12 Schools'),
  },
  {
    name: 'Universities & Colleges',
    description:
      'Flexible classroom and lecture hall solutions for higher education institutions and campus expansions.',
    imageUrl: getPlaceholderImage(600, 400, 'Universities'),
  },
  {
    name: 'Charter Schools',
    description:
      'Quick-deploy educational facilities for new charter schools needing immediate classroom space.',
    imageUrl: getPlaceholderImage(600, 400, 'Charter Schools'),
  },
  {
    name: 'Training Centers',
    description:
      'Corporate training facilities and vocational education centers with specialized equipment needs.',
    imageUrl: getPlaceholderImage(600, 400, 'Training Centers'),
  },
]

const faqs: FAQItem[] = [
  {
    question: 'How long does it take to install a modular classroom?',
    answer:
      'Standard modular classrooms can be manufactured in 4-8 weeks and installed on-site in just 1-3 days. The entire process from order to occupancy typically takes 6-12 weeks, which is significantly faster than traditional construction that can take 12-18 months.',
  },
  {
    question: 'Are modular classrooms safe and durable?',
    answer:
      'Yes, absolutely. Our modular classrooms are built to meet or exceed all applicable building codes including IBC (International Building Code), state educational facility standards, and ADA accessibility requirements. They feature steel frames, fire-resistant materials, and are engineered to withstand local weather conditions including high winds and seismic activity.',
  },
  {
    question: 'Can modular classrooms be customized to our school needs?',
    answer:
      'We offer extensive customization options including classroom size and layout, interior finishes (flooring, walls, ceilings), HVAC systems, electrical and technology infrastructure, window and door configurations, restroom facilities, and ADA accessibility features. Our design team works closely with your school to create the ideal learning environment.',
  },
  {
    question: 'What is the lifespan of a modular classroom?',
    answer:
      'With proper maintenance, modular classrooms can last 30+ years. Many of our units have been in continuous educational use for over 25 years. The buildings are constructed with the same quality materials as permanent structures and can be relocated if needed.',
  },
  {
    question: 'Do modular classrooms require special permits?',
    answer:
      'Yes, modular classrooms require building permits just like traditional construction. However, we handle all permit applications and inspections as part of our turnkey service. Our team has experience working with school districts and local building departments across all 50 states.',
  },
  {
    question: 'What technology can be integrated into modular classrooms?',
    answer:
      'Our classrooms can be equipped with complete technology infrastructure including high-speed internet connectivity, interactive whiteboards, projection systems, computer lab setups, integrated audio systems, security cameras, and smart classroom controls. We work with your IT department to ensure seamless integration.',
  },
  {
    question: 'Are financing options available for modular classrooms?',
    answer:
      'Yes, we offer multiple financing options including lease-to-own programs, traditional financing, and rental agreements. Many school districts use bond financing or capital improvement funds. We can help you navigate the financing process and find the best solution for your budget.',
  },
  {
    question: 'Can modular classrooms be relocated in the future?',
    answer:
      'One of the major advantages of modular construction is relocatability. If your educational needs change, modular classrooms can be disassembled and moved to a new location. This flexibility makes them ideal for schools with fluctuating enrollment or districts with changing facility needs.',
  },
]

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Modular Classrooms', href: '/modular-classrooms' },
]

export default function ModularClassroomsPage() {
  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title="Modular Classrooms"
        backgroundImage={getPlaceholderImage(1920, 400, 'Modular Classrooms')}
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
                Premium Modular Classroom Solutions for Education
              </h2>
              <p className="text-lg text-mb-gray mb-6">
                Modular Buildings Co delivers high-quality modular classrooms that meet the demanding
                requirements of modern education. Whether you need temporary space during
                renovations, permanent classroom additions, or complete school facilities, our
                modular solutions provide fast deployment, superior quality, and exceptional value.
              </p>
              <p className="text-lg text-mb-gray mb-8">
                With over 25 years of experience in modular construction, we have successfully
                delivered thousands of educational facilities to schools, universities, and training
                centers across the country. Our commitment to quality, innovation, and customer
                satisfaction makes us the trusted choice for educational modular buildings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-mb-navy text-white font-semibold rounded-mb hover:bg-mb-navy/90 transition-colors"
                >
                  Request a Quote
                </Link>
                <Link
                  href="#types"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-mb-navy text-mb-navy font-semibold rounded-mb hover:bg-mb-navy hover:text-white transition-colors"
                >
                  Explore Options
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src={getPlaceholderImage(800, 600, 'Modern Classroom')}
                alt="Modern modular classroom interior"
                width={800}
                height={600}
                className="rounded-mb-lg shadow-mb-hover"
              />
              <div className="absolute -bottom-6 -left-6 bg-mb-warning text-white p-6 rounded-mb-lg hidden md:block">
                <div className="text-3xl font-bold">25+</div>
                <div className="text-sm">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classroom Types Section */}
      <section id="types" className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Modular Classroom Types
            </h2>
            <p className="text-lg text-mb-gray max-w-3xl mx-auto">
              Choose from our range of modular classroom configurations designed to meet diverse
              educational needs and space requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classroomTypes.map((type) => (
              <Link
                key={type.slug}
                href={`/modular-classrooms/${type.slug}`}
                className="group bg-white rounded-mb-lg overflow-hidden border border-mb-border-gray hover:shadow-mb-hover transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={type.image}
                    alt={type.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-mb-dark mb-2 group-hover:text-mb-navy transition-colors">
                    {type.name}
                  </h3>
                  <p className="text-mb-gray mb-4">{type.description}</p>
                  <div className="flex items-center gap-4 text-sm text-mb-gray">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{type.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span>{type.size}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="section-padding bg-mb-navy text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold mb-4">
              Why Choose Modular Buildings Co Modular Classrooms?
            </h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Our modular classrooms combine innovative construction methods with quality materials
              to deliver exceptional educational spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6 hover:bg-white/15 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-mb-warning rounded-mb flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src={getPlaceholderImage(800, 600, 'Classroom Benefits')}
                alt="Students in modular classroom"
                width={800}
                height={600}
                className="rounded-mb-lg"
              />
            </div>
            <div>
              <h2 className="text-h2 font-bold text-mb-dark mb-6">
                Benefits of Modular Classrooms
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-mb-dark">Faster Construction Timeline</h3>
                    <p className="text-mb-gray">
                      Get your classroom operational in 6-12 weeks instead of 12-18 months with
                      traditional construction.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-mb-dark">Reduced Site Disruption</h3>
                    <p className="text-mb-gray">
                      Minimal on-site construction means students and staff can continue with
                      minimal interruption.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-mb-dark">Consistent Quality</h3>
                    <p className="text-mb-gray">
                      Factory-controlled manufacturing ensures every unit meets our strict quality
                      standards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-mb-dark">Flexible & Expandable</h3>
                    <p className="text-mb-gray">
                      Easily add more classrooms as enrollment grows or reconfigure spaces as needs
                      change.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-mb-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-mb-dark">Sustainable Building</h3>
                    <p className="text-mb-gray">
                      Reduced material waste, energy-efficient systems, and recyclable components
                      minimize environmental impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Educational Applications
            </h2>
            <p className="text-lg text-mb-gray max-w-3xl mx-auto">
              Our modular classrooms serve diverse educational settings from K-12 schools to
              universities and corporate training centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {applications.map((application, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-mb-lg border border-mb-border-gray hover:shadow-mb-hover transition-all duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={application.imageUrl}
                    alt={application.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mb-dark/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{application.name}</h3>
                    <p className="text-sm opacity-90">{application.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        questions={faqs}
        title="Frequently Asked Questions About Modular Classrooms"
        subtitle="Find answers to common questions about our modular classroom solutions"
        className="bg-white"
      />

      {/* Contact Form Section */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-bold text-mb-dark mb-4">
                Request a Modular Classroom Quote
              </h2>
              <p className="text-lg text-mb-gray">
                Tell us about your project and our education specialists will provide a detailed
                quote within 24 hours.
              </p>
            </div>
            <div className="bg-white p-8 md:p-12 rounded-mb-lg shadow-mb">
              <ContactForm
                productInterest="Modular Classrooms"
                sourcePage="/modular-classrooms"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Transform Your Educational Space?"
        subtitle="Get Started Today"
        description="Contact our education specialists to discuss your modular classroom project. We provide free consultations and detailed quotes."
        primaryButton={{
          text: 'Request a Quote',
          href: '/contact?inquiry=modular-classrooms',
          variant: 'primary',
        }}
        secondaryButton={{
          text: 'Call Us Now',
          href: 'tel:+905376563068',
          variant: 'outline',
        }}
        variant="contained"
        backgroundColor="navy"
      />
    </>
  )
}
