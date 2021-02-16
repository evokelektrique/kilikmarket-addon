<?php
use Goutte\Client;

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
$interval_counter 	= 0;
$currencies = [];

while($interval_counter <= $interval) {
	$temp_array = array_slice($temp_currencies, $counter, 4);
	if(!empty($temp_array)) {
		$currencies[$temp_array[0]] = ["sell" => $temp_array[2], "buy" => $temp_array[3]];
	}
	$counter += 4;
	$interval_counter += 1;
}


$amount = 1;
$from_currency_type = 'USD';
$to_currency_type = 'IRR';
$eur = floatval($currencies["EUR"]["sell"]);
if($to_currency_type == "IRR") {
	$to_currency_type = "EUR";
}
if($from_currency_type == "IRR") {
	$from_currency_type = "EUR";
}
$from = $eur / floatval($currencies[$from_currency_type]["sell"]);
$to = $eur / floatval($currencies[$to_currency_type]["sell"]);
$converted = round_rates(floatval($amount) * ($to / $from));

var_dump($converted);

function round_rates($rate) {
	$rounded = 0;
	if($rate <= 1) {
		var_dump(1);
		$rounded = round($rate, 8);
	} elseif ($rate <= 10) {
		var_dump(2);
		$rounded = round($rate, 3);
	} elseif ($rate <= 100) {
		var_dump(3);
		$rounded = round($rate, 2);
	} else {
		var_dump(4);
		$rounded = round($rate, 0);
		if($rounded >= 1000) {
			$num = $rounded;
			$rounded = (string)preg_replace('/(\d)(?=(\d{3})+(?!\d))/', '$1,', (string)$num); // Correct?


		}
	}
	return $rounded;
}

