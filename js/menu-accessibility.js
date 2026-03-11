(function () {
    'use strict';

    /**
     * Lightweight polyfills to support older browsers that still appear in some campus environments.
     * WordPress core ships similar fallbacks, but we add them locally to avoid ordering issues.
     */
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
        Element.prototype.closest = function (selector) {
            var element = this;
            while (element && element.nodeType === 1) {
                if (element.matches(selector)) {
                    return element;
                }
                element = element.parentElement || element.parentNode;
            }
            return null;
        };
    }

    document.addEventListener('DOMContentLoaded', function () {
        var navigation = document.getElementById('site-navigation');
        var sideNav = document.getElementById('sidenav');
        var sideNavToggle = document.getElementById('sidenav_toggle_btn');
        var pageWrapper = document.getElementById('page');
        var htmlElement = document.documentElement;
        var searchToggle = document.querySelector('.search-btn');
        var mainSearch = document.getElementById('main_search');

        /**
         * Primary navigation focus handling (desktop mega menu).
         * Adds/removes a `.focus` class so CSS can present sub-menus while keyboard tabbing.
         */
        if (navigation) {
            var menu = navigation.querySelector('ul');

            if (menu) {
                setupPrimaryMenu(navigation);
            }
        }

        /**
         * Side navigation focus handling (hamburger / drawer menu).
         * Opens the drawer when focus enters and closes it once focus leaves or Esc is pressed.
         */
        if (sideNav && pageWrapper && htmlElement) {
            setupSideNavAccessibility();
        }

        /**
         * Initialise keyboard support for the primary navigation.
         *
         * @param {HTMLElement} navElement
         */
        function setupPrimaryMenu(navElement) {
            var FOCUS_CLASS = 'focus';

            initialiseAriaStates();

            navElement.addEventListener('focusin', function (event) {
                var link = event.target.closest('a');

                if (!link || !navElement.contains(link)) {
                    return;
                }

                var menuItem = link.closest('li');

                if (!menuItem) {
                    return;
                }

                setFocusState(menuItem);
            });

            navElement.addEventListener('focusout', function (event) {
                var nextElement = event.relatedTarget;

                if (!nextElement || !navElement.contains(nextElement)) {
                    clearAllFocus();
                }
            });

            navElement.addEventListener('keydown', function (event) {
                if (event.key === 'Escape' || event.key === 'Esc') {
                    clearAllFocus();
                }
            });

            function setFocusState(menuItem) {
                removeSiblingFocus(menuItem);
                addFocusToAncestors(menuItem);
                syncAriaExpanded();
            }

            function removeSiblingFocus(menuItem) {
                var parentList = menuItem.parentElement;

                if (!parentList) {
                    return;
                }

                Array.prototype.forEach.call(parentList.children, function (sibling) {
                    if (sibling !== menuItem) {
                        removeFocusRecursive(sibling);
                    }
                });
            }

            function addFocusToAncestors(menuItem) {
                var current = menuItem;

                while (current && current !== navElement) {
                    if (current.tagName && current.tagName.toLowerCase() === 'li') {
                        current.classList.add(FOCUS_CLASS);
                    }

                    current = current.parentElement;

                    if (current && current.tagName && current.tagName.toLowerCase() === 'ul') {
                        current = current.parentElement;
                    }
                }
            }

            function removeFocusRecursive(element) {
                element.classList.remove(FOCUS_CLASS);

                var descendants = element.querySelectorAll('.' + FOCUS_CLASS);

                Array.prototype.forEach.call(descendants, function (descendant) {
                    descendant.classList.remove(FOCUS_CLASS);
                });
            }

            function clearAllFocus() {
                var focusedItems = navElement.querySelectorAll('.' + FOCUS_CLASS);

                Array.prototype.forEach.call(focusedItems, function (item) {
                    item.classList.remove(FOCUS_CLASS);
                });

                syncAriaExpanded();
            }

            function initialiseAriaStates() {
                var toggleLinks = navElement.querySelectorAll('.menu-item-has-children > a, .page_item_has_children > a');

                Array.prototype.forEach.call(toggleLinks, function (link) {
                    if (!link.hasAttribute('aria-expanded')) {
                        link.setAttribute('aria-expanded', 'false');
                    }
                });
            }

            function syncAriaExpanded() {
                var parentItems = navElement.querySelectorAll('.menu-item-has-children, .page_item_has_children');

                Array.prototype.forEach.call(parentItems, function (item) {
                    var trigger = item.querySelector('a');

                    if (!trigger) {
                        return;
                    }

                    if (item.classList.contains(FOCUS_CLASS)) {
                        trigger.setAttribute('aria-expanded', 'true');
                    } else {
                        trigger.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        }

        /**
         * Attach focus management to the sidenav drawer.
         */
        function setupSideNavAccessibility() {
            sideNav.addEventListener('focusin', function () {
                openSideNav();
            });

            sideNav.addEventListener('focusout', function (event) {
                var next = event.relatedTarget;

                if (!next || !sideNav.contains(next)) {
                    closeSideNav();
                }
            });

            sideNav.addEventListener('keydown', function (event) {
                if (event.key === 'Escape' || event.key === 'Esc') {
                    closeSideNav();

                    if (sideNavToggle) {
                        sideNavToggle.focus();
                    }
                }
            });
        }

        function openSideNav() {
            if (pageWrapper.classList.contains('sidenav-open')) {
                return;
            }

            if (searchToggle) {
                searchToggle.classList.remove('search-open');
            }

            if (mainSearch) {
                mainSearch.classList.remove('search-open');
            }

            pageWrapper.classList.remove('search-open');
            htmlElement.classList.remove('search-open');

            pageWrapper.classList.add('sidenav-open');
            htmlElement.classList.add('sidenav-open');
            sideNav.classList.add('sidenav-open');

            if (sideNavToggle) {
                sideNavToggle.classList.add('sidenav-open');
            }
        }

        function closeSideNav() {
            pageWrapper.classList.remove('sidenav-open');
            htmlElement.classList.remove('sidenav-open');

            if (sideNav) {
                sideNav.classList.remove('sidenav-open');
            }

            if (sideNavToggle) {
                sideNavToggle.classList.remove('sidenav-open');
            }
        }
    });
}());

