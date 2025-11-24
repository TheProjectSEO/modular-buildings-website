/**
 * Generates a placeholder image URL using the placehold.co service
 *
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param text - Text to display on the placeholder (default: 'Image')
 * @param bgColor - Background color without # (default: '2d287f' - Karmod navy)
 * @param textColor - Text color without # (default: 'ffffff' - white)
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(
  width: number,
  height: number,
  text: string = 'Image',
  bgColor: string = '2d287f',
  textColor: string = 'ffffff'
): string {
  const encodedText = encodeURIComponent(text)
  // Use .png format to avoid SVG (Next.js Image blocks SVG by default)
  return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}.png?text=${encodedText}`
}

/**
 * Predefined placeholder images for common use cases
 */
export const placeholders = {
  // Hero banners
  heroBanner: getPlaceholderImage(1920, 600, 'Hero Banner'),

  // Product images
  productCard: getPlaceholderImage(400, 300, 'Product Image'),
  productDetail: getPlaceholderImage(800, 600, 'Product Photo'),

  // Project images
  projectCard: getPlaceholderImage(600, 400, 'Project Photo'),
  projectGallery: getPlaceholderImage(800, 600, 'Project Gallery'),

  // Category banners
  categoryBanner: getPlaceholderImage(1920, 400, 'Category Banner'),

  // Thumbnails
  thumbnail: getPlaceholderImage(200, 200, 'Thumbnail'),

  // Application images
  applicationImage: getPlaceholderImage(600, 400, 'Application'),

  // Content blocks
  contentImage: getPlaceholderImage(800, 600, 'Content Image'),
}

/**
 * Get a product-specific placeholder image
 */
export function getProductPlaceholder(productName: string): string {
  return getPlaceholderImage(400, 300, productName)
}

/**
 * Get a project-specific placeholder image
 */
export function getProjectPlaceholder(projectName: string): string {
  return getPlaceholderImage(600, 400, projectName)
}

/**
 * Get a category-specific placeholder image
 */
export function getCategoryPlaceholder(categoryName: string): string {
  return getPlaceholderImage(1920, 400, categoryName)
}
