<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

use Carbon_Fields\Container;
use Carbon_Fields\Field;

// 
// 
//  This file includes common functions
// 
// 

class KilikMarketFunctions {

	// Members
	// Proxy Url
	public static $origin_url = "http://localhost/wordpress_projects/kilikmarket_proxy/index.php";
	
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
		require_once(KM_ROOT.'templates/admin/index.php');
	}

	

	// Register style & scripts
	public static function register_styles($hook) {
		// Plugin Style
		wp_register_style( 'style', plugin_dir_url( __FILE__ ) . 'assets/css/style.css' );
		wp_enqueue_style( 'style' );

		// Plugin Js
		wp_register_script( 'script', plugin_dir_url( __FILE__ ) . 'dist/script.js', [], null, true);
		wp_enqueue_script( 'script' );

		// Set javascript objects
		wp_localize_script( 'script', 'settings', [
			'ajaxurl' 	 => admin_url('admin-ajax.php'),
			'plugin_dir' => plugin_dir_url( __FILE__ ),
			'origin_url' => self::$origin_url,
			'base_url' 	 => get_home_url(),
			'wc_ck'		 => carbon_get_theme_option('km_wc_ck'),
			'wc_cs'		 => carbon_get_theme_option('km_wc_cs'),
			'price_per_gram' => carbon_get_theme_option('km_price_per_gram'),
			'usd_price' 	 => carbon_get_theme_option('km_usd_price'),
		]);
	}

	// 
	// Templates
	// 

	// Reverse CORS Proxy Template
	public static function proxy_template($arguments = []) {
		include_once(KM_ROOT . 'templates/front/proxy.php');
	}

	// Shopping Webistes Tabs Template
	public static function shops_template($arguments = []) {
		include_once(KM_ROOT . 'templates/front/shops.php');
	}

	// Generates An Iframe HTML Element
	public static function iframe(array $arguments = []) {
		$attributes = implode( ' ', array_filter( array_map( function ( $key, $value ) {
		    return $value ? $key . '="' . htmlspecialchars( $value ) . '"' : false;
		}, array_keys( $arguments ), $arguments ) ) );

		return "<iframe " . $attributes . "></iframe>";
	}

	// // Reverse Proxy
	// public static function proxy(string $type, string $url) {
	// 	switch ($type) {
	// 		case 'amazon':
	// 			return file_get_contents("http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=" . $url);
	// 			break;
			
	// 		default:
	// 			return "not amazon";
	// 			break;
	// 	}
	// }

	// // IDK Delete it
	// public function create_product($wc) {
	// 	$data = $_POST;
	// }

	public static function theme_options() {
		
	    Container::make( 'theme_options', __( 'کیلیک مارکت' ) )
	    	->set_page_file('kilikmarket-options')
	    	->set_page_menu_position(1)
	        ->add_fields(
	        [
	        	// WooCommerce
			    Field::make( 'separator', 'km_wc_seperator', __( 'ووکامرس' ) ),
				Field::make( 'text', 'km_wc_ck', __( 'کلید API ووکامرس' ) )
					->set_attribute( 'placeholder', 'ck_' ),
				Field::make( 'text', 'km_wc_cs', __( 'کلید مخفی API ووکامرس' ) )
				    ->set_attribute( 'placeholder', 'cs_' ),

				// Prices
			    Field::make( 'separator', 'km_prices_seperator', __( 'قیمت ها' ) ),
				Field::make( 'number', 'km_price_per_gram', __( 'قیمت واحد بر هر 100 گرم' ) ),
				Field::make( 'number', 'km_usd_price', __( 'قیمت دلار' ) ),

	        ]
	    );
	}

	public static function carbon_fields_load() {
	    require_once( 'vendor/autoload.php' );
	    \Carbon_Fields\Carbon_Fields::boot();
	}
}
