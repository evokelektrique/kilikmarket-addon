import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
// const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: 			      settings.base_url,
  consumerKey: 	  settings.wc_ck,
  consumerSecret: settings.wc_cs,
  version: 		    "wc/v3"
});

console.log(settings);

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

  // Multiple Product Price With Gram Unit
  var weight_price = product.weight_to_gram * settings.price_per_gram;

  var price = null;
  // Calculate Iranian Toman Price
  switch(product.currency) {
    // Convert To USD
    case "USD":
      price = parseInt(product.price) * parseInt(settings.usd_price);
      break;

    // Convert To AED
    case "AED":
      price = parseInt(product.price) * parseInt(settings.aed_price);
      break;

    // Convert To USD
    default:
      price = parseInt(product.price) * parseInt(settings.usd_price);
      break;
  }

  // Total Toman Price
  var iranian_toman_price = 0;
  var weight_status       = true;
  if(weight_price) {
    iranian_toman_price = parseInt(price) + parseInt(weight_price) + parseInt(settings.fee_price);
  } else {
    iranian_toman_price = parseInt(price) + parseInt(settings.fee_price);
    weight_status = false;
  }

  return {
    total_price:    iranian_toman_price,
    weight_price:   weight_price,
    weight_status:  weight_status,
    price:          price,
    original_price: product.price,
    fee_price:      settings.fee_price
  };
}


// Product Creation
async function create_product(product, price, categories) {
  return new Promise((resolve, reject) => {

    var image = "";
    // ReAlign Images
    // Array.from(product.image).forEach(item => {
      console.log(typeof product.image);
      if(typeof product.image !== "string") {
        // Array.from(Object.keys(product.image)).forEach(src => {
          // console.log(src);
        image = Array.from(Object.keys(product.image))[0];
        // });
      } else {
        image = product.image;
      }
    // });

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
      reject({data: error.response.data, status: 0});
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
    //  4: Ebay
    var iframe_variation  = parseInt(_this.dataset.target);
    var iframe_variations = {
      0: {url: "https://amazon.com", name: "amazon"},
      1: {url: "https://www.amazon.ae", name: "amazonae"},
      2: {url: "https://www.6pm.com", name: "sixpm"},
      3: {url: "https://www.aliexpress.com", name: "aliexpress"},
      4: {url: "https://www.ebay.co.uk", name: "ebay"}
    };
    var iframe_base_url = iframe_variations[iframe_variation].url;
    var iframe_name     = iframe_variations[iframe_variation].name;

    // Create Iframe Element Based On Event's Dataset Target
    var iframe = document.createElement('iframe');
    // Define iframe properties
    iframe.id           = "km_iframe";
    iframe.src          = `${settings.origin_url}?type=${iframe_variation}&url=${iframe_base_url}`;
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

      // Inject Script
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
          e.target.innerHTML += ` Price: ${prices.total_price}`;

          // // Create Categories
          // var categories = await create_product_categories(product) || [];
          // console.log('categories created so far: ', categories);

          // Create Product ( With No Categories )
          create_product(product, prices.total_price, []).then(response => {
            console.log('Trying to add to card the product: ', response.data);
            add_to_cart(response.data.id).then(data => {
              console.log('Added To Cart Product_ID: ', response.data.id);
            });
          }).catch(error => {
            console.log(error);
          });

        } else {
          e.target.innerHTML += ` No Product Found`;
        }
      }, false);

      alert("complete_from_parent?");

      // Display the add to cart button
      document.getElementById('external_add_to_cart_container').style.display = 'block'; 
    };

    // Append Iframe to container
    container.appendChild(iframe);

  });
});


