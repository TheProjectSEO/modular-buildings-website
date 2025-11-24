# Navigation Configuration

This directory contains the centralized navigation configuration for the Karmod website.

## Files

### `navigation.ts`
Main configuration file that exports all navigation data structures.

## Exports

### `mainNavigation`
Array of navigation items used in the header with dropdown support.

```typescript
interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}
```

### `products`
Array of all product pages (9 items)

### `industries`
Array of all industry pages (9 items)

### `locations`
Array of top location pages (25+ items)

### `company`
Array of company-related pages (6 items)

### `resources`
Array of resource pages (6 items)

### `allStates`
Array of all 50 US state slugs for sitemap generation

### `majorCities`
Array of major city data for sitemap:
```typescript
{
  state: string
  city: string
  label: string
}
```

### `staticPages`
Array of static pages with SEO priorities:
```typescript
{
  path: string
  label: string
  priority: number
}
```

## Usage

### In Components
```typescript
import { mainNavigation, products, industries } from '@/config/navigation'
```

### In Route Handlers
```typescript
import { staticPages, allStates, majorCities } from '@/config/navigation'
```

## Maintenance

When adding new pages:
1. Add to appropriate array in `navigation.ts`
2. Follow existing format
3. Ensure href paths are consistent
4. Update priority values if needed

## Best Practices

- Keep labels concise (1-4 words)
- Use kebab-case for slugs
- Maintain alphabetical order where appropriate
- Test all links after changes
