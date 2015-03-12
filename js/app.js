
/*globals jQuery: false, $: false, window: false */

(function($, undefined) {

    var $window = $(window),
        $html = $('html');

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
