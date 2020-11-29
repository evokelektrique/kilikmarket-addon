<?php

/*
Plugin Name:
Description:
Author: WebDataCo
Version: 1.0
Author URI: http://webdata.co
Text Domain: kilikmarket
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

// 
// 
//  This file is the main addon class
// 
// 

class KilikMarket {

    private static $instance;
	public static $version = '1.0';

	// Construction
	public function __construct() {

		$files = [
			'functions.php',
			'constant.php'
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
}


// Register Global Instance
global $km;
$km = KilikMarket::get_instance();

// Core Hooks
register_activation_hook( __FILE__, ['KilikMarket', 'installation']);