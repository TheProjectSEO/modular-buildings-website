import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Modular Buildings Co',
  description: 'Terms of Service for Modular Buildings Co. Read our terms and conditions for using our website and services.',
}

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Terms of Service', href: '/terms-of-service' },
]

export default function TermsOfServicePage() {
  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title="Terms of Service"
        backgroundImage={getPlaceholderImage(1920, 400, 'Terms of Service')}
        breadcrumbs={breadcrumbs}
      />

      {/* Content Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p className="text-mb-gray text-sm mb-8">Last Updated: January 1, 2024</p>

            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using the Modular Buildings Co website (modular-buildings.co) and our services,
              you agree to be bound by these Terms of Service. If you do not agree with any part of these terms,
              you may not access or use our services.
            </p>

            <h2>Use of Our Services</h2>
            <h3>Eligibility</h3>
            <p>
              You must be at least 18 years old and have the legal capacity to enter into contracts to use
              our services. By using our services, you represent and warrant that you meet these requirements.
            </p>

            <h3>Account Registration</h3>
            <p>
              Some features of our website may require you to create an account. You are responsible for
              maintaining the confidentiality of your account credentials and for all activities that occur
              under your account.
            </p>

            <h3>Acceptable Use</h3>
            <p>You agree not to:</p>
            <ul>
              <li>Use our services for any unlawful purpose</li>
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Interfere with or disrupt our services or servers</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated means to access our website without permission</li>
              <li>Infringe on our intellectual property rights</li>
              <li>Engage in any activity that could harm our reputation</li>
            </ul>

            <h2>Products and Services</h2>
            <h3>Product Information</h3>
            <p>
              We strive to provide accurate product descriptions, specifications, and pricing on our website.
              However, we do not warrant that product information is complete, reliable, current, or error-free.
              We reserve the right to correct any errors and to change or update information at any time.
            </p>

            <h3>Quotes and Orders</h3>
            <p>
              Quotes provided through our website are estimates and may be subject to change based on final
              specifications, site conditions, and other factors. A binding agreement is formed only when
              we issue a formal contract and receive your signed acceptance.
            </p>

            <h3>Pricing</h3>
            <p>
              All prices are subject to change without notice. Quoted prices are valid for the period specified
              in the quote. We reserve the right to refuse or cancel orders in cases of pricing errors.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, images, designs, and software,
              is the property of Modular Buildings Co or our licensors and is protected by intellectual
              property laws. You may not reproduce, distribute, modify, or create derivative works from
              our content without express written permission.
            </p>

            <h2>User Content</h2>
            <p>
              If you submit content to our website (such as project descriptions, photos, or reviews),
              you grant us a non-exclusive, royalty-free, perpetual license to use, reproduce, modify,
              and display that content in connection with our services. You represent that you own or
              have the rights to submit such content.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites or services. We are not responsible
              for the content, privacy policies, or practices of any third-party sites. Your use of
              third-party websites is at your own risk.
            </p>

            <h2>Disclaimers</h2>
            <p>
              OUR WEBSITE AND SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              We do not warrant that our services will be uninterrupted, secure, or error-free, or that
              defects will be corrected. Any reliance on our services is at your own risk.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MODULAR BUILDINGS CO SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED
              TO LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF OUR SERVICES.
            </p>
            <p>
              Our total liability for any claims arising from these terms or your use of our services
              shall not exceed the amount you paid us in the twelve months preceding the claim.
            </p>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Modular Buildings Co and our officers,
              directors, employees, and agents from any claims, damages, losses, or expenses (including
              reasonable attorneys&apos; fees) arising from your use of our services or violation of these terms.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of
              the State of Texas, without regard to its conflict of law provisions. Any legal action
              arising from these terms shall be brought in the state or federal courts located in
              Harris County, Texas.
            </p>

            <h2>Dispute Resolution</h2>
            <p>
              Any disputes arising from these terms or your use of our services shall first be attempted
              to be resolved through informal negotiation. If negotiation fails, disputes shall be resolved
              through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify you of
              material changes by posting the updated terms on our website and updating the &quot;Last Updated&quot;
              date. Your continued use of our services after changes constitutes acceptance of the new terms.
            </p>

            <h2>Severability</h2>
            <p>
              If any provision of these terms is found to be unenforceable, the remaining provisions
              shall continue in full force and effect.
            </p>

            <h2>Entire Agreement</h2>
            <p>
              These Terms of Service, together with our Privacy Policy and any other agreements you
              enter into with us, constitute the entire agreement between you and Modular Buildings Co
              regarding your use of our services.
            </p>

            <h2>Contact Us</h2>
            <p>If you have questions about these Terms of Service, please contact us at:</p>
            <p>
              Modular Buildings Co<br />
              123 Industrial Blvd, Suite 100<br />
              Houston, TX 77001<br />
              Email: legal@modular-buildings.co<br />
              Phone: 1-800-MODULAR (668-8527)
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
