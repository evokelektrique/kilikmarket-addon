<?php

/**
 * Handle the form submissions
 *
 * @package Package
 * @subpackage Sub Package
 */
class Form_Handler {

    /**
     * Hook 'em all
     */
    public function __construct() {
        add_action( 'admin_init', array( $this, 'handle_form' ) );
    }

    /**
     * Handle the page new and edit form
     *
     * @return void
     */
    public function handle_form() {
        if ( ! isset( $_POST['submit_page'] ) ) {
            return;
        }

        if ( ! wp_verify_nonce( $_POST['_wpnonce'], '' ) ) {
            die( __( 'Are you cheating?', 'kilikmarket' ) );
        }

        if ( ! current_user_can( 'read' ) ) {
            wp_die( __( 'Permission Denied!', 'kilikmarket' ) );
        }

        $errors   = array();
        $redirect_url = admin_url( 'admin.php?page=kilikmarket-pages' );
        $field_id = isset( $_POST['field_id'] ) ? intval( $_POST['field_id'] ) : 0;

        $page_url = isset( $_POST['page_url'] ) ? $_POST['page_url'] : '';

        // some basic validation
        if ( $page_url === '' ) {
            $errors[] = __( 'Error: Page Url is required', 'kilikmarket' );
        }

        $page_website = isset( $_POST['page_website'] ) ? $_POST['page_website'] : '';

        // some basic validation
        if ( $page_website === '') {
            $errors[] = __( 'Error: Page Website is required', 'kilikmarket' );
        }

        // bail out if error found
        if ( !empty($errors) ) {

            $first_error = reset( $errors );
            $redirect_to = add_query_arg( array( 'error' => $first_error ), $redirect_url );
            wp_safe_redirect( $redirect_to );
            exit;
        }

        $fields = array(
            'page_url' => $page_url,
            'page_website' => $page_website,
        );

        // New or edit?
        if ( ! $field_id ) {

            $insert_id = KilikMarketPagesFormFunctions::km_pages_insert_page( $fields );

        } else {

            $fields['id'] = $field_id;

            $insert_id = KilikMarketPagesFormFunctions::km_pages_insert_page( $fields );
        }

        if ( is_wp_error( $insert_id ) ) {
            $redirect_to = add_query_arg( array( 'message' => 'error' ), $redirect_url );
        } else {
            $redirect_to = add_query_arg( array( 'message' => 'success' ), $redirect_url );
        }

        wp_safe_redirect( $redirect_to );
        exit;
    }
}

new Form_Handler();