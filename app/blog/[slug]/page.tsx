import { CategoryBanner } from '@/components/ui/CategoryBanner'
import { CTASection } from '@/components/sections/CTASection'
import { Callout } from '@/components/ui/Callout'
import type { Metadata } from 'next'
import { getPlaceholderImage } from '@/lib/placeholder-image'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, Share2, Bookmark } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase'
import { generateBlogPostSchema } from '@/lib/schema-generator'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string) {
  if (!supabaseAdmin) {
    return null
  }

  const { data: post, error } = await supabaseAdmin
    .from('blog_posts')
    .select(`
      *,
      author:authors(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !post) {
    return null
  }

  return post
}

async function getRelatedPosts(category: string | null, currentSlug: string) {
  if (!category || !supabaseAdmin) return []

  const { data: posts, error } = await supabaseAdmin
    .from('blog_posts')
    .select(`
      *,
      author:authors(*)
    `)
    .eq('is_published', true)
    .eq('category', category)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(3)

  if (error) {
    return []
  }

  return posts || []
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
  }
}

function renderContentWithCallouts(content: string, callouts: any[]) {
  if (!callouts || callouts.length === 0) {
    return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
  }

  // Split content by positions if specified in callouts
  // For now, just render content followed by callouts
  return (
    <div className="prose prose-lg max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {callouts.map((callout, index) => (
        <Callout
          key={index}
          type={callout.type || 'info'}
          title={callout.title}
          content={callout.content}
        />
      ))}
    </div>
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.category, post.slug)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: `/blog/${post.slug}` },
  ]

  // Generate JSON-LD schemas
  const schemas = generateBlogPostSchema(post, 'https://modular-buildings.co')

  return (
    <>
      {/* JSON-LD Structured Data */}
      {schemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <CategoryBanner
        title={post.title}
        backgroundImage={post.featured_image || getPlaceholderImage(1920, 400, post.title)}
        breadcrumbs={breadcrumbs}
      />

      {/* Article Content */}
      <article className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-mb-border-gray">
              {post.category && <Badge variant="warning">{post.category}</Badge>}
              {post.author && (
                <div className="flex items-center gap-2 text-sm text-mb-gray">
                  {post.author.avatar_url && (
                    <Image
                      src={post.author.avatar_url}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  {!post.author.avatar_url && <User className="w-4 h-4" />}
                  <span>{post.author.name}</span>
                </div>
              )}
              {post.published_at && (
                <div className="flex items-center gap-2 text-sm text-mb-gray">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
              {post.read_time && (
                <div className="flex items-center gap-2 text-sm text-mb-gray">
                  <Clock className="w-4 h-4" />
                  <span>{post.read_time} min read</span>
                </div>
              )}
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="relative h-96 rounded-mb-lg overflow-hidden mb-8">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Article Body with Callouts */}
            <div className="mb-12">
              {renderContentWithCallouts(post.content, post.callouts || [])}
            </div>

            {/* Updated/Published Dates */}
            {post.updated_at && post.updated_at !== post.created_at && (
              <div className="text-sm text-mb-gray italic mb-8">
                Last updated: {new Date(post.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}

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
            {post.author && (
              <div className="mt-12 p-6 bg-mb-bg-light rounded-mb-lg">
                <div className="flex items-start gap-4">
                  {post.author.avatar_url && (
                    <Image
                      src={post.author.avatar_url}
                      alt={post.author.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-mb-dark">About {post.author.name}</h3>
                    {post.author.bio && (
                      <p className="text-mb-gray mb-3">
                        {post.author.bio}
                      </p>
                    )}
                    {post.author.social_links && Object.values(post.author.social_links).some(Boolean) && (
                      <div className="flex gap-3 text-sm">
                        {post.author.social_links.website && (
                          <a
                            href={post.author.social_links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-mb-warning hover:underline"
                          >
                            Website
                          </a>
                        )}
                        {post.author.social_links.twitter && (
                          <a
                            href={post.author.social_links.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-mb-warning hover:underline"
                          >
                            Twitter
                          </a>
                        )}
                        {post.author.social_links.linkedin && (
                          <a
                            href={post.author.social_links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-mb-warning hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                        {post.author.social_links.github && (
                          <a
                            href={post.author.social_links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-mb-warning hover:underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
                      src={relatedPost.featured_image || getPlaceholderImage(800, 400, relatedPost.title)}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    {relatedPost.category && (
                      <Badge variant="gray" className="mb-3">{relatedPost.category}</Badge>
                    )}
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-mb-warning transition-colors">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-sm text-mb-gray mb-3 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-mb-gray">
                      {relatedPost.read_time && <span>{relatedPost.read_time} min read</span>}
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
