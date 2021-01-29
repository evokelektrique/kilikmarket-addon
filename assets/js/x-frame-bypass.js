customElements.define('x-frame-bypass', class extends HTMLIFrameElement {
	static get observedAttributes() {
		return ['src']
	}
	constructor () {
		super()
	}
	attributeChangedCallback () {
		this.load(this.src)
	}
	connectedCallback () {
		this.sandbox = '' + this.sandbox || 'allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation' // all except allow-top-navigation
	}
	load (url, options) {
		console.log("KM_LOG: url starts with", url)

		if (!url || !url.startsWith('http'))
			throw new Error(`X-Frame-Bypass src ${url} does not start with http(s)://`)
		console.log('X-Frame-Bypass loading:', url)
		this.srcdoc = `<html>
<head>
	<style>
	#km_iframe_spinner {
	    position: absolute;
	    height: 100%;
	    width: 100%;
	    background: #f9f9f9;
	    place-items: center;
	    top: 0;
	    z-index: 99999999;
	    right: 0;
	    display: flex;
	}
	.sk-folding-cube {
	  margin: 20px auto;
	  width: 40px;
	  height: 40px;
	  position: relative;
	  -webkit-transform: rotateZ(45deg);
	          transform: rotateZ(45deg);
	}
	.sk-folding-cube .sk-cube {
	  float: left;
	  width: 50%;
	  height: 50%;
	  position: relative;
	  -webkit-transform: scale(1.1);
	      -ms-transform: scale(1.1);
	          transform: scale(1.1); 
	}
	.sk-folding-cube .sk-cube:before {
	  content: '';
	  position: absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  background-color: #333;
	  -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
	          animation: sk-foldCubeAngle 2.4s infinite linear both;
	  -webkit-transform-origin: 100% 100%;
	      -ms-transform-origin: 100% 100%;
	          transform-origin: 100% 100%;
	}
	.sk-folding-cube .sk-cube2 {
	  -webkit-transform: scale(1.1) rotateZ(90deg);
	          transform: scale(1.1) rotateZ(90deg);
	}
	.sk-folding-cube .sk-cube3 {
	  -webkit-transform: scale(1.1) rotateZ(180deg);
	          transform: scale(1.1) rotateZ(180deg);
	}
	.sk-folding-cube .sk-cube4 {
	  -webkit-transform: scale(1.1) rotateZ(270deg);
	          transform: scale(1.1) rotateZ(270deg);
	}
	.sk-folding-cube .sk-cube2:before {
	  -webkit-animation-delay: 0.3s;
	          animation-delay: 0.3s;
	}
	.sk-folding-cube .sk-cube3:before {
	  -webkit-animation-delay: 0.6s;
	          animation-delay: 0.6s; 
	}
	.sk-folding-cube .sk-cube4:before {
	  -webkit-animation-delay: 0.9s;
	          animation-delay: 0.9s;
	}
	@-webkit-keyframes sk-foldCubeAngle {
	  0%, 10% {
	    -webkit-transform: perspective(140px) rotateX(-180deg);
	            transform: perspective(140px) rotateX(-180deg);
	    opacity: 0; 
	  } 25%, 75% {
	    -webkit-transform: perspective(140px) rotateX(0deg);
	            transform: perspective(140px) rotateX(0deg);
	    opacity: 1; 
	  } 90%, 100% {
	    -webkit-transform: perspective(140px) rotateY(180deg);
	            transform: perspective(140px) rotateY(180deg);
	    opacity: 0; 
	  } 
	}
	@keyframes sk-foldCubeAngle {
	  0%, 10% {
	    -webkit-transform: perspective(140px) rotateX(-180deg);
	            transform: perspective(140px) rotateX(-180deg);
	    opacity: 0; 
	  } 25%, 75% {
	    -webkit-transform: perspective(140px) rotateX(0deg);
	            transform: perspective(140px) rotateX(0deg);
	    opacity: 1; 
	  } 90%, 100% {
	    -webkit-transform: perspective(140px) rotateY(180deg);
	            transform: perspective(140px) rotateY(180deg);
	    opacity: 0; 
	  }
	}
	</style>
</head>
<body>
<div id="km_iframe_spinner">
  <div class="sk-folding-cube">
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
  </div>
</div>
</body>
</html>`
		this.fetchProxy(url, options, 0).then(res => res.text()).then(data => {
			if (data)
				this.srcdoc = data.replace(/<head([^>]*)>/i, `<head$1>
	<base href="${url}">
	<script>
	window.km_current_url = "${url}";

	XMLHttpRequest.prototype.open = (function (open) {
	    return function (method, url, async) {
	        console.log('the outgoing url1 is ', url);
            if (url.startsWith('http')) {
                let u = url.split('/')
                if (u[2] === "www.amazon.ae" || u[2] === 'cdp.aliexpress.com' || u[2] === 'login.aliexpress.com') {
                    url = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php" + "?url=" + url
                    this.withCredentials = true;
                } else if (url.indexOf('completion.amazon.ae') > -1) {
                    url = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php" + "?url=" + url;
                    this.withCredentials = true;
                }
            } else if (url.startsWith('about:')) {
                url = url.replace('about:', "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php" + '?url=https:')
                this.withCredentials = true;
            } else if (url.startsWith('//acs.aliexpress.com') || url.startsWith('//u.alicdn.com') || url.startsWith('//www.aliexpress.com')) {
                url = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php" + "?url=https:" + url;
                this.withCredentials = true;
            } else if (url.indexOf('/api/1.0/cart.do') > -1) {
                url = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php" + "?url=https://shoppingcart.aliexpress.com" + url
                this.withCredentials = true;
            } else if (url.startsWith('//fls-')) {
                url = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php" + "?url=https:" + url;
                this.withCredentials = true;
            } else if (url.indexOf('null/gh') > -1) {
                let correctUrl = url.split('null');
                url = correctUrl[1];
                url = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php" + "?url=https://www.amazon.ae" + url;
                this.withCredentials = true;
            } else {
                let proxyServerAddress = "http://localhost/wordpress_projects/kilikmarket_proxy/proxy.php" + "?url=https://www.amazon.ae";
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

	// DOM Onload event
	document.addEventListener("DOMContentLoaded", function(event) {
		// Proxy Images
		var change_images_interval = setInterval( () => {
		    var images 		  = document.getElementsByTagName('img');
			var img_proxy_url = parent.settings.img_proxy_url;
			Array.from(images).forEach(image => {
				if(image.src !== "" && !image.src.includes(img_proxy_url)) {
					image.src = img_proxy_url + image.src;
				}
			});
			// console.log('KM_LOG: change image tick.');

		}, 1000);


		// Aliexpress configurations
		if(km_current_url.includes('aliexpress')) {

			// Find iframe settings form parent
			var settings_find_interval = setInterval(() => {
				console.log('finding settings ...');
				if(window.iframe_properties.variation.name !== undefined ||
					window.iframe_properties.variation.name !== "") {
					console.log('found settings: variation_name:', window.iframe_properties.variation.name);
					
					// Script Injection
					var km_document_head  = document.getElementsByTagName('head')[0];
					var km_script = document.createElement("script");
					km_script.type = "text/javascript";
					km_script.src = parent.settings.plugin_dir + 'assets/js/'+ window.iframe_properties.variation.name +'_inject.js';
					km_document_head.appendChild(km_script);
					parent.alert("injected script"); // TODO: Remove later

					clearInterval(settings_find_interval);
				}
			}, 1000);


			// find navigation buttons
			var buttons = []
			var buttons_find_interval = setInterval(() => {
				console.log('KM_LOG: Finding navigation buttons...');
				if(document.querySelectorAll(".next-pagination button").length > 0) {
					console.log("KM_LOG: found navigation buttons");
					buttons = document.querySelectorAll(".next-pagination button");
					console.log('KM_LOG: buttons:', buttons);
					if(buttons.length > 0) {
						buttons.forEach(button => {
							if(!button.classList.contains('next-current') && !button.classList.contains('next-prev') && !button.classList.contains('next-next')) {
								
								button.addEventListener('click', function(e) {
									e.preventDefault();

									var parsed_url = new URL(km_current_url);
									var next_page_url;

									if(parsed_url.search.includes('page=')) {
										parsed_url.search = parsed_url.search.split("page=")[1] = "page=" + button.textContent;
										next_page_url = parsed_url.toString();
									} else {
										next_page_url = km_current_url + "?page=" + parseInt(button.textContent);
									}

									console.log('KM_LOG: Navigating next page', next_page_url);
									frameElement.load(next_page_url);
								});
							}
						});
					}
					clearInterval(buttons_find_interval);
					console.log("KM_LOG: stop finding.");
				}
			}, 1000);

		} else {
			console.log('KM_LOG: no aliexpress');
		}
	});





	// X-Frame-Bypass navigation event handlers
	document.addEventListener('click', e => {
		if (frameElement && document.activeElement && document.activeElement.href) {
			e.preventDefault()
			frameElement.load(document.activeElement.href)
		}
	})
	document.addEventListener('submit', e => {
		if (frameElement && document.activeElement && document.activeElement.form && document.activeElement.form.action) {
			e.preventDefault()
			if (document.activeElement.form.method === 'post')
				frameElement.load(document.activeElement.form.action, {method: 'post', body: new FormData(document.activeElement.form)})
			else
				frameElement.load(document.activeElement.form.action + '?' + new URLSearchParams(new FormData(document.activeElement.form)))
		}
	})
	</script>`)
		}).catch(e => console.error('Cannot load X-Frame-Bypass:', e))
	}

	fetchProxy (url, options, i) {
		const proxies = (options || {}).proxies || [
			'https://cors-anywhere.herokuapp.com/',
			'https://yacdn.org/proxy/',
			'https://api.codetabs.com/v1/proxy/?quest='
		]
		return fetch(proxies[i] + url, options).then(res => {
			if (!res.ok)
				throw new Error(`${res.status} ${res.statusText}`);
			return res
		}).catch(error => {
			if (i === proxies.length - 1)
				throw error
			return this.fetchProxy(url, options, i + 1)
		})
	}
}, {extends: 'iframe'})