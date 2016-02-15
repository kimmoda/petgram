(function () {
  'use strict';

  angular
    .module('ion-photo')
    .directive('photoFilterCarousel', photoFilterCarousel);

  function photoFilterCarousel(CamanJs, config) {
    return {
      restrict: 'E',
      scope: {
        image: '=',
        loadingMaster: '='
      },
      templateUrl: config.path + '/view/photo.filter.carousel.html',
      link: function ($scope) {
        $scope.filters = CamanJs.filters;
        $scope.applyFilter = applyFilter;

        function applyFilter(elem, effect) {
          $scope.loading = true;
          if (effect) {
            CamanJs
              .effect(elem, effect, true)
              .then(function (resp) {
                $scope.loading = false;
              });
          }
        }
      }
    };
  }

})();
