import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

var jQueryBridget = require('jquery-bridget');
var Isotope       = require('isotope-layout');
// make Isotope a jQuery plugin
jQueryBridget( 'isotope', Isotope, jQuery );

window.toastify = Toastify;

const api = new WooCommerceRestApi({
  url: 			      settings.base_url,
  consumerKey: 	  settings.wc_ck,
  consumerSecret: settings.wc_cs,
  version: 		    "wc/v3"
});

// TODO: Remove later
console.log(settings);









// /**
//  * Filters | Blog & Portfolio
//  */

// jQuery('.filters_buttons .open').on('click', function(e) {
//   e.preventDefault();
//   var type = $(this).closest('li').attr('class');

//   jQuery('.filters_wrapper').show(200);
//   jQuery('.filters_wrapper ul.' + type).show(200);
//   jQuery('.filters_wrapper ul:not(.' + type + ')').hide();
// });

// jQuery('.filters_wrapper .close a').on('click', function(e) {
//   e.preventDefault();
//   jQuery('.filters_wrapper').hide(200);
// });

// /**
//  * Portfolio List | Next v / Prev ^ buttons
//  */

// jQuery('.portfolio_next_js').on('click', function(e) {
//   e.preventDefault();

//   var item = $(this).closest('.portfolio-item').next();

//   if (item.length) {
//     jQuery('html, body').animate({
//       scrollTop: item.offset().top - fixStickyHeaderH()
//     }, 500);
//   }
// });

// // Portfolio - Isotope

// jQuery('.blog_wrapper .isotope:not( .masonry ), .portfolio_wrapper .isotope:not( .masonry-flat, .masonry-hover, .masonry-minimal )').isotope({
//   itemSelector: '.isotope-item',
//   layoutMode: 'fitRows',
//   isOriginLeft: true
// });

// // Portfolio - Masonry Flat

// jQuery('.portfolio_wrapper .masonry-flat').isotope({
//   itemSelector: '.isotope-item',
//   percentPosition: true,
//   masonry: {
//     columnWidth: 1
//   },
//   isOriginLeft: true
// });

// // Blog & Portfolio - Masonry

// jQuery('.isotope.masonry, .isotope.masonry-hover, .isotope.masonry-minimal').isotope({
//   itemSelector: '.isotope-item',
//   layoutMode: 'masonry',
//   isOriginLeft: true
// });

// // Portfolio | Active Category

// function portfolioActive() {
//   var el = jQuery('.filters_wrapper');
//   var active = el.attr('data-cat');

//   if (active) {
//     el.find('li.' + active).addClass('current-cat');
//     jQuery('.isotope').isotope({
//       filter: '.category-' + active
//     });
//   }
// }
// portfolioActive();


// jQuery('.grid').isotope({
//   // options
//   itemSelector: '.grid-item',
//   layoutMode: 'masonry',
//   isOriginLeft: false
// });

// jQuery('.isotope:not( .masonry )').isotope({
//   itemSelector: '.isotope-item',
//   layoutMode: 'fitRows',
//   isOriginLeft: false
// });

function portfolioActive() {
  var el = jQuery('.filters_wrapper');
  var active = el.attr('data-cat');

  if (active) {
    el.find('li.' + active).addClass('current-cat');
    jQuery('.isotope').isotope({
      filter: '.category-' + active
    });
  }
}
portfolioActive();


function isotopeFilter(domEl, isoWrapper) {

  var filter = domEl.attr('data-rel');
  isoWrapper.isotope({
    filter: filter,
    layoutMode: 'fitRows',
    isOriginLeft: false
  });

  setTimeout(function() {
    jQuery(window).trigger('resize');
  }, 50);

}
isotopeFilter(jQuery('li.current-cat'), jQuery('.isotope'));

jQuery('.filters_buttons').find('li.reset a').on('click', function(e) {
  e.preventDefault();

  jQuery('.filters_wrapper').find('li').removeClass('current-cat');
  isotopeFilter(jQuery(this), jQuery('.isotope'));
});

// Isotope | Fiters | Click ----------

jQuery('.isotope-filters .filters_wrapper').find('li:not(.close) a').on('click', function(e) {
  e.preventDefault();

  var isoWrapper = jQuery('.isotope'),
    filters = jQuery(this).closest('.isotope-filters'),
    parent = filters.attr('data-parent');

  if (parent) {
    parent = filters.closest('.' + parent);
    isoWrapper = parent.find('.isotope').first();
  }

  filters.find('li').removeClass('current-cat');
  jQuery(this).closest('li').addClass('current-cat');

  isotopeFilter(jQuery(this), isoWrapper);

  setTimeout(function() {
    jQuery(document).trigger('isotope:arrange');
  }, 500);
});






// Favorites
window.add_to_favorites = function(value) {
  // Add loading class to button
  document.getElementById("external_add_to_favorites").classList.add('loading');

  // Get the existing favorites data
  var favorites = localStorage.getItem('km_favorites');

  // If no favorites, create an array
  // Otherwise convert the localStorage string to an array
  favorites = favorites ? favorites.split(',') : [];

  // Remove Proxy Url
  if(value.includes(settings.origin_url)) {
    value = value.replace(settings.origin_url, "");
    value = value.substr(12);
  }

  // Remove Url Parameters
  var url = new URL(value);
  url.search = "";
  value = url.toString();

  // Add new data to localStorage Array
  favorites.push(value);

  // Save data into localStorage
  localStorage.setItem('km_favorites', favorites.toString());

  // Remove loading class of button
  document.getElementById("external_add_to_favorites").classList.remove('loading');
}

// Return an array of favorite items stored in localStorage
window.list_favorites = function() {
  // Get the existing favorites data
  var favorites = localStorage.getItem('km_favorites');

  // If no favorites, create an array
  // Otherwise convert the localStorage string to an array
  favorites = favorites ? favorites.split(',') : [];
  
  return favorites;  
}

window.clear_favorites = function() {
  localStorage.setItem('km_favorites', "");
}


// Inject function
function insertScript(doc, target, src, callback) {
  var s = doc.createElement("script");
  s.type = "text/javascript";
  if(callback) {
    if (s.readyState){  //IE
      s.onreadystatechange = function(){
        if (s.readyState == "loaded" ||
          s.readyState == "complete"){
          s.onreadystatechange = null;
        callback();
      }
    };
    } else {  //Others
      s.onload = function(){
        callback();
      };
    }
  }
  s.src = src;
  target.appendChild(s);        
}

function round_rates(rate) {
  var rounded = 0;
  if(rate<=1){
    rounded = rate.toFixed(8);
  } else if(rate<=10){
    rounded = rate.toFixed(3);
  } else if(rate<=100){
    rounded = rate.toFixed(2);
  } else {
    rounded = rate.toFixed(0);
    if (rounded>=1000){
      var num = rounded;
      rounded = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
  }
  return rounded;
};

// Price calculator
function calculate_price(product) {
  return new Promise(async (resolve, reject) => {

    console.log("KM_LOG: PRODUCT.PRICE:", product.price, product)

    var weight_status    = true;
    var shipment_price   = 0; // Shipment Price In USD
    var exchange_rate    = 0; // Exchange Rate In IRR
    var clearance_price  = 0;
    var clearance_percent= 0;
    var fee_price        = 0;
    var fee_percent      = 0;
    var converted        = 0; // Converted Product Price To USD
    var converted_status = false;
    var default_weight_status = false;
    // Calculate Shipment Price
    if(product.weight_to_kilogram) {
      if(product.weight_to_kilogram <= 0.5) {
        shipment_price = parseFloat(settings.km_clearance_price_1);
      } else if(product.weight_to_kilogram > 0.5 && product.weight_to_kilogram >= 1) {
        // Default price
        shipment_price = parseFloat(settings.km_clearance_price_2);
      } else if(product.weight_to_kilogram > 1 && product.weight_to_kilogram >= 2) {
        shipment_price = parseFloat(settings.km_clearance_price_3);
      } else if(product.weight_to_kilogram > 2 && product.weight_to_kilogram >= 3) {
        shipment_price = parseFloat(settings.km_clearance_price_4);
      } else if(product.weight_to_kilogram >= 3) {
        shipment_price = parseFloat(settings.km_clearance_price_5);
      }
    } else {
      // // weight_status = false;
      // Set Default Weight Price
      shipment_price = settings.km_clearance_price_2;
      default_weight_status = true;
    }

    console.log('KM_LOG: product currency:', product.currency)
    if(product.currency !== "USD") {
      converted_status = true;

      const response = await fetch(settings.ajaxurl, {
        method: "POST", 
        body: new URLSearchParams({
          action: "convert_currency", 
          from: product.currency, 
          to: "USD", 
          amount: parseFloat(product.price)
        })
      });
      // if(response.status !== 200) {
      //   console.log(e);
      //   Toastify({
      //     text: "?????????? ???? ???????? ???????????? ???????? ????????",
      //     duration: 8000,
      //     gravity: "bottom", // `top` or `bottom`
      //     position: "left", // `left`, `center` or `right`
      //     backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
      //   }).showToast();
      //   document.getElementById('external_calculate').classList.remove('loading');
      //   document.getElementById('external_add_to_cart').classList.remove('loading');
      // }
      const json = await response.json();
      console.log('converted prices response: ', json);
      // Round the price
      converted = round_rates(json.data.converted);
      exchange_rate = json.data.usd_to_irr;

    } else {
      // Fetch IRR Of USD
      const response = await fetch(settings.ajaxurl, {
        method: "POST", 
        body: new URLSearchParams({action: "get_currencies", currency_type: "USD"})
      });
      const json = await response.json();
      console.log("exchange rate price USD responses:", json, parseFloat(json.data.message.sell));
      exchange_rate = parseFloat(json.data.message.sell) // Sell Price
    }

    // Calculate Clearance Price
    if(converted_status) {
      if(converted <= 100) {
        clearance_price = (converted * settings.km_clearance_price_1) / 100
        clearance_percent = settings.km_clearance_price_1;
      } else if(100 < converted && converted <= 200) {
        clearance_price = (converted * settings.km_clearance_price_2) / 100
        clearance_percent = settings.km_clearance_price_2;
      } else if(200 < converted && converted <= 300)  {
        clearance_price = (converted * settings.km_clearance_price_3) / 100
        clearance_percent = settings.km_clearance_price_3;
      } else if(300 < converted && converted <= 500) {
        clearance_price = (converted * settings.km_clearance_price_4) / 100
        clearance_percent = settings.km_clearance_price_4;
      } else if(500 < converted) {
        clearance_price = (converted * settings.km_clearance_price_5) / 100
        clearance_percent = settings.km_clearance_price_5;
      }
    } else {
      if(parseFloat(product.price) <= 100) {
        clearance_price = (parseFloat(product.price) * settings.km_clearance_price_1) / 100
        clearance_percent = settings.km_clearance_price_1;
      } else if(100 < parseFloat(product.price) && parseFloat(product.price) <= 200) {
        clearance_price = (parseFloat(product.price) * settings.km_clearance_price_2) / 100
        clearance_percent = settings.km_clearance_price_2;
      } else if(200 < parseFloat(product.price) && parseFloat(product.price) <= 300)  {
        clearance_price = (parseFloat(product.price) * settings.km_clearance_price_3) / 100
        clearance_percent = settings.km_clearance_price_3;
      } else if(300 < parseFloat(product.price) && parseFloat(product.price) <= 500) {
        clearance_price = (parseFloat(product.price) * settings.km_clearance_price_4) / 100
        clearance_percent = settings.km_clearance_price_4;
      } else if(500 < parseFloat(product.price)) {
        clearance_price = (parseFloat(product.price) * settings.km_clearance_price_5) / 100
        clearance_percent = settings.km_clearance_price_5;
      }
    }  

    // Calculate Fee Price
    if(converted_status) {
      if(converted <= 100) {
        fee_price = (converted * settings.km_fee_price_1) / 100
        fee_percent = settings.km_fee_price_1;
      } else if(100 < converted && converted <= 200) {
        fee_price = (converted * settings.km_fee_price_2) / 100
        fee_percent = settings.km_fee_price_2;
      } else if(200 < converted && converted <= 300)  {
        fee_price = (converted * settings.km_fee_price_3) / 100
        fee_percent = settings.km_fee_price_3;
      } else if(300 < converted && converted <= 500) {
        fee_price = (converted * settings.km_fee_price_4) / 100
        fee_percent = settings.km_fee_price_4;
      } else if(500 < converted) {
        fee_price = (converted * settings.km_fee_price_5) / 100
        fee_percent = settings.km_fee_price_5;
      }
    } else {
      if(parseFloat(product.price) <= 100) {
        fee_price = (parseFloat(product.price) * settings.km_fee_price_1) / 100
        fee_percent = settings.km_fee_price_1;
      } else if(100 < parseFloat(product.price) && parseFloat(product.price) <= 200) {
        fee_price = (parseFloat(product.price) * settings.km_fee_price_2) / 100
        fee_percent = settings.km_fee_price_2;
      } else if(200 < parseFloat(product.price) && parseFloat(product.price) <= 300)  {
        fee_price = (parseFloat(product.price) * settings.km_fee_price_3) / 100
        fee_percent = settings.km_fee_price_3;
      } else if(300 < parseFloat(product.price) && parseFloat(product.price) <= 500) {
        fee_price = (parseFloat(product.price) * settings.km_fee_price_4) / 100
        fee_percent = settings.km_fee_price_4;
      } else if(500 < parseFloat(product.price)) {
        fee_price = (parseFloat(product.price) * settings.km_fee_price_5) / 100
        fee_percent = settings.km_fee_price_5;
      }
    }

    // Calculations Includes Weight => 1.price + 2.shipment + 3.clearance + 4.fee = total cost
    // Calculations Without Weight  => 1.price + 2.clearance + 3.fee              = total cost

    // Calculate Total Price In IRR
    var total_irr_product_price = 0;
    
    if(converted_status) {
      total_irr_product_price = (
        parseFloat(converted) + 
        parseFloat(shipment_price) + 
        clearance_price + 
        fee_price
      ) * exchange_rate;
    } else {
      total_irr_product_price = (
        parseFloat(product.price) + 
        parseFloat(shipment_price) + 
        clearance_price + 
        fee_price
      ) * exchange_rate;
    }

    resolve({
      total_price:        total_irr_product_price,

      weight_price:       parseFloat(shipment_price), // TODO: Change it from dashboard.
      weight_status:      weight_status,
      default_weight_status: default_weight_status,

      price:              exchange_rate,
      original_price:     product.price,

      fee_price:          fee_price,
      fee_percent:        parseFloat(fee_percent),

      clearance_price:    clearance_price,
      clearance_percent:  parseFloat(clearance_percent),

      converted_status:   converted_status,
      converted:          converted
    });

  });
}

// Close price popup event
if(document.getElementById('close_prices') !== null) {
  document.getElementById('close_prices').addEventListener('click', e => {
    document.getElementById("calculated_prices").classList.add('disabled');
  });
}

window.show_prices = function(prices, product) {
  console.log(prices, prices.weight_price, product);

  document.getElementById("calculated_prices").classList.remove('disabled');

  const total_price_el      = document.querySelector('#calculated_prices #total_price .price .p');
  const original_price_el   = document.querySelector('#calculated_prices #original_price .price .p');
  const clearance_price_el  = document.querySelector('#calculated_prices #clearance_price .price .p');
  const fee_price_el        = document.querySelector('#calculated_prices #fee_price .price .p');
  const weight_price_el     = document.querySelector('#calculated_prices #weight_price .price .p');

  total_price_el.innerText      = Number(parseInt(prices.total_price).toFixed(1)).toLocaleString();
  original_price_el.innerText   = prices.original_price;
  fee_price_el.innerText        = prices.fee_price;
  clearance_price_el.innerText  = prices.clearance_price;

  document.getElementById("product_currency_tag").innerText = product.currency;
  document.getElementById("clearance_percent").innerText    = `USD ${prices.clearance_percent}%`;
  document.getElementById("fee_percent").innerText          = `USD ${prices.fee_percent}%`;

  if(prices.default_weight_status) {
    document.getElementById("weight").innerText = "1 KG";
    document.querySelector("#weight_price .p").innerHTML = `${prices.weight_price} <small>(????????????)</small>`;
  } else {
	  if(prices.weight_status) {
	    document.getElementById("weight").innerText = "KG";
	    document.querySelector("#weight_price .p").innerText = prices.weight_price;
	  } else {
	    document.getElementById("weight").innerText = '';
	    document.querySelector("#weight_price .p").innerText = `???????????? ??????`;
	    document.querySelector("#weight_price .p").style.color = "red";
	  }
  }
}

// Close Calculated Price Event
window.addEventListener('click', e => {
  if(e.target != document.getElementById("calculated_prices") || e.target != document.getElementById("external_calculate")) {
    if(document.getElementById("calculated_prices") != null) {
      document.getElementById("calculated_prices").classList.add('disabled');
    }
  }
});

// Product Creation
async function create_product(product, price, categories) {
  console.log("KM_LOG: PRODUCT_PRICE: ", price)
  return new Promise(async (resolve, reject) => {
    if(!product.options_status) {
      reject({status: 0, message: "???????? ?????????? ?????????? ?????? ?????????? ???? ???????????? ????????"});
    }

    var image = "";
    // ReAlign Images
    if(typeof product.image !== "string") {
      image = Array.from(Object.keys(product.image))[0];
    } else {
      image = product.image;
    }
    // Remove Proxy Url From Image Url
    image = image.replace(settings.img_proxy_url, "")

    var title = product.title;
    var type  = 'simple';
    var catalog_visibility = 'hidden';
    var regular_price = price.toString();
    var description = product.description;
    var product_categories = [];
    // Iterate Through Categories
    if(categories !== [] && categories.length > 0) {
      categories.forEach(category => {
        product_categories.push({
          id: category.id
        });
      });
    }

    var calculated_prices = await calculate_price(product);
    // Product Insertion Data
    var data = {
      name: title,
      type: type,
      catalog_visibility: catalog_visibility,
      regular_price: regular_price,
      description: description,
      categories: product_categories,
      meta_data: [{
        key: 'km_product_options',
        value: JSON.stringify(product.options)
      }, {
        key: 'km_product_details',
        value: JSON.stringify({
          prices: calculated_prices,
          product: product
        })
      }],
      images: [
        {
          src: image
        }
      ]
    };

    // console.log('Product Options ', product.options, "Stringified ", JSON.stringify(product.options));
    // console.log("Product Categories", product_categories);
    console.log("Product", data);

    // Insert Product
    api.post("products", data).then((response) => {
      console.log("product created: ", response);
      resolve({data: response.data, status: 1});

    }).catch((error) => {
      console.log(error.response.data);
      reject({data: error.response.data, status: 0, message: "?????????? ???? ?????? ???????????? ???????? ????????" });
    });
  }); 
}

// async function get_cart() {
//   return new Promise(resolve => {
//     fetch(settings.ajaxurl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
//         },
//         body: 'action=get_cart'
//     }).then(response => response.json()).then(data => {
//       resolve(data);
//     });
//   });
// }

// Generates Categories By Given Product
async function create_product_categories(product) {
  return new Promise((resolve, reject) => {

    // Check If Categories Are Available
    if(product.categories !== [] && product.categories.length > 0) {
      // Define Categories Object To Assign Them After To Product
      var categories = [];
      // Define Parent Id And Change It After Inseting The First Category
      var parent_id = null;

      // Iterate Categories And Insert Them Into Database
      for(var index = 0, length = product.categories.length; index < length; index++) {
        console.log("Length", product.categories.length, "Index", index);
      // product.categories.forEach((category, index) => {

        // Define Category Object
        var data = {
          name: product.categories[index],
        };

        // Set/Change Parent Id
        if(parent_id !== null) {
          data.parent_id = parent_id;
        }

        // Insert
        api.post("products/categories", data).then((response) => {
          console.log("Category: ", response.data);
          categories.push(response.data);

          // Change Parent Category
          if(index > 0) {
            parent_id = response.data.id;
          }

          // Resolve The Result 
          if(product.categories.length === index) {
            console.log('Resolved, [Categories_Length, Index]', [product.categories.length, index]);
            resolve({message: "All Categories Inserted", categories: categories});
          } else {
            console.log('Nor resolved, [Categories_Length, Index]', [product.categories.length, index]);
          }
        });
      };
    }

  });
}

async function add_to_cart(product_id) {
  return new Promise(resolve => {
    var url = `${settings.base_url}/?post_type=product&add-to-cart=${product_id}`
    fetch(url).then(response => response.text()).then(data => {
      jQuery( document.body ).trigger( 'wc_fragment_refresh' );
      resolve(data);
    });
  });
}

// 
// Phase 1: Shopping Websites Iframes Trigger Events
// 
Array.from(document.getElementsByClassName("shopping_website_trigger")).forEach(element => {
  element.addEventListener('click', event => {
    var _this = event.target;
    console.log(_this);

    // Add Activate Class To Trigger Button
    Array.from(document.getElementsByClassName("shopping_website_trigger")).forEach(trigger_button => {
      trigger_button.classList.remove('activate');
    });
    _this.classList.add('activate');

    // Change Shopping Websites Container Style
    var shopping_container = document.getElementById("shopping_website_container");
    shopping_container.classList.add('activate');

    // Change Body Overflow Style
    document.body.classList.add('overflow-y-hidden');

    document.getElementById('iframe_container').style.display = 'block';
    
    // Shopping Websites Exit Button Event
    document.getElementById("exit_button_quick").addEventListener('click', e => {
      document.body.classList.remove('overflow-y-hidden');
      shopping_container.classList.remove('activate');
      document.getElementById('loading_iframe').style.display = 'none';
      document.getElementById('iframe_container').style.display = 'none';
      window.location = settings.base_url;
      return;
    });
    document.getElementById("exit_button").addEventListener('click', e => {
      document.body.classList.remove('overflow-y-hidden');
      shopping_container.classList.remove('activate');
      document.getElementById('loading_iframe').style.display = 'none';
      document.getElementById('iframe_container').style.display = 'none';
      return;
    });

    // Select Iframe Container
    var container = document.getElementById("iframe_container"); 
    // First Empty(Remove Any HTML) The Container
    if(container) container.innerHTML = null; 
    // Make sure to hide the add to cart button
    document.getElementById('external_add_to_cart_container').style.display = 'none';
    document.getElementById('loading_iframe').style.display = 'block';

    // Iframe Variations:
    //  0: Amazon
    //  1: AmazonAE
    //  2: AmazonTR
    //  3: AliExpress
    //  4: Huawei
    //  5: Virgin
    //  6: Lush
    var iframe_variation  = parseInt(_this.dataset.target);
    var iframe_variations = {
      // Custom means it's amazon or dedicated
      0: {url: "https://amazon.com", name: "amazon", custom: true},
      1: {url: "https://www.amazon.ae", name: "amazonae", custom: true},
      2: {url: "https://www.amazon.com.tr", name: "amazontr", custom: true},
      3: {url: "https://www.aliexpress.com/category/100003070/men-clothing.html", name: "aliexpress", custom: false},
      4: {url: "https://shop.huawei.com/ae-en/", name: 'huawei', custom: false},
      5: {url: "https://www.virginmegastore.ae/", name: 'virgin', custom: false},
      6: {url: "https://mena.lush.com/", name: 'lush', custom: false},
    };
    var iframe_base_url = iframe_variations[iframe_variation].url;
    var iframe_name     = iframe_variations[iframe_variation].name;
    var custom          = iframe_variations[iframe_variation].custom;

    // Create Iframe Element Based On Event's Dataset Target
    var iframe = document.createElement('iframe');
    // Define iframe properties
    iframe.id           = "km_iframe";
    if(custom) {
      iframe.src = `${settings.origin_url}?type=${iframe_variation}&url=${iframe_base_url}`;
    } else {
    //   iframe.src = `${iframe_base_url}`;
    //   iframe.setAttribute("is", "x-frame-bypass");
      document.getElementById('loading_iframe').style.display = 'none';
    }
    iframe.width        = "100%";
    iframe.height       = "600";
    iframe.style.border = "0";

    // Add Onload Event
    iframe.onload = async e => {
      var _this = e.target;
      var doc   = _this.contentWindow.document;
      var head  = doc.getElementsByTagName('head')[0];

      // Inject Settings Into Iframe Window
      _this.contentWindow.km_settings = settings;
      _this.contentWindow.iframe_properties = {
        type: iframe_variation,
        variation: iframe_variations[iframe_variation]
      };

      insertScript(doc, head, settings.plugin_dir + `assets/js/${iframe_name}_inject.js`);

      // Add to cart button event
      document.getElementById('external_add_to_cart').addEventListener('click', async e => {
        // Add Loading Class To Button
        document.getElementById('external_add_to_cart').classList.add('loading');


        // Fetch Product Information From Iframe
        if(_this.contentWindow === null) {
          location.reload();
          // return false;
        }
        var product = _this.contentWindow.km_get_product();
        console.log("Product: ", product);

        // Check If Product Available
        if(product.status > 0) {
          // Calculate And Covert Price
          var prices = await calculate_price(product);
          console.log("Prices:", prices);
          // e.target.innerHTML += ` Price: ${prices.total_price}`;

          // // Create Categories
          // var categories = await create_product_categories(product) || [];
          // console.log('categories created so far: ', categories);

          // Create Product ( With No Categories )
          create_product(product, prices.total_price, []).then(response => {
            console.log('Trying to add to card the product: ', response.data);
            add_to_cart(response.data.id).then(data => {
              console.log('Added To Cart Product_ID: ', response.data.id);

              // Remove Loading Class To Button
              document.getElementById('external_add_to_cart').classList.remove('loading');

              // Add to cart Notification
              Toastify({
                text: "???????? ???? ???????????? ?????????? ?????? ?????? ?????????? ???????? ?????????? ???????? ????????",
                duration: 8000,
                destination: settings.wc_cart_url,
                newWindow: true,
                close: true,
                gravity: "bottom", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                stopOnFocus: true, // Prevents dismissing of toast on hover
                onClick: function(){} // Callback after click
              }).showToast();
            });
          }).catch(error => {
            console.log(error);
            if(error.status === 0) {
              Toastify({
                text: error.message,
                duration: 8000,
                gravity: "bottom", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
              }).showToast();
            }
          });

        } else {
          // e.target.innerHTML += ` No Product Found`;
          Toastify({
            text: "???????????? ???????? ???????? ???????? ???????????? ???????? ????????",
            duration: 8000,
            gravity: "bottom", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
          }).showToast();
          document.getElementById('external_add_to_cart').classList.remove('loading');
        }
      }, false);

      // Calculate Price
      document.getElementById('external_calculate').addEventListener('click', async e => {

        e.preventDefault();

        document.getElementById('external_calculate').classList.add('loading');
        const product = document.getElementById('km_iframe').contentWindow.km_get_product();

        if(product.status > 0) {
          console.log('KM_LOG: calculate product:', product)
          try {
            const prices = await calculate_price(product);
            show_prices(prices, product);
          } catch(e) {
            Toastify({
              text: "?????????? ???? ?????? ???????????? ????????",
              duration: 8000,
              gravity: "bottom", // `top` or `bottom`
              position: "left", // `left`, `center` or `right`
              backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            }).showToast();
            document.getElementById('external_calculate').classList.remove('loading');
          }
        }

        document.getElementById('external_calculate').classList.remove('loading');

      });

      // Add to favorites button event
      document.getElementById("external_add_to_favorites").addEventListener('click', e => {
        var url = document.getElementById('km_iframe').contentWindow.get_current_url();
        add_to_favorites(url);
        Toastify({
          text: "???? ???????????? ?????????? ?????? ???????? ?????????? ???????? ???? ???????? ????????",
          duration: 8000,
          destination: settings.favorites_page_url,
          newWindow: true,
          close: true,
          gravity: "bottom", // `top` or `bottom`
          position: "left", // `left`, `center` or `right`
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          stopOnFocus: true, // Prevents dismissing of toast on hover
          onClick: function(){} // Callback after click
        }).showToast();
      })      

      // Display the add to cart button
      document.getElementById('external_add_to_cart_container').style.display = 'block'; 
    };

    window.add_to_cart_status = false;
    // 
    // CUSTOM BYPASS
    // 
    if(custom) {
      // Append Iframe to container
      container.appendChild(iframe);
      window.add_to_cart_status = true;
    } else { 
      // 
      // CORS BYPASS
      // 
      container.innerHTML = `<iframe id="km_iframe" src="${iframe_base_url}" is="x-frame-bypass" width="100%" height="600"></iframe>`;
      // Add Onload Event
      document.getElementById('km_iframe').onload = (e) => {
        var _this_bypass_frame = e.target;
        var doc_bypass_frame   = _this_bypass_frame.contentWindow.document;
        var head_bypass_frame  = doc_bypass_frame.getElementsByTagName('head')[0];

        var inject_settings_interval = setInterval( () => {
          if(_this_bypass_frame.contentWindow !== null) {
            // Inject Settings Into Iframe Window
            _this_bypass_frame.contentWindow.km_settings = settings;
            _this_bypass_frame.contentWindow.iframe_properties = {
              type: iframe_variation,
              variation: iframe_variations[iframe_variation]
            };
          }
        }, 1000);

        // insertScript(doc_bypass_frame, head_bypass_frame, settings.plugin_dir + `assets/js/${iframe_name}_inject.js`);

        window.add_to_cart_status = true;

        // Display the add to cart button
        document.getElementById('external_add_to_cart_container').style.display = 'block'; 
      };
    
      // Add to cart button event
      document.getElementById('external_add_to_cart').addEventListener('click', async e => {
        if(window.add_to_cart_status) {

          // Add Loading Class To Button
          document.getElementById('external_add_to_cart').classList.add('loading');

          var product = document.getElementById('km_iframe').contentWindow.km_get_product();
          console.log("Product: ", product);

          // Check If Product Available
          if(product.status > 0) {
            // Calculate And Convert Price
            var prices = await calculate_price(product);
            console.log("Prices:", prices);

            // // Create Categories
            // var categories = await create_product_categories(product) || [];
            // console.log('categories created so far: ', categories);

            // Create Product ( With No Categories )
            create_product(product, prices.total_price, []).then(response => {
              console.log('Trying to add to card the product: ', response.data);
              add_to_cart(response.data.id).then(data => {
                console.log('Added To Cart Product_ID: ', response.data.id);

                // Remove Loading Class To Button
                document.getElementById('external_add_to_cart').classList.remove('loading');

                // Add to cart notification
                Toastify({
                  text: "???????? ???? ???????????? ?????????? ?????? ?????? ?????????? ???????? ?????????? ???????? ????????",
                  duration: 8000,
                  destination: settings.wc_cart_url,
                  newWindow: true,
                  close: true,
                  gravity: "bottom", // `top` or `bottom`
                  position: "left", // `left`, `center` or `right`
                  backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                  stopOnFocus: true, // Prevents dismissing of toast on hover
                  onClick: function(){} // Callback after click
                }).showToast();
              });
            }).catch(error => {
              console.log("KM_LOG: ERROR:", error);
              if(error.status === 0) {
                Toastify({
                  text: error.message,
                  duration: 8000,
                  gravity: "bottom", // `top` or `bottom`
                  position: "left", // `left`, `center` or `right`
                  backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
                }).showToast();
              }
            });

          } else {
            // No Product Found (STATUS: 0)
            Toastify({
              text: "???????????? ???????? ???????? ???????? ???????????? ???????? ????????",
              duration: 8000,
              gravity: "bottom", // `top` or `bottom`
              position: "left", // `left`, `center` or `right`
              backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            }).showToast();
            document.getElementById('external_add_to_cart').classList.remove('loading');
          }
        } else {
          console.log("KM_LOG: add to cart not ready yet.")
        }
      }, false);

      // Calculate Price
      document.getElementById('external_calculate').addEventListener('click', async e => {

        e.preventDefault();

        document.getElementById('external_calculate').classList.add('loading');
        const product = document.getElementById('km_iframe').contentWindow.km_get_product();

        if(product.status > 0) {
          console.log('KM_LOG: calculate product:', product)
          try {
            const prices = await calculate_price(product);
            show_prices(prices, product);
          } catch(e) {
            Toastify({
              text: "?????????? ???? ?????? ???????????? ????????",
              duration: 8000,
              gravity: "bottom", // `top` or `bottom`
              position: "left", // `left`, `center` or `right`
              backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            }).showToast();
            document.getElementById('external_calculate').classList.remove('loading');
          }
        }

        document.getElementById('external_calculate').classList.remove('loading');

      });

      // Add to favorites button event
      document.getElementById("external_add_to_favorites").addEventListener('click', e => {
        var url = document.getElementById('km_iframe').contentWindow.get_current_url();
        add_to_favorites(url.toString());
        Toastify({
          text: "???? ?????????? ???? ???????? ?????????? ???????? ???? ?????????? ????.?? ???????? ?????????? ???????? '?????????? ???????? ????' ???????? ????????.",
          duration: 8000,
          destination: settings.favorites_page_url,
          newWindow: true,
          close: true,
          gravity: "bottom", // `top` or `bottom`
          position: "left", // `left`, `center` or `right`
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          stopOnFocus: true, // Prevents dismissing of toast on hover
          onClick: function(){} // Callback after click
        }).showToast();
      
      });

      
    }
  });
});



// 
// Phase 2: Shopping Websites Form Trigger Event
// 
var shops_form_address; // Form Input Text
window.shops_form_variation = null;
// Default Shops Form Submit Icon
const shops_button_icon_default = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z"/></svg>`;

// Default Valid Websites 
const shops_form_websites = [
  'amazon.com',
  'www.amazon.com',

  'amazon.ae',
  'www.amazon.ae',

  'amazon.com.tr',
  'www.amazon.com.tr',

  'aliexpress.com',
  'www.aliexpress.com',

  'huawei.com',
  'shop.huawei.com',
  'www.shop.huawei.com',

  'www.virginmegastore.ae',
  'virginmegastore.ae',

  'www.mena.lush.com',
  'mena.lush.com',
];


// Default Global Form Validation
window.shops_form_validate = false;

// Validate Input Page Address
if(document.getElementById("shops_form_address") !== null) {  
  document.getElementById("shops_form_address").oninput = (e) => {
    shops_form_address = document.getElementById("shops_form_address").value;
    // Toggle Input Border Color
    if(shops_form_address == "") {
      document.getElementById('shops_form_address').classList.add("red-border");
      document.querySelector('#shops_form_submit svg').style.fill = '#f44336';
    }


    // If website exists
    try {
      const input_parse_url = new URL(shops_form_address);
      if(input_parse_url.host !== "" && shops_form_websites.includes(input_parse_url.host)) {
        document.getElementById('shops_form_address').classList.add("green-border");
        document.querySelector('#shops_form_submit svg').style.fill = '#8bc34a';
        document.getElementById('shops_form_address').classList.remove("red-border");
        console.log(input_parse_url);
      
        // Iframe Variations:
        //  0: Amazon
        //  1: AmazonAE
        //  2: AmazonTR
        //  3: AliExpress
        //  4: Huawei
        //  5: Virgin
        //  6: Lush
        if(['amazon.com', 'www.amazon.com'].includes(input_parse_url.host)) {
          shops_form_variation = 0;
        }

        if(['amazon.ae', 'www.amazon.ae'].includes(input_parse_url.host)) {
          shops_form_variation = 1;
        }

        if(['amazon.com.tr', 'www.amazon.com.tr'].includes(input_parse_url.host)) {
          shops_form_variation = 2;
        }

        if(['aliexpress.com', 'www.aliexpress.com'].includes(input_parse_url.host)) {
          shops_form_variation = 3;
        }

        if(['shop.huawei.com', 'www.shop.huawei.com', 'huawei.com'].includes(input_parse_url.host)) {
          shops_form_variation = 4;
        }

        if(['virginmegastore.ae', 'www.virginmegastore.ae'].includes(input_parse_url.host)) {
          shops_form_variation = 5;
        }

        if(['mena.lush.com', 'www.mena.lush.com'].includes(input_parse_url.host)) {
          shops_form_variation = 6;
        }

        window.shops_form_validate = true;
      } else {
        document.getElementById('shops_form_address').classList.add("red-border");
        document.querySelector('#shops_form_submit svg').style.fill = '#f44336';
        document.getElementById('shops_form_address').classList.remove("green-border");
        window.shops_form_validate = false;
      }
    } catch(e) {
      console.log(e);
      document.getElementById('shops_form_address').classList.add("red-border");
      document.querySelector('#shops_form_submit svg').style.fill = '#f44336';
      document.getElementById('shops_form_address').classList.remove("green-border");
    }
  };
}


// Form Submit Event
if(document.getElementById("shops_form") !== null) {
  document.getElementById("shops_form").addEventListener('submit', e => {
    e.preventDefault();
    if(window.shops_form_validate) {
      console.log(shops_form_variation);
      document.getElementById('iframe_container').style.display = 'block';


      // Change Shopping Websites Container Style
      var shopping_container = document.getElementById("shopping_website_container");
      shopping_container.classList.add('activate');

      // Change Body Overflow Style
      document.body.classList.add('overflow-y-hidden');

      // Shopping Websites Exit Button Event
      document.getElementById("exit_button_quick").addEventListener('click', e => {
        document.body.classList.remove('overflow-y-hidden');
        shopping_container.classList.remove('activate');
        document.getElementById('loading_iframe').style.display = 'none';
        document.getElementById('iframe_container').style.display = 'none';
        window.location = settings.base_url;
        return;
      });
      document.getElementById("exit_button").addEventListener('click', e => {
        document.body.classList.remove('overflow-y-hidden');
        shopping_container.classList.remove('activate');
        document.getElementById('loading_iframe').style.display = 'none';
        document.getElementById('iframe_container').style.display = 'none';
        return;
      });

      // Select Iframe Container
      var container = document.getElementById("iframe_container"); 
      // First Empty(Remove Any HTML) The Container
      if(container) container.innerHTML = null; 
      // Make sure to hide the add to cart button
      document.getElementById('external_add_to_cart_container').style.display = 'none';
      document.getElementById('loading_iframe').style.display = 'block';

      // Iframe Variations:
      //  0: Amazon
      //  1: AmazonAE
      //  2: AmazonTR
      //  3: AliExpress
      //  4: Huawei
      //  5: Virgin
      //  6: Lush
      var iframe_variations = {
        // Custom means it's amazon or dedicated
        0: {url: "https://amazon.com", name: "amazon", custom: true},
        1: {url: "https://www.amazon.ae", name: "amazonae", custom: true},
        2: {url: "https://www.amazon.com.tr", name: "amazontr", custom: true},
        3: {url: "https://www.aliexpress.com/category/100003070/men-clothing.html", name: "aliexpress", custom: false},
        4: {url: "https://shop.huawei.com/ae-en/", name: 'huawei', custom: false},
        5: {url: "https://www.virginmegastore.ae/", name: 'virgin', custom: false},
        6: {url: "https://mena.lush.com/", name: 'lush', custom: false},
      };

      var iframe_base_url = iframe_variations[shops_form_variation].url;
      var iframe_name     = iframe_variations[shops_form_variation].name;
      var custom          = iframe_variations[shops_form_variation].custom;

      // Add Activate Class To Trigger Button
      Array.from(document.getElementsByClassName("shopping_website_trigger")).forEach(trigger_button => {
        trigger_button.classList.remove('activate');
      });
      document.querySelector(".shopping_websites #" + iframe_name + "_website").classList.add('activate');

      // Create Iframe Element Based On Event's Dataset Target
      var iframe = document.createElement('iframe');
      // Define iframe properties
      iframe.id           = "km_iframe";
      if(custom) {
        iframe.src = `${settings.origin_url}?type=${shops_form_variation}&url=${document.getElementById("shops_form_address").value}`;
      } else {
      //   iframe.src = `${iframe_base_url}`;
      //   iframe.setAttribute("is", "x-frame-bypass");
        document.getElementById('loading_iframe').style.display = 'none';
      }
      iframe.width        = "100%";
      iframe.height       = "600";
      iframe.style.border = "0";

      console.log(iframe_variations[shops_form_variation])

      // Add Onload Event
      iframe.onload = (e) => {
        console.log('loaded');
        var _this = e.target;
        var doc   = _this.contentWindow.document;
        var head  = doc.getElementsByTagName('head')[0];

        // Inject Settings Into Iframe Window
        _this.contentWindow.km_settings = settings;
        _this.contentWindow.iframe_properties = {
          type: shops_form_variation,
          variation: iframe_variations[shops_form_variation]
        };

        insertScript(doc, head, settings.plugin_dir + `assets/js/${iframe_name}_inject.js`);
        console.log('injected');

        // Add to cart button event
        document.getElementById('external_add_to_cart').addEventListener('click', async e => {
          // Add Loading Class To Button
          document.getElementById('external_add_to_cart').classList.add('loading');

          // Fetch Product Information From Iframe
          if(_this.contentWindow === null) {
            location.reload();
            // return false;
          }
          var product = _this.contentWindow.km_get_product();
          console.log("Product: ", product);

          // Check If Product Available
          if(product.status > 0) {
            // Calculate And Covert Price
            var prices = await calculate_price(product);
            console.log("Prices:", prices);
            // e.target.innerHTML += ` Price: ${prices.total_price}`;

            // // Create Categories
            // var categories = await create_product_categories(product) || [];
            // console.log('categories created so far: ', categories);

            // Create Product ( With No Categories )
            create_product(product, prices.total_price, []).then(response => {
              console.log('Trying to add to card the product: ', response.data);
              add_to_cart(response.data.id).then(data => {
                console.log('Added To Cart Product_ID: ', response.data.id);
                // Remove Loading Class To Button
                document.getElementById('external_add_to_cart').classList.remove('loading');

                // Add to cart Notification
                Toastify({
                  text: "???????? ???? ???????????? ?????????? ?????? ?????? ?????????? ???????? ?????????? ???????? ????????",
                  duration: 8000,
                  destination: settings.wc_cart_url,
                  newWindow: true,
                  close: true,
                  gravity: "bottom", // `top` or `bottom`
                  position: "left", // `left`, `center` or `right`
                  backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                  stopOnFocus: true, // Prevents dismissing of toast on hover
                  onClick: function(){} // Callback after click
                }).showToast();
              });
            }).catch(error => {
              console.log(error);
              if(error.status === 0) {
                Toastify({
                  text: error.message,
                  duration: 8000,
                  gravity: "bottom", // `top` or `bottom`
                  position: "left", // `left`, `center` or `right`
                  backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
                }).showToast();
              }
            });

          } else {
            // e.target.innerHTML += ` No Product Found`;
            Toastify({
              text: "???????????? ???????? ???????? ???????? ???????????? ???????? ????????",
              duration: 8000,
              gravity: "bottom", // `top` or `bottom`
              position: "left", // `left`, `center` or `right`
              backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            }).showToast();
            document.getElementById('external_add_to_cart').classList.remove('loading');
          }
        }, false);

        // Calculate Price
        document.getElementById('external_calculate').addEventListener('click', async e => {

          e.preventDefault();

          document.getElementById('external_calculate').classList.add('loading');
          const product = document.getElementById('km_iframe').contentWindow.km_get_product();

          if(product.status > 0) {
            console.log('KM_LOG: calculate product:', product)
            try {
              const prices = await calculate_price(product);
              show_prices(prices, product);
            } catch(e) {
              Toastify({
                text: "?????????? ???? ?????? ???????????? ????????",
                duration: 8000,
                gravity: "bottom", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
              }).showToast();
                        document.getElementById('external_calculate').classList.remove('loading');
            }
          }

          document.getElementById('external_calculate').classList.remove('loading');

        });

        // Add to favorites button event
        document.getElementById("external_add_to_favorites").addEventListener('click', e => {
          var url = document.getElementById('km_iframe').contentWindow.get_current_url();
          add_to_favorites(url);
          Toastify({
            text: "???? ???????????? ?????????? ?????? ???????? ?????????? ???????? ???? ???????? ????????",
            duration: 8000,
            destination: settings.favorites_page_url,
            newWindow: true,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function(){} // Callback after click
          }).showToast();
        })      

        // Display the add to cart button
        document.getElementById('external_add_to_cart_container').style.display = 'block'; 
      };

      window.add_to_cart_status = false;
      // 
      // CUSTOM BYPASS
      // 
      if(custom) {
        // Append Iframe to container
        container.appendChild(iframe);
        window.add_to_cart_status = true;
      } else { 
        // 
        // CORS BYPASS
        // 
        container.innerHTML = `<iframe id="km_iframe" src="${document.getElementById("shops_form_address").value}" is="x-frame-bypass" width="100%" height="600"></iframe>`;
        // Add Onload Event
        document.getElementById('km_iframe').onload = (e) => {
          var _this_bypass_frame = e.target;
          var doc_bypass_frame   = _this_bypass_frame.contentWindow.document;
          var head_bypass_frame  = doc_bypass_frame.getElementsByTagName('head')[0];

          var inject_settings_interval = setInterval( () => {
            // Inject Settings Into Iframe Window
            if(_this_bypass_frame.contentWindow !== null) {
              _this_bypass_frame.contentWindow.km_settings = settings;
              _this_bypass_frame.contentWindow.iframe_properties = {
                type: shops_form_variation,
                variation: iframe_variations[shops_form_variation]
              };
            }
          }, 1000);

          // insertScript(doc_bypass_frame, head_bypass_frame, settings.plugin_dir + `assets/js/${iframe_name}_inject.js`);

          window.add_to_cart_status = true;

          // Display the add to cart button
          document.getElementById('external_add_to_cart_container').style.display = 'block'; 
        };
      
        // Add to cart button event
        document.getElementById('external_add_to_cart').addEventListener('click', async e => {
          if(window.add_to_cart_status) {

            // Add Loading Class To Button
            document.getElementById('external_add_to_cart').classList.add('loading');

            var product = document.getElementById('km_iframe').contentWindow.km_get_product();
            console.log("Product: ", product);

            // Check If Product Available
            if(product.status > 0) {
              // Calculate And Convert Price
              var prices = await calculate_price(product);
              console.log("Prices:", prices);

              // // Create Categories
              // var categories = await create_product_categories(product) || [];
              // console.log('categories created so far: ', categories);

              // Create Product ( With No Categories )
              create_product(product, prices.total_price, []).then(response => {
                console.log('Trying to add to card the product: ', response.data);
                add_to_cart(response.data.id).then(data => {
                  console.log('Added To Cart Product_ID: ', response.data.id);

                  // Remove Loading Class To Button
                  document.getElementById('external_add_to_cart').classList.remove('loading');

                  // Add to cart notification
                  Toastify({
                    text: "???????? ???? ???????????? ?????????? ?????? ?????? ?????????? ???????? ?????????? ???????? ????????",
                    duration: 8000,
                    destination: settings.wc_cart_url,
                    newWindow: true,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    onClick: function(){} // Callback after click
                  }).showToast();
                });
              }).catch(error => {
                console.log("KM_LOG: ERROR:", error);
                if(error.status === 0) {
                  Toastify({
                    text: error.message,
                    duration: 8000,
                    gravity: "bottom", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
                  }).showToast();
                }
              });

            } else {
              // No Product Found (STATUS: 0)
              Toastify({
                text: "???????????? ???????? ???????? ???????? ???????????? ???????? ????????",
                duration: 8000,
                gravity: "bottom", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
              }).showToast();
              document.getElementById('external_add_to_cart').classList.remove('loading');
            }
          } else {
            console.log("KM_LOG: add to cart not ready yet.")
          }
        }, false);

        // Calculate Price
        document.getElementById('external_calculate').addEventListener('click', async e => {

          e.preventDefault();

          document.getElementById('external_calculate').classList.add('loading');
          const product = document.getElementById('km_iframe').contentWindow.km_get_product();

          if(product.status > 0) {
            console.log('KM_LOG: calculate product:', product)
            try {
              const prices = await calculate_price(product);
              show_prices(prices, product);
            } catch(e) {
              Toastify({
                text: "?????????? ???? ?????? ???????????? ????????",
                duration: 8000,
                gravity: "bottom", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
              }).showToast();
              document.getElementById('external_calculate').classList.remove('loading');
            }
          }

          document.getElementById('external_calculate').classList.remove('loading');

        });

        // Add to favorites button event
        document.getElementById("external_add_to_favorites").addEventListener('click', e => {
          var url = document.getElementById('km_iframe').contentWindow.get_current_url();
          add_to_favorites(url.toString());
          Toastify({
            text: "???? ?????????? ???? ???????? ?????????? ???????? ???? ?????????? ????.?? ???????? ?????????? ???????? '?????????? ???????? ????' ???????? ????????.",
            duration: 8000,
            destination: settings.favorites_page_url,
            newWindow: true,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function(){} // Callback after click
          }).showToast();
        
        });
      }

    } else {
      Toastify({
        text: "???????? ???? ??????????",
        duration: 8000,
        gravity: "bottom", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
      }).showToast();
    }
  });
}



// 
// Phase 3: Open In New Tab
// 
var variation = parseInt(window.location.search.split('=')[1])
if(variation) {
// Array.from(document.getElementsByClassName("shopping_website_trigger")).forEach(element => {
  // element.addEventListener('click', event => {
    var _this = document.querySelector(`[data-target='${variation}']`);
    console.log(_this);

    // Add Activate Class To Trigger Button
    Array.from(document.getElementsByClassName("shopping_website_trigger")).forEach(trigger_button => {
      trigger_button.classList.remove('activate');
    });
    _this.classList.add('activate');

    // Change Shopping Websites Container Style
    var shopping_container = document.getElementById("shopping_website_container");
    shopping_container.classList.add('activate');

    // Change Body Overflow Style
    document.body.classList.add('overflow-y-hidden');

    document.getElementById('iframe_container').style.display = 'block';
    
    // Shopping Websites Exit Button Event
    document.getElementById("exit_button_quick").addEventListener('click', e => {
      document.body.classList.remove('overflow-y-hidden');
      shopping_container.classList.remove('activate');
      document.getElementById('loading_iframe').style.display = 'none';
      document.getElementById('iframe_container').style.display = 'none';
      window.location = settings.base_url;
      return;
    });
    document.getElementById("exit_button").addEventListener('click', e => {
      document.body.classList.remove('overflow-y-hidden');
      shopping_container.classList.remove('activate');
      document.getElementById('loading_iframe').style.display = 'none';
      document.getElementById('iframe_container').style.display = 'none';
      return;
    });

    // Select Iframe Container
    var container = document.getElementById("iframe_container"); 
    // First Empty(Remove Any HTML) The Container
    if(container) container.innerHTML = null; 
    // Make sure to hide the add to cart button
    document.getElementById('external_add_to_cart_container').style.display = 'none';
    document.getElementById('loading_iframe').style.display = 'block';

    // Iframe Variations:
    //  0: Amazon
    //  1: AmazonAE
    //  2: AmazonTR
    //  3: AliExpress
    //  4: Huawei
    //  5: Virgin
    //  6: Lush
    var iframe_variation  = parseInt(_this.dataset.target);
    var iframe_variations = {
      // Custom means it's amazon or dedicated
      0: {url: "https://amazon.com", name: "amazon", custom: true},
      1: {url: "https://www.amazon.ae", name: "amazonae", custom: true},
      2: {url: "https://www.amazon.com.tr", name: "amazontr", custom: true},
      3: {url: "https://www.aliexpress.com/category/100003070/men-clothing.html", name: "aliexpress", custom: false},
      4: {url: "https://shop.huawei.com/ae-en/", name: 'huawei', custom: false},
      5: {url: "https://www.virginmegastore.ae/", name: 'virgin', custom: false},
      6: {url: "https://mena.lush.com/", name: 'lush', custom: false},
    };
    var iframe_base_url = iframe_variations[iframe_variation].url;
    var iframe_name     = iframe_variations[iframe_variation].name;
    var custom          = iframe_variations[iframe_variation].custom;

    // Create Iframe Element Based On Event's Dataset Target
    var iframe = document.createElement('iframe');
    // Define iframe properties
    iframe.id           = "km_iframe";
    if(custom) {
      iframe.src = `${settings.origin_url}?type=${iframe_variation}&url=${iframe_base_url}`;
    } else {
    //   iframe.src = `${iframe_base_url}`;
    //   iframe.setAttribute("is", "x-frame-bypass");
      document.getElementById('loading_iframe').style.display = 'none';
    }
    iframe.width        = "100%";
    iframe.height       = "600";
    iframe.style.border = "0";

    // Add Onload Event
    iframe.onload = async e => {
      var _this = e.target;
      var doc   = _this.contentWindow.document;
      var head  = doc.getElementsByTagName('head')[0];

      // Inject Settings Into Iframe Window
      _this.contentWindow.km_settings = settings;
      _this.contentWindow.iframe_properties = {
        type: iframe_variation,
        variation: iframe_variations[iframe_variation]
      };

      insertScript(doc, head, settings.plugin_dir + `assets/js/${iframe_name}_inject.js`);

      // Add to cart button event
      document.getElementById('external_add_to_cart').addEventListener('click', async e => {
        // Add Loading Class To Button
        document.getElementById('external_add_to_cart').classList.add('loading');


        // Fetch Product Information From Iframe
        if(_this.contentWindow === null) {
          location.reload();
          // return false;
        }
        var product = _this.contentWindow.km_get_product();
        console.log("Product: ", product);

        // Check If Product Available
        if(product.status > 0) {
          // Calculate And Covert Price
          var prices = await calculate_price(product);
          console.log("Prices:", prices);
          // e.target.innerHTML += ` Price: ${prices.total_price}`;

          // // Create Categories
          // var categories = await create_product_categories(product) || [];
          // console.log('categories created so far: ', categories);

          // Create Product ( With No Categories )
          create_product(product, prices.total_price, []).then(response => {
            console.log('Trying to add to card the product: ', response.data);
            add_to_cart(response.data.id).then(data => {
              console.log('Added To Cart Product_ID: ', response.data.id);

              // Remove Loading Class To Button
              document.getElementById('external_add_to_cart').classList.remove('loading');

              // Add to cart Notification
              Toastify({
                text: "???????? ???? ???????????? ?????????? ?????? ?????? ?????????? ???????? ?????????? ???????? ????????",
                duration: 8000,
                destination: settings.wc_cart_url,
                newWindow: true,
                close: true,
                gravity: "bottom", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                stopOnFocus: true, // Prevents dismissing of toast on hover
                onClick: function(){} // Callback after click
              }).showToast();
            });
          }).catch(error => {
            console.log(error);
            if(error.status === 0) {
              Toastify({
                text: error.message,
                duration: 8000,
                gravity: "bottom", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
              }).showToast();
            }
          });

        } else {
          // e.target.innerHTML += ` No Product Found`;
          Toastify({
            text: "???????????? ???????? ???????? ???????? ???????????? ???????? ????????",
            duration: 8000,
            gravity: "bottom", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
          }).showToast();
          document.getElementById('external_add_to_cart').classList.remove('loading');
        }
      }, false);

      // Calculate Price
      document.getElementById('external_calculate').addEventListener('click', async e => {

        e.preventDefault();

        document.getElementById('external_calculate').classList.add('loading');
        const product = document.getElementById('km_iframe').contentWindow.km_get_product();

        if(product.status > 0) {
          console.log('KM_LOG: calculate product:', product)
          try {
            const prices = await calculate_price(product);
            show_prices(prices, product);
          } catch(e) {
            Toastify({
              text: "?????????? ???? ?????? ???????????? ????????",
              duration: 8000,
              gravity: "bottom", // `top` or `bottom`
              position: "left", // `left`, `center` or `right`
              backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            }).showToast();
            document.getElementById('external_calculate').classList.remove('loading');
          }
        }

        document.getElementById('external_calculate').classList.remove('loading');

      });

      // Add to favorites button event
      document.getElementById("external_add_to_favorites").addEventListener('click', e => {
        var url = document.getElementById('km_iframe').contentWindow.get_current_url();
        add_to_favorites(url);
        Toastify({
          text: "???? ???????????? ?????????? ?????? ???????? ?????????? ???????? ???? ???????? ????????",
          duration: 8000,
          destination: settings.favorites_page_url,
          newWindow: true,
          close: true,
          gravity: "bottom", // `top` or `bottom`
          position: "left", // `left`, `center` or `right`
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          stopOnFocus: true, // Prevents dismissing of toast on hover
          onClick: function(){} // Callback after click
        }).showToast();
      })      

      // Display the add to cart button
      document.getElementById('external_add_to_cart_container').style.display = 'block'; 
    };

    window.add_to_cart_status = false;
    // 
    // CUSTOM BYPASS
    // 
    if(custom) {
      // Append Iframe to container
      container.appendChild(iframe);
      window.add_to_cart_status = true;
    } else { 
      // 
      // CORS BYPASS
      // 
      container.innerHTML = `<iframe id="km_iframe" src="${iframe_base_url}" is="x-frame-bypass" width="100%" height="600"></iframe>`;
      // Add Onload Event
      document.getElementById('km_iframe').onload = (e) => {
        var _this_bypass_frame = e.target;
        var doc_bypass_frame   = _this_bypass_frame.contentWindow.document;
        var head_bypass_frame  = doc_bypass_frame.getElementsByTagName('head')[0];

        var inject_settings_interval = setInterval( () => {
          if(_this_bypass_frame.contentWindow !== null) {
            // Inject Settings Into Iframe Window
            _this_bypass_frame.contentWindow.km_settings = settings;
            _this_bypass_frame.contentWindow.iframe_properties = {
              type: iframe_variation,
              variation: iframe_variations[iframe_variation]
            };
          }
        }, 1000);

        // insertScript(doc_bypass_frame, head_bypass_frame, settings.plugin_dir + `assets/js/${iframe_name}_inject.js`);

        window.add_to_cart_status = true;

        // Display the add to cart button
        document.getElementById('external_add_to_cart_container').style.display = 'block'; 
      };
    
      // Add to cart button event
      document.getElementById('external_add_to_cart').addEventListener('click', async e => {
        if(window.add_to_cart_status) {

          // Add Loading Class To Button
          document.getElementById('external_add_to_cart').classList.add('loading');

          var product = document.getElementById('km_iframe').contentWindow.km_get_product();
          console.log("Product: ", product);

          // Check If Product Available
          if(product.status > 0) {
            // Calculate And Convert Price
            var prices = await calculate_price(product);
            console.log("Prices:", prices);

            // // Create Categories
            // var categories = await create_product_categories(product) || [];
            // console.log('categories created so far: ', categories);

            // Create Product ( With No Categories )
            create_product(product, prices.total_price, []).then(response => {
              console.log('Trying to add to card the product: ', response.data);
              add_to_cart(response.data.id).then(data => {
                console.log('Added To Cart Product_ID: ', response.data.id);

                // Remove Loading Class To Button
                document.getElementById('external_add_to_cart').classList.remove('loading');

                // Add to cart notification
                Toastify({
                  text: "???????? ???? ???????????? ?????????? ?????? ?????? ?????????? ???????? ?????????? ???????? ????????",
                  duration: 8000,
                  destination: settings.wc_cart_url,
                  newWindow: true,
                  close: true,
                  gravity: "bottom", // `top` or `bottom`
                  position: "left", // `left`, `center` or `right`
                  backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                  stopOnFocus: true, // Prevents dismissing of toast on hover
                  onClick: function(){} // Callback after click
                }).showToast();
              });
            }).catch(error => {
              console.log("KM_LOG: ERROR:", error);
              if(error.status === 0) {
                Toastify({
                  text: error.message,
                  duration: 8000,
                  gravity: "bottom", // `top` or `bottom`
                  position: "left", // `left`, `center` or `right`
                  backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
                }).showToast();
              }
            });

          } else {
            // No Product Found (STATUS: 0)
            Toastify({
              text: "???????????? ???????? ???????? ???????? ???????????? ???????? ????????",
              duration: 8000,
              gravity: "bottom", // `top` or `bottom`
              position: "left", // `left`, `center` or `right`
              backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            }).showToast();
            document.getElementById('external_add_to_cart').classList.remove('loading');
          }
        } else {
          console.log("KM_LOG: add to cart not ready yet.")
        }
      }, false);

      // Calculate Price
      document.getElementById('external_calculate').addEventListener('click', async e => {

        e.preventDefault();

        document.getElementById('external_calculate').classList.add('loading');
        const product = document.getElementById('km_iframe').contentWindow.km_get_product();

        if(product.status > 0) {
          console.log('KM_LOG: calculate product:', product)
          try {
            const prices = await calculate_price(product);
            show_prices(prices, product);
          } catch(e) {
            Toastify({
              text: "?????????? ???? ?????? ???????????? ????????",
              duration: 8000,
              gravity: "bottom", // `top` or `bottom`
              position: "left", // `left`, `center` or `right`
              backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            }).showToast();
            document.getElementById('external_calculate').classList.remove('loading');
          }
        }

        document.getElementById('external_calculate').classList.remove('loading');

      });

      // Add to favorites button event
      document.getElementById("external_add_to_favorites").addEventListener('click', e => {
        var url = document.getElementById('km_iframe').contentWindow.get_current_url();
        add_to_favorites(url.toString());
        Toastify({
          text: "???? ?????????? ???? ???????? ?????????? ???????? ???? ?????????? ????.?? ???????? ?????????? ???????? '?????????? ???????? ????' ???????? ????????.",
          duration: 8000,
          destination: settings.favorites_page_url,
          newWindow: true,
          close: true,
          gravity: "bottom", // `top` or `bottom`
          position: "left", // `left`, `center` or `right`
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          stopOnFocus: true, // Prevents dismissing of toast on hover
          onClick: function(){} // Callback after click
        }).showToast();
      
      });

      
    }
}
  // });
// });
