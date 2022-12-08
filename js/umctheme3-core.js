// ON READY
jQuery(document).ready( function() {

  // VARS
  var $site_url = document.location.href;

  var $html = jQuery('html');
  var $page = jQuery('#page');
  var $content = jQuery('#primary');
  var $alert_bar = jQuery('.uu-alert-bar');
  var $acc_bar = jQuery('#uu-acc-bar');
  var $sidenav = jQuery('#sidenav');

  var $nav_toggle = jQuery('#sidenav_toggle_btn');
  var $mobile_nav_toggle = jQuery('#mobile_sidenav_toggle_btn');

  var $search_btn = jQuery('.search-btn');
  var $main_search = jQuery('#main_search');
  var $main_search_form = jQuery('#site_search');
  var $search_input = jQuery('#site_search_input');
  var $search_checkbox = jQuery('#search_campus_checkbox');

  var $parent_menu_item = jQuery('.sidenav-menu li.menu-item-has-children > a');
  var $scroll_top_btn = jQuery('#back-to-top-btn');
  var interval = setInterval(checkInterval, 500); // Set interval to every half second

  // SITEORIGIN(SO) RESET/RESIZE
  fullContainer = jQuery( '.site' );

  getHeaderHeight();

  // SIDENAV TOGGLE
  $nav_toggle.on('click', function() {
    jQuery(this).toggleClass('sidenav-open');
    $page.toggleClass('sidenav-open').removeClass('search-open');
    $sidenav.toggleClass('sidenav-open');
    $html.toggleClass('sidenav-open').removeClass('search-open');
    $main_search.removeClass('search-open');
    $search_btn.removeClass('search-open');
  });

  $parent_menu_item.on('click', function(e) {
    e.preventDefault();
    jQuery(this).closest('.menu-item-has-children').toggleClass('nav-open');
    jQuery(this).closest('.menu-item-has-children').find('> .sub-menu').slideToggle();
  });

  // MOBILE NAV TOGGLE
  $mobile_nav_toggle.on('click', function(){
    sideNavClose();
  })

  // SEARCH BAR
  $search_btn.on('click', function(e) {
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
        $page.on('click', function() {
          sideNavClose();
        });
      // CLOSE SEARCH ON PAGE CLICK
      } else if ($page.hasClass('search-open')) {
        $page.on('click', function() {
          searchClose();
        });
      } else {
        $page.off();
      }
  };

  // CHECK CAMPUS SEARCH CHECKBOX
  $search_checkbox.on('click', function(e) {
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
  jQuery(document).keyup(function(e) {
     if(e.altKey && e.keyCode == 191){
       console.log('Accessibilty Bar Toggled');
       $html.toggleClass('acc-bar-open');
       $acc_bar.toggleClass('acc-bar-open');
       getHeaderHeight();
     }
   });

  // SHOW SCROLL TO TOP BTN AFTER 100PX SCROLLED
  jQuery(window).scroll(function() {
    if (jQuery(document).scrollTop() > 300) {
      $scroll_top_btn.addClass('active');
    } else {
      $scroll_top_btn.removeClass('active');
    }
  });

  // ON CLICK SCROLL TO TOP
  $scroll_top_btn.on('click', function(e) {
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


  // GET HEADER HIGHT & UPDATE CONTENT AREA TOP MARGIN
  function getHeaderHeight() {
    var $header = jQuery('#header');
    var $content = jQuery('#primary');
    var header_x = $header.outerHeight(false);

    $content.css({'margin-top': header_x});
  };

});
// END ON READY





