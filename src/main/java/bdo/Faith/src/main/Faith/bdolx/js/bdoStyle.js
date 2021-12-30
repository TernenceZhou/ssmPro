/** 检索条件隐藏 */
var uiBlocksApi = function($block, $mode) {
	// Set default icons for fullscreen and content toggle buttons
	var $iconFullscreen = 'si si-size-fullscreen';
	var $iconFullscreenActive = 'si si-size-actual';
	var $iconContent = 'si si-arrow-up';
	var $iconContentActive = 'si si-arrow-down';

	if ($mode === 'init') {
		// Auto add the default toggle icons to fullscreen and content toggle buttons
		jQuery('[data-toggle="block-option"][data-action="fullscreen_toggle"]').each(function() {
			var $this = jQuery(this);

			$this.html('<i class="' + (jQuery(this).closest('.block').hasClass('block-opt-fullscreen') ? $iconFullscreenActive : $iconFullscreen) + '"></i>');
		});

		jQuery('[data-toggle="block-option"][data-action="content_toggle"]').each(function() {
			var $this = jQuery(this);

			$this.html('<i class="' + ($this.closest('.block').hasClass('block-opt-hidden') ? $iconContentActive : $iconContent) + '"></i>');
		});
	} else {
		// Get block element
		var $elBlock = ($block instanceof jQuery) ? $block : jQuery($block);

		// If element exists, procceed with blocks functionality
		if ($elBlock.length) {
			// Get block option buttons if exist (need them to update their icons)
			var $btnFullscreen = jQuery('[data-toggle="block-option"][data-action="fullscreen_toggle"]', $elBlock);
			var $btnToggle = jQuery('[data-toggle="block-option"][data-action="content_toggle"]', $elBlock);

			// Mode selection
			switch ($mode) {
				case 'fullscreen_toggle':
					$elBlock.toggleClass('block-opt-fullscreen');

					// Enable/disable scroll lock to block
					if ($elBlock.hasClass('block-opt-fullscreen')) {
						jQuery($elBlock).scrollLock('enable');
					} else {
						jQuery($elBlock).scrollLock('disable');
					}

					// Update block option icon
					if ($btnFullscreen.length) {
						if ($elBlock.hasClass('block-opt-fullscreen')) {
							jQuery('i', $btnFullscreen)
								.removeClass($iconFullscreen)
								.addClass($iconFullscreenActive);
						} else {
							jQuery('i', $btnFullscreen)
								.removeClass($iconFullscreenActive)
								.addClass($iconFullscreen);
						}
					}
					break;
				case 'fullscreen_on':
					$elBlock.addClass('block-opt-fullscreen');

					// Enable scroll lock to block
					jQuery($elBlock).scrollLock('enable');

					// Update block option icon
					if ($btnFullscreen.length) {
						jQuery('i', $btnFullscreen)
							.removeClass($iconFullscreen)
							.addClass($iconFullscreenActive);
					}
					break;
				case 'fullscreen_off':
					$elBlock.removeClass('block-opt-fullscreen');

					// Disable scroll lock to block
					jQuery($elBlock).scrollLock('disable');

					// Update block option icon
					if ($btnFullscreen.length) {
						jQuery('i', $btnFullscreen)
							.removeClass($iconFullscreenActive)
							.addClass($iconFullscreen);
					}
					break;
				case 'content_toggle':
					$elBlock.toggleClass('block-opt-hidden');

					// Update block option icon
					if ($btnToggle.length) {
						if ($elBlock.hasClass('block-opt-hidden')) {
							jQuery('i', $btnToggle)
								.removeClass($iconContent)
								.addClass($iconContentActive);
						} else {
							jQuery('i', $btnToggle)
								.removeClass($iconContentActive)
								.addClass($iconContent);
						}
					}
					break;
				case 'content_hide':
					$elBlock.addClass('block-opt-hidden');

					// Update block option icon
					if ($btnToggle.length) {
						jQuery('i', $btnToggle)
							.removeClass($iconContent)
							.addClass($iconContentActive);
					}
					break;
				case 'content_show':
					$elBlock.removeClass('block-opt-hidden');

					// Update block option icon
					if ($btnToggle.length) {
						jQuery('i', $btnToggle)
							.removeClass($iconContentActive)
							.addClass($iconContent);
					}
					break;
				case 'refresh_toggle':
					$elBlock.toggleClass('block-opt-refresh');

					// Return block to normal state if the demostration mode is on in the refresh option button - data-action-mode="demo"
					if (jQuery('[data-toggle="block-option"][data-action="refresh_toggle"][data-action-mode="demo"]', $elBlock).length) {
						setTimeout(function() {
							$elBlock.removeClass('block-opt-refresh');
						}, 2000);
					}
					break;
				case 'state_loading':
					$elBlock.addClass('block-opt-refresh');
					break;
				case 'state_normal':
					$elBlock.removeClass('block-opt-refresh');
					break;
				case 'close':
					$elBlock.hide();
					break;
				case 'open':
					$elBlock.show();
					break;
				default:
					return false;
			}
		}
	}
	//uiBlocksApi(false, 'init');
};
uiBlocksApi(false, 'init');
/*
jQuery('div').delegate('button[data-toggle="block-option"]', 'click', function() {
	uiBlocksApi(jQuery(this).closest('.block'), jQuery(this).data('action'));
});*/
