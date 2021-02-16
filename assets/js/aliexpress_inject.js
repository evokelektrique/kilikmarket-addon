
window.get_current_url = function() {
	return window.km_current_url;
}

window.km_get_product = function() {
	if(document.getElementsByClassName('product-main').length > 0) {

		var product = {
			url: window.km_current_url,
			status: 1
		};

		// Aliexpress doens't have static weight for products
		product.weight_to_kilogram = null;

		// Image viewer container
		var image_viewer_container = document.getElementsByClassName('image-viewer')[0]
		// Get First image
		product.image = image_viewer_container.getElementsByTagName('img')[0].src || null;

		// Product Title
		var product_title = document.getElementsByClassName('product-title-text')[0].textContent
		product.title = product_title || "NO TITLE";

		// Product Description
		product.description = "No description";

		// Product Categories
		product.categories = ["Aliexpress"];

		// Product Price
		var product_price = document.getElementsByClassName('product-price-value')[0].textContent.split('$')[1]
		product.price 	 = product_price || null;
		product.currency = "USD";

		// Product Options
		var options = [];
		var options_status = true;

		Array.from(document.getElementsByClassName('sku-title')).forEach(option => {
			var opt = option.textContent.split(":")
			// var option_key	 = option.textContent.split(":")[0];

			// var option_value = option.getElementsByClassName('sku-title-value')[0].textContent;
			if(opt[1].trim() !== "") {
				options.push([opt[0].trim(), opt[1].trim()]);
			} else {
				options_status = false;
			}
		})
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

	// var server_address = parent.settings.origin_url + `?type=${window.iframe_properties.type}`;

	// XMLHttpRequest.prototype.open = (function (open) {
	//     return function (method, url, async) {
	//         console.log('the outgoing url1 is ', url);
	//         if(url.startsWith("https:///api")) {
	//         	url = url.replace('https:///api', parent.settings.origin_url + `?type=${window.iframe_properties.type}` + '&url=https://www.aliexpress.com/api')
	//         	this.withCredentials = true;
 //            } else if (url.startsWith('about:')) {
 //                url = url.replace('about:', parent.settings.origin_url + `?type=${window.iframe_properties.type}` + '&url=https:')
 //                this.withCredentials = true;
 //            } else if (url.startsWith('//acs.aliexpress.com') || url.startsWith('//u.alicdn.com') || url.startsWith('//www.aliexpress.com')) {
 //                url = parent.settings.origin_url + `?type=${window.iframe_properties.type}` + "&url=https:" + url;
 //                this.withCredentials = true;
 //            } else if (url.indexOf('/api/1.0/cart.do') > -1) {
 //                url = parent.settings.origin_url + `?type=${window.iframe_properties.type}` + "&url=https://shoppingcart.aliexpress.com" + url
 //                this.withCredentials = true;
 //            } else if (url.startsWith('//fls-')) {
 //                url = parent.settings.origin_url + `?type=${window.iframe_properties.type}` + "&url=https:" + url;
 //                this.withCredentials = true;
 //            } else if (url.indexOf('null/gh') > -1) {
 //                let correctUrl = url.split('null');
 //                url = correctUrl[1];
 //                url = parent.settings.origin_url + `?type=${window.iframe_properties.type}` + "&url=https://www.amazon.ae" + url;
 //                this.withCredentials = true;
 //            } else {
 //                let proxyServerAddress = parent.settings.origin_url + `?type=${window.iframe_properties.type}` + "&url=https://www.amazon.ae";
 //                if (!url.startsWith('/')) {
 //                    proxyServerAddress = proxyServerAddress + '/';
 //                }
 //                url = proxyServerAddress + url;
 //                this.withCredentials = true;
 //            }
	//         console.log('the outgoing url2 is ', url);
	//         open.apply(this, arguments);
	//     };
	// })(XMLHttpRequest.prototype.open);

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

}

kilikmartket_main();