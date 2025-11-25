<?php
/**
 * TF-IDF engine for content similarity calculation.
 *
 * @package Semantic_Internal_Linking
 * @since   1.0.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class SEIL_TfIdf_Engine
 *
 * Implements TF-IDF (Term Frequency-Inverse Document Frequency) algorithm
 * for calculating content similarity using cosine similarity.
 *
 * @since 1.0.0
 */
class SEIL_TfIdf_Engine {

	/**
	 * Database instance.
	 *
	 * @var SEIL_Database
	 */
	private $db;

	/**
	 * Content processor instance.
	 *
	 * @var SEIL_Content_Processor
	 */
	private $processor;

	/**
	 * Sitemap parser instance.
	 *
	 * @var SEIL_Sitemap_Parser
	 */
	private $parser;

	/**
	 * Maximum terms to store per document.
	 *
	 * @var int
	 */
	private $max_terms_per_doc = 100;

	/**
	 * Maximum similar documents to store per document.
	 *
	 * @var int
	 */
	private $max_similar_per_doc = 20;

	/**
	 * Batch processing time limit in seconds.
	 *
	 * @var int
	 */
	private $batch_time_limit = 20;

	/**
	 * Batch start time.
	 *
	 * @var float
	 */
	private $batch_start_time;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->db        = new SEIL_Database();
		$this->processor = new SEIL_Content_Processor();
		$this->parser    = new SEIL_Sitemap_Parser();
	}

	/**
	 * Start a full index rebuild.
	 *
	 * @since 1.0.0
	 * @param string $sitemap_url Optional sitemap URL, uses settings if empty.
	 * @return array|WP_Error Result array or error.
	 */
	public function start_index( $sitemap_url = '' ) {
		if ( empty( $sitemap_url ) ) {
			$settings    = get_option( 'seil_settings', array() );
			$sitemap_url = isset( $settings['sitemap_url'] ) ? $settings['sitemap_url'] : '';
		}

		// Try auto-detection if no URL provided.
		if ( empty( $sitemap_url ) ) {
			$sitemap_url = $this->parser->auto_detect();

			if ( ! $sitemap_url ) {
				return new WP_Error(
					'no_sitemap',
					__( 'Could not find sitemap. Please provide a sitemap URL.', 'semantic-internal-linking' )
				);
			}
		}

		// Parse sitemap.
		$urls = $this->parser->parse( $sitemap_url );

		if ( is_wp_error( $urls ) ) {
			return $urls;
		}

		if ( empty( $urls ) ) {
			return new WP_Error(
				'no_urls',
				__( 'No URLs found in sitemap.', 'semantic-internal-linking' )
			);
		}

		// Clear existing data.
		$this->db->clear_all_data();

		// Get allowed post types from settings.
		$allowed_post_types = isset( $settings['post_types'] ) ? $settings['post_types'] : array( 'post', 'page' );

		// Add URLs to content table as pending.
		$added = 0;
		foreach ( $urls as $url ) {
			$post_id = url_to_postid( $url );

			// Filter by post type if it's a WordPress post.
			if ( $post_id ) {
				$post_type = get_post_type( $post_id );
				if ( ! in_array( $post_type, $allowed_post_types, true ) ) {
					continue; // Skip this URL - post type not selected.
				}
			}

			$result = $this->db->upsert_content( array(
				'url'          => $url,
				'post_id'      => $post_id,
				'title'        => '',
				'content_hash' => '',
				'word_count'   => 0,
			) );

			if ( $result ) {
				$added++;
			}
		}

		// Store index status.
		set_transient( 'seil_index_progress', array(
			'status'    => 'processing',
			'total'     => $added,
			'processed' => 0,
			'started'   => time(),
		), DAY_IN_SECONDS );

		// Processing will be triggered via AJAX calls from the browser.
		// No WP-Cron scheduling needed.

		return array(
			'success' => true,
			'message' => sprintf(
				/* translators: %d: number of URLs */
				__( 'Started indexing %d URLs.', 'semantic-internal-linking' ),
				$added
			),
			'total'   => $added,
		);
	}

	/**
	 * Process a batch of pending content.
	 *
	 * @since 1.0.0
	 * @return array Processing results.
	 */
	public function process_batch() {
		$this->batch_start_time = microtime( true );
		$processed              = 0;
		$errors                 = 0;

		// Get pending content (smaller batch size for AJAX reliability).
		$pending = $this->db->get_pending_content( 5 );

		if ( empty( $pending ) ) {
			// No pending content, calculate IDF and similarities.
			$this->recalculate_idf();
			$this->calculate_all_similarities();

			// Update progress status.
			$progress = get_transient( 'seil_index_progress' );
			if ( $progress ) {
				$progress['status']    = 'complete';
				$progress['completed'] = time();
				set_transient( 'seil_index_progress', $progress, DAY_IN_SECONDS );
			}

			return array(
				'processed' => 0,
				'status'    => 'complete',
			);
		}

		foreach ( $pending as $content ) {
			if ( $this->should_stop_batch() ) {
				break;
			}

			$result = $this->process_content_item( $content );

			if ( $result ) {
				$processed++;
			} else {
				$errors++;
			}
		}

		// Update progress.
		$progress = get_transient( 'seil_index_progress' );
		if ( $progress ) {
			$progress['processed'] = $this->db->get_content_count( 'indexed' );
			set_transient( 'seil_index_progress', $progress, DAY_IN_SECONDS );
		}

		// Check remaining items.
		$remaining = $this->db->get_content_count( 'pending' );

		// Next batch will be triggered via AJAX from the browser.
		// No WP-Cron scheduling needed.

		return array(
			'processed' => $processed,
			'errors'    => $errors,
			'remaining' => $remaining,
			'status'    => $remaining > 0 ? 'processing' : 'calculating',
		);
	}

	/**
	 * Process a single content item.
	 *
	 * @since 1.0.0
	 * @param object $content Content database row.
	 * @return bool True on success.
	 */
	private function process_content_item( $content ) {
		// Process the URL.
		$processed = $this->processor->process_url( $content->url );

		if ( is_wp_error( $processed ) ) {
			$this->db->update_content_status( $content->id, 'error' );
			return false;
		}

		// Update content record.
		$this->db->upsert_content( array(
			'url'          => $content->url,
			'post_id'      => $processed['post_id'],
			'title'        => $processed['title'],
			'content_hash' => $processed['content_hash'],
			'word_count'   => $processed['word_count'],
		) );

		// Calculate and store TF-IDF.
		$this->calculate_tfidf_for_content( $content->id, $processed['tokens'] );

		// Mark as indexed.
		$this->db->update_content_status( $content->id, 'indexed' );

		return true;
	}

	/**
	 * Calculate TF-IDF for a content item.
	 *
	 * @since 1.0.0
	 * @param int   $content_id Content ID.
	 * @param array $tokens     Array of tokens.
	 */
	private function calculate_tfidf_for_content( $content_id, $tokens ) {
		if ( empty( $tokens ) ) {
			return;
		}

		// Calculate term frequencies.
		$term_counts = array_count_values( $tokens );
		$total_terms = count( $tokens );

		// Calculate TF for each term.
		$tf_scores = array();
		foreach ( $term_counts as $term => $count ) {
			$tf_scores[ $term ] = $count / $total_terms;
		}

		// Sort by TF and keep top N terms.
		arsort( $tf_scores );
		$tf_scores = array_slice( $tf_scores, 0, $this->max_terms_per_doc, true );

		// Store terms and TF scores (IDF will be applied later).
		$tfidf_data = array();
		foreach ( $tf_scores as $term => $tf ) {
			$term_id                = $this->db->get_or_create_term( $term );
			$tfidf_data[ $term_id ] = $tf; // Store TF for now, IDF applied in recalculate_idf.
		}

		// Bulk insert TF-IDF entries.
		$this->db->bulk_insert_tfidf( $content_id, $tfidf_data );
	}

	/**
	 * Recalculate IDF scores for all terms.
	 *
	 * @since 1.0.0
	 */
	public function recalculate_idf() {
		global $wpdb;

		$total_docs  = $this->db->get_content_count( 'indexed' );
		$terms_table = $this->db->get_table( 'terms' );
		$tfidf_table = $this->db->get_table( 'tfidf' );

		if ( $total_docs < 1 ) {
			return;
		}

		// Get all terms with their document frequencies.
		$terms = $this->db->get_all_terms();

		foreach ( $terms as $term ) {
			// Count documents containing this term.
			$doc_count = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(DISTINCT content_id) FROM {$tfidf_table} WHERE term_id = %d",
					$term->id
				)
			);

			// Calculate IDF: log(total_docs / docs_with_term).
			$idf = 0;
			if ( $doc_count > 0 ) {
				$idf = log( $total_docs / $doc_count );
			}

			// Update term IDF and doc frequency.
			$this->db->update_term_frequency( $term->id, $doc_count );
			$this->db->update_term_idf( $term->id, $idf );

			// Update TF-IDF scores for all documents with this term.
			$wpdb->query(
				$wpdb->prepare(
					"UPDATE {$tfidf_table} SET tfidf_score = tfidf_score * %f WHERE term_id = %d",
					$idf,
					$term->id
				)
			);
		}

		// Recalculate vector norms for all content.
		$this->recalculate_vector_norms();
	}

	/**
	 * Recalculate vector L2 norms for all content.
	 *
	 * @since 1.0.0
	 */
	private function recalculate_vector_norms() {
		$content = $this->db->get_all_indexed_content();

		foreach ( $content as $item ) {
			$vector = $this->db->get_tfidf_vector( $item->id );
			$norm   = $this->calculate_vector_norm( $vector );
			$this->db->update_content_norm( $item->id, $norm );
		}
	}

	/**
	 * Calculate L2 norm of a vector.
	 *
	 * @since 1.0.0
	 * @param array $vector Associative array of term_id => score.
	 * @return float L2 norm.
	 */
	private function calculate_vector_norm( $vector ) {
		$sum = 0;
		foreach ( $vector as $score ) {
			$sum += $score * $score;
		}
		return sqrt( $sum );
	}

	/**
	 * Calculate similarities for all content pairs.
	 *
	 * @since 1.0.0
	 */
	public function calculate_all_similarities() {
		$content = $this->db->get_all_indexed_content();
		$count   = count( $content );

		// Pre-load all vectors and norms.
		$vectors = array();
		$norms   = array();

		foreach ( $content as $item ) {
			$vectors[ $item->id ] = $this->db->get_tfidf_vector( $item->id );
			$norms[ $item->id ]   = floatval( $item->vector_norm );
		}

		// Calculate similarities.
		for ( $i = 0; $i < $count; $i++ ) {
			$content_a = $content[ $i ];
			$similarities = array();

			for ( $j = 0; $j < $count; $j++ ) {
				if ( $i === $j ) {
					continue;
				}

				$content_b  = $content[ $j ];
				$similarity = $this->cosine_similarity(
					$vectors[ $content_a->id ],
					$norms[ $content_a->id ],
					$vectors[ $content_b->id ],
					$norms[ $content_b->id ]
				);

				if ( $similarity > 0.01 ) {
					$similarities[] = array(
						'content_id_a' => $content_a->id,
						'content_id_b' => $content_b->id,
						'score'        => $similarity,
					);
				}
			}

			// Sort by similarity and keep top N.
			usort( $similarities, function( $a, $b ) {
				return $b['score'] <=> $a['score'];
			} );

			$top_similarities = array_slice( $similarities, 0, $this->max_similar_per_doc );

			// Store similarities.
			if ( ! empty( $top_similarities ) ) {
				$this->db->bulk_insert_similarities( $top_similarities );
			}
		}
	}

	/**
	 * Calculate cosine similarity between two vectors.
	 *
	 * @since 1.0.0
	 * @param array $vector_a First vector.
	 * @param float $norm_a   First vector norm.
	 * @param array $vector_b Second vector.
	 * @param float $norm_b   Second vector norm.
	 * @return float Similarity score (0-1).
	 */
	public function cosine_similarity( $vector_a, $norm_a, $vector_b, $norm_b ) {
		if ( $norm_a == 0 || $norm_b == 0 ) {
			return 0.0;
		}

		// Calculate dot product using only shared terms.
		$dot_product = 0.0;

		// Use smaller vector for iteration efficiency.
		if ( count( $vector_a ) > count( $vector_b ) ) {
			$smaller = $vector_b;
			$larger  = $vector_a;
		} else {
			$smaller = $vector_a;
			$larger  = $vector_b;
		}

		foreach ( $smaller as $term_id => $score ) {
			if ( isset( $larger[ $term_id ] ) ) {
				$dot_product += $score * $larger[ $term_id ];
			}
		}

		return $dot_product / ( $norm_a * $norm_b );
	}

	/**
	 * Get similar content for a post.
	 *
	 * @since 1.0.0
	 * @param int   $post_id   Post ID.
	 * @param int   $limit     Maximum results.
	 * @param float $threshold Minimum similarity threshold.
	 * @return array Array of similar posts with scores.
	 */
	public function get_similar_for_post( $post_id, $limit = 5, $threshold = 0.1 ) {
		$content = $this->db->get_content_by_post_id( $post_id );

		if ( ! $content ) {
			return array();
		}

		$similar = $this->db->get_similar_content( $content->id, $limit, $threshold );
		$results = array();

		foreach ( $similar as $item ) {
			$similar_content = $this->db->get_content_by_id( $item->similar_content_id );

			if ( $similar_content ) {
				$results[] = array(
					'content_id' => $similar_content->id,
					'post_id'    => $similar_content->post_id,
					'url'        => $similar_content->url,
					'title'      => $similar_content->title,
					'score'      => round( $item->similarity_score, 4 ),
				);
			}
		}

		return $results;
	}

	/**
	 * Check if batch processing should stop.
	 *
	 * @since 1.0.0
	 * @return bool True if should stop.
	 */
	private function should_stop_batch() {
		$elapsed = microtime( true ) - $this->batch_start_time;
		return $elapsed >= $this->batch_time_limit;
	}

	/**
	 * Get index progress status.
	 *
	 * @since 1.0.0
	 * @return array Progress status.
	 */
	public function get_index_progress() {
		$progress = get_transient( 'seil_index_progress' );

		if ( ! $progress ) {
			return array(
				'status'    => 'idle',
				'total'     => 0,
				'processed' => 0,
				'percent'   => 0,
			);
		}

		$percent = 0;
		if ( $progress['total'] > 0 ) {
			$percent = round( ( $progress['processed'] / $progress['total'] ) * 100, 1 );
		}

		$progress['percent'] = $percent;

		return $progress;
	}

	/**
	 * Calculate TF (Term Frequency).
	 *
	 * @since 1.0.0
	 * @param array $tokens Array of tokens.
	 * @return array Associative array of term => TF score.
	 */
	public function calculate_tf( $tokens ) {
		if ( empty( $tokens ) ) {
			return array();
		}

		$term_counts = array_count_values( $tokens );
		$total_terms = count( $tokens );
		$tf          = array();

		foreach ( $term_counts as $term => $count ) {
			$tf[ $term ] = $count / $total_terms;
		}

		return $tf;
	}

	/**
	 * Reindex a single post.
	 *
	 * @since 1.0.0
	 * @param int $post_id Post ID.
	 * @return bool True on success.
	 */
	public function reindex_post( $post_id ) {
		$url     = get_permalink( $post_id );
		$content = $this->db->get_content_by_post_id( $post_id );

		if ( ! $content ) {
			// Add new content.
			$content_id = $this->db->upsert_content( array(
				'url'          => $url,
				'post_id'      => $post_id,
				'title'        => '',
				'content_hash' => '',
				'word_count'   => 0,
			) );

			$content = $this->db->get_content_by_id( $content_id );
		}

		if ( ! $content ) {
			return false;
		}

		return $this->process_content_item( $content );
	}
}
