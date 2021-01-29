
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