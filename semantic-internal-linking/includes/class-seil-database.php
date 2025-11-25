<?php
/**
 * Database operations handler.
 *
 * @package Semantic_Internal_Linking
 * @since   1.0.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class SEIL_Database
 *
 * Handles all database CRUD operations for the plugin with
 * proper prepared statements and data sanitization.
 *
 * @since 1.0.0
 */
class SEIL_Database {

	/**
	 * WordPress database object.
	 *
	 * @var wpdb
	 */
	private $wpdb;

	/**
	 * Table names.
	 *
	 * @var array
	 */
	private $tables;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		global $wpdb;

		$this->wpdb   = $wpdb;
		$this->tables = array(
			'content'    => $wpdb->prefix . 'seil_content',
			'terms'      => $wpdb->prefix . 'seil_terms',
			'tfidf'      => $wpdb->prefix . 'seil_tfidf',
			'similarity' => $wpdb->prefix . 'seil_similarity',
		);
	}

	/**
	 * Get table name.
	 *
	 * @since 1.0.0
	 * @param string $table Table key (content, terms, tfidf, similarity).
	 * @return string Full table name with prefix.
	 */
	public function get_table( $table ) {
		return isset( $this->tables[ $table ] ) ? $this->tables[ $table ] : '';
	}

	// =========================================================================
	// Content Table Operations
	// =========================================================================

	/**
	 * Insert or update content record.
	 *
	 * @since 1.0.0
	 * @param array $data Content data (url, post_id, title, content_hash, word_count).
	 * @return int|false Inserted ID or false on failure.
	 */
	public function upsert_content( $data ) {
		$url_hash = md5( $data['url'] );

		$existing = $this->get_content_by_url_hash( $url_hash );

		if ( $existing ) {
			// Update existing record.
			$updated = $this->wpdb->update(
				$this->tables['content'],
				array(
					'post_id'      => isset( $data['post_id'] ) ? absint( $data['post_id'] ) : null,
					'title'        => sanitize_text_field( $data['title'] ),
					'content_hash' => sanitize_text_field( $data['content_hash'] ),
					'word_count'   => absint( $data['word_count'] ),
					'status'       => 'pending',
					'processed_at' => null,
				),
				array( 'id' => $existing->id ),
				array( '%d', '%s', '%s', '%d', '%s', '%s' ),
				array( '%d' )
			);

			return $updated !== false ? $existing->id : false;
		}

		// Insert new record.
		$inserted = $this->wpdb->insert(
			$this->tables['content'],
			array(
				'post_id'      => isset( $data['post_id'] ) ? absint( $data['post_id'] ) : null,
				'url'          => esc_url_raw( $data['url'] ),
				'url_hash'     => $url_hash,
				'title'        => sanitize_text_field( $data['title'] ),
				'content_hash' => sanitize_text_field( $data['content_hash'] ),
				'word_count'   => absint( $data['word_count'] ),
				'status'       => 'pending',
			),
			array( '%d', '%s', '%s', '%s', '%s', '%d', '%s' )
		);

		return $inserted ? $this->wpdb->insert_id : false;
	}

	/**
	 * Get content by URL hash.
	 *
	 * @since 1.0.0
	 * @param string $url_hash MD5 hash of URL.
	 * @return object|null Content object or null.
	 */
	public function get_content_by_url_hash( $url_hash ) {
		return $this->wpdb->get_row(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->tables['content']} WHERE url_hash = %s",
				$url_hash
			)
		);
	}

	/**
	 * Get content by ID.
	 *
	 * @since 1.0.0
	 * @param int $id Content ID.
	 * @return object|null Content object or null.
	 */
	public function get_content_by_id( $id ) {
		return $this->wpdb->get_row(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->tables['content']} WHERE id = %d",
				$id
			)
		);
	}

	/**
	 * Get content by post ID.
	 *
	 * @since 1.0.0
	 * @param int $post_id WordPress post ID.
	 * @return object|null Content object or null.
	 */
	public function get_content_by_post_id( $post_id ) {
		return $this->wpdb->get_row(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->tables['content']} WHERE post_id = %d",
				$post_id
			)
		);
	}

	/**
	 * Get pending content items.
	 *
	 * @since 1.0.0
	 * @param int $limit Number of items to retrieve.
	 * @return array Array of content objects.
	 */
	public function get_pending_content( $limit = 20 ) {
		return $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->tables['content']} WHERE status = 'pending' ORDER BY id ASC LIMIT %d",
				$limit
			)
		);
	}

	/**
	 * Update content status.
	 *
	 * @since 1.0.0
	 * @param int    $content_id Content ID.
	 * @param string $status     New status (pending, indexed, error).
	 * @return bool True on success, false on failure.
	 */
	public function update_content_status( $content_id, $status ) {
		$data = array(
			'status' => sanitize_text_field( $status ),
		);

		if ( 'indexed' === $status ) {
			$data['processed_at'] = current_time( 'mysql' );
		}

		return $this->wpdb->update(
			$this->tables['content'],
			$data,
			array( 'id' => $content_id ),
			array( '%s', '%s' ),
			array( '%d' )
		) !== false;
	}

	/**
	 * Update content vector norm.
	 *
	 * @since 1.0.0
	 * @param int   $content_id Content ID.
	 * @param float $norm       Vector L2 norm.
	 * @return bool True on success.
	 */
	public function update_content_norm( $content_id, $norm ) {
		return $this->wpdb->update(
			$this->tables['content'],
			array( 'vector_norm' => floatval( $norm ) ),
			array( 'id' => $content_id ),
			array( '%f' ),
			array( '%d' )
		) !== false;
	}

	/**
	 * Get total content count.
	 *
	 * @since 1.0.0
	 * @param string $status Optional status filter.
	 * @return int Count.
	 */
	public function get_content_count( $status = '' ) {
		if ( $status ) {
			return (int) $this->wpdb->get_var(
				$this->wpdb->prepare(
					"SELECT COUNT(*) FROM {$this->tables['content']} WHERE status = %s",
					$status
				)
			);
		}

		return (int) $this->wpdb->get_var(
			"SELECT COUNT(*) FROM {$this->tables['content']}"
		);
	}

	/**
	 * Get all indexed content.
	 *
	 * @since 1.0.0
	 * @return array Array of content objects.
	 */
	public function get_all_indexed_content() {
		return $this->wpdb->get_results(
			"SELECT * FROM {$this->tables['content']} WHERE status = 'indexed' ORDER BY id ASC"
		);
	}

	/**
	 * Delete content and related data.
	 *
	 * @since 1.0.0
	 * @param int $content_id Content ID.
	 * @return bool True on success.
	 */
	public function delete_content( $content_id ) {
		// Delete TF-IDF entries.
		$this->wpdb->delete(
			$this->tables['tfidf'],
			array( 'content_id' => $content_id ),
			array( '%d' )
		);

		// Delete similarity entries.
		$this->wpdb->query(
			$this->wpdb->prepare(
				"DELETE FROM {$this->tables['similarity']} WHERE content_id_a = %d OR content_id_b = %d",
				$content_id,
				$content_id
			)
		);

		// Delete content record.
		return $this->wpdb->delete(
			$this->tables['content'],
			array( 'id' => $content_id ),
			array( '%d' )
		) !== false;
	}

	// =========================================================================
	// Terms Table Operations
	// =========================================================================

	/**
	 * Insert or get term ID.
	 *
	 * @since 1.0.0
	 * @param string $term Term string.
	 * @return int Term ID.
	 */
	public function get_or_create_term( $term ) {
		$term_hash = md5( $term );

		$existing = $this->wpdb->get_var(
			$this->wpdb->prepare(
				"SELECT id FROM {$this->tables['terms']} WHERE term_hash = %s",
				$term_hash
			)
		);

		if ( $existing ) {
			return (int) $existing;
		}

		$this->wpdb->insert(
			$this->tables['terms'],
			array(
				'term'      => substr( sanitize_text_field( $term ), 0, 100 ),
				'term_hash' => $term_hash,
			),
			array( '%s', '%s' )
		);

		return $this->wpdb->insert_id;
	}

	/**
	 * Update term document frequency.
	 *
	 * @since 1.0.0
	 * @param int $term_id       Term ID.
	 * @param int $doc_frequency Document frequency count.
	 * @return bool True on success.
	 */
	public function update_term_frequency( $term_id, $doc_frequency ) {
		return $this->wpdb->update(
			$this->tables['terms'],
			array( 'doc_frequency' => absint( $doc_frequency ) ),
			array( 'id' => $term_id ),
			array( '%d' ),
			array( '%d' )
		) !== false;
	}

	/**
	 * Update term IDF score.
	 *
	 * @since 1.0.0
	 * @param int   $term_id   Term ID.
	 * @param float $idf_score IDF score.
	 * @return bool True on success.
	 */
	public function update_term_idf( $term_id, $idf_score ) {
		return $this->wpdb->update(
			$this->tables['terms'],
			array( 'idf_score' => floatval( $idf_score ) ),
			array( 'id' => $term_id ),
			array( '%f' ),
			array( '%d' )
		) !== false;
	}

	/**
	 * Get term by ID.
	 *
	 * @since 1.0.0
	 * @param int $term_id Term ID.
	 * @return object|null Term object or null.
	 */
	public function get_term( $term_id ) {
		return $this->wpdb->get_row(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->tables['terms']} WHERE id = %d",
				$term_id
			)
		);
	}

	/**
	 * Get all terms.
	 *
	 * @since 1.0.0
	 * @return array Array of term objects.
	 */
	public function get_all_terms() {
		return $this->wpdb->get_results(
			"SELECT * FROM {$this->tables['terms']} ORDER BY id ASC"
		);
	}

	/**
	 * Get total term count.
	 *
	 * @since 1.0.0
	 * @return int Count.
	 */
	public function get_term_count() {
		return (int) $this->wpdb->get_var(
			"SELECT COUNT(*) FROM {$this->tables['terms']}"
		);
	}

	// =========================================================================
	// TF-IDF Table Operations
	// =========================================================================

	/**
	 * Insert TF-IDF entry.
	 *
	 * @since 1.0.0
	 * @param int   $content_id  Content ID.
	 * @param int   $term_id     Term ID.
	 * @param float $tfidf_score TF-IDF score.
	 * @return bool True on success.
	 */
	public function insert_tfidf( $content_id, $term_id, $tfidf_score ) {
		// Use INSERT ... ON DUPLICATE KEY UPDATE for upsert.
		$result = $this->wpdb->query(
			$this->wpdb->prepare(
				"INSERT INTO {$this->tables['tfidf']} (content_id, term_id, tfidf_score)
				VALUES (%d, %d, %f)
				ON DUPLICATE KEY UPDATE tfidf_score = VALUES(tfidf_score)",
				$content_id,
				$term_id,
				$tfidf_score
			)
		);

		return $result !== false;
	}

	/**
	 * Bulk insert TF-IDF entries.
	 *
	 * @since 1.0.0
	 * @param int   $content_id Content ID.
	 * @param array $tfidf_data Array of term_id => score pairs.
	 * @return bool True on success.
	 */
	public function bulk_insert_tfidf( $content_id, $tfidf_data ) {
		if ( empty( $tfidf_data ) ) {
			return true;
		}

		// Delete existing entries for this content.
		$this->wpdb->delete(
			$this->tables['tfidf'],
			array( 'content_id' => $content_id ),
			array( '%d' )
		);

		// Build bulk insert query.
		$values = array();
		$format = array();

		foreach ( $tfidf_data as $term_id => $score ) {
			$values[] = $content_id;
			$values[] = $term_id;
			$values[] = $score;
			$format[] = '(%d, %d, %f)';
		}

		if ( empty( $format ) ) {
			return true;
		}

		$query = "INSERT INTO {$this->tables['tfidf']} (content_id, term_id, tfidf_score) VALUES " . implode( ', ', $format );

		return $this->wpdb->query( $this->wpdb->prepare( $query, $values ) ) !== false;
	}

	/**
	 * Get TF-IDF vector for content.
	 *
	 * @since 1.0.0
	 * @param int $content_id Content ID.
	 * @return array Associative array of term_id => score.
	 */
	public function get_tfidf_vector( $content_id ) {
		$results = $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT term_id, tfidf_score FROM {$this->tables['tfidf']} WHERE content_id = %d",
				$content_id
			)
		);

		$vector = array();
		foreach ( $results as $row ) {
			$vector[ $row->term_id ] = floatval( $row->tfidf_score );
		}

		return $vector;
	}

	/**
	 * Get content IDs that contain a specific term.
	 *
	 * @since 1.0.0
	 * @param int $term_id Term ID.
	 * @return array Array of content IDs.
	 */
	public function get_content_ids_with_term( $term_id ) {
		return $this->wpdb->get_col(
			$this->wpdb->prepare(
				"SELECT DISTINCT content_id FROM {$this->tables['tfidf']} WHERE term_id = %d",
				$term_id
			)
		);
	}

	/**
	 * Delete TF-IDF entries for content.
	 *
	 * @since 1.0.0
	 * @param int $content_id Content ID.
	 * @return bool True on success.
	 */
	public function delete_tfidf( $content_id ) {
		return $this->wpdb->delete(
			$this->tables['tfidf'],
			array( 'content_id' => $content_id ),
			array( '%d' )
		) !== false;
	}

	// =========================================================================
	// Similarity Table Operations
	// =========================================================================

	/**
	 * Insert or update similarity score.
	 *
	 * @since 1.0.0
	 * @param int   $content_id_a    First content ID.
	 * @param int   $content_id_b    Second content ID.
	 * @param float $similarity_score Similarity score.
	 * @return bool True on success.
	 */
	public function upsert_similarity( $content_id_a, $content_id_b, $similarity_score ) {
		// Ensure consistent ordering (smaller ID first).
		if ( $content_id_a > $content_id_b ) {
			$temp          = $content_id_a;
			$content_id_a  = $content_id_b;
			$content_id_b  = $temp;
		}

		$result = $this->wpdb->query(
			$this->wpdb->prepare(
				"INSERT INTO {$this->tables['similarity']} (content_id_a, content_id_b, similarity_score, created_at)
				VALUES (%d, %d, %f, %s)
				ON DUPLICATE KEY UPDATE similarity_score = VALUES(similarity_score), created_at = VALUES(created_at)",
				$content_id_a,
				$content_id_b,
				$similarity_score,
				current_time( 'mysql' )
			)
		);

		return $result !== false;
	}

	/**
	 * Bulk insert similarity scores.
	 *
	 * @since 1.0.0
	 * @param array $similarities Array of similarity data.
	 * @return bool True on success.
	 */
	public function bulk_insert_similarities( $similarities ) {
		if ( empty( $similarities ) ) {
			return true;
		}

		$values = array();
		$format = array();
		$now    = current_time( 'mysql' );

		foreach ( $similarities as $sim ) {
			$id_a = $sim['content_id_a'];
			$id_b = $sim['content_id_b'];

			// Ensure consistent ordering.
			if ( $id_a > $id_b ) {
				$temp = $id_a;
				$id_a = $id_b;
				$id_b = $temp;
			}

			$values[] = $id_a;
			$values[] = $id_b;
			$values[] = $sim['score'];
			$values[] = $now;
			$format[] = '(%d, %d, %f, %s)';
		}

		$query = "INSERT INTO {$this->tables['similarity']} (content_id_a, content_id_b, similarity_score, created_at) VALUES "
			. implode( ', ', $format )
			. ' ON DUPLICATE KEY UPDATE similarity_score = VALUES(similarity_score), created_at = VALUES(created_at)';

		return $this->wpdb->query( $this->wpdb->prepare( $query, $values ) ) !== false;
	}

	/**
	 * Get similar content for a given content ID.
	 *
	 * @since 1.0.0
	 * @param int   $content_id Content ID.
	 * @param int   $limit      Maximum results.
	 * @param float $threshold  Minimum similarity threshold.
	 * @return array Array of similar content with scores.
	 */
	public function get_similar_content( $content_id, $limit = 5, $threshold = 0.1 ) {
		return $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT
					CASE
						WHEN content_id_a = %d THEN content_id_b
						ELSE content_id_a
					END as similar_content_id,
					similarity_score
				FROM {$this->tables['similarity']}
				WHERE (content_id_a = %d OR content_id_b = %d)
					AND similarity_score >= %f
				ORDER BY similarity_score DESC
				LIMIT %d",
				$content_id,
				$content_id,
				$content_id,
				$threshold,
				$limit
			)
		);
	}

	/**
	 * Delete similarity entries for content.
	 *
	 * @since 1.0.0
	 * @param int $content_id Content ID.
	 * @return bool True on success.
	 */
	public function delete_similarities( $content_id ) {
		return $this->wpdb->query(
			$this->wpdb->prepare(
				"DELETE FROM {$this->tables['similarity']} WHERE content_id_a = %d OR content_id_b = %d",
				$content_id,
				$content_id
			)
		) !== false;
	}

	/**
	 * Get total similarity count.
	 *
	 * @since 1.0.0
	 * @return int Count.
	 */
	public function get_similarity_count() {
		return (int) $this->wpdb->get_var(
			"SELECT COUNT(*) FROM {$this->tables['similarity']}"
		);
	}

	// =========================================================================
	// Utility Operations
	// =========================================================================

	/**
	 * Clear all plugin data.
	 *
	 * @since 1.0.0
	 * @return bool True on success.
	 */
	public function clear_all_data() {
		$this->wpdb->query( "TRUNCATE TABLE {$this->tables['similarity']}" );
		$this->wpdb->query( "TRUNCATE TABLE {$this->tables['tfidf']}" );
		$this->wpdb->query( "TRUNCATE TABLE {$this->tables['terms']}" );
		$this->wpdb->query( "TRUNCATE TABLE {$this->tables['content']}" );

		return true;
	}

	/**
	 * Get plugin statistics.
	 *
	 * @since 1.0.0
	 * @return array Statistics array.
	 */
	public function get_statistics() {
		return array(
			'total_content'   => $this->get_content_count(),
			'indexed_content' => $this->get_content_count( 'indexed' ),
			'pending_content' => $this->get_content_count( 'pending' ),
			'error_content'   => $this->get_content_count( 'error' ),
			'total_terms'     => $this->get_term_count(),
			'total_similarities' => $this->get_similarity_count(),
		);
	}
}
