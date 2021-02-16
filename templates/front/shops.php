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

      <!-- aliexpress -->
      <span class="shopping_website_trigger" data-target="3" id="aliexpress_website"></span>

      <!-- sixpm -->
      <span class="shopping_website_trigger" data-target="2" id="amazontr_website"></span>

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
	<button id="external_add_to_favorites">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  </button>

  <button id="external_add_to_cart">
    <span class="icon"></span>
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
    <span>افزودن به سبد</span>
  </button>
  <!-- 
total_price:        total_irr_product_price,

weight_price:       shipment_price, // TODO: Change it from dashboard.
weight_status:      weight_status,

price:              exchange_rate,
original_price:     product.price,

fee_price:          fee_price,
fee_percent:        parseFloat(fee_percent),

clearance_price:    clearance_price,
clearance_percent:  parseFloat(clearance_percent),

converted_status:   converted_status,
converted:          converted
   -->
	<button id="external_calculate">
    <ul id="calculated_prices" class="disabled">
      <!-- <span id="close_prices"></span> -->

      <!-- Total Price -->
      <li id="total_price">
        <b>هزینه کل</b>
        <span class="price">
          <span class="p">1,000,000</span>
          <span id="toman_currency">تومان</span>
        </span>
      </li>

      <!-- Original Price -->
      <li id="original_price"> 
        <b>قیمت کالا </b>
        <span class="price">
          <span class="p">1,000,000</span>
          <span id="product_currency_tag">USD</span>
        </span>
      </li>

      <!-- Clearance Price -->
      <li id="clearance_price"> 
        <b>گمرک</b>
        <span class="price">
          <span class="p">1,000,000</span>
          <span id="clearance_percent">5%</span>
        </span>
      </li>

      <!-- Fee Price -->
      <li id="fee_price"> 
        <b>کارمزد</b>
        <span class="price">
          <span class="p">1,000,000</span>
          <span id="fee_percent">10%</span>
        </span>
      </li>

      <!-- Weight Price -->
      <li id="weight_price"> 
        <b>وزن</b>
        <span class="price">
          <span class="p">1,000,000</span>
          <span id="weight">10kg</span>
        </span>
      </li>
    </ul>

    <span class="icon"></span>
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
    <span>محاسبه قیمت</span>
  </button>
</div>
