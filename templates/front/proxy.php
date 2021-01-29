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

$interval = count($temp_currencies) / 4;
$counter = 0;
$currencies = [];
if(!empty($temp_currencies)) {
	while($counter <= $interval) {
		$temp_array = array_slice($temp_currencies, $counter, 4);
		$currencies[$temp_array[0]] = ["sell" => $temp_array[2], "buy" => $temp_array[3]];
		$counter += 4;
	}
}

var_dump($currencies);
