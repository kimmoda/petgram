(function() {
    'use strict';

    angular
        .module('ion-photo')
        .directive('photoFilter', photoFilter);

    function photoFilter() {
        return {
            restrict: 'E',
            scope: {
                image: '='
            },
            transclude: true,
            template: '<div class="capture-photo"> <div caman filter="\'normal\'" class="image" ng-class="{disabled: loading}" name="image" image="image"></div>  <ion-spinner ng-show="loading"></ion-spinner></div><photo-filter-carousel image="image" loading="loading"></photo-filter-carousel>'
        };
    }
})();