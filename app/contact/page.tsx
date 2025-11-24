import { ContactForm } from '@/components/forms/ContactForm'
import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import { Phone, Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Modular Buildings Co for your prefabricated and modular building needs. We serve 130+ countries worldwide.',
}

export default function ContactPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <CategoryBanner
        title="Contact Us"
        backgroundImage={getPlaceholderImage(1920, 400, 'Contact Us')}
        breadcrumbs={breadcrumbs}
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-h2 font-bold mb-6">Get in Touch</h2>
              <p className="text-mb-gray mb-8">
                Have a question or need a quote? Our team is ready to help you with your prefabricated and modular building project.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-mb-warning/10 rounded-mb">
                    <Phone className="w-6 h-6 text-mb-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-mb-gray">+90 (312) 394 10 20</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-mb-warning/10 rounded-mb">
                    <Mail className="w-6 h-6 text-mb-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-mb-gray">info@modular-buildings.co</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-mb-warning/10 rounded-mb">
                    <MapPin className="w-6 h-6 text-mb-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-mb-gray">
                      Ankara, Turkey
                      <br />
                      Serving 130+ Countries Worldwide
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-mb-bg-light rounded-mb">
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <div className="space-y-1 text-sm text-mb-gray">
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-h2 font-bold mb-6">Send Us a Message</h2>
              <ContactForm sourcePage="/contact" />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (placeholder) */}
      <section className="h-96 bg-gray-200">
        <div className="w-full h-full flex items-center justify-center text-mb-gray">
          Map Placeholder - Integrate Google Maps or Mapbox
        </div>
      </section>
    </>
  )
}
