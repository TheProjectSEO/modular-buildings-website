<?php
/**
 * Content processor for text extraction and preprocessing.
 *
 * @package Semantic_Internal_Linking
 * @since   1.0.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class SEIL_Content_Processor
 *
 * Handles content extraction from WordPress posts and URLs,
 * text preprocessing, tokenization, and stopword removal.
 *
 * @since 1.0.0
 */
class SEIL_Content_Processor {

	/**
	 * English stopwords list.
	 *
	 * @var array
	 */
	private $stopwords = array(
		'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
		'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
		'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t',
		'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
		'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
		'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here',
		'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
		'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it',
		'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
		'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
		'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t',
		'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some',
		'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves',
		'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
		'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
		'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were',
		'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which',
		'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would',
		'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours',
		'yourself', 'yourselves',
		// Additional common words.
		'also', 'just', 'like', 'now', 'get', 'got', 'can', 'will', 'make', 'made',
		'one', 'two', 'first', 'new', 'way', 'may', 'well', 'back', 'even', 'want',
		'give', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave',
		'call', 'keep', 'let', 'begin', 'seem', 'help', 'show', 'hear', 'play', 'run',
		'move', 'live', 'believe', 'hold', 'bring', 'happen', 'write', 'provide', 'sit',
		'stand', 'lose', 'pay', 'meet', 'include', 'continue', 'set', 'learn', 'change',
		'lead', 'understand', 'watch', 'follow', 'stop', 'create', 'speak', 'read',
		'allow', 'add', 'spend', 'grow', 'open', 'walk', 'win', 'offer', 'remember',
		'love', 'consider', 'appear', 'buy', 'wait', 'serve', 'die', 'send', 'expect',
		'build', 'stay', 'fall', 'cut', 'reach', 'kill', 'remain', 'click', 'please',
		'website', 'page', 'post', 'article', 'read', 'share', 'comment', 'comments',
	);

	/**
	 * Minimum word length for tokens.
	 *
	 * @var int
	 */
	private $min_word_length = 3;

	/**
	 * Process a URL and extract content data.
	 *
	 * @since 1.0.0
	 * @param string $url URL to process.
	 * @return array|WP_Error Processed content data or error.
	 */
	public function process_url( $url ) {
		// Try to get post ID from URL.
		$post_id = url_to_postid( $url );

		if ( $post_id > 0 ) {
			return $this->process_post( $post_id, $url );
		}

		// Fall back to fetching URL content.
		return $this->process_external_url( $url );
	}

	/**
	 * Process a WordPress post.
	 *
	 * @since 1.0.0
	 * @param int    $post_id Post ID.
	 * @param string $url     Post URL.
	 * @return array|WP_Error Processed content data or error.
	 */
	public function process_post( $post_id, $url = '' ) {
		$post = get_post( $post_id );

		if ( ! $post ) {
			return new WP_Error(
				'post_not_found',
				__( 'Post not found.', 'semantic-internal-linking' )
			);
		}

		// Get post content.
		$content = $this->get_post_content( $post );
		$title   = $post->post_title;

		if ( empty( $url ) ) {
			$url = get_permalink( $post_id );
		}

		// Preprocess text.
		$tokens = $this->preprocess_text( $content );

		// Calculate content hash for change detection.
		$content_hash = $this->calculate_content_hash( $content );

		return array(
			'url'          => $url,
			'post_id'      => $post_id,
			'title'        => $title,
			'tokens'       => $tokens,
			'word_count'   => count( $tokens ),
			'content_hash' => $content_hash,
		);
	}

	/**
	 * Process an external URL (non-post).
	 *
	 * @since 1.0.0
	 * @param string $url URL to process.
	 * @return array|WP_Error Processed content data or error.
	 */
	private function process_external_url( $url ) {
		$response = wp_remote_get(
			$url,
			array(
				'timeout'    => 15,
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
					__( 'HTTP error %d when fetching URL.', 'semantic-internal-linking' ),
					$response_code
				)
			);
		}

		$body = wp_remote_retrieve_body( $response );

		// Extract title from HTML.
		$title = $this->extract_title_from_html( $body );

		// Extract main content from HTML.
		$content = $this->extract_content_from_html( $body );

		// Preprocess text.
		$tokens = $this->preprocess_text( $content );

		// Calculate content hash.
		$content_hash = $this->calculate_content_hash( $content );

		return array(
			'url'          => $url,
			'post_id'      => null,
			'title'        => $title,
			'tokens'       => $tokens,
			'word_count'   => count( $tokens ),
			'content_hash' => $content_hash,
		);
	}

	/**
	 * Get post content including title and excerpt.
	 *
	 * @since 1.0.0
	 * @param WP_Post $post Post object.
	 * @return string Combined content.
	 */
	public function get_post_content( $post ) {
		$parts = array();

		// Add title (weighted more by including multiple times).
		$parts[] = $post->post_title;
		$parts[] = $post->post_title;

		// Add excerpt if available.
		if ( ! empty( $post->post_excerpt ) ) {
			$parts[] = $post->post_excerpt;
		}

		// Add main content.
		$content = $post->post_content;

		// Apply content filters to process shortcodes.
		$content = apply_filters( 'the_content', $content );

		// Strip HTML tags.
		$content = wp_strip_all_tags( $content );

		$parts[] = $content;

		// Combine all parts.
		return implode( ' ', $parts );
	}

	/**
	 * Preprocess text into tokens.
	 *
	 * @since 1.0.0
	 * @param string $text Text to process.
	 * @return array Array of processed tokens.
	 */
	public function preprocess_text( $text ) {
		// Convert to lowercase.
		$text = strtolower( $text );

		// Remove HTML entities.
		$text = html_entity_decode( $text, ENT_QUOTES, 'UTF-8' );

		// Remove URLs.
		$text = preg_replace( '/https?:\/\/[^\s]+/', '', $text );

		// Remove email addresses.
		$text = preg_replace( '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', '', $text );

		// Remove numbers (but keep words with numbers).
		$text = preg_replace( '/\b\d+\b/', '', $text );

		// Remove special characters, keep only letters and spaces.
		$text = preg_replace( '/[^a-z\s]/', ' ', $text );

		// Normalize whitespace.
		$text = preg_replace( '/\s+/', ' ', $text );
		$text = trim( $text );

		// Tokenize.
		$tokens = explode( ' ', $text );

		// Filter tokens.
		$tokens = array_filter( $tokens, array( $this, 'is_valid_token' ) );

		// Remove stopwords.
		$tokens = $this->remove_stopwords( $tokens );

		// Re-index array.
		return array_values( $tokens );
	}

	/**
	 * Check if a token is valid.
	 *
	 * @since 1.0.0
	 * @param string $token Token to check.
	 * @return bool True if valid.
	 */
	private function is_valid_token( $token ) {
		// Check minimum length.
		if ( strlen( $token ) < $this->min_word_length ) {
			return false;
		}

		// Check maximum length.
		if ( strlen( $token ) > 50 ) {
			return false;
		}

		// Must contain at least one letter.
		if ( ! preg_match( '/[a-z]/', $token ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Remove stopwords from tokens.
	 *
	 * @since 1.0.0
	 * @param array $tokens Array of tokens.
	 * @return array Filtered tokens.
	 */
	public function remove_stopwords( $tokens ) {
		return array_diff( $tokens, $this->stopwords );
	}

	/**
	 * Calculate content hash for change detection.
	 *
	 * @since 1.0.0
	 * @param string $content Content to hash.
	 * @return string MD5 hash.
	 */
	public function calculate_content_hash( $content ) {
		// Normalize content before hashing.
		$normalized = strtolower( $content );
		$normalized = preg_replace( '/\s+/', ' ', $normalized );
		$normalized = trim( $normalized );

		return md5( $normalized );
	}

	/**
	 * Extract title from HTML.
	 *
	 * @since 1.0.0
	 * @param string $html HTML content.
	 * @return string Extracted title.
	 */
	private function extract_title_from_html( $html ) {
		// Try <title> tag first.
		if ( preg_match( '/<title[^>]*>([^<]+)<\/title>/i', $html, $matches ) ) {
			return trim( wp_strip_all_tags( $matches[1] ) );
		}

		// Try <h1> tag.
		if ( preg_match( '/<h1[^>]*>([^<]+)<\/h1>/i', $html, $matches ) ) {
			return trim( wp_strip_all_tags( $matches[1] ) );
		}

		return __( 'Untitled', 'semantic-internal-linking' );
	}

	/**
	 * Extract main content from HTML.
	 *
	 * @since 1.0.0
	 * @param string $html HTML content.
	 * @return string Extracted content.
	 */
	private function extract_content_from_html( $html ) {
		// Remove script and style tags.
		$html = preg_replace( '/<script[^>]*>.*?<\/script>/is', '', $html );
		$html = preg_replace( '/<style[^>]*>.*?<\/style>/is', '', $html );

		// Remove header, footer, nav, aside.
		$html = preg_replace( '/<header[^>]*>.*?<\/header>/is', '', $html );
		$html = preg_replace( '/<footer[^>]*>.*?<\/footer>/is', '', $html );
		$html = preg_replace( '/<nav[^>]*>.*?<\/nav>/is', '', $html );
		$html = preg_replace( '/<aside[^>]*>.*?<\/aside>/is', '', $html );

		// Try to find main content area.
		if ( preg_match( '/<main[^>]*>(.*?)<\/main>/is', $html, $matches ) ) {
			$html = $matches[1];
		} elseif ( preg_match( '/<article[^>]*>(.*?)<\/article>/is', $html, $matches ) ) {
			$html = $matches[1];
		} elseif ( preg_match( '/class=["\'][^"\']*content[^"\']*["\'][^>]*>(.*?)<\/div>/is', $html, $matches ) ) {
			$html = $matches[1];
		}

		// Strip remaining HTML tags.
		$content = wp_strip_all_tags( $html );

		return $content;
	}

	/**
	 * Check if content has changed.
	 *
	 * @since 1.0.0
	 * @param string $new_hash New content hash.
	 * @param string $old_hash Old content hash.
	 * @return bool True if content has changed.
	 */
	public function has_content_changed( $new_hash, $old_hash ) {
		return $new_hash !== $old_hash;
	}

	/**
	 * Get term frequencies from tokens.
	 *
	 * @since 1.0.0
	 * @param array $tokens Array of tokens.
	 * @return array Associative array of term => count.
	 */
	public function get_term_frequencies( $tokens ) {
		return array_count_values( $tokens );
	}

	/**
	 * Set minimum word length.
	 *
	 * @since 1.0.0
	 * @param int $length Minimum length.
	 */
	public function set_min_word_length( $length ) {
		$this->min_word_length = absint( $length );
	}

	/**
	 * Add custom stopwords.
	 *
	 * @since 1.0.0
	 * @param array $words Array of stopwords to add.
	 */
	public function add_stopwords( $words ) {
		$this->stopwords = array_merge( $this->stopwords, $words );
		$this->stopwords = array_unique( $this->stopwords );
	}
}
