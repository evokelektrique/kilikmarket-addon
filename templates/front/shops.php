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

      <!-- lush -->
      <a onclick="event.preventDefault()" href="<?= carbon_get_theme_option('km_external_iframe_page') . "?external=6" ?>">
        <span class="shopping_website_trigger" data-target="6" id="lush_website"></span>
      </a>

      <!-- virgin -->
      <a onclick="event.preventDefault()" href="<?= carbon_get_theme_option('km_external_iframe_page') . "?external=5" ?>">
        <span class="shopping_website_trigger" data-target="5" id="virgin_website"></span>
      </a>

      <!-- huawei -->
      <a onclick="event.preventDefault()" href="<?= carbon_get_theme_option('km_external_iframe_page') . "?external=4" ?>">
        <span class="shopping_website_trigger" data-target="4" id="huawei_website"></span>
      </a>

      <!-- aliexpress -->
      <a onclick="event.preventDefault()" href="<?= carbon_get_theme_option('km_external_iframe_page') . "?external=3" ?>">
        <span class="shopping_website_trigger" data-target="3" id="aliexpress_website"></span>
      </a>

      <!-- sixpm -->
      <a onclick="event.preventDefault()" href="<?= carbon_get_theme_option('km_external_iframe_page') . "?external=2" ?>">
        <span class="shopping_website_trigger" data-target="2" id="amazontr_website"></span>
      </a>

      <!-- amazonae -->
      <a onclick="event.preventDefault()" href="<?= carbon_get_theme_option('km_external_iframe_page') . "?external=1" ?>">
        <span class="shopping_website_trigger" data-target="1" id="amazonae_website"></span>
      </a>

      <!-- amazon -->
      <a onclick="event.preventDefault()" href="<?= carbon_get_theme_option('km_external_iframe_page') . "?external=0" ?>">
        <span class="shopping_website_trigger" data-target="0" id="amazon_website"></span>
      </a>
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
  <button id="exit_button_quick">
    <span>بازگشت به خانه</span>
  </button>

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
        <b>حمل و نقل</b>
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
