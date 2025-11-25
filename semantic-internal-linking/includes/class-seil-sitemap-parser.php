<?php
/**
 * Sitemap parser for URL discovery.
 *
 * @package Semantic_Internal_Linking
 * @since   1.0.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class SEIL_Sitemap_Parser
 *
 * Parses XML sitemaps and sitemap index files to discover URLs
 * for content analysis.
 *
 * @since 1.0.0
 */
class SEIL_Sitemap_Parser {

	/**
	 * Common sitemap paths to check during auto-detection.
	 *
	 * @var array
	 */
	private $common_sitemap_paths = array(
		'/sitemap.xml',
		'/sitemap_index.xml',
		'/wp-sitemap.xml',
		'/sitemap-index.xml',
		'/post-sitemap.xml',
		'/page-sitemap.xml',
	);

	/**
	 * Maximum number of URLs to parse from sitemaps.
	 *
	 * @var int
	 */
	private $max_urls = 1000;

	/**
	 * Parse a sitemap URL and return all discovered URLs.
	 *
	 * @since 1.0.0
	 * @param string $sitemap_url The sitemap URL to parse.
	 * @return array|WP_Error Array of URLs or WP_Error on failure.
	 */
	public function parse( $sitemap_url ) {
		if ( empty( $sitemap_url ) ) {
			return new WP_Error(
				'empty_url',
				__( 'Sitemap URL is empty.', 'semantic-internal-linking' )
			);
		}

		$sitemap_url = esc_url_raw( $sitemap_url );
		$xml         = $this->fetch_xml( $sitemap_url );

		if ( is_wp_error( $xml ) ) {
			return $xml;
		}

		// Check if this is a sitemap index or regular sitemap.
		if ( isset( $xml->sitemap ) ) {
			// This is a sitemap index.
			return $this->parse_sitemap_index( $xml );
		} elseif ( isset( $xml->url ) ) {
			// This is a regular sitemap.
			return $this->parse_urlset( $xml );
		}

		return new WP_Error(
			'invalid_sitemap',
			__( 'Invalid sitemap format.', 'semantic-internal-linking' )
		);
	}

	/**
	 * Auto-detect sitemap URL.
	 *
	 * Checks robots.txt and common sitemap paths.
	 *
	 * @since 1.0.0
	 * @return string|false Sitemap URL or false if not found.
	 */
	public function auto_detect() {
		$site_url = home_url();

		// Check robots.txt first.
		$robots_url = trailingslashit( $site_url ) . 'robots.txt';
		$sitemap_from_robots = $this->get_sitemap_from_robots( $robots_url );

		if ( $sitemap_from_robots ) {
			return $sitemap_from_robots;
		}

		// Check common sitemap paths.
		foreach ( $this->common_sitemap_paths as $path ) {
			$test_url = trailingslashit( $site_url ) . ltrim( $path, '/' );

			if ( $this->sitemap_exists( $test_url ) ) {
				return $test_url;
			}
		}

		return false;
	}

	/**
	 * Fetch and parse XML from URL.
	 *
	 * @since 1.0.0
	 * @param string $url URL to fetch.
	 * @return SimpleXMLElement|WP_Error XML object or error.
	 */
	private function fetch_xml( $url ) {
		$response = wp_remote_get(
			$url,
			array(
				'timeout'    => 30,
				'user-agent' => 'Semantic Internal Linking/' . SEIL_VERSION . ' (WordPress Plugin)',
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( 200 !== $response_code ) {
			return new WP_Error(
				'http_error',
				sprintf(
					/* translators: %d: HTTP response code */
					__( 'HTTP error %d when fetching sitemap.', 'semantic-internal-linking' ),
					$response_code
				)
			);
		}

		$body = wp_remote_retrieve_body( $response );

		if ( empty( $body ) ) {
			return new WP_Error(
				'empty_response',
				__( 'Empty response from sitemap URL.', 'semantic-internal-linking' )
			);
		}

		// Suppress XML parsing errors.
		libxml_use_internal_errors( true );

		$xml = simplexml_load_string( $body );

		if ( false === $xml ) {
			$errors = libxml_get_errors();
			libxml_clear_errors();

			return new WP_Error(
				'xml_parse_error',
				__( 'Failed to parse XML sitemap.', 'semantic-internal-linking' )
			);
		}

		return $xml;
	}

	/**
	 * Parse a sitemap index file.
	 *
	 * @since 1.0.0
	 * @param SimpleXMLElement $xml Sitemap index XML.
	 * @return array|WP_Error Array of URLs or error.
	 */
	private function parse_sitemap_index( $xml ) {
		$all_urls = array();

		foreach ( $xml->sitemap as $sitemap ) {
			if ( ! isset( $sitemap->loc ) ) {
				continue;
			}

			$child_sitemap_url = (string) $sitemap->loc;
			$child_xml         = $this->fetch_xml( $child_sitemap_url );

			if ( is_wp_error( $child_xml ) ) {
				// Log error but continue with other sitemaps.
				continue;
			}

			if ( isset( $child_xml->url ) ) {
				$child_urls = $this->parse_urlset( $child_xml );

				if ( ! is_wp_error( $child_urls ) ) {
					$all_urls = array_merge( $all_urls, $child_urls );
				}
			}

			// Stop if we've reached the maximum.
			if ( count( $all_urls ) >= $this->max_urls ) {
				break;
			}
		}

		// Limit to max URLs.
		if ( count( $all_urls ) > $this->max_urls ) {
			$all_urls = array_slice( $all_urls, 0, $this->max_urls );
		}

		return $all_urls;
	}

	/**
	 * Parse a regular sitemap urlset.
	 *
	 * @since 1.0.0
	 * @param SimpleXMLElement $xml Sitemap XML.
	 * @return array Array of URLs.
	 */
	private function parse_urlset( $xml ) {
		$urls     = array();
		$site_url = home_url();

		foreach ( $xml->url as $url_element ) {
			if ( ! isset( $url_element->loc ) ) {
				continue;
			}

			$url = (string) $url_element->loc;

			// Only include URLs from the same domain.
			if ( strpos( $url, $site_url ) !== 0 ) {
				continue;
			}

			// Skip common non-content URLs.
			if ( $this->should_skip_url( $url ) ) {
				continue;
			}

			$urls[] = $url;

			// Stop if we've reached the maximum.
			if ( count( $urls ) >= $this->max_urls ) {
				break;
			}
		}

		return $urls;
	}

	/**
	 * Get sitemap URL from robots.txt.
	 *
	 * @since 1.0.0
	 * @param string $robots_url URL to robots.txt.
	 * @return string|false Sitemap URL or false.
	 */
	private function get_sitemap_from_robots( $robots_url ) {
		$response = wp_remote_get(
			$robots_url,
			array(
				'timeout'    => 10,
				'user-agent' => 'Semantic Internal Linking/' . SEIL_VERSION . ' (WordPress Plugin)',
			)
		);

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( 200 !== $response_code ) {
			return false;
		}

		$body = wp_remote_retrieve_body( $response );

		// Look for Sitemap: directive.
		if ( preg_match( '/^Sitemap:\s*(.+)$/mi', $body, $matches ) ) {
			$sitemap_url = trim( $matches[1] );

			if ( filter_var( $sitemap_url, FILTER_VALIDATE_URL ) ) {
				return $sitemap_url;
			}
		}

		return false;
	}

	/**
	 * Check if a sitemap exists at the given URL.
	 *
	 * @since 1.0.0
	 * @param string $url URL to check.
	 * @return bool True if sitemap exists.
	 */
	private function sitemap_exists( $url ) {
		$response = wp_remote_head(
			$url,
			array(
				'timeout'    => 5,
				'user-agent' => 'Semantic Internal Linking/' . SEIL_VERSION . ' (WordPress Plugin)',
			)
		);

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$response_code = wp_remote_retrieve_response_code( $response );

		return 200 === $response_code;
	}

	/**
	 * Check if a URL should be skipped.
	 *
	 * @since 1.0.0
	 * @param string $url URL to check.
	 * @return bool True if URL should be skipped.
	 */
	private function should_skip_url( $url ) {
		$skip_patterns = array(
			'/feed/',
			'/feed$',
			'/author/',
			'/tag/',
			'/category/',
			'/attachment/',
			'/wp-content/',
			'/wp-admin/',
			'/wp-includes/',
			'/xmlrpc.php',
			'/wp-json/',
			'/wp-login.php',
			'/cart/',
			'/checkout/',
			'/my-account/',
		);

		// Get settings for excluded URLs.
		$settings      = get_option( 'seil_settings', array() );
		$excluded_urls = isset( $settings['excluded_urls'] ) ? $settings['excluded_urls'] : '';

		if ( ! empty( $excluded_urls ) ) {
			$custom_patterns = array_filter( array_map( 'trim', explode( "\n", $excluded_urls ) ) );
			$skip_patterns   = array_merge( $skip_patterns, $custom_patterns );
		}

		foreach ( $skip_patterns as $pattern ) {
			if ( strpos( $url, $pattern ) !== false ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Set maximum URLs to parse.
	 *
	 * @since 1.0.0
	 * @param int $max Maximum URLs.
	 */
	public function set_max_urls( $max ) {
		$this->max_urls = absint( $max );
	}

	/**
	 * Get maximum URLs setting.
	 *
	 * @since 1.0.0
	 * @return int Maximum URLs.
	 */
	public function get_max_urls() {
		return $this->max_urls;
	}
}
