import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
// const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
 
const api = new WooCommerceRestApi({
  url: 			  settings.base_url,
  consumerKey: 	  settings.wc_ck,
  consumerSecret: settings.wc_cs,
  version: 		  "wc/v3"
});

// // List products
// api.get("products", {
//   per_page: 20, // 20 products per page
// })
//   .then((response) => {
//     // Successful request
//     console.log("Response Status:", response.status);
//     console.log("Response Headers:", response.headers);
//     console.log("Response Data:", response.data);
//     console.log("Total of pages:", response.headers['x-wp-totalpages']);
//     console.log("Total of items:", response.headers['x-wp-total']);
//   })
//   .catch((error) => {
//     // Invalid request, for 4xx and 5xx statuses
//     console.log("Response Status:", error.response.status);
//     console.log("Response Headers:", error.response.headers);
//     console.log("Response Data:", error.response.data);
//   })
//   .finally(() => {
//     // Always executed.
//   });

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
  var usd_price = product.price;

  // Multiple Product Price With Gram Unit
  var weight_price = product.weight_to_gram * settings.price_per_gram;

  // Calculate Iranian Toman Price
  var price = usd_price * settings.usd_price;

  // Total Toman Price
  var iranian_toman_price = price + weight_price;

  return {
    total_price: iranian_toman_price,
    weight_price: weight_price,
    price: price
  };
}


// Product Creation
function create_product(product, price) {
  var image = product.image;
  var title = 'Currently No Title'; // TODO: Fetch Title
  var type  = 'simple';
  var catalog_visibility = 'hidden';
  var regular_price = price.toString();
  var description = 'Currently No Description'; // TODO: Fetch Decription, Maybe, Maybe not
  // TODO: Generate variations/attributes? Or something else

  // Product Insertion Data
  const data = {
    name: title,
    type: type,
    catalog_visibility: catalog_visibility,
    regular_price: regular_price,
    description: description,
    images: [
      {
        src: image
      }
    ]
  };

  // Insert Product
  api.post("products", data)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}


Array.from(document.getElementsByClassName("shopping_website_trigger")).forEach(element => {
    element.addEventListener('click', event => {
        var _this = event.target;
        console.log(_this);
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
        var iframe_variation = parseInt(_this.dataset.target);
        var iframe_variations = {
            0: {url: "http://amazon.com", name: "amazon"},
            1: {url: "test1", name: "test1"},
            2: {url: "test2", name: "test2"},
            3: {url: "test3", name: "test3"},
            4: {url: "test4", name: "test4"}
        };
        var iframe_base_url = iframe_variations[iframe_variation].url;
        var iframe_name = iframe_variations[iframe_variation].name;

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
            var doc  = _this.contentWindow.document;
            var head = doc.getElementsByTagName('head')[0];

            // Inject Settings Into Iframe Window
            _this.contentWindow.km_settings = settings;
            _this.contentWindow.iframe_properties = {
                type: iframe_variation,
                variation: iframe_variations[iframe_variation]
            };

            // Inject Script
            insertScript(doc, head, settings.plugin_dir + `assets/js/${iframe_name}_inject.js`);

            // Add to cart button event
            document.getElementById('external_add_to_cart').addEventListener('click', (e) => {
                // Fetch Product
                var product = _this.contentWindow.km_get_product();
                console.log("Product: ", product);

                // Check If Product Available
                if(product.status > 0) {
                  // Calculate And Covert Price
                  var prices  = calculate_price(product);
                  console.log("Prices:", prices);
                  e.target.innerHTML += ` Price: ${prices.total_price}`;
                  var inserted_product = create_product(product, prices.total_price)
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







