=== Semantic Internal Linking ===
Contributors: theprojectseo
Tags: internal links, related posts, seo, tf-idf, content similarity
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Automatically suggest related content based on TF-IDF content similarity analysis. Improve your site's SEO with smart, relevant internal linking.

== Description ==

**Semantic Internal Linking** uses advanced TF-IDF (Term Frequency-Inverse Document Frequency) analysis to automatically find and display related content on your WordPress site. This helps improve your site's SEO by creating relevant internal links between similar content.

= Key Features =

* **Automatic Content Analysis** - Parses your sitemap and analyzes all content using TF-IDF algorithm
* **Smart Similarity Matching** - Uses cosine similarity to find genuinely related content
* **Flexible Display Options** - Show related links after content or use shortcode for custom placement
* **Configurable Settings** - Adjust similarity threshold, number of recommendations, and more
* **Background Processing** - Indexes content in batches to avoid timeouts on large sites
* **Performance Optimized** - Caches recommendations and uses efficient database queries

= How It Works =

1. The plugin parses your XML sitemap to discover all URLs
2. Each page's content is extracted and tokenized
3. TF-IDF vectors are calculated for each document
4. Cosine similarity scores identify related content
5. Related links are displayed automatically or via shortcode

= Use Cases =

* **Blogs** - Help readers discover related articles
* **News Sites** - Link to related news stories
* **Documentation** - Connect related help articles
* **E-commerce** - Link similar products or guides
* **Any Content Site** - Improve internal linking for SEO

= Shortcode Usage =

Use `[semantic_links]` to display related links anywhere:

* `[semantic_links]` - Default settings
* `[semantic_links limit="5"]` - Show 5 related links
* `[semantic_links threshold="0.3"]` - Minimum 30% similarity

== Installation ==

1. Upload the `semantic-internal-linking` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to **Settings > Internal Linking** to configure
4. Enter your sitemap URL or leave blank for auto-detection
5. Click **Start Indexing** to analyze your content
6. Related links will appear automatically on posts and pages

== Frequently Asked Questions ==

= How long does indexing take? =

Indexing time depends on your site size:
* Small sites (100 pages): 2-5 minutes
* Medium sites (500 pages): 15-30 minutes
* Large sites (1,000 pages): 45-90 minutes

= Does this work with any sitemap? =

Yes! The plugin works with standard XML sitemaps from any SEO plugin including Yoast SEO, RankMath, All in One SEO, and the native WordPress sitemap.

= Will this slow down my site? =

No. Recommendations are cached and database queries are optimized. The TF-IDF calculations happen during indexing, not on page load.

= Can I exclude certain pages? =

Yes. Use the "Excluded URL Patterns" setting to exclude specific URLs or patterns from indexing.

= How does the similarity algorithm work? =

The plugin uses TF-IDF (Term Frequency-Inverse Document Frequency) combined with cosine similarity:
1. **TF** measures how often a term appears in a document
2. **IDF** measures how unique a term is across all documents
3. **Cosine similarity** compares TF-IDF vectors to find similar content

= Can I customize the display? =

Yes. You can:
* Change the heading text
* Choose automatic display or shortcode-only
* Override styles with your own CSS
* Use filters for advanced customization

== Screenshots ==

1. Admin settings page with statistics and configuration options
2. Related links displayed on a blog post
3. Index progress indicator

== Changelog ==

= 1.0.0 =
* Initial release
* TF-IDF content analysis
* Cosine similarity calculation
* Sitemap parsing (including sitemap index)
* Background batch processing
* Admin settings page
* Shortcode support
* Transient caching

== Upgrade Notice ==

= 1.0.0 =
Initial release of Semantic Internal Linking.

== Privacy Policy ==

This plugin:
* Stores content analysis data in your WordPress database
* Does not send any data to external servers
* Does not use cookies
* Does not collect personal information

== Credits ==

Developed by [TheProjectSEO](https://theprojectseo.com)

The TF-IDF algorithm is a standard information retrieval technique used by search engines worldwide.
