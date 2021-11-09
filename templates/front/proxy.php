<?php

$proxy = carbon_get_theme_option("km_proxy"); // bbzniesi-rotate:lfadj01zsd2z@p.webshare.io:80
$crawler = new KilikMarketAmazonCrawler([
	"proxy" => $proxy,
	"website" => 1, 
	// "manual_products" => [
	// 	// "link" => "https://www.amazon.ae/Explorer-Montblanc-perfume-Parfum-100ml/dp/B07K1BW1XY/ref=sr_1_1"
	// ]
]);


// echo "test";






// var_dump( $crawler::create_wc_product(
// 	"Test product title", 
// 	"Test Description", 
// 	10.55, 
// 	10.55, 
// 	['https://www.mahdloyz.org/wp-content/uploads/2017/02/TEST-IMAGE.jpg'],
	
// ) );






// use Goutte\Client;

// $client = new Client();
// $crawler = $client->request('GET', 'http://bonbast.com/');

// $temp_currencies = [];

// $crawler->filter('.table tr > td')->each(function ($node) use (&$temp_currencies) {
// 	$text = $node->text();
// 	if($text != "Code" && $text != "Currency" && $text != "Sell" && $text != "Buy") {
// 		$temp_currencies[] = $text;
// 	}
// });

// $interval 	= count($temp_currencies) / 4;
// $counter 	= 0;
// $interval_counter 	= 0;
// $currencies = [];

// while($interval_counter <= $interval) {
// 	$temp_array = array_slice($temp_currencies, $counter, 4);
// 	if(!empty($temp_array)) {
// 		$currencies[$temp_array[0]] = ["sell" => $temp_array[2], "buy" => $temp_array[3]];
// 	}
// 	$counter += 4;
// 	$interval_counter += 1;
// }


// $amount = 1;
// $from_currency_type = 'USD';
// $to_currency_type = 'IRR';
// $eur = floatval($currencies["EUR"]["sell"]);
// if($to_currency_type == "IRR") {
// 	$to_currency_type = "EUR";
// }
// if($from_currency_type == "IRR") {
// 	$from_currency_type = "EUR";
// }
// $from = $eur / floatval($currencies[$from_currency_type]["sell"]);
// $to = $eur / floatval($currencies[$to_currency_type]["sell"]);
// $converted = round_rates(floatval($amount) * ($to / $from));

// var_dump($converted);

// function round_rates($rate) {
// 	$rounded = 0;
// 	if($rate <= 1) {
// 		var_dump(1);
// 		$rounded = round($rate, 8);
// 	} elseif ($rate <= 10) {
// 		var_dump(2);
// 		$rounded = round($rate, 3);
// 	} elseif ($rate <= 100) {
// 		var_dump(3);
// 		$rounded = round($rate, 2);
// 	} else {
// 		var_dump(4);
// 		$rounded = round($rate, 0);
// 		if($rounded >= 1000) {
// 			$num = $rounded;
// 			$rounded = (string)preg_replace('/(\d)(?=(\d{3})+(?!\d))/', '$1,', (string)$num); // Correct?


// 		}
// 	}
// 	return $rounded;
// }








// use Goutte\Client;
// use Symfony\Component\HttpClient\HttpClient;

// global $i;
// $i = 0;

// $articles 	= [];

// $client  = new Client();
// $crawler = $client->request('GET', 'https://www.irandeliver.com/suggest');

// $crawler->filter('.list_style_header a.link')->each(function ($node) use ($client) {
// 	$link 	 = $node->link()->getUri();
// 	$crawler = $client->request('GET', $link);
// 	$title   = $node->text();
// 	$crawler->filter('.entry-content')->each(function ($node) use ($title, $link) {
// 		if($GLOBALS['i'] < 79) {
// 			$content = substr($node->html(), 0, -681);
// 		} else {
// 			$content = $node->html();
// 		}
// 		$post_data = array(
// 		    'post_title'   => $title,
// 		    'post_content' => $content,
// 		    'post_type'    => 'post',
// 		    'post_status'  => 'publish',
// 		    'post_author'   => 1,
// 		);
// 		$post_id = wp_insert_post( $post_data );
// 		var_dump($post_id);
// 		// var_dump($link);
// 		// echo $content;
// 		// echo("<br>Num:".$GLOBALS['i']."<br>");
// 		$GLOBALS['i']++;
// 	});

// 	// exit;
// });