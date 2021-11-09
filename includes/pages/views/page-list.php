<?php 
if(isset($_GET["message"])):
$message_status = $_GET["message"]; 
?>
    <?php if($message_status == "success"): ?>
        <div class="km_message success">با موفقیت اضافه شد</div>
    <?php endif; ?>

    <?php if($message_status == "error"): ?>
        <div class="km_message error">تمامی فیلد ها را پر کنید</div>
        
    <?php endif; ?>
<?php endif; ?>
<?php 
if(isset($_GET["delete"])):
$delete_status = $_GET["delete"]; 
?>
    <?php if($delete_status == "success"): ?>
        <div class="km_message success">با موفقیت حذف شد</div>
    <?php endif; ?>

    <?php if($delete_status == "error"): ?>
        <div class="km_message error">عملیات به مشکل بر خورد</div>
    <?php endif; ?>
<?php endif; ?>

<div class="wrap">
    <h2>
    	<?php _e( 'لیست صفحه ها', 'kilikmarket' ); ?> 
    	<a href="<?php echo admin_url( 'admin.php?page=kilikmarket-pages&action=new' ); ?>" class="add-new-h2">
	    	<?php _e( 'افزودن جدید', 'kilikmarket' ); ?>
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