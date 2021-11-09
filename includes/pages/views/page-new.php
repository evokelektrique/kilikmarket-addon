<div class="wrap">
    <h1><?php _e( 'افزودن صفحه جدید', 'kilikmarket' ); ?></h1>

    <form action="" method="post">

        <table class="form-table">
            <tbody>
                <tr class="row-page-url">
                    <th scope="row">
                        <label for="page_url"><?php _e( 'آدرس', 'kilikmarket' ); ?></label>
                    </th>
                    <td>
                        <input type="text" name="page_url" id="page_url" class="regular-text" placeholder="<?php echo esc_attr( '', 'kilikmarket' ); ?>" value="" required="required" />
                        <span class="description"><?php _e('آدرس صفحه ای که قرار است مورد برسی و محصولات از آن دریافت شود را وارد کنید.', 'kilikmarket' ); ?></span>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="page_url"><?php _e( 'وبسایت', 'kilikmarket' ); ?></label>
                    </th>
                    <td>
                        <select name="page_website" id="page_website" required="required">
                            <option value="1"><?php echo __( 'Amazon', 'kilikmarket' ); ?></option>
                            <option value="2"><?php echo __( 'AmazonAE', 'kilikmarket' ); ?></option>
                            <option value="3"><?php echo __( 'AmazonTR', 'kilikmarket' ); ?></option>
                            <option value="4"><?php echo __( 'Aliexpress', 'kilikmarket' ); ?></option>
                        </select>
                        <span class="description"><?php _e('وب سایت مورد نظر را انتخاب کنید', 'kilikmarket' ); ?></span>
                    </td>
                </tr>
             </tbody>
        </table>

        <input type="hidden" name="field_id" value="0">

        <?php wp_nonce_field( '' ); ?>
        <?php submit_button( __( 'افزودن صفحه جدید', 'kilikmarket' ), 'primary', 'submit_page' ); ?>

    </form>
</div>