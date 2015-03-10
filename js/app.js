
/*globals jQuery: false, $: false, window: false */

(function($, undefined) {

    var $window = $(window),
        $html = $('html');

    // iPhone scroll handler
    // ---------------------
    //
    // Handles applying a `scroll` class to the first and
    // last section depending on where the page is scrolled
    // to, in order to make it scroll or stay fixed.
    //
    (function() {
        var $sections = $('.phone-section'),
            $firstSection = $sections.first(),
            $lastSection = $sections.last(),
            scrollClass = 'scroll',
            resized = true,
            scrollTriggerYMin = 0,
            scrollTriggerYMax = 0,
            scrollTriggeredMin = null,
            scrollTriggeredMax = null;

        // use an indirect approach to updating the trigger positions
        // this way we don't over do it with event handlers
        $window.on('resize load orientationchange', function() {
            resized = true;
        });
        $('.ringly-item img').on('load', function() {
            resized = true;
        });

        // when page size changes, recalculate trigger point for scroll change
        function updateYTriggers() {
            if (resized) {
                resized = false;

                // notify others of potential page changes
                $window.trigger('updated-y-position');

                // delay in case the above trigger causes other page
                // changes!
                window.setTimeout(function() {
                    scrollTriggerYMax = $lastSection.offset().top;
                    scrollTriggerYMin = $firstSection.offset().top;
                    $window.trigger('scroll');
                }, 1);
            }
        }

        updateYTriggers();
        window.setInterval(updateYTriggers, 200);

        // when page has scrolled see if we hit the scroll target
        $window.on('scroll', function() {
            var updateMin = false,
                updateMax = false,
                scrollY = $window.scrollTop();

            // var _data = {
            //     scrollY: scrollY,
            //     scrollTriggerYMin: scrollTriggerYMin,
            //     scrollTriggerYMax: scrollTriggerYMax,
            //     wasTriggeredMax: scrollTriggeredMax,
            //     wasTriggeredMix: scrollTriggeredMin
            // };

            if (scrollY >= scrollTriggerYMax) {
                if (scrollTriggeredMax !== true) {
                    updateMax = true;
                    scrollTriggeredMax = true;
                }
            } else {
                if (scrollTriggeredMax !== false) {
                    updateMax = true;
                    scrollTriggeredMax = false;
                }
            }

            if (updateMax) {
                $lastSection.toggleClass(scrollClass, scrollTriggeredMax);
            }

            if (scrollY <= scrollTriggerYMin) {
                if (scrollTriggeredMin !== true) {
                    updateMin = true;
                    scrollTriggeredMin = true;
                }
            } else {
                if (scrollTriggeredMin !== false) {
                    updateMin = true;
                    scrollTriggeredMin = false;
                }
            }

            if (updateMin) {
                $firstSection.toggleClass(scrollClass, scrollTriggeredMin);
            }

            // _data.updateMax = updateMax;
            // _data.updateMin = updateMin;
            // window._data = _data;

        }).trigger('scroll');

    })();

    // Back to top
    // -----------
    //
    $('.back-top').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 2000);
    });


    // Flex slider - home section
    // --------------------------
    //
    $('.flexslider').flexslider({
        animation: 'fade',
        controlNav: true,
        directionNav: false,
        prevText: '',
        nextText: ''
    });


    // Vertically aligned text & section heights
    // -----------------------------------------
    //
    $window.on('updated-y-position', function() {
        var $phoneSections = $('.phone-section');

        // set section heights - since ios has a 100vh bug
        if (!$html.hasClass('touch')) {
            var h = $window.height();
            $phoneSections
                .add('.phone-section .container')
                .css('min-height', h);
        }

        // vertical align text in each section
        $phoneSections.each(function() {
            var $this = $(this).find('.container'),
                $appText = $this.find('.app-text'),
                height = $this.height(),
                appHeight = $appText.height(),
                paddingTop = parseInt((height - appHeight) / 2);

            if (paddingTop < 48) {
                paddingTop = 48;
            }

            $appText.css('padding-top', paddingTop).addClass('ready');
        });

    });

    // Notifications
    // -------------
    //
    // Side scroll the notifications
    //
    (function() {
        var scrollDelay = 4000,
            $wrapper = $('#notification'),
            $ul = $wrapper.children('ul');

        (function scrollNext() {
            var $slides = $ul.children('li'),
                $firstSlide = $slides.first(),
                height = $firstSlide.outerHeight();

            $slides.removeClass('first');
            $($slides.get(1)).addClass('first');

            $ul.animate({
                top: -height
            }, 1000, function() {
                $firstSlide.detach().appendTo($ul);
                $ul.css('top', 0);
            });

            window.setTimeout(scrollNext, scrollDelay);
        })();
    })();


    // Defer video load
    // ----------------
    //
    // Grab data-* attrs and turn those into attrs of an iframe
    //
    $window.load(function() {
        var $vp = $('.video-placeholder');
        $('<iframe>', $vp.data()).replaceAll($vp).hide().fadeIn(2000);
    });

    // Defer classes
    // -------------
    //
    // Allows functionality to be deferred until window.load, e.g.,
    // background images that are associated with classes
    //
    $window.load(function() {
        $('[data-deferclass]').each(function() {
            var $this = $(this),
                className = $this.data('deferclass');
            $this.addClass(className);
        });
    });


})(jQuery);



// iOS click/touch events
// ----------------------
//
// Touch events will not trigger click for :hover styled
// events in iOS
//
// $('button, input[type=submit], a.ringly-item').on('touchend', function() {
//     $(this).click();
// });

// // Pre-load images
// // ---------------
// //
// // //TODO - verify this helps
// $('.app-screen').each(function() {
//     var image = $(this).css('background-image').match(/\s*url\((.*)\)\s*/)[1];
//     (new Image).src = image;
// });
