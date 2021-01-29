<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

use Carbon_Fields\Container;
use Carbon_Fields\Field;
use Goutte\Client;

// 
// 
//  This file includes common functions
// 
// 

class KilikMarketFunctions {

	// Members
	// Proxy Url
	public static $origin_url = "http://localhost/wordpress_projects/kilikmarket_proxy/index.php";
	// Prices Extraction Base Url
	public static $prices_url = "https://bonbast.com/";


	// Installation
	public static function installation() {
		// Require wordpress db
		global $wpdb;

		// Require wordpress dbDelta
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		// Prices Table
		$seasons_table_sql = self::generate_prices_table($wpdb);
	}


	// Schema Of Prices Table
	protected static function generate_prices_table($wpdb) {
		// Register Table Name
		$seasons_table_name = $wpdb->prefix . PLUGIN_NAME . '_' . 'prices';
		// Register Table Charset
		$charset_collate = $wpdb->get_charset_collate();
		// SQL Query
		return "CREATE TABLE $seasons_table_name (
			`id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
			`currency` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,
			`price` BIGINT unsigned DEFAULT '0',
			`created_at` TIMESTAMP COMMENT 'Created at Date',
			PRIMARY KEY (`id`)
		) $charset_collate;";
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
		wp_register_style( 'style', plugin_dir_url( __FILE__ ) . 'dist/style.css' );
		wp_enqueue_style( 'style' );

		// Plugin Js
		wp_register_script( 'bypass', plugin_dir_url( __FILE__ ) . 'assets/js/x-frame-bypass.js', [], null, true);
		wp_enqueue_script( 'bypass' );
		wp_register_script( 'script', plugin_dir_url( __FILE__ ) . 'dist/script.js', [], null, true);
		wp_enqueue_script( 'script' );

		// Set javascript objects
		wp_localize_script( 'script', 'settings', [
			'ajaxurl' 	 => admin_url('admin-ajax.php'),
			// Translations / ترجمه ها
			'tl_checkout' 	 => __( 'تسویه پرداخت', "kilikmarket-addon" ),
			'plugin_dir' => plugin_dir_url( __FILE__ ),
			'origin_url' => self::$origin_url,
			'base_url' 	 => get_home_url(),
			'img_proxy_url' => "http://localhost/wordpress_projects/kilikmarket_proxy/img_proxy.php?url=",
			'wc_cart_url' => wc_get_cart_url(),
			'wc_ck'		 => carbon_get_theme_option('km_wc_ck'),
			'wc_cs'		 => carbon_get_theme_option('km_wc_cs'),
			// 'fee_price' 	 => carbon_get_theme_option('km_fee_price'),
			// 'price_per_gram' => carbon_get_theme_option('km_price_per_gram'),
			// 'usd_price' 	 => carbon_get_theme_option('km_usd_price'),
			// 'aed_price' 	 => carbon_get_theme_option('km_aed_price'),
			'favorites_page_url' => carbon_get_theme_option('km_favorites_page')
			
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

	// Favorites List Template
	public static function favorites_template($arguments = []) {
		include_once(KM_ROOT . 'templates/front/favorites.php');
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
		$temp_pages = get_pages(); 
		$pages = [];
		foreach ( $temp_pages as $page ) {
			$page_link = get_page_link( $page->ID );
			$page_title = $page->post_title;
			$pages[$page_link] = $page_title;
		}

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

				// // Prices
			    // Field::make( 'separator', 'km_prices_seperator', __( 'قیمت ها' ) ),
				// Field::make( 'number', 'km_fee_price', __( 'مقدار کارمزد' ) ),
				// Field::make( 'number', 'km_price_per_gram', __( 'قیمت واحد بر هر 100 گرم' ) ),
				// Field::make( 'number', 'km_usd_price', __( 'قیمت دلار' ) ),
				// Field::make( 'number', 'km_shipment_price', __( 'قیمت حمل (دلار)' ) ),

				// Pages
			    Field::make( 'separator', 'km_favorites_seperator', __( 'صفحه ها' ) ),
				Field::make( 'select', 'km_favorites_page', 'صفحه لیست علاقه مندی ها' )
				->add_options($pages)

	        ]
	    );
	}

	public static function carbon_fields_load() {
	    require_once( 'vendor/autoload.php' );
	    \Carbon_Fields\Carbon_Fields::boot();
	}


	public static function km_product_information_tab( $default_tabs ) {
	    $default_tabs['custom_tab'] = array(
	        'label'   =>  __( 'اطلاعات محصول', 'kilikmarket' ),
	        'target'  =>  'km_product_information',
	        'priority' => 60,
	        'class'   => array()
	    );
	    return $default_tabs;
	}
	 
	public static function km_product_information_data() {
		global $post;
		$product_options_meta_data = get_post_meta( $post->ID, 'km_product_options')[0];
		$product_details_meta_data = get_post_meta( $post->ID, 'km_product_details')[0];
		if(!empty($product_options_meta_data)):
			$options = array_values(json_decode($product_options_meta_data));

			// Details
			$details = json_decode($product_details_meta_data);
		?>
		<div id="km_product_information" class="panel woocommerce_options_panel">

			<table>
				<tr>
					<th>عنوان</th>
					<th>مقدار</th>
				</tr>
				<?php foreach($options as $option): ?>
				<tr>
					<td><?= $option->label ?></td>
					<td><?= $option->value ?></td>
				</tr>
				<?php endforeach; ?>
				<tr>
					<td>قیمت کل</td>
					<td><?= $details->prices->total_price ?> تومان<?= ($details->prices->weight_status) ? '' : ' - <span style="color: red">بدون احتساب وزن</span>' ?></td>
				</tr>
				<tr>
					<td>قیمت اوریجینال</td>
					<td><?= $details->prices->original_price ?> <?= $details->product->currency ?></td>
				</tr>
				<tr>
					<td>وزن</td>
					<td>
						<?php if($details->prices->weight_status):?>
							<?= $details->product->weight_to_gram ?> گرم
						<?php else: ?>
							<p style="color: red">وزن دریافت نشد، محصول بصورت دستی برسی شود.</p>
						<?php endif; ?>
					</td>
				</tr>
				<?php if(!empty($details->product->url)):?>
				<tr>
					<td>آدرس محصول</td>
					<td>
							<p style="color: cyan">
								<a href="<?= substr($details->product->url, strlen(self::$origin_url) + 12) ?>"><?= substr($details->product->url, strlen(self::$origin_url) + 12, strlen(self::$origin_url) + 10 ) ?></a>	
							</p>
					</td>
				</tr>
				<?php endif; ?>
			</table>
		</div>
		<?php
		endif;
	}


	// Fetch Currencies From "bonbast.com"(note: Which Is Cencored)
	public static function get_currencies() {
		$currency_type = isset($_POST['currency_type']) ? $_POST['currency_type'] : null;
		if($currency_type) {
			$client = new Client();
			$crawler = $client->request('GET', 'http://bonbast.com/');

			$temp_currencies = [];

			$crawler->filter('.table tr > td')->each(function ($node) use (&$temp_currencies) {
				$text = $node->text();
				if($text != "Code" && $text != "Currency" && $text != "Sell" && $text != "Buy") {
					$temp_currencies[] = $text;
				}
			});

			$interval 	= count($temp_currencies) / 4;
			$counter 	= 0;
			$currencies = [];

			if(!empty($temp_currencies)) {
				while($counter <= $interval) {
					$temp_array = array_slice($temp_currencies, $counter, 4);
					$currencies[$temp_array[0]] = ["sell" => $temp_array[2], "buy" => $temp_array[3]];
					$counter += 4;
				}
				// Found Currencies
				wp_send_json_success(["message" => $currencies[$currency_type]]);
			} else {
				// Couldn't Find Currencies
				wp_send_json_error(["message" => "Could not find any currency"]);
			}
		} else {
			wp_send_json_error(["message" => "No type found"]);
		}
	}

}