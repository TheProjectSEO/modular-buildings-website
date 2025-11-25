/**
 * Semantic Internal Linking - Admin JavaScript
 *
 * @package Semantic_Internal_Linking
 * @since   1.0.0
 */

(function($) {
	'use strict';

	var SEIL_Admin = {

		/**
		 * Progress check interval ID.
		 */
		progressInterval: null,

		/**
		 * Initialize admin functionality.
		 */
		init: function() {
			this.bindEvents();
			this.initRangeSlider();
			this.initColorPickers();
			this.checkProgress();
		},

		/**
		 * Bind event handlers.
		 */
		bindEvents: function() {
			$('#seil-start-index').on('click', this.handleStartIndex.bind(this));
			$('#seil-clear-data').on('click', this.handleClearData.bind(this));
			$('#seil_similarity_threshold').on('input', this.updateThresholdDisplay);
		},

		/**
		 * Initialize range slider display.
		 */
		initRangeSlider: function() {
			var $range = $('#seil_similarity_threshold');
			if ($range.length) {
				$('#seil_threshold_value').text($range.val());
			}
		},

		/**
		 * Initialize WordPress color pickers.
		 */
		initColorPickers: function() {
			if ($.fn.wpColorPicker) {
				$('.seil-color-picker').wpColorPicker({
					defaultColor: '',
					change: function(event, ui) {
						// Trigger change event for form tracking.
						$(event.target).trigger('change');
					},
					clear: function(event) {
						// Trigger change event when cleared.
						$(event.target).val('').trigger('change');
					}
				});
			}
		},

		/**
		 * Update threshold display value.
		 */
		updateThresholdDisplay: function() {
			$('#seil_threshold_value').text($(this).val());
		},

		/**
		 * Handle start index button click.
		 *
		 * @param {Event} e Click event.
		 */
		handleStartIndex: function(e) {
			e.preventDefault();

			var $btn = $('#seil-start-index');
			var $spinner = $('.seil-index-actions .spinner');

			$btn.prop('disabled', true);
			$spinner.addClass('is-active');

			$.ajax({
				url: seil_admin.ajax_url,
				type: 'POST',
				data: {
					action: 'seil_start_index',
					nonce: seil_admin.nonce
				},
				success: function(response) {
					if (response.success) {
						SEIL_Admin.showProgress(response.data);
						// Start AJAX-based batch processing immediately.
						SEIL_Admin.processBatch();
					} else {
						SEIL_Admin.showError(response.data.message);
						$btn.prop('disabled', false);
					}
				},
				error: function() {
					SEIL_Admin.showError(seil_admin.i18n.error);
					$btn.prop('disabled', false);
				},
				complete: function() {
					$spinner.removeClass('is-active');
				}
			});
		},

		/**
		 * Process a batch of content via AJAX.
		 * Calls itself recursively until processing is complete.
		 */
		processBatch: function() {
			$.ajax({
				url: seil_admin.ajax_url,
				type: 'POST',
				data: {
					action: 'seil_process_batch',
					nonce: seil_admin.nonce
				},
				success: function(response) {
					if (response.success) {
						SEIL_Admin.updateProgress(response.data);

						// Continue processing if not complete.
						if (response.data.status !== 'complete' && response.data.status !== 'idle') {
							setTimeout(function() {
								SEIL_Admin.processBatch();
							}, 500); // Small delay between batches.
						} else {
							// Done - reload page to show final stats.
							$('#seil-start-index').prop('disabled', false);
							if (response.data.status === 'complete') {
								setTimeout(function() {
									location.reload();
								}, 1500);
							}
						}
					} else {
						SEIL_Admin.showError(response.data.message);
						$('#seil-start-index').prop('disabled', false);
					}
				},
				error: function() {
					SEIL_Admin.showError(seil_admin.i18n.error);
					$('#seil-start-index').prop('disabled', false);
				}
			});
		},

		/**
		 * Handle clear data button click.
		 *
		 * @param {Event} e Click event.
		 */
		handleClearData: function(e) {
			e.preventDefault();

			if (!confirm(seil_admin.i18n.confirm_clear)) {
				return;
			}

			var $btn = $('#seil-clear-data');
			var $spinner = $('.seil-index-actions .spinner');

			$btn.prop('disabled', true);
			$spinner.addClass('is-active');

			$.ajax({
				url: seil_admin.ajax_url,
				type: 'POST',
				data: {
					action: 'seil_clear_data',
					nonce: seil_admin.nonce
				},
				success: function(response) {
					if (response.success) {
						SEIL_Admin.resetStats();
						SEIL_Admin.hideProgress();
					} else {
						SEIL_Admin.showError(response.data.message);
					}
				},
				error: function() {
					SEIL_Admin.showError(seil_admin.i18n.error);
				},
				complete: function() {
					$btn.prop('disabled', false);
					$spinner.removeClass('is-active');
				}
			});
		},

		/**
		 * Show progress container.
		 *
		 * @param {Object} data Progress data.
		 */
		showProgress: function(data) {
			var $container = $('#seil-progress-container');

			$container.show();
			$('#seil-progress-total').text(data.total || 0);
			$('#seil-progress-count').text(0);
			$('#seil-progress-percent').text('0%');
			$('#seil-progress-status').text(seil_admin.i18n.processing);
			$('.seil-progress-fill').css('width', '0%');
		},

		/**
		 * Hide progress container.
		 */
		hideProgress: function() {
			$('#seil-progress-container').hide();
			SEIL_Admin.stopProgressPolling();
		},

		/**
		 * Update progress display.
		 *
		 * @param {Object} data Progress data.
		 */
		updateProgress: function(data) {
			$('#seil-progress-count').text(data.processed || 0);
			$('#seil-progress-total').text(data.total || 0);
			$('#seil-progress-percent').text((data.percent || 0) + '%');
			$('.seil-progress-fill').css('width', (data.percent || 0) + '%');

			var statusText = seil_admin.i18n.processing;
			if (data.status === 'calculating') {
				statusText = seil_admin.i18n.calculating;
			} else if (data.status === 'complete') {
				statusText = seil_admin.i18n.complete;
			}
			$('#seil-progress-status').text(statusText);

			// Update stats.
			$('.seil-stat-value').eq(1).text(data.processed || 0);
		},

		/**
		 * Start progress polling.
		 */
		startProgressPolling: function() {
			SEIL_Admin.stopProgressPolling();
			SEIL_Admin.progressInterval = setInterval(SEIL_Admin.pollProgress, 2000);
		},

		/**
		 * Stop progress polling.
		 */
		stopProgressPolling: function() {
			if (SEIL_Admin.progressInterval) {
				clearInterval(SEIL_Admin.progressInterval);
				SEIL_Admin.progressInterval = null;
			}
		},

		/**
		 * Poll for progress updates.
		 */
		pollProgress: function() {
			$.ajax({
				url: seil_admin.ajax_url,
				type: 'POST',
				data: {
					action: 'seil_get_progress',
					nonce: seil_admin.nonce
				},
				success: function(response) {
					if (response.success) {
						SEIL_Admin.updateProgress(response.data);

						if (response.data.status === 'complete' || response.data.status === 'idle') {
							SEIL_Admin.stopProgressPolling();
							$('#seil-start-index').prop('disabled', false).text(seil_admin.i18n.start_index);

							// Reload page to update stats.
							if (response.data.status === 'complete') {
								setTimeout(function() {
									location.reload();
								}, 1500);
							}
						}
					}
				}
			});
		},

		/**
		 * Check initial progress on page load.
		 */
		checkProgress: function() {
			var $container = $('#seil-progress-container');

			if ($container.is(':visible')) {
				var status = $('#seil-progress-status').text();
				if (status && status !== 'complete' && status !== 'idle') {
					$('#seil-start-index').prop('disabled', true);
					SEIL_Admin.startProgressPolling();
				}
			}
		},

		/**
		 * Reset stats display.
		 */
		resetStats: function() {
			$('.seil-stat-value').text('0');
		},

		/**
		 * Show error message.
		 *
		 * @param {string} message Error message.
		 */
		showError: function(message) {
			alert(message);
		}
	};

	// Initialize on document ready.
	$(document).ready(function() {
		SEIL_Admin.init();
	});

})(jQuery);
