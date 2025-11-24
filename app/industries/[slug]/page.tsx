import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { FAQSection, FAQItem } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContentBlockSection, ContentLayout } from '@/components/sections/ContentBlockSection'
import { ContactForm } from '@/components/forms/ContactForm'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import { getPageBySlug, type Page, type FAQ, type StructuredData } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Building2,
  Stethoscope,
  Landmark,
  GraduationCap,
  Church,
  CheckCircle2,
  Clock,
  Shield,
  Award,
  MapPin,
  ArrowRight,
  Users,
  Zap,
  Home,
} from 'lucide-react'

// Helper component to render JSON-LD structured data
function StructuredDataScript({ structuredData }: { structuredData?: StructuredData[] }) {
  if (!structuredData || structuredData.length === 0) return null

  return (
    <>
      {structuredData
        .filter((sd) => sd.is_active)
        .map((sd) => (
          <script
            key={sd.id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(sd.json_ld) }}
          />
        ))}
    </>
  )
}

// Helper to merge database FAQs with static FAQs
function mergeFAQs(
  dbFaqs: FAQ[] | undefined,
  staticFaqs: FAQItem[]
): FAQItem[] {
  if (dbFaqs && dbFaqs.length > 0) {
    return dbFaqs
      .filter((faq) => faq.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((faq) => ({ question: faq.question, answer: faq.answer }))
  }
  return staticFaqs
}

interface IndustryPageProps {
  params: {
    slug: string
  }
}

interface IndustryData {
  slug: string
  name: string
  title: string
  description: string
  metaDescription: string
  icon: React.ReactNode
  bannerImage: string
  overview: {
    title: string
    content: string
    image: {
      url: string
      alt: string
    }
  }
  solutions: {
    name: string
    description: string
    features: string[]
    imageUrl: string
  }[]
  caseStudies: {
    title: string
    location: string
    description: string
    stats: { label: string; value: string }[]
    imageUrl: string
    href: string
  }[]
  faqs: FAQItem[]
  locations: string[]
}

const industriesData: Record<string, IndustryData> = {
  construction: {
    slug: 'construction',
    name: 'Construction',
    title: 'Modular Buildings for Construction Industry',
    description: 'Rapid-deployment modular solutions for construction sites including offices, workforce housing, storage facilities, and temporary structures.',
    metaDescription: 'Modular Buildings Co provides modular construction site solutions including offices, workforce housing, storage facilities, and temporary structures. Fast deployment, relocatable, and cost-effective.',
    icon: <Building2 className="w-8 h-8" />,
    bannerImage: getPlaceholderImage(1920, 400, 'Construction Industry'),
    overview: {
      title: 'Comprehensive Construction Site Solutions',
      content: `<p>The construction industry demands flexible, durable, and rapidly deployable building solutions that can keep pace with evolving project requirements. Modular Buildings Co's modular buildings are engineered specifically for construction environments, offering site offices, workforce accommodation, storage facilities, and temporary structures that can be quickly installed and relocated as your project progresses.</p>
      <p class="mt-4">Our construction site solutions are built to withstand harsh conditions while providing comfortable, functional spaces for your team. From single-unit site offices to complete worker camps housing hundreds of employees, we deliver turnkey solutions that minimize downtime and maximize productivity.</p>
      <p class="mt-4">With over 25 years of experience serving the construction industry worldwide, Modular Buildings Co understands the unique challenges you face. Our modular buildings arrive ready for immediate use, reducing setup time from months to days and allowing your team to focus on what matters most: completing your project on time and within budget.</p>`,
      image: {
        url: getPlaceholderImage(800, 600, 'Construction Site Office'),
        alt: 'Modern construction site office',
      },
    },
    solutions: [
      {
        name: 'Site Offices',
        description: 'Professional management and administrative offices designed for construction site environments with meeting rooms, workstations, and project coordination spaces.',
        features: ['Climate-controlled interiors', 'IT and communication ready', 'Multiple floor plans available', 'Rapid installation'],
        imageUrl: getPlaceholderImage(600, 400, 'Site Office'),
      },
      {
        name: 'Workforce Housing',
        description: 'Comfortable dormitories and accommodation units for construction workers featuring sleeping quarters, common areas, kitchens, and sanitary facilities.',
        features: ['Single and shared room options', 'Complete amenities included', 'Dining and recreation facilities', 'Scalable capacity'],
        imageUrl: getPlaceholderImage(600, 400, 'Workforce Housing'),
      },
      {
        name: 'Storage & Warehouses',
        description: 'Secure storage containers and warehouse buildings for equipment, materials, and supplies with various sizes and security options.',
        features: ['Heavy-duty construction', 'Weather-resistant design', 'Multiple access configurations', 'Stackable options'],
        imageUrl: getPlaceholderImage(600, 400, 'Storage Building'),
      },
      {
        name: 'Guard Houses & Security',
        description: 'Checkpoint stations, guard houses, and security offices for site access control and perimeter security management.',
        features: ['360-degree visibility', 'Climate control systems', 'Communication equipment ready', 'Rapid deployment'],
        imageUrl: getPlaceholderImage(600, 400, 'Guard House'),
      },
    ],
    caseStudies: [
      {
        title: 'Major Highway Construction Project',
        location: 'Texas, USA',
        description: 'Complete site infrastructure including 50 office units and housing for 500 workers for a 3-year highway construction project.',
        stats: [
          { label: 'Units Delivered', value: '120+' },
          { label: 'Workers Housed', value: '500' },
          { label: 'Setup Time', value: '21 days' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Highway Project'),
        href: '/projects/highway-construction-texas',
      },
      {
        title: 'Industrial Plant Development',
        location: 'Alberta, Canada',
        description: 'Modular camp facilities supporting an industrial plant construction with offices, dormitories, dining facilities, and recreation areas.',
        stats: [
          { label: 'Total Area', value: '15,000 m2' },
          { label: 'Capacity', value: '800 workers' },
          { label: 'Project Duration', value: '4 years' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Industrial Plant'),
        href: '/projects/industrial-plant-canada',
      },
      {
        title: 'Urban Development Site Complex',
        location: 'Dubai, UAE',
        description: 'Multi-story office complex and worker accommodation for a major urban development project in challenging desert conditions.',
        stats: [
          { label: 'Office Space', value: '3,500 m2' },
          { label: 'Housing Units', value: '200' },
          { label: 'Installation', value: '30 days' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Dubai Construction'),
        href: '/projects/urban-development-dubai',
      },
    ],
    faqs: [
      {
        question: 'How quickly can modular site offices be delivered and installed?',
        answer: 'Standard site offices can be delivered within 2-4 weeks of order confirmation. Installation typically takes 1-3 days depending on the size and configuration. For urgent requirements, we offer expedited production and delivery options.',
      },
      {
        question: 'Can the buildings be relocated when the project moves to a new location?',
        answer: 'Yes, all our construction site buildings are designed for relocatability. They can be disassembled, transported, and reassembled at new locations multiple times without compromising structural integrity or functionality.',
      },
      {
        question: 'What power and utility connections are included?',
        answer: 'All buildings come with complete electrical systems, lighting, and outlets. HVAC systems, plumbing, and data/communication wiring can be included based on your specifications. We provide detailed utility connection guides for site installation.',
      },
      {
        question: 'How do the buildings perform in extreme weather conditions?',
        answer: 'Our construction site buildings are engineered to withstand extreme conditions including high winds (up to 150 km/h), heavy snow loads, and temperature extremes from -40C to +50C. Special configurations are available for particularly challenging environments.',
      },
      {
        question: 'What capacity options are available for workforce housing?',
        answer: 'We offer workforce housing solutions ranging from small units accommodating 4-8 workers to complete camp complexes housing 1,000+ employees. Configurations include single rooms, shared rooms, and dormitory-style layouts.',
      },
      {
        question: 'Do you provide lease options for temporary projects?',
        answer: 'Yes, we offer flexible lease and rental programs for temporary projects. This includes short-term rentals, lease-to-own arrangements, and buy-back programs for projects with defined end dates.',
      },
      {
        question: 'What maintenance is required during the project?',
        answer: 'Our buildings require minimal maintenance. We provide maintenance guidelines and offer optional maintenance contracts. Regular inspections of seals, HVAC filters, and general cleaning are typically sufficient to keep buildings in optimal condition.',
      },
      {
        question: 'Can buildings be customized with company branding?',
        answer: 'Absolutely! We offer various customization options including exterior colors, company logos, signage, and branded interior elements. Custom paint schemes and vinyl wraps are also available for temporary projects.',
      },
    ],
    locations: ['texas', 'california', 'florida', 'new-york', 'ohio'],
  },
  medical: {
    slug: 'medical',
    name: 'Medical & Healthcare',
    title: 'Modular Healthcare Facilities',
    description: 'Purpose-built healthcare facilities including clinics, laboratories, emergency response units, and medical administrative buildings.',
    metaDescription: 'Modular Buildings Co delivers modular healthcare facilities including clinics, laboratories, emergency response units, and medical buildings. Compliant with healthcare regulations and rapid deployment.',
    icon: <Stethoscope className="w-8 h-8" />,
    bannerImage: getPlaceholderImage(1920, 400, 'Medical Healthcare'),
    overview: {
      title: 'Healthcare Facilities Built for Excellence',
      content: `<p>Healthcare facilities require specialized environments that meet strict regulatory standards while providing comfortable, functional spaces for patients and medical professionals. Modular Buildings Co's modular healthcare solutions are designed from the ground up to meet these demanding requirements, offering clinics, laboratories, emergency units, and administrative buildings that comply with healthcare regulations worldwide.</p>
      <p class="mt-4">Our medical facilities feature hospital-grade finishes, proper HVAC systems for infection control, and layouts optimized for healthcare workflows. From small rural clinics to large hospital expansions, we deliver solutions that can be operational in weeks rather than months, helping communities access quality healthcare faster.</p>
      <p class="mt-4">During the global health challenges of recent years, Modular Buildings Co has rapidly deployed hundreds of emergency medical facilities, demonstrating our capability to respond quickly when healthcare infrastructure is urgently needed. Our experience spans primary care clinics, testing laboratories, vaccination centers, isolation units, and complete hospital wings.</p>`,
      image: {
        url: getPlaceholderImage(800, 600, 'Medical Clinic'),
        alt: 'Modern modular medical clinic',
      },
    },
    solutions: [
      {
        name: 'Medical Clinics',
        description: 'Complete outpatient clinics with examination rooms, waiting areas, reception, and administrative spaces designed for primary care and specialty practices.',
        features: ['Hospital-grade finishes', 'Accessible design (ADA compliant)', 'Medical gas systems available', 'Flexible room configurations'],
        imageUrl: getPlaceholderImage(600, 400, 'Medical Clinic'),
      },
      {
        name: 'Laboratory Facilities',
        description: 'Modular laboratories for testing, research, and diagnostic services with appropriate ventilation, utilities, and containment features.',
        features: ['Specialized ventilation systems', 'Chemical-resistant surfaces', 'Utility connections for equipment', 'Biosafety configurations'],
        imageUrl: getPlaceholderImage(600, 400, 'Laboratory'),
      },
      {
        name: 'Emergency Response Units',
        description: 'Rapidly deployable medical units for disaster response, pandemic surge capacity, and temporary healthcare needs.',
        features: ['Rapid deployment design', 'Self-contained systems', 'Expandable configurations', 'Mobile-ready options'],
        imageUrl: getPlaceholderImage(600, 400, 'Emergency Unit'),
      },
      {
        name: 'Medical Administration',
        description: 'Administrative buildings and support facilities for healthcare organizations including offices, training rooms, and medical records storage.',
        features: ['HIPAA-compliant configurations', 'Secure storage options', 'Conference and training rooms', 'IT infrastructure ready'],
        imageUrl: getPlaceholderImage(600, 400, 'Medical Admin'),
      },
    ],
    caseStudies: [
      {
        title: 'Rural Health Clinic Network',
        location: 'Montana, USA',
        description: 'Network of 12 modular primary care clinics serving rural communities across the state with full medical capabilities.',
        stats: [
          { label: 'Clinics Deployed', value: '12' },
          { label: 'Patients Served', value: '50,000+' },
          { label: 'Avg. Build Time', value: '45 days' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Rural Clinic'),
        href: '/projects/rural-health-montana',
      },
      {
        title: 'Hospital Expansion Wing',
        location: 'London, UK',
        description: 'Three-story modular hospital wing adding 100 beds and complete medical facilities to an existing hospital campus.',
        stats: [
          { label: 'New Beds', value: '100' },
          { label: 'Total Area', value: '8,000 m2' },
          { label: 'Construction Time', value: '6 months' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Hospital Wing'),
        href: '/projects/hospital-expansion-london',
      },
      {
        title: 'Emergency Testing Facilities',
        location: 'Multiple Locations',
        description: 'Rapid deployment of 50+ testing facilities during health emergency response across multiple countries.',
        stats: [
          { label: 'Units Deployed', value: '50+' },
          { label: 'Countries', value: '8' },
          { label: 'Deployment Speed', value: '7-14 days' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Testing Facility'),
        href: '/projects/emergency-testing-facilities',
      },
    ],
    faqs: [
      {
        question: 'Do your medical facilities meet healthcare regulatory standards?',
        answer: 'Yes, all our healthcare facilities are designed to meet applicable regulations including Joint Commission standards, ADA requirements, and local building codes. We work with healthcare consultants to ensure compliance with specific regional requirements.',
      },
      {
        question: 'Can modular clinics accommodate medical imaging equipment?',
        answer: 'Yes, we design facilities to accommodate various medical equipment including X-ray, CT, MRI, and ultrasound systems. Structural reinforcement, shielding, and specialized utilities can be incorporated based on equipment specifications.',
      },
      {
        question: 'What infection control features are included?',
        answer: 'Our healthcare facilities include HEPA filtration systems, negative/positive pressure room options, antimicrobial surfaces, and layouts designed to minimize cross-contamination. Specific infection control configurations are available for different clinical applications.',
      },
      {
        question: 'How quickly can an emergency medical facility be deployed?',
        answer: 'Emergency medical units can be deployed within 1-2 weeks for basic configurations. Fully equipped facilities typically require 4-6 weeks. We maintain emergency inventory for rapid response situations.',
      },
      {
        question: 'Are the facilities suitable for long-term use?',
        answer: 'Absolutely. While modular construction enables rapid deployment, our healthcare facilities are built for permanent use with expected lifespans of 30+ years. Many clients initially deploy modular facilities as temporary solutions that become permanent installations.',
      },
      {
        question: 'What medical gas systems can be included?',
        answer: 'We can integrate medical gas systems including oxygen, medical air, vacuum, and nitrous oxide. Systems are designed to healthcare standards and can be connected to central supply or include standalone equipment.',
      },
    ],
    locations: ['california', 'texas', 'new-york', 'florida', 'illinois'],
  },
  government: {
    slug: 'government',
    name: 'Government',
    title: 'Modular Government Buildings',
    description: 'Secure and compliant modular buildings for government agencies, military installations, and public services.',
    metaDescription: 'Modular Buildings Co provides modular government buildings including administrative offices, military facilities, border security, and public service buildings. Built to federal specifications.',
    icon: <Landmark className="w-8 h-8" />,
    bannerImage: getPlaceholderImage(1920, 400, 'Government Buildings'),
    overview: {
      title: 'Trusted Solutions for Government Operations',
      content: `<p>Government agencies require buildings that meet stringent security standards, comply with federal specifications, and deliver exceptional value for public funds. Modular Buildings Co has extensive experience providing modular solutions for government clients ranging from local municipalities to federal agencies and military organizations worldwide.</p>
      <p class="mt-4">Our government buildings are designed to meet Buy American requirements, GSA specifications, and military construction standards. We understand the procurement process, documentation requirements, and security protocols essential for government projects, ensuring smooth project delivery from contract to completion.</p>
      <p class="mt-4">From administrative offices and civic centers to military barracks and border security facilities, Modular Buildings Co delivers buildings that serve the public interest efficiently and cost-effectively. Our modular approach allows government agencies to deploy facilities faster and often at lower cost than traditional construction, maximizing the value of taxpayer investments.</p>`,
      image: {
        url: getPlaceholderImage(800, 600, 'Government Office'),
        alt: 'Modern government administrative building',
      },
    },
    solutions: [
      {
        name: 'Administrative Offices',
        description: 'Government office buildings for federal, state, and local agencies with secure configurations, accessibility features, and professional interiors.',
        features: ['GSA compliant designs', 'Secure access systems', 'ADA accessibility', 'Energy efficient'],
        imageUrl: getPlaceholderImage(600, 400, 'Admin Office'),
      },
      {
        name: 'Military Facilities',
        description: 'Barracks, command centers, training facilities, and support buildings designed to military specifications for domestic and overseas deployment.',
        features: ['Military specification compliant', 'Relocatable designs', 'Force protection features', 'Rapid deployment capable'],
        imageUrl: getPlaceholderImage(600, 400, 'Military Building'),
      },
      {
        name: 'Border & Security',
        description: 'Border patrol stations, checkpoint facilities, and security command centers with appropriate surveillance and access control features.',
        features: ['Ballistic protection options', 'Surveillance integration', 'Detention capabilities', 'All-weather operation'],
        imageUrl: getPlaceholderImage(600, 400, 'Border Security'),
      },
      {
        name: 'Public Services',
        description: 'Community centers, social service offices, and public-facing facilities designed for efficient service delivery and citizen accessibility.',
        features: ['Welcoming public spaces', 'Service counter configurations', 'Multi-purpose rooms', 'Community-oriented design'],
        imageUrl: getPlaceholderImage(600, 400, 'Public Service'),
      },
    ],
    caseStudies: [
      {
        title: 'Federal Administrative Complex',
        location: 'Washington D.C., USA',
        description: 'Multi-building administrative complex for a federal agency requiring secure, energy-efficient workspace for 500 employees.',
        stats: [
          { label: 'Total Area', value: '12,000 m2' },
          { label: 'Employees', value: '500' },
          { label: 'LEED Certified', value: 'Gold' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Federal Complex'),
        href: '/projects/federal-admin-dc',
      },
      {
        title: 'Military Training Facility',
        location: 'Fort Bragg, USA',
        description: 'Comprehensive training facility including classrooms, simulation rooms, administrative offices, and support buildings.',
        stats: [
          { label: 'Buildings', value: '15' },
          { label: 'Training Capacity', value: '1,000' },
          { label: 'Construction Time', value: '8 months' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Military Training'),
        href: '/projects/military-training-fort-bragg',
      },
      {
        title: 'Border Checkpoint Stations',
        location: 'Southern Border, USA',
        description: 'Series of border checkpoint facilities with processing areas, holding facilities, and staff support buildings.',
        stats: [
          { label: 'Stations Built', value: '8' },
          { label: 'Processing Capacity', value: '500/day' },
          { label: 'Deployment Time', value: '60 days' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Border Checkpoint'),
        href: '/projects/border-checkpoints',
      },
    ],
    faqs: [
      {
        question: 'Are your buildings compliant with Buy American requirements?',
        answer: 'Yes, we offer configurations that meet Buy American Act requirements for federal procurement. We maintain documentation of material origins and can provide certificates of compliance as required.',
      },
      {
        question: 'What security features can be incorporated?',
        answer: 'Our government buildings can include ballistic-rated panels, blast-resistant construction, secure access control systems, surveillance integration, and SCIF-ready configurations. Security levels are customized to specific agency requirements.',
      },
      {
        question: 'Do you have experience with military construction standards?',
        answer: 'Yes, we have delivered numerous projects to military specifications including UFGS compliance. Our team understands military construction requirements, anti-terrorism/force protection standards, and overseas contingency construction.',
      },
      {
        question: 'Can buildings be deployed to remote or overseas locations?',
        answer: 'Absolutely. Our modular buildings are designed for worldwide deployment. We have experience shipping to remote locations and overseas military installations with appropriate packaging and logistics support.',
      },
      {
        question: 'What is the procurement process for government orders?',
        answer: 'We are registered in SAM.gov and have experience with various procurement vehicles including GSA Schedule contracts, BPAs, and competitive bids. Our team can guide you through the appropriate procurement process for your agency.',
      },
      {
        question: 'How do you handle classified space requirements?',
        answer: 'We can construct SCIF-ready shells that meet ICD 705 requirements. Final certification is completed by the agency with appropriate security contractors. We have experience working with security integrators on classified facilities.',
      },
    ],
    locations: ['washington-dc', 'virginia', 'texas', 'california', 'colorado'],
  },
  education: {
    slug: 'education',
    name: 'Education',
    title: 'Modular Educational Facilities',
    description: 'Modern educational facilities including classrooms, administrative buildings, and student housing.',
    metaDescription: 'Modular Buildings Co provides modular educational facilities including classrooms, administrative buildings, libraries, and student housing. Create optimal learning environments quickly and affordably.',
    icon: <GraduationCap className="w-8 h-8" />,
    bannerImage: getPlaceholderImage(1920, 400, 'Education Buildings'),
    overview: {
      title: 'Creating Spaces Where Learning Thrives',
      content: `<p>Educational institutions face constant pressure to expand capacity, modernize facilities, and create inspiring learning environments while managing tight budgets and timelines. Modular Buildings Co's modular educational facilities provide a smart solution, delivering high-quality classrooms, administrative buildings, and student housing that can be ready for the next school year.</p>
      <p class="mt-4">Our educational buildings are designed with input from educators to optimize learning outcomes. Features include excellent acoustics, natural lighting, proper ventilation, flexible furniture arrangements, and integrated technology infrastructure. From pre-K classrooms to university buildings, we create spaces that inspire students and support teachers.</p>
      <p class="mt-4">Modular construction allows schools to add capacity without disrupting ongoing education. Buildings are manufactured off-site and installed quickly during breaks, minimizing impact on students and staff. This approach also offers long-term flexibility, as buildings can be reconfigured, expanded, or relocated as enrollment patterns change.</p>`,
      image: {
        url: getPlaceholderImage(800, 600, 'Modern Classroom'),
        alt: 'Modern modular classroom interior',
      },
    },
    solutions: [
      {
        name: 'Classrooms',
        description: 'Purpose-built learning spaces with optimal acoustics, lighting, and ventilation designed to enhance student engagement and educational outcomes.',
        features: ['Acoustic optimization', 'Natural and LED lighting', 'Technology integrated', 'Flexible configurations'],
        imageUrl: getPlaceholderImage(600, 400, 'Classroom'),
      },
      {
        name: 'Administrative Buildings',
        description: 'School offices, faculty workrooms, and administrative facilities supporting educational operations with professional, welcoming environments.',
        features: ['Reception and waiting areas', 'Private offices', 'Conference rooms', 'Secure records storage'],
        imageUrl: getPlaceholderImage(600, 400, 'Admin Building'),
      },
      {
        name: 'Student Housing',
        description: 'Dormitories and student apartments for colleges and universities featuring comfortable living spaces, common areas, and modern amenities.',
        features: ['Single and shared rooms', 'Common lounges', 'Laundry facilities', 'Study areas'],
        imageUrl: getPlaceholderImage(600, 400, 'Student Housing'),
      },
      {
        name: 'Special Facilities',
        description: 'Libraries, science labs, music rooms, art studios, and other specialized educational spaces with appropriate features and equipment.',
        features: ['Subject-specific design', 'Specialized utilities', 'Equipment accommodation', 'Safety features'],
        imageUrl: getPlaceholderImage(600, 400, 'Science Lab'),
      },
    ],
    caseStudies: [
      {
        title: 'Elementary School Expansion',
        location: 'Arizona, USA',
        description: 'Addition of 24 classrooms to accommodate enrollment growth, completed over summer break for fall semester opening.',
        stats: [
          { label: 'Classrooms', value: '24' },
          { label: 'Student Capacity', value: '720' },
          { label: 'Installation Time', value: '8 weeks' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Elementary School'),
        href: '/projects/elementary-expansion-arizona',
      },
      {
        title: 'University Dormitory Complex',
        location: 'Texas, USA',
        description: 'Four-building student housing complex providing 400 beds with modern amenities and sustainable design features.',
        stats: [
          { label: 'Beds', value: '400' },
          { label: 'Buildings', value: '4' },
          { label: 'LEED Certified', value: 'Silver' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'University Dorm'),
        href: '/projects/university-dorms-texas',
      },
      {
        title: 'Charter School Campus',
        location: 'Florida, USA',
        description: 'Complete K-8 charter school campus including classrooms, administration, cafeteria, and gymnasium.',
        stats: [
          { label: 'Total Area', value: '5,000 m2' },
          { label: 'Student Capacity', value: '600' },
          { label: 'Project Duration', value: '6 months' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Charter School'),
        href: '/projects/charter-school-florida',
      },
    ],
    faqs: [
      {
        question: 'Can modular classrooms be installed during the school year?',
        answer: 'Yes, modular classrooms can be installed with minimal disruption. Most installation work is done away from active student areas. However, we recommend scheduling installation during breaks when possible for the smoothest process.',
      },
      {
        question: 'Do modular classrooms meet educational building codes?',
        answer: 'Absolutely. All our educational facilities meet state and local building codes, fire safety requirements, and accessibility standards. We work with local authorities to ensure proper permitting and inspections.',
      },
      {
        question: 'What technology infrastructure is included?',
        answer: 'Our classrooms include conduit for data cabling, sufficient electrical outlets, interactive whiteboard mounting provisions, and options for ceiling-mounted projectors. We can customize technology infrastructure to match your district standards.',
      },
      {
        question: 'How do modular buildings perform acoustically?',
        answer: 'Our educational buildings are engineered for acoustic performance with sound-absorbing materials, proper HVAC noise control, and wall assemblies designed to minimize sound transmission between spaces.',
      },
      {
        question: 'Can temporary classrooms become permanent facilities?',
        answer: 'Yes, many districts start with "temporary" modular classrooms that become permanent fixtures. Our buildings are constructed to the same standards as permanent facilities and can serve for decades with proper maintenance.',
      },
      {
        question: 'What financing options are available for school districts?',
        answer: 'We work with various financing arrangements including lease programs, lease-to-own, and traditional purchase. Our team can help structure solutions that work with school district budgets and funding cycles.',
      },
    ],
    locations: ['california', 'texas', 'florida', 'arizona', 'north-carolina'],
  },
  religion: {
    slug: 'religion',
    name: 'Religious Institutions',
    title: 'Modular Worship & Community Buildings',
    description: 'Thoughtfully designed worship spaces, community halls, and fellowship buildings for religious organizations.',
    metaDescription: 'Modular Buildings Co creates modular worship spaces, community halls, and fellowship buildings for religious institutions. Respectful designs that honor traditions while providing modern amenities.',
    icon: <Church className="w-8 h-8" />,
    bannerImage: getPlaceholderImage(1920, 400, 'Religious Buildings'),
    overview: {
      title: 'Sacred Spaces for Worship and Community',
      content: `<p>Religious institutions serve as cornerstones of their communities, providing not only spaces for worship but also venues for fellowship, education, outreach, and support services. Modular Buildings Co understands the sacred nature of these buildings and approaches each project with respect for religious traditions while incorporating modern building technology and amenities.</p>
      <p class="mt-4">Our modular worship buildings are designed in consultation with religious leaders to ensure they appropriately serve the spiritual needs of each congregation. From intimate chapels to large worship halls, from traditional architectural styles to contemporary designs, we create spaces that inspire reverence and facilitate meaningful worship experiences.</p>
      <p class="mt-4">Beyond main worship spaces, we provide community halls, religious education classrooms, fellowship areas, administrative offices, and support facilities. Our modular approach allows growing congregations to expand incrementally as membership and resources grow, without the financial burden of traditional construction.</p>`,
      image: {
        url: getPlaceholderImage(800, 600, 'Worship Hall'),
        alt: 'Modern worship hall interior',
      },
    },
    solutions: [
      {
        name: 'Worship Halls',
        description: 'Main sanctuary and worship spaces designed to accommodate services, ceremonies, and special religious observances with appropriate reverence and functionality.',
        features: ['Acoustic excellence', 'Flexible seating options', 'AV system integration', 'Natural lighting design'],
        imageUrl: getPlaceholderImage(600, 400, 'Worship Hall'),
      },
      {
        name: 'Community Centers',
        description: 'Multi-purpose fellowship halls and community spaces for gatherings, meals, events, and outreach programs serving both congregation and community.',
        features: ['Commercial kitchen options', 'Dividable spaces', 'Stage and presentation areas', 'Accessible design'],
        imageUrl: getPlaceholderImage(600, 400, 'Community Center'),
      },
      {
        name: 'Education Buildings',
        description: 'Religious education classrooms, youth group spaces, and study rooms supporting faith formation programs for all ages.',
        features: ['Age-appropriate designs', 'Flexible furniture', 'Technology integration', 'Safe environments'],
        imageUrl: getPlaceholderImage(600, 400, 'Education Building'),
      },
      {
        name: 'Administrative Facilities',
        description: 'Church offices, clergy residences, and administrative buildings supporting the operational needs of religious organizations.',
        features: ['Private offices', 'Counseling rooms', 'Reception areas', 'Secure storage'],
        imageUrl: getPlaceholderImage(600, 400, 'Church Office'),
      },
    ],
    caseStudies: [
      {
        title: 'Community Church Campus',
        location: 'Georgia, USA',
        description: 'Complete church campus including 500-seat worship hall, fellowship center, and education wing for a growing congregation.',
        stats: [
          { label: 'Worship Seating', value: '500' },
          { label: 'Total Area', value: '2,500 m2' },
          { label: 'Construction Time', value: '5 months' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Church Campus'),
        href: '/projects/community-church-georgia',
      },
      {
        title: 'Mosque and Community Center',
        location: 'Michigan, USA',
        description: 'Islamic center featuring prayer hall, ablution facilities, community hall, and educational classrooms.',
        stats: [
          { label: 'Prayer Capacity', value: '300' },
          { label: 'Community Hall', value: '200 seats' },
          { label: 'Classrooms', value: '8' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Mosque'),
        href: '/projects/mosque-michigan',
      },
      {
        title: 'Multi-Faith Chaplaincy Center',
        location: 'California, USA',
        description: 'University chaplaincy facility serving multiple faith traditions with prayer rooms, meeting spaces, and counseling offices.',
        stats: [
          { label: 'Prayer Rooms', value: '6' },
          { label: 'Faiths Served', value: '12+' },
          { label: 'Students Served', value: '5,000+' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Chaplaincy Center'),
        href: '/projects/chaplaincy-california',
      },
    ],
    faqs: [
      {
        question: 'Can modular buildings achieve a traditional religious architectural appearance?',
        answer: 'Yes, our modular buildings can incorporate traditional architectural elements including steeples, bell towers, arched windows, and other features associated with religious architecture. We work with congregations to honor their aesthetic traditions.',
      },
      {
        question: 'How do you ensure appropriate acoustics for worship services?',
        answer: 'Worship spaces require careful acoustic design. We incorporate sound-absorbing materials, proper room proportions, and acoustic treatments to ensure clear speech intelligibility and appropriate reverberation for music and worship.',
      },
      {
        question: 'Can you accommodate specific religious requirements?',
        answer: 'Absolutely. We work closely with religious leaders to understand specific requirements such as orientation (qibla), ablution facilities, kosher kitchens, baptismal fonts, altar configurations, and other faith-specific needs.',
      },
      {
        question: 'Is it possible to expand as our congregation grows?',
        answer: 'Yes, modular construction is ideal for phased expansion. We can design initial facilities with future expansion in mind, allowing congregations to add capacity incrementally as membership and finances grow.',
      },
      {
        question: 'Do you offer financing appropriate for religious organizations?',
        answer: 'We understand the financial considerations unique to religious organizations. We offer various payment structures and can work with church financing specialists to develop appropriate arrangements.',
      },
      {
        question: 'Can temporary worship space transition to permanent facilities?',
        answer: 'Many congregations use modular buildings as temporary worship space while building permanent facilities, then repurpose the modular buildings as fellowship halls, education buildings, or youth centers.',
      },
    ],
    locations: ['georgia', 'texas', 'california', 'michigan', 'ohio'],
  },
  retail: {
    slug: 'retail',
    name: 'Retail',
    title: 'Modular Retail Buildings',
    description: 'Versatile modular retail spaces including pop-up stores, showrooms, kiosks, and permanent retail locations.',
    metaDescription: 'Modular Buildings Co provides modular retail solutions including pop-up stores, showrooms, kiosks, and permanent retail spaces. Fast deployment for seasonal and permanent retail needs.',
    icon: <Building2 className="w-8 h-8" />,
    bannerImage: getPlaceholderImage(1920, 400, 'Retail Buildings'),
    overview: {
      title: 'Flexible Retail Spaces for Modern Commerce',
      content: `<p>The retail landscape is evolving rapidly, and businesses need flexible, cost-effective building solutions that can adapt to changing consumer behaviors and market conditions. Modular Buildings Co's modular retail buildings provide the perfect solution for retailers seeking quick deployment, relocatable structures, and customizable spaces that create memorable shopping experiences.</p>
      <p class="mt-4">Our retail buildings range from compact kiosks and pop-up shops to full-scale shopping centers and showrooms. Each structure is designed with retail success in mind, featuring attractive facades, optimal traffic flow, flexible interior configurations, and the infrastructure needed for modern retail operations.</p>
      <p class="mt-4">Whether you are testing a new market, expanding your retail presence, or need seasonal capacity, our modular retail solutions deliver the speed and flexibility you need while maintaining the quality and aesthetics your brand demands.</p>`,
      image: {
        url: getPlaceholderImage(800, 600, 'Retail Store'),
        alt: 'Modern modular retail store',
      },
    },
    solutions: [
      {
        name: 'Pop-Up Stores',
        description: 'Temporary retail spaces perfect for seasonal sales, product launches, market testing, and brand activations with eye-catching designs.',
        features: ['Quick setup and teardown', 'Fully customizable branding', 'Portable design', 'Climate controlled'],
        imageUrl: getPlaceholderImage(600, 400, 'Pop-Up Store'),
      },
      {
        name: 'Retail Showrooms',
        description: 'Professional showroom spaces for product displays, customer demonstrations, and sales presentations with premium finishes.',
        features: ['High-end finishes available', 'Flexible floor plans', 'Display lighting systems', 'Customer lounge areas'],
        imageUrl: getPlaceholderImage(600, 400, 'Showroom'),
      },
      {
        name: 'Kiosks & Small Format',
        description: 'Compact retail units ideal for malls, transportation hubs, events, and high-traffic locations requiring minimal footprint.',
        features: ['Compact footprint', 'High visibility design', 'Point of sale ready', 'Easy to relocate'],
        imageUrl: getPlaceholderImage(600, 400, 'Retail Kiosk'),
      },
      {
        name: 'Permanent Retail',
        description: 'Full-scale retail buildings designed for long-term use with all amenities including storage, offices, and customer facilities.',
        features: ['Permanent foundations', 'Full utility connections', 'ADA compliant', 'Expandable design'],
        imageUrl: getPlaceholderImage(600, 400, 'Retail Building'),
      },
    ],
    caseStudies: [
      {
        title: 'Seasonal Retail Village',
        location: 'Colorado, USA',
        description: 'Pop-up retail village with 20 modular stores for ski resort seasonal shopping, redeployed annually.',
        stats: [
          { label: 'Retail Units', value: '20' },
          { label: 'Setup Time', value: '5 days' },
          { label: 'Seasons Active', value: '4' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Retail Village'),
        href: '/projects/seasonal-retail-colorado',
      },
      {
        title: 'Auto Dealership Showroom',
        location: 'Nevada, USA',
        description: 'Premium modular showroom for automotive dealership with service reception and customer lounge.',
        stats: [
          { label: 'Showroom Area', value: '1,200 m2' },
          { label: 'Vehicle Display', value: '12 cars' },
          { label: 'Build Time', value: '8 weeks' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Auto Showroom'),
        href: '/projects/auto-dealership-nevada',
      },
      {
        title: 'Farmers Market Pavilion',
        location: 'Oregon, USA',
        description: 'Permanent covered market space with modular vendor stalls, community area, and food court.',
        stats: [
          { label: 'Vendor Stalls', value: '35' },
          { label: 'Total Area', value: '2,500 m2' },
          { label: 'Weekly Visitors', value: '5,000+' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Farmers Market'),
        href: '/projects/farmers-market-oregon',
      },
    ],
    faqs: [
      {
        question: 'How quickly can a pop-up retail store be deployed?',
        answer: 'Standard pop-up stores can be delivered and operational within 1-2 weeks. For events or urgent needs, we offer rapid deployment options with setup possible in as little as 24-48 hours for pre-configured units.',
      },
      {
        question: 'Can modular retail buildings match our brand aesthetics?',
        answer: 'Absolutely. We offer full customization including exterior cladding, signage integration, branded interiors, custom colors, and architectural features that align with your brand identity and standards.',
      },
      {
        question: 'Are the buildings suitable for permanent retail locations?',
        answer: 'Yes, our modular retail buildings are built to the same standards as traditional construction and can serve as permanent retail locations for decades. Many clients start with temporary intent and convert to permanent use.',
      },
      {
        question: 'What electrical and data infrastructure is included?',
        answer: 'Standard retail buildings include commercial electrical systems, LED lighting, point-of-sale connectivity, security system wiring, and internet/data cabling. Custom configurations are available based on your specific requirements.',
      },
      {
        question: 'Can the buildings accommodate refrigeration for food retail?',
        answer: 'Yes, we can integrate commercial refrigeration systems for food retail including walk-in coolers, display cases, and specialized HVAC. We work with food retail clients to meet all health and safety requirements.',
      },
      {
        question: 'What financing options are available for retail businesses?',
        answer: 'We offer various financing arrangements including lease programs for seasonal retailers, lease-to-own options, and traditional purchase financing. Our team can help structure solutions that work with your retail business model.',
      },
    ],
    locations: ['california', 'texas', 'florida', 'colorado', 'nevada'],
  },
  'events-hospitality': {
    slug: 'events-hospitality',
    name: 'Events & Hospitality',
    title: 'Modular Event & Hospitality Buildings',
    description: 'Temporary and permanent structures for events, festivals, hotels, resorts, and hospitality venues.',
    metaDescription: 'Modular Buildings Co provides modular event and hospitality solutions including temporary venues, VIP lounges, hotel rooms, and resort facilities. Perfect for festivals, conferences, and hospitality expansion.',
    icon: <Building2 className="w-8 h-8" />,
    bannerImage: getPlaceholderImage(1920, 400, 'Events Hospitality'),
    overview: {
      title: 'Exceptional Spaces for Memorable Experiences',
      content: `<p>The events and hospitality industry demands flexibility, quality, and the ability to create exceptional guest experiences in any location. Modular Buildings Co's modular solutions provide event planners and hospitality operators with versatile structures that can be deployed rapidly, customized extensively, and relocated as needs change.</p>
      <p class="mt-4">From temporary event structures and VIP hospitality units to permanent hotel expansions and resort facilities, our buildings are designed to meet the high standards of the hospitality industry. Premium finishes, comfortable interiors, and attention to guest experience are hallmarks of our event and hospitality solutions.</p>
      <p class="mt-4">Our experience includes major music festivals, sporting events, corporate conferences, film productions, and hotel chains worldwide. We understand the unique challenges of hospitality environments and deliver buildings that enhance rather than compromise the guest experience.</p>`,
      image: {
        url: getPlaceholderImage(800, 600, 'Event Venue'),
        alt: 'Modern modular event venue',
      },
    },
    solutions: [
      {
        name: 'Event Structures',
        description: 'Temporary venues, stages, backstage facilities, and support buildings for concerts, festivals, and special events.',
        features: ['Rapid deployment', 'Weather protection', 'Utilities included', 'Scalable configurations'],
        imageUrl: getPlaceholderImage(600, 400, 'Event Structure'),
      },
      {
        name: 'VIP & Hospitality',
        description: 'Premium hospitality suites, VIP lounges, green rooms, and exclusive spaces for high-end guest experiences.',
        features: ['Luxury finishes', 'Climate controlled', 'Private facilities', 'Catering ready'],
        imageUrl: getPlaceholderImage(600, 400, 'VIP Lounge'),
      },
      {
        name: 'Hotel & Lodging',
        description: 'Modular hotel rooms, suites, and accommodation units for hotel expansions, temporary lodging, and new developments.',
        features: ['Hotel-quality finishes', 'Ensuite bathrooms', 'Connectivity ready', 'Stackable modules'],
        imageUrl: getPlaceholderImage(600, 400, 'Hotel Room'),
      },
      {
        name: 'Resort Facilities',
        description: 'Cabins, bungalows, spa facilities, and amenity buildings for resorts, glamping sites, and vacation properties.',
        features: ['Natural aesthetics', 'Eco-friendly options', 'Spa-grade finishes', 'Outdoor integration'],
        imageUrl: getPlaceholderImage(600, 400, 'Resort Cabin'),
      },
    ],
    caseStudies: [
      {
        title: 'Music Festival Village',
        location: 'Tennessee, USA',
        description: 'Complete festival infrastructure including artist village, VIP hospitality, and staff facilities for major annual music festival.',
        stats: [
          { label: 'Structures', value: '75+' },
          { label: 'VIP Capacity', value: '2,000' },
          { label: 'Annual Events', value: '3' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Festival Village'),
        href: '/projects/music-festival-tennessee',
      },
      {
        title: 'Boutique Hotel Expansion',
        location: 'California, USA',
        description: 'Addition of 40 luxury modular suites to an existing boutique hotel, completed during off-season.',
        stats: [
          { label: 'New Suites', value: '40' },
          { label: 'Star Rating', value: '4-Star' },
          { label: 'Build Time', value: '4 months' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Hotel Expansion'),
        href: '/projects/boutique-hotel-california',
      },
      {
        title: 'Glamping Resort Development',
        location: 'Montana, USA',
        description: 'Eco-luxury glamping resort with 25 modular cabins, central lodge, and spa facilities in wilderness setting.',
        stats: [
          { label: 'Cabins', value: '25' },
          { label: 'Guest Capacity', value: '100' },
          { label: 'Eco Certified', value: 'Yes' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Glamping Resort'),
        href: '/projects/glamping-resort-montana',
      },
    ],
    faqs: [
      {
        question: 'How quickly can event structures be deployed and removed?',
        answer: 'Standard event structures can be installed in 1-3 days and removed in similar timeframes. For large festivals, we recommend 1-2 weeks for full installation. Our logistics team coordinates with event schedules to ensure timely setup and teardown.',
      },
      {
        question: 'Are the hospitality units suitable for luxury applications?',
        answer: 'Yes, we offer premium hospitality units with luxury finishes comparable to 4-5 star hotels. Options include high-end materials, custom furniture, designer bathrooms, and boutique hotel aesthetics.',
      },
      {
        question: 'Can modular hotel rooms meet brand standards for major hotel chains?',
        answer: 'Absolutely. We have worked with major hotel brands to deliver modular rooms that meet their brand standards and specifications. Rooms can be configured to match existing properties or create new design concepts.',
      },
      {
        question: 'What climate control options are available for outdoor events?',
        answer: 'Our event structures include HVAC systems capable of maintaining comfortable temperatures in extreme heat or cold. Heating, cooling, and humidity control options are available to suit any climate and season.',
      },
      {
        question: 'Do you provide turnkey event solutions including furniture and fixtures?',
        answer: 'Yes, we offer complete turnkey packages including furniture, fixtures, equipment, linens, and amenities. Our event specialists can coordinate with your design team or provide full interior design services.',
      },
      {
        question: 'Can the same units be used for multiple events throughout the year?',
        answer: 'Yes, our event structures are designed for repeated use. Many clients maintain inventory of modular event units that are deployed to multiple events annually, offering significant cost savings over one-time builds.',
      },
    ],
    locations: ['tennessee', 'california', 'nevada', 'florida', 'texas'],
  },
  manufacturing: {
    slug: 'manufacturing',
    name: 'Manufacturing',
    title: 'Modular Manufacturing Facilities',
    description: 'Industrial modular buildings for manufacturing operations including production facilities, cleanrooms, and warehouses.',
    metaDescription: 'Modular Buildings Co provides modular manufacturing facilities including production buildings, cleanrooms, warehouses, and industrial spaces. Quick expansion for manufacturing operations.',
    icon: <Building2 className="w-8 h-8" />,
    bannerImage: getPlaceholderImage(1920, 400, 'Manufacturing Facilities'),
    overview: {
      title: 'Industrial Spaces Built for Production Excellence',
      content: `<p>Manufacturing operations require buildings that support efficient production, meet industry regulations, and can adapt to changing production demands. Modular Buildings Co's modular manufacturing facilities provide the flexibility, quality, and rapid deployment that modern manufacturing requires.</p>
      <p class="mt-4">Our industrial modular buildings are engineered for manufacturing environments with appropriate structural capacity, utility systems, ventilation, and configurations optimized for production workflows. From cleanrooms and laboratories to assembly facilities and warehouses, we deliver spaces that enhance operational efficiency.</p>
      <p class="mt-4">The modular approach offers manufacturers significant advantages: faster time to production, phased expansion capabilities, the ability to relocate facilities if needed, and often lower total cost compared to traditional industrial construction. Our buildings meet the rigorous standards demanded by pharmaceutical, electronics, food processing, and other regulated industries.</p>`,
      image: {
        url: getPlaceholderImage(800, 600, 'Manufacturing Floor'),
        alt: 'Modern modular manufacturing facility',
      },
    },
    solutions: [
      {
        name: 'Production Facilities',
        description: 'Manufacturing buildings with appropriate structural capacity, utilities, and configurations for assembly, fabrication, and production operations.',
        features: ['Heavy floor loads', 'High ceilings available', 'Crane-ready options', 'Flexible layouts'],
        imageUrl: getPlaceholderImage(600, 400, 'Production Facility'),
      },
      {
        name: 'Cleanrooms',
        description: 'Controlled environment facilities meeting ISO cleanroom standards for pharmaceutical, electronics, and precision manufacturing.',
        features: ['ISO 5-8 classifications', 'HEPA filtration', 'Pressure control', 'Gowning rooms'],
        imageUrl: getPlaceholderImage(600, 400, 'Cleanroom'),
      },
      {
        name: 'Warehouses & Distribution',
        description: 'Storage and distribution facilities with loading docks, racking systems, and logistics infrastructure for efficient material handling.',
        features: ['Loading dock options', 'High-bay storage', 'Climate control available', 'Expandable design'],
        imageUrl: getPlaceholderImage(600, 400, 'Warehouse'),
      },
      {
        name: 'Quality & Testing Labs',
        description: 'Laboratory facilities for quality control, testing, and R&D with appropriate utilities, ventilation, and equipment accommodation.',
        features: ['Lab-grade finishes', 'Specialized ventilation', 'Equipment pads', 'Data infrastructure'],
        imageUrl: getPlaceholderImage(600, 400, 'Testing Lab'),
      },
    ],
    caseStudies: [
      {
        title: 'Pharmaceutical Cleanroom Facility',
        location: 'New Jersey, USA',
        description: 'ISO 7 cleanroom manufacturing facility for pharmaceutical production with full utility systems and regulatory compliance.',
        stats: [
          { label: 'Cleanroom Area', value: '2,000 m2' },
          { label: 'ISO Class', value: '7' },
          { label: 'Build Time', value: '6 months' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Pharma Cleanroom'),
        href: '/projects/pharma-cleanroom-new-jersey',
      },
      {
        title: 'Electronics Assembly Plant',
        location: 'Texas, USA',
        description: 'ESD-controlled assembly facility for electronics manufacturing with integrated testing areas and component storage.',
        stats: [
          { label: 'Production Area', value: '5,000 m2' },
          { label: 'Assembly Lines', value: '6' },
          { label: 'Employees', value: '200' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Electronics Plant'),
        href: '/projects/electronics-assembly-texas',
      },
      {
        title: 'Food Processing Expansion',
        location: 'California, USA',
        description: 'FDA-compliant food processing facility expansion with cold storage, processing areas, and packaging lines.',
        stats: [
          { label: 'Processing Area', value: '3,000 m2' },
          { label: 'Cold Storage', value: '500 m2' },
          { label: 'Daily Output', value: '+50%' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Food Processing'),
        href: '/projects/food-processing-california',
      },
    ],
    faqs: [
      {
        question: 'Can modular buildings support heavy manufacturing equipment?',
        answer: 'Yes, our manufacturing facilities are engineered for heavy loads. We offer reinforced floor systems supporting equipment up to 500 psf, crane rail systems, and foundations designed for specific equipment requirements.',
      },
      {
        question: 'How do cleanroom modules maintain required classifications?',
        answer: 'Our cleanroom modules are built with appropriate wall systems, ceiling grids, HEPA filtration, and pressure controls to achieve ISO 5-8 classifications. Modules are tested and certified upon installation to verify performance.',
      },
      {
        question: 'Can production facilities be expanded as demand grows?',
        answer: 'Absolutely. Modular construction is ideal for phased expansion. Initial facilities can be designed with future expansion in mind, and additional modules can be connected with minimal disruption to ongoing operations.',
      },
      {
        question: 'Do the buildings meet FDA and other regulatory requirements?',
        answer: 'Yes, we design and build facilities to meet FDA, cGMP, ISO, and other regulatory standards. Our team works with regulatory consultants to ensure facilities meet all applicable requirements for your industry.',
      },
      {
        question: 'What ventilation and environmental controls are available?',
        answer: 'We offer complete environmental control systems including HVAC, humidity control, air filtration, exhaust systems, and specialized ventilation for hazardous materials. Systems are designed to meet specific operational and regulatory requirements.',
      },
      {
        question: 'How does the construction timeline compare to traditional building?',
        answer: 'Modular manufacturing facilities are typically delivered 30-50% faster than traditional construction. While site work proceeds, modules are manufactured simultaneously, significantly reducing overall project duration.',
      },
    ],
    locations: ['texas', 'california', 'ohio', 'michigan', 'new-jersey'],
  },
  'oil-gas': {
    slug: 'oil-gas',
    name: 'Oil & Gas',
    title: 'Modular Oil & Gas Facilities',
    description: 'Rugged modular buildings for oil fields, refineries, and energy operations including offices, camps, and industrial facilities.',
    metaDescription: 'Modular Buildings Co provides modular oil and gas facilities including field offices, worker camps, control rooms, and industrial buildings. Built tough for remote and demanding energy environments.',
    icon: <Building2 className="w-8 h-8" />,
    bannerImage: getPlaceholderImage(1920, 400, 'Oil Gas Facilities'),
    overview: {
      title: 'Built Tough for Energy Industry Demands',
      content: `<p>The oil and gas industry operates in some of the most challenging environments on earth, requiring buildings that can withstand extreme conditions while providing safe, functional spaces for operations and personnel. Modular Buildings Co has extensive experience delivering modular solutions for upstream, midstream, and downstream energy operations.</p>
      <p class="mt-4">Our oil and gas facilities are engineered for harsh environments including extreme temperatures, high winds, corrosive atmospheres, and remote locations. From small wellsite offices to complete workforce camps housing thousands of workers, we deliver buildings that meet the rigorous standards of the energy industry.</p>
      <p class="mt-4">Speed of deployment is often critical in oil and gas operations. Our modular approach allows facilities to be operational in weeks rather than months, helping operators capitalize on opportunities and maintain production schedules. Buildings can be relocated as projects move, providing long-term value across multiple sites.</p>`,
      image: {
        url: getPlaceholderImage(800, 600, 'Oil Field Camp'),
        alt: 'Modular oil field worker camp',
      },
    },
    solutions: [
      {
        name: 'Field Offices',
        description: 'Rugged site offices for drilling operations, production sites, and field management with communications and data systems.',
        features: ['Blast-resistant options', 'Communication systems', 'All-weather design', 'Rapid deployment'],
        imageUrl: getPlaceholderImage(600, 400, 'Field Office'),
      },
      {
        name: 'Worker Camps',
        description: 'Complete workforce accommodation facilities including dormitories, dining, recreation, and support services for remote operations.',
        features: ['Full amenities', 'Scalable capacity', 'Remote site ready', 'Life support systems'],
        imageUrl: getPlaceholderImage(600, 400, 'Worker Camp'),
      },
      {
        name: 'Control Rooms',
        description: 'Process control rooms, monitoring stations, and technical facilities with appropriate equipment accommodation and safety features.',
        features: ['Equipment cooling', 'UPS systems', 'Fire suppression', 'Blast protection options'],
        imageUrl: getPlaceholderImage(600, 400, 'Control Room'),
      },
      {
        name: 'Industrial Facilities',
        description: 'Maintenance shops, warehouses, laboratories, and support buildings designed for oil and gas operational requirements.',
        features: ['Industrial-grade construction', 'Hazardous area ratings', 'Chemical resistant', 'Heavy equipment accommodation'],
        imageUrl: getPlaceholderImage(600, 400, 'Industrial Facility'),
      },
    ],
    caseStudies: [
      {
        title: 'Permian Basin Workforce Camp',
        location: 'Texas, USA',
        description: 'Complete workforce accommodation facility for 500 workers supporting drilling operations with full amenities and services.',
        stats: [
          { label: 'Worker Capacity', value: '500' },
          { label: 'Structures', value: '75' },
          { label: 'Setup Time', value: '45 days' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Permian Camp'),
        href: '/projects/permian-basin-camp',
      },
      {
        title: 'Offshore Platform Support',
        location: 'Gulf of Mexico',
        description: 'Helideck-compatible modular facilities for offshore platform including living quarters, offices, and control rooms.',
        stats: [
          { label: 'Modules', value: '12' },
          { label: 'Personnel', value: '80' },
          { label: 'Certified', value: 'ABS' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Offshore Platform'),
        href: '/projects/offshore-gulf-mexico',
      },
      {
        title: 'Arctic Operations Base',
        location: 'Alaska, USA',
        description: 'Extreme cold weather rated operations base with workshops, offices, and accommodation for remote arctic drilling program.',
        stats: [
          { label: 'Temperature Rating', value: '-50F' },
          { label: 'Total Area', value: '4,000 m2' },
          { label: 'Wind Rating', value: '150 mph' },
        ],
        imageUrl: getPlaceholderImage(600, 400, 'Arctic Base'),
        href: '/projects/arctic-operations-alaska',
      },
    ],
    faqs: [
      {
        question: 'How do the buildings perform in extreme temperatures?',
        answer: 'Our oil and gas buildings are rated for temperatures from -60F to +140F. Insulation systems, HVAC, and structural components are selected based on specific site conditions to ensure reliable performance in extreme environments.',
      },
      {
        question: 'Are blast-resistant buildings available?',
        answer: 'Yes, we offer blast-resistant modules meeting API RP 752 and API RP 753 standards. Various protection levels are available based on site-specific blast analysis and hazard assessments.',
      },
      {
        question: 'Can buildings be deployed to remote locations without infrastructure?',
        answer: 'Yes, our buildings are designed for remote deployment. Self-contained options include generators, water treatment, waste management, and satellite communications for locations without existing infrastructure.',
      },
      {
        question: 'What certifications do the buildings carry?',
        answer: 'Depending on application, our buildings can be certified by ABS, DNV, or other classification societies. We also provide documentation meeting client-specific requirements and industry standards.',
      },
      {
        question: 'How do you handle logistics for remote site delivery?',
        answer: 'We have extensive experience with challenging logistics including air transport, ice roads, sealift, and overland transport to remote locations. Our logistics team coordinates complex deliveries worldwide.',
      },
      {
        question: 'Can facilities be relocated between drilling sites?',
        answer: 'Yes, our oil and gas buildings are designed for multiple relocations. Modular construction allows facilities to be efficiently disassembled, transported, and reassembled at new sites as operations move.',
      },
    ],
    locations: ['texas', 'louisiana', 'oklahoma', 'alaska', 'north-dakota'],
  },
}

function getIndustryIcon(slug: string): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    construction: <Building2 className="w-6 h-6" />,
    medical: <Stethoscope className="w-6 h-6" />,
    government: <Landmark className="w-6 h-6" />,
    education: <GraduationCap className="w-6 h-6" />,
    religion: <Church className="w-6 h-6" />,
    retail: <Building2 className="w-6 h-6" />,
    'events-hospitality': <Building2 className="w-6 h-6" />,
    manufacturing: <Building2 className="w-6 h-6" />,
    'oil-gas': <Building2 className="w-6 h-6" />,
  }
  return icons[slug] || <Building2 className="w-6 h-6" />
}

export async function generateStaticParams() {
  return [
    { slug: 'construction' },
    { slug: 'medical' },
    { slug: 'government' },
    { slug: 'education' },
    { slug: 'religion' },
    { slug: 'retail' },
    { slug: 'events-hospitality' },
    { slug: 'manufacturing' },
    { slug: 'oil-gas' },
  ]
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  // Try to fetch from database first
  const slug = `industries/${params.slug}`
  const dbPage = await getPageBySlug(slug)

  if (dbPage) {
    return {
      title: dbPage.meta_title || `${dbPage.title} | Modular Buildings Co`,
      description: dbPage.meta_description || dbPage.content?.substring(0, 160),
      openGraph: {
        title: dbPage.og_title || dbPage.meta_title || dbPage.title,
        description: dbPage.og_description || dbPage.meta_description,
        images: dbPage.og_image ? [dbPage.og_image] : undefined,
      },
      alternates: {
        canonical: dbPage.canonical_url,
      },
    }
  }

  // Fallback to static data
  const industry = industriesData[params.slug]

  if (!industry) {
    return {
      title: 'Industry Not Found',
    }
  }

  return {
    title: `${industry.title} | Modular Buildings Co`,
    description: industry.metaDescription,
    openGraph: {
      title: industry.title,
      description: industry.metaDescription,
      images: [industry.bannerImage],
    },
  }
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  // Try to fetch from database
  const slug = `industries/${params.slug}`
  const dbPage = await getPageBySlug(slug)

  // Get static fallback data
  const staticIndustry = industriesData[params.slug]

  // If no database page and no static data, show 404
  if (!dbPage && !staticIndustry) {
    notFound()
  }

  // Use staticIndustry for backward compatibility with existing template
  const industry = staticIndustry

  // Get custom fields from database if available
  const customFields = (dbPage?.custom_fields || {}) as Record<string, unknown>

  // Merge FAQs - prefer database FAQs if available
  const faqs = mergeFAQs(dbPage?.faqs, industry?.faqs || [])

  // Override title/description from database if available
  const pageTitle = dbPage?.title || industry?.title || ''
  const pageName = (customFields.name as string) || industry?.name || ''

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Industries', href: '/industries' },
    { label: pageName, href: `/industries/${params.slug}` },
  ]

  const locationNames: Record<string, string> = {
    texas: 'Texas',
    california: 'California',
    florida: 'Florida',
    'new-york': 'New York',
    ohio: 'Ohio',
    illinois: 'Illinois',
    'washington-dc': 'Washington D.C.',
    virginia: 'Virginia',
    colorado: 'Colorado',
    arizona: 'Arizona',
    'north-carolina': 'North Carolina',
    georgia: 'Georgia',
    michigan: 'Michigan',
  }

  return (
    <>
      {/* Structured Data JSON-LD from database */}
      <StructuredDataScript structuredData={dbPage?.structured_data} />

      {/* Category Banner */}
      <CategoryBanner
        title={pageTitle}
        backgroundImage={industry?.bannerImage || getPlaceholderImage(1920, 400, pageTitle)}
        breadcrumbs={breadcrumbs}
      />

      {/* Industry Overview Section */}
      <ContentBlockSection
        title={industry.overview.title}
        content={industry.overview.content}
        layout="image-right"
        image={industry.overview.image}
        backgroundColor="white"
      />

      {/* Solutions Section */}
      <section className="py-12 md:py-16 bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Our {industry.name} Solutions
            </h2>
            <p className="text-lg text-mb-gray max-w-3xl mx-auto">
              Comprehensive modular building solutions designed specifically for {industry.name.toLowerCase()} industry requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industry.solutions.map((solution, index) => (
              <div
                key={index}
                className="bg-white rounded-mb-lg overflow-hidden border border-mb-border-gray hover:shadow-mb-hover transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={solution.imageUrl}
                    alt={solution.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-mb-dark mb-3">
                    {solution.name}
                  </h3>
                  <p className="text-mb-gray mb-4">
                    {solution.description}
                  </p>
                  <ul className="grid grid-cols-2 gap-2">
                    {solution.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-sm text-mb-gray">
                        <CheckCircle2 className="w-4 h-4 text-mb-navy flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-12 md:py-16 bg-mb-navy text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold mb-4">
              Why Choose Modular Buildings Co for {industry.name}
            </h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Industry-leading expertise and proven results for {industry.name.toLowerCase()} sector clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-mb-warning rounded-mb flex items-center justify-center">
                  <Clock className="w-6 h-6 text-mb-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rapid Deployment</h3>
                  <p className="text-sm opacity-90">Get operational faster with buildings delivered in weeks, not months.</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-mb-warning rounded-mb flex items-center justify-center">
                  <Shield className="w-6 h-6 text-mb-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Industry Compliance</h3>
                  <p className="text-sm opacity-90">Buildings designed to meet sector-specific regulations and standards.</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-mb-warning rounded-mb flex items-center justify-center">
                  <Award className="w-6 h-6 text-mb-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Proven Quality</h3>
                  <p className="text-sm opacity-90">ISO certified manufacturing with rigorous quality control processes.</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-mb-warning rounded-mb flex items-center justify-center">
                  <Users className="w-6 h-6 text-mb-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
                  <p className="text-sm opacity-90">Dedicated industry specialists guide your project from start to finish.</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-mb-warning rounded-mb flex items-center justify-center">
                  <Zap className="w-6 h-6 text-mb-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cost Effective</h3>
                  <p className="text-sm opacity-90">Save 20-40% compared to traditional construction methods.</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-mb-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-mb-warning rounded-mb flex items-center justify-center">
                  <Home className="w-6 h-6 text-mb-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Flexible Solutions</h3>
                  <p className="text-sm opacity-90">Expandable and relocatable buildings that adapt to your needs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              {industry.name} Projects & Case Studies
            </h2>
            <p className="text-lg text-mb-gray max-w-3xl mx-auto">
              See how we have helped {industry.name.toLowerCase()} sector clients achieve their facility goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {industry.caseStudies.map((study, index) => (
              <Link
                key={index}
                href={study.href}
                className="group bg-white rounded-mb-lg overflow-hidden border border-mb-border-gray hover:shadow-mb-hover transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={study.imageUrl}
                    alt={study.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-mb-gray mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{study.location}</span>
                  </div>
                  <h3 className="text-lg font-bold text-mb-dark mb-2 group-hover:text-mb-navy transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-sm text-mb-gray mb-4">
                    {study.description}
                  </p>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-mb-border-light">
                    {study.stats.map((stat, sIndex) => (
                      <div key={sIndex} className="text-center">
                        <div className="text-lg font-bold text-mb-navy">{stat.value}</div>
                        <div className="text-xs text-mb-gray">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Location Links Section */}
      <section className="py-12 md:py-16 bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              {industry.name} Solutions by Location
            </h2>
            <p className="text-lg text-mb-gray max-w-3xl mx-auto">
              We serve {industry.name.toLowerCase()} clients across the United States with local expertise and support.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {industry.locations.map((location) => (
              <Link
                key={location}
                href={`/industries/${industry.slug}/${location}`}
                className="flex items-center justify-center gap-2 p-4 bg-white rounded-mb border border-mb-border-gray hover:border-mb-navy hover:shadow-mb-hover transition-all text-mb-dark hover:text-mb-navy"
              >
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{locationNames[location] || location}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        questions={faqs}
        title={`Frequently Asked Questions About ${pageName} Solutions`}
        subtitle="Get answers to common questions about our industry-specific modular buildings"
        className="bg-white"
      />

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 bg-mb-bg-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
                Get a Custom Quote for Your {industry.name} Project
              </h2>
              <p className="text-lg text-mb-gray">
                Tell us about your project and our {industry.name.toLowerCase()} specialists will provide a detailed proposal within 48 hours.
              </p>
            </div>
            <div className="bg-white p-8 rounded-mb-lg border border-mb-border-gray">
              <ContactForm
                productInterest={`${industry.name} Industry Solutions`}
                sourcePage={`/industries/${industry.slug}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={`Ready to Build Your ${industry.name} Facility?`}
        subtitle="Let's Discuss Your Project"
        description="Our team of industry experts is ready to help you find the perfect modular solution. Get started with a free consultation today."
        primaryButton={{
          text: 'Request a Quote',
          href: '/contact?inquiry=quote',
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'View Products',
          href: '/products',
          variant: 'outline',
        }}
        variant="contained"
        backgroundColor="navy"
      />
    </>
  )
}
