import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { ContactForm } from '@/components/forms/ContactForm'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import type { Metadata } from 'next'
import { CheckCircle2, Clock, Shield, Phone, Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Request a Quote | Modular Buildings Co',
  description: 'Get a free, no-obligation quote for your modular building project. Our team will provide a customized proposal within 48 hours.',
  openGraph: {
    title: 'Request a Quote | Modular Buildings Co',
    description: 'Get a free, no-obligation quote for your modular building project.',
    images: [getPlaceholderImage(1200, 630, 'Request Quote')],
  },
}

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Request a Quote', href: '/quote' },
]

const benefits = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Fast Response',
    description: 'Receive your customized quote within 48 hours',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: 'No Obligation',
    description: 'Free quotes with no commitment required',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Expert Consultation',
    description: 'Industry specialists review every request',
  },
]

export default function QuotePage() {
  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title="Request a Quote"
        backgroundImage={getPlaceholderImage(1920, 400, 'Quote Banner')}
        breadcrumbs={breadcrumbs}
      />

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Info */}
            <div>
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
                Get Your Free Quote Today
              </h2>
              <p className="text-lg text-mb-gray mb-8">
                Tell us about your project and our team will provide a detailed, customized quote
                within 48 hours. Our experts will work with you to understand your needs and
                recommend the best modular building solution.
              </p>

              {/* Benefits */}
              <div className="space-y-6 mb-10">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-mb-warning rounded-mb flex items-center justify-center text-mb-dark">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-mb-dark mb-1">{benefit.title}</h3>
                      <p className="text-mb-gray">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="bg-mb-bg-light p-6 rounded-mb-lg">
                <h3 className="font-bold text-mb-dark mb-4">Prefer to Talk to Someone?</h3>
                <div className="space-y-3">
                  <a
                    href="tel:1-800-MODULAR"
                    className="flex items-center gap-3 text-mb-gray hover:text-mb-navy transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>1-800-MODULAR (668-8527)</span>
                  </a>
                  <a
                    href="mailto:quotes@modular-buildings.co"
                    className="flex items-center gap-3 text-mb-gray hover:text-mb-navy transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>quotes@modular-buildings.co</span>
                  </a>
                  <div className="flex items-start gap-3 text-mb-gray">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>123 Industrial Blvd, Suite 100<br />Houston, TX 77001</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-mb-bg-light p-8 rounded-mb-lg">
              <h3 className="text-xl font-bold text-mb-dark mb-6">Tell Us About Your Project</h3>
              <ContactForm
                productInterest="General Quote Request"
                sourcePage="/quote"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="py-12 md:py-16 bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-mb-dark mb-4">What Happens Next?</h2>
            <p className="text-lg text-mb-gray max-w-2xl mx-auto">
              Our streamlined process ensures you get the information you need quickly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-mb-navy text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-mb-dark mb-2">Submit Request</h3>
              <p className="text-sm text-mb-gray">Fill out the form with your project details</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-mb-navy text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-mb-dark mb-2">Expert Review</h3>
              <p className="text-sm text-mb-gray">Our specialists analyze your requirements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-mb-navy text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-mb-dark mb-2">Receive Quote</h3>
              <p className="text-sm text-mb-gray">Get a detailed proposal within 48 hours</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-mb-warning text-mb-dark rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-mb-dark mb-2">Consultation</h3>
              <p className="text-sm text-mb-gray">Discuss options with your dedicated rep</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
