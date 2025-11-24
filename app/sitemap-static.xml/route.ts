import { NextResponse } from 'next/server'

const BASE_URL = 'https://modular-buildings.co'

export async function GET() {
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly' },
    { url: '/careers', priority: '0.7', changefreq: 'weekly' },
    { url: '/certifications', priority: '0.7', changefreq: 'monthly' },
    { url: '/financing', priority: '0.8', changefreq: 'monthly' },
    { url: '/installation', priority: '0.7', changefreq: 'monthly' },
    { url: '/maintenance', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/projects', priority: '0.7', changefreq: 'weekly' },
    { url: '/used-modular-buildings-for-sale', priority: '0.8', changefreq: 'weekly' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
