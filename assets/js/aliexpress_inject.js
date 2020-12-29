var server_address = window.km_settings.origin_url + `?type=${window.iframe_properties.type}`;
var km_current_url = "";
// var search_category_element_global = document.getElementById('searchDropdownBox');
// // Category
// var category_global = search_category_element_global[search_category_element_global.selectedIndex].value.split('=')[1];

// Links Listener
document.addEventListener('click', (event) => {
	
	// Don't follow the link
	event.preventDefault();

	// If the clicked element doesn't have the right selector, bail
	if(	event.target.href ||
		event.target.parentNode.href || 
		event.target.parentNode.parentNode.href) {

		var url = event.target.href || event.target.parentNode.href || event.target.parentNode.parentNode.href;
		event.target.href = server_address + "&url=" + url;
		event.target.parentNode.href = server_address + "&url=" + url;
		// Log the clicked element in the console
		console.log("Fetching: ", url);
		fetch_proxy(event.target.href);
	}

	// return; // remove later
}, false);

XMLHttpRequest.prototype.open = (function (open) {
    return function (method, url, async) {
        console.log('the outgoing url1 is ', url);
        if (!url.startsWith(server_address + '')) {
            if (url.startsWith('http')) {
                let u = url.split('/')
                if (u[2] === "www.aliexpress.com" || u[2] === 'cdp.aliexpress.com' || u[2] === 'login.aliexpress.com') {
                    url = server_address + "&url=" + url
                    this.withCredentials = true;
                } else if (url.indexOf('completion.aliexpress.com') > -1) {
                    url = server_address + "&url=" + url;
                    this.withCredentials = true;
                }
            } else if (url.startsWith('about:')) {
                url = url.replace('about:', server_address + '&url=https:')
                this.withCredentials = true;
            } else if (url.startsWith('//acs.aliexpress.com') || url.startsWith('//u.alicdn.com') || url.startsWith('//www.aliexpress.com')) {
                url = server_address + "&url=https:" + url;
                this.withCredentials = true;
            } else if (url.indexOf('/api/1.0/cart.do') > -1) {
                url = server_address + "&url=https://shoppingcart.aliexpress.com" + url
                this.withCredentials = true;
            } else if (url.startsWith('//fls-')) {
                url = server_address + "&url=https:" + url;
                this.withCredentials = true;
            } else if (url.indexOf('null/gh') > -1) {
                let correctUrl = url.split('null');
                url = correctUrl[1];
                url = server_address + "&url=https://www.aliexpress.com" + url;
                this.withCredentials = true;
            } else {
                let proxyServerAddress = server_address + "&url=https://www.aliexpress.com";
                if (!url.startsWith('/')) {
                    proxyServerAddress = proxyServerAddress + '/';
                }
                url = proxyServerAddress + url;
                this.withCredentials = true;
            }
        }
        console.log('the outgoing url2 is ', url);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

function fetch_proxy(url) {
	create_km_spinner();
	km_current_url = url;
	console.log("KILIKMARKET: Fetching: " + url);
	fetch(url)
		.then(response => response.text())
		.then(data => document.body.innerHTML = data)
		.then(() => kilikmartket_main());
}

function km_format_links() {
	var links = document.getElementsByTagName('a');
	// Loop Through All Links On Current Document And Prepend The Proxy Path
	Array.from(links).forEach(link => {
		if(link.host != "" && link.host) {
			link.host = "www.aliexpress.com";

			// Fix sponsored/Related Products
			if(link.toString().includes('slredirect')) {
				var real_url = decodeURIComponent(link).toString().split('url=')[1]
				link.href = link.origin + real_url;
			}
		}
	});
	console.log('KILIKMARKET: links changed');

	// Options
	var options = document.querySelectorAll("[data-action='s-ref-selected']");
	if(options) {
		Array.from(options).forEach(link => {
			if(link.hasChildNodes()) {
				link.childNodes[0].addEventListener('click', () => {
					fetch_proxy('https://aliexpress.com' + JSON.parse(link.dataset.sRefSelected).url);
				});
			}
		});
	}
	console.log('KILIKMARKET: options changed');

	// Colors
	var colors = document.getElementsByClassName('colorsprite');
	if(colors) {
		Array.from(colors).forEach(color => {
			color.parentNode.parentNode.addEventListener('click', () => {
				fetch_proxy(color.parentNode.parentNode.href);
			});
		});
	}
}	

// Check Selected Options
function km_product_options() {
	var options 	= [];
	var labels 		= document.querySelectorAll("div.a-section .a-row .a-form-label");
	var selections 	= document.querySelectorAll("div.a-section .a-row .selection");

	if(labels && selections) {
		Array.from(labels).forEach((label, index) => {
			if(selections[index] !== undefined) {
				options.push({
					label: label.textContent.trim().replace(":", ""),
					value: selections[index].textContent.trim()
				});
			}
		});
	}

	if(options.length === 0 || options === []) {
		var labels = document.querySelectorAll(".variation-dropdown label");
		var selections = document.querySelectorAll(".variation-dropdown select");
		Array.from(labels).forEach((label, index) => {
			if(selections[index] !== undefined) {
				options.push({
					label: label.textContent.trim().replace(":", ""),
					value: selections[index].selectedOptions[0].dataset.aHtmlContent
				});
			}
		});
	}

	console.log("KILIKMARKET Options:", options);

	if(options.length > 0) {
		return options;
	} else {
		return [];
	}
}

// 
// Product Status [
// 	0: Out of stock
// 	1: In stock / Ready
// ]
// 
function km_get_product() {
	// Check if product is in stock
	var out_stock = (document.querySelectorAll("#outOfStock").length > 0) ? true : false;

	// If The Product Is Not Out Of Stock 
	if(!out_stock) { 
		var product = {
			url: km_current_url,
			status: 1
		};

		// Product Title
		var title = document.getElementById("productTitle").textContent.trim();
		// Assign Title To Product
		product.title = title;

		// Product Description
		var description = document.getElementById("feature-bullets").textContent.trim();
		// Assign Description TO Title
		product.description = description;

		// Fetch & Assign category to product
		var categories = Array.from(document.querySelectorAll('#wayfinding-breadcrumbs_feature_div li'));
		product.categories = [];
		if(categories !== undefined && categories) {
			categories.forEach(category => {
				if(category.textContent.trim().length > 1) {
					product.categories.push(category.textContent.trim());
				}
			});
		}

		// Product Image
		var image = document.querySelector('#imgTagWrapperId > img')

		// Product Options
		var options = km_product_options();

		// Product Price
		if(document.getElementById('priceblock_ourprice') !== null) {
			// Single Price Product
			var price = document.getElementById('priceblock_ourprice').textContent.split("AED");
			product.price 	 = price[1].trim().replace(',', '') || null;
			product.currency = "AED";

		} else if(document.getElementById('price_inside_buybox') !== null) {
			// Single Price Product
			var price = document.getElementById('price_inside_buybox').textContent.split("AED");
			product.price 	 = price[1].trim().replace(',', '') || null;
			product.currency = "AED";

		} else if(document.querySelector('[data-action="show-all-offers-display"] .a-size-base') !== null) {
			// Multi Price Product
			var price = document.querySelector('[data-action="show-all-offers-display"] .a-size-base').textContent.split("AED");
			product.price 	 = price[1].trim().replace(',', '') || null;
			product.currency = "AED";

		} else {
			// No Price Found
			return {
				status: 0
			};
		}

		// Assign Options To Product
		product.options = options;

		// Assing Image To Product
		if(image.dataset.oldHires) {
			// Image
			product.image = image.dataset.oldHires || null;
		} else {
			// Images
			product.image = JSON.parse(image.dataset.aDynamicImage) || null;
		}

		// Assing Weight To Product
		var weight_types = ['ounces', 'pounds', 'kg', 'g'];
		// Query and select all related product information
		Array.from(document.querySelectorAll('td.a-size-base')).forEach((item, index) => {
			weight_types.forEach(type => {
				if(item.textContent.includes(type)) {
					// Find And Trim And Split The Weight From The Given Types
					var weight = Array.from(document.querySelectorAll('td.a-size-base'))[index].textContent.trim().split(type)[0].trim()
					// Assign Weight Values To Product
					product.weight 			= weight;
					product.weight_type 	= type;
					product.weight_to_gram 	= null;
					// Convert Type To Gram
					switch(type) {
						case "ounces":
							// Formula For Ounces
							product.weight_to_gram 	= Math.round(weight * 28.35); 
							break

						case "pounds":
							// Formula For Pounds
							product.weight_to_gram 	= Math.round(weight * 454); 
							break;

						case 'kg':
							// Formula For KiloGram
							product.weight_to_gram 	= Math.round(weight * 1000); 
							break;

						case 'g':
							product.weight_to_gram 	= Math.round(weight); 
							break;

					}
				}
			});
		});

		return product;

	} else {
		// Product Is Out Of Stock
		return {
			status: 0
		}
	}
}

function remove_km_spinner() {
	var loader = window.parent.document.getElementById("loading_iframe");
	if(loader) {
		loader.style.display = 'none';
	}
}

function create_km_spinner() {
	var loader = window.parent.document.getElementById("loading_iframe");
	if(loader) {
		loader.style.display = 'block';
	}
}

// Main functions
function kilikmartket_main() {
	km_format_links();
	km_product_options();
	remove_km_spinner();

	// Scroll To Top
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

	document.addEventListener('DOMContentLoaded', function(event) {
		// Search Button Listener
		document.getElementById('nav-search-submit-text').addEventListener('click', () => {
			var search_category_element = document.getElementById('searchDropdownBox');
			// Category
			var category = search_category_element[search_category_element.selectedIndex].value.split('=')[1];
			// Text
			var search_text = document.getElementById('twotabsearchtextbox').value;

			var search_url = `${server_address}&url=https://www.aliexpress.com/s?k=${search_text}&i=${category}`;
			fetch_proxy(search_url);
		}, false);
	});

	alert('complete');
}

kilikmartket_main();