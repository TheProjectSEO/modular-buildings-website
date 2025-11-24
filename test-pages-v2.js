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
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  const results = [];

  for (const testPage of PAGES) {
    console.log(`\n========================================`);
    console.log(`Testing: ${testPage.name}`);
    console.log(`URL: ${BASE_URL}${testPage.url}`);
    console.log(`========================================`);

    const pageResult = {
      page: testPage.name,
      url: testPage.url,
      success: false,
      details: {}
    };

    try {
      // Navigate to page
      let response;
      try {
        response = await page.goto(`${BASE_URL}${testPage.url}`, {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });
      } catch (e) {
        console.log(`Navigation error: ${e.message}`);
        pageResult.details.navigationError = e.message;
        pageResult.success = false;
      }

      if (response) {
        pageResult.details.statusCode = response.status();
        pageResult.success = response.ok();
        console.log(`Status: ${response.status()} ${response.ok() ? '✓' : '✗'}`);

        // Wait for images to load
        await page.waitForTimeout(3000);

        // Check for images
        const images = await page.locator('img').count();
        let loadedImages = 0;
        if (images > 0) {
          loadedImages = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('img'))
              .filter(img => img.complete && img.naturalHeight !== 0).length;
          });
        }
        console.log(`Images: ${loadedImages}/${images} loaded`);
        pageResult.details.images = {
          total: images,
          loaded: loadedImages
        };

        // Check for broken images
        const brokenImages = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('img'))
            .filter(img => !img.complete || img.naturalHeight === 0)
            .map(img => ({
              src: img.src || img.getAttribute('data-src'),
              alt: img.alt || 'no alt'
            }));
        });

        if (brokenImages.length > 0) {
          console.log(`Broken images: ${brokenImages.length}`);
          pageResult.details.brokenImages = brokenImages;
        }

        // Check for links
        const links = await page.locator('a').count();
        console.log(`Links: ${links} found`);
        pageResult.details.links = links;

        // Check for heading structure
        const h1Count = await page.locator('h1').count();
        const h2Count = await page.locator('h2').count();
        const h3Count = await page.locator('h3').count();
        console.log(`Headings: H1=${h1Count}, H2=${h2Count}, H3=${h3Count}`);
        pageResult.details.headings = { h1: h1Count, h2: h2Count, h3: h3Count };

        // Check for content
        const bodyText = await page.textContent('body');
        const hasContent = bodyText && bodyText.trim().length > 100;
        const textLength = bodyText ? bodyText.length : 0;
        console.log(`Content: ${hasContent ? '✓' : '✗'} (${textLength} characters)`);
        pageResult.details.content = {
          loaded: hasContent,
          characterCount: textLength
        };

        // Check for console errors/warnings
        const errors = [];
        const warnings = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            errors.push(msg.text());
          } else if (msg.type() === 'warning') {
            warnings.push(msg.text());
          }
        });

        // Check for page errors
        const pageErrors = [];
        page.on('pageerror', error => {
          pageErrors.push(error.message);
        });

        // Check for failed requests
        const failedRequests = [];
        page.on('requestfailed', request => {
          failedRequests.push({
            url: request.url(),
            failure: request.failure()?.errorText
          });
        });

        // Wait a bit for any delayed errors
        await page.waitForTimeout(2000);

        console.log(`Console: ${errors.length} errors, ${warnings.length} warnings`);
        if (errors.length > 0) {
          console.log(`  Errors: ${errors.join('; ')}`);
          pageResult.details.consoleErrors = errors;
        }
        if (warnings.length > 0) {
          pageResult.details.consoleWarnings = warnings;
        }
        if (pageErrors.length > 0) {
          console.log(`Page errors: ${pageErrors.join('; ')}`);
          pageResult.details.pageErrors = pageErrors;
        }
        if (failedRequests.length > 0) {
          console.log(`Failed requests: ${failedRequests.length}`);
          pageResult.details.failedRequests = failedRequests;
        }

        // Check viewport
        const viewportSize = page.viewportSize();
        console.log(`Viewport: ${viewportSize.width}x${viewportSize.height}`);

        // Check for common sections
        const sections = {
          'header': await page.locator('header').count() > 0,
          'nav': await page.locator('nav').count() > 0,
          'main': await page.locator('main').count() > 0,
          'section': await page.locator('section').count(),
          'footer': await page.locator('footer').count() > 0,
          'form': await page.locator('form').count()
        };
        console.log(`Sections: ${JSON.stringify(sections)}`);
        pageResult.details.sections = sections;

        // Take screenshot
        const screenshotPath = path.join(SCREENSHOT_DIR, `${testPage.name.replace(/\s+/g, '-').toLowerCase()}.png`);
        try {
          await page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`Screenshot saved: ${screenshotPath}`);
          pageResult.details.screenshot = screenshotPath;
        } catch (e) {
          console.log(`Screenshot error: ${e.message}`);
        }

        pageResult.success = true;
      }

    } catch (error) {
      console.log(`ERROR: ${error.message}`);
      pageResult.details.error = error.message;
      pageResult.success = false;
    }

    results.push(pageResult);
  }

  await browser.close();

  // Save results to JSON
  const resultsPath = path.join(SCREENSHOT_DIR, 'test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n\nResults saved to: ${resultsPath}`);

  // Print summary
  console.log('\n\n========================================');
  console.log('SUMMARY');
  console.log('========================================');
  results.forEach(r => {
    console.log(`${r.success ? '✓' : '✗'} ${r.page}`);
  });

  return results;
}

testPages().catch(console.error);
