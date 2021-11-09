<?php

if ( ! class_exists ( 'WP_List_Table' ) ) {
    require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

/**
 * List table class
 */
class KilikMarketPagesListTable extends \WP_List_Table {

    function __construct() {
        parent::__construct( array(
            'singular' => 'page',
            'plural'   => 'pages',
            'ajax'     => false
        ) );
    }

    function get_table_classes() {
        return array( 'widefat', 'fixed', 'striped', $this->_args['plural'] );
    }

    /**
     * Message to show if no designation found
     *
     * @return void
     */
    function no_items() {
        _e( 'صفحه ای پیدا نشد', 'kilikmarket' );
    }

    /**
     * Default column values if no callback found
     *
     * @param  object  $item
     * @param  string  $column_name
     *
     * @return string
     */
    function column_default( $item, $column_name ) {

        switch ( $column_name ) {
            case 'page_url':
                return $item->page_url;

            case 'page_website':
                switch ($item->page_website) {
                    case '1':
                        return 'Amazon';
                        break;

                    case '2':
                        return 'AmazonAE';
                        break;

                    case '3':
                        return 'AmazonTR';
                        break;

                    case '4':
                        return 'Aliexpress';
                        break;
                }

            default:
                return isset( $item->$column_name ) ? $item->$column_name : '';
        }
    }

    /**
     * Get the column names
     *
     * @return array
     */
    function get_columns() {
        $columns = array(
            'cb'           => '<input type="checkbox" />',
            'page_url'      => __( 'آدرس', 'kilikmarket' ),
            'page_website'      => __( 'وبسایت', 'kilikmarket' ),

        );

        return $columns;
    }

    /**
     * Render the designation name column
     *
     * @param  object  $item
     *
     * @return string
     */
    function column_page_url( $item ) {

        $actions           = array();
        $actions['edit']   = sprintf( '<a href="%s" data-id="%d" title="%s">%s</a>', admin_url( 'admin.php?page=kilikmarket-pages&action=edit&id=' . $item->id ), $item->id, __( 'Edit this item', 'kilikmarket' ), __( 'Edit', 'kilikmarket' ) );
        $actions['delete'] = sprintf( '<a href="%s" class="submitdelete" data-id="%d" title="%s">%s</a>', admin_url( 'admin.php?page=kilikmarket-pages&action=delete&id=' . $item->id ), $item->id, __( 'Delete this item', 'kilikmarket' ), __( 'Delete', 'kilikmarket' ) );

        return sprintf( '<strong>%1$s</strong> %2$s', $item->page_url, $this->row_actions( $actions ) );
    }

    /**
     * Get sortable columns
     *
     * @return array
     */
    function get_sortable_columns() {
        $sortable_columns = array(
            'page_url' => array( 'page_url', true ),
            'page_website' => array( 'page_website', true ),
        );

        return $sortable_columns;
    }

    /**
     * Set the bulk actions
     *
     * @return array
     */
    function get_bulk_actions() {
        $actions = array(
            // 'trash'  => __( 'Move to Trash', 'kilikmarket' ),
        );
        return $actions;
    }

    /**
     * Render the checkbox column
     *
     * @param  object  $item
     *
     * @return string
     */
    function column_cb( $item ) {
        return sprintf(
            '<input type="checkbox" name="page_id[]" value="%d" />', $item->id
        );
    }

    /**
     * Set the views
     *
     * @return array
     */
    public function get_views_() {
        $status_links   = array();
        $base_link      = admin_url( 'admin.php?page=kilikmarket-pages' );

        foreach ($this->counts as $key => $value) {
            $class = ( $key == $this->page_status ) ? 'current' : 'status-' . $key;
            $status_links[ $key ] = sprintf( '<a href="%s" class="%s">%s <span class="count">(%s)</span></a>', add_query_arg( array( 'status' => $key ), $base_link ), $class, $value['label'], $value['count'] );
        }

        return $status_links;
    }

    /**
     * Prepare the class items
     *
     * @return void
     */
    function prepare_items() {

        $columns               = $this->get_columns();
        $hidden                = array( );
        $sortable              = $this->get_sortable_columns();
        $this->_column_headers = array( $columns, $hidden, $sortable );

        $per_page              = 20;
        $current_page          = $this->get_pagenum();
        $offset                = ( $current_page -1 ) * $per_page;
        $this->page_status     = isset( $_GET['status'] ) ? sanitize_text_field( $_GET['status'] ) : '2';

        // only ncessary because we have sample data
        $args = array(
            'offset' => $offset,
            'number' => $per_page,
        );

        if ( isset( $_REQUEST['orderby'] ) && isset( $_REQUEST['order'] ) ) {
            $args['orderby'] = $_REQUEST['orderby'];
            $args['order']   = $_REQUEST['order'] ;
        }

        $this->items  = kilikMarketPagesListFunctions::km_pages_get_all_page( $args );

        $this->set_pagination_args( array(
            'total_items' => kilikMarketPagesListFunctions::km_pages_get_page_count(),
            'per_page'    => $per_page
        ) );
    }
}