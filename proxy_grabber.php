<?php

// 
// 
// This class fetches proxies and returns them as an array
// 
// 

class KilikMarketProxyGrabber {
	public 			$proxies;
	public 			$counter;
	protected const API_URL = "https://api.proxyscrape.com/?request=displayproxies&proxytype=http&anonymity=elite&ssl=all";
	protected 		$api_options;

	public function __construct(?string $api_options = "") {
		$this->proxies = [];
		$this->counter = 0;
		$this->fetch();
	}

	public function random() {
		return $this->proxies[array_rand($this->proxies)];
	}

	public function size() {
		return count($this->proxies);
	}

	// public function count_up() {
	// 	var_dump(count($this->proxies));
	// 	if(count($this->proxies) >= $this->counter) {
	// 		var_dump('what');
	// 		// return $this->__construct($this->api_options);
	// 	} else {
	// 		$this->counter += 1;
	// 	}
	// }

	protected function fetch() {
		$response = file_get_contents(self::API_URL . $this->api_options);
		$temp_proxies = array_filter(explode("\r\n", $response));

		foreach($temp_proxies as &$proxy) {
			if(explode(":", $proxy) !== "") {
				$proxy = explode(":", $proxy);
				// 0 => ip
				// 1 => port
			}
		}

		$this->proxies = $temp_proxies;
	}
}