(function () {
  'use strict';

  angular
    .module('ion-photo')
    .directive('photoFilter', photoFilter);

  function photoFilter(config) {
    return {
      restrict: 'E',
      scope: {
        image: '='
      },
      templateUrl: config.path + '/view/photo.filter.html'
    };
  }
})();
