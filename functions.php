<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

use Carbon_Fields\Container;
use Carbon_Fields\Field;
use Goutte\Client;
use Symfony\Component\HttpClient\HttpClient;

// 
// 
//  This file includes common functions
// 
// 

class KilikMarketFunctions {

	// Custom Proxy Url
	public static $origin_url = "http://localhost/wordpress_projects/kilikmarket_proxy/index.php";
	// Image Replacement Url
	public static $img_proxy_url = "http://localhost/wordpress_projects/kilikmarket_proxy/img_proxy.php?url=";
	// Simple Proxy Url
	public static $proxy_url = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php?url=";

	// Installation
	public static function installation() {
		// Require wordpress db
		global $wpdb;

		// Require wordpress dbDelta
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		// $prices_table_sql = self::generate_prices_table($wpdb);
		$products_table_sql = self::generate_products_table($wpdb);
		$pages_table_sql 	= self::generate_pages_table($wpdb);

		dbDelta($products_table_sql);
		dbDelta($pages_table_sql);
	}


	// Schema Of Pages To Crawl/Fetch Products From Table
	protected static function generate_pages_table($wpdb) {
		// Register Table Name
		$table_name = $wpdb->prefix . PLUGIN_NAME . '_' . 'pages';
		// Register Table Charset
		$charset_collate = $wpdb->get_charset_collate();
		// SQL Query
		// '1. Amazon
		// '2. AmazonAE
		// '3. AmazonTR
		// '4. Aliexpress
		return "CREATE TABLE $table_name (
			`id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
			`page_url` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,
			`page_website` INT unsigned DEFAULT '0',
			`created_at` TIMESTAMP,
			PRIMARY KEY (`id`)
		) $charset_collate;";
	}

	// Schema Of Crawler Products Table
	protected static function generate_products_table($wpdb) {
		// Register Table Name
		$table_name = $wpdb->prefix . PLUGIN_NAME . '_' . 'products';
		// Register Table Charset
		$charset_collate = $wpdb->get_charset_collate();
		// SQL Query
		return "CREATE TABLE $table_name (
			`id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
			`title` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,
			`image` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,
			`uuid` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,
			`status` BIGINT unsigned DEFAULT '0',
			`created_at` TIMESTAMP,
			PRIMARY KEY (`id`)
		) $charset_collate;";
	}

	// Schema Of Prices Table
	protected static function generate_prices_table($wpdb) {
		// Register Table Name
		$table_name = $wpdb->prefix . PLUGIN_NAME . '_' . 'prices';
		// Register Table Charset
		$charset_collate = $wpdb->get_charset_collate();
		// SQL Query
		return "CREATE TABLE $table_name (
			`id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
			`currency` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,
			`price` BIGINT unsigned DEFAULT '0',
			`created_at` TIMESTAMP COMMENT 'Created at Date',
			PRIMARY KEY (`id`)
		) $charset_collate;";
	}

	// Admin Menu
	public static function admin_bot_menu() {
		// Top Menu
		add_menu_page(
			__( 'Kilikmarket Pages', PLUGIN_NAME ),
			__( 'Kilikmarket Pages', PLUGIN_NAME ),
			'manage_options',
			'kilikmarket-pages',
			'KilikMarketFunctions::pages_handler',
			"dashicons-schedule",
			// KM_ROOT."icon.png",
			10000
		);
		add_submenu_page( 
			'kilikmarket-pages',
			'Kilikmarket Pages',
			'Kilikmarket Pages',
		    'manage_options',
		    'kilikmarket-pages',
		    'KilikMarketFunctions::pages_handler',
		);

	}

	public static function pages_handler() {
		global $wpdb;
	    $action = isset( $_GET['action'] ) ? $_GET['action'] : 'list';
	    $id     = isset( $_GET['id'] ) ? intval( $_GET['id'] ) : 0;
		$redirect_url = admin_url( 'admin.php?page=kilikmarket-pages' );

	    switch ($action) {
	        // case 'view':
	        //     $template = dirname( __FILE__ ) . '/views/page-single.php';
	        //     break;

	        case 'edit':
	            $template = KM_ROOT.'includes/pages/views/page-edit.php';
	            break;

	        case 'new':
	            $template = KM_ROOT.'includes/pages/views/page-new.php';
	            break;
	        case 'delete':
	        	var_dump($id);
	        	$wpdb->delete( $wpdb->prefix . 'kilikmarket_pages', array( 'id' => $id ) );
				$redirect_to = add_query_arg( array( 'delete' => 'success' ), $redirect_url );
				wp_safe_redirect( $redirect_to );
	        default:
	            $template = KM_ROOT.'includes/pages/views/page-list.php';
	            break;
	    }

	    if ( file_exists( $template ) ) {
	        include_once $template;
	    }
	}

	public static function admin_bot_page_template() {
		require_once(KM_ROOT.'templates/admin/pages.php');
	}

	public static function admin_bot_page_form_template() {
		require_once(KM_ROOT.'includes/pages/form/new.php');
	}

	// Register style & scripts
	public static function register_styles($hook) {
		// Plugin Style
		wp_register_style( 'style', plugin_dir_url( __FILE__ ) . 'dist/style.css' );
		wp_enqueue_style( 'style' );

		// Plugin Js
		wp_register_script( 'bypass', plugin_dir_url( __FILE__ ) . 'assets/js/x-frame-bypass.js', [], NULL, TRUE);
		wp_enqueue_script( 'bypass' );
		wp_register_script( 'script', plugin_dir_url( __FILE__ ) . 'dist/script.js', [], NULL, TRUE);
		wp_enqueue_script( 'script' );

		// Set javascript objects
		wp_localize_script( 'script', 'settings', [
			'ajaxurl' 	 => admin_url('admin-ajax.php'),
			// Translations
			'tl_checkout' 	 => __( 'تسویه پرداخت', "kilikmarket-addon" ),

			'plugin_dir' => plugin_dir_url( __FILE__ ),
			'origin_url' => self::$origin_url,
			'base_url' 	 => get_home_url(),

			// Image Proxy Address

			'img_proxy_url' => self::$img_proxy_url,
			'proxy_url' => self::$proxy_url,

			// WooCommerce
			'wc_cart_url' => wc_get_cart_url(),
			'wc_ck'		 => carbon_get_theme_option('km_wc_ck'),
			'wc_cs'		 => carbon_get_theme_option('km_wc_cs'),

			// Fee Prices
			'km_fee_price_1' 	 => carbon_get_theme_option('km_fee_price_1'),
			'km_fee_price_2' 	 => carbon_get_theme_option('km_fee_price_2'),
			'km_fee_price_3' 	 => carbon_get_theme_option('km_fee_price_3'),
			'km_fee_price_4' 	 => carbon_get_theme_option('km_fee_price_4'),
			'km_fee_price_5' 	 => carbon_get_theme_option('km_fee_price_5'),

			// Clearance Prices
			'km_clearance_price_1' 	 => carbon_get_theme_option('km_clearance_price_1'),
			'km_clearance_price_2' 	 => carbon_get_theme_option('km_clearance_price_2'),
			'km_clearance_price_3' 	 => carbon_get_theme_option('km_clearance_price_3'),
			'km_clearance_price_4' 	 => carbon_get_theme_option('km_clearance_price_4'),
			'km_clearance_price_5' 	 => carbon_get_theme_option('km_clearance_price_5'),

			// Weight Prices
			'km_weight_price_1' 	 => carbon_get_theme_option('km_weight_price_1'),
			'km_weight_price_2' 	 => carbon_get_theme_option('km_weight_price_2'),
			'km_weight_price_3' 	 => carbon_get_theme_option('km_weight_price_3'),
			'km_weight_price_4' 	 => carbon_get_theme_option('km_weight_price_4'),
			'km_weight_price_5' 	 => carbon_get_theme_option('km_weight_price_5'),

			// Pages
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

	// Shopping Form Template
	public static function shops_form_template($arguments = []) {
		include_once(KM_ROOT . 'templates/front/shops_form.php');
	}

	// Favorites List Template
	public static function favorites_template($arguments = []) {
		include_once(KM_ROOT . 'templates/front/favorites.php');
	}

	// Suggests List Template
	public static function suggests_template($arguments = []) {
		include_once(KM_ROOT . 'templates/front/suggests.php');
	}

	// Generates An Iframe HTML Element
	public static function iframe(array $arguments = []) {
		$attributes = implode( ' ', array_filter( array_map( function ( $key, $value ) {
		    return $value ? $key . '="' . htmlspecialchars( $value ) . '"' : FALSE;
		}, array_keys( $arguments ), $arguments ) ) );

		return "<iframe " . $attributes . "></iframe>";
	}

	public static function theme_options() {
		$temp_pages = get_pages(); 
		$pages = [];
		foreach ( $temp_pages as $page ) {
			$page_link = get_page_link( $page->ID );
			$page_title = $page->post_title;
			$pages[$page_link] = $page_title;
		}

		// Load calculator.php into $calculator_page variable
		ob_start();
		require_once(KM_ROOT.'templates/admin/calculator.php');
		$calculator_page = ob_get_contents();
		ob_clean();


		Container::make( 'theme_options', __( 'Kilikmarket' ) )
		->set_page_file('kilikmarket-options')
		->set_page_menu_position(9999)
		->add_tab( __('ماشین حساب'), [
			// 
	   	    // Calculator
	   	    // 
	   	    Field::make( 'html', 'crb_information_text' )
	   	        ->set_html( $calculator_page )
		])
		->add_tab( __('Settings'), [
			// 
			// General Settings
			// 
	    	// Pages
			// 
			Field::make( 'separator', 'km_favorites_seperator', __( 'صفحه ها' ) ),
			Field::make( 'select', 'km_favorites_page', 'صفحه لیست علاقه مندی ها' )
			->add_options($pages),
			Field::make( 'select', 'km_external_iframe_page', 'صفحه آیفریم جداگانه' )
			->add_options($pages),
			Field::make( 'separator', 'km_proxy_seperator', __( 'پروکسی' ) ),
			Field::make( 'text', 'km_proxy', __( 'آدرس پروکسی HTTP/S' ) )
			->set_attribute( 'placeholder', 'http_proxy_url ...' )
		])
		->add_tab( __('تنظیمات ووکامرس'), [
			// 
        	// WooCommerce
        	// 
			Field::make( 'text', 'km_wc_ck', __( 'کلید API ووکامرس' ) )
			->set_attribute( 'placeholder', 'ck_' ),
			Field::make( 'text', 'km_wc_cs', __( 'کلید مخفی API ووکامرس' ) )
			->set_attribute( 'placeholder', 'cs_' ),
		])
		->add_tab( __('هزینه های کارمزد'), [
    	    // 
    	    // Fee
    	    // 
			Field::make( 'number', 'km_fee_price_1', __( '<= 100' ) )
			->set_classes('km_fee_price'),
			Field::make( 'number', 'km_fee_price_2', __( '100 < PRICE($) <= 200' ) )
			->set_classes('km_fee_price'),
			Field::make( 'number', 'km_fee_price_3', __( '200 < PRICE($) <= 300' ) )
			->set_classes('km_fee_price'),
			Field::make( 'number', 'km_fee_price_4', __( '300 < PRICE($) <= 500' ) )
			->set_classes('km_fee_price'),
			Field::make( 'number', 'km_fee_price_5', __( '500 < PRICE($)' ) )
			->set_classes('km_fee_price'),
		])
		->add_tab( __('هزینه های گمرک'), [
	   	    // 
	   	    // Clearance
	   	    // 
			Field::make( 'number', 'km_clearance_price_1', __( '<= 100' ) )
			->set_classes('km_clearance_price'),
			Field::make( 'number', 'km_clearance_price_2', __( '100 < PRICE($) <= 200' ) )
			->set_classes('km_clearance_price'),
			Field::make( 'number', 'km_clearance_price_3', __( '200 < PRICE($) <= 300' ) )
			->set_classes('km_clearance_price'),
			Field::make( 'number', 'km_clearance_price_4', __( '300 < PRICE($) <= 500' ) )
			->set_classes('km_clearance_price'),
			Field::make( 'number', 'km_clearance_price_5', __( '500 < PRICE($)' ) )
			->set_classes('km_clearance_price'),
		])
		->add_tab( __('هزینه های وزن'), [
	   	    // 
	   	    // Weight
	   	    // 
			Field::make( 'number', 'km_weight_price_1', __( '<= 0.5' ) )
			->set_classes('km_weight_price'),
			Field::make( 'number', 'km_weight_price_2', __( '0.5 < WEIGHT(Kg) <= 1' ) )
			->set_classes('km_weight_price'),
			Field::make( 'number', 'km_weight_price_3', __( '1 < WEIGHT(Kg) <= 2' ) )
			->set_classes('km_weight_price'),
			Field::make( 'number', 'km_weight_price_4', __( '2 < WEIGHT(Kg) <= 3' ) )
			->set_classes('km_weight_price'),
			Field::make( 'number', 'km_weight_price_5', __( '3 < WEIGHT(Kg)' ) )
			->set_classes('km_weight_price'),
		]);
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
		$product_options_meta_data = get_post_meta( $post->ID, 'km_product_options');
		if(!empty($product_options_meta_data)) {
			$product_options_meta_data = $product_options_meta_data[0];
		} else {
			?>
			<div id="km_product_information" class="panel woocommerce_options_panel">
				<p>اطلاعاتی پیدا نشد</p>
			</div>
			<?php
			return;
		}
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
				<?php if(!empty($options)): foreach($options as $option): ?>
				<tr>
					<td><?= $option->label ?></td>
					<td><?= $option->value ?></td>
				</tr>
				<?php endforeach; endif; ?>
				<tr>
					<td>قیمت کل</td>
					<td>
						<?= $details->prices->total_price ?> تومان<?= ($details->prices->weight_status) ? '' : ' - <span style="color: red">بدون احتساب وزن</span>' ?>
					</td>
				</tr>
				<tr>
					<td>قیمت اوریجینال</td>
					<td>
						<?= $details->prices->original_price ?> <?= $details->product->currency ?>
					</td>
				</tr>
				<tr>
					<td>وزن</td>
					<td>
						<?php if($details->prices->weight_status):?>
							<?= $details->product->weight_to_kilogram ?> گرم
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
		$currency_type = isset($_POST['currency_type']) ? $_POST['currency_type'] : NULL;
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
			$counter = 0;
			$interval_counter 	= 0;
			$currencies = [];

			if(!empty($temp_currencies)) {
				while($interval_counter <= $interval) {
					$temp_array = array_slice($temp_currencies, $counter, 4);
					$currencies[$temp_array[0]] = ["sell" => $temp_array[2], "buy" => $temp_array[3]];
					$counter += 4;
					$interval_counter += 1;
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

	public static function convert_currency($try = 1, $admin = FALSE, $params = []) {
		$from_currency_type = null;
		$to_currency_type = null;
		$amount = null;		

		if(!empty($params)) {
			$from_currency_type = $params['from'];
			$to_currency_type = $params['to'];
			$amount = floatval($params['amount']);
		} else {
			$from_currency_type = $_POST['from'];
			$to_currency_type = $_POST['to'];
			$amount = floatval($_POST['amount']);
		}

		if(!empty($from_currency_type) && !empty($to_currency_type)) {
			try {
				$client = new Client();
				$crawler = $client->request('GET', 'http://bonbast.com/');
		    } catch(Exception $e){
		        if($try <5){
					sleep(2);
					convert_currency($try++);
		        } else {
		        	if($admin) {
		        		return ["converted" => "Could not find any currency"];
		        	}
					wp_send_json_error(["converted" => "Could not find any currency"]);
		        }
		    }
			$temp_currencies = [];

			$crawler->filter('.table tr > td')->each(function ($node) use (&$temp_currencies) {
				$text = $node->text();
				if($text != "Code" && $text != "Currency" && $text != "Sell" && $text != "Buy") {
					$temp_currencies[] = $text;
				}
			});

			$interval 	= count($temp_currencies) / 4;
			$counter 	= 0;
			$interval_counter 	= 0;
			$currencies = [];

			// Found Currencies
			if(!empty($temp_currencies)) {
				while($interval_counter <= $interval) {
					$temp_array = array_slice($temp_currencies, $counter, 4);
					if(!empty($temp_array)) {
						$currencies[$temp_array[0]] = ["sell" => $temp_array[2], "buy" => $temp_array[3]];
						$counter += 4;
					}
					$interval_counter += 1;
				}
				// Converting Currencies
				$eur 		= floatval($currencies["EUR"]["sell"]);
				$from 		= $eur / floatval($currencies[$from_currency_type]["sell"]);
				$to 		= $eur / floatval($currencies[$to_currency_type]["sell"]);

				if($admin) {
					$converted 	= self::round_rates(floatval($amount) * ($to / $from));
				} else {
					// Will be rounded in JS
					$converted 	= floatval($amount) * ($to / $from);
				}
				// Send Success Result
				if($admin) {
					return ["usd_to_irr" => $currencies["USD"]["sell"], "converted" => $converted];
				}
				wp_send_json_success(["usd_to_irr" => $currencies["USD"]["sell"], "converted" => $converted]);
			} else {
				// Couldn't Find Currencies
				if($admin) {
					return ["converted" => "Could not find any currency"];
				}
				wp_send_json_error(["converted" => "Could not find any currency"]);
			}
		} else {
			if($admin) {
				return ["converted" => "No type found"];
			}
			wp_send_json_error(["converted" => "No type found"]);
		}
	}


	public static function round_rates($rate) {
		$rounded = 0;
		if($rate <= 1) {
			$rounded = round($rate, 8);
		} elseif ($rate <= 10) {
			$rounded = round($rate, 3);
		} elseif ($rate <= 100) {
			$rounded = round($rate, 2);
		} else {
			$rounded = round($rate, 0);
			if($rounded >= 1000) {
				$num = $rounded;
				$rounded = (string)preg_replace('/(\d)(?=(\d{3})+(?!\d))/', '$1,', (string)$num); // Correct?
			}
		}
		return $rounded;
	}

	public static function admin_get_currencies($try = 1) {
		$crawler = null;
		try {
			$client_params = [
		      'headers' => [
		        'user-agent' => 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:73.0) Gecko/20100101 Firefox/73.0', // will be forced using 'Symfony BrowserKit' in executing
		        'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		        'Accept-Language' => 'en-US,en;q=0.5',
		        'Referer' => 'http://google.com/',
		        'Cache-Control' => 'no-cache',
		        'Connection' => 'keep-alive',
		        'Upgrade-Insecure-Requests' => '1',
		        'TE' => 'Trailers'
		      ]
		    ];
			$client = new Client(HttpClient::create($client_params));
    		$client->setServerParameter('HTTP_USER_AGENT', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:73.0) Gecko/20100101 Firefox/73.0');
			$crawler = $client->request('GET', 'http://bonbast.com/', ['timeout' => 30]);
		} catch(Exception $e) {
			if($try < 10) {
				self::admin_get_currencies($try++);
			} else {
				return [];
			}
		}

		$temp_currencies = [];

		$crawler->filter('.table tr > td')->each(function ($node) use (&$temp_currencies) {
			$text = $node->text();
			if($text != "Code" && $text != "Currency" && $text != "Sell" && $text != "Buy") {
				$temp_currencies[] = $text;
			}
		});

		$interval 	= count($temp_currencies) / 4;
		$counter = 0;
		$interval_counter 	= 0;
		$currencies = [];

		if(!empty($temp_currencies)) {
			while($interval_counter <= $interval) {
				$temp_array = array_slice($temp_currencies, $counter, 4);
				if(!empty($temp_array)) {
					$currencies[$temp_array[0]] = ["sell" => $temp_array[2], "buy" => $temp_array[3]];
					$counter += 4;
				}
				$interval_counter += 1;
			}
			// Found Currencies
			return $currencies;
		} else {
			// Couldn't Find Currencies
			return [];
		}
	
	}

}



// 'ck_48d22276a2a859655731ccc667b563c89bdda244', 
// 'cs_0aac35fbefd1ddcaf6ac76d13f3da73ef16d9010',