/**
 * MODULAR BUILDINGS CO WEBSITE - SECTION COMPONENTS EXAMPLES
 *
 * This file contains comprehensive examples of all section components
 * showing different use cases and configurations.
 *
 * Copy and paste these examples into your pages as needed.
 */

import {
  FAQSection,
  ContentBlockSection,
  InternalLinksSection,
  CTASection,
  BreadcrumbsComponent,
  SpecificationsTable
} from '@/components/sections'

// =============================================================================
// EXAMPLE 1: Product Detail Page Layout
// =============================================================================

export function ProductDetailPageExample() {
  return (
    <>
      {/* Breadcrumbs */}
      <BreadcrumbsComponent
        items={[
          { label: "Products", href: "/products" },
          { label: "Modular Buildings", href: "/products/modular-buildings" },
          { label: "Modern Office 120m²", href: "/products/modern-office-120" }
        ]}
      />

      {/* Product Specifications */}
      <SpecificationsTable
        title="Technical Specifications"
        variant="grouped"
        specifications={[
          {
            groupName: "Dimensions",
            specs: [
              { label: "Total Area", value: "120", unit: "m²" },
              { label: "Length", value: "12", unit: "m" },
              { label: "Width", value: "10", unit: "m" },
              { label: "Height", value: "3", unit: "m" }
            ]
          },
          {
            groupName: "Construction",
            specs: [
              { label: "Frame Material", value: "Steel Structure" },
              { label: "Wall Panels", value: "EPS Sandwich Panel" },
              { label: "Floor Count", value: "Single Story" },
              { label: "Completion Time", value: "30", unit: "days" }
            ]
          },
          {
            groupName: "Features",
            specs: [
              { label: "Insulation", value: "100mm EPS" },
              { label: "Windows", value: "PVC Double Glazed" },
              { label: "Fire Rating", value: "Class A" },
              { label: "Energy Rating", value: "A+" }
            ]
          }
        ]}
      />

      {/* Content About Product */}
      <ContentBlockSection
        title="Why Choose This Modular Office?"
        content={`
          <p>Our 120m² modular office building is the perfect solution for modern businesses.
          Built with high-quality materials and designed for maximum efficiency, this office
          space can be delivered and installed in just 30 days.</p>
          <p>The steel frame construction ensures durability, while the EPS sandwich panels
          provide excellent insulation and energy efficiency. With A+ energy rating, you'll
          save on heating and cooling costs year-round.</p>
        `}
        layout="image-right"
        image={{
          url: "/images/products/office-interior.jpg",
          alt: "Modern office interior"
        }}
        backgroundColor="light"
      />

      {/* FAQ Section */}
      <FAQSection
        title="Common Questions About This Product"
        questions={[
          {
            question: "How long does delivery and installation take?",
            answer: "<p>The complete process takes approximately 30 days from order confirmation to final installation. This includes manufacturing, transportation, and on-site assembly.</p>"
          },
          {
            question: "What foundation is required?",
            answer: "<p>A simple concrete slab foundation is required. We provide detailed foundation plans with your order, and installation can be completed by local contractors.</p>"
          },
          {
            question: "Can the building be customized?",
            answer: "<p>Yes! We offer various customization options including interior layout, finishes, colors, and additional features. Contact our team to discuss your specific requirements.</p>"
          },
          {
            question: "What's included in the price?",
            answer: "<p>The price includes the complete building structure, wall panels, roof, windows, doors, electrical wiring, and basic plumbing. Foundation work and transportation are quoted separately.</p>"
          }
        ]}
      />

      {/* Related Products */}
      <InternalLinksSection
        title="Similar Products"
        subtitle="Explore other modular office solutions"
        columns={3}
        links={[
          {
            title: "Compact Office 80m²",
            url: "/products/compact-office-80",
            description: "Perfect for small teams and startups"
          },
          {
            title: "Executive Office 200m²",
            url: "/products/executive-office-200",
            description: "Spacious office with conference room"
          },
          {
            title: "Office Container",
            url: "/products/office-container",
            description: "Mobile office solution from containers"
          }
        ]}
      />

      {/* Call to Action */}
      <CTASection
        title="Ready to Order Your Modular Office?"
        description="Get a detailed quote and start your project today"
        variant="centered"
        backgroundColor="navy"
        primaryButton={{
          text: "Request Quote",
          href: "/contact?product=modern-office-120",
          variant: "warning"
        }}
        secondaryButton={{
          text: "Download Brochure",
          href: "/downloads/office-brochure.pdf",
          variant: "outline"
        }}
      />
    </>
  )
}

// =============================================================================
// EXAMPLE 2: Category Page Layout
// =============================================================================

export function CategoryPageExample() {
  return (
    <>
      {/* Breadcrumbs */}
      <BreadcrumbsComponent
        items={[
          { label: "Products", href: "/products" },
          { label: "Modular Buildings", href: "/products/modular-buildings" }
        ]}
      />

      {/* Category Introduction */}
      <ContentBlockSection
        title="Modular Buildings by Modular Buildings Co"
        content={`
          <h3>Fast, Affordable, and Sustainable Construction</h3>
          <p>Modular Buildings Co's modular buildings are engineered for speed without compromising quality.
          Our prefabricated solutions are ideal for offices, schools, healthcare facilities,
          and more. With over 50 years of experience, we deliver excellence worldwide.</p>
          <ul>
            <li>Delivery in 30-60 days</li>
            <li>Up to 70% faster than traditional construction</li>
            <li>Fully customizable designs</li>
            <li>Energy-efficient and sustainable</li>
            <li>Easy to relocate or expand</li>
          </ul>
        `}
        layout="text-only"
        backgroundColor="white"
      />

      {/* Category Links */}
      <InternalLinksSection
        title="Browse by Type"
        columns={4}
        links={[
          {
            title: "Office Buildings",
            url: "/products/modular-buildings/offices",
            description: "Modern workspace solutions"
          },
          {
            title: "Accommodation",
            url: "/products/modular-buildings/accommodation",
            description: "Worker camps and housing"
          },
          {
            title: "Healthcare",
            url: "/products/modular-buildings/healthcare",
            description: "Medical centers and clinics"
          },
          {
            title: "Education",
            url: "/products/modular-buildings/education",
            description: "Schools and classrooms"
          }
        ]}
      />

      {/* CTA with Background Image */}
      <CTASection
        title="Need a Custom Solution?"
        subtitle="Talk to Our Experts"
        description="Our team will design the perfect modular building for your specific needs"
        variant="with-image"
        backgroundImage="/images/cta-background.jpg"
        primaryButton={{
          text: "Schedule Consultation",
          href: "/contact",
          variant: "warning"
        }}
      />
    </>
  )
}

// =============================================================================
// EXAMPLE 3: FAQ Page
// =============================================================================

export function FAQPageExample() {
  return (
    <>
      <BreadcrumbsComponent
        items={[
          { label: "Support", href: "/support" },
          { label: "FAQ", href: "/faq" }
        ]}
      />

      {/* General FAQs */}
      <FAQSection
        title="General Questions"
        subtitle="Learn more about Modular Buildings Co and our products"
        questions={[
          {
            question: "What does Modular Buildings Co specialize in?",
            answer: "<p>Modular Buildings Co is a global leader in modular construction, specializing in prefabricated buildings, container solutions, steel structures, and temporary facilities.</p>"
          },
          {
            question: "Where does Modular Buildings Co operate?",
            answer: "<p>We operate globally with manufacturing facilities in Turkey and distribution networks spanning over 100 countries across Europe, Middle East, Africa, and beyond.</p>"
          },
          {
            question: "How do I get a quote?",
            answer: "<p>You can request a quote through our <a href='/contact'>contact form</a>, email us directly at info@modularbuildings.com, or call our sales team at +1 800 555 0123.</p>"
          }
        ]}
      />

      {/* Product FAQs */}
      <FAQSection
        title="Product Questions"
        subtitle="Everything you need to know about our products"
        questions={[
          {
            question: "What is the typical delivery time?",
            answer: "<p>Standard products can be delivered in 30-45 days. Custom designs may take 60-90 days depending on complexity and current production schedule.</p>"
          },
          {
            question: "Are your buildings weatherproof?",
            answer: "<p>Yes, all our buildings are designed to withstand various weather conditions including extreme heat, cold, wind, and rain. They meet international quality standards.</p>"
          },
          {
            question: "Can buildings be relocated?",
            answer: "<p>Absolutely! One of the key advantages of modular construction is portability. Our buildings can be disassembled and relocated to new sites.</p>"
          },
          {
            question: "What warranty do you offer?",
            answer: "<p>We provide a standard 2-year warranty on all structural components. Extended warranties are available for specific applications.</p>"
          }
        ]}
      />

      {/* Installation FAQs */}
      <FAQSection
        title="Installation & Maintenance"
        questions={[
          {
            question: "Do you provide installation services?",
            answer: "<p>Yes, we offer full installation services through our certified teams. Alternatively, we can work with your local contractors and provide detailed installation guides.</p>"
          },
          {
            question: "What maintenance is required?",
            answer: "<p>Our buildings require minimal maintenance. Regular inspections of seals, roofing, and mechanical systems are recommended. We provide detailed maintenance guidelines with every order.</p>"
          }
        ]}
      />

      {/* Still Have Questions CTA */}
      <CTASection
        title="Still Have Questions?"
        description="Our expert team is here to help with any inquiries"
        variant="contained"
        backgroundColor="light"
        primaryButton={{
          text: "Contact Support",
          href: "/contact",
          variant: "primary"
        }}
        secondaryButton={{
          text: "Live Chat",
          href: "#chat",
          variant: "outline"
        }}
      />
    </>
  )
}

// =============================================================================
// EXAMPLE 4: About/Company Page
// =============================================================================

export function AboutPageExample() {
  return (
    <>
      <BreadcrumbsComponent
        items={[
          { label: "About", href: "/about" }
        ]}
      />

      {/* Company Story */}
      <ContentBlockSection
        title="50 Years of Innovation in Modular Construction"
        content={`
          <p>Founded in 1973, Modular Buildings Co has grown from a small manufacturing facility to become
          one of the world's leading producers of modular buildings and container solutions.</p>
          <p>Our journey began with a simple mission: to provide fast, affordable, and quality
          construction solutions. Today, we continue that mission with cutting-edge technology,
          sustainable practices, and a commitment to customer satisfaction.</p>
        `}
        layout="image-right"
        image={{
          url: "/images/company/history.jpg",
          alt: "Modular Buildings Co factory"
        }}
      />

      {/* Company Stats */}
      <SpecificationsTable
        title="Modular Buildings Co by the Numbers"
        variant="cards"
        showIcons={false}
        specifications={[
          { label: "Years of Experience", value: "50+" },
          { label: "Countries Served", value: "100+" },
          { label: "Projects Completed", value: "10,000+" },
          { label: "Production Capacity", value: "500,000", unit: "m²/year" },
          { label: "Employees", value: "1,200+" },
          { label: "Manufacturing Facilities", value: "5" }
        ]}
      />

      {/* Values */}
      <ContentBlockSection
        title="Our Values"
        content={`
          <h3>Quality First</h3>
          <p>Every product meets international standards and undergoes rigorous quality control.</p>
          <h3>Innovation</h3>
          <p>We continuously invest in R&D to bring the latest construction technologies to market.</p>
          <h3>Sustainability</h3>
          <p>Environmentally responsible practices guide our manufacturing and design processes.</p>
          <h3>Customer Focus</h3>
          <p>Your success is our success. We're with you from design to delivery and beyond.</p>
        `}
        layout="text-only"
        backgroundColor="light"
      />

      {/* CTA */}
      <CTASection
        title="Join Thousands of Satisfied Customers"
        subtitle="Start Your Project"
        description="Experience the Modular Buildings Co difference on your next construction project"
        variant="centered"
        backgroundColor="navy"
        primaryButton={{
          text: "Get Started",
          href: "/contact",
          variant: "warning"
        }}
        secondaryButton={{
          text: "View Projects",
          href: "/projects",
          variant: "outline"
        }}
      />
    </>
  )
}

// =============================================================================
// EXAMPLE 5: Landing Page with All Components
// =============================================================================

export function LandingPageExample() {
  return (
    <>
      {/* Hero CTA */}
      <CTASection
        title="Build Faster with Modular Buildings Co Solutions"
        subtitle="Premium Quality"
        description="Prefabricated buildings delivered in 30 days"
        variant="with-image"
        backgroundImage="/images/hero-background.jpg"
        primaryButton={{
          text: "Explore Products",
          href: "/products",
          variant: "warning"
        }}
        secondaryButton={{
          text: "Contact Us",
          href: "/contact",
          variant: "outline"
        }}
      />

      {/* Product Categories */}
      <InternalLinksSection
        title="Our Product Range"
        subtitle="Complete modular construction solutions"
        columns={4}
        links={[
          { title: "Modular Buildings", url: "/products/modular-buildings", description: "Offices, schools, hospitals" },
          { title: "Container Solutions", url: "/products/containers", description: "Homes, offices, cafeterias" },
          { title: "Steel Structures", url: "/products/steel-structures", description: "Warehouses, hangars, factories" },
          { title: "WC & Shower", url: "/products/wc-shower", description: "Portable sanitary facilities" }
        ]}
      />

      {/* About Section */}
      <ContentBlockSection
        title="Why Choose Modular Buildings Co?"
        content={`
          <p>With over 50 years of expertise in modular construction, Modular Buildings Co delivers
          world-class prefabricated buildings to projects in more than 100 countries.</p>
          <ul>
            <li><strong>Fast Delivery:</strong> Projects completed 70% faster than traditional methods</li>
            <li><strong>Quality Assured:</strong> ISO certified manufacturing processes</li>
            <li><strong>Cost Effective:</strong> Save up to 40% on construction costs</li>
            <li><strong>Sustainable:</strong> Eco-friendly materials and practices</li>
          </ul>
        `}
        layout="image-left"
        image={{
          url: "/images/why-modular.jpg",
          alt: "Modular Buildings Co quality"
        }}
        backgroundColor="light"
      />

      {/* Key Specifications */}
      <SpecificationsTable
        title="What Sets Us Apart"
        variant="cards"
        specifications={[
          { label: "Delivery Time", value: "30-60", unit: "days" },
          { label: "Production Capacity", value: "500k", unit: "m²/year" },
          { label: "Global Projects", value: "10,000+" },
          { label: "Warranty", value: "2", unit: "years" },
          { label: "Countries Served", value: "100+" },
          { label: "Energy Rating", value: "A+" }
        ]}
      />

      {/* FAQ */}
      <FAQSection
        title="Frequently Asked Questions"
        questions={[
          {
            question: "How quickly can you deliver?",
            answer: "<p>Standard products ship in 30-45 days. Custom designs take 60-90 days.</p>"
          },
          {
            question: "Do you ship internationally?",
            answer: "<p>Yes, we ship to over 100 countries worldwide with full logistics support.</p>"
          },
          {
            question: "Can I customize my building?",
            answer: "<p>Absolutely! We offer extensive customization options for layout, finishes, and features.</p>"
          }
        ]}
      />

      {/* Final CTA */}
      <CTASection
        title="Ready to Start Your Project?"
        variant="full-width"
        backgroundColor="warning"
        primaryButton={{
          text: "Get a Free Quote",
          href: "/contact",
          variant: "primary"
        }}
      />
    </>
  )
}

export default LandingPageExample
