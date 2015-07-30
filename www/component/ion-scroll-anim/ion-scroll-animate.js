'use strict';
angular
    .module ('ion-scroll-anim', ['ionic'])
    .directive ('ionScrollAnim', function ($timeout) {
    return {
        restrict: 'A',
        compile : function ($scope, elem, attrs) {
            // window.stroll.bind ('.list .item');
            //angular.element ($window).bind ('scroll', function () {
            //    $scope.visible = false;
            //    $scope.$apply ();
            //});
        }
    }
})
