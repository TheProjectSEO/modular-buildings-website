<?php
/**
 * Recommendations display handler.
 *
 * @package Semantic_Internal_Linking
 * @since   1.0.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class SEIL_Recommendations
 *
 * Handles displaying related content recommendations via content filter
 * and shortcode.
 *
 * @since 1.0.0
 */
class SEIL_Recommendations {

	/**
	 * Plugin options.
	 *
	 * @var array
	 */
	private $options;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->options = get_option( 'seil_settings', array() );

		// Register shortcode.
		add_shortcode( 'semantic_links', array( $this, 'shortcode_handler' ) );

		// Hook into content if enabled.
		$enabled  = isset( $this->options['enabled'] ) ? $this->options['enabled'] : true;
		$position = isset( $this->options['display_position'] ) ? $this->options['display_position'] : 'after_content';

		if ( $enabled && 'after_content' === $position ) {
			add_filter( 'the_content', array( $this, 'append_to_content' ), 20 );
		}

		// Enqueue public styles.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
	}

	/**
	 * Append recommendations to post content.
	 *
	 * @since 1.0.0
	 * @param string $content Post content.
	 * @return string Modified content.
	 */
	public function append_to_content( $content ) {
		// Only on singular posts/pages.
		if ( ! is_singular() ) {
			return $content;
		}

		// Check if in the main query.
		if ( ! in_the_loop() || ! is_main_query() ) {
			return $content;
		}

		$post_id = get_the_ID();

		if ( ! $post_id ) {
			return $content;
		}

		// Check if current post type is in the selected post types.
		$post_type           = get_post_type( $post_id );
		$allowed_post_types  = isset( $this->options['post_types'] ) ? $this->options['post_types'] : array( 'post', 'page' );

		if ( ! in_array( $post_type, $allowed_post_types, true ) ) {
			return $content;
		}

		// Get recommendations.
		$recommendations = $this->get_recommendations( $post_id );

		if ( empty( $recommendations ) ) {
			return $content;
		}

		// Render and append.
		$html = $this->render_html( $recommendations );

		return $content . $html;
	}

	/**
	 * Shortcode handler.
	 *
	 * @since 1.0.0
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function shortcode_handler( $atts ) {
		$atts = shortcode_atts(
			array(
				'limit'     => isset( $this->options['max_recommendations'] ) ? $this->options['max_recommendations'] : 5,
				'threshold' => isset( $this->options['similarity_threshold'] ) ? $this->options['similarity_threshold'] : 0.3,
			),
			$atts,
			'semantic_links'
		);

		$post_id = get_the_ID();

		if ( ! $post_id ) {
			return '';
		}

		$recommendations = $this->get_recommendations(
			$post_id,
			absint( $atts['limit'] ),
			floatval( $atts['threshold'] )
		);

		if ( empty( $recommendations ) ) {
			return '';
		}

		return $this->render_html( $recommendations );
	}

	/**
	 * Get recommendations for a post.
	 *
	 * @since 1.0.0
	 * @param int   $post_id   Post ID.
	 * @param int   $limit     Maximum results.
	 * @param float $threshold Minimum similarity threshold.
	 * @return array Array of recommendation data.
	 */
	public function get_recommendations( $post_id, $limit = null, $threshold = null ) {
		if ( null === $limit ) {
			$limit = isset( $this->options['max_recommendations'] ) ? $this->options['max_recommendations'] : 5;
		}

		if ( null === $threshold ) {
			$threshold = isset( $this->options['similarity_threshold'] ) ? $this->options['similarity_threshold'] : 0.3;
		}

		// Check cache first.
		$cache_key = 'seil_rec_' . $post_id . '_' . $limit . '_' . str_replace( '.', '', $threshold );
		$cached    = get_transient( $cache_key );

		if ( false !== $cached ) {
			return $cached;
		}

		// Get recommendations from engine.
		$engine          = new SEIL_TfIdf_Engine();
		$recommendations = $engine->get_similar_for_post( $post_id, $limit, $threshold );

		// Filter out invalid posts.
		$recommendations = array_filter( $recommendations, function( $rec ) {
			if ( ! $rec['post_id'] ) {
				return true; // Keep non-post URLs.
			}

			$post = get_post( $rec['post_id'] );
			return $post && 'publish' === $post->post_status;
		} );

		// Enrich with additional data.
		$recommendations = array_map( function( $rec ) {
			if ( $rec['post_id'] ) {
				$post = get_post( $rec['post_id'] );
				if ( $post ) {
					$rec['title'] = $post->post_title;
					$rec['url']   = get_permalink( $rec['post_id'] );
				}
			}
			return $rec;
		}, $recommendations );

		// Re-index array.
		$recommendations = array_values( $recommendations );

		// Cache for 12 hours.
		set_transient( $cache_key, $recommendations, 12 * HOUR_IN_SECONDS );

		return $recommendations;
	}

	/**
	 * Render recommendations HTML.
	 *
	 * @since 1.0.0
	 * @param array $recommendations Array of recommendations.
	 * @return string HTML output.
	 */
	private function render_html( $recommendations ) {
		if ( empty( $recommendations ) ) {
			return '';
		}

		$heading = isset( $this->options['heading_text'] ) ? $this->options['heading_text'] : __( 'Related Articles', 'semantic-internal-linking' );

		/**
		 * Filter recommendations before display.
		 *
		 * @since 1.0.0
		 * @param array $recommendations Recommendations data.
		 * @param int   $post_id         Current post ID.
		 */
		$recommendations = apply_filters( 'seil_recommendations', $recommendations, get_the_ID() );

		ob_start();
		?>
		<div class="seil-related-content">
			<?php if ( ! empty( $heading ) ) : ?>
				<h3 class="seil-related-heading"><?php echo esc_html( $heading ); ?></h3>
			<?php endif; ?>

			<ul class="seil-related-list">
				<?php foreach ( $recommendations as $rec ) : ?>
					<li class="seil-related-item">
						<a href="<?php echo esc_url( $rec['url'] ); ?>" class="seil-related-link">
							<?php echo esc_html( $rec['title'] ); ?>
						</a>
						<?php
						/**
						 * Action after each recommendation item.
						 *
						 * @since 1.0.0
						 * @param array $rec     Recommendation data.
						 * @param int   $post_id Current post ID.
						 */
						do_action( 'seil_after_recommendation_item', $rec, get_the_ID() );
						?>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
		<?php
		$html = ob_get_clean();

		/**
		 * Filter the final recommendations HTML.
		 *
		 * @since 1.0.0
		 * @param string $html            HTML output.
		 * @param array  $recommendations Recommendations data.
		 * @param int    $post_id         Current post ID.
		 */
		return apply_filters( 'seil_recommendations_html', $html, $recommendations, get_the_ID() );
	}

	/**
	 * Enqueue public styles.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_styles() {
		// Only load on singular pages when enabled.
		if ( ! is_singular() ) {
			return;
		}

		$enabled = isset( $this->options['enabled'] ) ? $this->options['enabled'] : true;

		if ( ! $enabled ) {
			return;
		}

		// Only load for selected post types.
		$post_type          = get_post_type();
		$allowed_post_types = isset( $this->options['post_types'] ) ? $this->options['post_types'] : array( 'post', 'page' );

		if ( ! in_array( $post_type, $allowed_post_types, true ) ) {
			return;
		}

		wp_enqueue_style(
			'seil-public',
			SEIL_PLUGIN_URL . 'public/css/public.css',
			array(),
			SEIL_VERSION
		);

		// Add custom CSS if any style options are set.
		$custom_css = $this->get_custom_css();
		if ( ! empty( $custom_css ) ) {
			wp_add_inline_style( 'seil-public', $custom_css );
		}
	}

	/**
	 * Generate custom CSS based on settings.
	 *
	 * @since 1.0.0
	 * @return string Custom CSS or empty string.
	 */
	private function get_custom_css() {
		$css_vars = array();

		// Background color.
		if ( ! empty( $this->options['style_bg_color'] ) ) {
			$css_vars[] = '--seil-bg-color: ' . esc_attr( $this->options['style_bg_color'] );
		}

		// Border color.
		if ( ! empty( $this->options['style_border_color'] ) ) {
			$css_vars[] = '--seil-border-color: ' . esc_attr( $this->options['style_border_color'] );
		}

		// Heading color.
		if ( ! empty( $this->options['style_heading_color'] ) ) {
			$css_vars[] = '--seil-heading-color: ' . esc_attr( $this->options['style_heading_color'] );
		}

		// Link color.
		if ( ! empty( $this->options['style_link_color'] ) ) {
			$css_vars[] = '--seil-link-color: ' . esc_attr( $this->options['style_link_color'] );
			$css_vars[] = '--seil-link-hover-color: ' . esc_attr( $this->options['style_link_color'] );
		}

		if ( empty( $css_vars ) ) {
			return '';
		}

		return '.seil-related-content { ' . implode( '; ', $css_vars ) . '; }';
	}

	/**
	 * Clear recommendations cache for a post.
	 *
	 * @since 1.0.0
	 * @param int $post_id Post ID.
	 */
	public static function clear_cache( $post_id ) {
		global $wpdb;

		// Delete all transients for this post.
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->options}
				WHERE option_name LIKE %s
				OR option_name LIKE %s",
				'_transient_seil_rec_' . $post_id . '_%',
				'_transient_timeout_seil_rec_' . $post_id . '_%'
			)
		);
	}

	/**
	 * Clear all recommendations cache.
	 *
	 * @since 1.0.0
	 */
	public static function clear_all_cache() {
		global $wpdb;

		$wpdb->query(
			"DELETE FROM {$wpdb->options}
			WHERE option_name LIKE '_transient_seil_rec_%'
			OR option_name LIKE '_transient_timeout_seil_rec_%'"
		);
	}
}
