# Karmod Website - Next.js 14

A modern, high-performance website for Karmod built with Next.js 14, implementing the complete Karmod design system with Supabase backend integration.

## Features

✅ **Modern Tech Stack**
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS with Karmod design tokens
- Supabase for backend/database
- Server Components for optimal performance

✅ **Complete Design System Implementation**
- All Karmod design tokens (colors, typography, spacing, effects)
- 10+ reusable UI components
- Responsive design (mobile-first)
- Accessibility-focused

✅ **Page Templates**
- Homepage with hero, featured products, stats
- Category pages with sidebar navigation
- Product detail pages with gallery, specs, contact form
- Projects showcase
- Contact page with form integration

✅ **Features**
- Server-side rendering for SEO
- Image optimization with Next.js Image
- Form submissions to Supabase
- Product view tracking
- Full-text search ready
- Related products
- Breadcrumb navigation
- Meta tags and Open Graph

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
karmod-website/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with Header/Footer
│   ├── page.tsx             # Homepage
│   ├── category/            # Category pages
│   │   └── [slug]/
│   ├── products/            # Product pages
│   │   └── [slug]/
│   ├── projects/            # Projects page
│   ├── contact/             # Contact page
│   └── globals.css          # Global styles
│
├── components/              # React components
│   ├── ui/                  # UI components
│   │   ├── Button.tsx
│   │   ├── ProductCard.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── CategoryBanner.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── FeatureList.tsx
│   │   ├── Badge.tsx
│   │   └── ProductGrid.tsx
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── forms/               # Form components
│       └── ContactForm.tsx
│
├── lib/                     # Utilities
│   └── supabase.ts         # Supabase client & types
│
├── public/                  # Static assets
│
└── styles/                  # Additional styles
```

## Design System

### Colors

The website uses the complete Karmod color palette:

- **Primary**: Navy (#2d287f), Warning (#ffc107), Dark (#243047)
- **Background**: Light (#f7f9fb), White (#ffffff)
- **Borders**: Gray (#E5E8ED), Light (#e6e8eb)
- **Text**: Primary (#243047), Secondary (#6c757d)

### Typography

- **Font Sizes**: 12px (xs) to 42px (hero)
- **Font Weights**: 300 (light) to 800 (extrabold)
- **Line Heights**: 1.3 (tight) to 1.5 (relaxed)

### Spacing

8-point grid system: 5px, 10px, 15px, 20px, 30px, 40px, 50px, 60px

## Components

### UI Components

**Button**
```tsx
<Button variant="primary" size="md">Click Me</Button>
<Button variant="warning" size="lg">Get Quote</Button>
```

**ProductCard**
```tsx
<ProductCard
  title="Modular Office"
  category="Offices"
  imageUrl="/image.jpg"
  href="/products/office-560"
  area={560}
  completionDays={32}
/>
```

**HeroBanner**
```tsx
<HeroBanner
  title="Welcome to Karmod"
  subtitle="Quality prefab buildings"
  backgroundImage="/hero.jpg"
  height="lg"
/>
```

**ImageGallery**
```tsx
<ImageGallery images={[
  { url: '/img1.jpg', alt: 'Image 1' },
  { url: '/img2.jpg', alt: 'Image 2' },
]} />
```

### Form Components

**ContactForm**
```tsx
<ContactForm
  productInterest="product-id-here"
  sourcePage="/products/office"
/>
```

## Database Integration

### Fetching Products

```typescript
import { supabase } from '@/lib/supabase'

const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('is_published', true)
  .limit(10)
```

### Submitting Forms

Forms automatically submit to Supabase `contact_submissions` table.

### View Tracking

Product views are automatically tracked using `increment_product_views` RPC function.

## SEO Optimization

### Meta Tags

Each page includes:
- Dynamic titles
- Meta descriptions
- Open Graph tags
- Structured breadcrumbs

### Image Optimization

- Next.js Image component with automatic optimization
- WebP/AVIF format support
- Responsive image sizes
- Lazy loading

### Performance

- Server-side rendering
- Static generation where possible
- Optimized bundle size
- Code splitting

## Responsive Design

**Breakpoints:**
- Mobile: < 767px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

**Mobile Optimizations:**
- Collapsible navigation
- Stacked layouts
- Reduced font sizes
- Touch-friendly interactions

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

Build the production bundle:

```bash
npm run build
```

Deploy the `.next` directory to:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

Optional:
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID

## Customization

### Adding New Pages

1. Create file in `app/` directory
2. Add to navigation in `components/layout/Header.tsx`
3. Update metadata

### Adding New Components

1. Create component in `components/ui/`
2. Export from component file
3. Import where needed

### Modifying Design Tokens

Edit `tailwind.config.ts` to update colors, spacing, etc.

## Performance Checklist

- ✅ Server-side rendering
- ✅ Image optimization
- ✅ Code splitting
- ✅ CSS optimization (Tailwind purge)
- ✅ Font optimization (system fonts)
- ✅ Lazy loading images
- ✅ Database query optimization

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Alt text on images
- ✅ Color contrast (WCAG AA)

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers

## Troubleshooting

**Images not loading:**
- Check Supabase storage permissions
- Verify image URLs in database
- Check `next.config.js` remote patterns

**Forms not submitting:**
- Check Supabase RLS policies
- Verify environment variables
- Check browser console for errors

**Styles not applying:**
- Run `npm run dev` to rebuild
- Check Tailwind config
- Clear `.next` cache

## Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

## License

Copyright © 2024 Karmod. All rights reserved.

## Support

For questions or issues:
- Email: info@karmod.com
- Website: https://www.karmod.com

---

Built with ❤️ using Next.js 14, Tailwind CSS, and Supabase
