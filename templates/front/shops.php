<?=
KilikMarketFunctions::iframe([
	'id' 		=> 'shops',
	'src' 		=> 'http://localhost/wordpress_projects/kilikmarket_proxy/index.php?url=http://amazon.com/', 
	'width' 	=> "100%", 
	"height" 	=> "600",
]);
?>

<div id="external_add_to_cart_container">
	<button id="external_add_to_cart">Add To Cart</button>
	<button id="external_calculate">Calculate</button>
</div>

<script type="text/javascript">

// Add to cart button event
document.getElementById('external_add_to_cart').addEventListener('click', () => {
	var iframe = document.getElementById('shops').contentWindow;
	console.log(iframe.km_get_product());
}, false);




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

var shops = document.getElementById('shops');
shops.onload = () => {
    var doc  = shops.contentWindow.document;
    var head = doc.getElementsByTagName('head')[0];

    // Inject Settings Into Iframe Window
    shops.contentWindow.km_settings = settings;

    // Inject Script
    insertScript(doc, head, settings.plugin_dir + 'assets/js/amazon_inject.js');
};
</script>



