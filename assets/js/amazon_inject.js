var server_address = window.km_settings.origin_url;
var search_category_element_global = document.getElementById('searchDropdownBox');
// Category
var category_global = search_category_element_global[search_category_element_global.selectedIndex].value.split('=')[1];

// Links Listener
document.addEventListener('click', (event) => {
	
	// Don't follow the link
	event.preventDefault();

	// If the clicked element doesn't have the right selector, bail
	if(event.target.href || event.target.parentNode.href) {
		var url = event.target.href || event.target.parentNode.href;
		event.target.href = window.km_settings.origin_url + "?url=" + url;
		event.target.parentNode.href = window.km_settings.origin_url + "?url=" + url;
		// Log the clicked element in the console
		console.log("Fetching: ", url);
		fetch_proxy(event.target.href);
	}

	// return; // remove later
}, false);

// Search Button Listener
document.getElementById('nav-search-submit-text').addEventListener('click', () => {
	var search_category_element = document.getElementById('searchDropdownBox');
	// Category
	var category = search_category_element[search_category_element.selectedIndex].value.split('=')[1];
	// Text
	var search_text = document.getElementById('twotabsearchtextbox').value;

	var search_url = `http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=https://www.amazon.com/s?k=${search_text}&i=${category}`;
	fetch_proxy(search_url);
}, false);

XMLHttpRequest.prototype.open = (function (open) {
    return function (method, url, async) {
        console.log('the outgoing url1 is ', url);
        if (!url.startsWith('http://localhost/wordpress_projects/kilikmarket_proxy/index.php')) {
            if (url.startsWith('http')) {
                let u = url.split('/')
                if (u[2] === "www.amazon.com" || u[2] === 'cdp.aliexpress.com' || u[2] === 'login.aliexpress.com') {
                    url = "http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=" + url
                    this.withCredentials = true;
                } else if (url.indexOf('completion.amazon.com') > -1) {
                    url = "http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=" + url;
                    this.withCredentials = true;
                }
            } else if (url.startsWith('about:')) {
                url = url.replace('about:', 'http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=https:')
                this.withCredentials = true;
            } else if (url.startsWith('//acs.aliexpress.com') || url.startsWith('//u.alicdn.com') || url.startsWith('//www.aliexpress.com')) {
                url = "http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=https:" + url;
                this.withCredentials = true;
            } else if (url.indexOf('/api/1.0/cart.do') > -1) {
                url = "http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=https://shoppingcart.aliexpress.com" + url
                this.withCredentials = true;
            } else if (url.startsWith('//fls-')) {
                url = "http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=https:" + url;
                this.withCredentials = true;
            } else if (url.indexOf('null/gh') > -1) {
                let correctUrl = url.split('null');
                url = correctUrl[1];
                url = "http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=https://www.amazon.com" + url;
                this.withCredentials = true;
            } else {
                let proxyServerAddress = "http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=https://www.amazon.com";
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
			link.host = "www.amazon.com";
		}
	});
	console.log('KILIKMARKET: links changed');

	// Options
	var options = document.querySelectorAll("[data-action='s-ref-selected']");
	if(options) {
		Array.from(options).forEach(link => {
			if(link.hasChildNodes()) {
				link.childNodes[0].addEventListener('click', () => {
					fetch_proxy('https://amazon.com' + JSON.parse(link.dataset.sRefSelected).url);
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
	// var selected_options = document.getElementsByClassName("swatchSelect");
	var options = [];
	var labels 		= document.querySelectorAll("div.a-section .a-row .a-form-label");
	var selections 	= document.querySelectorAll("div.a-section .a-row .selection");
	if(labels) {
		Array.from(labels).forEach((label, index) => {
			options.push({
				label: label.textContent.trim().replace(":", ""),
				value: selections[index].textContent.trim()
			});
		});
	}
	console.log("KILIKMARKET: Options:", options);
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
	var in_stock = (document.querySelectorAll("#outOfStock").length > 0) ? true : false;

	if(in_stock) {
		var product = {
			status: 1
		};

		// Product Image
		var image = document.querySelector('#imgTagWrapperId > img')

		// Product Options
		var options = km_product_options();

		// Product Price
		var price =document.getElementById('priceblock_ourprice').textContent.split("$");
		product.price = price[1] || null;

		// Assign Options To Product
		product.options = options;

		// Assing Image To Product
		product.image = image.dataset.oldHires || null;

		return product;
	} else {
		return {
			status: 0
		}
	}
}


// Main functions
function kilikmartket_main() {
	km_format_links();
	km_product_options();
	alert('complete');
}

kilikmartket_main();