'use strict';
angular
    .module ('ion-form')
    .directive ('ionAutoFocus',
    function ($timeout) {
        return {
            restrict: 'A',
            link    : function ($scope, $element) {
                $timeout (function () {
                    $element[0].focus ();
                }, 1000);
            }
        };
    });