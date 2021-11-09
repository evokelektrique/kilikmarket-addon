<?php

/*
Plugin Name: KilikMarket
Description: KilikMarket Addon
Author: WebDataCo
Version: 1.5
Author URI: http://webdata.co
Text Domain: kilikmarket
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

require __DIR__ . '/vendor/autoload.php';

// 
// 
//  This File Is The Main Addon Class
// 
// 

class KilikMarket {

    private static $instance;
	public static $version = '1.5';

	// Construction
	public function __construct() {

		$files = [
			// Root
			'constants.php',
			'functions.php',
			'hooks.php',
			'proxy_grabber.php',

			// Crawlers
			'includes/crawlers/amazon.php',
			'includes/crawlers/aliexpress.php',

			// Pages
			'includes/pages/pages_list_table_class.php',
			'includes/pages/pages_list_table_functions.php',
			'includes/pages/form/pages_form_handler.php',
			'includes/pages/form/pages_form_functions.php',
		];

		// Call Load Files
		$this->load_files($files);
	}

	// Get Instance Method
    public static function get_instance() {
        if ( ! self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    // Get Version
	public static function get_version() {
		return self::$version;
	}

	// Installation Method
	public static function installation() {
		// Call Database Installtion Method
		KilikMarketFunctions::installation();
	}

	// Deactivation (Not Necessary)
	public static function deactivation() {/*...*/}

	// Include Files In Plugin Folder
	private function load_files(array $files) {
		foreach($files as &$file) {
			include_once(plugin_dir_path( __FILE__ ).$file);
		}
	}

	public function get_cart() {
	}
}


// Register Global Instance
$GLOBALS['km'] 	  = KilikMarket::get_instance(); 	// KilikMarket Class
// Core Hooks
register_activation_hook( __FILE__, ['KilikMarket', 'installation']);