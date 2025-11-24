import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductGrid } from '@/components/ui/ProductGrid'
import { Badge } from '@/components/ui/badge'
import { FAQSection, FAQItem } from '@/components/sections/FAQSection'
import { ContentBlockSection, ContentLayout } from '@/components/sections/ContentBlockSection'
import { CTASection, CTAButton } from '@/components/sections/CTASection'
import { InternalLinksSection, InternalLink } from '@/components/sections/InternalLinksSection'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Check, MapPin, Building2, Clock, Shield, Award } from 'lucide-react'
import { getPlaceholderImage } from '@/lib/placeholder-image'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

interface Product {
  id: string
  title: string
  slug: string
  category: string
  images: Array<{ url: string; alt?: string }>
  total_area?: number
  completion_days?: number
  is_featured?: boolean
  price_range?: string
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  banner_image_url?: string
  parent_id?: string
  is_active: boolean
  sort_order?: number
}

interface KeyFeature {
  icon: React.ReactNode
  title: string
  description: string
}

interface Application {
  name: string
  description: string
  imageUrl: string
}

interface Project {
  id: string
  title: string
  location: string
  imageUrl: string
  category: string
  completionTime: string
  href: string
}

async function getCategory(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return data as Category
}

async function getCategoryProducts(categorySlug: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', categorySlug)
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (data as Product[]) || []
}

async function getSubcategories(categorySlug: string): Promise<Category[]> {
  const category = await getCategory(categorySlug)
  if (!category) return []

  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('parent_id', category.id)
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    console.error('Error fetching subcategories:', error)
    return []
  }

  return (data as Category[]) || []
}

// Mock data generators for comprehensive content
function getMockProducts(categoryName: string): Product[] {
  return [
    {
      id: '1',
      title: `Premium ${categoryName} - Modern Design A`,
      slug: 'premium-modern-design-a',
      category: categoryName,
      images: [{ url: getPlaceholderImage(400, 300, `Premium ${categoryName}`), alt: 'Product 1' }],
      total_area: 120,
      completion_days: 30,
      is_featured: true,
      price_range: '$50,000 - $70,000'
    },
    {
      id: '2',
      title: `Compact ${categoryName} - Space Efficient`,
      slug: 'compact-space-efficient',
      category: categoryName,
      images: [{ url: getPlaceholderImage(400, 300, `Compact ${categoryName}`), alt: 'Product 2' }],
      total_area: 80,
      completion_days: 20,
      is_featured: true,
      price_range: '$35,000 - $45,000'
    },
    {
      id: '3',
      title: `Luxury ${categoryName} - Executive Suite`,
      slug: 'luxury-executive-suite',
      category: categoryName,
      images: [{ url: getPlaceholderImage(400, 300, `Luxury ${categoryName}`), alt: 'Product 3' }],
      total_area: 200,
      completion_days: 45,
      is_featured: false,
      price_range: '$90,000 - $120,000'
    },
    {
      id: '4',
      title: `Standard ${categoryName} - Classic Model`,
      slug: 'standard-classic-model',
      category: categoryName,
      images: [{ url: getPlaceholderImage(400, 300, `Standard ${categoryName}`), alt: 'Product 4' }],
      total_area: 100,
      completion_days: 25,
      is_featured: false,
      price_range: '$40,000 - $55,000'
    },
    {
      id: '5',
      title: `Eco-Friendly ${categoryName} - Green Design`,
      slug: 'eco-friendly-green-design',
      category: categoryName,
      images: [{ url: getPlaceholderImage(400, 300, `Eco ${categoryName}`), alt: 'Product 5' }],
      total_area: 150,
      completion_days: 35,
      is_featured: false,
      price_range: '$65,000 - $85,000'
    },
    {
      id: '6',
      title: `Multi-Purpose ${categoryName} - Versatile Layout`,
      slug: 'multi-purpose-versatile',
      category: categoryName,
      images: [{ url: getPlaceholderImage(400, 300, `Multi-Purpose ${categoryName}`), alt: 'Product 6' }],
      total_area: 180,
      completion_days: 40,
      is_featured: false,
      price_range: '$75,000 - $95,000'
    },
    {
      id: '7',
      title: `Industrial ${categoryName} - Heavy Duty`,
      slug: 'industrial-heavy-duty',
      category: categoryName,
      images: [{ url: getPlaceholderImage(400, 300, `Industrial ${categoryName}`), alt: 'Product 7' }],
      total_area: 250,
      completion_days: 50,
      is_featured: false,
      price_range: '$100,000 - $140,000'
    },
    {
      id: '8',
      title: `Portable ${categoryName} - Mobile Solution`,
      slug: 'portable-mobile-solution',
      category: categoryName,
      images: [{ url: getPlaceholderImage(400, 300, `Portable ${categoryName}`), alt: 'Product 8' }],
      total_area: 60,
      completion_days: 15,
      is_featured: false,
      price_range: '$25,000 - $35,000'
    },
    {
      id: '9',
      title: `Customizable ${categoryName} - Tailored Design`,
      slug: 'customizable-tailored',
      category: categoryName,
      images: [{ url: getPlaceholderImage(400, 300, `Custom ${categoryName}`), alt: 'Product 9' }],
      total_area: 140,
      completion_days: 38,
      is_featured: false,
      price_range: '$60,000 - $80,000'
    },
    {
      id: '10',
      title: `Budget ${categoryName} - Economical Choice`,
      slug: 'budget-economical',
      category: categoryName,
      images: [{ url: getPlaceholderImage(400, 300, `Budget ${categoryName}`), alt: 'Product 10' }],
      total_area: 70,
      completion_days: 18,
      is_featured: false,
      price_range: '$28,000 - $38,000'
    },
    {
      id: '11',
      title: `Smart ${categoryName} - Tech-Enabled`,
      slug: 'smart-tech-enabled',
      category: categoryName,
      images: [{ url: getPlaceholderImage(400, 300, `Smart ${categoryName}`), alt: 'Product 11' }],
      total_area: 130,
      completion_days: 32,
      is_featured: false,
      price_range: '$70,000 - $90,000'
    },
    {
      id: '12',
      title: `Deluxe ${categoryName} - Premium Package`,
      slug: 'deluxe-premium-package',
      category: categoryName,
      images: [{ url: getPlaceholderImage(400, 300, `Deluxe ${categoryName}`), alt: 'Product 12' }],
      total_area: 220,
      completion_days: 48,
      is_featured: false,
      price_range: '$110,000 - $150,000'
    }
  ]
}

function getMockFAQs(categoryName: string): FAQItem[] {
  return [
    {
      question: `What are the benefits of choosing ${categoryName}?`,
      answer: `Our ${categoryName} offer numerous advantages including rapid construction time, cost-effectiveness, superior quality control, and complete customization options. They are built to the highest standards using premium materials and can be delivered anywhere in the world. The modular construction process ensures consistent quality and reduces on-site construction time by up to 50%.`
    },
    {
      question: `How long does it take to manufacture and install ${categoryName}?`,
      answer: `Manufacturing typically takes 15-50 days depending on the size and complexity of your project. Installation is remarkably quick, usually completed within 1-3 days. The total project timeline from order to completion is generally 30-60 days, which is significantly faster than traditional construction methods. We provide detailed timeline estimates during the consultation phase.`
    },
    {
      question: `Can ${categoryName} be customized to my specific requirements?`,
      answer: `Absolutely! We offer extensive customization options for all our ${categoryName}. You can choose from various sizes, layouts, interior finishes, exterior cladding, door and window configurations, electrical and plumbing specifications, and more. Our design team works closely with you to create a solution that perfectly matches your needs and aesthetic preferences.`
    },
    {
      question: `What quality certifications do your ${categoryName} have?`,
      answer: `All our ${categoryName} meet international quality standards and are certified according to CE regulations, ISO 9001:2015 quality management standards, and comply with local building codes in most countries. We use only premium materials from trusted suppliers and conduct rigorous quality control inspections throughout the manufacturing process. Each unit comes with comprehensive documentation and warranty coverage.`
    },
    {
      question: `What maintenance is required for ${categoryName}?`,
      answer: `Our ${categoryName} are designed for minimal maintenance. Regular inspections of the roof, exterior cladding, and seals are recommended annually. The steel frame structure is highly durable and requires little upkeep. We provide detailed maintenance guidelines with every unit and offer ongoing support. Most clients find that basic cleaning and occasional minor touch-ups are sufficient to keep their units in excellent condition for decades.`
    }
  ]
}

function getMockKeyFeatures(): KeyFeature[] {
  return [
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Rapid Construction',
      description: 'Factory-built modules reduce on-site construction time by 50% compared to traditional methods.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Superior Quality',
      description: 'Manufactured in controlled factory conditions ensuring consistent quality and precision.'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Certified Standards',
      description: 'All products meet CE, ISO 9001:2015, and international building code requirements.'
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Full Customization',
      description: 'Extensive options for layouts, finishes, and features to match your exact specifications.'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Global Delivery',
      description: 'Worldwide shipping and installation support for projects in any location.'
    },
    {
      icon: <Check className="w-6 h-6" />,
      title: 'Turnkey Solutions',
      description: 'Complete packages including design, manufacturing, delivery, and installation services.'
    }
  ]
}

function getMockApplications(categoryName: string): Application[] {
  return [
    {
      name: 'Commercial Use',
      description: `Perfect for offices, retail spaces, restaurants, and commercial facilities requiring flexible, professional spaces.`,
      imageUrl: getPlaceholderImage(600, 400, 'Commercial Use')
    },
    {
      name: 'Residential Projects',
      description: `Ideal for housing solutions, vacation homes, student accommodation, and temporary residential needs.`,
      imageUrl: getPlaceholderImage(600, 400, 'Residential Projects')
    },
    {
      name: 'Industrial Applications',
      description: `Excellent for workshops, warehouses, storage facilities, and industrial operations.`,
      imageUrl: getPlaceholderImage(600, 400, 'Industrial Use')
    },
    {
      name: 'Emergency & Temporary',
      description: `Quick deployment for disaster relief, temporary facilities, construction site offices, and emergency housing.`,
      imageUrl: getPlaceholderImage(600, 400, 'Emergency Housing')
    }
  ]
}

function getMockProjects(categoryName: string): Project[] {
  return [
    {
      id: '1',
      title: `Modern Office Complex - ${categoryName}`,
      location: 'Istanbul, Turkey',
      imageUrl: getPlaceholderImage(600, 400, 'Office Complex'),
      category: categoryName,
      completionTime: '45 days',
      href: '/projects/modern-office-complex'
    },
    {
      id: '2',
      title: `Residential Community Development`,
      location: 'Dubai, UAE',
      imageUrl: getPlaceholderImage(600, 400, 'Residential Community'),
      category: categoryName,
      completionTime: '60 days',
      href: '/projects/residential-community'
    },
    {
      id: '3',
      title: `Industrial Warehouse Facility`,
      location: 'London, UK',
      imageUrl: getPlaceholderImage(600, 400, 'Warehouse Facility'),
      category: categoryName,
      completionTime: '35 days',
      href: '/projects/industrial-warehouse'
    }
  ]
}

function getMockRelatedCategories(): InternalLink[] {
  return [
    {
      title: 'Container Offices',
      url: '/category/container-offices',
      description: 'Modern workspace solutions with quick deployment and full customization options.'
    },
    {
      title: 'Prefabricated Houses',
      url: '/category/prefabricated-houses',
      description: 'Complete residential solutions designed for comfort, durability, and energy efficiency.'
    },
    {
      title: 'Modular Classrooms',
      url: '/category/modular-classrooms',
      description: 'Educational facilities with flexible layouts and modern learning environments.'
    },
    {
      title: 'Site Accommodation',
      url: '/category/site-accommodation',
      description: 'Temporary housing solutions for construction sites and remote work locations.'
    },
    {
      title: 'Healthcare Units',
      url: '/category/healthcare-units',
      description: 'Medical facilities including clinics, laboratories, and emergency response units.'
    },
    {
      title: 'Storage Solutions',
      url: '/category/storage-solutions',
      description: 'Secure storage containers and warehousing options for various applications.'
    }
  ]
}

function getMockContentBlocks(categoryName: string) {
  return [
    {
      title: `Why Choose Our ${categoryName}?`,
      content: `<p>At Modular Buildings Co, we specialize in delivering high-quality ${categoryName.toLowerCase()} that combine innovation, durability, and cost-effectiveness. Our modular construction approach offers significant advantages over traditional building methods, including faster project completion, reduced costs, and superior quality control.</p><p>Each unit is manufactured in our state-of-the-art facilities using premium materials and cutting-edge technology. Our experienced team ensures every detail meets the highest standards, from structural integrity to aesthetic appeal. Whether you need a single unit or a large-scale project, we provide comprehensive solutions tailored to your specific requirements.</p><p>With over 25 years of experience in the industry, we've successfully delivered thousands of projects worldwide. Our commitment to quality, innovation, and customer satisfaction has made us a trusted partner for businesses, governments, and individuals across the globe.</p>`,
      layout: 'image-right' as ContentLayout,
      image: {
        url: getPlaceholderImage(800, 600, 'Manufacturing Process'),
        alt: `${categoryName} Manufacturing Process`
      }
    },
    {
      title: 'Sustainable & Energy Efficient',
      content: `<p>Our ${categoryName.toLowerCase()} are designed with sustainability in mind. We use eco-friendly materials, implement energy-efficient systems, and minimize waste during the manufacturing process. The modular construction method itself reduces environmental impact by limiting on-site construction time and reducing material waste.</p><p>Each unit can be equipped with solar panels, high-performance insulation, LED lighting, and efficient HVAC systems to maximize energy efficiency. These features not only reduce environmental impact but also lower operational costs over the building's lifetime. We're committed to helping our clients achieve their sustainability goals while maintaining exceptional quality and functionality.</p>`,
      layout: 'image-left' as ContentLayout,
      image: {
        url: getPlaceholderImage(800, 600, 'Sustainable Building'),
        alt: 'Sustainable Construction'
      }
    }
  ]
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} | Modular Buildings Co`,
    description: category.description || `Browse our premium ${category.name.toLowerCase()} collection. Fast delivery, superior quality, and full customization options available.`,
    openGraph: {
      title: category.name,
      description: category.description || `Explore Modular Buildings Co's ${category.name.toLowerCase()} solutions`,
      images: category.banner_image_url ? [category.banner_image_url] : [],
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [dbCategory, dbProducts, subcategories] = await Promise.all([
    getCategory(params.slug),
    getCategoryProducts(params.slug),
    getSubcategories(params.slug),
  ])

  // Use database category if available, otherwise create mock category from slug
  const category = dbCategory || {
    id: params.slug,
    name: params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    slug: params.slug,
    description: `Explore our ${params.slug.replace(/-/g, ' ')} solutions`,
    is_active: true,
  }

  // Use database products if available, otherwise use mock data
  const products = dbProducts.length > 0 ? dbProducts : getMockProducts(category.name)
  const faqs = getMockFAQs(category.name)
  const keyFeatures = getMockKeyFeatures()
  const applications = getMockApplications(category.name)
  const projects = getMockProjects(category.name)
  const relatedCategories = getMockRelatedCategories()
  const contentBlocks = getMockContentBlocks(category.name)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: category.name, href: `/category/${params.slug}` },
  ]

  return (
    <>
      {/* 1. Category Banner */}
      <CategoryBanner
        title={category.name}
        backgroundImage={category.banner_image_url || getPlaceholderImage(1920, 400, category.name)}
        breadcrumbs={breadcrumbs}
      />

      {/* Main Content with Sidebar */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 2. Sidebar Navigation */}
            {subcategories.length > 0 && (
              <aside className="lg:col-span-1">
                <div className="bg-white border border-mb-border-gray rounded-mb p-6 sticky top-24">
                  <h3 className="font-semibold text-lg mb-4 text-mb-dark">Subcategories</h3>
                  <nav>
                    <ul className="space-y-2">
                      {subcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/category/${params.slug}/${sub.slug}`}
                            className="block py-2 px-3 rounded hover:bg-mb-bg-light hover:text-mb-navy transition-colors text-mb-gray"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Category Stats */}
                  <div className="mt-6 pt-6 border-t border-mb-border-gray">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-mb-gray">Products:</span>
                        <span className="font-semibold text-mb-dark">{products.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-mb-gray">Subcategories:</span>
                        <span className="font-semibold text-mb-dark">{subcategories.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            )}

            {/* Main Content */}
            <div className={subcategories.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}>
              {/* Category Description */}
              {category.description && (
                <div className="mb-8 p-6 bg-mb-bg-light rounded-mb-lg">
                  <p className="text-lg text-mb-gray leading-relaxed">{category.description}</p>
                </div>
              )}

              {/* 3. Product Grid */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-h2 font-bold text-mb-dark">
                    Available Products ({products.length})
                  </h2>
                  <Badge variant="primary">{products.filter(p => p.is_featured).length} Featured</Badge>
                </div>

                {products.length > 0 ? (
                  <ProductGrid columns={{ mobile: 1, tablet: 2, desktop: subcategories.length > 0 ? 2 : 3 }}>
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        title={product.title}
                        category={product.category}
                        imageUrl={product.images?.[0]?.url || getPlaceholderImage(400, 300, 'Product')}
                        href={`/products/${product.slug}`}
                        area={product.total_area}
                        completionDays={product.completion_days}
                      />
                    ))}
                  </ProductGrid>
                ) : (
                  <div className="text-center py-12 bg-mb-bg-light rounded-mb-lg">
                    <p className="text-mb-gray">No products found in this category.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Content Blocks - Educational Content */}
      {contentBlocks.map((block, index) => (
        <ContentBlockSection
          key={index}
          title={block.title}
          content={block.content}
          layout={block.layout}
          image={block.image}
          backgroundColor={index % 2 === 0 ? 'white' : 'light'}
        />
      ))}

      {/* 5. Key Features Section */}
      <section className="section-padding bg-mb-navy text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold mb-4">
              Why Choose Our {category.name}?
            </h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Discover the key advantages that make our products the preferred choice for projects worldwide.
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

      {/* 6. Applications Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Where Our {category.name} Are Used
            </h2>
            <p className="text-lg text-mb-gray max-w-3xl mx-auto">
              Our versatile solutions serve diverse industries and applications worldwide.
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

      {/* 9. Projects in This Category */}
      <section className="section-padding bg-mb-bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-mb-gray max-w-3xl mx-auto">
              Explore successful implementations of our {category.name.toLowerCase()} in real-world projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={project.href}
                className="group bg-white rounded-mb-lg overflow-hidden border border-mb-border-gray hover:shadow-mb-hover transition-all duration-300"
              >
                <div className="relative h-56">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="warning">{project.category}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-mb-dark mb-2 group-hover:text-mb-navy transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-mb-gray">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{project.completionTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <FAQSection
        questions={faqs}
        title={`Frequently Asked Questions About ${category.name}`}
        subtitle="Find answers to common questions about our products and services"
        className="bg-white"
      />

      {/* 8. Related Categories */}
      <InternalLinksSection
        links={relatedCategories}
        title="Explore Related Categories"
        subtitle="Discover other product categories that might interest you"
        columns={3}
        showIcon={true}
      />

      {/* 10. CTA Section */}
      <CTASection
        title={`Ready to Get Started with ${category.name}?`}
        subtitle="Contact Us Today"
        description="Our expert team is ready to help you find the perfect solution for your project. Get a free consultation and detailed quote within 24 hours."
        primaryButton={{
          text: 'Request a Quote',
          href: '/contact?inquiry=quote',
          variant: 'primary'
        }}
        secondaryButton={{
          text: 'View All Products',
          href: '/products',
          variant: 'outline'
        }}
        variant="contained"
        backgroundColor="navy"
      />
    </>
  )
}
