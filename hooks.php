<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

// 
// 
// This File Contains Wordpress Hooks
// 
// 

// Reverse CORS Proxy
add_shortcode( 'proxy', ['KilikMarketFunctions', 'proxy_template'] );

// Shopping Websites Tabs Shortcode
add_shortcode( 'shops', ['KilikMarketFunctions', 'shops_template'] );

// Shopping Websites Tabs Shortcode
add_shortcode( 'favorites', ['KilikMarketFunctions', 'favorites_template'] );

// Register Style and Scripts
// Admin
add_action( 'admin_enqueue_scripts', ['KilikMarketFunctions', 'register_styles'] );
add_action('admin_enqueue_scripts', function() {
    wp_register_style( 'custom_wp_admin_css', plugin_dir_url( __FILE__ ) . 'dist/admin.css', false, '1.0.0' );
    wp_enqueue_style( 'custom_wp_admin_css' );
});
// FrontEnd
add_action( 'wp_enqueue_scripts', ['KilikMarketFunctions', 'register_styles'] );



// 
// Ajax
// 
add_action( 'wp_ajax_nopriv_get_currencies', ['KilikMarketFunctions', 'get_currencies']);
add_action( 'wp_ajax_get_currencies', ['KilikMarketFunctions', 'get_currencies']);



add_action( 'carbon_fields_register_fields', ['KilikMarketFunctions', 'theme_options'] );
add_action( 'after_setup_theme', ['KilikMarketFunctions', 'carbon_fields_load'] );


// Product Information Hook
add_filter( 'woocommerce_product_data_tabs', ['KilikMarketFunctions', 'km_product_information_tab'], 10, 1 );
add_action( 'woocommerce_product_data_panels', ['KilikMarketFunctions', 'km_product_information_data'] );

