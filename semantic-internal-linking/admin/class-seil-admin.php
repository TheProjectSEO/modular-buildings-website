<?php
/**
 * Admin settings page handler.
 *
 * @package Semantic_Internal_Linking
 * @since   1.0.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class SEIL_Admin
 *
 * Handles the admin settings page, AJAX handlers, and admin functionality.
 *
 * @since 1.0.0
 */
class SEIL_Admin {

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
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		// AJAX handlers.
		add_action( 'wp_ajax_seil_start_index', array( $this, 'ajax_start_index' ) );
		add_action( 'wp_ajax_seil_process_batch', array( $this, 'ajax_process_batch' ) );
		add_action( 'wp_ajax_seil_get_progress', array( $this, 'ajax_get_progress' ) );
		add_action( 'wp_ajax_seil_clear_data', array( $this, 'ajax_clear_data' ) );
	}

	/**
	 * Add admin menu page.
	 *
	 * @since 1.0.0
	 */
	public function add_admin_menu() {
		add_options_page(
			__( 'Semantic Internal Linking', 'semantic-internal-linking' ),
			__( 'Internal Linking', 'semantic-internal-linking' ),
			'manage_options',
			'semantic-internal-linking',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Register settings using Settings API.
	 *
	 * @since 1.0.0
	 */
	public function register_settings() {
		register_setting(
			'seil_settings_group',
			'seil_settings',
			array(
				'type'              => 'array',
				'sanitize_callback' => array( $this, 'sanitize_settings' ),
			)
		);

		// General Settings Section.
		add_settings_section(
			'seil_general_section',
			__( 'General Settings', 'semantic-internal-linking' ),
			array( $this, 'render_general_section' ),
			'semantic-internal-linking'
		);

		// Post Types field.
		add_settings_field(
			'post_types',
			__( 'Post Types', 'semantic-internal-linking' ),
			array( $this, 'render_post_types_field' ),
			'semantic-internal-linking',
			'seil_general_section'
		);

		// Sitemap URL field.
		add_settings_field(
			'sitemap_url',
			__( 'Sitemap URL', 'semantic-internal-linking' ),
			array( $this, 'render_sitemap_url_field' ),
			'semantic-internal-linking',
			'seil_general_section'
		);

		// Similarity threshold field.
		add_settings_field(
			'similarity_threshold',
			__( 'Similarity Threshold', 'semantic-internal-linking' ),
			array( $this, 'render_similarity_threshold_field' ),
			'semantic-internal-linking',
			'seil_general_section'
		);

		// Max recommendations field.
		add_settings_field(
			'max_recommendations',
			__( 'Maximum Recommendations', 'semantic-internal-linking' ),
			array( $this, 'render_max_recommendations_field' ),
			'semantic-internal-linking',
			'seil_general_section'
		);

		// Display Settings Section.
		add_settings_section(
			'seil_display_section',
			__( 'Display Settings', 'semantic-internal-linking' ),
			array( $this, 'render_display_section' ),
			'semantic-internal-linking'
		);

		// Enabled field.
		add_settings_field(
			'enabled',
			__( 'Enable Recommendations', 'semantic-internal-linking' ),
			array( $this, 'render_enabled_field' ),
			'semantic-internal-linking',
			'seil_display_section'
		);

		// Display position field.
		add_settings_field(
			'display_position',
			__( 'Display Position', 'semantic-internal-linking' ),
			array( $this, 'render_display_position_field' ),
			'semantic-internal-linking',
			'seil_display_section'
		);

		// Heading text field.
		add_settings_field(
			'heading_text',
			__( 'Section Heading', 'semantic-internal-linking' ),
			array( $this, 'render_heading_text_field' ),
			'semantic-internal-linking',
			'seil_display_section'
		);

		// Style Settings Section.
		add_settings_section(
			'seil_style_section',
			__( 'Style Settings', 'semantic-internal-linking' ),
			array( $this, 'render_style_section' ),
			'semantic-internal-linking'
		);

		// Background color field.
		add_settings_field(
			'style_bg_color',
			__( 'Background Color', 'semantic-internal-linking' ),
			array( $this, 'render_style_bg_color_field' ),
			'semantic-internal-linking',
			'seil_style_section'
		);

		// Border color field.
		add_settings_field(
			'style_border_color',
			__( 'Border Color', 'semantic-internal-linking' ),
			array( $this, 'render_style_border_color_field' ),
			'semantic-internal-linking',
			'seil_style_section'
		);

		// Heading color field.
		add_settings_field(
			'style_heading_color',
			__( 'Heading Color', 'semantic-internal-linking' ),
			array( $this, 'render_style_heading_color_field' ),
			'semantic-internal-linking',
			'seil_style_section'
		);

		// Link color field.
		add_settings_field(
			'style_link_color',
			__( 'Link Color', 'semantic-internal-linking' ),
			array( $this, 'render_style_link_color_field' ),
			'semantic-internal-linking',
			'seil_style_section'
		);

		// Advanced Settings Section.
		add_settings_section(
			'seil_advanced_section',
			__( 'Advanced Settings', 'semantic-internal-linking' ),
			array( $this, 'render_advanced_section' ),
			'semantic-internal-linking'
		);

		// Excluded URLs field.
		add_settings_field(
			'excluded_urls',
			__( 'Excluded URL Patterns', 'semantic-internal-linking' ),
			array( $this, 'render_excluded_urls_field' ),
			'semantic-internal-linking',
			'seil_advanced_section'
		);
	}

	/**
	 * Sanitize settings input.
	 *
	 * @since 1.0.0
	 * @param array $input Raw input.
	 * @return array Sanitized input.
	 */
	public function sanitize_settings( $input ) {
		$sanitized = array();

		// Post Types.
		$public_post_types = get_post_types( array( 'public' => true ), 'names' );
		if ( isset( $input['post_types'] ) && is_array( $input['post_types'] ) ) {
			$sanitized['post_types'] = array_intersect( $input['post_types'], array_keys( $public_post_types ) );
		} else {
			// Default to post and page if nothing selected.
			$sanitized['post_types'] = array( 'post', 'page' );
		}

		// Sitemap URL.
		$sanitized['sitemap_url'] = isset( $input['sitemap_url'] )
			? esc_url_raw( $input['sitemap_url'] )
			: '';

		// Similarity threshold (0.1 - 0.9).
		$sanitized['similarity_threshold'] = isset( $input['similarity_threshold'] )
			? max( 0.1, min( 0.9, floatval( $input['similarity_threshold'] ) ) )
			: 0.3;

		// Max recommendations (1-20).
		$sanitized['max_recommendations'] = isset( $input['max_recommendations'] )
			? max( 1, min( 20, absint( $input['max_recommendations'] ) ) )
			: 5;

		// Enabled.
		$sanitized['enabled'] = isset( $input['enabled'] ) && $input['enabled'] ? true : false;

		// Display position.
		$sanitized['display_position'] = isset( $input['display_position'] )
			&& in_array( $input['display_position'], array( 'after_content', 'shortcode_only' ), true )
			? $input['display_position']
			: 'after_content';

		// Heading text.
		$sanitized['heading_text'] = isset( $input['heading_text'] )
			? sanitize_text_field( $input['heading_text'] )
			: __( 'Related Articles', 'semantic-internal-linking' );

		// Excluded URLs.
		$sanitized['excluded_urls'] = isset( $input['excluded_urls'] )
			? sanitize_textarea_field( $input['excluded_urls'] )
			: '';

		// Style settings - empty means inherit from theme.
		$sanitized['style_bg_color'] = isset( $input['style_bg_color'] )
			? $this->sanitize_color( $input['style_bg_color'] )
			: '';

		$sanitized['style_border_color'] = isset( $input['style_border_color'] )
			? $this->sanitize_color( $input['style_border_color'] )
			: '';

		$sanitized['style_heading_color'] = isset( $input['style_heading_color'] )
			? $this->sanitize_color( $input['style_heading_color'] )
			: '';

		$sanitized['style_link_color'] = isset( $input['style_link_color'] )
			? $this->sanitize_color( $input['style_link_color'] )
			: '';

		return $sanitized;
	}

	/**
	 * Sanitize a color value.
	 *
	 * @since 1.0.0
	 * @param string $color Color value (hex or empty).
	 * @return string Sanitized color or empty string.
	 */
	private function sanitize_color( $color ) {
		$color = trim( $color );

		// Allow empty for "inherit from theme".
		if ( empty( $color ) ) {
			return '';
		}

		// Validate hex color.
		if ( preg_match( '/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color ) ) {
			return $color;
		}

		return '';
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @since 1.0.0
	 * @param string $hook Current admin page hook.
	 */
	public function enqueue_assets( $hook ) {
		if ( 'settings_page_semantic-internal-linking' !== $hook ) {
			return;
		}

		// Enqueue WordPress color picker.
		wp_enqueue_style( 'wp-color-picker' );

		wp_enqueue_style(
			'seil-admin',
			SEIL_PLUGIN_URL . 'admin/css/admin.css',
			array( 'wp-color-picker' ),
			SEIL_VERSION
		);

		wp_enqueue_script(
			'seil-admin',
			SEIL_PLUGIN_URL . 'admin/js/admin.js',
			array( 'jquery', 'wp-color-picker' ),
			SEIL_VERSION,
			true
		);

		wp_localize_script(
			'seil-admin',
			'seil_admin',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce'    => wp_create_nonce( 'seil_admin_nonce' ),
				'i18n'     => array(
					'confirm_clear'   => __( 'Are you sure you want to clear all indexed data? This cannot be undone.', 'semantic-internal-linking' ),
					'indexing'        => __( 'Indexing...', 'semantic-internal-linking' ),
					'processing'      => __( 'Processing content...', 'semantic-internal-linking' ),
					'calculating'     => __( 'Calculating similarities...', 'semantic-internal-linking' ),
					'complete'        => __( 'Indexing complete!', 'semantic-internal-linking' ),
					'error'           => __( 'An error occurred. Please try again.', 'semantic-internal-linking' ),
					'start_index'     => __( 'Start Indexing', 'semantic-internal-linking' ),
				),
			)
		);
	}

	/**
	 * Render settings page.
	 *
	 * @since 1.0.0
	 */
	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$this->options = get_option( 'seil_settings', array() );
		$db            = new SEIL_Database();
		$stats         = $db->get_statistics();
		$engine        = new SEIL_TfIdf_Engine();
		$progress      = $engine->get_index_progress();
		?>
		<div class="wrap seil-admin-wrap">
			<h1><?php esc_html_e( 'Semantic Internal Linking', 'semantic-internal-linking' ); ?></h1>
			<p class="description">
				<?php esc_html_e( 'Automatically suggest related content based on TF-IDF content similarity analysis.', 'semantic-internal-linking' ); ?>
			</p>

			<!-- Statistics Box -->
			<div class="seil-stats-box">
				<h2><?php esc_html_e( 'Index Statistics', 'semantic-internal-linking' ); ?></h2>
				<div class="seil-stats-grid">
					<div class="seil-stat">
						<span class="seil-stat-value"><?php echo esc_html( $stats['total_content'] ); ?></span>
						<span class="seil-stat-label"><?php esc_html_e( 'Total URLs', 'semantic-internal-linking' ); ?></span>
					</div>
					<div class="seil-stat">
						<span class="seil-stat-value"><?php echo esc_html( $stats['indexed_content'] ); ?></span>
						<span class="seil-stat-label"><?php esc_html_e( 'Indexed', 'semantic-internal-linking' ); ?></span>
					</div>
					<div class="seil-stat">
						<span class="seil-stat-value"><?php echo esc_html( $stats['total_terms'] ); ?></span>
						<span class="seil-stat-label"><?php esc_html_e( 'Unique Terms', 'semantic-internal-linking' ); ?></span>
					</div>
					<div class="seil-stat">
						<span class="seil-stat-value"><?php echo esc_html( $stats['total_similarities'] ); ?></span>
						<span class="seil-stat-label"><?php esc_html_e( 'Similarity Links', 'semantic-internal-linking' ); ?></span>
					</div>
				</div>

				<!-- Index Actions -->
				<div class="seil-index-actions">
					<button type="button" id="seil-start-index" class="button button-primary">
						<?php esc_html_e( 'Start Indexing', 'semantic-internal-linking' ); ?>
					</button>
					<button type="button" id="seil-clear-data" class="button">
						<?php esc_html_e( 'Clear All Data', 'semantic-internal-linking' ); ?>
					</button>
					<span class="spinner"></span>
				</div>

				<!-- Progress Bar -->
				<div id="seil-progress-container" style="display: <?php echo $progress['status'] === 'processing' ? 'block' : 'none'; ?>;">
					<div class="seil-progress-bar">
						<div class="seil-progress-fill" style="width: <?php echo esc_attr( $progress['percent'] ); ?>%;"></div>
					</div>
					<p class="seil-progress-text">
						<span id="seil-progress-status"><?php echo esc_html( $progress['status'] ); ?></span>:
						<span id="seil-progress-percent"><?php echo esc_html( $progress['percent'] ); ?>%</span>
						(<span id="seil-progress-count"><?php echo esc_html( $progress['processed'] ); ?></span> /
						<span id="seil-progress-total"><?php echo esc_html( $progress['total'] ); ?></span>)
					</p>
				</div>
			</div>

			<!-- Settings Form -->
			<form method="post" action="options.php">
				<?php
				settings_fields( 'seil_settings_group' );
				do_settings_sections( 'semantic-internal-linking' );
				submit_button();
				?>
			</form>

			<!-- Shortcode Info -->
			<div class="seil-shortcode-info">
				<h2><?php esc_html_e( 'Shortcode Usage', 'semantic-internal-linking' ); ?></h2>
				<p><?php esc_html_e( 'Use the following shortcode to display related links anywhere:', 'semantic-internal-linking' ); ?></p>
				<code>[semantic_links]</code>
				<p><?php esc_html_e( 'Optional attributes:', 'semantic-internal-linking' ); ?></p>
				<ul>
					<li><code>limit="5"</code> - <?php esc_html_e( 'Number of links to show', 'semantic-internal-linking' ); ?></li>
					<li><code>threshold="0.3"</code> - <?php esc_html_e( 'Minimum similarity score', 'semantic-internal-linking' ); ?></li>
				</ul>
			</div>
		</div>
		<?php
	}

	/**
	 * Render general section description.
	 *
	 * @since 1.0.0
	 */
	public function render_general_section() {
		echo '<p>' . esc_html__( 'Configure the content analysis settings.', 'semantic-internal-linking' ) . '</p>';
	}

	/**
	 * Render display section description.
	 *
	 * @since 1.0.0
	 */
	public function render_display_section() {
		echo '<p>' . esc_html__( 'Configure how recommendations are displayed on your site.', 'semantic-internal-linking' ) . '</p>';
	}

	/**
	 * Render advanced section description.
	 *
	 * @since 1.0.0
	 */
	public function render_advanced_section() {
		echo '<p>' . esc_html__( 'Advanced configuration options.', 'semantic-internal-linking' ) . '</p>';
	}

	/**
	 * Render style section description.
	 *
	 * @since 1.0.0
	 */
	public function render_style_section() {
		echo '<p>' . esc_html__( 'Customize the appearance of related links. Leave fields empty to inherit from your theme.', 'semantic-internal-linking' ) . '</p>';
	}

	/**
	 * Render background color field.
	 *
	 * @since 1.0.0
	 */
	public function render_style_bg_color_field() {
		$value = isset( $this->options['style_bg_color'] ) ? $this->options['style_bg_color'] : '';
		?>
		<input type="text"
			   id="seil_style_bg_color"
			   name="seil_settings[style_bg_color]"
			   value="<?php echo esc_attr( $value ); ?>"
			   class="seil-color-picker"
			   data-default-color=""
			   placeholder="<?php esc_attr_e( 'Inherit from theme', 'semantic-internal-linking' ); ?>">
		<p class="description">
			<?php esc_html_e( 'Background color for the related links box. Leave empty to use transparent/inherit.', 'semantic-internal-linking' ); ?>
		</p>
		<?php
	}

	/**
	 * Render border color field.
	 *
	 * @since 1.0.0
	 */
	public function render_style_border_color_field() {
		$value = isset( $this->options['style_border_color'] ) ? $this->options['style_border_color'] : '';
		?>
		<input type="text"
			   id="seil_style_border_color"
			   name="seil_settings[style_border_color]"
			   value="<?php echo esc_attr( $value ); ?>"
			   class="seil-color-picker"
			   data-default-color=""
			   placeholder="<?php esc_attr_e( 'Inherit from theme', 'semantic-internal-linking' ); ?>">
		<p class="description">
			<?php esc_html_e( 'Border color for the container and heading underline.', 'semantic-internal-linking' ); ?>
		</p>
		<?php
	}

	/**
	 * Render heading color field.
	 *
	 * @since 1.0.0
	 */
	public function render_style_heading_color_field() {
		$value = isset( $this->options['style_heading_color'] ) ? $this->options['style_heading_color'] : '';
		?>
		<input type="text"
			   id="seil_style_heading_color"
			   name="seil_settings[style_heading_color]"
			   value="<?php echo esc_attr( $value ); ?>"
			   class="seil-color-picker"
			   data-default-color=""
			   placeholder="<?php esc_attr_e( 'Inherit from theme', 'semantic-internal-linking' ); ?>">
		<p class="description">
			<?php esc_html_e( 'Color for the section heading text.', 'semantic-internal-linking' ); ?>
		</p>
		<?php
	}

	/**
	 * Render link color field.
	 *
	 * @since 1.0.0
	 */
	public function render_style_link_color_field() {
		$value = isset( $this->options['style_link_color'] ) ? $this->options['style_link_color'] : '';
		?>
		<input type="text"
			   id="seil_style_link_color"
			   name="seil_settings[style_link_color]"
			   value="<?php echo esc_attr( $value ); ?>"
			   class="seil-color-picker"
			   data-default-color=""
			   placeholder="<?php esc_attr_e( 'Inherit from theme', 'semantic-internal-linking' ); ?>">
		<p class="description">
			<?php esc_html_e( 'Color for the related links. Leave empty to use your theme link color.', 'semantic-internal-linking' ); ?>
		</p>
		<?php
	}

	/**
	 * Render post types field.
	 *
	 * @since 1.0.0
	 */
	public function render_post_types_field() {
		$selected = isset( $this->options['post_types'] ) ? $this->options['post_types'] : array( 'post', 'page' );
		$post_types = get_post_types( array( 'public' => true ), 'objects' );

		// Remove attachment post type.
		unset( $post_types['attachment'] );
		?>
		<fieldset class="seil-post-types-list">
			<?php foreach ( $post_types as $post_type ) : ?>
				<label>
					<input type="checkbox"
						   name="seil_settings[post_types][]"
						   value="<?php echo esc_attr( $post_type->name ); ?>"
						   <?php checked( in_array( $post_type->name, $selected, true ) ); ?>>
					<?php echo esc_html( $post_type->labels->name ); ?>
				</label><br>
			<?php endforeach; ?>
		</fieldset>
		<p class="description">
			<?php esc_html_e( 'Select which post types to include in the internal linking index.', 'semantic-internal-linking' ); ?>
		</p>
		<?php
	}

	/**
	 * Render sitemap URL field.
	 *
	 * @since 1.0.0
	 */
	public function render_sitemap_url_field() {
		$value = isset( $this->options['sitemap_url'] ) ? $this->options['sitemap_url'] : '';
		?>
		<input type="url"
			   id="seil_sitemap_url"
			   name="seil_settings[sitemap_url]"
			   value="<?php echo esc_url( $value ); ?>"
			   class="regular-text"
			   placeholder="<?php echo esc_attr( home_url( '/sitemap.xml' ) ); ?>">
		<p class="description">
			<?php esc_html_e( 'Enter your sitemap URL. Leave empty for auto-detection.', 'semantic-internal-linking' ); ?>
		</p>
		<?php
	}

	/**
	 * Render similarity threshold field.
	 *
	 * @since 1.0.0
	 */
	public function render_similarity_threshold_field() {
		$value = isset( $this->options['similarity_threshold'] ) ? $this->options['similarity_threshold'] : 0.3;
		?>
		<input type="range"
			   id="seil_similarity_threshold"
			   name="seil_settings[similarity_threshold]"
			   value="<?php echo esc_attr( $value ); ?>"
			   min="0.1"
			   max="0.9"
			   step="0.05"
			   class="seil-range">
		<span id="seil_threshold_value"><?php echo esc_html( $value ); ?></span>
		<p class="description">
			<?php esc_html_e( 'Minimum similarity score (0.1-0.9). Higher values = stricter matching.', 'semantic-internal-linking' ); ?>
		</p>
		<?php
	}

	/**
	 * Render max recommendations field.
	 *
	 * @since 1.0.0
	 */
	public function render_max_recommendations_field() {
		$value = isset( $this->options['max_recommendations'] ) ? $this->options['max_recommendations'] : 5;
		?>
		<input type="number"
			   id="seil_max_recommendations"
			   name="seil_settings[max_recommendations]"
			   value="<?php echo esc_attr( $value ); ?>"
			   min="1"
			   max="20"
			   class="small-text">
		<p class="description">
			<?php esc_html_e( 'Maximum number of related links to show per post (1-20).', 'semantic-internal-linking' ); ?>
		</p>
		<?php
	}

	/**
	 * Render enabled field.
	 *
	 * @since 1.0.0
	 */
	public function render_enabled_field() {
		$value = isset( $this->options['enabled'] ) ? $this->options['enabled'] : true;
		?>
		<label>
			<input type="checkbox"
				   id="seil_enabled"
				   name="seil_settings[enabled]"
				   value="1"
				   <?php checked( $value, true ); ?>>
			<?php esc_html_e( 'Display related links on posts and pages', 'semantic-internal-linking' ); ?>
		</label>
		<?php
	}

	/**
	 * Render display position field.
	 *
	 * @since 1.0.0
	 */
	public function render_display_position_field() {
		$value = isset( $this->options['display_position'] ) ? $this->options['display_position'] : 'after_content';
		?>
		<select id="seil_display_position" name="seil_settings[display_position]">
			<option value="after_content" <?php selected( $value, 'after_content' ); ?>>
				<?php esc_html_e( 'After content', 'semantic-internal-linking' ); ?>
			</option>
			<option value="shortcode_only" <?php selected( $value, 'shortcode_only' ); ?>>
				<?php esc_html_e( 'Shortcode only', 'semantic-internal-linking' ); ?>
			</option>
		</select>
		<p class="description">
			<?php esc_html_e( 'Choose where to display related links automatically.', 'semantic-internal-linking' ); ?>
		</p>
		<?php
	}

	/**
	 * Render heading text field.
	 *
	 * @since 1.0.0
	 */
	public function render_heading_text_field() {
		$value = isset( $this->options['heading_text'] ) ? $this->options['heading_text'] : __( 'Related Articles', 'semantic-internal-linking' );
		?>
		<input type="text"
			   id="seil_heading_text"
			   name="seil_settings[heading_text]"
			   value="<?php echo esc_attr( $value ); ?>"
			   class="regular-text">
		<p class="description">
			<?php esc_html_e( 'Heading text for the related links section.', 'semantic-internal-linking' ); ?>
		</p>
		<?php
	}

	/**
	 * Render excluded URLs field.
	 *
	 * @since 1.0.0
	 */
	public function render_excluded_urls_field() {
		$value = isset( $this->options['excluded_urls'] ) ? $this->options['excluded_urls'] : '';
		?>
		<textarea id="seil_excluded_urls"
				  name="seil_settings[excluded_urls]"
				  rows="5"
				  class="large-text code"><?php echo esc_textarea( $value ); ?></textarea>
		<p class="description">
			<?php esc_html_e( 'URL patterns to exclude from indexing (one per line). Example: /private/', 'semantic-internal-linking' ); ?>
		</p>
		<?php
	}

	/**
	 * AJAX handler: Start indexing.
	 *
	 * @since 1.0.0
	 */
	public function ajax_start_index() {
		check_ajax_referer( 'seil_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Unauthorized.', 'semantic-internal-linking' ) ), 403 );
		}

		$engine = new SEIL_TfIdf_Engine();
		$result = $engine->start_index();

		if ( is_wp_error( $result ) ) {
			wp_send_json_error( array( 'message' => $result->get_error_message() ) );
		}

		wp_send_json_success( $result );
	}

	/**
	 * AJAX handler: Process a batch of content.
	 *
	 * @since 1.0.0
	 */
	public function ajax_process_batch() {
		check_ajax_referer( 'seil_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Unauthorized.', 'semantic-internal-linking' ) ), 403 );
		}

		$engine = new SEIL_TfIdf_Engine();
		$result = $engine->process_batch();

		// Get updated progress.
		$progress = $engine->get_index_progress();
		$result   = array_merge( $result, $progress );

		wp_send_json_success( $result );
	}

	/**
	 * AJAX handler: Get progress.
	 *
	 * @since 1.0.0
	 */
	public function ajax_get_progress() {
		check_ajax_referer( 'seil_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Unauthorized.', 'semantic-internal-linking' ) ), 403 );
		}

		$engine   = new SEIL_TfIdf_Engine();
		$progress = $engine->get_index_progress();

		wp_send_json_success( $progress );
	}

	/**
	 * AJAX handler: Clear all data.
	 *
	 * @since 1.0.0
	 */
	public function ajax_clear_data() {
		check_ajax_referer( 'seil_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Unauthorized.', 'semantic-internal-linking' ) ), 403 );
		}

		$db = new SEIL_Database();
		$db->clear_all_data();

		delete_transient( 'seil_index_progress' );

		wp_send_json_success( array( 'message' => __( 'All data cleared.', 'semantic-internal-linking' ) ) );
	}
}
