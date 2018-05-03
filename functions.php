<?php
/**
 * Theme functions
 *
 * @package GHC-Exhibitors
 */

/**
 * Enqueue assets
 */
function ge_enqueue_minified_assets() {
	wp_dequeue_style( 'theme-style' );
	wp_enqueue_style( 'theme', get_stylesheet_directory_uri() . '/style.min.css', array(), wp_get_theme()->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', 'ge_enqueue_minified_assets' );
