(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .directive('galleryLoading', galleryLoading);

  function galleryLoading() {
    return {
      restrict: 'E',
      scope: {
        loading: '=',
        icon: '@'
      },
      template: '<div class="padding text-center loading" ng-show="loading"><ion-spinner icon="{{ icon }}"></ion-spinner></div>'
    }
  }
})(window, window.angular);
