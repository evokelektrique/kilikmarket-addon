<?php


class kilikMarketPagesListFunctions {

    /**
     * Get all page
     *
     * @param $args array
     *
     * @return array
     */
    public static function km_pages_get_all_page( $args = array() ) {
        global $wpdb;

        $defaults = array(
            'number'     => 20,
            'offset'     => 0,
            'orderby'    => 'id',
            'order'      => 'ASC',
        );

        $args      = wp_parse_args( $args, $defaults );
        $cache_key = 'page-all';
        $items     = wp_cache_get( $cache_key, 'kilikmarket' );

        if ( false === $items ) {
            $items = $wpdb->get_results( 'SELECT * FROM ' . $wpdb->prefix . 'kilikmarket_pages ORDER BY ' . $args['orderby'] .' ' . $args['order'] .' LIMIT ' . $args['offset'] . ', ' . $args['number'] );

            wp_cache_set( $cache_key, $items, 'kilikmarket' );
        }

        return $items;
    }

    /**
     * Fetch all page from database
     *
     * @return array
     */
    public static function km_pages_get_page_count() {
        global $wpdb;

        return (int) $wpdb->get_var( 'SELECT COUNT(*) FROM ' . $wpdb->prefix . 'kilikmarket_pages' );
    }

    /**
     * Fetch a single page from database
     *
     * @param int   $id
     *
     * @return array
     */
    public static function km_pages_get_page( $id = 0 ) {
        global $wpdb;

        return $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . $wpdb->prefix . 'kilikmarket_pages WHERE id = %d', $id ) );
    }
}
