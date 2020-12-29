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
			'fee_price' 	 => carbon_get_theme_option('km_fee_price'),
			'price_per_gram' => carbon_get_theme_option('km_price_per_gram'),
			'usd_price' 	 => carbon_get_theme_option('km_usd_price'),
			'aed_price' 	 => carbon_get_theme_option('km_aed_price'),
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
				Field::make( 'number', 'km_fee_price', __( 'مقدار کارمزد' ) ),
				Field::make( 'number', 'km_price_per_gram', __( 'قیمت واحد بر هر 100 گرم' ) ),
				Field::make( 'number', 'km_usd_price', __( 'قیمت دلار' ) ),
				Field::make( 'number', 'km_aed_price', __( 'قیمت درهم امارات' ) ),

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
			// var_dump($product_details_meta_data);
			$details = json_decode($product_details_meta_data);
			// var_dump($details);
			//    public 'total_price' => int 327000
			//    public 'weight_price' => null
			//    public 'weight_status' => boolean false
			//    public 'price' => int 322000
			//    public 'original_price' => string '46.00' (length=5)
			//    public 'fee_price' => string '5000' (length=4)
			// $details->prices->total_price;

			// public 'product' => 
			//     object(stdClass)[16314]
			//       public 'status' => int 1
			//       public 'title' => string 'HP 123 Black Original Ink Advantage Cartridge - F6V17AE' (length=55)
			//       public 'description' => string '...' (length=451)
			//       public 'categories' => 
			//         array (size=5)
			//           0 => string 'Computers' (length=9)
			//           1 => string 'Printers & Accessories' (length=22)
			//           2 => string 'Printer Accessories' (length=19)
			//           3 => string 'Printer Ink, Toner & Ribbons' (length=28)
			//           4 => string 'Ink Cartridges' (length=14)
			//       public 'price' => string '46.00' (length=5)
			//       public 'currency' => string 'AED' (length=3)
			//       public 'options' => 
			//         array (size=2)
			//           0 => 
			//             object(stdClass)[16313]
			//               ...
			//           1 => 
			//             object(stdClass)[16277]
			//               ...
			//       public 'image' => string 'https://images-na.ssl-images-amazon.com/images/I/61lXrsBZLQL._AC_SL1280_.jpg' (length=76)
			//       public 'weight' => string '/*
			// * Fix for UDP-1061. Avera' (length=28)
			//       public 'weight_type' => string 'g' (length=1)
			//       public 'weight_to_gram' => null

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

}