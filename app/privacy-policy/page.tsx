import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Modular Buildings Co',
  description: 'Privacy Policy for Modular Buildings Co. Learn how we collect, use, and protect your personal information.',
}

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title="Privacy Policy"
        backgroundImage={getPlaceholderImage(1920, 400, 'Privacy Policy')}
        breadcrumbs={breadcrumbs}
      />

      {/* Content Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p className="text-mb-gray text-sm mb-8">Last Updated: January 1, 2024</p>

            <h2>Introduction</h2>
            <p>
              Modular Buildings Co (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting
              your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you visit our website modular-buildings.co or use our services.
            </p>

            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul>
              <li>Fill out contact forms or request a quote</li>
              <li>Subscribe to our newsletter</li>
              <li>Create an account on our website</li>
              <li>Contact us via phone, email, or chat</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p>This information may include:</p>
            <ul>
              <li>Name and contact information (email, phone, address)</li>
              <li>Company name and job title</li>
              <li>Project requirements and preferences</li>
              <li>Payment information for transactions</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our website, we may automatically collect certain information about your device
              and browsing activity, including:
            </p>
            <ul>
              <li>IP address and browser type</li>
              <li>Operating system and device information</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring website and search terms</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your inquiries and provide customer service</li>
              <li>Process quotes and orders</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Analyze website usage and trends</li>
              <li>Comply with legal obligations</li>
              <li>Protect against fraud and security threats</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Service providers who assist with our business operations</li>
              <li>Business partners for joint marketing efforts</li>
              <li>Legal authorities when required by law</li>
              <li>Professional advisors (lawyers, accountants, insurers)</li>
              <li>Potential buyers in the event of a business sale or merger</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience on our website. These may include:
            </p>
            <ul>
              <li>Essential cookies for website functionality</li>
              <li>Analytics cookies to understand usage patterns</li>
              <li>Marketing cookies for targeted advertising</li>
            </ul>
            <p>
              You can manage cookie preferences through your browser settings. Note that disabling certain
              cookies may affect website functionality.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. However, no method of
              transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>

            <h2>California Residents</h2>
            <p>
              If you are a California resident, you have additional rights under the California Consumer
              Privacy Act (CCPA), including the right to know what personal information we collect and
              the right to opt out of the sale of personal information.
            </p>

            <h2>Children&apos;s Privacy</h2>
            <p>
              Our website is not intended for children under 13 years of age. We do not knowingly collect
              personal information from children under 13. If we learn we have collected such information,
              we will delete it promptly.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
            </p>

            <h2>Contact Us</h2>
            <p>If you have questions about this Privacy Policy or our privacy practices, please contact us at:</p>
            <p>
              Modular Buildings Co<br />
              123 Industrial Blvd, Suite 100<br />
              Houston, TX 77001<br />
              Email: privacy@modular-buildings.co<br />
              Phone: 1-800-MODULAR (668-8527)
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
