import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection, type FAQItem } from '@/components/sections/FAQSection'
import type { Metadata } from 'next'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest articles about prefabricated buildings, modular construction trends, and industry insights from Modular Buildings Co experts.',
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  readTime: number
  image: string
  featured: boolean
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Modular Construction: 2024 Trends & Innovations',
    slug: 'future-modular-construction-2024',
    excerpt: 'Explore the latest technological advancements transforming the modular construction industry and what they mean for your next project.',
    content: 'The modular construction industry is experiencing rapid growth and innovation. From advanced robotics to AI-driven design tools, technology is revolutionizing how we build...',
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
    category: 'Quality & Safety',
    author: 'Michael Chen',
    date: '2024-09-15',
    readTime: 6,
    image: getPlaceholderImage(800, 400, 'Quality Standards'),
    featured: false,
  },
]

const faqItems: FAQItem[] = [
  {
    question: 'How often does Modular Buildings Co publish new blog posts?',
    answer: 'We publish new articles twice a month, covering topics ranging from industry trends and case studies to construction tips and sustainability practices. Subscribe to our newsletter to stay updated on the latest insights.',
  },
  {
    question: 'Can I use these articles on my website?',
    answer: 'Our blog content is copyrighted material. If you\'d like to republish or feature our articles, please contact our marketing team at marketing@modular-buildings.co for permission and proper attribution.',
  },
  {
    question: 'Do you accept guest posts?',
    answer: 'Yes, we welcome contributions from industry experts and thought leaders. If you\'re interested in writing a guest post, please send us a pitch at blog@modular-buildings.co with your topic idea and credentials.',
  },
  {
    question: 'How can I stay updated with new blog posts?',
    answer: 'You can subscribe to our newsletter to receive weekly updates of new articles, industry insights, and special offers. Sign up at the bottom of the page or contact us for more information.',
  },
  {
    question: 'What topics do you cover in the blog?',
    answer: 'We cover a wide range of topics including construction trends, sustainability, case studies, cost analysis, quality assurance, and expert tips on modular and prefabricated building solutions.',
  },
  {
    question: 'Can I request a specific blog topic?',
    answer: 'Absolutely! We\'d love to hear from you. Send your topic suggestions to blog@modular-buildings.co, and our editorial team will consider them for future articles.',
  },
]

export default function BlogPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
  ]

  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  const categories = [...new Set(blogPosts.map(post => post.category))]

  return (
    <>
      <CategoryBanner
        title="Blog"
        backgroundImage={getPlaceholderImage(1920, 400, 'Blog')}
        breadcrumbs={breadcrumbs}
      />

      {/* Featured Posts Section */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-h2 font-bold mb-3 text-mb-dark">
            Featured Articles
          </h2>
          <p className="text-lg text-mb-gray mb-12 max-w-2xl">
            Read our latest in-depth articles on modular construction trends, case studies, and industry innovations.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {featuredPosts.slice(0, 2).map((post) => (
              <div
                key={post.id}
                className="group card overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Post Image */}
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="warning">{post.category}</Badge>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-mb-warning transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-mb-gray mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-mb-gray border-t border-mb-border-gray pt-4">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block mt-4 text-mb-warning font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-4 text-mb-dark">
              Browse by Category
            </h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-mb-navy text-white rounded-mb font-medium hover:bg-mb-navy/90 transition-colors">
                All Articles
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 border border-mb-border-gray text-mb-dark rounded-mb font-medium hover:border-mb-warning hover:text-mb-warning transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* All Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <div key={post.id} className="group card overflow-hidden hover:shadow-lg transition-shadow">
                {/* Post Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="gray">{post.category}</Badge>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-mb-warning transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-mb-gray mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center gap-3 text-xs text-mb-gray border-t border-mb-border-gray pt-3">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.readTime} min</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block mt-3 text-sm text-mb-warning font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-mb-navy text-mb-navy rounded-mb font-semibold hover:bg-mb-navy hover:text-white transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-mb-lg p-8 md:p-12 border border-mb-border-gray">
            <h3 className="text-2xl font-bold mb-3 text-mb-dark text-center">
              Subscribe to Our Blog
            </h3>
            <p className="text-mb-gray text-center mb-6">
              Get the latest articles, industry insights, and expert tips delivered to your inbox twice a month.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-mb-border-gray rounded-mb focus:outline-none focus:border-mb-warning"
                required
              />
              <button
                type="submit"
                className="w-full bg-mb-warning text-white py-3 rounded-mb font-semibold hover:bg-mb-warning/90 transition-colors"
              >
                Subscribe Now
              </button>
            </form>
            <p className="text-xs text-mb-gray text-center mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        questions={faqItems}
        title="Blog FAQ"
        subtitle="Find answers to common questions about our blog and content"
      />

      {/* CTA Section */}
      <CTASection
        title="Ready to Learn More?"
        subtitle="Expert Insights"
        description="Explore our comprehensive resources on modular construction, or contact our team for personalized guidance on your next project."
        primaryButton={{
          text: 'Contact Our Experts',
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
