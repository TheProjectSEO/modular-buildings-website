interface Author {
  name: string
  email?: string
  avatar_url?: string
  bio?: string
  social_links?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
    [key: string]: string | undefined
  }
}

interface BlogPost {
  title: string
  slug: string
  excerpt?: string
  content: string
  author?: Author
  category?: string
  featured_image?: string
  published_at?: string
  updated_at?: string
  faq_schema?: Array<{ question: string; answer: string }>
  custom_schema?: Record<string, any>
}

export function generateBlogPostSchema(post: BlogPost, baseUrl: string = 'https://modular-buildings.co') {
  const schemas: any[] = []

  // 1. Main Article Schema
  const articleSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: `${baseUrl}/blog/${post.slug}`,
  }

  if (post.excerpt) {
    articleSchema.description = post.excerpt
  }

  if (post.featured_image) {
    articleSchema.image = post.featured_image
  }

  if (post.published_at) {
    articleSchema.datePublished = post.published_at
  }

  if (post.updated_at) {
    articleSchema.dateModified = post.updated_at
  }

  // Add author information
  if (post.author) {
    articleSchema.author = {
      '@type': 'Person',
      name: post.author.name,
    }

    if (post.author.email) {
      articleSchema.author.email = post.author.email
    }

    if (post.author.avatar_url) {
      articleSchema.author.image = post.author.avatar_url
    }

    if (post.author.bio) {
      articleSchema.author.description = post.author.bio
    }

    // Add social links
    if (post.author.social_links) {
      const socialLinks = Object.values(post.author.social_links).filter(Boolean)
      if (socialLinks.length > 0) {
        articleSchema.author.sameAs = socialLinks
      }
    }
  }

  // Add publisher information
  articleSchema.publisher = {
    '@type': 'Organization',
    name: 'Modular Buildings Co',
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
    },
  }

  schemas.push(articleSchema)

  // 2. FAQ Schema (if exists)
  if (post.faq_schema && post.faq_schema.length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq_schema.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }
    schemas.push(faqSchema)
  }

  // 3. Custom Schema (if exists)
  if (post.custom_schema && Object.keys(post.custom_schema).length > 0) {
    // Ensure custom schema has @context if not present
    const customSchema = {
      '@context': 'https://schema.org',
      ...post.custom_schema,
    }
    schemas.push(customSchema)
  }

  // 4. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${baseUrl}/blog/${post.slug}`,
      },
    ],
  }
  schemas.push(breadcrumbSchema)

  return schemas
}

export function generateSchemaScript(schemas: any[]) {
  return schemas.map((schema, index) => (
    `<script key="schema-${index}" type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
  )).join('\n')
}
