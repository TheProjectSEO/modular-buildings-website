<?php
/**
 * Semantic Internal Linking
 *
 * @package           Semantic_Internal_Linking
 * @author            TheProjectSEO
 * @copyright         2024 TheProjectSEO
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       Semantic Internal Linking
 * Plugin URI:        https://theprojectseo.com/semantic-internal-linking
 * Description:       Automatically suggests internal links based on content similarity using TF-IDF analysis. Improve your site's SEO with smart, relevant internal linking.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            TheProjectSEO
 * Author URI:        https://theprojectseo.com
 * Text Domain:       semantic-internal-linking
 * Domain Path:       /languages
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Current plugin version.
 */
define( 'SEIL_VERSION', '1.0.0' );

/**
 * Plugin base path.
 */
define( 'SEIL_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

/**
 * Plugin base URL.
 */
define( 'SEIL_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Plugin basename.
 */
define( 'SEIL_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Database version for schema updates.
 */
define( 'SEIL_DB_VERSION', '1.0.0' );

/**
 * Load required class files.
 */
require_once SEIL_PLUGIN_PATH . 'includes/class-seil-activator.php';
require_once SEIL_PLUGIN_PATH . 'includes/class-seil-database.php';
require_once SEIL_PLUGIN_PATH . 'includes/class-seil-sitemap-parser.php';
require_once SEIL_PLUGIN_PATH . 'includes/class-seil-content-processor.php';
require_once SEIL_PLUGIN_PATH . 'includes/class-seil-tfidf-engine.php';
require_once SEIL_PLUGIN_PATH . 'includes/class-seil-recommendations.php';

if ( is_admin() ) {
	require_once SEIL_PLUGIN_PATH . 'admin/class-seil-admin.php';
}

/**
 * Plugin activation hook.
 */
register_activation_hook( __FILE__, array( 'SEIL_Activator', 'activate' ) );

/**
 * Plugin deactivation hook.
 */
register_deactivation_hook( __FILE__, array( 'SEIL_Activator', 'deactivate' ) );

/**
 * Initialize the plugin.
 *
 * @since 1.0.0
 */
function seil_init() {
	// Load text domain for translations.
	load_plugin_textdomain(
		'semantic-internal-linking',
		false,
		dirname( SEIL_PLUGIN_BASENAME ) . '/languages/'
	);

	// Initialize admin.
	if ( is_admin() ) {
		new SEIL_Admin();
	}

	// Initialize recommendations display.
	new SEIL_Recommendations();
}
add_action( 'plugins_loaded', 'seil_init' );

/**
 * Check for database updates on admin init.
 *
 * @since 1.0.0
 */
function seil_check_db_update() {
	$current_db_version = get_option( 'seil_db_version', '0' );

	if ( version_compare( $current_db_version, SEIL_DB_VERSION, '<' ) ) {
		SEIL_Activator::create_tables();
		update_option( 'seil_db_version', SEIL_DB_VERSION );
	}
}
add_action( 'admin_init', 'seil_check_db_update' );

/**
 * Add settings link on plugin page.
 *
 * @since 1.0.0
 * @param array $links Existing plugin action links.
 * @return array Modified plugin action links.
 */
function seil_plugin_action_links( $links ) {
	$settings_link = sprintf(
		'<a href="%s">%s</a>',
		esc_url( admin_url( 'options-general.php?page=semantic-internal-linking' ) ),
		esc_html__( 'Settings', 'semantic-internal-linking' )
	);

	array_unshift( $links, $settings_link );

	return $links;
}
add_filter( 'plugin_action_links_' . SEIL_PLUGIN_BASENAME, 'seil_plugin_action_links' );

/**
 * Register the background processing cron hook.
 *
 * @since 1.0.0
 */
function seil_process_batch() {
	$engine = new SEIL_TfIdf_Engine();
	$engine->process_batch();
}
add_action( 'seil_process_batch', 'seil_process_batch' );
