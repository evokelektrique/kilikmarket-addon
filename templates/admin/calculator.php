<?php

// Calculator Page
// var_dump($_GET);
// var_dump(admin_url( '', 'admin' ));
$currencies = KilikMarketFunctions::admin_get_currencies(1);
?>


<?php if(!empty($currencies)): ?>
<div class="currencies">
	<div class="column">
		<b>USD</b>
		<span><?= $currencies['USD']['sell'] ?></span>
	</div>
	<div class="column">
		<b>EUR</b>
		<span><?= $currencies['EUR']['sell'] ?></span>
	</div>
	<div class="column">
		<b>AED</b>
		<span><?= $currencies['AED']['sell'] ?></span>
	</div>
	<div class="column">
		<b>TRY</b>
		<span><?= $currencies['TRY']['sell'] ?></span>
	</div>
</div>
<?php else: ?>
	دریافت نشد
<?php endif; ?>

<!-- <form id="km_calculator">
	<input type="hidden" name="page" value="kilikmarket-options">
	<input type="text" name="test">
</form>
 -->