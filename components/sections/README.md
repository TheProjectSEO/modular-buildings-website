# Modular Buildings Co Website Section Components

Comprehensive React components for all page sections on the Modular Buildings Co website. All components are built with TypeScript, Tailwind CSS, and follow Modular Buildings Co's design system.

## Components Overview

### 1. FAQSection
Accordion-style FAQ component with smooth animations.

**Props:**
- `questions`: Array of FAQ items with question and answer
- `title`: Section title (default: "Frequently Asked Questions")
- `subtitle`: Optional subtitle
- `className`: Additional CSS classes

**Example:**
```tsx
import { FAQSection } from '@/components/sections'

<FAQSection
  title="Common Questions About Prefabricated Buildings"
  questions={[
    {
      question: "What is the delivery time for modular buildings?",
      answer: "Our standard modular buildings can be delivered within 30-45 days..."
    },
    {
      question: "Are prefabricated buildings durable?",
      answer: "Yes, our buildings are designed for long-term use..."
    }
  ]}
/>
```

---

### 2. ContentBlockSection
Flexible content block with multiple layout options and optional images.

**Props:**
- `title`: Section title (optional)
- `content`: HTML content string
- `image`: Optional image object with url, alt, width, height
- `layout`: Layout type - 'text-only', 'image-left', 'image-right', 'image-top', 'image-bottom'
- `backgroundColor`: 'white', 'light', or 'navy'
- `className`: Additional CSS classes

**Example:**
```tsx
import { ContentBlockSection } from '@/components/sections'

<ContentBlockSection
  title="About Our Modular Solutions"
  content="<p>Modular Buildings Co has been a leader in modular construction for over 50 years...</p>"
  layout="image-right"
  image={{
    url: "/images/factory.jpg",
    alt: "Modular Buildings Co Manufacturing Facility"
  }}
  backgroundColor="light"
/>
```

---

### 3. InternalLinksSection
Grid of internal links to related pages or products.

**Props:**
- `links`: Array of link objects with title, url, description
- `title`: Section title (default: "Related Products")
- `subtitle`: Optional subtitle
- `columns`: Grid columns - 2, 3, or 4
- `showIcon`: Show arrow icons (default: true)
- `className`: Additional CSS classes

**Example:**
```tsx
import { InternalLinksSection } from '@/components/sections'

<InternalLinksSection
  title="Related Products"
  columns={3}
  links={[
    {
      title: "Modular Offices",
      url: "/products/modular-offices",
      description: "Complete office solutions ready in weeks"
    },
    {
      title: "Container Homes",
      url: "/products/container-homes",
      description: "Sustainable and affordable housing"
    },
    {
      title: "Steel Buildings",
      url: "/products/steel-buildings",
      description: "Durable structures for any purpose"
    }
  ]}
/>
```

---

### 4. CTASection
Call-to-action section with multiple variants and button options.

**Props:**
- `title`: Main CTA title
- `subtitle`: Optional subtitle/eyebrow text
- `description`: Optional description text
- `primaryButton`: Primary button config (text, href, variant, onClick)
- `secondaryButton`: Secondary button config
- `variant`: 'contained', 'full-width', 'centered', or 'with-image'
- `backgroundImage`: Optional background image URL (for with-image variant)
- `backgroundColor`: 'navy', 'warning', 'light', or 'white'
- `className`: Additional CSS classes

**Example:**
```tsx
import { CTASection } from '@/components/sections'

<CTASection
  title="Ready to Start Your Project?"
  subtitle="Get Started Today"
  description="Contact our team for a free consultation and quote"
  variant="centered"
  backgroundColor="navy"
  primaryButton={{
    text: "Request a Quote",
    href: "/contact",
    variant: "warning"
  }}
  secondaryButton={{
    text: "View Projects",
    href: "/projects",
    variant: "outline"
  }}
/>
```

---

### 5. BreadcrumbsComponent
Breadcrumb navigation for page hierarchy.

**Props:**
- `items`: Array of breadcrumb items with label and href
- `showHome`: Show home icon (default: true)
- `className`: Additional CSS classes

**Example:**
```tsx
import { BreadcrumbsComponent } from '@/components/sections'

<BreadcrumbsComponent
  items={[
    { label: "Products", href: "/products" },
    { label: "Modular Buildings", href: "/products/modular-buildings" },
    { label: "Office Buildings", href: "/products/modular-buildings/offices" }
  ]}
/>
```

---

### 6. SpecificationsTable
Display product specifications in table or card format.

**Props:**
- `specifications`: Array of specs or grouped specs
- `title`: Section title (default: "Technical Specifications")
- `variant`: Display style - 'simple', 'grouped', or 'cards'
- `showIcons`: Show icons for specs (default: false)
- `striped`: Striped table rows (default: true)
- `className`: Additional CSS classes

**Example - Simple Table:**
```tsx
import { SpecificationsTable } from '@/components/sections'

<SpecificationsTable
  title="Building Specifications"
  variant="simple"
  specifications={[
    { label: "Total Area", value: "120", unit: "m²" },
    { label: "Floor Count", value: "2", unit: "floors" },
    { label: "Completion Time", value: "30", unit: "days" },
    { label: "Foundation Type", value: "Concrete Slab" }
  ]}
/>
```

**Example - Grouped Table:**
```tsx
<SpecificationsTable
  title="Complete Specifications"
  variant="grouped"
  specifications={[
    {
      groupName: "Dimensions",
      specs: [
        { label: "Length", value: "12", unit: "m" },
        { label: "Width", value: "10", unit: "m" },
        { label: "Height", value: "3", unit: "m" }
      ]
    },
    {
      groupName: "Materials",
      specs: [
        { label: "Frame", value: "Steel" },
        { label: "Walls", value: "Sandwich Panel" },
        { label: "Roof", value: "Metal Sheet" }
      ]
    }
  ]}
/>
```

**Example - Cards View:**
```tsx
<SpecificationsTable
  variant="cards"
  showIcons={true}
  specifications={[
    {
      label: "Energy Efficiency",
      value: "A+",
      icon: <Battery className="w-5 h-5" />,
      tooltip: "High energy efficiency rating"
    },
    {
      label: "Fire Rating",
      value: "Class A",
      icon: <Flame className="w-5 h-5" />
    }
  ]}
/>
```

---

## Design System Integration

All components use Modular Buildings Co's design tokens defined in `tailwind.config.ts`:

### Colors
- `mb-navy`: Primary brand color (#2d287f)
- `mb-dark`: Dark text (#243047)
- `mb-warning`: Accent/CTA color (#ffc107)
- `mb-bg-light`: Light background (#f7f9fb)
- `mb-link-blue`: Link color (#0d6efd)
- `mb-gray`: Secondary text (#6c757d)

### Typography
- Font sizes: hero (42px), h1 (32px), h2 (28px), h3 (24px), base (18px)
- Font weights: light (300), regular (400), semibold (600), bold (700)
- Line heights: tight (1.3), normal (1.4), relaxed (1.5)

### Spacing & Borders
- Border radius: mb (4px), mb-lg (6px)
- Custom spacing: 50px, 60px
- Box shadows: mb-hover, mb-modal

---

## Usage Tips

1. **Import Components**: Use named imports from the index file
   ```tsx
   import { FAQSection, CTASection, BreadcrumbsComponent } from '@/components/sections'
   ```

2. **Responsive Design**: All components are fully responsive and mobile-first

3. **Accessibility**: Components include proper ARIA labels and semantic HTML

4. **Customization**: Use the `className` prop to add custom styles while maintaining base styles

5. **Type Safety**: All components have full TypeScript support with exported interfaces

---

## File Structure

```
components/sections/
├── index.ts                      # Export all components
├── FAQSection.tsx                # FAQ accordion
├── ContentBlockSection.tsx       # Flexible content blocks
├── InternalLinksSection.tsx      # Related links grid
├── CTASection.tsx                # Call-to-action sections
├── BreadcrumbsComponent.tsx      # Breadcrumb navigation
├── SpecificationsTable.tsx       # Product specifications
└── README.md                     # This file
```

---

## Dependencies

- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- lucide-react (for icons)

---

## Support

For issues or questions about these components, refer to the main project documentation or contact the development team.
