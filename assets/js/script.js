import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
window.toastify = Toastify;

const api = new WooCommerceRestApi({
  url: 			      settings.base_url,
  consumerKey: 	  settings.wc_ck,
  consumerSecret: settings.wc_cs,
  version: 		    "wc/v3"
});

// TODO: Remove later
console.log(settings);

// Favorites
window.add_to_favorites = function(value) {
  // Get the existing favorites data
  var favorites = localStorage.getItem('km_favorites');

  // If no favorites, create an array
  // Otherwise convert the localStorage string to an array
  favorites = favorites ? favorites.split(',') : [];

  // Add new data to localStorage Array
  favorites.push(value);

  // Save data into localStorage
  localStorage.setItem('km_favorites', favorites.toString());
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


// Price calculator
function calculate_price(product) {

  var weight_status = true;
  var shipment_price, // Shipment Price In USD
      exchange_rate, // Exchange Rate In IRR
      clearance_price, // TODO: fix it
      fee_price; // TODO: fix it

  // Calculate Shipment Price By Multiplying Product Price With KiloGram Unit
  if(product.weight_to_kilogram) {
    if(product.weight_to_kilogram <= 0.5) {
      // Default price(TODO: Make it later & maybe not)
      shipment_price = 10;
    } else if(product.weight_to_kilogram > 0.5 && product.weight_to_kilogram >= 1) {
      shipment_price = 20;
    } else if(product.weight_to_kilogram > 1 && product.weight_to_kilogram >= 2) {
      shipment_price = 30;
    } else if(product.weight_to_kilogram > 2 && product.weight_to_kilogram >= 3) {
      shipment_price = 40;
    } else if(product.weight_to_kilogram >= 3) {
      shipment_price = 50;
    }
  } else {
    weight_status = true;
  }



  // TODO: Calculate Clearance Price
  clearance_price = 0;
  // TODO: Calculate Fee Price
  fee_price = 0;


  // Fetch IRR Of Product Currency Price
  fetch(settings.ajaxurl, {
      method: "POST", 
      body: new URLSearchParams({action: "get_currencies", currency_type: product.currency})
    })
  .then(response => response.json())
  .then(data => {
    exchange_rate = data.message.buy // Buy Price
  })

  // LEGACY
  // switch(product.currency) {
  //   // Convert To USD
  //   case "USD":
  //     price = parseInt(product.price) * parseInt(settings.usd_price);
  //     break;

  //   // Convert To AED
  //   case "AED":
  //     price = parseInt(product.price) * parseInt(settings.aed_price);
  //     break;

  //   // Convert To TL
  //   case "TL":
  //     price = parseInt(product.price) * parseInt("7000");
  //     break;

  //   // Convert To USD
  //   default:
  //     price = parseInt(product.price) * parseInt(settings.usd_price);
  //     break;
  // }

  // Calculate Total Price In IRR
  var irr_price = 0;
  if(weight_status) {
    irr_price = (product.price + clearance_price + fee_price) * exchange_rate;
  } else {
    // Without Shipment/Weight Price
    irr_price = (product.price + fee_price) * exchange_rate;
  }

  return {
    total_price:      irr_price,
    weight_price:     weight_price, // TODO: Removed, Remove it from dashboard.
    weight_status:    weight_status,
    price:            price, // TODO: Changed, Change It To Base Converted Price / Exchange Rate
    original_price:   product.price,
    fee_price:        fee_price,
    clearance_price:  clearance_price
  };
}


// Product Creation
async function create_product(product, price, categories) {
  return new Promise((resolve, reject) => {
    if(!product.options_status) {
      reject({status: 0, message: "لطفا تمامی متغیر های محصول را انتخاب کنید"});
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
          prices: calculate_price(product),
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
      reject({data: error.response.data, status: 0, message: "مشکلی رخ داد دوباره تلاش کنید" });
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
    fetch(url).then(response => response.text()).then(data => resolve(data));
  });
}

Array.from(document.getElementsByClassName("shopping_website_trigger")).forEach(element => {
  element.addEventListener('click', event => {
    var _this = event.target;
    console.log(_this);

    // Add Actiave Style To Trigger Button
    Array.from(document.getElementsByClassName("shopping_website_trigger")).forEach(trigger_button => {
      trigger_button.classList.remove('activate');
    });
    _this.classList.add('activate');

    // Change Shopping Websites Container Style
    var shopping_container = document.getElementById("shopping_website_container");
    shopping_container.classList.add('activate');

    // Change Body Overflow Style
    document.body.classList.add('overflow-y-hidden');

    // Shopping Websites Exit Button Event
    document.getElementById("exit_button").addEventListener('click', e => {
      document.body.classList.remove('overflow-y-hidden');
      shopping_container.classList.remove('activate');
      document.getElementById('loading_iframe').style.display = 'none';
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
    //  2: 6PM
    //  3: AliExpress
    var iframe_variation  = parseInt(_this.dataset.target);
    var iframe_variations = {
      // Custom means it's amazon or dedicated
      0: {url: "https://amazon.com", name: "amazon", custom: true},
      1: {url: "https://www.amazon.ae", name: "amazonae", custom: true},
      2: {url: "https://www.amazon.com.tr", name: "amazontr", custom: true},
      3: {url: "https://www.aliexpress.com", name: "aliexpress", custom: false},
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
    iframe.onload = (e) => {
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
          var prices = calculate_price(product);
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
              // Add to cart Notification
              Toastify({
                text: "کالا با موفقیت اضافه شد، جهت تسویه حساب اینجا کلیک کنید",
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
            text: "محصولی یافت نشد، لطفا دوباره تلاش کنید",
            duration: 8000,
            gravity: "bottom", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
          }).showToast();
        }
      }, false);

      // Add to favorites button event
      document.getElementById("external_add_to_favorites").addEventListener('click', e => {
        var url = document.getElementById('km_iframe').contentWindow.get_current_url();
        add_to_favorites(url);
        Toastify({
          text: "با موفقیت اضافه شد، برای نمایش لیست کل کلیک کنید",
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
          // Inject Settings Into Iframe Window
          _this_bypass_frame.contentWindow.km_settings = settings;
          _this_bypass_frame.contentWindow.iframe_properties = {
            type: iframe_variation,
            variation: iframe_variations[iframe_variation]
          };
        }, 1000);

        // insertScript(doc_bypass_frame, head_bypass_frame, settings.plugin_dir + `assets/js/${iframe_name}_inject.js`);

        window.add_to_cart_status = true;

        // Display the add to cart button
        document.getElementById('external_add_to_cart_container').style.display = 'block'; 
      };
    
      // Add to cart button event
      document.getElementById('external_add_to_cart').addEventListener('click', async e => {
        if(window.add_to_cart_status) {

          var product = document.getElementById('km_iframe').contentWindow.km_get_product();
          console.log("Product: ", product);

          // Check If Product Available
          if(product.status > 0) {
            // Calculate And Convert Price
            var prices = calculate_price(product);
            console.log("Prices:", prices);

            // // Create Categories
            // var categories = await create_product_categories(product) || [];
            // console.log('categories created so far: ', categories);

            // Create Product ( With No Categories )
            create_product(product, prices.total_price, []).then(response => {
              console.log('Trying to add to card the product: ', response.data);
              add_to_cart(response.data.id).then(data => {
                console.log('Added To Cart Product_ID: ', response.data.id);
                // Add to cart notification
                Toastify({
                  text: "کالا با موفقیت اضافه شد، جهت تسویه حساب اینجا کلیک کنید",
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
              text: "محصولی یافت نشد، لطفا دوباره تلاش کنید",
              duration: 8000,
              gravity: "bottom", // `top` or `bottom`
              position: "left", // `left`, `center` or `right`
              backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            }).showToast();
          }
        } else {
          console.log("KM_LOG: add to cart not ready yet.")
        }
      }, false);

      // Add to favorites button event
      document.getElementById("external_add_to_favorites").addEventListener('click', e => {
        var url = document.getElementById('km_iframe').contentWindow.get_current_url();
        add_to_favorites(url.toString());
        Toastify({
          text: "با موفیت به لیست علاقه مندی ها اضافه شد.، برای نمایش لیست 'علاقه مندی ها' کلیک کنید.",
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


