<?php
// KilikMarketFunctions::iframe([
// 	'id' 		=> 'shops',
// 	'src' 		=> 'http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=http://amazon.com/', 
// 	'width' 	=> "100%", 
// 	"height" 	=> "600",
// ]);
?>

<div id="shopping_website_container">
  <div class="shopping_websites">
      <!-- Exit button -->
      <span class="shopping_website_trigger" id="exit_button"></span>

      <!-- ebay -->
      <span class="shopping_website_trigger" data-target="4" id="ebay_website"></span>

      <!-- aliexpress -->
      <span class="shopping_website_trigger" data-target="3" id="aliexpress_website"></span>

      <!-- sixpm -->
      <span class="shopping_website_trigger" data-target="2" id="sixpm_website"></span>

      <!-- amazonae -->
      <span class="shopping_website_trigger" data-target="1" id="amazonae_website"></span>

      <!-- amazon -->
      <span class="shopping_website_trigger" data-target="0" id="amazon_website"></span>
  </div>

  <!-- Iframe container -->
  <div id="shopping_website_iframe">
      <!-- Spinner -->
      <div id="loading_iframe" style="display: none;">
          <div id="km_iframe_spinner">
              <div class="sk-folding-cube">
                <div class="sk-cube1 sk-cube"></div>
                <div class="sk-cube2 sk-cube"></div>
                <div class="sk-cube4 sk-cube"></div>
                <div class="sk-cube3 sk-cube"></div>
              </div>
          </div>
      </div>
      <div id="iframe_container"></div>
  </div>
</div>

<div id="external_add_to_cart_container" style="display: none">
	<button id="external_add_to_cart">Add To Cart</button>
	<button id="external_calculate">Calculate</button>
</div>

<div id="test_container"></div>