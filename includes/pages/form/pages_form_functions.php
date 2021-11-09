<?php
class KilikMarketPagesFormFunctions {

    /**
     * Insert a new page
     *
     * @param array $args
     */
    public static function km_pages_insert_page( $args = array() ) {
        global $wpdb;

        $defaults = array(
            'id'         => null,
            'page_url' => '',

        );

        $args       = wp_parse_args( $args, $defaults );
        $table_name = $wpdb->prefix . 'kilikmarket_pages';

        // some basic validation
        if ( empty( $args['page_url'] ) ) {
            return new WP_Error( 'no-page_url', __( 'No Page Url provided.', 'kilikmarket' ) );
        }
        // some basic validation
        if ( empty( $args['page_website'] ) ) {
            return new WP_Error( 'no-page_website', __( 'No Page Website provided.', 'kilikmarket' ) );
        }

        // remove row id to determine if new or update
        $row_id = (int) $args['id'];
        unset( $args['id'] );

        if ( ! $row_id ) {

            $args['created_at'] = current_time( 'mysql' );

            // insert a new
            if ( $wpdb->insert( $table_name, $args ) ) {
                return $wpdb->insert_id;
            }

        } else {

            // do update method here
            if ( $wpdb->update( $table_name, $args, array( 'id' => $row_id ) ) ) {
                return $row_id;
            }
        }

        return false;
    }
}