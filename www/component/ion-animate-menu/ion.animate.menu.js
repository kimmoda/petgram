'use strict';
angular.module ('ionic.animate.menu', ['ionic'])
    .directive ('animatedMenu', function ($timeout, $ionicSideMenuDelegate) {
    return {
        restrict: 'A',
        replace : false,
        link    : function ($scope, $element, $attr) {
            // Run in the next scope digest
            $timeout (function () {
                // Watch for changes to the openRatio which is a value between 0 and 1 that says how "open" the side menu is

                $scope.$watch (function () {
                        return $ionicSideMenuDelegate.getOpenRatio ();
                    },
                    function (ratio) {
                        $element[0].style.webkitTransform = "translateX(" + (Number (ratio) ) + "px)";
                    });
            });
        }
    }
});