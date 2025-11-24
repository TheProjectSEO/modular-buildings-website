import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { FAQSection, FAQItem } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { ContentBlockSection } from '@/components/sections/ContentBlockSection'
import { ContactForm } from '@/components/forms/ContactForm'
import { getPlaceholderImage } from '@/lib/placeholder-image'
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
  Phone,
  Mail,
  ArrowRight,
  Users,
  Zap,
  Home,
} from 'lucide-react'

interface IndustryLocationPageProps {
  params: {
    slug: string
    location: string
  }
}

interface LocationData {
  slug: string
  name: string
  state: string
  stateAbbr: string
  description: string
  highlights: string[]
  localProjects: {
    title: string
    description: string
    stats: { label: string; value: string }[]
    imageUrl: string
  }[]
}

interface IndustryInfo {
  slug: string
  name: string
  icon: React.ReactNode
  description: string
  solutions: string[]
}

const industries: Record<string, IndustryInfo> = {
  construction: {
    slug: 'construction',
    name: 'Construction',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Modular solutions for construction sites including offices, workforce housing, storage facilities, and temporary structures.',
    solutions: ['Site Offices', 'Workforce Housing', 'Storage & Warehouses', 'Guard Houses', 'Equipment Shelters', 'Meeting Facilities'],
  },
  medical: {
    slug: 'medical',
    name: 'Medical & Healthcare',
    icon: <Stethoscope className="w-6 h-6" />,
    description: 'Purpose-built healthcare facilities including clinics, laboratories, emergency response units, and medical administrative buildings.',
    solutions: ['Medical Clinics', 'Laboratory Facilities', 'Emergency Response Units', 'Vaccination Centers', 'Pharmacy Buildings', 'Administrative Offices'],
  },
  government: {
    slug: 'government',
    name: 'Government',
    icon: <Landmark className="w-6 h-6" />,
    description: 'Secure and compliant modular buildings for government agencies, military installations, and public services.',
    solutions: ['Administrative Offices', 'Military Facilities', 'Border Security', 'Public Service Centers', 'Emergency Management', 'Training Facilities'],
  },
  education: {
    slug: 'education',
    name: 'Education',
    icon: <GraduationCap className="w-6 h-6" />,
    description: 'Modern educational facilities including classrooms, administrative buildings, and student housing.',
    solutions: ['Classrooms', 'Administrative Buildings', 'Student Housing', 'Libraries', 'Science Labs', 'Cafeterias'],
  },
  religion: {
    slug: 'religion',
    name: 'Religious Institutions',
    icon: <Church className="w-6 h-6" />,
    description: 'Thoughtfully designed worship spaces, community halls, and fellowship buildings for religious organizations.',
    solutions: ['Worship Halls', 'Community Centers', 'Education Buildings', 'Fellowship Halls', 'Administrative Offices', 'Youth Centers'],
  },
}

const locations: Record<string, LocationData> = {
  texas: {
    slug: 'texas',
    name: 'Texas',
    state: 'Texas',
    stateAbbr: 'TX',
    description: 'The Lone Star State\'s booming economy and vast infrastructure needs make it a prime market for modular building solutions. From the energy sector in Houston to tech hubs in Austin, Modular Buildings Co serves diverse industries across Texas.',
    highlights: [
      'Serving major metros: Houston, Dallas, Austin, San Antonio',
      'Experienced with Texas building codes and permitting',
      'Climate-appropriate designs for hot summers',
      'Rapid response team based in Texas',
    ],
    localProjects: [
      {
        title: 'Oil Field Operations Center',
        description: 'Complete site operations facility including offices, housing for 200 workers, and equipment storage in the Permian Basin.',
        stats: [{ label: 'Workers', value: '200' }, { label: 'Buildings', value: '25' }, { label: 'Days', value: '45' }],
        imageUrl: getPlaceholderImage(600, 400, 'Texas Oil Field'),
      },
      {
        title: 'Austin School District Expansion',
        description: 'Addition of 16 modular classrooms to accommodate rapid enrollment growth in the Austin metro area.',
        stats: [{ label: 'Classrooms', value: '16' }, { label: 'Students', value: '480' }, { label: 'Weeks', value: '8' }],
        imageUrl: getPlaceholderImage(600, 400, 'Austin Schools'),
      },
    ],
  },
  california: {
    slug: 'california',
    name: 'California',
    state: 'California',
    stateAbbr: 'CA',
    description: 'California\'s stringent building codes and environmental requirements demand high-quality, compliant modular solutions. Modular Buildings Co delivers buildings that meet Title 24 and seismic requirements across the Golden State.',
    highlights: [
      'Title 24 compliant designs',
      'Seismic Zone 4 rated structures',
      'CARB compliant materials',
      'DSA pre-approval for school buildings',
    ],
    localProjects: [
      {
        title: 'Silicon Valley Tech Campus',
        description: 'Modular office complex providing flexible workspace for a growing technology company in the Bay Area.',
        stats: [{ label: 'Sq. Ft.', value: '45,000' }, { label: 'Employees', value: '350' }, { label: 'Months', value: '4' }],
        imageUrl: getPlaceholderImage(600, 400, 'Silicon Valley'),
      },
      {
        title: 'Los Angeles Healthcare Clinic',
        description: 'Community health clinic serving underserved populations with examination rooms, pharmacy, and administrative offices.',
        stats: [{ label: 'Exam Rooms', value: '12' }, { label: 'Daily Patients', value: '150' }, { label: 'Weeks', value: '10' }],
        imageUrl: getPlaceholderImage(600, 400, 'LA Clinic'),
      },
    ],
  },
  florida: {
    slug: 'florida',
    name: 'Florida',
    state: 'Florida',
    stateAbbr: 'FL',
    description: 'Florida\'s hurricane-prone environment requires specially engineered buildings. Modular Buildings Co provides hurricane-rated modular structures designed to withstand the Sunshine State\'s unique weather challenges.',
    highlights: [
      'Hurricane rated up to Category 4',
      'Florida Building Code compliant',
      'Moisture and humidity resistant',
      'Rapid post-storm deployment capability',
    ],
    localProjects: [
      {
        title: 'Miami Construction Site Complex',
        description: 'Hurricane-rated site offices and workforce housing for a major waterfront development project.',
        stats: [{ label: 'Wind Rating', value: '180 mph' }, { label: 'Units', value: '30' }, { label: 'Days', value: '21' }],
        imageUrl: getPlaceholderImage(600, 400, 'Miami Construction'),
      },
      {
        title: 'Orlando Church Campus',
        description: 'Complete worship facility including sanctuary, fellowship hall, and education wing for a growing congregation.',
        stats: [{ label: 'Seating', value: '400' }, { label: 'Sq. Ft.', value: '15,000' }, { label: 'Months', value: '5' }],
        imageUrl: getPlaceholderImage(600, 400, 'Orlando Church'),
      },
    ],
  },
  'new-york': {
    slug: 'new-york',
    name: 'New York',
    state: 'New York',
    stateAbbr: 'NY',
    description: 'New York\'s dense urban environment and strict building requirements demand innovative modular solutions. Modular Buildings Co navigates complex NYC DOB approvals and delivers quality buildings throughout the Empire State.',
    highlights: [
      'NYC DOB approval experience',
      'Compact designs for urban sites',
      'After-hours and weekend installation',
      'Union labor coordination',
    ],
    localProjects: [
      {
        title: 'Brooklyn Medical Facility',
        description: 'Urgent care clinic installed on a constrained urban lot with full medical capabilities.',
        stats: [{ label: 'Sq. Ft.', value: '3,500' }, { label: 'Exam Rooms', value: '8' }, { label: 'Days', value: '14' }],
        imageUrl: getPlaceholderImage(600, 400, 'Brooklyn Medical'),
      },
      {
        title: 'Upstate NY School Buildings',
        description: 'Modular classroom buildings for a rural school district with severe winter weather considerations.',
        stats: [{ label: 'Classrooms', value: '8' }, { label: 'Snow Load', value: '80 psf' }, { label: 'Weeks', value: '6' }],
        imageUrl: getPlaceholderImage(600, 400, 'NY School'),
      },
    ],
  },
  ohio: {
    slug: 'ohio',
    name: 'Ohio',
    state: 'Ohio',
    stateAbbr: 'OH',
    description: 'Ohio\'s diverse economy spans manufacturing, healthcare, education, and agriculture. Modular Buildings Co provides versatile modular solutions that serve the Buckeye State\'s varied industry needs.',
    highlights: [
      'Midwest regional distribution hub',
      'Cold weather construction expertise',
      'Manufacturing sector experience',
      'Cost-effective solutions',
    ],
    localProjects: [
      {
        title: 'Columbus Distribution Center',
        description: 'Administrative offices and break facilities for a major logistics hub operation.',
        stats: [{ label: 'Sq. Ft.', value: '12,000' }, { label: 'Employees', value: '150' }, { label: 'Weeks', value: '8' }],
        imageUrl: getPlaceholderImage(600, 400, 'Columbus Logistics'),
      },
      {
        title: 'Cleveland Clinic Expansion',
        description: 'Temporary clinic space during hospital renovation providing continuity of patient care.',
        stats: [{ label: 'Beds', value: '40' }, { label: 'Sq. Ft.', value: '8,000' }, { label: 'Days', value: '30' }],
        imageUrl: getPlaceholderImage(600, 400, 'Cleveland Clinic'),
      },
    ],
  },
  illinois: {
    slug: 'illinois',
    name: 'Illinois',
    state: 'Illinois',
    stateAbbr: 'IL',
    description: 'From Chicago\'s urban core to the agricultural heartland, Illinois presents diverse modular building opportunities. Modular Buildings Co delivers solutions across the Prairie State\'s varied landscapes and climates.',
    highlights: [
      'Chicago urban site expertise',
      'Extreme temperature performance',
      'Agricultural sector solutions',
      'Central location logistics advantage',
    ],
    localProjects: [
      {
        title: 'Chicago Construction Site Office',
        description: 'Multi-story modular office complex for a downtown high-rise construction project.',
        stats: [{ label: 'Stories', value: '3' }, { label: 'Offices', value: '24' }, { label: 'Days', value: '10' }],
        imageUrl: getPlaceholderImage(600, 400, 'Chicago Construction'),
      },
      {
        title: 'Rural Illinois Health Center',
        description: 'Primary care clinic bringing healthcare access to an underserved rural community.',
        stats: [{ label: 'Exam Rooms', value: '6' }, { label: 'Population Served', value: '5,000' }, { label: 'Weeks', value: '8' }],
        imageUrl: getPlaceholderImage(600, 400, 'Rural Clinic'),
      },
    ],
  },
  'washington-dc': {
    slug: 'washington-dc',
    name: 'Washington D.C.',
    state: 'District of Columbia',
    stateAbbr: 'DC',
    description: 'The nation\'s capital requires buildings that meet federal specifications and security requirements. Modular Buildings Co has extensive experience with GSA, DoD, and other federal agency projects in the DC metro area.',
    highlights: [
      'GSA Schedule contract holder',
      'Federal security clearance experience',
      'SCIF-capable configurations',
      'Historic district compatibility',
    ],
    localProjects: [
      {
        title: 'Federal Agency Office Complex',
        description: 'Secure administrative facility meeting federal building standards and security requirements.',
        stats: [{ label: 'Sq. Ft.', value: '25,000' }, { label: 'Security Level', value: 'FOUO' }, { label: 'Months', value: '6' }],
        imageUrl: getPlaceholderImage(600, 400, 'DC Federal'),
      },
      {
        title: 'Capitol Hill Temporary Facility',
        description: 'Swing space during major renovation of a government building on Capitol Hill.',
        stats: [{ label: 'Employees', value: '200' }, { label: 'Duration', value: '24 months' }, { label: 'Setup', value: '14 days' }],
        imageUrl: getPlaceholderImage(600, 400, 'Capitol Hill'),
      },
    ],
  },
  virginia: {
    slug: 'virginia',
    name: 'Virginia',
    state: 'Virginia',
    stateAbbr: 'VA',
    description: 'Virginia\'s proximity to Washington D.C. and strong military presence create demand for government and defense-related modular buildings. Modular Buildings Co serves the Commonwealth with compliant, secure solutions.',
    highlights: [
      'Military base experience',
      'DoD specification compliance',
      'Northern Virginia data center proximity',
      'Hampton Roads naval support',
    ],
    localProjects: [
      {
        title: 'Military Training Classrooms',
        description: 'Training facility classrooms and administrative offices at a Virginia military installation.',
        stats: [{ label: 'Classrooms', value: '12' }, { label: 'Capacity', value: '300' }, { label: 'Weeks', value: '10' }],
        imageUrl: getPlaceholderImage(600, 400, 'VA Military'),
      },
      {
        title: 'Northern VA Medical Office',
        description: 'Multi-specialty medical office building serving the fast-growing Northern Virginia region.',
        stats: [{ label: 'Specialties', value: '5' }, { label: 'Sq. Ft.', value: '10,000' }, { label: 'Months', value: '3' }],
        imageUrl: getPlaceholderImage(600, 400, 'NoVA Medical'),
      },
    ],
  },
  colorado: {
    slug: 'colorado',
    name: 'Colorado',
    state: 'Colorado',
    stateAbbr: 'CO',
    description: 'Colorado\'s high altitude and mountain terrain present unique construction challenges. Modular Buildings Co delivers buildings engineered for Colorado\'s climate extremes and varied elevations.',
    highlights: [
      'High altitude engineering',
      'Heavy snow load ratings',
      'Mountain access logistics',
      'Energy efficient designs',
    ],
    localProjects: [
      {
        title: 'Ski Resort Operations Building',
        description: 'Year-round operations facility at a major Colorado ski resort elevation of 10,000+ feet.',
        stats: [{ label: 'Elevation', value: '10,500 ft' }, { label: 'Snow Load', value: '100 psf' }, { label: 'Weeks', value: '6' }],
        imageUrl: getPlaceholderImage(600, 400, 'Colorado Ski'),
      },
      {
        title: 'Denver Area School Campus',
        description: 'Complete elementary school campus including classrooms, gymnasium, and administrative offices.',
        stats: [{ label: 'Students', value: '600' }, { label: 'Buildings', value: '6' }, { label: 'Months', value: '5' }],
        imageUrl: getPlaceholderImage(600, 400, 'Denver School'),
      },
    ],
  },
  arizona: {
    slug: 'arizona',
    name: 'Arizona',
    state: 'Arizona',
    stateAbbr: 'AZ',
    description: 'Arizona\'s desert climate demands buildings that perform in extreme heat. Modular Buildings Co provides modular solutions with superior insulation and cooling efficiency for the Grand Canyon State.',
    highlights: [
      'Extreme heat performance (120F+)',
      'High-efficiency HVAC systems',
      'UV-resistant materials',
      'Rapid Phoenix metro service',
    ],
    localProjects: [
      {
        title: 'Phoenix Charter School',
        description: 'K-8 charter school campus with heat-efficient classrooms and covered walkways.',
        stats: [{ label: 'Classrooms', value: '20' }, { label: 'Students', value: '500' }, { label: 'Months', value: '4' }],
        imageUrl: getPlaceholderImage(600, 400, 'Phoenix School'),
      },
      {
        title: 'Tucson Medical Clinic',
        description: 'Community health center serving the Tucson area with primary care and specialty services.',
        stats: [{ label: 'Exam Rooms', value: '10' }, { label: 'Providers', value: '8' }, { label: 'Weeks', value: '8' }],
        imageUrl: getPlaceholderImage(600, 400, 'Tucson Clinic'),
      },
    ],
  },
  'north-carolina': {
    slug: 'north-carolina',
    name: 'North Carolina',
    state: 'North Carolina',
    stateAbbr: 'NC',
    description: 'North Carolina\'s Research Triangle and growing coastal regions drive demand for quality modular buildings. Modular Buildings Co serves the Tar Heel State\'s diverse economy with versatile solutions.',
    highlights: [
      'Research Triangle experience',
      'Coastal hurricane ratings',
      'Growing manufacturing sector',
      'University and college projects',
    ],
    localProjects: [
      {
        title: 'Research Triangle Lab Building',
        description: 'Biotech laboratory facility with specialized ventilation and utility systems.',
        stats: [{ label: 'Lab Space', value: '8,000 sf' }, { label: 'Fume Hoods', value: '12' }, { label: 'Months', value: '4' }],
        imageUrl: getPlaceholderImage(600, 400, 'RTP Lab'),
      },
      {
        title: 'Charlotte Church Campus',
        description: 'Multi-building worship campus for a rapidly growing Charlotte area congregation.',
        stats: [{ label: 'Seating', value: '800' }, { label: 'Buildings', value: '4' }, { label: 'Months', value: '6' }],
        imageUrl: getPlaceholderImage(600, 400, 'Charlotte Church'),
      },
    ],
  },
  georgia: {
    slug: 'georgia',
    name: 'Georgia',
    state: 'Georgia',
    stateAbbr: 'GA',
    description: 'Georgia\'s growing metro Atlanta region and diverse industries create strong demand for modular buildings. Modular Buildings Co provides solutions from the coast to the mountains of the Peach State.',
    highlights: [
      'Atlanta metro rapid service',
      'Port of Savannah logistics',
      'Film industry set buildings',
      'Agricultural sector support',
    ],
    localProjects: [
      {
        title: 'Atlanta Film Production Office',
        description: 'Production offices and support facilities for a major film studio project.',
        stats: [{ label: 'Offices', value: '30' }, { label: 'Sq. Ft.', value: '15,000' }, { label: 'Days', value: '21' }],
        imageUrl: getPlaceholderImage(600, 400, 'Atlanta Film'),
      },
      {
        title: 'Savannah Port Operations',
        description: 'Administrative and worker facilities supporting port expansion operations.',
        stats: [{ label: 'Workers', value: '150' }, { label: 'Buildings', value: '8' }, { label: 'Weeks', value: '6' }],
        imageUrl: getPlaceholderImage(600, 400, 'Savannah Port'),
      },
    ],
  },
  michigan: {
    slug: 'michigan',
    name: 'Michigan',
    state: 'Michigan',
    stateAbbr: 'MI',
    description: 'Michigan\'s automotive heritage and Great Lakes environment shape unique modular building needs. Modular Buildings Co delivers cold-weather performance and industrial quality throughout the Wolverine State.',
    highlights: [
      'Automotive industry experience',
      'Extreme cold weather ratings',
      'Great Lakes moisture management',
      'Manufacturing facility support',
    ],
    localProjects: [
      {
        title: 'Detroit Auto Plant Expansion',
        description: 'Administrative offices and training facilities for an automotive manufacturing expansion.',
        stats: [{ label: 'Sq. Ft.', value: '20,000' }, { label: 'Training Rooms', value: '6' }, { label: 'Months', value: '3' }],
        imageUrl: getPlaceholderImage(600, 400, 'Detroit Auto'),
      },
      {
        title: 'Grand Rapids Medical Center',
        description: 'Outpatient medical facility with imaging, lab, and primary care services.',
        stats: [{ label: 'Services', value: '8' }, { label: 'Daily Patients', value: '100' }, { label: 'Weeks', value: '10' }],
        imageUrl: getPlaceholderImage(600, 400, 'GR Medical'),
      },
    ],
  },
}

function generateLocationFAQs(industry: IndustryInfo, location: LocationData): FAQItem[] {
  return [
    {
      question: `What ${industry.name.toLowerCase()} modular building solutions does Modular Buildings Co offer in ${location.name}?`,
      answer: `Modular Buildings Co offers comprehensive ${industry.name.toLowerCase()} modular solutions in ${location.name} including ${industry.solutions.slice(0, 4).join(', ')}, and more. All buildings are designed to meet ${location.name} building codes and local requirements while providing rapid deployment and cost-effective alternatives to traditional construction.`,
    },
    {
      question: `How quickly can Modular Buildings Co deliver modular buildings to ${location.name}?`,
      answer: `Delivery times to ${location.name} typically range from 2-6 weeks depending on the building type and customization requirements. Our strategic logistics network ensures efficient delivery throughout ${location.state}. For urgent needs, we offer expedited production and delivery options.`,
    },
    {
      question: `Are Modular Buildings Co buildings compliant with ${location.name} building codes?`,
      answer: `Yes, all Modular Buildings Co modular buildings delivered to ${location.name} are designed and manufactured to comply with ${location.state} building codes and local jurisdiction requirements. Our engineering team stays current with ${location.stateAbbr} code updates and works with local authorities to ensure smooth permitting.`,
    },
    {
      question: `Does Modular Buildings Co provide installation services in ${location.name}?`,
      answer: `Yes, Modular Buildings Co provides complete turnkey services in ${location.name} including site preparation guidance, delivery, installation, and finishing. Our experienced installation crews are familiar with ${location.state} requirements and local conditions, ensuring professional results.`,
    },
    {
      question: `What warranty and support does Modular Buildings Co offer in ${location.name}?`,
      answer: `Modular Buildings Co provides comprehensive warranty coverage for all buildings delivered to ${location.name}, including 10-year structural warranty, 5-year exterior warranty, and 2-year systems warranty. We maintain service capabilities throughout ${location.state} for ongoing support and maintenance needs.`,
    },
    {
      question: `Can Modular Buildings Co buildings in ${location.name} be relocated or expanded later?`,
      answer: `Yes, Modular Buildings Co modular buildings are designed for flexibility. Buildings installed in ${location.name} can be relocated to new sites within ${location.state} or elsewhere, and can be expanded by adding additional modules. This adaptability makes modular construction ideal for organizations with changing needs.`,
    },
    {
      question: `What is the cost advantage of modular construction in ${location.name}?`,
      answer: `Modular construction typically offers 20-40% cost savings compared to traditional construction in ${location.name}. Savings come from reduced construction time, lower labor costs, minimized site disruption, and factory efficiency. Contact us for a detailed cost comparison for your specific project.`,
    },
    {
      question: `How does Modular Buildings Co handle ${location.name}'s climate considerations?`,
      answer: `Modular Buildings Co engineers buildings specifically for ${location.name}'s climate conditions. Our buildings feature appropriate insulation values, HVAC sizing, and material selections to ensure comfort and efficiency year-round. We address region-specific concerns such as ${location.highlights[2] || 'local weather patterns'}.`,
    },
  ]
}

export async function generateStaticParams() {
  const industryLocationPairs = [
    // Construction industry locations
    { slug: 'construction', location: 'texas' },
    { slug: 'construction', location: 'california' },
    { slug: 'construction', location: 'florida' },
    { slug: 'construction', location: 'new-york' },
    { slug: 'construction', location: 'ohio' },
    // Medical industry locations
    { slug: 'medical', location: 'california' },
    { slug: 'medical', location: 'texas' },
    { slug: 'medical', location: 'new-york' },
    { slug: 'medical', location: 'florida' },
    { slug: 'medical', location: 'illinois' },
    // Government industry locations
    { slug: 'government', location: 'washington-dc' },
    { slug: 'government', location: 'virginia' },
    { slug: 'government', location: 'texas' },
    { slug: 'government', location: 'california' },
    { slug: 'government', location: 'colorado' },
    // Education industry locations
    { slug: 'education', location: 'california' },
    { slug: 'education', location: 'texas' },
    { slug: 'education', location: 'florida' },
    { slug: 'education', location: 'arizona' },
    { slug: 'education', location: 'north-carolina' },
    // Religion industry locations
    { slug: 'religion', location: 'georgia' },
    { slug: 'religion', location: 'texas' },
    { slug: 'religion', location: 'california' },
    { slug: 'religion', location: 'michigan' },
    { slug: 'religion', location: 'ohio' },
  ]

  return industryLocationPairs
}

export async function generateMetadata({ params }: IndustryLocationPageProps): Promise<Metadata> {
  const industry = industries[params.slug]
  const location = locations[params.location]

  if (!industry || !location) {
    return {
      title: 'Page Not Found',
    }
  }

  const title = `${industry.name} Modular Buildings in ${location.name} | Modular Buildings Co`
  const description = `Modular Buildings Co provides ${industry.name.toLowerCase()} modular building solutions in ${location.name}. ${industry.solutions.slice(0, 3).join(', ')}, and more. Fast delivery, local expertise, competitive pricing.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [getPlaceholderImage(1200, 630, `${industry.name} ${location.name}`)],
    },
  }
}

export default function IndustryLocationPage({ params }: IndustryLocationPageProps) {
  const industry = industries[params.slug]
  const location = locations[params.location]

  if (!industry || !location) {
    notFound()
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Industries', href: '/industries' },
    { label: industry.name, href: `/industries/${industry.slug}` },
    { label: location.name, href: `/industries/${industry.slug}/${location.slug}` },
  ]

  const faqs = generateLocationFAQs(industry, location)

  return (
    <>
      {/* Category Banner */}
      <CategoryBanner
        title={`${industry.name} Buildings in ${location.name}`}
        backgroundImage={getPlaceholderImage(1920, 400, `${industry.name} ${location.name}`)}
        breadcrumbs={breadcrumbs}
      />

      {/* Location Overview Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-6">
                {industry.name} Modular Solutions in {location.name}
              </h2>
              <p className="text-lg text-mb-gray mb-6 leading-relaxed">
                {location.description}
              </p>
              <p className="text-base text-mb-gray mb-8 leading-relaxed">
                {industry.description} Modular Buildings Co brings decades of experience and local expertise to serve {industry.name.toLowerCase()} clients throughout {location.state} with quality modular buildings that meet your specific requirements and local code compliance.
              </p>

              {/* Location Highlights */}
              <div className="bg-mb-bg-light p-6 rounded-mb-lg mb-8">
                <h3 className="text-lg font-bold text-mb-dark mb-4">
                  Why Choose Modular Buildings Co in {location.name}
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {location.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-mb-navy flex-shrink-0 mt-0.5" />
                      <span className="text-mb-gray">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Available Solutions */}
              <h3 className="text-xl font-bold text-mb-dark mb-4">
                {industry.name} Solutions Available in {location.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {industry.solutions.map((solution, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-white border border-mb-border-gray rounded-mb hover:border-mb-navy transition-colors"
                  >
                    <div className="w-10 h-10 bg-mb-navy/10 rounded-mb flex items-center justify-center text-mb-navy">
                      {industry.icon}
                    </div>
                    <span className="text-sm font-medium text-mb-dark">{solution}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar - Quick Contact */}
            <div className="lg:col-span-1">
              <div className="bg-mb-navy text-white p-6 rounded-mb-lg sticky top-24">
                <h3 className="text-xl font-bold mb-4">Get a Quote for {location.name}</h3>
                <p className="text-sm opacity-90 mb-6">
                  Contact our {location.name} team for immediate assistance with your {industry.name.toLowerCase()} project.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-mb-warning rounded-mb flex items-center justify-center">
                      <Phone className="w-5 h-5 text-mb-dark" />
                    </div>
                    <div>
                      <div className="text-xs opacity-80">Call Us</div>
                      <div className="font-semibold">1-800-MODULAR</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-mb-warning rounded-mb flex items-center justify-center">
                      <Mail className="w-5 h-5 text-mb-dark" />
                    </div>
                    <div>
                      <div className="text-xs opacity-80">Email</div>
                      <div className="font-semibold">sales@modular-buildings.co</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-mb-warning rounded-mb flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-mb-dark" />
                    </div>
                    <div>
                      <div className="text-xs opacity-80">Service Area</div>
                      <div className="font-semibold">{location.state}</div>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/contact?industry=${industry.slug}&location=${location.slug}`}
                  className="block w-full bg-mb-warning text-mb-dark text-center py-3 rounded-mb font-semibold hover:bg-yellow-400 transition-colors"
                >
                  Request Free Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-12 md:py-16 bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Benefits of Modular {industry.name} Buildings
            </h2>
            <p className="text-lg text-mb-gray max-w-3xl mx-auto">
              Why {location.name} organizations choose Modular Buildings Co modular construction for their {industry.name.toLowerCase()} facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-mb-lg border border-mb-border-gray">
              <div className="w-12 h-12 bg-mb-navy/10 rounded-mb flex items-center justify-center text-mb-navy mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-mb-dark mb-2">50% Faster</h3>
              <p className="text-sm text-mb-gray">Modular construction reduces project timelines by up to 50% compared to traditional methods.</p>
            </div>
            <div className="bg-white p-6 rounded-mb-lg border border-mb-border-gray">
              <div className="w-12 h-12 bg-mb-navy/10 rounded-mb flex items-center justify-center text-mb-navy mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-mb-dark mb-2">30% Savings</h3>
              <p className="text-sm text-mb-gray">Factory efficiency and reduced site work typically save 20-40% on total project costs.</p>
            </div>
            <div className="bg-white p-6 rounded-mb-lg border border-mb-border-gray">
              <div className="w-12 h-12 bg-mb-navy/10 rounded-mb flex items-center justify-center text-mb-navy mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-mb-dark mb-2">Superior Quality</h3>
              <p className="text-sm text-mb-gray">Factory-controlled manufacturing ensures consistent quality and precision in every building.</p>
            </div>
            <div className="bg-white p-6 rounded-mb-lg border border-mb-border-gray">
              <div className="w-12 h-12 bg-mb-navy/10 rounded-mb flex items-center justify-center text-mb-navy mb-4">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-mb-dark mb-2">Flexible Design</h3>
              <p className="text-sm text-mb-gray">Expandable, reconfigurable, and relocatable buildings that adapt to your changing needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Projects Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              {industry.name} Projects in {location.name}
            </h2>
            <p className="text-lg text-mb-gray max-w-3xl mx-auto">
              Recent {industry.name.toLowerCase()} building projects completed by Modular Buildings Co in {location.state}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {location.localProjects.map((project, index) => (
              <div
                key={index}
                className="bg-white rounded-mb-lg overflow-hidden border border-mb-border-gray hover:shadow-mb-hover transition-all duration-300"
              >
                <div className="relative h-56">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4 bg-mb-navy text-white px-3 py-1 rounded-mb text-sm font-medium">
                    {location.name}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-mb-dark mb-2">
                    {project.title}
                  </h3>
                  <p className="text-mb-gray mb-4">
                    {project.description}
                  </p>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-mb-border-light">
                    {project.stats.map((stat, sIndex) => (
                      <div key={sIndex} className="text-center">
                        <div className="text-lg font-bold text-mb-navy">{stat.value}</div>
                        <div className="text-xs text-mb-gray">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-mb-navy font-semibold hover:gap-3 transition-all"
            >
              View All Projects
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Service Process Section */}
      <section className="py-12 md:py-16 bg-mb-navy text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold mb-4">
              Our Process in {location.name}
            </h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              From consultation to installation, here is how we deliver your {industry.name.toLowerCase()} building project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-mb-warning rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-mb-dark">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Consultation</h3>
              <p className="text-sm opacity-80">Discuss your requirements with our {location.name} team and receive a custom proposal.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-mb-warning rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-mb-dark">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Design</h3>
              <p className="text-sm opacity-80">Our engineers create detailed plans meeting {location.stateAbbr} codes and your specifications.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-mb-warning rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-mb-dark">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Manufacturing</h3>
              <p className="text-sm opacity-80">Your building is manufactured in our factory with rigorous quality control.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-mb-warning rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-mb-dark">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Delivery & Install</h3>
              <p className="text-sm opacity-80">Professional delivery and installation at your {location.name} site.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        questions={faqs}
        title={`FAQ: ${industry.name} Buildings in ${location.name}`}
        subtitle={`Common questions about Modular Buildings Co${industry.name.toLowerCase()} solutions in ${location.state}`}
        className="bg-white"
      />

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 bg-mb-bg-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
                Request a Quote for {location.name}
              </h2>
              <p className="text-lg text-mb-gray">
                Tell us about your {industry.name.toLowerCase()} project in {location.state} and receive a detailed proposal within 48 hours.
              </p>
            </div>
            <div className="bg-white p-8 rounded-mb-lg border border-mb-border-gray">
              <ContactForm
                productInterest={`${industry.name} - ${location.name}`}
                sourcePage={`/industries/${industry.slug}/${location.slug}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={`Build Your ${industry.name} Facility in ${location.name}`}
        subtitle="Get Started Today"
        description={`Our ${location.name} team is ready to help you with your ${industry.name.toLowerCase()} modular building project. Contact us for a free consultation and competitive quote.`}
        primaryButton={{
          text: 'Request a Quote',
          href: `/contact?industry=${industry.slug}&location=${location.slug}`,
          variant: 'warning',
        }}
        secondaryButton={{
          text: 'View All Solutions',
          href: `/industries/${industry.slug}`,
          variant: 'outline',
        }}
        variant="contained"
        backgroundColor="navy"
      />
    </>
  )
}
