window.get_current_url = function() {
	return window.km_current_url;
}

window.km_get_product = function() {
	// Stock Check (IF IN STOCK)
	if(document.querySelectorAll(".object-commerce-detail").length > 0) {

		var product = {
			url: window.km_current_url,
			status: 1
		};

		// Lush doens't have static weight for products
		product.weight_to_kilogram = null;

		// Get First image
		product.image = document.querySelector('.product-image img').src || null;

		// Product Title
		var product_title = document.querySelector('h1.product-title').textContent.trim() || "NO TITLE";

		// Product Description
		product.description = "No description";

		// Product Categories
		product.categories = ["Lush"];

		// Product Price
		var product_price = document.querySelector('.form-item-product-id select').selectedOptions[0].textContent.split('/')[0].split("AED")[1].trim();
		product.price 	 = product_price || null;
		product.currency = "AED";

		// Product Options
		var options = [];
		var options_status = true;

		product.options = options;
		product.options_status = options_status;

		return product;
	} else {
		// No product found
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

function kilikmartket_main() {
	
	remove_km_spinner();

	XMLHttpRequest.prototype.open = (function (open) {
		return function (method, url, async) {
			console.log('the outgoing url1 is ', url);
			if(url.startsWith("https:///api")) {
				url = url.replace('https:///api', 'http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php?url=https://www.aliexpress.com/api')
				this.withCredentials = true;
			} else if (url.startsWith('about:')) {
				url = url.replace('about:', 'http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php?url=https:')
				this.withCredentials = true;
			} else if (url.startsWith('//acs.aliexpress.com') || url.startsWith('//u.alicdn.com') || url.startsWith('//www.aliexpress.com')) {
				url = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php?url=https:" + url;
				this.withCredentials = true;
			} else if (url.indexOf('/api/1.0/cart.do') > -1) {
				url = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php?url=https://shoppingcart.aliexpress.com" + url
				this.withCredentials = true;
			} else if (url.startsWith('//fls-')) {
				url = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php?url=https:" + url;
				this.withCredentials = true;
			} else if (url.indexOf('null/gh') > -1) {
				let correctUrl = url.split('null');
				url = correctUrl[1];
				url = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php?url=" + url;
				this.withCredentials = true;
			} else {
				let proxyServerAddress = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php?url=";
				if (!url.startsWith('/')) {
					proxyServerAddress = proxyServerAddress + '/';
				}
				url = proxyServerAddress + url;
				this.withCredentials = true;
			}
			console.log('the outgoing url2 is ', url);
			open.apply(this, arguments);
		};
	})(XMLHttpRequest.prototype.open);

	// Hide Calculated Prices
	parent.document.getElementById("calculated_prices").classList.add('disabled');

	console.log("complete");

	// Close Calculated Price Event
	window.addEventListener('click', e => {
      parent.document.getElementById("calculated_prices").classList.add('disabled');
	});
}

kilikmartket_main();