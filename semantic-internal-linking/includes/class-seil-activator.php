<?php
/**
 * Plugin activation and deactivation handler.
 *
 * @package Semantic_Internal_Linking
 * @since   1.0.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class SEIL_Activator
 *
 * Handles plugin activation and deactivation tasks including
 * database table creation and cleanup.
 *
 * @since 1.0.0
 */
class SEIL_Activator {

	/**
	 * Plugin activation callback.
	 *
	 * Creates database tables, sets default options, and schedules cron events.
	 *
	 * @since 1.0.0
	 */
	public static function activate() {
		// Check PHP version.
		if ( version_compare( PHP_VERSION, '7.4', '<' ) ) {
			deactivate_plugins( SEIL_PLUGIN_BASENAME );
			wp_die(
				esc_html__( 'Semantic Internal Linking requires PHP 7.4 or higher.', 'semantic-internal-linking' ),
				esc_html__( 'Plugin Activation Error', 'semantic-internal-linking' ),
				array( 'back_link' => true )
			);
		}

		// Check WordPress version.
		if ( version_compare( get_bloginfo( 'version' ), '6.0', '<' ) ) {
			deactivate_plugins( SEIL_PLUGIN_BASENAME );
			wp_die(
				esc_html__( 'Semantic Internal Linking requires WordPress 6.0 or higher.', 'semantic-internal-linking' ),
				esc_html__( 'Plugin Activation Error', 'semantic-internal-linking' ),
				array( 'back_link' => true )
			);
		}

		// Create database tables.
		self::create_tables();

		// Set default options.
		self::set_default_options();

		// Schedule cron event for background processing.
		if ( ! wp_next_scheduled( 'seil_process_batch' ) ) {
			wp_schedule_event( time(), 'hourly', 'seil_process_batch' );
		}

		// Store database version.
		update_option( 'seil_db_version', SEIL_DB_VERSION );

		// Flush rewrite rules.
		flush_rewrite_rules();
	}

	/**
	 * Plugin deactivation callback.
	 *
	 * Clears scheduled cron events but preserves data.
	 *
	 * @since 1.0.0
	 */
	public static function deactivate() {
		// Clear scheduled cron events.
		wp_clear_scheduled_hook( 'seil_process_batch' );

		// Clear any processing status transients.
		delete_transient( 'seil_processing_status' );
		delete_transient( 'seil_index_progress' );
	}

	/**
	 * Create custom database tables.
	 *
	 * Uses dbDelta for safe table creation and updates.
	 *
	 * @since 1.0.0
	 */
	public static function create_tables() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		// Content table - stores processed document data.
		$table_content = $wpdb->prefix . 'seil_content';
		$sql_content   = "CREATE TABLE {$table_content} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			post_id bigint(20) unsigned DEFAULT NULL,
			url varchar(2083) NOT NULL,
			url_hash varchar(32) NOT NULL,
			title varchar(255) NOT NULL DEFAULT '',
			content_hash varchar(32) NOT NULL DEFAULT '',
			word_count int(11) unsigned DEFAULT 0,
			vector_norm double DEFAULT 0,
			status varchar(20) DEFAULT 'pending',
			processed_at datetime DEFAULT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY url_hash (url_hash),
			KEY post_id (post_id),
			KEY status (status)
		) {$charset_collate};";

		// Terms table - global term dictionary with IDF values.
		$table_terms = $wpdb->prefix . 'seil_terms';
		$sql_terms   = "CREATE TABLE {$table_terms} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			term varchar(100) NOT NULL,
			term_hash varchar(32) NOT NULL,
			doc_frequency int(11) unsigned DEFAULT 0,
			idf_score double DEFAULT 0,
			PRIMARY KEY  (id),
			UNIQUE KEY term_hash (term_hash),
			KEY doc_frequency (doc_frequency)
		) {$charset_collate};";

		// TF-IDF table - sparse TF-IDF vectors.
		$table_tfidf = $wpdb->prefix . 'seil_tfidf';
		$sql_tfidf   = "CREATE TABLE {$table_tfidf} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			content_id bigint(20) unsigned NOT NULL,
			term_id bigint(20) unsigned NOT NULL,
			tfidf_score double NOT NULL,
			PRIMARY KEY  (id),
			UNIQUE KEY content_term (content_id, term_id),
			KEY term_id (term_id),
			KEY content_id (content_id)
		) {$charset_collate};";

		// Similarity table - pre-computed similarity scores.
		$table_similarity = $wpdb->prefix . 'seil_similarity';
		$sql_similarity   = "CREATE TABLE {$table_similarity} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			content_id_a bigint(20) unsigned NOT NULL,
			content_id_b bigint(20) unsigned NOT NULL,
			similarity_score double NOT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY pair (content_id_a, content_id_b),
			KEY content_a_score (content_id_a, similarity_score DESC),
			KEY content_b (content_id_b)
		) {$charset_collate};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		dbDelta( $sql_content );
		dbDelta( $sql_terms );
		dbDelta( $sql_tfidf );
		dbDelta( $sql_similarity );
	}

	/**
	 * Set default plugin options.
	 *
	 * Only sets options if they don't already exist to preserve user settings.
	 *
	 * @since 1.0.0
	 */
	private static function set_default_options() {
		$defaults = array(
			'sitemap_url'          => '',
			'similarity_threshold' => 0.3,
			'max_recommendations'  => 5,
			'enabled'              => true,
			'display_position'     => 'after_content',
			'heading_text'         => __( 'Related Articles', 'semantic-internal-linking' ),
			'excluded_post_types'  => array(),
			'excluded_urls'        => '',
		);

		$existing = get_option( 'seil_settings' );

		if ( false === $existing ) {
			add_option( 'seil_settings', $defaults );
		}
	}
}
