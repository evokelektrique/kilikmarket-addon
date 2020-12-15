<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
use GuzzleHttp\Client;

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
		require_once(KM_ROOT.'templates/admin/index.php');
	}

	// Register style & scripts
	public static function register_styles($hook) {
		// Plugin Style
		wp_register_style( 'style', plugin_dir_url( __FILE__ ) . 'assets/css/style.css' );
		wp_enqueue_style( 'style' );

		// Plugin Js
		wp_register_script( 'script', plugin_dir_url( __FILE__ ) . 'assets/js/script.js', [], null, true);
		wp_enqueue_script( 'script' );

		// Set javascript objects
		wp_localize_script( 'script', 'settings', [
			'ajaxurl' 	 => admin_url('admin-ajax.php'),
			'plugin_dir' => plugin_dir_url( __FILE__ ),
			'origin_url' => "http://localhost/wordpress_projects/kilikmarket_proxy/index.php",
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

	// Reverse Proxy
	public static function proxy(string $type, string $url) {
		switch ($type) {
			case 'amazon':
				return file_get_contents("http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=" . $url);
				break;
			
			default:
				return "not amazon";
				break;
		}

		// $ch = curl_init();
		// curl_setopt($ch, CURLOPT_URL, $url);
		// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		// curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		// curl_setopt($ch, CURLOPT_REFERER, $url);
		// $html = curl_exec($ch);
		// return $html; 

		// $jar = \GuzzleHttp\Cookie\CookieJar::fromArray([
		// 		"aliexpress_com_ae-msite-city" => '',
		// 		"aliexpress_com_ae-msite-province"=> "",
		// 		"aliexpress_com_ali_apache_track"=>"",
		// 		"aliexpress_com_e_id" => "pt20",
		// 		"amazon_com_session-id" => "141-2601336-1622205",
		// 		"amazon_com_session-id-time" => "2082787201l",
		// 		"amazon_com_i18n-prefs" => "USD",
		// 		"amazon_com_sp-cdn" => "L5Z9:CA",
		// 		"cna" => "GNzcFysYeggCAS6muJ4golJG",
		// 		"_ga" => "GA1.2.1954537926.1606130752",
		// 		"amazon_com_ubid-main" => "130-5130483-9222056",
		// 		"amazon_ae_session-id" => "260-6930268-4919203",
		// 		"amazon_ae_i18n-prefs" => "AED",
		// 		"amazon_ae_ubid-acbae" => "258-0393925-1019108",
		// 		"_ga" => "GA1.1.1954537926.1606130752",
		// 		"_bl_uid" => "thk4qhgvuqyht723X4qjqmL6v7a4",
		// 		"isg" => "BMbGr9PV5WqrjbGOfGBhi16BF7xIJwrh3wSvDbDvvunEs2bNGLRH8ayCj_d_GwL5",
		// 		"aliexpress_com_intl_common_forever" => "tvVr7hZtzW010U3kFiKZrP0f5hLS2M3ElAk1Q/KPIwDeAxHcjaUrKQ==",
		// 		"aliexpress_com_aep_usuc_f" => "region=AE&site=glo&b_locale=en_US&c_tp=USD",
		// 		"aliexpress_com_ali_apache_id=11.227.116.59.1606724512538.410988.2",
		// 		"aliexpress_com_xman_t" => "mmCIlxeLIOobl70PYEk8v5tN/lhlnz6q5I8qelKOuCvGhpN9P4idje1KYO9ElxIh",
		// 		"aliexpress_com_xman_us_f" => "x_locale=en_US&x_l=0&x_c_chg=1&x_as_i=%7B%22cookieCacheEffectTime%22%3A1606724798587%2C%22isCookieCache%22%3A%22Y%22%2C%22ms%22%3A%220%22%7D&acs_rt=7a6f987934724804b1c430414a8f075b",
		// 		"aliexpress_com_xman_f" => "JF8pEGRBG3leO85UoYnzunj0W4uxWusjb2+ccy5olndoRixNv+iJqF7KFll4IzMeNYLIvNw9GvBzhHkfHw35I2fQsMLA4yVOf/ROVd1PgF00tROwhVJIsg==",
		// 		"aliexpress_com__m_h5_tk" => "58394eefd1d79867685968cfd7729754_1606726893926",
		// 		"aliexpress_com__m_h5_tk_enc" => "12a233703c8c175d7e3151a06be8a50d",
		// 		"__m_h5_tk" => "9f434fa0fba1871c470cf6f90f25850e_1606726458731",
		// 		"__m_h5_tk_enc" => "18d12910682f0baa852bb0f2c540bbbb",
		// 		"isg" => "BOTkXRzGZ5PRaJMgMsqjTYg7teLWfQjnyc4NY_4FLq99qYRzJoz-dxoIaRmxcUA_",
		// 		"amazon_ae_session-token" => "ZIQo+1130mxF3hRVNYkWVjqAk27Tz8fiwecw3kX9mpV3df8bOz571BftivMdrZpHe50fEGylVrZebxZvfp0NemdxsUFfvnTX35qQ6wyjwv5N+a9fdOVoblLRh/gtBUNGCUx7f7gmqcUNgc1BlLPA7Ne6iUwqDfxphXJUbwgxZPZNZkeimKdBx483A7zpQias",
		// 		"amazon_ae_session-id-time" => "2082758401l",
		// 		"6pm_com_zfc" => "ChUI587Y7eEuEIOTrIXZDxjnztjt4S4=",
		// 		"6pm_com_session-id" => "147-6844703-1431950",
		// 		"6pm_com_ubid-main" => "131-7544444-1789027",
		// 		"_gid" => "GA1.1.1608606094.1606816263",
		// 		"ebay_com_dp1" => "bu1p/QEBfX0BAX19AQA**6388792d^bl/CA6388792d^",
		// 		"ebay_com_nonsession" => "BAQAAAXQoEGjGAAaAADMABmGnRa1IM0cwQTEAygAgY4h5LTFkYjY5YzBiMTc2MGE0ZDcyOTllYzczYWZmOGY2MTNmAMsAAV/GGTUzuXe/oTxvEmFGCe8j3pUr2CP7eoA*",
		// 		"_npii" => "btguid/1db69c0b1760a4d7299ec73aff8f613f63887961^cguid/1db7cbd71760ac0ff7960243fd380cda63887961^",
		// 		"amazon_com_skin" => "noskin",
		// 		"amazon_com_session-token" => "hvRfBXdCI9uxqORjCnNR//NlUF2pBcGrlIQSqeRuBAN8KJdGpA+eZ6LmJY/IOJeDjvaHbcDbe6nk+iv9SozmUOfONE3VFUAljFmN/Iz2ROv7Kswx++3AbOvfDpEyNPpKH++6E2WKs6z3eqg/ScGKij9jqHjwVFQFrRUq1YwGHTsI3qbGaOs6wAqusONZQ9rZ",
		// 		"_YSC" => "GmtySLQgwaI",
		// 		"_VISITOR_INFO1_LIVE" => "sFdcNcqlZV0",
		// 		"_GPS" => "1",
		// 		"csm-hit" => "tb:H71RN3RK20V2XYYNG8RT+s-H71RN3RK20V2XYYNG8RT|1606853354159&t:1606853354160&adb:adblk_yes",
		//   ], 'amazon.com'
		// );

		// $client = new Client();
		// $response = $client->request('GET', "https://shopproxy.pdexp.com/?url=" . $url, [
		// 	'cookies' => $jar,
		// 	'referer' => true,
		// 	'headers' => [
		// 		'User-Agent' => 'Mozilla/5.0 (Windows NT x.y; rv:10.0) Gecko/20100101 Firefox/10.0',
		// 		'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		// 		'Accept-Encoding' => 'gzip, deflate, br',
		// 	],
		// 	'verify' => 'C:/cacert.pem',
		// ]);
		// $body = $response->getBody();
		// return $body;
		// var_dump($url);

	}

}