import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { CTASection } from '@/components/sections/CTASection'
import type { Metadata } from 'next'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, Share2, Bookmark } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  fullContent?: string
  category: string
  author: string
  date: string
  readTime: number
  image: string
  featured: boolean
}

// This should match the data in /app/blog/page.tsx
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Modular Construction: 2024 Trends & Innovations',
    slug: 'future-modular-construction-2024',
    excerpt: 'Explore the latest technological advancements transforming the modular construction industry and what they mean for your next project.',
    content: 'The modular construction industry is experiencing rapid growth and innovation. From advanced robotics to AI-driven design tools, technology is revolutionizing how we build...',
    fullContent: `
      <h2>Introduction</h2>
      <p>The modular construction industry is experiencing unprecedented growth, driven by technological advancements, sustainability concerns, and the need for faster, more efficient building solutions. As we progress through 2024, several key trends are reshaping how we approach construction projects worldwide.</p>

      <h2>1. Advanced Robotics and Automation</h2>
      <p>Manufacturing facilities are increasingly adopting robotic systems for precision assembly of modular components. These automated processes ensure consistent quality, reduce human error, and significantly speed up production timelines. From welding and panel assembly to quality inspection, robots are becoming integral to the modular construction workflow.</p>

      <h2>2. AI-Driven Design Optimization</h2>
      <p>Artificial intelligence is revolutionizing how we design modular buildings. AI algorithms can now analyze thousands of design permutations, optimizing for factors like structural efficiency, energy performance, and cost-effectiveness. This technology enables architects and engineers to explore innovative solutions that would be impractical to develop manually.</p>

      <h2>3. Sustainable Materials and Practices</h2>
      <p>Environmental consciousness is driving the adoption of sustainable materials in modular construction. From recycled steel frames to bio-based insulation materials, manufacturers are prioritizing eco-friendly options without compromising structural integrity or performance. Additionally, the controlled factory environment minimizes material waste compared to traditional construction methods.</p>

      <h2>4. Digital Twin Technology</h2>
      <p>Creating digital replicas of physical buildings allows for better planning, monitoring, and maintenance throughout a structure's lifecycle. Digital twins enable real-time simulations, predictive maintenance, and performance optimization, providing unprecedented insight into building operations.</p>

      <h2>5. Integrated Smart Building Systems</h2>
      <p>Modular buildings are increasingly equipped with IoT sensors and smart systems from the factory floor. This integration includes climate control, security systems, energy management, and occupancy monitoring, all coordinated through centralized platforms for optimal efficiency and user comfort.</p>

      <h2>The Road Ahead</h2>
      <p>As these technologies mature and become more accessible, modular construction will continue to gain market share across residential, commercial, and industrial sectors. The combination of faster delivery, consistent quality, and sustainability advantages positions modular construction as a key solution for meeting global infrastructure demands.</p>

      <h2>Conclusion</h2>
      <p>The future of modular construction is bright, with technology enabling possibilities that were unimaginable just a decade ago. Companies that embrace these innovations will be well-positioned to lead the industry forward, delivering superior buildings in less time and with less environmental impact.</p>
    `,
    category: 'Industry Trends',
    author: 'Mehmet Johnson',
    date: '2024-11-15',
    readTime: 8,
    image: getPlaceholderImage(800, 400, 'Modular Construction 2024'),
    featured: true,
  },
  {
    id: '2',
    title: 'How Prefabricated Buildings Are Reducing Construction Time by 50%',
    slug: 'prefab-construction-time-savings',
    excerpt: 'Discover how our prefabricated construction methods are revolutionizing project timelines and delivering faster results without compromising quality.',
    content: 'Traditional construction projects can take months or even years to complete. But with prefabricated building solutions, we are achieving remarkable time savings...',
    fullContent: `
      <h2>The Time Challenge in Traditional Construction</h2>
      <p>Traditional construction methods are inherently sequential, with each phase depending on the completion of previous stages. Weather delays, labor shortages, and material delivery issues compound to create unpredictable timelines that frequently exceed original estimates.</p>

      <h2>The Prefabrication Advantage</h2>
      <p>Prefabricated construction fundamentally changes this equation by enabling parallel workflows. While site preparation occurs on location, building components are simultaneously manufactured in controlled factory environments. This dual-track approach can cut total project duration by 40-60% compared to conventional methods.</p>

      <h2>Real-World Time Savings</h2>
      <p>Consider a typical commercial office building: Traditional construction might require 12-18 months from groundbreaking to occupancy. With prefabrication, the same project can be completed in 6-9 months. For urgent needs like disaster relief housing or seasonal worker accommodations, this time difference is transformative.</p>

      <h2>Quality Through Standardization</h2>
      <p>Factory production environments enable rigorous quality control processes that would be impractical on construction sites. Components are built to precise specifications, inspected at multiple stages, and delivered ready for rapid assembly. This consistency actually improves quality while accelerating timelines.</p>

      <h2>Weather Independence</h2>
      <p>One of the most significant time-saving advantages is weather independence. Factory production continues regardless of rain, snow, or extreme temperatures. Only the final on-site assembly phase is weather-dependent, and even this is minimized through careful planning and rapid installation techniques.</p>

      <h2>Case Study: Corporate Campus Expansion</h2>
      <p>A recent project for a tech company required adding 15,000 square feet of office space to their existing campus. Using prefabrication, we completed the project in just 4 months from design approval to occupancy—a timeline that would have taken 9-12 months with traditional construction.</p>

      <h2>Cost Implications</h2>
      <p>Faster construction doesn't just save calendar time—it saves money. Reduced labor hours, shorter equipment rental periods, and earlier occupancy all contribute to significant cost advantages. For commercial projects, getting operations running months earlier can represent substantial revenue gains that dwarf construction cost savings.</p>
    `,
    category: 'Construction Tips',
    author: 'Sarah Johnson',
    date: '2024-11-08',
    readTime: 6,
    image: getPlaceholderImage(800, 400, 'Construction Time Savings'),
    featured: true,
  },
  {
    id: '3',
    title: 'Sustainable Modular Buildings: Building a Greener Future',
    slug: 'sustainable-modular-buildings',
    excerpt: 'Learn how modular construction is leading the way in sustainable building practices and environmental responsibility in the construction industry.',
    content: 'Environmental concerns are driving changes across all industries, and construction is no exception. Modular building techniques offer numerous sustainability benefits...',
    fullContent: `
      <h2>The Environmental Impact of Traditional Construction</h2>
      <p>Construction is one of the most resource-intensive industries globally, accounting for significant portions of energy consumption, raw material use, and waste generation. Traditional building methods generate substantial waste through material offcuts, packaging, and damaged materials exposed to weather.</p>

      <h2>How Modular Construction Reduces Environmental Impact</h2>
      <p>Factory-based modular construction dramatically improves environmental performance across multiple dimensions. Precise material ordering minimizes waste, while controlled environments enable efficient recycling and reuse of materials. Studies show modular construction can reduce material waste by 50-90% compared to site-built alternatives.</p>

      <h2>Energy Efficiency Benefits</h2>
      <p>Modern modular buildings incorporate advanced insulation systems, high-performance windows, and energy-efficient HVAC systems designed into the structure from the start. The precision of factory assembly eliminates air gaps and thermal bridges common in field construction, resulting in superior energy performance.</p>

      <h2>Sustainable Material Choices</h2>
      <p>Modular construction enables strategic material selection favoring sustainable options like recycled steel, FSC-certified wood, low-VOC finishes, and renewable insulation materials. Factory purchasing power and relationships with suppliers make sustainable materials more accessible and cost-effective.</p>

      <h2>Reduced Site Disturbance</h2>
      <p>Shortened on-site construction phases minimize environmental disruption to surrounding ecosystems. Reduced truck trips, shorter equipment operation periods, and smaller on-site crews all contribute to lower carbon emissions and less impact on local air quality and traffic.</p>

      <h2>Life Cycle Considerations</h2>
      <p>Modular buildings excel in life cycle sustainability. Components can be easily replaced or upgraded without major renovation work. At end of life, modular structures can be disassembled and relocated, with materials sorted efficiently for recycling—a stark contrast to demolition waste from conventional buildings.</p>

      <h2>Green Building Certifications</h2>
      <p>Modular construction aligns well with certification systems like LEED, BREEAM, and Living Building Challenge. The controlled manufacturing process, energy efficiency, and reduced waste make achieving certification targets more straightforward and predictable.</p>
    `,
    category: 'Sustainability',
    author: 'Emma Green',
    date: '2024-10-25',
    readTime: 7,
    image: getPlaceholderImage(800, 400, 'Green Buildings'),
    featured: false,
  },
  {
    id: '4',
    title: 'Case Study: Dubai School Project - Completing 14 Classrooms in 45 Days',
    slug: 'dubai-school-project-case-study',
    excerpt: 'See how Modular Buildings Co delivered a state-of-the-art school facility for Dubai in record time using advanced modular construction techniques.',
    content: 'The Dubai Education Development Authority faced a challenge: build a new school to accommodate 900 students in minimal time. Here\'s how we delivered...',
    fullContent: `
      <h2>Project Overview</h2>
      <p>The Dubai Education Development Authority required a new school facility capable of accommodating 900 students, including 14 fully-equipped classrooms and 4 science laboratories. The project had aggressive timeline requirements due to enrollment commitments for the upcoming academic year.</p>

      <h2>The Challenge</h2>
      <p>Traditional construction methods would require 8-12 months for a facility of this scope. However, only 45 days were available from project approval to facility handover. Additionally, the Dubai climate posed challenges with summer temperatures exceeding 45°C (113°F).</p>

      <h2>Our Solution</h2>
      <p>We proposed a modular approach utilizing our climate-optimized building systems. The project was divided into three parallel workstreams: site preparation, factory production of modules, and pre-commissioning of systems. This coordination was critical to meeting the compressed timeline.</p>

      <h2>Execution Timeline</h2>
      <ul>
        <li><strong>Days 1-7:</strong> Site preparation and foundation work began immediately while detailed engineering was finalized.</li>
        <li><strong>Days 8-35:</strong> Modules were manufactured in our facility with advanced HVAC systems rated for extreme climates, completed interior finishes, and pre-installed furniture and equipment.</li>
        <li><strong>Days 36-42:</strong> Module installation occurred rapidly with our specialized crews working extended hours. The structure took shape in less than one week.</li>
        <li><strong>Days 43-45:</strong> Final connections, systems testing, and facility commissioning were completed. The school passed all inspections on schedule.</li>
      </ul>

      <h2>Innovative Features</h2>
      <p>The facility incorporated several advanced features including high-efficiency cooling systems optimized for desert climates, solar shading integrated into the building design, advanced air filtration systems for sand and dust, and smart building controls for optimal energy management.</p>

      <h2>Results</h2>
      <p>The project was delivered on schedule and within budget, enabling the school to open for the academic year as planned. Post-occupancy monitoring showed the facility's energy consumption 30% below comparable traditionally-built schools, with exceptional indoor air quality and thermal comfort despite extreme external temperatures.</p>

      <h2>Client Feedback</h2>
      <p>"Modular Buildings Co delivered what seemed impossible. The quality exceeds our expectations, and the speed of construction was remarkable. Students and teachers love the facilities." - Dr. Ahmed Al-Mansoori, Director of Facilities, Dubai Education Development Authority</p>
    `,
    category: 'Case Studies',
    author: 'Modular Buildings Co Team',
    date: '2024-10-10',
    readTime: 9,
    image: getPlaceholderImage(800, 400, 'Dubai School Case Study'),
    featured: true,
  },
  {
    id: '5',
    title: 'Cost Comparison: Modular vs. Traditional Construction Methods',
    slug: 'modular-vs-traditional-costs',
    excerpt: 'Breaking down the financial advantages of modular construction and how it can deliver better ROI for your building projects.',
    content: 'When planning a construction project, cost is always a primary consideration. Let\'s compare modular construction with traditional methods and see where the savings come from...',
    fullContent: `
      <h2>Understanding the True Cost of Construction</h2>
      <p>Construction costs extend beyond initial building expenses to include financing costs, opportunity costs from delayed occupancy, and long-term operating expenses. A comprehensive cost analysis must consider all these factors for accurate comparison.</p>

      <h2>Direct Cost Comparison</h2>
      <p>On a per-square-foot basis, modular construction typically costs 10-20% less than comparable traditional construction. This advantage stems from factory efficiencies, bulk material purchasing, reduced waste, and shorter construction schedules requiring less financing.</p>

      <h2>Labor Cost Advantages</h2>
      <p>Factory production enables specialized labor working efficiently on repetitive tasks, contrasting with site construction's need for diverse skilled trades coordinating across potentially chaotic conditions. Additionally, modular construction is less vulnerable to labor shortages and regional wage variations.</p>

      <h2>Timeline-Related Savings</h2>
      <p>Faster construction generates significant financial benefits. For commercial projects, every month of delayed occupancy represents lost revenue and continued temporary space costs. For example, a retail facility generating $500,000 monthly revenue built 6 months faster represents $3 million in accelerated returns.</p>

      <h2>Reduced Risk and Overruns</h2>
      <p>Factory production provides predictable costs with reduced risk of weather delays, material damage, and field modifications. While traditional projects frequently exceed budgets by 10-20%, modular projects typically stay within 2-5% of initial estimates.</p>

      <h2>Operating Cost Performance</h2>
      <p>Superior assembly quality and advanced building systems result in lower operating costs. Modular buildings typically achieve 15-25% better energy performance than code-minimum requirements, generating ongoing savings throughout the building's lifecycle.</p>

      <h2>Long-Term Value Retention</h2>
      <p>Modular buildings maintain value exceptionally well due to quality construction, easy maintenance access, and potential for relocation or reconfiguration. These factors contribute to strong resale value and financing terms.</p>

      <h2>Case Example: 20,000 SF Office Building</h2>
      <p>Traditional construction: $3.5M construction, 14-month timeline, $85,000 monthly financing cost = $4.69M total. Modular construction: $3.0M construction, 7-month timeline, $75,000 monthly financing cost = $3.53M total. This represents $1.16M in savings—a 25% reduction in total project costs.</p>
    `,
    category: 'Industry Analysis',
    author: 'Robert Schmidt',
    date: '2024-09-28',
    readTime: 8,
    image: getPlaceholderImage(800, 400, 'Cost Analysis'),
    featured: false,
  },
  {
    id: '6',
    title: 'Quality Certifications: Why Modular Buildings Co\'s Standards Matter',
    slug: 'quality-certifications-matter',
    excerpt: 'Understanding the international certifications and quality standards that ensure every Modular Buildings Co building meets the highest safety and performance requirements.',
    content: 'In the construction industry, quality assurance is paramount. Modular Buildings Co holds multiple international certifications that guarantee the excellence of our products and services...',
    fullContent: `
      <h2>The Importance of Quality Standards</h2>
      <p>Quality certifications provide independent verification that products and processes meet recognized standards. For modular construction, these certifications ensure structural integrity, safety, environmental performance, and manufacturing consistency.</p>

      <h2>ISO 9001 Quality Management</h2>
      <p>Our ISO 9001 certification demonstrates commitment to consistent quality management across all operations. This encompasses design processes, manufacturing protocols, supplier management, and customer service. Regular audits verify ongoing compliance and drive continuous improvement.</p>

      <h2>Structural Engineering Certifications</h2>
      <p>All our buildings are engineered to relevant international codes including IBC (International Building Code), Eurocode, and regional standards. Our designs undergo third-party structural review and approval, ensuring safety under various load conditions including wind, snow, and seismic events.</p>

      <h2>Fire Safety Standards</h2>
      <p>We achieve Class A fire resistance ratings through careful material selection and system design. Our buildings meet or exceed requirements of NFPA (National Fire Protection Association) standards and local fire codes. Fire-rated assemblies are tested and certified by accredited laboratories.</p>

      <h2>Energy Performance Certifications</h2>
      <p>Our modular buildings can be certified under various green building programs including LEED, BREEAM, and ENERGY STAR. Factory quality control enables us to consistently achieve high performance ratings that would be challenging with field construction.</p>

      <h2>Material Certifications</h2>
      <p>We source materials from certified suppliers, ensuring quality and sustainability. Steel framing meets ASTM standards, insulation materials carry appropriate fire and thermal performance ratings, and finishes comply with low-VOC requirements for indoor air quality.</p>

      <h2>Manufacturing Quality Control</h2>
      <p>Our factory employs multi-stage inspection processes verified by quality control professionals. Unlike site construction where inspections occur after work is completed and may be hidden, our factory process enables inspection at every stage, catching potential issues immediately.</p>

      <h2>Third-Party Verification</h2>
      <p>Independent agencies regularly audit our facilities and randomly inspect completed modules. This external oversight provides customers confidence in our quality claims and ensures ongoing compliance with all applicable standards.</p>

      <h2>Warranty and Long-Term Performance</h2>
      <p>Our certifications enable us to offer comprehensive warranties covering structural elements, building envelope, and systems. These warranties reflect confidence in our manufacturing quality and provide customers peace of mind in their investment.</p>
    `,
    category: 'Quality & Safety',
    author: 'Michael Chen',
    date: '2024-09-15',
    readTime: 6,
    image: getPlaceholderImage(800, 400, 'Quality Standards'),
    featured: false,
  },
]

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const post = blogPosts.find(p => p.slug === slug)
  return post || null
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: `/blog/${post.slug}` },
  ]

  // Get related posts from same category
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3)

  return (
    <>
      <CategoryBanner
        title={post.title}
        backgroundImage={post.image}
        breadcrumbs={breadcrumbs}
      />

      {/* Article Content */}
      <article className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-mb-border-gray">
              <Badge variant="warning">{post.category}</Badge>
              <div className="flex items-center gap-2 text-sm text-mb-gray">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-mb-gray">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-mb-gray">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative h-96 rounded-mb-lg overflow-hidden mb-8">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Article Body */}
            <div
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.fullContent || post.content }}
            />

            {/* Share Buttons */}
            <div className="flex items-center gap-4 pt-8 border-t border-mb-border-gray">
              <span className="font-semibold text-mb-dark">Share this article:</span>
              <button className="flex items-center gap-2 px-4 py-2 border border-mb-border-gray rounded-mb hover:border-mb-warning hover:text-mb-warning transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-mb-border-gray rounded-mb hover:border-mb-warning hover:text-mb-warning transition-colors">
                <Bookmark className="w-4 h-4" />
                <span className="text-sm">Save</span>
              </button>
            </div>

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-mb-bg-light rounded-mb-lg">
              <h3 className="text-xl font-bold mb-2 text-mb-dark">About the Author</h3>
              <p className="text-mb-gray mb-3">
                <strong>{post.author}</strong> is a construction industry expert with extensive experience in modular building solutions and sustainable construction practices.
              </p>
              <p className="text-sm text-mb-gray">
                For more insights and articles, follow our blog for regular updates on modular construction trends, case studies, and industry analysis.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-mb-bg-light">
          <div className="container-custom">
            <h2 className="text-h2 font-bold mb-8 text-mb-dark">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="card overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <Badge variant="gray" className="mb-3">{relatedPost.category}</Badge>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-mb-warning transition-colors">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-mb-gray mb-3 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-mb-gray">
                      <span>{relatedPost.readTime} min read</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <CTASection
        title="Ready to Start Your Project?"
        subtitle="Talk to Our Experts"
        description="Interested in learning more about modular construction solutions for your project? Our team is ready to help you explore the possibilities."
        primaryButton={{
          text: 'Contact Us',
          href: '/contact',
          variant: 'primary',
        }}
        secondaryButton={{
          text: 'View Projects',
          href: '/projects',
          variant: 'outline',
        }}
        variant="full-width"
        backgroundColor="navy"
      />
    </>
  )
}
