<!-- List Favorites -->
<div id="km_favorites_container">
	<button id="km_clear_favorites">پاک سازی لیست</button>
	<ul id="km_list_favorites"></ul>
</div>


<script type="text/javascript">
document.addEventListener("DOMContentLoaded", function(event) {
 	const container = document.getElementById('km_list_favorites');
	const favorites = list_favorites();

	// If list was not empty
	if(favorites.length > 0) {
		favorites.forEach(favorite => {
			container.innerHTML += "<li><a href='"+favorite+"'>" + favorite + "</a></li>";
		});
	} else {
		container.innerHTML = "<h4>موردی یافت نشد</h4>";
	}

	document.getElementById('km_clear_favorites').addEventListener('click', e => {
		e.preventDefault();
		clear_favorites();
		container.innerHTML = "<h4>موردی یافت نشد</h4>";
		toastify({
		  text: "لیست علاقه مندی با موفقیت پاک شد",
		  duration: 8000,
		  gravity: "bottom", // `top` or `bottom`
		  position: "left", // `left`, `center` or `right`
		  backgroundColor: "linear-gradient(to right, #F9D423, #e65c00)",
		}).showToast();
	});
});
</script>
