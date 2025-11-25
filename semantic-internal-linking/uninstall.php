<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package Semantic_Internal_Linking
 * @since   1.0.0
 */

// If uninstall not called from WordPress, exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Check user has permission.
if ( ! current_user_can( 'activate_plugins' ) ) {
	exit;
}

global $wpdb;

/**
 * Delete plugin data for a single site.
 *
 * @since 1.0.0
 */
function seil_uninstall_site() {
	global $wpdb;

	// Drop custom tables.
	$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}seil_similarity" );
	$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}seil_tfidf" );
	$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}seil_terms" );
	$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}seil_content" );

	// Delete plugin options.
	delete_option( 'seil_settings' );
	delete_option( 'seil_db_version' );

	// Delete transients.
	$wpdb->query(
		"DELETE FROM {$wpdb->options}
		WHERE option_name LIKE '_transient_seil_%'
		OR option_name LIKE '_transient_timeout_seil_%'"
	);

	// Clear scheduled cron events.
	wp_clear_scheduled_hook( 'seil_process_batch' );
}

// Handle multisite.
if ( is_multisite() ) {
	$sites = get_sites( array( 'fields' => 'ids' ) );

	foreach ( $sites as $site_id ) {
		switch_to_blog( $site_id );
		seil_uninstall_site();
		restore_current_blog();
	}
} else {
	seil_uninstall_site();
}
