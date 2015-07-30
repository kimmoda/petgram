'use strict';
angular
    .module ('module.card')
    .directive ('noScroll', function ($document) {
    return {
        restrict: 'A',
        link    : function ($scope, $element, $attr) {
            $document.on ('touchmove', function (e) {
                e.preventDefault ();
            });
        }
    }
})



