(function() {
    'use strict';

    angular
        .module('ion-photo')
        .directive('photoFilterCarousel', photoFilterCarousel);

    function photoFilterCarousel(CamanJs) {
        return {
            restrict: 'E',
            scope: {
                image: '=',
                loading: '='
            },
            template: '<div class="wide-as-needed"> <a ng-repeat="filter in filters" ng-click="applyFilter(\'image\', filter)" > <div class="image" caman ng-class="{disabled: loading}" loading="loading" filter="filter" image="image" name="image{{ $index }}"></div> <ion-spinner ng-if="loading" ></ion-spinner>  <p>{{ filter }}</p> </a> </div>',
            link: function ($scope, elem) {
                $scope.filters = CamanJs.filters;
                $scope.applyFilter = applyFilter;

                function applyFilter(elem, effect) {
                    $scope.loading = true;
                    CamanJs
                        .effect(elem, effect, true)
                        .then(function (resp) {
                            $scope.loading = false;
                            console.log(resp);
                        });
                }
            }
        };
    }

})();