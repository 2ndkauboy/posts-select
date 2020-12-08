<?php
/**
 * Plugin Name: Posts Select
 */

define( 'POSTS_SELECT_VERSION', '1.0.0' );
define( 'POSTS_SELECT_FILE', __FILE__ );
define( 'POSTS_SELECT_PATH', plugin_dir_path( POSTS_SELECT_FILE ) );
define( 'POSTS_SELECT_URL', plugin_dir_url( POSTS_SELECT_FILE ) );

function posts_select_register_assets() {
	$assets_path      = 'build/index.assets.php';
	$block_path       = 'build/index.js';

	if ( file_exists( POSTS_SELECT_PATH . $assets_path ) ) {
		$script_asset = require POSTS_SELECT_PATH . $assets_path;
	} else {
		$script_asset = [
			'dependencies' => [
				'wp-i18n',
				'wp-element',
				'wp-blocks',
				'wp-components',
				'wp-editor',
				'wp-polyfill',
			],
			'version'      => POSTS_SELECT_VERSION,
		];
	}

	// Enqueue the bundled block JS file.
	if ( file_exists( POSTS_SELECT_PATH . $block_path ) ) {
		wp_register_script(
			'posts-select-editor',
			POSTS_SELECT_URL . $block_path,
			$script_asset['dependencies'],
			$script_asset['version'],
			true
		);
	}
}
add_action( 'init', 'posts_select_register_assets' );

function posts_select_enqueue_block_editor_assets() {
	wp_enqueue_script( 'posts-select-editor' );
}
add_action( 'enqueue_block_editor_assets', 'posts_select_enqueue_block_editor_assets', 11 );