// ON READY
jQuery(document).ready(function () {

    // VARS
    let $site_url = (window.wp_urls && wp_urls.siteurl) || (window.themeConfig && window.themeConfig.siteurl) || "/";

    let $html = jQuery('html');
    let $page = jQuery('#page');
    let $content = jQuery('#primary');
    let $alert_bar = jQuery('.uu-alert-bar');
    let $acc_bar = jQuery('#uu-acc-bar');
    let $sidenav = jQuery('#sidenav');

    let $nav_toggle = jQuery('#sidenav_toggle_btn');
    let $mobile_nav_toggle = jQuery('#mobile_sidenav_toggle_btn');

    let $search_btn = jQuery('.search-btn');
    let $main_search = jQuery('#main_search');
    let $main_search_form = jQuery('#site_search');
    let $search_input = jQuery('#site_search_input');
    let $search_checkbox = jQuery('#search_campus_checkbox');

    let $parent_menu_item = jQuery('.sidenav-menu li.menu-item-has-children > a');
    let $scroll_top_btn = jQuery('#back-to-top-btn');

    getHeaderHeight();


    // SIDENAV TOGGLE
    $nav_toggle.on('click', function () {
        jQuery(this).toggleClass('sidenav-open');
        $page.toggleClass('sidenav-open').removeClass('search-open');
        $sidenav.toggleClass('sidenav-open');
        $html.toggleClass('sidenav-open').removeClass('search-open');
        $main_search.removeClass('search-open');
        $search_btn.removeClass('search-open');
    });

    $parent_menu_item.on('click', function (e) {
        e.preventDefault();
        jQuery(this).closest('.menu-item-has-children').toggleClass('nav-open');
        jQuery(this).closest('.menu-item-has-children').find('> .sub-menu').slideToggle();
        getHeaderHeight();
    });

    // MOBILE NAV TOGGLE
    $mobile_nav_toggle.on('click', function () {
        sideNavClose();
    })

    // SEARCH BAR
    $search_btn.on('click', function (e) {
        e.stopPropagation();
        $search_btn.toggleClass('search-open');
        $page.toggleClass('search-open').removeClass('sidenav-open');
        $html.toggleClass('search-open').removeClass('sidenav-open');
        $main_search.toggleClass('search-open');
        $sidenav.removeClass('sidenav-open');
        $search_input.focus();
        sideNavClose();
    });

    // CHECK INTERVAL
    function checkInterval(e) {
        // CLOSE SIDENAV ON PAGE CLICK
        if ($page.hasClass('sidenav-open')) {
            $page.on('click', function () {
                sideNavClose();
            });
            // CLOSE SEARCH ON PAGE CLICK
        } else if ($page.hasClass('search-open')) {
            $page.on('click', function () {
                searchClose();
            });
        } else {
            $page.off();
        }
    };

    // CHECK CAMPUS SEARCH CHECKBOX
    $search_checkbox.on('click', function (e) {
        if ($search_checkbox.prop('checked')) {
            $search_input.attr('placeholder', 'Search Campus');
            $search_input.attr('name', 'q');
            $main_search_form.attr('action', '//gsa.search.utah.edu/search');
            jQuery('#search_gcse_action').attr('value', 'campus');
            $main_search.removeClass('site-search');
            $main_search.addClass('campus-search');
        } else {
            $search_input.attr('placeholder', 'Search Site');
            $search_input.attr('name', 's');
            $main_search_form.attr('action', $site_url);
            jQuery('#search_gcse_action').attr('value', 'site');
            $main_search.removeClass('campus-search');
            $main_search.addClass('site-search');
        }
    });


    // ACCESSIBILITY BAR
    jQuery(document).keyup(function (e) {
        if (e.altKey && e.keyCode == 191) {
            console.log('Accessibilty Bar Toggled');
            $html.toggleClass('acc-bar-open');
            $acc_bar.toggleClass('acc-bar-open');
        }
    });

    // SHOW SCROLL TO TOP BTN AFTER 100PX SCROLLED
    jQuery(window).scroll(function () {
        if (jQuery(document).scrollTop() > 300) {
            $scroll_top_btn.addClass('active');
        } else {
            $scroll_top_btn.removeClass('active');
        }
    });

    // ON CLICK SCROLL TO TOP
    $scroll_top_btn.on('click', function (e) {
        e.preventDefault();
        scrollToTop();
    });


    // SCROLL TO TOP
    function scrollToTop() {
        jQuery(window).scrollTop(0);
    }

    // REMOVE CLASSES WHEN SIDENAV IS CLOSED
    function sideNavClose() {
        $nav_toggle.removeClass('sidenav-open');
        $page.removeClass('sidenav-open');
        $sidenav.removeClass('sidenav-open');
        $html.removeClass('sidenav-open');
    }

    // REMOVE CLASSES WHEN SEARCH IS CLOSED
    function searchClose() {
        $search_btn.removeClass('search-open');
        $page.removeClass('search-open');
        $html.removeClass('search-open');
        $main_search.removeClass('search-open');
    }

    // ANIMATE ON SCROLL INIT
    // INIT AOS
    AOS.init({
        easing: 'ease-out',
    });
    // STAGGER AOS ANIMATIONS
    var delay = 0;
    jQuery('.aos-container > [data-aos]').each(function () {
        if (jQuery(this).is(":visible")) {
            delay = delay + 50;
            jQuery(this).attr('data-aos-delay', delay);
        }
    });



    // TOGGLE SUBNAV ON MOBILE
    var $subnav_header = jQuery('.subnav-header');

    $subnav_header.on('click', function (e) {
        e.preventDefault();
        var $closest_subnav_menu = jQuery(this).closest('.uu-subnav').find('.menu');
        var width = jQuery(window).width();
        if (width < 1024) {
            $closest_subnav_menu.toggleClass('open');
        }
    });

    // TOGGLE SUBNAV ON DESKTOP - NEW AS OF 5/7/2025 (BRIAN)
    jQuery('.uu-subnav .menu-item-has-children > a').on('click', function (e) {
        e.preventDefault();
        // console.log('Subnav menu item clicked:', this);
        var $menu_item = jQuery(this).closest('.menu-item-has-children');
        var $sub_menu = $menu_item.find('> .sub-menu');
        // console.log('Sub menu:', $sub_menu);
        $menu_item.toggleClass('open');
        $sub_menu.slideToggle();
    });

    // GET HEADER HIGHT & UPDATE CONTENT AREA TOP MARGIN
    function getHeaderHeight() {
        var $header = jQuery('#header');
        var $content = jQuery('#primary');
        var header_x = $header.outerHeight(false);
        if (jQuery('.page-template-page_with-subnav').length === 0) {
            $content.css({ 'margin-top': header_x });
        }

    };


    function setupSubMenu() {

        const sub_menus = document.querySelectorAll('.uu-header-nav .sub-menu');

        sub_menus.forEach((e, i) => {

            // Add title of parent link to the sub menu
            let e_parent = e.parentNode;
            let new_li = document.createElement('li');
            new_li.textContent = e_parent.querySelector('a').innerHTML;
            e.insertBefore(new_li, e.firstChild);

            // Create a new style to control position of pseudo elements
            let temp_style = document.head.appendChild(document.createElement('style'));
            let new_id = 'sub_menu_' + i;
            e.setAttribute('id', new_id);

            // Swap the drop position and adjust the position of the arrow
            e.style.display = 'grid';
            let e_bound = e.getBoundingClientRect();
            let e_parent_bound = e_parent.getBoundingClientRect();

            if (e_bound.x + e_bound.width > jQuery(window.innerWidth)[0]) {
                e.style.right = '-8px';
                temp_style.innerHTML = '.uu-header-nav #' + new_id + '.sub-menu::before { right: ' + ((e_parent_bound.width / 2) + 8) + 'px; transform: translateX(50%); }';
            }
            else {
                e.style.left = '-8px';
                temp_style.innerHTML = '.uu-header-nav #' + new_id + '.sub-menu::before { left: ' + ((e_parent_bound.width / 2) + 8) + 'px; transform: translateX(-50%); }';
            }
            
            e.style.display = 'none';
            
        });

    }

    setupSubMenu();

});
// END ON READY






