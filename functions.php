<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

// 
// 
//  This file includes common functions
// 
// 

class KilikMarketFunctions {
	
	// Installation
	public static function installation() {
		// Require wordpress db
		global $wpdb;

		// Require wordpress dbDelta
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	}

	// Admin Menu
	public static function admin() {
		// Top Menu
		add_menu_page(
			__( 'کیلیک مارکت', PLUGIN_NAME ),
			__( 'کیلیک مارکت', PLUGIN_NAME ),
			'manage_options',
			'barhanmedia',
			'BarhanMediaFunctions::admin_page_template',
			KM_ROOT."icon.png",
			3
		);

	}

	public static function admin_page_template() {
		require_once(KM_ROOT.'templates/admin.php');
	}

	// Register style & scripts
	public static function register_styles($hook) {
		// Plugin Style
		wp_register_style( 'style', plugins_url( PLUGIN_DIR_NAME . '/assets/css/style.css' ) );
		wp_enqueue_style( 'style' );

		// Plugin Js
		wp_register_script( 'script', plugins_url( PLUGIN_DIR_NAME . '/assets/js/script.js' ), [], null, true);
		wp_enqueue_script( 'script' );

		// Set javascript objects
		wp_localize_script( 'script', 'settings', [
			'ajaxurl' => admin_url('admin-ajax.php'),
		]);
	}

}