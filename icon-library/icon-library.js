jQuery(document).ready(function ($) {

    // global function for activating umc icons
    window.umcIconActivate = function () {

        const baseURL = '/wp-content/themes/umctheme3/icon-library/icons';

        $('.umc-icon').each(function () {

            let iconColor = '/duotone/';

            if ($(this).hasClass('white'))
                iconColor = '/white/';

            if ($(this).hasClass('black'))
                iconColor = '/black/';

            let icon = $(this).data('icon');

            $(this).append('<img src="' + baseURL + iconColor + icon + '_icon.svg" alt="icon">');

        });

    };

    setTimeout(function () {
        umcIconActivate();
    }, 0);
});