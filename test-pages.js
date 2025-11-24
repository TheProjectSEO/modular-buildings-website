const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3004';
const SCREENSHOT_DIR = '/Users/adityaaman/Desktop/schema_Creation/skills/karmod-website/screenshots';

const PAGES = [
  {
    name: 'Homepage',
    url: '/',
    checkSections: ['hero', 'content', 'cta', 'footer']
  },
  {
    name: 'Category - Containers',
    url: '/category/containers',
    checkSections: ['hero', 'products', 'filters', 'footer']
  },
  {
    name: 'Product - Prefabricated Office',
    url: '/products/prefabricated-office-560-m2',
    checkSections: ['hero', 'product-details', 'specs', 'cta', 'footer']
  },
  {
    name: 'Projects',
    url: '/projects',
    checkSections: ['hero', 'projects-grid', 'cta', 'footer']
  },
  {
    name: 'Contact',
    url: '/contact',
    checkSections: ['hero', 'contact-form', 'cta', 'footer']
  }
];

async function testPages() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  // Listen for console messages
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      args: msg.args()
    });
  });

  // Listen for errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push({
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  });

  // Listen for network failures
  const networkErrors = [];
  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure()?.errorText
    });
  });

  for (const testPage of PAGES) {
    console.log(`\nTesting: ${testPage.name}`);
    console.log(`URL: ${BASE_URL}${testPage.url}`);

    consoleLogs.length = 0;
    pageErrors.length = 0;
    networkErrors.length = 0;

    try {
      // Navigate to page
      const response = await page.goto(`${BASE_URL}${testPage.url}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Check response status
      const loadSuccess = response.ok();
      console.log(`  Status: ${response.status()} ${loadSuccess ? '✓' : '✗'}`);

      // Wait for page to fully load
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      // Check for images
      const images = await page.locator('img').count();
      const loadedImages = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
          .filter(img => img.complete && img.naturalHeight !== 0).length;
      });
      console.log(`  Images: ${loadedImages}/${images} loaded`);

      // Check for broken images
      const brokenImages = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
          .filter(img => !img.complete || img.naturalHeight === 0)
          .map(img => img.src || img.getAttribute('data-src'));
      });

      // Check for links
      const links = await page.locator('a').count();
      console.log(`  Links: ${links} found`);

      // Check viewport and responsiveness
      const viewportSize = page.viewportSize();
      console.log(`  Viewport: ${viewportSize.width}x${viewportSize.height}`);

      // Check for visible content
      const bodyText = await page.textContent('body');
      const hasContent = bodyText && bodyText.trim().length > 100;
      console.log(`  Content loaded: ${hasContent ? '✓' : '✗'}`);

      // Take screenshot
      const screenshotPath = path.join(SCREENSHOT_DIR, `${testPage.name.replace(/\s+/g, '-').toLowerCase()}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  Screenshot: ${screenshotPath}`);

      // Check for console errors
      const errors = consoleLogs.filter(log => log.type === 'error');
      const warnings = consoleLogs.filter(log => log.type === 'warning');
      console.log(`  Console: ${errors.length} errors, ${warnings.length} warnings`);

      // Get page metrics
      const metrics = await page.metrics();

      results.push({
        page: testPage.name,
        url: testPage.url,
        status: response.status(),
        loadSuccess,
        images: {
          total: images,
          loaded: loadedImages,
          broken: brokenImages
        },
        links: links,
        content: {
          hasContent,
          textLength: bodyText ? bodyText.length : 0
        },
        console: {
          errors: errors.map(e => e.text),
          warnings: warnings.map(w => w.text)
        },
        networkErrors: networkErrors,
        pageErrors: pageErrors,
        metrics: {
          JSHeapUsedSize: metrics.JSHeapUsedSize,
          JSHeapTotalSize: metrics.JSHeapTotalSize,
          DeviceScaleFactor: metrics.DeviceScaleFactor
        },
        screenshotPath
      });

    } catch (error) {
      console.log(`  ERROR: ${error.message}`);
      results.push({
        page: testPage.name,
        url: testPage.url,
        error: error.message,
        stack: error.stack
      });
    }
  }

  await browser.close();

  // Save results to JSON
  const resultsPath = path.join(SCREENSHOT_DIR, 'test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${resultsPath}`);

  return results;
}

testPages().catch(console.error);
