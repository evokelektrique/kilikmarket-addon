<?php

if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly
}

use Carbon_Fields\Container;
use Carbon_Fields\Field;
use Goutte\Client;
use Symfony\Component\HttpClient\HttpClient;
// use Symfony\Component\HttpClient\CurlHttpClient;

// 
// 
//  This file crawls in Amazon websites
// 
// 

class KilikMarketAmazonCrawler {

  public $woocommerce_api_url = "http://localhost:3000";

  // Variations:
  //  1: Amazon
  //  2: AmazonAE
  //  3: AmazonTR
  //  4: AliExpress
  public $websites = [
    1 => [
      "url" => "https://amazon.com",
      "name" => "amazon",
      "custom" => TRUE,
      "data" => [
        "categories_base_url" => "https://www.amazon.com/gp/site-directory",
        "categories" => [] // Pages To Grab Products Link From
      ],
      "currency" => "USD",
      "currency_delimiter" => "$"
    ],
    2 => [
      "url" => "https://amazon.ae",
      "name" => "amazonae",
      "custom" => TRUE,
      "data" => [
        "categories_base_url" => "https://www.amazon.ae/gp/site-directory",
        "categories" => [] // Pages To Grab Products Link From
      ],
      "currency" => "AED",
      "currency_delimiter" => "AED"
    ],
    3 => [
      "url" => "https://amazon.com.tr",
      "name" => "amazontr",
      "custom" => TRUE,
      "data" => [
        "categories_base_url" => "https://www.amazon.com.tr/gp/site-directory",
        "categories" => [] // Pages To Grab Products Link From
      ],
      "currency" => "₺",
      "currency_delimiter" => "₺"
    ],
      // 2 => [
      //  "url" => "https://www.amazon.com.tr",
      //  "name" => "amazontr",
      //  "custom" => TRUE
      // ],
      // 3 => [
      //  "url" => "https://www.aliexpress.com",
      //  "name" => "aliexpress",
      //  "custom" => TRUE
      // ]
  ];

  public $website;  // Current Website
  public $products         = []; // Raw And Un Processed Products
  public $fetched_products = []; // Fetched/Parsed With Calculated Prices Products
  public $manual_products  = [];
  public $proxy_grabber;
  public $client;
  // public $proxies;
  public $proxy;

  public function __construct($params) {
    global $wpdb;

    // $this->proxies = $params['proxies'];

    // object(stdClass)[11286]
    //   public 'username' => string 'wevajgql-dest' (length=13)
    //   public 'password' => string 'cdn35ylykid7' (length=12)
    //   public 'proxy_address' => string '209.127.191.180' (length=15)
    //   public 'ports' => 
    //     object(stdClass)[11296]
    //       ...
    //   public 'valid' => boolean true
    //   public 'last_verification' => string '2021-02-25T05:30:08.295049-08:00' (length=32)
    //   public 'country_code' => string 'US' (length=2)
    $this->proxy = $params['proxy'];
    $client_params = [
      'headers' => [
        'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36', // will be forced using 'Symfony BrowserKit' in executing
        'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      ],
      'proxy' => $this->proxy
    ];

    $this->client = new Client(HttpClient::create($client_params));

    $this->client->setServerParameter('HTTP_USER_AGENT', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

    $this->website = $this->websites[$params["website"]];

    if(isset($params["manual_products"])) {
      array_push($this->manual_products, $params["manual_products"]);
      $this->fetch_products($this->manual_products);
    } else {
      // '1. Amazon
      // '2. AmazonAE
      // '3. AmazonTR
      // '4. Aliexpress
      $table_name = $wpdb->prefix . "kilikmarket_pages";
      $categories = $wpdb->get_results( 
        $wpdb->prepare("SELECT * FROM {$table_name} WHERE page_website=%d", $params["website"] ) 
      );
      $this->configure_categories($categories);
      $this->get_products($categories);
      echo("Products Ready To Fetch: " . count($this->products));
      // exit;
      $this->fetch_products();
      var_dump($this->fetched_products);
    }
    $this->store_products();

    $this->save_products_to_woocommerce();
  }

  // Gather Products
  public function get_products($categories, $try = 1) {
    
    foreach($categories as &$category) {
      sleep(1);
      // var_dump($category->{'page_url'});
      // exit;
      $crawler = $this->client->request('GET', $category->{'page_url'});
      // "https://www.amazon.com/s?k=phone+case&ref=sr_pg_1"
      // $crawler = $this->client->request('GET', "https://ipapi.co/");
      
      if($this->check_validation_form($crawler)) {
        if($try < 5) {
          $this->get_products($categories, $try++);
        } else {
          error_log("Amazon:get_products():try:$try - out.");
          exit;
        }
      }

      // var_dump($category);
      // echo $crawler->html();
      // exit;
      $crawler->filter('h2.a-size-mini.a-spacing-none.a-color-base > a[href*="/dp/"]')->each(function ($node) {
        $uuid     = explode("/dp/", explode('/ref=', $node->link()->getUri())[0])[1];
        $datetime = new DateTime("now", new DateTimeZone("Asia/Tehran"));
        $datetime->setTimestamp(time());
        // Append the product to public $products
        $this->products[] = [
          "text" => $node->text(), 
          "link" => explode('/ref=', $node->link()->getUri())[0],
          "uuid" => $uuid,
          "fetch_status" => FALSE,
          "date_fetched" => $datetime->format('Y/m/d H:i:s'),
        ];

      });
    }
  }

  public function fetch_products($products = []) {
    if(empty($products)) {
      $products = $this->products;
    }

    foreach($products as &$product) {
      try {

        $crawler      = $this->client->request('GET', $product['link']);        
        // echo $crawler->html();
        // exit;
        $title        = $crawler->filter('h1#title')->text();
        $currency     = $this->website["currency"];
        $stock_status = TRUE;

        if(!empty($product['uuid'])) {
          $uuid = $product['uuid'];
        } else {
          $uuid = explode("/dp/", explode('/ref=', $product['link'])[0])[1];
        }

        // Check Price
        $price = $crawler->filter('#priceblock_ourprice')->text();
        if(empty($price)) {
          $price = $crawler->filter('#price_inside_buybox')->text();
          if(empty($price)) {
            $stock_status = FALSE;
          }
        }

        $price = explode($this->website["currency_delimiter"], $price)[1];

        // Fetch Images
        $images = $crawler->filter('#imgTagWrapperId > img')->each(function($node){
          // Parse Json Images
          $parsed_json = json_decode($node->extract(['data-a-dynamic-image'])[0], TRUE);
          return array_keys($parsed_json);
        });

        // Remove &nbsp from prices
        $string = htmlentities($price, null, 'utf-8');
        $price  = str_replace("&nbsp;", "", $string);
        $price  = html_entity_decode($price);

        $this->fetched_products[] = [
          "title"        => $title,
          "price"        => $price,
          "currency"     => $currency,
          "images"       => $images[0],
          "stock_status" => $stock_status,
          "link"         => $product['link'],
          "uuid"         => $uuid,
        ];
        sleep(2);
      } catch(\Exception $e) {
        // var_dump($e);
        continue;
      }
    }

    // Calculate prices
    foreach($this->fetched_products as &$product) {
      $product['prices'] = $this->calculate_prices($product);
      sleep(2);
    }
  }

  public function store_products() {
    global $wpdb;
    foreach($this->fetched_products as &$product) {
      $db_name= $wpdb->prefix . PLUGIN_NAME . '_' . 'products';
      $search_result =  $wpdb->get_var(
        $wpdb->prepare("SELECT COUNT(*) FROM {$db_name} WHERE uuid = %s", $product["uuid"])
      );

      if(intval($search_result) <= 0) {
        $wpdb->insert($wpdb->prefix . PLUGIN_NAME . '_' . 'products', [
          'title'      => $product["title"],
          'image'      => $product["images"][0],
          'uuid'       => $product["uuid"],
          'status'     => false,
          'created_at' => current_time('mysql')
        ]);
      } else {
        // Delete Product
        unset($product);
      }
    }
  }

  public function save_products_to_woocommerce() {
    foreach($this->fetched_products as $product) {
      try {
        $product_id = self::create_wc_product(
          $product['title'],                 // Title
          "",                                // Description
          $product['prices']['total_price'], // Price
          $product['prices']['total_price'], // Regular Price
          $product['images'],                // Images
          $product                           // Fetched Product itself to store in metadata
        );
      } catch(\Exception $e) {
        error_log("Could not save productID: $product_id  - at 'save_products_to_woocommerce'");
        exit;
      }

      // $product_json = json_encode($product);
      // $options = array(
      //   'http' => array(
      //     'method'  => 'POST',
      //     'content' => $product_json,
      //     'header'=>  "Content-Type: application/json\r\n" .
      //                 "Accept: application/json\r\n"
      //     )
      // );

      // $context  = stream_context_create( $options );
      // try {
      //   $result   = file_get_contents( 
      //     $this->woocommerce_api_url."/save_product",
      //     false,
      //     $context
      //   );
      //   $response = json_decode( $result );
      //   var_dump($response); // TODO: Remove it

      // } catch(Exception $e) {
      //   error_log("Could not 'save_products_to_woocommerce' connection refused.");
      //   exit;
      // }

    }
  }


  // Uplaod Images
  public static function upload_media($image_url) {
    require_once('wp-admin/includes/image.php');
    require_once('wp-admin/includes/file.php');
    require_once('wp-admin/includes/media.php');
    $media = media_sideload_image($image_url,0);
    $attachments = get_posts(array(
      'post_type' => 'attachment',
      'post_status' => null,
      'post_parent' => 0,
      'orderby' => 'post_date',
      'order' => 'DESC'
    ));
    return $attachments[0]->ID;
  }

  // Create A WooCommerce Product
  public static function create_wc_product( $title, 
                                            $description = "", 
                                            $price,
                                            $regular_price,
                                            $images = [],
                                            $product ) {
    if(empty($images)) {
      return "Empty Images";
    }

    $wc_product_object = new WC_Product();


    $wc_product_object->set_name($title);
    $wc_product_object->set_status("publish");  // can be publish,draft or any wordpress post status
    $wc_product_object->set_catalog_visibility('visible'); // add the product visibility status
    $wc_product_object->set_description($description);
    $wc_product_object->set_sku(""); //can be blank in case you don't have sku, but You can't add duplicate sku's
    $wc_product_object->set_price($price); // set product price
    $wc_product_object->set_regular_price($regular_price); // set product regular price
    // $wc_product_object->set_manage_stock(true); // true or false
    // $wc_product_object->set_stock_quantity(10);
    $wc_product_object->set_stock_status('instock'); // in stock or out of stock value
    // $wc_product_object->set_backorders('no');
    $wc_product_object->set_reviews_allowed(true);
    $wc_product_object->set_sold_individually(false);
    // $wc_product_object->set_category_ids(array(1,2,3)); // array of category ids, You can get category id from WooCommerce Product Category Section of Wordpress Admin


    $productImagesIDs = array(); // define an array to store the media ids.
    foreach($images as $image){
        $mediaID = self::upload_media($image); // calling the upload_media function and passing image url to get the uploaded media id
        if($mediaID) $productImagesIDs[] = $mediaID; // storing media ids in a array.
    }
    if($productImagesIDs){
        $wc_product_object->set_image_id($productImagesIDs[0]); // set the first image as primary image of the product

            //in case we have more than 1 image, then add them to product gallery. 
        if(count($productImagesIDs) > 1){
            $wc_product_object->set_gallery_image_ids($productImagesIDs);
        }
    }

    $product_id = $wc_product_object->save(); // it will save the product and return the generated product id

    // Append Meta Data
    update_post_meta( $product_id, 'km_product_options', json_encode(['test_key' => 'test_value']) );
    update_post_meta( $product_id, 'km_product_details', json_encode([
      'prices' => $product['prices'],
      'product' => $product
    ]) );
    
    return $product_id;
  }





  // Append Categories
  private function configure_categories($categories) {
    $this->website["data"]["categories"] = $categories;
  }

  private function calculate_prices(array $product) {
    $weight_status     = FALSE; // Weight status always has to be FALSE because
    $shipment_price    = 0;     // We do not calculate weight price in crawler
    $exchange_rate     = 0;
    $clearance_price   = 0;
    $clearance_percent = 0;
    $fee_price         = 0;
    $fee_percent       = 0;
    $converted         = 0;
    $converted_status  = FALSE;

    // Validations
    if(empty($product)) {
      return [
        "status" => FALSE
      ];
    }
 
    // Convert The Price
    if($this->website["currency"] !== "USD") {
      $converted_status = TRUE;
      $convert_result   = KilikMarketFunctions::convert_currency(1, TRUE, [
        "from"    => $this->website['currency'], 
        "to"      => "USD", 
        "amount"  => $product['price']
      ]);
      $exchange_rate    = floatval($convert_result["usd_to_irr"]);
      $converted        = $convert_result['converted'];

    } else {
      // Don't Need To Convert The Price
      try {
        $currencies    = KilikMarketFunctions::admin_get_currencies();
        $exchange_rate = floatval($currencies[$this->website["currency"]]["sell"]);
      } catch(Exception $e) {
        return [
          "status"  => FALSE,
          "message" => "Could not fetch exchange rates"
        ];
      }
    }

    // Calculate Clearance Price
    if($converted_status) {
      if(floatval($converted) <= 100) {
        $clearance_price = (100 * carbon_get_theme_option('km_clearance_price_1')) / 100;
        $clearance_percent = carbon_get_theme_option('km_clearance_price_1');

      } elseif(100 < floatval($converted) && floatval($converted) <= 200) {
        $clearance_price = (100 * carbon_get_theme_option('km_clearance_price_2')) / 100;
        $clearance_percent = carbon_get_theme_option('km_clearance_price_2');

      } elseif(200 < floatval($converted) && floatval($converted) <= 300) {
        $clearance_price = (100 * carbon_get_theme_option('km_clearance_price_3')) / 100;
        $clearance_percent = carbon_get_theme_option('km_clearance_price_3');

      } elseif(300 < floatval($converted) && floatval($converted) <= 500) {
        $clearance_price = (100 * carbon_get_theme_option('km_clearance_price_4')) / 100;
        $clearance_percent = carbon_get_theme_option('km_clearance_price_4');

      } elseif(500 < floatval($converted)) {
        $clearance_price = (100 * carbon_get_theme_option('km_clearance_price_5')) / 100;
        $clearance_percent = carbon_get_theme_option('km_clearance_price_5');
      }
    } else {
      if(floatval($product["price"]) <= 100) {
        $clearance_price = (100 * carbon_get_theme_option('km_clearance_price_1')) / 100;
        $clearance_percent = carbon_get_theme_option('km_clearance_price_1');

      } elseif(100 < floatval($product["price"]) && floatval($product["price"]) <= 200) {
        $clearance_price = (100 * carbon_get_theme_option('km_clearance_price_2')) / 100;
        $clearance_percent = carbon_get_theme_option('km_clearance_price_2');

      } elseif(200 < floatval($product["price"]) && floatval($product["price"]) <= 300) {
        $clearance_price = (100 * carbon_get_theme_option('km_clearance_price_3')) / 100;
        $clearance_percent = carbon_get_theme_option('km_clearance_price_3');

      } elseif(300 < floatval($product["price"]) && floatval($product["price"]) <= 500) {
        $clearance_price = (100 * carbon_get_theme_option('km_clearance_price_4')) / 100;
        $clearance_percent = carbon_get_theme_option('km_clearance_price_4');

      } elseif(500 < floatval($product["price"])) {
        $clearance_price = (100 * carbon_get_theme_option('km_clearance_price_5')) / 100;
        $clearance_percent = carbon_get_theme_option('km_clearance_price_5');
      }
    }

    // Calculate Fee Price
    if($converted_status) {
      if(floatval($converted) <= 100) {
        $fee_price = (100 * carbon_get_theme_option('km_fee_price_1')) / 100;
        $fee_percent = carbon_get_theme_option('km_fee_price_1');

      } elseif(100 < floatval($converted) && floatval($converted) <= 200) {
        $fee_price = (100 * carbon_get_theme_option('km_fee_price_2')) / 100;
        $fee_percent = carbon_get_theme_option('km_fee_price_2');

      } elseif(200 < floatval($converted) && floatval($converted) <= 300) {
        $fee_price = (100 * carbon_get_theme_option('km_fee_price_3')) / 100;
        $fee_percent = carbon_get_theme_option('km_fee_price_3');

      } elseif(300 < floatval($converted) && floatval($converted) <= 500) {
        $fee_price = (100 * carbon_get_theme_option('km_fee_price_4')) / 100;
        $fee_percent = carbon_get_theme_option('km_fee_price_4');

      } elseif(500 < floatval($converted)) {
        $fee_price = (100 * carbon_get_theme_option('km_fee_price_5')) / 100;
        $fee_percent = carbon_get_theme_option('km_fee_price_5');
      }
    } else {
      if(floatval($product["price"]) <= 100) {
        $fee_price = (100 * carbon_get_theme_option('km_fee_price_1')) / 100;
        $fee_percent = carbon_get_theme_option('km_fee_price_1');

      } elseif(100 < floatval($product["price"]) && floatval($product["price"]) <= 200) {
        $fee_price = (100 * carbon_get_theme_option('km_fee_price_2')) / 100;
        $fee_percent = carbon_get_theme_option('km_fee_price_2');

      } elseif(200 < floatval($product["price"]) && floatval($product["price"]) <= 300) {
        $fee_price = (100 * carbon_get_theme_option('km_fee_price_3')) / 100;
        $fee_percent = carbon_get_theme_option('km_fee_price_3');

      } elseif(300 < floatval($product["price"]) && floatval($product["price"]) <= 500) {
        $fee_price = (100 * carbon_get_theme_option('km_fee_price_4')) / 100;
        $fee_percent = carbon_get_theme_option('km_fee_price_4');

      } elseif(500 < floatval($product["price"])) {
        $fee_price = (100 * carbon_get_theme_option('km_fee_price_5')) / 100;
        $fee_percent = carbon_get_theme_option('km_fee_price_5');
      }
    }

    $total_irr_product_price = 0;
    if($converted_status) {
      $total_irr_product_price = (
        floatval($converted) +
        $clearance_price +
        $fee_price
      ) * $exchange_rate;

    } else {
      $total_irr_product_price = (
        floatval($product["price"]) +
        $clearance_price +
        $fee_price
      ) * $exchange_rate;
    }

    // TODO: Remove
    // var_dump([$exchange_rate, $clearance_price, $clearance_percent, $fee_price, $fee_percent, $product["price"], $total_irr_product_price]);

    return [
      "exchange_rate"     => $exchange_rate,
      "clearance_price"   => floatval($clearance_price),
      "clearance_percent" => floatval($clearance_percent),
      "fee_price"         => floatval($fee_price),
      "fee_percent"       => floatval($fee_percent),
      "converted_status"  => $converted_status,
      "converted"         => floatval($converted),
      "total_price"       => floatval($total_irr_product_price),
      "original_price"    => floatval($product["price"]),
      "weight_price"      => $shipment_price,
      "weight_status"     => $weight_status,
      "status"            => TRUE,
    ];
  }

  private function check_validation_form($crawler) {
    $forms = $crawler->filterXpath('//form')->extract(['action']);
    if($forms[0] === "/errors/validateCaptcha") {
      return true;
    } else {
      return false;
    }
  }

  // private function change_proxy() {
  //   $this->proxy = $this->get_random_proxy();
  // }

  // private function get_random_proxy() {
  //   $index = array_rand($this->proxies->results);
  //   $proxy_username = $this->proxies->results[$index]->username;
  //   $proxy_password = $this->proxies->results[$index]->password;
  //   $proxy_address  = $this->proxies->results[$index]->proxy_address;
  //   $proxy_port     = $this->proxies->results[$index]->ports->http;
  //   return "http://{$proxy_username}:{$proxy_password}@{$proxy_address}:$proxy_port";
  // }



}
