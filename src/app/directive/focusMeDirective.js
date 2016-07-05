(function () {
    'use strict';
    angular.module('starter').directive('focusMe', focusMeDirective);

    function focusMeDirective() {
        return {
            restrict: 'A',
            link    : function (scope, element, attrs) {
                function focus() {
                    element[0].focus();
                    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                        cordova.plugins.Keyboard.show(); //open keyboard manually
                    }
                };
                scope.$on('viewLoaded', function () {
                    console.log('View is loaded.');
                    focus();
                });
            }
        };
    }

})();
