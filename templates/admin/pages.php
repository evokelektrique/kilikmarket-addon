<div class="wrap">
    <h2>
    	<?php _e( 'KM Pages List', 'kilikmarket' ); ?> 
    	<a href="<?php echo admin_url( 'admin.php?page=kilikmarket-options-bot&action=new' ); ?>" class="add-new-h2">
	    	<?php _e( 'Add New', 'kilikmarket' ); ?>
    	</a>
    </h2>

    <form method="post">
        <input type="hidden" name="page" value="ttest_list_table">
        <?php
	        $list_table = new KilikMarketPagesListTable();
	        $list_table->prepare_items();
	        $list_table->display();
        ?>
    </form>
</div>