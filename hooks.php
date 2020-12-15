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

// Register Style and Scripts
// Admin
add_action( 'admin_enqueue_scripts', ['KilikMarketFunctions', 'register_styles'] );
// FrontEnd
add_action( 'wp_enqueue_scripts', ['KilikMarketFunctions', 'register_styles'] );


